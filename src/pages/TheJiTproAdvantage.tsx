import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Gauge, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import {
  DEFAULT_INPUTS,
  LIMITS,
  PROJECT_CHOICES,
  calculate,
  formatContract,
  formatDollars,
  formatPct1,
  formatPoints,
  keptPctFromContractPct,
  keptSliderRange,
  normalize,
  type RetentionInputs,
} from '../content/advantageCalculator';
import {
  ADVANTAGE_META,
  CLOSING,
  COMPOUNDING,
  HERO,
  HOW_JITPRO,
  LEAKING_BUCKET,
  POSITION_OF_STRENGTH,
  PROFIT,
  RACE_TO_BOTTOM,
} from '../content/advantageContent';

/**
 * /the-jitpro-advantage (Design System §83, issue #95). First draft for
 * founder review. Not in navigation (the information architecture is to be
 * reviewed first).
 *
 * Seven sections alternating dark and light acts (§48.6). The hero reuses the
 * founder-supplied overhead JiTpro pit stop, with the JiTpro livery and crew
 * branding baked into the image (§83.3). Copy lives in src/content/advantageContent.ts; the profit
 * illustration's arithmetic in src/content/advantageCalculator.ts.
 */

const CONTAINER = 'mx-auto max-w-7xl px-6 sm:px-8 lg:px-10';

/** The site's primary action (as HomeFinalCTA, §48.1). */
const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-6 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:px-7 sm:text-base';

const EYEBROW_DARK = 'font-mono text-xs font-bold uppercase tracking-[0.24em] text-jp-brand-amber sm:text-sm';
const H2 = 'font-heading text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]';

/** The JiTpro pit stop: the founder-supplied overhead scene, its JiTpro livery and crew branding part of the image (§83.3). */
const PIT_STOP = `${import.meta.env.BASE_URL}assets/advantage/jitpro-pit-stop`;
const PIT_STOP_SRCSET = `${PIT_STOP}-720.webp 720w, ${PIT_STOP}-1100.webp 1100w, ${PIT_STOP}-1448.webp 1448w`;

/** From `xl`: the photograph's left edge blends into the hero's navy, horizontally only, across the strip of tarmac and
 *  crew left of the car's rear wing, so the whole car stays clear. Top, bottom and right stay crisp. */
const LEFT_BLEND: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, var(--jp-background) 0%, color-mix(in oklab, var(--jp-background) 70%, transparent) 40%, transparent 100%)',
};

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

/* -------------------------------------------------------------------------------------------- 1. hero */

function Hero() {
  return (
    <section
      aria-labelledby="advantage-heading"
      className="relative isolate overflow-hidden bg-jp-background xl:flex xl:min-h-[clamp(36rem,40vw,60rem)] xl:items-center"
    >
      {/* From `xl`: the JiTpro pit stop, anchored to the hero's right side, top to bottom. Its left edge blends into the
          navy; the type sits above it on the left. Decorative. */}
      {/* The box keeps the photograph's own 4:3 shape at the hero's height (never narrower than 56% of the width), so the
          scene is never trimmed from the sides: the car runs nearly edge to edge of it, rear wing to front wing. When the
          box is wider than 4:3, only crew at the top and bottom is trimmed. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[1448/1086] min-w-[56%] xl:block"
      >
        <img
          src={`${PIT_STOP}-1448.webp`}
          srcSet={PIT_STOP_SRCSET}
          sizes="60vw"
          width={1448}
          height={1086}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_44%]"
        />
        <div className="absolute inset-y-0 left-0 w-[10%]" style={LEFT_BLEND} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10 xl:py-10 2xl:py-16">
        <div className="max-w-[40rem] xl:max-w-[30rem]">
          <p className={EYEBROW_DARK}>{HERO.eyebrow}</p>
          <h1
            id="advantage-heading"
            className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-jp-text-primary sm:text-[3.5rem] xl:text-[clamp(2.5rem,3.1vw,3.75rem)]"
          >
            <span className="block">{HERO.headline[0]}</span> <span className="block text-jp-brand-amber">{HERO.headline[1]}</span>
          </h1>
          <div className="mt-7 max-w-[40rem] space-y-4 text-[1.125rem] leading-[1.6] text-jp-text-secondary sm:text-[1.25rem] xl:mt-6 xl:space-y-3 xl:text-[1.0625rem] xl:leading-[1.55] 2xl:text-[1.25rem]">
            <p className="font-heading font-semibold text-jp-text-primary">{HERO.paragraphs[0]}</p>
            <p>{HERO.paragraphs[1]}</p>
          </div>
          <div className="mt-9 sm:mt-10 xl:mt-8">
            {/* The call to action's own line: prominent, but a step below the h1. */}
            <p className="font-heading text-[1.375rem] font-extrabold leading-[1.2] tracking-[-0.015em] text-jp-text-primary sm:text-[1.625rem]">
              {HERO.ctaHeading}
            </p>
            <Link to="/contact" className={`mt-5 ${PRIMARY_BUTTON}`}>
              {HERO.action}
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* Below `xl`: the scene after the type, full width and crisp: the whole car, a little crew trimmed top and bottom. */}
      <div aria-hidden="true" className="pointer-events-none mt-10 sm:mt-12 xl:hidden">
        <img
          src={`${PIT_STOP}-1100.webp`}
          srcSet={PIT_STOP_SRCSET}
          sizes="100vw"
          width={1448}
          height={1086}
          alt=""
          decoding="async"
          className="block aspect-[3/2] h-auto w-full object-cover object-[50%_44%]"
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------------- 2. race to the bottom */

/**
 * True once the element has entered the viewport, then stays true. Under reduced motion, or without
 * IntersectionObserver, it is true from the first render, so the section shows its resolved state (§46.5).
 */
function useRevealed<T extends Element>(rootMargin = '0px 0px -18% 0px'): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(
    () =>
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const el = ref.current;
    if (revealed || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed, rootMargin]);
  return [ref, revealed];
}

/**
 * The section's one reveal timeline (§46.3): every delay in the section is read from here, in milliseconds after its
 * group enters the viewport. Text only: the artwork never moves.
 */
const RACE_TIMELINE = {
  intro: { eyebrow: 0, heading: 120, statement: 280 },
  /** The sacrifice group first, then the performance group: the eye reads the descent, then the climb. */
  groups: [0, 220] as const,
  closing: 0,
  fade: 700,
} as const;

/** A fade and short rise, resolved under reduced motion. Opacity only governs visibility: the text is always rendered. */
function reveal(shown: boolean, delay: number, className: string, style?: CSSProperties): { className: string; style: CSSProperties } {
  return {
    className: `${className} transition-[opacity,translate] ease-out motion-reduce:transition-none print:translate-y-0 print:opacity-100 ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
    }`,
    style: { ...style, transitionDuration: `${RACE_TIMELINE.fade}ms`, transitionDelay: `${delay}ms` },
  };
}

/**
 * The founder's artwork (§83.6), 1672 x 941. From `xl` the section is the artwork's own shape and everything on it is
 * placed in the approved mockup's pixels: `--u` is one mockup pixel at the current section width (the section is the
 * size container), so `calc(N * var(--u))` is N mockup pixels.
 */
/** The light colorway (§83.6, 2026-11-25). The dark artwork, race-to-the-bottom-background.webp, is kept unused. */
const RACE_ART = `${import.meta.env.BASE_URL}assets/advantage/race-to-the-bottom-background-light.webp`;
const RACE_U = { '--u': 'calc(100cqw / 1672)' } as CSSProperties;
/** Places an element at a mockup y (its box top), from `xl`. */
const at = (y: number) => ({ '--y': y }) as CSSProperties;
const AT_Y = 'xl:absolute xl:top-[calc(var(--y)*var(--u))]';

/** The artwork's sky and ground fade into the section's ivory (sampled from the artwork), so its edges never show. */
const RACE_FADE_TOP: CSSProperties = { backgroundImage: 'linear-gradient(180deg, var(--jp-surface-ivory) 0%, transparent 100%)' };
const RACE_FADE_BOTTOM: CSSProperties = { backgroundImage: 'linear-gradient(0deg, var(--jp-surface-ivory) 0%, transparent 100%)' };
/** The closing statement's flanking rules fade outward (the eyebrow's are short and solid). */
const RULE_FADE_LEFT: CSSProperties = { backgroundImage: 'linear-gradient(90deg, transparent 0%, var(--jp-brand-amber) 100%)' };
const RULE_FADE_RIGHT: CSSProperties = { backgroundImage: 'linear-gradient(270deg, transparent 0%, var(--jp-brand-amber) 100%)' };

/** Cut your price, then Sharpen your organization: the mockup's two groups, at their mockup x. */
const RACE_GROUP_X = [151, 1082] as const;
const RACE_GROUP_W = [406, 446] as const;

/** The economic argument, on the founder's light artwork, reproduced to the approved light mockup (§83.1, item 2). */
function RaceToTheBottom() {
  const R = RACE_TO_BOTTOM;
  const T = RACE_TIMELINE;
  const [headingRef, introShown] = useRevealed<HTMLHeadingElement>();
  const [groupsRef, groupsShown] = useRevealed<HTMLDivElement>();
  const [closingRef, closingShown] = useRevealed<HTMLParagraphElement>('0px 0px -4% 0px');

  return (
    <section aria-labelledby="race-heading" className="@container relative isolate overflow-hidden bg-jp-surface-ivory">
      <div style={RACE_U} className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 xl:aspect-[1672/941] xl:p-0">
        {/* The introduction, centred. */}
        <div className="px-6 text-center sm:px-8">
          <p
            style={at(86)}
            className={`${AT_Y} flex items-center justify-center gap-4 xl:inset-x-0 xl:gap-[calc(20*var(--u))]`}
          >
            <span aria-hidden="true" className="h-px w-8 bg-jp-brand-amber/70 sm:w-12 xl:h-[calc(2.5*var(--u))] xl:w-[calc(100*var(--u))]" />
            <span
              {...reveal(
                introShown,
                T.intro.eyebrow,
                'font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-amber-ink sm:text-sm xl:text-[length:calc(21*var(--u))] xl:leading-none xl:tracking-[0.12em]',
              )}
            >
              {R.eyebrow}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-jp-brand-amber/70 sm:w-12 xl:h-[calc(2.5*var(--u))] xl:w-[calc(100*var(--u))]" />
          </p>
          <h2
            id="race-heading"
            ref={headingRef}
            {...reveal(
              introShown,
              T.intro.heading,
              `mt-5 font-heading text-[2.125rem] font-bold leading-[1.08] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.875rem] ${AT_Y} xl:inset-x-0 xl:mt-0 xl:text-[length:calc(56*var(--u))] xl:leading-[calc(57*var(--u))] xl:tracking-normal xl:text-wrap`,
              at(131),
            )}
          >
            {R.heading.lines[0]} <br className="hidden xl:inline" />
            {R.heading.lines[1]} <span className="text-jp-amber-ink">{R.heading.emphasis}</span>
          </h2>
          <p
            {...reveal(
              introShown,
              T.intro.statement,
              `mx-auto mt-5 max-w-[36rem] text-[1.0625rem] leading-[1.6] text-jp-background sm:text-[1.1875rem] ${AT_Y} xl:inset-x-0 xl:mt-0 xl:max-w-[36em] xl:text-[length:max(16px,calc(20.1*var(--u)))] xl:leading-[1.54]`,
              at(271),
            )}
          >
            {R.statement}
          </p>
        </div>

        {/* The artwork. Below `xl`, full width between the introduction and the groups: whole from `sm`, and on a phone
            3:2, trimmed only from the left (bare cliff face) so the descent, the low point and the project stay large.
            From `xl`, the section itself. Decorative (§83.6); never animated. */}
        <div aria-hidden="true" className="pointer-events-none relative mt-10 sm:mt-12 xl:absolute xl:inset-0 xl:-z-10 xl:mt-0">
          <img
            src={RACE_ART}
            width={1672}
            height={941}
            alt=""
            loading="lazy"
            decoding="async"
            className="block aspect-[3/2] h-auto w-full object-cover object-right sm:aspect-[1672/941] xl:aspect-auto xl:h-full"
          />
          <div className="absolute inset-x-0 top-0 h-[14%] xl:h-[7%]" style={RACE_FADE_TOP} />
          <div className="absolute inset-x-0 bottom-0 h-[14%] xl:h-[7%]" style={RACE_FADE_BOTTOM} />
        </div>

        {/* The two groups: stacked (sacrifice first) on a phone, side by side from `md`, at their mockup places from `xl`. */}
        <div ref={groupsRef} className="mx-auto mt-10 grid max-w-3xl gap-12 px-6 sm:mt-12 sm:px-8 md:grid-cols-2 md:gap-x-10 md:gap-y-0 xl:absolute xl:inset-x-0 xl:top-[calc(470*var(--u))] xl:m-0 xl:block xl:h-[calc(262*var(--u))] xl:max-w-none xl:p-0">
          {R.comparison.map((group, i) => {
            const performance = group.tone === 'performance';
            return (
              <div
                key={group.tone}
                {...reveal(
                  groupsShown,
                  T.groups[i],
                  'md:row-span-5 md:grid md:grid-rows-subgrid xl:absolute xl:top-0 xl:left-[calc(var(--x)*var(--u))] xl:block xl:w-[calc(var(--w)*var(--u))]',
                  { '--x': RACE_GROUP_X[i], '--w': RACE_GROUP_W[i] } as CSSProperties,
                )}
              >
                <h3
                  className={`font-heading text-[1.625rem] font-bold leading-[1.2] tracking-[-0.015em] text-jp-background sm:text-[1.875rem] md:self-end xl:self-auto xl:text-[length:calc(35.5*var(--u))] xl:leading-[calc(40*var(--u))] xl:tracking-normal ${
                    performance ? '' : 'xl:text-jp-text-primary'
                  }`}
                >
                  {group.title}
                </h3>
                <div
                  aria-hidden="true"
                  className={`mt-4 h-[3px] w-20 xl:mt-[calc(18*var(--u))] xl:h-[calc(3*var(--u))] xl:w-[calc(85*var(--u))] ${
                    performance ? 'bg-jp-brand-amber' : 'bg-jp-warning-red'
                  }`}
                />
                <ul className="mt-5 space-y-2.5 xl:mt-[calc(15*var(--u))] xl:space-y-0">
                  {group.points.map((point) => (
                    <li
                      key={point}
                      className={`relative pl-7 text-[1.0625rem] leading-[1.5] xl:pl-[calc(38*var(--u))] xl:text-[length:max(16px,calc(20*var(--u)))] xl:leading-[calc(37*var(--u))] ${
                        performance ? 'text-jp-background' : 'text-jp-background xl:text-jp-text-primary'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute top-[0.55em] left-1.5 size-2.5 rounded-full xl:top-[calc(13*var(--u))] xl:left-[calc(9*var(--u))] xl:size-[calc(11*var(--u))] ${
                          performance ? 'bg-jp-brand-amber' : 'bg-jp-text-muted'
                        }`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <div aria-hidden="true" className="mt-5 h-px bg-jp-ink-secondary/25 xl:mt-[calc(14*var(--u))]" />
                <p
                  className={`mt-5 font-heading text-[1.3125rem] font-bold leading-[1.25] tracking-[-0.01em] sm:text-[1.4375rem] xl:mt-[calc(18*var(--u))] xl:text-[length:calc(27*var(--u))] xl:leading-[calc(30*var(--u))] xl:tracking-normal ${
                    performance ? 'text-jp-amber-ink' : 'text-jp-background'
                  }`}
                >
                  {group.outcome}
                </p>
              </div>
            );
          })}
        </div>

        {/* The closing statement between amber rules that fade outward. */}
        <div
          style={at(785)}
          className={`mt-16 flex items-center justify-center gap-4 px-6 sm:mt-20 sm:gap-6 sm:px-8 ${AT_Y} xl:inset-x-0 xl:mt-0 xl:gap-[calc(45*var(--u))] xl:p-0`}
        >
          <span aria-hidden="true" className="h-0.5 w-8 shrink-0 sm:w-20 xl:h-[calc(3*var(--u))] xl:w-[calc(300*var(--u))]" style={RULE_FADE_LEFT} />
          <p
            ref={closingRef}
            {...reveal(
              closingShown,
              T.closing,
              'text-center font-heading text-[1.625rem] font-extrabold italic leading-[1.2] tracking-[-0.015em] text-balance text-jp-background sm:text-[2rem] xl:text-[length:calc(37.5*var(--u))] xl:leading-[calc(44*var(--u))] xl:tracking-normal xl:whitespace-nowrap',
            )}
          >
            {R.closing.before}
            <span className="text-jp-amber-ink">{R.closing.emphasis}</span>
            {R.closing.after}
          </p>
          <span aria-hidden="true" className="h-0.5 w-8 shrink-0 sm:w-20 xl:h-[calc(3*var(--u))] xl:w-[calc(300*var(--u))]" style={RULE_FADE_RIGHT} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------- 3. profit illustration */

/* ------------------------------------------------------------------------ the leaking bucket (before the calculator) */

/** The leaking bucket (§83.5): the project holds the profit; preventable disruption is the leaks. Decorative image. */
const BUCKET = `${import.meta.env.BASE_URL}assets/advantage/leaking-bucket`;
const BUCKET_SRCSET = `${BUCKET}-800.webp 800w, ${BUCKET}-1200.webp 1200w, ${BUCKET}-1774.webp 1774w`;

/** From `xl`: the navy behind the type, strongest at the left, clear well before the bucket. The photograph's own left
 *  side is this navy, so the two meet without a seam. */
const BUCKET_SHADE: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, var(--jp-background) 0%, color-mix(in oklab, var(--jp-background) 85%, transparent) 28%, color-mix(in oklab, var(--jp-background) 40%, transparent) 42%, transparent 52%)',
};

/** Stop the leaks before chasing more revenue: one full-bleed photographic section, then the transition into the calculator. */
function LeakingBucket() {
  const L = LEAKING_BUCKET;
  return (
    <section aria-labelledby="bucket-heading" className="bg-jp-background">
      {/* The statement over the photograph. From `xl` the photograph spans the full width, drawn at its own proportions
          and anchored right (the bucket on the right, open navy on the left); below `xl` it follows the statement,
          cropped to the bucket. Crisp edges, no vignette. */}
      <div className="relative isolate overflow-hidden xl:flex xl:min-h-[min(50vw,60rem)] xl:items-center">
        <img
          src={`${BUCKET}-1774.webp`}
          srcSet={BUCKET_SRCSET}
          sizes="100vw"
          width={1774}
          height={887}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-y-0 right-0 -z-10 hidden h-full w-auto max-w-none xl:block"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" style={BUCKET_SHADE} />

        <div className={`w-full ${CONTAINER} pt-16 sm:pt-20 xl:py-20`}>
          <div className="max-w-[40rem] xl:max-w-[34rem] 2xl:max-w-[32rem]">
            <p className={EYEBROW_DARK}>{L.eyebrow}</p>
            <h2
              id="bucket-heading"
              className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance text-jp-text-primary sm:text-[3.25rem] xl:text-[clamp(3rem,3.6vw,4.25rem)]"
            >
              {L.heading}
            </h2>
            <p className="mt-6 font-heading text-[1.25rem] font-semibold leading-[1.4] text-jp-text-primary sm:text-[1.4375rem]">{L.subheading}</p>
            <p className="mt-8 border-l-4 border-jp-brand-amber pl-5 font-heading text-[1.375rem] font-extrabold leading-[1.3] tracking-[-0.015em] text-jp-brand-amber sm:text-[1.625rem]">
              {L.principle}
            </p>
          </div>
        </div>

        <img
          src={`${BUCKET}-1200.webp`}
          srcSet={BUCKET_SRCSET}
          sizes="(min-width: 640px) 120vw, 160vw"
          width={1774}
          height={887}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="mt-10 block aspect-[4/3] w-full object-cover object-right sm:aspect-[16/9] xl:hidden"
        />
      </div>

      {/* The explanation, in three short columns, then growth: on the same navy, directly beneath the photograph. */}
      <div className={`${CONTAINER} pt-12 pb-14 sm:pt-14 lg:pt-16 lg:pb-16`}>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {L.columns.map((column) => (
            <div key={column.label}>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-jp-text-secondary sm:text-[0.8125rem]">{column.label}</p>
              <div className="mt-4 space-y-3 text-[1.0625rem] leading-[1.65] text-jp-text-secondary">
                {'emphasis' in column && <p className="font-heading font-semibold leading-[1.5] text-jp-text-primary">{column.emphasis}</p>}
                {column.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {'closing' in column && <p className="pt-1 font-heading text-[1.1875rem] font-extrabold leading-[1.35] text-jp-text-primary">{column.closing}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-jp-border/15 pt-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-16 lg:pt-12">
          <div>
            <p className="text-[1.0625rem] leading-[1.6] text-jp-text-secondary">{L.growth.lines.join(' ')}</p>
            <p className="mt-3 font-heading text-[1.625rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-jp-text-primary sm:text-[1.875rem]">{L.growth.statement}</p>
          </div>
          <p className="text-[1.0625rem] leading-[1.65] text-jp-text-secondary sm:text-[1.125rem]">{L.growth.body}</p>
        </div>

        {/* The transition into the calculator directly below (which carries no heading of its own). */}
        <div className="mx-auto mt-16 max-w-[46rem] text-center sm:mt-20">
          <h3 className="font-heading text-[1.875rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance text-jp-text-primary sm:text-[2.375rem]">
            {L.transition.heading}
          </h3>
          <p className="mt-5 text-[1.0625rem] leading-[1.65] text-jp-text-secondary sm:text-[1.1875rem]">{L.transition.text}</p>
        </div>
      </div>
    </section>
  );
}

type InputKey = keyof RetentionInputs;

const FIELD_LABEL = 'font-heading text-[1.0625rem] font-semibold leading-snug text-jp-text-primary';
const MICRO_LABEL = 'font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-text-secondary sm:text-[0.8125rem]';
/** The selected value beside each question, in Brand Amber. */
const VALUE = 'shrink-0 font-heading text-[1.375rem] font-extrabold whitespace-nowrap tabular-nums text-jp-brand-amber sm:text-[1.5rem]';
const HINT = 'mt-0.5 text-[0.875rem] leading-[1.45] text-jp-text-muted';
const SLIDER =
  'mt-2.5 h-2 w-full cursor-pointer accent-jp-brand-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jp-text-primary disabled:cursor-not-allowed disabled:opacity-40';

/** One result row: the label with its share of the contract value right after it, on the left; the dollar figure
 *  right-aligned in its own column. */
function StoryLine({ label, value, pct, tone }: { label: string; value: number; pct: number; tone: 'plain' | 'muted' }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-jp-border/15 pb-3">
      <dt className="min-w-0">
        <span className={MICRO_LABEL}>{label}</span>
        <span className="ml-2.5 font-heading text-[1rem] font-bold whitespace-nowrap tabular-nums text-jp-brand-amber sm:text-[1.0625rem]">{formatPct1(pct)}</span>
      </dt>
      <dd
        className={`shrink-0 text-right font-heading text-[1.625rem] font-extrabold tabular-nums tracking-[-0.02em] transition-colors sm:text-[1.875rem] ${
          tone === 'muted' ? 'text-jp-text-secondary' : 'text-jp-text-primary'
        }`}
      >
        {formatDollars(value)}
      </dd>
    </div>
  );
}

type ProjectChoice = number | 'custom';

function ProfitIllustration() {
  const [inputs, setInputs] = useState<RetentionInputs>(DEFAULT_INPUTS);
  const [choice, setChoice] = useState<ProjectChoice>(DEFAULT_INPUTS.projects);
  const [customProjects, setCustomProjects] = useState(12);
  const [customDraft, setCustomDraft] = useState<string | null>(null);
  const projects = choice === 'custom' ? customProjects : choice;
  const result = useMemo(() => calculate({ ...inputs, projects }), [inputs, projects]);
  const set = (key: InputKey, value: number) => setInputs((current) => normalize({ ...current, [key]: value }));
  const reset = () => {
    setInputs(DEFAULT_INPUTS);
    setChoice(DEFAULT_INPUTS.projects);
  };
  const contractId = useId();
  const expectedId = useId();
  const keptId = useId();
  const improvementId = useId();
  const projectsId = useId();
  const customId = useId();
  const hasGap = result.shortfall > 0;
  const keptRange = keptSliderRange(inputs.expectedPct);
  /** The share of the estimate kept, as a whole percent for the plain-English line. */
  const keptShare = Math.max(1, Math.round(inputs.keptPct));

  return (
    <>
      {/* Stage 1: one project, compact enough to see whole on a 1440 × 900 screen. */}
      <section aria-labelledby="profit-heading" className="bg-jp-surface py-10 sm:py-12 lg:py-10">
        <div className={CONTAINER}>
          <p id="profit-heading" className={EYEBROW_DARK}>
            {PROFIT.eyebrow}
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-7">
            <form aria-label="Your project" onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6 rounded-2xl border border-jp-border/15 bg-jp-background/60 p-6 sm:p-7 lg:justify-between">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={contractId} className={FIELD_LABEL}>
                    {PROFIT.fields.contractValue}
                  </label>
                  <output htmlFor={contractId} className={VALUE}>
                    {formatContract(inputs.contractValue)}
                  </output>
                </div>
                <input
                  id={contractId}
                  type="range"
                  {...LIMITS.contractValue}
                  value={inputs.contractValue}
                  aria-valuetext={formatContract(inputs.contractValue)}
                  onChange={(event) => set('contractValue', Number(event.target.value))}
                  className={SLIDER}
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={expectedId} className={FIELD_LABEL}>
                    {PROFIT.fields.expectedProfit}
                  </label>
                  <output htmlFor={expectedId} className={VALUE}>
                    {formatPct1(inputs.expectedPct)}
                  </output>
                </div>
                <p className={HINT}>{PROFIT.expectedHint}</p>
                <input
                  id={expectedId}
                  type="range"
                  {...LIMITS.expectedPct}
                  value={inputs.expectedPct}
                  aria-valuetext={`${formatPct1(inputs.expectedPct)}, ${formatDollars(result.expectedProfit)}`}
                  onChange={(event) => set('expectedPct', Number(event.target.value))}
                  className={SLIDER}
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={keptId} className={FIELD_LABEL}>
                    {PROFIT.fields.keptPct}
                  </label>
                  {/* What was kept as a share of the contract value (kept dollars ÷ contract value). */}
                  <output htmlFor={keptId} className={VALUE}>
                    {formatPct1(result.actualPctOfContract)}
                  </output>
                </div>
                <p className={HINT} aria-live="polite">
                  {result.actualProfit > 0 ? PROFIT.kept.positive(keptShare) : result.actualProfit === 0 ? PROFIT.kept.zero : PROFIT.kept.negative}
                </p>
                <input
                  id={keptId}
                  type="range"
                  {...keptRange}
                  value={Math.round(result.actualPctOfContract * 10) / 10}
                  aria-valuetext={`${formatPct1(result.actualPctOfContract)} of the contract value, ${formatDollars(result.actualProfit)}`}
                  onChange={(event) => set('keptPct', keptPctFromContractPct(Number(event.target.value), inputs.expectedPct))}
                  className={SLIDER}
                />
                <div aria-hidden="true" className="mt-1 flex justify-between text-[0.8125rem] text-jp-text-muted">
                  <span>{PROFIT.kept.lostEnd}</span>
                  <span>{PROFIT.kept.keptEnd}</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={improvementId} className={FIELD_LABEL}>
                    {PROFIT.improvement.question}
                  </label>
                  <output htmlFor={improvementId} className={VALUE}>
                    {formatPoints(result.improvementPts)}
                  </output>
                </div>
                <p className={HINT}>{hasGap ? PROFIT.improvement.helper : PROFIT.improvement.disabled}</p>
                <input
                  id={improvementId}
                  type="range"
                  min={LIMITS.improvementPts.min}
                  max={Math.max(result.maxImprovementPts, LIMITS.improvementPts.step)}
                  step={LIMITS.improvementPts.step}
                  value={result.improvementPts}
                  disabled={!hasGap}
                  aria-valuetext={`${formatPoints(result.improvementPts)}, ${formatDollars(result.additionalProfit)}`}
                  onChange={(event) => set('improvementPts', Number(event.target.value))}
                  className={SLIDER}
                />
              </div>
            </form>

            <div className="flex flex-col rounded-2xl border border-jp-border/15 bg-jp-background p-6 sm:p-7" aria-live="polite">
              <dl className="space-y-3">
                <StoryLine label={PROFIT.results.planned} value={result.expectedProfit} pct={result.plannedPctOfContract} tone="plain" />
                <StoryLine label={PROFIT.results.actual} value={result.actualProfit} pct={result.actualPctOfContract} tone="muted" />
                <StoryLine label={PROFIT.results.could} value={result.couldHaveMade} pct={result.couldPctOfContract} tone="plain" />
              </dl>
              {/* The gap, as one compact line. */}
              <p className="mt-3 mb-5 text-[0.9375rem] leading-[1.5] text-jp-text-secondary">
                {hasGap ? (
                  <>
                    <span className="font-semibold text-jp-text-primary">
                      {PROFIT.shortfall.label}: {formatDollars(result.shortfall)}.
                    </span>{' '}
                    {result.shortfallPctOfExpected !== null && PROFIT.shortfall.shareOfExpected(result.shortfallPctOfExpected)}
                  </>
                ) : result.favorable > 0 ? (
                  PROFIT.shortfall.favorable
                ) : (
                  PROFIT.shortfall.even
                )}
              </p>
              {/* The focus: what keeping more is worth on this project. */}
              <div
                className="rounded-xl border border-jp-brand-amber/40 p-5 sm:p-6 lg:mt-auto"
                style={{ backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 8%, var(--jp-background))' }}
              >
                <p className="font-heading leading-none">
                  <span className="block text-[2.75rem] font-extrabold tabular-nums tracking-[-0.035em] text-jp-brand-amber sm:text-[3.5rem]">
                    {formatDollars(result.additionalProfit)}
                  </span>
                  <span className="mt-2 block text-[1.5rem] font-extrabold tracking-[-0.02em] text-jp-text-primary sm:text-[1.75rem]">{PROFIT.results.more}</span>
                </p>
                <p className="mt-3 text-[1rem] leading-[1.5] text-jp-text-secondary">{PROFIT.results.moreNote}</p>
              </div>
            </div>
          </div>

          {/* Reset and the disclaimer, quietly beneath. */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
            <button
              type="button"
              onClick={reset}
              className="shrink-0 self-start rounded py-1 text-sm font-semibold text-jp-text-secondary underline decoration-jp-border/40 underline-offset-4 transition-colors hover:text-jp-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary motion-reduce:transition-none"
            >
              Reset to the example
            </button>
            <p className="text-[0.8125rem] leading-[1.55] text-jp-text-muted">{PROFIT.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* Stage 2: the year. Its own section on the deeper navy, with a soft amber glow, so scrolling into it reads as
          the next step: from one project to the whole company. */}
      <section aria-labelledby="annual-heading" className="relative isolate overflow-hidden bg-jp-background py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_35%,color-mix(in_oklab,var(--jp-brand-amber)_10%,transparent),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <div className="overflow-hidden rounded-2xl border border-jp-brand-amber/35 bg-jp-background">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
              <div className="p-6 sm:p-8 lg:p-10">
                <h2 id="annual-heading" className="font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-text-primary sm:text-[2.25rem]">
                  {PROFIT.annual.heading}
                </h2>
                <label htmlFor={projectsId} className={`mt-6 block ${FIELD_LABEL}`}>
                  {PROFIT.annual.question}
                </label>
                <select
                  id={projectsId}
                  value={choice === 'custom' ? 'custom' : String(choice)}
                  onChange={(event) => setChoice(event.target.value === 'custom' ? 'custom' : Number(event.target.value))}
                  className="mt-3 w-full rounded-xl border border-jp-border/25 bg-jp-surface px-4 py-3 font-heading text-[1.125rem] font-bold text-jp-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary sm:w-auto sm:min-w-[16rem]"
                >
                  {PROJECT_CHOICES.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'project' : 'projects'}
                    </option>
                  ))}
                  <option value="custom">{PROFIT.annual.custom}</option>
                </select>
                {choice === 'custom' && (
                  <div className="mt-4">
                    <label htmlFor={customId} className="text-[0.9375rem] text-jp-text-secondary">
                      {PROFIT.annual.customLabel}
                    </label>
                    <input
                      id={customId}
                      type="number"
                      inputMode="numeric"
                      min={LIMITS.projects.min}
                      max={LIMITS.projects.max}
                      step={1}
                      value={customDraft ?? String(customProjects)}
                      onChange={(event) => {
                        setCustomDraft(event.target.value);
                        const n = Number(event.target.value);
                        if (event.target.value !== '' && Number.isFinite(n)) setCustomProjects(normalize({ ...DEFAULT_INPUTS, projects: n }).projects);
                      }}
                      onBlur={() => setCustomDraft(null)}
                      className="mt-2 block w-32 rounded-xl border border-jp-border/25 bg-jp-surface px-4 py-2.5 font-heading text-[1.125rem] font-bold tabular-nums text-jp-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary"
                    />
                  </div>
                )}
              </div>
              <div
                className="flex flex-col justify-center border-t border-jp-brand-amber/25 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10"
                style={{ backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 10%, var(--jp-background))' }}
                aria-live="polite"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-jp-brand-amber sm:text-sm">{PROFIT.annual.label}</p>
                <p className="mt-3 font-heading text-[3.5rem] font-extrabold leading-none tabular-nums tracking-[-0.04em] text-jp-brand-amber sm:text-[5rem] lg:text-[clamp(4.5rem,6vw,6rem)]">
                  {formatDollars(result.annualAdditional)}
                </p>
                <p className="mt-3 font-heading text-[1.25rem] font-bold text-jp-text-primary">{PROFIT.annual.caption}</p>
                <p className="mt-2 text-[1rem] leading-[1.55] text-jp-text-secondary">{PROFIT.annual.perProject(formatDollars(result.additionalProfit), result.projects)}</p>
                <p className="mt-5 text-[0.875rem] leading-[1.55] text-jp-text-muted">{PROFIT.annual.assumption}</p>
              </div>
            </div>
          </div>

          {/* What the money could do, and where it comes from. */}
          <div className="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <h3 className="font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-text-primary sm:text-[2.25rem]">{PROFIT.closing.heading}</h3>
              <ul className="mt-6 space-y-3">
                {PROFIT.closing.uses.map((use) => (
                  <li key={use} className="flex gap-3 font-heading text-[1.125rem] font-semibold text-jp-text-primary">
                    <span aria-hidden="true" className="mt-[0.6rem] size-2 shrink-0 rounded-full bg-jp-brand-amber" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:self-center">
              <p className="border-l-4 border-jp-brand-amber pl-5 font-heading text-[1.5rem] font-extrabold leading-[1.3] tracking-[-0.015em] text-jp-text-primary sm:text-[1.75rem]">
                {PROFIT.closing.statement}
              </p>
              <p className="mt-5 text-[1.0625rem] leading-[1.65] text-jp-text-secondary">{PROFIT.closing.method}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------------- 4. position of strength */

/** The judo throw (§83.4): strength from balance, leverage, timing and control. Decorative; the copy carries the meaning. */
const JUDO = `${import.meta.env.BASE_URL}assets/advantage/judo-throw`;

function PositionOfStrength() {
  return (
    <section aria-labelledby="strength-heading" className="bg-jp-surface-white py-16 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        {/* The idea: the headline, and the introduction beside it from `lg`. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 id="strength-heading" className={`max-w-[18ch] ${H2} text-jp-background`}>
            {POSITION_OF_STRENGTH.heading}
          </h2>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.65] text-jp-ink-secondary sm:text-[1.1875rem] lg:mt-0 lg:pb-2">{POSITION_OF_STRENGTH.intro}</p>
        </div>

        {/* The photograph, large, beside the five practices. */}
        <div className="mt-10 grid items-center gap-8 sm:mt-12 lg:mt-14 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] xl:gap-14">
          <div className="max-w-[48rem] overflow-hidden rounded-2xl bg-jp-surface-light xl:max-w-none">
            <img
              src={`${JUDO}-1254.webp`}
              srcSet={`${JUDO}-640.webp 640w, ${JUDO}-900.webp 900w, ${JUDO}-1254.webp 1254w`}
              sizes="(min-width: 1280px) 680px, (min-width: 832px) 768px, 100vw"
              width={1254}
              height={1254}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="block aspect-[5/4] w-full object-cover object-[50%_52%]"
            />
          </div>
          <ol className="border-t border-jp-ink-secondary/20">
            {POSITION_OF_STRENGTH.practices.map(({ title, body }, i) => (
              <li key={title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-jp-ink-secondary/20 py-4 sm:py-5">
                <span aria-hidden="true" className="pt-0.5 font-mono text-sm font-bold tracking-[0.1em] text-jp-ink-secondary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-[1.125rem] font-bold leading-[1.3] text-jp-background sm:text-[1.1875rem]">{title}</h3>
                  <p className="mt-1 text-[1rem] leading-[1.55] text-jp-ink-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* What stronger execution makes possible: one navy band, the four choices in a row from `lg`. */}
        <aside aria-labelledby="choices-heading" className="mt-10 rounded-2xl bg-jp-background p-7 sm:mt-12 sm:p-9 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-center lg:gap-12 lg:p-10">
          <div>
            <h3 id="choices-heading" className="font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-text-primary sm:text-[2rem]">
              {POSITION_OF_STRENGTH.choicesHeading}
            </h3>
            <p className="mt-3 text-[1rem] leading-[1.6] text-jp-text-secondary sm:text-[1.0625rem]">{POSITION_OF_STRENGTH.choicesIntro}</p>
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:mt-0">
            {POSITION_OF_STRENGTH.choices.map((choice) => (
              <li key={choice} className="flex gap-3 font-heading text-[1.0625rem] font-semibold leading-[1.45] text-jp-text-primary">
                <span aria-hidden="true" className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-jp-brand-amber" />
                <span>{choice}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------------- 5. how JiTpro creates */

const CONCEPT_ICONS: Record<string, LucideIcon> = { Clarity: Eye, Control: ShieldCheck, Coordination: Users, Performance: Gauge };

function HowJiTpro() {
  return (
    <section aria-labelledby="how-heading" className="bg-jp-background py-16 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        <h2 id="how-heading" className={`${H2} text-jp-text-primary`}>
          {HOW_JITPRO.heading}
        </h2>
        <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-jp-text-secondary sm:text-[1.125rem]">{HOW_JITPRO.intro}</p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_JITPRO.concepts.map(({ title, body }) => {
            const Icon = CONCEPT_ICONS[title];
            return (
              <li key={title} className="rounded-2xl border border-jp-border/15 bg-jp-surface p-6 sm:p-7">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-7 text-jp-brand-amber" />
                <h3 className="mt-5 font-heading text-[1.375rem] font-extrabold tracking-[-0.015em] text-jp-text-primary">{title}</h3>
                <p className="mt-2 text-[1rem] leading-[1.6] text-jp-text-secondary">{body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------- 6. compounding advantage */

function Compounding() {
  return (
    <section aria-labelledby="compounding-heading" className="bg-jp-surface-light py-16 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        <h2 id="compounding-heading" className={`${H2} text-jp-background`}>
          {COMPOUNDING.heading}
        </h2>
        <ol className="mt-12 grid gap-4 lg:grid-cols-4 lg:gap-0">
          {COMPOUNDING.steps.map((step, i) => (
            <li key={step} className="relative flex items-center gap-4 lg:block">
              <div
                className={`flex-1 rounded-2xl border p-6 lg:min-h-[9.5rem] ${i < COMPOUNDING.steps.length - 1 ? 'lg:mr-6' : ''} ${
                  i === COMPOUNDING.steps.length - 1 ? 'border-jp-background bg-jp-background text-jp-text-primary' : 'border-jp-ink-secondary/20 bg-jp-surface-white text-jp-background'
                }`}
              >
                <p className={`font-mono text-sm font-bold tracking-[0.16em] ${i === COMPOUNDING.steps.length - 1 ? 'text-jp-brand-amber' : 'text-jp-ink-secondary'}`}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-3 font-heading text-[1.25rem] font-bold leading-[1.25]">{step}</p>
              </div>
              {i < COMPOUNDING.steps.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="hidden size-5 text-jp-ink-secondary lg:absolute lg:top-1/2 lg:right-0.5 lg:block lg:-translate-y-1/2"
                />
              )}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-14 max-w-[40ch] text-center font-heading text-[1.5rem] font-semibold leading-[1.3] tracking-[-0.015em] text-balance text-jp-ink-secondary sm:text-[2rem]">
          <span className="block font-extrabold text-jp-background">{COMPOUNDING.statement[0]}</span> <span className="block">{COMPOUNDING.statement[1]}</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------- 7. closing */

function Closing() {
  return (
    <section aria-labelledby="closing-heading" className="relative isolate overflow-hidden bg-jp-background py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_70%_at_50%_100%,color-mix(in_oklab,var(--jp-brand-amber)_12%,transparent),transparent_70%)]"
      />
      <div className={`relative ${CONTAINER} sm:text-center`}>
        <h2 id="closing-heading" className={`${H2} text-jp-text-primary sm:mx-auto sm:max-w-[24ch]`}>
          <span className="block">{CLOSING.heading[0]}</span> <span className="block text-jp-brand-amber">{CLOSING.heading[1]}</span>
        </h2>
        <div className="mt-7 space-y-4 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:mx-auto sm:max-w-[58ch] sm:text-[1.125rem]">
          {CLOSING.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="font-heading font-semibold text-jp-text-primary">{CLOSING.lead}</p>
          <p>{CLOSING.body}</p>
        </div>
        <p className="mt-9 font-heading text-[1.5rem] font-extrabold tracking-[-0.02em] text-jp-text-primary sm:text-[1.875rem]">{CLOSING.statement}</p>
        <div className="mt-8">
          <Link to="/contact" className={`${PRIMARY_BUTTON} w-full max-w-md sm:w-auto`}>
            {CLOSING.action}
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TheJiTproAdvantage() {
  usePageMeta(ADVANTAGE_META.title, ADVANTAGE_META.description);
  return (
    <>
      <Hero />
      <RaceToTheBottom />
      <LeakingBucket />
      <ProfitIllustration />
      <PositionOfStrength />
      <HowJiTpro />
      <Compounding />
      <Closing />
    </>
  );
}
