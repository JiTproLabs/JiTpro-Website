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
 * THE BACKGROUND is the approved house render treatment (§48.8 bounded
 * exception) reproduced from HomeHero.tsx rather than extracted from it, so
 * the previous hero stays untouched. It is the resting state of that
 * treatment: the same opacity, mask, `lighten` merge, scrim, grain and bottom
 * hand-off, without the reveal.
 *
 * AMBER on this surface (§48.7): the eyebrow, the supporting statement (the
 * value proposition), the primary action, and the lighting (the warm key and
 * the top hairline). The headline is ink, not amber.
 */

// Very light grain over the hero lighting, matching HomeHero.tsx.
const HERO_NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

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
    <section className="relative isolate overflow-hidden bg-jp-background px-6 pt-14 pb-14 sm:px-8 sm:pt-16 sm:pb-16 lg:px-10 lg:pt-20 lg:pb-20">
      {/* The lighting stack, as in HomeHero.tsx: the house render, the warm
          key, the scrim under the copy column, the grain, and the bottom
          hand-off to --jp-background. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 bottom-0 mx-auto w-full opacity-55 mix-blend-lighten lg:max-w-[1120px]"
          style={{
            maskImage: 'linear-gradient(180deg, transparent 0%, black 18%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 18%)',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/hero/house-render-1600.webp`}
            srcSet={`${import.meta.env.BASE_URL}assets/hero/house-render-800.webp 800w, ${import.meta.env.BASE_URL}assets/hero/house-render-1600.webp 1600w`}
            sizes="(min-width: 1024px) 1120px, 100vw"
            width={1600}
            height={954}
            alt=""
            loading="eager"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(52%_48%_at_84%_2%,color-mix(in_oklab,var(--jp-brand-amber)_13%,transparent),transparent_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(44%_60%_at_50%_44%,color-mix(in_oklab,var(--jp-background)_80%,transparent),transparent_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `url("${HERO_NOISE}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_62%,color-mix(in_oklab,var(--jp-background)_58%,transparent)_86%,var(--jp-background)_100%)]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--jp-brand-amber)_32%,transparent)_26%,color-mix(in_oklab,var(--jp-brand-amber)_50%,transparent)_52%,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Authored in sentence case and uppercased in CSS (§7.7), so
            assistive technology receives normally-cased text. Smaller and
            less tracked below `sm` to suit the longer line; balanced so a
            narrow wrap breaks between statements rather than inside one. */}
        <p className="text-center font-mono text-xs font-bold uppercase tracking-[0.16em] text-balance text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
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
            The turning point sits centred in that region and may wrap to two
            balanced lines where one does not fit. */}
        <h1 className="mx-auto mt-4 text-center font-heading text-[length:min(2rem,7.75vw)] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:mt-5 sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.75rem]">
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
          className="jp-hero-statement-reveal mx-auto mt-5 max-w-[34ch] text-center font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.015em] text-balance text-jp-brand-amber sm:mt-6 sm:max-w-[40ch] sm:text-[1.5rem] lg:text-[1.625rem]">
          JiTpro helps protect your schedule, your promises, and your profits by getting the field what it needs, when it needs it.
        </p>

        {/* One decision with two doors (§48.1): the primary, and the quiet
            secondary with no fill, no border and no amber at rest. */}
        <div className="mt-7 flex flex-col items-center sm:mt-8">
          <Link
            to="/contact"
            className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.875rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-6 sm:text-[0.9375rem]"
          >
            <span className="[text-wrap:balance]">Let&apos;s talk about your project</span>
            <ArrowRight size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
          </Link>

          <Link
            to="/learn-more"
            className="mt-2 inline-flex items-center gap-2 rounded px-3 py-3 text-[0.9375rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:mt-3"
          >
            <ChevronRight size={15} aria-hidden="true" className="shrink-0" />
            <span className="underline decoration-1 underline-offset-4">See how JiTpro works</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
