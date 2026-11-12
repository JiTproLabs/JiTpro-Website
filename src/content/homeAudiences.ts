/**
 * The homepage audience section's copy (Design System Section 54.2).
 *
 * The copy is used exactly as supplied by the founder (2026-11-09; the Plan
 * description revised 2026-11-10; the Connect, Identify and Plan copy 2026-11-11).
 * Only the
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
  /** Optional second paragraph of the description (Section 54.2.1). */
  descriptionMore?: string;
  /**
   * Optional closing statement beneath the description (Section 54.2.1): one
   * short line, in the strongest ink.
   */
  closing?: string;
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
  /**
   * Optional dependency summary beneath the description (Section 54.2.2): the
   * kinds of requirement JiTpro identifies across a project. Labels only; the
   * section pairs each `id` with its icon.
   */
  dependencyCategories?: readonly DependencyCategory[];
};

export type DependencyCategory = {
  /** Stable key; the section keys the category's icon off it. */
  id: string;
  label: string;
};

/**
 * The Connect tab's six dependency categories (Section 54.2.2), founder-
 * supplied 2026-11-11, in reading order (two columns, three rows).
 *
 * They are what an activity needs FROM OUTSIDE it: information, decisions,
 * authorizations and commitments. Reviews, revisions and approvals are
 * scheduled procurement activities, which belong to Plan, so there is
 * deliberately no "Reviews & Approvals" category here.
 */
export const CONNECT_DEPENDENCY_CATEGORIES: readonly DependencyCategory[] = [
  { id: 'design-engineering', label: 'Design & Engineering' },
  { id: 'owner-decisions', label: 'Owner Decisions & Selections' },
  { id: 'external-inputs', label: 'External Inputs & Commitments' },
  { id: 'scope-trade', label: 'Scope & Trade Commitments' },
  { id: 'permits-agency', label: 'Permits & Agency Requirements' },
  { id: 'field-installation', label: 'Field & Installation Requirements' },
];

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
        headline: 'You can’t manage what you haven’t identified.',
        description:
          'Every construction project contains hundreds of products, materials, and services scattered across drawings, specifications, and schedules.',
        descriptionMore:
          'JiTpro brings these requirements together into a comprehensive procurement inventory, identifies missing or undefined scope, and helps establish what the project actually needs.',
        closing: 'Know what you need. Know what’s missing.',
      },
      {
        id: 'gc-plan',
        label: 'Plan',
        headline: 'Know what needs to happen. Know when it needs to happen.',
        description:
          'Every product, material, and service follows its own procurement path, with activities that must happen in the right sequence and require real time to complete.',
        descriptionMore:
          'JiTpro starts with when the field needs each item, then works backward to establish the activities, durations, and dates required to deliver it on time.',
        closing: 'The right work. In the right order. At the right time.',
      },
      {
        id: 'gc-connect',
        label: 'Connect',
        headline: 'Make sure every procurement activity has what it needs to move forward, without interruption.',
        description:
          'Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed.',
        dependencyCategories: CONNECT_DEPENDENCY_CATEGORIES,
      },
      {
        id: 'gc-control',
        label: 'Control',
        headline: 'Replace constant urgency with deliberate timing.',
        // The founder's first two paragraphs, set as one so the panel keeps the section's height (Section 54.2.3).
        description:
          'JiTpro helps you establish clear priorities for your entire project team. Owners, architects, consultants, and vendors know what’s expected of them, when it’s needed, and what’s coming next.',
        descriptionMore: 'Instead of demanding everything at once, you can focus everyone on the right work at the right time.',
        closing: 'Less chasing. Clearer priorities. Better coordination.',
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
        headline: 'Keep preventable problems from becoming costly setbacks.',
        description:
          'Late decisions, incorrect products, and missed approvals can create delays, rework, and unexpected expenses. JiTpro helps your contractor address these risks before they reach the field.',
      },
      {
        id: 'owner-predictability',
        label: 'More predictability',
        headline: 'Know what’s coming before it becomes urgent.',
        description:
          'JiTpro helps your contractor plan the decisions, approvals, and deliveries needed to keep construction moving, giving the entire team more time to prepare.',
      },
      {
        id: 'owner-better-decisions',
        label: 'Better decisions',
        headline: 'Know what needs your decision, and why it matters.',
        description:
          'JiTpro helps your contractor communicate what decisions are needed, when they’re required, and how they affect upcoming work.',
      },
    ],
  },
];

/** The section opens on general contractors, the homepage's primary audience (Section 54.3). */
export const DEFAULT_AUDIENCE_ID = 'general-contractors';
