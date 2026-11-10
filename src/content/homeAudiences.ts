/**
 * The homepage audience section's copy (Design System Section 54.2).
 *
 * The copy is used exactly as supplied by the founder on 2026-11-09. Only the
 * option and tab labels differ from the supplied text: they are set in
 * sentence case, as Sections 7.7 and 48.1 require of headings and controls.
 * Headlines and descriptions MUST NOT be reworded as a side effect of layout
 * or visualization work; a copy change is its own decision (Section 54.2).
 *
 * Governance notes live in Section 54.3: "procurement" is a scoped exception
 * for this copy only, and the engagement model is unchanged — the architect
 * and owner tabs describe what those parties gain from the plan the general
 * contractor's team runs, never JiTpro coordinating them directly.
 *
 * It lives in `src/content/` because the section is not its only consumer:
 * the Phase 2 visualizations (Section 54.4) will key their state off the
 * audience and tab `id`s, so both must read the same list.
 */

export type AudienceTab = {
  /** Stable key, unique across every audience (it becomes part of DOM ids). */
  id: string;
  /** The tab's control label, in sentence case. */
  label: string;
  headline: string;
  description: string;
  /**
   * Optional link to a role page, shown between the headline and the
   * description (Section 54.2.1). `to` is an internal route.
   */
  roleLink?: { label: string; to: string };
  /**
   * Optional method checklist beneath the description (Section 54.2.1). A
   * statement of the method's steps, never a record of work done; the last
   * line is the outcome and takes slight emphasis.
   */
  checklist?: readonly string[];
};

export type Audience = {
  /** Stable key. */
  id: string;
  /** The audience's name as the select shows it, in sentence case. */
  label: string;
  /** Shown in this order; the first is selected when the audience is chosen. */
  tabs: readonly AudienceTab[];
};

export const HOME_AUDIENCES: readonly Audience[] = [
  {
    id: 'general-contractors',
    label: 'General contractors',
    tabs: [
      {
        id: 'gc-identify',
        label: 'Identify',
        headline: 'Identify everything your project needs.',
        description:
          'Review the project scope, drawings, specifications, and schedules to identify every product, material, and service required for construction. Organize these requirements into a comprehensive Procurement Register.',
        roleLink: { label: 'Explore JiTpro for general contractors', to: '/roles/general-contractors' },
        checklist: [
          'Review project scope',
          'Identify products, materials, and services',
          'Build the Procurement Register',
        ],
      },
      {
        id: 'gc-plan',
        label: 'Plan',
        headline: 'Build a procurement plan that supports your schedule.',
        description:
          'Identify every product, material, and service the project requires. Pull backward from when the field needs each one, establishing the actual work and realistic timeline required to get it there.',
      },
      {
        id: 'gc-connect',
        label: 'Connect',
        headline: 'Turn loose dependencies into managed commitments.',
        description:
          'Connect outside decisions, information, and approvals to the procurement activities they support. Establish who owes what, when it’s required, and what depends on it.',
      },
      {
        id: 'gc-control',
        label: 'Control',
        headline: 'Know what needs your attention today, and what’s coming tomorrow.',
        description:
          'Track commitments, identify emerging risks, and distinguish what requires action today from what can wait. Stay ahead of problems before they disrupt field execution or erode margins.',
      },
    ],
  },
  {
    id: 'architects',
    label: 'Architects & design teams',
    tabs: [
      {
        id: 'arch-see-whats-coming',
        label: 'See what’s coming',
        headline: 'Know what’s coming before it becomes urgent.',
        description:
          'See upcoming design questions, selections, and approvals early enough to prepare your team and coordinate its workload.',
      },
      {
        id: 'arch-plan-workload',
        label: 'Plan your workload',
        headline: 'Fewer surprises. More predictable review schedules.',
        description:
          'Understand when submittals, design clarifications, and consultant input will be needed, instead of constantly reacting to unexpected requests.',
      },
      {
        id: 'arch-focus-priorities',
        label: 'Focus on priorities',
        headline: 'Know which decisions really matter right now.',
        description:
          'See how requested information affects downstream procurement and field work, so your team can focus its limited time on the right issues.',
      },
    ],
  },
  {
    id: 'owners',
    label: 'Project owners',
    tabs: [
      {
        id: 'owner-reduce-risk',
        label: 'Reduce risk',
        headline: 'Find potential problems before they become expensive.',
        description:
          'Early procurement planning exposes unresolved decisions, design gaps, and long-lead requirements before they create costly surprises.',
      },
      {
        id: 'owner-protect-investment',
        label: 'Protect your investment',
        headline: 'Pay for good planning, not expensive recovery.',
        description:
          'The work required to prepare a project must happen somewhere. Doing it early can cost far less than recovering from late decisions, delays, and rework.',
      },
      {
        id: 'owner-predictability',
        label: 'More predictability',
        headline: 'A construction schedule backed by a real plan.',
        description:
          'Understand how your contractor intends to deliver the products, materials, approvals, and services needed to support the promised schedule.',
      },
      {
        id: 'owner-better-decisions',
        label: 'Better decisions',
        headline: 'Know when decisions are needed, and why.',
        description:
          'Receive advance notice of selections and approvals, with a clear understanding of what depends on them and the consequences of waiting.',
      },
    ],
  },
];

/** The section opens on general contractors, the homepage's primary audience (Section 54.3). */
export const DEFAULT_AUDIENCE_ID = 'general-contractors';
