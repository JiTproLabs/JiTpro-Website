import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Section 1 — the hero (Decision Log 2026-11-05, the six-section homepage;
 * Section 20.1 amendment of the same date).
 *
 *   EYEBROW   "Your project. Your team. Our expertise." (revised 2026-11-05,
 *             replacing "Built by contractors")
 *   H1        "Broken schedules? / Broken promises? / Broken profits?" — one
 *             h1, three lines, all in primary ink (revised 2026-11-05)
 *   MESSAGES  one shared message area beneath the headline (revised
 *             2026-11-07): three messages, one at a time, resolving on the
 *             value proposition, which stays. See HeroMessages below.
 *   ACTIONS   the primary to /contact and the quiet secondary to /learn-more
 *
 * COMPACT BY DESIGN (revised 2026-11-05 after review): the headline, the
 * supporting statements and the primary action are meant to share one
 * typical desktop viewport, so the spacing between them is deliberately
 * tight and the headline sits one step below the previous hero's scale.
 *
 * ONE MOTION ONLY. The message area is the hero's single animation (§46.4:
 * one focal element). The entrance animation and the hand-drawn underline of
 * the previous hero (HomeHero.tsx, kept in place and preserved at tag
 * `homepage-pre-messaging-simplification-2026-11-05`) do not carry over.
 *
 * THE BACKGROUND is the approved house render treatment (§48.8 bounded
 * exception) reproduced from HomeHero.tsx rather than extracted from it, so
 * the previous hero stays untouched. It is the resting state of that
 * treatment: the same opacity, mask, `lighten` merge, scrim, grain and bottom
 * hand-off, without the reveal.
 *
 * AMBER on this surface (§48.7): the eyebrow, the final message (the value
 * proposition), the primary action, and the lighting (the warm key and the
 * top hairline). The headline and the first two messages are ink, not amber.
 */

// Very light grain over the hero lighting, matching HomeHero.tsx.
const HERO_NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

/* ------------------------------------------------------------ messages */

/**
 * THE MESSAGE SEQUENCE (founder direction 2026-11-07). One fade per step,
 * then the value proposition stays. Times in ms on ONE clock (§46.3): every
 * message's opacity is a pure function of the elapsed time, with no
 * per-message timers.
 */
/**
 * THE SEQUENCES, as data. Each step fades in, holds, fades out, and the next
 * begins; the last step stays. Only the final message is amber.
 *
 *   THREE_MESSAGES   the approved sequence (Design System Section 20.1).
 *   FIVE_MESSAGES    EXPERIMENT (2026-11-07), not approved: the three
 *                    problems as separate beats, shorter fades.
 *
 * TO REVERT: set ACTIVE (below) to 'three'. Nothing else changes.
 */
type Step = { text: string; amber: boolean; holdMs: number };
type Sequence = { startDelayMs: number; fadeMs: number; steps: Step[] };

const FINAL: Omit<Step, 'holdMs'> = { text: 'JiTpro helps get the field what it needs, when it needs it.', amber: true };

const THREE_MESSAGES: Sequence = {
  startDelayMs: 1500,
  fadeMs: 500,
  steps: [
    { text: 'Late materials. Wrong products. Idle crews.', amber: false, holdMs: 2000 },
    { text: 'It doesn\u2019t have to be this way.', amber: false, holdMs: 2000 },
    { ...FINAL, holdMs: Infinity },
  ],
};

const FIVE_MESSAGES: Sequence = {
  startDelayMs: 1500,
  fadeMs: 400,
  steps: [
    { text: 'Late materials.', amber: false, holdMs: 1200 },
    { text: 'Wrong products.', amber: false, holdMs: 1200 },
    { text: 'Idle crews.', amber: false, holdMs: 1200 },
    { text: 'It doesn\u2019t have to be this way.', amber: false, holdMs: 2000 },
    { ...FINAL, holdMs: Infinity },
  ],
};

const SEQUENCES = { three: THREE_MESSAGES, five: FIVE_MESSAGES } as const;
type SequenceName = keyof typeof SEQUENCES;

/** The sequence the site shows. TO REVERT: 'three'. */
const ACTIVE: SequenceName = 'five';

/**
 * Local comparison only: in the dev server, `?hero=three` or `?hero=five`
 * overrides ACTIVE for that page load. Production builds ignore it.
 */
function chooseSequence(): Sequence {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const asked = new URLSearchParams(window.location.search).get('hero');
    if (asked && asked in SEQUENCES) return SEQUENCES[asked as SequenceName];
  }
  return SEQUENCES[ACTIVE];
}

const ACTIVE_SEQUENCE: Sequence = chooseSequence();

/** Each step's fade-in and fade-out start times, in ms on ONE clock (§46.3). */
function timeline({ startDelayMs, fadeMs, steps }: Sequence) {
  let at = startDelayMs;
  return steps.map((step) => {
    const inAt = at;
    const outAt = inAt + fadeMs + step.holdMs; // Infinity for the last step
    at = outAt + fadeMs;
    return { ...step, in: inAt, out: outAt };
  });
}

const FADE_MS = ACTIVE_SEQUENCE.fadeMs;
const MESSAGES = timeline(ACTIVE_SEQUENCE);
const SEQUENCE_END = MESSAGES[MESSAGES.length - 1].in + FADE_MS;

/** Once per page load: returning to the homepage in the same load shows the resolved state. */
let sequencePlayed = false;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function opacityAt(t: number, m: (typeof MESSAGES)[number]) {
  const fadeIn = Math.min(1, Math.max(0, (t - m.in) / FADE_MS));
  const fadeOut = Math.min(1, Math.max(0, (t - m.out) / FADE_MS));
  return fadeIn * (1 - fadeOut);
}

/**
 * One shared message area. Every message sits in the same grid cell, so
 * the area is always as tall as the tallest message at the current width and
 * the hero never moves. Opacity only: no slide, scale or colour change.
 * Plays once, never loops; reduced motion, or a second visit in the same
 * page load, shows the value proposition at once (§46.5). Every message stays
 * in the document, in order, for assistive technology.
 */
function HeroMessages() {
  const [t, setT] = useState(() => (sequencePlayed || prefersReducedMotion() ? SEQUENCE_END : 0));

  useEffect(() => {
    if (t >= SEQUENCE_END) return;
    sequencePlayed = true;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      setT(Math.min(SEQUENCE_END, elapsed));
      if (elapsed < SEQUENCE_END) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
    // Runs once on mount; `t` only seeds whether to play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto mt-5 grid max-w-[34ch] text-center sm:mt-6 sm:max-w-[40ch]">
      {MESSAGES.map((m) => (
        <p
          key={m.text}
          className={`[grid-area:1/1] self-center font-heading text-[1.25rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance sm:text-[1.5rem] lg:text-[1.625rem] ${
            m.amber ? 'text-jp-brand-amber' : 'text-jp-text-primary'
          }`}
          style={{ opacity: opacityAt(t, m) }}
        >
          {m.text}
        </p>
      ))}
    </div>
  );
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
          Your project. Your team. Our expertise.
        </p>

        {/* One h1, three lines, all in primary ink. One step smaller below
            `sm` so each question holds a single line on a narrow phone. */}
        <h1 className="mx-auto mt-4 text-center font-heading text-[2rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:mt-5 sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.75rem]">
          <span className="block">Broken schedules?</span>
          <span className="block">Broken promises?</span>
          <span className="block">Broken profits?</span>
        </h1>

        <HeroMessages />

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
