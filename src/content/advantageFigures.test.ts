import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LIMITS, calculate, formatDollars, type RetentionInputs } from './advantageCalculator';
import { FIGURE_EM_PER_CHAR, MEASURED_MAX_EM_PER_CHAR, fitFigure, fittedFontPx } from './advantageFigures';

/**
 * The calculator's large figures fit their panels on the narrowest phone (Design System §83.1, Decision Log
 * 2026-11-27). Panel content widths measured in headless Chrome at a 320 px viewport.
 */
const AT_320 = { resultsPanel: 222, moreProfitBox: 180, yearColumn: 222 };

/** Every combination of the inputs' extremes: the longest amounts the calculator can show. */
function extremes(): ReturnType<typeof calculate>[] {
  const out: ReturnType<typeof calculate>[] = [];
  for (const contractValue of [LIMITS.contractValue.min, LIMITS.contractValue.max])
    for (const expectedPct of [LIMITS.expectedPct.min, LIMITS.expectedPct.max])
      for (const keptPct of [LIMITS.keptPct.min, 0, LIMITS.keptPct.max])
        for (const recoveryPct of [LIMITS.recoveryPct.min, LIMITS.recoveryPct.max])
          for (const projects of [LIMITS.projects.min, LIMITS.projects.max]) {
            const inputs: RetentionInputs = { contractValue, expectedPct, keptPct, recoveryPct, projects };
            out.push(calculate(inputs));
          }
  return out;
}
const longest = (pick: (r: ReturnType<typeof calculate>) => number) =>
  extremes()
    .map((r) => formatDollars(pick(r)))
    .reduce((a, b) => (b.length > a.length ? b : a));

describe('large figures fit their panels', () => {
  it('assumes at least the widest character advance measured on the page', () => {
    expect(FIGURE_EM_PER_CHAR).toBeGreaterThanOrEqual(MEASURED_MAX_EM_PER_CHAR);
  });

  it('knows the longest amounts the calculator can produce (re-verify the page if these grow)', () => {
    // Characters, as formatted: "$1,400,000" for the three results and the more-profit figure, "$910,000,000" for the year.
    expect(longest((r) => r.expectedProfit)).toHaveLength(10);
    expect(longest((r) => r.actualProfit)).toHaveLength(10);
    expect(longest((r) => r.couldHaveMade)).toHaveLength(10);
    expect(longest((r) => r.additionalProfit)).toHaveLength(10);
    expect(longest((r) => r.annualAdditional)).toHaveLength(12);
  });

  it('keeps the longest amounts whole and legible at 320 px', () => {
    const rows = fittedFontPx(longest((r) => r.couldHaveMade), 55, AT_320.resultsPanel);
    const more = fittedFontPx(longest((r) => r.additionalProfit), 100, AT_320.moreProfitBox);
    const year = fittedFontPx(longest((r) => r.annualAdditional), 100, AT_320.yearColumn);
    for (const px of [rows, more, year]) expect(px).toBeGreaterThanOrEqual(18);
    // The result rows leave the label at least 80 px beside the figure (its longest word is about 73 px).
    const figure = rows * '$1,400,000'.length * MEASURED_MAX_EM_PER_CHAR;
    expect(AT_320.resultsPanel - figure - 16).toBeGreaterThanOrEqual(80);
  });

  it('never exceeds the type scale on desktop for the example', () => {
    // At 1440 the panels measure about 464 (more profit) and 625 (year); the example keeps its 56 px and 86.4 px.
    expect(fittedFontPx('$137,500', 100, 464)).toBeGreaterThan(56);
    expect(fittedFontPx('$687,500', 100, 625)).toBeGreaterThan(86.4);
  });

  it('writes the container-relative size the page reads', () => {
    expect(fitFigure('$137,500', 100)).toEqual({ '--fig-fit': 'calc(100cqw / 4.960)' });
  });
});

describe('the page keeps its responsive hooks', () => {
  const page = readFileSync(resolve(__dirname, '../pages/TheJiTproAdvantage.tsx'), 'utf8');

  it('lets the calculator and year grids shrink below their content', () => {
    expect(page).toContain('grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]');
    expect(page).toContain('grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]');
  });

  it('sizes all five figures to their panel', () => {
    // StoryLine (planned, kept, could have kept), more profit, and the year.
    expect(page.match(/style=\{fitFigure\(/g)).toHaveLength(3);
    expect(page.match(/var\(--fig-fit\)/g)?.length).toBeGreaterThanOrEqual(7);
  });
});
