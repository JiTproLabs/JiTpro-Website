import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Layers, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import ArchitectScheduleDemo from '../../components/roles/ArchitectScheduleDemo';

/* ------------------------------------------------------------ hero */

/*
 * The hero (Design System §61, Decision Log 2026-11-17), from the
 * founder-approved mockup in docs/design/assets/architect-hero.
 *
 *   LEFT   amber eyebrow and its underline, the title-case h1, the opening
 *          paragraphs, the statement behind an amber accent bar, the
 *          closing paragraph, the two actions
 *   RIGHT  the photograph: plans, rolled drawings, a pen, the window light
 *
 * ONE IMAGE ELEMENT, TWO FRAMES (as the contractor hero, §55.3). Below `lg`
 * it fills a full-bleed band above the copy, framed on the drawings and the
 * pen. From `lg` it is a box at the photograph's own aspect ratio, anchored
 * right and centred vertically, at least 1100 px and at most 2000 px wide,
 * its top and bottom edges masked into the section.
 *
 * SCRIMS derive from --jp-background only (§61.2): from `lg`, one fade from
 * the left behind the copy, gone before the rolled drawings; from 2000 px a
 * fade at the box's left edge; below `lg`, the band's fade into the copy.
 */

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/roles/architect-hero-blueprints`;

/** --jp-background at a given strength over the photograph. */
const scrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;

/** From `lg`: behind the copy, clear before the rolled drawings and the window; deeper at the
 *  lower left, where the plans' lit edge would otherwise sit behind the closing paragraph. */
const COPY_SCRIM = {
  backgroundImage: [
    `radial-gradient(ellipse 64% 50% at 22% 100%, ${scrim(90)} 0%, ${scrim(65)} 55%, transparent 100%)`,
    `linear-gradient(90deg, var(--jp-background) 0%, ${scrim(90)} 32%, ${scrim(70)} 44%, ${scrim(30)} 53%, transparent 62%)`,
  ].join(', '),
};

/** From 2000 px, where the box no longer reaches the section's left edge. */
const BOX_LEFT_FADE = {
  backgroundImage: 'linear-gradient(90deg, var(--jp-background) 0%, transparent 100%)',
};

/** Below `lg`: the band fades in under the navigation and out into the copy. */
const BAND_SCRIM = {
  backgroundImage: `linear-gradient(180deg, ${scrim(35)} 0%, transparent 18%, transparent 55%, ${scrim(80)} 82%, var(--jp-background) 100%)`,
};

const ACTION = 'inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl px-4 py-4 text-center text-[0.9375rem] font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-7 sm:text-base lg:px-[clamp(1.75rem,2.1vw,2.25rem)] lg:py-[clamp(1rem,1.05vw,1.125rem)] lg:text-[clamp(1rem,1.25vw,1.3125rem)]';

function Hero() {
  return (
    <section aria-labelledby="ae-hero" className="relative isolate overflow-hidden bg-jp-background">
      {/* The photograph. Below `lg` the band at the top of the section; from
          `lg` the box placed against the section, behind the copy. */}
      <div className="relative h-[min(72vw,26rem,40svh)] lg:static lg:h-auto">
        <div className="absolute inset-0 -z-20 lg:inset-auto lg:top-1/2 lg:right-0 lg:aspect-[1672/941] lg:w-[max(100%,1100px)] lg:max-w-[2000px] lg:-translate-y-1/2 lg:[mask-image:linear-gradient(180deg,transparent_0%,black_10%,black_90%,transparent_100%)]">
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
            className="block h-full w-full object-cover object-[80%_68%] lg:object-center"
          />
          {/* Wider than the box (from 2000 px): its left edge hands off to --jp-background. */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[14%] min-[2000px]:block" style={BOX_LEFT_FADE} />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden" style={BAND_SCRIM} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" style={COPY_SCRIM} />

      <div className="mx-auto max-w-[1672px] px-6 sm:px-8 lg:flex lg:min-h-[min(48rem,calc(100svh-5rem))] lg:items-center lg:px-[min(5.25vw,88px)]">
        <div className="relative -mt-16 pb-16 sm:-mt-20 sm:pb-20 lg:mt-0 lg:w-[min(46vw,48rem)] lg:py-16">
          {/* Authored in sentence case, uppercased in CSS (§61.2). */}
          <p className="inline-block border-b border-jp-brand-amber pb-1 text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-jp-brand-amber sm:text-[1rem] lg:text-[clamp(1rem,1.25vw,1.3125rem)]">
            For architects &amp; engineers
          </p>

          {/* Title case, as approved (§61.2). */}
          <h1
            id="ae-hero"
            className="mt-6 font-heading text-[min(2.75rem,11vw)] font-bold leading-[1.02] tracking-[-0.01em] text-jp-text-primary sm:mt-7 sm:text-[3rem] lg:mt-[clamp(1.25rem,1.8vw,1.875rem)] lg:text-[clamp(2.75rem,4.3vw,4.5rem)]"
          >
            <span className="sm:block">Great Design Deserves</span> <span className="sm:block">Better Execution.</span>
          </h1>

          <div className="mt-7 space-y-4 text-[1.125rem] text-pretty *:leading-[1.32] text-jp-text-primary sm:mt-8 sm:text-[1.25rem] lg:mt-[clamp(1.5rem,2.3vw,2.5rem)] lg:space-y-[clamp(0.75rem,1.1vw,1.25rem)] lg:text-[clamp(1.0625rem,1.45vw,1.5rem)]">
            <p>You spend years developing a vision, coordinating the details, and earning your client&apos;s trust.</p>
            <p>
              Then construction begins. The RFIs pile up. Submittals arrive late. Every decision becomes urgent. And your team is pulled
              into a cycle of problems that could have been anticipated.
            </p>
          </div>

          <div className="relative mt-8 pl-6 sm:mt-9 sm:pl-8 lg:mt-[clamp(1.5rem,2.1vw,2.25rem)] lg:pl-[clamp(1.5rem,2.2vw,2.25rem)]">
            <span aria-hidden="true" className="absolute inset-y-0.5 left-0 w-1.5 bg-jp-brand-amber" />
            <p className="font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.01em] text-jp-text-primary sm:text-[1.75rem] lg:text-[clamp(1.5rem,2.05vw,2.125rem)]">
              <span className="block">Your job is to protect the design.</span>{' '}
              <span className="block">Not compensate for a lack of clarity.</span>
            </p>
          </div>

          <p className="mt-8 text-[1.125rem] leading-[1.32] text-pretty text-jp-text-secondary sm:mt-9 sm:text-[1.25rem] lg:mt-[clamp(1.5rem,2.3vw,2.5rem)] lg:text-[clamp(1.0625rem,1.45vw,1.5rem)]">
            JiTpro helps general contractors give owners and design teams clear, advance notice of the information, decisions, and
            approvals they&apos;ll need to provide, and when. So your team can plan ahead, manage its workload, and focus on great design
            instead of constant emergencies.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:mt-11 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4 lg:mt-[clamp(2rem,2.6vw,2.75rem)]">
            <Link
              to="/contact"
              className={`${ACTION} border border-transparent bg-jp-brand-amber text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] hover:bg-jp-brand-amber-active`}
            >
              <span className="[text-wrap:balance]">A Better Way to Build Together</span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </Link>
            <Link
              to="/learn-more"
              className={`${ACTION} border border-jp-text-primary/70 text-jp-text-primary hover:border-jp-brand-amber-active hover:text-jp-brand-amber-active`}
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- 1 the cost of poor planning */

/*
 * Section 1 (Design System §62, Decision Log 2026-11-17), from the
 * founder-approved mockup and clean artwork in
 * docs/design/assets/architect-cost-of-planning.
 *
 *   LEFT   eyebrow over an amber underline, the title-case h2, three short
 *          paragraphs
 *   DIVIDER a vertical hairline from `lg`
 *   RIGHT  the timeline, Planned Work to Urgent Request; the three callouts,
 *          one list of tinted panels, each a two-tone icon, a separator and
 *          its title and sentence
 *   BANNER full width, navy, the blueprint detail at its right: an amber bar,
 *          the first sentence in white, the second in amber
 *
 * IMAGERY. Only decoration is raster, extracted from the clean artwork: the
 * faint blueprint linework of the ground (its panels, icons and rules painted
 * out, the ground divided out so it multiplies onto the section) and the
 * banner's linework (recoloured onto --jp-surface). Every meaningful element
 * is HTML or inline SVG. All imagery and icons are aria-hidden.
 *
 * AMBER (§62.2): on the light ground decorative only (the eyebrow underline,
 * the timeline's burst, the icons' accents), never text; on the banner, the
 * bar and the second sentence (amber on navy meets contrast, §8.8).
 */

const COST_ASSETS = `${import.meta.env.BASE_URL}assets/roles/architect-cost`;

/** The mockup's off-white: --jp-surface-white softened toward --jp-surface-light. */
const COST_GROUND = { backgroundColor: 'color-mix(in oklab, var(--jp-surface-white) 60%, var(--jp-surface-light))' };

const PLANNING_PARAGRAPHS = [
  'You plan your workload. You coordinate your consultants. You make commitments to your clients.',
  'Then an urgent RFI arrives. A submittal needs approval yesterday. An unresolved detail is holding up the field.',
  "Suddenly, your team's carefully planned work takes a back seat to someone else's emergency.",
];

/* Two-tone line icons, recreated from the approved artwork: navy structure,
   amber accent. 32-unit grid, drawn at the icon zone's size. */
const NAVY_LINE = 'stroke-jp-background';
const AMBER_LINE = 'stroke-jp-brand-amber';

function StopwatchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full">
      <g className={AMBER_LINE}>
        <path d="M2.5 13.5h5M1.5 17h6M3 20.5h4.5M5 24h3" />
        <path d="M20 19l3.5-4.5" />
      </g>
      <g className={NAVY_LINE}>
        <circle cx="20" cy="19" r="9" />
        <path d="M20 7.5V10M17 6.5h6M27 10.5l1.5-1.5" />
      </g>
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full">
      <path className={AMBER_LINE} d="M16 4.5L28 10.5 16 16.5 4 10.5Z" />
      <path className={NAVY_LINE} d="M4 16l12 6 12-6M4 21.5l12 6 12-6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`size-full ${AMBER_LINE}`}>
      <path d="M14.3 5.4a2 2 0 013.4 0l11 19.1a2 2 0 01-1.7 3H5a2 2 0 01-1.7-3Z" />
      <path d="M16 12.5v7M16 23.5v.01" />
    </svg>
  );
}

/** The urgent request: an amber circle, bursting. */
function BurstIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" strokeWidth={2.5} strokeLinecap="round" className={`size-full ${AMBER_LINE}`}>
      <circle cx="17" cy="23" r="8" />
      <path d="M19 9.5l.5-6M25.5 12.5l4-5M28.5 18.5l6-2.5M29 24.5l5 .5M7 23H4.5M10.5 31.5l-2 2M23.5 31.5l2 2" />
    </svg>
  );
}

const PLANNING_CALLOUTS = [
  { title: 'Unplanned urgency', text: 'Requests arrive with no advance notice.', Icon: StopwatchIcon },
  { title: 'Disrupted workload', text: 'Your planned work is pushed aside.', Icon: LayersIcon },
  { title: 'Strained relationships', text: 'Tension builds when planning breaks down.', Icon: WarningIcon },
] as const;

/** A timeline node with its label centred beneath it. */
function TimelineNode({ children, label, strong = false }: { children: ReactNode; label?: string; strong?: boolean }) {
  return (
    <div className="relative flex shrink-0 items-center justify-center">
      {children}
      {label ? (
        <span
          className={`absolute top-1/2 mt-6 whitespace-nowrap text-[0.9375rem] text-jp-background sm:text-[1rem] lg:mt-[clamp(1.75rem,2.2vw,2.5rem)] lg:text-[clamp(0.9375rem,1.15vw,1.2rem)] ${
            strong ? 'font-semibold' : 'font-medium'
          }`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

const TIMELINE_LINE = <span aria-hidden="true" className="h-0.5 flex-1 bg-jp-ink-secondary/35" />;

function PlanningTimeline() {
  return (
    <div role="img" aria-label="A timeline running from planned work to an urgent request" className="pb-14 sm:pb-16 lg:pb-[clamp(4rem,4.6vw,5rem)]">
      <div className="mx-auto flex max-w-[34rem] items-center gap-1.5 px-[3.25rem] sm:px-[3.75rem] lg:max-w-none lg:px-[12%]">
        <TimelineNode label="Planned Work">
          <span className="block size-7 rounded-full border-[3px] border-jp-ink-secondary lg:size-[clamp(1.75rem,2.1vw,2.25rem)]" />
        </TimelineNode>
        {TIMELINE_LINE}
        <TimelineNode>
          <span className="block size-4 rounded-full border-2 border-jp-ink-secondary/55 lg:size-[clamp(1rem,1.2vw,1.25rem)]" />
        </TimelineNode>
        {TIMELINE_LINE}
        <TimelineNode>
          <span className="block size-4 rounded-full border-2 border-jp-ink-secondary/55 lg:size-[clamp(1rem,1.2vw,1.25rem)]" />
        </TimelineNode>
        {TIMELINE_LINE}
        <TimelineNode label="Urgent Request" strong>
          <span className="-mt-3 block size-12 lg:size-[clamp(3rem,4.2vw,4.4rem)]">
            <BurstIcon />
          </span>
        </TimelineNode>
      </div>
    </div>
  );
}

function CostOfPoorPlanning() {
  return (
    <section aria-labelledby="ae-cost" className="relative isolate overflow-hidden" style={COST_GROUND}>
      {/* The ground's faint blueprint linework, multiplied onto the off-white. */}
      <img
        src={`${COST_ASSETS}-linework-1754.webp`}
        srcSet={`${COST_ASSETS}-linework-960.webp 960w, ${COST_ASSETS}-linework-1754.webp 1754w`}
        sizes="100vw"
        width={1754}
        height={896}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-top mix-blend-multiply"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:px-[min(5.25vw,88px)] lg:pt-[clamp(4rem,4.6vw,5rem)] lg:pb-[clamp(3rem,3.4vw,3.75rem)]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.04fr)_1px_minmax(0,0.96fr)] lg:gap-x-[clamp(2.5rem,3.4vw,3.75rem)]">
          <div>
            {/* Authored in sentence case, uppercased in CSS; navy on light, the underline amber (§62.2). */}
            <p className="inline-block border-b-[3px] border-jp-brand-amber pb-2.5 text-[0.875rem] font-bold uppercase tracking-[0.02em] text-jp-background sm:text-[1rem] lg:pb-[clamp(0.625rem,0.8vw,0.875rem)] lg:text-[clamp(1rem,1.25vw,1.3rem)]">
              The cost of starting without clarity
            </p>

            {/* Title case, as approved (§62.2). */}
            <h2
              id="ae-cost"
              className="mt-8 font-heading text-[min(2.375rem,10vw)] font-bold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:mt-9 sm:text-[2.75rem] lg:mt-[clamp(2rem,2.5vw,2.75rem)] lg:text-[clamp(2.25rem,3.05vw,3.2rem)]"
            >
              Your Time Shouldn&apos;t Be the Contractor&apos;s Contingency Plan.
            </h2>

            <div className="mt-7 space-y-5 sm:mt-8 lg:mt-[clamp(1.75rem,2.4vw,2.625rem)] lg:space-y-[clamp(1rem,1.5vw,1.625rem)]">
              {PLANNING_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[31em] text-[1.0625rem] leading-[1.45] text-pretty text-jp-background/90 sm:text-[1.1875rem] lg:text-[clamp(1.0625rem,1.45vw,1.5rem)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <span aria-hidden="true" className="hidden bg-jp-ink-secondary/25 lg:block" />

          <div className="mt-14 sm:mt-16 lg:mt-[clamp(-0.5rem,-0.6vw,0rem)]">
            <PlanningTimeline />

            <ul className="space-y-4 lg:space-y-[clamp(1rem,1.2vw,1.375rem)]">
              {PLANNING_CALLOUTS.map(({ title, text, Icon }) => (
                <li
                  key={title}
                  className="flex items-center rounded-2xl bg-jp-ink-secondary/[0.07] shadow-[0_10px_24px_-16px_color-mix(in_oklab,var(--jp-background)_35%,transparent)]"
                >
                  <div className="flex w-[4.75rem] shrink-0 items-center justify-center self-stretch py-5 sm:w-28 lg:w-[clamp(6.5rem,8.6vw,9rem)] lg:py-[clamp(1.25rem,1.9vw,2rem)]">
                    <span className="block size-9 sm:size-11 lg:size-[clamp(2.75rem,3.6vw,3.75rem)]">
                      <Icon />
                    </span>
                  </div>
                  <span aria-hidden="true" className="h-12 w-px shrink-0 bg-jp-ink-secondary/35 lg:h-[clamp(3rem,3.6vw,4rem)]" />
                  <div className="min-w-0 py-5 pr-5 pl-5 sm:pl-7 lg:py-[clamp(1.25rem,1.9vw,2rem)] lg:pr-[clamp(1.25rem,1.8vw,2rem)] lg:pl-[clamp(1.5rem,2.2vw,2.5rem)]">
                    <h3 className="font-heading text-[1.1875rem] font-bold leading-snug tracking-[-0.015em] text-jp-background sm:text-[1.375rem] lg:text-[clamp(1.3125rem,1.75vw,1.8rem)]">
                      {title}
                    </h3>
                    <p className="mt-1 text-[0.9375rem] leading-[1.4] text-jp-background/80 sm:text-[1.0625rem] lg:text-[clamp(1rem,1.25vw,1.3rem)]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The banner: the section's conclusion and the turn to what follows. */}
        <div className="relative isolate mt-14 overflow-hidden rounded-2xl bg-jp-surface sm:mt-16 lg:-mx-[min(2.3vw,40px)] lg:mt-[clamp(3.5rem,4.2vw,4.5rem)]">
          <img
            src={`${COST_ASSETS}-banner-940.webp`}
            width={940}
            height={168}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-[min(100%,58rem)] object-cover object-right opacity-50 [mask-image:linear-gradient(90deg,transparent_0%,black_30%)] sm:opacity-100"
          />
          <div className="flex gap-5 px-6 py-8 sm:gap-7 sm:px-10 sm:py-10 lg:gap-[clamp(1.75rem,2.1vw,2.25rem)] lg:px-[clamp(2.5rem,3.4vw,3.5rem)] lg:py-[clamp(2rem,2.3vw,2.5rem)]">
            <span aria-hidden="true" className="block w-1.5 shrink-0 rounded-full bg-jp-brand-amber lg:w-2" />
            <p className="font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance sm:text-[1.875rem] lg:text-[clamp(1.875rem,2.3vw,2.4rem)]">
              <span className="block text-jp-text-primary">The problem isn&apos;t the work being requested.</span>{' '}
              <span className="block text-jp-brand-amber">It&apos;s the lack of early visibility that turns predictable needs into urgent demands.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 2 the solution */

/*
 * Section 2 (Design System §64, Decision Log 2026-11-17), from the
 * founder-approved mockup and clean artwork in
 * docs/design/assets/architect-solution.
 *
 *   HEAD     amber eyebrow and rule, the title-case h2 ("and When?" in
 *            amber), the introduction; the illuminated building's linework
 *            at the section's upper right
 *   LEFT     the four benefits, each an amber line icon in a glowing frame
 *   RIGHT    the interactive procurement schedule (ArchitectScheduleDemo)
 *   CLOSE    the closing statement between two amber rules
 *
 * Two columns from `xl`; below it the benefits (two across from `md`) above
 * the schedule. The building is the one raster element, extracted from the
 * clean artwork with its ground subtracted and screen-blended, aria-hidden.
 */

const SOLUTION_BUILDING = `${import.meta.env.BASE_URL}assets/roles/architect-solution-building.webp`;

const SOLUTION_BENEFITS: ReadonlyArray<{ title: string; text: string; Icon: LucideIcon }> = [
  {
    title: "See What's Coming",
    text: "Know which reviews, decisions, and design requirements are ahead so you can plan your team's work.",
    Icon: CalendarDays,
  },
  { title: 'Know What Matters Now', text: 'Focus on the requirements that affect upcoming procurement and construction activities.', Icon: Layers },
  {
    title: 'Coordinate With Confidence',
    text: "Work from clear expectations about what's needed, who's responsible, and when it must be completed.",
    Icon: Users,
  },
  {
    title: 'Protect Your Time and Your Work',
    text: 'Reduce interruptions, preserve appropriate review time, and maintain a clear record of decisions and commitments.',
    Icon: ShieldCheck,
  },
];

/** An amber rule fading out toward its far end. */
const fadeRule = (direction: 'left' | 'right') => ({
  backgroundImage: `linear-gradient(to ${direction}, var(--jp-brand-amber), color-mix(in oklab, var(--jp-brand-amber) 0%, transparent))`,
});

function Solution() {
  return (
    <section aria-labelledby="ae-solution" className="relative isolate overflow-hidden bg-jp-surface">
      <img
        src={SOLUTION_BUILDING}
        width={810}
        height={292}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-0 right-0 -z-10 w-[min(100%,38rem)] opacity-45 mix-blend-screen sm:w-[min(75%,42rem)] sm:opacity-70 xl:w-[min(48.5vw,50.5rem)] xl:opacity-100"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-16 pb-14 sm:px-8 sm:pt-20 sm:pb-16 lg:px-[min(5.25vw,88px)] lg:pt-[clamp(3.5rem,4vw,4.5rem)] lg:pb-[clamp(3rem,3.6vw,4rem)]">
        {/* Authored in sentence case, uppercased in CSS. */}
        <p className="flex items-center gap-6 text-[0.9375rem] font-bold uppercase tracking-[0.08em] text-jp-brand-amber lg:text-[clamp(1rem,1.3vw,1.375rem)]">
          The solution
          <span aria-hidden="true" className="block h-0.5 w-40 sm:w-56 lg:w-[clamp(12rem,16.5vw,17rem)]" style={fadeRule('right')} />
        </p>

        {/* Title case, as approved (§64.2). */}
        <h2
          id="ae-solution"
          className="mt-5 font-heading text-[min(2.5rem,10vw)] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance text-jp-text-primary sm:text-[3rem] lg:mt-[clamp(1rem,1.4vw,1.5rem)] lg:text-[clamp(3rem,3.75vw,3.875rem)]"
        >
          <span className="lg:block">What If Everyone Knew</span> <span className="lg:block">What Was Needed, <span className="text-jp-brand-amber">and When?</span></span>
        </h2>

        <p className="mt-5 max-w-[42em] text-[1.0625rem] leading-[1.45] text-pretty text-jp-text-primary/90 sm:text-[1.25rem] lg:mt-[clamp(1rem,1.3vw,1.375rem)] lg:text-[clamp(1.125rem,1.4vw,1.4375rem)]">
          Give your design team clear, early visibility into the decisions, reviews, and deliverables required to keep procurement and
          construction on track.
        </p>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 sm:mt-14 xl:mt-[clamp(2.5rem,2.6vw,3rem)] xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] xl:gap-x-[clamp(2rem,2.4vw,2.75rem)] xl:gap-y-0">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2 md:gap-x-10 xl:grid-cols-1 xl:content-start xl:gap-y-[clamp(2.25rem,3.2vw,3.5rem)] xl:pt-6">
            {SOLUTION_BENEFITS.map(({ title, text, Icon }) => (
              <li key={title} className="flex items-start gap-5 xl:gap-[clamp(1.25rem,1.7vw,1.875rem)]">
                <span
                  aria-hidden="true"
                  className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-jp-brand-amber/85 bg-jp-background/40 shadow-[0_0_22px_-4px_color-mix(in_oklab,var(--jp-brand-amber)_45%,transparent)] xl:size-[clamp(4rem,4.8vw,5rem)]"
                >
                  <Icon strokeWidth={1.5} className="size-8 text-jp-brand-amber xl:size-[clamp(2rem,2.3vw,2.5rem)]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-[1.3125rem] font-bold leading-snug tracking-[-0.015em] text-jp-text-primary xl:text-[clamp(1.3125rem,1.45vw,1.5rem)]">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[1rem] leading-[1.45] text-pretty text-jp-text-secondary xl:text-[clamp(0.9375rem,1.05vw,1.0625rem)]">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ArchitectScheduleDemo />
        </div>

        {/* The close. */}
        <div className="mt-14 flex items-center justify-center gap-5 sm:mt-16 sm:gap-8 xl:mt-[clamp(3.5rem,4vw,4.5rem)]">
          <span aria-hidden="true" className="hidden h-0.5 w-20 shrink-0 sm:block lg:w-28" style={fadeRule('left')} />
          <p className="text-center font-heading text-[min(1.75rem,7.5vw)] font-bold leading-[1.2] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[2rem] lg:text-[clamp(2rem,2.4vw,2.5rem)]">
            Plan Your Work. Protect Your Time. Deliver Your Best.
          </p>
          <span aria-hidden="true" className="hidden h-0.5 w-20 shrink-0 sm:block lg:w-28" style={fadeRule('right')} />
        </div>
      </div>
    </section>
  );
}

export default function ArchitectsEngineers() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />

      <CostOfPoorPlanning />

      <Solution />

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-8 pb-4 border-b border-white/10">
            Practical benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Clear visibility into which reviews are schedule-critical',
              'Deadlines based on actual procurement timing, not arbitrary windows',
              'Documentation that protects your team when delays are disputed',
              'Early identification of missing owner decisions blocking your review',
              'Reduced back-and-forth caused by incomplete submittal packages',
              'Better coordination with the GC on procurement sequencing',
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 shrink-0" />
                <p className="text-lg text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Review what matters. Document what happened.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
JiTpro gives your team the context to prioritize reviews and the documentation to protect your position. You focus on design intent. JiTpro handles the procurement timing.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400"
          >
            Let's Talk Procurement
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
