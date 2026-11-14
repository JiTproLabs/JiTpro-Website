/**
 * The audience section's one state value and the rules that move it
 * (Design System Section 46.12, State). Kept free of React so the rules are
 * unit-tested by the node test runner.
 *
 * The selection is the WHOLE state of the section (Section 46.3): which
 * audience is chosen and which of its tabs is open. Everything rendered —
 * the visible rail, the selected pill, the visible panel — derives from it.
 */

import { DEFAULT_AUDIENCE_ID, HOME_AUDIENCES, type Audience } from '../../content/homeAudiences';

export type AudienceSelection = {
  audienceId: string;
  tabIndex: number;
};

export const INITIAL_SELECTION: AudienceSelection = {
  audienceId: DEFAULT_AUDIENCE_ID,
  tabIndex: 0,
};

export function audienceFor(
  selection: AudienceSelection,
  audiences: readonly Audience[] = HOME_AUDIENCES,
): Audience {
  return audiences.find((a) => a.id === selection.audienceId) ?? audiences[0];
}

/**
 * Choosing an audience always opens its first tab (Section 46.12). Tab
 * positions are not remembered per audience. An unknown id leaves the
 * selection unchanged.
 */
export function selectAudience(
  selection: AudienceSelection,
  audienceId: string,
  audiences: readonly Audience[] = HOME_AUDIENCES,
): AudienceSelection {
  if (!audiences.some((a) => a.id === audienceId)) return selection;
  return { audienceId, tabIndex: 0 };
}

/** Opens a tab of the current audience. An out-of-range index is ignored. */
export function selectTab(
  selection: AudienceSelection,
  tabIndex: number,
  audiences: readonly Audience[] = HOME_AUDIENCES,
): AudienceSelection {
  const count = audienceFor(selection, audiences).tabs.length;
  if (!Number.isInteger(tabIndex) || tabIndex < 0 || tabIndex >= count) return selection;
  return { ...selection, tabIndex };
}

/**
 * Where a key moves KEYBOARD FOCUS within the tab rail (WAI-ARIA tabs,
 * manual activation). This never selects a tab: focus indicates
 * availability only, and Enter or Space commits (Section 46.8). Left and
 * Right wrap; Home and End jump to the ends. Returns null for any other key,
 * so the browser keeps its default behaviour.
 */
export function railFocusTarget(key: string, current: number, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count;
    case 'ArrowLeft':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
