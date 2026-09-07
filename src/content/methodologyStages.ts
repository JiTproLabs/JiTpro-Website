/**
 * The five stages of the JiTpro methodology, as presented on the homepage.
 *
 * This copy is DOCTRINE, not section copy. It is carried verbatim from the
 * homepage's previous methodology implementation and MUST NOT be renamed,
 * reworded, reordered, or trimmed as a side effect of a layout change. A change
 * to a stage name or to what a stage claims to produce is a product decision
 * and needs its own approval.
 *
 * It lives in `src/content/` rather than inside the section because the stages
 * have a second consumer: the methodology figure renders per-stage state keyed
 * on `id`, so the section and the figure must be reading the same list.
 */

/**
 * The stage's screen in the visual column. Optional: a stage without one keeps
 * the reserved placeholder. Borrowing a neighbouring stage's screen to fill the
 * gap is prohibited (§46.8.1) — it would claim the stage produces something the
 * image does not show.
 */
export type MethodologyStageDemo = {
  /** Basename in public/assets/methodology/, without size suffix or extension. */
  file: string;
  /**
   * What the screen shows. Describes the SCREEN, never a restatement of `body`
   * — the stage copy already carries the meaning in text (§46.2), so this adds
   * what a sighted reader gets from the capture itself.
   */
  alt: string;
};

export type MethodologyStage = {
  /** Stable key. The figure keys its accumulated state off this, not the index. */
  id: string;
  title: string;
  body: string;
  demo?: MethodologyStageDemo;
};

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    id: 'scope-validation',
    title: 'Scope Validation',
    body: 'We validate the contractor’s existing scope against the project documentation to determine whether the work required to complete the project has been identified and covered.',
    demo: {
      file: 'scope-validation',
      alt: 'The JiTpro Scope Validation Report for a residential project: 428 scope items checked against drawings, contracts and subcontracts, RFIs and meeting records, each marked validated, partial, single-source or conflicting.',
    },
  },
  {
    id: 'scope-gap-analysis',
    title: 'Scope Gap Analysis',
    body: 'We identify missing, unclear, conflicting, or uncovered scope—and the decisions, information, and responsibilities that must be resolved before they become constraints against the schedule.',
    demo: {
      file: 'scope-gap-analysis',
      alt: 'The JiTpro Scope Gap Analysis Report for the same project: 34 gaps sorted into definition, responsibility and interface types, each carrying a responsible party, a required-by date and an impact level.',
    },
  },
  {
    id: 'commitment-capture',
    title: 'Commitment Capture',
    body: 'Required actions are assigned to responsible parties and tracked as Commitments, giving the project team a clear record of what must happen, who owns the next move, and when it is required.',
    demo: {
      file: 'commitment-capture',
      alt: 'The JiTpro Commitment Register for the same project: 23 commitments, each with an external party, an owner, a commitment date and a target date, tracked as on track, at risk or overdue.',
    },
  },
  {
    id: 'product-register',
    title: 'Product Register',
    body: 'We identify and register the products, materials, and services the project will need, connecting what must arrive on site to the decisions, approvals, and Commitments required to get it there.',
    demo: {
      file: 'product-register',
      alt: 'The JiTpro Product Register for the same project: 246 products, materials and equipment, each with a category, trade, supplier, status, lead time, required-on-site date and source drawing, and a detail panel tracing the heritage steel windows to their supplier, their procurement dates and the Commitments they depend on.',
    },
  },
  {
    id: 'backward-scheduling',
    title: 'Backward Scheduling',
    body: 'Starting with when each product, material, or service is required on site, JiTpro works backward to establish the dates for the Commitments that support it.',
    demo: {
      file: 'procurement-schedule',
      alt: 'The JiTpro Procurement Schedule for the same project, as a Gantt view: 48 items, each drawn from pre-procurement through order, fabrication, shipping and installation, with a detail panel tracing an exterior concrete package back to its Commitment.',
    },
  },
];
