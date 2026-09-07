/**
 * Scope Gap Analysis - representative fixture data.
 *
 * Content lives here rather than in JSX so the table and the detail panel
 * cannot drift apart: both read this file.
 *
 * VISUAL MASTER: `assets-src/methodology/scope-gap-analysis.png` (1448x1086).
 * Every geometry constant below is a measurement from that file, and every
 * string in rows 1-8 is transcribed from it. Rows 9-15 are additions (see
 * THE VISIBLE SUBSET below).
 *
 * ------------------------------------------------------------------ MODEL
 *
 * Scope Validation reviews the full population of scope items. Scope Gap
 * Analysis identifies and classifies the subset that needs attention. So:
 *
 *   428  scope items reviewed on the project
 *    34  of them carry a gap  =  17 Definition + 9 Responsibility + 8 Interface
 *
 * A VALIDATED ITEM IS NOT A GAP. It is a scope item that was reviewed and
 * found sufficiently defined, and it appears in this table as evidence that
 * the review was broad rather than a search for problems. It therefore MUST
 * NOT be counted into the 34 - which is why the pager counts scope items and
 * the KPI row counts gaps. The master's own pager said "34 gaps" while
 * showing two validated rows; that arithmetic could not hold and the count
 * language is the thing that changed.
 *
 * A gap has no Commitment yet - the panel's action is literally *Create
 * Commitment* - so `responsibleParty` is a role or discipline and may be
 * `Unassigned`. It is deliberately NOT the Commitment Register's
 * organisation/owner pair: that pair only exists once a gap has become a
 * commitment, one stage later.
 *
 * ------------------------------------------------------- THE VISIBLE SUBSET
 *
 * Fifteen of 428. Rows 1-8 are the master's own, unchanged. Rows 9-15 are
 * further scope items from the same representative project, drawn from
 * procurement packages the other screens already know about, so nothing here
 * can contradict them:
 *
 *   Roof Assembly Transitions   the roofing package behind PRD-0240
 *   Concrete & Reinforcing      itm-concrete, and COM-016
 *   Interior Door Package       itm-intdoors / PRD-0243 (approved, so defined)
 *   Electrical Switchgear       itm-switchgear
 *   Building Permit Conditions  itm-permit, and COM-017
 *   Custom HVAC Equipment       itm-hvac / PRD-0244 (approved, so defined)
 *   Engineered Framing          itm-framing
 *
 * SAME PROJECT IS NOT SAME RECORDS. A scope item is not a product and not a
 * package: "MEP Rough-In Layout" carries a gap while the HVAC equipment it
 * serves is validated, and both are true at once. Nothing here is forced to
 * appear on another screen.
 *
 * Required-by dates sit in Sep-Oct 2026, ahead of the Commitment Register's
 * Aug-Sep 2026 target dates, because a commitment resolves a gap before the
 * gap's own deadline. None of it is taken from an actual engagement.
 *
 * PRODUCT MODEL. JiTpro does not manage budgets, costs, pricing, or contract
 * values, so no financial field exists here and none may be introduced.
 */

/** Definition / Responsibility / Interface are gaps. Validated is not. */
export type GapType = 'definition' | 'responsibility' | 'interface' | 'validated';

export type Impact = 'high' | 'medium' | 'low';

export type GapRow = {
  scope: string;
  type: GapType;
  title: string;
  description: string;
  /** A role or discipline, never an organisation - or `Unassigned`. */
  responsibleParty: string;
  requiredBy: string;
  impact: Impact;
};

export const GAP_TYPE_LABEL: Record<GapType, string> = {
  definition: 'Definition',
  responsibility: 'Responsibility',
  interface: 'Interface',
  validated: 'Validated',
};

export const IMPACT_LABEL: Record<Impact, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/**
 * The master colours the required-by date red and bold on every row whose
 * impact is High or Medium, and leaves it plain on both Low rows. Expressed
 * as the rule the master is following rather than restated per row, so an
 * added row cannot disagree with it.
 */
export const isUrgent = (row: GapRow) => row.impact !== 'low';

export const PAGE = {
  title: 'Scope Gap Analysis Report',
  subtitle: 'Oak Ridge Residence',
  meta: 'Project Scope Review',
  updated: 'Updated August 27, 2026',
} as const;

export type KpiCard = {
  icon: 'total' | 'definition' | 'responsibility' | 'interface';
  value: string;
  label: string;
  /** Cards 2-4 carry two lines of description; the first card carries none. */
  sub?: string;
  /** Only the first two cards sit their icon on a tinted disc. */
  tinted: boolean;
  /** Only the Interface card's icon is red; only Definition's numeral is amber. */
  iconTone: 'accent' | 'danger';
  valueTone: 'text' | 'accent';
};

/**
 * 34 gaps, partitioned. 17 + 9 + 8 = 34 exactly, and validated scope items
 * are outside the partition by construction - see MODEL above.
 */
export const KPI_CARDS: KpiCard[] = [
  { icon: 'total', value: '34', label: 'Total Gaps Identified', tinted: true, iconTone: 'accent', valueTone: 'text' },
  { icon: 'definition', value: '17', label: 'Definition Gaps', sub: 'Scope clarity or incomplete information', tinted: true, iconTone: 'accent', valueTone: 'accent' },
  { icon: 'responsibility', value: '9', label: 'Responsibility Gaps', sub: 'Work understood but ownership unclear', tinted: false, iconTone: 'accent', valueTone: 'text' },
  { icon: 'interface', value: '8', label: 'Interface Gaps', sub: 'Scope may complete but boundaries overlap', tinted: false, iconTone: 'danger', valueTone: 'text' },
];

/** Measured card widths and the gap before each (the first sits at x218). */
export const KPI_WIDTHS = [190, 226, 229, 229];
export const KPI_GAPS = [0, 13, 13, 14];

export const TOOLBAR = {
  searchPlaceholder: 'Search gaps...',
  searchWidth: 228,
  selects: ['All Gap Types', 'All Disciplines', 'All Responsible Parties'],
  /** Measured select widths and the gap before each. */
  selectWidths: [188, 174, 182],
  selectGaps: [13, 14, 13.5],
  filtersLabel: 'Filters',
  filtersWidth: 82,
  filtersGap: 20,
} as const;

/**
 * Eight columns. The master draws NO vertical column rules - the one
 * structural difference from the Product Register's table - so these widths
 * come from the column each cell's text starts 12px inside: the text edges
 * measured at x228, 364, 440, 600, 799, 940, 1032 and a centred action
 * column. They sum to the 925px inner width of the 927px table.
 */
export const COLUMNS = [
  { key: 'scope', label: 'Scope / Package', width: 136 },
  { key: 'type', label: 'Gap Type', width: 76 },
  { key: 'title', label: 'Gap Title', width: 160 },
  { key: 'description', label: 'Description', width: 199 },
  { key: 'responsible', label: 'Responsible Party', width: 141 },
  { key: 'requiredBy', label: 'Required By', width: 92 },
  { key: 'impact', label: 'Impact', width: 66 },
  { key: 'action', label: 'Action', width: 55 },
] as const;

/**
 * Fifteen of 428. Rows 1-8 are the master's, verbatim; 9-15 are the addition
 * described above. Ten carry gaps and five are validated, interleaved so the
 * validated rows do not read as a block at the foot of the table.
 */
export const ROWS: GapRow[] = [
  {
    scope: 'Exterior Windows',
    /**
     * INTERFACE, not definition, and the Scope Validation report is why. That
     * screen marks SI-0428 Exterior Window Assemblies `validated` and SI-0427
     * Interior Window Returns `partial`: this item's own scope is covered, and
     * what is unresolved is the boundary between the two - which is what an
     * interface gap is. The master labelled it a definition gap while its own
     * title and finding both describe an interface; the two screens cannot
     * both be right, and the evidence sits on this side.
     */
    type: 'interface',
    title: 'Interior and exterior finish interfaces unresolved',
    description: 'Window frame-to-wall interfaces lack complete finish coordination',
    responsibleParty: 'Architect',
    requiredBy: 'Sep 14, 2026',
    impact: 'high',
  },
  {
    scope: 'Primary Bathroom Flooring',
    type: 'definition',
    title: 'Floor finish not identified in drawings or specs',
    description: 'Tile finish not specified for primary bathroom floor',
    responsibleParty: 'Interior Designer',
    requiredBy: 'Sep 18, 2026',
    impact: 'medium',
  },
  {
    scope: 'Structural Steel / Glazing Interface',
    type: 'interface',
    title: 'Attachment responsibility between steel and glazing open',
    description: 'Steel attachment details reference glazing but subcontract scope varies',
    responsibleParty: 'Unassigned',
    requiredBy: 'Sep 10, 2026',
    impact: 'high',
  },
  {
    scope: 'Custom Staircase',
    type: 'responsibility',
    title: 'Shop drawing preparation and approval ownership',
    description: 'No owner assigned for shop drawing coordination and approvals',
    responsibleParty: 'Project Team',
    requiredBy: 'Sep 08, 2026',
    impact: 'medium',
  },
  {
    scope: 'Kitchen Casework',
    type: 'validated',
    title: 'Scope sufficiently defined',
    description: 'Casework scope and responsibilities clearly documented',
    responsibleParty: 'Casework Contractor',
    requiredBy: 'Oct 02, 2026',
    impact: 'low',
  },
  {
    scope: 'MEP Rough-In Layout',
    type: 'definition',
    title: 'Equipment clearances not consistent across sheets',
    description: 'Mechanical and electrical layouts disagree on equipment access',
    responsibleParty: 'MEP Engineer',
    requiredBy: 'Sep 20, 2026',
    impact: 'high',
  },
  {
    scope: 'Exterior Stone Veneer',
    type: 'interface',
    title: 'Back-up wall coordination inconsistent',
    description: 'Masonry back-up not aligned with structural wall requirements',
    responsibleParty: 'Unassigned',
    requiredBy: 'Sep 12, 2026',
    impact: 'high',
  },
  {
    scope: 'Elevator Equipment',
    type: 'validated',
    title: 'Scope sufficiently defined',
    description: 'Elevator scope, delivery, and installation responsibilities clear',
    responsibleParty: 'Elevator Contractor',
    requiredBy: 'Oct 05, 2026',
    impact: 'low',
  },
  {
    scope: 'Roof Assembly Transitions',
    type: 'definition',
    title: 'Roof-to-wall transition detail not defined',
    description: 'Membrane termination at parapet not detailed on current drawings',
    responsibleParty: 'Architect',
    requiredBy: 'Sep 16, 2026',
    impact: 'high',
  },
  {
    scope: 'Concrete & Reinforcing',
    type: 'responsibility',
    title: 'Embed and sleeve coordination ownership open',
    description: 'No party assigned to coordinate embeds and sleeves before pour',
    responsibleParty: 'Structural Engineer',
    requiredBy: 'Sep 22, 2026',
    impact: 'high',
  },
  {
    scope: 'Interior Door Package',
    type: 'validated',
    title: 'Scope sufficiently defined',
    description: 'Door schedule, hardware sets, and finishes fully specified',
    responsibleParty: 'Millwork Contractor',
    requiredBy: 'Oct 09, 2026',
    impact: 'low',
  },
  {
    scope: 'Electrical Switchgear',
    type: 'interface',
    title: 'Housekeeping pad and clearance boundary unresolved',
    description: 'Switchgear pad extents conflict with structural slab edge',
    responsibleParty: 'Unassigned',
    requiredBy: 'Sep 29, 2026',
    impact: 'high',
  },
  {
    scope: 'Building Permit Conditions',
    type: 'responsibility',
    title: 'Plan-check response ownership unassigned',
    description: 'Outstanding plan-check comments have no assigned respondent',
    responsibleParty: 'General Contractor',
    requiredBy: 'Sep 25, 2026',
    impact: 'medium',
  },
  {
    scope: 'Custom HVAC Equipment',
    type: 'validated',
    title: 'Scope sufficiently defined',
    description: 'Equipment selection and clearances confirmed and coordinated',
    responsibleParty: 'Mechanical Engineer',
    requiredBy: 'Oct 12, 2026',
    impact: 'low',
  },
  {
    scope: 'Engineered Framing',
    type: 'validated',
    title: 'Scope sufficiently defined',
    description: 'Framing layouts and engineered member schedules complete',
    responsibleParty: 'Structural Engineer',
    requiredBy: 'Oct 14, 2026',
    impact: 'low',
  },
];

/** The selected row, and the row the detail panel describes. */
export const SELECTED_ROW = 0;

/** The detail panel for the selected gap, section for section. */
export const DETAIL = {
  eyebrow: 'Gap Detail',
  title: 'Interior and exterior finish interfaces unresolved',
  /** Drives both the label and its colour, so the panel cannot disagree with
      the row's own Gap Type cell. */
  type: 'interface' as GapType,
  typeLabel: 'Interface Gap',
  sections: [
    {
      icon: 'finding' as const,
      heading: 'Finding',
      body: 'Window frame-to-wall interfaces lack complete finish coordination.',
    },
    {
      icon: 'matters' as const,
      heading: 'Why it matters',
      body: 'Finishes may conflict, creating rework, delays, and potential water infiltration risks.',
    },
    {
      icon: 'resolution' as const,
      heading: 'Required resolution',
      body: 'Coordinate and define interior and exterior finish terminations at all window conditions. Update details and specifications.',
    },
  ],
  meta: [
    { icon: 'party' as const, label: 'Responsible Party', value: 'Architect' },
    { icon: 'date' as const, label: 'Required By', value: 'Sep 14, 2026' },
    { icon: 'impact' as const, label: 'Impact', value: 'High' },
  ],
  primaryAction: 'Create Commitment',
  relatedAction: 'View related items (8)',
} as const;

/**
 * The pager counts SCOPE ITEMS, not gaps: fifteen of the 428 the validation
 * reviewed. The KPI row above it is what counts the 34 gaps.
 */
export const PAGINATION = {
  showing: 'Showing 1 to 15 of 428 scope items',
  pages: ['1', '2', '3', '4', '5'],
  rowsPerPage: '25',
} as const;
