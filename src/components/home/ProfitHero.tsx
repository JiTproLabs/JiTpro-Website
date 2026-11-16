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
 *   H1        "Broken schedules? / Broken promises? / Broken profits?" — one
 *             h1, three lines, all in primary ink (revised 2026-11-05) —
 *             turning, one line at a time, into "Keep your schedules. / Keep
 *             your promises. / Keep your profits." (the headline turn,
 *             2026-11-15)
 *   STATEMENT "JiTpro helps protect your schedule, your promises, and your
 *             profits by getting the field what it needs, when it needs it."
 *             (copy revised 2026-11-13; three lines from `sm`, four on phones)
 *             beneath the headline, static and visible on load (revised
 *             2026-11-13, replacing the rotating message sequence)
 *   ACTIONS   the primary to /contact and the quiet secondary to /learn-more
 *
 * COMPACT BY DESIGN (revised 2026-11-05 after review): the headline, the
 * supporting statements and the primary action are meant to share one
 * typical desktop viewport, so the spacing between them is deliberately
 * tight and the headline sits one step below the previous hero's scale.
 *
 * ONE MOTION (2026-11-15; was NO MOTION, 2026-11-13). Every word of the hero
 * is there on load; the headline turn is the only thing that moves, once,
 * resolving at 6.0 s. The eyebrow, the supporting statement and the actions
 * never move. The entrance animation and the hand-drawn
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

/* ------------------------------------------------------- headline turn */

/** The headline's three lines: each question and the outcome it turns into. */
const HEADLINE_TURNS = [
  { question: 'Broken schedules?', outcome: 'Keep your schedules.' },
  { question: 'Broken promises?', outcome: 'Keep your promises.' },
  { question: 'Broken profits?', outcome: 'Keep your profits.' },
] as const;

/**
 * The one clock for the headline turn (§46.3, Decision Log 2026-11-15): a
 * 1.95 s hold on the questions, then each line turns over 900 ms with 675 ms
 * between turns, resolving at 1950 + 3 × 900 + 2 × 675 = 6000 ms.
 */
const HEADLINE_TURN_CLOCK = { holdMs: 1950, turnMs: 900, pauseMs: 675 } as const;

/** Line `index`'s timing, derived from the clock and read by both its texts. */
function headlineTurnTiming(index: number): CSSProperties {
  const { holdMs, turnMs, pauseMs } = HEADLINE_TURN_CLOCK;
  return {
    '--jp-hero-turn-delay': `${holdMs + index * (turnMs + pauseMs)}ms`,
    '--jp-hero-turn-duration': `${turnMs}ms`,
  } as CSSProperties;
}

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

        {/* One h1, three lines, all in primary ink. One step smaller below
            `sm`, and below about 413 px scaled with the viewport (7.75vw), so
            the longest outcome, "Keep your schedules.", holds a single line
            within the gutters down to 320 px.

            The headline turn (§20.1, 2026-11-15): assistive technology
            receives the resolved headline once, as stable text; the animated
            lines are hidden from it. Each line is a one-cell grid holding the
            question and the outcome in the same cell, so it reserves the
            wider of the two and nothing shifts as it turns. */}
        <h1 className="mx-auto mt-4 text-center font-heading text-[length:min(2rem,7.75vw)] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:mt-5 sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.75rem]">
          <span className="sr-only">{HEADLINE_TURNS.map((line) => line.outcome).join(' ')}</span>
          <span aria-hidden="true">
            {HEADLINE_TURNS.map((line, index) => (
              <span
                key={line.outcome}
                className="grid justify-items-center"
                style={headlineTurnTiming(index)}
              >
                <span className="jp-hero-turn-out pointer-events-none col-start-1 row-start-1 whitespace-nowrap select-none">
                  {line.question}
                </span>
                <span className="jp-hero-turn-in col-start-1 row-start-1 whitespace-nowrap">
                  {line.outcome}
                </span>
              </span>
            ))}
          </span>
        </h1>

        {/* The supporting statement: the value proposition, in Brand Amber,
            below the headline's scale so the headline stays dominant. */}
        <p className="mx-auto mt-5 max-w-[34ch] text-center font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.015em] text-balance text-jp-brand-amber sm:mt-6 sm:max-w-[40ch] sm:text-[1.5rem] lg:text-[1.625rem]">
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
