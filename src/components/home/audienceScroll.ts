/**
 * The audience section's pinned, scroll-driven presentation, as pure maths
 * (Design System Section 46.12, Pinned scroll-driven presentation).
 *
 * SCROLL SELECTS; TRANSITIONS COMPLETE (revised 2026-11-09). `progress` is how
 * far the reader has scrolled into the section's scroll region, in steps
 * (one step of scroll per tab). It selects a tab and nothing else. The copy
 * and visual then reach that tab's complete resting state through short,
 * self-completing CSS transitions, so no half-faded copy or half-slid visual
 * can remain when scrolling stops.
 *
 * Superseded the same day: opacity and track position tied continuously to
 * progress, which rendered whatever fraction the reader stopped at.
 *
 *   progress  0 .... 0.75 ....... 1.75 ....... 2.75 ......... 3.5  (four tabs)
 *   tab       [   0   ][     1     ][     2     ][      3      ] → release
 *
 * Each tab owns one step; the first and last own three-quarters of a step.
 * Nothing here knows about the DOM, so the rules are unit-tested.
 */

/** How much scroll each tab consumes, as a fraction of the view height. */
export const STEP_OF_VIEW = 0.6;

/** Where, within a step, the tab hands over to the next one. */
export const SWITCH_AT = 0.75;

/**
 * Half-width of the band around each boundary inside which the current tab
 * is kept, so a reader resting on a boundary never flickers between tabs.
 */
export const HYSTERESIS = 0.06;

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/**
 * The scroll distance the region adds for `count` tabs, in px: through the
 * last tab's zone, after which the section releases.
 */
export function regionDistance(count: number, step: number): number {
  if (count <= 0) return 0;
  return (count - 1 + (1 - SWITCH_AT) * 2) * step;
}

/**
 * The tab selected at a scroll progress. With `current` given, a progress
 * within HYSTERESIS of the boundary between `current` and a neighbour keeps
 * `current`. A jump of more than one tab (a fast scroll) is taken directly.
 */
export function tabForProgress(progress: number, count: number, current?: number): number {
  if (count <= 1) return 0;
  const raw = clamp(Math.floor(progress - SWITCH_AT) + 1, 0, count - 1);
  if (current === undefined || raw === current || Math.abs(raw - current) !== 1) return raw;
  const boundary = Math.min(raw, current) + SWITCH_AT;
  return Math.abs(progress - boundary) < HYSTERESIS ? current : raw;
}

/**
 * Where a selected tab sits in the region, in steps: inside its zone, clear
 * of both boundaries. Clicking a tab scrolls here, so continued scrolling
 * resumes from that tab.
 */
export function progressForTab(index: number): number {
  return index + 0.25;
}
