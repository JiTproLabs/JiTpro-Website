import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FIELD_GUIDE, FIELD_GUIDE_COPY, FIELD_GUIDE_ID, type LeadMagnetPlacement } from '../../content/leadMagnets';
import { recordImpression, sendFunnelEvent } from './funnel';

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

/** §20.2: the band's eyebrow is its only amber. */
const BAND_EYEBROW_CLASSES =
  'font-mono text-xs uppercase tracking-[0.18em] text-jp-brand-amber';

/**
 * §26.1 hairline secondary. The band's action must stay subordinate to the
 * page's commercial primary action, so it takes no fill and its one hover
 * gesture moves border and label together.
 */
const HAIRLINE_BUTTON_CLASSES =
  'inline-flex w-full max-w-md items-center justify-center rounded-xl border border-jp-border/30 px-7 py-4 text-[0.9375rem] font-semibold text-jp-text-primary transition-colors duration-200 ease-out hover:border-jp-brand-amber-active hover:text-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto';

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

  const handleClose = useCallback(() => {
    setOpen(false);
    // §28.1: focus returns to the control that opened the dialog.
    triggerRef.current?.focus();
  }, []);

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
      {/* §20.2: elevated band tone, hairlines top and bottom, left-aligned,
          two columns from lg with the action right- and bottom-aligned. */}
      <section
        aria-labelledby="lead-magnet-band-heading"
        className="border-y border-jp-border/12 bg-jp-surface"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-2xl">
              <p className={BAND_EYEBROW_CLASSES}>{FIELD_GUIDE_COPY.band.eyebrow}</p>
              <h2
                id="lead-magnet-band-heading"
                className="mt-4 text-3xl font-semibold tracking-tight text-jp-text-primary sm:text-4xl"
              >
                {FIELD_GUIDE_COPY.band.heading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-jp-text-secondary">
                {FIELD_GUIDE_COPY.band.supporting}
              </p>
            </div>

            <div className="flex-none">
              <a
                ref={triggerRef}
                href={FIELD_GUIDE.landingPath}
                onClick={handleClick}
                className={HAIRLINE_BUTTON_CLASSES}
              >
                {FIELD_GUIDE_COPY.band.button}
              </a>
            </div>
          </div>
        </div>
      </section>
      {dialog}
    </>
  );
}
