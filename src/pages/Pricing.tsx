import { useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import {
  BUSINESS_MODEL,
  COMPARISON,
  ENGAGEMENT,
  FINAL_CTA,
  FINANCIAL_SENSE,
  HERO,
  PRICING,
  PRICING_META,
  SUPPORT,
  formatFee,
} from '../content/pricingContent';

/**
 * /pricing: JiTpro's pricing page (Design System §82, issue #94).
 * UNLAUNCHED: the route renders RobotsNoindex and public/_headers sends
 * X-Robots-Tag; the page is not in navigation, the footer or any sitemap,
 * and nothing links to it.
 *
 * Revision 3 (2026-11-21): four compact sections. The pricing section, with
 * the Project Readiness Engagement and optional Ongoing Procurement Support
 * side by side, follows the hero directly. Copy lives in
 * src/content/pricingContent.ts.
 */

const CONTAINER = 'mx-auto max-w-7xl px-6 sm:px-8 lg:px-10';

/** The site's primary action (as HomeFinalCTA, §48.1). */
const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-6 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:px-7 sm:text-base';

/** The hero's drafting grid: fine hairlines, faded toward the edges. */
const DRAFTING_GRID: CSSProperties = {
  backgroundImage: [
    'linear-gradient(color-mix(in oklab, var(--jp-border) 8%, transparent) 1px, transparent 1px)',
    'linear-gradient(90deg, color-mix(in oklab, var(--jp-border) 8%, transparent) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '56px 56px',
  maskImage: 'linear-gradient(90deg, black 0%, black 28%, transparent 52%)',
  WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 28%, transparent 52%)',
};

const SAILBOAT = `${import.meta.env.BASE_URL}assets/pricing/pricing-hero-sailboat`;
const SAILBOAT_SRCSET = `${SAILBOAT}-720.webp 720w, ${SAILBOAT}-1100.webp 1100w, ${SAILBOAT}-1672.webp 1672w`;

/** From `lg`: the photograph's width is capped so the boat stays small on wide screens, and it is anchored so the
 *  boat (65% across the photograph) always sits a quarter of the viewport in from the right. Both side edges fade. */
const SEA_WIDTH = 'clamp(1300px, 105vw, 1700px)';
const SEA_PLACEMENT: CSSProperties = {
  width: SEA_WIDTH,
  right: `calc(25vw - 0.35 * ${SEA_WIDTH})`,
  maskImage: 'linear-gradient(90deg, transparent 0%, black 28%, black 90%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 28%, black 90%, transparent 100%)',
};

/** From `lg`: the navy holds the text side, then hands over to the open water; a whisper of the warm light survives
 *  behind the headline. Top and foot fade into the neighbouring surfaces. */
const SEA_FADES: CSSProperties = {
  backgroundImage: [
    'linear-gradient(90deg, color-mix(in oklab, var(--jp-background) 94%, transparent) 0%, color-mix(in oklab, var(--jp-background) 82%, transparent) 30%, color-mix(in oklab, var(--jp-background) 35%, transparent) 50%, transparent 66%)',
    'linear-gradient(180deg, var(--jp-background) 0%, transparent 14%, transparent 86%, var(--jp-background) 100%)',
  ].join(', '),
};

/** Below `lg`: the sea band fades into the navy at its top and foot. */
const BAND_FADES: CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--jp-background) 0%, transparent 30%, transparent 78%, var(--jp-background) 100%)',
};

/** Light-surface type registers shared across the pricing section. */
const PANEL_TITLE = 'font-heading text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-jp-background sm:text-[1.75rem]';
const PANEL_TAG = 'mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-jp-ink-secondary sm:text-[0.8125rem]';
const BODY = 'text-[1rem] leading-[1.6] text-jp-ink-secondary sm:text-[1.0625rem]';
const EMPHASIS = 'font-heading text-[1.0625rem] font-bold leading-[1.4] text-jp-background sm:text-[1.125rem]';

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
    <section aria-labelledby="pricing-heading" className="relative isolate overflow-hidden bg-jp-background lg:flex lg:min-h-[38rem] lg:items-center">
      {/* From `lg`: the lone sailboat on the open sea (§82.2). The photograph is drawn a little wider than the hero and
          shifted so the boat, kept small, sits about three quarters across, clear of the text. Decorative only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <img
          src={`${SAILBOAT}-1672.webp`}
          srcSet={SAILBOAT_SRCSET}
          sizes="(min-width: 1620px) 1700px, 1300px"
          width={1672}
          height={941}
          alt=""
          decoding="async"
          className="absolute top-1/2 max-w-none -translate-y-1/2"
          style={SEA_PLACEMENT}
        />
        <div className="absolute inset-0" style={SEA_FADES} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={DRAFTING_GRID} />

      <div className={`relative w-full ${CONTAINER} pt-14 sm:pt-16 lg:py-20`}>
        <div className="max-w-[40rem]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-jp-brand-amber sm:text-sm">{HERO.eyebrow}</p>
          <h1
            id="pricing-heading"
            className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-jp-text-primary sm:text-[3.25rem] lg:text-[clamp(3rem,3.6vw,3.75rem)]"
          >
            <span className="block">{HERO.headline[0]}</span>
            <span className="block text-jp-brand-amber">{HERO.headline[1]}</span>
          </h1>
          <p className="mt-7 font-heading text-[1.25rem] font-semibold leading-[1.4] text-jp-text-primary sm:text-[1.375rem]">{HERO.lead}</p>
          <p className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.65] text-jp-text-secondary sm:text-[1.125rem]">{HERO.paragraph}</p>
          <p className="mt-7 border-l-4 border-jp-brand-amber pl-5 font-heading text-[1.1875rem] font-bold leading-[1.4] text-jp-text-primary sm:text-[1.3125rem]">
            {HERO.statement}
          </p>
        </div>
      </div>

      {/* Below `lg`: the sea as a band after the text, cropped around the boat so it stays visible and small. */}
      <div aria-hidden="true" className="pointer-events-none relative mt-4 lg:hidden">
        <img
          src={`${SAILBOAT}-1100.webp`}
          srcSet={SAILBOAT_SRCSET}
          sizes="(min-width: 640px) 120vw, 160vw"
          width={1672}
          height={941}
          alt=""
          decoding="async"
          className="block aspect-[4/3] w-full object-cover object-[66%_50%] sm:aspect-[16/9]"
        />
        <div className="absolute inset-0" style={BAND_FADES} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------- 2. pricing and services */

function EngagementPanel() {
  return (
    <article
      aria-labelledby="engagement-heading"
      className="rounded-2xl border-t-[3px] border-jp-background bg-jp-surface-white p-6 shadow-[0_24px_48px_-36px_var(--jp-ink-secondary)] sm:p-8"
    >
      <h3 id="engagement-heading" className={PANEL_TITLE}>
        {ENGAGEMENT.name}
      </h3>
      <p className={PANEL_TAG}>{ENGAGEMENT.tag}</p>

      <table className="mt-6 w-full border-collapse text-left">
        <caption className="pb-3 text-left font-heading text-[1rem] font-bold text-jp-background">{ENGAGEMENT.exampleCaption}</caption>
        <thead>
          <tr className="border-b border-jp-background">
            <th scope="col" className="py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-jp-ink-secondary">
              {ENGAGEMENT.columns[0]}
            </th>
            <th scope="col" className="py-2 text-right font-mono text-xs font-bold uppercase tracking-[0.14em] text-jp-ink-secondary">
              {ENGAGEMENT.columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {ENGAGEMENT.rows.map(({ stage, fee }) => (
            <tr key={stage} className="border-b border-jp-ink-secondary/20">
              <th scope="row" className="py-3.5 font-heading text-[1.0625rem] font-semibold text-jp-background">
                {stage}
              </th>
              <td className="py-3.5 text-right font-heading text-[1.375rem] font-extrabold tabular-nums tracking-[-0.015em] text-jp-background sm:text-[1.5rem]">
                {formatFee(fee)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={`mt-4 ${BODY}`}>{ENGAGEMENT.explanation}</p>
      <p className="mt-2 text-[0.9375rem] leading-[1.55] text-jp-ink-secondary">{ENGAGEMENT.disclaimer.join(' ')}</p>
      <p className={`mt-5 ${EMPHASIS}`}>{ENGAGEMENT.promise}</p>

      <div className="mt-6 border-t border-jp-ink-secondary/20 pt-5">
        <p className={BODY}>{ENGAGEMENT.deliverablesIntro}</p>
        <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {ENGAGEMENT.deliverables.map((name, i) => (
            <li key={name} className="flex items-baseline gap-2.5 text-[0.9375rem] font-semibold text-jp-background">
              <span aria-hidden="true" className="font-mono text-xs font-bold text-jp-ink-secondary">
                {String(i + 1).padStart(2, '0')}
              </span>
              {name}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function SupportPanel() {
  return (
    <article aria-labelledby="support-heading" className="rounded-2xl border border-jp-ink-secondary/25 p-6 sm:p-8">
      <h3 id="support-heading" className={PANEL_TITLE}>
        {SUPPORT.name}
      </h3>
      <p className={PANEL_TAG}>{SUPPORT.tag}</p>
      <p className={`mt-6 ${BODY}`}>{SUPPORT.paragraph}</p>
      <p className={`mt-4 ${BODY}`}>{SUPPORT.listIntro}</p>
      <ul className="mt-3 space-y-2.5">
        {SUPPORT.items.map((item) => (
          <li key={item} className="flex gap-3 text-[1rem] leading-[1.5] text-jp-background sm:text-[1.0625rem]">
            <Check aria-hidden="true" strokeWidth={2.5} className="mt-1 size-4 shrink-0 text-jp-background" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[0.9375rem] leading-[1.55] text-jp-ink-secondary">{SUPPORT.note}</p>
      <p className={`mt-5 ${EMPHASIS}`}>{SUPPORT.promise}</p>
    </article>
  );
}

function Comparison() {
  return (
    <div className="mt-12 sm:mt-14">
      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-jp-ink-secondary sm:text-sm">{COMPARISON.heading}</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        {COMPARISON.services.map(({ name, points }, i) => (
          <div
            key={name}
            className={`rounded-xl p-5 sm:p-6 ${i === 0 ? 'bg-jp-background text-jp-text-primary' : 'border border-jp-background/80 bg-jp-surface-white text-jp-background'}`}
          >
            <h4 className="font-heading text-[1.125rem] font-bold">{name}</h4>
            <ul className="mt-3 space-y-1.5">
              {points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[0.9375rem] leading-[1.5]">
                  <span aria-hidden="true" className={`mt-[0.55rem] size-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-jp-brand-amber' : 'bg-jp-background'}`} />
                  <span className={i === 0 ? 'text-jp-text-secondary' : 'text-jp-ink-secondary'}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <section aria-labelledby="cost-heading" className="bg-jp-surface-light py-14 sm:py-16 lg:py-20">
      <div className={CONTAINER}>
        <div className="lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-16">
          <h2
            id="cost-heading"
            className="font-heading text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-jp-background sm:text-[2.75rem]"
          >
            {PRICING.heading}
          </h2>
          <div className={`mt-4 space-y-3 lg:mt-1 ${BODY} sm:text-[1.125rem]`}>
            <p className="font-semibold text-jp-background">{PRICING.intro[0]}</p>
            <p>{PRICING.intro[1]}</p>
          </div>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <EngagementPanel />
          <SupportPanel />
        </div>

        <Comparison />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- 3. why it makes financial sense */

function FinancialSense() {
  return (
    <section aria-labelledby="financial-heading" className="border-t border-jp-ink-secondary/15 bg-jp-surface-white py-14 sm:py-16 lg:py-20">
      <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16`}>
        <div>
          <h2
            id="financial-heading"
            className="font-heading text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-balance text-jp-background sm:text-[2.75rem]"
          >
            {FINANCIAL_SENSE.heading}
          </h2>
          <div className={`mt-5 space-y-4 ${BODY} sm:text-[1.125rem]`}>
            {FINANCIAL_SENSE.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className={EMPHASIS}>{FINANCIAL_SENSE.turn}</p>
            {FINANCIAL_SENSE.afterTurn.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {/* The economic statement, used exactly as approved and set prominently (§82.2). Amber on light is decorative only (§8.8). */}
          <p className="mt-8 border-l-4 border-jp-brand-amber pl-5 font-heading text-[1.625rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-balance text-jp-background sm:text-[2rem]">
            {FINANCIAL_SENSE.statement}
          </p>
        </div>

        {/* Our business model: the one dark card on the light act, so it reads as a distinct message. */}
        <aside aria-labelledby="model-heading" className="self-start rounded-2xl bg-jp-background p-7 sm:p-9 lg:mt-2">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-jp-brand-amber sm:text-sm">Our business model</p>
          <h3
            id="model-heading"
            className="mt-4 font-heading text-[1.875rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-jp-text-primary sm:text-[2.25rem]"
          >
            {BUSINESS_MODEL.heading}
          </h3>
          <p className="mt-5 text-[1rem] leading-[1.6] text-jp-text-secondary sm:text-[1.0625rem]">{BUSINESS_MODEL.lead}</p>
          <div className="mt-5 space-y-1.5 font-heading text-[1.125rem] font-bold leading-[1.4] text-jp-text-primary sm:text-[1.1875rem]">
            {BUSINESS_MODEL.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-5 text-[1rem] leading-[1.6] text-jp-text-secondary sm:text-[1.0625rem]">{BUSINESS_MODEL.belief}</p>
          <p className="mt-6 border-t border-jp-border/20 pt-5 font-heading text-[1.125rem] font-bold leading-[1.4] text-jp-brand-amber sm:text-[1.1875rem]">
            {BUSINESS_MODEL.goal}
          </p>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------ 4. final CTA */

function FinalCta() {
  return (
    <section aria-labelledby="pricing-cta-heading" className="relative isolate overflow-hidden bg-jp-background py-14 sm:py-18 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_70%_at_50%_100%,color-mix(in_oklab,var(--jp-brand-amber)_12%,transparent),transparent_70%)]"
      />
      <div className={`relative ${CONTAINER} sm:text-center`}>
        <h2
          id="pricing-cta-heading"
          className="font-heading text-[2.125rem] font-extrabold leading-[1.08] tracking-[-0.022em] text-balance text-jp-text-primary sm:text-[2.75rem] lg:text-[3.25rem]"
        >
          {FINAL_CTA.heading}
        </h2>
        <p className="mt-5 font-heading text-[1.125rem] font-semibold text-jp-text-primary sm:text-[1.25rem]">{FINAL_CTA.lead}</p>
        <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:mx-auto sm:text-[1.125rem]">{FINAL_CTA.paragraph}</p>
        <div className="mt-8">
          <Link to="/contact" className={`${PRIMARY_BUTTON} w-full max-w-md sm:w-auto`}>
            {FINAL_CTA.action}
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  usePageMeta(PRICING_META.title, PRICING_META.description);
  return (
    <>
      <Hero />
      <PricingSection />
      <FinancialSense />
      <FinalCta />
    </>
  );
}
