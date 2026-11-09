/**
 * HOMEPAGE STEP 02 - the construction schedule (Design System Section 53.1.1).
 *
 * Four field activities, each creating demand for one product. The start
 * dates and Required On-Site Dates (RoSDs) are approved representative
 * demonstration data. Each RoSD is set by that product's own receiving,
 * staging and inspection needs; there is NO universal offset rule, and none
 * may be derived here.
 *
 * ONE SOURCE. This module imports nothing from the homepage register. The
 * register (homeRegisterData.ts, Section 52.1) reads its Structural Steel,
 * Roofing Membrane and Tile Package dates from here, and the windows date is
 * the Procurement Chain scenario's fixed date, read by reference - never a
 * second copy.
 */

import { CHAIN_REQUIRED_ON_SITE } from '../procurement-chain/chainScenario';
import { addWorkdays, iso, parse } from '../procurement-schedule/workCalendar';

/** Homepage register product ids (the rows of Section 52.1). */
export const PRODUCT_IDS = {
  steel: 'PRD-0238',
  roofing: 'PRD-0240',
  windows: 'PRD-0246',
  tile: 'PRD-0242',
} as const;

export type FieldActivity = {
  id: string;
  name: string;
  /** ISO start date: approved demonstration data. */
  startDate: string;
  /** Illustrative, in working days on the working-day calendar. */
  durationWorkdays: number;
  /** ISO finish: the last working day of the duration, inclusive. */
  finishDate: string;
  /** The homepage register row whose product this activity needs. */
  productId: string;
  /** ISO Required On-Site Date of that product. */
  requiredOnSiteDate: string;
  /** The item Step 03 carries forward. */
  emphasis: boolean;
};

type Spec = Omit<FieldActivity, 'finishDate'>;

const SPECS: Spec[] = [
  {
    id: 'act-steel',
    name: 'Structural Steel Erection',
    startDate: '2027-03-15',
    durationWorkdays: 40,
    productId: PRODUCT_IDS.steel,
    // About a week: the first erection sequence is shaken out by piece mark
    // and staged within crane reach before the erector arrives.
    requiredOnSiteDate: '2027-03-08',
    emphasis: false,
  },
  {
    id: 'act-roofing',
    name: 'Roofing Installation',
    startDate: '2027-10-04',
    durationWorkdays: 20,
    productId: PRODUCT_IDS.roofing,
    // Three working days: crane-loaded and kept dry; earlier only adds
    // weather and deck-load risk.
    requiredOnSiteDate: '2027-09-29',
    emphasis: false,
  },
  {
    id: 'act-windows',
    name: 'Steel Windows and Doors Installation',
    startDate: '2027-12-01',
    durationWorkdays: 30,
    productId: PRODUCT_IDS.windows,
    // The Procurement Chain scenario's fixed date (Section 51.2).
    requiredOnSiteDate: CHAIN_REQUIRED_ON_SITE,
    emphasis: true,
  },
  {
    id: 'act-tile',
    name: 'Floor and Wall Tile Installation',
    startDate: '2028-03-06',
    durationWorkdays: 35,
    productId: PRODUCT_IDS.tile,
    // Nine working days: lot and shade verification, conditioned storage,
    // and time to replace short or damaged cartons.
    requiredOnSiteDate: '2028-02-22',
    emphasis: false,
  },
];

export const FIELD_ACTIVITIES: FieldActivity[] = SPECS.map((s) => ({
  ...s,
  finishDate: iso(addWorkdays(parse(s.startDate), s.durationWorkdays - 1)),
}));

/** The RoSD a homepage register row takes from Step 02. */
export function requiredOnSiteFor(productId: string): string {
  const a = FIELD_ACTIVITIES.find((x) => x.productId === productId);
  if (!a) throw new Error(`homeSchedule: no activity needs product ${productId}`);
  return a.requiredOnSiteDate;
}
