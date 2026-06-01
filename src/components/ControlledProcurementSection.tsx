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
  { id: 'trucking',            type: 'task',      name: 'Trucking',                  duration: 8  },
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

const LABEL_COL_PX  = 240;
const ROW_HEIGHT_PX = 32;
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

// ============================================================================
// SECTION
// ============================================================================

export default function ControlledProcurementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
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

  // rAF loop that ticks elapsed up to TOTAL_ANIM_MS once startMs is set.
  useEffect(() => {
    if (startMs === null) return;
    let raf = 0;
    let cancelled = false;
    const step = (now: number) => {
      if (cancelled) return;
      const e = now - startMs;
      setElapsed(Math.min(e, TOTAL_ANIM_MS));
      if (e < TOTAL_ANIM_MS) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); };
  }, [startMs]);

  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header copy */}
        <div className="max-w-3xl mb-12">
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
          className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header strip */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-y-1 text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500">
            <span>Detailed Procurement Schedule</span>
            <span className="text-slate-400">
              {TOTAL_DAYS} working days · {formatDate(workingDayToDate(1))}{' '}→{' '}
              {formatDate(workingDayToDate(TOTAL_DAYS))}
            </span>
          </div>

          {/* Rows */}
          <div>
            {ITEMS.map((item, i) => (
              <Row key={item.id} item={item} index={i} elapsed={elapsed} />
            ))}
          </div>

          {/* Date axis */}
          <DateAxis />
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

  // Subtly alternate row backgrounds for readability across 15 rows
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50';

  return (
    <div
      className={`flex items-center border-b border-slate-100 ${rowBg}`}
      style={{ height: ROW_HEIGHT_PX }}
    >
      {/* Label */}
      <div
        className="flex-shrink-0 pr-3 text-right text-xs font-medium text-slate-700 overflow-hidden whitespace-nowrap"
        style={{ width: LABEL_COL_PX, opacity: localT }}
      >
        {item.name}
      </div>

      {/* Bar area */}
      <div className="flex-1 relative h-full">
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
      <div className="flex-shrink-0" style={{ width: LABEL_COL_PX }} />
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
