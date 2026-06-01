import { useState, useEffect, useRef } from 'react';

// ============================================================================
// SCHEDULE DATA — 15 line items in strict sequential order
// ============================================================================

type ItemType = 'task' | 'milestone';

interface RawItem {
  id: string;
  type: ItemType;
  name: string;
  duration: number; // working days; 0 for milestones
}

const ITEMS_RAW: RawItem[] = [
  { id: 'buyout',              type: 'task',      name: 'Buyout',                    duration: 25 },
  { id: 'submittal-coord',     type: 'task',      name: 'Submittal Coordination',    duration: 30 },
  { id: 'design-complete',     type: 'milestone', name: 'Design Complete',           duration: 0  },
  { id: 'submittal-prep',      type: 'task',      name: 'Submittal Preparation',     duration: 30 },
  { id: 'selections-final',    type: 'milestone', name: 'Selections Finalized',      duration: 0  },
  { id: 'review-r1',           type: 'task',      name: 'Submittal Review, Round 1', duration: 15 },
  { id: 'vendor-rev-r1',       type: 'task',      name: 'Vendor Revisions',          duration: 12 },
  { id: 'review-r2',           type: 'task',      name: 'Round 2, Submittal Review', duration: 10 },
  { id: 'vendor-rev-r2',       type: 'task',      name: 'Round 2, Vendor Revisions', duration: 5  },
  { id: 'final-review',        type: 'task',      name: 'Final Review',              duration: 5  },
  { id: 'approved-submittal',  type: 'milestone', name: 'Approved Submittal',        duration: 0  },
  { id: 'fab-starts',          type: 'milestone', name: 'Fabrication Starts',        duration: 0  },
  { id: 'fabrication',         type: 'task',      name: 'Fabrication',               duration: 90 },
  { id: 'trucking',            type: 'task',      name: 'Shipping',                  duration: 8  },
  { id: 'onsite-date',         type: 'milestone', name: 'Required Onsite Date',      duration: 0  },
];

interface ComputedItem extends RawItem {
  startDay: number; // first working day (inclusive); for milestones, same as endDay
  endDay:   number; // last  working day (inclusive); for milestones, the boundary day
}

function computeSchedule(items: RawItem[]): ComputedItem[] {
  let day = 1; // next available working day for a task
  return items.map(item => {
    if (item.type === 'milestone') {
      // Milestone sits at the boundary day = end of the most-recent task
      // (or day 1 if nothing has run yet).
      const at = Math.max(1, day - 1);
      return { ...item, startDay: at, endDay: at };
    }
    const start = day;
    const end = day + item.duration - 1;
    day = end + 1;
    return { ...item, startDay: start, endDay: end };
  });
}

const ITEMS = computeSchedule(ITEMS_RAW);

// ============================================================================
// CHART + DATE CONSTANTS
// ============================================================================

const TOTAL_DAYS = 230;
const CHART_DAYS = 240; // small right margin past day 230 so the axis breathes

const PROJECT_START = new Date('2025-04-01T00:00:00'); // Tue Apr 1, 2025

/** Convert a working-day number (1-based) to a calendar Date by walking forward
 *  and skipping weekends. */
function workingDayToDate(workingDay: number): Date {
  const d = new Date(PROJECT_START);
  let toAdd = workingDay - 1;
  while (toAdd > 0) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) toAdd--;
  }
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Axis ticks: every 30 working days, plus the project endpoint. */
const AXIS_TICKS = [1, 30, 60, 90, 120, 150, 180, 210, 230];

// ============================================================================
// LAYOUT
// ============================================================================

// Row label column width and row height are now expressed as Tailwind responsive
// classes (`w-[150px] md:w-[240px]`, `h-10 md:h-8`) so the mobile chart can shrink
// the label gutter and give labels a second line if needed. The mobile label width
// is mirrored as a JS constant (MOBILE_LABEL_W) for the auto-scroll math.
const AXIS_HEIGHT_PX = 56;

/** Day → percentage across the bar area (0..100). Day 1 starts at 0%. */
function dayStartPct(day: number): number {
  return ((day - 1) / CHART_DAYS) * 100;
}
/** End boundary of a working day (day N ends at N / CHART_DAYS). */
function dayEndPct(day: number): number {
  return (day / CHART_DAYS) * 100;
}
function widthPct(days: number): number {
  return (days / CHART_DAYS) * 100;
}

// ============================================================================
// ANIMATION
// ============================================================================

const ROW_STAGGER_MS = 400; // gap between successive row starts
const ROW_FADE_MS    = 500; // each row's fade/draw-in duration
const TOTAL_ANIM_MS  = (ITEMS.length - 1) * ROW_STAGGER_MS + ROW_FADE_MS;

// Mobile: chart is forced wider than the viewport so the date axis breathes; rows are
// horizontally pannable. MUST stay in sync with the Tailwind w-[150px] / min-w-[900px]
// classes on the row labels and the scroll wrapper's inner div — the JS auto-scroll
// math reads them as plain numbers.
const MOBILE_LABEL_W = 150;

/** Right-most "drawn-to" day at this elapsed time — the leading edge that the mobile
 *  auto-scroll follows. Items are in calendar order so the most-recently-started row
 *  always dominates; we still scan all to keep the function robust if that changes. */
function leadingDayAt(elapsed: number): number {
  let max = 0;
  for (let i = 0; i < ITEMS.length; i++) {
    const rowStart = i * ROW_STAGGER_MS;
    if (elapsed < rowStart) break;
    const t = Math.min(1, (elapsed - rowStart) / ROW_FADE_MS);
    const item = ITEMS[i];
    const day = item.type === 'milestone'
      ? item.endDay
      : (item.startDay - 1) + item.duration * t;
    if (day > max) max = day;
  }
  return max;
}

// ============================================================================
// SECTION
// ============================================================================

export default function ControlledProcurementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const userInteractedRef = useRef(false);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Trigger animation on first scroll-into-view, then disconnect.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        setStartMs(performance.now());
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // First touch / pointer / wheel inside the scroll wrapper releases auto-scroll —
  // we never fight the user's finger.
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const onInteract = () => { userInteractedRef.current = true; };
    sc.addEventListener('touchstart', onInteract, { passive: true });
    sc.addEventListener('pointerdown', onInteract, { passive: true });
    sc.addEventListener('wheel',       onInteract, { passive: true });
    return () => {
      sc.removeEventListener('touchstart', onInteract);
      sc.removeEventListener('pointerdown', onInteract);
      sc.removeEventListener('wheel',       onInteract);
    };
  }, []);

  // rAF loop: ticks elapsed up to TOTAL_ANIM_MS. On mobile (only when the inner chart
  // is wider than the visible viewport) it also follows the leading edge horizontally
  // so the row currently being drawn stays in view.
  useEffect(() => {
    if (startMs === null) return;
    let raf = 0;
    let cancelled = false;
    const step = (now: number) => {
      if (cancelled) return;
      const e = now - startMs;
      setElapsed(Math.min(e, TOTAL_ANIM_MS));

      const sc = scrollRef.current;
      if (sc && !userInteractedRef.current && sc.scrollWidth > sc.clientWidth) {
        const sw = sc.scrollWidth;
        const cw = sc.clientWidth;
        const barAreaW = sw - MOBILE_LABEL_W;
        const leadX = MOBILE_LABEL_W + (leadingDayAt(e) / CHART_DAYS) * barAreaW;
        // Keep the leading edge at ~75% across the viewport so the just-drawn portion
        // is visible and there's a small buffer of what's coming.
        const target = leadX - cw * 0.75;
        sc.scrollLeft = Math.max(0, Math.min(target, sw - cw));
      }

      if (e < TOTAL_ANIM_MS) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); };
  }, [startMs]);

  const complete = elapsed >= TOTAL_ANIM_MS;

  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header copy */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
            What Controlled Procurement Looks Like
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Most schedules collapse procurement into 1–2 bars. A real plan accounts for every
            step — constraints that prevent forward movement, multiple submittal rounds, vendor
            revisions, and real, defensible durations for everything.
          </p>
        </div>

        {/* Gantt card */}
        <div
          ref={containerRef}
          className="relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header strip — pinned at viewport width; doesn't scroll horizontally */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-y-1 text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500">
            <span>Detailed Procurement Schedule</span>
            <span className="text-slate-400">
              {TOTAL_DAYS} working days · {formatDate(workingDayToDate(1))}{' '}→{' '}
              {formatDate(workingDayToDate(TOTAL_DAYS))}
            </span>
          </div>

          {/* Horizontally scrollable area. The inner div is forced to min-w-[900px] on
              mobile so the chart overflows and pans; on md+ min-w-0 lets it fit the
              container exactly (no scroll, no layout change from before). */}
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="min-w-[900px] md:min-w-0">
              {/* Rows */}
              <div>
                {ITEMS.map((item, i) => (
                  <Row key={item.id} item={item} index={i} elapsed={elapsed} />
                ))}
              </div>

              {/* Date axis */}
              <DateAxis />
            </div>
          </div>

          {/* Right-edge scroll affordance — mobile only; fades in once the build
              completes so it doesn't compete with the auto-scroll animation. */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden"
            style={{ opacity: complete ? 1 : 0, transition: 'opacity 400ms' }}
          />
        </div>

        {/* Legend below chart */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
          <LegendItem swatch={<span className="inline-block w-4 h-2.5 rounded-sm bg-amber-500/75 border border-amber-700" />}>
            Task (working days)
          </LegendItem>
          <LegendItem swatch={
            <span
              className="inline-block w-2.5 h-2.5 bg-slate-700"
              style={{ transform: 'rotate(45deg)' }}
            />
          }>
            Milestone
          </LegendItem>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ROW
// ============================================================================

function Row({ item, index, elapsed }: { item: ComputedItem; index: number; elapsed: number }) {
  const rowStartMs = index * ROW_STAGGER_MS;
  const localT = Math.max(0, Math.min(1, (elapsed - rowStartMs) / ROW_FADE_MS));

  // Solid (no alpha) alternation so the sticky mobile label fully occludes bars
  // sliding behind it during horizontal scroll.
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50';

  return (
    <div className={`flex items-stretch border-b border-slate-100 h-10 md:h-8 ${rowBg}`}>
      {/* Label — sticky on mobile so it stays visible while the bar area pans */}
      <div
        className={`sticky left-0 z-10 flex-shrink-0 flex items-center justify-end pr-3 w-[150px] md:w-[240px] border-r border-slate-100 md:border-r-0 ${rowBg}`}
        style={{ opacity: localT }}
      >
        <span className="text-right text-[10px] md:text-xs font-medium text-slate-700 leading-tight whitespace-normal md:whitespace-nowrap">
          {item.name}
        </span>
      </div>

      {/* Bar area */}
      <div className="flex-1 relative">
        {item.type === 'task'
          ? <TaskBar item={item} progress={localT} />
          : <MilestoneMark item={item} opacity={localT} />
        }
      </div>
    </div>
  );
}

// ============================================================================
// BAR + MILESTONE
// ============================================================================

function TaskBar({ item, progress }: { item: ComputedItem; progress: number }) {
  if (progress <= 0) return null;
  const left = dayStartPct(item.startDay);
  const fullWidth = widthPct(item.duration);
  const drawnWidth = fullWidth * progress; // "wipes" left → right as it draws in

  return (
    <div
      className="absolute rounded-sm flex items-center px-1.5 overflow-hidden"
      style={{
        left: `${left}%`,
        width: `${drawnWidth}%`,
        top: '20%',
        height: '60%',
        background: 'rgba(245, 158, 11, 0.78)',  // amber-500 fill
        border: '1px solid rgba(180, 83, 9, 1)', // amber-700 border
      }}
    >
      {item.duration >= 8 && progress > 0.6 && (
        <span className="text-[9px] font-semibold tracking-wide text-white/95 whitespace-nowrap">
          {item.duration}d
        </span>
      )}
    </div>
  );
}

function MilestoneMark({ item, opacity }: { item: ComputedItem; opacity: number }) {
  if (opacity <= 0.001) return null;
  // Milestone sits at the boundary day = the right edge of the most-recent task.
  const xPct = dayEndPct(item.endDay);

  return (
    <div
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: 11,
        height: 11,
        background: 'rgb(51, 65, 85)',          // slate-700
        border: '1.5px solid rgb(15, 23, 42)',  // slate-900
        opacity,
      }}
      aria-label={item.name}
    />
  );
}

// ============================================================================
// DATE AXIS
// ============================================================================

function DateAxis() {
  return (
    <div className="flex border-t border-slate-200 bg-slate-50">
      <div className="sticky left-0 z-10 flex-shrink-0 bg-slate-50 border-r border-slate-100 md:border-r-0 w-[150px] md:w-[240px]" />
      <div className="flex-1 relative" style={{ height: AXIS_HEIGHT_PX }}>
        {/* Axis baseline */}
        <div className="absolute left-0 right-0 h-px bg-slate-300" style={{ top: 0 }} />
        {AXIS_TICKS.map(d => {
          const xPct = dayStartPct(d); // align tick with the START of that working day
          return (
            <div
              key={d}
              className="absolute"
              style={{ left: `${xPct}%`, top: 0 }}
            >
              <div className="w-px h-2 bg-slate-400" />
              <div className="text-[10px] font-semibold text-slate-600 mt-1 -translate-x-1/2 whitespace-nowrap leading-tight">
                Day {d}
              </div>
              <div className="text-[10px] text-slate-400 -translate-x-1/2 whitespace-nowrap leading-tight">
                {formatDate(workingDayToDate(d))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// LEGEND ITEM
// ============================================================================

function LegendItem({ swatch, children }: { swatch: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      {swatch}
      <span>{children}</span>
    </span>
  );
}
