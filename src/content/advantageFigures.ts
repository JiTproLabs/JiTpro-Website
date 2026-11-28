import type { CSSProperties } from 'react';

/**
 * Large dollar figures on /the-jitpro-advantage fit their panel at every width (Design System §83.1, Decision Log
 * 2026-11-27). A figure's size is the smaller of its type-scale size and the size at which its characters fill
 * `budget` percent of the nearest `@container` panel's width: a long amount steps down on a phone instead of
 * overflowing or being clipped, and desktop sizes are unchanged. Amounts are never abbreviated and never wrap.
 *
 * The page writes the font size as `min(<type-scale size>, var(--fig-fit))`.
 */

/**
 * Em per character assumed for the figures: Inter Tight extrabold with tabular numerals. The widest advance measured
 * in the rendered page was 0.592 em (the result rows, "$343,750"); this keeps a margin above it.
 */
export const FIGURE_EM_PER_CHAR = 0.62;

/** Measured on 2026-11-27 in headless Chrome: the widest em per character across the page's large figures. */
export const MEASURED_MAX_EM_PER_CHAR = 0.592;

/** The largest font size, in px, at which `text` fits `budget` percent of a container `containerPx` wide. */
export function fittedFontPx(text: string, budget: number, containerPx: number): number {
  return ((budget / 100) * containerPx) / (text.length * FIGURE_EM_PER_CHAR);
}

/** The inline custom property the figure's font size reads: `calc(<budget>cqw / <characters × em per character>)`. */
export function fitFigure(text: string, budget: number): CSSProperties {
  return { '--fig-fit': `calc(${budget}cqw / ${(text.length * FIGURE_EM_PER_CHAR).toFixed(3)})` } as CSSProperties;
}
