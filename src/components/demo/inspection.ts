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
 */
export type InspectionCapabilities = {
  /** Where the popover mounts. Null falls back to document.body. */
  portalTarget: HTMLElement | null;
  /** Off in a preview; on in an expanded or dedicated view. */
  enabled: boolean;
};

export const InspectionContext = createContext<InspectionCapabilities>({
  portalTarget: null,
  enabled: false,
});

export function useInspection() {
  return useContext(InspectionContext);
}
