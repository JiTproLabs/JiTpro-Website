/**
 * HOMEPAGE STEP 02 LAYOUT (Design System Section 53.1.2). PURE: no DOM, no
 * React.
 *
 * Joins the four construction activities to their homepage register rows and
 * returns every coordinate the figure draws, on the fixed 1280 x 388 canvas.
 * Every horizontal position in the schedule view is a function of a date on
 * one calendar-day scale; nothing is positioned by hand, and no date is
 * computed or adjusted here.
 */

import { FIELD_ACTIVITIES, type FieldActivity } from './homeScheduleData';
import { HOME_CANVAS, HOME_ROWS, type HomeRegisterRow } from '../home-register/homeRegisterData';
import { parse } from '../procurement-schedule/workCalendar';

export const CANVAS = { w: 1280, h: 388 } as const;

export const G = {
  TITLE_H: 56,
  HEADER_H: 44,
  /** The header's two timescale tiers: years, then months. */
  YEAR_H: 22,
  ROW_H: 72,
  /** Schedule columns. */
  COL_ACTIVITY: 24,
  COL_START: 348,
  COL_DURATION: 468,
  /** The timeline. */
  TL_X0: 600,
  TL_X1: 1256,
  BAR_H: 22,
  /** Bar centre line, from the row top. */
  BAR_CY: 44,
  /** Marker: diamond across, standard and emphasised (the chain's 1.35x). */
  DIAMOND: 16,
  DIAMOND_EMPH: 22,
  /** Gap from the diamond's centre to its date label. */
  LABEL_DX: 16,
} as const;

/**
 * THE FRAME (Section 53.1.2, revised 2026-11-07). Step 02 ends on the very
 * Step 01 register canvas, so the figure reserves that canvas's size for the
 * whole pass and the page never changes height. The schedule is its own
 * 1280 x 388 card at the top of the frame, directly under the step's copy,
 * so it is read first; the register then fills the frame.
 */
export const FRAME = HOME_CANVAS;
export const GANTT_TOP = 0;

/** The register rows whose dates Step 02 establishes: one per activity. */
export const ESTABLISHED_PRODUCT_IDS: ReadonlySet<string> = new Set(FIELD_ACTIVITIES.map((a) => a.productId));

/** Feb 2027 through May 2028 inclusive: the domain is whole months (cf. Section 51.3). */
export const DOMAIN = { start: '2027-02-01', end: '2028-06-01' } as const;

const DAY = 86_400_000;
const daysFromStart = (isoDate: string) => Math.round((parse(isoDate).getTime() - parse(DOMAIN.start).getTime()) / DAY);

export const DOMAIN_DAYS = daysFromStart(DOMAIN.end);
export const PX_PER_DAY = (G.TL_X1 - G.TL_X0) / DOMAIN_DAYS;

/** The start of a date's day slot. */
export const xOf = (isoDate: string) => G.TL_X0 + daysFromStart(isoDate) * PX_PER_DAY;
/** The end of a date's day slot: where an instant at the end of that date sits. */
export const xEndOf = (isoDate: string) => xOf(isoDate) + PX_PER_DAY;

export const ROWS_TOP = G.TITLE_H + G.HEADER_H;

export type RoSDRow = {
  activity: FieldActivity;
  product: HomeRegisterRow;
  emphasis: boolean;
  top: number;
  /** Schedule view. */
  bar: { x0: number; x1: number; y: number };
  /**
   * The marker in the schedule view, in the schedule card's coordinates: the
   * end of the RoSD's date, on the bar's centre line. Where it lands is the
   * register's own date cell, measured from the rendered register.
   */
  from: { x: number; y: number; labelY: number };
  diamond: number;
  labelDx: number;
};

export const RoSD_ROWS: RoSDRow[] = FIELD_ACTIVITIES.map((activity, i) => {
  const product = HOME_ROWS.find((r) => r.id === activity.productId);
  if (!product) throw new Error(`homeRoSD: ${activity.id} needs ${activity.productId}, which the register lacks`);
  if (product.requiredOnSiteDate !== activity.requiredOnSiteDate)
    throw new Error(`homeRoSD: ${activity.id} and the register disagree about ${product.name}`);
  const top = ROWS_TOP + i * G.ROW_H;
  const barY = top + G.BAR_CY;
  return {
    activity,
    product,
    emphasis: activity.emphasis,
    top,
    bar: { x0: xOf(activity.startDate), x1: xEndOf(activity.finishDate), y: barY },
    from: { x: xEndOf(activity.requiredOnSiteDate), y: barY, labelY: top + 24 },
    diamond: activity.emphasis ? G.DIAMOND_EMPH : G.DIAMOND,
    labelDx: G.LABEL_DX,
  };
});

export const ROWS_BOTTOM = ROWS_TOP + RoSD_ROWS.length * G.ROW_H;

/* ------------------------------------------------------------ timescale */

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type Month = { x0: number; x1: number; label: string; yearStart: boolean };
export type Year = { x0: number; x1: number; label: string };

export const MONTHS: Month[] = (() => {
  const out: Month[] = [];
  const d = parse(DOMAIN.start);
  const end = parse(DOMAIN.end);
  while (d < end) {
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const a = `${y}-${String(m + 1).padStart(2, '0')}-01`;
    const nextY = m === 11 ? y + 1 : y;
    const nextM = (m + 1) % 12;
    const b = `${nextY}-${String(nextM + 1).padStart(2, '0')}-01`;
    out.push({ x0: xOf(a), x1: xOf(b), label: MONTH[m], yearStart: m === 0 });
    d.setUTCFullYear(nextY, nextM, 1);
  }
  return out;
})();

export const YEARS: Year[] = (() => {
  const out: Year[] = [];
  // Years clipped to the domain, so a boundary is always a month line.
  const startYear = parse(DOMAIN.start).getUTCFullYear();
  const endYear = parse(DOMAIN.end).getUTCFullYear();
  for (let y = startYear; y <= endYear; y++) {
    const a = y === startYear ? DOMAIN.start : `${y}-01-01`;
    const b = y === endYear ? DOMAIN.end : `${y + 1}-01-01`;
    if (a < b) out.push({ x0: xOf(a), x1: xOf(b), label: String(y) });
  }
  return out;
})();
