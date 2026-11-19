import { CalendarDays, Layers, type LucideIcon } from 'lucide-react';

/**
 * Section 4: one project at a time (Decision Log 2026-11-05; revised
 * 2026-11-13; redesigned 2026-11-17 from the founder-approved mockup and
 * artwork in docs/design/assets/homepage-one-project, Design System §20.1).
 *
 * Closes the light act begun by Section 3. The two share --jp-surface-light,
 * so the boundary is a hairline inside the container rather than a change of
 * surface (§48.6).
 *
 * MESSAGE: start with one project, build a better company. JiTpro starts with
 * one project alongside the existing team, with no company-wide overhaul,
 * stays involved throughout (never a one-time report), and what works can
 * carry forward. It does not claim the team's practices need no change.
 *
 * THE ARTWORK (founder-approved, 2026-11-17): one residence in the
 * foreground, then an amber path rising past a winery and a hotel to a
 * commercial building: one project becoming many. Its ground is rebalanced
 * onto --jp-surface-light and its empty upper sky trimmed, so it has no
 * visible edge. Full bleed, at the section's width (at most 2000px).
 *
 * COMPOSITION
 *   TOP     two columns from `lg`: the eyebrow, the h2 on two lines and a
 *           short amber rule; beside them the introduction beside an amber
 *           bar, centred vertically on the h2 (it shares the h2's grid row)
 *   ARTWORK the residence anchoring the lower left
 *   POINTS  from `xl`, set in the artwork's open lower right, in its own
 *           coordinates (container units), clear of the path; below `xl`,
 *           beneath the artwork, two across from `md`
 *
 * AMBER on the light surface is decorative only (§8.8, as §58.2 and §62.2):
 * the rule, the bar, the icons and their tiles; never text. No motion.
 *
 * ENGAGEMENT MODEL (§20.1, binding): JiTpro works with the GC's team, and the
 * GC's team runs the job. Nothing here may suggest JiTpro contacts project
 * participants itself or replaces the project manager.
 */

const ART = `${import.meta.env.BASE_URL}assets/home/one-project-golden-path`;

const POINTS: ReadonlyArray<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: 'Plan early. Stay involved.',
    body: 'We do the detailed procurement planning up front, then help your team stay ahead of decisions, commitments, and potential problems throughout the project.',
    Icon: CalendarDays,
  },
  {
    title: 'One project becomes the foundation for the next.',
    body: 'As your team sees what works, those improvements can carry forward into future projects and, over time, across your company.',
    Icon: Layers,
  },
];

/** The icon tile: a soft amber wash on white. */
const TILE = { backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 11%, var(--jp-surface-white))' };

/**
 * The two points. `art` is the desktop presentation inside the artwork, sized in its container units; `band` is
 * the in-flow presentation below `xl`. Exactly one is displayed at any width, so assistive technology meets the
 * list once.
 */
function Points({ variant }: { variant: 'art' | 'band' }) {
  const art = variant === 'art';
  return (
    <ul
      className={
        art
          ? 'absolute top-[53%] left-[63%] hidden w-[34%] xl:block'
          : 'mx-auto grid max-w-7xl gap-x-10 px-6 sm:px-8 md:grid-cols-2 lg:px-10 xl:hidden'
      }
    >
      {POINTS.map(({ title, body, Icon }, i) => (
        <li
          key={title}
          className={`grid border-jp-ink-secondary/20 ${
            art
              ? `grid-cols-[4.2cqw_minmax(0,1fr)] gap-x-[1.6cqw] py-[1.25cqw] ${i > 0 ? 'border-t' : ''}`
              : 'grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 border-t py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6'
          }`}
        >
          <span
            aria-hidden="true"
            className={`flex aspect-square w-full items-center justify-center shadow-[0_6px_18px_-10px_color-mix(in_oklab,var(--jp-brand-amber)_45%,transparent)] ${
              art ? 'rounded-[0.9cqw]' : 'rounded-2xl'
            }`}
            style={TILE}
          >
            <Icon strokeWidth={1.6} className={`text-jp-brand-amber ${art ? 'size-[2.1cqw]' : 'size-7 sm:size-8'}`} />
          </span>
          <div className="min-w-0">
            <h3
              className={`font-heading font-bold tracking-[-0.015em] text-balance text-jp-background ${
                art ? 'text-[max(1.0625rem,1.3cqw)] leading-[1.25]' : 'text-[1.25rem] leading-[1.3] sm:text-[1.375rem]'
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-pretty text-jp-ink-secondary ${
                art ? 'mt-[0.45cqw] text-[max(0.875rem,1cqw)] leading-[1.5]' : 'mt-2 text-[1.0625rem] leading-[1.6] sm:text-[1.125rem]'
              }`}
            >
              {body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ThroughoutProjectSection() {
  return (
    <section aria-labelledby="one-project-heading" className="relative isolate overflow-hidden bg-jp-surface-light pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 xl:pb-0">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="border-t border-jp-ink-secondary/20 pt-12 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-x-[clamp(3rem,5vw,6rem)] lg:pt-[clamp(3.5rem,4.2vw,4.5rem)]">
          {/* From `lg` the eyebrow, h2 and rule each take a grid row (lg:contents), so the introduction can sit in
              the h2's row and centre on the headline itself, not on the column. */}
          <div className="lg:contents">
            {/* Authored in sentence case and uppercased in CSS (§7.7). */}
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm lg:col-start-1 lg:row-start-1 lg:mb-[clamp(1.5rem,2.4vw,2.5rem)] lg:text-[clamp(0.875rem,1.05vw,0.9375rem)]">
              One project at a time
            </p>
            <h2
              id="one-project-heading"
              className="mt-5 font-heading text-[min(2.375rem,9.5vw)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance text-jp-background sm:mt-6 sm:text-[3rem] lg:col-start-1 lg:row-start-2 lg:mt-0 lg:text-[clamp(2.125rem,3.45vw,3.45rem)]"
            >
              <span className="block">Start with one project.</span> <span className="block">Build a better company.</span>
            </h2>
            <span aria-hidden="true" className="mt-7 block h-[5px] w-24 rounded-full bg-jp-brand-amber sm:w-28 lg:col-start-1 lg:row-start-3 lg:mt-[clamp(1.5rem,1.9vw,2rem)] lg:w-[clamp(6rem,7.5vw,8rem)]" />
          </div>

          <div className="relative mt-8 pl-6 sm:mt-10 sm:pl-8 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-background sm:text-[1.25rem] lg:text-[clamp(1.125rem,1.55vw,1.375rem)]">
              You don&apos;t have to change your entire company to change how you build your next project.
            </p>
          </div>
        </div>
      </div>

      {/* The artwork, full bleed; from `xl` the points sit in its open lower right. */}
      <div className="@container relative mx-auto mt-10 max-w-[2000px] sm:mt-12 lg:mt-[clamp(1.5rem,2.5vw,3rem)]">
        <img
          src={`${ART}-1717.webp`}
          srcSet={`${ART}-720.webp 720w, ${ART}-1100.webp 1100w, ${ART}-1717.webp 1717w`}
          sizes="min(100vw, 2000px)"
          width={1717}
          height={836}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="block h-auto w-full [mask-image:linear-gradient(180deg,black_86%,transparent)] xl:[mask-image:none] min-[2000px]:[mask-image:linear-gradient(90deg,black_92%,transparent)]"
        />
        {/* The artwork's top edge (empty sky) handed off to the surface, so no edge shows. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-jp-surface-light to-transparent" />
        <Points variant="art" />
      </div>

      <div className="mt-4 sm:mt-6">
        <Points variant="band" />
      </div>
    </section>
  );
}
