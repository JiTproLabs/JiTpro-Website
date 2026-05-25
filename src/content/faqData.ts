export type AnswerBlock = string | string[];

export interface FaqItem {
  question: string;
  answer: AnswerBlock[];
}

export interface FaqSection {
  id: string;
  title: string;
  intro: string;
  items: FaqItem[];
}

export const faqSections: FaqSection[] = [
  {
    id: 'general',
    title: 'General Questions',
    intro: 'Core concepts behind JiTpro’s approach to procurement stability and operational control in construction.',
    items: [
      {
        question: 'What is JiTpro?',
        answer: [
          'JiTpro is a procurement strategy and constraint management system built for growth-stage general contractors in luxury residential and light commercial construction. It focuses on stabilizing projects before procurement failures damage schedules, labor flow, and profit margins.',
        ],
      },
      {
        question: 'Who is JiTpro designed for?',
        answer: [
          'JiTpro is designed primarily for:',
          [
            'High-end residential general contractors',
            'Light commercial contractors',
            'Winery and hospitality builders',
            'Architect-driven construction firms',
            'Growth-stage contractors typically operating between $5M–$150M annually',
          ],
        ],
      },
      {
        question: 'What problem does JiTpro solve?',
        answer: [
          'JiTpro addresses the procurement-driven operational instability that develops between project award and field execution — the same instability that silently compounds into schedule disruption and margin erosion throughout the project lifecycle.',
          'Most schedule failures originate upstream as unresolved procurement constraints begin impacting:',
          [
            'Buyout',
            'Scope clarification',
            'Submittals',
            'Design coordination',
            'Approvals',
            'Fabrication',
            'Delivery planning',
          ],
          'When procurement instability is not controlled early, contractors are often forced into reactive management conditions involving stacked trades, labor disruption, expediting, overtime, rework, and schedule compression — all of which progressively erode margin.',
          'JiTpro exists to ensure contractors maintain operational control by exposing procurement constraints before they destabilize the project.',
        ],
      },
      {
        question: 'Why does JiTpro focus on procurement?',
        answer: [
          'Because procurement is where schedules begin to destabilize. Long before trades fall behind onsite, projects are already being impacted by unresolved constraints, incomplete information, delayed approvals, and procurement bottlenecks.',
        ],
      },
      {
        question: 'What does "constraint management" mean?',
        answer: [
          'Constraint management means identifying, tracking, sequencing, and resolving issues that prevent procurement activities from progressing on time. These may include:',
          [
            'Missing design information',
            'Unapproved selections',
            'Long lead items',
            'Incomplete scope',
            'RFIs',
            'Fabrication dependencies',
            'Coordination conflicts',
            'Owner decision delays',
          ],
        ],
      },
      {
        question: 'What does JiTpro mean by "projects destabilize upstream"?',
        answer: [
          'It means that most field problems are actually symptoms of unresolved procurement and coordination failures that occurred months earlier.',
        ],
      },
    ],
  },
  {
    id: 'procurement-philosophy',
    title: 'Procurement Philosophy & Operational Control',
    intro: 'How JiTpro approaches procurement sequencing, constraint management, and schedule stabilization differently from traditional methods.',
    items: [
      {
        question: 'How is JiTpro different from expediting?',
        answer: [
          'Traditional expediting often reacts blindly, or after problems occur. JiTpro focuses on identifying the causes of procurement instability before schedules begin to break.',
        ],
      },
      {
        question: 'Does JiTpro build procurement schedules?',
        answer: [
          'Yes. JiTpro develops procurement sequencing frameworks that work backward from required onsite dates (RoSD) and schedule dependencies. Each part of the procurement sequence is detailed with accurate durations and logic.',
        ],
      },
      {
        question: 'What is a Required on Site Date (RoSD)?',
        answer: [
          'RoSD refers to the date a product, material, or service must physically arrive onsite to support the construction schedule without impacting downstream work.',
        ],
      },
      {
        question: 'Is JiTpro built on CPM scheduling methodology?',
        answer: [
          'No. JiTpro operates from a fundamentally different philosophy. Traditional CPM schedules model activities after assumptions are embedded into the project schedule. JiTpro focuses on identifying and stabilizing the procurement timelines and constraints that cause schedules to become unreliable in the first place.',
        ],
      },
      {
        question: 'Does JiTpro track long-lead items?',
        answer: [
          'Yes. However, JiTpro operates from the belief that projects are often destabilized by procurement items assumed to be “easy” or “short lead” because operational focus becomes concentrated on a handful of obvious long-lead materials. JiTpro treats all procurement items with equal operational respect by clearly defining timelines, sequencing requirements, and constraint accountability across the entire procurement process.',
        ],
      },
      {
        question: 'Can JiTpro help reduce schedule compression?',
        answer: [
          'Yes. Early procurement clarity and sequencing discipline is proven to drastically reduce stacked trades, rushed approvals, late deliveries, and recovery-driven schedule compression.',
        ],
      },
      {
        question: 'Does JiTpro guarantee that everything will arrive when desired?',
        answer: [
          'No.',
          'JiTpro does not guarantee that procurement durations can be compressed beyond operational reality. JiTpro is not schedule compression magic.',
          'JiTpro is designed to ensure that procurement activities are properly sequenced, constraints are identified early, and durations are built around defensible operational logic to provide the most accurate possible representation of when products, materials, and services can realistically arrive onsite.',
          'One of the core philosophies behind JiTpro is that procurement processes require real time regardless of pressure, urgency, or project theatrics. Contractors often attempt to force procurement activities into unrealistic construction schedules by arbitrarily shortening durations, overlapping unresolved constraints, or relying on aggressive expediting assumptions.',
          'While this may temporarily create the appearance of schedule alignment, it frequently introduces compounding operational risk throughout the project lifecycle.',
          'JiTpro focuses on exposing operational reality rather than masking it.',
          'The objective is not to create artificially optimistic schedules. The objective is to establish defensible procurement logic, maintain operational control, and expose schedule instability early enough for informed decision-making to occur.',
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Services & Engagement',
    intro: 'How JiTpro engagements are structured, what they include, and how they integrate with your existing operations.',
    items: [
      {
        question: 'Is JiTpro currently a consulting service or software?',
        answer: [
          'Currently, JiTpro operates as a service-led procurement advisory platform supported by purpose-built tools and software infrastructure.',
        ],
      },
      {
        question: 'What does JiTpro Consulting include?',
        answer: [
          'Typical engagements may include:',
          [
            'Procurement readiness analysis',
            'Constraint identification',
            'Procurement sequencing',
            'Scope clarification',
            'Long lead analysis',
            'Procurement schedule development',
            'Responsibility tracking',
            'Procurement risk visibility',
            'Procurement stabilization support',
          ],
        ],
      },
      {
        question: 'Does JiTpro work on a per-project basis?',
        answer: [
          'Yes. Current engagements are generally structured around individual projects.',
        ],
      },
      {
        question: 'How long does a JiTpro engagement last?',
        answer: [
          'Duration depends on project complexity, procurement exposure, and the stage of the project when engagement begins.',
        ],
      },
      {
        question: 'Can JiTpro be brought in after a project is already struggling?',
        answer: [
          'JiTpro is not a recovery system. It is designed to prevent procurement instability from pushing projects into reactive management conditions in the first place.',
        ],
      },
      {
        question: 'Does JiTpro manage subcontractors?',
        answer: [
          'No. JiTpro does not replace project management responsibilities or subcontractor management. It helps expose and organize procurement-related risk and dependencies.',
        ],
      },
      {
        question: 'Can JiTpro work remotely?',
        answer: [
          'Yes. Much of JiTpro’s procurement analysis, sequencing development, constraint management, and operational coordination can be performed remotely while still maintaining procurement visibility and control.',
        ],
      },
    ],
  },
  {
    id: 'software-ai',
    title: 'Software, Platform & AI',
    intro: 'JiTpro’s technology infrastructure, platform evolution, and the role of AI in supporting procurement control.',
    items: [
      {
        question: 'Is JiTpro project management software?',
        answer: [
          'No. JiTpro is not intended to replace traditional project management platforms. It operates alongside, and upstream of existing systems and focuses specifically on procurement readiness, sequencing discipline, and constraint management.',
        ],
      },
      {
        question: 'Is JiTpro building a SaaS platform?',
        answer: [
          'Yes.',
          'Procurement instability is fundamentally an information and operational control problem. Maintaining visibility across procurement timelines, sequencing dependencies, constraints, approvals, fabrication status, and delivery coordination at scale requires purpose-built software infrastructure.',
          'JiTpro is evolving into a scalable procurement control platform while continuing to support high-touch operational advisory engagements as the platform evolves.',
          'The goal is not simply to digitize procurement. The goal is to maintain operational control before procurement instability compounds into schedule disruption and margin erosion.',
        ],
      },
      {
        question: 'What is JiTpro Core?',
        answer: [
          'JiTpro Core is the foundational SaaS layer focused on procurement clarity, scope structure, sequencing, and procurement control.',
        ],
      },
      {
        question: 'What is JiTpro Control Tower?',
        answer: [
          'JiTpro Control Tower is the project-specific operational layer focused on live procurement visibility, schedule risk, constraint escalation, and procurement execution management.',
        ],
      },
      {
        question: 'Does JiTpro integrate with existing systems?',
        answer: [
          'The long-term vision is to work alongside existing contractor workflows and software ecosystems rather than forcing contractors into a completely new operating system.',
        ],
      },
      {
        question: 'Will contractors need to completely change how they operate?',
        answer: [
          'No. JiTpro is intended to refine and stabilize existing operational processes, not replace them wholesale.',
        ],
      },
      {
        question: 'Does JiTpro require contractors to abandon Excel?',
        answer: [
          'No. JiTpro recognizes that many contractors still rely heavily on Excel and existing operational tools. All reports can be exported via .csv file format, along with .pdf.',
        ],
      },
      {
        question: 'What role does AI play inside JiTpro?',
        answer: [
          'AI inside JiTpro is designed to support information management, procurement visibility, and constraint control — not replace construction experience, operational judgment, or accountability.',
          'Modern construction projects generate enormous amounts of fragmented procurement information across:',
          [
            'Specifications',
            'Submittals',
            'RFIs',
            'Approvals',
            'Schedules',
            'Vendor communication',
            'Fabrication updates',
            'Delivery coordination',
            'Field requirements',
          ],
          'Managing that information manually at scale becomes increasingly difficult as project complexity grows.',
          'JiTpro uses AI to help organize, surface, and interpret procurement-related information so teams can identify constraints earlier, maintain visibility longer, and make more informed decisions before procurement instability compounds into schedule disruption and margin erosion.',
        ],
      },
      {
        question: 'Does JiTpro allow AI to make project decisions automatically?',
        answer: [
          'No.',
          'JiTpro does not treat AI as autonomous operational authority.',
          'Construction projects involve real-world constraints, financial exposure, sequencing risk, human coordination, and constantly changing conditions that still require experienced operational oversight and accountability.',
          'AI inside JiTpro is intended to assist decision-making, improve visibility, and reduce information fragmentation — not replace contractor judgment.',
        ],
      },
      {
        question: 'Does JiTpro believe AI can "solve construction"?',
        answer: [
          'No.',
          'JiTpro does not view AI as operational magic.',
          'One of the core philosophies behind JiTpro is that construction remains governed by physical reality, sequencing constraints, fabrication timelines, labor availability, logistics, and decision flow regardless of how advanced software becomes.',
          'AI can improve visibility and help teams process information faster, but it cannot eliminate operational reality or compress procurement timelines beyond what real-world constraints allow.',
        ],
      },
      {
        question: 'How does AI improve procurement workflows?',
        answer: [
          'AI can assist procurement workflows by helping teams:',
          [
            'Identify missing information',
            'Surface unresolved constraints',
            'Organize fragmented communication',
            'Improve procurement visibility',
            'Detect sequencing conflicts',
            'Reduce information overload',
            'Maintain operational awareness across large volumes of project data',
          ],
          'The objective is not automation for its own sake.',
          'The objective is maintaining operational control before procurement instability compounds into schedule disruption and margin erosion.',
        ],
      },
      {
        question: 'Is JiTpro an "AI construction company"?',
        answer: [
          'No.',
          'JiTpro is an operational control platform focused on procurement stability, sequencing discipline, and constraint visibility.',
          'AI is simply one supporting layer used to help manage the scale and complexity of procurement information required to maintain operational control across modern construction projects.',
        ],
      },
    ],
  },
  {
    id: 'financial',
    title: 'Financial, Margin & Pricing',
    intro: 'How JiTpro protects margin, how engagements are priced, and why procurement control is a profit protection function.',
    items: [
      {
        question: 'Can JiTpro improve profitability?',
        answer: [
          'Yes.',
          'JiTpro exists because procurement instability destroys margin.',
          'When procurement constraints are left unresolved, projects progressively lose operational control through schedule disruption, labor inefficiency, stacked trades, expediting, overtime, rework, and reactive field management.',
          'JiTpro is designed to expose and stabilize those conditions before they compound into financial loss.',
          'Contractors who maintain operational control during procurement place themselves in a significantly stronger position to protect margin than contractors who allow procurement chaos to drive the project lifecycle.',
        ],
      },
      {
        question: 'How much profit leakage happens during procurement?',
        answer: [
          'Contractors experience varying degrees of procurement-related margin loss on every project. JiTpro exists to expose and reduce that leakage.',
        ],
      },
      {
        question: 'Is JiTpro a cost center?',
        answer: [
          'JiTpro is positioned as a profit protection system. The goal is to preserve margin by reducing avoidable operational instability.',
        ],
      },
      {
        question: 'Can JiTpro help reduce rework?',
        answer: [
          'Yes. Earlier clarity around procurement constraints and scope coordination can reduce downstream rework and schedule disruption.',
        ],
      },
      {
        question: 'Does JiTpro help with owner-driven changes?',
        answer: [
          'JiTpro helps expose how owner-driven decisions and late changes propagate through procurement timelines, sequencing dependencies, fabrication schedules, and downstream execution conditions.',
        ],
      },
      {
        question: 'What does JiTpro cost?',
        answer: [
          'General contractors already pay to procure every product, material, and service required to complete a project. That operational cost already exists whether it is formally managed or not.',
          'JiTpro reframes and stabilizes that process.',
          'Most contractors are already absorbing the cost of procurement instability through:',
          [
            'Schedule disruption',
            'Labor inefficiency',
            'Stacked trades',
            'Delayed decisions',
            'Expediting',
            'Overtime',
            'Rework',
            'Margin erosion',
          ],
          'JiTpro exists to help contractors maintain operational control before those losses compound.',
          'In today’s construction market, where margins are tightening and contractors are increasingly lowering pricing simply to remain competitive, protecting operational efficiency and preserving margin have become more important than ever. JiTpro is designed to create a competitive operational advantage by reducing procurement-driven instability that many contractors simply accept as normal.',
        ],
      },
      {
        question: 'Is JiTpro an added operational expense?',
        answer: [
          'JiTpro is built around the belief that procurement management is already a required operational function on every project.',
          'The question is not whether contractors pay for procurement management. They already do.',
          'The real question is whether procurement is being managed proactively through operational control, or reactively through chaos, schedule disruption, expediting, and margin erosion.',
          'JiTpro is designed to help restructure and stabilize a process that already consumes enormous operational resources inside most construction companies.',
        ],
      },
      {
        question: 'How is JiTpro priced?',
        answer: [
          'JiTpro engagements are typically structured around project size, procurement complexity, schedule exposure, and the level of operational involvement required.',
          'Unlike traditional software platforms that charge based on user seats or administrative usage, JiTpro pricing is tied directly to operational execution and procurement stabilization.',
          'Each project carries different procurement risks, design complexity, owner decision dynamics, and schedule pressure. Pricing reflects that operational reality.',
        ],
      },
      {
        question: 'Is JiTpro a software subscription?',
        answer: [
          'JiTpro is currently delivered as a combination of operational consulting, procurement control methodology, and supporting software infrastructure.',
          'The focus is not on selling software access alone. The focus is on maintaining operational control throughout procurement and preconstruction execution.',
          'As the JiTpro platform evolves, software components will continue expanding alongside operational services.',
        ],
      },
      {
        question: 'Can JiTpro costs be carried by the project itself?',
        answer: [
          'Yes.',
          'Because procurement management is already part of the contractor’s operational responsibility, JiTpro engagements are treated as direct project operational costs tied to procurement coordination, sequencing visibility, and procurement stabilization efforts.',
        ],
      },
      {
        question: 'Why wouldn’t a contractor simply handle this internally?',
        answer: [
          'Many contractors already attempt to manage procurement internally. The challenge is that procurement instability often develops gradually across dozens or hundreds of seemingly disconnected activities.',
          'Operational pressure, incomplete information, fragmented communication, changing decisions, and schedule compression create environments where unresolved procurement constraints quietly accumulate until projects become reactive.',
          'JiTpro is designed to bring structure, sequencing discipline, visibility, and accountability to that process before operational control begins deteriorating.',
        ],
      },
      {
        question: 'Does JiTpro replace project managers, superintendents, or procurement staff?',
        answer: [
          'No.',
          'JiTpro is designed to support operational teams by improving procurement visibility, sequencing discipline, and constraint management across the project lifecycle.',
          'The objective is not to replace personnel. The objective is to reduce the operational instability that overwhelms personnel once procurement problems begin compounding.',
        ],
      },
      {
        question: 'How does JiTpro help protect margin?',
        answer: [
          'Most margin erosion in construction does not occur through one catastrophic event. It develops gradually through accumulated operational inefficiency:',
          [
            'Late decisions',
            'Procurement delays',
            'Stacked trades',
            'Labor disruption',
            'Field resequencing',
            'Overtime',
            'Remobilization',
            'Coordination breakdowns',
            'Schedule compression',
          ],
          'JiTpro focuses on identifying and stabilizing procurement constraints before those issues compound into operational and financial loss.',
        ],
      },
      {
        question: 'Why is procurement control more important right now?',
        answer: [
          'The construction market has become increasingly competitive. Many contractors are reducing fees and tightening margins simply to secure projects.',
          'As margins compress, operational inefficiency becomes significantly more dangerous. Small procurement disruptions that may have once been survivable can now materially impact profitability.',
          'Contractors who maintain operational control through procurement discipline gain a meaningful competitive advantage over contractors operating reactively.',
        ],
      },
      {
        question: 'Does JiTpro guarantee profit improvement?',
        answer: [
          'No operational system can eliminate all project risk.',
          'However, JiTpro is built around the belief that maintaining operational control earlier in the project lifecycle significantly reduces preventable procurement-driven instability, schedule disruption, and margin erosion.',
          'The goal is not perfection.',
          'The goal is operational stability, predictability, and control.',
        ],
      },
      {
        question: 'Is JiTpro only for large contractors?',
        answer: [
          'No.',
          'In many cases, smaller and growth-stage contractors are more vulnerable to procurement instability because they operate with leaner teams, tighter margins, and less operational redundancy.',
          'JiTpro is specifically designed for contractors who need stronger procurement visibility and operational control without building massive internal procurement departments.',
        ],
      },
    ],
  },
  {
    id: 'adoption',
    title: 'Adoption & Project Fit',
    intro: 'When to engage JiTpro, which projects benefit most, and how procurement control fits your operations.',
    items: [
      {
        question: 'When should a contractor engage JiTpro?',
        answer: [
          'Ideally:',
          [
            'During preconstruction',
            'Immediately after award',
            'Before procurement begins accelerating',
          ],
        ],
      },
      {
        question: 'What types of projects benefit most from JiTpro?',
        answer: [
          'Projects with:',
          [
            'Complex finishes',
            'Long lead materials',
            'Architect-driven detailing',
            'High customization',
            'Tight schedules',
            'Heavy coordination requirements',
            'Owner selection dependencies',
          ],
        ],
      },
      {
        question: 'Does JiTpro work for production builders?',
        answer: [
          'JiTpro is primarily focused on higher-complexity construction environments rather than repetitive production construction.',
        ],
      },
      {
        question: 'Does JiTpro only focus on long-lead items?',
        answer: [
          'No.',
          'JiTpro tracks long-lead items, but it does not isolate them as uniquely important. Many projects become destabilized by procurement items assumed to be “easy” or “short lead.”',
        ],
      },
    ],
  },
];
