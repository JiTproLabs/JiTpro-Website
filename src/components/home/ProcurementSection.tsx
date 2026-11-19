import type { CSSProperties } from 'react';
import {
  CalendarClock,
  CheckSquare,
  ClipboardCheck,
  DraftingCompass,
  Factory,
  FileCheck,
  FileStack,
  FileText,
  Gauge,
  Layers,
  ListChecks,
  Network,
  Package,
  PackageCheck,
  RefreshCw,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Section 1b — procurement is more than buying materials (Decision Log
 * 2026-11-06; recomposed 2026-11-13; a cinematic composition with a moving
 * ribbon, 2026-11-17; recomposed to the founder-approved mockup
 * docs/design/assets/homepage-procurement/
 * procurement-decisions-delivered-on-time-reference.png the same day,
 * issue #84).
 *
 * Between the core belief and Fewer surprises, on --jp-background. Fewer
 * surprises continues this composition directly beneath it (its amber-start
 * hairline is the seam), so this section carries little bottom padding.
 *
 * COMPOSITION, in reading order:
 *
 *   1  THE SCENE. From `lg`: the h2 large at the upper left, its short amber
 *      underline beneath; the construction office desk photograph (§48.8
 *      scoped exception) at the upper right, from about 43% across the content to the right edge, its
 *      left edge fading into the navy behind the headline's end, its foot
 *      running behind the ribbon. Below `lg`: the headline, then the
 *      photograph as a full-width band, the ribbon overlapping its foot.
 *      Overlays derive from --jp-background only and are local; the plans,
 *      shop drawings, markups and subcontract are not darkened.
 *   2  THE RIBBON, the centrepiece: the sixteen activities as large connected
 *      chevrons (dark translucent interior; a bright amber outline with a
 *      restrained static glow; an amber icon and a white label) travelling
 *      left to right, the way they point, in a continuous loop, unnumbered (they overlap and their
 *      order varies; deliberately mixed). Each chevron moves as one element with its label and
 *      icon. It runs continuously, with no pause control and no pause on
 *      hover or focus (founder direction, 2026-11-17). Under reduced motion
 *      the chevrons are shown once, static, in a grid (§46.5).
 *   3  THE EXPLANATION: the opening paragraph beside a short amber vertical
 *      accent; between hairlines, the
 *      dependency: an amber people icon and the insight, a vertical hairline,
 *      the closing paragraph.
 *   4  THE CONSEQUENCE: centred, in two set lines: "When the field
 *      waits, delays spread." / "Costs grow. Profits shrink.", the last
 *      sentence in Brand Amber over a brush-stroke underline.
 *
 * The approved copy appears once for assistive technology: the first copy of
 * the activities is the list; the copies that close the loop are
 * aria-hidden. ("procurement" is a scoped exception to §20.1's
 * retired-language rule; the activity labels' title case is a scoped
 * exception to §7.7.)
 */

const PHOTO = `${import.meta.env.BASE_URL}assets/home/procurement-plans-desk`;

/** The activities and their icons (founder briefs 2026-11-17: eight, then
 *  fifteen, then sixteen), title case as approved. They are not a process: requirements
 *  vary by product, trade and project, and the activities overlap, repeat
 *  and occur in different orders. So they are deliberately mixed (no phase
 *  grouping, no start-to-finish run), fixed in this order so the ribbon is
 *  stable, unnumbered and an unordered list. */
const ACTIVITIES: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: 'Design Finalized', Icon: DraftingCompass },
  { label: 'Owner Supplied Items', Icon: PackageCheck },
  { label: 'Review Cycles', Icon: RefreshCw },
  { label: 'Materials Fabricated', Icon: Factory },
  { label: 'Required Information Released', Icon: FileText },
  { label: 'Strategic Expediting', Icon: Gauge },
  { label: 'Multi-disciplinary Reviews', Icon: Network },
  { label: 'Products Selected', Icon: Package },
  { label: 'Realistic Durations', Icon: CalendarClock },
  { label: 'Submittal Coordination', Icon: FileStack },
  { label: 'Materials Delivered', Icon: Truck },
  { label: 'Internal Reviews', Icon: ClipboardCheck },
  { label: 'Trades & Suppliers Secured', Icon: Layers },
  { label: 'Owner Selections', Icon: ListChecks },
  { label: 'Submittals Approved', Icon: FileCheck },
  { label: 'Decisions Made', Icon: CheckSquare },
];

/** Copies of the activities on the track. One copy of sixteen is wider than
 *  any screen (about 3,300 px on phones, 4,300 px on desktop), so two copies
 *  are enough for the loop never to show its end. */
const COPIES = 2;

/** The track's copy count, read by the marquee keyframes (src/index.css).
 *  The duration is set per breakpoint on the track, so the ribbon keeps
 *  roughly the same speed as the chevrons grow. */
const MARQUEE_COPIES = { '--jp-marquee-copies': COPIES } as CSSProperties;

/** --jp-background at a given strength. */
const scrim = (percent: number) => `color-mix(in oklab, var(--jp-background) ${percent}%, transparent)`;
/** Brand Amber at a given strength. */
const amber = (percent: number) => `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, transparent)`;

/** Below `lg`, the band's fades: out of the headline's navy, and into the ribbon. */
const BAND_FADES = {
  backgroundImage: `linear-gradient(180deg, var(--jp-background) 0%, ${scrim(50)} 9%, transparent 22%, transparent 60%, ${scrim(75)} 84%, var(--jp-background) 100%)`,
};

/** From `lg`: the photograph's left edge fades into the navy behind the
 *  headline's end; its top edge into the section above; its foot, behind
 *  the ribbon, into the section. The documents between are not darkened. */
const SCENE_FADES = {
  backgroundImage: [
    `linear-gradient(90deg, var(--jp-background) 0%, ${scrim(92)} 15%, ${scrim(78)} 26%, ${scrim(30)} 38%, transparent 48%)`,
    `linear-gradient(180deg, ${scrim(80)} 0%, transparent 16%, transparent 74%, ${scrim(65)} 90%, var(--jp-background) 100%)`,
  ].join(', '),
};

/** The chevron: notched on the left, pointed on the right (percentages of its box). */
const CHEVRON = 'polygon(0 0, 86% 0, 100% 50%, 86% 100%, 0 100%, 14% 50%)';

/** A chevron's interior: dark and translucent, a touch lighter at the top for depth. */
const CHEVRON_FILL = {
  clipPath: CHEVRON,
  backgroundImage: `linear-gradient(180deg, color-mix(in oklab, var(--jp-surface) 82%, transparent) 0%, ${scrim(88)} 100%)`,
};

/** The outline's glow: luminous but restrained and static, a lit edge (§46.4). */
const CHEVRON_GLOW = {
  filter: `drop-shadow(0 0 2px ${amber(95)}) drop-shadow(0 0 10px ${amber(55)})`,
};

/** The brush-stroke underline beneath "Profits shrink." (§55.2's mark, extended here). */
function BrushUnderline({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 26" preserveAspectRatio="none" className={`block fill-jp-brand-amber ${className}`}>
      <path d="M3 17.5C40 12.5 96 9 160 7.4 206 6.3 252 6.6 297 8.2 251 9.8 205 11.6 158 14.1 104 17 56 20.4 12 24.2 5.6 24.7 1 21.2 3 17.5Z" />
    </svg>
  );
}

/** One activity: a chevron that carries its own icon and label, so they move as one. */
function Chevron({ label, Icon }: { label: string; Icon: LucideIcon }) {
  return (
    <li className="relative flex h-(--chev-h) w-(--chev-w) shrink-0 items-center mr-[calc(var(--chev-w)*-0.14+0.5rem)] motion-reduce:mr-0 motion-reduce:w-full">
      <span aria-hidden="true" className="absolute inset-0" style={CHEVRON_FILL} />
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" style={CHEVRON_GLOW}>
        <polygon points="1,1.5 86,1.5 98.8,50 86,98.5 1,98.5 13.6,50" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="2.25" strokeLinejoin="round" className="stroke-jp-brand-amber" />
      </svg>
      <span className="relative flex items-center gap-3 pr-[12%] pl-[calc(14%+0.5rem)] lg:gap-3.5">
        <Icon aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0 text-jp-brand-amber sm:size-[1.375rem] lg:size-[1.625rem]" />
        <span className="font-heading text-[0.9375rem] leading-[1.15] font-bold tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.0625rem] lg:text-[1.1875rem] xl:text-[1.3125rem] motion-reduce:lg:text-[1.0625rem] motion-reduce:xl:text-[1.125rem]">
          {label}
        </span>
      </span>
    </li>
  );
}

/**
 * One copy of the activities. The first is the list assistive technology
 * reads; the others exist only to close the loop and are hidden from it,
 * and from everyone under reduced motion.
 */
function Activities({ repeat = false }: { repeat?: boolean }) {
  return (
    <ul
      aria-label={repeat ? undefined : 'Procurement activities'}
      aria-hidden={repeat || undefined}
      className={`flex shrink-0 items-center ${repeat ? 'motion-reduce:hidden' : 'motion-reduce:grid motion-reduce:grid-cols-1 motion-reduce:gap-3 motion-reduce:sm:grid-cols-2 motion-reduce:lg:grid-cols-3 motion-reduce:2xl:grid-cols-4'}`}
    >
      {ACTIVITIES.map(({ label, Icon }) => (
        <Chevron key={label} label={label} Icon={Icon} />
      ))}
    </ul>
  );
}

export default function ProcurementSection() {
  return (
    <section className="relative isolate overflow-hidden bg-jp-background [--chev-h:5rem] [--chev-w:16.5rem] sm:[--chev-h:5.5rem] sm:[--chev-w:18rem] lg:[--chev-h:clamp(5.75rem,6.4vw,6.875rem)] lg:[--chev-w:clamp(21.5rem,22vw,25rem)]">
      {/* 1-2. The scene and the ribbon. */}
      <div className="relative flex flex-col">
        {/* The photograph: a band after the headline below `lg`; from `lg`
            the upper right of the scene, its foot behind the ribbon. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative order-2 mt-8 sm:mt-10 lg:absolute lg:top-0 lg:right-0 lg:bottom-[calc(var(--chev-h)/2+1rem)] lg:mt-0 lg:left-[calc(max(2.5rem,(100%-80rem)/2)+min(100%-5rem,80rem)*0.43)]"
        >
          <img
            src={`${PHOTO}-1672.webp`}
            srcSet={`${PHOTO}-1024.webp 1024w, ${PHOTO}-1672.webp 1672w`}
            sizes="(min-width: 1024px) 60vw, 100vw"
            width={1672}
            height={941}
            alt=""
            loading="lazy"
            decoding="async"
            className="block h-[clamp(16rem,85vw,22rem)] w-full object-cover object-[40%_60%] sm:h-[clamp(22rem,58vw,32rem)] sm:object-[50%_55%] lg:h-full lg:object-[50%_62%]"
          />
          <div className="absolute inset-0 lg:hidden" style={BAND_FADES} />
          <div className="absolute inset-0 hidden lg:block" style={SCENE_FADES} />
        </div>

        {/* The headline, large at the upper left. */}
        <div className="relative z-10 order-1 px-6 pt-16 sm:px-8 sm:pt-20 lg:min-h-[max(23vw,22rem)] lg:px-10 lg:pt-[clamp(4.5rem,6vw,7rem)] lg:pb-[clamp(3.5rem,5vw,6rem)]">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-jp-text-primary sm:text-[3.5rem] lg:text-[clamp(3.5rem,4.3vw,5.25rem)]">
              <span className="sm:block">Procurement is more</span> <span className="sm:block">than buying materials.</span>
            </h2>
            <span aria-hidden="true" className="mt-6 block h-1 w-16 rounded-full bg-jp-brand-amber sm:mt-8 sm:w-24 lg:mt-[clamp(1.75rem,2.4vw,2.75rem)] lg:h-[0.3125rem] lg:w-[clamp(6rem,7vw,8rem)]" />
          </div>
        </div>

        {/* The ribbon: full-bleed, its ends fading into the section. */}
        <div className="jp-marquee relative z-10 order-3 -mt-[calc(var(--chev-h)/2+3rem)] py-4 sm:-mt-[calc(var(--chev-h)/2+4rem)] lg:mt-0">
          <div className="overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)] motion-reduce:px-6 motion-reduce:[mask-image:none] motion-reduce:sm:px-8 motion-reduce:lg:px-10">
            <div
              className="jp-marquee-track flex w-max [--jp-marquee-duration:84s] sm:[--jp-marquee-duration:92s] lg:[--jp-marquee-duration:105s] 2xl:[--jp-marquee-duration:116s] motion-reduce:mx-auto motion-reduce:block motion-reduce:w-auto motion-reduce:max-w-7xl"
              style={MARQUEE_COPIES}
            >
              {Array.from({ length: COPIES }, (_, i) => (
                <Activities key={i} repeat={i > 0} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-4. The explanation and the consequence. */}
      <div className="px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          {/* The opening paragraph beside a short amber accent. */}
          <div className="mt-8 sm:mt-10 lg:mt-12">
            <div className="flex gap-5 text-[1.25rem] sm:gap-7 sm:text-[1.5rem] lg:text-[clamp(1.5rem,1.75vw,1.875rem)]">
              <span aria-hidden="true" className="mt-[0.2em] block h-[1.1em] w-1 shrink-0 rounded-full bg-jp-brand-amber" />
              <p className="max-w-[62ch] leading-[1.45] text-pretty text-jp-text-primary">
                Every product, material, and service depends on a sequence of decisions, approvals, and commitments that must happen at the right time.
              </p>
            </div>
          </div>

          {/* The dependency, between hairlines: the insight and the closing
              paragraph either side of a vertical hairline from `lg`. */}
          <div className="mt-8 border-y border-jp-border/20 py-7 sm:mt-10 sm:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1.25fr)] lg:items-center lg:gap-x-12">
            <div className="flex items-center gap-4 sm:gap-5">
              <Users aria-hidden="true" strokeWidth={1.75} className="size-9 shrink-0 text-jp-brand-amber sm:size-10 lg:size-11" />
              <p className="max-w-[24ch] font-heading text-[1.375rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-text-primary sm:text-[1.625rem] lg:text-[clamp(1.5rem,1.65vw,1.875rem)]">
                Much of this work depends on people outside your company.
              </p>
            </div>
            <span aria-hidden="true" className="hidden h-full min-h-16 w-px bg-jp-border/30 lg:block" />
            <p className="mt-5 max-w-[50ch] text-[1.125rem] leading-[1.55] text-jp-text-secondary sm:text-[1.25rem] lg:mt-0 lg:text-[clamp(1.25rem,1.4vw,1.5rem)]">
              We help establish clear expectations early, giving owners, architects, and trade partners the information and time they need to fulfill their commitments before the field is waiting.
            </p>
          </div>
        </div>

        {/* The consequence: centred, the section's payoff, one line from `xl`. */}
        <div className="mx-auto pt-10 pb-6 sm:pt-12 sm:pb-8 lg:pt-14">
          <p className="text-center font-heading text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-balance text-jp-text-primary sm:text-[3rem] lg:text-[clamp(2.5rem,3.4vw,4rem)]">
            <span className="block">When the field waits, delays spread.</span> Costs grow.{' '}
            <span className="relative inline-block whitespace-nowrap text-jp-brand-amber">
              Profits shrink.
              <BrushUnderline className="absolute inset-x-[2%] -bottom-[0.26em] h-[0.18em] w-[96%]" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
