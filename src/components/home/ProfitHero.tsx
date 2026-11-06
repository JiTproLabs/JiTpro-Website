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
 *   TURN      "It doesn't have to be this way." in Brand Amber, directly
 *             beneath the headline: the move from familiar problems to the
 *             possibility of better outcomes
 *   COPY      three short statements in primary ink: the symptoms, the call
 *             to action, and JiTpro's value statement (the last in semibold)
 *   ACTIONS   the primary to /contact and the quiet secondary to /learn-more
 *
 * COMPACT BY DESIGN (revised 2026-11-05 after review): the headline, the
 * supporting statements and the primary action are meant to share one
 * typical desktop viewport, so the spacing between them is deliberately
 * tight and the headline sits one step below the previous hero's scale.
 *
 * STATIC BY DECISION. The entrance animation and the hand-drawn underline of
 * the previous hero (HomeHero.tsx, kept in place and preserved at tag
 * `homepage-pre-messaging-simplification-2026-11-05`) do not carry over.
 *
 * THE BACKGROUND is the approved house render treatment (§48.8 bounded
 * exception) reproduced from HomeHero.tsx rather than extracted from it, so
 * the previous hero stays untouched. It is the resting state of that
 * treatment: the same opacity, mask, `lighten` merge, scrim, grain and bottom
 * hand-off, without the reveal.
 *
 * AMBER on this surface (§48.7): the eyebrow, the turn line beneath the
 * headline, the primary action, and the lighting (the warm key and the top
 * hairline). The headline and the supporting statements are ink, not amber.
 */

// Very light grain over the hero lighting, matching HomeHero.tsx.
const HERO_NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

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

        {/* The turn: the hero's one amber statement, set in the heading face
            between the headline and the body register. */}
        <p className="mx-auto mt-4 text-center font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance text-jp-brand-amber sm:mt-5 sm:text-[1.875rem] lg:text-[2.125rem]">
          It doesn&apos;t have to be this way.
        </p>

        <div className="mx-auto mt-5 max-w-[52ch] text-center text-[1.0625rem] leading-[1.55] text-balance text-jp-text-primary sm:mt-6 sm:text-[1.125rem] lg:text-[1.1875rem]">
          <p>Late materials. Wrong products. Idle crews. No clear answers.</p>
          <p className="mt-1">Don&apos;t let these problems become part of your next project.</p>
          <p className="mt-4 font-semibold">JiTpro helps get the field what it needs, when it needs it.</p>
        </div>

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
