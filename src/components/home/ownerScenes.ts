/**
 * The Project Owners tabs' visuals, as pure data and state (Design System
 * Section 54.4.5, 2026-11-11). PURE: no DOM, no React.
 *
 * ONE PROJECT. All four visuals read the sample project the general
 * contractor tabs draw: the featured Custom Steel Windows and Doors chain,
 * Connect's dependencies on it, and the schedule's other items. No chain,
 * activity, date or dependency is changed or authored here. What is authored
 * is presentation only: short display names, and the wording of the
 * illustrative conditions (a design detail not yet final; dimensions found
 * not to match), which are marked as such where they are defined.
 *
 * WHO IT SPEAKS TO. The owner is not the user of JiTpro; the general
 * contractor is. Each visual shows what the contractor's planning lets the
 * owner see or avoid. Nothing depicts the owner operating software, and
 * nothing promises an outcome, a saving or a date.
 *
 * ONE CLOCK PER VISUAL (Section 46.3). A visual is a list of cues: each names
 * an element by key and says when it appears, how, and when it leaves.
 * `ownerStateAt(scene, t)` maps time to every element's opacity, rise, drawn
 * length and travel. The renderer applies it and decides nothing.
 */

import { CONNECT_ITEM } from './connectChainScene';
import { partyOf, shortDay, fullDay } from './controlChainScene';
import { FOCAL_ITEM, PLAN_STEP_GROUPS, ROW_ITEMS, ease } from './planChainScene';

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
 * The featured chain as five stages, in order, with the dates its own
 * activities give them. Grouped exactly as Plan's step list groups them
 * (PLAN_STEP_GROUPS); only the wording is the owner's.
 */
const STAGE_LABEL: Record<string, { label: string; short: string }> = {
  buyout: { label: 'Buyout', short: 'Buyout' },
  coordination: { label: 'Coordination', short: 'Coordination' },
  preparation: { label: 'Shop drawings', short: 'Shop drawings' },
  review: { label: 'Review & approval', short: 'Review' },
  fabrication: { label: 'Fabrication', short: 'Fabrication' },
};
export type OwnerStage = { id: string; label: string; short: string; start: string; end: string };
export const OWNER_STAGES: OwnerStage[] = PLAN_STEP_GROUPS.filter((g) => g.id !== 'ros')
  .map((g) => {
    const steps = FOCAL_ITEM.steps.filter((s) => (g.families as readonly string[]).includes(s.family));
    const starts = steps.map((s) => s.startDate).sort();
    const ends = steps.map((s) => s.endDate).sort();
    return { id: g.id, ...STAGE_LABEL[g.id], start: starts[0], end: ends[ends.length - 1] };
  })
  .sort((a, b) => (a.start < b.start ? -1 : 1));
export const OWNER_ON_SITE = FOCAL_ITEM.requiredOnSiteDate;
export const OWNER_ITEM = 'Steel Windows & Doors';

/** Where a date falls along the five stages, 0 to 5: the stage's index plus its share of that stage. */
export function stagePosition(date: string): number {
  const t = Date.parse(date);
  const i = OWNER_STAGES.findIndex((s) => t <= Date.parse(s.end));
  if (i < 0) return OWNER_STAGES.length;
  const s = OWNER_STAGES[i];
  const span = Date.parse(s.end) - Date.parse(s.start);
  return i + Math.min(1, Math.max(0, span > 0 ? (t - Date.parse(s.start)) / span : 0));
}

const dependency = (id: string) => {
  const c = CONNECT_ITEM.commitments.find((x) => x.id === id);
  if (!c) throw new Error(`ownerScenes: no dependency ${id}`);
  return { id: c.id, name: c.name, owner: c.ownerRole as string, requiredBy: c.requiredBy, protects: c.requiredForStepName, at: stagePosition(c.requiredBy) };
};
/**
 * REDUCE RISK: Connect's design dependency. That it is unresolved, and the
 * words describing it, are an ILLUSTRATIVE condition for this visual; its
 * name, owner, date and the activity it protects are Connect's own.
 */
export const RISK = { ...dependency('swd-c1'), condition: 'Opening sizes not final' };
/**
 * PROTECT YOUR INVESTMENT: Connect's field-dimension dependency. The late
 * discovery and its consequences are an ILLUSTRATIVE scenario of what the
 * dependency exists to prevent; they are possibilities, never amounts.
 */
export const FIELD = {
  ...dependency('swd-x-field'),
  problem: 'Window dimensions don’t match the openings',
  consequences: ['Rework', 'Expedited replacement', 'Crew remobilization', 'Added coordination', 'Possible schedule delay'],
};

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

/** The order the requests pile up in before they are put in date order: deliberately not date order. */
export const REQUEST_PILE = [1, 3, 0, 2].filter((i) => i < OWNER_DECISIONS.length);

/** The closing line of each visual, exactly as supplied by the founder (2026-11-11). */
export const OWNER_TAKEAWAY: Record<OwnerTabId, string> = {
  'owner-reduce-risk': 'Find it early. Resolve it before it reaches the field.',
  'owner-protect-investment': 'Address problems early. Protect time and money.',
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
  /** Travels by (dx, dy) from where it is drawn. */
  move?: { at: number; dur: number; dx: number; dy: number };
};
export type OwnerScene = { tab: OwnerTabId; mode: OwnerMode; cues: Cue[]; end: number };
export type CueState = { o: number; ty: number; draw: number; mx: number; my: number };

const IN = 350;
const OUT = 350;

export function cueStateAt(c: Cue, t: number): CueState {
  const enter = ease((t - c.at) / (c.dur ?? IN));
  const leave = c.out === undefined ? 0 : ease((t - c.out) / (c.outDur ?? OUT));
  const stay = 1 - leave * (1 - (c.outTo ?? 0));
  const m = c.move ? ease((t - c.move.at) / c.move.dur) : 0;
  return {
    // A drawn line is fully opaque from its first moment; its length carries the entrance.
    o: (c.draw ? (t >= c.at ? 1 : 0) : enter) * stay,
    ty: (1 - enter) * (c.rise ?? 0),
    draw: c.draw ? enter : 1,
    mx: c.move ? c.move.dx * m : 0,
    my: c.move ? c.move.dy * m : 0,
  };
}
export const ownerStateAt = (scene: OwnerScene, t: number): Record<string, CueState> => Object.fromEntries(scene.cues.map((c) => [c.k, cueStateAt(c, t)]));

/* ------------------------------------------------------------ the layouts */

/** The five stages across the canvas, the Required On Site mark at their end. */
export function chainGeometry(mode: OwnerMode) {
  const d = mode === 'desktop';
  const x = d ? 20 : 10;
  const w = d ? 92 : 54;
  const gap = d ? 4 : 3;
  const y = d ? 156 : 100;
  const h = d ? 34 : 24;
  const pitch = w + gap;
  return {
    x,
    y,
    w,
    h,
    pitch,
    rosX: x + OWNER_STAGES.length * pitch + (d ? 22 : 14),
    /** The x of a position along the stages (see stagePosition). */
    at: (p: number) => {
      const q = Math.min(Math.max(p, 0), OWNER_STAGES.length);
      const i = Math.min(Math.floor(q), OWNER_STAGES.length - 1);
      return x + i * pitch + (q - i) * w;
    },
  };
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
  const cues: Cue[] = [
    { k: 'title', at: 0 },
    // 1. The field's requirement, and a schedule that looks on track.
    { k: 'ros', at: 300 },
    { k: 'onTrack', at: 900, out: 3700 },
    // 2. Backward through what it depends on, then the one thing not resolved.
    ...[...OWNER_STAGES].reverse().map((s, i): Cue => ({ k: `stage-${s.id}`, at: 1900 + i * 250, dur: 300 })),
    { k: 'depOpen', at: 3700, out: 10600 },
    { k: 'card', at: 3900, rise: 6 },
    { k: 'kUnresolved', at: 3900, out: 8200 },
    { k: 'condition', at: 4100, out: 8200 },
    // 3. What it could reach.
    { k: 'risk', at: 5600, dur: 900, draw: true, out: 10600 },
    { k: 'riskHalo', at: 5900, out: 10600 },
    { k: 'riskText', at: 6400, out: 10600 },
    // 4. Identified and assigned, while there is time.
    { k: 'kAssigned', at: 8400, out: 10600 },
    { k: 'assign', at: 8400, rise: 6 },
    // 5. Resolved before it reaches the field.
    { k: 'depDone', at: 10700 },
    { k: 'kResolved', at: 10900 },
    { k: 'takeaway', at: 11500, rise: 6 },
  ];
  return { tab: 'owner-reduce-risk', mode, cues, end: 12900 };
}

function investmentScene(mode: OwnerMode): OwnerScene {
  const cues: Cue[] = [
    { k: 'title', at: 0 },
    // 1. The plan.
    ...OWNER_STAGES.map((s, i): Cue => ({ k: `stage-${s.id}`, at: 300 + i * 150, dur: 300 })),
    { k: 'ros', at: 1200 },
    // 2. Without early planning: a problem found when the product arrives.
    { k: 'kLate', at: 2500, out: 7400 },
    { k: 'lateMark', at: 2700, out: 7400 },
    { k: 'lateCard', at: 2900, rise: 6, out: 7400 },
    // 3. What can follow from it.
    ...FIELD.consequences.map((_, i): Cue => ({ k: `cost-${i}`, at: 4400 + i * 230, rise: 5, out: 7400 })),
    { k: 'slip', at: 5800, out: 7400 },
    // 4. With early planning: verified before fabrication is released.
    { k: 'kPlanned', at: 7900 },
    { k: 'fieldMark', at: 8100 },
    { k: 'fieldCard', at: 8300, rise: 6 },
    // 5. Through fabrication and delivery, the field's date still in view.
    { k: 'proceed', at: 10300, dur: 1300, draw: true },
    { k: 'takeaway', at: 11900, rise: 6 },
  ];
  return { tab: 'owner-protect-investment', mode, cues, end: 13300 };
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
