import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Section 1 — the hero, as a declarative belief (Decision Log 2026-08-27,
 * the refusal hero).
 *
 *   EYEBROW   whose refusal this is, in the data face — reinstated 2026-08-27,
 *             superseding the 2026-08-26 removal. The H1 below is first
 *             person, and an unattributed first person reads as brand voice.
 *   H1        the refusal itself, centered — the page's one display moment
 *   SWOOSH    the approved hand-drawn underline, geometry unchanged
 *   COPY      the growth condition as one declarative sub-headline (the
 *             upstream work gets harder to keep ahead of the field), then the
 *             on-ramp into the action: JiTpro puts you ahead.
 *             (Decision Log 2026-09-03, the copy replacement.)
 *   CTA       unchanged, closing on the composition's own centre axis
 *
 * THE HERO NO LONGER EXPLAINS THE MECHANISM. The paired §27.1 panels and the
 * three mechanism lines are gone, with the accountability H1 and the flanked
 * thesis (preserved verbatim: HomeHero.before-refusal-hero.tsx, and
 * src/archive/homepage/HeroAccountabilityComposition.md for the copy and the
 * reasoning). The Method section owns the mechanism; the hero owns the belief.
 * Nothing may be added back here that teaches how the work is done.
 *
 * VOICE (binding, §20.1 audience rule): the reader is a successful contractor
 * whose complexity has outgrown the systems that got them here — never a
 * victim of chaos, never disorganized. The claim is that the industry
 * TOLERATES a cost it need not, and that we refuse to. "We refuse" is the
 * brand's standing position, not a promise about the reader's project, and it
 * must never be rewritten into one. "Puts you ahead" (2026-09-04, superseding
 * "helps you stay ahead") is a statement of what the engagement is for, and it
 * is NOT a warranty: it says nothing about delivery, conformance, or a
 * schedule that holds, and it must never be extended into one. The §20.1
 * prohibitions are unchanged and still bind every other line on this surface.
 *
 * ALIGNMENT: eyebrow, H1, underline and CTA hold the centre axis (§48.6 hero
 * allowance). The supporting copy between them is centered in a 52ch column
 * under the §7.7 centered-supporting-copy allowance as extended to the hero
 * composition (Decision Log 2026-09-03). The column is the reading surface;
 * the axis is the composition.
 *
 * THE HOUSE RENDER (Decision Log 2026-09-03; §48.8 bounded exception) is
 * background atmosphere, not a return of the informational graphic the
 * 2026-08-26 no-hero-graphic decision removed: the brand's own amber night
 * render emerging slowly behind the message, arguing construction context
 * while the sentence keeps the argument. It lives in the aria-hidden lighting
 * stack, stays subordinate to the copy (restrained opacity, masked top edge,
 * the scrim under the copy column), and may never gain annotations, callouts,
 * or any informational role on this surface — the no-mechanism rule above is
 * untouched.
 */

// Per-page-load flag: the hero entrance plays on a fresh load, then stays
// static when the visitor navigates back to the homepage within the same session.
let heroIntroPlayed = false;

const HERO_STAGGER_MS = 70;

// The house begins emerging after the copy's last beat has landed (~700ms
// into the entrance the three groups start at 0/70/140ms) and takes ~2s to
// resolve — the message never waits for the motion (§46.2), and the reveal
// rides the same entrance timeline as the copy (§46.3).
const HERO_HOUSE_DELAY_MS = 400;

// Very light grain over the hero lighting — enough to keep the dark surface
// from reading as flat, not enough to notice on its own.
const HERO_NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

export default function HomeHero() {
  const [animateHero] = useState(() => !heroIntroPlayed);
  useEffect(() => {
    heroIntroPlayed = true;
  }, []);

  // Three groups on a 70ms stagger; the last settles at ~700ms, so everything
  // is readable inside the first second. Each group rises as one unit — the
  // belief, its explanation, and the action are three ideas, not a parade of
  // parts (§46.3). The eyebrow, H1 and underline share the first beat because
  // they are one statement.
  const rise = (step: number) =>
    animateHero
      ? {
          className: 'hero-rise',
          style: { '--hero-delay': `${step * HERO_STAGGER_MS}ms` } as CSSProperties,
        }
      : { className: '', style: undefined };

  return (
    <section className="relative isolate overflow-hidden bg-jp-background px-6 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-10 lg:pt-28 lg:pb-24">
      {/* Lighting, tonal depth and grain. The stack resolves to the page
          background at the bottom edge so the hand-off to the section below
          has no visible seam. The warm key at the top right keeps the dark
          field from reading as flat around the centered headline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* The house render (§48.8 bounded exception, Decision Log
            2026-09-03, as amended 2026-09-04). Bottom-anchored and centered.
            THE RENDER IS NEVER CROPPED: the layer is sized by the image's own
            aspect ratio (`w-full h-auto` on the intrinsic 1600×954), so the
            whole house is present at every width and the architecture reads
            as one composition rather than a slice of one. Below `lg` it runs
            full-bleed; from `lg` up its width is capped, so on wide and
            ultrawide monitors the house stops growing and --jp-background
            simply extends past its left and right edges (Decision Log
            2026-09-04). It is never stretched — the intrinsic ratio is the
            only ratio it is ever drawn at.

            `lighten` — contained by the section's isolate — melts the
            render's night sky and dark foreground into --jp-background, so
            only the lit architecture lifts out of the page's own dark and the
            capped layer has no visible edge against the field. The short
            top-edge alpha mask softens the roofline into that field without
            eating the upper storey. Resting opacity is the restrained ceiling
            that keeps the copy in charge (§48.7); the reveal releases to it
            (only a `from` frame), so reduced motion shows this exact state,
            static. */}
        <div
          className={`absolute inset-x-0 bottom-0 mx-auto w-full opacity-55 mix-blend-lighten lg:max-w-[1120px] ${animateHero ? 'hero-house-reveal' : ''}`}
          style={
            {
              maskImage: 'linear-gradient(180deg, transparent 0%, black 18%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 18%)',
              '--hero-delay': `${HERO_HOUSE_DELAY_MS}ms`,
            } as CSSProperties
          }
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
        {/* The scrim that keeps the centered copy column and the CTA on a
            dark ground over the house. NARROWED 2026-09-04: the render is now
            drawn whole rather than cropped, so the scrim is pulled in
            horizontally and lengthened vertically — it tracks the copy column
            it exists for instead of washing across the house's wings, and
            gains density at the centre to hold contrast behind the text now
            that the render's lit core sits directly under it. */}
        <div className="absolute inset-0 bg-[radial-gradient(44%_60%_at_50%_44%,color-mix(in_oklab,var(--jp-background)_80%,transparent),transparent_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `url("${HERO_NOISE}")` }}
        />
        {/* The hand-off to the section below. HELD LOWER 2026-09-04: it still
            resolves fully to --jp-background at the section's last pixel, so
            the seam stays invisible, but it now does that work inside the
            final quarter instead of climbing halfway up the surface — at
            narrow widths the whole house sits in the lower band, and the old
            ramp erased it. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_62%,color-mix(in_oklab,var(--jp-background)_58%,transparent)_86%,var(--jp-background)_100%)]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--jp-brand-amber)_32%,transparent)_26%,color-mix(in_oklab,var(--jp-brand-amber)_50%,transparent)_52%,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* THE BELIEF — eyebrow, refusal, underline. One statement, one beat.

            The eyebrow is authored in sentence case and uppercased in CSS so
            assistive technology receives normally-cased text (§7.7), set in
            the data face at small size with increased tracking (§7.3). It is
            the surface's third and last amber element, after the underline and
            the CTA (§48.7) — the panels that used to carry a fourth and fifth
            are gone.

            The 30ch cap is what makes the centered wraps read as set lines
            rather than accidents. */}
        <div className={rise(0).className} style={rise(0).style}>
          <p className="text-center font-mono text-sm font-bold uppercase tracking-[0.2em] text-jp-brand-amber">
            Built by contractors
          </p>

          <h1 className="mx-auto mt-6 max-w-[30ch] text-center font-heading text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance text-jp-text-primary sm:mt-7 sm:text-[3rem] lg:text-[3.5rem] lg:leading-[1.04] xl:text-[4rem] xl:tracking-[-0.03em]">
            We refuse to accept that chaos is just part of construction.
          </h1>

          {/* The approved hand-drawn underline (Decision Log 2026-08-27, as
              refined twice the same day): one calligraphic stroke, drawn as a
              FILLED silhouette rather than a stroked path so the body itself
              tapers — fine point at the left, most weight through the center
              (~3 rendered px), released to a fine point at the right.

              THE BODY IS LEVEL AND ONLY THE ENDS MOVE. Between roughly 35%
              and 85% of the length the midline runs flat (~6.2 in a 14-unit
              box, varying by less than half a unit) — that flat body is what
              makes it read as a pen laid down and drawn straight. The turns
              live in the outer ~14% at each end: the left tip curls DOWN below
              the body, the right tip flicks UP above it. Tilting the body to
              connect the two tips is the failure mode — it reads as a diagonal
              line, not a stroke.

              The two turns are unequal by design (the left curl travels
              further than the right flick), and the taper is nib behaviour:
              full width along the level body, thinning as the direction
              rotates away from it into each turn. Evening the ends up, or
              raising the middle, turns it into a smile.

              Token amber via currentColor. Static by design. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 420 14"
            preserveAspectRatio="none"
            className="mx-auto mt-6 block h-3 w-56 max-w-full text-jp-brand-amber sm:mt-7 sm:w-[19rem] lg:mt-8 lg:w-[23rem] xl:w-[26rem]"
          >
            <path
              d="M6 10.2 C 30 9.2, 80 4.9, 150 4.6 C 200 4.5, 250 4.5, 300 4.55 C 340 4.7, 385 4.2, 414 2.9 C 394 4.8, 350 7.2, 300 7.9 C 255 8, 200 8.1, 150 8.1 C 100 8, 40 8.7, 6 10.2 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* THE SUB-HEADLINE, then the on-ramp. Centered supporting copy in a
            52ch column, held on the hero's own axis (§7.7 centered supporting
            copy, extended to the hero composition — Decision Log 2026-09-03):
            the growth condition as one declarative sentence, then the on-ramp
            into the action.

            The on-ramp holds body size in semibold primary ink — the same
            emphasis idiom this column has always used — so it bridges into
            the CTA while staying subordinate to the H1 by size and position
            (Decision Log 2026-09-03, the copy replacement). Its emphasis is
            ink, not amber: the surface's amber count stays at three (§48.7).
            The mechanism belongs to the Method section. */}
        <div
          className={`mx-auto mt-12 max-w-[52ch] space-y-6 text-center text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:mt-14 sm:text-[1.125rem] lg:text-[1.1875rem] ${rise(1).className}`}
          style={rise(1).style}
        >
          <p>
            As construction companies grow, keeping every decision, approval, product, material, and service ahead of the field gets harder.
          </p>
          <p className="font-semibold text-jp-text-primary">
            JiTpro puts you ahead.
          </p>
        </div>

        {/* The action closes on the axis the composition opened on. Button
            treatment, destination and label are unchanged.

            The primary action and its quiet alternative are ONE beat, not two
            (§46.3): they stack on the same centre axis and rise together, so
            the reader reads a single decision with two doors rather than two
            competing arrivals. */}
        <div
          className={`mt-10 flex flex-col items-center sm:mt-12 ${rise(2).className}`}
          style={rise(2).style}
        >
          <Link
            to="/contact"
            className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.875rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-6 sm:text-[0.9375rem]"
          >
            <span className="[text-wrap:balance]">Start with one project</span>
            <ArrowRight size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
          </Link>

          {/* The secondary action, quiet by §48.1: type and a small indicator,
              no fill, no border, and no amber at rest — the primary keeps the
              surface's amber. The underline is what marks it clickable; the
              single hover gesture is the colour change to
              --jp-brand-amber-active (§8.1.1, §48.1).

              DESTINATION WIRED 2026-09-03: /learn-more, the long-form
              explainer page (Design System §50). It was a handler-less
              type="button" until that page existed. The label is fixed —
              the page it opens is written as the continuation of this hero,
              and the two were approved together. */}
          <Link
            to="/learn-more"
            className="mt-5 inline-flex items-center gap-2 rounded px-3 py-3 text-[0.9375rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:mt-6"
          >
            <ChevronRight size={15} aria-hidden="true" className="shrink-0" />
            <span className="underline decoration-1 underline-offset-4">
              Or click here to learn more.
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
