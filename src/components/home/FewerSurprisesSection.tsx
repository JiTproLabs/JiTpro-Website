/**
 * Section 2 — fewer surprises (Decision Log 2026-11-05).
 *
 * The two ways JiTpro protects profit: seeing what's coming before it reaches
 * the field, and keeping a clear record when something changes. Still on
 * --jp-background, so it continues the hero's act without a seam (§48.6).
 *
 * COMPOSITION (layout refinement 2026-11-05; the copy is fixed):
 *
 *   RULE      a full-width hairline in --jp-border with a short Brand Amber
 *             segment at the shared left edge, like a dimension line's
 *             start mark
 *   LEFT      the heading, three sentences one per line at a display register
 *             with the outcome, "Keep more of the profit you've earned.", in
 *             Brand Amber (no figure, no guarantee: §20.1 as amended)
 *   RIGHT     the three explanatory paragraphs as one group, in their
 *             original order, at one register and one rhythm
 *   CLOSE     the bold closing statement, centered beneath both columns
 *
 * The columns are separated by whitespace and a shared top line, not by a
 * divider. Stacked, the heading reads first, then the paragraphs, then the
 * close.
 *
 * AMBER (§48.7): the rule segment and the heading's last line, nothing else.
 * Structure is hairline and ink; no cards, icons or fills (§48.2, §48.4).
 */
export default function FewerSurprisesSection() {
  return (
    <section className="bg-jp-background px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 lg:px-10 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div aria-hidden="true" className="relative h-px bg-jp-border/12">
          <span className="absolute inset-y-0 left-0 w-16 bg-jp-brand-amber sm:w-24" />
        </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16 xl:gap-x-24">
          <div>
            {/* The amber line is longer than the two above it, so it is
                balanced across its own lines rather than left ragged, and
                the scale sits a step below the earlier three-word version. */}
            <h2 className="font-heading text-[2rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-jp-text-primary sm:text-[2.75rem] lg:text-[2.75rem] xl:text-[3.25rem]">
              <span className="block">Fewer surprises.</span>
              <span className="block">More control.</span>
              <span className="mt-1 block max-w-[16ch] text-balance text-jp-brand-amber sm:mt-1.5">
                Keep more of the profit you&apos;ve earned.
              </span>
            </h2>
          </div>

          <div className="mt-12 max-w-[56ch] space-y-6 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:mt-2 lg:text-[1.1875rem]">
            <p>
              You can&apos;t prevent every problem in construction. But you shouldn&apos;t have to find out about a problem when it&apos;s threatening to stop your crews.
            </p>
            <p>JiTpro helps you see what&apos;s coming, long before it reaches the field.</p>
            <p>
              And when something changes, we help you keep a clear record of what happened, who was responsible, and how it affects your project.
            </p>
          </div>
        </div>

        {/* The conclusion, centered beneath both columns and a step below
            its earlier register so it closes the section without competing
            with the heading. One line from `lg` (sized to fit the 1024px
            container with room to spare); below that it wraps, balanced. */}
        <p className="mx-auto mt-14 max-w-[40ch] text-center font-heading text-[1.125rem] font-bold leading-[1.35] tracking-[-0.01em] text-balance text-jp-text-primary sm:mt-16 sm:text-[1.25rem] lg:mt-20 lg:max-w-none lg:whitespace-nowrap lg:text-[1.25rem] xl:text-[1.375rem]">
          Less guessing. Less time spent trying to figure out what went wrong six months ago.
        </p>
      </div>
    </section>
  );
}
