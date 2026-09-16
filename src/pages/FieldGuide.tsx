import { useEffect } from 'react';
import { FIELD_GUIDE_COPY } from '../content/leadMagnets';
import LeadCaptureForm from '../components/lead-magnet/LeadCaptureForm';

/**
 * `/field-guide`. The indexable campaign landing page (Decision D1.1, copy
 * §25.4), and the no-JavaScript destination of every lead-magnet CTA: the
 * band's action is a real link here, so a visitor whose dialog cannot open
 * still reaches the same form as an ordinary page.
 *
 * Outside Design System §20.1, so this page carries the full publication
 * subtitle that homepage-facing surfaces may not (A9, A10).
 *
 * The form is the §27.1 card beside the content from `lg` and below it
 * otherwise (§25.4), and its submit is the page's one Brand Amber action
 * (§48.1), which is why nothing else on the page carries amber except the
 * eyebrow.
 */
export default function FieldGuide() {
  const copy = FIELD_GUIDE_COPY.landing;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = copy.browserTitle;

    // The SPA serves one index.html for every path, so the description is set
    // per page. An existing tag is restored rather than removed.
    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = existing?.content ?? null;
    const meta = existing ?? document.createElement('meta');
    if (!existing) {
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = copy.metaDescription;

    return () => {
      document.title = previousTitle;
      if (previousDescription === null) meta.remove();
      else meta.content = previousDescription;
    };
  }, [copy.browserTitle, copy.metaDescription]);

  return (
    <div className="bg-jp-background">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-jp-brand-amber">{copy.eyebrow}</p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-jp-text-primary sm:text-4xl lg:text-5xl">
              {copy.heading}
            </h1>

            {/* A heading-behaving line beneath the H1 (§25.4), not a second
                heading in the outline. */}
            <p className="mt-4 text-xl font-medium leading-snug text-jp-text-secondary">{copy.subtitle}</p>

            <p className="mt-6 text-lg leading-relaxed text-jp-text-secondary">{copy.intro}</p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-jp-text-primary">
              {copy.coversHeading}
            </h2>

            <ol className="mt-6 space-y-4">
              {copy.covers.map((item, index) => (
                <li key={item} className="flex gap-4 leading-relaxed text-jp-text-secondary">
                  <span className="font-mono text-sm text-jp-text-muted tabular-nums">
                    <span className="sr-only">Item </span>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* §27.1 default card. `lg:sticky` keeps the form beside the content
              on a long desktop page without moving it on a phone, where it
              simply follows the list. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-jp-border/15 bg-jp-surface p-6 sm:p-8">
              <LeadCaptureForm
                placement="landing-page"
                pagePath="/field-guide"
                heading={
                  <h2 className="text-2xl font-semibold tracking-tight text-jp-text-primary">
                    {copy.formHeading}
                  </h2>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
