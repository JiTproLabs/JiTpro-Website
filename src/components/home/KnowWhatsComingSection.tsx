/**
 * Section 3 — know what's coming (Decision Log 2026-11-05).
 *
 * Opens the light act, which carries sections 3 and 4: what JiTpro does at
 * the start, and what it does every week after. This is
 * the plain-English summary of the method that the Section 20.1 amendment of
 * 2026-11-05 approves for the homepage; the operational detail lives on
 * /learn-more.
 *
 * THREE ZONES (Decision Log 2026-11-05, --jp-surface-white): the challenge on
 * --jp-surface-light, the process on --jp-surface-white, the result on
 * --jp-surface. From lg up, zones 1 and 2 take Section 4's 5fr/7fr grid.
 *
 * THE CAPACITY MESSAGE (added 2026-11-05 after review) opens the section:
 * contractors know early planning matters, but the start of a job crowds it
 * out, and JiTpro gives their team dedicated planning support from the
 * start. Support, never replacement: the GC's team keeps running the job. It replaces the former opening line
 * ("We don't wait until your project is in trouble."), which said the same
 * thing less specifically.
 *
 * THE FOUR STEPS are a §46.10 step disclosure list (Decision Log
 * 2026-11-05): one full-width row per step, every row collapsed at first,
 * click, tap, Enter or Space toggling that row's description. Manual only; no
 * scroll-driven expansion. Ordinals follow §48.9 on the light surface: the
 * data face, small, tracked, --jp-ink-secondary above the §8.8 floor. The
 * hover wash, focus outline and chevron are the §46.8 light-surface row
 * treatments. Hierarchy on this surface is ink; amber carries nothing here.
 *
 * Steps 03 and 04 are distinct activities: 03 builds the procurement chain,
 * 04 links what keeps that chain moving. The approved copy carries the
 * distinction, so every row shares one treatment.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const STEPS = [
  {
    title: 'What does the project need?',
    description:
      'Identify every product, material, and service required to complete the work.',
  },
  {
    title: 'When does it need to arrive on-site?',
    description:
      'Establish when each item must be available to support the construction schedule.',
  },
  {
    title: 'Build the chain.',
    description:
      'Identify and sequence every step required to get each item to the field, using realistic durations and working backward from its required on-site date.',
  },
  {
    title: 'Link everything required to support the chain.',
    description:
      'Connect the decisions, information, approvals, and commitments each step depends on. Identify who’s responsible and when action is required.',
  },
];

export default function KnowWhatsComingSection() {
  const [open, setOpen] = useState<boolean[]>(() => STEPS.map(() => false));
  const toggle = (index: number) =>
    setOpen((prev) => prev.map((value, i) => (i === index ? !value : value)));

  return (
    <section>
      {/* Zone 1 — the challenge. */}
      <div className="bg-jp-surface-light px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20 lg:px-10 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
          <h2 className="max-w-[24ch] font-heading text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.5rem] lg:text-[3rem]">
            Know what&apos;s coming. From day one.
          </h2>

          {/* Why the early planning gets skipped: the reader already knows it
              matters, and the start of a job leaves no time for it. Capacity,
              never competence (§20.1 audience rule). */}
          <div className="mt-8 max-w-[62ch] lg:mt-2">
            <h3 className="font-heading text-[1.25rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.375rem]">
              Every contractor knows planning ahead matters.
            </h3>
            <div className="mt-4 space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem]">
              <p>
                But when a new project starts, your team gets buried in the same problems as the last job, and detailed planning gets pushed aside. Before long, you&apos;re putting out the same fires you promised yourself you&apos;d avoid next time.
              </p>
              <p className="font-semibold text-jp-background">
                JiTpro gives your team dedicated planning support from the start, so you can stay ahead of problems instead of chasing them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2 — the process, raised one step onto white. */}
      <div className="bg-jp-surface-white px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
          <div className="max-w-[44ch] space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:pt-5">
            <p>We start by looking at your schedule, drawings, and project information.</p>
            <p>We do the detailed planning so your team knows exactly what needs to happen.</p>
          </div>

          {/* §46.10: one row per step, hairlines between rows only. Each row's
              chevron and description derive from that row's one open flag. */}
          <ol className="mt-10 divide-y divide-jp-ink-secondary/20 lg:mt-0">
            {STEPS.map((step, i) => {
              const isOpen = open[i];
              const panelId = `know-whats-coming-step-${i + 1}`;
              return (
                <li key={step.title}>
                  <h3>
                    {/* The negative margin keeps the ordinal on the shared left
                        edge while the hover wash clears the text. */}
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="group -mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer items-baseline gap-5 px-3 py-5 text-left transition-colors duration-200 ease-out hover:bg-jp-ink-secondary/[0.07] focus-visible:bg-jp-ink-secondary/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background motion-reduce:transition-none sm:gap-8 sm:py-6"
                    >
                      <span className="w-8 shrink-0 font-mono text-xs tracking-[0.2em] text-jp-ink-secondary/85">
                        <span className="sr-only">Step </span>
                        {`0${i + 1}`}
                      </span>
                      <span className="min-w-0 font-heading text-[1.1875rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.25rem]">
                        {step.title}
                      </span>
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`ml-auto shrink-0 self-center transition-[color,transform] duration-200 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? 'rotate-180 text-jp-background'
                            : 'text-jp-ink-secondary/85 group-hover:text-jp-background group-focus-visible:text-jp-background'
                        }`}
                      />
                    </button>
                  </h3>

                  {/* Height reveal via grid rows; visibility removes a collapsed
                      description from the tab order and accessibility tree once
                      the close finishes. Reduced motion: no transition. */}
                  <div
                    id={panelId}
                    role="region"
                    aria-label={step.title}
                    className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${
                      isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-6 pl-[3.25rem] pr-8 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:pb-7 sm:pl-16 sm:text-[1.125rem]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

        </div>
      </div>

      {/* Zone 3 — the result. A dark close on --jp-surface; one sentence per
          line, with the section's single amber on the first (§48.7). */}
      <div className="bg-jp-surface px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem]">
            We turn those answers into a clear plan your team can follow.
          </p>

          <p className="mt-6 font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-jp-text-primary sm:mt-8 sm:text-[2.125rem] lg:text-[2.5rem]">
            <span className="block text-jp-brand-amber">You know what&apos;s coming.</span>{' '}
            <span className="block text-balance">Your team knows what to do and when to do it.</span>{' '}
            <span className="block text-balance">Your client knows what to expect.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
