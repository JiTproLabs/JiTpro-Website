// Archived JiTpro detailed Gantt → compressed control bar animation.
// Removed from the homepage hero on 2026-05-29 in favor of a single
// traditional/failure scenario. Self-contained for reuse on other pages.
//
// Visual sequence (~12.2s):
//   1. detail_reveal (2.2s) — full 14-row detailed procurement Gantt fades in
//      with constraint pills and sqrt-compressed widths.
//   2. compression (1.5s)  — the detailed view crossfades into a single
//      segmented JiTpro control bar.
//   3. execution (8.5s)    — a time cursor traverses the compressed bar;
//      each segment lights up; success notes appear underneath.
//
// To embed:
//   <JitproGanttAnimation />
//   <JitproGanttAnimation onComplete={() => console.log('done')} />
//
// To tune: adjust PHASES durations, jitproScenario data, or visual constants
// (TIMELINE_*, STAGE_MIN_HEIGHT) at the top of this file. Nothing else imports
// from this module — change anything freely.

import { useEffect, useRef, useState } from 'react';

// ===== Data =====

interface DetailedStep {
  label: string;
  days: number;
  milestone?: boolean;
  constraint?: string;
}

interface CompressedSegment {
  label: string;
  widthPct: number;
}

interface SuccessNote {
  text: string;
  /** cursor position (0..1) at which this note becomes visible */
  trigger: number;
}

const jitproScenario = {
  title: 'JiTpro does not hide procurement complexity. It makes it manageable.',
  detailedSteps: [
    { label: 'Buyout',                     days: 15 },
    { label: 'Submittal Coordination',     days: 30 },
    { label: 'Final Window Details',       days: 0, milestone: true, constraint: 'Constraint' },
    { label: 'Submittal Preparation',      days: 30 },
    { label: 'Color & Glazing Selections', days: 0, milestone: true, constraint: 'Constraint' },
    { label: 'Review Cycle 1',             days: 10 },
    { label: 'Vendor Revision Round 1',    days: 10 },
    { label: 'Review Cycle 2',             days: 10 },
    { label: 'Vendor Revision Round 2',    days: 10 },
    { label: 'Review Cycle 3',             days: 10 },
    { label: 'Approval',                   days: 0, milestone: true },
    { label: 'Fabrication',                days: 130 },
    { label: 'Delivery',                   days: 8 },
    { label: 'Ready for Install',          days: 0, milestone: true },
  ] as DetailedStep[],
  compressedSegments: [
    { label: 'Buyout',         widthPct: 8  },
    { label: 'Coordination',   widthPct: 12 },
    { label: 'Submittal Prep', widthPct: 14 },
    { label: 'Review',         widthPct: 14 },
    { label: 'Approval',       widthPct: 4  },
    { label: 'Fabrication',    widthPct: 30 },
    { label: 'Delivery',       widthPct: 10 },
    { label: 'Ready',          widthPct: 8  },
  ] as CompressedSegment[],
  successNotes: [
    { text: 'Buyout complete',               trigger: 0.06 },
    { text: 'Final window details resolved', trigger: 0.18 },
    { text: 'Owner selection confirmed',     trigger: 0.30 },
    { text: 'Consultant review aligned',     trigger: 0.44 },
    { text: 'Vendor revisions absorbed',     trigger: 0.55 },
    { text: 'Approval secured',              trigger: 0.66 },
    { text: 'Fabrication released',          trigger: 0.80 },
    { text: 'Delivery confirmed',            trigger: 0.92 },
    { text: 'On Time Delivery',              trigger: 0.99 },
  ] as SuccessNote[],
};

/** Sqrt scale so Fabrication's 130 days does not crush the shorter steps; 0-day milestones get a small fixed width. */
function compressedDayWidth(days: number): number {
  if (days === 0) return 2;
  return Math.sqrt(days);
}

// ===== Phases =====

type PhaseId = 'detail_reveal' | 'compression' | 'execution' | 'done';

const PHASES: { id: PhaseId; duration: number }[] = [
  { id: 'detail_reveal', duration: 2200 },
  { id: 'compression',   duration: 1500 },
  { id: 'execution',     duration: 8500 },
];

const TOTAL_MS = PHASES.reduce((s, p) => s + p.duration, 0);

function phaseStart(id: PhaseId): number {
  let t = 0;
  for (const p of PHASES) {
    if (p.id === id) return t;
    t += p.duration;
  }
  return t;
}
function phaseDuration(id: PhaseId): number {
  return PHASES.find(p => p.id === id)?.duration ?? 0;
}
function phaseProgress(id: PhaseId, elapsed: number): number {
  const start = phaseStart(id);
  const dur = phaseDuration(id);
  if (elapsed < start) return 0;
  if (elapsed > start + dur) return 1;
  return (elapsed - start) / dur;
}
function currentPhase(elapsed: number): PhaseId {
  let t = 0;
  for (const p of PHASES) {
    if (elapsed < t + p.duration) return p.id;
    t += p.duration;
  }
  return 'done';
}

// ===== Visual constants =====

const TIMELINE_LEFT_PCT = 22;
const TIMELINE_RIGHT_PCT = 6;
const TIMELINE_WIDTH_PCT = 100 - TIMELINE_LEFT_PCT - TIMELINE_RIGHT_PCT;
const STAGE_MIN_HEIGHT = 480;

function timelineX(frac: number): number {
  return TIMELINE_LEFT_PCT + Math.max(0, Math.min(1, frac)) * TIMELINE_WIDTH_PCT;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return r;
}

// ===== Component =====

export default function JitproGanttAnimation({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setElapsed(TOTAL_MS);
      if (!completedRef.current) { completedRef.current = true; onComplete?.(); }
      return;
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(Math.min(e, TOTAL_MS));
      if (e < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [reducedMotion, onComplete]);

  const phase = currentPhase(elapsed);

  const detailedOpacity = (() => {
    if (phase === 'detail_reveal') return Math.min(1, phaseProgress('detail_reveal', elapsed) * 1.5);
    if (phase === 'compression') return Math.max(0, 1 - phaseProgress('compression', elapsed) * 1.6);
    return 0;
  })();
  const compressedOpacity = (() => {
    if (phase === 'compression') return Math.max(0, phaseProgress('compression', elapsed) * 1.6 - 0.6);
    if (phase === 'execution' || phase === 'done') return 1;
    return 0;
  })();
  const titleOpacity = (() => {
    if (phase === 'detail_reveal') return Math.min(1, phaseProgress('detail_reveal', elapsed) * 2);
    return 1;
  })();

  return (
    <section
      className="relative overflow-hidden bg-[#030a19]"
      style={{ minHeight: `${STAGE_MIN_HEIGHT}px` }}
      aria-label="JiTpro procurement control animation"
    >
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 px-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-lg md:text-xl lg:text-2xl font-semibold text-amber-200/95 tracking-tight transition-opacity"
            style={{ opacity: titleOpacity, transitionDuration: '400ms' }}
          >
            {jitproScenario.title}
          </h2>
        </div>
      </div>

      {/* Chart stage */}
      <div className="absolute left-0 right-0 px-8" style={{ top: '90px', bottom: '60px' }}>
        <div className="relative max-w-6xl mx-auto h-full">
          <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: detailedOpacity }}>
            <JitproDetailedGantt />
          </div>
          <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: compressedOpacity }}>
            <JitproCompressedBar phase={phase} elapsed={elapsed} />
          </div>
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-[#030a19]/55 via-transparent to-[#030a19]/30 pointer-events-none" />
    </section>
  );
}

// ===== Render helpers =====

function JitproDetailedGantt() {
  const steps = jitproScenario.detailedSteps;
  const totalCompressed = steps.reduce((s, st) => s + compressedDayWidth(st.days), 0);

  let cumulative = 0;
  const placed = steps.map(step => {
    const startFrac = cumulative / totalCompressed;
    const widthFrac = compressedDayWidth(step.days) / totalCompressed;
    cumulative += compressedDayWidth(step.days);
    return { ...step, startFrac, widthFrac };
  });

  const rowH = 100 / steps.length;
  const barH = rowH * 0.6;

  return (
    <div className="relative w-full h-full">
      <div className="absolute h-px bg-slate-600/25"
        style={{ left: `${TIMELINE_LEFT_PCT}%`, width: `${TIMELINE_WIDTH_PCT}%`, top: '100%' }} />

      {placed.map((step, i) => {
        const top = i * rowH;
        const left = timelineX(step.startFrac);
        const width = step.widthFrac * TIMELINE_WIDTH_PCT;
        const isMilestone = step.milestone;

        return (
          <div key={i} className="absolute left-0 right-0" style={{ top: `${top}%`, height: `${rowH}%` }}>
            <div
              className="absolute top-1/2 -translate-y-1/2 text-[10px] text-slate-300/85 pr-2 text-right truncate"
              style={{ left: 0, width: `${TIMELINE_LEFT_PCT - 1}%` }}
            >
              {step.label}
              {step.constraint && (
                <span className="ml-1 inline-block px-1 py-px text-[8px] font-semibold uppercase tracking-wider text-amber-300/85 border border-amber-400/35 rounded-sm">
                  {step.constraint}
                </span>
              )}
            </div>

            {isMilestone ? (
              <div
                className="absolute top-1/2"
                style={{
                  left: `calc(${left}% - 5px)`,
                  transform: 'translateY(-50%) rotate(45deg)',
                  width: '10px', height: '10px',
                  background: 'rgba(245,158,11,0.85)',
                  border: '1.2px solid rgba(253,224,71,0.95)',
                }}
              />
            ) : (
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-[2px]"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  height: `${barH}%`,
                  background: 'rgba(100,116,139,0.40)',
                  border: '1px solid rgba(148,163,184,0.55)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function JitproCompressedBar({ phase, elapsed }: { phase: PhaseId; elapsed: number }) {
  const segments = jitproScenario.compressedSegments;

  let cumulative = 0;
  const placed = segments.map(seg => {
    const startFrac = cumulative / 100;
    cumulative += seg.widthPct;
    return { ...seg, startFrac, widthFrac: seg.widthPct / 100 };
  });

  const cursorX = (() => {
    if (phase === 'execution') return phaseProgress('execution', elapsed);
    if (phase === 'done') return 1;
    return 0;
  })();

  const showCursor = phase === 'execution';

  const barTop = 38;
  const barH = 14;

  return (
    <div className="relative w-full h-full">
      <div className="absolute h-px bg-slate-500/25"
        style={{ left: `${TIMELINE_LEFT_PCT}%`, width: `${TIMELINE_WIDTH_PCT}%`, top: `${barTop + barH + 4}%` }} />

      <div
        className="absolute text-[12px] font-semibold uppercase tracking-[0.15em] text-amber-300/85 pr-3 text-right"
        style={{ top: `${barTop + barH / 2 - 1.5}%`, left: 0, width: `${TIMELINE_LEFT_PCT - 1}%` }}
      >
        JiTpro Control
      </div>

      {placed.map((seg, i) => {
        const left = timelineX(seg.startFrac);
        const width = seg.widthFrac * TIMELINE_WIDTH_PCT;
        const segEnd = seg.startFrac + seg.widthFrac;
        const passed = cursorX > segEnd;
        const active = cursorX >= seg.startFrac && cursorX <= segEnd;

        const bg = passed
          ? 'linear-gradient(180deg, rgba(253,224,71,0.42), rgba(245,158,11,0.32))'
          : active
            ? 'linear-gradient(180deg, rgba(245,158,11,0.42), rgba(217,119,6,0.32))'
            : 'linear-gradient(180deg, rgba(71,85,105,0.4), rgba(51,65,85,0.3))';
        const border = passed
          ? 'rgba(253,224,71,0.85)'
          : active
            ? 'rgba(253,224,71,0.7)'
            : 'rgba(148,163,184,0.45)';

        return (
          <div key={i}>
            <div
              className="absolute transition-colors duration-300"
              style={{
                top: `${barTop}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${barH}%`,
                background: bg,
                border: `1px solid ${border}`,
                borderLeftWidth: i === 0 ? 1 : 0,
              }}
            />
            <div
              className="absolute text-[10px] font-medium tracking-wide text-slate-300/85 text-center"
              style={{
                top: `${barTop - 5}%`,
                left: `${left}%`,
                width: `${width}%`,
              }}
            >
              {seg.label}
            </div>
          </div>
        );
      })}

      {showCursor && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${barTop - 8}%`,
            bottom: `${100 - barTop - barH - 18}%`,
            left: `calc(${timelineX(cursorX)}% - 1px)`,
            width: '2px',
            background: 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.55))',
            boxShadow: '0 0 12px rgba(245,158,11,0.45)',
          }}
        />
      )}

      {jitproScenario.successNotes.map((note, i) => (
        <SuccessNoteBubble key={i} note={note} cursorX={cursorX} barTop={barTop} barH={barH} />
      ))}
    </div>
  );
}

function SuccessNoteBubble({
  note, cursorX, barTop, barH,
}: {
  note: { text: string; trigger: number };
  cursorX: number;
  barTop: number;
  barH: number;
}) {
  const LIFETIME = 0.22;
  const t = (cursorX - note.trigger) / LIFETIME;
  let opacity = 0;
  if (t >= 0 && t <= 1) {
    if (t < 0.12) opacity = t / 0.12;
    else if (t > 0.78) opacity = (1 - t) / 0.22;
    else opacity = 1;
  }
  if (opacity <= 0) return null;

  const left = timelineX(note.trigger);
  const top = barTop + barH + 7;

  return (
    <div
      className="absolute pointer-events-none whitespace-nowrap text-[11px] font-medium text-emerald-200/95"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity,
        transform: 'translateX(-2px)',
        textShadow: '0 0 8px rgba(110,231,183,0.35)',
      }}
    >
      <span className="inline-block w-1 h-1 mr-1.5 rounded-full bg-emerald-300 align-middle" />
      {note.text}
    </div>
  );
}
