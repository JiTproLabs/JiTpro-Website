// All investor sub-site copy lives here.
// Update text in this file; it propagates to all investor pages.

export const investorCopy = {
  home: {
    hero: {
      headline: 'Control before construction.',
      subhead:
        'JiTpro helps growth-stage contractors establish procurement control before mobilization — making unresolved information visible, assigning responsibility, and sequencing decisions against real procurement deadlines.',
      ctaPrimary: 'View Market Thesis',
      ctaSecondary: 'Review Investor Appendix',
    },
    thesis: {
      title: 'The problem is embedded early',
      subtitle:
        'Construction instability is not discovered during execution — it is introduced before execution begins.',
      paragraphs: [
        'Projects routinely start while design decisions remain unresolved, specifications are incomplete, procurement sequencing is undefined, and decision responsibilities are unassigned. This creates hidden schedule instability, margin leakage, and credibility risk from day one.',
        'The industry rewards starting. It does not reward sequencing. The result is that early-phase risk — the most consequential kind — has no true owner.',
        'JiTpro exists to close that gap. It converts ambiguity into structured constraints, assigns responsibility for unresolved information, and aligns decisions to procurement deadlines — before mobilization, not after field chaos begins.',
      ],
    },
    comparison: {
      title: 'Why JiTpro exists',
      subtitle: 'Current industry behavior versus structured procurement control.',
      industryBehavior: [
        'Projects awarded before design is complete',
        'Procurement sequencing left to field teams',
        'Specifications unresolved at mobilization',
        'Decision responsibility undefined',
        'Schedule pressure treated as inevitable',
      ],
      jitproDiscipline: [
        'Ambiguity made visible at award',
        'Procurement sequenced before mobilization',
        'Missing information assigned to responsible parties',
        'Unresolved items treated as schedule constraints',
        'Decisions aligned to procurement deadlines',
      ],
    },
    positioning: {
      title: 'Where JiTpro sits',
      subtitle:
        'An empty layer in the construction technology stack — before ERP, before field management.',
      layers: [
        {
          label: 'ERP / Accounting',
          description: 'Financial reporting, job costing, payroll',
        },
        {
          label: 'Field PM / Collaboration',
          description: 'Daily logs, RFIs, punch lists, document management',
        },
        {
          label: 'JiTpro — Pre-Mobilization Control',
          description: 'Procurement sequencing, constraint visibility, decision accountability',
          highlight: true,
        },
      ],
      footnote: 'Construction timeline flows downward: pre-mobilization → field execution → close-out',
    },
    data: {
      title: 'The data',
      subtitle: 'Key metrics that frame the market opportunity and the cost of inaction.',
    },
    cta: {
      title: 'Explore the full thesis',
      subtitle:
        'Review the market opportunity, examine the hidden economics of early ambiguity, and understand why this category is emerging now.',
    },
  },

  market: {
    hero: {
      title: 'Market Opportunity',
      subtitle:
        'A large, fragmented, underserved market where procurement discipline rarely scales with contractor growth.',
    },
    scale: {
      title: 'U.S. construction at scale',
      body: 'The U.S. construction industry represents nearly $2 trillion in annual spending. Residential construction alone accounts for approximately $890 billion. This is not a niche market — it is one of the largest sectors in the U.S. economy, and one of the least digitized.',
    },
    segmentSpend: {
      title: 'Relevant segment spend',
      body: 'JiTpro targets luxury residential and light commercial general contractors — firms managing projects in the $5M–$20M range. These projects are complex enough to require procurement discipline but are typically managed by firms without structured systems for it.',
    },
    fragmentation: {
      title: 'Firm count and fragmentation',
      body: 'There are approximately 380,000 general contracting establishments in the U.S. across residential and non-residential building. 91% of these firms have fewer than 20 employees. The market is deeply fragmented, with no dominant player in procurement control.',
    },
    growthStage: {
      title: 'The growth-stage GC profile',
      body: 'Approximately 45,000 firms operate in the 10–99 employee range — the core growth-stage segment. These firms are large enough to face procurement complexity but too small to have built internal systems to manage it. They are the primary beneficiaries of structured procurement control.',
      profilePoints: [
        'Typical project value: $5M–$20M',
        'Employee count: 10–99',
        'Annual revenue: $5M–$50M',
        'Procurement method: largely manual (Excel, email, tribal knowledge)',
        'Pain point: schedule instability driven by unresolved early-phase decisions',
      ],
    },
    whyFragmentationMatters: {
      title: 'Why fragmentation matters',
      body: 'Fragmented markets resist enterprise solutions. The tools built for large ENR-ranked contractors do not fit growth-stage firms — they are too expensive, too complex, and designed for workflows these firms do not have. JiTpro is purpose-built for the segment that enterprise tools ignore.',
    },
    notEnterprise: {
      title: 'Why this is not an enterprise-only market',
      body: 'Enterprise construction software vendors focus on firms managing $100M+ projects. Growth-stage contractors managing $5M–$20M projects represent a fundamentally different buyer — one that needs discipline without bureaucracy, structure without overhead. This is an underserved segment by design, not by accident.',
    },
  },

  hiddenCost: {
    hero: {
      title: 'The Hidden Cost of Early Ambiguity',
      subtitle:
        'The most expensive construction failures are not field errors. They are unresolved decisions that compound silently from day one.',
    },
    designClarity: {
      title: 'The cost of incomplete design and specification clarity',
      body: 'When projects begin before design decisions are finalized, every downstream activity inherits that uncertainty. Subcontractors price risk into bids. Procurement timelines become guesses. RFIs multiply. The cost is not a single event — it is a compounding tax on every phase of execution.',
    },
    rework: {
      title: 'Rework and non-productive time',
      body: 'Poor project data drives an estimated $31.3 billion in annual rework costs across the U.S. construction industry. Workers lose an average of 14 hours per week to non-productive tasks — searching for information, waiting for decisions, and redoing work that should not have started.',
    },
    marginFragility: {
      title: 'Margin fragility',
      body: 'General contractors operate on 2–5% net margins. At these margins, a single missed procurement deadline, an unresolved specification, or a late owner selection can eliminate the profit on an entire project. There is no margin for error because there is almost no margin at all.',
    },
    missedDecision: {
      title: 'The cost of one missed decision',
      body: 'On a $10M project, daily overhead and carry costs range from $10,000 to $50,000. A single week of delay caused by an unresolved owner selection or a late specification decision can cost $70,000–$350,000 — often exceeding the entire project profit.',
    },
    delayEconomics: {
      title: 'Delay economics',
      body: '70% of projects experience delays due to late owner selections. These delays are not caused by field execution problems — they are caused by decisions that were never assigned, never tracked, and never aligned to procurement deadlines. The cost is real, but the cause is invisible without structured procurement control.',
    },
    rfiDensity: {
      title: 'RFI density and downstream churn',
      body: 'Industry data suggests approximately 10 RFIs per $1 million of project value. Each RFI represents a gap in information that was not resolved before work began. RFIs are not just administrative overhead — they are evidence of early-phase ambiguity flowing downstream into execution.',
    },
  },

  whyNow: {
    hero: {
      title: 'Why Now',
      subtitle:
        'Structural changes in the construction industry are making procurement control more urgent than at any point in the last two decades.',
    },
    supplyChain: {
      title: 'Supply-chain volatility',
      body: 'Lead times in some material categories have increased by 300% or more since 2020. Long-lead items that once required 8–12 weeks now require 24–36 weeks. This makes procurement sequencing — knowing what to order, when, and from whom — a schedule-critical discipline, not an administrative task.',
    },
    labor: {
      title: 'Labor constraints',
      body: 'The construction workforce is aging and shrinking. Skilled labor shortages mean that schedule disruptions caused by procurement failures cannot be recovered through overtime or additional crews. When the schedule slips, it stays slipped.',
    },
    complexity: {
      title: 'Rising complexity',
      body: 'Building systems are more integrated, material options are more varied, and owner expectations are higher than ever. The number of decisions required before mobilization has increased, but the systems for managing those decisions have not kept pace.',
    },
    ownerExpectations: {
      title: 'Increasing owner expectations',
      body: 'Owners — particularly in luxury residential — expect predictability. They expect their contractor to know what needs to happen, when, and to communicate proactively. Contractors without structured procurement control cannot deliver on this expectation consistently.',
    },
    spreadsheetFailure: {
      title: 'Why spreadsheets break at scale',
      body: 'Over 60% of contractors still manage procurement workflows using Excel or manual methods. Spreadsheets work for simple projects. They do not work when a firm is managing multiple concurrent projects with hundreds of procurement items, dozens of subcontractors, and compressed timelines.',
    },
    procurementDrivesSchedule: {
      title: 'Why procurement now drives schedule stability',
      body: 'In a world of stable supply chains and abundant labor, procurement was administrative. In today\'s environment, procurement is the single largest determinant of schedule stability. The firms that control procurement before mobilization will outperform those that react to it during execution.',
    },
  },

  product: {
    hero: {
      title: 'Product',
      subtitle:
        'JiTpro is the Early Execution Control System for growth-stage contractors. Not procurement consulting. Not a field management tool. Not an ERP.',
    },
    whatItIs: {
      title: 'What JiTpro is',
      body: 'JiTpro is a structured system that makes pre-mobilization ambiguity visible, assigns responsibility for unresolved information, and sequences procurement decisions against real deadlines. It operates in the gap between contract award and field mobilization — the highest-leverage phase of any construction project.',
    },
    whatItIsNot: {
      title: 'What JiTpro is not',
      items: [
        'Not procurement consulting — JiTpro is software, not a service engagement',
        'Not a field management tool — JiTpro operates before field work begins',
        'Not an ERP — JiTpro does not replace accounting, payroll, or job costing systems',
        'Not a document management system — JiTpro manages decisions, not documents',
        'Not a point fix — JiTpro is a system that enforces discipline across the pre-mobilization phase',
      ],
    },
    howItWorks: {
      title: 'How it works',
      steps: [
        {
          title: 'Identify procurement tasks',
          description: 'At contract award, JiTpro identifies every procurement action required across the project — materials, equipment, subcontractor commitments, owner selections, and design decisions.',
        },
        {
          title: 'Assign responsibility',
          description: 'Every unresolved item is assigned to a responsible party — the owner, architect, engineer, subcontractor, or GC team member who must deliver the decision or information.',
        },
        {
          title: 'Sequence against deadlines',
          description: 'Each item is tied to a required-onsite date and worked backward to establish the latest allowable decision date. This creates a decision-driven schedule, not an activity-driven one.',
        },
        {
          title: 'Surface constraints',
          description: 'Items that cannot proceed due to missing information are flagged as constraints. The team can see exactly what is blocking procurement and who is responsible for resolving it.',
        },
        {
          title: 'Enforce weekly accountability',
          description: 'A structured weekly rhythm ensures that unresolved items are reviewed, responsible parties are held accountable, and the team acts before deadlines pass.',
        },
      ],
    },
    weeklyRhythm: {
      title: 'Weekly accountability rhythm',
      body: 'JiTpro enforces a weekly cadence of constraint review and decision tracking. This is not a meeting — it is a system-driven process that ensures procurement items advance on schedule and that responsible parties are accountable for their commitments.',
    },
    systemNotFix: {
      title: 'Why this is a system, not a point fix',
      body: 'A point fix addresses one symptom. JiTpro addresses the structural absence of procurement discipline in growth-stage contracting firms. It is not a tool that helps with one task — it is a system that changes how the pre-mobilization phase is managed.',
    },
  },

  economics: {
    hero: {
      title: 'Economic Case',
      subtitle:
        'At 2–5% net margins, the economics of procurement control are not optional — they are existential.',
    },
    marginBehavior: {
      title: 'Why 2–5% margins change buying behavior',
      body: 'When net margins are 2–5%, every dollar of avoidable cost matters. Contractors at this margin level do not buy software for convenience — they buy it because the cost of not having it is demonstrably higher than the cost of the tool. JiTpro\'s value proposition is not efficiency. It is margin protection.',
    },
    avoidedDelay: {
      title: 'How one avoided delay can justify software spend',
      body: 'On a $10M project with $10,000–$50,000 in daily carry costs, avoiding a single week of procurement-driven delay saves $70,000–$350,000. JiTpro\'s cost per project is a fraction of the cost of one avoided delay. The ROI is not theoretical — it is arithmetic.',
    },
    asymmetry: {
      title: 'Why early control is economically asymmetric',
      body: 'The cost of establishing procurement control before mobilization is small. The cost of failing to do so — rework, delays, margin erosion, credibility damage — is large and compounding. This is not a marginal improvement. It is an asymmetric investment: small cost, disproportionate downside protection.',
    },
    pricingLogic: {
      title: 'Pricing logic relative to project economics',
      body: 'JiTpro is priced relative to project value, not headcount or seat licenses. This aligns the cost of the tool with the value it protects. A contractor managing a $10M project is not paying for software — they are paying for margin insurance.',
    },
    firstWin: {
      title: 'The first win is avoided leakage',
      body: 'JiTpro\'s value is not labor savings or time-tracking improvements. The first and most tangible win is avoided leakage — margin that would have been lost to unresolved decisions, missed procurement windows, and reactive schedule recovery. This is the value that contractors feel immediately.',
    },
    illustrativeModel: {
      title: 'Illustrative: $10M project economics',
      subtitle: 'The following figures are illustrative and represent plausible ranges based on industry data.',
      rows: [
        { label: 'Project value', value: '$10,000,000' },
        { label: 'Typical GC net margin (3%)', value: '$300,000' },
        { label: 'Daily carry/overhead cost', value: '$10,000–$50,000' },
        { label: 'Cost of 1-week delay', value: '$70,000–$350,000' },
        { label: 'Rework exposure (industry avg)', value: '$150,000–$300,000' },
        { label: 'Margin at risk from early ambiguity', value: '$220,000–$650,000' },
        { label: 'JiTpro cost per project', value: 'A fraction of one avoided delay' },
      ],
      footnote: 'Ranges are illustrative based on industry benchmarks. Actual outcomes vary by project type, region, and firm capability.',
    },
  },

  appendix: {
    hero: {
      title: 'Investor Appendix',
      subtitle:
        'Source documentation, verification status, and methodological notes for all data referenced in this presentation.',
    },
    glossary: [
      { term: 'GC', definition: 'General Contractor — the firm responsible for overall project execution' },
      { term: 'RFI', definition: 'Request for Information — a formal question submitted during construction to clarify design intent or resolve ambiguity' },
      { term: 'Submittal', definition: 'A document submitted by a subcontractor or supplier for review and approval before fabrication or procurement' },
      { term: 'Procurement', definition: 'The process of identifying, ordering, and receiving materials, equipment, and subcontractor services required for construction' },
      { term: 'Mobilization', definition: 'The phase when a contractor moves resources, equipment, and personnel to the project site to begin work' },
      { term: 'Pre-mobilization', definition: 'The phase between contract award and field mobilization — when procurement sequencing, design resolution, and decision assignments should occur' },
      { term: 'Lead time', definition: 'The duration between placing an order and receiving the material or equipment on site' },
      { term: 'Buyout', definition: 'The process of executing subcontracts and purchase orders after the GC is awarded the project' },
      { term: 'TAM', definition: 'Total Addressable Market — the total revenue opportunity available if 100% market share were achieved' },
      { term: 'SAM', definition: 'Serviceable Addressable Market — the portion of the TAM that can be served by the company\'s products and business model' },
      { term: 'ERP', definition: 'Enterprise Resource Planning — integrated software systems for financial management, job costing, payroll, and operational reporting' },
      { term: 'NAICS', definition: 'North American Industry Classification System — the standard system used to classify business establishments by type of economic activity' },
      { term: 'ENR', definition: 'Engineering News-Record — the construction industry\'s leading trade publication, known for its annual rankings of the largest contractors' },
    ],
  },
};
