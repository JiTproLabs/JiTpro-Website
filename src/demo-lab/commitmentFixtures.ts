/**
 * PROTOTYPE LAB FIXTURE DATA - Commitment Register.
 *
 * TEMPORARY. This directory is a visual-validation lab, not the production
 * demo system. Nothing here is wired into the website, and none of it is the
 * approved fixture architecture from the audit report. It exists so the two
 * prototypes can be built without hardcoding strings into JSX.
 *
 * Every value below is REFERENCE-VERIFIED: transcribed from
 * `assets-src/methodology/commitment-capture.png` at 2x-4x zoom during the
 * forensic measurement pass. Nothing is invented.
 */

export type Status = 'on-track' | 'at-risk' | 'overdue';

export type CommitmentRow = {
  id: string;
  type: string;
  title: string;
  description: string;
  /**
   * The organization or project entity that OWES the commitment. Deliberately
   * not "external party": it is not necessarily external (the General
   * Contractor and the Project Owner both appear), and it is never the
   * supplier, manufacturer, or product source merely because that party is
   * named in the description. COM-021 is the worked example: Pietra Fina
   * supplies the marble, but the Project Owner owes the selection.
   */
  responsibleOrg: string;
  ownerInitials: string;
  ownerName: string;
  ownerRole: string;
  status: Status;
  commitmentDate: string;
  targetDate: string;
};

export const PROJECT = {
  name: 'Oak Ridge Residence',
  location: 'Mountain View, CO',
} as const;

export const USER = {
  initials: 'JA',
  name: 'John Anderson',
  role: 'Preconstruction Manager',
} as const;

export const NAV_ITEMS = [
  'Project Overview',
  'Scope',
  'Products',
  'Commitments',
  'Schedule',
  'Reports',
] as const;

export const PAGE = {
  title: 'Commitment Register',
  subtitle: 'Oak Ridge Residence',
  description: 'Track and manage all external commitments and obligations for the project.',
} as const;

export type KpiCard = {
  icon: 'list' | 'check' | 'clock' | 'alert' | 'question';
  value: string;
  label: string;
  /** Only "On Track" colours its numeral in the reference (spec R-6). */
  tone: 'neutral' | 'ok' | 'warn' | 'error';
};

export const KPI_CARDS: KpiCard[] = [
  { icon: 'list', value: '23', label: 'Total Commitments', tone: 'neutral' },
  { icon: 'check', value: '16', label: 'On Track', tone: 'ok' },
  { icon: 'clock', value: '5', label: 'At Risk', tone: 'warn' },
  { icon: 'alert', value: '2', label: 'Overdue', tone: 'error' },
  { icon: 'question', value: '0', label: 'Pending Review', tone: 'neutral' },
];

export const TOOLBAR = {
  searchPlaceholder: 'Search commitments...',
  selects: ['All Statuses', 'All Types', 'All Owners', 'All External Parties'],
  filtersLabel: 'Filters',
} as const;

/**
 * Column widths. The Value column is REMOVED (product-scope correction): JiTpro
 * does not manage budgets, costs, pricing, or contract values, so the reference
 * raster's Value column is an intentional departure from strict reproduction.
 *
 * Its 116px is redistributed to the columns that were demonstrably cramped
 * rather than spread evenly: Title / Description (+23) and External Party (+29)
 * were both wrapping to two lines, and Target Date (+50) now hosts the
 * right-aligned action button that previously lived in the Value cell. The
 * eight widths still sum to the measured 943px table content width, so the
 * table's outer geometry and every other measured landmark are unchanged.
 */
export const COLUMNS = [
  { key: 'id', label: 'Commitment ID', width: 81 },
  { key: 'type', label: 'Commitment Type', width: 95 },
  { key: 'title', label: 'Title / Description', width: 246 },
  { key: 'org', label: 'Responsible Organization', width: 118 },
  { key: 'owner', label: 'Commitment Owner', width: 102 },
  { key: 'status', label: 'Status', width: 82 },
  { key: 'commitmentDate', label: 'Commitment Date', width: 93 },
  { key: 'targetDate', label: 'Target Date', width: 126 },
] as const;

export const ROWS: CommitmentRow[] = [
  {
    id: 'COM-023',
    type: 'Pending Design',
    title: 'Architectural Revision Set',
    description:
      'Issue coordinated architectural revision set incorporating current design changes and resolved details',
    responsibleOrg: 'Sierra Ridge Architects',
    ownerInitials: 'JS',
    ownerName: 'Jane Smith',
    ownerRole: 'Lead Architect',
    status: 'on-track',
    commitmentDate: 'Aug 15, 2026',
    targetDate: 'Sep 05, 2026',
  },
  {
    id: 'COM-022',
    type: 'Pending Design',
    title: 'Architectural Coordination',
    description:
      'Resolve major architectural coordination across interiors, structure, glazing, and building systems',
    responsibleOrg: 'Sierra Ridge Architects',
    ownerInitials: 'JS',
    ownerName: 'Jane Smith',
    ownerRole: 'Lead Architect',
    status: 'at-risk',
    commitmentDate: 'Aug 14, 2026',
    targetDate: 'Sep 02, 2026',
  },
  {
    id: 'COM-021',
    type: 'Owner Selection',
    title: 'Statuary Marble Slabs',
    description:
      'Select and approve Statuary marble slabs from Pietra Fina for designated interior applications',
    // Pietra Fina is the material source, NOT the responsible organization.
    responsibleOrg: 'Project Owner',
    ownerInitials: 'EM',
    ownerName: 'Elizabeth Morgan',
    ownerRole: 'Owner',
    status: 'on-track',
    commitmentDate: 'Aug 10, 2026',
    targetDate: 'Aug 28, 2026',
  },
  {
    id: 'COM-020',
    type: 'Owner Selection',
    title: 'Casework Finish Approval',
    description: 'Approve final casework finish, color, sheen, and representative control sample',
    responsibleOrg: 'Project Owner',
    ownerInitials: 'EM',
    ownerName: 'Elizabeth Morgan',
    ownerRole: 'Owner',
    status: 'on-track',
    commitmentDate: 'Aug 05, 2026',
    targetDate: 'Aug 20, 2026',
  },
  {
    id: 'COM-019',
    type: 'Subcontract Buyout',
    title: 'Exterior Glazing Buyout',
    description: 'Finalize scope, exclusions, and award of the exterior glazing subcontract',
    responsibleOrg: 'General Contractor',
    ownerInitials: 'DB',
    ownerName: 'Daniel Brooks',
    ownerRole: 'Project Manager',
    status: 'at-risk',
    commitmentDate: 'Aug 03, 2026',
    targetDate: 'Aug 25, 2026',
  },
  {
    id: 'COM-018',
    type: 'Structural Engineering',
    title: 'Structural Steel Coordination',
    description:
      'Complete structural engineering coordination and issue required steel connection and framing information',
    responsibleOrg: 'Westline Structural Engineers',
    ownerInitials: 'MC',
    ownerName: 'Michael Chen',
    ownerRole: 'Structural Engineer',
    status: 'on-track',
    commitmentDate: 'Jul 30, 2026',
    targetDate: 'Aug 22, 2026',
  },
  {
    id: 'COM-017',
    type: 'Permit / Agency',
    title: 'Building Permit Corrections',
    description: 'Resolve outstanding plan-check comments required for building permit issuance',
    responsibleOrg: 'Town of Mountain View Building Department',
    ownerInitials: 'LM',
    ownerName: 'Laura Martinez',
    ownerRole: 'Senior Plans Examiner',
    status: 'overdue',
    commitmentDate: 'Jul 22, 2026',
    targetDate: 'Aug 12, 2026',
  },
  /* COM-016 is UNCHANGED, pending a separate decision. */
  {
    id: 'COM-016',
    type: 'Subcontract',
    title: 'Concrete Foundation',
    description: 'Mobilize and install concrete foundation',
    responsibleOrg: 'Pinnacle Concrete Construction',
    ownerInitials: 'AW',
    ownerName: 'Amy Wong',
    ownerRole: 'Contracts Manager',
    status: 'on-track',
    commitmentDate: 'Jul 18, 2026',
    targetDate: 'Aug 15, 2026',
  },
];

export const STATUS_LABEL: Record<Status, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  overdue: 'Overdue',
};

/** The detail panel, transcribed field for field. */
export const DETAIL = {
  eyebrow: 'Commitment Detail',
  title: 'Architectural Revision Set',
  status: 'on-track' as Status,
  overviewHeading: 'Commitment Overview',
  fields: [
    { label: 'Commitment ID', value: 'COM-023' },
    { label: 'Type', value: 'Pending Design' },
    {
      label: 'Description',
      value:
        'Issue coordinated architectural revision set incorporating current design changes and resolved details',
    },
    { label: 'Responsible Organization', value: 'Sierra Ridge Architects' },
  ],
  owner: { label: 'Commitment Owner', initials: 'JS', name: 'Jane Smith', role: 'Lead Architect' },
  fieldsAfterOwner: [
    { label: 'Status', value: 'On Track' },
    { label: 'Commitment Date', value: 'Aug 15, 2026' },
    { label: 'Target Date', value: 'Sep 05, 2026' },
  ],
  relatedHeading: 'Related Information',
  related: [
    {
      icon: 'file' as const,
      label: 'Source Documents',
      lines: ['Exterior Elevations A3.10, A3.11', 'Window Schedule A6.01'],
    },
    { icon: 'package' as const, label: 'Linked Packages', lines: ['Exterior Enclosure, Glazing'] },
    { icon: 'link' as const, label: 'Related Commitments', lines: ['COM-022, COM-016'] },
  ],
  notesHeading: 'Notes',
  notes: 'Final submittal and shop drawings required prior to procurement.',
  primaryAction: 'Edit Commitment',
  secondaryAction: 'View activity history',
} as const;

/**
 * Pagination. The reference is internally inconsistent (spec R-7): it says
 * "1 to 8 of 23" with "Rows per page: 25" and offers 5 pages. Prototype A
 * reproduces that literally; Prototype B corrects it.
 */
export const PAGINATION_A = {
  showing: 'Showing 1 to 8 of 23 commitments',
  pages: ['1', '2', '3', '…', '5'],
  rowsPerPage: '25',
} as const;

export const PAGINATION_B = {
  showing: 'Showing 1 to 8 of 23 commitments',
  pages: ['1', '2', '3'],
  rowsPerPage: '8',
} as const;
