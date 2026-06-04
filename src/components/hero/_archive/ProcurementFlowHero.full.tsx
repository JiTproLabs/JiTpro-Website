// Procurement failure hero.
//
// Phases (in order, see heroAnimationData.PHASES for durations):
//   1. traditional_intro    — chart + title fade in
//   2. traditional_failure  — time cursor traverses the simplified plan, failure notes appear,
//                             bar 1 extends past its planned end, bar 2 is pushed and locked once
//                             cursor passes BAR_LOCK_AT_CURSOR, buffer is consumed
//   3. late_delivery        — brief dwell at the end of the (now late) bar 2
//   4. reset                — chart fades out, house begins fading in
//   5. final_hero           — hero copy fades in over the fully-visible house
//
// The detailed-Gantt → compressed-bar JiTpro animation that used to follow this
// one has been moved to _archive/JitproGanttAnimation.tsx for reuse elsewhere.
//
// Adjust pacing in heroAnimationData.PHASES. Adjust labels in traditionalScenario there too.
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MobileHeroSequence from './MobileHeroSequence.full';
import {
  TOTAL_MS, TRADITIONAL_PAUSE_MS,
  FAILURE_PRE_ROLL_MS, FAILURE_CURSOR_FADE_MS, FAILURE_MOTION_BUDGET_MS,
  BAR_LOCK_AT_CURSOR,
  introOpacities,
  phaseStart, currentPhase, phaseProgress,
  traditionalScenario, HERO_MIN_HEIGHT, heroCopy,
  type PhaseId,
} from '../../../content/heroAnimationData';

// Derived geometry — bar 2 length comes from the planned data and combines with
// the lock position to determine where the cursor (and bar 2's right edge) end up.
const FAB_PLANNED_LENGTH = (() => {
  const f = traditionalScenario.bars.find(b => b.id === 'fab')!;
  return f.end - f.start;
})();
const LATE_BAR2_END = BAR_LOCK_AT_CURSOR + FAB_PLANNED_LENGTH;

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

// Per-page-load "already played" flag (module-level, not persisted).
// Resets when the JS bundle reloads — i.e., on any page refresh — so a refresh
// of the homepage replays the animation. Persists across SPA navigation, so
// returning to the homepage via an internal Link finds the flag set and skips.
let heroPlayedThisLoad = false;

// ===== Visual constants =====

const ROW_HEIGHT_PCT = 11;       // % of gantt area per row
const ROW_GAP_PCT    = 2;        // % gap between rows
/** Top offset positions the bar block in the upper portion of the chart area
 *  (optical-center territory, ~42% from top), matching where the hero copy
 *  appears after fade-in. */
const ROW_TOP_OFFSET_PCT = 15;
const TIMELINE_LEFT_PCT  = 22;   // left padding for row labels
const TIMELINE_RIGHT_PCT = 6;    // right padding for breathing room
const TIMELINE_WIDTH_PCT = 100 - TIMELINE_LEFT_PCT - TIMELINE_RIGHT_PCT;

const STAGE_COLORS = [
  // 0 = neutral (planned)
  { bar: 'rgba(100,116,139,0.35)', border: 'rgba(148,163,184,0.55)', text: 'rgba(226,232,240,0.9)' },
  // 1 = warning (cursor inside / risk emerging)
  { bar: 'rgba(245,158,11,0.32)',  border: 'rgba(245,158,11,0.85)',  text: 'rgba(254,243,199,0.95)' },
  // 2 = critical (cursor past planned end / failure)
  { bar: 'rgba(220,38,38,0.34)',   border: 'rgba(220,38,38,0.85)',   text: 'rgba(254,226,226,0.95)' },
];

/**
 * Convert timeline fraction (0..max) into absolute % across the section, accounting for label padding.
 * Default max = 1 (used by JiTpro scenarios). The traditional Gantt passes
 * LATE_BAR2_END so the visible chart area expands to include Bar 2's overshoot.
 */
function timelineX(frac: number, max: number = 1): number {
  return TIMELINE_LEFT_PCT + (Math.max(0, Math.min(max, frac)) / max) * TIMELINE_WIDTH_PCT;
}

/** Row Y position (% from top of gantt area) for the given row index. */
function rowY(row: number): number {
  return ROW_TOP_OFFSET_PCT + row * (ROW_HEIGHT_PCT + ROW_GAP_PCT);
}

// ===== Main hero =====

export default function ProcurementFlowHero() {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  // Read the module-level flag synchronously so the first render already knows
  // whether to skip. On a fresh page load the flag is false (animation plays);
  // on SPA re-mount after returning to the homepage the flag is true (skipped).
  const [skipped, setSkipped] = useState(() => heroPlayedThisLoad);
  // Bumping this re-runs the rAF effect — used to restart the animation from
  // zero when the user clicks Replay (state-change-based dependency).
  const [replayKey, setReplayKey] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!skipped) heroPlayedThisLoad = true;
  }, [skipped]);

  // Drive elapsed via requestAnimationFrame
  useEffect(() => {
    if (reducedMotion || skipped) {
      setElapsed(TOTAL_MS);
      return;
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(Math.min(e, TOTAL_MS));
      if (e < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [reducedMotion, skipped, replayKey]);

  const handleReplay = () => {
    setSkipped(false);
    setElapsed(0);
    setReplayKey(k => k + 1);
  };

  const phase = currentPhase(elapsed);

  // Mutually exclusive control buttons: Skip while playing, Replay when done.
  // `animationComplete` is true once the run has ended OR the user clicked Skip
  // (clicking Skip flips this immediately, before the rAF effect has had a
  // chance to push elapsed to TOTAL_MS — avoids a one-frame gap).
  const animationComplete = elapsed >= TOTAL_MS || skipped;
  const showSkip = !reducedMotion && !animationComplete && elapsed > 3000;
  const showReplay = !reducedMotion && animationComplete;

  // House fades in during reset (while the chart fades out); stays on through final_hero
  const houseOpacity = (() => {
    if (phase === 'reset') return phaseProgress('reset', elapsed) * 0.95;
    if (phase === 'final_hero') return 0.95;
    return 0;
  })();

  // Hero copy fades in during final_hero
  const heroCopyOpacity = phase === 'final_hero' ? phaseProgress('final_hero', elapsed) : 0;

  return (
    <>
      {/* Mobile — untouched */}
      <div className="lg:hidden">
        <MobileHeroSequence />
      </div>

      {/* Desktop hero */}
      <section
        className="relative overflow-hidden bg-[#030a19] hidden lg:block"
        style={{ minHeight: `${HERO_MIN_HEIGHT}px` }}
        aria-label="Procurement control hero animation"
      >
        {/* House background — hidden on mount; fades in during reset and stays through final_hero.
            `initial: { opacity: 0 }` paints opacity 0 on the very first frame so the image
            does not flash visible before the animation logic engages. */}
        <motion.div
          className="absolute right-0 bottom-0 pointer-events-none"
          style={{
            width: '42%', maxWidth: '620px',
            opacity: 0,
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: houseOpacity }}
          transition={{ duration: 0.5, ease: 'linear' }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
            alt="" aria-hidden="true"
            className="w-full h-auto object-contain"
            style={{ mixBlendMode: 'lighten' }}
          />
        </motion.div>

        {/* Gantt stage */}
        {!reducedMotion && <GanttStage phase={phase} elapsed={elapsed} />}

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030a19]/85 via-[#030a19]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030a19]/55 via-transparent to-[#030a19]/30 pointer-events-none" />

        {/* Hero copy — fades in during final_hero. Asymmetric padding on lg
            shifts the centered content to optical center (~42% from top) so it
            aligns with the animation's bar block. */}
        <div
          className="relative z-10 flex items-center justify-center px-6 py-24 md:py-32 lg:pt-20 lg:pb-40 pointer-events-none"
          style={{ minHeight: `${HERO_MIN_HEIGHT}px` }}
        >
          <div
            className="max-w-5xl mx-auto text-center"
            style={{ opacity: heroCopyOpacity }}
          >
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-300/90 mb-8 leading-relaxed">
              {heroCopy.eyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
              {heroCopy.headline}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {heroCopy.subhead}
            </p>
          </div>
        </div>

        {/* Skip animation control */}
        {showSkip && (
          <button
            onClick={() => setSkipped(true)}
            className="absolute top-5 right-5 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop-blur-sm"
          >
            Skip animation
          </button>
        )}

        {/* Replay animation control — mutually exclusive with Skip; occupies the same slot. */}
        {showReplay && (
          <button
            onClick={handleReplay}
            className="absolute top-5 right-5 z-30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-white/45 hover:text-white/85 border border-white/10 hover:border-white/30 rounded-full transition-colors bg-[#030a19]/40 backdrop-blur-sm"
          >
            Replay animation
          </button>
        )}
      </section>
    </>
  );
}

// ===== Gantt stage =====

interface GanttStageProps { phase: PhaseId; elapsed: number; }

function GanttStage({ phase, elapsed }: GanttStageProps) {
  const traditionalVisible = ['traditional_intro', 'traditional_failure', 'late_delivery', 'reset'].includes(phase);

  // During traditional_intro the title plays first (fade-in → read → chart fade-in → title fade-out).
  // After intro the title stays gone; the animation runs alone.
  const intro = phase === 'traditional_intro'
    ? introOpacities(elapsed - phaseStart('traditional_intro'))
    : null;

  const traditionalOpacity = (() => {
    if (intro) return intro.chart;
    if (phase === 'traditional_failure' || phase === 'late_delivery') return 1;
    if (phase === 'reset') {
      // Chart fades out during the first RESET_CHART_FADE_END portion of reset,
      // leaving the final card alone on screen for the slide-to-center beat.
      const p = phaseProgress('reset', elapsed);
      return Math.max(0, 1 - p / RESET_CHART_FADE_END);
    }
    return 0;
  })();

  const titleOpacity = (() => {
    if (intro) return intro.title;
    return 0; // title is faded out by the end of intro and stays gone
  })();

  const packageState = computePackageState(phase, elapsed);
  const packages = traditionalScenario.procurementPackages;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Title band — pt sized so the title sits just above the bar block (which starts at ROW_TOP_OFFSET_PCT).
          No CSS transition here; opacity is driven per-frame from phaseProgress so adding a transition
          would cause the same lag/catch-up jerk the hero copy had. */}
      <div className="absolute top-0 left-0 right-0 px-8 pt-24 pb-2">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-lg md:text-xl lg:text-2xl font-semibold text-amber-300/90 tracking-tight"
            style={{ opacity: titleOpacity }}
          >
            {traditionalScenario.title}
          </h2>
        </div>
      </div>

      {/* Procurement package card — sits at the title position (CARD_TITLE_TOP_PCT)
          during failure/late_delivery, then slides down to screen center during
          reset (slideY 0 → 1) before fading out. Anchored by its own center via
          translate(-50%, -50%) so the same `top` percentage centers it visually.
          The final (consequence) card drops the "Procurement Package" caption. */}
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

      {/* Chart area — opacity is rAF-driven; no CSS transition. */}
      <div className="absolute left-0 right-0 px-8" style={{ top: '90px', bottom: '90px' }}>
        <div className="relative max-w-6xl mx-auto h-full">
          {traditionalVisible && (
            <div className="absolute inset-0" style={{ opacity: traditionalOpacity }}>
              <TraditionalGantt phase={phase} elapsed={elapsed} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Scenario 1: Traditional Gantt =====

/** Window during which a note fades in/out around its pause. */
const NOTE_FADE_MS = 320;

// ===== Procurement package title cards =====
//
// A small "Procurement Package" card sits where the intro title was. The card
// appears AFTER the intro title has fully faded (i.e., at the start of the
// failure phase). One card per failure note, transitions are SEQUENTIAL:
//
//   • Card 1 fades in during the pre-roll so it is fully visible by the time
//     the cursor starts moving.
//   • Card N stays visible while the cursor approaches note N, then fades out
//     so it reaches zero exactly when the cursor arrives at note N.
//   • At that arrival moment, card N+1 begins fading in (from zero) and is
//     fully visible well before the cursor resumes motion toward note N+1.
//   • At most one card is on screen at any instant — they never overlap.
//   • The last card stays visible through late_delivery and fades out on reset.

const PACKAGE_CARD_FADE_IN_MS    = 600; // initial fade-in for the first card
const PACKAGE_CARD_FADE_OUT_MS   = 350; // fade-out before each stop (completes AT arrival)
const PACKAGE_CARD_FADE_IN_AT_MS = 350; // fade-in after each stop (starts AT arrival)
// Card vertical anchor positions (% of the GanttStage container). The card is
// translate(-50%, -50%)'d so these percentages position its center.
const CARD_TITLE_TOP_PCT  = 20; // sits where the intro title used to be
const CARD_CENTER_TOP_PCT = 50; // vertical center of the section (slide target)

/** Compute the cursor-arrival time (ms within the failure phase) for each note. */
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
  /** Which package is currently on screen (or transitioning). */
  idx: number;
  /** Opacity of that single card. Always 0 when no card is visible. */
  opacity: number;
  /** Slide progress 0..1 from the title position (0) to the screen center (1). */
  slideY: number;
  /** Morph progress 0..1. 0 = full card (chrome + small pale text). 1 = chrome
   *  fully dissolved, text scaled up and shifted to vivid amber. Only the
   *  consequence card morphs (during the final segment of reset). */
  morphT: number;
}

// Reset sub-stage boundaries (as fractions of the reset phase, currently 4000ms).
// The chart fades out first. Then the final card descends to center AND morphs
// simultaneously as one continuous motion: card chrome dissolves while the text
// scales up and shifts from pale amber-100 to vivid amber-300, reaching its
// fully-morphed amber state exactly when it arrives at center. The morphed
// amber text then lingers for a beat before fading out.
const RESET_CHART_FADE_END    = 0.22; // chart fully gone here          (~880ms)
const RESET_SLIDE_MORPH_END   = 0.60; // descent + morph both done here (~1520ms motion)
const RESET_LINGER_END        = 0.83; // morphed amber lingered until   (~920ms hold)
// 0.83 → 1.00: morphed (large amber) text fades out                    (~680ms fade)

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function computePackageState(phase: PhaseId, elapsed: number): PackageCardState {
  const packages = traditionalScenario.procurementPackages;
  const lastIdx = packages.length - 1;
  // The final ("consequence") card is the last entry in the package list. It
  // sits at the very end of the run: enters at the start of late_delivery,
  // persists through it, then slides to center and fades during reset. All
  // earlier cards cycle one-per-failure-note during traditional_failure.
  const consequenceIdx = lastIdx;
  const failureLastIdx = lastIdx - 1;

  if (phase === 'traditional_intro') {
    // Intro title owns this space — no card.
    return { idx: 0, opacity: 0, slideY: 0, morphT: 0 };
  }

  if (phase === 'traditional_failure') {
    const elapsedInFailure = elapsed - phaseStart('traditional_failure');
    const arrivals = noteArrivalTimes();

    // Card 1 initial fade-in (during pre-roll, before the cursor starts moving).
    if (elapsedInFailure < PACKAGE_CARD_FADE_IN_MS) {
      return { idx: 0, opacity: elapsedInFailure / PACKAGE_CARD_FADE_IN_MS, slideY: 0, morphT: 0 };
    }

    // Walk arrival transitions. Cards 0..failureLastIdx cycle through the
    // failure notes (one card per note). The consequence card is NOT in this
    // loop — it's introduced separately at the start of late_delivery.
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

    // After the final failure-note transition the last failure card persists
    // through the remainder of traditional_failure (cursor still moving toward
    // the late zone). It will fade out at the start of late_delivery.
    return { idx: failureLastIdx, opacity: 1, slideY: 0, morphT: 0 };
  }

  if (phase === 'late_delivery') {
    // At the very end of the run: the previous (final failure-note) card
    // fades out, then the consequence card fades in and stays.
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

  if (phase === 'reset') {
    const p = phaseProgress('reset', elapsed);
    // 0 → RESET_CHART_FADE_END:   card stays at title position while chart fades.
    // RESET_CHART_FADE_END → RESET_SLIDE_MORPH_END: one continuous motion —
    //   the same eased progress drives BOTH the descent to center (slideY) AND
    //   the morph (chrome dissolves, text scales up, color shifts amber), so
    //   they arrive together: the card reaches center exactly as it finishes
    //   transforming into the large amber message.
    // RESET_SLIDE_MORPH_END → RESET_LINGER_END: amber text holds at center.
    // RESET_LINGER_END → 1:                     amber text fades to 0.
    let slideY = 0;
    let opacity = 1;
    let morphT = 0;
    if (p < RESET_CHART_FADE_END) {
      slideY = 0;
    } else if (p < RESET_SLIDE_MORPH_END) {
      const t = smoothstep((p - RESET_CHART_FADE_END) / (RESET_SLIDE_MORPH_END - RESET_CHART_FADE_END));
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

  return { idx: 0, opacity: 0, slideY: 0, morphT: 0 };
}

function PackageTitleCard({
  name, opacity, hideCaption = false, morphT = 0,
}: {
  name: string;
  opacity: number;
  hideCaption?: boolean;
  /** 0 = default card. 1 = chrome fully dissolved, text scaled up + vivid amber. */
  morphT?: number;
}) {
  if (opacity <= 0.001) return null;

  // Chrome (bg, border, dot, accent strip, shadow) dissolves a bit ahead of
  // the text growth so the text feels like it's emerging from the dissolving
  // container rather than being unboxed all at once.
  const chromeOpacity = Math.max(0, 1 - morphT * 1.4);

  // Text size: 1.25rem (≈ text-xl) at rest → 2.5rem (≈ text-4xl) fully morphed,
  // so the text noticeably spills outward while staying on a single line.
  const textSizeRem = 1.25 + morphT * 1.25;

  // Color shift: amber-100 rgb(254,243,199) → amber-300 rgb(252,211,77).
  const r = Math.round(254 + (252 - 254) * morphT);
  const g = Math.round(243 + (211 - 243) * morphT);
  const b = Math.round(199 + (77 - 199) * morphT);
  const textColor = `rgb(${r}, ${g}, ${b})`;

  // Amber glow ramps in with the morph so the larger text reads "ignited".
  const textShadow = morphT > 0.05
    ? `0 0 ${8 + morphT * 22}px rgba(245, 158, 11, ${0.25 + morphT * 0.55})`
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
          style={{
            fontSize: `${textSizeRem}rem`,
            color: textColor,
            textShadow,
            lineHeight: 1.1,
          }}
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

/**
 * Piecewise "Today" cursor for the failure phase.
 *
 * The cursor smoothly traverses each motion segment between notes, then pauses
 * for TRADITIONAL_PAUSE_MS at the note (long enough to read), then continues.
 *
 * Returns the current cursor x plus a per-note opacity array. A note ramps from
 * 0 → 1 during the last NOTE_FADE_MS of the cursor's approach, holds at 1 during
 * the pause, and ramps from 1 → 0 during the first NOTE_FADE_MS of departure.
 */
function computeFailureCursor(elapsedInPhase: number): {
  x: number;
  cursorOpacity: number;
  noteOpacity: number[];
} {
  const triggers = traditionalScenario.failureNotes.map(n => n.trigger);
  // Cursor finishes the failure phase at the locked right edge of Bar 2 — well past
  // the original onsite milestone. The last note ("Original Onsite Date Missed")
  // sits at 0.92, so the final motion segment 0.92 → LATE_BAR2_END is where the
  // cursor visually slips past the planned date into late delivery.
  const endPos = LATE_BAR2_END;
  const totalPauseMs = triggers.length * TRADITIONAL_PAUSE_MS;
  const totalMotionMs = Math.max(0, FAILURE_MOTION_BUDGET_MS - totalPauseMs);
  const noteOpacity = triggers.map(() => 0);

  // Stage 1 — cursor fades in at position 0 in unison with the first package
  // card (both run from t=0 of the failure phase over FAILURE_CURSOR_FADE_MS).
  if (elapsedInPhase < FAILURE_CURSOR_FADE_MS) {
    return {
      x: 0,
      cursorOpacity: elapsedInPhase / FAILURE_CURSOR_FADE_MS,
      noteOpacity,
    };
  }

  // Stage 2 — cursor sits at full opacity at position 0 for the rest of the
  // pre-roll, giving the viewer time to read the chart before motion starts.
  if (elapsedInPhase < FAILURE_PRE_ROLL_MS + FAILURE_CURSOR_FADE_MS) {
    return { x: 0, cursorOpacity: 1, noteOpacity };
  }

  // Stage 3 — motion begins (cursor fully visible)
  const elapsedAfterFade = elapsedInPhase - FAILURE_PRE_ROLL_MS - FAILURE_CURSOR_FADE_MS;

  // Segments between checkpoints: [0 → n0, n0 → n1, ..., nk → endPos]
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

    // Motion segment i: cursor approaches checkpoint i (which is a note if i < triggers.length)
    if (elapsedAfterFade < timeAccum + segDur) {
      const t = (elapsedAfterFade - timeAccum) / segDur;
      const eased = t * t * (3 - 2 * t); // smoothstep — eases in/out of each rest
      const x = posAccum + segLen * eased;

      // Fade-in for the upcoming note (this segment terminates at a note)
      if (i < triggers.length) {
        const timeUntilPause = (timeAccum + segDur) - elapsedAfterFade;
        if (timeUntilPause < NOTE_FADE_MS) {
          noteOpacity[i] = 1 - timeUntilPause / NOTE_FADE_MS;
        }
      }
      // Fade-out for the previous note (this segment departed from it)
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

    // Pause at note i
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
  // Cursor x (0..~1.10 — overshoots past the onsite date during late_delivery)
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
    if (phase === 'traditional_intro') return 0;
    if (phase === 'traditional_failure') return failureCursor.x;
    // Cursor reached LATE_BAR2_END at end of failure phase; hold there during late_delivery / reset
    if (phase === 'late_delivery' || phase === 'reset') return LATE_BAR2_END;
    return 0;
  })();

  const cursorOpacity = failureCursor.cursorOpacity;
  const noteOpacities = failureCursor.noteOpacity;

  const showCursor = phase === 'traditional_failure' || phase === 'late_delivery';
  const cursorBeyondOnsite = cursorX > 0.92;

  // ===== Dynamic schedule slip =====
  // Bar 1 (Buyout) right edge follows the cursor once it passes the planned end.
  // Bar 2 (Fabrication) preserves its planned length but slides right with Bar 1.
  // Buffer shrinks from the left as Bar 2's end pushes into it. When the cursor
  // has pushed Bar 2's end past the onsite milestone, Bar 2 turns red (will be late).
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
    // Bar 1 right edge follows the cursor until BAR_LOCK_AT_CURSOR; from that
    // point on, Bar 1 (and therefore Bar 2's pushed position) is locked. The
    // cursor then continues alone, representing time slipping past the schedule.
    const buyoutEnd = Math.max(planned.buyoutEnd, Math.min(cursorX, BAR_LOCK_AT_CURSOR));
    const fabStart = buyoutEnd;
    const fabEnd = fabStart + planned.fabLength;
    const bufferStart = Math.max(planned.bufferStart, fabEnd);
    const bufferWidth = Math.max(0, planned.onsite - bufferStart);
    return { buyoutEnd, fabStart, fabEnd, bufferStart, bufferWidth };
  })();

  // Bar stage from the dynamic positions
  const dynamicBarStage = (id: string): 0 | 1 | 2 => {
    if (id === 'buyout') {
      if (cursorX <= 0) return 0;                        // planned, nothing happening yet
      if (cursorX > planned.buyoutEnd) return 2;         // running long → critical
      return 1;                                          // in progress
    }
    if (id === 'fab') {
      if (cursorX < planned.buyoutEnd) return 0;         // not yet shifted
      if (dyn.fabEnd > planned.onsite) return 2;         // shifted past onsite → critical
      return 1;                                          // shifted but recoverable
    }
    // buffer
    return dyn.bufferStart > planned.bufferStart ? 1 : 0;
  };

  // The traditional Gantt's timeline runs 0 → LATE_BAR2_END so that the late
  // overshoot of Bar 2 (past the original onsite milestone) stays within the visible chart.
  const TMAX = LATE_BAR2_END;

  return (
    <div className="relative w-full h-full">
      {/* Timeline baseline (axis) */}
      <div
        className="absolute h-px bg-slate-500/30"
        style={{ left: `${TIMELINE_LEFT_PCT}%`, width: `${TIMELINE_WIDTH_PCT}%`, top: `${rowY(4) - 2}%` }}
      />

      {/* Bars — positions are dynamic, driven by the cursor */}
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
            {/* Row label */}
            <div
              className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 pr-3 text-right"
              style={{ left: 0, width: `${TIMELINE_LEFT_PCT - 1}%` }}
            >
              {bar.label}
            </div>
            {/* Bar */}
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

      {/* Required Onsite Date milestone (diamond) */}
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

      {/* Time cursor — extends from the top of row 0 to ~1/4" below the axis line.
          With ROW_TOP_OFFSET_PCT=25 and axis at 75%, height 56% reaches ~6% past the axis. */}
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

      {/* Failure notes — opacity ramps in as the cursor approaches, holds during pause, ramps out as it leaves */}
      {traditionalScenario.failureNotes.map((note, i) => (
        <FailureNoteBubble key={i} note={note} opacity={noteOpacities[i]} timelineMax={TMAX} />
      ))}

      {/* Final consequence note — anchored at the cursor's terminal position, text extends left so it
          doesn't overflow the chart. Fades in during late_delivery, fades out during reset. */}
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

