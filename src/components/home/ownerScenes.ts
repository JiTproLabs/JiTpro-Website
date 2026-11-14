/**
 * The Project Owners tabs' visuals, as pure data and state (Design System
 * Section 54.4.5, 2026-11-11). PURE: no DOM, no React.
 *
 * ILLUSTRATIONS. All four visuals are illustrations and read no project data
 * (More predictability, which read the owner's decisions, was redrawn as an
 * approach and landing, 2026-11-13).
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

import { ease } from './planChainScene';

export type OwnerTabId = 'owner-reduce-risk' | 'owner-protect-investment' | 'owner-predictability' | 'owner-better-decisions';
export const OWNER_TABS: readonly OwnerTabId[] = ['owner-reduce-risk', 'owner-protect-investment', 'owner-predictability', 'owner-better-decisions'];
export const isOwnerTab = (id: string): id is OwnerTabId => (OWNER_TABS as readonly string[]).includes(id);
export type OwnerMode = 'desktop' | 'phone';
/** The two canvases (px at scale 1); each is scaled to the frame as vector. */
export const OWNER_CANVAS = { desktop: { w: 560, h: 350 }, phone: { w: 340, h: 212 } } as const;
/** Below this frame width the narrow design is used (as the Control board's). */
export const OWNER_NARROW_BELOW = 460;

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
/* The two states are no longer named above the picture (founder, 2026-11-13): the foot's words name them. */
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
  out: { head: 'Weak procurement planning creates waste across the entire project.', support: 'More disruption. Higher costs. Greater risk to your investment.' },
  in: { head: 'Early, precise procurement planning protects your investment.', support: 'Less disruption. Better coordination. Greater cost control.' },
} as const;

/* ------------------------------------------------ More predictability (redrawn 2026-11-13) */

/**
 * MORE PREDICTABILITY: AN APPROACH AND LANDING (founder brief, 2026-11-13; Design System Section 54.4.5). An
 * ILLUSTRATION; it reads no project data. One aircraft, one planned approach, one runway, one planned finish: one
 * project, never a comparison. It drifts and is brought back by procurement planning; it shows loss of predictability,
 * never disaster, and promises nothing.
 */
export const LANDING_FOOT = {
  head: 'Better procurement planning helps your project stay on course.',
  support: 'More predictable schedules. Better cost control. Greater confidence in the finish.',
} as const;
export const LANDING_WORDS = {
  target: 'Planned completion zone',
  delay: 'Added time + added cost',
  /** The overrun's label, set on two lines in its shorter zone. */
  delayLines: ['Added time +', 'Added cost'],
  /** The marker at the end of the planned zone: the established target, never a calendar date (founder, 2026-11-13). */
  date: 'Planned completion date',
  forecast: 'Projected finish',
  /** The three procurement-planning checkpoints, and their short forms on a narrow frame. */
  gates: ['Requirements identified', 'Commitments scheduled', 'Deliveries coordinated'],
  gatesShort: ['Identified', 'Scheduled', 'Coordinated'],
  /** The two annotations that name the metaphor (founder brief, 2026-11-13): the aircraft, and the approach. */
  project: 'Your project',
  plan: 'JiTpro flight plan',
} as const;

/** The scene in desktop units (side elevation). The aircraft is placed by the point beneath its wheels. */
export const LANDING_AT = {
  ground: 252,
  /** The runway, to the right of the frame, so the approach can use the width (refined 2026-11-13). */
  runway: { x0: 232, x1: 548, top: 244, h: 8 },
  /** The planned completion zone: long enough for touchdown, rollout and a controlled stop. Its end is the planned completion date. */
  target: { x0: 268, x1: 444 },
  /** The overrun: added time, added cost; it begins exactly at the planned completion date and is never entered. */
  delay: { x0: 444, x1: 540 },
  /** A long, shallow final approach from the left. */
  start: { x: 54, y: 142 },
  /** The touchdown point, in the first third of the planned zone: where the main gear first meets the runway. */
  touchdown: { x: 300, y: 244 },
  /** Where it stops: the whole aircraft inside the planned zone, with runway left before the boundary. */
  rollout: { x: 364, y: 244 },
  /** The planned approach, which the aircraft flies: a curve, even at first, flattening a little into the flare. */
  flare: { c1: { x: 136, y: 176 }, c2: { x: 222, y: 229 } },
  /** The waypoints, on the planned approach (x). */
  gates: [140, 178, 214],
  /**
   * The annotations (2026-11-13). *Your project*, relative to the point beneath the aircraft's wheels: a dot on the
   * cabin roof, a leader up to just beneath the words, which start a little behind it. *JiTpro flight plan*: a dot on
   * the planned approach near its start (x), a leader down to the words beneath it.
   */
  projectNote: { dot: { x: -2, y: -24 }, end: { x: 6, y: -40 }, text: { x: 0, y: -44 } },
  planNote: { at: 78, end: { x: 64, y: 168 }, text: { x: 20, y: 177 } },
  /** The projected finish: its centre and width at the outset and after each waypoint, ending at the stopping point. */
  forecast: [
    { x: 492, w: 92 },
    { x: 452, w: 76 },
    { x: 410, w: 58 },
    { x: 364, w: 44 },
  ],
} as const;

export function landingGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const k = d ? 1 : 0.6;
  const X = (x: number) => (d ? x : 2 + k * x);
  const Y = (y: number) => (d ? y : k * y - 2.4);
  const P = (p: { x: number; y: number }) => ({ x: X(p.x), y: Y(p.y) });
  const L = LANDING_AT;
  /** The planned approach's height at a point (desktop units): the curve the aircraft flies, solved for x. */
  const bez = (a: number, b: number, c: number, e: number, p: number) => {
    const u = 1 - p;
    return u * u * u * a + 3 * u * u * p * b + 3 * u * p * p * c + p * p * p * e;
  };
  const glideY = (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 50; n++) {
      const m = (lo + hi) / 2;
      if (bez(L.start.x, L.flare.c1.x, L.flare.c2.x, L.touchdown.x, m) < x) lo = m;
      else hi = m;
    }
    return bez(L.start.y, L.flare.c1.y, L.flare.c2.y, L.touchdown.y, lo);
  };
  const type = d ? { label: 7.5, zone: 8.5 } : { label: 6.5, zone: 6.5 };
  return {
    k,
    type,
    ground: { x0: X(12), x1: X(548), y: Y(L.ground) },
    runway: { x0: X(L.runway.x0), x1: X(L.runway.x1), y: Y(L.runway.top), h: k * L.runway.h },
    target: { x0: X(L.target.x0), x1: X(L.target.x1) },
    delay: { x0: X(L.delay.x0), x1: X(L.delay.x1) },
    /**
     * The planned completion date: a line on the seam between the planned zone and the overrun, standing this far above
     * the runway, and its navy tag on top (its words' size, the tag's height and side padding). Fixed throughout.
     */
    boundary: { x: X(L.target.x1), h: d ? 60 : 38, tag: { size: d ? 7 : 6, h: d ? 13 : 10, pad: d ? 6 : 4.5 } },
    /**
     * The zone labels' centres: under their zones; on the narrow frame eased a little apart, so *PLANNED COMPLETION ZONE*
     * and *ADDED TIME +* keep clear space between them.
     */
    zoneLabelX: {
      target: (X(L.target.x0) + X(L.target.x1)) / 2 - (d ? 0 : 3),
      delay: (X(L.delay.x0) + X(L.delay.x1)) / 2 + (d ? 0 : 4),
    },
    /** The zone labels, beneath the runway (the overrun's on two lines, this far apart). */
    labelY: Y(L.ground + 16),
    labelStep: d ? 10 : 7,
    start: P(L.start),
    touchdown: P(L.touchdown),
    rollout: P(L.rollout),
    flare: { c1: P(L.flare.c1), c2: P(L.flare.c2) },
    /** The planned approach's height at a point (this design's units). */
    approachY: (x: number) => Y(glideY((x - X(0)) / k)),
    /** The projected finish at each stage: its centre x and width, in this design's units. */
    forecast: L.forecast.map((f) => ({ x: X(f.x), w: k * f.w })),
    forecastH: k * 5,
    /** The projected finish's words, this far above the runway, beneath the planned completion date's tag (they cross its line on a halo). */
    forecastLabel: k * 19,
    /** Each checkpoint, on the planned approach; its label beneath and to its left, ending this far left of it. */
    gates: L.gates.map((x, i) => ({ x: X(x), y: Y(glideY(x)), label: (d ? LANDING_WORDS.gates : LANDING_WORDS.gatesShort)[i] })),
    gateLabel: { dx: d ? 12 : 10, dy: d ? 20 : 12 },
    /** The annotations: their size, leader width and dot; *Your project* relative to the wheels, *JiTpro flight plan* placed. */
    note: { size: d ? 9 : 7, lead: d ? 0.75 : 0.6, dot: d ? 1.6 : 1.2 },
    projectNote: {
      dot: { x: k * L.projectNote.dot.x, y: k * L.projectNote.dot.y },
      end: { x: k * L.projectNote.end.x, y: k * L.projectNote.end.y },
      text: { x: k * L.projectNote.text.x, y: k * L.projectNote.text.y },
    },
    /* On the narrow frame its words are relatively larger, so they sit a little further left and lower, clear of the approach. */
    planNote: {
      dot: { x: X(L.planNote.at), y: Y(glideY(L.planNote.at)) },
      end: { x: X(L.planNote.end.x) - (d ? 0 : 6), y: Y(L.planNote.end.y) + (d ? 0 : 2) },
      text: { x: X(L.planNote.text.x) - (d ? 0 : 10), y: Y(L.planNote.text.y) + (d ? 0 : 3.7) },
    },
    /** The aircraft's scale: drawn at 1.15 of its unit size, and scaled with the design. Its length either side of the wheels, and its height. */
    plane: k * 1.15,
    planeSpan: { back: k * 1.15 * 40, front: k * 1.15 * 37, up: k * 1.15 * 31 },
    band: teamGeometry(mode).band,
  };
}

/**
 * The foot's line size in Protect your investment: the band's own, unless a
 * line would not fit the frame on one line, then a half-point step smaller so
 * both of the visual's lines fit, at one size (2026-11-13: the founder's
 * *Weak procurement planning creates waste across the entire project.* is
 * longer than the band's 17 / 10 allow).
 */
export function teamFootHead(mode: OwnerMode): number {
  const { w } = OWNER_CANVAS[mode];
  const B = teamGeometry(mode).band;
  const widest = Math.max(textWidth(TEAM_FOOT.out.head, 1), textWidth(TEAM_FOOT.in.head, 1));
  return Math.min(B.head, Math.floor(((w - 16) / widest) * 2) / 2);
}

/* ---------------------------------- Better decisions (redrawn 2026-11-13) */

/**
 * BETTER DECISIONS: THE DECISION TIMING WINDOW (founder brief *Better
 * Decisions Section Redesign*, 2026-11-13; Design System Section 54.4.5). An
 * ILLUSTRATION; it reads no project data.
 *
 * JiTpro is not about deciding as early as possible. Too early, the project
 * does not yet know enough to weigh the alternatives; too late, the time left
 * no longer supports some of them. The right time is when the information is
 * there and enough time remains for the procurement that follows.
 *
 * ONE CORRIDOR, shaped like an elongated lens: narrow at the left, widest a
 * little before the middle, narrow at the right. Its height is how much room
 * there is for a sound decision: left of the peak it is limited by what is
 * known; right of it, by the time left. ONE GROUP, NEVER RESET: an amber NOW
 * marker and six options travel left to right through three stages. ONE RULE
 * decides each option's state: available while the whole card fits the
 * corridor; otherwise provisional before the peak (not yet evaluable, never
 * crossed out) and unavailable after it (the red X). The contractor
 * identifies what is needed and when; the owner decides. Nobody is blamed.
 */
export type WindowStage = 'early' | 'right' | 'late';
export const WINDOW_STAGES: Record<WindowStage, { heading: string; foot: { head: string; support: string } }> = {
  early: {
    heading: 'Information still developing',
    foot: { head: 'Premature decisions can limit your choices.', support: 'Incomplete information. Unnecessary commitments.' },
  },
  right: {
    heading: 'The right time to decide',
    foot: { head: 'The right timing preserves your choices.', support: 'Enough information. Enough time. Better decisions.' },
  },
  late: {
    heading: 'Options become limited',
    foot: { head: 'Delayed decisions can eliminate your options.', support: 'Less time. Fewer choices. Greater pressure.' },
  },
};
/** The closing line, on the foot, and the amber line beneath it (founder, 2026-11-13). */
export const WINDOW_CLOSE = 'Correctly timed information and decisions protect your options.';
export const WINDOW_CLOSE_SUPPORT = 'JiTpro helps your contractor plan early and communicate exactly when decisions are needed.';
/** The closing amber line's size: the band's own, a half-point step smaller where it would not fit on one line. */
export function windowCloseSupportSize(mode: OwnerMode): number {
  const { w } = OWNER_CANVAS[mode];
  const B = teamGeometry(mode).band;
  return Math.min(B.support, Math.floor(((w - 16) / textWidth(WINDOW_CLOSE_SUPPORT, 1)) * 2) / 2);
}
/** The words on the picture besides the headings: the founder's. */
export const WINDOW_WORDS = {
  now: 'Now',
  time: 'Time passes',
  zones: ['Too early', 'Right time', 'Too late'],
  choice: 'Choice',
  /** The group's status, above the stack, at the three stops (founder, 2026-11-13). */
  known: 'Known options',
  six: 'Six viable options',
  two: 'Only two viable options remain',
  /** The brief callout beside a card as it is discovered. */
  found: 'New option discovered',
} as const;
/**
 * Why each choice is no longer viable, in the order they are lost (founder, 2026-11-13): lead time, manufacturing
 * capacity, cost and approvals. Illustrative: nonviable under the project's current requirements, not impossible.
 */
export const WINDOW_LOSS_REASONS = ['Lead time too long', 'Production slot lost', 'Price no longer viable', 'Approval time exhausted'] as const;
/**
 * How many choices there are (founder, 2026-11-13): *Choice 1* to *Choice 6*, numbered in the order they become known.
 * Three are known from the start; three are discovered as information develops. Any alternative, never a product; the
 * number is illustrative.
 */
export const CHOICE_COUNT = 6;
export const CHOICE_KNOWN = 3;
export type OptionState = 'undiscovered' | 'available' | 'unavailable';

/** The closing line of each visual, exactly as supplied by the founder (2026-11-11; Reduce risk, 2026-11-12). */
export const OWNER_TAKEAWAY: Record<OwnerTabId, string> = {
  'owner-reduce-risk': 'Confidence requires a plan.',
  'owner-protect-investment': TEAM_FOOT.in.head,
  'owner-predictability': 'Better procurement planning helps your project stay on course.',
  'owner-better-decisions': WINDOW_CLOSE,
};

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
  arc?: { at: number; dur: number; c1: { dx: number; dy: number }; c2: { dx: number; dy: number }; to: { dx: number; dy: number }; rot?: number; smooth?: boolean; even?: boolean };
  /**
   * Pushed along by something that sweeps `travel` in the direction
   * (`ux`, `uy`) over `dur`: it stays put until the sweeper, which sets out
   * `reach` behind it, arrives, and from then on moves exactly with it, the
   * same way. As it goes it turns up to `spin` degrees. The sweeper itself
   * has reach 0.
   */
  push?: { at: number; dur: number; travel: number; reach: number; ux: number; uy: number; spin?: number };
  /**
   * Travels by (dx, dy) from where it is drawn, turning by `rot` degrees and growing to `scale` (and, horizontally only,
   * to `scaleX`) as it goes. Eased in and out; `ease: 'out'` sets off at speed and slows to rest (a rollout).
   */
  move?: { at: number; dur: number; dx: number; dy: number; rot?: number; scale?: number; scaleX?: number; ease?: 'out' };
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
export type CueState = { o: number; ty: number; draw: number; mx: number; my: number; rot: number; sc: number; sx: number };

const IN = 350;
const OUT = 350;

/** How far through a span of `dur` from `at`, 0 to 1. A span of no length is complete from its first moment (2026-11-13). */
const through = (t: number, at: number, dur: number) => (dur > 0 ? ease((t - at) / dur) : t >= at ? 1 : 0);

export function cueStateAt(c: Cue, t: number): CueState {
  const enter = through(t, c.at, c.dur ?? IN);
  const leave = c.out === undefined ? 0 : through(t, c.out, c.outDur ?? OUT);
  const stay = 1 - leave * (1 - (c.outTo ?? 0));
  const mt = c.move ? Math.min(1, Math.max(0, (t - c.move.at) / c.move.dur)) : 0;
  const m = c.move ? (c.move.ease === 'out' ? 1 - (1 - mt) * (1 - mt) : ease(mt)) : 0;
  /* What is left of an arrival: 1 as it sets out, 0 once landed. Both slow into rest and never pass it (Section 46.4). */
  const left = (dur: number, power: number) => (1 - Math.min(1, Math.max(0, (t - c.at) / dur))) ** power;
  const landing = c.from ? left(c.dur ?? IN, 3) : 0;
  const rolling = c.roll ? left(c.roll.dur, 2) : 0;
  const hop = c.roll ? c.roll.hop * rolling * Math.abs(Math.sin(Math.PI * c.roll.hops * Math.min(1, Math.max(0, (t - c.at) / c.roll.dur)))) : 0;
  /* Along a curve: how far, 0 to 1, gathering speed; and the cubic's weights there. */
  /* A smooth arc eases in and out (an aircraft on approach, 2026-11-13); otherwise it gathers speed, as a thing falling does. */
  /* `even`: at a steady pace from start to end (an aircraft already flying, 2026-11-13). */
  const ta = c.arc ? Math.min(1, Math.max(0, (t - c.arc.at) / c.arc.dur)) : 0;
  const p = c.arc ? (c.arc.even ? ta : c.arc.smooth ? ease(ta) : ta ** 1.5) : 0;
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
    sx: 1 + ((c.move?.scaleX ?? 1) - 1) * m,
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
 * Better decisions: the timing window. Laid out once on the desktop canvas and
 * set on the narrow one at 0.6 of the size; only the type is set separately,
 * so it stays readable. Every word's and every option's place is here, so it
 * can be checked.
 *
 * THE CORRIDOR is symmetric about a level centre line. Each side of its peak
 * is an eased curve, level where it meets the peak: rising sin² from the left
 * end, falling cos² to the right end.
 */
export const WINDOW_SHAPE = { x0: 40, x1: 520, cy: 146, hL: 40, hM: 92, hR: 12, peak: 0.48 } as const;
/** Where the group stands at each stage (desktop units, the marker's x). */
export const WINDOW_AT: Record<WindowStage, number> = { early: 96, right: 270, late: 416 };
/** Where the group stops for each discovery, on the way into the window (desktop units): Choice 4, 5 and 6. */
export const WINDOW_DISCOVER = [140, 185, 230] as const;

export function windowGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const k = d ? 1 : 0.6;
  const X = (x: number) => (d ? x : 2 + k * x);
  const Y = (y: number) => (d ? y : k * y - 2.4);
  const S = WINDOW_SHAPE;
  const xPeak = S.x0 + S.peak * (S.x1 - S.x0);
  /** The corridor's half-height at a point along it (desktop units). */
  const halfAt = (x: number) => {
    const u = Math.min(1, Math.max(0, (x - S.x0) / (S.x1 - S.x0)));
    if (u <= S.peak) return S.hL + (S.hM - S.hL) * Math.sin((Math.PI / 2) * (u / S.peak)) ** 2;
    return S.hR + (S.hM - S.hR) * Math.cos((Math.PI / 2) * ((u - S.peak) / (1 - S.peak))) ** 2;
  };
  /** An option card (desktop units): half its height, the gap between cards, half its width. Its drawn size is set per design. */
  const HALF = 8;
  const GAP = 6;
  const LEAD = 30;
  /*
   * The stack, centred on the marker, set this far below the centre line so that no two choices are lost at once.
   * Top to bottom it reads Choice 1, 2, 3...; each discovery adds a card beneath and the stack moves up half a step,
   * so it stays centred. `offsets` are the places of all six, once all are known.
   */
  const OFF = 3;
  const PITCH = 2 * HALF + GAP;
  const offsets = Array.from({ length: CHOICE_COUNT }, (_, j) => OFF + (j - (CHOICE_COUNT - 1) / 2) * PITCH);
  /** With n choices known, each card's offset: the six places, moved down half a step for each one still unknown. */
  const stackOffset = (j: number, n: number) => offsets[j] + ((CHOICE_COUNT - n) * PITCH) / 2;
  /** Whether the whole of choice j fits inside the corridor with the group at x and n choices known. */
  const fits = (j: number, x: number, n = CHOICE_COUNT) => Math.abs(stackOffset(j, n)) + HALF <= Math.min(halfAt(x - LEAD), halfAt(x + LEAD));
  /** How many choices are known with the group at x: three, then one more at each discovery. */
  const knownAt = (x: number) => CHOICE_KNOWN + WINDOW_DISCOVER.filter((dx) => x >= dx).length;
  /** A choice's state with the group at x: unknown until discovered; then available until the corridor, narrowing, no longer holds it. */
  const stateAt = (j: number, x: number): OptionState => (j >= knownAt(x) ? 'undiscovered' : x > xPeak && !fits(j, x) ? 'unavailable' : 'available');
  /* Where each choice is lost, on the way out: the first point at which the corridor no longer holds it. */
  const changes: { option: number; x: number; to: OptionState }[] = [];
  offsets.forEach((_, j) => {
    for (let x = WINDOW_AT.right; x <= WINDOW_AT.late; x += 0.5)
      if (stateAt(j, x - 0.5) === 'available' && stateAt(j, x) === 'unavailable') changes.push({ option: j, x: X(x), to: 'unavailable' });
  });
  changes.sort((a, b) => a.x - b.x || a.option - b.option);
  /* The decision window: where the corridor holds all six (the marker's x), widened by half a card each side to cover them. */
  let wa = xPeak;
  let wb = xPeak;
  while (offsets.every((_, j) => fits(j, wa - 0.5))) wa -= 0.5;
  while (offsets.every((_, j) => fits(j, wb + 0.5))) wb += 0.5;
  const card = d ? { w: 60, h: 16, round: 3, label: 8.5 } : { w: 42, h: 10, round: 2, label: 6.5 };
  const type = d ? { heading: 10, label: 8.5, zone: 7.5, tag: 7.5 } : { heading: 8, label: 7, zone: 7, tag: 6.5 };
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const N = 48;
  const wallPoints = (side: -1 | 1, inset = 0) =>
    Array.from({ length: N + 1 }, (_, n) => {
      const x = S.x0 + ((S.x1 - S.x0) * n) / N;
      return `${r1(X(x))} ${r1(Y(S.cy + side * (halfAt(x) - inset)))}`;
    });
  const tag = d ? { w: 32, h: 13 } : { w: 26, h: 9.5 };
  const tagY = Y(37);
  const AXIS_Y = Y(266);
  return {
    k,
    type,
    /** The corridor in this design's units: its ends, its centre line and peak, its half-height at a point, its walls, and the whole of it as one shape. */
    shape: { x0: X(S.x0), x1: X(S.x1), cy: Y(S.cy), peak: X(xPeak) },
    half: (x: number) => k * halfAt((x - X(0)) / k),
    wall: (side: -1 | 1) => `M${wallPoints(side).join('L')}`,
    inner: (side: -1 | 1) => `M${wallPoints(side, 3.5).join('L')}`,
    outline: `M${[...wallPoints(-1), ...wallPoints(1).reverse()].join('L')}Z`,
    card,
    /** The stack's places about the marker, once all six are known: each choice's centre y. */
    cards: offsets.map((o) => ({ y: Y(S.cy + o) })),
    /** How far the stack sits below its final place with n choices known (this design's units), and how far it moves up at each discovery. */
    stackDrop: (n: number) => (k * (CHOICE_COUNT - n) * PITCH) / 2,
    stackStep: (k * PITCH) / 2,
    /** Each choice's centre y with n known, and whether it fits the corridor with the group at x (this design's units). */
    stackY: (j: number, n: number) => Y(S.cy + stackOffset(j, n)),
    fits: (j: number, x: number, n: number) => fits(j, (x - X(0)) / k, n),
    name: (j: number) => ({ word: WINDOW_WORDS.choice, letter: String(j + 1) }),
    /** Where the group stops for each discovery. */
    discover: WINDOW_DISCOVER.map((x) => X(x)),
    /** The group's status label, above the stack: its baseline with n choices known. */
    statusY: (n: number) => Y(S.cy + stackOffset(0, n) - HALF - (d ? 7 : 6)),
    /** A callout beside a card: its left edge, from the marker. */
    note: { dx: k * LEAD + (d ? 7 : 5), size: d ? 7 : 6, h: d ? 12 : 8.5, pad: d ? 5 : 3.5 },
    /** Each stage: where the group stands, and each option's state there. */
    stop: (when: WindowStage) => ({ x: X(WINDOW_AT[when]), states: offsets.map((_, j) => stateAt(j, WINDOW_AT[when])) }),
    /** Where each option changes state on the way, in order. */
    changes,
    /** The decision window: the band's span (covering the cards), clipped to the corridor. */
    window: { x0: X(wa - LEAD), x1: X(wb + LEAD), from: X(wa), to: X(wb) },
    /** The haze over the left of the corridor: information still developing. */
    haze: { x0: X(S.x0), x1: X(xPeak - 40) },
    /** The risk near the narrow end: from a little before the late stop to the tip, the walls thicken to `thick` and redden. */
    pressure: { from: X(WINDOW_AT.late - 60), thick: k * 3.5 },
    /** The heading, centred at the top. */
    heading: { x: X(280), y: d ? 27 : 14 },
    /** The NOW tag above the corridor and the marker line beneath it, about the marker's x. */
    tag: { ...tag, y: tagY },
    line: { y0: tagY + tag.h, y1: Y(242) },
    /** The stage names beneath the corridor. */
    zones: [
      { x: X(S.x0 + 0.13 * (S.x1 - S.x0)), word: WINDOW_WORDS.zones[0] },
      { x: X(xPeak), word: WINDOW_WORDS.zones[1] },
      { x: X(S.x0 + 0.88 * (S.x1 - S.x0)), word: WINDOW_WORDS.zones[2] },
    ].map((z) => ({ ...z, y: Y(254) })),
    axis: {
      x0: X(S.x0),
      x1: X(S.x1),
      y: AXIS_Y,
      /* *TIME PASSES* beneath the arrow's end, right-aligned, clear of the marker's pointer at every stop. */
      label: { x: X(S.x1), y: Y(279) },
      ticks: Array.from({ length: 11 }, (_, n) => X(S.x0 + 40 * (n + 1))),
      tick: d ? 3 : 2,
      pointer: d ? { w: 5, h: 6 } : { w: 3.5, h: 4.5 },
    },
    band: teamGeometry(mode).band,
    /** The close: the six options, all available, in a column inside the decision window. */
    close: { x: X(WINDOW_AT.right) },
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
   * TWO SCENES, EACH LIKE A SHORT FILM (founder, 2026-11-13): message first, illustration second, hold the outcome,
   * fade out, then the next scene. No heading names either scene; the foot's words do.
   *
   * THE FOOT: the navy bar and its amber edge are there from the first frame to the end and never fade. Only its words
   * fade, in with each scene's opening and out with its close; they are blank only during the short beat between scenes.
   *
   * Within each scene the existing illustration plays at its existing pace (slowed 2026-11-12: calm, controlled, easy to
   * read). Each scene, once complete, is held 3 s; the first then fades out as one, everything together.
   */
  /** A scene's words fade in over this long; the illustration begins this long after they are in. */
  const WORDS = 700;
  const PAUSE = 400;
  /** A completed scene is held this long; the first then fades out as one over FADE, and the frame is clear for BEAT. */
  const HOLD = 3000;
  const FADE = 800;
  const BEAT = 300;
  const n = TEAM.length;
  /** How long a bill takes from its card into the dumpster: slow enough to follow. */
  const BILL_FLIGHT = 1400;
  /** The contractor's own bills fall a short way, straight down. */
  const BILL_DROP = 1000;

  /* Scene 1. The words, then the contractor, then the four groups; the disorder follows at its own pace, as before,
     `LATER` ms after the moment it used to begin. */
  const WORDS_1 = 400;
  const CONTRACTOR = WORDS_1 + WORDS + PAUSE;
  const GROUPS = CONTRACTOR + 800;
  const LATER = GROUPS + (n - 1) * 250 + 600 + 350 - 2800;
  const bills = Array.from({ length: TEAM_WASTE_ROUNDS }, (_, r) =>
    TEAM_PARTIES.map((who, e) => {
      const nth = r * TEAM_PARTIES.length + e;
      const at = LATER + 5150 + nth * 255 - ((nth * (nth - 1)) / 2) * 6;
      return { who, r, at, flight: who === 'gc' ? BILL_DROP : BILL_FLIGHT };
    }),
  ).flat();
  /** Scene 1 is complete when its last request has landed and its last bill is in the dumpster. */
  const FIRST_DONE = Math.max(LATER + 8040, ...bills.map((b) => b.at + 320 + b.flight + 160));
  const OUT_1 = FIRST_DONE + HOLD;
  const scene1 = { out: OUT_1, outDur: FADE };

  /* Scene 2. The words, then the shield, then the four groups, then the lines, the calm words and the value kept. */
  const WORDS_2 = OUT_1 + FADE + BEAT;
  const GUARD = WORDS_2 + WORDS + PAUSE;
  const GROUPS_2 = GUARD + 1700;
  const LINKS = GROUPS_2 + (n - 1) * 200 + 600 + 250;
  const KEEP = LINKS + (n - 1) * 220 + 500 + 300;
  const SECOND_DONE = KEEP + n * 240 + 550;

  const cues: Cue[] = [
    // The frame: the sheet, and the foot's navy bar and amber edge. There from the first frame; they never fade.
    { k: 'ground', at: 0, dur: 0 },
    { k: 'foot', at: 0, dur: 0 },
    // SCENE 1. The message first.
    { k: 'footOutWords', at: WORDS_1, dur: WORDS, ...scene1 },
    // Then the contractor, where it stands: opacity only.
    { k: 'loose', at: CONTRACTOR, dur: 700, ...scene1 },
    // Then the four groups around it, a little apart: opacity only.
    ...TEAM.map((_, i): Cue => ({ k: `card-${i}`, at: GROUPS + i * 250, dur: 600, ...scene1 })),
    // Out of control: friction runs outward to each group, and rushed requests follow it.
    ...TEAM.map((_, i): Cue => ({ k: `friction-${i}`, at: LATER + 2800 + i * 200, dur: 700, draw: true, ...scene1 })),
    ...TEAM_RUSH.map((r, i): Cue => ({ k: `rush-${i}`, at: LATER + (r.round === 0 ? 3400 : 6600) + r.to * 280, dur: 600, from: g.tagFrom(r.to, r.round), ...scene1 })),
    // What it does to each of them, between the first requests and the second.
    ...TEAM.map((_, i): Cue => ({ k: `effect-${i}`, at: LATER + 5000 + i * 300, dur: 500, rise: 3, ...scene1 })),
    // And money is wasted: a jobsite dumpster, and bills leaving the contractor and all four groups for it in turn. The flow
    // builds: each bill follows the last a little sooner. Every bill is in before the scene is complete.
    ...(['binBack', 'bin'] as const).map((k): Cue => ({ k, at: LATER + 4950, dur: 500, rise: 4, ...scene1 })),
    ...bills.map(({ who, r, at, flight }): Cue => {
      const path = g.billPath(who, r);
      const by = (point: { x: number; y: number }) => ({ dx: point.x - path.from.x, dy: point.y - path.from.y });
      const turn = who === 'gc' ? (r - 1) * 14 : (g.onLeft(who) ? 1 : -1) * (24 + r * 10);
      return { k: `bill-${who}-${r}`, at, dur: 320, arc: { at: at + 320, dur: flight, c1: by(path.c1), c2: by(path.c2), to: by(path.to), rot: turn }, out: at + 320 + flight, outDur: 160 };
    }),
    // Held, complete; then the whole scene fades out as one, its words with it. The bar stays.
    // SCENE 2. The message first; it stays.
    { k: 'takeaway', at: WORDS_2, dur: WORDS },
    // Then the shield is drawn around the contractor, calmly, and stands.
    { k: 'guard', at: GUARD, dur: 1300, draw: true },
    { k: 'shield', at: GUARD + 1000, dur: 700 },
    // Then the four groups, a little apart: opacity only.
    ...TEAM.map((_, i): Cue => ({ k: `cardIn-${i}`, at: GROUPS_2 + i * 200, dur: 600 })),
    // Then each is reached by a level line, in turn, and settles as it is reached.
    ...Array.from({ length: n }, (_, i): Cue[] => [
      { k: `node-${i}`, at: LINKS + i * 220, dur: 300 },
      { k: `link-${i}`, at: LINKS + i * 220, dur: 650, draw: true },
      { k: `calm-${i}`, at: LINKS + 500 + i * 220, dur: 500, rise: 3 },
    ]).flat(),
    // Then value is protected: a small shield with a dollar sign settles beside each of the five, one by one, the groups
    // first and the contractor last. Where money was leaving, it is now kept.
    ...[...TEAM.map((_, i): TeamParty => i), 'gc' as TeamParty].map((who, j): Cue => ({ k: `keep-${who}`, at: KEEP + j * 240, dur: 550, rise: 4 })),
    // Held, complete, and it rests there: the visual plays once and does not restart, so its outcome is its last frame
    // (and the reduced-motion frame).
  ];
  return { tab: 'owner-protect-investment', mode, cues, end: SECOND_DONE + HOLD };
}

function predictabilityScene(mode: OwnerMode): OwnerScene {
  const g = landingGeometry(mode);
  /*
   * ONE STABLE APPROACH, PLAYED ONCE (founder briefs, 2026-11-13). The aircraft flies one continuous approach at an even
   * pace, flares a little, touches down inside the planned finish and rolls out to rest. What changes is the forecast:
   * the projected finish opens wide and red in the added-cost zone; as each procurement-planning waypoint appears just
   * ahead of the aircraft, it narrows and glides toward the planned finish, turning amber inside it with the third. The
   * foot's words are there, unchanged, from the first frame.
   */
  const FLY = { at: 2400, dur: 9000 };
  const TOUCH = FLY.at + FLY.dur;
  const T = g.touchdown;
  const S = g.start;
  /* Rollout: sets off at the approach's own horizontal pace and slows to rest (an ease-out starts at twice its average). */
  const pace = (T.x - S.x) / FLY.dur;
  const ROLL = { at: TOUCH, dur: Math.round((2 * (g.rollout.x - T.x)) / pace) };
  const LANDED = ROLL.at + ROLL.dur + 200;
  /** After touchdown on the main gear, the nose settles onto the runway over this long. */
  const SETTLE = 700;
  /* When the aircraft, at its even pace along the curve, passes a point: the curve's own x, solved for its time. */
  const curveX = (p: number) => {
    const u = 1 - p;
    return u * u * u * S.x + 3 * u * u * p * g.flare.c1.x + 3 * u * p * p * g.flare.c2.x + p * p * p * T.x;
  };
  const passAt = (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 50; n++) {
      const m = (lo + hi) / 2;
      if (curveX(m) < x) lo = m;
      else hi = m;
    }
    return Math.round(FLY.at + FLY.dur * lo);
  };
  const by = (pt: { x: number; y: number }) => ({ dx: pt.x - S.x, dy: pt.y - S.y });
  const AHEAD = 2200;
  const MOVE = 1100;
  const F = g.forecast;
  const passes = g.gates.map((gate) => passAt(gate.x));
  /** The forecast's words give way as the aircraft passes the last waypoint; its band stays on the runway until touchdown. */
  const FORECAST_OUT = passes[passes.length - 1];
  const cues: Cue[] = [
    // The frame: the sheet, and the foot with its words, from the first frame; they never change.
    { k: 'ground', at: 0, dur: 0 },
    { k: 'foot', at: 0, dur: 0 },
    { k: 'takeaway', at: 0, dur: 0 },
    // The runway: the touchdown point, the planned completion zone, the boundary, and the overrun beyond, never entered.
    { k: 'runway', at: 200, dur: 700 },
    { k: 'target', at: 700, dur: 500 },
    { k: 'aim', at: 900, dur: 400 },
    { k: 'targetLabel', at: 1000, dur: 500, rise: 3 },
    // The planned completion date: its line drawn up from the runway's seam, then its tag.
    { k: 'boundary', at: 1150, dur: 400, draw: true },
    { k: 'boundaryLabel', at: 1450, dur: 400, rise: 3 },
    { k: 'delay', at: 1200, dur: 500 },
    // The planned approach, and the projected finish: wide and red, in the added-cost zone.
    { k: 'glide', at: 1800, dur: 800 },
    // The annotations name the metaphor: the approach as it completes, then the aircraft once it is in. Each leader is
    // drawn from its subject, then its words fade in; they stay. *Your project* travels in the aircraft's own groups.
    { k: 'planLead', at: 2400, dur: 300, draw: true },
    { k: 'planNote', at: 2650, dur: 450, rise: 2 },
    { k: 'projectLead', at: 3000, dur: 300, draw: true },
    { k: 'projectNote', at: 3250, dur: 450, rise: 2 },
    // The forecast: its words give way as the aircraft passes the last waypoint, before it comes down over them; its band
    // stays, amber, where the aircraft will stop, until it has rolled out onto it and stopped.
    { k: 'forecast', at: 2100, dur: 600, out: ROLL.at + ROLL.dur, outDur: 600 },
    { k: 'forecastLabel', at: 2100, dur: 600, out: FORECAST_OUT, outDur: 500 },
    { k: 'forecastLate', at: 2100, dur: 600, out: passes[2] - AHEAD + 400, outDur: MOVE - 400 },
    { k: 'forecastOn', at: passes[2] - AHEAD + 400, dur: MOVE - 400 },
    // The aircraft: in flight from its first moment, one even approach, its nose lifting three degrees into the flare.
    { k: 'plane', at: FLY.at, dur: 700 },
    { k: 'fly', at: 0, dur: 1, arc: { at: FLY.at, dur: FLY.dur, even: true, c1: by(g.flare.c1), c2: by(g.flare.c2), to: by(T), rot: -3 } },
    // Touchdown on the main gear (it turns about them); the nose settles onto the runway.
    { k: 'settle', at: 0, dur: 1, move: { at: TOUCH, dur: SETTLE, dx: 0, dy: 0, rot: 3 } },
    // *Your project* travels in the aircraft's groups, but its words stay level: the exact opposite of the aircraft's pitch,
    // from the same flight and settle (about the same point beneath the wheels).
    { k: 'projectLevel', at: 0, dur: 1, arc: { at: FLY.at, dur: FLY.dur, even: true, c1: { dx: 0, dy: 0 }, c2: { dx: 0, dy: 0 }, to: { dx: 0, dy: 0 }, rot: 3 }, move: { at: TOUCH, dur: SETTLE, dx: 0, dy: 0, rot: -3 } },
    // Rollout: aligned with the runway, slowing smoothly to a complete stop inside the planned zone.
    { k: 'roll', at: 0, dur: 1, move: { at: ROLL.at, dur: ROLL.dur, dx: g.rollout.x - T.x, dy: 0, ease: 'out' } },
    // The stop: a small marker at the nose.
    { k: 'stop', at: ROLL.at + ROLL.dur, dur: 500 },
    // Procurement planning: each waypoint appears ahead of the aircraft, and the projected finish narrows and moves with
    // it; each is checked as the aircraft passes.
    ...g.gates.flatMap((_, i): Cue[] => [
      { k: `gate-${i}`, at: passes[i] - AHEAD, dur: 500, rise: 3 },
      { k: `pass-${i}`, at: passes[i], dur: 400 },
      { k: `f-${i}`, at: 0, dur: 1, move: { at: passes[i] - AHEAD, dur: MOVE, dx: F[i + 1].x - F[i].x, dy: 0 } },
      { k: `fw-${i}`, at: 0, dur: 1, move: { at: passes[i] - AHEAD, dur: MOVE, dx: 0, dy: 0, scaleX: F[i + 1].w / F[i].w } },
    ]),
    // Landed: the planned finish brightens and is checked.
    { k: 'landed', at: LANDED, dur: 600, rise: 3 },
  ];
  return { tab: 'owner-predictability', mode, cues, end: LANDED + 2400 };
}

function decisionsScene(mode: OwnerMode): OwnerScene {
  const g = windowGeometry(mode);
  /*
   * ONE GROUP, ONE STORY, PLAYED ONCE (founder brief *Option Discovery and Viability*, 2026-11-13).
   *   3 known choices -> 3 newly discovered, one at a time -> 6 viable -> 4 become unavailable, one at a time -> 2 remain.
   * The group (the marker and the stack) moves in legs and stops for each discovery and each loss: the new card arrives
   * with an amber outline and *New option discovered*; the lost card takes a red outline and *No longer viable*, then its
   * red X; each callout is read for about half a second, then goes, and the group moves on. Unknown choices are not drawn
   * at all. Lost choices stay in place. Then the close: the six at rest in the decision window.
   */
  const early = g.stop('early');
  const right = g.stop('right');
  const late = g.stop('late');
  const OPEN = 2000;
  const H1 = 3000;
  /** The legs' pace: a base, plus a share of their length, so a short step is not hurried and a long one not rushed. */
  const leg = (from: number, to: number) => Math.round(Math.min(1300, Math.max(500, 380 + 4.2 * ((to - from) / g.k))));
  /** A discovery: the card in, its amber outline and callout; read; the callout and outline go. */
  const FIND = { card: 500, note: 150, read: 550, out: 300 };
  const FOUND = FIND.note + 350 + FIND.read + FIND.out;
  /** A loss: the red outline and its reason; read (longer than a discovery: the reasons are longer); the X; the reason and outline go. */
  const LOSE = { note: 150, read: 750, x: 400, out: 300 };
  const LOST = LOSE.note + 350 + LOSE.read + LOSE.x + LOSE.out;

  type Leg = { k: string; at: number; dur: number; dx: number };
  const legs: Leg[] = [];
  let clock = 5900;
  let x = early.x;
  const go = (to: number) => {
    const dur = leg(x, to);
    legs.push({ k: `leg-${legs.length}`, at: clock, dur, dx: to - x });
    clock += dur;
    x = to;
  };
  /* Into the window: stop for each discovery, then on to the right time. */
  const found: { j: number; at: number }[] = [];
  g.discover.forEach((dx, n) => {
    go(dx);
    found.push({ j: CHOICE_KNOWN + n, at: clock });
    clock += FOUND;
  });
  const RUN1_START = legs[0].at;
  go(right.x);
  const RIGHT = clock;
  /* The right time: held. */
  const HOLD_RIGHT = 4600;
  clock = RIGHT + HOLD_RIGHT;
  const RUN2_START = clock;
  /* On toward the narrow end: stop for each loss, then on to the late stop. */
  const lost: { j: number; at: number }[] = [];
  for (const c of g.changes) {
    go(c.x);
    lost.push({ j: c.option, at: clock });
    clock += LOST;
  }
  go(late.x);
  const LATE = clock;
  const FADE = LATE + 3800;
  const FADE_MS = 900;
  const story = { out: FADE, outDur: FADE_MS };
  const CLEAR = FADE + FADE_MS + 200;
  const CLOSE = CLEAR + (CHOICE_COUNT - 1) * 110 + 250;
  const knownAt = (j: number) => OPEN + 300 + j * 110;
  const cues: Cue[] = [
    // The sheet, the corridor and its haze, time and the stage names. The corridor stays to the end.
    { k: 'ground', at: 0, dur: 800 },
    { k: 'cone', at: 300, dur: 700 },
    { k: 'haze', at: 300, dur: 700, out: RUN1_START, outDur: RIGHT - RUN1_START },
    { k: 'wall-top', at: 300, dur: 1200, draw: true },
    { k: 'wall-bottom', at: 300, dur: 1200, draw: true },
    { k: 'axis', at: 700, dur: 900, draw: true },
    { k: 'time', at: 1100, dur: 500 },
    { k: 'zones', at: 1300, dur: 500, rise: 3 },
    // The foot: the navy bar and its amber edge are scenery, there throughout; only the words change.
    { k: 'foot', at: 300, dur: 700 },
    // 1. Too early: the marker, and the three known choices; nothing else is drawn.
    { k: 'marker', at: OPEN, dur: 400, ...story },
    ...Array.from({ length: CHOICE_KNOWN }, (_, j): Cue => ({ k: `card-${j}`, at: knownAt(j), dur: 450, rise: 4, ...story })),
    { k: 'statusKnown', at: knownAt(CHOICE_KNOWN - 1) + 450, dur: 450, rise: 3, out: found[0].at, outDur: 300 },
    { k: 'headEarly', at: H1, dur: 500, rise: 3, out: RUN1_START, outDur: 450 },
    { k: 'footEarly', at: H1 + 300, dur: 600, rise: 3, out: RIGHT - 100, outDur: 400 },
    // The group's legs: each moves the marker and the stack together, then stops.
    ...legs.map((l): Cue => ({ k: l.k, at: 0, dur: 1, move: { at: l.at, dur: l.dur, dx: l.dx, dy: 0 } })),
    // 2. New options are discovered, one at a time: the stack moves up half a step as the card arrives beneath it, with an
    //    amber outline and its callout; read; the callout and outline go, and the card stays as a normal choice.
    ...found.flatMap(({ j, at }): Cue[] => [
      { k: `shift-${j}`, at: 0, dur: 1, move: { at, dur: FIND.card, dx: 0, dy: -g.stackStep } },
      { k: `card-${j}`, at, dur: FIND.card, ...story },
      { k: `glow-${j}`, at, dur: FIND.card, out: at + FIND.note + 350 + FIND.read, outDur: FIND.out },
      { k: `found-${j}`, at: at + FIND.note, dur: 350, out: at + FIND.note + 350 + FIND.read, outDur: FIND.out },
    ]),
    // 3. The right time: the amber window comes in as the group reaches it; all six viable; held longest.
    { k: 'window', at: legs[legs.length - (g.changes.length + 2)].at, dur: 1400 },
    { k: 'headRight', at: RIGHT + 100, dur: 500, rise: 3, out: RUN2_START, outDur: 450 },
    { k: 'footRight', at: RIGHT + 150, dur: 600, rise: 3, out: LATE - 100, outDur: 400 },
    { k: 'statusSix', at: RIGHT + 350, dur: 450, rise: 3, out: RUN2_START, outDur: 400 },
    // 4. Options become unavailable, one at a time, as the group reaches the point where each no longer fits: a red
    //    outline and its callout; read; the red X; the callout and outline go; the card stays, crossed out.
    ...lost.flatMap(({ j, at }): Cue[] => [
      { k: `warn-${j}`, at, dur: 250, out: at + LOSE.note + 350 + LOSE.read + LOSE.x, outDur: LOSE.out },
      { k: `lost-${j}`, at: at + LOSE.note, dur: 350, out: at + LOSE.note + 350 + LOSE.read + LOSE.x, outDur: LOSE.out },
      { k: `off-${j}`, at: at + LOSE.note + 350 + LOSE.read, dur: LOSE.x, ...story },
    ]),
    { k: 'pressure', at: RUN2_START + 800, dur: LATE - RUN2_START - 800, ...story },
    // 5. Too late: two remain.
    { k: 'headLate', at: LATE + 100, dur: 500, rise: 3, ...story },
    { k: 'footLate', at: LATE + 150, dur: 600, rise: 3, out: FADE + 300, outDur: 500 },
    { k: 'statusTwo', at: LATE + 350, dur: 450, rise: 3, ...story },
    // 6. The close: the six at rest, all available, in the decision window; the closing line, on the foot.
    ...Array.from({ length: CHOICE_COUNT }, (_, j): Cue => ({ k: `rest-${j}`, at: CLEAR + j * 110, dur: 500, rise: 4 })),
    { k: 'takeaway', at: CLOSE, dur: 600, rise: 3 },
  ];
  return { tab: 'owner-better-decisions', mode, cues, end: CLOSE + 1600 };
}

export function buildOwnerScene(tab: OwnerTabId, mode: OwnerMode): OwnerScene {
  if (tab === 'owner-reduce-risk') return riskScene(mode);
  if (tab === 'owner-protect-investment') return investmentScene(mode);
  if (tab === 'owner-predictability') return predictabilityScene(mode);
  return decisionsScene(mode);
}

