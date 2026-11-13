/**
 * The Project Owners tabs' visuals, as pure data and state (Design System
 * Section 54.4.5, 2026-11-11). PURE: no DOM, no React.
 *
 * ONE PROJECT. More predictability reads the sample
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
/** The turn of the story, shown alone on the cleared table before the plan arrives (founder, 2026-11-12). */
export const GAMBLE_TURN = 'It doesn’t have to be this way.';
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
/**
 * The sweeping hand's illustration (`SweepingHand.tsx`), measured in its own
 * units about the wrist: fingers up the page (negative y), sleeve down it.
 * `tip`: the tip of the middle finger, the foremost point of the hand.
 * `arm`: the length of sleeve drawn behind the wrist, long enough that its
 * cut end is never seen. `front`: the outline that can meet something as the
 * hand goes forward, from the outside of the thumb round its tip, across the
 * web, over the four fingertips and down the leading side to the cuff and
 * the first of the sleeve. `rest`: the rest of the sleeve's outline, which
 * touches nothing but must be out of sight before and after. Both follow the
 * drawn outline; if the drawing changes, they change with it.
 */
export const SWEEP_HAND = {
  tip: { x: -43, y: -155.8 },
  arm: 900,
  front: [
    [-87, -54], [-96.5, -81.2], [-93.8, -89.5], [-85.5, -86.8], [-77, -70], [-69.5, -57.5], [-66, -84], [-63.2, -137], [-57.5, -142.7], [-51.8, -137],
    [-50.5, -127], [-48.8, -150], [-43, -155.8], [-37.2, -150], [-35, -128], [-33.1, -138.5], [-27.5, -144.1], [-21.9, -138.5], [-19.2, -104], [-17, -113],
    [-12, -118], [-7, -113], [-2, -68], [-0.5, -36], [-8, 5], [-2.5, 17], [0, 13], [0, 240],
  ],
  rest: [[0, 900], [-88, 900], [-86, 300], [-62, 13], [-53, 5], [-70, -18]],
} as const;

type Spot = { x: number; y: number };
/** Something on the table that can be pushed: a rectangle about its centre, turned. */
export type SweepBox = { cx: number; cy: number; hw: number; hh: number; turn: number };
const RAD = Math.PI / 180;
/** Points along a line of points, no more than `step` apart. */
const spaced = (points: readonly Spot[], step: number, closed = false): Spot[] => {
  const out: Spot[] = [];
  const n = closed ? points.length : points.length - 1;
  for (let i = 0; i < n; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const parts = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
    for (let k = 0; k < parts; k++) out.push({ x: a.x + ((b.x - a.x) * k) / parts, y: a.y + ((b.y - a.y) * k) / parts });
  }
  if (!closed) out.push(points[points.length - 1]);
  return out;
};
/** A box's four corners. */
export const boxCorners = (b: SweepBox): Spot[] => {
  const c = Math.cos(b.turn * RAD);
  const sn = Math.sin(b.turn * RAD);
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, w]) => ({ x: b.cx + c * u * b.hw - sn * w * b.hh, y: b.cy + sn * u * b.hw + c * w * b.hh }));
};
/** How far a point must go in the direction `go` before it enters a box grown by `pad` all round: 0 if it is in it already, null if it never does. */
export function travelInto(p: Spot, go: Spot, b: SweepBox, pad = 0): number | null {
  const c = Math.cos(-b.turn * RAD);
  const sn = Math.sin(-b.turn * RAD);
  const q = [c * (p.x - b.cx) - sn * (p.y - b.cy), sn * (p.x - b.cx) + c * (p.y - b.cy)];
  const g = [c * go.x - sn * go.y, sn * go.x + c * go.y];
  const half = [b.hw + pad, b.hh + pad];
  let lo = -Infinity;
  let hi = Infinity;
  for (let i = 0; i < 2; i++) {
    if (Math.abs(g[i]) < 1e-9) {
      if (Math.abs(q[i]) > half[i]) return null;
      continue;
    }
    const t1 = (-half[i] - q[i]) / g[i];
    const t2 = (half[i] - q[i]) / g[i];
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  }
  return hi >= Math.max(lo, 0) ? Math.max(lo, 0) : null;
}
/**
 * How far a sweep must travel in the direction `go` before each box is set
 * moving, and whether the sweeper itself did it. A box is set moving by the
 * sweeper's own outline (`pusher`, where it starts) coming within `gap` of
 * it, which the sweeper can do only in its first `keepsUp` of travel, while
 * it keeps up with the sweep; or by a box already moving running into it:
 * things push things, so a pile goes as a pile and a die knocks on a card.
 * Once moving, everything travels with the sweep, so nothing moving catches
 * or is caught by anything else that is. A box nothing reaches is Infinity.
 */
export function sweepReaches(pusher: readonly Spot[], go: Spot, boxes: readonly SweepBox[], gap: number, keepsUp: number): { reach: number[]; byHand: boolean[] } {
  const least = (points: readonly Spot[], way: Spot, b: SweepBox, pad: number) =>
    points.reduce((best, p) => {
      const d = travelInto(p, way, b, pad);
      return d === null ? best : Math.min(best, d);
    }, Infinity);
  const direct = boxes.map((b) => least(pusher, go, b, gap)).map((r) => (r <= keepsUp ? r : Infinity));
  const reach = [...direct];
  const rims = boxes.map((b) => spaced(boxCorners(b), 3, true));
  const back = { x: -go.x, y: -go.y };
  for (let changed = true; changed; ) {
    changed = false;
    boxes.forEach((pushed, i) =>
      boxes.forEach((pushing, j) => {
        if (i === j || !(reach[j] < reach[i])) return;
        const d = Math.min(least(rims[j], go, pushed, 0), least(rims[i], back, pushing, 0));
        if (reach[j] + d < reach[i] - 1e-6) {
          reach[i] = reach[j] + d;
          changed = true;
        }
      }),
    );
  }
  return { reach, byHand: reach.map((r, i) => r === direct[i] && r < Infinity) };
}

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
  /* In the order of their corners: top left, top right, bottom right, bottom left. Weak planning costs each group something
     different (founder, 2026-11-12): two rushed requests of its own, and what they add up to. Each calm word is an end state of
     the contractor's planning, the founder's (2026-11-12). */
  { id: 'owner', label: 'Owner', requests: ['Surprise', 'Rushed decision'], effect: 'Last-minute decisions', calm: 'In control' },
  { id: 'design', label: 'Design team', requests: ['ASAP', 'No priority'], effect: 'Competing urgent requests', calm: 'Aligned' },
  { id: 'consultants', label: 'Consultants', requests: ['ASAP', 'No priority'], effect: 'Competing urgent requests', calm: 'Coordinated' },
  /* The founder's *Unrealistic deadlines* is set as the brief's own fallback, *Rushed deadlines*: the longer will not fit on
     a slip without running off the frame or being set too small to read. */
  { id: 'vendors', label: 'Vendors', requests: ['Rushed deadlines', 'Rescheduled'], effect: 'Stop-start work', calm: 'Ready' },
] as const;
export type TeamId = (typeof TEAM)[number]['id'];
/** The hero's name: on two lines in the middle of a desktop frame, shortened on a narrow one. */
export const TEAM_CONTRACTOR = { lines: ['General', 'contractor'], short: 'Contractor' } as const;
/** The two states, named above the picture (founder, 2026-11-12; they had been *Contractor out of control* and *Contractor in control*). Set in capitals by the renderer. */
export const TEAM_STATES = { out: 'Weak procurement planning', in: 'Precise procurement planning' } as const;
/**
 * The requests in the order they are sent: who each goes to, and whether it
 * is that group's first or second. Everyone gets a second while still
 * dealing with the first. What each says is the group's own (`TEAM`).
 */
export const TEAM_RUSH = [
  { to: 0, round: 0 },
  { to: 1, round: 0 },
  { to: 2, round: 0 },
  { to: 3, round: 0 },
  { to: 0, round: 1 },
  { to: 1, round: 1 },
  { to: 2, round: 1 },
  { to: 3, round: 1 },
] as const;
/** What a request says. */
export const requestLabel = (r: { to: number; round: number }) => TEAM[r.to].requests[r.round];

/*
 * How wide a line of type is set, for fitting words to slips and cards. Measured from Arial Bold, which sets wider than
 * the Inter Tight the page uses, so a line that fits by this measure fits on the page with room to spare.
 */
const LOWER = [556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500];
const UPPER = [722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611];
export function textWidth(text: string, size: number, opts: { caps?: boolean; tracking?: number } = {}): number {
  const set = opts.caps ? text.toUpperCase() : text;
  let units = 0;
  for (const ch of set) {
    const c = ch.charCodeAt(0);
    if (c >= 97 && c <= 122) units += LOWER[c - 97];
    else if (c >= 65 && c <= 90) units += UPPER[c - 65];
    else if (ch === ' ' || ch === '.' || ch === '’' || ch === "'") units += 278;
    else if (ch === '-') units += 333;
    else units += 722;
  }
  return (units / 1000 + (opts.tracking ?? 0) * set.length) * size;
}
/** Words set on one line if they fit `room`, otherwise broken onto two as evenly as the words allow. */
export function fitLines(text: string, size: number, room: number): string[] {
  if (textWidth(text, size) <= room) return [text];
  const words = text.split(' ');
  let best: string[] = [text];
  let worst = Infinity;
  for (let k = 1; k < words.length; k++) {
    const lines = [words.slice(0, k).join(' '), words.slice(k).join(' ')];
    const widest = Math.max(...lines.map((l) => textWidth(l, size)));
    if (widest < worst) {
      worst = widest;
      best = lines;
    }
  }
  return best;
}
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
/** What stands behind the contractor in control: the mark on the shield. */
export const TEAM_MARK = 'JiTpro';

/**
 * The foot of each state of Protect your investment: one band, the same in
 * both, carrying a line and a phrase beneath it (founder, 2026-11-12). The
 * second state's line is the visual's closing line, unchanged.
 */
export const TEAM_FOOT = {
  out: { head: 'Weak procurement planning puts your investment at risk.', support: 'Preventable delays. Rising costs. Eroding profits.' },
  in: { head: 'A coordinated contractor protects your investment.', support: 'JiTpro gets the field what it needs, when it needs it.' },
} as const;

/* ------------------------------------------- Better decisions (redrawn 2026-11-12) */

/**
 * BETTER DECISIONS is an ILLUSTRATION, as Reduce risk and Protect your
 * investment are, and reads no project data (founder briefs, 2026-11-12).
 * ONE CONE, AND IT DOES NOT MOVE: a corridor tapering from left to right,
 * wide where the project is early and narrow where it is late; time passes
 * along it, and its height is how much room for choice is left.
 * ONE GROUP, ONE STORY, NEVER RESET: six options in a column ride with a
 * dashed line that marks the time. They keep their places in the column; the
 * cone does not squeeze them together. The group stops a quarter of the way
 * in, while the cone still holds all six: the decision identified early. It
 * carries on from there; as the cone narrows, the options it no longer has
 * room for are left outside its walls and become unavailable, one at a time,
 * still seen, crossed out in red. It stops near the narrow end with two: the
 * decision identified late. Nothing falls, and nothing is set by hand: an
 * option is lost when the cone no longer holds it. Each option stands for an
 * alternative with its own lead time, so each has its own latest viable
 * moment; the column is set a little off the centre line so that no two are
 * lost at once. Identifying a decision early is not making it early: no
 * choice is shown being made. The owner decides; the contractor identifies
 * the decision and its timing. Nobody is drawn, and nobody is blamed.
 * The callouts and the feet are the founder's (brief, 2026-11-12).
 * THEN IT MOVES ON, ONCE (founder, 2026-11-12): it plays one time, never
 * loops; after a beat at the late stop the cone is faded away, and the
 * visual closes on correctly timed decisions: the six options again, all
 * open, a line on what JiTpro helps the contractor do, and the closing line
 * on the foot. Identified early; decided at the right time.
 */
export const CHOICE_FOOT = {
  in: { head: 'Early planning preserves your choices.', support: 'More options. Better decisions.' },
  out: { head: 'Late planning limits your choices.', support: 'Less time. Fewer options. More pressure.' },
} as const;
/** The close, the founder's words: the closing line, on the foot, and the line set above it, beneath the options. */
export const CHOICE_TIMED = {
  head: 'Correctly timed decisions protect your options.',
  support: 'JiTpro helps your contractor identify what decisions are needed, when they are needed, and why the timing matters.',
} as const;
/** The words on the picture: the founder's. The two callouts are shown at the stops, each with its foot. */
export const CHOICE_WORDS = {
  more: 'More options',
  time: 'Time passes',
  early: 'Decision identified early',
  late: 'Decision identified late',
  option: 'Option',
} as const;
/** How many options there are, and their letters (founder, 2026-11-12): each is named, *Option A* to *Option F*; any alternative, never a product. */
export const CHOICE_COUNT = 6;
export const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

/** The closing line of each visual, exactly as supplied by the founder (2026-11-11; Reduce risk, 2026-11-12). */
export const OWNER_TAKEAWAY: Record<OwnerTabId, string> = {
  'owner-reduce-risk': 'Confidence requires a plan.',
  'owner-protect-investment': TEAM_FOOT.in.head,
  'owner-predictability': 'Fewer surprises. More time to prepare.',
  'owner-better-decisions': CHOICE_TIMED.head,
};
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
/** A visual's cues and its length. A visual plays once and rests on its last frame, which reduced motion shows at once (Sections 46.5, 46.6). */
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
 * of the dice and never on them. A hand reaches in from the lower left and
 * pushes notices and dice away, up and to the right, then is drawn back; the
 * documents stay, then step back, and the plan is laid
 * over them. At the close a navy stage is drawn over all of it and the plan
 * alone is left, enlarged, beside the lockup.
 */
export function gambleGeometry(mode: OwnerMode) {
  /* Worked out once for each design: it is the same every time it is asked for. */
  const laid = GAMBLE.get(mode) ?? layGamble(mode);
  GAMBLE.set(mode, laid);
  return laid;
}
const GAMBLE = new Map<OwnerMode, ReturnType<typeof layGamble>>();
function layGamble(mode: OwnerMode) {
  const d = mode === 'desktop';
  const die = d ? 34 : 24;
  const notice = d ? { w: 164, h: 54 } : { w: 116, h: 34 };
  /* Where the dice and the notices rest; the notices in order of arrival, alternating sides: the first, third and fifth form
     a column to the left of the dice, the second, fourth and sixth a column to the right. Each lands a little lower than the
     one above, so its heading shows. */
  const dice = d
    ? [
        { cx: 262, cy: 178, turn: -8 },
        { cx: 300, cy: 190, turn: 12 },
      ]
    : [
        { cx: 159, cy: 118, turn: -8 },
        { cx: 184, cy: 126, turn: 12 },
      ];
  const notices = d
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
      ];
  /*
   * The sweeping hand: it reaches in from beyond the lower left corner, fingers first, pushes the dice and the notices
   * up and to the right, and is drawn back the way it came. `scale`: the size the illustration is drawn at, set by the
   * dice and the notices it pushes. `tilt`: how far it is turned from upright, so its fingers point to the upper right.
   * `dir`: the angle above level at which it travels, a little shallower than its fingers point, so it goes slightly
   * side-on. `aim`: a point its middle fingertip passes through, at the dice, so the fingers arrive at the dice as the
   * heel of the hand takes the nearest notice. `travel`: how far the sweep carries
   * what it pushes. `letGo`: the share of the sweep's time after which the hand stops keeping up and is drawn back; what
   * it has pushed carries on. `gap`: the sliver between the hand and what it pushes.
   */
  const hand = d ? { scale: 1.35, tilt: 44, dir: 38, aim: { x: 290, y: 190 }, travel: 900, letGo: 0.45, gap: 3 } : { scale: 0.82, tilt: 44, dir: 38, aim: { x: 176, y: 123 }, travel: 545, letGo: 0.45, gap: 2 };
  /* The way it travels, and the way its fingers point. */
  const go = { x: Math.cos(hand.dir * RAD), y: -Math.sin(hand.dir * RAD) };
  const fingers = { x: Math.sin(hand.tilt * RAD), y: -Math.cos(hand.tilt * RAD) };
  /* A point of the illustration, as it lies on the canvas when the wrist is at the origin. */
  const placed = ([x, y]: readonly [number, number]): Spot => ({
    x: (Math.cos(hand.tilt * RAD) * x - Math.sin(hand.tilt * RAD) * y) * hand.scale,
    y: (Math.sin(hand.tilt * RAD) * x + Math.cos(hand.tilt * RAD) * y) * hand.scale,
  });
  const front = spaced(SWEEP_HAND.front.map(placed), 3);
  const outline = [...front, ...spaced(SWEEP_HAND.rest.map(placed), 12, true)];
  const tip = placed([SWEEP_HAND.tip.x, SWEEP_HAND.tip.y]);
  /* It starts on its line, drawn back until no part of it is on the canvas, and a little further. */
  const canvas = OWNER_CANVAS[mode];
  const wristAt = (backBy: number): Spot => ({ x: hand.aim.x - go.x * backBy - tip.x, y: hand.aim.y - go.y * backBy - tip.y });
  const shows = (wrist: Spot) => outline.some((p) => wrist.x + p.x > 0 && wrist.x + p.x < canvas.w && wrist.y + p.y > 0 && wrist.y + p.y < canvas.h);
  let backBy = 0;
  while (shows(wristAt(backBy))) backBy += 2;
  const wrist = wristAt(backBy + 8);
  /* When each thing is set moving: by the hand, while it keeps up with the sweep, or by something already moving. */
  const boxes: SweepBox[] = [...notices.map((n) => ({ cx: n.cx, cy: n.cy, hw: notice.w / 2, hh: notice.h / 2, turn: n.turn })), ...dice.map((o) => ({ cx: o.cx, cy: o.cy, hw: die / 2, hh: die / 2, turn: o.turn }))];
  const swept = sweepReaches(
    front.map((p) => ({ x: wrist.x + p.x, y: wrist.y + p.y })),
    go,
    boxes,
    hand.gap,
    hand.travel * ease(hand.letGo),
  );
  if (swept.reach.some((r) => !(r > 0 && r < hand.travel))) throw new Error('ownerScenes: the sweeping hand does not reach everything on the table');
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
    dice,
    roll: d ? { dx: 330, hop: 30 } : { dx: 200, hop: 20 },
    /** The caption, on one line beneath everything: its centre and its baseline. */
    caption: d ? { x: 280, y: 270 } : { x: 170, y: 183 },
    /** The turn: one line in the middle of the cleared table, where the dice were. Its centre, its baseline and its size. */
    turn: d ? { x: 280, y: 172, size: 22 } : { x: 170, y: 106, size: 14 },
    /** The notices: one size, each resting at a centre and a turn, each arriving from an offset. */
    notice,
    notices,
    /** The hand: its settings, and where its wrist starts (`ax`, `ay`), out of sight beyond the lower left corner. */
    hand: { ...hand, ax: wrist.x, ay: wrist.y },
    /** The sweep: the way it travels, the way the fingers point, the hand's outline that pushes and its whole outline (both about the wrist). */
    sweep: { go, fingers, front, outline },
    /** How far the sweep must travel before each notice, and each die, is set moving. From then on it travels with the sweep. */
    reach: { notices: swept.reach.slice(0, notices.length), dice: swept.reach.slice(notices.length) },
    /** What the hand pushes, as boxes: the notices, then the dice; and whether the hand itself set each moving, or something already moving did. */
    boxes,
    byHand: swept.byHand,
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
  /* A request slip: its height, the least it is ever as wide, the type on it, and the room either side of its words. */
  const tag = d ? { w: 60, h: 19, size: 9.5, pad: 8 } : { w: 44, h: 13, size: 7.5, pad: 6 };
  const tagWidth = (label: string) => Math.max(tag.w, textWidth(label, tag.size, { caps: true, tracking: 0.06 }) + 2 * tag.pad);
  /* A card's edge nearest the contractor, and its middle height. */
  const inner = (i: number) => (onLeft(i) ? at[i].x + card.w : at[i].x);
  const mid = (i: number) => at[i].y + card.h / 2;
  /*
   * Where a request comes to rest: at the card's inner corners, the first across its top edge and the second just below
   * its foot, clear of the words on the card. Its inner end stays where it was (a little past the inner edge at the top,
   * flush with it at the foot) and a longer request runs outward, over the card, never toward the contractor.
   */
  const tagAt = (to: number, round: number) => {
    const w = tagWidth(requestLabel({ to, round }));
    const past = (d ? [10, 0] : [8, 0])[round];
    const out = onLeft(to) ? -1 : 1;
    return {
      cx: inner(to) - out * past + (out * w) / 2,
      cy: round === 0 ? at[to].y - (d ? 2 : 1) : at[to].y + card.h + (d ? 6 : 4),
      turn: (round === 0 ? 6 : -5) * (onLeft(to) ? 1 : -1),
      w,
    };
  };
  /* What weak planning adds up to for each group, on the card: one line, or two where one will not fit between its edges. */
  const effectSize = d ? 9.5 : 7.5;
  const effectLines = (i: number) => fitLines(TEAM[i].effect, effectSize, card.w - 2 * (d ? 10 : 7));
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
    stateY: d ? 24 : 12,
    tag,
    tagAt,
    effectSize,
    effectLines,
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
      const c1 = onTop(i) ? { x: from.x + (to.x - from.x) * (d ? 0.6 : 0.7), y: from.y + (d ? 99 : 82) } : { x: from.x - side * (d ? 36 : 34), y: from.y - (d ? 24 : 14) };
      const c2 = { x: to.x, y: bin.top - (onTop(i) ? (d ? 24 : 16) : d ? 32 : 18) };
      return { from, c1, c2, to };
    },
    /**
     * Protected value, once the contractor is in control: the middle of a
     * small shield with a dollar sign, the same on each of the five. On a
     * group's card, the inner foot, just above where the second rushed request had been.
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

/**
 * Better decisions: the cone. Laid out once on the desktop canvas and set on
 * the narrow one at 0.6 of the size; only the type is set separately, so it
 * stays readable. Every word's and every option's place is here, so it can be
 * checked.
 *
 * THE CONE is symmetric about a level centre line, with straight walls.
 * THE GROUP is a dashed line across the cone and a column of six options
 * centred on it, which travel together. An option is open while the cone
 * holds it, measured at its leading edge, where the cone is lower; it is lost
 * from the point where it would cross a wall.
 */
export const CHOICE_CONE = { x0: 40, x1: 520, cy: 150, h0: 104, h1: 16 } as const;
/** Where the group sets out, and its two stops (desktop units): early, a quarter of the way along the cone, where it holds all six; late, 85% of the way, near the narrow end. */
export const CHOICE_AT = { start: 76, early: 160, late: 448 } as const;
export type ChoiceWhen = 'early' | 'late';
export function choiceGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const k = d ? 1 : 0.6;
  const X = (x: number) => (d ? x : 2 + k * x);
  const Y = (y: number) => (d ? y : k * y - 2.4);
  const C = CHOICE_CONE;
  /** The cone's half-height at a point along it (desktop units). */
  const halfAt = (x: number) => C.h0 - (C.h0 - C.h1) * Math.min(1, Math.max(0, (x - C.x0) / (C.x1 - C.x0)));
  /**
   * An option card, in desktop units: half its height, the gap between cards, and how far its leading edge is ahead of
   * the line (half its width). Its drawn size is set per frame below, so that its label is legible on both.
   */
  const HALF = 8;
  const GAP = 6;
  const LEAD = 30;
  /* The column, set this far below the centre line so that no two options are lost at once. Its offsets never change. */
  const OFF = 3;
  const offsets = Array.from({ length: CHOICE_COUNT }, (_, j) => OFF + (j - (CHOICE_COUNT - 1) / 2) * (2 * HALF + GAP));
  /** Whether the cone holds option j with the group at x: its outer edge at the card's leading edge is inside the wall. */
  const holds = (j: number, x: number) => Math.abs(offsets[j]) + HALF <= halfAt(x + LEAD);
  /** The card as drawn: desktop, the layout's own size; narrow, wider than 0.6 of it, so that *OPTION A* stays legible. */
  const card = d ? { w: 60, h: 16, round: 3, label: 8.5 } : { w: 42, h: 10, round: 2, label: 6.5 };
  const type = d ? { label: 8.5, message: 10 } : { label: 7, message: 8 };
  const AXIS_Y = Y(276);
  /** The heavier, redder walls near the narrow end: as thick as this at the tip, in desktop units. */
  const PRESS = 5;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const wallPoints = (side: -1 | 1, inset = 0) =>
    Array.from({ length: 13 }, (_, n) => {
      const x = C.x0 + ((C.x1 - C.x0) * n) / 12;
      return `${r1(X(x))} ${r1(Y(C.cy + side * (halfAt(x) - inset)))}`;
    });
  /* Where each option is lost, as the group carries on from the early stop: the first point at which the cone no longer holds it. */
  const lost: { option: number; x: number }[] = [];
  offsets.forEach((_, j) => {
    for (let x = CHOICE_AT.early; x <= CHOICE_AT.late; x += 0.5)
      if (!holds(j, x)) {
        lost.push({ option: j, x: X(x) });
        break;
      }
  });
  lost.sort((a, b) => a.x - b.x || a.option - b.option);
  /* A callout, at the top of the frame, in small capitals, on one line. */
  const message = (words: string) => ({ x: X(280), lines: [{ line: words, y: d ? 26 : 14 }] });
  /* The close: the six options in a level row across the middle of the frame, a little larger, all open; the line about
     JiTpro beneath them, on two lines; the closing line on the foot. */
  const band = teamGeometry(mode).band;
  const timedGap = d ? 12 : 6;
  const rowY = Math.round(band.y * 0.42);
  const supportSize = d ? 12 : 8.5;
  const supportLines = fitLines(CHOICE_TIMED.support, supportSize, (d ? 560 : 340) - (d ? 120 : 30));
  const supportTop = rowY + card.h / 2 + (d ? 36 : 22);
  const timed = {
    y: rowY,
    xs: Array.from({ length: CHOICE_COUNT }, (_, j) => X(280) + (j - (CHOICE_COUNT - 1) / 2) * (card.w + timedGap)),
    support: { x: X(280), size: supportSize, lines: supportLines.map((line, i) => ({ line, y: supportTop + i * supportSize * 1.4 })) },
  };
  return {
    k,
    type,
    /** The cone in this design's units: its ends, its centre line, its half-height at a point, its walls, and the whole of it as one shape. */
    cone: { x0: X(C.x0), x1: X(C.x1), cy: Y(C.cy) },
    half: (x: number) => k * halfAt((x - X(0)) / k),
    wall: (side: -1 | 1) => `M${wallPoints(side).join('L')}`,
    /** A fine second line just inside each wall: the drawing's linework. */
    inner: (side: -1 | 1) => `M${wallPoints(side, 3.5).join('L')}`,
    outline: `M${[...wallPoints(-1), ...wallPoints(1).reverse()].join('L')}Z`,
    /** The group where it sets out: the line (its full height, clipped to the cone) and the cards about it. */
    start: { x: X(CHOICE_AT.start), y0: Y(C.cy - C.h0 - 6), y1: Y(C.cy + C.h0 + 6) },
    cards: offsets.map((o) => ({ dx: 0, y: Y(C.cy + o) })),
    card,
    /** Each option's name: *Option A* to *Option F*, from the top of the column. */
    name: (j: number) => ({ word: CHOICE_WORDS.option, letter: CHOICE_LETTERS[j] }),
    /** The two stops: where the group is, and how many options the cone holds there. */
    stop: (when: ChoiceWhen) => ({ x: X(CHOICE_AT[when]), open: offsets.filter((_, j) => holds(j, CHOICE_AT[when])).length }),
    /** Where each option is lost, in the order they go (pairs, top and bottom, go together). */
    lost,
    message,
    /** The pressure near the narrow end: from a little before the late stop to the tip, the walls thicken to `thick` and redden. */
    pressure: { from: X(CHOICE_AT.late - 60), thick: k * PRESS },
    /** *More options*, above the mouth. */
    more: { x: X(C.x0), y: Y(C.cy - C.h0) - (d ? 8 : 5) },
    /**
     * Time, beneath it all: one unbroken line with fine ticks rising from it and an arrowhead; *Time passes* above its
     * start, under the mouth; and the marker's pointer, which travels beneath the line with the group, its tip on the line.
     */
    axis: {
      x0: X(C.x0),
      x1: X(C.x1),
      y: AXIS_Y,
      label: { x: X(C.x0), y: AXIS_Y - (d ? 9 : 5) },
      ticks: Array.from({ length: 11 }, (_, n) => X(C.x0 + 40 * (n + 1))),
      tick: d ? 3 : 2,
      pointer: d ? { w: 5, h: 6 } : { w: 3.5, h: 4.5 },
    },
    band,
    /** The close: the row of six options, all open, and the line beneath them. */
    timed,
  };
}

/* -------------------------------------------------------------- the scenes */

function riskScene(mode: OwnerMode): OwnerScene {
  const g = gambleGeometry(mode);
  /* The surprises arrive one at a time, each sooner and faster than the last: mounting pressure. */
  const arrives = [4850, 5340, 5780, 6175, 6525, 6830];
  const lands = [500, 455, 410, 365, 330, 300];
  /** The last surprise has landed; everything is held still, just long enough to register; then the hand sweeps. */
  const PILED = arrives[arrives.length - 1] + lands[lands.length - 1];
  const PAUSE = 850;
  const SWEEP = PILED + PAUSE;
  const SWEEP_MS = 1550;
  const CLEARED = SWEEP + SWEEP_MS;
  /* Everything swept moves exactly with the sweep from the moment it is reached, the way the hand is going, and is taken
     out of the picture only once the sweep is over and it is long off the table. */
  const sweep = { at: SWEEP, dur: SWEEP_MS, travel: g.hand.travel, ux: g.sweep.go.x, uy: g.sweep.go.y };
  const pushed = (reach: number, spin: number) => ({ push: { ...sweep, reach, spin }, out: CLEARED, outDur: 100 });
  /* The hand keeps up with the sweep until it lets go; from then it is drawn back, by the whole of the way, as the sweep
     runs out. So it slows, turns round and leaves the way it came, while what it pushed carries on off the table. */
  const LET_GO = SWEEP + SWEEP_MS * g.hand.letGo;
  /** The table is clear: the documents are seen alone for a beat, then step back. */
  const RESET = CLEARED + 150;
  /* The turn: as the documents step back, one line is shown alone on the cleared table, held long enough to read once, and
     gone before the plan arrives. Nothing else moves while it is read. */
  const TURN = RESET + 100;
  const TURN_OUT = TURN + 350 + 1100;
  const PLAN = TURN_OUT + 300;
  const SETTLE = 650;
  const lineAt = (i: number) => PLAN + SETTLE + 150 + i * 300;
  /** When the camera pushes in on the plan, and everything else is let go. */
  const PUSH = lineAt(GAMBLE_PLAN.lines.length - 1) + 650;
  /* The documents are never swept. They step back to a ghost of themselves as the plan is laid over them, and the stage covers them at the close. */
  const paper = { out: RESET, outDur: 450, outTo: 0.16 };
  const cues: Cue[] = [
    // The sheet the documents lie on: an off-white ground, a faint grid and a border. It is there until the stage covers it.
    { k: 'ground', at: 0, dur: 400 },
    // 1. Trust: three project documents, spread across the frame; and on the contract, a budget and a completion date.
    { k: 'drawings', at: 0, dur: 450, ...paper },
    { k: 'contract', at: 300, dur: 500, rise: 8, ...paper },
    { k: 'specs', at: 600, dur: 500, rise: 8, ...paper },
    ...GAMBLE_CONTRACT.terms.map((_, i): Cue => ({ k: `term-${i}`, at: 1150 + i * 300, ...paper })),
    // 2. Uncertainty: a pair of dice rolls across the documents and comes to rest in the middle of the frame.
    ...g.dice.map(
      (_, i): Cue => ({
        k: `die-${i}`,
        at: 2400 + i * 130,
        dur: 150,
        roll: { dur: 1300 + i * 140, dx: g.roll.dx, hop: g.roll.hop, hops: 2, turns: 0.9 + i * 0.1 },
        ...pushed(g.reach.dice[i], 80 + i * 50),
      }),
    ),
    // The question, beneath them. It stays through the surprises and the pause, and goes as the hand comes in.
    { k: 'caption', at: 4050, rise: 4, out: SWEEP, outDur: 300 },
    // 3. The surprises: six notices land either side of the dice, never on them, faster and faster. Then nothing moves.
    ...g.notices.map((n, i): Cue => ({ k: `notice-${i}`, at: arrives[i], dur: lands[i], from: n.from, ...pushed(g.reach.notices[i], n.turn * 3) })),
    // 4. A hand reaches in from the lower left and pushes up and to the right; notices and dice go off the table; the hand is
    //    drawn back the way it came. The documents stay.
    { k: 'hand', at: SWEEP, dur: 60, push: { ...sweep, reach: 0 }, move: { at: LET_GO, dur: CLEARED - LET_GO, dx: -sweep.travel * sweep.ux, dy: -sweep.travel * sweep.uy }, out: CLEARED, outDur: 60 },
    // 5. The turn: one line, alone on the cleared table, between what was swept away and what replaces it.
    { k: 'turn', at: TURN, rise: 4, out: TURN_OUT, outDur: 300 },
    // 6. A better alternative: the contractor's plan slides in over the documents, which have stepped back; its lines are checked.
    // 7. Confidence: with every line checked, a navy stage is drawn across the frame and the plan,
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
  /*
   * PACE (slowed 2026-11-12, founder: calm, controlled, easy to read). Movements run about 40% longer than they did,
   * steps within a state follow a little further apart, and the long pauses are where the story turns: the first state
   * is held, complete, for four seconds before it is withdrawn; the frame is clear for a beat before the shield is drawn;
   * the second state is held, complete; and the close rests.
   * THE FOOT IS SCENERY (founder, 2026-11-12): the navy bar and its amber edge come in with the opening and stay to the
   * end, never fading; only its words change. The first state's words come in once its friction is drawn and go with
   * it; the second state's come in as that state is named, and stay.
   */
  /** When the first state's foot words come in, once its friction is drawn. */
  const FOOT = 3400;
  /** When the first state is complete (its last request has landed); it is held this long before it is withdrawn. */
  const FIRST_DONE = 8040;
  const FIRST_HOLD = 3960;
  const REWIND = FIRST_DONE + FIRST_HOLD;
  /** The beat between the two states: the first withdrawn, the frame clear, then the shield begins. */
  const GUARD = REWIND + 600;
  /** When the second state is named, once the shield stands; its foot words follow. */
  const STATE_IN = GUARD + 1700;
  /** When the second state is complete (the last protected-value shield has settled); then it rests. */
  const SECOND_DONE = GUARD + 5610;
  /** The lag between a moment and the foot words that go with it: the same for both states. */
  const WORDS_AFTER = 550;
  const first = { out: REWIND, outDur: 500 };
  const n = TEAM.length;
  /** How long a bill takes from its card into the dumpster: slow enough to follow. */
  const BILL_FLIGHT = 1400;
  /** The contractor's own bills fall a short way, straight down. */
  const BILL_DROP = 1000;
  const cues: Cue[] = [
    // The sheet the picture is drawn on: a faint grid and crop marks. It is there throughout.
    { k: 'ground', at: 0, dur: 800 },
    // The foot: the navy bar and its amber edge. Scenery: in with the opening, there to the end; only its words change.
    { k: 'foot', at: 0, dur: 650 },
    // 1. The contractor, in the middle, and the four groups around; the state is named.
    { k: 'loose', at: 0, dur: 650, rise: 6, ...first },
    { k: 'stateOut', at: 400, dur: 500, ...first },
    ...TEAM.map((_, i): Cue => ({ k: `card-${i}`, at: 900 + i * 280, dur: 500, rise: 5 })),
    // Out of control: friction runs outward to each group, and rushed requests follow it.
    ...TEAM.map((_, i): Cue => ({ k: `friction-${i}`, at: 2800 + i * 200, dur: 700, draw: true, ...first })),
    ...TEAM_RUSH.map((r, i): Cue => ({ k: `rush-${i}`, at: (r.round === 0 ? 3400 : 6600) + r.to * 280, dur: 600, from: g.tagFrom(r.to, r.round), ...first })),
    // The first state's foot words, on the bar. They go with the rest of the first state; the bar stays.
    { k: 'footOutWords', at: FOOT + WORDS_AFTER, dur: 500, rise: 5, ...first },
    // What it does to each of them, between the first requests and the second.
    ...TEAM.map((_, i): Cue => ({ k: `effect-${i}`, at: 5000 + i * 300, dur: 500, rise: 3, ...first })),
    // And money is wasted: a jobsite dumpster, and bills leaving the contractor and all four groups for it in turn. The flow builds: each
    // bill follows the last a little sooner. No new bill is launched once the disorder is withdrawn; those in the air
    // finish their fall; and the dumpster goes as the shield begins to be drawn.
    ...(['binBack', 'bin'] as const).map((k): Cue => ({ k, at: 4950, dur: 500, rise: 4, out: GUARD, outDur: 550 })),
    ...Array.from({ length: TEAM_WASTE_ROUNDS }, (_, r) =>
      TEAM_PARTIES.map((who, e): Cue => {
        const nth = r * TEAM_PARTIES.length + e;
        const at = 5150 + nth * 255 - ((nth * (nth - 1)) / 2) * 6;
        const path = g.billPath(who, r);
        const by = (point: { x: number; y: number }) => ({ dx: point.x - path.from.x, dy: point.y - path.from.y });
        // The contractor's bills have only a short way to fall; the groups' cross the frame.
        const flight = who === 'gc' ? BILL_DROP : BILL_FLIGHT;
        const turn = who === 'gc' ? (r - 1) * 14 : (g.onLeft(who) ? 1 : -1) * (24 + r * 10);
        return { k: `bill-${who}-${r}`, at, dur: 320, arc: { at: at + 320, dur: flight, c1: by(path.c1), c2: by(path.c2), to: by(path.to), rot: turn }, out: at + 320 + flight, outDur: 160 };
      }),
    ).flat(),
    // 2. In control: the shield is drawn around the contractor, calmly, then stands; the state is named again.
    { k: 'guard', at: GUARD, dur: 1300, draw: true },
    { k: 'shield', at: GUARD + 1000, dur: 700 },
    { k: 'stateIn', at: STATE_IN, dur: 500 },
    // The second state's foot words, on the same bar, as the state is named: the closing line. They stay.
    { k: 'takeaway', at: STATE_IN + WORDS_AFTER, dur: 500, rise: 5 },
    // The same four, reached one after another by a level line, each settling as it is reached.
    ...Array.from({ length: n }, (_, i): Cue[] => [
      { k: `node-${i}`, at: GUARD + 2400 + i * 220, dur: 300 },
      { k: `link-${i}`, at: GUARD + 2400 + i * 220, dur: 650, draw: true },
      { k: `calm-${i}`, at: GUARD + 2900 + i * 220, dur: 500, rise: 3 },
    ]).flat(),
    // Then value is protected: once the network is whole and calm, a small shield with a dollar sign settles beside each of the
    // five, one by one, the groups first and the contractor last. Where money was leaving, it is now kept.
    ...[...TEAM.map((_, i): TeamParty => i), 'gc' as TeamParty].map((who, j): Cue => ({ k: `keep-${who}`, at: GUARD + 4100 + j * 240, dur: 550, rise: 4 })),
    // 3. The close: nothing is taken away. Once complete, it is held, and rests.
  ];
  return { tab: 'owner-protect-investment', mode, cues, end: SECOND_DONE + 4590 };
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
  const g = choiceGeometry(mode);
  /*
   * ONE GROUP, ONE STORY, PLAYED ONCE (founder briefs 2026-11-12). The cone, the time axis and the words at its mouth
   * are drawn, and the foot's bar with them. Then, without a reset: the line and its six options at the mouth; the group
   * moves to the early stop, all six held, the first callout and foot words, held; the group carries on, and as the cone
   * narrows it loses the options it no longer has room for; the late stop, two open, the second callout and foot words.
   * A beat of about a second once the late stop is complete; then the whole illustration fades away together, the bar
   * staying, and the visual closes on correctly timed decisions: the six options, all open, the line about JiTpro, and
   * the closing line on the foot. Then it rests.
   */
  const DRAWN = 2400;
  /** Each stop is held about five seconds from the moment the group arrives. */
  const HOLD = 3300;
  const early = g.stop('early');
  const late = g.stop('late');
  /* 1. The line and the six options, at the mouth. */
  const SHOW = DRAWN + 100;
  const shown = SHOW + 300 + (g.cards.length - 1) * 120 + 450;
  /* 2. Time passes a little; the group stops early. */
  const RUN1 = { at: shown + 300, dur: 1400 };
  const EARLY = RUN1.at + RUN1.dur + 250;
  /* 3. Held; then it carries on, to the late stop. */
  const ON = EARLY + 400 + 550 + 500 + HOLD;
  const RUN2 = { at: ON + 300, dur: 5600 };
  const LATE = RUN2.at + RUN2.dur + 250;
  /* 4. The late stop is complete once its foot words are in; held about a second; then the illustration fades away, together. */
  const LATE_DONE = LATE + 550 + 600;
  const PAUSE = 1000;
  const FADE = LATE_DONE + PAUSE;
  const FADE_MS = 900;
  const story = { out: FADE, outDur: FADE_MS };
  /* 5. The close, once the frame above the bar is clear: the six options, all open; the line about JiTpro; the closing line. */
  const CLEAR = FADE + FADE_MS + 200;
  const ROW_MS = 110;
  const SUPPORT = CLEAR + (g.cards.length - 1) * ROW_MS + 550;
  const CLOSE = SUPPORT + 900;
  /* When the group, eased along its second run, reaches a point: the clock's own easing, inverted. */
  const when = (x: number) => {
    const share = (x - early.x) / (late.x - early.x);
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 50; n++) {
      const m = (lo + hi) / 2;
      if (ease(m) < share) lo = m;
      else hi = m;
    }
    return Math.round(RUN2.at + RUN2.dur * lo);
  };
  const cues: Cue[] = [
    // The sheet and the cone, and time. Drawn once; the sheet stays, the cone goes when the story is done.
    { k: 'ground', at: 0, dur: 800 },
    { k: 'cone', at: 300, dur: 700, ...story },
    { k: 'wall-top', at: 300, dur: 1200, draw: true, ...story },
    { k: 'wall-bottom', at: 300, dur: 1200, draw: true, ...story },
    { k: 'axis', at: 700, dur: 900, draw: true, ...story },
    { k: 'time', at: 1100, dur: 500, ...story },
    { k: 'more', at: 1300, dur: 500, rise: 3, ...story },
    // The foot: the navy bar and its amber edge are scenery. They come in once and stay to the end; only the words on
    // them change (founder, 2026-11-12).
    { k: 'foot', at: 300, dur: 700 },
    // 1. The group: the line marking the time, and six options on it, all open.
    { k: 'line', at: SHOW, dur: 400, ...story },
    ...g.cards.map((_, j): Cue => ({ k: `card-${j}`, at: SHOW + 300 + j * 120, dur: 450, rise: 4, ...story })),
    // 2. Time passes a little, and the group stops while the cone still holds all six: timed properly, nothing is lost.
    //    The line and the cards are moved as one (`now`, then `nowOn`, applied to both). The two only carry the group;
    //    what is in them fades by its own cue.
    { k: 'now', at: SHOW, dur: 1, move: { at: RUN1.at, dur: RUN1.dur, dx: early.x - g.start.x, dy: 0 } },
    { k: 'msgEarly', at: EARLY, dur: 500, rise: 3, out: ON, outDur: 450 },
    // Its words come in at the stop, and stay while the group carries on, until the late stop's words take their place.
    { k: 'footInWords', at: EARLY + 400, dur: 600, rise: 3, out: LATE + 300, outDur: 500 },
    // 3. Time carries on, and the group with it. As the cone narrows, the options it has no room for are left outside its
    //    walls: crossed out, still seen. The walls near the narrow end take the strain.
    { k: 'nowOn', at: SHOW, dur: 1, move: { at: RUN2.at, dur: RUN2.dur, dx: late.x - early.x, dy: 0 } },
    ...g.lost.map((l): Cue => ({ k: `off-${l.option}`, at: when(l.x), dur: 500, ...story })),
    { k: 'pressure', at: RUN2.at + RUN2.dur * 0.5, dur: RUN2.dur * 0.5 + 200, ...story },
    // 4. Left too late: two open.
    { k: 'msgLate', at: LATE, dur: 500, rise: 3, ...story },
    // The foot's words cross from the first line to the second; the bar does not move. They stay while the cone fades,
    // and go once it has.
    { k: 'footOutWords', at: LATE + 550, dur: 600, rise: 3, out: FADE + 500, outDur: 500 },
    // 5. Correctly timed decisions: the six options again, all open, in a calm row; the line about JiTpro beneath them;
    //    and, last, the closing line on the foot. Then it rests. Reduced motion shows this frame.
    ...g.cards.map((_, j): Cue => ({ k: `timed-${j}`, at: CLEAR + j * ROW_MS, dur: 500, rise: 4 })),
    { k: 'timedWords', at: SUPPORT, dur: 600, rise: 3 },
    { k: 'takeaway', at: CLOSE, dur: 600, rise: 3 },
  ];
  return { tab: 'owner-better-decisions', mode, cues, end: CLOSE + 2200 };
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
