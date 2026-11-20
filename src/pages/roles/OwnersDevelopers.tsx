import { ArrowDown, ArrowRight, Building2, CalendarDays, DraftingCompass, HardHat, Layers, MessageCircleQuestion, Package, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------ hero */

/*
 * The hero (Design System §66, Decision Log 2026-11-18), from the
 * founder-approved photograph in docs/design/assets/owner-hero: a
 * contemporary residence looking out over a vineyard at sunset, an infinity
 * pool reaching toward the vines.
 *
 *   COPY   amber eyebrow and its rule; the title-case h1 on three lines in
 *          white; the secondary headline in amber; two paragraphs; the
 *          primary action, which scrolls to the section below
 *
 * ONE IMAGE ELEMENT, TWO FRAMES (as the contractor and architect heroes).
 * Below `lg` the photograph is a band above the copy, framed on the pool and
 * the sunset. From `lg` it is drawn 124% of the hero's width, anchored left,
 * so the sun and the pool sit right of centre (about 62%) and the residence's
 * dark window frame and interior fall behind the copy; a --jp-background
 * scrim, anchored to the copy column, covers it at every width and eases
 * out over 18rem past it, so the sunset, the water and the vineyard stay bright. Decoration only:
 * aria-hidden.
 */

const OWNER_HERO_IMAGE = `${import.meta.env.BASE_URL}assets/roles/owner-hero-vineyard-residence`;

/** --jp-background at a given strength over the photograph. */
const ownerScrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;

/** The copy column's width from `lg`: at most 36rem, and never past 44% of the viewport, so it stays clear of the sun. */
const OWNER_COPY_WIDTH = 'min(36rem, 44vw)';

/**
 * From `lg`: a scrim anchored to the copy column, not to the viewport. It runs from the hero's left edge to 18rem
 * past the column (whose right edge is the centred frame's inset, 2.5rem of padding, then the column), at full
 * strength behind the text and easing out over the last 18rem, so the copy reads at every width while the sunset,
 * the pool and the vineyard stay bright.
 */
const OWNER_COPY_SCRIM = {
  width: `calc(max((100vw - 80rem) / 2, 0px) + 2.5rem + ${OWNER_COPY_WIDTH} + 18rem)`,
  backgroundImage: `linear-gradient(90deg, ${ownerScrim(94)} 0%, ${ownerScrim(88)} calc(100% - 18rem), ${ownerScrim(76)} calc(100% - 14rem), ${ownerScrim(56)} calc(100% - 10rem), ${ownerScrim(33)} calc(100% - 6rem), ${ownerScrim(13)} calc(100% - 2.5rem), transparent 100%)`,
};

/** From `lg`: a short fade from the navigation at the top, and into the page at the foot. */
const OWNER_EDGE_FADES = {
  backgroundImage: `linear-gradient(180deg, ${ownerScrim(40)} 0%, transparent 14%, transparent 82%, var(--jp-background) 100%)`,
};

/** Below `lg`: the band fades in from the navigation and out into the copy. */
const OWNER_BAND_SCRIM = {
  backgroundImage: `linear-gradient(180deg, ${ownerScrim(30)} 0%, transparent 20%, transparent 50%, ${ownerScrim(88)} 74%, var(--jp-background) 84%)`,
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  /* The first content section below the hero, clear of the sticky navigation; smooth unless motion is reduced. */
  const discover = () => {
    const next = heroRef.current?.nextElementSibling;
    if (!(next instanceof HTMLElement)) return;
    const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 0;
    const top = next.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: window.matchMedia(REDUCED_MOTION).matches ? 'auto' : 'smooth' });
  };

  return (
    <section ref={heroRef} aria-labelledby="owner-hero" className="relative isolate overflow-hidden bg-jp-background">
      {/* The photograph. Below `lg` the band at the top of the hero; from `lg` it covers the hero, behind the copy. */}
      <div className="relative h-[min(64vw,28rem,46svh)] lg:static lg:h-auto">
        <img
          src={`${OWNER_HERO_IMAGE}-1701.webp`}
          srcSet={`${OWNER_HERO_IMAGE}-960.webp 960w, ${OWNER_HERO_IMAGE}-1701.webp 1701w`}
          sizes="100vw"
          width={1701}
          height={925}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-[50%_45%] lg:right-auto lg:w-[124%] lg:object-left"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden" style={OWNER_BAND_SCRIM} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden lg:block" style={OWNER_COPY_SCRIM} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" style={OWNER_EDGE_FADES} />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:flex lg:min-h-[min(50rem,calc(100svh-5rem))] lg:items-center lg:px-10">
        <div className="relative -mt-14 pb-16 sm:-mt-16 sm:pb-20 lg:mt-0 lg:w-[min(36rem,44vw)] lg:py-12 xl:py-16">
          {/* Authored in sentence case, uppercased in CSS (§7.7). */}
          <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
            <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16" />
            For owners &amp; developers
          </p>

          {/* Title case, as approved (§66.2). Three set lines. */}
          <h1
            id="owner-hero"
            className="mt-6 font-heading text-[min(3.25rem,9.6vw)] font-extrabold leading-[1.02] tracking-[-0.03em] text-jp-text-primary sm:mt-7 sm:text-[4rem] lg:mt-6 lg:text-[clamp(3.25rem,4.5vw,4.5rem)]"
          >
            <span className="block">Your Project.</span>
            <span className="block">Your Investment.</span>
            <span className="block">Your Vision.</span>
          </h1>

          <p className="mt-6 max-w-[26ch] font-heading text-[1.375rem] lg:mt-5 lg:max-w-none font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-brand-amber sm:mt-7 sm:text-[1.625rem] lg:text-[clamp(1.5rem,1.9vw,1.875rem)]">
            You deserve to remain in control of all three.
          </p>

          <div className="mt-6 max-w-[34rem] space-y-4 text-[1.0625rem] leading-[1.65] text-pretty text-jp-text-secondary sm:mt-7 sm:text-[1.125rem] lg:mt-5 lg:space-y-3 lg:text-[clamp(1.0625rem,1.25vw,1.1875rem)] lg:leading-[1.6]">
            <p>
              Building your project should be an exciting experience, not a series of unexpected costs, rushed decisions, and broken promises.
            </p>
            <p>
              JiTpro helps bring clarity, accountability, and early planning to the construction process, so you can make informed decisions,
              protect your investment, and build with confidence.
            </p>
          </div>

          <div className="mt-9 sm:mt-10 lg:mt-8">
            <button
              type="button"
              onClick={discover}
              className="inline-flex w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-7 sm:text-base"
            >
              <span className="[text-wrap:balance]">Discover a Better Way to Build</span>
              <ArrowDown size={18} aria-hidden="true" className="shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- 2 where problems begin */

/*
 * Section 2 (Design System §67, Decision Log 2026-11-18), from the
 * founder-approved mockup and clean artwork in
 * docs/design/assets/owner-where-problems-begin. The problem, before the
 * solution: nothing here presents JiTpro.
 *
 *   LEFT   eyebrow and its amber rule, the h2, the introduction, a
 *          highlighted statement, the explanation, and a closing statement
 *          beside an amber bar
 *   RIGHT  a vineyard landscape fading in at the upper right (continuing the
 *          hero's setting); the four-stage diagram, one ordered list of cards
 *          joined by amber arrows; the conclusion in a light amber panel
 *
 * The landscape is the one raster element, extracted from the clean artwork
 * with its ground rebalanced onto this section's off-white; every word, card,
 * tab, arrow and panel is HTML. Stacked below `lg` in reading order.
 *
 * AMBER on the light ground (§8.8): decorative fills and marks only (the
 * rules, the bars, the arrows, the stage tabs and the panels); every word is
 * in ink, so it meets contrast.
 */

const OWNER_LANDSCAPE = `${import.meta.env.BASE_URL}assets/roles/owner-vineyard-landscape-848.webp`;

/** The mockup's off-white: --jp-surface-white softened toward --jp-surface-light. */
const WPB_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-surface-white) 55%, var(--jp-surface-light))' };

/** A light amber wash on white, at a given strength (the highlighted statement and the conclusion). */
const amberWash = (percent: number) => ({ backgroundColor: `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, var(--jp-surface-white))` });

/**
 * The four stages. Each tab darkens one step, neutral to deep amber, as the consequence grows: tokens mixed, never
 * restated (§67.2).
 */
const STAGES: ReadonlyArray<{ title: string; text: string; Icon: LucideIcon | typeof StackedCoins; tab: string }> = [
  {
    title: 'Missing information',
    text: 'A required selection or detail remains unresolved.',
    Icon: MessageCircleQuestion,
    tab: 'color-mix(in oklab, var(--jp-ink-secondary) 62%, var(--jp-surface-white))',
  },
  {
    title: 'Procurement delayed',
    text: 'Approval, ordering, or fabrication cannot proceed.',
    Icon: Package,
    tab: 'color-mix(in oklab, var(--jp-brand-amber) 55%, var(--jp-border))',
  },
  {
    title: 'Field work disrupted',
    text: "Materials or services aren't ready when scheduled.",
    Icon: HardHat,
    tab: 'color-mix(in oklab, var(--jp-brand-amber) 84%, var(--jp-background))',
  },
  {
    title: 'Costs and frustration increase',
    text: 'Labor is reassigned, recovery costs grow, and relationships suffer.',
    Icon: StackedCoins,
    tab: 'color-mix(in oklab, var(--jp-brand-amber) 68%, var(--jp-background))',
  },
];

/** Stacked coins, drawn in lucide's line style (lucide's own Coins glyph reads as two loose circles, not a stack). */
function StackedCoins({ className, strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="9" cy="6" rx="6" ry="2.5" />
      <path d="M3 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" />
      <path d="M3 10v4c0 1.4 2.7 2.5 6 2.5" />
      <path d="M3 14v4c0 1.4 2.7 2.5 6 2.5" />
      <ellipse cx="16" cy="13.5" rx="5" ry="2.2" />
      <path d="M11 13.5v3.5c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-3.5" />
    </svg>
  );
}

/** The tab: a rounded block pointing right, into the card. */
const TAB_SHAPE = 'polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%)';

const CARD_SHADOW = 'shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--jp-background)_35%,transparent)]';

function WhereProblemsBegin() {
  return (
    <section aria-labelledby="owner-where-problems" className="relative isolate overflow-hidden" style={WPB_GROUND}>
      {/* From `lg`: the landscape at the upper right, behind the diagram's heading. */}
      <img
        src={OWNER_LANDSCAPE}
        width={848}
        height={240}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-0 right-0 -z-10 hidden w-[min(54%,56rem)] [mask-image:linear-gradient(90deg,transparent,black_22%)] lg:block"
      />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-[clamp(3rem,5vw,5.5rem)] lg:px-10 lg:py-24">
        <div>
          {/* Authored in sentence case, uppercased in CSS; slate on the light ground (§8.8), the rule amber. */}
          <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]">
            <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16" />
            Where problems begin
          </p>

          <h2
            id="owner-where-problems"
            className="mt-6 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-background sm:text-[3rem] lg:text-[clamp(2.75rem,3.6vw,3.5rem)]"
          >
            The problems that disrupt your project rarely begin in the field.
          </h2>

          <p className="mt-6 text-[1.1875rem] leading-[1.5] text-pretty text-jp-background/85 sm:text-[1.3125rem] lg:text-[clamp(1.1875rem,1.45vw,1.375rem)]">
            Every construction project begins with unanswered questions, incomplete details, and decisions that have yet to be made.
          </p>

          <div className="relative mt-7 rounded-xl py-4 pr-5 pl-6 sm:pl-7" style={amberWash(13)}>
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-jp-brand-amber" />
            <p className="font-heading text-[1.1875rem] font-bold leading-[1.35] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.3125rem]">
              That&apos;s normal. Unfortunately, it&apos;s also become normal to wait until those unanswered questions become emergencies
              before doing something about them.
            </p>
          </div>

          <div className="mt-7 space-y-4 text-[1.0625rem] leading-[1.6] text-pretty text-jp-ink-secondary sm:text-[1.125rem]">
            <p>
              Every product, material, and service needed to build your project depends on decisions, information, coordination, and approvals
              happening at the right time.
            </p>
            <p>
              When something is missing, the consequences can reach far beyond a single unanswered question. A missing decision delays an
              approval. A delayed approval prevents a product from being ordered. The product arrives late. The work stops. Labor must be
              rescheduled. Costs begin to climb.
            </p>
            <p>
              Suddenly, what could have been resolved months earlier has become an expensive problem affecting your schedule, your budget, and
              your entire project team. And when the pressure builds, so does the frustration. Relationships become strained. Confidence
              begins to erode.
            </p>
          </div>

          <div className="relative mt-8 pl-6 sm:pl-7">
            <span aria-hidden="true" className="absolute inset-y-0.5 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="font-heading text-[1.25rem] font-bold leading-[1.35] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.375rem]">
              This is how small, unresolved problems become the chaos we&apos;ve come to accept in construction.
            </p>
          </div>
        </div>

        <div className="mt-14 lg:mt-0 lg:pt-[clamp(7rem,10vw,9.5rem)]">
          {/* Below `lg`: the landscape as a band above the diagram. */}
          <img
            src={OWNER_LANDSCAPE}
            width={848}
            height={240}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="-mx-6 mb-6 block h-auto w-[calc(100%+3rem)] max-w-none [mask-image:linear-gradient(180deg,black_60%,transparent)] sm:-mx-8 sm:w-[calc(100%+4rem)] lg:hidden"
          />

          <h3 className="font-mono text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-jp-background sm:text-sm">
            How one unanswered question becomes a project problem
          </h3>

          <ol className="mt-5">
            {STAGES.map(({ title, text, Icon, tab }, i) => (
              <li key={title}>
                {i > 0 ? (
                  <span aria-hidden="true" className="flex justify-center py-1.5 pl-[5.5rem] sm:pl-28">
                    <ArrowDown size={20} strokeWidth={2.25} className="text-jp-brand-amber" />
                  </span>
                ) : null}
                <div className={`flex items-stretch overflow-hidden rounded-xl bg-jp-surface-white ${CARD_SHADOW}`}>
                  <span
                    aria-hidden="true"
                    className="flex w-[5.25rem] shrink-0 items-center justify-center pr-3 sm:w-[6.75rem] sm:pr-4"
                    style={{ backgroundColor: tab, clipPath: TAB_SHAPE }}
                  >
                    <Icon strokeWidth={1.6} className="size-8 text-jp-surface-white sm:size-10" />
                  </span>
                  <div className="min-w-0 py-4 pr-4 pl-3 sm:py-5 sm:pr-6 sm:pl-4">
                    <h4 className="font-heading text-[1.125rem] font-bold leading-[1.25] tracking-[-0.01em] text-jp-background sm:text-[1.3125rem]">
                      {title}
                    </h4>
                    <p className="mt-1 text-[0.9375rem] leading-[1.45] text-pretty text-jp-ink-secondary sm:text-[1rem]">{text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-7 rounded-xl px-6 py-5 text-center sm:px-8 sm:py-6" style={amberWash(22)}>
            <p className="font-heading text-[1.125rem] font-bold leading-[1.4] tracking-[-0.01em] text-balance text-jp-background sm:text-[1.3125rem]">
              The earlier these requirements are identified, the more time your team has to resolve them before they threaten your project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- 3 a better way to build */

/*
 * Section 3 (Design System §68, Decision Log 2026-11-18), from the
 * founder-approved mockup and clean artwork in
 * docs/design/assets/owner-better-way. What a contractor who plans ahead
 * looks like; JiTpro is not named here.
 *
 *   PHOTO  a walnut coordination table from above: drawings, hands,
 *          samples, a laptop. On it, the eyebrow, the h2, five short
 *          paragraphs and a highlighted statement, on the dark wood at left
 *   STRIP  three benefits (Anticipates, Coordinates, Protects) on a light
 *          ground, each an amber line icon, divided by fine amber rules
 *   BAND   the closing statement in a light amber band, its second sentence
 *          emphasised
 *
 * The photograph is the one raster element, cropped from the clean artwork
 * above its baked-in strip; the strip, icons, band and every word are HTML.
 * Below `lg` the drawings are a band above the copy, and the copy sits on
 * the walnut (the same photograph, framed on its plain left).
 */

const OWNER_TABLE = `${import.meta.env.BASE_URL}assets/roles/owner-coordination-table`;

/** The light ground of the strip and band: --jp-surface-white softened toward --jp-surface-light. */
const BW_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-surface-white) 72%, var(--jp-surface-light))' };

/** The copy column's width from `lg`: at most 34rem, and never past 40% of the viewport, so it stays on the walnut. */
const BW_COPY_WIDTH = 'min(34rem, 40vw)';

/** From `lg`: a scrim anchored to the copy column (as the hero's), strong behind the text and easing out 14rem past it, before the drawings. */
const BW_COPY_SCRIM = {
  width: `calc(max((100vw - 80rem) / 2, 0px) + 2.5rem + ${BW_COPY_WIDTH} + 14rem)`,
  backgroundImage: `linear-gradient(90deg, ${ownerScrim(90)} 0%, ${ownerScrim(84)} calc(100% - 14rem), ${ownerScrim(58)} calc(100% - 9.5rem), ${ownerScrim(28)} calc(100% - 5rem), transparent 100%)`,
};

/** The photograph's foot, handed off to the light ground below (the artwork's own fade, rebuilt in CSS). */
const BW_FOOT_FADE = {
  backgroundImage: 'linear-gradient(180deg, transparent 84%, color-mix(in oklab, var(--jp-surface-white) 72%, var(--jp-surface-light)) 100%)',
};

const BENEFITS: ReadonlyArray<{ title: string; text: string; Icon: LucideIcon }> = [
  { title: 'Anticipates', text: "Knows what's coming and plans for it.", Icon: CalendarDays },
  { title: 'Coordinates', text: "Makes sure everyone understands what's required.", Icon: Users },
  { title: 'Protects', text: 'Preserves your choices, investment, and confidence.', Icon: ShieldCheck },
];

function BetterWayToBuild() {
  return (
    <section aria-labelledby="owner-better-way" style={BW_GROUND}>
      {/* The photograph and the copy on it. */}
      <div className="relative isolate overflow-hidden bg-jp-background">
        {/* Below `lg`: the drawings and the hands, as a band above the copy. */}
        <div className="relative h-[min(70vw,24rem)] lg:hidden">
          <img
            src={`${OWNER_TABLE}-960.webp`}
            srcSet={`${OWNER_TABLE}-960.webp 960w, ${OWNER_TABLE}-1717.webp 1717w`}
            sizes="100vw"
            width={1717}
            height={645}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[64%_50%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-jp-background/70" />
        </div>

        <div className="relative">
          {/* The photograph, anchored left so the walnut sits behind the copy: from `lg` the whole composition; below `lg` its plain left, as a walnut ground for the copy. */}
          <img
            src={`${OWNER_TABLE}-1717.webp`}
            srcSet={`${OWNER_TABLE}-960.webp 960w, ${OWNER_TABLE}-1717.webp 1717w`}
            sizes="100vw"
            width={1717}
            height={645}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 size-full object-cover object-left"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden" style={{ backgroundColor: ownerScrim(62) }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden lg:block" style={BW_COPY_SCRIM} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" style={BW_FOOT_FADE} />

          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:flex lg:min-h-[min(44rem,calc(100vw*645/1717*1.05))] lg:items-center lg:px-10 lg:py-[clamp(3.5rem,5vw,5rem)]">
            <div className="lg:w-[min(34rem,40vw)]">
              {/* Authored in sentence case, uppercased in CSS. Amber on the dark wood. */}
              <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
                A better way to build
                <span aria-hidden="true" className="block h-0.5 w-16 shrink-0 bg-jp-brand-amber/80 sm:w-24" />
              </p>

              {/* Sentence case (§7.7). */}
              <h2
                id="owner-better-way"
                className="mt-5 font-heading text-[min(2.375rem,9.6vw)] font-extrabold leading-[1.08] tracking-[-0.025em] text-balance text-jp-text-primary sm:text-[2.875rem] lg:text-[clamp(2.25rem,3.2vw,3.25rem)]"
              >
                Imagine a contractor who knows what&apos;s coming before you have to ask.
              </h2>

              <div className="mt-6 space-y-3.5 text-[1.0625rem] leading-[1.55] text-pretty text-jp-text-primary/90 sm:text-[1.125rem] lg:text-[clamp(1rem,1.2vw,1.125rem)]">
                <p>A contractor who knows what decisions you&apos;ll need to make months before they&apos;re required.</p>
                <p>Who identifies missing information before it delays materials, equipment, or construction.</p>
                <p>
                  Who coordinates with your architect, engineers, consultants, and trade partners so everyone knows what&apos;s needed,
                  who&apos;s responsible, and when it needs to happen.
                </p>
                <p>A contractor who brings you options instead of emergencies.</p>
                <p>Who protects your ability to make thoughtful decisions rather than forcing you to accept costly compromises.</p>
              </div>

              <div className="mt-7 rounded-2xl px-6 py-4 sm:px-7 sm:py-5" style={amberWash(12)}>
                <p className="font-heading text-[1.1875rem] font-bold leading-[1.35] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.3125rem]">
                  A contractor who treats your investment with the same care and attention you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The benefits. */}
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-8 sm:pt-12 lg:px-10">
        <ul className="grid gap-y-8 md:grid-cols-3 md:gap-y-0">
          {BENEFITS.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className={`flex items-start gap-5 md:px-6 lg:gap-6 lg:px-[clamp(1.5rem,3vw,3.5rem)] ${
                i > 0 ? 'border-t border-jp-brand-amber/30 pt-8 md:border-t-0 md:border-l md:pt-0' : 'md:pl-0'
              }`}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-10 shrink-0 text-jp-brand-amber lg:size-12" />
              <div className="min-w-0">
                <h3 className="font-heading text-[1.375rem] font-bold leading-[1.2] tracking-[-0.015em] text-jp-background lg:text-[1.625rem]">{title}</h3>
                <p className="mt-1.5 text-[1rem] leading-[1.5] text-pretty text-jp-ink-secondary lg:text-[1.0625rem]">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* The closing statement: the second sentence carries it. */}
        <div className="mt-10 rounded-2xl px-6 py-5 text-center sm:mt-12 sm:px-8" style={amberWash(14)}>
          <p className="text-[1.0625rem] leading-[1.5] text-balance text-jp-ink-secondary sm:text-[1.1875rem] lg:text-[1.25rem]">
            This isn&apos;t about expecting a project without challenges.{' '}
            <strong className="font-heading font-bold text-jp-background">It&apos;s about expecting a contractor who prepares for them.</strong>
          </p>
        </div>
      </div>
      <div className="h-14 sm:h-16 lg:h-20" />
    </section>
  );
}

/* --------------------------------------------- 4 built on shared success */

/*
 * Section 4 (Design System §69, Decision Log 2026-11-18), from the
 * founder-approved mockup and photograph in
 * docs/design/assets/owner-shared-success. The owner's interests and every
 * project partner's are aligned; JiTpro's solution comes next.
 *
 *   UPPER  an eight rowing on deep blue water, from above, the boat
 *          horizontal across the upper right (unaltered); the eyebrow, the
 *          h2, two paragraphs and an amber statement on the open water at left
 *   LOWER  four stakeholders (Owner, General Contractor, Design Team, Trade
 *          Partners), each an amber line icon, a white title and a line,
 *          divided by fine rules; then the amber banner
 *
 * The photograph is unaltered. From `lg` it sits at its own proportions at
 * the right (at most 1920px wide), centred on the upper copy so the boat
 * centres on it, keeping its size, never cropped. Beneath it, a water layer
 * tiled vertically from the photograph's own boat-free water covers the
 * section top to bottom; the photograph's edges fade into it, so the section
 * reads as one surface of water. A local overlay quiets only the wake's foam
 * where it passes behind the text; there is no column or band of shade. Below `lg` a crop holding the whole boat is a band at
 * the top, fading into the same water. The rowers are the metaphor: the team
 * moves because each one performs their part.
 */

const OWNER_ROWING = `${import.meta.env.BASE_URL}assets/roles/owner-rowing-eight`;

/** The section's deep navy, close to the photograph's water: a fallback beneath the water layer. */
const SS_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-surface) 55%, var(--jp-background))' };

/**
 * The water that covers the whole section, top to bottom: a tile of the photograph's own boat-free water (from below
 * the lowest oar splash), its top crossfaded from its bottom so it repeats vertically without a seam. It repeats
 * vertically only, drawn at the photograph's own scale (the section's width, never narrower than 900px), so its ripples
 * match the photograph's; the photograph's edge fades crossfade into it.
 */
const SS_WATER = {
  backgroundImage: `url(${import.meta.env.BASE_URL}assets/roles/owner-rowing-water-tile.webp)`,
  backgroundRepeat: 'repeat-y',
  backgroundSize: 'max(100%, 900px) auto',
  backgroundPosition: 'top center',
};

/**
 * From `lg`: the only bright thing behind the copy is the boat's wake (white foam crossing the photograph at about 22% to
 * 31% of its height, left of the stern). An overlay derived from the photograph's own wake region covers each foam
 * pixel with the water beneath it, in proportion to how much brighter than the water it is, so the foam reads faintly
 * and the text clears it; plain water is left untouched (zero opacity), so it has no edge or shape. It stops at the
 * stern (49.3% of the photograph's width) and sits in the photograph's own coordinates, so it moves with it. The
 * photograph itself is not altered.
 */
const OWNER_WAKE_QUIET = `${import.meta.env.BASE_URL}assets/roles/owner-rowing-wake-quiet.webp`;

/** Crossed tools (a wrench and a screwdriver), drawn in lucide's line style: lucide has no crossed-tools glyph. */
function CrossedTools({ className, strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="m2.5 5 2.5-2.5 4 4-2.5 2.5Z" />
      <path d="m9 9 11 11" />
      <path d="m18.5 21.5 3-3" />
    </svg>
  );
}

const STAKEHOLDERS: ReadonlyArray<{ title: string; text: string; Icon: LucideIcon | typeof CrossedTools }> = [
  { title: 'Owner', text: 'Greater confidence. Better visibility. Better protection of your investment.', Icon: Building2 },
  { title: 'General Contractor', text: 'Better control. Better execution. Better opportunity to deliver as promised.', Icon: HardHat },
  { title: 'Design Team', text: 'Earlier coordination. Fewer emergencies. Better support for the work.', Icon: DraftingCompass },
  { title: 'Trade Partners', text: 'Clearer direction. Better readiness. More productive performance.', Icon: CrossedTools },
];

function SharedSuccess() {
  return (
    <section aria-labelledby="owner-shared-success" className="relative isolate overflow-hidden" style={SS_GROUND}>
      {/* The water, top to bottom, beneath the photograph. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-30" style={SS_WATER} />

      {/* Below `lg`: the whole boat, as a band at the top. */}
      <img
        src={`${OWNER_ROWING}-crop-965.webp`}
        width={965}
        height={340}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="block h-auto w-full [mask-image:linear-gradient(180deg,black_78%,transparent)] lg:hidden"
      />

      {/* The upper area: the copy, and the photograph centred on it. */}
      <div className="relative">
          {/* From `lg`: the whole photograph at its own proportions, at the right (never scaled to cover, so the boat keeps its
              size and place across the photograph). It is centred on this upper area and raised by the boat's own centre (25.3%
              of the photograph's height), so the boat centres on the copy beside it (the half-padding added to 50% offsets
            the area's top padding, which sits above the copy). Its top edge (open water) fades in, its
              foot fades into the deep navy, and beyond 1920px its left edge fades in. */}
        <div aria-hidden="true" className="pointer-events-none absolute top-[calc(50%+clamp(1.75rem,2.25vw,2.25rem))] right-0 -z-20 hidden w-[min(100%,1920px)] -translate-y-[25.3%] lg:block">
          <img
            src={`${OWNER_ROWING}-1785.webp`}
            srcSet={`${OWNER_ROWING}-960.webp 960w, ${OWNER_ROWING}-1785.webp 1785w`}
            sizes="min(100vw, 1920px)"
            width={1785}
            height={881}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full [mask-image:linear-gradient(180deg,transparent_0%,black_6%,black_62%,transparent_100%)] min-[1921px]:[mask-image:linear-gradient(180deg,transparent_0%,black_6%,black_62%,transparent_100%),linear-gradient(90deg,transparent,black_14%)] min-[1921px]:[mask-composite:intersect]"
          />
          <img src={OWNER_WAKE_QUIET} width={880} height={170} alt="" loading="lazy" decoding="async" className="absolute top-[17.03%] left-0 h-auto w-[49.3%]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-8 lg:px-10 lg:pt-[clamp(3.5rem,4.5vw,4.5rem)]">
        <div className="lg:w-[min(36rem,37vw)]">
          {/* Authored in sentence case, uppercased in CSS. Amber on the dark water. */}
          <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
            <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16" />
            Build on shared success
          </p>

          {/* Sentence case (§7.7). */}
          <h2
            id="owner-shared-success"
            className="mt-5 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-jp-text-primary sm:text-[3rem] lg:text-[clamp(2.75rem,3.7vw,3.75rem)]"
          >
            What if your contractor&apos;s success was the key to protecting yours?
          </h2>

          <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.6] text-pretty text-jp-text-primary/90 sm:text-[1.125rem] lg:text-[clamp(1rem,1.2vw,1.125rem)]">
            <p>
              Building your project shouldn&apos;t be a contest between your interests and your contractor&apos;s. When your contractor can plan
              ahead, coordinate the work, and give every project partner what they need to succeed, your investment is better protected too.
            </p>
            <p>
              When decisions come late, materials aren&apos;t ready, and work is constantly disrupted, pressure builds for everyone. But when the
              project team has the information, time, and coordination to perform well, everyone has a better opportunity to fulfill their
              commitments.
            </p>
          </div>

          <p className="mt-6 font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.01em] text-balance text-jp-brand-amber sm:text-[1.375rem] lg:text-[clamp(1.25rem,1.6vw,1.5rem)]">
            When your team works together, you win.
          </p>
        </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-14 sm:px-8 sm:pb-16 lg:px-10 lg:pb-[clamp(3.5rem,4.5vw,4.5rem)]">
        <ul className="mt-12 grid gap-y-8 sm:mt-14 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:mt-[clamp(2.5rem,3.5vw,3.5rem)] lg:grid-cols-4 lg:gap-x-0">
          {STAKEHOLDERS.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className={`border-jp-text-primary/20 lg:px-[clamp(1.25rem,2.2vw,2.5rem)] ${i > 0 ? 'lg:border-l' : 'lg:pl-0'} ${
                i > 0 ? 'border-t pt-8 md:border-t-0 md:pt-0' : ''
              }`}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-10 text-jp-brand-amber lg:size-12" />
              <h3 className="mt-4 font-heading text-[1.375rem] font-bold leading-[1.2] tracking-[-0.015em] text-jp-text-primary lg:text-[clamp(1.375rem,1.75vw,1.75rem)]">
                {title}
              </h3>
              <p className="mt-2 text-[1rem] leading-[1.5] text-pretty text-jp-text-secondary lg:text-[clamp(1rem,1.2vw,1.125rem)]">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl bg-jp-brand-amber px-6 py-5 text-center sm:mt-14 sm:px-10 sm:py-6 lg:mt-[clamp(2.5rem,3.5vw,3.5rem)]">
          <p className="font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.015em] text-balance text-jp-background sm:text-[1.5rem] lg:text-[clamp(1.5rem,2.1vw,2.125rem)]">
            A better project is built when everyone has the opportunity to succeed.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- 5 the jitpro difference */

/*
 * Section 5 (Design System §70, Decision Log 2026-11-18), from the
 * founder-approved mockup and photograph in
 * docs/design/assets/owner-jitpro-difference. JiTpro is introduced as the
 * practical means to the preparation the page has argued for: in aviation the
 * flight begins long before takeoff.
 *
 * The photograph (two pilots, seen from behind, in a glass cockpit over
 * mountains at sunset) is unaltered. From `xl` it is placed as in the mockup:
 * at its own proportions, the section's full width (at most 1920px), shifted
 * right by 6.31% of its width, so its right edge runs off the section; the
 * section is exactly its height. A --jp-surface wash in the photograph's own
 * coordinates (measured from the mockup) holds 94% behind the copy and fades
 * out between 33.5% and 48% of its width, before the left pilot's shoulder,
 * with a faint shade at the foot; the copy column ends at 39.3% of the
 * photograph at every width. From `xl` the copy is placed as in the mockup
 * too: it starts 2.42% of the photograph's width left of the photograph and is
 * 41.76% of it wide, and every size is a fraction of that width,
 * min(100cqw, 1920px) (the section is a size container), so the composition
 * is the mockup at any width rather than the site's 80rem frame. Below `xl`, the photograph is a band above the
 * copy, cropped only of the cabin wall at its left, both pilots whole.
 */

const OWNER_COCKPIT = `${import.meta.env.BASE_URL}assets/roles/owner-cockpit-pilots`;

/** The navy of the copy side and its wash: --jp-surface, as in the mockup. */
const jdWash = (percent: number) => `color-mix(in oklab, var(--jp-surface) ${percent}%, transparent)`;

/** The wash, in the photograph's own coordinates (stops measured from the approved mockup), and the foot's shade. */
const JD_WASH = {
  backgroundImage: [
    `linear-gradient(90deg, ${jdWash(100)} 0%, ${jdWash(94)} 12%, ${jdWash(94)} 33.5%, ${jdWash(80)} 35.1%, ${jdWash(68)} 36.5%, ${jdWash(55)} 37.9%, ${jdWash(42)} 39.3%, ${jdWash(30)} 40.8%, ${jdWash(20)} 42.2%, ${jdWash(13)} 43.6%, ${jdWash(8)} 45%, ${jdWash(3)} 46.5%, transparent 48%)`,
    `radial-gradient(ellipse 16% 26% at 42% 100%, ${jdWash(32)} 0%, transparent 100%)`,
  ].join(', '),
};

function JiTproDifference() {
  return (
    <section aria-labelledby="owner-jitpro-difference" className="@container relative isolate overflow-hidden bg-jp-surface">
      {/* Below `xl`: the cockpit as a band above the copy, the cabin wall at its left cropped away; it fades into the navy. */}
      <div aria-hidden="true" className="relative xl:hidden">
        <img
          src={`${OWNER_COCKPIT}-1774.webp`}
          srcSet={`${OWNER_COCKPIT}-960.webp 960w, ${OWNER_COCKPIT}-1774.webp 1774w`}
          sizes="100vw"
          width={1774}
          height={887}
          alt=""
          loading="lazy"
          decoding="async"
          className="block aspect-[5/3] h-auto w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-jp-surface" />
      </div>

      {/* From `xl`: the photograph as placed in the mockup, with its wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -z-10 hidden w-[min(100cqw,1920px)] right-[calc(min(100cqw,1920px)*-0.0631)] xl:block">
        <img
          src={`${OWNER_COCKPIT}-1774.webp`}
          srcSet={`${OWNER_COCKPIT}-960.webp 960w, ${OWNER_COCKPIT}-1774.webp 1774w`}
          sizes="min(100vw, 1920px)"
          width={1774}
          height={887}
          alt=""
          loading="lazy"
          decoding="async"
          className="block size-full object-cover"
        />
        <div className="absolute inset-0" style={JD_WASH} />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 xl:mx-0 xl:min-h-[calc(min(100cqw,1920px)/2)] xl:max-w-none xl:pt-[calc(min(100cqw,1920px)*0.0443)] xl:pr-0 xl:pb-[calc(min(100cqw,1920px)*0.05)] xl:pl-[calc(100cqw-min(100cqw,1920px)*0.9611)]">
        <div className="max-w-[40rem] xl:w-[calc(min(100cqw,1920px)*0.4176)] xl:max-w-none">
          {/* Inter, authored in sentence case and uppercased in CSS, white over a short amber rule, as in the mockup (§70.2). */}
          <p className="text-[0.875rem] font-bold uppercase leading-[1.2] tracking-[0.14em] text-jp-text-primary sm:text-[1rem] xl:text-[calc(min(100cqw,1920px)*0.0135)] xl:tracking-[0.13em]">
            The JiTpro difference
          </p>
          <span aria-hidden="true" className="mt-4 block h-1 w-20 rounded-full bg-jp-brand-amber sm:w-24 xl:mt-[calc(min(100cqw,1920px)*0.0127)] xl:w-[calc(min(100cqw,1920px)*0.059)]" />

          {/* One h2; from `xl` its three lines break as in the mockup. The last line is amber. Sentence case (§7.7). */}
          <h2
            id="owner-jitpro-difference"
            className="mt-8 font-heading text-[min(2.375rem,9.6vw)] font-bold leading-[1.1] tracking-[-0.02em] text-balance text-jp-text-primary sm:mt-10 sm:text-[2.875rem] lg:text-[3.25rem] xl:mt-[calc(min(100cqw,1920px)*0.029)] xl:text-[calc(min(100cqw,1920px)*0.0396)] xl:leading-[1.016] xl:tracking-[0.005em]"
          >
            <span className="xl:block">A better way to build</span> <span className="xl:block">starts with a</span>{' '}
            <span className="block text-jp-brand-amber">better way to prepare.</span>
          </h2>

          {/* The aviation statement, behind an amber bar. */}
          <div className="relative mt-8 pl-6 sm:mt-10 sm:pl-8 xl:mt-[calc(min(100cqw,1920px)*0.0237)] xl:pl-[calc(min(100cqw,1920px)*0.0203)] xl:max-w-[calc(min(100cqw,1920px)*0.375)]">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p
              className="font-heading text-[1.1875rem] font-semibold leading-[1.43] tracking-[-0.01em] text-pretty text-jp-text-primary sm:text-[1.375rem] xl:text-[calc(min(100cqw,1920px)*0.0168)] xl:leading-[1.3]"
            >
              <span className="block">A successful flight begins with a plan to reach your destination safely.</span>{' '}
              <span className="mt-[0.6em] block">
                A successful construction project should begin with a plan to ensure everything needed to build it is ready when it&apos;s
                needed.
              </span>
            </p>
          </div>

          <p
            className="mt-8 text-[1.0625rem] leading-[1.55] text-pretty text-jp-text-primary/90 sm:mt-10 sm:text-[1.125rem] xl:mt-[calc(min(100cqw,1920px)*0.0235)] xl:text-[calc(min(100cqw,1920px)*0.0127)] xl:max-w-[calc(min(100cqw,1920px)*0.38)] xl:leading-[1.38]"
          >
            JiTpro gives your contractor the time, visibility, and control to identify what&apos;s needed, resolve open items, and
            coordinate the commitments that keep construction on track.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- 6 raise your expectations */

/*
 * Section 6 (Design System §71, Decision Log 2026-11-18), from the
 * founder-approved mockup in docs/design/assets/owner-raise-expectations. The
 * owner learns to expect demonstrable evidence of control, not assurances
 * alone; the closing line ties that expectation to JiTpro.
 *
 *   LEFT   the eyebrow, the h2, the introduction, the explanation and the
 *          highlighted statement in a light amber panel behind an amber bar
 *   RIGHT  behind a hairline: four questions, each a white card with an amber
 *          line icon, a fine divider and the question
 *   FOOT   the closing statement between two fine amber rules
 *
 * A warm ivory ground (--jp-brand-amber at 3.5% on --jp-surface-white). The
 * mockup's serif and its burnt-orange words are set in the site's faces and
 * in ink (§8.8): amber on this ground is decorative only (rules, the bar, the
 * icons, the panel's wash). No motion.
 */

/** The warm ivory ground. */
const RE_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 3.5%, var(--jp-surface-white))' };

const QUESTIONS: ReadonlyArray<{ text: string; Icon: LucideIcon }> = [
  { text: 'Can your contractor show you what decisions are coming next?', Icon: CalendarDays },
  { text: 'Can your contractor show you what is still unresolved and who owns it?', Icon: Users },
  { text: 'Can your contractor show you what products, materials, and services must be ready and when?', Icon: Layers },
  { text: 'Can your contractor show you how risks are being addressed before they become emergencies?', Icon: ShieldCheck },
];

function RaiseYourExpectations() {
  return (
    <section aria-labelledby="owner-raise-expectations" style={RE_GROUND}>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 sm:px-8 sm:pt-20 sm:pb-16 lg:px-10 lg:pt-[clamp(4.5rem,5.5vw,6rem)] lg:pb-[clamp(3.5rem,4.5vw,5rem)]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.2fr)_1px_minmax(0,1fr)] lg:gap-x-[clamp(2rem,3.4vw,3.25rem)]">
          <div>
            {/* Authored in sentence case, uppercased in CSS; slate on the light ground (§8.8), the rule amber. */}
            <p className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]">
              <span aria-hidden="true" className="block h-[3px] w-12 shrink-0 bg-jp-brand-amber sm:w-16" />
              Raise your expectations
            </p>

            {/* Sentence case (§7.7); two sentences, each its own line where it fits. */}
            <h2
              id="owner-raise-expectations"
              className="mt-5 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-background sm:text-[3.25rem] lg:text-[clamp(2.375rem,3.55vw,3.375rem)]"
            >
              <span className="sm:block">Don&apos;t settle for promises.</span> <span className="sm:block">Ask for proof.</span>
            </h2>

            <div className="mt-6 space-y-3.5 text-[1.0625rem] leading-[1.55] text-pretty text-jp-background/85 sm:text-[1.125rem] lg:mt-7 lg:text-[clamp(1rem,1.2vw,1.125rem)] lg:leading-[1.5]">
              <p>
                You&apos;ve entrusted your contractor with an enormous responsibility: delivering your project as promised while
                protecting your investment, your vision, and your time.
              </p>
              <p>Experience matters. Reputation matters. Trust matters.</p>
              <p>But confidence shouldn&apos;t depend on assurances alone.</p>
              <p>
                Your contractor should be able to show you that the work ahead has been carefully considered. That critical decisions
                have been identified before they become urgent. That products, materials, and services are being planned around when
                construction actually needs them. That responsibilities are clear, commitments are tracked, and potential problems
                are being addressed while options still exist.
              </p>
            </div>

            {/* The highlighted statement: ink on a light amber wash, behind an amber bar. */}
            <div className="relative mt-8 rounded-2xl py-5 pr-6 pl-10 sm:py-6 sm:pr-8 sm:pl-12 lg:mt-8" style={amberWash(10)}>
              <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-1.5 rounded-full bg-jp-brand-amber sm:top-6 sm:bottom-6 sm:left-6" />
              <p className="font-heading text-[1.25rem] font-bold leading-[1.35] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.4375rem] lg:text-[clamp(1.25rem,1.55vw,1.4375rem)]">
                You deserve more than hearing that everything is under control. You deserve to see how your contractor is keeping it
                under control.
              </p>
            </div>
          </div>

          {/* The hairline between the columns. */}
          <span aria-hidden="true" className="hidden bg-jp-ink-secondary/20 lg:block" />

          <div className="mt-14 lg:mt-[clamp(2.25rem,3vw,2.75rem)] lg:flex lg:flex-col">
            {/* A heading for the list: the four questions are its items. */}
            <h3 id="owner-four-questions" className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-ink-secondary sm:text-sm sm:tracking-[0.18em]">
              Four questions worth asking
            </h3>
            <ul aria-labelledby="owner-four-questions" className="mt-6 space-y-4 sm:space-y-5 lg:mt-7 lg:flex lg:flex-1 lg:flex-col lg:gap-y-[clamp(1rem,1.6vw,1.5rem)] lg:space-y-0 lg:pb-[clamp(1rem,2.5vw,2.5rem)]">
              {QUESTIONS.map(({ text, Icon }) => (
                <li
                  key={text}
                  className={`grid grid-cols-[2.5rem_1px_minmax(0,1fr)] items-center gap-x-4 rounded-2xl lg:flex-1 border border-jp-ink-secondary/15 bg-jp-surface-white py-5 pr-5 pl-4 sm:grid-cols-[4.5rem_1px_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[5rem_1px_minmax(0,1fr)] sm:py-6 sm:pr-7 sm:pl-5 ${CARD_SHADOW}`}
                >
                  <Icon aria-hidden="true" strokeWidth={1.5} className="mx-auto size-8 text-jp-brand-amber sm:size-10 lg:size-12" />
                  <span aria-hidden="true" className="h-full min-h-10 bg-jp-ink-secondary/20" />
                  <p className="font-heading text-[1.0625rem] font-bold leading-[1.35] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.1875rem] lg:text-[clamp(1.0625rem,1.3vw,1.1875rem)]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The closing statement, between fine amber rules where there is room. */}
        <div className="mt-12 flex items-center gap-6 sm:mt-14 lg:mt-[clamp(3rem,4vw,4rem)] lg:gap-8">
          <span aria-hidden="true" className="hidden h-px min-w-12 flex-1 bg-jp-brand-amber/45 md:block" />
          <p className="min-w-0 text-center font-heading text-[1.1875rem] font-medium leading-[1.4] text-balance text-jp-background sm:text-[1.25rem] lg:text-[clamp(1.125rem,1.4vw,1.3125rem)]">
            And that&apos;s exactly the kind of accountability JiTpro helps your contractor establish.
          </p>
          <span aria-hidden="true" className="hidden h-px min-w-12 flex-1 bg-jp-brand-amber/45 md:block" />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- 7 time to break the cycle */

/*
 * Section 7, the close (Design System §72, Decision Log 2026-11-18). After the
 * problem, the expectation, shared success, JiTpro's approach and the
 * questions worth asking, it asks the owner to act: bring JiTpro to the
 * project. No image, no cards, no icons; one column, centred, on
 * --jp-background.
 *
 *   the amber eyebrow; the white h2; the supporting copy; the highlighted
 *   statement in amber; the supporting paragraph; the closing statement; the
 *   primary action (the hero's, to /contact); a hairline and the amber
 *   sign-off, ONE PROJECT AT A TIME.
 */

function TimeToBreakTheCycle() {
  return (
    <section aria-labelledby="owner-final-cta" className="bg-jp-background">
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center sm:px-8 sm:pt-24 lg:pt-[clamp(6rem,8vw,8rem)] lg:pb-14">
        {/* Authored in sentence case, uppercased in CSS. Amber on the navy, between short rules. */}
        <p className="flex items-center justify-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
          <span aria-hidden="true" className="hidden h-0.5 w-12 shrink-0 bg-jp-brand-amber/80 sm:block" />
          It&apos;s time to break the cycle
          <span aria-hidden="true" className="hidden h-0.5 w-12 shrink-0 bg-jp-brand-amber/80 sm:block" />
        </p>

        {/* Sentence case (§7.7). */}
        <h2
          id="owner-final-cta"
          className="mt-6 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-text-primary sm:text-[3.25rem] lg:text-[clamp(3rem,4.4vw,4rem)]"
        >
          Your project deserves more than promises.
        </h2>

        <div className="mx-auto mt-8 max-w-[40rem] space-y-4 text-[1.0625rem] leading-[1.6] text-balance text-jp-text-secondary sm:text-[1.1875rem]">
          <p>You&apos;ve invested too much in your project to leave its success to chance.</p>
          <p>
            You deserve a general contractor who plans ahead, identifies risks early, and demonstrates that the decisions, materials,
            and commitments required to build your project are under control.
          </p>
        </div>

        <p className="mt-8 font-heading text-[1.5rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-brand-amber sm:text-[1.875rem]">
          JiTpro helps your contractor do exactly that.
        </p>

        <p className="mx-auto mt-8 max-w-[40rem] text-[1.0625rem] leading-[1.6] text-balance text-jp-text-secondary sm:text-[1.1875rem]">
          Whether you&apos;re selecting a general contractor or already have one, there&apos;s a better way to prepare, coordinate,
          and build.
        </p>

        <p className="mt-6 font-heading text-[1.1875rem] font-semibold leading-[1.4] text-balance text-jp-text-primary sm:text-[1.375rem]">
          Ask your contractor to put JiTpro to work on your project.
        </p>

        {/* The primary action: the hero's button (§66), to the contact page. */}
        <div className="mt-9 sm:mt-10">
          <Link
            to="/contact"
            className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-8 sm:text-base"
          >
            Bring JiTpro to My Project
            <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
          </Link>
        </div>

        {/* The sign-off, under a hairline. */}
        <div aria-hidden="true" className="mx-auto mt-14 h-px max-w-xs bg-jp-text-primary/15 sm:mt-16" />
        <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.24em] text-jp-brand-amber sm:text-sm">One project at a time.</p>
      </div>
    </section>
  );
}

export default function OwnersDevelopers() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />

      <WhereProblemsBegin />

      <BetterWayToBuild />

      <SharedSuccess />
      <JiTproDifference />
      <RaiseYourExpectations />
      <TimeToBreakTheCycle />
    </div>
  );
}
