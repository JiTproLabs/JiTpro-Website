/**
 * The Project Owners tabs' visuals, as pure data and state (Design System
 * Section 54.4.5, 2026-11-11). PURE: no DOM, no React.
 *
 * ONE PROJECT. More predictability and Better decisions read the sample
 * project the general contractor tabs draw: the owner's decisions in its
 * schedule and in Connect's dependencies. No chain, activity, date or
 * dependency is changed or authored here; only short display names are.
 *
 * REDUCE RISK AND PROTECT YOUR INVESTMENT ARE ILLUSTRATIONS (redrawn
 * 2026-11-12): stories told with construction documents, in Identify's
 * style. Reduce risk: a contract, a pair of dice, three unwelcome notices
 * and the contractor's plan. Protect your investment: the general
 * contractor in the middle with the owner, design team, consultants and
 * vendors around; out of control, then in control. Neither reads project
 * data or shows a schedule, an amount or a date.
 *
 * WHO IT SPEAKS TO. The owner is not the user of JiTpro; the general
 * contractor is. Each visual shows what the contractor's planning lets the
 * owner see or avoid. Nothing depicts the owner operating software, and
 * nothing promises an outcome, a saving or a date.
 *
 * ONE CLOCK PER VISUAL (Section 46.3). A visual is a list of cues: each names
 * an element by key and says when it appears, how, and when it leaves.
 * `ownerStateAt(scene, t)` maps time to every element's opacity, rise, drawn
 * length, travel and turn. The renderer applies it and decides nothing.
 */

import { CONNECT_ITEM } from './connectChainScene';
import { partyOf, shortDay, fullDay } from './controlChainScene';
import { ROW_ITEMS, ease } from './planChainScene';

export type OwnerTabId = 'owner-reduce-risk' | 'owner-protect-investment' | 'owner-predictability' | 'owner-better-decisions';
export const OWNER_TABS: readonly OwnerTabId[] = ['owner-reduce-risk', 'owner-protect-investment', 'owner-predictability', 'owner-better-decisions'];
export const isOwnerTab = (id: string): id is OwnerTabId => (OWNER_TABS as readonly string[]).includes(id);
export type OwnerMode = 'desktop' | 'phone';
/** The two canvases (px at scale 1); each is scaled to the frame as vector. */
export const OWNER_CANVAS = { desktop: { w: 560, h: 350 }, phone: { w: 340, h: 212 } } as const;
/** Below this frame width the narrow design is used (as the Control board's). */
export const OWNER_NARROW_BELOW = 460;

/* --------------------------------------------------------------- the data */

/**
 * The owner's decisions in the sample project: every schedule activity the
 * owner is responsible for, and Connect's owner dependency. Read from the
 * data; only the short display wording is authored.
 */
const DECISION_WORDS: Record<string, { title: string; request: string; item: string }> = {
  'swd-c2': { title: 'Frame finish', request: 'Approve window frame finish', item: 'Windows' },
  'itm-lighting': { title: 'Lighting selections', request: 'Select decorative lighting', item: 'Decorative lighting' },
  'itm-tile': { title: 'Tile selections', request: 'Select tile', item: 'Tile' },
  'itm-plumbing': { title: 'Fixture selections', request: 'Select plumbing fixtures', item: 'Plumbing fixtures' },
};
export type OwnerDecision = {
  id: string;
  title: string;
  request: string;
  item: string;
  /** When the owner can begin preparing: the activity's own start, or the start of the activity a dependency is for. */
  prepareFrom: string;
  requiredBy: string;
  /** The activity that cannot proceed without it. */
  neededFor: string;
  /** The item's Required On Site date, and its chain's start. */
  onSite: string;
  chainStart: string;
};
export const OWNER_DECISIONS: OwnerDecision[] = [
  ...CONNECT_ITEM.commitments
    .filter((c) => (c.ownerRole as string) === 'Owner')
    .map((c): OwnerDecision => ({
      id: c.id,
      ...DECISION_WORDS[c.id],
      prepareFrom: CONNECT_ITEM.steps.find((s) => s.id === c.requiredForStepId)!.startDate,
      requiredBy: c.requiredBy,
      neededFor: c.requiredForStepName,
      onSite: CONNECT_ITEM.requiredOnSiteDate,
      chainStart: CONNECT_ITEM.startDate,
    })),
  ...ROW_ITEMS.flatMap((item) =>
    item.steps
      .filter((s) => s.kind === 'phase' && partyOf(s.responsibleOrganizationId) === 'owner')
      .map((s): OwnerDecision => {
        const after = item.steps.slice(item.steps.indexOf(s) + 1).find((q) => q.kind === 'phase');
        return { id: item.id, ...DECISION_WORDS[item.id], prepareFrom: s.startDate, requiredBy: s.endDate, neededFor: after ? after.name : 'Required On Site', onSite: item.requiredOnSiteDate, chainStart: item.startDate };
      }),
  ),
].sort((a, b) => (a.requiredBy < b.requiredBy ? -1 : 1));
for (const d of OWNER_DECISIONS) if (!d.title) throw new Error(`ownerScenes: no display wording for owner decision ${d.id}`);

/* ------------------------------------------- Reduce risk (redrawn 2026-11-12) */

/**
 * REDUCE RISK is an ILLUSTRATION, not a reading of the sample project: a
 * set of drawings, a construction contract and a specification, a pair of dice, six
 * notices nobody wanted, a hand that sweeps them away, and then the
 * contractor's plan. It carries no
 * project data, no date and no amount. Every word below is the founder's
 * (brief, 2026-11-12) except the two headings marked AUTHORED.
 */
export const GAMBLE_CONTRACT = {
  /** AUTHORED: the document's own heading, and a shorter one for a narrow frame. */
  title: 'Construction contract',
  short: 'Contract',
  /** The two promises the owner signed for. Named, never valued. */
  terms: ['Budget', 'Completion date'],
} as const;
/** AUTHORED: the heading of the third project document. */
export const GAMBLE_SPECS = { title: 'Specifications', short: 'Specs' } as const;
/** What the dice stand for (set as one line): the owner's uncertainty about the two promises. */
export const GAMBLE_CAPTION = ['Hoping everything goes', 'according to plan?'] as const;
/** The surprises, in the order they arrive (founder, 2026-11-12: six, where there had been three). */
export const GAMBLE_NOTICES = ['Change order', 'Schedule delay', 'Cost overrun', 'Decision needed now', 'More revisions', 'Another surprise'] as const;
/** The one lettered in the late colour: the demand for a decision now. */
export const GAMBLE_URGENT = GAMBLE_NOTICES.indexOf('Decision needed now');
export const GAMBLE_PLAN = {
  /** AUTHORED: whose document it is, and what it is. */
  whose: 'Your contractor’s',
  title: 'Procurement plan',
  mark: 'JiTpro',
  /**
   * The founder's checklist (2026-11-12). One line is shortened to fit the
   * card: *Responsibilities clearly assigned* is set without *clearly*.
   */
  lines: ['Critical needs identified', 'Decisions scheduled', 'Responsibilities assigned', 'Long-lead items planned', 'Key approvals tracked', 'Risks surfaced early'],
  /** The line beneath the closing headline, in its two sentences. */
  support: ['Your contractor’s procurement plan.', 'Powered by JiTpro.'],
} as const;
/** The faces the dice come to rest on. They mean nothing; they are not a pair, and not a seven. */
export const GAMBLE_DICE = [3, 5] as const;

/* ----------------------------- Protect your investment (redrawn 2026-11-12) */

/**
 * PROTECT YOUR INVESTMENT is an ILLUSTRATION, as Reduce risk is, and built to
 * look nothing like it. THE GENERAL CONTRACTOR IS THE HERO and stands in the
 * middle of the frame throughout; around the contractor stand the four
 * groups the contractor's coordination reaches. Two states of the same
 * picture: the contractor out of control, and disorder spreading outward to
 * all four; then the contractor in control, with JiTpro, and the same four
 * calm and connected. It reads no project data and shows no amount, date or
 * schedule. The owner is not shown guarding against the contractor: the
 * owner is shown what a contractor in control is worth.
 * The words are the founder's (brief, 2026-11-12) except those marked AUTHORED.
 */
export const TEAM = [
  /* In the order of their corners: top left, top right, bottom right, bottom left. Each effect is one of the brief's, shortened;
     each calm word is one of the brief's. None says "scheduled": this is about coordination, not a timetable. */
  { id: 'owner', label: 'Owner', effect: 'Cost exposure', calm: 'Informed' },
  { id: 'design', label: 'Design team', effect: 'Repeated revisions', calm: 'Aligned' },
  { id: 'consultants', label: 'Consultants', effect: 'Extra review', calm: 'Coordinated' },
  { id: 'vendors', label: 'Vendors', effect: 'Stop-start flow', calm: 'Clarity' },
] as const;
export type TeamId = (typeof TEAM)[number]['id'];
/** The hero's name: on two lines in the middle of a desktop frame, shortened on a narrow one. */
export const TEAM_CONTRACTOR = { lines: ['General', 'contractor'], short: 'Contractor' } as const;
/** The two states, named above the picture in the brief's own words. */
export const TEAM_STATES = { out: 'Contractor out of control', in: 'Contractor in control' } as const;
/** The marks on the rushed requests that leave an uncoordinated contractor. */
export const TEAM_REQUESTS = ['Urgent', 'ASAP', 'Revised'] as const;
/**
 * The requests in the order they are sent: who each goes to, which mark it
 * carries, and whether it is that group's first or second. Everyone gets a
 * second while still dealing with the first, and never the same mark twice.
 */
export const TEAM_RUSH = [
  { to: 0, mark: 0, round: 0 },
  { to: 1, mark: 2, round: 0 },
  { to: 2, mark: 1, round: 0 },
  { to: 3, mark: 2, round: 0 },
  { to: 0, mark: 2, round: 1 },
  { to: 1, mark: 1, round: 1 },
  { to: 2, mark: 0, round: 1 },
  { to: 3, mark: 1, round: 1 },
] as const;
/**
 * Wasted money, while the contractor is out of control: how many bills leave
 * each group for the jobsite dumpster. It stands for avoidable waste from
 * poor coordination, never for professional fees as such, and no bill
 * carries a figure.
 */
export const TEAM_WASTE_ROUNDS = 3;
/**
 * Who loses money while the contractor is out of control, in the order they
 * are seen to: the contractor first, then each of the four groups. Everyone
 * loses, the contractor included. `'gc'` is the contractor; a number is a
 * group's place in TEAM. The same five keep their value once the contractor
 * is in control.
 */
export type TeamParty = number | 'gc';
export const TEAM_PARTIES: readonly TeamParty[] = ['gc', ...TEAM.map((_, i) => i)];
/** What stands behind the contractor in control: the mark on the shield, and the phrase beneath the closing line (the founder's, from Reduce risk). */
export const TEAM_MARK = 'JiTpro';
export const TEAM_POWERED = 'Powered by JiTpro.';

/** The order the requests pile up in before they are put in date order: deliberately not date order. */
export const REQUEST_PILE = [1, 3, 0, 2].filter((i) => i < OWNER_DECISIONS.length);

/** The closing line of each visual, exactly as supplied by the founder (2026-11-11; Reduce risk, 2026-11-12). */
export const OWNER_TAKEAWAY: Record<OwnerTabId, string> = {
  'owner-reduce-risk': 'Confidence requires a plan.',
  'owner-protect-investment': 'A coordinated contractor protects your investment.',
  'owner-predictability': 'Fewer surprises. More time to prepare.',
  'owner-better-decisions': 'Clear priorities. Better-informed decisions.',
};
export const OWNER_QUESTION = 'Which decision do you need first?';
export const LOOKAHEAD_STEPS = ['Coming up', 'Prepare', 'Decision required'] as const;
export { shortDay, fullDay };

/* -------------------------------------------------------------- the clock */

export type Cue = {
  /** The element's key. One cue per key. */
  k: string;
  /** When it appears (ms), and over how long. */
  at: number;
  dur?: number;
  /** Rises this many px as it fades in. */
  rise?: number;
  /** A line: drawn along its length rather than faded. */
  draw?: boolean;
  /** When it leaves, and over how long; and how far it stays visible (0 by default). */
  out?: number;
  outDur?: number;
  outTo?: number;
  /**
   * Follows a curve from where it is drawn to `to`, shaped by two control
   * points (a cubic Bezier, all as offsets), turning by `rot` degrees as it
   * goes. It sets off gently and gathers speed, as a thing that is falling does.
   */
  arc?: { at: number; dur: number; c1: { dx: number; dy: number }; c2: { dx: number; dy: number }; to: { dx: number; dy: number }; rot?: number };
  /**
   * Pushed along by something that sweeps `travel` in the direction
   * (`ux`, `uy`) over `dur`: it stays put until the sweeper, which sets out
   * `reach` behind it, arrives, and from then on moves exactly with it, the
   * same way. As it goes it turns up to `spin` degrees. The sweeper itself
   * has reach 0.
   */
  push?: { at: number; dur: number; travel: number; reach: number; ux: number; uy: number; spin?: number };
  /** Travels by (dx, dy) from where it is drawn, turning by `rot` degrees and growing to `scale` as it goes. */
  move?: { at: number; dur: number; dx: number; dy: number; rot?: number; scale?: number };
  /** Arrives from this offset and turn, slowing as it lands where it is drawn. Over `dur`. */
  from?: { dx: number; dy: number; rot?: number };
  /**
   * Rolls in from `dx` to the side: it hops `hops` times, each hop lower than
   * the last, turning `turns` times in all, and comes to rest where it is drawn.
   */
  roll?: { dur: number; dx: number; hop: number; hops: number; turns: number };
};
export type OwnerScene = { tab: OwnerTabId; mode: OwnerMode; cues: Cue[]; end: number };
export type CueState = { o: number; ty: number; draw: number; mx: number; my: number; rot: number; sc: number };

const IN = 350;
const OUT = 350;

export function cueStateAt(c: Cue, t: number): CueState {
  const enter = ease((t - c.at) / (c.dur ?? IN));
  const leave = c.out === undefined ? 0 : ease((t - c.out) / (c.outDur ?? OUT));
  const stay = 1 - leave * (1 - (c.outTo ?? 0));
  const m = c.move ? ease((t - c.move.at) / c.move.dur) : 0;
  /* What is left of an arrival: 1 as it sets out, 0 once landed. Both slow into rest and never pass it (Section 46.4). */
  const left = (dur: number, power: number) => (1 - Math.min(1, Math.max(0, (t - c.at) / dur))) ** power;
  const landing = c.from ? left(c.dur ?? IN, 3) : 0;
  const rolling = c.roll ? left(c.roll.dur, 2) : 0;
  const hop = c.roll ? c.roll.hop * rolling * Math.abs(Math.sin(Math.PI * c.roll.hops * Math.min(1, Math.max(0, (t - c.at) / c.roll.dur)))) : 0;
  /* Along a curve: how far, 0 to 1, gathering speed; and the cubic's weights there. */
  const p = c.arc ? Math.min(1, Math.max(0, (t - c.arc.at) / c.arc.dur)) ** 1.5 : 0;
  const w1 = 3 * (1 - p) * (1 - p) * p;
  const w2 = 3 * (1 - p) * p * p;
  const w3 = p * p * p;
  /* Swept along: how far it has been carried, and that as a share of the whole sweep. */
  const carried = c.push ? Math.max(0, c.push.travel * ease((t - c.push.at) / c.push.dur) - c.push.reach) : 0;
  const share = c.push ? carried / c.push.travel : 0;
  return {
    // A drawn line is fully opaque from its first moment; its length carries the entrance.
    o: (c.draw ? (t >= c.at ? 1 : 0) : enter) * stay,
    ty: (1 - enter) * (c.rise ?? 0),
    draw: c.draw ? enter : 1,
    mx: 0 + (c.move ? c.move.dx * m : 0) + (c.from ? c.from.dx * landing : 0) + (c.roll ? c.roll.dx * rolling : 0) + (c.arc ? w1 * c.arc.c1.dx + w2 * c.arc.c2.dx + w3 * c.arc.to.dx : 0) + (c.push ? carried * c.push.ux : 0),
    my: 0 + (c.move ? c.move.dy * m : 0) + (c.from ? c.from.dy * landing : 0) - hop + (c.arc ? w1 * c.arc.c1.dy + w2 * c.arc.c2.dy + w3 * c.arc.to.dy : 0) + (c.push ? carried * c.push.uy : 0),
    rot: 0 + (c.move?.rot ?? 0) * m + (c.from?.rot ?? 0) * landing + (c.roll ? c.roll.turns * 360 * rolling : 0) + (c.arc?.rot ?? 0) * p + (c.push?.spin ?? 0) * share,
    sc: 1 + ((c.move?.scale ?? 1) - 1) * m,
  };
}
export const ownerStateAt = (scene: OwnerScene, t: number): Record<string, CueState> => Object.fromEntries(scene.cues.map((c) => [c.k, cueStateAt(c, t)]));

/* ------------------------------------------------------------ the layouts */

/**
 * Reduce risk: where each object of the illustration rests. Three project
 * documents are spread across the frame: the drawings to the left, the
 * contract in the middle, the specifications to the right. The dice roll
 * across them and come to rest in the middle of the frame, on the contract
 * beneath its two promises. Six notices pile up in two columns, either side
 * of the dice and never on them. A hand sweeps notices and dice away, up and
 * to the right; the documents stay, then step back, and the plan is laid
 * over them. At the close a navy stage is drawn over all of it and the plan
 * alone is left, enlarged, beside the lockup.
 */
export function gambleGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const die = d ? 34 : 24;
  const notice = d ? { w: 164, h: 54 } : { w: 116, h: 34 };
  /*
   * The sweeping hand. `ax, ay`: where its wrist starts, on its leading side, off the canvas to the left. `tilt`: how far
   * the arm leans from upright, fingers toward the upper right, so that the forearm runs off the lower left. `dir`: the
   * angle above level at which it travels, up and to the right. `travel`: how far. `reach`: its length from wrist to
   * fingertips; `arm`: the length of forearm behind the wrist. `gap`: the sliver between it and what it pushes.
   */
  const hand = d ? { ax: -90, ay: 170, tilt: 22, dir: 25, travel: 1130, scale: 1, reach: 114, arm: 900, gap: 3 } : { ax: -56, ay: 96, tilt: 22, dir: 25, travel: 700, scale: 0.62, reach: 114 * 0.62, arm: 900 * 0.62, gap: 2 };
  const rad = Math.PI / 180;
  /* The way it travels; the way its fingers point; and the way its leading side faces. */
  const go = { x: Math.cos(hand.dir * rad), y: -Math.sin(hand.dir * rad) };
  const along = { x: Math.sin(hand.tilt * rad), y: -Math.cos(hand.tilt * rad) };
  const face = { x: Math.cos(hand.tilt * rad), y: Math.sin(hand.tilt * rad) };
  const bite = go.x * face.x + go.y * face.y;
  return {
    /** The top sheet of the stack of drawings, before its turn (degrees, about its centre). */
    sheet: d ? { x: 14, y: 92, w: 196, h: 128, turn: -4 } : { x: 4, y: 62, w: 108, h: 70, turn: -4 },
    contract: d ? { x: 200, y: 44, w: 160, h: 190 } : { x: 118, y: 12, w: 104, h: 152 },
    /** The specifications, to the right, turned the other way. */
    specs: d ? { x: 374, y: 58, w: 164, h: 176, turn: 3 } : { x: 232, y: 24, w: 104, h: 124, turn: 3 },
    /** The centre line of each promise on the contract; and where its label begins. */
    termY: d ? [106, 138] : [54, 84],
    termX: d ? 240 : 148,
    /** The dice: their size, where each comes to rest (the middle of the frame), and how they roll in from the right, across the documents. */
    die,
    dice: d
      ? [
          { cx: 262, cy: 178, turn: -8 },
          { cx: 300, cy: 190, turn: 12 },
        ]
      : [
          { cx: 159, cy: 118, turn: -8 },
          { cx: 184, cy: 126, turn: 12 },
        ],
    roll: d ? { dx: 330, hop: 30 } : { dx: 200, hop: 20 },
    /** The caption, on one line beneath everything: its centre and its baseline. */
    caption: d ? { x: 280, y: 270 } : { x: 170, y: 183 },
    /** The notices: one size, each resting at a centre and a turn, each arriving from an offset. */
    notice,
    /* In order of arrival, alternating sides: the first, third and fifth form a column to the left of the dice, the second,
       fourth and sixth a column to the right. Each lands a little lower than the one above, so its heading shows. */
    notices: d
      ? [
          { cx: 126, cy: 96, turn: -6, from: { dx: -70, dy: -10, rot: -10 } },
          { cx: 438, cy: 100, turn: 4, from: { dx: 80, dy: -30, rot: 12 } },
          { cx: 120, cy: 152, turn: 5, from: { dx: -90, dy: 10, rot: 12 } },
          { cx: 444, cy: 156, turn: -5, from: { dx: 100, dy: 10, rot: -12 } },
          { cx: 128, cy: 208, turn: -3, from: { dx: -70, dy: 40, rot: -10 } },
          { cx: 434, cy: 212, turn: 6, from: { dx: 70, dy: 50, rot: 12 } },
        ]
      : [
          { cx: 62, cy: 44, turn: -6, from: { dx: -44, dy: -6, rot: -10 } },
          { cx: 277, cy: 46, turn: 4, from: { dx: 50, dy: -18, rot: 12 } },
          { cx: 60, cy: 86, turn: 5, from: { dx: -56, dy: 6, rot: 12 } },
          { cx: 279, cy: 88, turn: -5, from: { dx: 60, dy: 6, rot: -12 } },
          { cx: 63, cy: 128, turn: -3, from: { dx: -44, dy: 24, rot: -10 } },
          { cx: 276, cy: 130, turn: 6, from: { dx: 44, dy: 30, rot: 12 } },
        ],
    hand,
    /** The hand's three directions, as unit vectors: travel, fingers, leading side. */
    sweep: { go, along, face },
    /**
     * How far the hand must travel before its leading side reaches a thing of
     * this half-size centred here. From then on the thing moves with it.
     */
    sweepReach: (cx: number, cy: number, halfW: number, halfH: number) => ((cx - hand.ax) * face.x + (cy - hand.ay) * face.y - (halfW * Math.abs(face.x) + halfH * Math.abs(face.y)) - hand.gap) / bite,
    /** The contractor's plan, and the centre line of each of its lines. */
    plan: d ? { x: 354, y: 40, w: 186, h: 192 } : { x: 200, y: 10, w: 136, h: 160 },
    /** How far to the right the plan sets out from: beyond the canvas. */
    planFrom: d ? 215 : 145,
    lineY: (i: number) => (d ? 40 + 64 + i * 22.6 : 10 + 47 + i * 19.5),
    /**
     * The closing frame, on a navy stage: the plan travels to the left of the
     * frame and grows until it nearly fills its height (the camera pushing in
     * on it); the lockup stands to its right, set from `textX`: a short rule,
     * the headline on two lines, then the supporting line.
     */
    lockup: d
      ? { dx: -287, dy: 39, scale: 1.4, textX: 318, ruleY: 126, head: 24, headY: [162, 190], support: 11.5, supportY: [221, 239] }
      : { dx: -176, dy: 16, scale: 1.18, textX: 186, ruleY: 60, head: 15, headY: [84, 102], support: 9, supportY: [122, 134, 147] },
    /** The stage's drawing grid: its pitch, and how far its sheet border stands in from the canvas. */
    stage: d ? { grid: 28, inset: 10 } : { grid: 21.2, inset: 6 },
  };
}

/**
 * Protect your investment: the contractor in the middle; the owner, the
 * design team, the consultants and the vendors in the four corners; the
 * state named above; a band along the foot for the close. Everything that
 * happens starts at the contractor and travels outward.
 */
export function teamGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const card = d ? { w: 124, h: 66 } : { w: 100, h: 46 };
  /* Top left, top right, bottom right, bottom left. */
  const at = d
    ? [
        { x: 20, y: 40 },
        { x: 416, y: 40 },
        { x: 416, y: 184 },
        { x: 20, y: 184 },
      ]
    : [
        { x: 6, y: 22 },
        { x: 234, y: 22 },
        { x: 234, y: 108 },
        { x: 6, y: 108 },
      ];
  const onLeft = (i: number) => i === 0 || i === 3;
  const onTop = (i: number) => i < 2;
  /* The anchor of the picture: larger than anything around it. */
  const shield = d ? { cx: 280, cy: 145, w: 146, h: 172 } : { cx: 170, cy: 88, w: 88, h: 104 };
  /* The contractor out of control: a plain card, askew. */
  const loose = d ? { w: 116, h: 96, turn: -5 } : { w: 74, h: 60, turn: -5 };
  const tag = d ? { w: 60, h: 19 } : { w: 44, h: 13 };
  /* A card's edge nearest the contractor, and its middle height. */
  const inner = (i: number) => (onLeft(i) ? at[i].x + card.w : at[i].x);
  const mid = (i: number) => at[i].y + card.h / 2;
  /* Where a request comes to rest: on the card's inner corners, the first at the top, the second at the foot. */
  const tagAt = (to: number, round: number) => {
    const inset = (d ? [20, 30] : [14, 22])[round] * (onLeft(to) ? -1 : 1);
    return { cx: inner(to) + inset, cy: round === 0 ? at[to].y - (d ? 2 : 1) : at[to].y + card.h - (d ? 3 : 2), turn: (round === 0 ? 6 : -5) * (onLeft(to) ? 1 : -1) };
  };
  /* The shield's sides are upright between these two heights; every line of the second state meets it there. */
  const left = shield.cx - shield.w / 2;
  const right = shield.cx + shield.w / 2;
  const high = shield.cy - shield.h * 0.24;
  const low = shield.cy + shield.h * 0.08;
  const turnL = left - (d ? 36 : 12);
  const turnR = right + (d ? 36 : 12);
  /* How tightly a connecting line turns. */
  const bend = d ? 7 : 4;
  /* A box: long, low, and flat on the ground. `skew` is how far the far side is seen to sit to the right of the near one. */
  const bin = d ? { cx: 275.5, top: 244, w: 104, h: 38, rim: 11, skew: 9 } : { cx: 167, top: 144, w: 66, h: 22, rim: 7, skew: 6 };
  const bill = d ? { w: 24, h: 13 } : { w: 16, h: 9 };
  return {
    card,
    at,
    onLeft,
    shield,
    loose,
    stateY: d ? 24 : 13,
    tag,
    tagAt,
    /** Each request sets out from the contractor. */
    tagFrom: (to: number, round: number) => {
      const rest = tagAt(to, round);
      return { dx: shield.cx - rest.cx, dy: shield.cy - rest.cy, rot: -rest.turn * 2 };
    },
    /** The first state: a jagged line from the contractor's card out to each group. Friction, drawn. */
    friction: (i: number) => zigzag(shield.cx + (onLeft(i) ? -1 : 1) * loose.w * 0.46, shield.cy + (onTop(i) ? -1 : 1) * loose.h * 0.3, inner(i), mid(i), d ? 6 : 5, d ? 5 : 3.5),
    /**
     * The second state: a level line from the shield to each group, with two
     * rounded corners. On each side one turns up and one down; none shares a path.
     */
    link: (i: number) => {
      const out = onLeft(i) ? -1 : 1;
      const y1 = onTop(i) ? high : low;
      const y2 = mid(i);
      const up = y2 < y1 ? -1 : 1;
      const turn = onLeft(i) ? turnL : turnR;
      return `M${onLeft(i) ? left : right} ${y1}H${turn - out * bend}Q${turn} ${y1} ${turn} ${y1 + up * bend}V${y2 - up * bend}Q${turn} ${y2} ${turn + out * bend} ${y2}H${inner(i)}`;
    },
    /** Its two ends: on the shield's edge, and on the card's. A node is drawn at each. */
    linkEnd: (i: number) => ({ shield: { x: onLeft(i) ? left : right, y: onTop(i) ? high : low }, card: { x: inner(i), y: mid(i) } }),
    bend,
    /** The background: the pitch of a drawing sheet's grid. */
    ground: { grid: d ? 28 : 21.2 },
    meets: { left, right, high, low, turnL, turnR },
    /**
     * The jobsite dumpster, low in the middle of the frame beneath the
     * contractor: a rectangular steel box sitting on the ground, seen a little
     * from above and to one side. `top` is the near edge of its open top;
     * `rim` and `skew` are how far up and across the far edge is seen. Its
     * near wall and its visible end together are centred in the frame.
     */
    bin,
    bill,
    /**
     * A bill's path from a group's card into the dumpster: a curve of four
     * points. From an upper card it drops out of the foot of the card, sweeps
     * across beneath the contractor, and comes over the dumpster; from a lower
     * card it lifts off the card's inner edge and over. Either way the last
     * stretch is straight down, through the open top, to rest inside, below
     * the front edge. Each round lands a little further along the container.
     */
    billPath: (who: TeamParty, round: number) => {
      if (who === 'gc') {
        /* The contractor's own money: out of the foot of the contractor's card and straight down into the dumpster beneath it. */
        const from = { x: shield.cx + (round - 1) * bill.w * 0.5, y: shield.cy + loose.h / 2 + bill.h / 2 + 4 };
        const to = { x: bin.cx + (round - 1) * bin.w * 0.07, y: bin.top + bin.h * 0.55 };
        return { from, c1: { x: from.x + (round - 1) * (d ? 8 : 5), y: from.y + (d ? 12 : 4) }, c2: { x: to.x, y: bin.top - (d ? 18 : 8) }, to };
      }
      const i = who;
      const side = onLeft(i) ? -1 : 1;
      const from = onTop(i) ? { x: at[i].x + card.w / 2, y: at[i].y + card.h + (d ? 3 : 2) } : { x: inner(i) + side * (d ? 14 : 9), y: mid(i) + (d ? 6 : 4) };
      const to = { x: bin.cx + side * bin.w * (0.2 + round * 0.04), y: bin.top + bin.h * 0.55 };
      const c1 = onTop(i) ? { x: from.x + (to.x - from.x) * (d ? 0.6 : 0.7), y: from.y + (d ? 95 : 82) } : { x: from.x - side * (d ? 36 : 34), y: from.y - (d ? 24 : 14) };
      const c2 = { x: to.x, y: bin.top - (onTop(i) ? (d ? 24 : 16) : d ? 32 : 18) };
      return { from, c1, c2, to };
    },
    /**
     * Protected value, once the contractor is in control: the middle of a
     * small shield with a dollar sign, the same on each of the five. On a
     * group's card, the inner foot, where the second rushed request had been.
     * For the contractor it stands just outside the great shield, at its
     * lower right: a shield drawn on the shield would be one nested in another.
     */
    keepAt: (who: TeamParty) =>
      who === 'gc' ? { x: shield.cx + shield.w * 0.42, y: shield.cy + shield.h * 0.34 } : { x: inner(who) + (onLeft(who) ? -1 : 1) * (d ? 20 : 14), y: at[who].y + card.h - (d ? 17 : 12) },
    badge: d ? { w: 18, h: 21 } : { w: 13, h: 15 },
    /** The close: a navy band along the foot, its closing line and the phrase beneath it. */
    band: d ? { y: 290, head: 17, headY: 316, support: 11, supportY: 336 } : { y: 170, head: 10, headY: 188, support: 7.5, supportY: 202 },
  };
}

/**
 * The Hero's house render, reused behind Protect your investment (founder,
 * 2026-11-12). Its own size, never cropped or stretched; and where it sits
 * in the frame, as shares of the frame: centred, as wide as it can be while
 * its foot rests on the closing band's top edge.
 */
export const HOUSE_RENDER = { w: 1600, h: 954 } as const;
export function houseBackdrop() {
  const { w, h } = OWNER_CANVAS.desktop;
  const rise = teamGeometry('desktop').band.y / h;
  return { width: Math.min(1, (rise * h * (HOUSE_RENDER.w / HOUSE_RENDER.h)) / w), bottom: 1 - rise };
}

/** A jagged line from one point to another: `teeth` turns, each `reach` to one side and then the other. */
export function zigzag(x1: number, y1: number, x2: number, y2: number, teeth: number, reach: number): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const round = (n: number) => Math.round(n * 10) / 10;
  let path = `M${round(x1)} ${round(y1)}`;
  for (let k = 1; k <= teeth; k++) {
    const u = k / (teeth + 1);
    const side = k % 2 ? 1 : -1;
    path += `L${round(x1 + (x2 - x1) * u + nx * reach * side)} ${round(y1 + (y2 - y1) * u + ny * reach * side)}`;
  }
  return `${path}L${round(x2)} ${round(y2)}`;
}

/** The shield: a flat top with rounded shoulders, upright sides, drawing in to a point. Modern and plain; neither a crest nor a badge. */
export function shieldPath(s: { cx: number; cy: number; w: number; h: number }): string {
  const l = s.cx - s.w / 2;
  const r = s.cx + s.w / 2;
  const t = s.cy - s.h / 2;
  const b = s.cy + s.h / 2;
  const c = s.w * 0.11;
  const waist = s.cy + s.h * 0.12;
  return `M${l} ${t + c}Q${l} ${t} ${l + c} ${t}H${r - c}Q${r} ${t} ${r} ${t + c}V${waist}C${r} ${s.cy + s.h * 0.36} ${s.cx + s.w * 0.2} ${s.cy + s.h * 0.46} ${s.cx} ${b}C${s.cx - s.w * 0.2} ${s.cy + s.h * 0.46} ${l} ${s.cy + s.h * 0.36} ${l} ${waist}Z`;
}

/** The request cards of Better decisions: where each is piled, and its row once in date order. */
export function requestGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const card = d ? { w: 300, h: 40 } : { w: 204, h: 26 };
  const rowX = d ? 20 : 10;
  const rowY = (i: number) => (d ? 44 + i * 52 : 28 + i * 31);
  const pile = d
    ? [
        { x: 120, y: 58 },
        { x: 152, y: 94 },
        { x: 100, y: 130 },
        { x: 168, y: 166 },
      ]
    : [
        { x: 60, y: 30 },
        { x: 84, y: 54 },
        { x: 48, y: 78 },
        { x: 92, y: 102 },
      ];
  return { card, rowX, rowY, pile, why: d ? { x: 340, y: 44, w: 200, h: 144 } : { x: 10, y: 62, w: 320, h: 92 } };
}

/* -------------------------------------------------------------- the scenes */

function riskScene(mode: OwnerMode): OwnerScene {
  const g = gambleGeometry(mode);
  /* The surprises arrive one at a time, each sooner and faster than the last: mounting pressure. */
  const arrives = [4100, 4520, 4900, 5240, 5540, 5800];
  const lands = [440, 400, 360, 320, 290, 260];
  /** The last surprise has landed; everything is held still, just long enough to register; then the hand sweeps. */
  const PILED = arrives[arrives.length - 1] + lands[lands.length - 1];
  const PAUSE = 700;
  const SWEEP = PILED + PAUSE;
  const SWEEP_MS = 1350;
  const CLEARED = SWEEP + SWEEP_MS;
  /* Everything the hand pushes moves exactly with it from the moment it is reached, the way the hand is going, and is taken
     out of the picture only once the sweep is over and it is long off the table. */
  const pushed = (cx: number, cy: number, halfW: number, halfH: number, spin: number) => ({
    push: { at: SWEEP, dur: SWEEP_MS, travel: g.hand.travel, reach: g.sweepReach(cx, cy, halfW, halfH), ux: g.sweep.go.x, uy: g.sweep.go.y, spin },
    out: CLEARED,
    outDur: 100,
  });
  /** The table is clear: the documents are seen alone for a beat, then step back; and the plan arrives. */
  const RESET = CLEARED + 100;
  const PLAN = RESET + 300;
  const SETTLE = 650;
  const lineAt = (i: number) => PLAN + SETTLE + 150 + i * 300;
  /** When the camera pushes in on the plan, and everything else is let go. */
  const PUSH = lineAt(GAMBLE_PLAN.lines.length - 1) + 650;
  /* The documents are never swept. They step back to a ghost of themselves as the plan is laid over them, and the stage covers them at the close. */
  const paper = { out: RESET, outDur: 450, outTo: 0.16 };
  const cues: Cue[] = [
    // 1. Trust: three project documents, spread across the frame; and on the contract, a budget and a completion date.
    { k: 'drawings', at: 0, dur: 400, ...paper },
    { k: 'contract', at: 250, dur: 450, rise: 8, ...paper },
    { k: 'specs', at: 500, dur: 450, rise: 8, ...paper },
    ...GAMBLE_CONTRACT.terms.map((_, i): Cue => ({ k: `term-${i}`, at: 950 + i * 250, ...paper })),
    // 2. Uncertainty: a pair of dice rolls across the documents and comes to rest in the middle of the frame.
    ...g.dice.map(
      (die, i): Cue => ({
        k: `die-${i}`,
        at: 2000 + i * 110,
        dur: 150,
        roll: { dur: 1150 + i * 120, dx: g.roll.dx, hop: g.roll.hop, hops: 2, turns: 0.9 + i * 0.1 },
        ...pushed(die.cx, die.cy, g.die / 2, g.die / 2, 80 + i * 50),
      }),
    ),
    // The question, beneath them. It stays through the surprises and the pause, and goes as the hand comes in.
    { k: 'caption', at: 3400, rise: 4, out: SWEEP, outDur: 300 },
    // 3. The surprises: six notices land either side of the dice, never on them, faster and faster. Then nothing moves.
    ...g.notices.map((n, i): Cue => ({ k: `notice-${i}`, at: arrives[i], dur: lands[i], from: n.from, ...pushed(n.cx, n.cy, g.notice.w / 2, g.notice.h / 2, n.turn * 3) })),
    // 4. A hand comes in from the lower left and sweeps up and to the right, taking notices and dice with it. The documents stay.
    { k: 'hand', at: SWEEP, dur: 60, push: { at: SWEEP, dur: SWEEP_MS, travel: g.hand.travel, reach: 0, ux: g.sweep.go.x, uy: g.sweep.go.y }, out: CLEARED, outDur: 60 },
    // 5. A better alternative: the contractor's plan slides in over the documents, which have stepped back; its lines are checked.
    // 6. Confidence: with every line checked, a navy stage is drawn across the frame and the plan,
    //    the one thing left on it, moves to the left and grows.
    { k: 'stage', at: PUSH, dur: 600 },
    { k: 'plan', at: PLAN, dur: SETTLE, from: { dx: g.planFrom, dy: 0, rot: 3 }, move: { at: PUSH, dur: 900, dx: g.lockup.dx, dy: g.lockup.dy, scale: g.lockup.scale } },
    ...GAMBLE_PLAN.lines.flatMap((_, i): Cue[] => [
      { k: `line-${i}`, at: lineAt(i) },
      { k: `check-${i}`, at: lineAt(i) + 150, dur: 300, draw: true },
    ]),
    { k: 'takeaway', at: PUSH + 700, rise: 6 },
  ];
  return { tab: 'owner-reduce-risk', mode, cues, end: PUSH + 2400 };
}

function investmentScene(mode: OwnerMode): OwnerScene {
  const g = teamGeometry(mode);
  /** When the first state is withdrawn; when the shield begins to be drawn; when the closing band rises. */
  const REWIND = 6600;
  const GUARD = 7000;
  const BAND = 11300;
  const first = { out: REWIND };
  const n = TEAM.length;
  /** How long a bill takes from its card into the dumpster: slow enough to follow. */
  const BILL_FLIGHT = 1100;
  /** The contractor's own bills fall a short way, straight down. */
  const BILL_DROP = 800;
  const cues: Cue[] = [
    // The sheet the picture is drawn on: a faint grid and crop marks. It is there throughout.
    { k: 'ground', at: 0, dur: 600 },
    // 1. The contractor, in the middle, and the four groups around; the state is named.
    { k: 'loose', at: 0, dur: 450, rise: 6, ...first },
    { k: 'stateOut', at: 300, ...first },
    ...TEAM.map((_, i): Cue => ({ k: `card-${i}`, at: 600 + i * 200, rise: 5 })),
    // Out of control: friction runs outward to each group, and rushed requests follow it.
    ...TEAM.map((_, i): Cue => ({ k: `friction-${i}`, at: 1900 + i * 150, dur: 500, draw: true, ...first })),
    ...TEAM_RUSH.map((r, i): Cue => ({ k: `rush-${i}`, at: (r.round === 0 ? 2300 : 4500) + r.to * 200, dur: 420, from: g.tagFrom(r.to, r.round), ...first })),
    // What it does to each of them, between the first requests and the second.
    ...TEAM.map((_, i): Cue => ({ k: `effect-${i}`, at: 3400 + i * 220, rise: 3, ...first })),
    // And money is wasted: a jobsite dumpster, and bills leaving the contractor and all four groups for it in turn. The flow builds: each
    // bill follows the last a little sooner. No new bill is launched once the disorder is withdrawn; those in the air
    // finish their fall; and the dumpster goes as the shield begins to be drawn.
    ...(['binBack', 'bin'] as const).map((k): Cue => ({ k, at: 3350, rise: 4, out: GUARD, outDur: 400 })),
    ...Array.from({ length: TEAM_WASTE_ROUNDS }, (_, r) =>
      TEAM_PARTIES.map((who, e): Cue => {
        const nth = r * TEAM_PARTIES.length + e;
        const at = 3500 + nth * 195 - ((nth * (nth - 1)) / 2) * 7;
        const path = g.billPath(who, r);
        const by = (point: { x: number; y: number }) => ({ dx: point.x - path.from.x, dy: point.y - path.from.y });
        // The contractor's bills have only a short way to fall; the groups' cross the frame.
        const flight = who === 'gc' ? BILL_DROP : BILL_FLIGHT;
        const turn = who === 'gc' ? (r - 1) * 14 : (g.onLeft(who) ? 1 : -1) * (24 + r * 10);
        return { k: `bill-${who}-${r}`, at, dur: 250, arc: { at: at + 250, dur: flight, c1: by(path.c1), c2: by(path.c2), to: by(path.to), rot: turn }, out: at + 250 + flight, outDur: 120 };
      }),
    ).flat(),
    // 2. In control: the shield is drawn around the contractor, calmly, then stands; the state is named again.
    { k: 'guard', at: GUARD, dur: 900, draw: true },
    { k: 'shield', at: GUARD + 700, dur: 500 },
    { k: 'stateIn', at: GUARD + 1200 },
    // The same four, reached one after another by a level line, each settling as it is reached.
    ...Array.from({ length: n }, (_, i): Cue[] => [
      { k: `node-${i}`, at: GUARD + 1700 + i * 150, dur: 200 },
      { k: `link-${i}`, at: GUARD + 1700 + i * 150, dur: 450, draw: true },
      { k: `calm-${i}`, at: GUARD + 2050 + i * 150, rise: 3 },
    ]).flat(),
    // Then value is protected: once the network is whole and calm, a small shield with a dollar sign settles beside each of the
    // five, one by one, the groups first and the contractor last. Where money was leaving, it is now kept.
    ...[...TEAM.map((_, i): TeamParty => i), 'gc' as TeamParty].map((who, j): Cue => ({ k: `keep-${who}`, at: GUARD + 2900 + j * 170, dur: 400, rise: 4 })),
    // 3. The close: nothing is taken away; a navy band rises along the foot with the closing line.
    { k: 'band', at: BAND, dur: 500 },
    { k: 'takeaway', at: BAND + 400, rise: 5 },
  ];
  return { tab: 'owner-protect-investment', mode, cues, end: BAND + 2400 };
}

function predictabilityScene(mode: OwnerMode): OwnerScene {
  const n = OWNER_DECISIONS.length;
  const rows = (k: string, at: number, stagger: number, extra: Partial<Cue> = {}) => Array.from({ length: n }, (_, i): Cue => ({ k: `${k}-${i}`, at: at + i * stagger, ...extra }));
  const cues: Cue[] = [
    { k: 'axis', at: 0 },
    // 1. What the field needs, and when.
    ...rows('site', 400, 250),
    // 2. Backward: the procurement each one depends on.
    ...rows('chain', 2400, 200, { dur: 700, draw: true }),
    // 3. The owner's part of each, on its own date.
    ...rows('window', 4800, 450),
    ...rows('decide', 5000, 450, { rise: 4 }),
    // 4. Advance notice: coming up, prepare, decision required.
    ...rows('notice', 7600, 150, { dur: 500, draw: true }),
    { k: 'legend', at: 7800, rise: 5 },
    // 5. The takeaway.
    { k: 'takeaway', at: 10200, rise: 6 },
  ];
  return { tab: 'owner-predictability', mode, cues, end: 11600 };
}

function decisionsScene(mode: OwnerMode): OwnerScene {
  const g = requestGeometry(mode);
  const n = OWNER_DECISIONS.length;
  const cues: Cue[] = [];
  REQUEST_PILE.forEach((d, order) => {
    const from = g.pile[order];
    // Drawn where it is piled; it travels to its row, in date order.
    cues.push({ k: `req-${d}`, at: 300 + order * 450, rise: 8, move: { at: 4900, dur: 900, dx: g.rowX - from.x, dy: g.rowY(d) - from.y }, ...(mode === 'phone' && d > 0 ? { out: 7200, outTo: 0.2 } : {}) });
    cues.push({ k: `asap-${d}`, at: 300 + order * 450 + 150, out: 5000, outDur: 300 });
    cues.push({ k: `due-${d}`, at: 5700 + d * 120 });
  });
  cues.push(
    // 2. The owner's question.
    { k: 'question', at: 2700, rise: 6, out: 4600 },
    // 3. In order: the one needed first.
    { k: 'first', at: 6300 },
    // 4. Why its date matters.
    { k: 'why', at: 7300, rise: 6 },
    { k: 'whyPath', at: 7700, dur: 900, draw: true },
    { k: 'takeaway', at: 9900, rise: 6 },
  );
  if (n === 0) throw new Error('ownerScenes: the sample project has no owner decisions');
  return { tab: 'owner-better-decisions', mode, cues, end: 11300 };
}

export function buildOwnerScene(tab: OwnerTabId, mode: OwnerMode): OwnerScene {
  if (tab === 'owner-reduce-risk') return riskScene(mode);
  if (tab === 'owner-protect-investment') return investmentScene(mode);
  if (tab === 'owner-predictability') return predictabilityScene(mode);
  return decisionsScene(mode);
}

/** The calendar the look-ahead is drawn on: whole months from the earliest preparation to the latest on-site date. */
export function lookaheadWindow() {
  const first = OWNER_DECISIONS.map((d) => d.prepareFrom).sort()[0];
  const last = OWNER_DECISIONS.map((d) => d.onSite).sort().pop()!;
  const s = new Date(first + 'T00:00:00Z');
  s.setUTCDate(1);
  const e = new Date(last + 'T00:00:00Z');
  e.setUTCMonth(e.getUTCMonth() + 1, 1);
  const months: { t: number; label: string; year: number; first: boolean }[] = [];
  const NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let d = new Date(s); d < e; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)))
    months.push({ t: d.getTime(), label: NAMES[d.getUTCMonth()], year: d.getUTCFullYear(), first: d.getUTCMonth() === 0 || months.length === 0 });
  return { start: s.getTime(), end: e.getTime(), months };
}
