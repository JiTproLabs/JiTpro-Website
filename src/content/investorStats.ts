export interface InvestorStat {
  id: string;
  value: string;
  label: string;
  sourceShortName: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  verificationStatus: 'verified' | 'provisional' | 'derived';
  footnoteKey: string;
  note?: string;
}

// Provisional — all stats should be verified before investor distribution.
// Update values here; they propagate to all pages and the appendix.

export const investorStats: InvestorStat[] = [
  {
    id: 'total-construction-spend',
    value: '$1.98T',
    label: 'Total U.S. construction spend',
    sourceShortName: 'U.S. Census Bureau',
    confidenceLevel: 'high',
    verificationStatus: 'provisional',
    footnoteKey: '1',
    note: 'Annual value of construction put in place',
  },
  {
    id: 'residential-spend',
    value: '$890B',
    label: 'U.S. residential construction spend',
    sourceShortName: 'U.S. Census Bureau',
    confidenceLevel: 'high',
    verificationStatus: 'provisional',
    footnoteKey: '2',
  },
  {
    id: 'firm-fragmentation',
    value: '91%',
    label: 'of construction firms have fewer than 20 employees',
    sourceShortName: 'Census County Business Patterns',
    confidenceLevel: 'high',
    verificationStatus: 'provisional',
    footnoteKey: '3',
  },
  {
    id: 'residential-gc-count',
    value: '350K+',
    label: 'Residential general contracting establishments in the U.S.',
    sourceShortName: 'Census County Business Patterns',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '4',
  },
  {
    id: 'total-target-firms',
    value: '~380K',
    label: 'Total target firms (residential + non-res building GCs)',
    sourceShortName: 'Census County Business Patterns',
    confidenceLevel: 'medium',
    verificationStatus: 'derived',
    footnoteKey: '5',
    note: 'Derived from NAICS 236 establishment counts',
  },
  {
    id: 'core-growth-stage',
    value: '~45K',
    label: 'Core growth-stage firms (10–99 employees)',
    sourceShortName: 'Census County Business Patterns',
    confidenceLevel: 'medium',
    verificationStatus: 'derived',
    footnoteKey: '6',
    note: 'Subset of target firms filtered by employee count',
  },
  {
    id: 'annual-rework-cost',
    value: '$31.3B',
    label: 'Annual rework cost due to poor project data',
    sourceShortName: 'FMI/PlanGrid',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '7',
  },
  {
    id: 'non-productive-hours',
    value: '14 hrs/wk',
    label: 'Lost to non-productive tasks per worker',
    sourceShortName: 'FMI/PlanGrid',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '8',
  },
  {
    id: 'gc-net-margin',
    value: '2–5%',
    label: 'Average GC net profit margin',
    sourceShortName: 'CFMA Financial Survey',
    confidenceLevel: 'high',
    verificationStatus: 'provisional',
    footnoteKey: '9',
  },
  {
    id: 'precon-margin-lift',
    value: '20%',
    label: 'Higher profit margins with strong preconstruction discipline',
    sourceShortName: 'McKinsey / Industry Reports',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '10',
  },
  {
    id: 'lead-time-increase',
    value: '300%',
    label: 'Lead-time increase in some material categories',
    sourceShortName: 'AGC / Industry Surveys',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '11',
  },
  {
    id: 'manual-procurement',
    value: '60%+',
    label: 'Use Excel or manual methods for procurement workflows',
    sourceShortName: 'JBKnowledge ConTech Report',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '12',
  },
  {
    id: 'daily-carry-cost',
    value: '$10–50K',
    label: 'Daily overhead/carry cost on a $10M project',
    sourceShortName: 'Industry estimate',
    confidenceLevel: 'low',
    verificationStatus: 'derived',
    footnoteKey: '13',
    note: 'Range varies by project type and region',
  },
  {
    id: 'late-owner-selections',
    value: '70%',
    label: 'Of projects experience delays due to late owner selections',
    sourceShortName: 'Industry surveys',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '14',
  },
  {
    id: 'rfi-density',
    value: '10 RFIs',
    label: 'Per $1M of project value',
    sourceShortName: 'Navigant / Industry data',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '15',
  },
  {
    id: 'on-time-on-budget',
    value: '30%',
    label: 'Of contractors finish on time and on budget',
    sourceShortName: 'McKinsey / InEight',
    confidenceLevel: 'medium',
    verificationStatus: 'provisional',
    footnoteKey: '16',
  },
];

export function getStatById(id: string): InvestorStat | undefined {
  return investorStats.find((s) => s.id === id);
}

export function getStatsByIds(ids: string[]): InvestorStat[] {
  return ids.map((id) => investorStats.find((s) => s.id === id)).filter(Boolean) as InvestorStat[];
}
