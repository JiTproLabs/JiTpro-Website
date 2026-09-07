import { SCHEDULE_ITEMS } from '../screens/procurement-schedule/scheduleFixture';
import type { ScheduleItem } from '../screens/procurement-schedule/scheduleModel';

/**
 * Product Register - representative fixture data.
 *
 * Content lives here rather than in JSX so the table and the detail panel
 * cannot drift apart: both read this file.
 *
 * ONE PROJECT, DIFFERENT SLICES. The register and the Procurement Schedule
 * are views of the same representative project, but not of the same records:
 * a procurement package may carry one product or several, and the schedule
 * shows 15 of its 153 packages while the register shows 8 of its 246
 * products. Where a product belongs to a package the schedule renders, the
 * facts they share are DERIVED from the schedule fixture here rather than
 * restated - supplier, category, Required On-Site, lead time, the release
 * date, and the commitments the package depends on - so the two screens
 * cannot disagree. A product outside the schedule's visible packages (the
 * roofing membrane) is authored on its own and must stay plausible beside
 * them.
 *
 * STATUS IS THE REGISTER'S OWN. The master's mix of Approved, Pending, Long
 * Lead and TBD is kept as information design; the register does not claim
 * the schedule's 26 November 2026 data date, and neither does the Commitment
 * Register. What overlaps is consistent; what is a different moment is not
 * forced to agree.
 *
 * LAYOUT, columns, field set and information types are transcribed from
 * `assets-src/methodology/product-register.png`, the visual master. Every
 * organization, person and address is constructed; the email uses a reserved
 * `.example` domain.
 *
 * PRODUCT MODEL. JiTpro does not manage budgets, costs, pricing, or contract
 * values, so no financial field exists here and none may be introduced.
 */

export type ProductStatus = 'approved' | 'pending' | 'long-lead' | 'tbd';

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  trade: string;
  supplier: string;
  status: ProductStatus;
  leadTime: string;
  requiredOnSite: string;
  source: string;
};

/** The master's date form: zero-padded day. */
const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * What the schedule knows about a package, read from the built schedule.
 *   supplier  - the organization responsible for the production phase
 *   leadTime  - the production-family phases, working days as weeks
 *   orderBy   - the release milestone (Release for Fabrication, Release /
 *               Order, Order), else the last Approval milestone
 *   commitments - name and required-by date, as the schedule derives them
 */
function fromPackage(itemId: string) {
  const item = SCHEDULE_ITEMS.find((i) => i.id === itemId);
  if (!item) throw new Error(`productRegister: no schedule package "${itemId}"`);
  const production = item.steps.filter((s) => s.family === 'production');
  const workdays = production.reduce((n, s) => n + s.durationWorkdays, 0);
  const releases = item.steps.filter(
    (s) => s.kind === 'milestone' && s.family === 'approval' && /^(Release|Order)/.test(s.name),
  );
  const approvals = item.steps.filter((s) => s.kind === 'milestone' && s.family === 'approval');
  const release = releases[releases.length - 1] ?? approvals[approvals.length - 1];
  return {
    package: item as ScheduleItem,
    category: item.category,
    supplier: production[0]?.responsibleOrganization ?? '',
    requiredOnSite: fmt(item.requiredOnSiteDate),
    leadTime: `${Math.round(workdays / 5)} weeks`,
    orderBy: release ? fmt(release.startDate) : '—',
    commitments: item.commitments.map((c) => ({ name: c.name, requiredBy: fmt(c.requiredBy) })),
  };
}

const heritage = fromPackage('itm-heritage');
const stone = fromPackage('itm-stone');
const hvac = fromPackage('itm-hvac');
const intdoors = fromPackage('itm-intdoors');
const tile = fromPackage('itm-tile');
const elevator = fromPackage('itm-elevator');
const plumbing = fromPackage('itm-plumbing');

export const PAGE = {
  title: 'Product Register',
  subtitle: 'Oak Ridge Residence',
  description: 'Track and manage all products, materials, and equipment required for the project.',
  primaryAction: 'Add Product',
} as const;

export type KpiCard = {
  icon: 'list' | 'check' | 'clock' | 'alert' | 'question';
  value: string;
  label: string;
  /** Only "Approved" colours its numeral in the master. */
  tone: 'neutral' | 'ok' | 'warn' | 'error';
};

/** The register's own totals: 246 products across the project. */
export const KPI_CARDS: KpiCard[] = [
  { icon: 'list', value: '246', label: 'Total Products', tone: 'neutral' },
  { icon: 'check', value: '162', label: 'Approved', tone: 'ok' },
  { icon: 'clock', value: '38', label: 'Pending Approval', tone: 'warn' },
  { icon: 'alert', value: '24', label: 'Long Lead Items', tone: 'error' },
  { icon: 'question', value: '22', label: 'To Be Determined', tone: 'neutral' },
];

/** Measured card widths, left to right (171/173/183/184/193 in the master). */
export const KPI_WIDTHS = [171, 173, 183, 184, 193];
/** Measured gap before each card (the first sits at x228). */
export const KPI_GAPS = [0, 9, 9, 10, 9];

export const TOOLBAR = {
  searchPlaceholder: 'Search products...',
  selects: ['All Statuses', 'All Categories', 'All Trades', 'All Suppliers'],
  /** Measured select widths and the gap before each. */
  selectWidths: [144, 143, 138, 142],
  selectGaps: [11, 11, 11, 11],
  searchWidth: 231,
  filtersLabel: 'Filters',
  filtersWidth: 78,
  filtersGap: 21,
} as const;

/**
 * Column widths, measured from the master's column rules. Ten columns; the
 * widths sum to the 939px inner width of the 941px table.
 */
export const COLUMNS = [
  { key: 'id', label: 'Product ID', width: 76 },
  { key: 'name', label: 'Product / Description', width: 162 },
  { key: 'category', label: 'Category', width: 74 },
  { key: 'trade', label: 'Trade', width: 71 },
  { key: 'supplier', label: 'Supplier / Manufacturer', width: 133 },
  { key: 'status', label: 'Status', width: 97 },
  { key: 'leadTime', label: 'Lead Time', width: 73 },
  { key: 'requiredOnSite', label: 'Required On-Site', width: 109 },
  { key: 'source', label: 'Source', width: 78 },
  { key: 'action', label: 'Action', width: 66 },
] as const;

/**
 * Row heights, measured line to line. The master's rows are NOT a uniform
 * pitch: 68/71/60/58/60/61/61/66. They are reproduced as measured so the
 * overlay lands; a uniform pitch is a one-line change here if preferred.
 */
export const ROW_HEIGHTS = [68, 71, 60, 58, 60, 61, 61, 66];

/**
 * Eight of 246. Seven belong to packages the schedule renders and take their
 * shared facts from it; the roofing membrane belongs to one of the packages
 * the schedule does not show. The TBD row is a product not yet selected: its
 * package's field date is known, its lead time is not.
 */
export const ROWS: ProductRow[] = [
  { id: 'PRD-0246', name: 'Heritage Steel Windows', description: 'Steel frames, insulated glazing', category: heritage.category, trade: 'Glazing', supplier: heritage.supplier, status: 'approved', leadTime: heritage.leadTime, requiredOnSite: heritage.requiredOnSite, source: 'A5.11' },
  { id: 'PRD-0245', name: 'Exterior Stone Veneer', description: 'Split-face limestone veneer', category: stone.category, trade: 'Masonry', supplier: stone.supplier, status: 'pending', leadTime: stone.leadTime, requiredOnSite: stone.requiredOnSite, source: 'A4.20' },
  { id: 'PRD-0244', name: 'Custom HVAC Equipment', description: 'Custom air handling units', category: hvac.category, trade: 'HVAC', supplier: hvac.supplier, status: 'approved', leadTime: hvac.leadTime, requiredOnSite: hvac.requiredOnSite, source: 'M1.02' },
  { id: 'PRD-0243', name: 'Custom Interior Doors', description: 'Solid core wood doors, custom', category: intdoors.category, trade: 'Carpentry', supplier: intdoors.supplier, status: 'approved', leadTime: intdoors.leadTime, requiredOnSite: intdoors.requiredOnSite, source: 'A6.01' },
  { id: 'PRD-0242', name: 'Tile Package', description: 'Porcelain floor & wall tile', category: tile.category, trade: 'Tile', supplier: tile.supplier, status: 'pending', leadTime: tile.leadTime, requiredOnSite: tile.requiredOnSite, source: 'A1.12' },
  { id: 'PRD-0241', name: 'Passenger Elevator', description: 'Passenger elevator, 3500 lbs', category: elevator.category, trade: 'Elevator', supplier: elevator.supplier, status: 'approved', leadTime: elevator.leadTime, requiredOnSite: elevator.requiredOnSite, source: 'E2.01' },
  { id: 'PRD-0240', name: 'Roofing Membrane', description: 'TPO, 60 mil', category: 'Roofing', trade: 'Roofing', supplier: 'Timberline Roofing Supply', status: 'long-lead', leadTime: '14 weeks', requiredOnSite: 'May 17, 2027', source: 'R1.01' },
  { id: 'PRD-0239', name: 'Plumbing Fixtures', description: 'Toilets, lavs, sinks', category: plumbing.category, trade: 'Plumbing', supplier: plumbing.supplier, status: 'tbd', leadTime: '—', requiredOnSite: plumbing.requiredOnSite, source: '—' },
];

/** The detail panel for the selected product, section for section. */
export const DETAIL = {
  eyebrow: 'Product Detail',
  title: 'Heritage Steel Windows',
  status: 'approved' as ProductStatus,
  overviewHeading: 'Product Overview',
  overview: [
    { label: 'Product ID', value: 'PRD-0246' },
    { label: 'Description', value: 'Heritage-profile steel windows and exterior doors with insulated glazing. Finish: dark bronze.' },
    { label: 'Category', value: heritage.category },
    { label: 'Trade', value: 'Glazing' },
  ],
  supplierHeading: 'Supplier / Manufacturer',
  supplier: {
    name: heritage.supplier,
    location: 'Denver, CO',
    contact: 'Contact: Peter Novak',
    email: 'pnovak@heritagesteel.example',
    phone: '(303) 555-0187',
  },
  procurementHeading: 'Procurement',
  procurement: [
    { label: 'Lead Time', value: heritage.leadTime },
    { label: 'Order By', value: heritage.orderBy },
    { label: 'Required On-Site', value: heritage.requiredOnSite },
  ],
  sourceHeading: 'Source Information',
  source: [
    { label: 'Drawing Reference', value: 'A5.11' },
    { label: 'Specification', value: '08 51 23 – Steel Windows' },
    { label: 'Revision', value: 'ASI-004 dated 06/15/2026' },
  ],
  relatedHeading: `Related Commitments (${heritage.commitments.length})`,
  related: heritage.commitments.map((c) => ({ title: c.name, due: `Required by ${c.requiredBy}` })),
  primaryAction: 'View Related Records',
} as const;

/** Pagination, reproduced as the master renders it. */
export const PAGINATION = {
  showing: 'Showing 1 to 8 of 246 products',
  pages: ['1', '2', '3', '4', '5', '…', '31'],
  rowsPerPage: '25',
} as const;
