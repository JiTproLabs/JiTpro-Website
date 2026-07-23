import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';
import JiTproWordmark from '../components/JiTproWordmark';
import TimelineShow from '../components/timeline/TimelineShow';
import {
  AXIS_START,
  AXIS_END,
  happyPath,
  whatReallyHappens,
  whatShouldHappen,
  type TimelineSchedule,
  type TimelineTask,
} from '../content/timelineData';
import { timelineNotes } from '../content/timelineNotes';

// ─── date math ──────────────────────────────────────────────────────────────
function days(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
const AXIS_DAYS = days(AXIS_START, AXIS_END);

function pct(d: string): number {
  return (days(AXIS_START, d) / AXIS_DAYS) * 100;
}

function fmtShort(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── time axis labels (monthly) ─────────────────────────────────────────────
const MONTHS: { date: string; label: string }[] = [
  { date: '2026-04-01', label: 'Apr 26' },
  { date: '2026-05-01', label: 'May' },
  { date: '2026-06-01', label: 'Jun' },
  { date: '2026-07-01', label: 'Jul' },
  { date: '2026-08-01', label: 'Aug' },
  { date: '2026-09-01', label: 'Sep' },
  { date: '2026-10-01', label: 'Oct' },
  { date: '2026-11-01', label: 'Nov' },
  { date: '2026-12-01', label: 'Dec' },
  { date: '2027-01-01', label: 'Jan 27' },
  { date: '2027-02-01', label: 'Feb' },
];

// Grid template — label, duration, bar track
const GRID_COLS = '24rem 4rem 1fr';

// ─── bar/milestone row components ───────────────────────────────────────────
type AccentColor = 'cyan' | 'red' | 'amber';

function colorForBar(c: AccentColor) {
  switch (c) {
    case 'cyan':
      return 'bg-cyan-500/70 border-cyan-400/60 hover:bg-cyan-400/90';
    case 'red':
      return 'bg-red-500/70 border-red-400/60 hover:bg-red-400/90';
    case 'amber':
      return 'bg-amber-500/80 border-amber-400/60 hover:bg-amber-400/95';
  }
}

function colorForMilestone(c: AccentColor) {
  switch (c) {
    case 'cyan':
      return { bg: 'bg-cyan-400', border: 'border-cyan-200', text: 'text-cyan-300' };
    case 'red':
      return { bg: 'bg-red-500', border: 'border-red-300', text: 'text-red-400' };
    case 'amber':
      return { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-500' };
  }
}

interface RowProps {
  task: TimelineTask;
  color: AccentColor;
  onHover: (uid: number, el: HTMLElement) => void;
  onLeave: () => void;
}

function TaskRow({ task, color, onHover, onLeave }: RowProps) {
  if (task.isMilestone) {
    const c = colorForMilestone(color);
    const left = pct(task.start);
    return (
      <>
        <div
          className={`${c.text} font-semibold truncate text-xs md:text-sm`}
          title={task.name}
        >
          {task.name}
        </div>
        <div />
        <div className="relative h-6">
          <button
            type="button"
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 ${c.bg} border ${c.border} cursor-help focus:outline-hidden focus:ring-2 focus:ring-white/40`}
            style={{ left: `${left}%` }}
            onMouseEnter={(e) => onHover(task.uid, e.currentTarget)}
            onMouseLeave={onLeave}
            onFocus={(e) => onHover(task.uid, e.currentTarget)}
            onBlur={onLeave}
            aria-label={`${task.name} — ${fmtShort(task.start)}`}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${c.text} text-[10px] md:text-xs whitespace-nowrap font-semibold pointer-events-none`}
            style={{ left: `calc(${left}% + 14px)` }}
          >
            {fmtShort(task.start)}
          </div>
        </div>
      </>
    );
  }

  // Bar
  const left = pct(task.start);
  // For 1-day tasks, use a small finite bar so the hover target exists
  const finishPct = task.durationDays > 0 ? pct(task.finish) : left + 0.4;
  const width = Math.max(0.4, finishPct - left);

  return (
    <>
      <div
        className="text-slate-300 truncate text-xs md:text-sm"
        title={task.name}
      >
        {task.name}
      </div>
      <div className="text-right text-slate-500 text-[11px] md:text-xs tabular-nums">
        {task.durationDays}d
      </div>
      <div className="relative h-7">
        <button
          type="button"
          className={`absolute top-1/2 -translate-y-1/2 h-4 rounded-xs border transition-colors cursor-help focus:outline-hidden focus:ring-2 focus:ring-white/40 ${colorForBar(color)}`}
          style={{ left: `${left}%`, width: `${width}%`, minWidth: '4px' }}
          onMouseEnter={(e) => onHover(task.uid, e.currentTarget)}
          onMouseLeave={onLeave}
          onFocus={(e) => onHover(task.uid, e.currentTarget)}
          onBlur={onLeave}
          aria-label={`${task.name} — ${fmtShort(task.start)} to ${fmtShort(task.finish)} (${task.durationDays} working days)`}
        />
      </div>
    </>
  );
}

// Portal-based tooltip with collision detection (flip vertical, shift horizontal, clamp).
// Lives in document.body, uses position:fixed → escapes the chart's overflow-x-auto container.
interface GanttTooltipProps {
  rect: DOMRect;
  text: string;
  color: AccentColor;
}

function GanttTooltip({ rect, text, color }: GanttTooltipProps) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!tipRef.current) return;
    const tip = tipRef.current.getBoundingClientRect();
    const padding = 12;
    const gap = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default placement: above the trigger, horizontally centered on it
    let left = rect.left + rect.width / 2 - tip.width / 2;
    let top = rect.top - tip.height - gap;

    // Flip below if not enough room above
    if (top < padding) {
      top = rect.bottom + gap;
      // If neither above nor below fits, clamp into the viewport
      if (top + tip.height > vh - padding) {
        top = Math.max(padding, vh - tip.height - padding);
      }
    }

    // Shift horizontally to keep within viewport
    if (left < padding) left = padding;
    if (left + tip.width > vw - padding) {
      left = Math.max(padding, vw - tip.width - padding);
    }

    setPos({ left, top });
  }, [rect, text]);

  const accent =
    color === 'cyan'
      ? 'border-cyan-500/40'
      : color === 'red'
        ? 'border-red-500/40'
        : 'border-amber-500/40';

  // Hide while we measure on first frame, then reveal at the corrected position.
  const style: React.CSSProperties = pos
    ? { left: pos.left, top: pos.top, visibility: 'visible' }
    : { left: rect.left, top: rect.top, visibility: 'hidden' };

  return createPortal(
    <div
      ref={tipRef}
      role="tooltip"
      className={`fixed z-60 bg-slate-900/95 ${accent} border rounded-md px-3.5 py-2.5 text-xs md:text-sm text-slate-200 leading-relaxed shadow-xl pointer-events-none`}
      style={{
        ...style,
        maxWidth: '28rem',
        minWidth: '15rem',
        whiteSpace: 'normal',
      }}
    >
      {text}
    </div>,
    document.body,
  );
}

// ─── one collapsible schedule section ───────────────────────────────────────
interface ScheduleSectionProps {
  schedule: TimelineSchedule;
  index: number;
}

function ScheduleSection({ schedule, index }: ScheduleSectionProps) {
  const [isActive, setIsActive] = useState(false);
  const [hover, setHover] = useState<{ uid: number; rect: DOMRect } | null>(null);

  const handleHover = (uid: number, el: HTMLElement) => {
    setHover({ uid, rect: el.getBoundingClientRect() });
  };
  const handleLeave = () => setHover(null);

  const accentText =
    schedule.accentColor === 'cyan'
      ? 'text-cyan-400'
      : schedule.accentColor === 'red'
        ? 'text-red-400'
        : 'text-amber-500';

  const accentBorder =
    schedule.accentColor === 'cyan'
      ? 'border-cyan-500/30'
      : schedule.accentColor === 'red'
        ? 'border-red-500/30'
        : 'border-amber-500/30';

  return (
    <section className="relative">
      <div className={`w-full px-4 md:px-6 pt-12 ${isActive ? 'pb-6' : 'pb-2'}`}>
        {/* Headline — always visible, sticks at the top of the section */}
        <button
          type="button"
          onClick={() => setIsActive((v) => !v)}
          className={`w-full text-left flex items-start gap-4 group rounded-lg border ${accentBorder} bg-slate-900/40 hover:bg-slate-900/70 px-6 py-5 transition-colors`}
          aria-expanded={isActive}
        >
          <div className="flex-1">
            <p className={`text-xs uppercase tracking-[0.2em] font-semibold mb-2 ${accentText}`}>
              Schedule {index + 1}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2 leading-tight">
              {schedule.title}
            </h2>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              {schedule.subtitle}
            </p>
          </div>
          <ChevronDown
            className={`shrink-0 w-6 h-6 mt-1 ${accentText} transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Collapsible Gantt block */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
          isActive ? 'max-h-[2400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isActive}
      >
        <div className="w-full px-4 md:px-6 pb-12">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 md:p-8 overflow-x-auto">
            <div className="min-w-[1340px] relative">
              {/* Time axis + bar grid */}
              <div
                className="grid gap-x-2 md:gap-x-4 gap-y-1.5 items-center"
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                {/* Time axis row */}
                <div />
                <div />
                <div className="relative h-6">
                  {MONTHS.map((m) => (
                    <div
                      key={m.label}
                      className="absolute top-0 text-slate-400 text-[11px] md:text-xs font-medium"
                      style={{ left: `${pct(m.date)}%` }}
                    >
                      <span className="inline-block -translate-x-1/2">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Task rows */}
                {schedule.tasks.map((task) => (
                  <TaskRow
                    key={task.uid}
                    task={task}
                    color={schedule.accentColor}
                    onHover={handleHover}
                    onLeave={handleLeave}
                  />
                ))}
              </div>

              {/* Month gridlines (visual only, behind bars) */}
              <div
                className="absolute top-[30px] bottom-0 right-0 left-116 md:left-120 pointer-events-none"
                aria-hidden
              >
                {MONTHS.map((m) => (
                  <div
                    key={`gl-${m.label}`}
                    className="absolute top-0 bottom-0 w-px bg-slate-800/50"
                    style={{ left: `${pct(m.date)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal-based tooltip: rendered only while hovering, escapes the chart's overflow-x-auto */}
      {hover && timelineNotes[hover.uid] && (
        <GanttTooltip
          key={hover.uid}
          rect={hover.rect}
          text={timelineNotes[hover.uid]}
          color={schedule.accentColor}
        />
      )}
    </section>
  );
}

// ─── page ───────────────────────────────────────────────────────────────────
export default function TheRealProcurementTimeline() {
  const [showOpen, setShowOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'The Real Procurement Timeline | JiTpro';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {showOpen && <TimelineShow onClose={() => setShowOpen(false)} />}
      <header className="border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" aria-label="JiTpro home" className="inline-flex items-center">
            <JiTproWordmark variant="amber" />
          </Link>
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
          >
            Visit JiTpro
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-8">
            One job. Three procurement schedules.
            <br />
            <span className="text-amber-500">Only one of them is real.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4">
            A single piece of structural steel. Same scope, same delivery requirement.
          </p>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-10">
            Below: the schedule a GC <em>commits to</em>. The schedule that <em>actually unfolds</em>{' '}
            when they do. And the schedule that would have <em>matched reality</em> from day one.
            Hover any bar to see what&rsquo;s happening at that step.
          </p>

          <button
            type="button"
            onClick={() => setShowOpen(true)}
            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3.5 rounded-lg transition-colors text-base md:text-lg shadow-lg shadow-amber-500/10"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch the procurement reality
          </button>
          <p className="mt-3 text-xs text-slate-500">
            ~90 seconds. Skip-able. The Happy Path, then what actually happens.
          </p>
        </div>
      </section>

      {/* Three schedule sections — scroll-driven roll/unroll */}
      <ScheduleSection schedule={happyPath} index={0} />
      <ScheduleSection schedule={whatReallyHappens} index={1} />
      <ScheduleSection schedule={whatShouldHappen} index={2} />

      {/* Closing — reflective, not promotional */}
      <section className="px-6 py-20 md:py-24 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-6">
            Same job. Same calendar weight. Different cost.
          </h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-4">
            Procurement reality doesn&rsquo;t compress. A schedule built without it is fiction —
            and the field pays for the gap between fiction and what was always going to happen.
          </p>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            The third schedule and the second schedule end roughly the same week. The difference
            is whether the team executes a plan they can trust, or reacts to a plan that
            never could.
          </p>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" aria-label="JiTpro home" className="inline-flex items-center">
            <JiTproWordmark variant="amber" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
