/**
 * Section 4 — throughout the project (Decision Log 2026-11-05; revised
 * 2026-11-13: one project at a time).
 *
 * Closes the light act begun by Section 3. The two share --jp-surface-light,
 * so the boundary is a hairline inside the container rather than a change of
 * surface (§48.6).
 *
 * MESSAGE: the one-project-at-a-time engagement model. JiTpro starts with one
 * project alongside the existing team, with no company-wide overhaul, stays
 * involved throughout (never a one-time report), and what works can carry
 * forward. It does not claim the team's practices need no change.
 *
 * COMPOSITION: the 5fr / 7fr grid from `lg`.
 *   LEFT   the eyebrow (mono, uppercase, slate: amber text fails on the light
 *          surface, §8.8) above the h2
 *   RIGHT  the introduction at a large body register in the strongest ink,
 *          then the two points as one list on fine rules, unnumbered (they are
 *          not a sequence): a bold heading-face title and one sentence each
 * No amber, cards, icons or motion.
 *
 * ENGAGEMENT MODEL (§20.1, binding): JiTpro works with the GC's team, and the
 * GC's team runs the job. Nothing here may suggest JiTpro contacts project
 * participants itself or replaces the project manager.
 */

const POINTS = [
  {
    title: 'Plan early. Stay involved.',
    body: 'We do the detailed procurement planning up front, then help your team stay ahead of decisions, commitments, and potential problems throughout the project.',
  },
  {
    title: 'One project becomes the foundation for the next.',
    body: 'As your team sees what works, those improvements can carry forward into future projects and, over time, across your company.',
  },
];

export default function ThroughoutProjectSection() {
  return (
    <section className="bg-jp-surface-light px-6 pt-14 pb-24 sm:px-8 sm:pt-16 sm:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-7xl border-t border-jp-ink-secondary/20 pt-12 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 lg:pt-14 xl:gap-x-20">
        <div>
          {/* Authored in sentence case and uppercased in CSS (§7.7). */}
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]">
            One project at a time
          </p>
          <h2 className="mt-4 max-w-[18ch] font-heading text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:mt-5 sm:text-[2.5rem] lg:text-[3rem]">
            We&apos;re with you throughout the project.
          </h2>
        </div>

        <div className="mt-8 max-w-[62ch] lg:mt-9">
          <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-background sm:text-[1.25rem] lg:text-[1.3125rem]">
            We start with one project, working alongside your existing team. No company-wide overhaul. No need to change how you run your business.
          </p>

          <ul className="mt-8 border-b border-jp-ink-secondary/20 sm:mt-10">
            {POINTS.map((point) => (
              <li key={point.title} className="border-t border-jp-ink-secondary/20 py-6 sm:py-7">
                <h3 className="font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.015em] text-balance text-jp-background sm:text-[1.375rem]">
                  {point.title}
                </h3>
                <p className="mt-2 text-[1.0625rem] leading-[1.7] text-pretty text-jp-ink-secondary sm:text-[1.125rem]">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
