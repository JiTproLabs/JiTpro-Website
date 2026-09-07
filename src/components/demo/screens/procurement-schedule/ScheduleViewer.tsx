import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ProcurementScheduleScreen from './ProcurementScheduleScreen';
import { InspectionContext, visibleScreenRect } from '../../inspection';
import '../../tokens.css';
import './scheduleTokens.css';

/**
 * THE ONE WAY TO PRESENT THE PROCUREMENT SCHEDULE.
 *
 * ProcurementScheduleScreen is authored at a fixed 1448×1086 application
 * canvas and is never responsive. This component is the presentation seam
 * around it: it scales the canvas to its container (or to an explicit
 * scale), supplies the inspection capabilities, and owns the portal target
 * the inspector mounts into. Every surface that shows the schedule - the dev
 * lab's three views and the team review page - renders THIS, so there is one
 * screen, one fixture, one engine, and nothing for a second surface to copy.
 *
 * The portal target sits OUTSIDE the scaled canvas so popover typography is
 * never multiplied by the transform. The popover itself is position: fixed
 * against the viewport, so neither page scroll nor this host's own horizontal
 * scroll can displace it. Nothing here intercepts a pointer, a key or a
 * touch: every interaction the screen implements reaches it unchanged.
 */

export const CANVAS_W = 1448;
export const CANVAS_H = 1086;

type Props = {
  /** Explicit scale. Omit to fit the container's width, never above 1:1. */
  scale?: number;
  /** Floor for the fitted scale. Below it the host scrolls horizontally
      rather than shrinking the canvas further, so the authored geometry is
      preserved on a narrow laptop instead of crushed into it. */
  minScale?: number;
  /** Per-phase inspection (hover, focus, touch, zoom). Off for previews. */
  enabled?: boolean;
  /** Reports the effective scale whenever it changes. */
  onScale?: (scale: number) => void;
};

export default function ScheduleViewer({ scale, minScale = 0, enabled = true, onScale }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [fitScale, setFitScale] = useState(1);

  useLayoutEffect(() => setPortalEl(portalRef.current), []);

  const fitting = scale === undefined;
  useLayoutEffect(() => {
    if (!fitting) return;
    const el = hostRef.current;
    if (!el) return;
    const measure = () =>
      setFitScale(Math.min(1, Math.max(minScale, el.clientWidth / CANVAS_W)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [fitting, minScale]);

  const s = fitting ? fitScale : scale;
  useEffect(() => {
    onScale?.(s);
  }, [s, onScale]);

  /**
   * What an inspecting screen may cover here: the part of the canvas this
   * host is showing, itself clipped to the window because this surface sits
   * in an ordinary scrolling page rather than in a dialog. Same question, same
   * helper, different container - which is the point of asking the host.
   */
  const getBounds = useCallback(
    () => visibleScreenRect(hostRef.current, canvasBoxRef.current),
    [],
  );

  const capabilities = useMemo(
    () => ({ enabled, portalTarget: portalEl, getBounds }),
    [enabled, portalEl, getBounds],
  );

  return (
    <div ref={hostRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div ref={canvasBoxRef} style={{ width: CANVAS_W * s, height: CANVAS_H * s, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${s})`,
            transformOrigin: 'top left',
          }}
        >
          <InspectionContext.Provider value={capabilities}>
            <ProcurementScheduleScreen />
          </InspectionContext.Provider>
        </div>
      </div>
      {/* The inspection portal target. Deliberately outside the scaled canvas. */}
      <div ref={portalRef} />
    </div>
  );
}
