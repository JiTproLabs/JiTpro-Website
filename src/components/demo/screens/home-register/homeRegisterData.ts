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
 * The other five rows are read from the full Product Register's fixture,
 * which itself derives them from the shared schedule. Nothing in either of
 * those fixtures is changed.
 */

import { buildSteelWindowsChain } from '../procurement-chain/chainScenario';
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
  /** Display form, the register's own: "Nov 30, 2027". */
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
  requiredOnSite: formatRegisterDate(STORY_ITEM.requiredOnSiteDate),
  supplier: storyFabrication.supplier,
  selected: true,
};

/* ------------------------------------------------- the five other products */

/** Which schedule package each register row belongs to; null = none shown. */
const OTHERS: { id: string; packageId: string | null }[] = [
  { id: 'PRD-0245', packageId: 'itm-stone' },
  { id: 'PRD-0244', packageId: 'itm-hvac' },
  { id: 'PRD-0242', packageId: 'itm-tile' },
  { id: 'PRD-0241', packageId: 'itm-elevator' },
  { id: 'PRD-0240', packageId: null },
];

const otherRows: HomeRegisterRow[] = OTHERS.map(({ id, packageId }) => {
  const row = ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`homeRegister: no register row ${id}`);
  let fabricationWorkdays: number;
  if (packageId) {
    const pkg = SCHEDULE_ITEMS.find((i) => i.id === packageId);
    if (!pkg) throw new Error(`homeRegister: no schedule package ${packageId}`);
    fabricationWorkdays = fabricationOf(pkg).workdays;
  } else {
    // No schedule package: the fixture's authored lead time, stated in
    // working days on the fixture's own 5-working-day week (Section 52.1).
    const weeks = /^(\d+) weeks$/.exec(row.leadTime);
    if (!weeks) throw new Error(`homeRegister: ${id} lead time "${row.leadTime}" is not in weeks`);
    fabricationWorkdays = Number(weeks[1]) * 5;
  }
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    trade: row.trade,
    status: row.status,
    fabricationWorkdays,
    requiredOnSite: row.requiredOnSite,
    supplier: row.supplier,
    selected: false,
  };
});

/** Six products: the story item first, as the full register lists it. */
export const HOME_ROWS: HomeRegisterRow[] = [SELECTED, ...otherRows];

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

/** The fixed application canvas (Section 52.2). Scaled as one unit, never reflowed. */
export const HOME_CANVAS = { w: 1280, h: 740 } as const;
