/**
 * HOMEPAGE PRODUCT REGISTER - curated data (Design System Section 52).
 *
 * ONE STORY, ONE SOURCE. The homepage follows one item through all four
 * steps: Heritage Steel Windows and Doors. Its Required On-Site date,
 * fabrication duration, supplier and category are DERIVED from the
 * Procurement Chain scenario that Steps 02-04 use, so Step 01 cannot
 * disagree with them. Nothing here restates a date or a duration that the
 * scenario already holds.
 *
 * The other five rows (Section 52.1, amended 2026-11-07):
 *   - Exterior Stone Veneer and Custom HVAC Equipment are read whole from the
 *     full Product Register's fixture.
 *   - Tile Package and Roofing Membrane are read from that fixture EXCEPT their
 *     Required On-Site dates, which come from the Step 02 construction
 *     activities (homeScheduleData.ts), so Steps 01 and 02 read one value.
 *   - Structural Steel (replacing Passenger Elevator) has no row in the full
 *     register; it is authored here, with its category, supplier and
 *     fabrication from the shared schedule's steel package and its date from
 *     Step 02.
 * Nothing in any fixture is changed.
 */

import { buildSteelWindowsChain } from '../procurement-chain/chainScenario';
import { PRODUCT_IDS, requiredOnSiteFor } from '../home-schedule/homeScheduleData';
import { SCHEDULE_ITEMS } from '../procurement-schedule/scheduleFixture';
import type { ScheduleItem } from '../procurement-schedule/scheduleModel';
import { KPI_CARDS, PAGE, ROWS, type KpiCard, type ProductStatus } from '../../fixtures/productRegister';
import { PROJECT } from '../../fixtures/project';

export type HomeRegisterRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  trade: string;
  status: ProductStatus;
  /** Working days of fabrication (production), not the whole procurement. */
  fabricationWorkdays: number;
  /** ISO Required On-Site date: the one value Steps 01 and 02 both read. */
  requiredOnSiteDate: string;
  /** Display form, the register's own, formatted from the ISO date: "Nov 30, 2027". */
  requiredOnSite: string;
  supplier: string;
  selected: boolean;
};

/** The register's date form (zero-padded day), shared with the full screen. */
export const formatRegisterDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

const fabricationOf = (item: ScheduleItem) => {
  const production = item.steps.filter((s) => s.kind === 'phase' && s.family === 'production');
  if (!production.length) throw new Error(`homeRegister: ${item.id} has no fabrication activity`);
  return {
    workdays: production.reduce((n, s) => n + s.durationWorkdays, 0),
    supplier: production[0].responsibleOrganization,
  };
};

/* --------------------------------------------- the selected item (Steps 01-04) */

/** The scenario the Procurement Chain draws: the homepage's single source. */
export const STORY_ITEM = buildSteelWindowsChain();
const storyFabrication = fabricationOf(STORY_ITEM);

export const SELECTED: HomeRegisterRow = {
  id: 'PRD-0246',
  name: 'Heritage Steel Windows and Doors',
  description: 'Custom steel frames, insulated glazing',
  category: STORY_ITEM.category,
  trade: 'Glazing',
  // Pending, so the register agrees that the submittal reviews in Step 03
  // are still ahead (Section 52.1).
  status: 'pending',
  fabricationWorkdays: storyFabrication.workdays,
  requiredOnSiteDate: STORY_ITEM.requiredOnSiteDate,
  requiredOnSite: formatRegisterDate(STORY_ITEM.requiredOnSiteDate),
  supplier: storyFabrication.supplier,
  selected: true,
};

/* ------------------------------------------------- the five other products */

/** The register's date form back to ISO, for rows read whole from the fixture. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const registerDateToIso = (display: string) => {
  const m = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/.exec(display);
  const month = m ? MONTHS.indexOf(m[1]) : -1;
  if (!m || month < 0) throw new Error(`homeRegister: unreadable date "${display}"`);
  const isoDate = `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  // Round-trip, so a date the register would print differently is caught.
  if (formatRegisterDate(isoDate) !== display) throw new Error(`homeRegister: date "${display}" does not round-trip`);
  return isoDate;
};

const packageOf = (packageId: string) => {
  const pkg = SCHEDULE_ITEMS.find((i) => i.id === packageId);
  if (!pkg) throw new Error(`homeRegister: no schedule package ${packageId}`);
  return pkg;
};

/**
 * Which fixture row and schedule package each register row reads, and whether
 * its Required On-Site date comes from Step 02. packageId null = no package.
 */
const FROM_FIXTURE: { id: string; packageId: string | null; dateFromStep02: boolean }[] = [
  { id: 'PRD-0245', packageId: 'itm-stone', dateFromStep02: false },
  { id: 'PRD-0244', packageId: 'itm-hvac', dateFromStep02: false },
  { id: PRODUCT_IDS.tile, packageId: 'itm-tile', dateFromStep02: true },
  { id: PRODUCT_IDS.roofing, packageId: null, dateFromStep02: true },
];

const fixtureRow = ({ id, packageId, dateFromStep02 }: (typeof FROM_FIXTURE)[number]): HomeRegisterRow => {
  const row = ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`homeRegister: no register row ${id}`);
  let fabricationWorkdays: number;
  if (packageId) {
    fabricationWorkdays = fabricationOf(packageOf(packageId)).workdays;
  } else {
    // No schedule package: the fixture's authored lead time, stated in
    // working days on the fixture's own 5-working-day week (Section 52.1).
    const weeks = /^(\d+) weeks$/.exec(row.leadTime);
    if (!weeks) throw new Error(`homeRegister: ${id} lead time "${row.leadTime}" is not in weeks`);
    fabricationWorkdays = Number(weeks[1]) * 5;
  }
  const requiredOnSiteDate = dateFromStep02 ? requiredOnSiteFor(id) : registerDateToIso(row.requiredOnSite);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    trade: row.trade,
    status: row.status,
    fabricationWorkdays,
    requiredOnSiteDate,
    requiredOnSite: formatRegisterDate(requiredOnSiteDate),
    supplier: row.supplier,
    selected: false,
  };
};

/**
 * Structural Steel: no row in the full register, so authored here (Section
 * 52.1). Category, supplier and fabrication come from the shared schedule's
 * steel package; the date from Step 02.
 */
const steelPackage = packageOf('itm-steel');
const steelFabrication = fabricationOf(steelPackage);
const steelDate = requiredOnSiteFor(PRODUCT_IDS.steel);
const STEEL: HomeRegisterRow = {
  id: PRODUCT_IDS.steel,
  name: 'Structural Steel',
  description: 'Wide-flange framing and connections',
  category: steelPackage.category,
  trade: 'Steel',
  status: 'approved',
  fabricationWorkdays: steelFabrication.workdays,
  requiredOnSiteDate: steelDate,
  requiredOnSite: formatRegisterDate(steelDate),
  supplier: steelFabrication.supplier,
  selected: false,
};

const [stoneRow, hvacRow, tileRow, roofingRow] = FROM_FIXTURE.map(fixtureRow);

/** Six products: the story item first, as the full register lists it. */
export const HOME_ROWS: HomeRegisterRow[] = [SELECTED, stoneRow, hvacRow, tileRow, STEEL, roofingRow];

/** The register's own project totals: the four cards Section 52.2 keeps. */
export const HOME_KPIS: KpiCard[] = KPI_CARDS.filter((k) =>
  ['Total Products', 'Approved', 'Pending Approval', 'Long Lead Items'].includes(k.label),
);

const TOTAL = HOME_KPIS.find((k) => k.label === 'Total Products')!.value;

export const HOME_PAGE = {
  title: PAGE.title,
  project: PROJECT.name,
  location: PROJECT.location,
  description: 'Every product, material, and piece of equipment the project needs, tracked in one place.',
  primaryAction: PAGE.primaryAction,
  showing: `Showing ${HOME_ROWS.length} of ${TOTAL} products`,
} as const;

export const workdaysLabel = (n: number) => `${n} working days`;

/* ------------------------------------------ Required On-Site presentation */

/**
 * WHETHER THE REGISTER SHOWS ITS REQUIRED ON-SITE DATES (Section 52.5). A
 * presentation state, never a data change: every row keeps its date above.
 * Step 01 shows the register before the dates are established; Step 02
 * establishes four of them from the construction schedule.
 *
 *   reveal(row)  0 = not yet established (a neutral placeholder), 1 = the
 *                row's own date; values between cross-fade the two.
 *   panel        the same, for the selected product's detail panel.
 */
export type RoSDPresentation = {
  reveal: (row: HomeRegisterRow) => number;
  panel: number;
};

/** Step 01: no Required On-Site date is established yet. */
export const RoSD_NOT_ESTABLISHED: RoSDPresentation = { reveal: () => 0, panel: 0 };

/** The neutral placeholder for a date not yet established. */
export const RoSD_PLACEHOLDER = '—';
/** The detail panel's words for the same state. */
export const RoSD_PANEL_PLACEHOLDER = 'Not yet established';

/** The fixed application canvas (Section 52.2). Scaled as one unit, never reflowed. */
export const HOME_CANVAS = { w: 1280, h: 740 } as const;
