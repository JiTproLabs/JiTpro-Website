/**
 * The Connect tab's visual, as pure state (Design System Section 54.4.3,
 * redesigned 2026-11-11).
 *
 * ONE SCHEDULE. Connect continues Plan: it draws Plan's scene unchanged (the
 * same rows, application screen, timescale header and calendar grid) and the
 * same featured chain, laid out by the chain's own engine with its three
 * commitments kept and every status removed. Every required-by date is
 * derived from that chain's activities with the scheduling calendar, by the
 * approved placement rules below; no date is authored here.
 *
 * THE STORY (redesigned 2026-11-11). Loose information becomes captured
 * requirements, then organized accountability, then connected commitments:
 *
 *   1. The schedule      Plan's resting view, the application screen.
 *   2. Loose inputs      the camera moves in to the chain's start; small
 *                        project records appear around it and drift, a
 *                        little, attached to nothing.
 *   3. Captured          the drift stops; a rail appears at the left and each
 *                        record travels to its row in it: the three this
 *                        chain depends on first, the rest beneath.
 *   4. Connected         for each of the three, in date order: its row is
 *                        marked, the camera moves to its date, and its card
 *                        (what, who, when, for which activity), its diamond
 *                        on the chain and the connector between them appear.
 *                        Its row then carries the same diamond.
 *   5. All three         the camera eases back until all three connections
 *                        are in view together, and holds.
 *   6. The schedule      back to the application screen, and rest. As the
 *                        camera settles, the copy's dependency summary
 *                        (Section 54.2.2) is revealed, and stays.
 *
 * ONE CLOCK (Sections 46.3, 54.4.3). `connectStateAt(scene, connect, frame, t)`
 * maps time to the camera and every opacity, in the same `PlanState` shape the
 * renderer already applies, plus the inputs, the rail and the commitments.
 *
 * WHAT IT MAY NOT CLAIM. Only the three commitments are the chain's data.
 * The other inputs are illustrative kinds of project information: they carry
 * no date, no owner and no connection, and never gain one. Nothing depicts
 * automatic capture. No status, lateness or variance appears: that is
 * Control's subject.
 */

import { buildChainLayout, type ChainCard, type Measure } from '../demo/screens/procurement-chain/chainLayout';
import { buildSteelWindowsPlannedChain, CHAIN_LABELS } from '../demo/screens/procurement-chain/chainScenario';
import type { CommitmentOwnerRole, ScheduleCommitment, ScheduleItem } from '../demo/screens/procurement-schedule/scheduleModel';
import { addWorkdays, iso, parse, subWorkdays, workdaysBetween } from '../demo/screens/procurement-schedule/workCalendar';
import { CHAIN } from '../demo/screens/procurement-chain/chainLayout';
import { CONNECT_DEPENDENCY_CATEGORIES } from '../../content/homeAudiences';
import {
  BUILD_MIN_SCALE,
  FOCAL_ITEM,
  OTHER_ITEMS,
  PLAN_FOCAL_REQUIRED_ON_SITE,
  REVEAL_RAMP,
  SIDE_MIN_W,
  ZOOM_RAMP,
  buildScale,
  clamp01,
  ease,
  gridAt,
  headerAt,
  labelShiftsAt,
  lerp,
  lerpView,
  listLayout,
  scheduleView,
  sharedDomain,
  toScreen,
  viewInArea,
  type CameraView,
  type Frame,
  type PlanRow,
  type PlanScene,
  type PlanState,
} from './planChainScene';

/** Plan's featured chain, as planned: its three authored commitments, and no status. */
const PLANNED_ITEM: ScheduleItem = buildSteelWindowsPlannedChain(PLAN_FOCAL_REQUIRED_ON_SITE);

/**
 * SIX DEPENDENCIES, PLACED FOR THIS VISUAL (founder direction and approved
 * placements, 2026-11-11; Design System Section 54.4.3). A 312-working-day
 * chain depends on more than three outside requirements, so Connect shows
 * six: the shared scenario's three commitments, and three illustrative
 * requirements of this package added here. The added three are NOT in the
 * shared chain scenario, whose commitment model is limited to the design
 * team, the Owner and consultants: two are owed by the General Contractor
 * with the glazing subcontractor.
 *
 * CONNECT PLACES ALL SIX ITSELF. The approved placements include rules the
 * shared model cannot express (the midpoint of an activity, days after an
 * activity starts), and they move the shared three from the dates that model
 * derives. So the shared scenario stays exactly as it is, and each
 * dependency's date and activity are set here, for Connect only.
 *
 * Nothing about the chain changes. Each date is DERIVED from one of the
 * chain's own activities, by the rule stated beside it, with the same
 * working-day calendar; none is authored as a date, so each follows its
 * activity if the chain's dates change.
 */
const stepOf = (id: string) => {
  const step = PLANNED_ITEM.steps.find((x) => x.id === id);
  if (!step) throw new Error(`connectChainScene: no chain step ${id}`);
  return step;
};
const workdaysBefore = (date: string, n: number) => iso(subWorkdays(parse(date), n));
const workdaysAfter = (date: string, n: number) => iso(addWorkdays(parse(date), n));
/** The middle working day of an activity (the earlier of the two, where its working days are even). */
const midpointOf = (id: string) => {
  const step = stepOf(id);
  const days = workdaysBetween(parse(step.startDate), parse(step.endDate));
  return workdaysAfter(step.startDate, Math.floor((days - 1) / 2));
};

const GC_AND_SUB = 'GC / Glazing Subcontractor';
/** Working days before Buyout finishes that the scope clarification is required. */
export const SCOPE_LEAD_DAYS = 3;
/** Working days before First Submittal Review finishes that the finish and color selection is required. */
export const FINISH_LEAD_DAYS = 3;
/** Working days before Release for Fabrication that the field dimensions are required. */
export const FIELD_DIMENSIONS_LEAD_DAYS = 2;
/** Working days after Fabrication begins that the glazing specification is required. */
export const GLAZING_DAYS_INTO_FABRICATION = 10;

/**
 * The shared scenario's three commitments, as Connect places them: the
 * activity each is shown for, and its date. Who owes each, its name and its
 * type stay the shared scenario's.
 */
const SHARED_PLACEMENT: Readonly<Record<string, { forStep: string; requiredBy: string; description: string }>> = {
  // Final Window & Door Design: the day Submittal Coordination finishes, the last working day before Submittal Preparation begins.
  'swd-c1': {
    forStep: 'swd-3',
    requiredBy: stepOf('swd-2').endDate,
    description: 'Fix opening sizes, sightlines and profiles so submittal preparation can begin against them.',
  },
  // Frame Finish & Color Selection: N working days before First Submittal Review finishes.
  'swd-c2': {
    forStep: 'swd-5',
    requiredBy: workdaysBefore(stepOf('swd-5').endDate, FINISH_LEAD_DAYS),
    description: 'Select the frame finish and color the shop drawings and the fabrication order are finalized against.',
  },
  // Final Glazing Specification: N working days after Fabrication begins.
  'swd-c3': {
    forStep: 'swd-14',
    requiredBy: workdaysAfter(stepOf('swd-14').startDate, GLAZING_DAYS_INTO_FABRICATION),
    description: 'Confirm the glazing make-up, coating and performance for the fabricated units.',
  },
};

const ADDED: readonly {
  id: string;
  name: string;
  typeLabel: string;
  owner: string;
  ownerId: ScheduleCommitment['ownerId'];
  org: ScheduleCommitment['ownerOrganizationId'];
  forStep: string;
  requiredBy: string;
  description: string;
}[] = [
  {
    // Required at the midpoint of Submittal Coordination: its middle working day.
    id: 'swd-x-structural',
    name: 'Structural Attachment Requirements',
    typeLabel: 'Engineering Commitment',
    owner: 'Structural Engineer',
    ownerId: 'MC',
    org: 'structural',
    forStep: 'swd-2',
    requiredBy: midpointOf('swd-2'),
    description: 'Establish attachment details, movement allowances, support conditions and installation requirements for the window and door systems.',
  },
  {
    // Required N working days before Buyout finishes: the subcontract cannot be completed without it.
    id: 'swd-x-scope',
    name: 'Final Scope Clarification',
    typeLabel: 'Information Required',
    owner: GC_AND_SUB,
    ownerId: 'DB',
    org: 'gc',
    forStep: 'swd-1',
    requiredBy: workdaysBefore(stepOf('swd-1').endDate, SCOPE_LEAD_DAYS),
    description: 'Clarify installation responsibilities, hardware scope, perimeter sealants and coordination with adjacent trades so the glazing subcontract can be completed.',
  },
  {
    // Required shortly before the release milestone, clear of the approval milestones' own marks.
    id: 'swd-x-field',
    name: 'Final Field Dimensions',
    typeLabel: 'Information Required',
    owner: GC_AND_SUB,
    ownerId: 'DB',
    org: 'gc',
    forStep: 'swd-13',
    requiredBy: workdaysBefore(stepOf('swd-13').startDate, FIELD_DIMENSIONS_LEAD_DAYS),
    description: 'Verify openings, dimensions and tolerances in the field before this custom package is released for fabrication.',
  },
];

/** The chain Connect draws: Plan's chain, with its three commitments as placed above and the three added, in date order. */
export const CONNECT_ITEM: ScheduleItem = {
  ...PLANNED_ITEM,
  commitments: [
    ...PLANNED_ITEM.commitments.map((p): ScheduleCommitment => {
      const to = SHARED_PLACEMENT[p.id];
      if (!to) throw new Error(`connectChainScene: no placement for commitment ${p.id}`);
      const step = stepOf(to.forStep);
      return {
        ...p,
        requiredBy: to.requiredBy,
        completedDate: p.completedDate === null ? null : to.requiredBy,
        requiredForStepId: step.id,
        requiredForStepName: step.name,
        description: to.description,
      };
    }),
    ...ADDED.map((a): ScheduleCommitment => {
      const template = PLANNED_ITEM.commitments[0];
      const step = stepOf(a.forStep);
      return {
        ...template,
        id: a.id,
        name: a.name,
        type: 'information',
        typeLabel: a.typeLabel,
        // Shown as written. The model's owner roles are a closed list of outside parties; this visual's are not.
        ownerRole: a.owner as CommitmentOwnerRole,
        ownerId: a.ownerId,
        ownerOrganizationId: a.org,
        requiredBy: a.requiredBy,
        completedDate: a.requiredBy,
        requiredForStepId: step.id,
        requiredForStepName: step.name,
        description: a.description,
      };
    }),
  ].sort((x, y) => (x.requiredBy < y.requiredBy ? -1 : x.requiredBy > y.requiredBy ? 1 : 0)),
};
/** How many dependencies the chain shows. */
export const FEATURED_COUNT = CONNECT_ITEM.commitments.length;

export const CONNECT_TIMING = {
  /** On Plan's resting view before the camera moves. */
  START_HOLD: 800,
  ZOOM_IN: 2400,
  /**
   * LOOSE INPUTS. They begin to appear part-way through the zoom, INPUT_STAGGER
   * apart, each over INPUT_IN, and drift until CAPTURE_AFTER after the camera
   * arrives.
   */
  LOOSE_AT: 2000,
  INPUT_STAGGER: 140,
  INPUT_IN: 450,
  CAPTURE_AFTER: 1300,
  /**
   * CAPTURE. The drift dies away over DRIFT_OUT while the rail fades in over
   * RAIL_IN; then each record travels to its row, CAPTURE_STAGGER apart, over
   * CAPTURE_MOVE. CAPTURED_HOLD follows the last arrival.
   */
  DRIFT_OUT: 600,
  RAIL_IN: 500,
  CAPTURE_LEAD: 450,
  CAPTURE_STAGGER: 110,
  CAPTURE_MOVE: 850,
  CAPTURED_HOLD: 500,
  /**
   * A move: a base plus its distance, so longer travel reads as longer, and a
   * hop between neighbouring dates is brief (six dependencies, 2026-11-11).
   */
  MOVE_BASE: 550,
  MOVE_PER_PX: 1,
  MOVE_MIN: 650,
  MOVE_MAX: 3200,
  /**
   * A dependency's reveal, from the camera's arrival: its card (what, who,
   * when, for which activity), then its diamond on the chain, then the
   * connector drawn from the card down to the diamond.
   */
  CARD_AT: 0,
  CARD: 400,
  MARK_AT: 300,
  MARK: 300,
  LEADER_AT: 450,
  LEADER: 400,
  /** The card's rise as it fades in, canvas px. */
  CARD_RISE: 8,
  /** A card gives way as the camera leaves it; its diamond and stem stay. */
  CARD_OUT: 350,
  /** Held still to read the card, once the connector has settled. */
  READ: 1400,
  /** The move out to every connection, and the hold on them. */
  ALL_MOVE: 1400,
  ALL_HOLD: 1300,
  ZOOM_OUT: 2400,
  /**
   * The copy's dependency summary (Section 54.2.2): each category's fade and
   * rise, one after another in reading order, the last finishing exactly as
   * the camera comes to rest.
   */
  SUMMARY: 300,
  SUMMARY_STAGGER: 70,
} as const;

/** The summary's reveal, start to finish. */
const SUMMARY_SPAN = CONNECT_TIMING.SUMMARY + (CONNECT_DEPENDENCY_CATEGORIES.length - 1) * CONNECT_TIMING.SUMMARY_STAGGER;
/** A dependency's whole reveal, from the camera's arrival to the connector settled. */
const REVEAL_SPAN = CONNECT_TIMING.LEADER_AT + CONNECT_TIMING.LEADER;

/**
 * Where the camera holds each station's point across the frame: clear of the
 * rail at the frame's left (desktop), or across the whole frame (phones).
 */
const FRAC = {
  side: { start: 0.36, dependency: 0.64 },
  stacked: { start: 0.06, dependency: 0.5 },
} as const;
/** Canvas px across the frame at the build scale (Plan's BUILD_FRAME_VIEW_W). */
const VIEW_W = 700;
/** Below the bar: the first row of duration labels stays in view. */
const BELOW_BAR = 64;
/** Above the cards. */
const ABOVE_CARDS = 10;
/** Scene px kept clear either side of the connections, in the view of them all. */
const ALL_MARGIN = 70;
/** A connection's diamond is never shown smaller than this on screen, nor enlarged beyond MARK_SCALE_MAX. */
const MARK_MIN_PX = 9;
const MARK_SCALE_MAX = 3.5;

/* ------------------------------------------------------------- the inputs */

/**
 * ILLUSTRATIVE INPUTS. Kinds of project information a contractor meets,
 * shown beside the chain's three real commitments at lower weight. They are
 * not project records: they have a short tag and a name, and nothing else.
 * `at` is each one's loose position, its top-left as a share of the frame.
 */
const ILLUSTRATIVE: readonly { id: string; tag: string; title: string; at: readonly [number, number] }[] = [
  { id: 'permit', tag: 'PERMIT', title: 'Permit Requirement', at: [0.04, 0.15] },
  { id: 'supplier', tag: 'CONF', title: 'Supplier Confirmation', at: [0.675, 0.13] },
  { id: 'manufacturer', tag: 'MFR', title: 'Manufacturer Requirements', at: [0.665, 0.435] },
];
/**
 * The dependencies' loose positions, in date order (the same shares): three
 * columns and four rows above the chain, with room between for the drift.
 */
const FEATURED_AT: readonly (readonly [number, number])[] = [
  [0.035, 0.29],
  [0.36, 0.145],
  [0.355, 0.425],
  [0.67, 0.275],
  [0.045, 0.565],
  [0.365, 0.285],
];

export type ConnectInput = {
  id: string;
  /** The chain's own commitment (its index among the cards), or an illustrative input. */
  featured: number | null;
  /** A short kind: the commitment's own type label, or the illustrative tag. */
  tag: string;
  title: string;
  /** Loose position, as a share of the frame. */
  at: readonly [number, number];
  /** Its row in the rail, top to bottom. */
  slot: number;
  /** When it appears, and when it sets off for the rail (ms). */
  appearAt: number;
  captureAt: number;
  /** Its own drift: amplitudes (px), periods (ms) and phases. */
  drift: { ax: number; ay: number; px: number; py: number; fx: number; fy: number };
};

/** One input's design box, at scale 1: the widest it may be, and its two heights. */
export const INPUT = { w: 176, featuredH: 32, plainH: 22 } as const;
/** The rail's rows, at scale 1: the heading's room, each kind's pitch, and the gap between the two groups. */
export const RAIL = { title: 30, featuredPitch: 34, gap: 12, plainPitch: 25, padX: 12, padY: 14 } as const;
/** A loose input is a little smaller than its row in the rail. */
const LOOSE_SCALE = 0.92;
/** An illustrative input's weight, loose and in the rail. */
const PLAIN_OPACITY = 0.62;

type Rect = { x: number; y: number; w: number; h: number };
export type ConnectLayout = {
  /** side: a rail at the frame's left. stacked (phones): a band beneath the chart, the three commitments only. */
  mode: 'side' | 'stacked';
  rail: Rect;
  /** The chart beside or above the rail, in frame px. */
  chart: Rect;
  /** The rows' scale. */
  s: number;
  /** Each input's row, by slot; null where the input is not shown at this size. */
  slots: ({ x: number; y: number } | null)[];
};

/** The rail and its rows for a frame. The rail's width is Plan's rail's. */
export function connectLayout(f: Frame, count: number, featured: number = FEATURED_COUNT): ConnectLayout {
  if (f.w >= SIDE_MIN_W) {
    const railW = Math.round(Math.min(220, Math.max(176, f.w * 0.33)));
    const s = Math.min(1, (railW - 2 * RAIL.padX + 4) / INPUT.w);
    const slots = Array.from({ length: count }, (_, i) => ({
      x: RAIL.padX,
      y: RAIL.padY + (RAIL.title + (i < featured ? i * RAIL.featuredPitch : featured * RAIL.featuredPitch + RAIL.gap + (i - featured) * RAIL.plainPitch)) * s,
    }));
    return { mode: 'side', rail: { x: 0, y: 0, w: railW, h: f.h }, chart: { x: railW, y: 0, w: f.w - railW, h: f.h }, s, slots };
  }
  /* A phone: the dependencies only, in two columns across a band at the foot. */
  const s = 0.64;
  const rows = Math.ceil(featured / 2);
  const pitch = (INPUT.featuredH + 2) * s;
  const bandH = Math.round(rows * pitch + 12);
  const colW = (f.w - 20) / 2;
  const slots = Array.from({ length: count }, (_, i) =>
    i < featured ? { x: 10 + (i >= rows ? colW : 0), y: f.h - bandH + 7 + (i % rows) * pitch } : null,
  );
  return { mode: 'stacked', rail: { x: 0, y: f.h - bandH, w: f.w, h: bandH }, chart: { x: 0, y: 0, w: f.w, h: f.h - bandH }, s, slots };
}

/* -------------------------------------------------------------- the scene */

export type Station = { x: number; role: 'start' | 'dependency'; arrive: number; leave: number; card?: number };
export type Move = { from: Station; to: Station; start: number; end: number; dist: number };

export type ConnectScene = {
  /** The featured chain, with its cards, placed so its bar sits exactly where Plan's does. */
  focal: PlanRow;
  /**
   * The cards in date order, when each is revealed, and when it gives way to
   * the next. Each card is laid out on its own, directly above its date, so
   * dependencies that fall close together never stack or cross: one card is
   * shown at a time, and each connection keeps its diamond and stem.
   * `textDy`: the card's own text, moved with it into the chain's coordinates.
   */
  cards: (ChainCard & { revealAt: number; hideAt: number; textDy: number })[];
  /** The inputs, in rail order: the three commitments in date order, then the illustrative ones. */
  inputs: ConnectInput[];
  stations: Station[];
  moves: Move[];
  /** The canvas y the camera centres on in the chart. */
  cy: number;
  /** The scene x range that holds all three connections, cards included. */
  all: { left: number; right: number };
  /**
   * `loose`: the first input appears. `capture`: the drift begins to die and
   * the rail appears. `captured`: the last record is in its row. `allArrive`,
   * `allLeave`: the view of all three. `summary`: the copy's dependency
   * summary starts to appear.
   */
  times: { zoomIn: number; travel: number; loose: number; capture: number; captured: number; travelEnd: number; allArrive: number; allLeave: number; summary: number; end: number };
};

/** A small deterministic spread, so each input drifts on its own slow, irregular path. */
const driftOf = (i: number) => ({
  ax: 7 + ((i * 5) % 4),
  ay: 4 + ((i * 3) % 3),
  px: 5600 + ((i * 7) % 5) * 520,
  py: 6400 + ((i * 11) % 6) * 430,
  fx: (i * 2.399) % (2 * Math.PI),
  fy: (i * 4.127 + 1.3) % (2 * Math.PI),
});

export function buildConnectScene(scene: PlanScene, measure: Measure): ConnectScene {
  const domain = sharedDomain([FOCAL_ITEM, ...OTHER_ITEMS]);
  const layoutOf = (item: ScheduleItem) => buildChainLayout(item, { containerWidth: 0, measure, labels: CHAIN_LABELS, domain });
  /* ONE CARD AT A TIME. Dependencies can fall close together (the last two
     are 13 working days apart, either side of two milestones), and laid out
     together close cards stack and their connectors cross. Each card is
     therefore laid out alone, by the chain's own engine,
     directly above its own date, and moved onto the one chain drawn here
     (the tallest card's layout, so every card has room above the bar). */
  const alone = CONNECT_ITEM.commitments.map((c) => layoutOf({ ...CONNECT_ITEM, commitments: [c] }));
  const layout = alone.reduce((a, b) => (b.barTop > a.barTop ? b : a));
  const dy = scene.focal.dy + (scene.focal.layout.barTop - layout.barTop);
  const focal: PlanRow = { item: CONNECT_ITEM, layout: { ...layout, commitments: [] }, dy };
  const T = CONNECT_TIMING;

  const sorted = alone
    .map((own) => {
      const c = own.commitments[0];
      const d = layout.barTop - own.barTop;
      return { ...c, y: c.y + d, markY: c.markY + d, leader: { ...c.leader, y1: c.leader.y1 + d, y2: c.leader.y2 + d }, textDy: d };
    })
    .sort((a, b) => a.markX - b.markX);
  const top = dy + Math.min(...sorted.map((c) => c.y)) - ABOVE_CARDS;
  const bottom = dy + layout.barBottom + BELOW_BAR;

  /* The inputs: appearing in an order that crosses the frame, captured in rail order. */
  const count = sorted.length + ILLUSTRATIVE.length;
  const travel = T.START_HOLD + T.ZOOM_IN;
  const capture = travel + T.CAPTURE_AFTER;
  const appearOrder = [3, 0, 7, 5, 1, 8, 4, 2, 6];
  const inputs: ConnectInput[] = [
    ...sorted.map((c, i) => ({
      id: c.id,
      featured: i as number | null,
      tag: c.commitment!.typeLabel,
      title: c.commitment!.name,
      at: FEATURED_AT[i],
    })),
    ...ILLUSTRATIVE.map((x) => ({ id: x.id, featured: null, tag: x.tag, title: x.title, at: x.at })),
  ].map((x, slot) => ({
    ...x,
    slot,
    appearAt: T.LOOSE_AT + appearOrder.indexOf(slot % appearOrder.length) * T.INPUT_STAGGER,
    captureAt: capture + T.CAPTURE_LEAD + slot * T.CAPTURE_STAGGER,
    drift: driftOf(slot),
  }));
  const captured = capture + T.CAPTURE_LEAD + (count - 1) * T.CAPTURE_STAGGER + T.CAPTURE_MOVE;

  const stations: Station[] = [];
  const moves: Move[] = [];
  const first: Station = { x: scene.chainLeft, role: 'start', arrive: travel, leave: captured + T.CAPTURED_HOLD };
  stations.push(first);
  let clock = first.leave;
  const cards = sorted.map((c, i) => {
    const from = stations[stations.length - 1];
    // Timed on the desktop framing, so the pass is the same length at every size.
    const dist = Math.abs(c.markX - from.x - (FRAC.side.dependency - FRAC.side[from.role]) * VIEW_W);
    const duration = Math.min(T.MOVE_MAX, Math.max(T.MOVE_MIN, T.MOVE_BASE + T.MOVE_PER_PX * dist));
    const to: Station = { x: c.markX, role: 'dependency', arrive: clock + duration, leave: clock + duration + REVEAL_SPAN + T.READ, card: i };
    moves.push({ from, to, start: clock, end: to.arrive, dist });
    stations.push(to);
    clock = to.leave;
    return { ...c, revealAt: to.arrive, hideAt: to.leave };
  });

  const allArrive = clock + T.ALL_MOVE;
  const allLeave = allArrive + T.ALL_HOLD;
  const end = allLeave + T.ZOOM_OUT;

  return {
    focal,
    cards,
    inputs,
    stations,
    moves,
    cy: (top + bottom) / 2,
    /* The connections themselves, first date to last: the cards are not shown in this view. */
    all: {
      left: Math.min(...sorted.map((c) => c.markX)) - ALL_MARGIN,
      right: Math.max(...sorted.map((c) => c.markX)) + ALL_MARGIN,
    },
    times: { zoomIn: T.START_HOLD, travel, loose: T.LOOSE_AT, capture, captured, travelEnd: clock, allArrive, allLeave, summary: end - SUMMARY_SPAN, end },
  };
}

/* -------------------------------------------------------------- the state */

/** A dependency's reveal, 0 to 1 each. */
export type CardState = { mark: number; leader: number; card: number };

/** One input in the frame: its top-left (frame px), its scale, its opacity, and how far it has become a row. */
export type InputState = { x: number; y: number; s: number; o: number; row: number };

export type ConnectState = PlanState & {
  cards: CardState[];
  /** The inputs, loose and then in the rail. */
  inputs: InputState[];
  /** The rail's surface and its heading. */
  rail: number;
  railTitle: number;
  /** Per commitment: its row is the one being connected; and its row carries the connection's diamond. */
  focus: number[];
  linked: number[];
  /**
   * How much larger than drawn the diamonds on the chain are shown, so that
   * in the view of every connection, where the cards are small, the six
   * connected points still read. 1 at the build scale.
   */
  markScale: number;
  /**
   * The copy's dependency summary (Section 54.2.2), one value per category in
   * reading order, 0 to 1: hidden until the return to the schedule is nearly
   * complete, then revealed, and kept.
   */
  categories: number[];
};

/**
 * As lerpView, but the screen point showing canvas point (ax, ay) travels in
 * a straight line, so the chain's start (or end) moves evenly on screen
 * through a large zoom. Same endpoints, scale path and easing.
 */
function lerpViewAnchored2(a: CameraView, b: CameraView, u: number, f: Frame, ax: number, ay: number): CameraView {
  if (u <= 0) return a;
  if (u >= 1) return b;
  const v = lerpView(a, b, u);
  const sx = (w: CameraView) => f.w / 2 + w.scale * (ax - w.cx);
  const sy = (w: CameraView) => f.h / 2 + w.scale * (ay - w.cy);
  return {
    scale: v.scale,
    cx: ax - (lerp(sx(a), sx(b), u) - f.w / 2) / v.scale,
    cy: ay - (lerp(sy(a), sy(b), u) - f.h / 2) / v.scale,
  };
}

/** Eases out: quick to set off, slow to settle, no overshoot (§46.4). */
const settle = (u: number) => 1 - (1 - ease(u)) ** 2;

/** The frame Connect draws in: no step list, so the chain's area is the whole frame. */
export const connectFrame = (f: Frame): Frame => ({ w: f.w, h: f.h, list: false });

export function connectStateAt(scene: PlanScene, c: ConnectScene, frame: Frame, t: number): ConnectState {
  const f = connectFrame(frame);
  const T = CONNECT_TIMING;
  const sB = buildScale(f);
  const area = listLayout(f).area;
  const { k, ox, oy } = scene.place;
  const lay = connectLayout(f, c.inputs.length);
  const frac = FRAC[lay.mode];

  const app = scheduleView(scene, f);
  /* On a phone the rail is a band across the foot of the frame: the chart's
     content is centred in the room above it, so the chain is never under it. */
  const lift = lay.mode === 'stacked' ? lay.rail.h / 2 - 6 : 0;
  const cyAt = (scale: number) => c.cy + lift / scale;
  const stationView = (s: Station) => toScreen(scene, viewInArea(f, s.x, frac[s.role], sB, cyAt(sB)));
  /* All three connections, across the chart beside the rail. */
  const allScale = Math.min(sB, (lay.chart.w * 0.94) / (c.all.right - c.all.left));
  const allMid = (c.all.left + c.all.right) / 2;
  const allView = toScreen(scene, {
    cx: allMid - (lay.chart.x + lay.chart.w / 2 - f.w / 2) / allScale,
    cy: viewInArea(f, allMid, 0.5, allScale, cyAt(allScale)).cy,
    scale: allScale,
  });

  const first = c.stations[0];
  const last = c.stations[c.stations.length - 1];
  const barCy = c.focal.dy + c.focal.layout.barTop + (c.focal.layout.barBottom - c.focal.layout.barTop) / 2;

  let view: CameraView;
  let others = 0;
  let appO = 0;
  let focalAxis = 1;
  /** Everything Connect adds to the schedule: gone as the schedule returns. */
  let layer = 1;

  if (t < c.times.zoomIn) {
    view = app;
    others = 1;
    appO = 1;
    focalAxis = 0;
  } else if (t < c.times.travel) {
    const u = ease((t - c.times.zoomIn) / T.ZOOM_IN);
    view = lerpViewAnchored2(app, stationView(first), u, f, ox + k * scene.chainLeft, oy + k * barCy);
    others = 1 - ease((u - 0.15) / 0.5);
    appO = 1 - ease((u - 0.25) / 0.45);
    focalAxis = ease((u - 0.6) / 0.4);
  } else if (t < c.times.travelEnd) {
    const move = c.moves.find((m) => t >= m.start && t < m.end);
    if (!move) {
      const at = [...c.stations].reverse().find((s) => t >= s.arrive)!;
      view = stationView(at);
    } else {
      const tau = clamp01((t - move.start) / (move.end - move.start));
      const u = ease(tau);
      // A long move eases the camera back, leading the move, as Plan's long activity does.
      const fit = Math.min(sB, Math.max(BUILD_MIN_SCALE, (area.w * 0.85) / move.dist));
      const back = tau < 0.5 ? ease(tau / ZOOM_RAMP) : ease((1 - tau) / ZOOM_RAMP);
      const scale = sB - (sB - fit) * back;
      view = toScreen(scene, viewInArea(f, lerp(move.from.x, move.to.x, u), lerp(frac[move.from.role], frac[move.to.role], u), scale, cyAt(scale)));
    }
  } else if (t < c.times.allLeave) {
    view = lerpView(stationView(last), allView, ease((t - c.times.travelEnd) / T.ALL_MOVE));
  } else {
    const u = ease((t - c.times.allLeave) / T.ZOOM_OUT);
    view = lerpViewAnchored2(allView, app, u, f, ox + k * allMid, oy + k * barCy);
    layer = 1 - ease(u / 0.25);
    focalAxis = 1 - ease(u / 0.3);
    others = ease((u - 0.1) / 0.6);
    appO = ease((u - 0.3) / 0.55);
  }

  const cards = c.cards.map((card) => {
    const local = t - card.revealAt;
    // One card at a time: it and its connector give way as the camera sets
    // off for the next, so a connector is never left standing under another
    // card. The diamond stays on the chain.
    const shown = 1 - ease((t - card.hideAt) / T.CARD_OUT);
    return {
      card: layer * ease((local - T.CARD_AT) / T.CARD) * shown,
      mark: layer * ease((local - T.MARK_AT) / T.MARK),
      leader: layer * ease((local - T.LEADER_AT) / T.LEADER) * shown,
    };
  });

  /* The inputs: loose and drifting, then each to its row. */
  const still = 1 - ease((t - c.times.capture) / T.DRIFT_OUT);
  const TAU = 2 * Math.PI;
  const inputs: InputState[] = c.inputs.map((inp) => {
    const slot = lay.slots[inp.slot];
    if (!slot) return { x: 0, y: 0, s: lay.s, o: 0, row: 0 };
    const appear = ease((t - inp.appearAt) / T.INPUT_IN);
    const row = settle((t - inp.captureAt) / T.CAPTURE_MOVE);
    const d = inp.drift;
    // Two slow sines each way: irregular, never large, and never a circle.
    const dx = d.ax * (0.72 * Math.sin((TAU * t) / d.px + d.fx) + 0.28 * Math.sin((TAU * t) / (d.px * 0.41) + d.fy));
    const dy = d.ay * (0.72 * Math.sin((TAU * t) / d.py + d.fy) + 0.28 * Math.sin((TAU * t) / (d.py * 0.37) + d.fx));
    // Loose inputs keep to the chart on a phone, clear of the band.
    const lx = inp.at[0] * f.w;
    const ly = lay.mode === 'stacked' ? inp.at[1] * lay.chart.h : inp.at[1] * f.h;
    const weight = inp.featured === null ? PLAIN_OPACITY : 1;
    return {
      x: lerp(lx + dx * still * appear, slot.x, row),
      y: lerp(ly + dy * still * appear, slot.y, row),
      s: lerp(lay.s * LOOSE_SCALE, lay.s, row),
      o: layer * appear * weight,
      row,
    };
  });

  const focus = c.cards.map((_, i) => {
    const st = c.stations.find((s) => s.card === i)!;
    const move = c.moves.find((m) => m.to === st)!;
    return layer * clamp01((t - move.start) / 200) * (1 - clamp01((t - st.leave) / 300));
  });
  const linked = c.cards.map((card) => layer * ease((t - (card.revealAt + REVEAL_SPAN)) / 300));

  return {
    view,
    edgeX: scene.steps[scene.steps.length - 1].to - 2 * REVEAL_RAMP,
    ros: 1,
    others,
    summary: 0,
    focalAxis,
    app: appO,
    list: { appear: scene.list.map(() => 0), active: scene.list.map(() => 0), morph: 0 },
    grid: gridAt(scene, view, focalAxis),
    header: headerAt(scene, f, view, focalAxis),
    labelShift: labelShiftsAt(scene, f, view),
    cards,
    inputs,
    rail: layer * ease((t - c.times.capture) / T.RAIL_IN),
    railTitle: layer * ease((t - c.times.capture - 200) / T.RAIL_IN),
    focus,
    linked,
    markScale: Math.min(MARK_SCALE_MAX, Math.max(1, MARK_MIN_PX / (CHAIN.COMMIT_MARK * view.scale * k))),
    categories: CONNECT_DEPENDENCY_CATEGORIES.map((_, i) => ease((t - c.times.summary - i * T.SUMMARY_STAGGER) / T.SUMMARY)),
  };
}
