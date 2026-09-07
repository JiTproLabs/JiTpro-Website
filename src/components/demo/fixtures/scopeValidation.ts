import type { DemoStatus } from '../primitives/DemoStatusBadge';

/**
 * Scope Validation - representative fixture data.
 *
 * Content lives here rather than in JSX so the table and the detail panel
 * cannot drift apart: both read this file.
 *
 * VISUAL MASTER: `assets-src/methodology/scope-validation.png` (1448x1086).
 * Every geometry constant below is a measurement from that file, and every
 * row is transcribed from it.
 *
 * ------------------------------------------------------------------ MODEL
 *
 * Scope Validation reviews the FULL population of scope items and reports how
 * well each is covered by the project's own sources. It is the stage that
 * establishes the 428 the later screens count against.
 *
 *   428  scope items identified
 *        = 337 fully validated
 *        +  24 partially validated
 *        +  41 single-source
 *        +  18 conflicting
 *        +   8 unverified
 *
 * THE MASTER'S OWN ARITHMETIC DID NOT CLOSE. It showed five cards summing
 * 361 + 41 + 18 + 8 = 428 exactly while the table carried a fifth badge,
 * Partial, on two of its eight rows - so a partial item belonged to no
 * category. Resolved by splitting the master's 361 into 337 fully validated
 * and 24 partially validated and giving Partial its own card, which is why
 * this KPI row carries six cards where the master carried five. Every badge
 * the table can show now has a number above it.
 *
 * WHAT A STATUS MEANS. `validated` - the item is described consistently
 * across two or more independent sources. `partial` - described, but not
 * completely. `single-source` - found in exactly one source, so nothing
 * corroborates it. `conflict` - two sources describe it differently.
 * `unverified` is a population count only; no visible row carries it.
 *
 * ------------------------------------------------------- CROSS-SCREEN TIES
 *
 * These eight items are the population the Scope Gap Analysis draws its 34
 * gaps from, so the two screens must agree item by item:
 *
 *   SI-0428 Exterior Window Assemblies  validated   - its own scope is
 *           covered; the Gap Analysis records an INTERFACE gap against it,
 *           which is a boundary with SI-0427, not a hole in this item.
 *   SI-0427 Interior Window Returns     partial     - the other side of that
 *           boundary, and the reason the interface gap exists.
 *   SI-0425 Primary Bathroom Floor Tile single-source - one drawing, no
 *           spec; the Gap Analysis records a definition gap against it.
 *   SI-0422 Exterior Stone Veneer       validated   - the Gap Analysis
 *           records an interface gap, again a boundary rather than a hole.
 *
 * Every organization, person and reference is constructed. JiTpro does not
 * manage budgets, costs, pricing, or contract values, so no financial field
 * exists here and none may be introduced.
 */

export type ValidationStatus = Extract<
  DemoStatus,
  'validated' | 'partial' | 'single-source' | 'conflict'
>;

export type ScopeRow = {
  id: string;
  description: string;
  discipline: string;
  status: ValidationStatus;
  drawings: string;
  specs: string;
  contract: string;
  communications: string;
  lastValidated: string;
};

export const PAGE = {
  title: 'Scope Validation Report',
  subtitle: 'Oak Ridge Residence',
  meta: 'Project Scope Review',
  updated: 'Updated August 27, 2026',
} as const;

export type KpiCard = {
  icon: 'total' | 'validated' | 'partial' | 'single' | 'conflict' | 'unverified';
  value: string;
  label: string;
  tone: 'neutral' | 'ok' | 'warn' | 'error';
  /** The master colours only the validated numeral green and the conflicting one red. */
  valueTone: 'text' | 'ok' | 'error';
};

/** Six cards; 337 + 24 + 41 + 18 + 8 = 428. See MODEL above. */
export const KPI_CARDS: KpiCard[] = [
  { icon: 'total', value: '428', label: 'Scope Items Identified', tone: 'neutral', valueTone: 'text' },
  { icon: 'validated', value: '337', label: 'Fully Validated', tone: 'ok', valueTone: 'ok' },
  { icon: 'partial', value: '24', label: 'Partially Validated', tone: 'warn', valueTone: 'text' },
  { icon: 'single', value: '41', label: 'Single-Source Items', tone: 'warn', valueTone: 'text' },
  { icon: 'conflict', value: '18', label: 'Conflicting References', tone: 'error', valueTone: 'error' },
  { icon: 'unverified', value: '8', label: 'Unverified Items', tone: 'neutral', valueTone: 'text' },
];

/**
 * Card widths and the gap before each. The master set five cards across the
 * same 859px; six are fitted by width rather than by shrinking the type, so
 * each card's longest label word still clears its text column.
 */
export const KPI_WIDTHS = [130, 128, 133, 142, 136, 130];
export const KPI_GAPS = [0, 12, 12, 12, 12, 12];

/**
 * The Project Sources Analyzed strip: what the validation was run AGAINST.
 * Six cells divided by inset rules, each an icon, a label and a count. The
 * zero is the point of the panel, not an omission - a project with no
 * specifications is exactly the condition that produces single-source items,
 * so the master calls it out in words underneath.
 */
export const SOURCES = [
  { icon: 'drawings' as const, label: 'Drawings', value: '64' },
  { icon: 'specs' as const, label: 'Specifications', value: '0', note: 'None Provided' },
  { icon: 'contracts' as const, label: 'Contracts & Subcontracts', value: '31' },
  { icon: 'rfis' as const, label: 'RFIs / ASIs', value: '14' },
  { icon: 'meetings' as const, label: 'Meeting Records', value: '9' },
  { icon: 'comms' as const, label: 'Project Communications', value: '8' },
];

/** Measured cell widths; the six sum to the strip's 858px inner width. */
export const SOURCE_WIDTHS = [137, 151, 151, 135, 150, 134];

export const SOURCES_HEADING = 'Project Sources Analyzed';

export const TOOLBAR = {
  searchPlaceholder: 'Search scope items...',
  searchWidth: 249,
  selects: ['All Validation Status', 'All Source Types', 'All Disciplines'],
  selectWidths: [161, 159, 156],
  selectGaps: [11, 11, 11],
  filtersLabel: 'Filters',
  filtersWidth: 76,
  filtersGap: 25,
} as const;

/**
 * Nine columns, measured from the master's column rules at x301, 443, 508,
 * 611, 750, 876 and 989 plus the text edges of the two the master leaves
 * unruled. They sum to the 857px inner width of the 859px table.
 *
 * THE MASTER OMITS ONE RULE, between Drawings and Specs, while drawing the
 * other seven. Verified by pixel scan: the gutter there is pure white in
 * every body row. A table with one divider missing reads as a defect rather
 * than as a convention, so all eight are drawn here - the single correction
 * made to this master's table.
 */
export const COLUMNS = [
  { key: 'id', label: 'Scope Item ID', width: 78 },
  { key: 'description', label: 'Scope Description', width: 142 },
  { key: 'discipline', label: 'Discipline', width: 65 },
  { key: 'status', label: 'Validation Status', width: 103 },
  { key: 'drawings', label: 'Drawings', width: 81 },
  { key: 'specs', label: 'Specs', width: 58 },
  { key: 'contract', label: 'Contract / Subcontract', width: 126 },
  { key: 'communications', label: 'Communications', width: 113 },
  { key: 'lastValidated', label: 'Last Validated', width: 91 },
] as const;

/**
 * Row heights, measured line to line. Not a uniform pitch in the master:
 * 54/55/53/52/53/52/53/52, reproduced as measured.
 */
export const ROW_HEIGHTS = [54, 55, 53, 52, 53, 52, 53, 52];

/**
 * Eight of 428, the master's own. The dash is the master's mark for "no
 * source of this type", and it is the single-source row's defining feature:
 * one drawing, nothing else.
 */
export const ROWS: ScopeRow[] = [
  {
    id: 'SI-0428',
    description: 'Exterior Window Assemblies',
    discipline: 'Exterior Enclosure',
    status: 'validated',
    drawings: '14 refs',
    specs: '—',
    contract: 'Window Systems Inc.',
    communications: '3 refs',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0427',
    description: 'Interior Window Returns',
    discipline: 'Interior Finishes',
    status: 'partial',
    drawings: '6 refs',
    specs: '—',
    contract: 'Partial',
    communications: '2 refs',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0426',
    description: 'Exterior Deck Waterproofing',
    discipline: 'Exterior Enclosure',
    status: 'validated',
    drawings: '8 refs',
    specs: '3 refs',
    contract: 'Waterproofing',
    communications: 'RFI-037',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0425',
    description: 'Primary Bathroom Floor Tile',
    discipline: 'Interior Finishes',
    status: 'single-source',
    drawings: 'A4.12',
    specs: '—',
    contract: '—',
    communications: '—',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0424',
    description: 'Stair Guardrail',
    discipline: 'Interior Finishes',
    status: 'validated',
    drawings: '9 refs',
    specs: '2 refs',
    contract: 'Metalwork',
    communications: '4 refs',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0423',
    description: 'Landscape Drainage',
    discipline: 'Site Work',
    status: 'conflict',
    drawings: 'Civil + Landscape',
    specs: '—',
    contract: 'Sitework',
    communications: 'RFI-021',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0422',
    description: 'Exterior Stone Veneer',
    discipline: 'Exterior Finishes',
    status: 'validated',
    drawings: '11 refs',
    specs: '4 refs',
    contract: 'Masonry',
    communications: '2 refs',
    lastValidated: 'Aug 27, 2026',
  },
  {
    id: 'SI-0421',
    description: 'Fireplace Surround',
    discipline: 'Interior Finishes',
    status: 'partial',
    drawings: '3 refs',
    specs: '—',
    contract: 'Stonework',
    communications: 'Owner Meeting',
    lastValidated: 'Aug 27, 2026',
  },
];

/** The selected row, and the row the detail panel describes. */
export const SELECTED_ROW = 0;

/**
 * The detail panel for the selected scope item. Source Evidence is the
 * screen's argument: what was found, in which source, and - for
 * specifications - what was not found at all.
 */
export const DETAIL = {
  eyebrow: 'Scope Item Detail',
  title: 'Exterior Window Assemblies',
  status: 'validated' as ValidationStatus,
  summaryHeading: 'Scope Summary',
  summary:
    'Provide complete exterior window assemblies including frames, glazing, hardware, flashings, perimeter waterproofing interfaces, interior returns, exterior finish interfaces, and installation coordination.',
  evidenceHeading: 'Source Evidence',
  evidence: [
    {
      icon: 'drawings' as const,
      label: 'Drawings',
      count: '14 references',
      lines: [
        { ref: 'A5.11', text: 'Window Schedule' },
        { ref: 'A8.21', text: 'Typical Window Details' },
        { ref: 'A8.22', text: 'Jamb Conditions' },
        { ref: 'A8.23', text: 'Head / Sill Conditions' },
        { ref: 'ID5.04', text: 'Interior Window Returns' },
      ],
      more: '+9 additional references',
    },
    {
      icon: 'specs' as const,
      label: 'Specifications',
      plain: ['No project specification identified'],
    },
    {
      icon: 'contracts' as const,
      label: 'Contract / Subcontract',
      plain: ['Window Systems Inc.', 'Subcontract 08 50 00', '12 applicable scope provisions'],
    },
    {
      icon: 'comms' as const,
      label: 'Communications',
      lines: [
        { ref: 'RFI-018', text: 'Sill waterproofing clarification' },
        { ref: 'ASI-004', text: 'Revised jamb condition' },
        { ref: 'Owner Meeting 07/16', text: 'Hardware finish confirmed' },
      ],
    },
  ],
  packagesHeading: 'Related Packages',
  packages: ['Window Systems', 'Waterproofing', 'Sheet Metal', 'Exterior Finishes'],
  primaryAction: 'Review Source Documents',
  relatedAction: 'View all 29 references',
} as const;

/**
 * The pager counts the same 428 the KPI row does. Its page count follows the
 * eight rows shown rather than the 25 in the selector - the master's own
 * arithmetic, kept as the Product Register keeps it.
 */
export const PAGINATION = {
  showing: 'Showing 1 to 8 of 428 scope items',
  pages: ['1', '2', '3', '4', '5', '…', '54'],
  rowsPerPage: '25',
} as const;
