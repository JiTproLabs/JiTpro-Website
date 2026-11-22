/**
 * Copy for the unlaunched /pricing page (Design System §82, issue #94).
 *
 * Revision 3 (2026-11-21, final direction): the Project Readiness Engagement
 * (one-time, project-specific fee) and optional Ongoing Procurement Support
 * (monthly). Founder-supplied copy, used exactly, with headings and the
 * button in sentence case (§7.7). The example fees are illustrative for one
 * example contract; the internal pricing model and any monthly support price
 * are not published.
 */

export const PRICING_META = {
  title: 'Pricing | JiTpro',
  description:
    'Straightforward, project-by-project pricing for the JiTpro Project Readiness Engagement and optional Ongoing Procurement Support. No software subscriptions or annual license fees.',
} as const;

export const HERO = {
  eyebrow: 'Pricing',
  headline: ['Straightforward pricing.', 'One project at a time.'],
  lead: 'No software subscriptions. No annual license fees. No long-term commitments.',
  paragraph:
    'JiTpro provides experienced construction professionals dedicated to preparing your project for successful execution while your team focuses on getting construction underway.',
  statement: 'You bring us in when you win a project. You pay for the services that project needs. Nothing more.',
} as const;

export const PRICING = {
  heading: 'What does JiTpro cost?',
  intro: [
    'Every project is different, but our pricing follows a consistent approach.',
    "We establish a base fee using the value of your construction contract, then evaluate the project's current state of development, available information, and professional work required to prepare the Project Readiness Playbook.",
  ],
} as const;

export interface PriceExample {
  stage: string;
  fee: number;
}

export const ENGAGEMENT: {
  name: string;
  tag: string;
  exampleCaption: string;
  columns: readonly [string, string];
  rows: readonly PriceExample[];
  explanation: string;
  disclaimer: readonly string[];
  promise: string;
  deliverablesIntro: string;
  deliverables: readonly string[];
} = {
  name: 'Project Readiness Engagement',
  tag: 'One-time, project-specific fee.',
  exampleCaption: 'Example: $3.5 million construction project',
  columns: ['Project development', 'Estimated fee'],
  rows: [
    { stage: 'Advanced development', fee: 14300 },
    { stage: 'Typical development', fee: 15800 },
    { stage: 'Ongoing development', fee: 18200 },
    { stage: 'Early development', fee: 20600 },
  ],
  explanation: "These figures illustrate how a project's current state of development can affect the professional work required.",
  disclaimer: [
    'These are estimates, not fixed pricing packages.',
    'Final fees are based on the actual scope and professional effort required.',
  ],
  promise: "You'll know what we're delivering and what it will cost before we begin.",
  deliverablesIntro: 'The initial engagement includes development of the seven established JiTpro Project Readiness deliverables.',
  deliverables: [
    'Scope Validation & Coverage',
    'Project Readiness Gap Assignment',
    'Commitment Register',
    'Product Register',
    'Submittal Register',
    'Procurement Register',
    'Procurement Schedule',
  ],
};

export const SUPPORT = {
  name: 'Ongoing Procurement Support',
  tag: 'Optional monthly service.',
  paragraph:
    'Once your Project Readiness Playbook is established, JiTpro can remain involved to help maintain procurement control as construction progresses.',
  listIntro: 'For a defined monthly fee, we can provide an agreed workflow that includes:',
  items: [
    'Weekly procurement status reviews.',
    'Maintenance of the Procurement Schedule and applicable registers.',
    'Monitoring upcoming and outstanding commitments.',
    'Identification of actions requiring attention.',
    'Concise weekly readiness updates.',
    'Monthly project leadership review.',
  ],
  note: 'The actual support scope, meeting frequency, responsibilities, and monthly fee are established in the proposal.',
  promise: 'Continue for as long as your project needs our support.',
} as const;

export const COMPARISON = {
  heading: 'Service comparison',
  services: [
    {
      name: 'Project Readiness Engagement',
      points: [
        'One-time project fee.',
        'Initial Playbook development.',
        'Defined deliverables.',
        'Establishes upstream planning and procurement control.',
      ],
    },
    {
      name: 'Ongoing Procurement Support',
      points: [
        'Optional monthly fee.',
        'Defined recurring workflow.',
        'Maintains schedules, registers, and visibility.',
        'Continues only while the contractor needs the service, subject to the agreed termination terms.',
      ],
    },
  ],
} as const;

export const FINANCIAL_SENSE = {
  heading: "You're already paying for this work.",
  paragraphs: [
    'Every general contractor knows that thorough planning is essential. But when a new project begins, the team faces two competing demands: getting construction underway and preparing everything the field will need in the months ahead.',
    'Both are essential. Both require time. And both compete for the same people.',
    'Too often, immediate construction demands take priority, leaving critical planning unfinished.',
  ],
  turn: 'JiTpro provides a dedicated team to get that planning done.',
  afterTurn: [
    'We identify what your project needs, establish who is responsible, determine when each requirement must be completed, and develop the procurement plan required to support your construction schedule.',
    "Your team already has to do this work. We're here to make sure it gets done early, before unfinished requirements become expensive disruptions.",
  ],
  statement: 'The cost of prevention is a fraction of the cost of recovery.',
} as const;

export const BUSINESS_MODEL = {
  heading: 'One project. Your choice.',
  lead: 'No company-wide subscriptions. No annual software licenses. No obligation to hire JiTpro on your next project.',
  lines: ['Win a project? Bring us in.', "Don't have a project that needs us? You don't pay us."],
  belief: 'We believe the value of our work should be the reason you bring us back, not a long-term contractual obligation.',
  goal: 'Our goal is simple: Help you keep more of the profit you worked so hard to earn.',
} as const;

export const FINAL_CTA = {
  heading: "Let's get your next project ready.",
  lead: 'No new software to master. No additional full-time staff to hire.',
  paragraph:
    'Just experienced construction professionals helping your team establish the clarity, planning, and accountability needed to support field execution.',
  action: "Let's talk about your project",
} as const;

/** A fee as the page shows it: whole dollars with thousands separators. */
export const formatFee = (fee: number) => `$${fee.toLocaleString('en-US')}`;
