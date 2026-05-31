// Hero animation data — two-scenario procurement story.
// Edit timing in PHASES (ms). Edit narrative notes in the scenario objects.
// Cursor positions and note triggers are expressed as fractions (0..1) of the
// active scenario's timeline width so the chart scales responsively.

export type PhaseId =
  | 'traditional_intro'
  | 'traditional_failure'
  | 'late_delivery'
  | 'reset'
  | 'final_hero';

export interface Phase {
  id: PhaseId;
  /** duration in milliseconds */
  duration: number;
}

/** Pause duration at each failure note in Scenario 1. The cursor stops here.
 *  Bump higher for more read time per note; lower for a snappier pace. */
export const TRADITIONAL_PAUSE_MS = 1300;

/**
 * Intro sub-stage timings. The intro plays as four back-to-back stages:
 *   1. INTRO_TITLE_FADE_IN_MS   — title fades in alone, chart hidden
 *   2. INTRO_TITLE_READ_MS      — title held at full opacity, chart still hidden (read time)
 *   3. INTRO_CHART_FADE_IN_MS   — chart fades in while title stays at full opacity
 *   4. INTRO_TITLE_FADE_OUT_MS  — title fades out, chart at full opacity
 * The traditional_intro phase duration is derived from these.
 */
export const INTRO_TITLE_FADE_IN_MS = 700;
export const INTRO_TITLE_READ_MS    = 2200;
export const INTRO_CHART_FADE_IN_MS = 900;
export const INTRO_TITLE_FADE_OUT_MS = 600;

/** Per-stage opacities for the intro, given ms elapsed inside traditional_intro. */
export function introOpacities(elapsedInIntro: number): { title: number; chart: number } {
  const s1 = INTRO_TITLE_FADE_IN_MS;
  const s2 = s1 + INTRO_TITLE_READ_MS;
  const s3 = s2 + INTRO_CHART_FADE_IN_MS;
  const s4 = s3 + INTRO_TITLE_FADE_OUT_MS;
  if (elapsedInIntro < s1) return { title: elapsedInIntro / INTRO_TITLE_FADE_IN_MS, chart: 0 };
  if (elapsedInIntro < s2) return { title: 1, chart: 0 };
  if (elapsedInIntro < s3) return { title: 1, chart: (elapsedInIntro - s2) / INTRO_CHART_FADE_IN_MS };
  if (elapsedInIntro < s4) return { title: 1 - (elapsedInIntro - s3) / INTRO_TITLE_FADE_OUT_MS, chart: 1 };
  return { title: 0, chart: 1 };
}

/**
 * Time the chart sits alone at the start of the failure phase, before the
 * "Today" cursor appears. Gives the visitor a moment to digest the chart.
 */
export const FAILURE_PRE_ROLL_MS = 2000;

/**
 * After the pre-roll, the "Today" cursor fades in at position 0 over this
 * duration. Motion begins once the fade-in completes.
 */
export const FAILURE_CURSOR_FADE_MS = 600;

/**
 * Combined time budget for motion + note pauses inside the failure phase
 * (i.e., everything after the cursor has finished fading in). Increase to
 * slow the cursor down further; the per-note pauses (TRADITIONAL_PAUSE_MS)
 * are absorbed from this budget so motion time scales accordingly.
 */
export const FAILURE_MOTION_BUDGET_MS = 21000;

/**
 * Once the cursor passes this position, Bar 1 (Buyout) stops extending and
 * Bar 2 (Fabrication) is locked in place. The cursor then continues alone,
 * showing time slipping past the locked schedule.
 * Tied conceptually to the trigger of the "Fabrication Starts Late" note.
 */
export const BAR_LOCK_AT_CURSOR = 0.72;

// Total ≈ 26.3s — single (traditional/failure) scenario only.
export const PHASES: Phase[] = [
  { id: 'traditional_intro',    duration: INTRO_TITLE_FADE_IN_MS + INTRO_TITLE_READ_MS + INTRO_CHART_FADE_IN_MS + INTRO_TITLE_FADE_OUT_MS },
  { id: 'traditional_failure',  duration: FAILURE_PRE_ROLL_MS + FAILURE_CURSOR_FADE_MS + FAILURE_MOTION_BUDGET_MS },
  { id: 'late_delivery',        duration: 2800 }, // dwell at terminal; lateNote is read here
  { id: 'reset',                duration: 4000 }, // chart fades, final card slides+morphs together (one motion), lingers as amber, fades out
  { id: 'final_hero',           duration: 2800 }, // hero text fades in over the house
];

export const TOTAL_MS = PHASES.reduce((s, p) => s + p.duration, 0);

export function phaseStart(id: PhaseId): number {
  let t = 0;
  for (const p of PHASES) {
    if (p.id === id) return t;
    t += p.duration;
  }
  return t;
}

export function phaseDuration(id: PhaseId): number {
  return PHASES.find(p => p.id === id)?.duration ?? 0;
}

/** Returns 0..1 progress within the given phase based on global elapsed ms. */
export function phaseProgress(id: PhaseId, elapsed: number): number {
  const start = phaseStart(id);
  const dur = phaseDuration(id);
  if (elapsed < start) return 0;
  if (elapsed > start + dur) return 1;
  return (elapsed - start) / dur;
}

export function currentPhase(elapsed: number): PhaseId {
  let t = 0;
  for (const p of PHASES) {
    if (elapsed < t + p.duration) return p.id;
    t += p.duration;
  }
  return 'final_hero';
}

// ===== Scenario 1: Traditional / Failure =====

export interface TraditionalBar {
  id: string;
  label: string;
  /** 0..1 position on the timeline */
  start: number;
  end: number;
  /** which y-row (0 = top) */
  row: number;
  isBuffer?: boolean;
}

export interface FailureNote {
  text: string;
  /** cursor position (0..1) at which this note becomes visible */
  trigger: number;
  /** anchor row for placement */
  row: number;
}

export const traditionalScenario = {
  title: 'Procurement looks manageable. Until time exposes what the plan missed.',
  bars: [
    { id: 'buyout', label: 'Buyout / Submittal / Approval', start: 0.00, end: 0.32, row: 0 },
    { id: 'fab',    label: 'Fabrication / Delivery',        start: 0.32, end: 0.78, row: 1 },
    { id: 'buffer', label: 'Buffer',                        start: 0.78, end: 0.92, row: 2, isBuffer: true },
  ] as TraditionalBar[],
  onsite: { label: 'Required Onsite Date', position: 0.92, row: 3 },
  failureNotes: [
    { text: 'Subcontract Buyout Takes Longer Than Planned', trigger: 0.08, row: 0 },
    { text: 'Submittals Stall Due to Incomplete Design',       trigger: 0.20, row: 0 },
    { text: 'Fabrication Start Dates Continually Missed',         trigger: 0.32, row: 0 },
    { text: 'Buffers Vanish',                      trigger: 0.46, row: 0 },
    { text: 'Multiple Rounds of Review',        trigger: 0.58, row: 0 },
    { text: 'Fabrication Starts Late',          trigger: 0.72, row: 0 },
    { text: 'Original Onsite Date Missed',      trigger: 0.92, row: 0 },
  ] as FailureNote[],
  // Procurement package names shown in the title card above the chart. One per
  // failure note, in order. The first package is shown during intro and through
  // the first note's pause; each subsequent note swaps in the next package,
  // visualizing multiple packages each struggling through procurement.
  procurementPackages: [
    'Structural Steel Package',
    'Steel Windows & Doors',
    'Electrical Switch Gear',
    'Plumbing Rough-In Package',
    'Statuary Marble Slabs',
    'Cabinet Submittal',
    'Swimming Pool',
    'Interior Finishes',
    'Procurement Delays Compound. Margin Disappears.',
  ],
  // Shown after the cursor reaches its terminal position (end of the late bar 2),
  // during the late_delivery dwell. The final consequence beat.
  lateNote: { text: 'Late Material Delivery Impacts Downstream Work', row: 0 },
};

// The JiTpro detailed Gantt + compressed bar animation that used to live here
// has been archived to src/components/hero/_archive/JitproGanttAnimation.tsx
// for reuse on other pages.

export const HERO_MIN_HEIGHT = 560;
