import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import DemoLightbox from './DemoLightbox';
import { DEFAULT_MIN_SCALE, DEMO_SCREENS, type DemoScreenId } from './registry';
import './tokens.css';

/**
 * The site-wide presentation wrapper for a JiTpro representative screen.
 *
 * ONE CANONICAL SCREEN, MANY CONTEXTS. The homepage, the Learn More page and
 * the expanded modal all render the same component; this wrapper only decides
 * how large it is drawn and whether it can be opened. There is no "small" or
 * "large" implementation.
 *
 * LIVE OR RASTER IS THE REGISTRY'S CALL. A stage whose entry is `live` renders
 * its React screen here and in the expanded view. A stage whose entry is
 * `raster` renders its capture here and the same capture in the expanded
 * view, at up to native size. The pages cannot tell the two apart and do not
 * need to: the affordance, the click, the dialog, the close, the focus return
 * and the scroll position are identical for all five stages.
 *
 * SCALING. A live screen is authored at a fixed 1448x1086 desktop canvas and
 * the whole canvas is scaled with a CSS transform. Deliberately NOT an
 * internally responsive layout: these are desktop application screens, and
 * reflowing them into a phone UI would depict a product JiTpro does not have.
 *
 *   - `aspect-ratio` on the outer box reserves exact height before JS runs, so
 *     there is no layout shift and no dependence on the observer having fired.
 *   - `transform-origin: top left` makes scale and position one calculation.
 *   - A ResizeObserver drives the scale, because the container changes size
 *     without the window doing so (the Learn More guide rail appearing at xl
 *     is exactly that case).
 *   - `will-change: transform`, 3D transforms and transitions on the scale are
 *     ALL deliberately absent. Any of them promotes the canvas to its own
 *     composited layer, which rasterises it once and then samples the bitmap -
 *     reintroducing precisely the blurring this whole migration exists to
 *     remove. Text must re-rasterise at the composited resolution.
 *
 * A raster needs none of that: the image is drawn at the box's size by the
 * browser, exactly as the pages drew it before the frame took it over.
 *
 * ACCESSIBILITY. The interior is hundreds of non-functional nodes, so it is
 * exposed as a single labelled image rather than as a fake application: the
 * canvas is `aria-hidden` inside a `role="img"` carrying the screen's existing
 * alt text, and the only focusable thing is the enlarge control. That keeps
 * assistive-technology output identical to the raster it replaces.
 *
 * THE ENLARGE CONTROL COVERS THE FRAME AS A SIBLING, not as a wrapper. A
 * screen may contain real buttons of its own (the Procurement Schedule's
 * phases are buttons, inert here because no inspection capability is
 * granted), and a button may not contain other buttons. The overlay keeps
 * the whole preview clickable and keyboard-reachable without nesting. In an
 * accumulating figure that keeps every stage mounted, `focusable={false}`
 * takes a hidden frame's control out of the tab order.
 *
 * THE AFFORDANCE IS THE WHOLE PREVIEW, AND IT SAYS SO. The trigger fills the
 * frame and draws one centred `Explore screen` pill inside itself. The pill
 * is a decorative `<span>`, never a second button - clicking it and clicking
 * anywhere else on the preview are the same click on the same control, which
 * is what keeps the markup free of nested interactive elements. It is drawn
 * at rest rather than on hover, because a visitor who never hovers must still
 * know the screen opens; hover and keyboard focus only strengthen it.
 *
 * NO CAPTION. Section 48.10's provenance line was withdrawn from these
 * demonstrations site-wide (Decision Log 2026-09-04) and the affordance now
 * carries the interaction on its own, so nothing is printed beneath a frame.
 */

const CANVAS_W = 1448;
const CANVAS_H = 1086;
const ASSET_BASE = `${import.meta.env.BASE_URL}assets/methodology`;
/** How wide the preview is drawn, for the browser's choice of capture size. */
const PREVIEW_SIZES = '(min-width: 1024px) 58vw, 100vw';

type Props = {
  screen: DemoScreenId;
  /** Accessible description. The raster's existing alt text is reused verbatim. */
  label: string;
  /**
   * The stage's short name, for the trigger's accessible name - "Explore
   * Scope Validation screen" rather than the full description, which the
   * sibling `role="img"` already carries.
   */
  title: string;
  /**
   * Basename of the stage's capture in public/assets/methodology, without
   * size suffix or extension. Every stage has one; a raster stage is drawn
   * from it, and a live stage keeps it as the reference it was built to.
   */
  file: string;
  /** Opt out of expansion for a surface that should stay inert. */
  expandable?: boolean;
  /** False for a frame that is mounted but not the visible state. */
  focusable?: boolean;
  className?: string;
};

export default function DemoScreenFrame({
  screen,
  label,
  title,
  file,
  expandable = true,
  focusable = true,
  className = '',
}: Props) {
  const entry = DEMO_SCREENS[screen];
  const Screen = entry.kind === 'live' ? entry.component : null;
  const interactive = entry.kind === 'live' && entry.interactive === true;
  const minScale = entry.minScale ?? DEFAULT_MIN_SCALE;

  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!Screen) return;
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / CANVAS_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Belt and braces. The observer is the correct instrument, because the
    // container can change without the window doing so (the Learn More guide
    // rail appearing at xl). The window listener costs nothing and keeps the
    // frame correct if observer delivery is ever suppressed.
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [Screen]);

  // Focus returns to the control that opened the modal (WCAG 2.4.3).
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const canvas = Screen ? (
    <div
      aria-hidden="true"
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
      {/* Rendered only once a scale is known, so the unscaled 1448px canvas is
          never painted at full size for a frame. */}
      {scale > 0 && <Screen />}
    </div>
  ) : (
    <img
      src={`${ASSET_BASE}/${file}-1448.webp`}
      srcSet={`${ASSET_BASE}/${file}-800.webp 800w, ${ASSET_BASE}/${file}-1448.webp 1448w`}
      sizes={PREVIEW_SIZES}
      width={CANVAS_W}
      height={CANVAS_H}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );

  const frame = (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        overflow: 'hidden',
        background: 'var(--jpd-surface)',
      }}
    >
      {canvas}
    </div>
  );

  if (!expandable) return <div className={className}>{frame}</div>;

  return (
    <>
      <div className={`relative ${className}`}>
        {frame}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Explore ${title} screen`}
          tabIndex={focusable ? 0 : -1}
          className="jpd-frame group absolute inset-0 flex cursor-zoom-in appearance-none items-center justify-center border-0 bg-transparent p-0 text-left"
        >
          <span aria-hidden="true" className="jpd-frame__wash" />
          {/* Decorative: the button around it is the control, so this must
              never become a button of its own. */}
          <span aria-hidden="true" className="jpd-frame__explore">
            <Maximize2 size={15} strokeWidth={2.25} />
            Explore screen
          </span>
        </button>
      </div>

      {open && (
        <DemoLightbox
          label={label}
          onClose={close}
          interactive={interactive}
          minScale={minScale}
          // A bitmap has no detail past its native size; a live screen does.
          maxScale={Screen ? undefined : 1}
        >
          {Screen ? (
            <Screen />
          ) : (
            <img
              src={`${ASSET_BASE}/${file}-1448.webp`}
              width={CANVAS_W}
              height={CANVAS_H}
              alt=""
              decoding="async"
              style={{ display: 'block', width: CANVAS_W, height: CANVAS_H }}
            />
          )}
        </DemoLightbox>
      )}
    </>
  );
}

export { CANVAS_W, CANVAS_H };
