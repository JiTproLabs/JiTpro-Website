import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FastForward } from 'lucide-react';
import {
  AXIS_START,
  AXIS_END,
  happyPath,
  whatReallyHappens,
  type TimelineSchedule,
  type TimelineTask,
} from '../../content/timelineData';
import { timelineNotes } from '../../content/timelineNotes';

// ─── date math (mirrors TheRealProcurementTimeline) ────────────────────────
function days(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
const AXIS_DAYS = days(AXIS_START, AXIS_END);
const pct = (d: string) => (days(AXIS_START, d) / AXIS_DAYS) * 100;
const fmtShort = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const MONTHS: { date: string; label: string }[] = [
  { date: '2026-04-01', label: 'Apr' },
  { date: '2026-05-01', label: 'May' },
  { date: '2026-06-01', label: 'Jun' },
  { date: '2026-07-01', label: 'Jul' },
  { date: '2026-08-01', label: 'Aug' },
  { date: '2026-09-01', label: 'Sep' },
  { date: '2026-10-01', label: 'Oct' },
  { date: '2026-11-01', label: 'Nov' },
  { date: '2026-12-01', label: 'Dec' },
  { date: '2027-01-01', label: 'Jan' },
  { date: '2027-02-01', label: 'Feb' },
];

// Compact grid template for the modal: smaller columns than the inline page.
const SHOW_GRID = '14rem 2.5rem 1fr';

// ─── timing helpers ────────────────────────────────────────────────────────
function bubbleDuration(text?: string): number {
  if (!text) return 1500;
  const dur = 900 + text.length * 22; // ~22ms per char
  return Math.min(3200, Math.max(1500, dur));
}

// ─── phase model ───────────────────────────────────────────────────────────
type Phase =
  | 'intro'
  | 'happy-fadein'
  | 'happy-bubbles'
  | 'between'
  | 'reality-fadein'
  | 'reality-bubbles'
  | 'outro';

const SCHEDULE_FADE_MS = 900;
const PHASE_TEXT_FADE_MS = 700;

// ─── narration copy ────────────────────────────────────────────────────────
const intro = {
  eyebrow: 'How most procurement schedules get built',
  body: [
    'A GC needs a delivery date.',
    'They reach for a familiar shape: buyout, submittal, approval, fabrication, delivery — and a buffer because nothing ever goes to plan.',
    'Five bars. A confident delivery date. Done.',
    'The constraints underneath — design gaps, decision sequencing, real submittal cycles — never make it onto the schedule.',
  ],
  closer: 'Here’s what most schedules look like.',
};

const between = {
  body: 'But this isn’t a schedule. It’s a wish.',
  closer: 'Here’s what actually happens when a GC commits to it.',
};

const outro = {
  headline: 'Same procurement. Same calendar weight. Different cost.',
  body: 'Reality doesn’t compress. The field absorbs every gap between the schedule and what was always going to happen.',
};

// ─── color helpers (mirror page) ───────────────────────────────────────────
type AccentColor = 'cyan' | 'red' | 'amber';

function colorForBar(c: AccentColor) {
  switch (c) {
    case 'cyan':
      return 'bg-cyan-500/70 border-cyan-400/60';
    case 'red':
      return 'bg-red-500/70 border-red-400/60';
    case 'amber':
      return 'bg-amber-500/80 border-amber-400/60';
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

function accentBorderClass(c: AccentColor) {
  return c === 'cyan'
    ? 'border-cyan-500/40'
    : c === 'red'
      ? 'border-red-500/40'
      : 'border-amber-500/40';
}

function accentGlowClass(c: AccentColor) {
  return c === 'cyan'
    ? 'shadow-[0_0_24px_rgba(34,211,238,0.35)]'
    : c === 'red'
      ? 'shadow-[0_0_24px_rgba(239,68,68,0.35)]'
      : 'shadow-[0_0_24px_rgba(245,158,11,0.35)]';
}

function accentTextClass(c: AccentColor) {
  return c === 'cyan' ? 'text-cyan-300' : c === 'red' ? 'text-red-400' : 'text-amber-500';
}

// ─── compact Gantt for the show ────────────────────────────────────────────
interface CompactGanttProps {
  schedule: TimelineSchedule;
  activeUid: number | null;
  visible: boolean; // controls fade
}

function CompactGantt({ schedule, activeUid, visible }: CompactGanttProps) {
  return (
    <div
      className={`transition-opacity duration-[${SCHEDULE_FADE_MS}ms] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDuration: `${SCHEDULE_FADE_MS}ms` }}
      aria-hidden={!visible}
    >
      <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[820px] relative">
          <div
            className="grid gap-x-3 gap-y-1 items-center"
            style={{ gridTemplateColumns: SHOW_GRID }}
          >
            {/* Time axis */}
            <div />
            <div />
            <div className="relative h-5">
              {MONTHS.map((m) => (
                <div
                  key={m.label}
                  className="absolute top-0 text-slate-500 text-[10px] font-medium"
                  style={{ left: `${pct(m.date)}%` }}
                >
                  <span className="inline-block -translate-x-1/2">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {schedule.tasks.map((task) => (
              <CompactRow
                key={task.uid}
                task={task}
                color={schedule.accentColor}
                isActive={activeUid === task.uid}
              />
            ))}
          </div>

          {/* Month gridlines aligned to bar-track column */}
          <div
            className="absolute top-[24px] bottom-0 right-0 left-67 pointer-events-none"
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
  );
}

interface CompactRowProps {
  task: TimelineTask;
  color: AccentColor;
  isActive: boolean;
}

function CompactRow({ task, color, isActive }: CompactRowProps) {
  if (task.isMilestone) {
    const c = colorForMilestone(color);
    const left = pct(task.start);
    return (
      <>
        <div
          className={`${c.text} font-semibold truncate text-[11px] transition-colors ${
            isActive ? 'brightness-150' : ''
          }`}
        >
          {task.name}
        </div>
        <div />
        <div
          className={`relative h-5 transition-colors duration-300 rounded-xs ${
            isActive ? 'bg-white/5' : ''
          }`}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${c.bg} border ${c.border} transition-all ${
              isActive ? 'scale-150' : ''
            }`}
            style={{ left: `${left}%` }}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${c.text} text-[9px] whitespace-nowrap font-semibold pointer-events-none`}
            style={{ left: `calc(${left}% + 12px)` }}
          >
            {fmtShort(task.start)}
          </div>
        </div>
      </>
    );
  }

  const left = pct(task.start);
  const finishPct = task.durationDays > 0 ? pct(task.finish) : left + 0.4;
  const width = Math.max(0.4, finishPct - left);

  return (
    <>
      <div
        className={`text-slate-300 truncate text-[11px] transition-colors ${
          isActive ? 'text-slate-100 font-semibold' : ''
        }`}
        title={task.name}
      >
        {task.name}
      </div>
      <div className="text-right text-slate-500 text-[10px] tabular-nums">{task.durationDays}d</div>
      <div
        className={`relative h-5 transition-colors duration-300 rounded-xs ${
          isActive ? 'bg-white/5' : ''
        }`}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-3 rounded-xs border transition-all duration-300 ${colorForBar(
            color,
          )} ${isActive ? 'h-4 ' + accentGlowClass(color) : ''}`}
          style={{ left: `${left}%`, width: `${width}%`, minWidth: '3px' }}
        />
      </div>
    </>
  );
}

// ─── narration block ───────────────────────────────────────────────────────
interface NarrationBlockProps {
  visible: boolean;
  eyebrow?: string;
  body: string | string[];
  closer?: string;
  accent?: AccentColor;
}

function NarrationBlock({ visible, eyebrow, body, closer, accent = 'amber' }: NarrationBlockProps) {
  const paragraphs = Array.isArray(body) ? body : [body];
  return (
    <div
      className={`max-w-3xl mx-auto text-center transition-opacity ease-out`}
      style={{
        transitionDuration: `${PHASE_TEXT_FADE_MS}ms`,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden={!visible}
    >
      {eyebrow && (
        <p
          className={`text-xs uppercase tracking-[0.2em] font-semibold mb-5 ${accentTextClass(
            accent,
          )}`}
        >
          {eyebrow}
        </p>
      )}
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`leading-relaxed ${
              i === 0
                ? 'text-2xl md:text-4xl font-bold text-slate-100'
                : 'text-base md:text-xl text-slate-300'
            }`}
          >
            {p}
          </p>
        ))}
      </div>
      {closer && (
        <p className={`mt-6 text-base md:text-lg italic ${accentTextClass(accent)}`}>{closer}</p>
      )}
    </div>
  );
}

// ─── modal shell + state machine ───────────────────────────────────────────
interface TimelineShowProps {
  onClose: () => void;
}

export default function TimelineShow({ onClose }: TimelineShowProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeUid, setActiveUid] = useState<number | null>(null);
  const [skipSignal, setSkipSignal] = useState(0); // increment to abort current schedule

  // Body scroll lock while the modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Pre-compute task lists with bubble durations
  const happySteps = useMemo(
    () => happyPath.tasks.map((t) => ({ uid: t.uid, dur: bubbleDuration(timelineNotes[t.uid]) })),
    [],
  );
  const realitySteps = useMemo(
    () =>
      whatReallyHappens.tasks.map((t) => ({
        uid: t.uid,
        dur: bubbleDuration(timelineNotes[t.uid]),
      })),
    [],
  );

  // The driver: schedules a chain of timeouts based on current phase.
  // Skipping increments skipSignal which restarts this effect; the previous
  // timer chain is cleared in the cleanup function.
  useEffect(() => {
    const timers: number[] = [];
    let cancelled = false;

    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));
    };

    const runFrom = (currentPhase: Phase) => {
      let t = 0;

      if (currentPhase === 'intro') {
        // Intro display 7s, then fade to happy
        t = 7000;
        at(t, () => setPhase('happy-fadein'));
        t += SCHEDULE_FADE_MS;
        at(t, () => setPhase('happy-bubbles'));
        t += 600; // settle pause before first bubble
        for (const step of happySteps) {
          at(t, () => setActiveUid(step.uid));
          t += step.dur;
          at(t, () => setActiveUid(null));
          t += 250;
        }
        at(t, () => setPhase('between'));
        t += PHASE_TEXT_FADE_MS;
        // Between text holds 4.5s
        t += 4500;
        at(t, () => setPhase('reality-fadein'));
        t += SCHEDULE_FADE_MS;
        at(t, () => setPhase('reality-bubbles'));
        t += 600;
        for (const step of realitySteps) {
          at(t, () => setActiveUid(step.uid));
          t += step.dur;
          at(t, () => setActiveUid(null));
          t += 200;
        }
        at(t, () => setPhase('outro'));
      } else if (currentPhase === 'happy-bubbles' || currentPhase === 'happy-fadein') {
        // Skip handler — jump from happy to between
        at(0, () => setActiveUid(null));
        at(0, () => setPhase('between'));
        t = PHASE_TEXT_FADE_MS + 4500;
        at(t, () => setPhase('reality-fadein'));
        t += SCHEDULE_FADE_MS;
        at(t, () => setPhase('reality-bubbles'));
        t += 600;
        for (const step of realitySteps) {
          at(t, () => setActiveUid(step.uid));
          t += step.dur;
          at(t, () => setActiveUid(null));
          t += 200;
        }
        at(t, () => setPhase('outro'));
      } else if (currentPhase === 'reality-bubbles' || currentPhase === 'reality-fadein') {
        // Skip from reality to outro
        at(0, () => setActiveUid(null));
        at(0, () => setPhase('outro'));
      } else if (currentPhase === 'between') {
        // Skip from between to reality
        at(0, () => setPhase('reality-fadein'));
        t = SCHEDULE_FADE_MS;
        at(t, () => setPhase('reality-bubbles'));
        t += 600;
        for (const step of realitySteps) {
          at(t, () => setActiveUid(step.uid));
          t += step.dur;
          at(t, () => setActiveUid(null));
          t += 200;
        }
        at(t, () => setPhase('outro'));
      }
    };

    runFrom(phase);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSignal]);

  const isOnSchedule = (s: 'happy' | 'reality') =>
    s === 'happy'
      ? phase === 'happy-fadein' || phase === 'happy-bubbles' || phase === 'between'
      : phase === 'reality-fadein' || phase === 'reality-bubbles' || phase === 'outro';

  const happyVisible = phase === 'happy-bubbles' || phase === 'happy-fadein' || phase === 'between';
  const realityVisible =
    phase === 'reality-bubbles' || phase === 'reality-fadein' || phase === 'outro';

  // Find active task for bubble rendering
  const activeSchedule: TimelineSchedule | null = isOnSchedule('happy')
    ? happyPath
    : isOnSchedule('reality')
      ? whatReallyHappens
      : null;
  const activeIdx = activeSchedule
    ? activeSchedule.tasks.findIndex((t) => t.uid === activeUid)
    : -1;
  const activeTask = activeIdx >= 0 ? activeSchedule!.tasks[activeIdx] : null;
  const activeNote = activeTask ? timelineNotes[activeTask.uid] : undefined;

  return createPortal(
    <div
      className="fixed inset-0 z-100 bg-slate-950/96 backdrop-blur-md flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Procurement timeline animated walkthrough"
    >
      {/* Top bar — close + skip */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-[0.2em]">
          <PhaseIndicator phase={phase} />
        </div>
        <div className="flex items-center gap-2">
          {phase !== 'outro' && (
            <button
              type="button"
              onClick={() => setSkipSignal((n) => n + 1)}
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-900/60"
              aria-label="Skip current scene"
            >
              <FastForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-900/60"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-12 flex flex-col">
        {/* Intro */}
        {phase === 'intro' && (
          <div className="m-auto w-full">
            <NarrationBlock
              visible
              eyebrow={intro.eyebrow}
              body={intro.body}
              closer={intro.closer}
              accent="cyan"
            />
          </div>
        )}

        {/* Schedules — both rendered when on a schedule phase, with bubble in between */}
        {(happyVisible || realityVisible) && (
          <div className="w-full max-w-[1080px] mx-auto">
            {happyVisible && (
              <SchedulePane
                schedule={happyPath}
                activeUid={activeUid}
                visible={phase === 'happy-fadein' || phase === 'happy-bubbles'}
                title="Schedule 1 — Happy Path"
                titleAccent="cyan"
                bubbleText={
                  activeTask && activeSchedule?.id === 'happy' ? activeNote : undefined
                }
                bubbleColor="cyan"
                bubbleRowIndex={activeIdx}
                bubbleTotalRows={happyPath.tasks.length}
              />
            )}
            {realityVisible && (
              <SchedulePane
                schedule={whatReallyHappens}
                activeUid={activeUid}
                visible={phase === 'reality-fadein' || phase === 'reality-bubbles'}
                title="Schedule 2 — What Really Happens"
                titleAccent="red"
                bubbleText={
                  activeTask && activeSchedule?.id === 'reality' ? activeNote : undefined
                }
                bubbleColor="red"
                bubbleRowIndex={activeIdx}
                bubbleTotalRows={whatReallyHappens.tasks.length}
              />
            )}
          </div>
        )}

        {/* Between text overlays the schedules */}
        {phase === 'between' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-xs rounded-2xl border border-slate-800 p-10 max-w-2xl mx-6">
              <NarrationBlock visible body={between.body} closer={between.closer} accent="red" />
            </div>
          </div>
        )}

        {/* Outro */}
        {phase === 'outro' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-xs rounded-2xl border border-amber-500/20 p-10 max-w-2xl mx-6 text-center">
              <h3 className="text-2xl md:text-4xl font-bold text-slate-100 leading-tight mb-4">
                {outro.headline}
              </h3>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8">
                {outro.body}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveUid(null);
                    setPhase('intro');
                    setSkipSignal((n) => n + 1);
                  }}
                  className="px-5 py-2.5 rounded-md border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-400 transition-colors text-sm"
                >
                  Replay
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

// ─── schedule pane (title + chart + floating bubble overlay) ───────────────
interface SchedulePaneProps {
  schedule: TimelineSchedule;
  activeUid: number | null;
  visible: boolean;
  title: string;
  titleAccent: AccentColor;
  bubbleText: string | undefined;
  bubbleColor: AccentColor;
  bubbleRowIndex: number;
  bubbleTotalRows: number;
}

function SchedulePane({
  schedule,
  activeUid,
  visible,
  title,
  titleAccent,
  bubbleText,
  bubbleColor,
  bubbleRowIndex,
  bubbleTotalRows,
}: SchedulePaneProps) {
  return (
    <div
      className="relative transition-opacity"
      style={{
        transitionDuration: `${SCHEDULE_FADE_MS}ms`,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden={!visible}
    >
      <div className="mb-4 text-center">
        <p className={`text-xs uppercase tracking-[0.2em] font-semibold ${accentTextClass(titleAccent)}`}>
          {title}
        </p>
      </div>

      <CompactGantt schedule={schedule} activeUid={activeUid} visible={visible} />

      {/* Floating bubble overlay */}
      {bubbleText && bubbleRowIndex >= 0 && (
        <BubbleOverlay
          text={bubbleText}
          color={bubbleColor}
          rowIndex={bubbleRowIndex}
          totalRows={bubbleTotalRows}
        />
      )}
    </div>
  );
}

// Positions the bubble near the active row inside the chart area.
interface BubbleOverlayProps {
  text: string;
  color: AccentColor;
  rowIndex: number;
  totalRows: number;
}

function BubbleOverlay({ text, color, rowIndex, totalRows }: BubbleOverlayProps) {
  // Each row is ~24px tall (h-5 + gap-y-1). Plus axis (~20px). Plus pane title margin.
  // The Gantt sits inside a card with p-4/p-6 padding. We position the bubble overlay
  // with a top offset that approximates the active row's vertical center.
  const ROW_H = 24; // h-5 (20px) + gap-y-1 (4px)
  const TOP_OFFSET = 64 + 20 + 16; // pane title (~64) + axis (20) + card top padding (16)
  const top = TOP_OFFSET + rowIndex * ROW_H + ROW_H / 2;

  // Show above active row for top half, below for bottom half
  const placeBelow = rowIndex / totalRows < 0.4;

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none flex justify-center"
      style={{
        top: placeBelow ? `${top + 12}px` : undefined,
        bottom: placeBelow ? undefined : `calc(100% - ${top - 12}px)`,
      }}
    >
      <div
        key={`${rowIndex}-${text}`}
        className={`bg-slate-900/95 ${accentBorderClass(color)} border-2 rounded-lg px-5 py-3 text-sm md:text-base text-slate-100 leading-relaxed shadow-2xl max-w-2xl ${accentGlowClass(
          color,
        )} animate-bubble-in mx-4`}
      >
        {text}
      </div>
    </div>
  );
}

// ─── phase indicator dots ──────────────────────────────────────────────────
function PhaseIndicator({ phase }: { phase: Phase }) {
  const sceneIdx =
    phase === 'intro'
      ? 0
      : phase === 'happy-fadein' || phase === 'happy-bubbles'
        ? 1
        : phase === 'between'
          ? 2
          : phase === 'reality-fadein' || phase === 'reality-bubbles'
            ? 3
            : 4;
  const labels = ['Intro', 'Happy Path', 'Reality of', 'What Really Happens', 'Wrap'];
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-400 font-semibold tracking-[0.2em]">
        {String(sceneIdx + 1).padStart(2, '0')}
      </span>
      <span>{labels[sceneIdx]}</span>
    </div>
  );
}
