import { useLayoutEffect, useRef } from 'react';
import ProductRegisterScreen from '../demo/screens/ProductRegisterScreen';
import { CAMERA_DURATION_MS, CANVAS, cameraKeyframes, cameraView, transformOf, type Frame } from './identifyRegisterCamera';
import { PREVIEW_TITLE } from './identifyRegisterPreviewData';

/**
 * The Identify tab's visual: the complete JiTpro register, seen through a
 * camera (Design System Section 54.4.1, amended 2026-11-10).
 *
 * THE REGISTER IS THE CANONICAL SCREEN, NOT A HOMEPAGE COPY. It renders
 * `ProductRegisterScreen` — the same component the Learn More page, the
 * expanded view and the demo lab render — on its fixed 1448 x 1086 canvas:
 * the JiTpro sidebar, project selector, register heading, summary cards,
 * search and filters, the full ten-column table and the Product Detail
 * panel. The only difference is the heading, which reads *Procurement
 * Register* here to match the Identify copy (§54.5 open item 5); every other
 * surface keeps *Product Register*.
 *
 * THE CAMERA, from `played` alone (the checklist's state, §46.3): parked on
 * the overview when not played; one pass when played — the overview held
 * until the checklist has finished, then the items and categories, trades,
 * suppliers and statuses, lead times and Required On-Site dates, the Source
 * column and the panel's Source Information, then the resting view of the
 * register's heading, cards and first rows. It never loops, and the canvas
 * always covers the frame (identifyRegisterCamera.ts). Reduced motion: the
 * resting view at once. A real resize ends the pass at rest.
 *
 * Illustration only: the visual column is aria-hidden (§46.12), and the
 * screen contains no controls.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export default function IdentifyRegisterPreview({ played }: { played: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    const size = (): Frame => ({ w: frame.clientWidth, h: frame.clientHeight });
    /* Where the camera rests outside a pass. */
    const parked = () => transformOf(cameraView(size(), played || reduced ? 'rest' : 'overview'));

    let animation: Animation | null = null;
    const stop = () => {
      animation?.cancel();
      animation = null;
    };

    canvas.style.transform = parked();
    if (played && !reduced) {
      animation = canvas.animate(cameraKeyframes(size()), { duration: CAMERA_DURATION_MS, fill: 'forwards' });
      animation.onfinish = stop;
    }

    /* A real size change re-parks; mid-pass it ends the pass at rest. */
    let last = `${frame.clientWidth}x${frame.clientHeight}`;
    const ro = new ResizeObserver(() => {
      const next = `${frame.clientWidth}x${frame.clientHeight}`;
      if (next === last) return;
      last = next;
      stop();
      canvas.style.transform = parked();
    });
    ro.observe(frame);
    return () => {
      ro.disconnect();
      stop();
    };
  }, [played]);

  return (
    <div ref={frameRef} className="relative h-full overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CANVAS.w, height: CANVAS.h }}
      >
        <ProductRegisterScreen title={PREVIEW_TITLE} />
      </div>
    </div>
  );
}
