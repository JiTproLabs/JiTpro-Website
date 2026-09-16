import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  FIELD_GUIDE,
  FIELD_GUIDE_COPY,
  FIELD_GUIDE_ID,
  GUIDE_COVER_WIDTHS,
  guideCoverPath,
  type LeadMagnetPlacement,
} from '../../content/leadMagnets';
import { recordImpression, sendFunnelEvent } from './funnel';
import './publicationObject.css';

/**
 * The Field Guide offer, as a band (Design System §20.2) or as a quiet footer
 * link. Both variants open the same dialog and record where they were clicked.
 *
 * THE CONTROL IS A REAL LINK, NOT A BUTTON. Its href is `/field-guide`, so a
 * visitor whose JavaScript is disabled or has errored still reaches a page
 * that renders the same form (Decision D1.1, §13.3 "JavaScript disabled").
 * With JavaScript running, the click is intercepted and opens the dialog
 * instead. A middle click, a modified click, and "open in new tab" are all
 * left alone, because a visitor who asked for a new tab meant it.
 *
 * FOCUS RETURN. The element that opened the dialog is held in a ref and
 * refocused on close, which is what §28.1 requires and what a dialog unmounted
 * from React cannot do by itself.
 *
 * THE DIALOG IS LAZY. Nothing in the dialog, the form, or Turnstile is in the
 * page's bundle until a visitor asks for the guide.
 */

const LeadMagnetDialog = lazy(() => import('./LeadMagnetDialog'));

/** §20.2: one of the band's two permitted amber elements (A11). */
const BAND_EYEBROW_CLASSES =
  'font-mono text-xs uppercase tracking-[0.18em] text-jp-brand-amber';

/**
 * The band's action (§20.2 as amended by A11). Brand Amber fill with
 * `--jp-background` ink, matching the approved fulfilment-email CTA.
 *
 * SUBORDINATION IS CARRIED BY WEIGHT, NOT HUE. This is the same amber as the
 * page's commercial primary, so every other property has to do the work:
 * `px-6 py-3.5` and `text-[0.9375rem]` against the primary's larger padding
 * and type, and crucially NO shadow, glow, or elevation, where the commercial
 * primary carries an amber glow. §48.1 still holds, because it is scoped to a
 * surface and the band is its own surface under §48.6.
 */
const BAND_ACTION_CLASSES =
  'inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-jp-brand-amber px-6 py-3.5 text-[0.9375rem] font-semibold text-jp-background transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto';

const FOOTER_LINK_CLASSES =
  'inline-flex min-h-[44px] items-center text-[0.9375rem] text-jp-text-secondary transition-colors duration-200 ease-out hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none';

export type LeadMagnetCTAProps = {
  placement: LeadMagnetPlacement;
  variant: 'band' | 'footer-link';
};

export default function LeadMagnetCTA({ placement, variant }: LeadMagnetCTAProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();
  const pagePath = location.pathname;

  /* `cta_view`, deduplicated per placement per session by the funnel module. */
  useEffect(() => {
    let store: Storage | null = null;
    try {
      store = window.sessionStorage;
    } catch {
      store = null;
    }
    recordImpression(FIELD_GUIDE_ID, placement, pagePath, store);
  }, [placement, pagePath]);

  const handleClose = useCallback(() => setOpen(false), []);

  /**
   * §28.1 and WCAG 2.4.3: focus returns to the control that opened the dialog.
   *
   * It MUST happen here rather than inside the close handler. Closing runs in
   * this order: the handler sets state, React unmounts the dialog, and the
   * dialog's own cleanup calls `close()` on the element. A native `close()`
   * moves focus, so a `focus()` call made in the handler is overwritten a
   * moment later and the visitor is dropped on `<body>`. A parent effect runs
   * after the child's cleanup, which is the first moment the focus sticks.
   */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Leave a deliberate new-tab or new-window click alone.
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    sendFunnelEvent({ event: 'cta_click', assetId: FIELD_GUIDE_ID, placement, pagePath });
    setOpen(true);
  }

  const dialog = open && (
    <Suspense fallback={null}>
      <LeadMagnetDialog placement={placement} pagePath={pagePath} onClose={handleClose} />
    </Suspense>
  );

  if (variant === 'footer-link') {
    return (
      <>
        <a ref={triggerRef} href={FIELD_GUIDE.landingPath} onClick={handleClick} className={FOOTER_LINK_CLASSES}>
          {FIELD_GUIDE_COPY.footer.guideLink}
        </a>
        {dialog}
      </>
    );
  }

  return (
    <>
      {/* §20.2 as amended by A11: a product-style feature band. The copy
          column carries the eyebrow, heading, supporting sentence and the
          action; the publication column carries the object of §20.2.1. Below
          lg it stacks eyebrow, heading, copy, action, object, so the reader
          reaches the action before the picture. */}
      <section
        aria-labelledby="lead-magnet-band-heading"
        className="border-y border-jp-border/12 bg-jp-surface"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
            {/* Copy column. */}
            <div className="max-w-2xl">
              <p className={BAND_EYEBROW_CLASSES}>{FIELD_GUIDE_COPY.band.eyebrow}</p>
              <h2
                id="lead-magnet-band-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-jp-text-primary sm:text-4xl"
              >
                {FIELD_GUIDE_COPY.band.heading}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-jp-text-secondary">
                {FIELD_GUIDE_COPY.band.supporting}
              </p>

              <div className="mt-9">
                <a
                  ref={triggerRef}
                  href={FIELD_GUIDE.landingPath}
                  onClick={handleClick}
                  className={BAND_ACTION_CLASSES}
                >
                  {FIELD_GUIDE_COPY.band.button}
                  <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
                </a>
              </div>
            </div>

            {/* Publication column (§20.2.1). A mechanical render of page 1 of
                the approved PDF, never a recreation. Decorative in the
                accessibility tree: the eyebrow, heading and supporting
                sentence above already name the publication, so a screen
                reader repeating the cover text would be redundant. Never
                interactive (§20.2). */}
            <div className="jp-pub" aria-hidden="true">
              <div className="jp-pub__ground">
                <div className="jp-pub__book">
                  <img
                    className="jp-pub__cover"
                    src={`${import.meta.env.BASE_URL}${guideCoverPath(FIELD_GUIDE, 1600)}`}
                    srcSet={GUIDE_COVER_WIDTHS.map(
                      (width) => `${import.meta.env.BASE_URL}${guideCoverPath(FIELD_GUIDE, width)} ${width}w`,
                    ).join(', ')}
                    sizes="(min-width: 1024px) 21rem, 17rem"
                    width={1600}
                    height={2070}
                    loading="lazy"
                    decoding="async"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {dialog}
    </>
  );
}
