import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { CANVAS_H, CANVAS_W } from './DemoScreenFrame';
import { InspectionContext } from './inspection';
import './tokens.css';

/**
 * The one expanded-view system for every JiTpro representative screen.
 *
 * It renders the SAME canonical screen component passed to it, scaled up. No
 * enlarged duplicate exists, and because the screen is real DOM rather than a
 * bitmap, enlarging it makes it sharper rather than softer - the entire point
 * of the migration.
 *
 * THE CLOSE CONTROL BELONGS TO THE SCREEN, NOT TO THE BROWSER. It sits in a
 * bar directly above the canvas inside a stage sized to `min(the screen's
 * rendered size, the space available)`, so it lands on the screen's top-right
 * corner when the screen fits and on the top-right of the visible area when
 * the screen is larger than the viewport and must be panned. The bar is
 * OUTSIDE the scrolling viewport, so no amount of panning can carry it out of
 * reach - which a control pinned to the canvas itself could not promise.
 *
 * NATIVE <dialog> WITH showModal(). Chosen over a hand-rolled portal because
 * the platform then owns the parts that are easy to get wrong: focus is
 * trapped inside the dialog, the rest of the document is inert to assistive
 * technology and to the pointer, Escape closes, and the dialog sits in the top
 * layer so no z-index in the page can cover it.
 *
 * INTERACTIVE SCREENS. A screen registered as `interactive` is granted
 * inspection capabilities here, and on a public page only here: the resting
 * preview stays inert. The popover portal target sits inside the dialog,
 * because the dialog lives in the top layer and anything portalled to
 * document.body would paint underneath it. Such a screen is not hidden from
 * assistive technology, since it now carries real focus targets. A screen
 * that consumes an Escape of its own (closing its popover) does so before the
 * dialog sees it, so the first Escape closes the popover and the second
 * closes the dialog.
 *
 * SCALE FLOOR AND CEILING. A screen is held at or above `minScale` so it stays
 * usable on a short laptop viewport; when it then exceeds the viewport it is
 * start-aligned and panned on both axes rather than clipped. `maxScale` caps
 * the other end: a live screen is real DOM and may grow past 1:1, a raster
 * capture is stopped at its native size because a bitmap has no detail past
 * it.
 *
 * MOBILE. A phone cannot show a 1448px desktop screen legibly scaled to fit
 * its width, so the dialog fits the canvas to HEIGHT and lets the viewer pan
 * horizontally. Fitting width instead would just reproduce the embedded view
 * at a larger size, which helps nobody. `overscroll-contain` stops that pan
 * from scrolling the page behind it.
 */

/** The close bar's height, reserved above the canvas when fitting it. */
const BAR_H = 48;

export default function DemoLightbox({
  label,
  children,
  onClose,
  interactive = false,
  minScale = 0,
  maxScale = 1.6,
}: {
  label: string;
  children: ReactNode;
  onClose: () => void;
  interactive?: boolean;
  minScale?: number;
  maxScale?: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [avail, setAvail] = useState({ w: 0, h: 0 });
  const [pan, setPan] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  /**
   * ONE layout effect, and the order inside it matters: a <dialog> that has not
   * been opened is `display: none`, so measuring the viewport before
   * showModal() yields 0 and the screen never renders. Open first, then
   * measure. Both are in a LAYOUT effect so the first painted frame already
   * has the correct scale rather than flashing an unscaled 1448px canvas.
   */
  useLayoutEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!el.open) el.showModal();
    setPortalEl(portalRef.current);

    /**
     * Measured from `__inner`, NOT from the viewport. The stage is sized from
     * the scale, and the viewport is inside the stage, so measuring the
     * viewport would make the scale depend on itself. `__inner` is always the
     * full dialog less its padding, whatever the stage does.
     */
    const measure = () => {
      const box = innerRef.current;
      if (!box) return;
      const cs = getComputedStyle(box);
      const availW =
        box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const availH =
        box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - BAR_H;
      if (availW <= 0 || availH <= 0) return;
      const byWidth = availW / CANVAS_W;
      const byHeight = availH / CANVAS_H;
      // Below 768px: fit HEIGHT and let the viewer pan horizontally. Fitting
      // width would just reproduce the unreadable embedded view, larger.
      const narrow = window.innerWidth < 768;
      const fit = narrow ? byHeight : Math.min(byWidth, byHeight);
      const s = Math.min(Math.max(fit, minScale), maxScale);
      setScale(s);
      setAvail({ w: availW, h: availH });
      setPan(s * CANVAS_W > availW + 0.5 || s * CANVAS_H > availH + 0.5);
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener('resize', measure);

    // Escape fires `cancel`; route it through our own close so focus restores.
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', onCancel);

    // <dialog> inerts the background but does not lock scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      el.removeEventListener('cancel', onCancel);
      document.body.style.overflow = prevOverflow;
      if (el.open) el.close();
    };
  }, [onClose, minScale, maxScale]);

  const capabilities = useMemo(
    () => ({ enabled: interactive, portalTarget: portalEl }),
    [interactive, portalEl],
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClick={(e) => {
        // Backdrop click: the dialog element itself is the backdrop, so a click
        // that lands on it rather than on its contents means "outside".
        if (e.target === dialogRef.current) onClose();
      }}
      className="jpd-lightbox"
    >
      <div ref={innerRef} className="jpd-lightbox__inner">
        {/* The stage: close bar and screen as one object, sized to the screen
            but never past the space available. */}
        <div
          className="jpd-lightbox__stage"
          style={{
            width: scale > 0 ? Math.min(CANVAS_W * scale, avail.w) : '100%',
            height: scale > 0 ? Math.min(CANVAS_H * scale, avail.h) + BAR_H : '100%',
          }}
        >
          <div className="jpd-lightbox__bar">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enlarged view"
              className="jpd-lightbox__close"
            >
              Close
              <X size={15} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <div ref={viewportRef} className="jpd-lightbox__viewport" data-pan={pan ? '' : undefined}>
          <div
            aria-hidden={interactive ? undefined : true}
            style={{
              width: CANVAS_W * scale,
              height: CANVAS_H * scale,
              position: 'relative',
              flex: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: CANVAS_W,
                height: CANVAS_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {scale > 0 && (
                <InspectionContext.Provider value={capabilities}>{children}</InspectionContext.Provider>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* The inspection portal target: inside the dialog so it paints in
            the top layer, outside the scaled canvas so popover typography is
            never multiplied by the transform. */}
        <div ref={portalRef} />
      </div>
    </dialog>
  );
}
