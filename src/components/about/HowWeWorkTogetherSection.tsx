import {
  AlertTriangle,
  Bell,
  CalendarCheck,
  CalendarDays,
  CalendarX,
  Check,
  ChevronsRight,
  FileText,
  Flag,
  Hand,
  HardHat,
  Layers,
  Link,
  MessageCircleQuestion,
  RefreshCw,
  Search,
  Timer,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * About page, Section 4: *How we work together* (Design System §78, Decision Log 2026-11-19), from the
 * founder-approved mockup *Two Paths Through the Same Project* and its text-free artwork (§78, Reference).
 * MESSAGE: order creates capacity. The same team doing the same work moves forward with fewer preventable
 * disruptions when the work ahead is planned, sequenced and prioritized. The team keeps doing its own project work;
 * JiTpro does not take it over. The two paths are an illustrative comparison, NEVER measured results or a guarantee:
 * no percentages, productivity figures or schedule savings.
 *
 *   1400+  copy and the statement card at left; at right the infographic, then *Order creates capacity*
 *   lg–1400 the copy in two columns above the infographic at full width
 *   <lg    a stack: copy, statement card, the two paths as vertical timelines, *Order creates capacity*
 *   all    the full-width navy closing banner
 *
 * THE INFOGRAPHIC (§78.2) is the artwork's two panels, served as one image, with every word as HTML placed on it in
 * percentages of the image and sized in container units (cqw), so text and artwork scale together. Positions are the
 * mockup's own, in artwork pixels (`at`, `cq`). Below lg the labels would be too small, so the paths are rebuilt as
 * HTML timelines. On the light ground amber is decorative only; all text is ink (§8.8). No motion.
 */

const ART = `${import.meta.env.BASE_URL}assets/about/about-two-paths`;

/** The infographic image is the artwork cropped at (476, 122), 1174 × 568. */
const X0 = 476;
const Y0 = 122;
const W = 1174;
const H = 568;
/** A point in the artwork, as a position in the image. */
const at = (x: number, y: number): CSSProperties => ({
  left: `${(((x - X0) / W) * 100).toFixed(2)}%`,
  top: `${(((y - Y0) / H) * 100).toFixed(2)}%`,
});
/** A size in artwork pixels, in units of the image's width. */
const cq = (px: number) => `${((px / W) * 100).toFixed(3)}cqw`;

/** The artwork's cream: white warmed with amber. */
const warm = (percent: number) => `color-mix(in oklab, var(--jp-surface-white) ${100 - percent}%, var(--jp-brand-amber))`;
const CREAM: CSSProperties = { backgroundColor: warm(5) };
/** The on-time green, deepened toward the ink for contrast on its pale card (§78.2). */
const ON_TIME = 'color-mix(in oklab, var(--jp-success) 75%, var(--jp-background))';

/** Fades an image's edges into the ground. */
const fade = (...edges: string[]): CSSProperties => {
  const mask = edges.map((to) => `linear-gradient(${to}, transparent 0%, black 18%)`).join(', ');
  return { maskImage: mask, WebkitMaskImage: mask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' };
};
const GRAPHIC_EDGE: CSSProperties = (() => {
  const mask = [
    'linear-gradient(to right, transparent 0, black 1%, black 99%, transparent 100%)',
    'linear-gradient(to bottom, transparent 0, black 1.5%, black 98.5%, transparent 100%)',
  ].join(', ');
  return { maskImage: mask, WebkitMaskImage: mask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' };
})();

type Step = { label: string; Icon: LucideIcon; x: number; y: number };

/** The reactive path, in path order; positions are the mockup's label origins (left edge, vertical centre). */
const REACTIVE: ReadonlyArray<Step> = [
  { label: 'Missing\ndecision', Icon: AlertTriangle, x: 736, y: 233 },
  { label: 'Chasing\ninformation', Icon: Layers, x: 745, y: 366 },
  { label: 'Unanswered\nquestions', Icon: MessageCircleQuestion, x: 922, y: 221 },
  { label: 'Crew\ninterruption', Icon: Hand, x: 939, y: 367 },
  { label: 'Submittal\ndelay', Icon: Timer, x: 1124, y: 215 },
  { label: 'Expediting', Icon: ChevronsRight, x: 1102, y: 357 },
  { label: 'Resequencing', Icon: RefreshCw, x: 1296, y: 228 },
  { label: 'Rework', Icon: Wrench, x: 1261, y: 365 },
  { label: 'Late\napproval', Icon: AlertTriangle, x: 1405, y: 367 },
];

/** The planned path; x is each milestone's column (its tick), labels sit under the artwork's icons. */
const PLANNED: ReadonlyArray<Step> = [
  { label: 'Plan\nestablished', Icon: CalendarDays, x: 690, y: 558 },
  { label: 'Scope gaps\nidentified', Icon: Search, x: 795, y: 558 },
  { label: 'Clear\nresponsibilities', Icon: Users, x: 901, y: 558 },
  { label: 'Weekly\npriorities', Icon: CalendarDays, x: 1009, y: 558 },
  { label: '3-week\nlook-ahead', Icon: Layers, x: 1107, y: 558 },
  { label: 'Advance\nnotice', Icon: Bell, x: 1202, y: 558 },
  { label: 'Coordinated\nsteps', Icon: Link, x: 1299, y: 558 },
  { label: 'Planned\nexecution', Icon: Flag, x: 1397, y: 558 },
];

const PATHS = {
  reactive: { title: 'Without a clear plan', subtitle: 'Reactive management', ready: 'Not field ready', outcome: 'late or wrong' },
  planned: { title: 'With JiTpro', subtitle: 'Planned execution', ready: 'Field ready', outcome: 'on time' },
} as const;

/* ------------------------------------------------------------------------------------------- the infographic */

/** A path's heading and subtitle, at the artwork's header beside its people icon. */
function OverlayHeading({ path, y }: { path: keyof typeof PATHS; y: number }) {
  const { title, subtitle } = PATHS[path];
  return (
    <>
      <h4
        className="absolute -translate-y-1/2 font-heading font-bold leading-none tracking-[-0.015em] whitespace-nowrap text-jp-background"
        style={{ ...at(627, y), fontSize: cq(24) }}
      >
        {title}
      </h4>
      <p
        className="absolute -translate-y-1/2 leading-none whitespace-nowrap text-jp-ink-secondary italic"
        style={{ ...at(628, y + 27), fontSize: cq(18.5) }}
      >
        {subtitle}
      </p>
    </>
  );
}

/** The start card's words, *Contract Award*. */
function OverlayStart({ y }: { y: number }) {
  return (
    <li
      className="absolute -translate-y-1/2 font-heading font-bold leading-[1.12] whitespace-pre-line text-jp-background"
      style={{ ...at(566, y), fontSize: cq(15.5) }}
    >
      {'Contract\nAward'}
    </li>
  );
}

/** The end card's words: *Field ready* or *Not field ready*, then the outcome in its colour (§78.1). */
function OverlayOutcome({ path, x, y }: { path: keyof typeof PATHS; x: number; y: number }) {
  const late = path === 'reactive';
  /* The reactive card's longer words are set smaller so they stay inside its red card (text room 1512 to 1614). */
  const [readySize, outcomeSize] = late ? [15, 16.5] : [19, 25];
  return (
    <li className="absolute -translate-y-1/2 font-heading leading-[1.1] whitespace-nowrap" style={at(x, y)}>
      <span className="block font-bold text-jp-background" style={{ fontSize: cq(readySize) }}>
        {PATHS[path].ready}
      </span>{' '}
      <span
        className={`block font-extrabold ${late ? 'text-jp-warning-red' : ''}`}
        style={{ fontSize: cq(outcomeSize), ...(late ? {} : { color: ON_TIME }) }}
      >
        {PATHS[path].outcome}
      </span>
    </li>
  );
}

function TwoPathsGraphic() {
  return (
    <div className="@container relative">
      <img
        src={`${ART}-1174.webp`}
        width={W}
        height={H}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="block h-auto w-full select-none"
        style={GRAPHIC_EDGE}
      />

      <div className="absolute inset-0">
        <OverlayHeading path="reactive" y={160} />
        <ol aria-label="Without a clear plan, from contract award">
          <OverlayStart y={299} />
          {REACTIVE.map(({ label, x, y }) => (
            <li
              key={label}
              className="absolute -translate-y-1/2 font-heading font-semibold leading-[1.15] whitespace-pre-line text-jp-background"
              style={{ ...at(x, y), fontSize: cq(14.5) }}
            >
              {label}
            </li>
          ))}
          <OverlayOutcome path="reactive" x={1512} y={295} />
        </ol>

        <OverlayHeading path="planned" y={455} />
        <ol aria-label="With JiTpro, from contract award">
          <OverlayStart y={613} />
          {PLANNED.map(({ label, x, y }) => (
            <li
              key={label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-heading font-semibold leading-[1.15] whitespace-pre-line text-jp-background"
              style={{ ...at(x, y), fontSize: cq(14) }}
            >
              {label}
            </li>
          ))}
          <OverlayOutcome path="planned" x={1521} y={613} />
        </ol>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------------- the timelines, below lg */

/** The row height of a timeline step; the reactive path's connectors span exactly one row. */
const ROW = 'h-14';
/** The reactive path's sideways step, between its alternating columns. */
const STEP = 'ml-10';

function TimelineHeader({ path }: { path: keyof typeof PATHS }) {
  const { title, subtitle } = PATHS[path];
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-full text-jp-background"
        style={{ backgroundColor: warm(path === 'reactive' ? 14 : 0) }}
      >
        <Users className="size-6" strokeWidth={2.25} />
      </span>
      <span aria-hidden="true" className="h-10 w-px shrink-0 bg-jp-background/70" />
      <div>
        <h4 className="font-heading text-[1.25rem] font-bold leading-tight tracking-[-0.015em] text-jp-background">{title}</h4>
        <p className="mt-0.5 text-[0.9375rem] text-jp-ink-secondary italic">{subtitle}</p>
      </div>
    </div>
  );
}

/** A start or end node: an icon box and its words. */
function TimelineNode({
  Icon,
  children,
  tone,
}: {
  Icon: LucideIcon;
  children: ReactNode;
  tone: 'start' | 'late' | 'on-time';
}) {
  const box =
    tone === 'start'
      ? 'border-jp-background bg-jp-surface-white text-jp-background'
      : tone === 'late'
        ? 'border-jp-warning-red/60 text-jp-warning-red'
        : 'border-jp-success/60';
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-lg border-[1.5px] ${box}`}
        style={
          tone === 'start'
            ? undefined
            : {
                // Opaque tints, so the path behind the node does not show through.
                backgroundColor: `color-mix(in oklab, var(--jp-surface-white) 90%, var(${tone === 'late' ? '--jp-warning-red' : '--jp-success'}))`,
                ...(tone === 'on-time' ? { color: ON_TIME } : {}),
              }
        }
      >
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <span className="font-heading text-[1.0625rem] font-bold leading-tight text-jp-background">{children}</span>
    </div>
  );
}

/**
 * The reactive path's connector from a step to the next, which sits in the other column: down to the boundary
 * between the rows, across, then down into the next step, so it never crosses a label. `from` is this step's column.
 */
function Winding({ from }: { from: 'left' | 'right' }) {
  const line = 'absolute h-1/2 w-10 border-dashed border-jp-background/70';
  const box = from === 'left' ? 'left-5' : '-left-5';
  return (
    <>
      <span
        aria-hidden="true"
        className={`${line} ${box} top-1/2 border-b-2 ${from === 'left' ? 'rounded-bl-xl border-l-2' : 'rounded-br-xl border-r-2'}`}
      />
      <span
        aria-hidden="true"
        className={`${line} ${box} top-full -mt-0.5 border-t-2 ${from === 'left' ? 'rounded-tr-xl border-r-2' : 'rounded-tl-xl border-l-2'}`}
      />
    </>
  );
}

function ReactiveTimeline() {
  return (
    <div className="rounded-2xl border border-jp-ink-secondary/15 p-5 shadow-[0_18px_40px_-28px_var(--jp-ink-secondary)] sm:p-7" style={{ backgroundColor: warm(4) }}>
      <TimelineHeader path="reactive" />
      <ol aria-label="Without a clear plan, from contract award" className="mt-6">
        <li className={`relative ${ROW} flex items-center`}>
          <Winding from="left" />
          <TimelineNode Icon={FileText} tone="start">
            Contract Award
          </TimelineNode>
        </li>
        {REACTIVE.map(({ label, Icon }, i) => {
          const stepped = i % 2 === 0;
          return (
            <li key={label} className={`relative ${ROW} flex items-center ${stepped ? STEP : ''}`}>
              <Winding from={stepped ? 'right' : 'left'} />
              <span
                aria-hidden="true"
                className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-jp-brand-amber"
                style={{ backgroundColor: warm(16) }}
              >
                <Icon className="size-5" strokeWidth={2.25} />
              </span>
              <span className="ml-3 font-heading text-[1rem] font-semibold leading-tight text-jp-background">
                {label.replace('\n', ' ')}
              </span>
            </li>
          );
        })}
        <li className={`relative ${ROW} flex items-center`}>
          <TimelineNode Icon={CalendarX} tone="late">
            {PATHS.reactive.ready}: <span className="text-jp-warning-red">{PATHS.reactive.outcome}</span>
          </TimelineNode>
        </li>
      </ol>
    </div>
  );
}

function PlannedTimeline() {
  return (
    <div
      className="rounded-2xl border border-jp-ink-secondary/15 p-5 shadow-[0_18px_40px_-28px_var(--jp-ink-secondary)] sm:p-7"
      style={{ backgroundColor: 'color-mix(in oklab, var(--jp-surface-white) 92%, var(--jp-border))' }}
    >
      <TimelineHeader path="planned" />
      <ol aria-label="With JiTpro, from contract award" className="relative mt-6">
        {/* The straight path, from the start node's centre to the end node's. */}
        <span aria-hidden="true" className="absolute top-7 bottom-7 left-5 w-0.5 -translate-x-1/2 bg-jp-background" />
        <li className={`relative ${ROW} flex items-center`}>
          <TimelineNode Icon={FileText} tone="start">
            Contract Award
          </TimelineNode>
        </li>
        {PLANNED.map(({ label, Icon }) => (
          <li key={label} className={`relative ${ROW} flex items-center`}>
            <span
              aria-hidden="true"
              className="relative z-10 ml-1.5 grid size-7 shrink-0 place-items-center rounded-full border-2 border-jp-background bg-jp-surface-white text-jp-brand-amber"
            >
              <Check className="size-4" strokeWidth={3.5} />
            </span>
            <Icon aria-hidden="true" className="ml-5 size-5 shrink-0 text-jp-background" strokeWidth={2} />
            <span className="ml-3 font-heading text-[1rem] font-semibold leading-tight text-jp-background">
              {label.replace('\n', ' ')}
            </span>
          </li>
        ))}
        <li className={`relative ${ROW} flex items-center`}>
          <TimelineNode Icon={CalendarCheck} tone="on-time">
            {PATHS.planned.ready} <span style={{ color: ON_TIME }}>{PATHS.planned.outcome}</span>
          </TimelineNode>
        </li>
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------- section */

export default function HowWeWorkTogetherSection() {
  return (
    <section id="how-we-work-together" aria-labelledby="how-we-work-together-heading" className="relative isolate overflow-hidden" style={CREAM}>
      <div className="relative">
        {/* The artwork's linework: the crane at top right, the steel frame at bottom left. */}
        <img
          src={`${ART}-crane-492.webp`}
          width={492}
          height={128}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute top-0 right-0 -z-10 hidden w-[min(34vw,36rem)] lg:block"
          style={fade('to right', 'to top')}
        />
        <img
          src={`${ART}-frame-330.webp`}
          width={330}
          height={171}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden w-[min(22vw,24rem)] lg:block"
          style={fade('to bottom', 'to left')}
        />

        <div className="mx-auto max-w-[104rem] px-6 pt-16 pb-14 sm:px-8 sm:pt-20 lg:px-10 lg:pt-20 lg:pb-16 min-[87.5rem]:grid min-[87.5rem]:grid-cols-[minmax(0,27fr)_minmax(0,73fr)] min-[87.5rem]:gap-x-[clamp(2rem,2.4vw,3rem)] min-[87.5rem]:px-[3.5vw] min-[87.5rem]:pt-[clamp(4rem,4.5vw,5rem)]">
          {/* ------------------------------------------------------------- the copy */}
          <div className="max-w-[44rem] lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-12 min-[87.5rem]:block min-[87.5rem]:pt-2">
            <div>
              {/* Authored in sentence case, uppercased in CSS (§7.7); slate on light, the bar amber (§8.8). */}
              <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm">
                <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
                How we work together
              </p>
              <h2
                id="how-we-work-together-heading"
                className="mt-6 font-heading text-[min(2.375rem,10vw)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-jp-background sm:text-[2.875rem] min-[87.5rem]:text-[clamp(2.375rem,3vw,3.25rem)]"
              >
                We work with the team you already have.
              </h2>
            </div>
            <div className="lg:pt-10 min-[87.5rem]:pt-0">
              <p className="mt-6 text-[1.0625rem] leading-[1.6] text-pretty text-jp-ink-secondary lg:mt-0 min-[87.5rem]:mt-6 min-[87.5rem]:text-[clamp(1.0625rem,1.2vw,1.1875rem)]">
                JiTpro helps your existing team replace reactive management with a clearer path through the work, so the
                project moves forward with fewer preventable disruptions, less rework, and greater confidence in what&apos;s
                next.
              </p>
              <div
                className="mt-8 flex items-center gap-5 rounded-2xl px-6 py-6 sm:px-7 min-[87.5rem]:mt-[clamp(2.5rem,3.5vw,3.5rem)] min-[87.5rem]:py-8"
                style={{ backgroundColor: warm(13) }}
              >
                <HardHat aria-hidden="true" className="size-10 shrink-0 text-jp-brand-amber sm:size-12 min-[87.5rem]:size-14" strokeWidth={1.75} />
                <span aria-hidden="true" className="w-0.5 self-stretch shrink-0 rounded-full bg-jp-brand-amber" />
                <p className="font-heading text-[1.3125rem] font-bold leading-[1.25] tracking-[-0.01em] text-balance text-jp-background italic min-[87.5rem]:text-[clamp(1.3125rem,1.65vw,1.6875rem)]">
                  The same team. The same work. A better way through it.
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- the two paths */}
          <div className="mt-14 lg:mt-14 min-[87.5rem]:mt-0">
            <h3 className="font-heading text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2rem] min-[87.5rem]:text-[clamp(2rem,2.45vw,2.625rem)]">
              Two paths through the same project.
            </h3>
            <span aria-hidden="true" className="mt-4 block h-1 w-16 rounded-full bg-jp-brand-amber" />

            <div className="mt-6 hidden lg:block">
              <TwoPathsGraphic />
            </div>
            <div className="mt-6 grid max-w-[40rem] gap-5 md:max-w-none md:grid-cols-2 md:items-start lg:hidden">
              <ReactiveTimeline />
              <PlannedTimeline />
            </div>

            {/* ------------------------------------------- order creates capacity */}
            <div className="mt-10 lg:mt-6">
              <div className="flex items-center gap-5">
                <span aria-hidden="true" className="hidden h-0.5 flex-1 bg-jp-brand-amber sm:block" />
                <h3
                  className="rounded-full border-[1.5px] border-jp-brand-amber/80 px-6 py-2.5 text-center font-heading text-[1.125rem] font-extrabold uppercase tracking-[0.02em] text-jp-background sm:px-10 lg:text-[1.375rem] min-[87.5rem]:text-[clamp(1.25rem,1.6vw,1.75rem)]"
                  style={{ backgroundColor: warm(16) }}
                >
                  Order creates capacity
                </h3>
                <span aria-hidden="true" className="hidden h-0.5 flex-1 bg-jp-brand-amber sm:block" />
              </div>
              <p className="mx-auto mt-4 max-w-[52rem] text-[1rem] leading-[1.55] text-pretty text-jp-ink-secondary sm:text-center min-[87.5rem]:text-[clamp(1rem,1.1vw,1.125rem)]">
                When your team knows what needs to happen, who is responsible, and when each step is required, they spend less
                time reacting and more time moving the project forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- the closing banner */}
      <div className="bg-jp-surface">
        <div className="mx-auto max-w-[104rem] px-6 py-10 text-center sm:px-8 lg:px-10 min-[87.5rem]:py-9">
          <p className="font-heading text-[1.375rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-text-primary sm:text-[1.625rem] min-[87.5rem]:text-[clamp(1.75rem,2vw,2.125rem)]">
            We do not add another layer of work.{' '}
            <span className="text-jp-brand-amber">We bring order to the work that is already there.</span>
          </p>
          <p className="mx-auto mt-3 max-w-[76rem] text-[1rem] leading-[1.55] text-pretty text-jp-text-secondary sm:text-[1.0625rem] min-[87.5rem]:text-[clamp(1.0625rem,1.2vw,1.25rem)]">
            Less chasing. Less confusion. Fewer avoidable emergencies. More time for the work that actually moves the project
            forward.
          </p>
        </div>
      </div>
    </section>
  );
}
