import { ArrowRight, ChevronRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

/**
 * Section 1 — the hero (Decision Log 2026-11-05, the six-section homepage;
 * Section 20.1 amendment of the same date).
 *
 *   EYEBROW   "One project. Your team. Our expertise." (revised 2026-11-13,
 *             replacing "Your project. Your team. Our expertise.", itself
 *             revised 2026-11-05 from "Built by contractors")
 *   H1        one h1 in primary ink telling three acts in one region (the
 *             three-act headline, 2026-11-15): "Broken schedules? / Broken
 *             promises? / Broken profits?" (the problem, revised 2026-11-05),
 *             "It doesn't have to be this way." (the turning point), and
 *             "Keep your schedules. / Keep your promises. / Keep your
 *             profits." (the outcome, which stays)
 *   STATEMENT "JiTpro helps protect your schedule, your promises, and your
 *             profits by getting the field what it needs, when it needs it."
 *             (copy revised 2026-11-13; three lines from `sm`, four on phones)
 *             beneath the headline, holding its place from load and fading
 *             in after the headline's outcome (2026-11-15; was static and
 *             visible on load, 2026-11-13)
 *   ACTIONS   the primary to /contact and the quiet secondary to /learn-more
 *
 * COMPACT BY DESIGN (revised 2026-11-05 after review): the headline, the
 * supporting statements and the primary action are meant to share one
 * typical desktop viewport, so the spacing between them is deliberately
 * tight and the headline sits one step below the previous hero's scale.
 *
 * MOTION (2026-11-15; was NO MOTION, 2026-11-13). The three-act headline
 * plays once, resting on the outcome at 8.0 s; the supporting statement then
 * fades in, opacity only, from 9.2 s to 10.1 s, both on one clock. The eyebrow and the actions never
 * move, and nothing changes position. The entrance animation and the hand-drawn
 * underline of the previous hero (HomeHero.tsx, kept in place and preserved
 * at tag `homepage-pre-messaging-simplification-2026-11-05`) do not carry
 * over.
 *
 * THE CINEMATIC COMPOSITION (founder direction 2026-11-17, issue #84;
 * §20.1 and §48.8 scoped exceptions). The approved sunset residence
 * photograph replaces the house render as the hero's image layer, bright and
 * uncropped in spirit: the residence holds the right, the copy the left, in
 * one left-aligned column. From `lg` the photograph spans the hero behind the
 * copy, scaled past the right edge so the house clears the column, and a
 * navy scrim anchored to the copy column (not the viewport) protects the
 * text and fades out before the house. No broad darkening. Below `lg` the
 * photograph is a full-bleed band framed on the house, the copy following on
 * --jp-background over its faded foot. Every overlay derives from
 * --jp-background. The previous treatment (house-render-*.webp, its
 * `lighten` merge, warm key and grain) is preserved unchanged in
 * HomeHero.tsx and in git.
 *
 * The animation is unchanged: the clock, act classes, grid cell and
 * reduced-motion behaviour below are as approved on 2026-11-15; only the
 * alignment of the copy moved from centred to left.
 *
 * AMBER on this surface (§48.7): the eyebrow, the supporting statement (the
 * value proposition), the primary action, and the top hairline. The headline
 * is ink, not amber.
 */

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/hero/luxury-glass-house-at-sunset`;

/** --jp-background at a given strength over the photograph. */
const scrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;

/**
 * From `lg`: the copy column's scrim, read right to left from a point 10rem
 * past the column, so it follows the column at every width and has faded out
 * before the residence.
 */
const COPY_SCRIM = {
  backgroundImage: `linear-gradient(270deg, transparent 0, ${scrim(55)} 5rem, ${scrim(84)} 10rem, ${scrim(90)} 100%)`,
};

/** From `lg`: the navigation seam at the top and the hand-off at the foot. */
const EDGE_FADES = {
  backgroundImage: `linear-gradient(180deg, ${scrim(40)} 0%, transparent 12%, transparent 80%, var(--jp-background) 100%)`,
};

/** Wider than the image layer (from 2000 px): its left edge hands off to --jp-background. */
const LAYER_LEFT_FADE = {
  backgroundImage: 'linear-gradient(90deg, var(--jp-background) 0%, transparent 100%)',
};

/** Below `lg`: the band fades in from the navigation and out into the copy. */
const BAND_FADES = {
  backgroundImage: `linear-gradient(180deg, ${scrim(35)} 0%, transparent 18%, transparent 48%, ${scrim(70)} 78%, var(--jp-background) 100%)`,
};

/* -------------------------------------------------- three-act headline */

/** Act 1, the problem, and Act 3, the outcome: three lines each. */
const HEADLINE_PROBLEM = ['Broken schedules?', 'Broken promises?', 'Broken profits?'] as const;
const HEADLINE_OUTCOME = ['Keep your schedules.', 'Keep your promises.', 'Keep your profits.'] as const;

/**
 * The one clock for the three-act headline (§46.3, Decision Log 2026-11-15).
 * Every act's timing below is derived from these durations, in order:
 * problem hold 2300 → dissolve 700 → pause 400 → turning point resolve 600 →
 * hold 2000 → dissolve 800 → pause 400 → outcome resolve 800 = 8000 ms;
 * then, for the supporting statement, pause 1200 → fade in 900 = 10100 ms.
 */
const HEADLINE_CLOCK = {
  problemHoldMs: 2300,
  problemDissolveMs: 700,
  pauseMs: 400,
  turnResolveMs: 600,
  turnHoldMs: 2000,
  turnDissolveMs: 800,
  outcomeResolveMs: 800,
  statementPauseMs: 1200,
  statementFadeMs: 900,
} as const;

const turnInMs = HEADLINE_CLOCK.problemHoldMs + HEADLINE_CLOCK.problemDissolveMs + HEADLINE_CLOCK.pauseMs;
const turnOutMs = turnInMs + HEADLINE_CLOCK.turnResolveMs + HEADLINE_CLOCK.turnHoldMs;
const outcomeInMs = turnOutMs + HEADLINE_CLOCK.turnDissolveMs + HEADLINE_CLOCK.pauseMs;
const statementInMs = outcomeInMs + HEADLINE_CLOCK.outcomeResolveMs + HEADLINE_CLOCK.statementPauseMs;

const ms = (value: number) => `${value}ms`;

/** Each act's timing, read by its class in index.css. */
const HEADLINE_ACT_TIMING = {
  problem: {
    '--jp-hero-out-delay': ms(HEADLINE_CLOCK.problemHoldMs),
    '--jp-hero-out-duration': ms(HEADLINE_CLOCK.problemDissolveMs),
  },
  turn: {
    '--jp-hero-in-delay': ms(turnInMs),
    '--jp-hero-in-duration': ms(HEADLINE_CLOCK.turnResolveMs),
    '--jp-hero-out-delay': ms(turnOutMs),
    '--jp-hero-out-duration': ms(HEADLINE_CLOCK.turnDissolveMs),
  },
  outcome: {
    '--jp-hero-in-delay': ms(outcomeInMs),
    '--jp-hero-in-duration': ms(HEADLINE_CLOCK.outcomeResolveMs),
  },
  statement: {
    '--jp-hero-in-delay': ms(statementInMs),
    '--jp-hero-in-duration': ms(HEADLINE_CLOCK.statementFadeMs),
  },
} as unknown as Record<'problem' | 'turn' | 'outcome' | 'statement', CSSProperties>;

/* ---------------------------------------------------------------- hero */

export default function ProfitHero() {
  return (
    <section className="relative isolate overflow-hidden bg-jp-background px-6 pb-14 sm:px-8 sm:pb-16 lg:flex lg:min-h-[min(48rem,calc(100svh-5rem))] lg:items-stretch lg:px-10 lg:pb-0">
      {/* The photograph: below `lg` a full-bleed band framed on the house,
          its height capped by the viewport so the actions stay in the first
          view on short phones;
          from `lg` the hero's image layer, at least 112% of the hero's width
          (at most 2000 px), its right edge cropped so the house clears the
          copy, flush right once it no longer fills the width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mx-6 h-[min(84vw,30rem,38svh)] sm:-mx-8 lg:absolute lg:inset-y-0 lg:right-[min(0px,calc(100%-min(112%,2000px)))] lg:mx-0 lg:h-auto lg:w-[min(112%,2000px)]"
      >
        <img
          src={`${HERO_IMAGE}-1672.webp`}
          srcSet={`${HERO_IMAGE}-960.webp 960w, ${HERO_IMAGE}-1672.webp 1672w`}
          sizes="(min-width: 1024px) min(112vw, 2000px), 100vw"
          width={1672}
          height={941}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="block h-full w-full object-cover object-[82%_center] lg:object-[right_40%]"
        />
        <div className="absolute inset-0 lg:hidden" style={BAND_FADES} />
        <div className="absolute inset-y-0 left-0 hidden w-[14%] min-[2000px]:block" style={LAYER_LEFT_FADE} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block" style={EDGE_FADES} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--jp-brand-amber)_32%,transparent)_26%,color-mix(in_oklab,var(--jp-brand-amber)_50%,transparent)_52%,transparent)]"
      />

      <div className="relative mx-auto -mt-16 w-full max-w-7xl sm:-mt-24 lg:mt-0 lg:flex lg:items-center lg:py-20">
        {/* From `lg`: the copy column's scrim, from the viewport's left edge
            to 10rem past the column. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[-50vw] hidden w-[calc(50vw+30rem+10rem)] lg:block xl:w-[calc(50vw+38rem+10rem)]"
          style={COPY_SCRIM}
        />

        <div className="relative lg:max-w-[30rem] xl:max-w-[38rem]">
          {/* Authored in sentence case and uppercased in CSS (§7.7), so
              assistive technology receives normally-cased text. Smaller and
              less tracked below `sm` to suit the longer line; balanced so a
              narrow wrap breaks between statements rather than inside one. */}
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-balance text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
            One project. Your team. Our expertise.
          </p>

          {/* One h1 in primary ink. One step smaller below `sm`, and below
              about 413 px scaled with the viewport (7.75vw), so the longest
              line, "Keep your schedules.", holds a single line within the
              gutters down to 320 px.

              The three-act headline (§20.1, 2026-11-15): assistive technology
              receives the outcome once, as stable text; the animated acts are
              hidden from it. The three acts share one grid cell, so the region
              is always the size of the largest act and nothing around it moves.
              Left-aligned with the column (2026-11-17); the turning point sits
              centred vertically in that region and may wrap to two
              balanced lines where one does not fit. */}
          <h1 className="mt-4 font-heading text-[length:min(2rem,7.75vw)] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:mt-5 sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.75rem]">
            <span className="sr-only">{HEADLINE_OUTCOME.join(' ')}</span>
            <span aria-hidden="true" className="grid">
              <span
                className="jp-hero-act-problem pointer-events-none col-start-1 row-start-1 select-none"
                style={HEADLINE_ACT_TIMING.problem}
              >
                {HEADLINE_PROBLEM.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </span>
              <span
                className="jp-hero-act-turn pointer-events-none col-start-1 row-start-1 self-center text-balance select-none"
                style={HEADLINE_ACT_TIMING.turn}
              >
                It doesn&apos;t have to be this way.
              </span>
              <span
                className="jp-hero-act-outcome col-start-1 row-start-1"
                style={HEADLINE_ACT_TIMING.outcome}
              >
                {HEADLINE_OUTCOME.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          {/* The supporting statement: the value proposition, in Brand Amber,
              below the headline's scale so the headline stays dominant. It
              holds its place from the first frame and fades in, opacity only,
              1.2 s after the outcome has resolved (§20.1, 2026-11-15). */}
          <p
            style={HEADLINE_ACT_TIMING.statement}
            className="jp-hero-statement-reveal mt-5 max-w-[34ch] font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.015em] text-balance text-jp-brand-amber sm:mt-6 sm:max-w-[40ch] sm:text-[1.5rem] lg:text-[1.625rem]">
            JiTpro helps protect your schedule, your promises, and your profits by getting the field what it needs, when it needs it.
          </p>

          {/* One decision with two doors (§48.1): the primary, and the quiet
              secondary with no fill, no border and no amber at rest. */}
          <div className="mt-7 flex flex-col items-start sm:mt-8">
            <Link
              to="/contact"
              className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.875rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-6 sm:text-[0.9375rem]"
            >
              <span className="[text-wrap:balance]">Let&apos;s talk about your project</span>
              <ArrowRight size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
            </Link>

            <Link
              to="/learn-more"
              className="mt-2 -ml-3 inline-flex items-center gap-2 rounded px-3 py-3 text-[0.9375rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:mt-3"
            >
              <ChevronRight size={15} aria-hidden="true" className="shrink-0" />
              <span className="underline decoration-1 underline-offset-4">See how JiTpro works</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
