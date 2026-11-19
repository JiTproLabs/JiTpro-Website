import { ArrowDown, CalendarDays, Check, HardHat, Layers, Package, AlertTriangle, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

/**
 * About page, Section 3: *What we do* (Design System §77, Decision Log 2026-11-19), from the founder-approved mockup
 * and its text-free artwork (§77, Reference). MESSAGE: JiTpro plans and guides; the contractor's team executes.
 * JiTpro builds the detailed procurement plan, sets the sequence, dates and priorities, and gives weekly guidance;
 * the team keeps running its subcontractors, submittals, approvals, paperwork and purchasing with its own procedures.
 * NEVER: JiTpro does the buyout, processes submittals or runs procurement administration; guarantees dates; or the
 * graphic is software the contractor must buy, learn or operate (it is an illustration of the plan).
 *
 *   xl+    copy at left; at right the plan panel with the guidance panel layered over its empty lower edge, joined
 *          by *Plan drives the cadence*; the responsibility bar and closing line centred beneath
 *   md–xl  copy, then the graphic at full width (same layering), the bar on one row
 *   <md    a deliberate stack: copy, plan (categories two across over the chart), connector, guidance, the bar's
 *          two halves stacked, closing line
 *
 * The panels are HTML and CSS (§77.2): the artwork draws them in perspective, so as an image no text would stay
 * registered. The schedule's rows, segments, month divisions and *today* line take the artwork's own geometry, in
 * percentages of the chart. Only the artwork's backdrop is served: the window with the crane and the desk with
 * drawings. Amber on the navy marks JiTpro (§77.2); the team's side is navy and slate. No motion.
 */

const ART = `${import.meta.env.BASE_URL}assets/about/about-what-we-do`;

/** Navy lifted toward white, for the glass panels and their inner wells. */
const lift = (percent: number) => `color-mix(in oklab, var(--jp-surface) ${100 - percent}%, var(--jp-surface-white))`;
/** Amber laid over the navy, for JiTpro's marks. */
const amberOnNavy = (percent: number) => `color-mix(in oklab, var(--jp-brand-amber) ${percent}%, var(--jp-surface))`;

const PANEL: CSSProperties = { backgroundImage: `linear-gradient(160deg, ${lift(9)} 0%, ${lift(4)} 100%)` };
const WELL: CSSProperties = { backgroundColor: `color-mix(in oklab, var(--jp-surface-white) 4%, transparent)` };
const PANEL_EDGE =
  'border border-jp-brand-amber/55 shadow-[0_0_32px_-8px_color-mix(in_oklab,var(--jp-brand-amber)_55%,transparent),0_24px_48px_-24px_var(--jp-background)]';

const CATEGORIES: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: 'Upcoming commitments', Icon: CalendarDays },
  { label: 'Scope gaps', Icon: AlertTriangle },
  { label: 'Product requirements', Icon: Package },
  { label: 'Submittal / review steps', Icon: Layers },
];

/** The chart's months, centred in their columns, and the divisions between them (percent of the chart's width). */
const MONTHS = [
  { label: 'Mar', at: 13.8 },
  { label: 'Apr', at: 40.5 },
  { label: 'May', at: 64.9 },
  { label: 'Jun', at: 88.2 },
] as const;
const MONTH_DIVIDERS = [27.6, 53.3, 76.4] as const;
/** The *today* line, where the artwork places it. */
const TODAY = 35;

/** The artwork's five schedule rows: each a run of segments, [start, end] in percent, slate or amber. */
const ROWS: ReadonlyArray<ReadonlyArray<{ from: number; to: number; amber?: boolean }>> = [
  [{ from: 3.3, to: 31.7, amber: true }],
  [{ from: 12.4, to: 48.8 }],
  [{ from: 20.5, to: 36 }, { from: 35.1, to: 68.5, amber: true }],
  [{ from: 40.8, to: 60.6 }, { from: 59.3, to: 84.4, amber: true }],
  [{ from: 65, to: 96.3 }],
];

const WEEKS: ReadonlyArray<{ title: string; description: string; now?: boolean; ticked: number }> = [
  { title: 'This week', description: 'Items requiring action immediately.', now: true, ticked: 2 },
  {
    title: 'Next 7 days',
    description: 'Activities and commitments that the team should prepare to address during the coming week.',
    ticked: 0,
  },
  {
    title: '3-week look-ahead',
    description: 'Upcoming work requiring advance attention, decisions, coordination, or preparation.',
    ticked: 0,
  },
];
const LINE_WIDTHS = ['82%', '64%', '74%'] as const;

/** The plan: its categories and the schedule. */
function PlanPanel() {
  return (
    <div className={`relative z-10 rounded-[1.25rem] p-4 sm:p-5 md:w-[88%] ${PANEL_EDGE}`} style={PANEL}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-3 font-heading text-[1.1875rem] font-semibold tracking-[-0.01em] text-jp-text-primary sm:text-[1.375rem]">
          <Layers aria-hidden="true" strokeWidth={1.6} className="size-6 shrink-0 text-jp-brand-amber sm:size-7" />
          Project Procurement Plan
        </h3>
        {/* The artwork's three tab marks, unlabelled: as words they would present the graphic as software (§77.1). */}
        <span aria-hidden="true" className="hidden shrink-0 items-center gap-4 sm:flex">
          <span className="h-[3px] w-8 rounded-full bg-jp-brand-amber" />
          <span className="h-[3px] w-8 rounded-full bg-jp-ink-secondary" />
          <span className="h-[3px] w-8 rounded-full bg-jp-ink-secondary" />
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(10.5rem,0.3fr)_minmax(0,1fr)]">
        <ul className="grid grid-cols-2 gap-x-2 rounded-xl p-1.5 md:flex md:flex-col md:justify-around md:p-2" style={WELL}>
          {CATEGORIES.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 px-2 py-2 md:gap-3 md:border-b md:border-jp-border/15 md:py-3 md:last:border-b-0"
            >
              <Icon aria-hidden="true" strokeWidth={1.6} className="size-5 shrink-0 text-jp-brand-amber" />
              <span className="text-[0.8125rem] font-medium leading-[1.25] text-jp-text-primary sm:text-[0.9375rem]">{label}</span>
            </li>
          ))}
        </ul>

        {/* The schedule: an illustration of a plan's sequence, not data. */}
        <div aria-hidden="true" className="relative rounded-xl border border-jp-border/15 px-3 pt-2 pb-3 md:pb-[4.75rem]" style={WELL}>
          <div className="relative">
            {MONTH_DIVIDERS.map((at) => (
              <span key={at} className="absolute top-0 bottom-0 w-px bg-jp-border/20" style={{ left: `${at}%` }} />
            ))}
            <div className="relative h-6 border-b border-jp-border/20">
              {MONTHS.map(({ label, at }) => (
                <span
                  key={label}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em] text-jp-text-muted sm:text-[0.6875rem]"
                  style={{ left: `${at}%` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div
              className="relative py-1.5"
              style={{
                backgroundImage: 'linear-gradient(90deg, color-mix(in oklab, var(--jp-border) 12%, transparent) 1px, transparent 1px)',
                backgroundSize: '6.25% 100%',
              }}
            >
              {ROWS.map((segments, r) => (
                <div key={r} className="relative h-[1.375rem] sm:h-6">
                  {segments.map(({ from, to, amber }) => (
                    <span
                      key={from}
                      className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full sm:h-[0.5625rem] ${
                        amber
                          ? 'z-[1] bg-jp-brand-amber shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--jp-brand-amber)_70%,transparent)]'
                          : 'bg-jp-ink-secondary'
                      }`}
                      style={{ left: `${from}%`, width: `${to - from}%` }}
                    />
                  ))}
                </div>
              ))}
              <span className="absolute top-0 -bottom-2 z-[2] border-l-2 border-dashed border-jp-text-primary/80" style={{ left: `${TODAY}%` }} />
            </div>
            <span
              className="absolute top-6 z-[3] size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-jp-brand-amber"
              style={{ left: `calc(${TODAY}% + 1px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** The connector's label, shared by the layered and stacked presentations. */
function CadenceLabel() {
  return (
    <span className="inline-block rounded-full border border-jp-brand-amber/80 px-3 py-1.5 text-center font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-jp-brand-amber shadow-[0_0_16px_-6px_var(--jp-brand-amber)]">
      Plan drives the cadence
    </span>
  );
}

/** The weekly guidance: three columns of priorities drawn from the plan. */
function GuidancePanel() {
  return (
    <div className={`relative rounded-[1.25rem] p-4 sm:p-5 ${PANEL_EDGE}`} style={{ backgroundColor: lift(6) }}>
      <h3 className="flex items-center gap-3 font-heading text-[1.1875rem] font-semibold tracking-[-0.01em] text-jp-text-primary sm:text-[1.375rem]">
        <CalendarDays aria-hidden="true" strokeWidth={1.6} className="size-6 shrink-0 text-jp-brand-amber sm:size-7" />
        Weekly Guidance
      </h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {WEEKS.map(({ title, description, now, ticked }) => (
          <li key={title} className="overflow-hidden rounded-xl" style={WELL}>
            <h4
              className="px-3 py-2 text-[0.9375rem] font-semibold leading-[1.25] text-jp-text-primary sm:px-2.5 sm:text-[0.8125rem] sm:whitespace-nowrap lg:px-3 lg:text-[0.875rem]"
              style={{ backgroundColor: now ? amberOnNavy(44) : `color-mix(in oklab, var(--jp-ink-secondary) 42%, var(--jp-surface))` }}
            >
              {title}
            </h4>
            <p className="sr-only">{description}</p>
            <div aria-hidden="true" className="space-y-2.5 p-3">
              {LINE_WIDTHS.map((width, i) => (
                <div key={width} className="flex items-center gap-2.5">
                  {i < ticked ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-jp-brand-amber">
                      <Check strokeWidth={3.5} className="size-3 text-jp-surface" />
                    </span>
                  ) : (
                    <span className="size-4 shrink-0 rounded-[3px] border-2 border-jp-text-muted/60" />
                  )}
                  <span className="h-1.5 rounded-full bg-jp-ink-secondary/90" style={{ width }} />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** JiTpro's side of the bar ends on a diagonal: a fixed 3.5rem run centred on 58%, whatever the bar's height. */
const SPLIT = '58%';
const RUN = '1.75rem';

function ResponsibilityBar() {
  return (
    <div className="relative mx-auto mt-14 grid max-w-[62rem] overflow-hidden rounded-2xl md:mt-16 md:grid-cols-[58%_42%] md:bg-[color-mix(in_oklab,var(--jp-surface)_93%,var(--jp-surface-white))]">
      {/* From `md`: JiTpro's amber wash and edge, the team's slate edge, and the diagonal between them. */}
      <div aria-hidden="true" className="absolute inset-0 hidden md:block">
        <span
          className="absolute inset-0"
          style={{
            backgroundColor: amberOnNavy(16),
            clipPath: `polygon(0 0, calc(${SPLIT} + ${RUN}) 0, calc(${SPLIT} - ${RUN}) 100%, 0 100%)`,
          }}
        />
        <span
          className="absolute inset-y-0 left-0 rounded-l-2xl border-y border-l border-jp-brand-amber/85"
          style={{ width: `calc(${SPLIT} + ${RUN})`, clipPath: `polygon(0 0, 100% 0, calc(100% - 2 * ${RUN}) 100%, 0 100%)` }}
        />
        <span
          className="absolute inset-y-0 right-0 rounded-r-2xl border-y border-r border-jp-border/35"
          style={{ left: `calc(${SPLIT} - ${RUN})`, clipPath: `polygon(calc(2 * ${RUN}) 0, 100% 0, 100% 100%, 0 100%)` }}
        />
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="absolute inset-y-0 h-full overflow-visible"
          style={{ left: `calc(${SPLIT} - ${RUN})`, width: `calc(2 * ${RUN})` }}
        >
          <line x1="1" y1="0" x2="0" y2="1" vectorEffect="non-scaling-stroke" strokeWidth="1" style={{ stroke: 'var(--jp-brand-amber)' }} />
        </svg>
      </div>

      <p className="relative flex items-center gap-4 rounded-t-2xl border border-jp-brand-amber/85 bg-[color-mix(in_oklab,var(--jp-brand-amber)_16%,var(--jp-surface))] px-5 py-5 sm:gap-5 sm:px-7 md:rounded-none md:border-0 md:bg-transparent md:py-6 md:pr-14">
        <Layers aria-hidden="true" strokeWidth={1.5} className="size-9 shrink-0 text-jp-brand-amber sm:size-10" />
        <span aria-hidden="true" className="w-px self-stretch bg-jp-brand-amber/70" />
        <span className="font-heading text-[1.125rem] font-bold leading-[1.25] tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.375rem] xl:text-[1.5rem]">
          JiTpro provides the plan, priorities, and weekly guidance.
        </span>
      </p>
      <p className="relative flex items-center gap-4 rounded-b-2xl border border-t-0 border-jp-border/35 bg-[color-mix(in_oklab,var(--jp-surface)_93%,var(--jp-surface-white))] px-5 py-5 sm:gap-5 sm:px-7 md:rounded-none md:border-0 md:bg-transparent md:py-6 md:pl-14">
        <HardHat aria-hidden="true" strokeWidth={1.5} className="size-9 shrink-0 text-jp-text-primary sm:size-10" />
        <span aria-hidden="true" className="w-px self-stretch bg-jp-border/40" />
        <span className="font-heading text-[1.125rem] font-bold leading-[1.25] tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.375rem] xl:text-[1.5rem]">
          Your team executes the work.
        </span>
      </p>
    </div>
  );
}

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do" aria-labelledby="what-we-do-heading" className="relative isolate overflow-hidden bg-jp-surface">
      {/* The artwork's backdrop (§77.2): the window and crane at top right from `xl`, the desk and drawings along the foot. */}
      <img
        src={`${ART}-window-150.webp`}
        width={150}
        height={350}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-0 right-0 -z-10 hidden h-auto w-[clamp(7.5rem,10vw,10rem)] xl:block"
        style={{
          maskImage: 'linear-gradient(to left, black 45%, transparent), linear-gradient(to bottom, black 65%, transparent)',
          maskComposite: 'intersect',
          WebkitMaskImage: 'linear-gradient(to left, black 45%, transparent), linear-gradient(to bottom, black 65%, transparent)',
          WebkitMaskComposite: 'source-in',
        }}
      />
      <img
        src={`${ART}-desk-1672.webp`}
        srcSet={`${ART}-desk-960.webp 960w, ${ART}-desk-1672.webp 1672w`}
        sizes="100vw"
        width={1672}
        height={155}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[clamp(4.5rem,9vw,9.5rem)] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_55%)]"
      />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-[clamp(5.5rem,10vw,9rem)] sm:px-8 sm:pt-20 lg:px-10 xl:pt-24">
        <div className="grid gap-y-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.4fr)] xl:items-center xl:gap-x-[clamp(2rem,3.5vw,3.5rem)]">
          {/* ------------------------------------------------ the narrative */}
          <div className="max-w-[44rem] xl:max-w-none">
            {/* Authored in sentence case, uppercased in CSS (§7.7). */}
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-text-primary sm:text-sm">
              <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
              What we do
            </p>
            <h2
              id="what-we-do-heading"
              className="mt-5 font-heading text-[min(2.375rem,9.6vw)] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-text-primary sm:text-[3rem] xl:text-[clamp(2.375rem,3vw,3rem)]"
            >
              We do the work that gets your project ready.
            </h2>
            <span aria-hidden="true" className="mt-7 block h-1 w-16 rounded-full bg-jp-brand-amber" />
            <p className="mt-7 text-[1.125rem] leading-[1.55] text-pretty text-jp-text-secondary sm:text-[1.25rem]">
              We develop the detailed procurement plan your project needs, then provide weekly guidance so your team knows what
              to do, when to do it, and what&apos;s coming next.
            </p>
            <p className="mt-5 text-[1rem] leading-[1.6] text-pretty text-jp-text-secondary/85 sm:text-[1.0625rem]">
              Your people continue managing their subcontractors, approvals, paperwork, and procurement activities. JiTpro
              establishes the sequence, deadlines, and priorities that keep that work moving toward field readiness.
            </p>
          </div>

          {/* ------------------------------------------------ the graphic */}
          <div className="relative">
            <PlanPanel />

            {/* Below `md`: the connector between the stacked panels. */}
            <div aria-hidden="true" className="flex flex-col items-center gap-1.5 py-3 md:hidden">
              <span className="h-5 w-0.5 rounded-full bg-jp-brand-amber" />
              <CadenceLabel />
              <ArrowDown strokeWidth={2} className="size-5 text-jp-brand-amber" />
            </div>

            {/* From `md`: the guidance panel over the plan's empty lower edge (5rem), the connector to its left. */}
            <div className="md:-mt-20 md:grid md:grid-cols-[minmax(0,1fr)_70%]">
              <div aria-hidden="true" className="relative hidden md:block">
                <span className="absolute top-0 left-[30%] h-[6.4rem] w-[22%] rounded-bl-[1.25rem] border-b-2 border-l-2 border-jp-brand-amber [filter:drop-shadow(0_0_6px_var(--jp-brand-amber))]" />
                <div className="flex items-center pt-[6.4rem] pl-[4%]">
                  <CadenceLabel />
                  <span className="h-0.5 min-w-3 flex-1 bg-jp-brand-amber" />
                  <svg viewBox="0 0 8 10" className="h-2.5 w-2 shrink-0" style={{ fill: 'var(--jp-brand-amber)' }}>
                    <path d="M0 0 L8 5 L0 10 Z" />
                  </svg>
                </div>
              </div>
              <div className="relative z-20">
                <GuidancePanel />
              </div>
            </div>
          </div>
        </div>

        <ResponsibilityBar />

        <div className="mt-10 flex items-center justify-center gap-6 md:mt-12">
          <span aria-hidden="true" className="hidden h-px w-[clamp(2.5rem,5vw,5rem)] shrink-0 bg-jp-border/40 md:block" />
          <p className="min-w-0 max-w-[66rem] text-center font-heading text-[1.0625rem] font-semibold leading-[1.45] text-balance text-jp-text-primary sm:text-[1.25rem] xl:text-[1.1875rem]">
            JiTpro builds the plan, establishes the priorities, and provides the weekly guidance.{' '}
            <span className="text-jp-brand-amber">Your team executes the work.</span>
          </p>
          <span aria-hidden="true" className="hidden h-px w-[clamp(2.5rem,5vw,5rem)] shrink-0 bg-jp-border/40 md:block" />
        </div>
      </div>
    </section>
  );
}
