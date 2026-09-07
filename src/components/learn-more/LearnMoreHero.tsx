import { ChevronDown } from 'lucide-react';
import { GUIDE_ANCHOR_ID } from '../../content/learnMore';
import { PrimaryAction } from './LearnMoreShell';

/**
 * The opening of the long-form explainer page (Design System Section 50).
 *
 * It is the homepage hero's continuation, not a second homepage hero. Three
 * things carry over unchanged: the eyebrow, the voice, and the action. Three
 * deliberately do not:
 *
 *   NO HAND-DRAWN UNDERLINE. The swoosh is the homepage's one display moment
 *   (Decision Log 2026-08-27). Repeating it here would spend the signature
 *   twice and make this page read as a competing front door rather than the
 *   next screen of one argument.
 *
 *   NO ENTRANCE ANIMATION. The homepage hero's stagger introduces a belief to
 *   a reader who has just arrived. This reader has already accepted the belief
 *   and clicked through to understand it. Motion here would decorate rather
 *   than communicate (Sections 46.1, 47.4).
 *
 *   LEFT-ALIGNED, ON THE SHARED EDGE. Section 50.7 makes the centered
 *   exception available to a page opening, and this opening declines it: a
 *   document that will be read for several minutes starts on the same left
 *   edge every section below it holds (Sections 47.3, 48.6).
 *
 * AMBER (Section 48.7): two elements, the eyebrow and the primary action. The
 * secondary action carries no amber at rest.
 *
 * VOICE (Section 20.1, Section 50.2): the dependencies are named as
 * dependencies. Owners, designers, engineers, vendors and subcontractors are
 * participants the project relies on. Nothing here suggests JiTpro takes over
 * a relationship that belongs to the contractor's own team.
 *
 * WHAT THE OPENING ANSWERS (revised 2026-09-04). The homepage has already made
 * the argument that preventable chaos is not inevitable, and this opening used
 * to make it a second time. It now answers the question the reader actually
 * arrived with: what exactly is JiTpro. Within about fifteen seconds the
 * reader should know this is an active engagement on one real project, and not
 * software, a report, a dashboard, general consulting, or a service defined by
 * buying things. "We start with one project" is stated here rather than held
 * back for section 07.
 */
export default function LearnMoreHero() {
  return (
    <section className="relative isolate overflow-hidden bg-jp-background px-6 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:px-10 lg:pt-24 lg:pb-24">
      {/* One warm key at the top right, resolving to the page background
          before the section below begins, so the hand-off has no seam
          (Section 48.6). Nothing else: no grain, no second wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_48%_at_84%_2%,color-mix(in_oklab,var(--jp-brand-amber)_11%,transparent),transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--jp-brand-amber)_32%,transparent)_26%,color-mix(in_oklab,var(--jp-brand-amber)_50%,transparent)_52%,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-jp-brand-amber">
          Built by contractors
        </p>

        <h1 className="mt-6 max-w-[20ch] font-heading text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance text-jp-text-primary sm:mt-7 sm:text-[3rem] lg:max-w-[24ch] lg:text-[3.5rem] lg:leading-[1.04] xl:text-[4rem] xl:tracking-[-0.03em]">
          Get ahead of what your project will depend on.
        </h1>

        <div className="mt-8 max-w-[58ch] space-y-6 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:mt-10 sm:text-[1.125rem] lg:text-[1.1875rem]">
          <p>
            JiTpro works with your team on one project. We examine the project as it actually stands, identify the scope, information, decisions, selections, approvals, commitments, products, materials, and services it is still depending on, and establish who carries each one and when it is required.
          </p>
          <p>
            <strong className="font-semibold text-jp-text-primary">
              That work happens before those dependencies reach the field as problems.
            </strong>{' '}
            It is an engagement on real work, not software to run, a report to file, or another dashboard. This page explains how it works and what you would get.
          </p>
        </div>

        {/* The primary action and its quiet alternative are one decision with
            two doors (Section 46.3), so they sit in one group. The secondary
            is a real anchor to the guide below (Section 50.4): keyboard
            reachable, announced as a link, and openable in a new tab. */}
        <div className="mt-10 flex flex-col items-start sm:mt-12 sm:flex-row sm:items-center sm:gap-6">
          <PrimaryAction />

          <a
            href={`#${GUIDE_ANCHOR_ID}`}
            className="mt-5 inline-flex items-center gap-2 rounded px-3 py-3 text-[0.9375rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:mt-0"
          >
            <ChevronDown size={15} aria-hidden="true" className="shrink-0" />
            <span className="underline decoration-1 underline-offset-4">Start the guide</span>
          </a>
        </div>
      </div>
    </section>
  );
}
