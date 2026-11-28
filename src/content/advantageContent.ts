/**
 * Copy for /the-jitpro-advantage (Design System §83, issue #95). First draft
 * for founder review.
 *
 * Headlines, key statements and the four concepts are the founder's brief, set
 * in sentence case (§7.7). The connecting body copy is drafted for this page in
 * JiTpro's voice and needs founder approval. Guardrails: no promise that a
 * lower bid is safe, no guarantee of profit or savings, nothing presents JiTpro
 * as software, no em dashes, no CPM.
 */

export const ADVANTAGE_META = {
  title: 'The JiTpro Advantage | JiTpro',
  description:
    'Sharpen your organization before you sharpen your pencil. JiTpro helps general contractors protect estimated profit and build the operational strength to compete with confidence.',
} as const;

export const HERO = {
  eyebrow: 'The JiTpro Advantage',
  headline: ['Sharpen your organization', 'before you sharpen your pencil.'],
  paragraphs: [
    'In a competitive market, cutting your price without improving your performance is a race to the bottom.',
    'JiTpro helps general contractors take precise control of their projects, protect their estimated profits, and build the operational strength to compete with confidence.',
  ],
  ctaHeading: 'Make JiTpro your unfair advantage.',
  action: "Let's talk about your next project",
} as const;

/**
 * The race to the bottom (§83.1, item 2, §83.6; rebuilt 2026-11-25 to the founder's approved mockup,
 * docs/design/assets/advantage-race/race-to-the-bottom-approved-mockup.png). Founder copy, used exactly as the mockup
 * sets it. Split strings mark where the mockup breaks a line or changes colour.
 */
export const RACE_TO_BOTTOM = {
  eyebrow: 'The race to the bottom',
  /** Two lines on desktop; the last word in Brand Amber. */
  heading: { lines: ['Winning the job means nothing', 'if you lose the'], emphasis: 'profit.' },
  statement:
    "There is a difference between lowering your price because you've become more efficient and lowering your price simply to win the job.",
  comparison: [
    {
      tone: 'sacrifice',
      title: 'Cut your price',
      points: ['Lower your price.', 'Accept less margin.', 'Carry the same inefficiencies.'],
      outcome: 'Greater financial exposure.',
    },
    {
      tone: 'performance',
      title: 'Sharpen your organization',
      points: ['Improve project control.', 'Reduce preventable costs.', 'Retain more profit.'],
      outcome: 'Greater competitive strength.',
    },
  ],
  /** The middle word (with its comma, as the light mockup sets it) in amber. */
  closing: { before: 'Compete through ', emphasis: 'performance,', after: ' not sacrifice.' },
} as const;

/**
 * The leaking bucket (§83.5): founder-supplied copy (headings in sentence case, §7.7), arranged into a hierarchy for a
 * full-bleed photographic section. The explanation is grouped and lightly condensed, as the brief allows, without
 * changing its meaning. The transition into the calculator is kept.
 */
export const LEAKING_BUCKET = {
  eyebrow: 'The JiTpro Advantage',
  heading: 'Stop pouring more water into a leaking bucket.',
  subheading: "You don't necessarily need more revenue. You need to keep more of the profit you're already earning.",
  principle: "You don't fix a leaking bucket by pouring more water into it. You fix the leaks.",
  columns: [
    {
      label: 'The problem',
      paragraphs: [
        'When competition gets tougher, general contractors often respond by pursuing more work, sharpening their pencils, or looking for ways to increase revenue.',
        "But when preventable project disruption is already consuming substantial portions of estimated profit, more revenue doesn't necessarily solve the problem. More projects can simply create more opportunities for the same losses to occur.",
      ],
    },
    {
      label: 'The leaks',
      emphasis: 'Late decisions. Missed commitments. Incomplete information. Procurement delays. Disrupted field operations. Expediting. Remobilization.',
      paragraphs: ['Every one of these can consume profit that was already built into the project.'],
    },
    {
      label: 'The fix',
      paragraphs: [
        'JiTpro helps general contractors establish early, precise control over the information, decisions, approvals, commitments, and procurement activities required to keep field execution moving as planned.',
      ],
      closing: 'Better control. Less preventable waste. More profit retained.',
    },
  ],
  growth: {
    lines: ["We're not suggesting general contractors shouldn't grow.", 'Quite the opposite.'],
    statement: 'Strengthen your organization first. Then grow with confidence.',
    body: 'When your company consistently retains more of the profit it estimates, taking on additional projects can build financial strength rather than simply multiplying operational problems.',
  },
  transition: {
    heading: 'What could better project control mean for your bottom line?',
    text: "Think about a project you've completed. Let's see what retaining more of your estimated profit could mean for your company.",
  },
} as const;

export const PROFIT = {
  /** The calculator's small label; the transition above it carries the heading (2026-11-22). */
  eyebrow: 'Profit retention calculator',
  fields: {
    contractValue: 'How big was the job?',
    expectedProfit: 'How much profit did you expect to make?',
    keptPct: 'How much did you actually keep?',
  },
  expectedHint: 'As a share of the contract value.',
  kept: {
    lostEnd: 'Lost money',
    keptEnd: 'Kept all estimated profit',
    positive: (pct: number) => `You kept ${pct}% of the profit you originally estimated.`,
    zero: 'Your project broke even.',
    negative: 'Your project finished at a loss.',
  },
  shortfall: {
    label: "Profit that didn't make it to the finish line",
    shareOfExpected: (pct: number) => `That's ${pct}% of the profit you expected to earn.`,
    favorableLabel: 'You beat your estimate',
    evenLabel: 'Right on your estimate',
    favorable: 'You made more than you expected on this one.',
    even: 'You made exactly what you expected.',
  },
  improvement: {
    question: 'What if you kept this much more?',
    helper: 'How much of your lost profit could you have kept?',
    disabled: "There's no gap to close on this project: you kept everything you expected, or more.",
  },
  results: {
    planned: 'You planned to make',
    actual: 'You actually kept',
    could: 'What you could have kept',
    more: 'more profit',
    moreNote: "That's how much more you could have retained on this project.",
  },
  annual: {
    heading: 'Now think about your entire year.',
    question: 'How many similar projects did you complete last year?',
    custom: 'Custom amount...',
    customLabel: 'Number of similar projects',
    label: 'What that could have meant for your company',
    caption: 'Additional annual profit.',
    perProject: (perProject: string, count: number) =>
      `That's ${perProject} more per project across ${count} similar ${count === 1 ? 'project' : 'projects'}.`,
    assumption:
      "This assumes your projects were a similar size and came up short by a similar amount. It's an illustration, not a calculation of your company's actual results.",
  },
  closing: {
    heading: 'What could your company do with that money?',
    uses: [
      'Better benefits for your employees.',
      'More investment in equipment.',
      'Stronger working capital.',
      'Greater financial reserves.',
      'More freedom to compete strategically.',
    ],
    statement: "Better project control doesn't just protect one project. It can strengthen your entire company.",
    method:
      'That control starts upstream. JiTpro helps your team establish what each project needs, who is responsible, and when it must happen, so more of the profit you estimate makes it to the finish line.',
  },
  disclaimer:
    'Illustrative example only. Use consistent profit figures. Annual results assume similar projects and the same improvement on each. Actual results depend on project conditions and contract terms. JiTpro does not guarantee specific profit improvements.',
} as const;

/** Compete from a position of strength, reproduced to the founder's approved mockup (§83.1 item 4, 2026-11-27). */
export const POSITION_OF_STRENGTH = {
  eyebrow: 'The JiTpro Advantage',
  /** Two lines from `xl`, as in the mockup. */
  heading: { lines: ['Compete from a', 'position of strength.'] },
  intro: 'Margin is protected long before the job is finished. It is protected by how well the work is prepared.',
  practices: [
    { title: 'Better project planning', body: 'The work ahead is understood before it reaches the field.' },
    { title: 'Defined responsibilities', body: 'Every requirement has an owner and a date.' },
    { title: 'Early coordination', body: 'Owners, designers, and trade partners know what is needed and when.' },
    { title: 'Procurement control', body: 'Products and materials are planned back from when the field needs them.' },
    { title: 'Improved field readiness', body: 'Crews arrive to work that is ready for them.' },
  ],
  /** The second part is in Brand Amber, on its own line from `lg`. */
  choicesHeading: { lead: 'Better performance', emphasis: 'creates choices.' },
  choicesIntro: 'When more of your estimated profit makes it to the end of the job, you decide what to do with it.',
  choices: [
    'Protect your margins.',
    'Invest in your team.',
    'Strengthen your business.',
    'Evaluate competitive bids strategically, knowing what your execution can support.',
  ],
} as const;

export const HOW_JITPRO = {
  heading: 'How JiTpro creates your advantage',
  intro:
    'JiTpro is not another software application. Experienced construction professionals work alongside your team to plan the work, establish responsibilities, and keep the project moving.',
  concepts: [
    { title: 'Clarity', body: 'Know what must happen, who is responsible, and when.' },
    { title: 'Control', body: 'Manage the upstream work required to support field execution.' },
    { title: 'Coordination', body: 'Give the entire project team advance visibility into their responsibilities and commitments.' },
    { title: 'Performance', body: 'Reduce avoidable disruption and protect project profitability.' },
  ],
} as const;

export const COMPOUNDING = {
  heading: 'The compounding advantage',
  steps: [
    'Better upstream project control',
    'More reliable field execution',
    'Greater retained profit',
    'Greater competitive strength',
  ],
  statement: ["Operational excellence creates pricing flexibility.", "Pricing flexibility doesn't create operational excellence."],
} as const;

export const CLOSING = {
  heading: ['Your competitors are sharpening their pencils.', 'What are you sharpening?'],
  paragraphs: ["You don't need to rebuild your whole company to start performing better. Start with one project."],
  lead: 'No new software to master. No additional full-time staff to hire.',
  body: 'Just experienced construction professionals helping teams strengthen project execution, reduce preventable waste, and protect estimated profits.',
  statement: 'Build a stronger company. Compete with confidence.',
  action: "Let's talk about your project",
} as const;
