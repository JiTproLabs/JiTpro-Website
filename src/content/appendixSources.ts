export interface AppendixSource {
  id: string;
  statId: string;
  sourceName: string;
  sourceUrl?: string; // Insert verified URL when available
  publicationYear?: string;
  verificationStatus: 'verified' | 'provisional' | 'derived';
  dataType: 'direct' | 'proxy' | 'derived';
  notes?: string;
}

// Provisional — verify all sources before investor distribution.
// Insert sourceUrl values as citations are confirmed.

export const appendixSources: AppendixSource[] = [
  {
    id: 'src-1',
    statId: 'total-construction-spend',
    sourceName: 'U.S. Census Bureau — Value of Construction Put in Place Survey (VIP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2024',
    verificationStatus: 'provisional',
    dataType: 'direct',
    notes: 'Annual total value of construction put in place. Includes residential, non-residential, and public construction.',
  },
  {
    id: 'src-2',
    statId: 'residential-spend',
    sourceName: 'U.S. Census Bureau — Value of Construction Put in Place Survey (VIP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2024',
    verificationStatus: 'provisional',
    dataType: 'direct',
    notes: 'Residential subset of total construction spending. Includes single-family, multi-family, and residential improvements.',
  },
  {
    id: 'src-3',
    statId: 'firm-fragmentation',
    sourceName: 'U.S. Census Bureau — County Business Patterns (CBP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2022',
    verificationStatus: 'provisional',
    dataType: 'direct',
    notes: 'Percentage of NAICS 236 (Construction of Buildings) establishments with fewer than 20 employees.',
  },
  {
    id: 'src-4',
    statId: 'residential-gc-count',
    sourceName: 'U.S. Census Bureau — County Business Patterns (CBP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2022',
    verificationStatus: 'provisional',
    dataType: 'direct',
    notes: 'Count of establishments under NAICS 236115 (New Single-Family Housing Construction) and NAICS 236116 (New Multifamily Housing Construction).',
  },
  {
    id: 'src-5',
    statId: 'total-target-firms',
    sourceName: 'U.S. Census Bureau — County Business Patterns (CBP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2022',
    verificationStatus: 'derived',
    dataType: 'derived',
    notes: 'Derived by summing NAICS 2361 (Residential Building Construction) and NAICS 2362 (Nonresidential Building Construction) establishment counts. Excludes heavy civil and specialty trades.',
  },
  {
    id: 'src-6',
    statId: 'core-growth-stage',
    sourceName: 'U.S. Census Bureau — County Business Patterns (CBP)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2022',
    verificationStatus: 'derived',
    dataType: 'derived',
    notes: 'Subset of NAICS 236 establishments filtered to the 10–99 employee size class. Represents the core growth-stage contractor segment.',
  },
  {
    id: 'src-7',
    statId: 'annual-rework-cost',
    sourceName: 'FMI Corporation and PlanGrid — Construction Disconnected Report',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2018',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Estimated annual cost of rework in U.S. construction attributed to poor data and miscommunication. Widely cited; original methodology based on survey data and extrapolation.',
  },
  {
    id: 'src-8',
    statId: 'non-productive-hours',
    sourceName: 'FMI Corporation and PlanGrid — Construction Disconnected Report',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2018',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Self-reported hours per week lost to non-productive activities including searching for project data, conflict resolution, and rework management.',
  },
  {
    id: 'src-9',
    statId: 'gc-net-margin',
    sourceName: 'CFMA — Construction Financial Management Association Annual Financial Survey',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2023',
    verificationStatus: 'provisional',
    dataType: 'direct',
    notes: 'Median net profit margin range for general contractors. Varies by firm size, project type, and region. The 2–5% range is broadly consistent across multiple industry sources.',
  },
  {
    id: 'src-10',
    statId: 'precon-margin-lift',
    sourceName: 'McKinsey & Company — Construction Industry Reports',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2020',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Directional finding that firms with strong preconstruction practices achieve meaningfully higher margins. The 20% figure is a representative estimate; exact methodology varies across reports.',
  },
  {
    id: 'src-11',
    statId: 'lead-time-increase',
    sourceName: 'Associated General Contractors of America (AGC) — Industry Surveys',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2023',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Lead-time increases for specific material categories (e.g., electrical switchgear, HVAC equipment, structural steel). The 300% figure represents peak increases in certain categories, not an industry average.',
  },
  {
    id: 'src-12',
    statId: 'manual-procurement',
    sourceName: 'JBKnowledge — Construction Technology Report (ConTech Report)',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2023',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Survey-based data on technology adoption in construction. The 60%+ figure reflects respondents reporting Excel or manual methods as their primary procurement workflow tool.',
  },
  {
    id: 'src-13',
    statId: 'daily-carry-cost',
    sourceName: 'Industry estimate — general contractor operating cost benchmarks',
    publicationYear: '2024',
    verificationStatus: 'derived',
    dataType: 'derived',
    notes: 'Estimated range based on typical general conditions, overhead allocation, and financing costs for a $10M project. Not sourced from a single publication. Range varies significantly by project type, region, and contract structure.',
  },
  {
    id: 'src-14',
    statId: 'late-owner-selections',
    sourceName: 'Industry surveys — construction delay cause analysis',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2022',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Multiple industry surveys cite owner-driven decisions (material selections, design approvals, change orders) as a leading cause of project delays. The 70% figure is a representative estimate from aggregated survey data.',
  },
  {
    id: 'src-15',
    statId: 'rfi-density',
    sourceName: 'Navigant Construction Forum — RFI and change order analysis',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2019',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Estimated RFI density per million dollars of project value. Actual density varies by project complexity, design completeness, and delivery method.',
  },
  {
    id: 'src-16',
    statId: 'on-time-on-budget',
    sourceName: 'McKinsey & Company / InEight — Global Construction Survey',
    // sourceUrl: '', // Insert verified URL
    publicationYear: '2020',
    verificationStatus: 'provisional',
    dataType: 'proxy',
    notes: 'Percentage of construction projects completed on time and within budget. Based on global survey data. U.S.-specific figures may differ but are directionally consistent.',
  },
];
