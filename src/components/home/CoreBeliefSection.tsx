/**
 * Section 1a — what we believe (Decision Log 2026-11-05, amended 2026-11-06).
 *
 * JiTpro's core belief, between the hero and Section 2: the belief and the
 * planning statement that follows from it. A foundational statement, not a
 * pitch: no action.
 *
 * TREATMENT: the centered editorial statement (§7.7, with the 2026-11-05
 * eyebrow allowance and the 2026-11-06 supporting-copy allowance) set on the
 * elevated band tone (--jp-surface with border-y hairlines in --jp-border at
 * 12%, §48.6). The band is the subtle transition out of the hero: a pause,
 * not a change of act.
 *
 *   EYEBROW    "What we believe", authored in sentence case and uppercased in
 *              CSS (§7.7); one of the band's two ambers (§48.7)
 *   STATEMENT  the section's h2, in the heading face, a step below the hero's
 *              h1, on a tight balanced measure so it breaks as a few lines
 *   SUPPORT    the semibold heading-face statement register in Brand Amber,
 *              centered on the 52ch measure: prominent, but a clear step
 *              below the h2; the band's other amber
 */
export default function CoreBeliefSection() {
  return (
    <section className="border-y border-jp-border/12 bg-jp-surface px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
          What we believe
        </p>

        <h2 className="mx-auto mt-5 max-w-[30ch] font-heading text-[1.625rem] font-bold leading-[1.22] tracking-[-0.02em] text-balance text-jp-text-primary sm:mt-6 sm:text-[2.125rem] lg:text-[2.5rem]">
          Even the most robust construction schedule can&apos;t hold if the field doesn&apos;t have what it needs, when it needs it.
        </h2>

        <p className="mx-auto mt-6 max-w-[52ch] font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance text-jp-brand-amber sm:mt-7 sm:text-[1.4375rem] lg:text-[1.5rem]">
          Early, accurate procurement planning is the first real opportunity general contractors have to make sure the construction schedule can hold.
        </p>
      </div>
    </section>
  );
}
