import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ClipboardList, Crosshair, Users, type LucideIcon } from 'lucide-react';
import {
  DEFAULT_INPUTS,
  LIMITS,
  PROJECT_CHOICES,
  calculate,
  formatContract,
  formatDollars,
  formatPct1,
  keptPctFromContractPct,
  keptSliderRange,
  normalize,
  type RetentionInputs,
} from '../content/advantageCalculator';
import { fitFigure } from '../content/advantageFigures';
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

/** Cut your price, then Improve your performance: the mockup's two groups, at their mockup x. */
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

/** The native range handle's width. The handle's centre travels from half a handle in from each end of the track, so the
 *  label below it is placed on that same span (Design System §83.1, Decision Log 2026-11-27). */
const THUMB_PX = 16;

/** A small percentage centred beneath a slider's handle, driven by the slider's own value so the two move as one. */
function HandleLabel({ value, min, max, dimmed = false, children }: { value: number; min: number; max: number; dimmed?: boolean; children: string }) {
  const fraction = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
  return (
    <div aria-hidden="true" className="relative mt-2 h-[1.125rem]">
      <span
        className={`absolute top-0 -translate-x-1/2 font-heading text-[0.8125rem] leading-[1.125rem] font-bold whitespace-nowrap tabular-nums text-jp-brand-amber ${dimmed ? 'opacity-40' : ''}`}
        style={{ left: `calc(${THUMB_PX / 2}px + (100% - ${THUMB_PX}px) * ${fraction})` }}
      >
        {children}
      </span>
    </div>
  );
}

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
        style={fitFigure(formatDollars(value), 55)}
        className={`shrink-0 text-right font-heading text-[length:min(1.625rem,var(--fig-fit))] font-extrabold whitespace-nowrap tabular-nums tracking-[-0.02em] transition-colors sm:text-[length:min(1.875rem,var(--fig-fit))] ${
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
  /** The kept slider's position: the kept share of the contract value, in tenths. */
  const keptValue = Math.round(result.actualPctOfContract * 10) / 10;
  /** The recovery slider's position, in tenths (the default is the exact $137,500 ratio, about 73.5%). */
  const recoveryValue = Math.round(result.recoveryPct * 10) / 10;
  /** The share of the estimate kept, as a whole percent for the plain-English line. */

  return (
    <>
      {/* Stage 1: one project, compact enough to see whole on a 1440 × 900 screen. */}
      <section aria-labelledby="profit-heading" className="bg-jp-surface py-10 sm:py-12 lg:py-10">
        <div className={CONTAINER}>
          <p id="profit-heading" className={EYEBROW_DARK}>
            {PROFIT.eyebrow}
          </p>

          <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-7">
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
                  {/* The estimated profit in dollars; the margin rides beneath the handle. */}
                  <output htmlFor={expectedId} className={VALUE}>
                    {formatDollars(result.expectedProfit)}
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
                <HandleLabel value={inputs.expectedPct} min={LIMITS.expectedPct.min} max={LIMITS.expectedPct.max}>
                  {formatPct1(inputs.expectedPct)}
                </HandleLabel>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={keptId} className={FIELD_LABEL}>
                    {PROFIT.fields.keptPct}
                  </label>
                  {/* The kept profit in dollars; its share of the contract value rides beneath the handle. */}
                  <output htmlFor={keptId} className={VALUE}>
                    {formatDollars(result.actualProfit)}
                  </output>
                </div>
                <p className={HINT} aria-live="polite">
                  {PROFIT.kept.sentence(result)}
                </p>
                <input
                  id={keptId}
                  type="range"
                  {...keptRange}
                  value={keptValue}
                  aria-valuetext={`${formatPct1(result.actualPctOfContract)} of the contract value, ${formatDollars(result.actualProfit)}`}
                  onChange={(event) => set('keptPct', keptPctFromContractPct(Number(event.target.value), inputs.expectedPct))}
                  className={SLIDER}
                />
                {/* Kept dollars ÷ contract value × 100: a share of the contract, not of the estimate. */}
                <HandleLabel value={keptValue} min={keptRange.min} max={keptRange.max}>
                  {formatPct1(result.actualPctOfContract)}
                </HandleLabel>
                <div aria-hidden="true" className="mt-0.5 flex justify-between text-[0.8125rem] text-jp-text-muted">
                  <span>{PROFIT.kept.lostEnd}</span>
                  <span>{PROFIT.kept.keptEnd}</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={improvementId} className={FIELD_LABEL}>
                    {PROFIT.improvement.question}
                  </label>
                  {/* The additional profit in dollars; the share of the shortfall rides beneath the handle. */}
                  <output htmlFor={improvementId} className={VALUE}>
                    {formatDollars(result.additionalProfit)}
                  </output>
                </div>
                <p className={HINT}>{hasGap ? PROFIT.improvement.helper : PROFIT.improvement.disabled}</p>
                <input
                  id={improvementId}
                  type="range"
                  {...LIMITS.recoveryPct}
                  value={recoveryValue}
                  disabled={!hasGap}
                  aria-valuetext={`${formatPct1(result.recoveryPct)} of the lost profit, ${formatDollars(result.additionalProfit)}`}
                  onChange={(event) => set('recoveryPct', Number(event.target.value))}
                  className={SLIDER}
                />
                {/* A share of the shortfall, not of the contract value. Dimmed with the slider when there is no gap. */}
                <HandleLabel value={recoveryValue} min={LIMITS.recoveryPct.min} max={LIMITS.recoveryPct.max} dimmed={!hasGap}>
                  {formatPct1(result.recoveryPct)}
                </HandleLabel>
              </div>
            </form>

            <div className="@container flex flex-col rounded-2xl border border-jp-border/15 bg-jp-background p-6 sm:p-7" aria-live="polite">
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
                className="@container rounded-xl border border-jp-brand-amber/40 p-5 sm:p-6 lg:mt-auto"
                style={{ backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 8%, var(--jp-background))' }}
              >
                <p className="font-heading leading-none">
                  <span
                    style={fitFigure(formatDollars(result.additionalProfit), 100)}
                    className="block text-[length:min(2.75rem,var(--fig-fit))] font-extrabold whitespace-nowrap tabular-nums tracking-[-0.035em] text-jp-brand-amber sm:text-[length:min(3.5rem,var(--fig-fit))]"
                  >
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
            <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
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
                className="@container flex flex-col justify-center border-t border-jp-brand-amber/25 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10"
                style={{ backgroundColor: 'color-mix(in oklab, var(--jp-brand-amber) 10%, var(--jp-background))' }}
                aria-live="polite"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-jp-brand-amber sm:text-sm">{PROFIT.annual.label}</p>
                <p
                  style={fitFigure(formatDollars(result.annualAdditional), 100)}
                  className="mt-3 font-heading text-[length:min(3.5rem,var(--fig-fit))] font-extrabold leading-none whitespace-nowrap tabular-nums tracking-[-0.04em] text-jp-brand-amber sm:text-[length:min(5rem,var(--fig-fit))] lg:text-[length:min(clamp(4.5rem,6vw,6rem),var(--fig-fit))]"
                >
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

/**
 * The founder's judo composition (§83.4, 2026-11-27): the text-free artwork's upper region, rows 0 to 576 of 1672 x 941,
 * the athletes, the diagonal light and the amber corner. The principles and the navy statement beneath it are built in
 * HTML so they can reflow; their artwork rows (from 576) are not served. Decorative; the copy carries the meaning.
 */
const STRENGTH_ART = `${import.meta.env.BASE_URL}assets/advantage/strength-judo-1672.webp`;
/** One mockup pixel at the section's width (the section is the size container), as in the race section. */
const STRENGTH_U = { '--u': 'calc(100cqw / 1672)' } as CSSProperties;
/** Below `xl`, the artwork's own top edge (grey light) fades into the ivory above it. */
const STRENGTH_FADE_TOP: CSSProperties = { backgroundImage: 'linear-gradient(180deg, var(--jp-surface-ivory) 0%, transparent 100%)' };
/** The mockup's slanted amber markers: a parallelogram leaning right. */
const SLANT: CSSProperties = { clipPath: 'polygon(22% 0, 100% 0, 78% 100%, 0 100%)' };

function PositionOfStrength() {
  const S = POSITION_OF_STRENGTH;
  return (
    <section aria-labelledby="strength-heading" style={STRENGTH_U} className="@container relative isolate overflow-hidden bg-jp-surface-ivory">
      {/* The statement over the athletes: stacked below `xl`; from `xl` the artwork's own shape with the type at its
          mockup places, left of the athletes. */}
      <div className="relative pt-16 sm:pt-20 xl:aspect-[1672/576] xl:p-0">
        <div className="px-6 sm:px-8 xl:absolute xl:inset-0 xl:p-0">
          <p className="flex items-center gap-4 xl:absolute xl:top-[calc(66*var(--u))] xl:left-[calc(121*var(--u))] xl:gap-[calc(14*var(--u))]">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-amber-ink sm:text-sm xl:text-[length:calc(21*var(--u))] xl:leading-[calc(27*var(--u))] xl:tracking-[0.06em]">
              {S.eyebrow}
            </span>
            <span aria-hidden="true" className="h-0.5 w-12 bg-jp-brand-amber xl:h-[calc(4*var(--u))] xl:w-[calc(78*var(--u))]" />
          </p>
          <h2
            id="strength-heading"
            className="mt-5 max-w-[14ch] font-heading text-[2.625rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-jp-background sm:max-w-none sm:text-[3.5rem] xl:absolute xl:top-[calc(104*var(--u))] xl:left-[calc(100*var(--u))] xl:mt-0 xl:text-[length:calc(79.5*var(--u))] xl:leading-[calc(76*var(--u))] xl:whitespace-nowrap"
          >
            {S.heading.lines[0]} <br className="hidden sm:inline" />
            {S.heading.lines[1]}
          </h2>
          <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-jp-background sm:text-[1.1875rem] xl:absolute xl:top-[calc(285*var(--u))] xl:left-[calc(103*var(--u))] xl:mt-0 xl:max-w-[calc(500*var(--u))] xl:text-[length:max(16px,calc(20.5*var(--u)))] xl:leading-[1.45]">
            {S.intro}
          </p>
        </div>

        {/* The athletes. On a phone 3:2 and from `sm` 2:1, trimmed only from the sides, centred on the throw; from `xl`
            the section's own ground, drawn whole. Never stretched. */}
        <div aria-hidden="true" className="pointer-events-none relative mt-8 sm:mt-10 xl:absolute xl:inset-0 xl:-z-10 xl:mt-0">
          <img
            src={STRENGTH_ART}
            width={1672}
            height={576}
            alt=""
            loading="lazy"
            decoding="async"
            className="block aspect-[3/2] h-auto w-full object-cover object-[71%_50%] sm:aspect-[2/1] sm:object-[82%_50%] xl:aspect-auto xl:h-full xl:object-center"
          />
          <div className="absolute inset-x-0 top-0 h-[16%] xl:hidden" style={STRENGTH_FADE_TOP} />
        </div>
      </div>

      {/* The five principles: one ruled row of five from `lg`, two columns from `sm`, a list on a phone. */}
      <ol className="mx-auto grid max-w-7xl gap-y-8 px-6 pt-8 pb-12 sm:grid-cols-2 sm:gap-x-10 sm:px-8 sm:pb-14 lg:grid-cols-5 lg:gap-x-0 lg:px-10 lg:pt-4 xl:max-w-none xl:px-[calc(32*var(--u))] xl:pt-[calc(7*var(--u))] xl:pb-[calc(31*var(--u))]">
        {S.practices.map(({ title, body }, i) => (
          <li
            key={title}
            className="lg:border-l lg:border-jp-ink-secondary/30 lg:px-5 lg:first:border-l-0 xl:min-h-[calc(130*var(--u))] xl:px-[calc(38*var(--u))]"
          >
            <div className="flex items-start gap-3 lg:flex-col lg:gap-3 xl:flex-row xl:gap-[calc(22*var(--u))]">
              <span
                aria-hidden="true"
                style={SLANT}
                className="mt-0.5 flex h-6 w-11 shrink-0 items-center justify-center bg-jp-brand-amber font-mono text-[0.75rem] font-bold text-jp-background xl:mt-0 xl:h-[calc(28*var(--u))] xl:w-[calc(46*var(--u))] xl:text-[length:max(11px,calc(14*var(--u)))]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-[1.1875rem] font-bold leading-[1.15] tracking-[-0.015em] text-jp-background lg:text-[1.0625rem] xl:text-[length:max(17px,calc(24*var(--u)))] xl:leading-[1.08]">
                {title}
              </h3>
            </div>
            <p className="mt-3 text-[0.9375rem] leading-[1.5] text-jp-ink-secondary xl:mt-[calc(16*var(--u))] xl:text-[length:max(14px,calc(16.5*var(--u)))] xl:leading-[1.36]">
              {body}
            </p>
          </li>
        ))}
      </ol>

      {/* What stronger execution makes possible: the navy band, full width. Three parts between hairlines from `lg`. */}
      <aside aria-labelledby="choices-heading" className="relative isolate overflow-hidden bg-jp-surface">
        {/* The mockup's quiet diagonals: a lighter wedge at the left, an amber stripe and a lighter wedge at the right. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
          <div className="absolute inset-y-0 left-0 w-[calc(90*var(--u))] bg-jp-border/10" style={{ clipPath: 'polygon(0 0, 85% 0, 0 100%)' }} />
          <div className="absolute inset-y-0 right-0 w-[calc(105*var(--u))] bg-jp-border/10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
          <div className="absolute inset-y-0 right-0 w-[calc(105*var(--u))] bg-jp-brand-amber" style={{ clipPath: 'polygon(96% 0, 100% 0, 25% 100%, 0 100%)' }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:grid lg:grid-cols-[544fr_464fr_470fr] lg:items-center lg:px-10 lg:py-12 xl:max-w-none xl:pr-[calc(102*var(--u))] xl:pl-[calc(92*var(--u))] xl:py-[calc(30*var(--u))]">
          <h3
            id="choices-heading"
            className="font-heading text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-jp-text-primary sm:text-[2.75rem] lg:pr-8 lg:text-[2.125rem] xl:pr-0 xl:text-[length:calc(56*var(--u))] xl:leading-[calc(50*var(--u))]"
          >
            {S.choicesHeading.lead}
            <br />
            <span className="text-jp-brand-amber">{S.choicesHeading.emphasis}</span>
          </h3>
          <p className="mt-6 border-t border-jp-border/30 pt-6 text-[1.0625rem] leading-[1.55] text-jp-text-primary lg:mt-0 lg:self-stretch lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:flex lg:items-center xl:pl-[calc(64*var(--u))] xl:pr-[calc(40*var(--u))] xl:text-[length:max(16px,calc(19.5*var(--u)))] xl:leading-[1.4]">
            {S.choicesIntro}
          </p>
          <ul className="mt-6 space-y-3 border-t border-jp-border/30 pt-6 lg:mt-0 lg:self-stretch lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:flex lg:flex-col lg:justify-center lg:space-y-2 xl:pl-[calc(65*var(--u))] xl:space-y-[calc(10*var(--u))]">
            {S.choices.map((choice) => (
              <li key={choice} className="flex items-start gap-3 font-heading text-[1.0625rem] font-semibold leading-[1.3] text-jp-text-primary xl:gap-[calc(20*var(--u))] xl:text-[length:max(15px,calc(18*var(--u)))]">
                <span aria-hidden="true" style={SLANT} className="mt-[0.3em] h-2.5 w-4 shrink-0 bg-jp-brand-amber xl:h-[calc(11*var(--u))] xl:w-[calc(16*var(--u))]" />
                <span>{choice}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}

/* --------------------------------------------------------------------------------- 5. how JiTpro creates */

/**
 * The founder's mountain composition (§83.1 item 5, 2026-11-27): the text-free artwork, rows 0 to 760 of 1672 x 941,
 * with the sunrise, the four slanted panels, their icons, numbers and amber connectors, the eyebrow's short rule and the
 * closing statement's flanking rules drawn in. From `xl` the section is the artwork's shape and the HTML text sits on
 * it in artwork pixels; below `xl` the panels and connectors are rebuilt in CSS under a crop of the sunrise.
 */
const HOW_ART = `${import.meta.env.BASE_URL}assets/advantage/how-mountains-1672.webp`;
/** The sunrise alone (artwork columns 700 to 1672, rows 0 to 268), for the stacked layout below `xl`. */
const HOW_BANNER = `${import.meta.env.BASE_URL}assets/advantage/how-mountains-banner-972.webp`;
const HOW_U = { '--u': 'calc(100cqw / 1672)' } as CSSProperties;
/** Below `xl`, the sunrise fades into the section's navy at its foot and its left. */
const HOW_FADE: CSSProperties = {
  backgroundImage:
    'linear-gradient(0deg, var(--jp-background) 0%, transparent 70%), linear-gradient(90deg, color-mix(in oklab, var(--jp-background) 75%, transparent) 0%, transparent 70%)',
};
/**
 * Each discipline's text on its panel, in artwork pixels from `xl`: the title's left edge and width (inside the panel's
 * slanted sides at the title's height); the description sits 12 px further left, following the slant, and wraps at
 * `bw` so each breaks where the mockup breaks it.
 */
const HOW_PANELS = [
  { x: 141, w: 255, bw: 200 },
  { x: 535, w: 252, bw: 252 },
  { x: 920, w: 252, bw: 252 },
  { x: 1300, w: 266, bw: 200 },
] as const;
/** The disciplines appear in order, 180 ms apart, from one reveal of the list (§46.3); the closing statement after. */
const HOW_STAGGER = 180;
/** Icons for the CSS panels below `xl` (from `xl` the artwork draws its own). */
const HOW_ICONS: LucideIcon[] = [Crosshair, ClipboardList, Users, BarChart3];

function HowJiTpro() {
  const H = HOW_JITPRO;
  const [listRef, listShown] = useRevealed<HTMLOListElement>();
  const last = H.concepts.length - 1;
  return (
    <section aria-labelledby="how-heading" style={HOW_U} className="@container relative isolate overflow-hidden bg-jp-background">
      {/* The artwork. From `xl` the section's own ground, drawn whole; below it, the sunrise above the heading. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <img src={HOW_ART} width={1672} height={760} alt="" loading="lazy" decoding="async" className="hidden h-full w-full xl:block" />
        <div className="absolute inset-x-0 top-0 xl:hidden">
          <img
            src={HOW_BANNER}
            width={972}
            height={268}
            alt=""
            loading="lazy"
            decoding="async"
            className="block aspect-[3/2] w-full object-cover object-[80%_50%] sm:aspect-[5/2] lg:aspect-[972/268]"
          />
          <div className="absolute inset-0" style={HOW_FADE} />
        </div>
      </div>

      <div className="relative xl:aspect-[1672/760]">
        <div className="mx-auto max-w-7xl px-6 pt-36 pb-16 sm:px-8 sm:pt-44 sm:pb-20 lg:px-10 lg:pt-40 xl:absolute xl:inset-0 xl:max-w-none xl:p-0">
          <p className="xl:absolute xl:top-[calc(50*var(--u))] xl:left-[calc(104*var(--u))]">
            <span className={`${EYEBROW_DARK} block xl:text-[length:calc(22*var(--u))] xl:leading-[calc(28*var(--u))] xl:tracking-[0.1em]`}>{H.eyebrow}</span>
            <span aria-hidden="true" className="mt-3 block h-0.5 w-14 bg-jp-brand-amber xl:hidden" />
          </p>
          <h2
            id="how-heading"
            className={`${H2} mt-5 text-jp-text-primary xl:absolute xl:top-[calc(110*var(--u))] xl:left-[calc(100*var(--u))] xl:mt-0 xl:text-[length:calc(68*var(--u))] xl:leading-[calc(76*var(--u))] xl:tracking-[-0.025em] xl:whitespace-nowrap`}
          >
            {H.heading}
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.0625rem] leading-[1.6] text-jp-text-secondary sm:text-[1.1875rem] xl:absolute xl:top-[calc(196*var(--u))] xl:left-[calc(104*var(--u))] xl:mt-0 xl:max-w-[calc(780*var(--u))] xl:text-[length:max(16px,calc(23*var(--u)))] xl:leading-[1.35]">
            {H.intro}
          </p>

          {/* The four disciplines: stacked with vertical connectors on a phone and tablet, one row from `lg`, and from
              `xl` the text alone on the artwork's panels. */}
          <ol ref={listRef} className="mt-12 grid max-w-xl gap-8 px-3 lg:max-w-none lg:px-0 lg:grid-cols-4 lg:gap-9 xl:static xl:mt-0 xl:block">
            {H.concepts.map(({ title, body }, i) => {
              const Icon = HOW_ICONS[i];
              const strong = i === last;
              return (
                <li
                  key={title}
                  {...reveal(
                    listShown,
                    i * HOW_STAGGER,
                    'relative px-7 pt-6 pb-7 xl:absolute xl:top-[calc(372*var(--u))] xl:left-[calc(var(--x)*var(--u))] xl:w-[calc(var(--w)*var(--u))] xl:p-0',
                    // Each panel above the next, so its connector's far dot is not covered by the next panel.
                    { '--x': HOW_PANELS[i].x, '--w': HOW_PANELS[i].w, '--bw': HOW_PANELS[i].bw, zIndex: last - i + 1 } as CSSProperties,
                  )}
                >
                  {/* The slanted panel (below `xl`; from `xl` the artwork's). Performance carries the amber outline. */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 -z-10 -skew-x-[8deg] rounded-2xl lg:-skew-x-12 border xl:hidden ${
                      strong
                        ? 'border-2 border-jp-brand-amber bg-jp-surface/80 shadow-[0_0_28px_-6px_color-mix(in_oklab,var(--jp-brand-amber)_70%,transparent)]'
                        : 'border-jp-border/25 bg-jp-surface/70'
                    }`}
                  />
                  {/* The amber connector to the next panel: down on a phone and tablet, across from `lg`. */}
                  {i < last && (
                    <span
                      aria-hidden="true"
                      className="absolute top-full left-12 flex h-8 w-0.5 flex-col items-center justify-between bg-jp-brand-amber lg:top-1/2 lg:left-full lg:h-0.5 lg:w-9 lg:flex-row xl:hidden"
                    >
                      <span className="-mt-1 size-2.5 shrink-0 rounded-full bg-jp-brand-amber lg:mt-0 lg:-ml-1" />
                      <span className="-mb-1 size-2.5 shrink-0 rounded-full bg-jp-brand-amber lg:mb-0 lg:-mr-1" />
                    </span>
                  )}
                  <div aria-hidden="true" className="mb-4 flex items-center justify-between xl:hidden">
                    <Icon strokeWidth={1.75} className="size-8 text-jp-brand-amber" />
                    <span className="font-heading text-[1.75rem] font-extrabold tracking-[-0.02em] text-jp-text-secondary/45">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-heading text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-text-primary xl:text-[length:calc(36*var(--u))] xl:leading-[calc(44*var(--u))] xl:font-bold xl:whitespace-nowrap">
                    {title}
                  </h3>
                  <p className="mt-2 text-[1rem] leading-[1.5] text-jp-text-secondary xl:mt-[calc(8*var(--u))] text-pretty xl:-ml-[calc(12*var(--u))] xl:max-w-[calc(var(--bw)*var(--u))] xl:text-[length:max(15px,calc(22*var(--u)))] xl:leading-[1.45]">
                    {body}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* The conclusion, between the artwork's amber rules from `xl`; below it, between rules of its own. */}
          <p
            {...reveal(
              listShown,
              H.concepts.length * HOW_STAGGER + 120,
              'mt-14 flex items-center justify-center gap-5 text-center sm:mt-16 xl:absolute xl:top-[calc(574*var(--u))] xl:left-[calc(357*var(--u))] xl:mt-0 xl:h-[calc(76*var(--u))] xl:w-[calc(953*var(--u))] xl:justify-center',
            )}
          >
            <span aria-hidden="true" className="hidden h-0.5 flex-1 sm:block xl:hidden" style={RULE_FADE_LEFT} />
            <span className="font-heading text-[1.75rem] font-extrabold italic leading-[1.15] tracking-[-0.025em] text-balance text-jp-text-primary sm:max-w-[30rem] sm:text-center sm:text-[2rem] lg:max-w-none lg:text-[2.25rem] xl:text-[length:calc(46*var(--u))] xl:whitespace-nowrap">
              {H.closing}
            </span>
            <span aria-hidden="true" className="hidden h-0.5 flex-1 sm:block xl:hidden" style={RULE_FADE_RIGHT} />
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------- 6. compounding advantage */

/**
 * The founder's wave photograph (§83.1 item 6, §83.8; 2026-11-27): a barrel wave at sunset, 1920 x 819, served whole and
 * never retouched. From `lg` the section is the approved mockup's shape (1672 x 975 here) on `--jp-surface-ivory`, and
 * everything on it is placed in section pixels (`--u`, as the race section): the photograph spans the width from y 170,
 * its sky and foot covered in the section's ivory by an SVG overlay that follows the wave (the sun left open), and the
 * four stages stand above the wave on amber leaders, joined by an amber line that rises with it.
 */
const WAVE = `${import.meta.env.BASE_URL}assets/advantage/compounding-wave`;
const WAVE_SRCSET = `${WAVE}-768.webp 768w, ${WAVE}-1280.webp 1280w, ${WAVE}-1920.webp 1920w`;
const WAVE_U = { '--u': 'calc(100cqw / 1672)' } as CSSProperties;
/** Section height and the photograph's top, in section pixels; one photograph pixel is 1672 / 1920 section pixels. */
const WAVE_H = 975;
const WAVE_TOP = 170;
const WAVE_SCALE = 1672 / 1920;

/**
 * The ivory cover's lower edge, in photograph pixels: just above the water line at the left, around the lower spray, then
 * one steady rise to the crest (2026-11-27, founder review: no dip into the wave under the third stage). Drawn as a smooth
 * curve, like the progression line; the sun is left open by the overlay's mask.
 */
const WAVE_SKY_EDGE: readonly (readonly [number, number])[] = [
  [-40, 548], [300, 548], [450, 535], [600, 505], [700, 480], [760, 420], [820, 335], [900, 280], [980, 238], [1060, 205],
  [1160, 176], [1260, 154], [1380, 134], [1500, 118], [1620, 106], [1760, 96], [1960, 88],
];
/** The water line the amber progression follows, in photograph pixels, from the first stage to the crest. */
const WAVE_LINE: readonly (readonly [number, number])[] = [
  [300, 556], [470, 540], [650, 505], [800, 468], [960, 400], [1080, 345], [1190, 286], [1300, 232], [1400, 190], [1510, 160], [1620, 138],
];

/** A smooth curve through points (Catmull-Rom as cubic Béziers). */
function smoothPath(points: readonly (readonly [number, number])[]): string {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1] ?? points[i];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[i + 2] ?? points[i + 1];
    const c1 = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6].map((v) => v.toFixed(1));
    const c2 = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6].map((v) => v.toFixed(1));
    d += ` C${c1.join(',')} ${c2.join(',')} ${x2},${y2}`;
  }
  return d;
}
const WAVE_PATH = smoothPath(WAVE_LINE);
const WAVE_SKY = `${smoothPath(WAVE_SKY_EDGE)} L1960,-40 L-40,-40 Z`;

/**
 * Each stage, in photograph pixels: its anchor on the water line, the label's left edge and the label's foot (its leader
 * runs from there down to the anchor), and the label's width in section pixels, so each breaks where the mockup breaks it.
 * `at` is how far along the progression line the anchor lies, for the reveal.
 */
const WAVE_STAGES = [
  { ax: 300, ay: 556, lx: 262, foot: 480, w: 170, at: 0 },
  { ax: 650, ay: 505, lx: 612, foot: 430, w: 215, at: 0.27 },
  { ax: 1190, ay: 286, lx: 1152, foot: 150, w: 150, at: 0.67 },
  { ax: 1620, ay: 138, lx: 1582, foot: 70, w: 262, at: 1 },
] as const;
/** The progression line draws once, then each stage appears as the line reaches it (§46.3). */
const WAVE_DRAW = 1600;

function Compounding() {
  const C = COMPOUNDING;
  const ids = useId().replace(/:/g, '');
  const [stagesRef, stagesShown] = useRevealed<HTMLOListElement>();
  const last = C.steps.length - 1;
  const ivory = { stopColor: 'var(--jp-surface-ivory)' };
  return (
    <section aria-labelledby="compounding-heading" style={WAVE_U} className="@container relative isolate overflow-hidden bg-jp-surface-ivory">
      <div className="relative lg:aspect-[1672/975]">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:absolute lg:inset-0 lg:max-w-none lg:p-0">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-jp-amber-ink sm:text-sm lg:absolute lg:top-[calc(62*var(--u))] lg:left-[calc(68*var(--u))] lg:text-[length:max(12px,calc(20*var(--u)))] lg:tracking-[0.22em]">
            {C.eyebrow}
          </p>
          <h2
            id="compounding-heading"
            className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-jp-background sm:text-[3.25rem] lg:absolute lg:top-[calc(104*var(--u))] lg:left-[calc(64*var(--u))] lg:mt-0 lg:text-[length:calc(78*var(--u))] lg:leading-[calc(80*var(--u))] lg:whitespace-nowrap"
          >
            {C.heading.lines[0]} <br className="hidden lg:inline" />
            {C.heading.lines[1]}
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.0625rem] leading-[1.6] text-jp-ink-secondary sm:text-[1.1875rem] lg:absolute lg:top-[calc(284*var(--u))] lg:left-[calc(68*var(--u))] lg:mt-0 lg:max-w-[calc(760*var(--u))] lg:text-[length:max(15px,calc(21*var(--u)))] lg:leading-[1.5]">
            {C.intro[0]} {C.intro[1]}
          </p>

          {/* The wave: a full-bleed crop below `lg`; from `lg` the section's middle, under the ivory overlay. */}
          <div aria-hidden="true" className="pointer-events-none relative -mx-6 mt-10 sm:-mx-8 sm:mt-12 lg:absolute lg:-z-10 lg:inset-x-0 lg:top-[calc(170*var(--u))] lg:mx-0 lg:mt-0">
            <img
              src={`${WAVE}-1280.webp`}
              srcSet={WAVE_SRCSET}
              sizes="100vw"
              width={1920}
              height={819}
              alt=""
              loading="lazy"
              decoding="async"
              className="block aspect-[4/3] h-auto w-full object-cover object-[68%_50%] sm:aspect-[2/1] lg:aspect-auto"
            />
            <svg viewBox="0 0 1920 819" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full overflow-visible lg:block">
              <defs>
                <filter id={`${ids}-soft`} x="-5%" y="-10%" width="110%" height="120%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id={`${ids}-glow`} x="-5%" y="-20%" width="110%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <radialGradient id={`${ids}-sun`} cx="150" cy="520" r="260" gradientUnits="userSpaceOnUse">
                  <stop offset="0.3" style={{ stopColor: 'var(--jp-surface-white)', stopOpacity: 0 }} />
                  <stop offset="1" style={{ stopColor: 'var(--jp-surface-white)', stopOpacity: 1 }} />
                </radialGradient>
                <mask id={`${ids}-sunmask`} maskUnits="userSpaceOnUse" x="-60" y="-60" width="2040" height="940">
                  <rect x="-60" y="-60" width="2040" height="940" fill={`url(#${ids}-sun)`} />
                </mask>
                <linearGradient id={`${ids}-foot`} x1="0" y1="600" x2="0" y2="740" gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ ...ivory, stopOpacity: 0 }} />
                  <stop offset="1" style={{ ...ivory, stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d={WAVE_SKY} style={{ fill: 'var(--jp-surface-ivory)' }} filter={`url(#${ids}-soft)`} mask={`url(#${ids}-sunmask)`} />
              <rect x="-40" y="600" width="2000" height="260" fill={`url(#${ids}-foot)`} />
              {/* The progression: a soft glow under a fine amber line, drawn once from the first stage to the crest. */}
              <g
                style={{ strokeDashoffset: stagesShown ? 0 : 1, transitionDuration: `${WAVE_DRAW}ms` }}
                className="transition-[stroke-dashoffset] ease-out motion-reduce:transition-none"
                strokeDasharray="1"
              >
                <path d={WAVE_PATH} pathLength={1} fill="none" strokeWidth="9" strokeOpacity="0.45" style={{ stroke: 'var(--jp-brand-amber)' }} filter={`url(#${ids}-glow)`} />
                <path d={WAVE_PATH} pathLength={1} fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: 'var(--jp-brand-amber-active)' }} />
              </g>
              {WAVE_STAGES.map((s, i) => {
                const r = i === last ? 13 : 9;
                return (
                  <g key={s.ax} {...reveal(stagesShown, s.at * WAVE_DRAW * 0.9, '')}>
                    <line x1={s.ax} y1={s.foot + 10} x2={s.ax} y2={s.ay - r} strokeWidth="2" style={{ stroke: 'var(--jp-brand-amber)' }} />
                    <circle cx={s.ax} cy={s.ay} r={r + 7} style={{ fill: 'var(--jp-brand-amber)' }} opacity="0.35" filter={`url(#${ids}-glow)`} />
                    <circle cx={s.ax} cy={s.ay} r={r} strokeWidth="4" style={{ fill: 'var(--jp-surface-ivory)', stroke: 'var(--jp-brand-amber)' }} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* The four stages: a rising timeline below `lg`; from `lg` above the wave, each on its leader. */}
          <ol ref={stagesRef} className="relative mt-10 space-y-7 pl-11 sm:mt-12 lg:static lg:mt-0 lg:space-y-0 lg:pl-0">
            {C.steps.map((step, i) => {
              const s = WAVE_STAGES[i];
              const strong = i === last;
              const place = {
                '--lx': s.lx * WAVE_SCALE,
                '--lb': WAVE_H - (WAVE_TOP + s.foot * WAVE_SCALE),
                '--lw': s.w,
              } as CSSProperties;
              return (
                <li
                  key={step}
                  {...reveal(
                    stagesShown,
                    s.at * WAVE_DRAW * 0.9,
                    'relative lg:absolute lg:bottom-[calc(var(--lb)*var(--u))] lg:left-[calc(var(--lx)*var(--u))] lg:w-[calc(var(--lw)*var(--u))]',
                    place,
                  )}
                >
                  {/* Below `lg`: the amber segment from this stage's anchor down to the next one's. */}
                  {!strong && <span aria-hidden="true" className="absolute top-[1.875rem] -left-[2.0625rem] h-[calc(100%+0.25rem)] w-0.5 bg-jp-brand-amber lg:hidden" />}
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 -left-11 rounded-full border-jp-brand-amber lg:hidden ${strong ? 'size-6 border-[5px] bg-jp-brand-amber' : 'size-6 border-[3px] bg-jp-surface-ivory'}`}
                  />
                  <span
                    aria-hidden="true"
                    className={`block font-heading font-extrabold leading-none tracking-[-0.02em] text-jp-amber-ink ${
                      strong ? 'text-[2.25rem] lg:text-[length:max(22px,calc(44*var(--u)))]' : 'text-[1.75rem] lg:text-[length:max(18px,calc(32*var(--u)))]'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`mt-1.5 block font-heading font-extrabold tracking-[-0.02em] text-jp-background lg:mt-[calc(6*var(--u))] ${
                      strong
                        ? 'text-[1.75rem] leading-[1.05] lg:text-[length:max(22px,calc(40*var(--u)))] lg:leading-[1]'
                        : 'text-[1.3125rem] leading-[1.15] lg:text-[length:max(16px,calc(28*var(--u)))] lg:leading-[1.02]'
                    }`}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* The lesson, beneath the wave: the first line in navy, the second in amber italic between fine amber rules. */}
          <p className="mt-14 text-center font-heading tracking-[-0.02em] text-balance sm:mt-16 lg:absolute lg:inset-x-0 lg:top-[calc(806*var(--u))] lg:mt-0">
            <span className="block text-[1.5rem] font-bold leading-[1.2] text-jp-background sm:text-[1.875rem] lg:text-[length:calc(42*var(--u))] lg:leading-[calc(52*var(--u))]">
              {C.statement[0]}
            </span>
            <span className="mt-2 flex items-center justify-center gap-5 lg:mt-[calc(4*var(--u))] lg:gap-[calc(48*var(--u))]">
              <span aria-hidden="true" className="hidden h-px w-16 bg-jp-brand-amber sm:block lg:h-[calc(2*var(--u))] lg:w-[calc(136*var(--u))]" />
              <span className="text-[1.5rem] font-extrabold italic leading-[1.2] text-jp-amber-ink sm:text-[1.875rem] lg:text-[length:calc(42*var(--u))] lg:leading-[calc(52*var(--u))]">
                {C.statement[1]}
              </span>
              <span aria-hidden="true" className="hidden h-px w-16 bg-jp-brand-amber sm:block lg:h-[calc(2*var(--u))] lg:w-[calc(136*var(--u))]" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------- 7. closing */

/**
 * The founder's closing composition (§83.1 item 7, §83.9; 2026-11-27): construction drawings and two sharpened amber
 * pencils on warm ivory, 1672 x 941, text-free, served whole and never retouched. From `lg` the photograph is the
 * section's ground, full width and drawn whole (the section grows only if the type needs it, and then the photograph
 * covers it, trimmed from its empty ivory left), and the type sits on its ivory left in mockup pixels (`--u`, as the race
 * section). Below `lg` the type comes first on the ivory and the photograph follows, cropped to the drawings and pencils.
 */
const CLOSING_ART = `${import.meta.env.BASE_URL}assets/advantage/closing-drawings`;
const CLOSING_SRCSET = `${CLOSING_ART}-768.webp 768w, ${CLOSING_ART}-1280.webp 1280w, ${CLOSING_ART}-1672.webp 1672w`;
const CLOSING_U = { '--u': 'calc(100cqw / 1672)' } as CSSProperties;

function Closing() {
  const C = CLOSING;
  return (
    <section aria-labelledby="closing-heading" style={CLOSING_U} className="@container relative isolate overflow-hidden bg-jp-surface-ivory">
      <div className="relative lg:flex lg:min-h-[calc(941*var(--u))] lg:items-center">
        <div className="px-6 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-14 lg:w-[calc(855*var(--u))] lg:py-[calc(40*var(--u))] lg:pr-0 lg:pl-[calc(55*var(--u))]">
          <p className="flex items-center gap-4 lg:gap-[calc(18*var(--u))]">
            <span aria-hidden="true" className="h-0.5 w-8 shrink-0 bg-jp-brand-amber lg:w-[calc(40*var(--u))]" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-background sm:text-sm lg:text-[length:max(11px,calc(19*var(--u)))]">
              {C.eyebrow}
            </span>
            <span aria-hidden="true" className="h-px min-w-0 flex-1 bg-jp-brand-amber/60 lg:ml-[calc(8*var(--u))]" />
          </p>

          <h2
            id="closing-heading"
            className="mt-7 font-heading text-[2rem] font-extrabold leading-[1.06] min-[360px]:text-[2.25rem] tracking-[-0.03em] text-balance text-jp-background sm:text-[3rem] lg:mt-[calc(52*var(--u))] lg:text-[length:calc(70*var(--u))] lg:leading-[calc(77*var(--u))] lg:whitespace-nowrap"
          >
            <span className="block">
              {C.heading.lines[0]} <br className="hidden lg:inline" />
              {C.heading.lines[1]}
            </span>
            <span className="mt-3 block lg:mt-[calc(16*var(--u))]">{C.heading.question}</span>
          </h2>
          <span aria-hidden="true" className="mt-7 block h-1 w-24 bg-jp-brand-amber lg:mt-[calc(34*var(--u))] lg:h-[max(3px,calc(4*var(--u)))] lg:w-[calc(162*var(--u))]" />

          <p className="mt-7 max-w-[36rem] text-[1.0625rem] leading-[1.6] text-jp-background sm:text-[1.1875rem] lg:mt-[calc(40*var(--u))] lg:max-w-[calc(770*var(--u))] lg:text-[length:max(16px,calc(24.5*var(--u)))] lg:leading-[1.6]">
            <span className="sm:block">{C.intro[0]}</span> {C.intro[1]}
          </p>
          <p className="mt-7 font-heading text-[1.3125rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-background sm:text-[1.5rem] lg:mt-[calc(38*var(--u))] lg:text-[length:max(18px,calc(30*var(--u)))]">
            {C.statement}
          </p>

          <Link
            to="/contact"
            className={`${PRIMARY_BUTTON} mt-8 w-full max-w-md sm:w-auto lg:mt-[calc(44*var(--u))] lg:max-w-none lg:gap-[max(10px,calc(28*var(--u)))] lg:px-[max(28px,calc(44*var(--u)))] lg:py-[max(16px,calc(21*var(--u)))] lg:text-[length:max(16px,calc(26*var(--u)))]`}
          >
            {C.action}
            <ArrowRight aria-hidden="true" className="size-[18px] shrink-0 lg:size-[max(18px,calc(26*var(--u)))]" />
          </Link>

          <p className="mt-9 flex items-center gap-4 sm:gap-5 lg:mt-[calc(52*var(--u))] lg:gap-[calc(30*var(--u))]">
            <span className="shrink-0 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.22em] text-jp-background sm:text-sm lg:text-[length:max(11px,calc(19*var(--u)))]">
              {C.signature}
            </span>
            <span aria-hidden="true" className="h-px min-w-0 max-w-16 flex-1 bg-jp-brand-amber/60 sm:max-w-24 lg:max-w-none lg:flex-none lg:w-[calc(362*var(--u))]" />
          </p>
        </div>

        {/* The drawings and pencils. Below `lg` a full-bleed crop to them (square on a phone, 5:4 from `sm`), anchored
            right; from `lg` the section's own ground, drawn whole. Never stretched; no fade, vignette or frame. */}
        <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-0 lg:-z-10">
          <img
            src={`${CLOSING_ART}-1280.webp`}
            srcSet={CLOSING_SRCSET}
            sizes="(min-width: 1024px) 100vw, (min-width: 640px) 142vw, 178vw"
            width={1672}
            height={941}
            alt=""
            loading="lazy"
            decoding="async"
            className="block aspect-square h-auto w-full object-cover object-[100%_50%] sm:aspect-[5/4] lg:aspect-auto lg:h-full"
          />
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
