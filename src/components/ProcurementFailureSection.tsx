// ProcurementFailureSection — centered marketing section with a play-button
// video showing the schedule-failure narrative that used to live in the hero
// (cursor traverses a planned schedule, package cards cycle through failure
// notes, schedule slips, ends on the consequence card).
//
// The previous TypicalScheduleSection (a different planned-vs-actual video) is
// preserved at _archive/TypicalScheduleSection.tsx. The previous full hero is
// preserved at hero/_archive/ProcurementFlowHero.full.tsx.
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import {
  TRADITIONAL_PAUSE_MS,
  FAILURE_PRE_ROLL_MS, FAILURE_CURSOR_FADE_MS, FAILURE_MOTION_BUDGET_MS,
  BAR_LOCK_AT_CURSOR,
  traditionalScenario,
} from '../content/heroAnimationData';

// ===== Phase timing =====
// The original hero had a "traditional_intro" beat (framing line fade) that has
// been removed here — the section heading above the player serves that role.
// The video starts with the chart fading in, then runs the full failure /
// late_delivery / reset arc. The consequence card lives entirely within reset.
const CHART_INTRO_MS    = 900;
const FAILURE_MS        = FAILURE_PRE_ROLL_MS + FAILURE_CURSOR_FADE_MS + FAILURE_MOTION_BUDGET_MS;
const LATE_DELIVERY_MS  = 2800;
const RESET_MS          = 7000;
const TOTAL_MS = CHART_INTRO_MS + FAILURE_MS + LATE_DELIVERY_MS + RESET_MS;

type PhaseId = 'chart_intro' | 'traditional_failure' | 'late_delivery' | 'reset';

const PHASE_STARTS: Record<PhaseId, number> = {
  chart_intro:         0,
  traditional_failure: CHART_INTRO_MS,
  late_delivery:       CHART_INTRO_MS + FAILURE_MS,
  reset:               CHART_INTRO_MS + FAILURE_MS + LATE_DELIVERY_MS,
};
const PHASE_DURATIONS: Record<PhaseId, number> = {
  chart_intro:         CHART_INTRO_MS,
  traditional_failure: FAILURE_MS,
  late_delivery:       LATE_DELIVERY_MS,
  reset:               RESET_MS,
};

function phaseStart(id: PhaseId): number { return PHASE_STARTS[id]; }
function phaseProgress(id: PhaseId, elapsed: number): number {
  const s = PHASE_STARTS[id];
  const d = PHASE_DURATIONS[id];
  if (elapsed < s) return 0;
  if (elapsed > s + d) return 1;
  return (elapsed - s) / d;
}
function currentPhase(elapsed: number): PhaseId {
  if (elapsed < PHASE_STARTS.traditional_failure) return 'chart_intro';
  if (elapsed < PHASE_STARTS.late_delivery)       return 'traditional_failure';
  if (elapsed < PHASE_STARTS.reset)               return 'late_delivery';
  return 'reset';
}

// ===== Schedule geometry =====
const FAB_PLANNED_LENGTH = (() => {
  const f = traditionalScenario.bars.find(b => b.id === 'fab')!;
  return f.end - f.start;
})();
const LATE_BAR2_END = BAR_LOCK_AT_CURSOR + FAB_PLANNED_LENGTH;

const ROW_HEIGHT_PCT     = 11;
const ROW_GAP_PCT        = 2;
const ROW_TOP_OFFSET_PCT = 15;
const TIMELINE_LEFT_PCT  = 22;
const TIMELINE_RIGHT_PCT = 6;
const TIMELINE_WIDTH_PCT = 100 - TIMELINE_LEFT_PCT - TIMELINE_RIGHT_PCT;

const STAGE_COLORS = [
  { bar: 'rgba(100,116,139,0.35)', border: 'rgba(148,163,184,0.55)', text: 'rgba(226,232,240,0.9)' },
  { bar: 'rgba(245,158,11,0.32)',  border: 'rgba(245,158,11,0.85)',  text: 'rgba(254,243,199,0.95)' },
  { bar: 'rgba(220,38,38,0.34)',   border: 'rgba(220,38,38,0.85)',   text: 'rgba(254,226,226,0.95)' },
];

function timelineX(frac: number, max: number = 1): number {
  return TIMELINE_LEFT_PCT + (Math.max(0, Math.min(max, frac)) / max) * TIMELINE_WIDTH_PCT;
}
function rowY(row: number): number {
  return ROW_TOP_OFFSET_PCT + row * (ROW_HEIGHT_PCT + ROW_GAP_PCT);
}
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// Quintic ease — zero first and second derivative at both ends. Gentler than
// smoothstep for visual motion that should arrive and depart without any jolt.
function smootherstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

const NOTE_FADE_MS = 320;

// ===== Package card =====
const PACKAGE_CARD_FADE_IN_MS    = 600;
const PACKAGE_CARD_FADE_OUT_MS   = 350;
const PACKAGE_CARD_FADE_IN_AT_MS = 350;
const CARD_TITLE_TOP_PCT  = 14;
const CARD_CENTER_TOP_PCT = 50;

// Fractions tuned so chart-fade and slide+morph keep their original wall-clock
// durations (~880ms and ~1520ms) while linger lasts ~3400ms and the final
// fade-out runs ~1200ms.
const RESET_CHART_FADE_END  = 0.126;
const RESET_SLIDE_MORPH_END = 0.343;
const RESET_LINGER_END      = 0.829;

function noteArrivalTimes(): number[] {
  const triggers = traditionalScenario.failureNotes.map(n => n.trigger);
  const endPos = LATE_BAR2_END;
  const totalPauseMs = triggers.length * TRADITIONAL_PAUSE_MS;
  const totalMotionMs = Math.max(0, FAILURE_MOTION_BUDGET_MS - totalPauseMs);
  const checkpoints = [0, ...triggers, endPos];
  const segDurs: number[] = [];
  for (let i = 1; i < checkpoints.length; i++) {
    segDurs.push(totalMotionMs * ((checkpoints[i] - checkpoints[i - 1]) / endPos));
  }
  const arrivals: number[] = [];
  let t = FAILURE_PRE_ROLL_MS + FAILURE_CURSOR_FADE_MS;
  for (let i = 0; i < triggers.length; i++) {
    t += segDurs[i];
    arrivals.push(t);
    t += TRADITIONAL_PAUSE_MS;
  }
  return arrivals;
}

interface PackageCardState {
  idx: number;
  opacity: number;
  slideY: number;
  morphT: number;
}

function computePackageState(phase: PhaseId, elapsed: number): PackageCardState {
  const packages = traditionalScenario.procurementPackages;
  const lastIdx = packages.length - 1;
  const consequenceIdx = lastIdx;
  const failureLastIdx = lastIdx - 1;

  if (phase === 'chart_intro') {
    return { idx: 0, opacity: 0, slideY: 0, morphT: 0 };
  }

  if (phase === 'traditional_failure') {
    const elapsedInFailure = elapsed - phaseStart('traditional_failure');
    const arrivals = noteArrivalTimes();

    if (elapsedInFailure < PACKAGE_CARD_FADE_IN_MS) {
      return { idx: 0, opacity: elapsedInFailure / PACKAGE_CARD_FADE_IN_MS, slideY: 0, morphT: 0 };
    }

    const numTransitions = Math.min(failureLastIdx, arrivals.length);
    for (let i = 0; i < numTransitions; i++) {
      const arrival = arrivals[i];
      const fadeOutStart = arrival - PACKAGE_CARD_FADE_OUT_MS;
      const fadeInEnd = arrival + PACKAGE_CARD_FADE_IN_AT_MS;

      if (elapsedInFailure < fadeOutStart) {
        return { idx: i, opacity: 1, slideY: 0, morphT: 0 };
      }
      if (elapsedInFailure < arrival) {
        return { idx: i, opacity: 1 - (elapsedInFailure - fadeOutStart) / PACKAGE_CARD_FADE_OUT_MS, slideY: 0, morphT: 0 };
      }
      if (elapsedInFailure < fadeInEnd) {
        return { idx: i + 1, opacity: (elapsedInFailure - arrival) / PACKAGE_CARD_FADE_IN_AT_MS, slideY: 0, morphT: 0 };
      }
    }

    return { idx: failureLastIdx, opacity: 1, slideY: 0, morphT: 0 };
  }

  if (phase === 'late_delivery') {
    const elapsedInLate = elapsed - phaseStart('late_delivery');
    if (elapsedInLate < PACKAGE_CARD_FADE_OUT_MS) {
      return { idx: failureLastIdx, opacity: 1 - elapsedInLate / PACKAGE_CARD_FADE_OUT_MS, slideY: 0, morphT: 0 };
    }
    const intoFadeIn = elapsedInLate - PACKAGE_CARD_FADE_OUT_MS;
    if (intoFadeIn < PACKAGE_CARD_FADE_IN_AT_MS) {
      return { idx: consequenceIdx, opacity: intoFadeIn / PACKAGE_CARD_FADE_IN_AT_MS, slideY: 0, morphT: 0 };
    }
    return { idx: consequenceIdx, opacity: 1, slideY: 0, morphT: 0 };
  }

  // reset
  const p = phaseProgress('reset', elapsed);
  let slideY = 0;
  let opacity = 1;
  let morphT = 0;
  if (p < RESET_CHART_FADE_END) {
    slideY = 0;
  } else if (p < RESET_SLIDE_MORPH_END) {
    const t = smootherstep((p - RESET_CHART_FADE_END) / (RESET_SLIDE_MORPH_END - RESET_CHART_FADE_END));
    slideY = t;
    morphT = t;
  } else if (p < RESET_LINGER_END) {
    slideY = 1;
    morphT = 1;
  } else {
    slideY = 1;
    morphT = 1;
    opacity = Math.max(0, 1 - (p - RESET_LINGER_END) / (1 - RESET_LINGER_END));
  }
  return { idx: consequenceIdx, opacity, slideY, morphT };
}

function PackageTitleCard({
  name, opacity, hideCaption = false, morphT = 0,
}: {
  name: string;
  opacity: number;
  hideCaption?: boolean;
  morphT?: number;
}) {
  if (opacity <= 0.001) return null;

  const chromeOpacity = Math.max(0, 1 - morphT * 1.4);
  const textSizeRem = 1.25 + morphT * 0.5;
  const r = Math.round(254 + (252 - 254) * morphT);
  const g = Math.round(243 + (211 - 243) * morphT);
  const b = Math.round(199 + (77 - 199) * morphT);
  const textColor = `rgb(${r}, ${g}, ${b})`;
  const textShadow = morphT > 0.05
    ? `0 0 ${4 + morphT * 6}px rgba(245, 158, 11, ${0.10 + morphT * 0.15})`
    : 'none';

  return (
    <div
      className="relative inline-flex items-center gap-3 pl-4 pr-5 py-2 rounded-md backdrop-blur-sm border"
      style={{
        opacity,
        background: `rgba(15, 23, 42, ${0.85 * chromeOpacity})`,
        borderColor: `rgba(245, 158, 11, ${0.40 * chromeOpacity})`,
        boxShadow: `0 4px 24px rgba(0, 0, 0, ${0.4 * chromeOpacity})`,
      }}
    >
      <span
        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-l"
        style={{ background: `rgba(251, 191, 36, ${0.80 * chromeOpacity})` }}
      />
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: `rgba(251, 191, 36, ${chromeOpacity})`,
          boxShadow: `0 0 10px rgba(245, 158, 11, ${0.70 * chromeOpacity})`,
        }}
      />
      {hideCaption ? (
        <span
          className="font-semibold tracking-tight whitespace-nowrap"
          style={{ fontSize: `${textSizeRem}rem`, color: textColor, textShadow, lineHeight: 1.1 }}
        >
          {name}
        </span>
      ) : (
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[9px] uppercase tracking-[0.2em] text-amber-300/60 font-medium">
            Procurement Package
          </span>
          <span className="text-base md:text-lg font-semibold text-amber-100 tracking-tight whitespace-nowrap">
            {name}
          </span>
        </span>
      )}
    </div>
  );
}

function computeFailureCursor(elapsedInPhase: number): {
  x: number;
  cursorOpacity: number;
  noteOpacity: number[];
} {
  const triggers = traditionalScenario.failureNotes.map(n => n.trigger);
  const endPos = LATE_BAR2_END;
  const totalPauseMs = triggers.length * TRADITIONAL_PAUSE_MS;
  const totalMotionMs = Math.max(0, FAILURE_MOTION_BUDGET_MS - totalPauseMs);
  const noteOpacity = triggers.map(() => 0);

  // Cursor fades in at position 0 in unison with the first package card.
  if (elapsedInPhase < FAILURE_CURSOR_FADE_MS) {
    return { x: 0, cursorOpacity: elapsedInPhase / FAILURE_CURSOR_FADE_MS, noteOpacity };
  }

  if (elapsedInPhase < FAILURE_PRE_ROLL_MS + FAILURE_CURSOR_FADE_MS) {
    return { x: 0, cursorOpacity: 1, noteOpacity };
  }

  const elapsedAfterFade = elapsedInPhase - FAILURE_PRE_ROLL_MS - FAILURE_CURSOR_FADE_MS;

  const checkpoints = [0, ...triggers, endPos];
  const segLengths: number[] = [];
  for (let i = 1; i < checkpoints.length; i++) {
    segLengths.push(checkpoints[i] - checkpoints[i - 1]);
  }

  let timeAccum = 0;
  let posAccum = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const segLen = segLengths[i];
    const segDur = totalMotionMs * (segLen / endPos);

    if (elapsedAfterFade < timeAccum + segDur) {
      const t = (elapsedAfterFade - timeAccum) / segDur;
      const eased = t * t * (3 - 2 * t);
      const x = posAccum + segLen * eased;

      if (i < triggers.length) {
        const timeUntilPause = (timeAccum + segDur) - elapsedAfterFade;
        if (timeUntilPause < NOTE_FADE_MS) {
          noteOpacity[i] = 1 - timeUntilPause / NOTE_FADE_MS;
        }
      }
      if (i > 0) {
        const timeSinceDeparture = elapsedAfterFade - timeAccum;
        if (timeSinceDeparture < NOTE_FADE_MS) {
          noteOpacity[i - 1] = 1 - timeSinceDeparture / NOTE_FADE_MS;
        }
      }
      return { x, cursorOpacity: 1, noteOpacity };
    }
    timeAccum += segDur;
    posAccum += segLen;

    if (i < triggers.length) {
      if (elapsedAfterFade < timeAccum + TRADITIONAL_PAUSE_MS) {
        noteOpacity[i] = 1;
        return { x: posAccum, cursorOpacity: 1, noteOpacity };
      }
      timeAccum += TRADITIONAL_PAUSE_MS;
    }
  }
  return { x: endPos, cursorOpacity: 1, noteOpacity };
}

function TraditionalGantt({ phase, elapsed }: { phase: PhaseId; elapsed: number }) {
  const elapsedInFailure = elapsed - phaseStart('traditional_failure');
  const emptyOpacity = traditionalScenario.failureNotes.map(() => 0);
  const failureCursor = phase === 'traditional_failure'
    ? computeFailureCursor(elapsedInFailure)
    : {
        x: phase === 'late_delivery' || phase === 'reset' ? LATE_BAR2_END : 0,
        cursorOpacity: phase === 'late_delivery' ? 1 : 0,
        noteOpacity: emptyOpacity,
      };

  const cursorX = (() => {
    if (phase === 'chart_intro') return 0;
    if (phase === 'traditional_failure') return failureCursor.x;
    if (phase === 'late_delivery' || phase === 'reset') return LATE_BAR2_END;
    return 0;
  })();

  const cursorOpacity = failureCursor.cursorOpacity;
  const noteOpacities = failureCursor.noteOpacity;
  const showCursor = phase === 'traditional_failure' || phase === 'late_delivery';
  const cursorBeyondOnsite = cursorX > 0.92;

  const planned = {
    buyoutEnd: traditionalScenario.bars.find(b => b.id === 'buyout')!.end,
    fabLength: (() => {
      const f = traditionalScenario.bars.find(b => b.id === 'fab')!;
      return f.end - f.start;
    })(),
    bufferStart: traditionalScenario.bars.find(b => b.id === 'buffer')!.start,
    onsite: traditionalScenario.onsite.position,
  };

  const dyn = (() => {
    const buyoutEnd = Math.max(planned.buyoutEnd, Math.min(cursorX, BAR_LOCK_AT_CURSOR));
    const fabStart = buyoutEnd;
    const fabEnd = fabStart + planned.fabLength;
    const bufferStart = Math.max(planned.bufferStart, fabEnd);
    const bufferWidth = Math.max(0, planned.onsite - bufferStart);
    return { buyoutEnd, fabStart, fabEnd, bufferStart, bufferWidth };
  })();

  const dynamicBarStage = (id: string): 0 | 1 | 2 => {
    if (id === 'buyout') {
      if (cursorX <= 0) return 0;
      if (cursorX > planned.buyoutEnd) return 2;
      return 1;
    }
    if (id === 'fab') {
      if (cursorX < planned.buyoutEnd) return 0;
      if (dyn.fabEnd > planned.onsite) return 2;
      return 1;
    }
    return dyn.bufferStart > planned.bufferStart ? 1 : 0;
  };

  const TMAX = LATE_BAR2_END;

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute h-px bg-slate-500/30"
        style={{ left: `${TIMELINE_LEFT_PCT}%`, width: `${TIMELINE_WIDTH_PCT}%`, top: `${rowY(4) - 2}%` }}
      />

      {traditionalScenario.bars.map(bar => {
        const stage = dynamicBarStage(bar.id);
        const colors = STAGE_COLORS[stage];

        let visibleStart = 0;
        let visibleWidth = 0;
        if (bar.id === 'buyout') {
          visibleStart = 0;
          visibleWidth = dyn.buyoutEnd;
        } else if (bar.id === 'fab') {
          visibleStart = dyn.fabStart;
          visibleWidth = dyn.fabEnd - dyn.fabStart;
        } else if (bar.id === 'buffer') {
          visibleStart = dyn.bufferStart;
          visibleWidth = dyn.bufferWidth;
        }
        const left = timelineX(visibleStart, TMAX);
        const width = (visibleWidth / TMAX) * TIMELINE_WIDTH_PCT;

        return (
          <div key={bar.id} className="absolute" style={{ top: `${rowY(bar.row)}%`, left: 0, right: 0, height: `${ROW_HEIGHT_PCT}%` }}>
            <div
              className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 pr-3 text-right"
              style={{ left: 0, width: `${TIMELINE_LEFT_PCT - 1}%` }}
            >
              {bar.label}
            </div>
            {visibleWidth > 0.001 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-[3px] border transition-colors duration-300 flex items-center px-2 overflow-hidden"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  height: '60%',
                  background: colors.bar,
                  borderColor: colors.border,
                }}
              >
                {bar.isBuffer && (
                  <span className="text-[10px] font-medium tracking-wide uppercase opacity-80 whitespace-nowrap" style={{ color: colors.text }}>
                    Buffer
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute" style={{ top: `${rowY(traditionalScenario.onsite.row)}%`, left: 0, right: 0, height: `${ROW_HEIGHT_PCT}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 pr-3 text-right"
          style={{ left: 0, width: `${TIMELINE_LEFT_PCT - 1}%` }}>
          {traditionalScenario.onsite.label}
        </div>
        <div
          className="absolute top-1/2"
          style={{
            left: `calc(${timelineX(traditionalScenario.onsite.position, TMAX)}% - 7px)`,
            transform: 'translateY(-50%) rotate(45deg)',
            width: '14px', height: '14px',
            background: cursorBeyondOnsite ? 'rgba(220,38,38,0.85)' : 'rgba(148,163,184,0.6)',
            border: '1.5px solid',
            borderColor: cursorBeyondOnsite ? 'rgba(254,226,226,0.95)' : 'rgba(203,213,225,0.85)',
            transition: 'background 400ms, border-color 400ms',
          }}
        />
      </div>

      {showCursor && cursorOpacity > 0.001 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${ROW_TOP_OFFSET_PCT}%`,
            left: `calc(${timelineX(cursorX, TMAX)}% - 1px)`,
            width: '2px',
            height: '56%',
            opacity: cursorOpacity,
            background: cursorBeyondOnsite
              ? 'linear-gradient(to bottom, rgba(220,38,38,0.95), rgba(220,38,38,0.55))'
              : 'linear-gradient(to bottom, rgba(253,224,71,0.95), rgba(245,158,11,0.55))',
            boxShadow: cursorBeyondOnsite ? '0 0 12px rgba(220,38,38,0.45)' : '0 0 12px rgba(245,158,11,0.4)',
          }}
        />
      )}

      {traditionalScenario.failureNotes.map((note, i) => (
        <FailureNoteBubble key={i} note={note} opacity={noteOpacities[i]} timelineMax={TMAX} />
      ))}

      {(phase === 'late_delivery' || phase === 'reset') && (
        <div
          className="absolute pointer-events-none whitespace-nowrap text-[11px] font-semibold text-red-300"
          style={{
            left: `${timelineX(LATE_BAR2_END, TMAX)}%`,
            top: `${rowY(traditionalScenario.lateNote.row) + ROW_HEIGHT_PCT - 1}%`,
            opacity: phase === 'late_delivery'
              ? Math.min(1, phaseProgress('late_delivery', elapsed) * 4)
              : Math.max(0, 1 - phaseProgress('reset', elapsed) * 2),
            transform: 'translate(calc(-100% - 8px), 0)',
            textShadow: '0 0 8px rgba(248,113,113,0.45)',
          }}
        >
          {traditionalScenario.lateNote.text}
          <span className="inline-block w-1 h-1 ml-1.5 rounded-full bg-red-300 align-middle" />
        </div>
      )}
    </div>
  );
}

function FailureNoteBubble({
  note, opacity, timelineMax,
}: {
  note: { text: string; trigger: number; row: number };
  opacity: number;
  timelineMax: number;
}) {
  if (opacity <= 0.001) return null;
  const left = timelineX(note.trigger, timelineMax);
  const top = rowY(note.row) + ROW_HEIGHT_PCT - 1;

  return (
    <div
      className="absolute pointer-events-none whitespace-nowrap text-[11px] font-medium text-amber-200/95"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity,
        transform: 'translateX(-2px)',
        textShadow: '0 0 8px rgba(245,158,11,0.4)',
      }}
    >
      <span className="inline-block w-1 h-1 mr-1.5 rounded-full bg-amber-300 align-middle" />
      {note.text}
    </div>
  );
}

function ScheduleStage({ elapsed }: { elapsed: number }) {
  const phase = currentPhase(elapsed);
  const packageState = computePackageState(phase, elapsed);
  const packages = traditionalScenario.procurementPackages;

  const chartOpacity = (() => {
    if (phase === 'chart_intro') return Math.min(1, elapsed / CHART_INTRO_MS);
    if (phase === 'traditional_failure' || phase === 'late_delivery') return 1;
    // reset — chart fades out during the first RESET_CHART_FADE_END portion
    const p = phaseProgress('reset', elapsed);
    return Math.max(0, 1 - p / RESET_CHART_FADE_END);
  })();

  return (
    <div className="absolute inset-0">
      {packageState.opacity > 0.001 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${CARD_TITLE_TOP_PCT + packageState.slideY * (CARD_CENTER_TOP_PCT - CARD_TITLE_TOP_PCT)}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <PackageTitleCard
            name={packages[packageState.idx]}
            opacity={packageState.opacity}
            hideCaption={packageState.idx === packages.length - 1}
            morphT={packageState.morphT}
          />
        </div>
      )}

      {/* Chart area inset from the player frame edges */}
      <div className="absolute left-0 right-0 px-4 md:px-8" style={{ top: '60px', bottom: '20px' }}>
        <div className="relative max-w-6xl mx-auto h-full">
          <div className="absolute inset-0" style={{ opacity: chartOpacity }}>
            <TraditionalGantt phase={phase} elapsed={elapsed} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Section + player =====

type Playback = 'initial' | 'playing' | 'paused' | 'ended';

export default function ProcurementFailureSection() {
  const [elapsed, setElapsed] = useState(0);
  const [playback, setPlayback] = useState<Playback>('initial');
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (playback !== 'playing') { lastFrameRef.current = null; return; }
    const step = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      setElapsed(prev => {
        const next = prev + delta;
        if (next >= TOTAL_MS) { setPlayback('ended'); return TOTAL_MS; }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [playback]);

  const handlePlay = () => {
    if (playback === 'ended') setElapsed(0);
    setPlayback('playing');
  };
  const handlePause = () => setPlayback('paused');

  const progress = elapsed / TOTAL_MS;

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
          Most Procurement Schedules Hide the Real Risks
        </h2>
        <div className="text-lg text-slate-600 leading-relaxed space-y-5">
          <p>Most schedules show a clean sequence: buyout, fabrication, delivery, onsite.</p>
          <p>
            What they don't show is everything that quietly impacts each phase — the design
            that wasn't ready, specifications that were not complete, buyout that took more
            time, extra review cycles, the buffers that get consumed without anyone noticing.
          </p>
          <p className="text-slate-900 font-medium">
            The result: late deliveries that didn't have to happen.
          </p>
        </div>
        <p className="text-sm text-slate-500 italic mt-6">
          Press play to watch a planned procurement schedule meet reality.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div
          className="relative bg-[#030a19] border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col select-none"
          style={{ aspectRatio: '2 / 1' }}
        >
          <div className="h-7 px-4 flex items-center bg-slate-800/90 border-b border-slate-700 text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-300">
            Traditional Procurement Schedule
          </div>

          <div className="flex-1 relative">
            <ScheduleStage elapsed={elapsed} />
          </div>

          <div className="relative h-1 bg-slate-800">
            <div className="absolute inset-y-0 left-0 bg-amber-500" style={{ width: `${progress * 100}%` }} />
          </div>

          {/* Always mounted so playback → ended fades the Replay overlay in
              (instead of mounting it in a single frame). pointer-events-none
              while hidden so it never steals clicks. */}
          <button
            type="button"
            onClick={handlePlay}
            className={`absolute inset-0 flex items-center justify-center group bg-black/30 backdrop-blur-[2px] transition-opacity duration-500 ${
              playback === 'initial' || playback === 'ended'
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label={playback === 'ended' ? 'Replay' : 'Play'}
            aria-hidden={playback !== 'initial' && playback !== 'ended'}
            tabIndex={playback === 'initial' || playback === 'ended' ? 0 : -1}
          >
            <span className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white shadow-2xl flex items-center justify-center transition">
              <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
            </span>
            {playback === 'ended' && (
              <span className="absolute bottom-10 text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">
                Replay
              </span>
            )}
          </button>

          {(playback === 'playing' || playback === 'paused') && (
            <button
              type="button"
              onClick={playback === 'playing' ? handlePause : handlePlay}
              className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition"
              aria-label={playback === 'playing' ? 'Pause' : 'Play'}
            >
              {playback === 'playing'
                ? <Pause className="w-4 h-4" fill="currentColor" />
                : <Play  className="w-4 h-4 ml-0.5" fill="currentColor" />
              }
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
