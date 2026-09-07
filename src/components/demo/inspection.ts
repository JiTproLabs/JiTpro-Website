import { createContext, useContext } from 'react';

/**
 * INSPECTION CAPABILITIES - what a host grants a representative screen.
 *
 * A screen is authored once and rendered in several hosts: the resting
 * preview in a page, the expanded view in the lightbox, the team review page,
 * the dev lab. The screen itself never decides whether it is interactive; the
 * host does, through this context. The default is inert, so a screen rendered
 * with no provider (a preview inside a page) behaves exactly like the raster
 * it replaced: nothing inside it is a control.
 *
 * `portalTarget` is where a screen mounts its inspection popover. It matters
 * in the lightbox: a native <dialog> opened with showModal() lives in the
 * top layer, and anything portalled to document.body paints underneath it.
 *
 * `getBounds` is where the popover is ALLOWED to be. Only the host knows what
 * is clipping the screen - the lightbox's panning viewport, the review page's
 * horizontally scrolling host - so the host reports the rectangle the visitor
 * can actually see and the screen clamps into it. Without this a screen can
 * only clamp to the window, which is the whole browser and includes the dark
 * area around a centred dialog.
 */
export type InspectionCapabilities = {
  /** Where the popover mounts. Null falls back to document.body. */
  portalTarget: HTMLElement | null;
  /** Off in a preview; on in an expanded or dedicated view. */
  enabled: boolean;
  /**
   * The visible screen area in VIEWPORT coordinates, or null when the host
   * has not measured yet. Omitted by a host that has no opinion, in which
   * case placement falls back to the window.
   */
  getBounds?: () => DOMRect | null;
};

export const InspectionContext = createContext<InspectionCapabilities>({
  portalTarget: null,
  enabled: false,
});

/** The window's own rectangle, in the same coordinate space as a client rect. */
export function windowRect(): DOMRect {
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

/**
 * The visible part of a screen: what its clip container shows of it, and no
 * more of the window than is on screen. Hosts build their `getBounds` from
 * this so every surface answers the question the same way.
 *
 * `clip` is whatever actually crops the canvas (a scrolling viewport); `box`
 * is the canvas's own rendered rectangle. The canvas matters because a
 * viewport wider than the screen leaves dark space either side, and a popover
 * sitting in that space is exactly the fault this exists to prevent. Returns
 * null when the intersection is empty - nothing of the screen is visible, so
 * there is nowhere legitimate to place a card.
 */
export function visibleScreenRect(clip: Element | null, box: Element | null): DOMRect | null {
  const rects = [windowRect()];
  if (clip) rects.push(clip.getBoundingClientRect());
  if (box) rects.push(box.getBoundingClientRect());

  let left = -Infinity;
  let top = -Infinity;
  let right = Infinity;
  let bottom = Infinity;
  for (const r of rects) {
    left = Math.max(left, r.left);
    top = Math.max(top, r.top);
    right = Math.min(right, r.right);
    bottom = Math.min(bottom, r.bottom);
  }
  if (right <= left || bottom <= top) return null;
  return new DOMRect(left, top, right - left, bottom - top);
}

export function useInspection() {
  return useContext(InspectionContext);
}
