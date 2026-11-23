import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_INPUTS, calculate, formatContract, formatDollars, formatPct, formatPct1, formatPoints, keptPctFromContractPct, keptSliderRange, normalize, parseAmount } from './advantageCalculator';
import * as content from './advantageContent';

/** /the-jitpro-advantage profit retention calculator (Design System §83, issue #95). */

/** A fixed example for the arithmetic tests, independent of the landing defaults. */
const BASE = { contractValue: 5_000_000, expectedPct: 12, keptPct: 40, improvementPts: 3, projects: 5 };

describe('the landing example', () => {
  it('opens (and resets) at $2.75M, 12.5%, 5.7% kept, +5 points, 5 projects', () => {
    expect(DEFAULT_INPUTS).toEqual({ contractValue: 2_750_000, expectedPct: 12.5, keptPct: 45.6, improvementPts: 5, projects: 5 });
    const r = calculate(DEFAULT_INPUTS);
    expect(r.expectedProfit).toBe(343_750);
    expect(r.actualProfit).toBe(156_750);
    expect(r.couldHaveMade).toBe(294_250);
    expect(r.additionalProfit).toBe(137_500);
    expect(r.shortfall).toBe(187_000);
    expect([r.plannedPctOfContract, r.actualPctOfContract, r.couldPctOfContract].map(formatPct1)).toEqual(['12.5%', '5.7%', '10.7%']);
    expect(r.improvementPts).toBe(5);
    expect(r.maxImprovementPts).toBe(6.8);
    expect(r.annualAdditional).toBe(687_500);
  });
});

describe('one project', () => {
  it('computes the default: $5M job, 12% expected, kept 40%, +3 points', () => {
    const r = calculate(BASE);
    expect(r.expectedProfit).toBe(600_000);
    expect(r.actualProfit).toBe(240_000);
    expect(r.shortfall).toBe(360_000);
    expect(r.shortfallPctOfExpected).toBe(60);
    expect(r.maxImprovementPts).toBe(7.2);
    expect(r.additionalProfit).toBe(150_000);
    expect(r.couldHaveMade).toBe(390_000);
  });

  it('takes expected profit as a share of the contract value, not a markup on costs', () => {
    expect(calculate({ ...BASE, contractValue: 5_500_000, expectedPct: 12 }).expectedProfit).toBe(660_000);
    expect(calculate({ ...BASE, contractValue: 2_000_000, expectedPct: 8.5 }).expectedProfit).toBe(170_000);
  });

  it('takes what was kept as a share of the estimated profit: the brief’s $660,000 examples', () => {
    const at = (keptPct: number) => calculate({ ...BASE, contractValue: 5_500_000, expectedPct: 12, keptPct }).actualProfit;
    expect(at(100)).toBe(660_000);
    expect(at(50)).toBe(330_000);
    expect(at(0)).toBe(0);
    expect(at(-30)).toBe(-198_000);
  });

  it('keeps the kept percentage between −30% and 100%', () => {
    expect(normalize({ ...BASE, keptPct: -80 }).keptPct).toBe(-30);
    expect(normalize({ ...BASE, keptPct: 140 }).keptPct).toBe(100);
  });

  it('updates the shortfall and the cap when the job size or the estimate changes', () => {
    const bigger = calculate({ ...BASE, contractValue: 10_000_000 });
    expect(bigger.expectedProfit).toBe(1_200_000);
    expect(bigger.actualProfit).toBe(480_000);
    expect(bigger.shortfall).toBe(720_000);
    expect(bigger.maxImprovementPts).toBe(7.2);
    expect(bigger.additionalProfit).toBe(300_000);
    const lower = calculate({ ...BASE, expectedPct: 8 });
    expect(lower.expectedProfit).toBe(400_000);
    expect(lower.shortfall).toBe(240_000);
    expect(lower.maxImprovementPts).toBe(4.8);
    expect(lower.additionalProfit).toBe(150_000);
  });

  it('measures the improvement in points of contract value, not percent of expected profit', () => {
    const r = calculate({ ...BASE, contractValue: 2_000_000, improvementPts: 3 });
    expect(r.additionalProfit).toBe(60_000);
    expect(r.additionalProfit).not.toBe(r.expectedProfit * 0.03);
  });

  it('never lets the improvement exceed the shortfall, and remembers what was asked for', () => {
    const r = calculate({ ...BASE, improvementPts: 12 });
    expect(r.improvementPts).toBe(7.2);
    expect(r.additionalProfit).toBe(360_000);
    expect(r.couldHaveMade).toBe(600_000);
    expect(normalize({ ...BASE, improvementPts: 12 }).improvementPts).toBe(12);
  });

  it('floors the cap to whole tenths of a point and never overshoots the shortfall', () => {
    const r = calculate({ ...BASE, contractValue: 3_050_000, expectedPct: 12, keptPct: 85, improvementPts: 10 });
    expect(r.shortfall).toBe(54_900);
    expect(r.maxImprovementPts).toBe(1.8);
    expect(r.additionalProfit).toBe(54_900);
  });

  it('handles a loss', () => {
    const r = calculate({ ...BASE, keptPct: -30 });
    expect(r.actualProfit).toBe(-180_000);
    expect(r.shortfall).toBe(780_000);
    expect(r.shortfallPctOfExpected).toBe(130);
    expect(r.couldHaveMade).toBe(-30_000);
    expect(formatDollars(r.actualProfit)).toBe('-$180,000');
  });

  it('shows no gap when everything estimated was kept', () => {
    const r = calculate({ ...BASE, keptPct: 100 });
    expect(r.shortfall).toBe(0);
    expect(r.favorable).toBe(0);
    expect(r.shortfallPctOfExpected).toBeNull();
    expect(r.maxImprovementPts).toBe(0);
    expect(r.additionalProfit).toBe(0);
    expect(r.couldHaveMade).toBe(600_000);
  });
});

describe('the results as percentages of contract value', () => {
  it('matches the founder’s example: $2.2M job, 13.5% expected, kept 40%, +7 points', () => {
    const r = calculate({ ...BASE, contractValue: 2_200_000, expectedPct: 13.5, keptPct: 40, improvementPts: 7 });
    expect(r.expectedProfit).toBe(297_000);
    expect(r.actualProfit).toBe(118_800);
    expect(r.couldHaveMade).toBe(272_800);
    expect(formatPct1(r.plannedPctOfContract)).toBe('13.5%');
    expect(formatPct1(r.actualPctOfContract)).toBe('5.4%');
    expect(formatPct1(r.couldPctOfContract)).toBe('12.4%');
  });

  it('shows the default and a loss to one decimal place', () => {
    const d = calculate(BASE);
    expect([d.plannedPctOfContract, d.actualPctOfContract, d.couldPctOfContract].map(formatPct1)).toEqual(['12.0%', '4.8%', '7.8%']);
    const loss = calculate({ ...BASE, keptPct: -30 });
    expect(formatPct1(loss.actualPctOfContract)).toBe('-3.6%');
    expect(formatPct1(loss.couldPctOfContract)).toBe('-0.6%');
    expect(formatPct1(-0.04)).toBe('0.0%');
  });
});

describe('the tenth-of-a-point sliders', () => {
  it('spans the kept slider from a 30% loss of the estimate to all of it, in tenths of contract value', () => {
    expect(keptSliderRange(12)).toEqual({ min: -3.6, max: 12, step: 0.1 });
    expect(keptSliderRange(12.5)).toEqual({ min: -3.7, max: 12.5, step: 0.1 });
    expect(keptSliderRange(13.3)).toEqual({ min: -3.9, max: 13.3, step: 0.1 });
  });

  it('turns a kept share of the contract into the share of the estimate, and back', () => {
    expect(keptPctFromContractPct(4.8, 12)).toBeCloseTo(40, 10);
    const kept = keptPctFromContractPct(5.1, 12.5);
    const r = calculate({ ...BASE, contractValue: 3_450_000, expectedPct: 12.5, keptPct: kept });
    expect(formatPct1(r.actualPctOfContract)).toBe('5.1%');
    expect(r.actualProfit).toBe(175_950);
  });

  it('accepts expected profit in tenths', () => {
    expect(calculate({ ...BASE, expectedPct: 12.3 }).expectedProfit).toBe(615_000);
  });
});

describe('a year of similar projects', () => {
  it('multiplies the additional profit per project', () => {
    expect(calculate(BASE).annualAdditional).toBe(750_000);
    expect(calculate({ ...BASE, projects: 1 }).annualAdditional).toBe(150_000);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) expect(calculate({ ...BASE, projects: n }).annualAdditional).toBe(150_000 * n);
    expect(calculate({ ...BASE, projects: 24 }).annualAdditional).toBe(3_600_000);
  });

  it('keeps the project count a reasonable positive whole number', () => {
    expect(normalize({ ...BASE, projects: 0 }).projects).toBe(1);
    expect(normalize({ ...BASE, projects: 7.6 }).projects).toBe(8);
    expect(normalize({ ...BASE, projects: 9999 }).projects).toBe(500);
    expect(normalize({ ...BASE, projects: Number.NaN }).projects).toBe(5);
  });
});

describe('inputs and formatting', () => {
  it('keeps inputs in range and replaces non-numbers with the example', () => {
    const n = normalize({ ...BASE, contractValue: 10, expectedPct: 3, keptPct: Number.NaN });
    expect(n.contractValue).toBe(250_000);
    expect(n.expectedPct).toBe(8);
    expect(n.keptPct).toBe(DEFAULT_INPUTS.keptPct);
    expect(normalize({ ...BASE, expectedPct: 20 }).expectedPct).toBe(14);
    expect(normalize({ ...BASE, contractValue: 60_000_000 }).contractValue).toBe(10_000_000);
  });

  it('parses typed amounts', () => {
    expect(parseAmount('$650,000')).toBe(650_000);
    expect(parseAmount('1.25m')).toBe(1_250_000);
    expect(parseAmount('250k')).toBe(250_000);
    expect(parseAmount('-50,000')).toBe(-50_000);
    expect(parseAmount('lots')).toBeNaN();
  });

  it('formats figures', () => {
    expect(formatDollars(750_000)).toBe('$750,000');
    expect(formatContract(5_000_000)).toBe('$5 million');
    expect(formatContract(750_000)).toBe('$750,000');
    expect(formatPoints(3)).toBe('3 points');
    expect(formatPoints(1)).toBe('1 point');
    expect(formatPoints(0.1)).toBe('0.1 points');
    expect(formatPct(12.5)).toBe('12.5%');
  });
});

describe('advantage page copy', () => {
  const allCopy: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string') allCopy.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(content);

  it('uses no em dashes', () => {
    for (const text of allCopy) expect(text).not.toContain('—');
    expect(readFileSync(resolve(__dirname, '../pages/TheJiTproAdvantage.tsx'), 'utf8')).not.toContain('—');
  });

  it('makes no claims the page must not make', () => {
    const banned = [/erosion/i, /\bCPM\b/, /critical path/i, /\beliminat/i, /\bSaaS\b/i, /platform/i, /cheapest/i];
    for (const text of allCopy) for (const pattern of banned) expect(text, text).not.toMatch(pattern);
    // The calculator itself stays free of accounting terms.
    const calculatorCopy: string[] = [];
    const collect = (v: unknown) => {
      if (typeof v === 'string') calculatorCopy.push(v);
      else if (v && typeof v === 'object') Object.values(v).forEach(collect);
    };
    collect(content.PROFIT);
    for (const text of calculatorCopy) {
      for (const term of [/overhead/i, /markup/i, /margin/i, /contingency/i]) expect(text, text).not.toMatch(term);
    }
    // "Guarantee" appears only in the disclaimer that says there is none.
    expect(allCopy.filter((t) => /guarantee/i.test(t))).toEqual([content.PROFIT.disclaimer]);
  });

  it('uses the founder’s disclaimer exactly', () => {
    expect(content.PROFIT.disclaimer).toBe(
      'Illustrative example only. Use consistent profit figures. Annual results assume similar projects and the same improvement on each. Actual results depend on project conditions and contract terms. JiTpro does not guarantee specific profit improvements.',
    );
  });

  it('keeps the founder’s key statements', () => {
    expect(content.RACE_TO_BOTTOM.statement).toBe(
      "You've reduced your profit before construction even begins, but you haven't reduced the inefficiencies that consume it.",
    );
    expect(content.COMPOUNDING.statement.join(' ')).toBe(
      "Operational excellence creates pricing flexibility. Pricing flexibility doesn't create operational excellence.",
    );
    expect(content.HOW_JITPRO.concepts.map((c) => c.title)).toEqual(['Clarity', 'Control', 'Coordination', 'Performance']);
  });
});
