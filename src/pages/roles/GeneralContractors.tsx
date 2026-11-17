import { AlertTriangle, ArrowRight, BarChart3, CalendarDays, CheckCircle2, Handshake, ScanSearch, Target, Users } from 'lucide-react';
import { useEffect, useId } from 'react';
import { Link } from 'react-router-dom';

/**
 * /roles/general-contractors: the Break the Cycle campaign page (issue #82,
 * founder-approved copy, 2026-11-16). A contractor-facing marketing page for
 * GC owners and executives, not a product page.
 *
 *   ACT ONE, the cycle and the pressure, on --jp-background
 *     1  Hero               the cinematic hero (§55, 2026-11-16)
 *     1a A better way       the turn, and the first primary action
 *     2  Why now            the economic pressure, on the --jp-surface band
 *
 *   ACT TWO, the possibility and the method, on --jp-surface-light
 *     3  The possibility    what if you could see the problems coming?
 *     4  How JiTpro works   four numbered steps, under a container hairline
 *
 *   ACT THREE, the invitation, on --jp-background
 *     5  Start with one project, and the closing primary action
 *
 * PATTERNS REUSED, none invented (§49.1): the 2fr / 3fr editorial columns and
 * the vertical sequence line of the homepage procurement section; the
 * hairline with a Brand Amber start segment and the numbered editorial list
 * of Fewer surprises; the --jp-surface band of the core belief; the light act
 * and container hairline of Throughout the project; the centered final-CTA
 * composition (§7.7, §48.6, centered from `sm`, left-aligned below it); and
 * the homepage's primary action, verbatim.
 *
 * TYPE (§7.7): headings and buttons are sentence case, except the hero's
 * headline and action, which are title case by the scoped exception of §55.2.
 * The sections below the hero await their own redesign (issue #82).
 *
 * AMBER (§48.7), per surface: the hero's, per §55.2; the turn's rule
 * segment and its action; Why now's conclusion; the close's statement and
 * its action. Nothing on the light act (§8.8). No motion, no icons beyond the
 * actions' arrows, no cards; the hero's photograph is the page's one image.
 *
 * The previous page is preserved, unchanged and unrouted, at
 * GeneralContractors.before-break-the-cycle.tsx.
 */

const TITLE = "It's time to break the cycle | JiTpro for general contractors";
const DESCRIPTION =
  "You've worked too hard to win the job to watch your profits disappear. JiTpro starts with a Project Readiness Engagement on one project.";

/** The hero narrative, one line per beat group as in the approved reference (§55.1). */
const NARRATIVE = [
  'Win the job. Fight the same fires. Watch the schedule slip.',
  'Spend whatever it takes to make up for lost time.',
  'Then do it all over again.',
];

const CONSEQUENCES = [
  'The lost profits.',
  'The exhausted teams.',
  'The frustrated clients.',
  'The damaged relationships.',
  'The constant chaos.',
];

const PROTECT = ['Protect your schedule.', 'Protect your profits.', 'Protect your people.', 'Deliver on your promises.'];

const IMAGINE = [
  'Imagine knowing months in advance which decisions, approvals, products, and commitments could threaten your construction schedule.',
  'Imagine your owner knowing exactly when selections are required and why. Your architect knowing which information must be released. Your trade partners knowing what is expected and when.',
  'Imagine your project managers spending less time chasing answers and your superintendents spending more time building.',
];

const STEPS = [
  {
    title: 'We uncover the hidden risks.',
    body: 'We examine project scope, products, materials, services, and the information required to procure them. We identify gaps and unresolved conditions before they become field problems.',
  },
  {
    title: 'We establish clear commitments.',
    body: 'We determine what must happen, who is responsible, and when each decision, approval, and procurement activity must be completed.',
  },
  {
    title: 'We bring order to the priorities.',
    body: 'We develop a procurement schedule that identifies what needs attention now to protect work planned for weeks or months ahead.',
  },
  {
    title: 'We help your team stay ahead.',
    body: 'We make emerging risks visible so your team can act while options remain, rather than paying to recover after disruptions occur.',
  },
];

const GUTTERS = 'px-6 sm:px-8 lg:px-10';

/** The homepage primary action (NextProblemCTA), verbatim. */
function PrimaryAction({ children }: { children: string }) {
  return (
    <Link
      to="/contact"
      className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-7 sm:text-base"
    >
      <span className="[text-wrap:balance]">{children}</span>
      <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
    </Link>
  );
}

/** Per-page title and description; the SPA serves one index.html (FieldGuide pattern). */
function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = existing?.content ?? null;
    const meta = existing ?? document.createElement('meta');
    if (!existing) {
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = previousTitle;
      if (previousDescription === null) meta.remove();
      else meta.content = previousDescription;
    };
  }, [title, description]);
}

/* ------------------------------------------------------------ 1 hero */

/*
 * The cinematic hero (Design System §55, Decision Log 2026-11-16), from the
 * founder-approved reference in docs/design/assets/contractor-break-cycle.
 *
 *   LEFT   amber eyebrow with its rule, the title-case h1 with "Cycle." in
 *          amber, the supporting statement, the narrative, the action
 *   RIGHT  the consequences, each after an amber slash mark; a hairline;
 *          "Enough!" over a brush-stroke underline
 *
 * ONE IMAGE ELEMENT, TWO FRAMES. Below `lg` the image fills a full-bleed
 * band after the copy (object-cover, framed on the dark wall). From `lg` it
 * is a box at the photograph's own aspect ratio, anchored right and centred
 * vertically in the section, then lifted up to 100 px but never above the
 * section's foot (founder review 2026-11-17), at least 1100 px wide (so the wall can hold the
 * consequences, while the building stays right of the copy at 1024 px) and at most 2000 px. One download at every width.
 *
 * THE GROUP IN IMAGE COORDINATES (founder review 2026-11-16). From `lg` the
 * consequences and "Enough!" are positioned inside that box, in percentages
 * of the photograph, and sized in container units of it: they sit on the
 * dark concrete wall right of the illuminated column (about 72% to 96%
 * across, 30% to 80% down; 71% to 98% below `xl`, as in the approved reference) at every desktop
 * width, rather than following the content container across the building.
 *
 * SCRIMS, localized (founder review 2026-11-16: the photograph's warmth and
 * brightness are kept). From `lg`: a short fade from the navigation at the
 * top, a fade to --jp-background at the foot, a soft scrim under the
 * narrative only (the one line of copy over the sunset glow), and, on
 * screens wider than the box, a fade at its left edge; its top and bottom edges are masked, so a
 * section taller than the box hands off softly. No broad darkening.
 * Below `lg` the band fades in from the copy above and darkens toward the
 * text at its foot. All derive from --jp-background (§55.2).
 */

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/roles/contractor-break-cycle-architecture`;

/** --jp-background at a given strength over the photograph. */
const scrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;

/** From `lg`: the edges only, top (the navigation seam) and foot. */
const EDGE_FADES = {
  backgroundImage: `linear-gradient(180deg, ${scrim(45)} 0%, transparent 10%, transparent 84%, var(--jp-background) 100%)`,
};

/** From `lg`: a soft pool under the narrative, where the sunset is brightest. */
const NARRATIVE_SCRIM = {
  backgroundImage: `radial-gradient(closest-side, ${scrim(72)} 0%, ${scrim(52)} 55%, transparent 100%)`,
};

/** From 2000 px, where the box no longer reaches the section's left edge. */
const BOX_LEFT_FADE = {
  backgroundImage: 'linear-gradient(90deg, var(--jp-background) 0%, transparent 100%)',
};

const BAND_SCRIM = {
  backgroundImage: `linear-gradient(180deg, var(--jp-background) 0%, transparent 24%, transparent 32%, ${scrim(62)} 52%, ${scrim(86)} 100%)`,
};

/** The amber slash before each consequence (§55.2). */
function SlashMark({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 20" className={`shrink-0 fill-jp-brand-amber ${className}`}>
      <polygon points="7.5,0 12,0 4.5,20 0,20" />
    </svg>
  );
}

/** The brush-stroke underline beneath "Enough!" (§55.2): heavy at the start, tapering out. */
function BrushUnderline({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 26" preserveAspectRatio="none" className={`block fill-jp-brand-amber ${className}`}>
      <path d="M3 17.5C40 12.5 96 9 160 7.4 206 6.3 252 6.6 297 8.2 251 9.8 205 11.6 158 14.1 104 17 56 20.4 12 24.2 5.6 24.7 1 21.2 3 17.5Z" />
    </svg>
  );
}

/**
 * The consequences and "Enough!", one group (§55.3). `band` is the in-flow
 * presentation below `lg`; `wall` is the desktop presentation, placed and
 * sized in the photograph's coordinates (container units of the image box).
 * Exactly one is displayed at any width, so assistive technology meets the
 * group once.
 */
function ConsequenceGroup({ variant }: { variant: 'band' | 'wall' }) {
  const wall = variant === 'wall';
  return (
    <div className={wall ? 'absolute top-[30.5%] left-[71%] hidden w-[27%] lg:block xl:left-[72%] xl:w-[24%]' : 'w-full sm:w-[22rem] lg:hidden'}>
      <ul className={wall ? 'space-y-[1.55cqw]' : 'space-y-4 sm:space-y-5'}>
        {CONSEQUENCES.map((line) => (
          <li key={line} className={`flex items-center ${wall ? 'gap-[max(0.75rem,1cqw)]' : 'gap-4'}`}>
            <SlashMark className={wall ? 'h-[max(1.125rem,1.3cqw)] w-auto' : 'h-[1.125rem] w-[0.6875rem] sm:h-5 sm:w-3'} />
            <span
              className={`font-heading font-semibold tracking-[-0.01em] text-jp-text-primary ${
                wall ? 'text-[max(1.1875rem,1.44cqw)] leading-[1.3]' : 'text-[1.25rem] leading-snug sm:text-[1.375rem]'
              }`}
            >
              {line}
            </span>
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className={`relative h-px bg-jp-border/35 ${wall ? 'mt-[2.6cqw]' : 'mt-9 sm:mt-10'}`}>
        <span className={`absolute inset-y-0 left-0 bg-jp-text-primary/80 ${wall ? 'w-[18%]' : 'w-16'}`} />
      </div>

      <p
        className={`font-heading font-extrabold leading-none tracking-[-0.04em] text-jp-text-primary ${
          wall ? 'mt-[2cqw] text-[max(3.75rem,5.6cqw)]' : 'mt-8 text-[3.5rem] sm:mt-9 sm:text-[4.25rem]'
        }`}
      >
        Enough!
      </p>
      <BrushUnderline
        className={wall ? 'mt-[0.3cqw] ml-[2%] h-[max(0.875rem,1.05cqw)] w-[82%]' : 'mt-1 ml-[3%] h-[0.875rem] w-[82%] max-w-[19rem] sm:h-4'}
      />
    </div>
  );
}

function Hero() {
  return (
    <section aria-labelledby="gc-hero" className="relative isolate overflow-hidden bg-jp-background px-6 sm:px-8 lg:px-10">
      {/* From `lg`: the edge fades over the image box. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" style={EDGE_FADES} />

      <div className="mx-auto max-w-7xl lg:flex lg:min-h-[min(48rem,calc(100svh-5rem))] lg:items-center">
        {/* The copy column. From `lg` it holds the left of the photograph's
            dark sky, clear of the building. */}
        <div className="pt-14 pb-14 sm:pt-16 sm:pb-16 lg:max-w-[25rem] lg:py-20 xl:max-w-[44rem] xl:py-24">
          {/* Authored in sentence case, uppercased in CSS (§7.7). */}
          <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
            <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16" />
            Protecting your profits.
          </p>

          {/* Title case, as approved (§55.2). Three set lines; below `sm`
              scaled with the viewport so "It's Time to" holds one line down
              to 320 px. */}
          <h1
            id="gc-hero"
            className="mt-6 font-heading text-[min(3.25rem,12.5vw)] font-extrabold leading-[0.98] tracking-[-0.035em] text-jp-text-primary sm:mt-7 sm:text-[4.5rem] lg:text-[4rem] xl:text-[5.75rem]"
          >
            <span className="block">It&apos;s Time to</span>
            <span className="block">Break the</span>
            <span className="block text-jp-brand-amber">Cycle.</span>
          </h1>

          <p className="mt-7 max-w-[31ch] font-heading text-[1.375rem] font-bold leading-[1.25] tracking-[-0.015em] text-jp-text-primary sm:mt-8 sm:text-[1.625rem] lg:text-[1.375rem] xl:text-[1.875rem]">
            You&apos;ve worked too hard to win the job to watch your profits disappear.
          </p>

          <div className="relative mt-6">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 hidden lg:block" style={NARRATIVE_SCRIM} />
            <p className="max-w-[56ch] text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-primary sm:text-[1.1875rem] xl:text-[1.25rem]">
              {NARRATIVE.map((line, i) => (
                <span key={line} className="xl:block">
                  {line}
                  {i < NARRATIVE.length - 1 ? ' ' : null}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-9 sm:mt-10">
            <PrimaryAction>Let&apos;s Break the Cycle</PrimaryAction>
          </div>
        </div>

        {/* Below `lg`, the band: positioned, so the image box fills it. From
            `lg` the wrapper is static, so the image box is placed against
            the section. */}
        <div className="relative -mx-6 sm:-mx-8 lg:static lg:mx-0">
          {/* From `lg`, the box is placed by its foot (§55.3, founder review
              2026-11-17): centred, then lifted up to 6.25rem, clamped so the
              foot never rises above the section's. --hero-box-h restates the
              box's own height (its width at the photograph's aspect). */}
          <div className="@container absolute inset-0 -z-20 lg:inset-auto lg:right-0 lg:bottom-[max(calc(50%_-_var(--hero-box-h)/2),min(0px,calc(50%_-_var(--hero-box-h)/2_+_6.25rem)))] lg:aspect-[1672/941] lg:w-[max(100%,1100px)] lg:max-w-[2000px] lg:[--hero-box-h:calc(min(max(100vw,1100px),2000px)*941/1672)] lg:[mask-image:linear-gradient(180deg,transparent_0%,black_9%,black_90%,transparent_100%)]">
            <img
              src={`${HERO_IMAGE}-1672.webp`}
              srcSet={`${HERO_IMAGE}-960.webp 960w, ${HERO_IMAGE}-1672.webp 1672w`}
              sizes="(min-width: 1024px) max(100vw, 1100px), 100vw"
              width={1672}
              height={941}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="block h-full w-full object-cover object-[92%_center] sm:object-[84%_center] lg:object-center"
            />
            {/* Wider than the box (from 2000 px): its left edge hands off to --jp-background. */}
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[14%] min-[2000px]:block" style={BOX_LEFT_FADE} />
            <ConsequenceGroup variant="wall" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden" style={BAND_SCRIM} />

          <div className="flex min-h-[34rem] flex-col justify-end px-6 pt-56 pb-14 sm:min-h-[36rem] sm:items-end sm:px-8 sm:pb-16 lg:hidden">
            <ConsequenceGroup variant="band" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ 1a the turn */

/*
 * Section 2 (Design System §56, Decision Log 2026-11-16), from the
 * founder-approved reference in docs/design/assets/contractor-break-cycle.
 *
 *   LEFT    amber rule and eyebrow; the h2 at a display register, "build."
 *           in amber
 *   DIVIDER a 1px vertical hairline from `lg`; a short horizontal hairline
 *           below it
 *   RIGHT   paragraph; "We bring clarity to complexity."; paragraph; a
 *           hairline; the four closing statements after amber slash marks,
 *           the last in amber
 *
 * GROUND (§56.2): --jp-background deepening to a navy between it and
 * --jp-surface, with quiet diagonal planes in --jp-border at low opacity,
 * echoing the hero's concrete. CSS only, no photograph, aria-hidden. No
 * action: the reference has none.
 */

/** A navy between --jp-background and --jp-surface: the reference's ground. */
const NAVY = 'color-mix(in oklab, var(--jp-surface) 55%, var(--jp-background))';
/** --jp-border at a given strength. */
const plane = (percent: number) => `color-mix(in oklab, var(--jp-border) ${percent}%, transparent)`;

const BETTER_WAY_GROUND = {
  backgroundImage: `linear-gradient(180deg, var(--jp-background) 0%, ${NAVY} 22%, ${NAVY} 100%)`,
};

/** The planes, as clip-path polygons over the ground (lower left, upper right). */
const PLANES = [
  {
    clipPath: 'polygon(0 62%, 40% 100%, 21% 100%, 0 80%)',
    backgroundImage: `linear-gradient(150deg, ${plane(16)} 0%, ${plane(7)} 60%, ${plane(3)} 100%)`,
  },
  {
    clipPath: 'polygon(0 80%, 21% 100%, 0 100%)',
    backgroundImage: `linear-gradient(150deg, ${plane(4)} 0%, transparent 100%)`,
  },
  {
    clipPath: 'polygon(84% 0, 100% 0, 100% 18%)',
    backgroundImage: `linear-gradient(200deg, ${plane(7)} 0%, ${plane(2)} 100%)`,
  },
];

function BetterWay() {
  return (
    <section aria-labelledby="gc-better-way" className={`relative isolate overflow-hidden py-20 sm:py-24 lg:py-32 xl:py-36 ${GUTTERS}`} style={BETTER_WAY_GROUND}>
      {PLANES.map((style) => (
        <div key={style.clipPath} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={style} />
      ))}

      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,2fr)_1px_minmax(0,3fr)] lg:gap-x-12 xl:gap-x-16">
        {/* Left: eyebrow and headline. */}
        <div>
          {/* Authored in sentence case, uppercased in CSS (§7.7). */}
          <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:gap-5 sm:text-sm sm:tracking-[0.18em]">
            <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16 xl:w-24" />
            The new way forward
          </p>
          <h2
            id="gc-better-way"
            className="mt-6 max-w-[11ch] font-heading text-[min(3.25rem,13vw)] font-extrabold leading-[0.98] tracking-[-0.035em] text-jp-text-primary sm:mt-8 sm:text-[4.5rem] lg:text-[4rem] xl:text-[5.25rem] 2xl:text-[5.75rem]"
          >
            There&apos;s a better way to <span className="text-jp-brand-amber">build.</span>
          </h2>
        </div>

        {/* The divider: vertical from `lg`, a short horizontal rule below it. */}
        <div aria-hidden="true" className="mt-12 h-px w-24 bg-jp-border/25 sm:mt-14 lg:mt-0 lg:h-auto lg:w-px" />

        {/* Right: the argument and the four closing statements. */}
        <div className="mt-10 sm:mt-12 lg:mt-1">
          <p className="max-w-[56ch] text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:text-[1.1875rem] xl:text-[1.25rem]">
            At JiTpro, we go deeper into the details of your project to uncover problems that traditional management practices often miss, long before they disrupt your schedule, exhaust your people, and consume your profits.
          </p>

          <p className="mt-10 font-heading text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance text-jp-text-primary sm:mt-12 sm:text-[2.25rem] xl:text-[2.75rem] 2xl:text-[3.125rem]">
            We bring clarity to complexity.
          </p>

          <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:mt-6 sm:text-[1.1875rem] xl:text-[1.25rem]">
            We identify what&apos;s needed, who&apos;s responsible, and when it needs to happen, so your team can prevent problems instead of constantly recovering from them.
          </p>

          <div aria-hidden="true" className="mt-10 h-px bg-jp-border/35 sm:mt-12" />

          <ul className="mt-9 font-heading text-[1.75rem] font-extrabold leading-[1.22] tracking-[-0.03em] sm:mt-11 sm:text-[2.5rem] lg:text-[2.25rem] xl:text-[3.125rem] 2xl:text-[3.5rem]">
            {PROTECT.map((line, i) => (
              <li
                key={line}
                className={`flex items-baseline gap-[0.45em] ${i === PROTECT.length - 1 ? 'text-jp-brand-amber' : 'text-jp-text-primary'}`}
              >
                <SlashMark className="h-[0.6em] w-auto translate-y-[0.06em]" />
                <span className="min-w-0">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- 2 why now */

/*
 * Why Now (Design System §57, Decision Log 2026-11-16), from the
 * founder-approved references in docs/design/assets/contractor-break-cycle.
 * Three stages, and a colour progression that carries the argument: white
 * recognises, red exposes, amber decides.
 *
 *   THE WARNING  first (moved to the top, 2026-11-16): a construction-site
 *                WARNING sign (revised 2026-11-16): an
 *                amber frame and header with black hazard stripes, a warning
 *                triangle and "Warning"; an off-white, lightly weathered body
 *                carrying the statement at an oversized italic register,
 *                "same preventable losses." in --jp-warning-red
 *   RECOGNITION  the h2 left, two paragraphs right, a vertical hairline
 *                between them
 *   THE DECISION two statements in balanced columns with a hairline between;
 *                then the amber declaration, led by a short amber rule, the
 *                brush-stroke underline beneath "now."
 *
 * The sign, --jp-warning-red and the italic face are approved for this
 * section only (§57.2); the sign is not a reusable warning component. The
 * angular planes are CSS from --jp-border, aria-hidden. No action or motion.
 */

/** The sign body: --jp-surface-light warmed with a trace of amber (§57.2). */
const SIGN_BODY = 'color-mix(in oklab, var(--jp-surface-light) 93%, var(--jp-brand-amber))';

/** Light weathering: monochrome fractal noise (as the homepage hero's grain). */
const SIGN_GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E";

/** Soft darkening toward the body's edges, from --jp-background. */
const SIGN_WEAR = {
  backgroundImage: `radial-gradient(120% 140% at 50% 45%, transparent 50%, color-mix(in oklab, var(--jp-background) 22%, transparent) 100%)`,
};

/** Black hazard stripes leaning like "////", in --jp-background ink. */
const HAZARD_STRIPES = {
  backgroundImage: 'repeating-linear-gradient(120deg, transparent 0 0.42em, var(--jp-background) 0.42em 0.84em)',
  clipPath: 'polygon(0.35em 0, 100% 0, calc(100% - 0.35em) 100%, 0 100%)',
};

/** Why Now's planes: a long shaft at the lower left, a streak at the upper right. */
const WHY_NOW_PLANES = [
  {
    clipPath: 'polygon(0 66%, 34% 100%, 22% 100%, 0 80%)',
    backgroundImage: `linear-gradient(150deg, ${plane(14)} 0%, ${plane(5)} 70%, ${plane(2)} 100%)`,
  },
  {
    clipPath: 'polygon(91% 0, 100% 0, 100% 30%)',
    backgroundImage: `linear-gradient(210deg, ${plane(9)} 0%, ${plane(2)} 100%)`,
  },
];

const WHY_NOW_COPY = {
  opening: [
    "You've experienced these problems across multiple projects. You've watched anticipated profits disappear into delays, inefficiencies, and expensive recovery efforts.",
    "And now, as competition intensifies, you're being asked to sharpen your pencil even further just to win the next job.",
  ],
  statements: [
    "Winning more work isn't the answer if you're not retaining the profits from the work you've already won.",
    'The opportunity to protect those profits begins long before the field experiences the consequences.',
  ],
};

/**
 * The WARNING sign (§57.2, §57.3). Live text throughout: assistive technology
 * reads "Warning" and then the statement; the stripes, triangle and texture
 * are aria-hidden. Every size inside the header derives from its font size,
 * so the stripes stay in proportion at every width.
 */
function WarningSign() {
  return (
    <div className="rounded-[1.25rem] bg-jp-brand-amber p-[7px] sm:rounded-[1.75rem] sm:p-[10px] lg:p-3">
      <div className="overflow-hidden rounded-[0.875rem] border-[3px] border-jp-background sm:rounded-[1.25rem]">
        {/* Header */}
        <div className="flex items-center justify-center gap-[0.3em] bg-jp-brand-amber px-[0.45em] py-[0.16em] font-heading text-[min(1.875rem,8.2vw)] font-extrabold leading-none text-jp-background sm:gap-[0.4em] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.25rem] 2xl:text-[6rem]">
          <span aria-hidden="true" className="h-[0.62em] min-w-[1.3em] flex-1 sm:max-w-[3.6em]" style={HAZARD_STRIPES} />
          <span className="flex shrink-0 items-center gap-[0.18em]">
            <AlertTriangle aria-hidden="true" strokeWidth={2.4} className="h-[0.86em] w-[0.86em] shrink-0" />
            {/* Authored in sentence case, uppercased in CSS (§7.7, §57.2). */}
            <span className="uppercase tracking-[0.01em]">Warning</span>
          </span>
          <span aria-hidden="true" className="h-[0.62em] min-w-[1.3em] flex-1 sm:max-w-[3.6em]" style={HAZARD_STRIPES} />
        </div>

        {/* Body */}
        <div className="relative isolate border-t-[3px] border-jp-background px-5 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-7" style={{ backgroundColor: SIGN_BODY }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13] mix-blend-multiply" style={{ backgroundImage: `url("${SIGN_GRAIN}")` }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={SIGN_WEAR} />
          <p className="text-center font-heading text-[min(1.75rem,7.6vw)] font-extrabold italic leading-[1.1] tracking-[-0.01em] text-balance text-jp-background sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.75rem] 2xl:text-[4.125rem]">
            <span className="xl:block">You can&apos;t keep cutting your prices while </span>
            <span className="xl:block">continuing to absorb the </span>
            <span className="text-jp-warning-red sm:block">same preventable losses.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function WhyNow() {
  return (
    <section
      aria-labelledby="gc-why-now"
      className="relative isolate overflow-hidden border-t border-jp-border/12 py-16 sm:py-20 lg:py-20 xl:py-24"
      style={{ backgroundColor: NAVY }}
    >
      {WHY_NOW_PLANES.map((style) => (
        <div key={style.clipPath} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={style} />
      ))}

      {/* THE WARNING, first: the sign, wider than the content container (2026-11-16: moved to the top). */}
      <div className={GUTTERS}>
        <div className="mx-auto max-w-[94rem]">
          <WarningSign />
        </div>
      </div>

      {/* Below the sign, the content shares the sign's width (inset to its
          frame) and one pair of equal columns, so both rows' dividers align
          (founder refinement 2026-11-16). */}

      {/* RECOGNITION */}
      <div className={`mt-14 sm:mt-16 lg:mt-20 xl:mt-24 ${GUTTERS}`}>
        <div className="mx-auto max-w-[94rem] lg:px-6 2xl:px-14 lg:grid lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20">
          <h2
            id="gc-why-now"
            className="max-w-[20ch] font-heading text-[min(2.5rem,10.5vw)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-jp-text-primary sm:text-[3.25rem] lg:text-[3.25rem] xl:text-[4rem] 2xl:text-[4.5rem]"
          >
            You can&apos;t afford to keep doing business the old way.
          </h2>
          <div aria-hidden="true" className="mt-10 h-px w-24 bg-jp-border/30 lg:mt-0 lg:h-auto lg:w-px" />
          <div className="mt-8 space-y-6 lg:mt-0 lg:pt-1.5">
            {WHY_NOW_COPY.opening.map((paragraph) => (
              <p key={paragraph} className="max-w-[58ch] text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:text-[1.1875rem] lg:text-[1.25rem] xl:text-[1.375rem] 2xl:text-[1.5rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* THE DECISION */}
      <div className={`mt-14 sm:mt-16 lg:mt-20 xl:mt-24 ${GUTTERS}`}>
        <div className="mx-auto max-w-[94rem] lg:px-6 2xl:px-14">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20">
            <p className="max-w-[44ch] text-[1.125rem] leading-[1.5] text-pretty text-jp-text-primary sm:text-[1.25rem] lg:text-[1.375rem] xl:text-[1.5rem] 2xl:text-[1.625rem]">
              {WHY_NOW_COPY.statements[0]}
            </p>
            <div aria-hidden="true" className="my-7 h-px w-24 bg-jp-border/30 lg:my-0 lg:h-auto lg:w-px" />
            <p className="max-w-[44ch] text-[1.125rem] leading-[1.5] text-pretty text-jp-text-primary sm:text-[1.25rem] lg:text-[1.375rem] xl:text-[1.5rem] 2xl:text-[1.625rem]">
              {WHY_NOW_COPY.statements[1]}
            </p>
          </div>

          {/* The declaration: the section's conclusion and its amber. */}
          <div className="mt-16 flex flex-col gap-5 font-heading text-[min(2.5rem,10.5vw)] font-extrabold leading-[1.05] tracking-[-0.03em] text-jp-brand-amber sm:mt-16 sm:flex-row sm:items-start sm:gap-[0.55em] sm:text-[3.25rem] lg:mt-20 lg:text-[3rem] xl:mt-24 xl:text-[4.5rem]">
            <span aria-hidden="true" className="block h-[3px] w-16 shrink-0 bg-jp-brand-amber sm:mt-[0.55em] sm:w-[1.9em]" />
            <p className="leading-[1.05]">
              <span className="lg:block">The time to change how you </span>
              <span className="lg:block">
                manage your projects is{' '}
                <span className="relative inline-block">
                  now.
                  <BrushUnderline className="absolute top-full left-[-2%] -mt-[0.04em] h-[0.22em] w-[106%]" />
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- 3 the possibility */

/*
 * What if you could see the problems coming? (Design System §58, Decision
 * Log 2026-11-16), from the founder-approved mockup and clean artwork in
 * docs/design/assets/contractor-break-cycle. The page turns from danger to
 * possibility: a warm light ground after the dark Why Now.
 *
 *   LEFT    amber rule; the h2 in navy ink, an amber brush underline beneath
 *           "coming"; the three "Imagine" paragraphs
 *   RIGHT   the comparison: two skewed white panels, each a photograph with
 *           its live label laid over the photograph's own label shape, then
 *           an icon, a heading, a short coloured rule and four bullets.
 *           Reactive in --jp-warning-red, Proactive in --jp-success (§58.2).
 *   CLOSE   full width: the statement in oversized navy type beside a
 *           vertical amber bar, an amber brush underline beneath "managing
 *           ahead of them". No amber text: amber fails contrast on light
 *           (§8.8), so the words stay navy.
 *
 * The photographs are aria-hidden (the panel copy carries the meaning); the
 * blueprint lines and planes are decorative CSS/SVG. No action or motion.
 */

const WHAT_IF_IMAGE = `${import.meta.env.BASE_URL}assets/roles/contractor-what-if`;

/** The warm ground: --jp-surface-white with a trace of amber. */
const WARM_GROUND = 'color-mix(in oklab, var(--jp-surface-white) 95%, var(--jp-brand-amber))';

/** --jp-ink-secondary / --jp-brand-amber at a given strength, for the planes. */
const ink = (percent: number) => `color-mix(in oklab, var(--jp-ink-secondary) ${percent}%, transparent)`;
const warm = (percent: number) => `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, transparent)`;

const WHAT_IF_PLANES = [
  { clipPath: 'polygon(0 80%, 14% 78%, 2% 100%, 0 100%)', backgroundImage: `linear-gradient(160deg, ${ink(9)} 0%, ${ink(3)} 100%)` },
  { clipPath: 'polygon(30% 100%, 47% 76%, 100% 74%, 100% 100%)', backgroundImage: `linear-gradient(180deg, ${warm(6)} 0%, ${warm(2)} 100%)` },
];

/** The panel shadow, from --jp-background (§58.2; --jp-shadow stays deferred). */
const PANEL_SHADOW = 'shadow-[0_22px_44px_-24px_color-mix(in_oklab,var(--jp-background)_38%,transparent)]';

const COMPARISON = [
  {
    key: 'reactive',
    label: 'Reactive',
    heading: 'Problems discovered in the field.',
    points: ['Late decisions and approvals', 'Missing or incomplete products', 'Crews waiting and being reallocated', 'Schedule and profit at risk'],
    Icon: AlertTriangle,
    fill: 'bg-jp-warning-red',
    text: 'text-jp-warning-red',
  },
  {
    key: 'proactive',
    label: 'Proactive',
    heading: 'Problems identified early enough to act.',
    points: ['Decisions and approvals on time', 'Right products, ready when needed', 'Crews working productively', 'Schedule and profit protected'],
    Icon: CheckCircle2,
    fill: 'bg-jp-success',
    text: 'text-jp-success',
  },
] as const;

/** The blueprint-line detail (§58.2): a few drawn lines, decorative. */
function BlueprintLines() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 220" fill="none" className="pointer-events-none absolute right-0 bottom-0 -z-10 hidden h-auto w-[22rem] stroke-jp-ink-secondary/25 md:block xl:w-[26rem]">
      <path d="M0 220 L320 40 M60 220 L320 74 M120 220 L320 108" strokeWidth="0.8" />
      <path d="M180 220 V120 H300 V220 M200 220 V140 H280 M220 140 V220 M240 140 V220 M260 140 V220" strokeWidth="0.6" />
      <path d="M180 120 L300 60 M300 60 V220" strokeWidth="0.6" />
      <path d="M150 196 H320 M150 172 H320" strokeWidth="0.4" />
    </svg>
  );
}

/**
 * One comparison panel. The frame is skewed (7 degrees, a little under the
 * artwork's 9, so the label clears the slanted corner on tall panels) and its content counter-skewed; the photograph overfills by
 * 3.5rem each side so the frame's slanted edges clip it, and the text keeps
 * the frame's width. The photograph keeps its own aspect
 * ratio at every width, so the live label, placed in percentages, always
 * covers the label shape in the photograph.
 */
function ComparisonPanel({ item }: { item: (typeof COMPARISON)[number] }) {
  const { key, label, heading, points, Icon, fill, text } = item;
  return (
    <article aria-labelledby={`gc-${key}`} className={`-skew-x-[7deg] overflow-hidden rounded-[1.25rem] bg-jp-surface-white ${PANEL_SHADOW}`}>
      <div className="skew-x-[7deg]">
        <div className="@container relative -mx-14 aspect-[522/359]">
          <img
            src={`${WHAT_IF_IMAGE}-${key}.webp`}
            width={522}
            height={359}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* The live label over the photograph's own label shape. */}
          <p
            className={`absolute top-[4.6%] left-[9.5%] flex h-[17.5%] w-[49%] items-center pl-[16cqw] ${fill}`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0 100%)' }}
          >
            {/* Authored in sentence case, uppercased in CSS (§7.7). */}
            <span className="font-heading text-[5cqw] font-extrabold uppercase leading-none tracking-[0.01em] text-jp-surface-white">{label}</span>
          </p>
        </div>

        <div className="pt-5 pr-14 pb-7 pl-9 sm:pt-6 sm:pr-16 sm:pb-8 sm:pl-10">
          <div className="flex items-start gap-3.5">
            <Icon aria-hidden="true" strokeWidth={2.25} className={`mt-0.5 size-11 shrink-0 sm:size-12 ${text}`} />
            <div className="min-w-0">
              <h3 id={`gc-${key}`} className="font-heading text-[1.3125rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-balance text-jp-background sm:text-[1.5rem] 2xl:text-[1.75rem]">
                {heading}
              </h3>
              <span aria-hidden="true" className={`mt-3 block h-[2px] w-20 ${fill}`} />
            </div>
          </div>
          <ul className="mt-5 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex items-baseline gap-3 text-[1rem] leading-[1.4] text-jp-background/85 sm:text-[1.0625rem] 2xl:text-[1.1875rem]">
                <span aria-hidden="true" className={`size-3 shrink-0 translate-y-[0.05em] rounded-[3px] ${fill}`} />
                <span className="min-w-0">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Possibility() {
  return (
    <section
      aria-labelledby="gc-possibility"
      className={`relative isolate overflow-hidden py-20 sm:py-24 xl:py-28 ${GUTTERS}`}
      style={{ backgroundColor: WARM_GROUND }}
    >
      {WHAT_IF_PLANES.map((style) => (
        <div key={style.clipPath} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={style} />
      ))}
      <BlueprintLines />

      <div className="mx-auto max-w-[98rem] lg:px-6 2xl:px-8">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] xl:items-start xl:gap-x-12 2xl:gap-x-16">
          <div>
            <span aria-hidden="true" className="block h-[5px] w-20 bg-jp-brand-amber sm:w-24" />
            <h2
              id="gc-possibility"
              className="mt-7 max-w-[15ch] font-heading text-[min(2.75rem,11vw)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-jp-background sm:text-[3.5rem] lg:text-[4rem] xl:text-[3.5rem] 2xl:text-[3.875rem]"
            >
              What if you could see the problems{' '}
              <span className="relative inline-block">
                coming
                <BrushUnderline className="absolute top-full left-[-3%] -mt-[0.02em] h-[0.16em] w-[106%]" />
              </span>
              ?
            </h2>
            <div className="mt-9 max-w-[48ch] space-y-5 sm:mt-10">
              {IMAGINE.map((paragraph) => (
                <p key={paragraph} className="text-[1.0625rem] leading-[1.55] text-pretty text-jp-background/85 sm:text-[1.1875rem] 2xl:text-[1.3125rem]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* The comparison: Reactive, then Proactive. Side by side from
              `sm`; padded so the skewed frames' corners stay in view. */}
          <div className="mt-14 grid gap-8 px-7 sm:grid-cols-2 sm:gap-5 sm:px-6 xl:mt-1 xl:px-4">
            {COMPARISON.map((item) => (
              <ComparisonPanel key={item.key} item={item} />
            ))}
          </div>
        </div>

        {/* The close: the section's conclusion, full width. */}
        <div className="mt-16 flex gap-5 sm:mt-20 sm:gap-8 xl:mt-24 xl:pl-10">
          <span aria-hidden="true" className="block w-1.5 shrink-0 bg-jp-brand-amber sm:w-2" />
          <p className="font-heading text-[min(2.125rem,9vw)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance text-jp-background sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem] 2xl:text-[4rem]">
            That&apos;s the difference between reacting to problems and{' '}
            <span className="relative inline-block">
              managing ahead of them.
              <BrushUnderline className="absolute top-full left-[4%] mt-[0.06em] h-[0.17em] w-[86%]" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ 4 how JiTpro works */

/*
 * How JiTpro helps you break the cycle (Design System §59, Decision Log
 * 2026-11-16), from the founder-approved mockup and clean artwork in
 * docs/design/assets/contractor-break-cycle. Same warm ground as §58, so the
 * two light sections read as one act.
 *
 *   LEFT   amber rule; the h2 on three lines, an amber brush underline
 *          beneath "cycle."; the introduction; the building image anchoring
 *          the lower left (a band below `lg`)
 *   RIGHT  the four steps, one ordered list on equal rows: an amber line in
 *          SVG through four nodes (curved from `lg`, straight below it),
 *          each panel with icon, amber rule, heading, sentence and its
 *          image fading in at the right (at the top on phones); then the
 *          closing statement beside an amber bar, navy words with an amber
 *          brush underline (amber fails contrast on light, §8.8)
 *
 * Side by side from `xl`; stacked below it (heading, building band, steps on a
 * straight line). Imagery is aria-hidden (the copy carries the meaning). No action or motion.
 */

const HOW_IMAGE = `${import.meta.env.BASE_URL}assets/roles/contractor-how`;

/** Per step: icon, image, and the node's offset from `lg` (the line's curve). */
const STEP_ART = [
  { Icon: ScanSearch, image: 'step-1', offset: 'xl:[--nx:7rem]' },
  { Icon: Handshake, image: 'step-2', offset: 'xl:[--nx:4rem]' },
  { Icon: CalendarDays, image: 'step-3', offset: 'xl:[--nx:2.5rem]' },
  { Icon: Users, image: 'step-4', offset: 'xl:[--nx:0rem]' },
] as const;

/** The panel shadow, from --jp-background (§59.2; --jp-shadow stays deferred). */
const STEP_SHADOW = 'drop-shadow-[0_14px_18px_color-mix(in_oklab,var(--jp-background)_14%,transparent)]';

/**
 * The curved line from `lg`: node centres at x = offset + 1.75rem (in px at
 * 16px root) and y = 12.5 / 37.5 / 62.5 / 87.5% of the list, which has no
 * row gap so those are the row centres exactly. The SVG is 10.5rem wide, so
 * its x units are pixels; only y stretches.
 */
function CurvedPath() {
  return (
    <svg aria-hidden="true" viewBox="0 0 168 400" preserveAspectRatio="none" fill="none" className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-[10.5rem] overflow-visible stroke-jp-brand-amber xl:block">
      <path d="M140 50 C 120 92, 97 112, 92 150 C 87 190, 73 212, 68 250 C 63 290, 42 312, 28 350" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The line's continuation past node 04 (founder review 2026-11-16): it carries
 * on down and to the left toward the building's roof, fading out, as in the
 * mockup. A fixed-size SVG anchored at node 04's centre (x 1.75rem, y 87.5% of
 * the list), so its curve is never stretched; from `xl` only, where the
 * building sits at the lower left. It ends above the closing statement.
 */
function PathTail() {
  const gradient = useId();
  return (
    <svg aria-hidden="true" width="150" height="132" viewBox="0 0 150 132" fill="none" className="pointer-events-none absolute top-[87.5%] left-[calc(1.75rem-150px)] hidden overflow-visible xl:block">
      <defs>
        <linearGradient id={gradient} x1="150" y1="0" x2="0" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--jp-brand-amber)', stopOpacity: 1 }} />
          <stop offset="0.55" style={{ stopColor: 'var(--jp-brand-amber)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--jp-brand-amber)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d="M150 0 C 141 46, 112 96, 4 128" stroke={`url(#${gradient})`} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function HowItWorks() {
  return (
    <section
      aria-labelledby="gc-how"
      className={`relative isolate overflow-hidden py-20 sm:py-24 xl:py-28 ${GUTTERS}`}
      style={{ backgroundColor: WARM_GROUND }}
    >
      <BlueprintLines />
      {/* A low warm glow behind the building (decorative). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" style={{ backgroundImage: `radial-gradient(34% 40% at 12% 82%, ${warm(14)} 0%, transparent 70%)` }} />

      <div className="mx-auto max-w-[98rem] lg:px-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-x-12 2xl:gap-x-14 2xl:px-8">
        {/* LEFT: the introduction and the building. */}
        <div>
          <span aria-hidden="true" className="block h-[5px] w-20 bg-jp-brand-amber sm:w-24" />
          <h2
            id="gc-how"
            className="mt-7 font-heading text-[min(2.625rem,11vw)] font-extrabold leading-[1.02] tracking-[-0.035em] text-jp-background sm:text-[3.25rem] xl:text-[2.75rem] 2xl:text-[3.5rem]"
          >
            <span className="sm:block">How JiTpro helps </span>
            <span className="sm:block">you break the </span>
            <span className="relative inline-block">
              cycle.
              <BrushUnderline className="absolute top-full left-0 mt-[0.04em] h-[0.17em] w-[118%]" />
            </span>
          </h2>
          <p className="mt-9 max-w-[30ch] text-[1.125rem] leading-[1.55] text-pretty text-jp-background/85 sm:mt-10 sm:text-[1.25rem] 2xl:text-[1.375rem]">
            We start with your project and work backward from what your field needs to execute the work.
          </p>

          {/* The building: a band below `lg`; from `lg` anchored to the
              section's lower left (the wrapper is then absolute against
              the section), fading into the ground. */}
          <div className="relative -mx-6 mt-10 h-64 sm:-mx-8 sm:h-80 lg:-mx-6 lg:h-96 xl:absolute xl:bottom-0 xl:left-0 xl:-z-10 xl:mx-0 xl:mt-0 xl:h-[50%] xl:w-[31%]">
            <img
              src={`${HOW_IMAGE}-building.webp`}
              width={480}
              height={511}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[center_28%] [mask-composite:intersect] xl:object-[left_bottom] [mask-image:linear-gradient(90deg,black_60%,transparent),linear-gradient(0deg,black_70%,transparent)] xl:[mask-image:linear-gradient(90deg,black_55%,transparent),linear-gradient(0deg,black_62%,transparent)]"
            />
          </div>
        </div>

        {/* RIGHT: the steps and the closing statement. */}
        <div className="mt-12 xl:mt-1">
          <ol className="relative">
            <CurvedPath />
            <PathTail />
            {/* Below `lg`: one straight line from the first node to the last. */}
            <span aria-hidden="true" className="pointer-events-none absolute top-[12.5%] bottom-[12.5%] left-[calc(1.5rem-1.5px)] w-[3px] rounded-full bg-jp-brand-amber sm:left-[calc(1.75rem-1.5px)] xl:hidden" />

            {STEPS.map((step, i) => {
              const { Icon, image, offset } = STEP_ART[i];
              return (
                <li key={step.title} className={`relative py-2 pl-[calc(var(--nx)+3.75rem)] [--nx:0rem] sm:py-2.5 sm:pl-[calc(var(--nx)+4.25rem)] ${offset}`}>
                  {/* The node: ring and ordinal (navy ink on the light ground, §48.9). */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-[var(--nx)] flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-jp-brand-amber bg-jp-surface-white font-mono text-[0.9375rem] font-bold text-jp-background sm:size-14 sm:text-base"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className={STEP_SHADOW}>
                    <div className="relative overflow-hidden rounded-[1.125rem] bg-jp-surface-white sm:rounded-l-[1.25rem] sm:rounded-r-[0.875rem] sm:[clip-path:polygon(0_0,100%_0,calc(100%-1.5rem)_100%,0_100%)]">
                      <img
                        src={`${HOW_IMAGE}-${image}.webp`}
                        width={298}
                        height={136}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="block h-28 w-full object-cover [mask-image:linear-gradient(180deg,black_50%,transparent)] sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:w-[34%] sm:[mask-image:linear-gradient(90deg,transparent,black_42%)]"
                      />
                      <div className="grid grid-cols-[auto_2px_minmax(0,1fr)] items-center gap-x-4 px-5 pt-1 pb-5 sm:gap-x-5 sm:py-5 sm:pr-[36%] sm:pl-6 xl:py-6">
                        <Icon aria-hidden="true" strokeWidth={1.9} className="size-9 shrink-0 text-jp-background sm:size-11 xl:size-12" />
                        <span aria-hidden="true" className="h-full min-h-12 w-[2px] bg-jp-brand-amber" />
                        <div className="min-w-0">
                          <h3 className="font-heading text-[1.1875rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-background sm:text-[1.375rem] xl:text-[1.5rem] 2xl:text-[1.6875rem]">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-[0.9375rem] leading-[1.45] text-pretty text-jp-background/80 sm:text-[1rem] 2xl:text-[1.0625rem]">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* The close: the section's conclusion. */}
          <div className="mt-14 flex gap-5 sm:mt-16 sm:gap-7 xl:mt-20 xl:ml-[3rem]">
            <span aria-hidden="true" className="block w-1.5 shrink-0 bg-jp-brand-amber sm:w-2" />
            <p className="font-heading text-[min(2rem,8.6vw)] font-extrabold leading-[1.08] tracking-[-0.03em] text-jp-background sm:text-[2.75rem] lg:text-[3rem] xl:text-[2.75rem] 2xl:text-[3.5rem]">
              The goal is simple: <span className="whitespace-nowrap">Get the field</span>{' '}
              <span className="relative inline-block">
                what it needs, when it needs it.
                <BrushUnderline className="absolute top-full left-[8%] mt-[0.06em] h-[0.16em] w-[84%]" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- 5 the invitation */

/*
 * Start with one project (Design System §60, Decision Log 2026-11-16), from
 * the founder-approved mockup and clean artwork in
 * docs/design/assets/contractor-break-cycle.
 *
 *   IMAGE   the residence at dusk covers the section from `xl`, anchored to its
 *           left edge so the house keeps its place at the right (its navy left
 *           side is the copy's ground); below `xl` it is the
 *           copy's navy ground and then a band of the house after the copy
 *   ROW 1   amber rule; the h2 on two lines (no underline, founder decision);
 *           a vertical amber rule; the two paragraphs
 *   ROW 2   three statements, amber icon over bold white label, hairlines
 *   ROW 3   "A better way forward." in bold italic beside an amber bar, the
 *           section's one brush underline beneath it
 *
 * The page's close (We're not here..., One project at a time., the last
 * primary action) follows in its own band, recomposed as a quiet editorial
 * conclusion (§60.3).
 */

const RESIDENCE = `${import.meta.env.BASE_URL}assets/roles/contractor-one-project-residence`;
const RESIDENCE_SRCSET = `${RESIDENCE}-960.webp 960w, ${RESIDENCE}-1670.webp 1670w`;

/** The close's amber line (founder choice 2026-11-16, Option 2; §60.3). */
const CLOSING_LINES: readonly string[] = ['Break the cycle.', 'One project at a time.'];

const VALUES = [
  { label: 'One project.', Icon: Target },
  { label: 'Greater visibility.', Icon: BarChart3 },
  { label: 'Clearer accountability.', Icon: Users },
] as const;

function Invitation() {
  return (
    <>
      <section aria-labelledby="gc-invitation" className={`relative isolate overflow-hidden bg-jp-background pt-20 sm:pt-24 xl:min-h-[min(58vw,62rem)] xl:py-24 2xl:py-28 ${GUTTERS}`}>
        {/* The image layer: from `xl` the residence to the right; below
            `xl` only its navy left side shows, as the copy's ground. */}
        <img
          src={`${RESIDENCE}-1670.webp`}
          srcSet={RESIDENCE_SRCSET}
          sizes="100vw"
          width={1670}
          height={941}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[left_top] xl:object-[0%_center]"
        />
        {/* From `xl`, a soft scrim under the copy where the screen is narrower
            than the artwork and the house slides toward it. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" style={{ backgroundImage: `linear-gradient(90deg, ${scrim(45)} 0%, ${scrim(25)} 38%, transparent 58%)` }} />

        <div className="mx-auto max-w-[98rem] lg:px-6 2xl:px-8">
          {/* ROW 1 */}
          <div className="xl:grid xl:grid-cols-[minmax(0,26rem)_3px_minmax(0,40rem)] xl:items-start xl:gap-x-12 2xl:grid-cols-[minmax(0,30rem)_3px_minmax(0,46rem)]">
            <div>
              <span aria-hidden="true" className="block h-[6px] w-24 rounded-full bg-jp-brand-amber sm:w-28" />
              <h2
                id="gc-invitation"
                className="mt-7 font-heading text-[min(3rem,12vw)] font-extrabold leading-[1.02] tracking-[-0.035em] text-jp-text-primary sm:text-[4rem] xl:text-[4.25rem] 2xl:text-[4.75rem]"
              >
                <span className="block">Start with</span>
                <span className="block">one project.</span>
              </h2>
            </div>
            <span aria-hidden="true" className="mt-10 block h-[3px] w-20 rounded-full bg-jp-brand-amber xl:mt-0 xl:h-auto xl:w-[3px]" />
            <div className="mt-8 max-w-[60ch] space-y-5 xl:mt-1">
              <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:text-[1.25rem] xl:text-[1.375rem]">
                You don&apos;t have to overhaul your entire company to begin changing how you build.
              </p>
              <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:text-[1.25rem] xl:text-[1.375rem]">
                JiTpro starts with a Project Readiness Engagement. We take a detailed look at one project, identify the risks and missing commitments, and establish a structured procurement plan to help your team get ahead of them.
              </p>
            </div>
          </div>

          {/* ROW 2: the three statements. */}
          <ul className="mt-14 grid max-w-[46rem] grid-cols-1 xl:max-w-[40rem] 2xl:max-w-[46rem] gap-y-8 sm:mt-16 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-jp-border/35 xl:mt-14">
            {VALUES.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:px-6 sm:text-center sm:first:pl-0 sm:first:text-left xl:first:pl-2 xl:first:text-center">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-11 shrink-0 text-jp-brand-amber sm:size-14" />
                <span className="font-heading text-[1.375rem] font-bold leading-[1.15] tracking-[-0.015em] text-balance text-jp-text-primary sm:text-[1.375rem] xl:text-[1.625rem]">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* ROW 3: the closing statement and the section's one underline. */}
          <div className="mt-14 flex gap-5 sm:mt-16 sm:gap-7 xl:mt-14">
            <span aria-hidden="true" className="block w-1.5 shrink-0 rounded-full bg-jp-brand-amber sm:w-2" />
            <p className="pb-4 font-heading text-[min(2.5rem,10.5vw)] font-extrabold italic leading-[1.05] tracking-[-0.02em] text-jp-text-primary sm:text-[3.5rem] xl:text-[3.75rem] 2xl:text-[4rem]">
              <span className="relative inline-block">
                A better way forward.
                <BrushUnderline className="absolute top-full left-[10%] mt-[0.08em] h-[0.2em] w-[92%]" />
              </span>
            </p>
          </div>
        </div>

        {/* Below `xl`: the residence as a band after the copy. */}
        <div className="relative -mx-6 mt-14 aspect-[4/3] sm:-mx-8 sm:aspect-[16/10] lg:-mx-10 lg:aspect-[16/8] xl:hidden">
          <img
            src={`${RESIDENCE}-960.webp`}
            srcSet={RESIDENCE_SRCSET}
            sizes="100vw"
            width={1670}
            height={941}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[78%_62%] [mask-image:linear-gradient(180deg,transparent_0%,black_22%)]"
          />
        </div>
      </section>

      {/* The page's close (§60.3, recomposed 2026-11-16): a quiet,
          asymmetrical editorial conclusion. Left-aligned on the content
          width; a hairline from the image section above; the closing
          statement, a divider with an amber start segment, then the
          signature statement beside the page's last primary action. */}
      <section aria-labelledby="gc-close" className={`border-t border-jp-border/12 bg-jp-background py-20 sm:py-24 lg:py-28 xl:py-32 ${GUTTERS}`}>
        <div className="mx-auto max-w-[98rem] lg:px-6 2xl:px-8">
          <p className="max-w-[40ch] font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance text-jp-text-secondary sm:text-[1.5rem] xl:text-[1.75rem]">
            We&apos;re not here to help you manage the same old chaos.
          </p>
          <h2
            id="gc-close"
            className="mt-4 max-w-[22ch] font-heading text-[min(2.5rem,10.5vw)] font-extrabold leading-[1.04] tracking-[-0.035em] text-balance text-jp-text-primary sm:mt-5 sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5rem]"
          >
            We&apos;re here to help you break the cycle.
          </h2>

          {/* The divider: the Fewer surprises hairline, its start in amber. */}
          <div aria-hidden="true" className="relative mt-14 h-px bg-jp-border/20 sm:mt-16 xl:mt-20">
            <span className="absolute inset-y-0 left-0 w-16 bg-jp-brand-amber sm:w-24" />
          </div>

          <div className="mt-12 sm:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16 xl:mt-16">
            {/* The signature line, at a restrained closing-statement scale
                (founder review 2026-11-16: smaller than the white heading
                above, never a billboard). One line per sentence. */}
            <p className="font-heading text-[min(2.125rem,9vw)] font-extrabold leading-[1.08] tracking-[-0.03em] text-jp-brand-amber sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[3.5rem]">
              {CLOSING_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div className="mt-10 sm:mt-12 lg:mt-0 lg:pb-3">
              <PrimaryAction>Let&apos;s talk about your project</PrimaryAction>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function GeneralContractors() {
  usePageMeta(TITLE, DESCRIPTION);

  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <Hero />
      <BetterWay />
      <WhyNow />
      <Possibility />
      <HowItWorks />
      <Invitation />
    </div>
  );
}
