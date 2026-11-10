/**
 * The Plan tab's visual: the scene, its one timeline and its camera (Design
 * System Section 54.4.2). PURE: no DOM, no React.
 *
 * THE SCENE. A project procurement schedule drawn in the procurement chain's
 * own visual language (Section 51): one row per procurement item, every row
 * laid out by the chain's layout engine (`buildChainLayout`) on ONE shared
 * calendar axis at the chain's approved scale. The focal chain, the
 * approved Custom Steel Windows and Doors scenario (`chainScenario.ts`), is
 * drawn with its labels, in the middle third of the schedule. Its activities
 * and durations are unchanged; its whole chain is anchored earlier, on
 * PLAN_FOCAL_REQUIRED_ON_SITE, so that strict Required On Site order puts it
 * eighth of fifteen (refined 2026-11-10). Around it are the shared schedule fixture's other
 * fourteen items (`scheduleFixture.ts`), bars and milestones only, LENGTHENED
 * for this illustration: each is rebuilt through the same scheduling engine
 * with its activity durations scaled by its own factor, so the project shows
 * realistic variation. The fixture itself is unchanged. The fixture's own
 * steel window package is left out, because the focal chain is that package.
 * Rows run in strict Required On Site order, earliest at the top, as a
 * procurement schedule reads. Commitments and issues are removed
 * from every row: the Plan stage shows the procurement chain itself.
 *
 * ONE TIMELINE (§46.3, §51.12). `planStateAt(scene, frame, t)` maps one clock
 * (ms since the tab's `played` turned true) through one ordered table of
 * stages to everything that moves: the camera, the planning edge, and every
 * opacity. The renderer applies it and computes nothing.
 *
 *   1. Required On Site appears alone.
 *   2. The chain builds backward, one activity at a time: a planning edge
 *      travels right to left, revealing each activity from its right end,
 *      and the camera follows it. It rests briefly on each completed
 *      activity, a little longer on a milestone, before the next.
 *   3. The camera pulls back to the whole chain, and holds.
 *   4. It pulls back again to the whole project schedule, and rests.
 */

import { buildChainLayout, CHAIN, FONT, type ChainLayout, type Measure } from '../demo/screens/procurement-chain/chainLayout';
import { buildSteelWindowsChain, CHAIN_LABELS } from '../demo/screens/procurement-chain/chainScenario';
import { SCHEDULE_ITEMS } from '../demo/screens/procurement-schedule/scheduleFixture';
import { buildItem, type PhaseFamily, type ScheduleItem, type StepSpec } from '../demo/screens/procurement-schedule/scheduleModel';
import { iso, parse, workdaysBetween } from '../demo/screens/procurement-schedule/workCalendar';

/* ------------------------------------------------------------ the items */

/** The Plan stage shows the chain itself: no commitments, no issues. */
const chainOnly = (item: ScheduleItem): ScheduleItem => ({ ...item, commitments: [], issues: [] });

/** The fixture's steel window package; the focal chain stands in for it. */
export const REPLACED_FIXTURE_ITEM = 'itm-heritage';

/**
 * The featured chain's Required On Site date ON THE HOMEPAGE (2026-11-10).
 * The approved scenario's own date is 30 November 2027, the latest of all
 * fifteen items, which in date order would make it the last row. Anchored
 * here instead, the same engine moves every date of the chain together
 * (Section 51.13, representative dates follow the anchor): 312 working days,
 * the same activities and durations, starting 4 June 2026. It falls between
 * the fixture's 23 August and 13 September dates: eighth of fifteen.
 */
export const PLAN_FOCAL_REQUIRED_ON_SITE = '2027-09-01';

export const FOCAL_ITEM = chainOnly(buildSteelWindowsChain(PLAN_FOCAL_REQUIRED_ON_SITE));

/**
 * A fixture item rebuilt through the scheduling engine with every activity's
 * duration scaled by `factor` (rounded, at least one working day). Its
 * Required On Site date, its sequence, its milestones and any explicit float
 * between steps are kept: each step's relationship to the one before it is
 * read back from the resolved dates. At a factor of 1 it reproduces the
 * fixture's dates exactly (planChainScene.test.ts).
 */
export function lengthened(item: ScheduleItem, factor: number): ScheduleItem {
  const specs: StepSpec[] = item.steps.map((s, i) => {
    if (s.milestoneAnchor === 'start') throw new Error(`lengthened: ${s.id} is a start milestone`);
    const prev = item.steps[i - 1];
    // Inclusive working-day count between the predecessor's finish and this step.
    const between = prev ? workdaysBetween(parse(prev.endDate), parse(s.startDate)) : 1;
    return {
      id: s.id,
      name: s.name,
      family: s.family,
      kind: s.kind,
      ...(s.kind === 'phase' ? { days: Math.max(1, Math.round(s.durationWorkdays * factor)) } : {}),
      gap: s.kind === 'phase' ? Math.max(1, between - 1) : Math.max(1, between),
      org: s.responsibleOrganizationId,
      owner: s.commitmentOwnerId,
      owed: s.whatIsOwed,
    };
  });
  return buildItem(item.id, item.name, item.category, item.requiredOnSiteDate, specs);
}

/**
 * Each surrounding chain's own duration factor, so no two share a length.
 * Representative, for this illustration only.
 */
const FACTORS: Readonly<Record<string, number>> = {
  'itm-permit': 1.9,
  'itm-concrete': 2.3,
  'itm-steel': 1.7,
  'itm-framing': 2.6,
  'itm-switchgear': 1.8,
  'itm-stone': 1.45,
  'itm-hvac': 1.9,
  'itm-tile': 2.0,
  'itm-elevator': 1.75,
  'itm-casework': 1.6,
  'itm-railings': 1.35,
  'itm-plumbing': 1.55,
  'itm-intdoors': 2.1,
  'itm-lighting': 1.6,
};

/**
 * Every row's item, top to bottom, in strict Required On Site order
 * (refined 2026-11-10): the order a procurement schedule reads in.
 */
export const ROW_ITEMS: ScheduleItem[] = [
  FOCAL_ITEM,
  ...SCHEDULE_ITEMS.filter((i) => i.id !== REPLACED_FIXTURE_ITEM).map((i) => {
    const factor = FACTORS[i.id];
    if (factor === undefined) throw new Error(`planChainScene: no duration factor for ${i.id}`);
    return chainOnly(lengthened(i, factor));
  }),
].sort((a, b) => (a.requiredOnSiteDate < b.requiredOnSiteDate ? -1 : a.requiredOnSiteDate > b.requiredOnSiteDate ? 1 : 0));
export const FOCAL_ROW = ROW_ITEMS.indexOf(FOCAL_ITEM);
export const OTHER_ITEMS = ROW_ITEMS.filter((i) => i !== FOCAL_ITEM);

/** Whole months from the earliest start to the month after the latest Required On Site. */
export function sharedDomain(items: ScheduleItem[]): { start: string; end: string } {
  const starts = items.map((i) => i.startDate).sort();
  const ends = items.map((i) => i.requiredOnSiteDate).sort();
  const s = parse(starts[0]);
  s.setUTCDate(1);
  const e = parse(ends[ends.length - 1]);
  e.setUTCMonth(e.getUTCMonth() + 1, 1);
  return { start: iso(s), end: iso(e) };
}

/* ------------------------------------------------------------ the scene */

export type PlanRow = { item: ScheduleItem; layout: ChainLayout; dy: number };

export type BuildStep = {
  id: string;
  family: PhaseFamily;
  /** The planning edge travels from `from` to `to` (right to left). */
  from: number;
  to: number;
  /** The activity's own span, for the camera's framing. */
  span: number;
  start: number;
  /** The edge's move across the activity. */
  duration: number;
  /**
   * The rest after it (refined 2026-11-10): the edge and camera hold on the
   * completed activity, labelled, before the next one begins. Part of the
   * step's own interval, so the one clock never accumulates a separate delay.
   */
  dwell: number;
  /** Whether the edge rests on a milestone (other than Required On Site). */
  milestone: boolean;
};

export type PlanScene = {
  width: number;
  height: number;
  focal: PlanRow;
  others: PlanRow[];
  /** The focal bar's vertical centre, in canvas px. */
  focalCy: number;
  rosX: number;
  /** The whole focal chain, Required On Site label included. */
  chainLeft: number;
  chainRight: number;
  steps: BuildStep[];
  times: Times;
  /** Where the scene sits in the application screen (refined 2026-11-10). */
  place: Placement;
  /** The step list's six groups, with their place on the one clock. */
  list: ListEntry[];
};

/* ---------------------------------------------------------- the step list */

/**
 * THE STEP LIST (refined 2026-11-10). The featured chain's activities in six
 * consolidated groups, in backward-planning order, shown beside the chain as
 * it builds. Founder-specified: exactly these six. Membership is by activity
 * family, so every step and milestone belongs to exactly one group, and each
 * group's working days are the sum of its activities' durations: read from
 * the chain, never authored. Dependencies, decisions and commitments are not
 * here; they belong to Connect.
 */
export const PLAN_STEP_GROUPS: readonly { id: string; label: string; families: readonly PhaseFamily[] }[] = [
  { id: 'ros', label: 'Required On Site', families: ['required'] },
  { id: 'fabrication', label: 'Fabrication & Delivery', families: ['production', 'logistics'] },
  { id: 'review', label: 'Review & Approvals', families: ['review', 'revision', 'approval'] },
  { id: 'preparation', label: 'Submittal Preparation', families: ['preparation'] },
  { id: 'coordination', label: 'Submittal Coordination', families: ['coordination'] },
  { id: 'buyout', label: 'Buyout', families: ['buyout'] },
];

export type ListEntry = {
  id: string;
  label: string;
  /** Working days of the group's activities; null for a milestone. */
  workdays: number | null;
  /** The milestone's date, for a milestone. */
  date: string | null;
  /** The family whose token marks the entry. */
  family: PhaseFamily;
  /** When it appears, and until when it is the step being built (ms). */
  appearAt: number;
  activeUntil: number;
};

const groupOf = (f: PhaseFamily) => {
  const g = PLAN_STEP_GROUPS.findIndex((x) => x.families.includes(f));
  if (g < 0) throw new Error(`planChainScene: no step group for family ${f}`);
  return g;
};

/** Each group's working days and milestone date, from the chain's own steps. */
export function stepGroupTotals(item: ScheduleItem) {
  return PLAN_STEP_GROUPS.map((_, i) => {
    const steps = item.steps.filter((s) => groupOf(s.family) === i);
    const phases = steps.filter((s) => s.kind === 'phase');
    return {
      workdays: phases.length ? phases.reduce((n, s) => n + s.durationWorkdays, 0) : null,
      date: phases.length ? null : steps[0]?.startDate ?? null,
    };
  });
}

/**
 * THE APPLICATION SCREEN (refined 2026-11-10). The finished schedule is shown
 * as the JiTpro Schedule module: the shared application shell (`JiTproShell`,
 * the Procurement Register's own chrome) on its fixed 1448 x 1086 canvas,
 * with the Schedule module's page header and toolbar, then a schedule box:
 * the item column on the left and the timeline on the right.
 *
 * These are the screen's layout px. The renderer builds the screen to them,
 * and the scene's chains are placed into the timeline by them, so the month
 * header, the row bands and the bars agree. The schedule ends above the
 * Register overview's crop line (about 904 px), so the final view shows all
 * fifteen rows and the legend.
 */
export const APP = {
  w: 1448,
  h: 1086,
  /** The shell's top bar and sidebar (JiTproShell). */
  topBar: 60,
  sidebar: 205,
  /** The main column's padding (as the Schedule screen's). */
  padL: 18,
  padR: 26,
  /** The page header and toolbar block, a fixed height. */
  toolsH: 122,
  /** Toolbar to schedule box (as the Schedule screen's). */
  ganttGap: 14,
  /** The period header band and the item column (as the Schedule screen's). */
  periodH: 30,
  leftW: 226,
  /** Row height bounds; the rows fit above this line. */
  rowHMax: 48,
  rowHMin: 34,
  rowsBottomMax: 852,
} as const;

export type Placement = {
  /** Screen px per scene px. */
  k: number;
  /** The scene's origin in the screen. */
  ox: number;
  oy: number;
  /** The schedule box: its outer top-left and width in the screen. */
  box: { x: number; y: number; w: number };
  timelineX: number;
  timelineW: number;
  rowsTop: number;
  rowH: number;
  /** Each row's band, top to bottom, in screen px (the featured row is taller). */
  bands: { top: number; height: number }[];
  rowsBottom: number;
  /** Lines an item name may take at this row height. */
  nameLines: number;
};

type Times = {
  rosIn: number;
  rosInDuration: number;
  buildStart: number;
  buildEnd: number;
  chainArrive: number;
  holdEnd: number;
  end: number;
};

/** Stage timing (ms after `played`). The build's own steps are timed per activity. */
export const TIMING = {
  /** After the panel's 450 ms slide. */
  ROS_IN: 500,
  ROS_IN_DURATION: 400,
  BUILD_START: 1500,
  /** Per activity: a base plus a little for its length, so long work reads as long. */
  STEP_BASE: 420,
  STEP_PER_PX: 0.25,
  STEP_MIN: 520,
  STEP_MAX: 1100,
  /**
   * The rest after each activity, so each one registers before the next
   * begins (founder direction 2026-11-10: about 250 to 350 ms), and a little
   * longer where the activity's start is a milestone.
   */
  STEP_DWELL: 300,
  MILESTONE_DWELL: 150,
  ZOOM_TO_CHAIN: 1400,
  /** The founder-directed pause on the whole chain (2026-11-10). */
  CHAIN_HOLD: 1500,
  PULLBACK: 2400,
} as const;

export function buildPlanScene(measure: Measure): PlanScene {
  const domain = sharedDomain([FOCAL_ITEM, ...OTHER_ITEMS]);
  const layoutOf = (item: ScheduleItem, labels?: Record<string, string>) =>
    buildChainLayout(item, { containerWidth: 0, measure, labels, domain });

  const focalLayout = layoutOf(FOCAL_ITEM, CHAIN_LABELS);
  const width = focalLayout.width;
  const n = ROW_ITEMS.length;

  /* The screen's schedule box and timeline. */
  const boxX = APP.sidebar + APP.padL;
  const boxY = APP.topBar + APP.toolsH + APP.ganttGap;
  const boxW = APP.w - APP.sidebar - APP.padL - APP.padR;
  const timelineX = boxX + 1 + APP.leftW;
  const timelineW = boxX + boxW - 1 - timelineX;
  const rowsTop = boxY + 1 + APP.periodH;

  /* The shared domain maps exactly onto the timeline. */
  const k = timelineW / (width - CHAIN.PAD_L - CHAIN.PAD_R);
  const ox = timelineX - k * CHAIN.PAD_L;
  const oy = rowsTop;

  /* The featured row keeps room beneath its bar for its own labels. */
  const focalLabelBottom = Math.max(focalLayout.barBottom, ...focalLayout.labels.map((l) => l.box.y + l.box.h));
  const focalExtra = Math.ceil((focalLabelBottom - focalLayout.barBottom) * k) + 4;
  const rowH = Math.min(APP.rowHMax, Math.max(APP.rowHMin, Math.floor((APP.rowsBottomMax - rowsTop - focalExtra) / n)));

  /* Row bands, top to bottom; each bar is centred in its row's first rowH. */
  let y = rowsTop;
  const bands = ROW_ITEMS.map((_, i) => {
    const band = { top: y, height: rowH + (i === FOCAL_ROW ? focalExtra : 0) };
    y += band.height;
    return band;
  });
  const rowsBottom = y;
  const rows: PlanRow[] = ROW_ITEMS.map((item, i) => {
    const layout = item === FOCAL_ITEM ? focalLayout : layoutOf(item);
    const barTop = (bands[i].top + rowH / 2 - oy) / k - CHAIN.H / 2;
    return { item, layout, dy: barTop - layout.barTop };
  });
  const focal = rows[FOCAL_ROW];
  const others = rows.filter((_, i) => i !== FOCAL_ROW);
  const height = Math.max((rowsBottom - oy) / k, focal.dy + focalLayout.height);
  const focalCy = focal.dy + focalLayout.cy;

  const rosX = focalLayout.ros!.x;
  const segs = focalLayout.segments;
  const chainLeft = segs[0].x0 - 32;
  const rosText = focalLayout.ros!.text;
  const rosTextW = Math.max(...rosText.lines.map((l) => measure(l.text, FONT[l.font])));
  const chainRight = rosText.x + rosTextW + 24;

  /* The build: the activities from Required On Site backward. */
  let clock: number = TIMING.BUILD_START;
  const milestoneXs = focalLayout.milestones.filter((m) => !m.isRos).map((m) => m.x);
  const steps: BuildStep[] = [...segs].reverse().map((s, k) => {
    const span = s.x1 - s.x0;
    const duration = Math.min(TIMING.STEP_MAX, Math.max(TIMING.STEP_MIN, TIMING.STEP_BASE + TIMING.STEP_PER_PX * span));
    const milestone = milestoneXs.some((x) => Math.abs(x - s.x0) < 1);
    const dwell = TIMING.STEP_DWELL + (milestone ? TIMING.MILESTONE_DWELL : 0);
    // The first step starts past the last chevron's point, so nothing shows before it.
    const step = { id: s.step.id, family: s.family, from: k === 0 ? s.x1 + CHAIN.D : s.x1, to: s.x0, span, start: clock, duration, dwell, milestone };
    clock += duration + dwell;
    return step;
  });
  const buildEnd = clock;

  /* The list: each group appears as its first activity starts building, and
     is the step being built until its last activity's rest ends. Required On
     Site appears with the anchor and is current until the build begins. */
  const totals = stepGroupTotals(FOCAL_ITEM);
  const list: ListEntry[] = PLAN_STEP_GROUPS.map((g, i) => {
    const own = steps.filter((s) => groupOf(s.family) === i);
    const appearAt = i === 0 ? TIMING.ROS_IN : Math.min(...own.map((s) => s.start));
    const activeUntil = i === 0 ? TIMING.BUILD_START : Math.max(...own.map((s) => s.start + s.duration + s.dwell));
    return { id: g.id, label: g.label, ...totals[i], family: g.families[0], appearAt, activeUntil };
  });

  const chainArrive = buildEnd + TIMING.ZOOM_TO_CHAIN;
  const holdEnd = chainArrive + TIMING.CHAIN_HOLD;

  return {
    width,
    height,
    focal,
    others,
    focalCy,
    rosX,
    chainLeft,
    chainRight,
    steps,
    list,
    place: {
      k,
      ox,
      oy,
      box: { x: boxX, y: boxY, w: boxW },
      timelineX,
      timelineW,
      rowsTop,
      rowH,
      bands,
      rowsBottom,
      nameLines: rowH >= 46 ? 2 : 1,
    },
    times: {
      rosIn: TIMING.ROS_IN,
      rosInDuration: TIMING.ROS_IN_DURATION,
      buildStart: TIMING.BUILD_START,
      buildEnd,
      chainArrive,
      holdEnd,
      end: holdEnd + TIMING.PULLBACK,
    },
  };
}

/* ------------------------------------------------------------ the state */

export type Frame = {
  w: number;
  h: number;
  /**
   * Free room outside the frame, beside it, in the frame's coordinates
   * (refined 2026-11-10): the unused copy-column area beneath the tab's copy,
   * measured by the section. When it can hold the finished list, the list
   * rests there and the application window keeps the whole frame.
   */
  aside?: Rect | null;
};
/** The canvas point at the frame's centre, and the scale. */
export type CameraView = { cx: number; cy: number; scale: number };

export type PlanState = {
  view: CameraView;
  /** The planning edge: the focal chain is shown right of it. */
  edgeX: number;
  ros: number;
  others: number;
  summary: number;
  /** The focal chain's own calendar axis, handed over to the schedule's. */
  focalAxis: number;
  /** The application screen around the finished schedule. */
  app: number;
  /** The step list. */
  list: {
    /** Each entry's appearance, 0 to 1. */
    appear: number[];
    /** Each entry's current-step highlight, 0 to 1. */
    active: number[];
    /** From the build panel (0) to the final two columns (1). */
    morph: number;
  };
};

/* ------------------------------------------------------ the list's layouts */

/** One list entry's base box (screen px at scale 1), and the row pitch. */
export const LIST_ITEM = { w: 170, h: 36, pitch: 40 } as const;
/** Below this frame width the list cannot sit beside the chain: it goes beneath. */
export const SIDE_MIN_W = 460;
/** The list's scale in its final two columns, inside the frame beside a window. */
const LIST_FINAL_SCALE = 0.72;
/** Its scale resting outside the frame, and the least that stays readable there. */
const LIST_ASIDE_SCALE = 0.85;
const LIST_MIN_SCALE = 0.7;
const LIST_COL_GAP = 8;

type Rect = { x: number; y: number; w: number; h: number };
export type Placed = { x: number; y: number; s: number };
export type ListLayout = {
  /**
   * aside    the list builds in the frame and rests outside it, beside it;
   *          the application window keeps the whole frame
   * side     no room outside: the list rests in the frame beside a window
   * stacked  narrow frames: a band beneath, the window above
   */
  mode: 'aside' | 'side' | 'stacked';
  /** Where the chain is framed while it builds and holds. */
  area: Rect;
  /** The build panel: a side rail, or a band beneath. */
  panel: Rect;
  /** Each entry's place in the build panel, and in the final layout. */
  start: Placed[];
  end: Placed[];
  /**
   * Aside only: the copy column's right edge, in the frame's coordinates. Left
   * of it the list may pass only below the copy (the free area's top).
   */
  copyRight?: number;
  /** The finished application window: its top-left and its canvas scale. */
  window: Placed;
};

/**
 * THE LIST'S TWO LAYOUTS, and the frame they share with the chain (refined
 * 2026-11-10). Beside the chain (frames at least SIDE_MIN_W wide):
 *
 *   BUILD   a rail at the frame's left, one entry per row at full size; the
 *           chain is framed in the rest of the frame.
 *   FINAL   the application window at the frame's right, the whole screen
 *           at the largest scale the room allows; the same six entries
 *           smaller, in two columns of three, in the space to its left.
 *
 * Narrower frames (phones): the list is a band of two columns beneath the
 * chain throughout, and the application window sits above it at the end.
 * Every position is a transform of the same six entries, so the move from one
 * layout to the other is the same list travelling, never a second list.
 */
export function listLayout(f: Frame): ListLayout {
  const n = PLAN_STEP_GROUPS.length;
  const rows = Math.ceil(n / 2);
  const m = Math.round(Math.min(14, Math.max(8, f.w * 0.022)));
  const twoCols = (x: number, y: number, s: number): Placed[] =>
    PLAN_STEP_GROUPS.map((_, i) => ({
      x: x + (i >= rows ? LIST_ITEM.w * s + LIST_COL_GAP : 0),
      y: y + (i % rows) * LIST_ITEM.pitch * s,
      s,
    }));
  /** The whole screen at the largest scale the box allows: against the list (side) or centred (stacked). */
  const fitWindow = (box: Rect, align: 'right' | 'center'): Placed => {
    const s = Math.min(box.w / APP.w, box.h / APP.h);
    const spare = box.w - APP.w * s;
    return { x: box.x + (align === 'right' ? spare : spare / 2), y: box.y + (box.h - APP.h * s) / 2, s };
  };

  if (f.w >= SIDE_MIN_W) {
    const railW = Math.round(Math.min(220, Math.max(176, f.w * 0.33)));
    const sr = Math.min(1, (railW - 24) / LIST_ITEM.w);
    const start = PLAN_STEP_GROUPS.map((_, i) => ({ x: 12, y: 14 + i * LIST_ITEM.pitch * sr, s: sr }));

    /* Room outside the frame: the window keeps the whole frame. */
    const a = f.aside;
    const fullW = 2 * LIST_ITEM.w + LIST_COL_GAP;
    const fullH = (rows - 1) * LIST_ITEM.pitch + LIST_ITEM.h;
    const sa = a ? Math.min(LIST_ASIDE_SCALE, a.w / fullW, a.h / fullH) : 0;
    // The free area lies left of the frame, so the list's whole journey is leftward.
    if (a && sa >= LIST_MIN_SCALE && a.x + a.w <= start[0].x) {
      const cover = Math.max(f.w / APP.w, f.h / APP.h);
      return {
        mode: 'aside',
        area: { x: railW, y: 0, w: f.w - railW, h: f.h },
        panel: { x: 0, y: 0, w: railW, h: f.h },
        start,
        copyRight: a.x + a.w,
        end: twoCols(a.x, a.y, sa),
        window: { x: 0, y: 0, s: cover },
      };
    }

    const s1 = LIST_FINAL_SCALE;
    const listW = 2 * LIST_ITEM.w * s1 + LIST_COL_GAP;
    const listH = (rows - 1) * LIST_ITEM.pitch * s1 + LIST_ITEM.h * s1;
    const window = fitWindow({ x: m + listW + m, y: m, w: f.w - (m + listW + m) - m, h: f.h - 2 * m }, 'right');
    const windowH = APP.h * window.s;
    const end = twoCols(m, window.y + (windowH - listH) / 2, s1);
    return {
      mode: 'side',
      area: { x: railW, y: 0, w: f.w - railW, h: f.h },
      panel: { x: 0, y: 0, w: railW, h: f.h },
      start,
      end,
      window,
    };
  }

  const colW = (f.w - 2 * m - LIST_COL_GAP) / 2;
  const sb = Math.min(0.65, colW / LIST_ITEM.w);
  const bandH = Math.round((rows - 1) * LIST_ITEM.pitch * sb + LIST_ITEM.h * sb + 2 * m);
  const band = { x: 0, y: f.h - bandH, w: f.w, h: bandH };
  const placed = twoCols(m, band.y + m, sb);
  return {
    mode: 'stacked',
    area: { x: 0, y: 0, w: f.w, h: f.h - bandH },
    panel: band,
    start: placed,
    end: placed,
    window: fitWindow({ x: m, y: m, w: f.w - 2 * m, h: f.h - bandH - 2 * m }, 'center'),
  };
}

const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
/** Gentle ease, no overshoot (§46.4). */
export const ease = (u: number) => {
  const x = clamp01(u);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Scale interpolates geometrically, so a large zoom reads as even. */
const lerpView = (a: CameraView, b: CameraView, u: number): CameraView =>
  u <= 0
    ? a
    : u >= 1
      ? b
      : {
          cx: lerp(a.cx, b.cx, u),
          cy: lerp(a.cy, b.cy, u),
          scale: Math.exp(lerp(Math.log(a.scale), Math.log(b.scale), u)),
        };

/** Where the planning edge sits across the frame: right for the anchor, then left of centre. */
const EDGE_AT_ROS = 0.58;
const EDGE_WHILE_BUILDING = 0.42;
/**
 * Scene px across the chain's area while building, so the chain's type stays
 * readable beside the list; never closer than 700 scene px across the whole
 * frame, the scale the build had before the list (so narrow frames keep the
 * same, unhurried pans).
 */
const BUILD_VIEW_W = 470;
const BUILD_FRAME_VIEW_W = 700;
/** The narrowest a long activity may pull the camera back to while it builds. */
const BUILD_MIN_SCALE = 0.3;
/** Below the bar, so its duration and milestone labels are in view. */
const LABEL_ROOM = 44;

/** A mark is revealed as the planning edge reaches it, over this many canvas px. */
export const REVEAL_RAMP = 24;
export const revealAt = (x: number, edgeX: number) => clamp01((x + REVEAL_RAMP - edgeX) / REVEAL_RAMP);

/**
 * The view that puts scene x at fraction `frac` across the chain's area and
 * scene y at the area's vertical centre.
 */
const viewInArea = (f: Frame, x: number, frac: number, scale: number, y: number): CameraView => {
  const a = listLayout(f).area;
  return {
    cx: x - (a.x + frac * a.w - f.w / 2) / scale,
    cy: y - (a.y + a.h / 2 - f.h / 2) / scale,
    scale,
  };
};

/** The whole chain, Required On Site label included, across the chain's area. */
export function chainView(scene: PlanScene, f: Frame): CameraView {
  const a = listLayout(f).area;
  const scale = (a.w * 0.94) / (scene.chainRight - scene.chainLeft);
  return viewInArea(f, (scene.chainLeft + scene.chainRight) / 2, 0.5, scale, scene.focalCy + LABEL_ROOM / 2);
}

/** A view of scene px, as a view of the application screen's px. */
export function toScreen(scene: PlanScene, v: CameraView): CameraView {
  const { k, ox, oy } = scene.place;
  return { cx: ox + k * v.cx, cy: oy + k * v.cy, scale: v.scale / k };
}

/**
 * The finished view: the whole application screen's width, from its top, at
 * the smallest scale that covers the frame. The Procurement Register's
 * overview is framed the same way (Section 54.4.1), so the two read as one
 * application.
 */
export function scheduleView(_scene: PlanScene, f: Frame): CameraView {
  // The application window: the whole frame when the list rests outside it,
  // else beside the list (refined 2026-11-10).
  const w = listLayout(f).window;
  return { cx: (f.w / 2 - w.x) / w.s, cy: (f.h / 2 - w.y) / w.s, scale: w.s };
}

/**
 * One entry's place part-way through the move to its final layout (0 to 1).
 * Shared by the renderer and the tests.
 *
 * Side: the first column's three entries shrink and move straight to their
 * places; the second column's three stay directly beneath the first while they
 * move across, and rise into their own column only once it has narrowed clear
 * of them. No entry ever passes over another.
 *
 * Aside: one continuous path per entry (see asideAt).
 */
export function listItemAt(lay: ListLayout, i: number, morph: number): Placed {
  if (lay.mode === 'stacked') return lay.end[i];
  if (lay.mode === 'side') return reflowAt(lay.start, lay.end, i, morph);
  return asideAt(lay, i, morph);
}

/**
 * THE ASIDE PATH (amended 2026-11-10). The list leaves the frame for the free
 * area beneath the copy, left of the frame, on one path per entry: every
 * entry's x only ever decreases and its y only ever increases, so nothing
 * bounces. (The earlier move reflowed into two columns inside the frame
 * first, which carried the second column about 150 px right before the whole
 * list reversed and slid left.)
 *
 * Everything runs on one progress, `p`, the first column's share of its
 * leftward travel: eased out of the pull-back's own eased progress, so the
 * list sets off left at once and decelerates into place, on the same clock
 * as the camera.
 *
 *   The second column drops to its resting height early, while it is still
 *   inside the frame; the first column drops with it, as one block, then on
 *   by the three rows that separate them. Both drops finish before the first
 *   column reaches the copy column, so the list passes beneath the copy,
 *   never across it.
 *
 *   The first column leads left; the second trails it by the gap that opens
 *   into its own column, opening as fast as the second column can, still
 *   moving left, allow.
 *
 * The first column starts above the second and finishes left of it, and the
 * copy leaves no room to go around, so the two columns cross once, briefly
 * (listCrossingFade dims the second column while they do). Every entry
 * shares one scale progress, so the list shrinks as one.
 */
function asideAt(lay: ListLayout, i: number, morph: number): Placed {
  if (morph >= 1) return lay.end[i];
  const S = lay.start;
  const E = lay.end;
  const j = i % LIST_ROWS;
  const k = asidePath(lay);
  const p = asideProgress(morph);
  const drop2 = ease(p / k.secondDropEnds);
  const drop1 = ease((p - k.firstDropStarts) / ASIDE.FIRST_DROP_SPAN);
  // One scale for the whole list, settled with the second column's drop.
  const s = lerp(S[i].s, E[i].s, drop2);
  const x = lerp(S[j].x, E[j].x, p);

  if (i >= LIST_ROWS) return { x: x + k.beside * ease(p / k.openSpan), y: lerp(S[i].y, E[i].y, drop2), s };
  // With the second column first (one block), then on alone.
  const r = (E[i + LIST_ROWS].y - S[i + LIST_ROWS].y) / (E[i].y - S[i].y);
  return { x, y: lerp(S[i].y, E[i].y, r * drop2 + (1 - r) * drop1), s };
}

const LIST_ROWS = Math.ceil(PLAN_STEP_GROUPS.length / 2);

/** The first column's share of its leftward travel: off at once, slowing into place. */
const asideProgress = (morph: number) => {
  const m = clamp01(morph);
  return 1 - (1 - m) * (1 - m);
};

/**
 * The aside path's shape, in shares of `p` (see asideAt). OPEN_SLOWEST: the
 * gap's opening span, as a multiple of the shortest a smooth opening can take
 * while the second column still moves left (1.5); just above it, so the
 * crossing is as brief as the geometry allows (about a third of a second).
 */
const ASIDE = {
  SECOND_DROP_ENDS: 0.7,
  FIRST_DROP_ENDS: 0.97,
  FIRST_DROP_SPAN: 0.07,
  OPEN_SLOWEST: 1.55,
  /** The second column's deepest fade while the columns cross. */
  CROSSING_FADE: 0.6,
  /** The fade's ease in, ending just after the first column starts down past the second, and its ease out. */
  FADE_IN: 0.11,
  FADE_IN_LEAD: 0.02,
  FADE_OUT: 0.11,
} as const;

/** The aside path's landmarks, from the layout: all in shares of `p`. */
function asidePath(lay: ListLayout) {
  const S = lay.start;
  const E = lay.end;
  /* The first column's travel left, the second column's offset beside it, and
     how far along the first column reaches the copy column. */
  const travel = S[0].x - E[0].x;
  const beside = E[LIST_ROWS].x - E[0].x;
  const atCopy = (S[0].x - lay.copyRight!) / travel;
  // The gap opens at most this fast, so the second column never stops moving left.
  const openSpan = (ASIDE.OPEN_SLOWEST * beside) / travel;
  // Where the gap has opened to a first-column entry's width: the crossing is over.
  const clear = Math.min(1, (LIST_ITEM.w * E[0].s) / beside);
  const crossEnds = openSpan * (0.5 - Math.sin(Math.asin(1 - 2 * clear) / 3));
  return {
    beside,
    openSpan,
    secondDropEnds: ASIDE.SECOND_DROP_ENDS * atCopy,
    firstDropStarts: ASIDE.FIRST_DROP_ENDS * atCopy - ASIDE.FIRST_DROP_SPAN,
    crossEnds,
  };
}

/**
 * Each entry's opacity factor at this point of the move: 1, except in the
 * aside move, where the second column fades back while the first passes down
 * beside and across it, so the crossing reads as one column passing the
 * other, not as text over text. The fade is a smooth envelope on the path's
 * own progress, fully in just as the columns meet and easing out as they
 * part, so it never flickers with the overlap's own quick changes.
 */
export function listCrossingFade(lay: ListLayout, morph: number): number[] {
  if (lay.mode !== 'aside' || morph <= 0 || morph >= 1) return PLAN_STEP_GROUPS.map(() => 1);
  const k = asidePath(lay);
  const p = asideProgress(morph);
  const inFrom = k.firstDropStarts + ASIDE.FADE_IN_LEAD - ASIDE.FADE_IN;
  const envelope = ease((p - inFrom) / ASIDE.FADE_IN) * (1 - ease((p - k.crossEnds) / ASIDE.FADE_OUT));
  return PLAN_STEP_GROUPS.map((_, i) => (i < LIST_ROWS ? 1 : 1 - ASIDE.CROSSING_FADE * envelope));
}

/** From one column to two (see listItemAt): no entry ever passes over another. */
function reflowAt(starts: Placed[], ends: Placed[], i: number, morph: number): Placed {
  const a = starts[i];
  const b = ends[i];
  const rows = Math.ceil(PLAN_STEP_GROUPS.length / 2);
  const s = lerp(a.s, b.s, morph);
  if (i < rows) return { x: lerp(a.x, b.x, morph), y: lerp(a.y, b.y, morph), s };

  // When the first column's right edge (linear in morph) clears this column.
  const edge0 = starts[0].x + LIST_ITEM.w * starts[0].s;
  const edge1 = ends[0].x + LIST_ITEM.w * ends[0].s;
  const clearAt = Math.min(0.92, Math.max(0.5, (edge0 - (b.x - 2)) / (edge0 - edge1)));

  // Beneath the first column's last entry, at the list's current scale.
  const under = lerp(starts[rows - 1].y, ends[rows - 1].y, morph) + (i - rows + 1) * LIST_ITEM.pitch * s;
  return {
    x: lerp(a.x, b.x, ease(morph / clearAt)),
    y: lerp(under, b.y, ease((morph - clearAt) / (1 - clearAt))),
    s,
  };
}

/** A list entry appears over this long (fade and a 6px rise, in the renderer). */
export const LIST_APPEAR_MS = 300;
/** The current-step highlight fades in and out over these. */
const ACTIVE_IN_MS = 150;
const ACTIVE_OUT_MS = 250;

/** The list's state at t: appearance and highlight per entry, and the layout morph. */
function listStateAt(scene: PlanScene, t: number): PlanState['list'] {
  const T = scene.times;
  return {
    appear: scene.list.map((e) => ease((t - e.appearAt) / LIST_APPEAR_MS)),
    active: scene.list.map((e) => clamp01((t - e.appearAt) / ACTIVE_IN_MS) * (1 - clamp01((t - e.activeUntil) / ACTIVE_OUT_MS))),
    // On exactly the pull-back's own progress, so the list and the camera travel together.
    morph: t <= T.holdEnd ? 0 : ease((t - T.holdEnd) / (T.end - T.holdEnd)),
  };
}

export function planStateAt(scene: PlanScene, f: Frame, t: number): PlanState {
  const T = scene.times;
  const area = listLayout(f).area;
  const sBuild = Math.min(area.w / BUILD_VIEW_W, f.w / BUILD_FRAME_VIEW_W);
  const cyBuild = scene.focalCy + LABEL_ROOM;
  const ros = ease((t - T.rosIn) / T.rosInDuration);
  const first = scene.steps[0];
  const last = scene.steps[scene.steps.length - 1];
  const list = listStateAt(scene, t);

  /* 1. Required On Site, alone. */
  if (t < T.buildStart) {
    return {
      view: toScreen(scene, viewInArea(f, scene.rosX, EDGE_AT_ROS, sBuild, cyBuild)),
      edgeX: first.from,
      ros,
      others: 0,
      summary: 0,
      focalAxis: 1,
      app: 0,
      list,
    };
  }

  /* 2. The backward build, one activity at a time. */
  if (t < T.buildEnd) {
    const k = scene.steps.findIndex((s) => t < s.start + s.duration + s.dwell);
    const step = scene.steps[k];
    // Moving, then resting (u stays 1 through the dwell).
    const u = ease((t - step.start) / step.duration);
    const edgeX = lerp(step.from, step.to, u);
    const frac = k === 0 ? lerp(EDGE_AT_ROS, EDGE_WHILE_BUILDING, u) : EDGE_WHILE_BUILDING;
    // A long activity eases the camera back to keep it in frame, and in again.
    const fit = Math.min(sBuild, Math.max(BUILD_MIN_SCALE, (area.w * 0.85) / step.span));
    const scale = sBuild - (sBuild - fit) * Math.sin(Math.PI * u);
    return {
      view: toScreen(scene, viewInArea(f, Math.min(edgeX, scene.rosX), frac, scale, cyBuild)),
      edgeX,
      ros: 1,
      others: 0,
      summary: 0,
      focalAxis: 1,
      app: 0,
      list,
    };
  }

  const built = toScreen(scene, viewInArea(f, last.to, EDGE_WHILE_BUILDING, sBuild, cyBuild));
  const whole = toScreen(scene, chainView(scene, f));
  const edgeX = last.to - 2 * REVEAL_RAMP;

  /* 3. Back to the whole chain, then hold. */
  if (t < T.holdEnd) {
    const u = ease((t - T.buildEnd) / (T.chainArrive - T.buildEnd));
    return { view: lerpView(built, whole, u), edgeX, ros: 1, others: 0, summary: ease((u - 0.5) / 0.5), focalAxis: 1, app: 0, list };
  }

  /* 4. Back again, to the project's whole schedule in the application, and
     rest; the list moves to the application's side at the same time. */
  const u = ease((t - T.holdEnd) / (T.end - T.holdEnd));
  return {
    view: lerpView(whole, scheduleView(scene, f), u),
    edgeX,
    ros: 1,
    others: ease((u - 0.1) / 0.6),
    summary: 1 - ease(u / 0.3),
    focalAxis: 1 - ease(u / 0.3),
    app: ease((u - 0.3) / 0.55),
    list,
  };
}

/** The canvas transform for a view in a frame (translate, then scale, from the top-left). */
export function transformOf(view: CameraView, f: Frame): string {
  const x = f.w / 2 - view.scale * view.cx;
  const y = f.h / 2 - view.scale * view.cy;
  return `translate(${x}px, ${y}px) scale(${view.scale})`;
}
