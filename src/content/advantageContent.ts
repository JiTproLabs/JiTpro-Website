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

import { formatDollars, type RetentionResult } from './advantageCalculator';

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
      title: 'Improve your performance',
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

/**
 * The line under *How much did you actually keep?* (founder brief *Refine Profit Calculator Language*, 2026-11-27):
 * what was kept and what slipped away, in the calculator's own figures. Compared in whole dollars, as displayed, so a
 * fraction of a cent never reads as "$0 slipped away".
 */
export function keptSentence(result: Pick<RetentionResult, 'expectedProfit' | 'actualProfit' | 'shortfall' | 'favorable'>): string {
  const expected = Math.round(result.expectedProfit);
  const actual = Math.round(result.actualProfit);
  if (expected <= 0) {
    if (actual > 0) return `You finished ${formatDollars(actual)} ahead of what you expected.`;
    if (actual < 0) return `You finished ${formatDollars(-actual)} in the red.`;
    return 'You broke even.';
  }
  if (actual < 0) return `You finished ${formatDollars(-actual)} in the red, instead of making the ${formatDollars(expected)} you expected.`;
  if (actual === 0) return `You broke even. The ${formatDollars(expected)} you expected to make slipped away.`;
  if (actual === expected) return 'You kept every dollar of the profit you expected.';
  if (actual > expected) return `You finished ${formatDollars(result.favorable)} ahead of what you expected.`;
  return `You kept ${formatDollars(actual)}. The other ${formatDollars(result.shortfall)} slipped away.`;
}

export const PROFIT = {
  /** The calculator's small label; the transition above it carries the heading (2026-11-22). */
  eyebrow: 'Profit retention calculator',
  fields: {
    contractValue: 'How big was the job?',
    expectedProfit: 'How much profit did you expect to make?',
    keptPct: 'How much did you actually keep?',
  },
  expectedHint: 'What percentage of the job did you expect to keep?',
  kept: {
    lostEnd: 'Lost money',
    keptEnd: 'Kept all estimated profit',
    /** The plain-English line under the kept slider, in whole dollars as the calculator shows them (keptSentence). */
    sentence: keptSentence,
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
    question: 'What if you had kept more?',
    helper: 'How much of that lost profit could you have saved?',
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

/**
 * How JiTpro creates your advantage (§83.1 item 5, rebuilt 2026-11-27 to the founder's approved mockup, founder brief
 * *Rebuild "How JiTpro Creates Your Advantage"*). Four disciplines of one operating method, not four software features.
 * Headings in sentence case (§7.7), as the mockup sets them.
 */
export const HOW_JITPRO = {
  eyebrow: 'How JiTpro creates your advantage',
  heading: 'Four disciplines. One stronger project.',
  intro: 'Every step builds on the one before it, bringing greater control to the work long before it reaches the field.',
  concepts: [
    { title: 'Clarity', body: 'Know what needs to happen.' },
    { title: 'Control', body: 'Give every requirement an owner and a date.' },
    { title: 'Coordination', body: 'Keep everyone working toward the same plan.' },
    { title: 'Performance', body: 'Protect the work and the profit.' },
  ],
  closing: 'Better preparation leads to better execution.',
} as const;

/**
 * The compounding advantage (§83.1 item 6, rebuilt 2026-11-27 to the founder's approved mockup, founder brief *Redesign
 * "The Compounding Advantage" Section*): four connected outcomes along a rising wave, not guaranteed results. Headings in
 * sentence case (§7.7).
 */
export const COMPOUNDING = {
  eyebrow: 'The compounding advantage',
  /** The `h2`, broken where the mockup breaks it from `lg`. */
  heading: { lines: ['Control compounds into', 'advantage.'] },
  intro: [
    'Every project you bring under better control strengthens your ability to deliver the next one.',
    'Less disruption. More reliable execution. Greater retained profit. A stronger company.',
  ],
  steps: ['Stronger control', 'More reliable execution', 'Greater retained profit', 'Greater competitive strength'],
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
