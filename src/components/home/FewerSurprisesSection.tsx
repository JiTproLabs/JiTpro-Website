/**
 * Section 2 — fewer surprises (Decision Log 2026-11-05; recomposed
 * 2026-11-13).
 *
 * The ways JiTpro protects profit, as three benefits: seeing problems
 * earlier, managing change, and keeping the record. Still on --jp-background,
 * so it continues the hero's act without a seam (§48.6).
 *
 * COMPOSITION (founder brief 2026-11-13: an editorial composition, distinct
 * from the procurement section above it):
 *
 *   RULE      a full-width hairline in --jp-border with a short Brand Amber
 *             segment at the shared left edge, like a dimension line's
 *             start mark
 *   LEFT      (about 40%) the heading, the section's anchor: three sentences
 *             one per line at a display register, the outcome, "Keep more of
 *             the profit you've earned.", in Brand Amber (no figure, no
 *             guarantee: §20.1 as amended)
 *   RIGHT     (about 60%) three benefits as one ordered list of editorial
 *             entries, not cards: a fine rule above each (and one closing
 *             the list), a small mono numeral in Brand Amber, a title at the
 *             statement register, one sentence at the body register. The
 *             order is the life of a problem: before, during, after.
 *
 * Stacked below `lg`: the heading, then the benefits.
 *
 * AMBER (§48.7): the rule segment, the heading's last line and the three
 * numerals, nothing else. No cards, icons, fills, shadows or motion (§48.2,
 * §48.4).
 */

const BENEFITS = [
  { n: '01', title: 'See problems earlier', body: 'Identify procurement problems before they disrupt the field.' },
  { n: '02', title: 'Manage change', body: 'Understand what changed and how it affects your project.' },
  {
    n: '03',
    title: 'Keep the record',
    body: 'Know what happened, who was responsible, and why, without reconstructing the story six months later.',
  },
];

export default function FewerSurprisesSection() {
  return (
    <section className="bg-jp-background px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 lg:px-10 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div aria-hidden="true" className="relative h-px bg-jp-border/12">
          <span className="absolute inset-y-0 left-0 w-16 bg-jp-brand-amber sm:w-24" />
        </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-x-16 xl:gap-x-24">
          <div>
            {/* The anchor. The amber line is longer than the two above it,
                so it is balanced across its own lines rather than left
                ragged. */}
            <h2 className="font-heading text-[2rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-jp-text-primary sm:text-[2.75rem] lg:text-[2.75rem] xl:text-[3.25rem]">
              <span className="block">Fewer surprises.</span>
              <span className="block">More control.</span>
              <span className="mt-1 block max-w-[16ch] text-balance text-jp-brand-amber sm:mt-1.5">
                Keep more of the profit you&apos;ve earned.
              </span>
            </h2>
          </div>

          {/* The benefits: one ordered list, stacked editorial entries on
              fine rules, each numeral on its title's baseline. The numeral is
              shown for the eye; the list itself carries the order for
              assistive technology. */}
          <ol className="mt-12 border-b border-jp-border/20 lg:mt-1">
            {BENEFITS.map((b) => (
              <li
                key={b.n}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-jp-border/20 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-8"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-bold tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]"
                >
                  {b.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-[1.375rem] font-bold leading-[1.25] tracking-[-0.015em] text-jp-text-primary sm:text-[1.5rem] lg:text-[1.625rem]">
                    {b.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-jp-text-secondary sm:text-[1.125rem] lg:text-[1.1875rem]">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
