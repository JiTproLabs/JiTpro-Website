/**
 * Section 1b — procurement is more than buying materials (Decision Log
 * 2026-11-06; copy revised and section recomposed 2026-11-13).
 *
 * What procurement actually involves and why it is hard for a GC to manage,
 * between the core belief and Section 2. Still on --jp-background, so it
 * continues the hero's act; Section 2's own amber-start hairline is the seam
 * beneath it, which is why this section carries no bottom padding of its own
 * (§48.6).
 *
 * COMPOSITION, three groups (founder brief 2026-11-13):
 *
 *   1  From `lg`, an asymmetric 2fr / 3fr grid on the shared left edge.
 *      LEFT   the h2, a short Brand Amber rule, and the opening paragraph at
 *             a large body register, so the column is filled.
 *      RIGHT  the six activities, unlabelled (2026-11-13), as one ordered
 *             sequence on a continuous vertical line, a hollow node at each
 *             step, a small mono numeral (illustrative order) and the
 *             activity in the heading face. A line, not rules: it reads as
 *             progression and differs from Section 2's ruled list.
 *   2  The dependency: under a hairline, on the same columns, the insight at
 *      the statement register (left) and the closing paragraph (right).
 *   3  The conclusion: full width, the section's display line, "Profits
 *      shrink." in Brand Amber.
 *
 * Stacked below `lg` in reading order. The approved copy (founder, 2026-11-13)
 * appears exactly once ("procurement" is a scoped exception to §20.1's
 * retired-language rule). Amber: the short rule and "Profits shrink." only.
 * No motion, cards, icons or graphics (§48.2, §48.4).
 */

const ACTIVITIES = [
  'Drawings completed',
  'Decisions made',
  'Products selected',
  'Subcontractors hired',
  'Submittals approved',
  'Materials delivered',
];

const COLUMNS = 'lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-16 xl:gap-x-24';

export default function ProcurementSection() {
  return (
    <section className="bg-jp-background px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        {/* 1. The composition. */}
        <div className={`${COLUMNS} lg:items-start`}>
          <div>
            <h2 className="max-w-[18ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem]">
              Procurement is more than buying materials.
            </h2>
            <span aria-hidden="true" className="mt-7 block h-0.5 w-12 bg-jp-brand-amber sm:mt-8" />
            <p className="mt-6 max-w-[40ch] text-[1.125rem] leading-[1.6] text-pretty text-jp-text-secondary sm:text-[1.25rem] lg:text-[1.3125rem]">
              Every product, material, and service depends on a sequence of decisions, approvals, and commitments that must happen at the right time.
            </p>
          </div>

          {/* The sequence: one continuous line from the first node to the
              last, a hollow node per step. The numerals are illustrative
              order, shown for the eye; the list carries the order for
              assistive technology, and its accessible name replaces the
              visible label removed on 2026-11-13. From `lg` the -mt-2 sets
              the first activity's cap height level with the headline's. */}
          <div className="mt-10 lg:-mt-2">
            <ol aria-label="Procurement activities" className="relative">
              <span aria-hidden="true" className="absolute top-[1.4rem] bottom-[1.4rem] left-[3.3125rem] w-px bg-jp-border/25 sm:left-[3.8125rem]" />
              {ACTIVITIES.map((activity, i) => (
                <li key={activity} className="relative grid grid-cols-[2.5rem_1.625rem_minmax(0,1fr)] items-center py-2.5 sm:grid-cols-[3rem_1.625rem_minmax(0,1fr)] sm:py-3">
                  <span aria-hidden="true" className="font-mono text-xs font-bold tracking-[0.16em] text-jp-text-secondary/80 sm:text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="relative mx-auto block size-2.5 rounded-full border border-jp-border/60 bg-jp-background" />
                  <span className="pl-3 font-heading text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] text-jp-text-primary sm:pl-4 sm:text-[1.375rem] lg:text-[1.5rem]">
                    {activity}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 2. The dependency, on the same columns beneath a hairline. */}
        <div className={`mt-14 border-t border-jp-border/12 pt-10 sm:mt-16 sm:pt-12 ${COLUMNS} lg:items-baseline`}>
          <p className="max-w-[24ch] font-heading text-[1.375rem] font-semibold leading-[1.3] tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.5rem] lg:text-[1.625rem]">
            Much of this work depends on people outside your company.
          </p>
          <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:mt-0 lg:text-[1.1875rem]">
            One missed decision or late approval can delay deliveries, disrupt crews, and push work further down the schedule.
          </p>
        </div>

        {/* 3. The conclusion: the section's payoff, full width. */}
        <p className="mt-16 font-heading text-[2.25rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-jp-text-primary sm:mt-20 sm:text-[3.5rem] lg:mt-24 lg:text-[4.25rem] xl:text-[5rem]">
          <span className="block">Those delays spread. </span>
          <span className="block">
            Costs grow. <span className="whitespace-nowrap text-jp-brand-amber">Profits shrink.</span>
          </span>
        </p>
      </div>
    </section>
  );
}
