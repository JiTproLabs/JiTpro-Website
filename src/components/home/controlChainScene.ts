/**
 * The Control tab's visual, as pure state (Design System Section 54.4.4,
 * 2026-11-11; recomposed the same day). PURE: no DOM, no React.
 *
 * ONE SCHEDULE. Control reads the same schedule Plan and Connect draw: the
 * featured chain, the fourteen other items, and Connect's six dependencies.
 * No chain, activity, date or duration is changed or authored here.
 *
 * WHAT IT ADDS: A DATE, AND ONE RULE. One fixed, illustrative Today
 * (CONTROL_TODAY) is laid across that schedule. Every activity's state is
 * DERIVED from its own planned dates against it (activityStateAt):
 *
 *   complete     planned to finish before today. The sample project is on
 *                plan, so finished work is shown as done; nothing is late.
 *   attention    under way today, and its hand-off is due within the
 *                look-ahead (LOOKAHEAD_WORKDAYS).
 *   in-progress  under way today, with its hand-off further out.
 *   scheduled    planned to start after today.
 *
 * WHY SOMETHING NEEDS ATTENTION TODAY. Two kinds of requirement do, and they
 * are drawn differently so neither reads as overdue:
 *
 *   activity     CURRENT WORK: under way now, with its hand-off due inside
 *                the look-ahead. Its bar shows the part already elapsed solid
 *                and the part still to run, up to its due date, open.
 *   commitment   A FUTURE COMMITMENT: one of Connect's dependencies whose
 *                required-by date falls inside the look-ahead. A diamond on
 *                its date, to the right of Today.
 *
 * Nothing in the sample is overdue. A requirement would be overdue only if
 * its required date were before today and it had not been provided; a
 * required date after today never makes anything overdue.
 *
 * THE STORY, on one clock (Sections 46.3, 54.4.4):
 *
 *   1. The chain        the featured chain, whole, with its summary.
 *   2. Today            a date line is drawn across it.
 *   3. Now, not yet     the camera moves in to today; the activity that needs
 *                       attention is marked, and two later ones as not yet.
 *   A. The schedule     the view opens out to a procurement schedule drawn
 *                       for this frame: representative chains on one
 *                       calendar, the same Today line across them. What
 *                       needs attention is then lit, one requirement at a
 *                       time.
 *   T. The transition   the other chains recede. Each requirement keeps its
 *                       mark, and gains its responsible party and its
 *                       required date.
 *   B. By party         those same marks, parties and dates move into a list
 *                       of priorities by responsible party, and rest.
 *
 * WHAT IT MAY NOT CLAIM. No activity is late, at risk or recovered. Nothing
 * depicts JiTpro directing outside parties; the list is what the general
 * contractor's team can communicate.
 */

import { CHAIN } from '../demo/screens/procurement-chain/chainLayout';
import type { ScheduleItem } from '../demo/screens/procurement-schedule/scheduleModel';
import { parse, workdaysBetween } from '../demo/screens/procurement-schedule/workCalendar';
import { CONNECT_ITEM } from './connectChainScene';
import {
  FOCAL_ITEM,
  HEADER,
  REVEAL_RAMP,
  ROW_ITEMS,
  SIDE_MIN_W,
  buildScale,
  chainView,
  ease,
  gridAt,
  headerAt,
  labelShiftsAt,
  lerp,
  lerpView,
  toScreen,
  viewInArea,
  type CameraView,
  type Frame,
  type PlanScene,
  type PlanState,
} from './planChainScene';

/* --------------------------------------------------------------- the data */

/**
 * The demonstration's Today: fixed and illustrative, never the visitor's
 * clock, so the visual reads the same on every visit. A Wednesday, on which
 * the featured chain's second revision cycle is under way.
 */
export const CONTROL_TODAY = '2026-11-18';
/**
 * The look-ahead: a hand-off due within this many working days of today needs
 * attention now. Three working weeks, the look-ahead a contractor's team
 * commonly plans against.
 */
export const LOOKAHEAD_WORKDAYS = 15;

type Step = ScheduleItem['steps'][number];

export type ActivityState = 'complete' | 'attention' | 'in-progress' | 'scheduled';

/** Working days from one date forward to another (0 on the same day). */
export const workdaysUntil = (from: string, to: string) => workdaysBetween(parse(from), parse(to)) - 1;

/** An activity's state on a date, from its own planned dates (see the header). */
export function activityStateAt(step: Pick<Step, 'startDate' | 'endDate'>, today: string): ActivityState {
  if (step.endDate < today) return 'complete';
  if (step.startDate > today) return 'scheduled';
  return workdaysUntil(today, step.endDate) <= LOOKAHEAD_WORKDAYS ? 'attention' : 'in-progress';
}

/** A dependency needs attention when it is still to come and required within the look-ahead. */
export const commitmentDueAt = (requiredBy: string, today: string) => requiredBy >= today && workdaysUntil(today, requiredBy) <= LOOKAHEAD_WORKDAYS;

/**
 * Who a requirement is communicated to. The schedule names organizations;
 * these are the kinds of party a general contractor coordinates. The schedule
 * data does not separate subcontractors from vendors, so they are one group.
 */
export type PartyGroup = 'owner' | 'architect' | 'consultants' | 'vendors' | 'gc' | 'agencies';
export const PARTY_ORDER: readonly PartyGroup[] = ['owner', 'architect', 'consultants', 'vendors', 'gc', 'agencies'];
export const PARTY_LABEL: Readonly<Record<PartyGroup, string>> = {
  owner: 'Owner',
  architect: 'Architect',
  consultants: 'Consultants',
  vendors: 'Subcontractors & Vendors',
  gc: 'General Contractor',
  agencies: 'Agencies',
};
/** The same, where the frame is narrow. */
export const PARTY_LABEL_SHORT: Readonly<Record<PartyGroup, string>> = { ...PARTY_LABEL, vendors: 'Subs & Vendors' };
/** The design team's consultants. Every other organization not named here is a subcontractor, fabricator or supplier. */
const PARTY_OF: Readonly<Record<string, PartyGroup>> = {
  owner: 'owner',
  architect: 'architect',
  gc: 'gc',
  authority: 'agencies',
  structural: 'consultants',
  mechanical: 'consultants',
  electrical: 'consultants',
  lighting: 'consultants',
  interiors: 'consultants',
  vertical: 'consultants',
};
export const partyOf = (orgId: string): PartyGroup => PARTY_OF[orgId] ?? 'vendors';

/** An item's name without the words every item shares. */
export const shortItemName = (name: string) => name.replace(/^Custom /, '').replace(/ Package$/, '').replace(' and ', ' & ');

/** One requirement as the list states it. */
export type Requirement = {
  /** The activity's step id, or the dependency's id. */
  id: string;
  /** Current work under way, or a commitment that falls due (see the header). */
  kind: 'activity' | 'commitment';
  itemId: string;
  activity: string;
  org: string;
  party: PartyGroup;
  /** The day it is required: the activity's hand-off, or the dependency's required-by date. */
  date: string;
  /** What it lets begin: the next activity of its chain, or the activity the dependency is for. */
  protects: string;
};

const byDate = (a: { date: string }, b: { date: string }) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

/** Every activity that needs attention on a date, soonest hand-off first. */
export function prioritiesAt(items: readonly ScheduleItem[], today: string): Requirement[] {
  return items
    .flatMap((item) =>
      item.steps
        .filter((s) => s.kind === 'phase' && activityStateAt(s, today) === 'attention')
        .map((step): Requirement => {
          const after = item.steps.slice(item.steps.indexOf(step) + 1).find((s) => s.kind === 'phase');
          return {
            id: step.id,
            kind: 'activity',
            itemId: item.id,
            activity: step.name,
            org: step.responsibleOrganization,
            party: partyOf(step.responsibleOrganizationId),
            date: step.endDate,
            protects: after ? after.name : 'Required On Site',
          };
        }),
    )
    .sort(byDate);
}

/** Connect's dependencies on the featured chain that fall due within the look-ahead (Section 54.4.3). */
export function commitmentsDueAt(today: string): Requirement[] {
  return CONNECT_ITEM.commitments
    .filter((c) => commitmentDueAt(c.requiredBy, today))
    .map(
      (c): Requirement => ({
        id: c.id,
        kind: 'commitment',
        itemId: FOCAL_ITEM.id,
        activity: c.name,
        org: c.ownerRole,
        // Connect's own additions are owed by the general contractor with its subcontractor.
        party: c.ownerOrganizationId === 'gc' ? 'gc' : partyOf(c.ownerOrganizationId),
        date: c.requiredBy,
        protects: c.requiredForStepName,
      }),
    )
    .sort(byDate);
}

/** Everything that needs attention on a date: current work and commitments falling due, soonest first. */
export const requirementsAt = (items: readonly ScheduleItem[], today: string): Requirement[] => [...prioritiesAt(items, today), ...commitmentsDueAt(today)].sort(byDate);

/** The parties with nothing required now, each with the next activity it is responsible for. */
export function idlePartiesAt(items: readonly ScheduleItem[], today: string, busy: readonly PartyGroup[]) {
  const shown: PartyGroup[] = ['owner', 'architect', 'consultants', 'vendors', 'gc'];
  return shown
    .filter((p) => !busy.includes(p))
    .map((party) => {
      const next = items
        .flatMap((item) => item.steps.filter((s) => s.kind === 'phase' && s.startDate > today && partyOf(s.responsibleOrganizationId) === party))
        .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0))[0];
      return { party, next: next ? { activity: next.name, date: next.startDate } : null };
    });
}

/* ------------------------------------------------------------- the board */

/**
 * THE BOARD (recomposed 2026-11-11). Stages A, T and B are drawn for the
 * frame, not scaled down from the application screen: a schedule of
 * representative chains, then the list of priorities. Two designs, each on
 * its own canvas (px at scale 1) and scaled to the frame as one: a desktop
 * frame (560 x 350), and a narrow one (340 x 212) with fewer chains and
 * fewer priorities rather than smaller type.
 *
 * THE CHAINS SHOWN are a presentation choice, never a change to the data:
 * every chain with a requirement due is shown, so no priority names work the
 * reader has not seen; the others show different stages on the same date
 * (long fabrication under way, a review just begun, a chain not yet started).
 * The board says how many of the project's items it shows.
 */
export const BOARD_NAME: Readonly<Record<string, string>> = {
  'itm-steel': 'Structural Steel',
  'itm-framing': 'Lumber & Framing',
  'itm-switchgear': 'Electrical Switchgear',
  'itm-stone': 'Exterior Stone',
  'itm-hvac': 'HVAC Equipment',
  'chain-steel-windows': 'Steel Windows & Doors',
  'itm-casework': 'Cabinetry & Casework',
};
export const BOARD = {
  desktop: {
    w: 560,
    h: 350,
    padL: 16,
    titleH: 40,
    yearH: 13,
    monthH: 17,
    rowH: 36,
    nameW: 178,
    right: 546,
    barH: 12,
    attentionH: 18,
    lane: 9,
    items: ['itm-steel', 'itm-framing', 'itm-switchgear', 'itm-stone', 'itm-hvac', 'chain-steel-windows', 'itm-casework'],
    window: ['2026-09-01', '2027-12-01'],
    /** How many priorities the list shows. */
    listed: 8,
    /** The list: the column header's height, a row's height, and where the action column starts. */
    listHead: 22,
    listRow: 45,
    actionX: 172,
  },
  phone: {
    w: 340,
    h: 212,
    padL: 10,
    titleH: 28,
    yearH: 11,
    monthH: 15,
    rowH: 26,
    nameW: 126,
    right: 332,
    barH: 10,
    attentionH: 14,
    lane: 7,
    items: ['itm-steel', 'itm-framing', 'itm-stone', 'itm-hvac', 'chain-steel-windows'],
    window: ['2026-09-01', '2027-07-01'],
    listed: 3,
    listHead: 2,
    listRow: 50,
    actionX: 10,
  },
} as const;
export type BoardMode = keyof typeof BOARD;

type Box = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };

export type BoardBar = { id: string; x: number; w: number; state: ActivityState };
export type BoardRow = {
  id: string;
  name: string;
  /** Where it stands today: its current activity, or when it starts. */
  status: string;
  y: number;
  cy: number;
  /** It carries a requirement that needs attention. */
  priority: boolean;
  /** Its name gives way in the transition (it carries two requirements, each with its own party). */
  nameYields: boolean;
  bars: BoardBar[];
  /** Required On Site, where it falls inside the window: its x and, where there is room, its date. */
  ros: { x: number; label: string | null } | null;
};
/** A mark for something needing attention: current work (elapsed solid, remainder open) or a commitment's diamond. */
export type BoardMark = {
  id: string;
  kind: Requirement['kind'];
  row: number;
  /** activity: the whole bar, and where today divides it. commitment: the diamond's box. */
  box: Box;
  split: number;
};
/** A requirement the list shows, with its place in the schedule (A), in the transition (T) and in the list (B). */
export type BoardEntry = {
  req: Requirement;
  mark: number;
  party: string;
  action: string;
  detail: string;
  date: string;
  due: string;
  /** T: the connector from the mark to the date, the date's and the party's places. */
  leader: string;
  dateT: Pt;
  partyT: Pt;
  /** B: the amber rule the mark becomes, and the places of the date, the party (null where its group already shows it), the action and its detail. */
  rule: Box;
  dateB: Pt;
  partyB: Pt | null;
  actionB: Pt;
  detailB: Pt;
  dueB: Pt;
  /** The row's foot in the list, and whether it closes its party's group. */
  lineY: number;
  groupEnd: boolean;
};
export type BoardLayout = {
  mode: BoardMode;
  w: number;
  h: number;
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  /** Design px per calendar day. */
  pxPerDay: number;
  todayX: number;
  years: { x0: number; x1: number; label: string }[];
  months: { x: number; label: string; year: boolean }[];
  rows: BoardRow[];
  marks: BoardMark[];
  entries: BoardEntry[];
  focalRow: number;
  /** How many of the project's items the schedule shows, of how many. */
  shown: { items: number; of: number };
  /** B: the parties with nothing required now (desktop), and how many requirements are not listed (narrow). */
  idle: { y: number; party: string; text: string; next: string }[];
  more: { y: number; text: string } | null;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Month and day, as a contractor says them; and with the year. */
export const shortDay = (d: string) => `${MONTHS[parse(d).getUTCMonth()]} ${parse(d).getUTCDate()}`;
export const fullDay = (d: string) => `${shortDay(d)}, ${parse(d).getUTCFullYear()}`;
const DAY = 86400000;

export function buildBoard(mode: BoardMode, today: string, requirements: readonly Requirement[]): BoardLayout {
  const B = BOARD[mode];
  const desktop = mode === 'desktop';
  const x0 = B.nameW;
  const x1 = B.right;
  const t0 = parse(B.window[0]).getTime();
  const t1 = parse(B.window[1]).getTime();
  const pxPerDay = ((x1 - x0) * DAY) / (t1 - t0);
  /** The start of a day, in design px. */
  const X = (d: string, days = 0) => x0 + ((parse(d).getTime() - t0) / DAY + days) * pxPerDay;
  const top = B.titleH + B.yearH + B.monthH;
  const items = B.items.map((id) => ROW_ITEMS.find((i) => i.id === id)!);
  const bottom = top + items.length * B.rowH;
  const todayX = Math.round(X(today, 0.5));

  /* The calendar: a row of years over a row of months. */
  const months: BoardLayout['months'] = [];
  const years: BoardLayout['years'] = [];
  for (let d = new Date(t0); d.getTime() < t1; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) {
    const x = Math.round(x0 + ((d.getTime() - t0) / DAY) * pxPerDay);
    const year = d.getUTCMonth() === 0;
    months.push({ x, label: MONTHS[d.getUTCMonth()], year });
    if (year || years.length === 0) {
      if (years.length) years[years.length - 1].x1 = x;
      years.push({ x0: x, x1, label: String(d.getUTCFullYear()) });
    }
  }

  const shownReqs = requirements.filter((r) => B.items.includes(r.itemId as never));
  /* The list: the soonest requirements. */
  const listed = shownReqs.slice(0, B.listed);
  const rows: BoardRow[] = items.map((item, i) => {
    const y = top + i * B.rowH;
    const mine = shownReqs.filter((r) => r.itemId === item.id);
    const mineListed = listed.filter((r) => r.itemId === item.id).length;
    const current = item.steps.find((s) => s.kind === 'phase' && s.startDate <= today && today <= s.endDate);
    const bars: BoardBar[] = item.steps
      .filter((s) => s.kind === 'phase' && X(s.endDate, 1) > x0 && X(s.startDate) < x1)
      .map((s) => {
        const a = Math.max(x0, X(s.startDate));
        const b = Math.min(x1, X(s.endDate, 1));
        const state = activityStateAt(s, today);
        // A hairline between neighbours; a requirement's bar is never too small to see.
        return { id: s.id, x: a, w: Math.min(x1 - a, Math.max(state === 'attention' ? 8 : 2, b - a - 1.5)), state };
      });
    const rosX = X(item.requiredOnSiteDate, 0.5);
    const label = shortDay(item.requiredOnSiteDate);
    return {
      id: item.id,
      name: BOARD_NAME[item.id] ?? shortItemName(item.name),
      status: current ? current.name : `Starts ${shortDay(item.startDate)}`,
      y,
      cy: y + B.rowH / 2,
      priority: mine.length > 0,
      // Beside the name there is a second line only on a desktop frame; without one, the party takes the name's place.
      nameYields: desktop ? mineListed > 1 : mineListed > 0,
      bars,
      ros: rosX <= x1 - 5 ? { x: rosX, label: desktop && rosX + 10 + label.length * 5.4 <= x1 ? label : null } : null,
    };
  });

  /* The marks: every requirement on a chain that is shown. */
  const marks: BoardMark[] = shownReqs.map((r) => {
    const row = rows.findIndex((w) => w.id === r.itemId);
    const cy = rows[row].cy;
    if (r.kind === 'commitment') {
      const x = X(r.date, 0.5);
      return { id: r.id, kind: r.kind, row, box: { x: x - 4.5, y: cy - 4.5, w: 9, h: 9 }, split: x };
    }
    const bar = rows[row].bars.find((b) => b.id === r.id)!;
    return { id: r.id, kind: r.kind, row, box: { x: bar.x, y: cy - B.attentionH / 2, w: bar.w, h: B.attentionH }, split: Math.min(bar.x + bar.w, Math.max(bar.x, X(today, 1))) };
  });

  /* Grouped by party, in order of each party's soonest date. */
  const parties = [...new Set(listed.map((r) => r.party))];
  const ordered = parties.flatMap((p) => listed.filter((r) => r.party === p));
  const listTop = B.titleH + B.listHead;
  const labels = desktop ? PARTY_LABEL : PARTY_LABEL_SHORT;
  const entries: BoardEntry[] = ordered.map((req, i) => {
    const mark = marks.findIndex((m) => m.id === req.id);
    const m = marks[mark];
    const row = rows[m.row];
    const siblings = listed.filter((r) => r.itemId === req.itemId).sort(byDate);
    // Two requirements on one chain each take their own lane, above and below the bar.
    const lane = siblings.length > 1 ? (siblings.indexOf(req) === 0 ? -B.lane : B.lane) : 0;
    const laneY = row.cy + lane;
    const dateX = x1;
    const leaderEnd = x1 - (desktop ? 50 : 44);
    const leader =
      lane === 0
        ? `M${m.box.x + m.box.w + 3} ${laneY}H${leaderEnd}`
        : m.kind === 'commitment'
          ? `M${m.split} ${row.cy + (lane < 0 ? -6 : 6)}V${laneY}H${leaderEnd}`
          : `M${m.box.x + m.box.w - 1} ${laneY}H${leaderEnd}`;
    const yT = listTop + i * B.listRow;
    const first = ordered.findIndex((r) => r.party === req.party) === i;
    const last = i === ordered.length - 1 || ordered[i + 1].party !== req.party;
    const days = workdaysUntil(today, req.date);
    const item = BOARD_NAME[req.itemId] ?? req.itemId;
    return {
      req,
      mark,
      party: labels[req.party],
      action: req.activity,
      detail: desktop ? `${item} · protects ${req.protects}` : `Protects ${req.protects}`,
      date: shortDay(req.date),
      due: `${days} working day${days === 1 ? '' : 's'}`,
      leader,
      dateT: { x: dateX, y: laneY + 4 },
      partyT: { x: B.padL, y: lane === 0 ? row.cy + (desktop ? 11.5 : 4) : laneY + 3.5 },
      rule: desktop ? { x: B.actionX, y: yT + 7.5, w: 4, h: 30 } : { x: B.actionX, y: yT + 8, w: 3, h: 34 },
      dateB: { x: dateX, y: yT + (desktop ? 20 : 29) },
      dueB: { x: dateX, y: yT + (desktop ? 33 : 42) },
      partyB: desktop ? (first ? { x: B.padL, y: yT + 20 } : null) : { x: B.actionX + 10, y: yT + 14 },
      actionB: { x: B.actionX + (desktop ? 14 : 10), y: yT + (desktop ? 20 : 29) },
      detailB: { x: B.actionX + (desktop ? 14 : 10), y: yT + (desktop ? 34 : 42) },
      lineY: yT + B.listRow,
      groupEnd: last,
    };
  });

  const listBottom = listTop + entries.length * B.listRow;
  const idle = desktop
    ? idlePartiesAt(ROW_ITEMS, today, parties).map((p, i) => ({
        y: listBottom + 18 + i * 30,
        party: PARTY_LABEL[p.party],
        text: 'Nothing required now',
        next: `Next: ${p.next ? `${p.next.activity}, ${fullDay(p.next.date)}` : 'none scheduled'}`,
      }))
    : [];
  const unlisted = requirements.length - entries.length;
  const more = !desktop && unlisted > 0 ? { y: listBottom + 17, text: `${unlisted} more required by ${shortDay(requirements[requirements.length - 1].date)}` } : null;

  return {
    mode,
    w: B.w,
    h: B.h,
    x0,
    x1,
    top,
    bottom,
    pxPerDay,
    todayX,
    years,
    months,
    rows,
    marks,
    entries,
    focalRow: rows.findIndex((r) => r.id === FOCAL_ITEM.id),
    shown: { items: items.length, of: ROW_ITEMS.length },
    idle,
    more,
  };
}

/* -------------------------------------------------------------- the scene */

export const CONTROL_TIMING = {
  /** The whole chain, before anything is added. */
  START_HOLD: 1000,
  /** The Today line is drawn downward; its label follows; then earlier work is subdued. */
  TODAY_DRAW: 500,
  TODAY_LABEL_AFTER: 300,
  LABEL: 300,
  DONE_AFTER: 500,
  DONE: 400,
  TODAY_HOLD: 1100,
  /** In to today. */
  ZOOM_IN: 1600,
  /** The activity needing attention: its mark, then its annotation. */
  NOW_AFTER: 200,
  MARK: 350,
  TAG: 350,
  /** The two later activities, one after the other. */
  NOT_YET_AFTER: 1300,
  NOT_YET_STAGGER: 280,
  FOCUS_HOLD: 1500,
  TAG_OUT: 300,
  /** A. Out to the schedule; held; each requirement lit in turn; held. */
  ZOOM_OUT: 2200,
  SCHEDULE_HOLD: 900,
  LIT_STAGGER: 220,
  LIT: 350,
  PRIORITY_HOLD: 1300,
  /** T. The other chains recede; each requirement gains its party and its date; held. */
  RECEDE: 600,
  LINK_AFTER: 300,
  LINK_STAGGER: 180,
  LINK: 450,
  LINK_HOLD: 1500,
  /** B. The marks, parties and dates move into the list; each row's wording follows. */
  MOVE: 1100,
  DETAIL_AT: 0.7,
  DETAIL_STAGGER: 150,
  DETAIL: 350,
  IDLE: 350,
  /** An annotation's rise as it fades in, frame px. */
  TAG_RISE: 6,
} as const;

/** How far across the frame the camera holds today, close up. */
const TODAY_FRAC = 0.3;
/** The chain is framed a little low close up, leaving room above the bar for the annotations. */
const CLOSE_DROP = 6;
/** How strongly finished work is subdued close up (the wash's opacity). */
export const WASH = { done: 0.5 } as const;
/** The close-up mark's outset around its activity, frame px. */
const MARK_OUTSET = 2;
/**
 * An annotation stands on a stem whose foot rests just above its activity.
 * The stems differ, so what to work on now sits on an upper tier and what is
 * not yet on a lower one, and neighbouring annotations never collide.
 */
export const TAG = { foot: 4, stem: { now: 30, notYet: 8 } } as const;
/** A long activity's annotation sits this far in from its start, scene px, not at its far-off centre. */
const LONG_TAG_INSET = 96;
const LONG_SPAN = 400;
/** How far the other chains recede in the transition, and a priority chain's own other activities. */
export const RECEDED = { others: 0.16, own: 0.3 } as const;

export type ControlTag = { id: string; kind: 'now' | 'notYet'; text: string; x: number; top: number; at: number };
export const CONTROL_TAG_TEXT = { now: 'Work on this now', notYet: 'Not yet' } as const;

export type ControlScene = {
  today: string;
  /** The date line's x on the featured chain, in scene px: the middle of its day. */
  todayX: number;
  /** Everything that needs attention today, soonest first. */
  requirements: Requirement[];
  /** The featured chain's activity that needs attention: its bar, in scene px. */
  focalMark: { id: string; x0: number; x1: number; top: number; bottom: number };
  tags: ControlTag[];
  /** The featured bar's vertical centre, scene px. */
  barCy: number;
  boards: Record<BoardMode, BoardLayout>;
  times: { today: number; zoomIn: number; close: number; now: number; notYet: number; zoomOut: number; schedule: number; lit: number; recede: number; link: number; move: number; detail: number; end: number };
};

export function buildControlScene(scene: PlanScene, today: string = CONTROL_TODAY): ControlScene {
  const T = CONTROL_TIMING;
  const L = scene.focal.layout;
  const day = Math.round((parse(today).getTime() - parse(L.domainStart).getTime()) / DAY);
  const todayX = CHAIN.PAD_L + day * L.pxPerDay + L.pxPerDay / 2;

  const requirements = requirementsAt(ROW_ITEMS, today);
  const boards = { desktop: buildBoard('desktop', today, requirements), phone: buildBoard('phone', today, requirements) };
  const most = Math.max(boards.desktop.marks.length, boards.phone.marks.length);
  const listed = Math.max(boards.desktop.entries.length, boards.phone.entries.length);

  const zoomIn = T.START_HOLD + T.TODAY_DRAW + T.TODAY_HOLD;
  const close = zoomIn + T.ZOOM_IN;
  const now = close + T.NOW_AFTER;
  const notYet = now + T.NOT_YET_AFTER;
  const zoomOut = notYet + T.NOT_YET_STAGGER + T.TAG + T.FOCUS_HOLD;
  const schedule = zoomOut + T.ZOOM_OUT;
  const lit = schedule + T.SCHEDULE_HOLD;
  const recede = lit + (most - 1) * T.LIT_STAGGER + T.LIT + T.PRIORITY_HOLD;
  const link = recede + T.LINK_AFTER;
  const move = link + (listed - 1) * T.LINK_STAGGER + T.LINK + T.LINK_HOLD;
  const detail = move + T.MOVE * T.DETAIL_AT;
  const end = detail + (listed - 1) * T.DETAIL_STAGGER + T.DETAIL + T.IDLE;

  const focalReq = requirements.find((r) => r.kind === 'activity' && r.itemId === FOCAL_ITEM.id);
  if (!focalReq) throw new Error('controlChainScene: the featured chain has no activity needing attention on this date');
  const seg = L.segments.find((s) => s.step.id === focalReq.id)!;
  const barTop = scene.focal.dy + L.barTop;
  const tagX = (a: number, b: number) => (b - a > LONG_SPAN ? a + LONG_TAG_INSET : (a + b) / 2);
  const tags: ControlTag[] = [
    { id: seg.step.id, kind: 'now', text: CONTROL_TAG_TEXT.now, x: tagX(seg.x0, seg.x1), top: barTop, at: now + T.MARK / 2 },
    ...L.segments
      .filter((s) => s.step.kind === 'phase' && activityStateAt(s.step, today) === 'scheduled')
      .slice(0, 2)
      .map((s, i): ControlTag => ({ id: s.step.id, kind: 'notYet', text: CONTROL_TAG_TEXT.notYet, x: tagX(s.x0, s.x1), top: barTop, at: notYet + i * T.NOT_YET_STAGGER })),
  ];

  return {
    today,
    todayX,
    requirements,
    focalMark: { id: seg.step.id, x0: seg.x0, x1: seg.x1, top: barTop, bottom: scene.focal.dy + L.barBottom },
    tags,
    barCy: scene.focal.dy + (L.barTop + L.barBottom) / 2,
    boards,
    times: { today: T.START_HOLD, zoomIn, close, now, notYet, zoomOut, schedule, lit, recede, link, move, detail, end },
  };
}

/* -------------------------------------------------------------- the state */

export type BoardState = {
  mode: BoardMode;
  /** The board's scale in the frame. */
  s: number;
  /** Shown at all (it is not, before the view opens out). */
  on: boolean;
  /**
   * THE OPENING OUT, in design px: where today is, how much wider than drawn
   * the calendar is, how far down the whole schedule sits, and the calendar's
   * left edge. At rest: the layout's todayX, 1, 0 and x0.
   */
  todayX: number;
  zoomX: number;
  dy: number;
  clipX: number;
  /** The featured row's bars; the other rows and everything around them. */
  focal: number;
  rest: number;
  /** Each mark, lit. */
  lit: number[];
  /** T: the other chains recede; each listed requirement's connector, date and party. */
  recede: number;
  link: number[];
  /** B: the move into the list, 0 to 1; each row's wording; the parties with nothing required. */
  move: number;
  detail: number[];
  idle: number;
};

export type ControlState = PlanState & {
  /** The chain's own drawing (the canvas and its timescale header): it gives way to the board. */
  chain: number;
  /** The close-up date line, in frame px: its x, its extent, how much of it is drawn, its label, and its opacity. */
  today: { x: number; top: number; bottom: number; draw: number; label: number; o: number };
  /** The wash over work before today, close up. */
  wash: { box: Box; o: number };
  /** The featured activity's ring, close up. */
  mark: Box & { o: number };
  /** Each annotation: the point its foot rests on, in frame px, and its opacity and entrance. */
  tags: { x: number; y: number; o: number; in: number }[];
  board: BoardState;
};

/** The frame Control draws in: no step list, so the chain's area is the whole frame. */
export const controlFrame = (f: Frame): Frame => ({ w: f.w, h: f.h, list: false });

/** The board's design for a frame, and its scale. */
export const boardModeOf = (f: Frame): BoardMode => (f.w < SIDE_MIN_W ? 'phone' : 'desktop');
export const boardScale = (f: Frame, b: BoardLayout) => Math.min(f.w / b.w, f.h / b.h);

/** The two views of the chain: whole, and today close up. */
export function controlViews(scene: PlanScene, c: ControlScene, f: Frame) {
  const sB = buildScale(f);
  return {
    whole: toScreen(scene, chainView(scene, f)),
    close: toScreen(scene, viewInArea(f, c.todayX, TODAY_FRAC, sB, c.barCy - CLOSE_DROP / sB)),
  };
}

const frameX = (scene: PlanScene, f: Frame, v: CameraView, x: number) => f.w / 2 + v.scale * (scene.place.ox + scene.place.k * x - v.cx);
const frameY = (scene: PlanScene, f: Frame, v: CameraView, y: number) => f.h / 2 + v.scale * (scene.place.oy + scene.place.k * y - v.cy);

/**
 * As lerpView, but the screen point showing today on the featured bar travels
 * in a straight line, so the date line moves evenly on screen through a large
 * zoom and never swings. Same endpoints, scale path and easing.
 */
function lerpViewOnToday(scene: PlanScene, c: ControlScene, f: Frame, a: CameraView, b: CameraView, u: number): CameraView {
  if (u <= 0) return a;
  if (u >= 1) return b;
  const v = lerpView(a, b, u);
  const ax = scene.place.ox + scene.place.k * c.todayX;
  const ay = scene.place.oy + scene.place.k * c.barCy;
  const sx = (w: CameraView) => f.w / 2 + w.scale * (ax - w.cx);
  const sy = (w: CameraView) => f.h / 2 + w.scale * (ay - w.cy);
  return { scale: v.scale, cx: ax - (lerp(sx(a), sx(b), u) - f.w / 2) / v.scale, cy: ay - (lerp(sy(a), sy(b), u) - f.h / 2) / v.scale };
}

/** A box part-way between two (the mark becoming its rule). */
export const morphBox = (a: Box, b: Box, u: number): Box => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
export const morphPt = (a: Pt, b: Pt, u: number): Pt => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) });

export function controlStateAt(scene: PlanScene, c: ControlScene, frame: Frame, t: number): ControlState {
  const f = controlFrame(frame);
  const T = CONTROL_TIMING;
  const X = c.times;
  const views = controlViews(scene, c, f);

  /* The chain's camera: whole, in to today, and there it stays while the board opens out over it. */
  let view: CameraView;
  let summary = 0;
  if (t < X.zoomIn) {
    view = views.whole;
    summary = 1;
  } else if (t < X.close) {
    const u = ease((t - X.zoomIn) / T.ZOOM_IN);
    view = lerpViewOnToday(scene, c, f, views.whole, views.close, u);
    summary = 1 - ease(u / 0.3);
  } else {
    view = views.close;
  }
  const out = ease((t - X.zoomOut) / T.ZOOM_OUT);
  const chain = 1 - ease(out / 0.35);

  const closeX = frameX(scene, f, view, c.todayX);
  const draw = ease((t - X.today) / T.TODAY_DRAW);
  const done = ease((t - X.today - T.DONE_AFTER) / T.DONE);

  const m = c.focalMark;
  const mx0 = frameX(scene, f, view, m.x0);
  const mx1 = frameX(scene, f, view, m.x1);
  const my0 = frameY(scene, f, view, m.top);
  const my1 = frameY(scene, f, view, m.bottom);

  const tagsOut = 1 - ease((t - X.zoomOut) / T.TAG_OUT);
  const tags = c.tags.map((g) => {
    const enter = ease((t - g.at) / T.TAG);
    return { x: frameX(scene, f, view, g.x), y: frameY(scene, f, view, g.top) - TAG.foot, o: enter * tagsOut, in: enter };
  });

  /* THE BOARD. It opens out from the close-up: at first its calendar is as
     wide as the chain's, with today and the featured row exactly where the
     close-up has them; it eases to its own layout. */
  const mode = boardModeOf(f);
  const b = c.boards[mode];
  const s = boardScale(f, b);
  const closePxPerDay = buildScale(f) * scene.focal.layout.pxPerDay;
  const zoom0 = closePxPerDay / (b.pxPerDay * s);
  const closeView = views.close;
  const today0 = frameX(scene, f, closeView, c.todayX) / s;
  const dy0 = frameY(scene, f, closeView, c.barCy) / s - b.rows[b.focalRow].cy;
  const moveU = ease((t - X.move) / T.MOVE);

  const board: BoardState = {
    mode,
    s,
    on: t > X.zoomOut,
    todayX: lerp(today0, b.todayX, out),
    zoomX: Math.exp(lerp(Math.log(zoom0), 0, out)),
    dy: lerp(dy0, 0, out),
    clipX: lerp(0, b.x0, out),
    focal: ease(out / 0.3),
    rest: ease((out - 0.3) / 0.6),
    lit: b.marks.map((_, i) => ease((t - X.lit - i * T.LIT_STAGGER) / T.LIT)),
    recede: ease((t - X.recede) / T.RECEDE),
    link: b.entries.map((_, i) => ease((t - X.link - i * T.LINK_STAGGER) / T.LINK)),
    move: moveU,
    detail: b.entries.map((_, i) => ease((t - X.detail - i * T.DETAIL_STAGGER) / T.DETAIL)),
    idle: ease((t - X.detail - b.entries.length * T.DETAIL_STAGGER) / T.IDLE),
  };

  return {
    view,
    edgeX: scene.steps[scene.steps.length - 1].to - 2 * REVEAL_RAMP,
    ros: 1,
    others: 0,
    summary,
    focalAxis: chain,
    app: 0,
    list: { appear: scene.list.map(() => 0), active: scene.list.map(() => 0), morph: 0 },
    grid: gridAt(scene, view, chain),
    header: headerAt(scene, f, view, chain),
    labelShift: labelShiftsAt(scene, f, view),
    chain,
    today: { x: closeX, top: HEADER.h, bottom: f.h, draw, label: ease((t - X.today - T.TODAY_LABEL_AFTER) / T.LABEL), o: 1 - ease(out / 0.3) },
    wash: { box: { x: 0, y: HEADER.h, w: Math.max(0, closeX), h: f.h - HEADER.h }, o: WASH.done * done * chain },
    mark: {
      x: mx0 - MARK_OUTSET,
      y: my0 - MARK_OUTSET,
      w: mx1 - mx0 + 2 * MARK_OUTSET,
      h: my1 - my0 + 2 * MARK_OUTSET,
      o: ease((t - X.now) / T.MARK) * chain,
    },
    tags,
    board,
  };
}
