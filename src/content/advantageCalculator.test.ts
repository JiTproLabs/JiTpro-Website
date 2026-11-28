import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_INPUTS, calculate, formatContract, formatDollars, formatPct, formatPct1, keptPctFromContractPct, keptSliderRange, normalize, parseAmount } from './advantageCalculator';
import * as content from './advantageContent';

/** /the-jitpro-advantage profit retention calculator (Design System §83, issue #95). */

/** A fixed example for the arithmetic tests, independent of the landing defaults. */
const BASE = { contractValue: 5_000_000, expectedPct: 12, keptPct: 40, recoveryPct: 25, projects: 5 };

describe('the landing example', () => {
  it('opens (and resets) at $2.75M, 12.5%, 5.7% kept, $137,500 of the shortfall recovered, 5 projects', () => {
    expect(DEFAULT_INPUTS).toEqual({ contractValue: 2_750_000, expectedPct: 12.5, keptPct: 45.6, recoveryPct: (137_500 / 187_000) * 100, projects: 5 });
    const r = calculate(DEFAULT_INPUTS);
    expect(r.expectedProfit).toBe(343_750);
    expect(r.actualProfit).toBe(156_750);
    expect(r.couldHaveMade).toBe(294_250);
    expect(r.additionalProfit).toBe(137_500);
    expect(r.shortfall).toBe(187_000);
    expect([r.plannedPctOfContract, r.actualPctOfContract, r.couldPctOfContract].map(formatPct1)).toEqual(['12.5%', '5.7%', '10.7%']);
    expect(formatPct1(r.recoveryPct)).toBe('73.5%');
    expect(r.annualAdditional).toBe(687_500);
  });
});

describe('one project', () => {
  it('computes the base: $5M job, 12% expected, kept 40%, a quarter of the shortfall recovered', () => {
    const r = calculate(BASE);
    expect(r.expectedProfit).toBe(600_000);
    expect(r.actualProfit).toBe(240_000);
    expect(r.shortfall).toBe(360_000);
    expect(r.shortfallPctOfExpected).toBe(60);
    expect(r.additionalProfit).toBe(90_000);
    expect(r.couldHaveMade).toBe(330_000);
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

  it('keeps the recovery share when the job, the estimate or the kept profit changes, and rescales the dollars', () => {
    const bigger = calculate({ ...BASE, contractValue: 10_000_000 });
    expect(bigger.shortfall).toBe(720_000);
    expect(bigger.recoveryPct).toBe(25);
    expect(bigger.additionalProfit).toBe(180_000);
    const lower = calculate({ ...BASE, expectedPct: 8 });
    expect(lower.shortfall).toBe(240_000);
    expect(lower.additionalProfit).toBe(60_000);
    const keptMore = calculate({ ...BASE, keptPct: 80 });
    expect(keptMore.shortfall).toBe(120_000);
    expect(keptMore.additionalProfit).toBe(30_000);
  });

  it('measures the recovery as a share of the shortfall, not of the contract value', () => {
    const r = calculate({ ...BASE, recoveryPct: 50 });
    expect(r.additionalProfit).toBe(r.shortfall / 2);
    expect(r.additionalProfit).not.toBe(BASE.contractValue * 0.5);
  });

  it('runs from nothing to the whole shortfall, and never past it', () => {
    expect(calculate({ ...BASE, recoveryPct: 0 }).additionalProfit).toBe(0);
    expect(calculate({ ...BASE, recoveryPct: 0 }).couldHaveMade).toBe(240_000);
    expect(normalize({ ...BASE, recoveryPct: 140 }).recoveryPct).toBe(100);
    expect(normalize({ ...BASE, recoveryPct: -5 }).recoveryPct).toBe(0);
    expect(normalize({ ...BASE, recoveryPct: Number.NaN }).recoveryPct).toBe(DEFAULT_INPUTS.recoveryPct);
    for (let tenths = 0; tenths <= 1000; tenths += 1) {
      const r = calculate({ ...DEFAULT_INPUTS, recoveryPct: tenths / 10 });
      expect(r.additionalProfit).toBeLessThanOrEqual(r.shortfall);
      expect(r.additionalProfit).toBe(Math.round(r.additionalProfit * 100) / 100);
    }
  });

  it('lands exactly on the original estimate at 100%, whatever the figures', () => {
    for (const [contractValue, expectedPct, keptPct] of [
      [2_750_000, 12.5, 45.6],
      [3_050_000, 13.7, 33.3],
      [9_950_000, 8.1, -30],
      [250_000, 14, 99.9],
    ]) {
      const r = calculate({ ...BASE, contractValue, expectedPct, keptPct, recoveryPct: 100 });
      expect(r.additionalProfit).toBe(r.shortfall);
      expect(r.couldHaveMade).toBe(r.expectedProfit);
      expect(r.couldPctOfContract).toBe(r.plannedPctOfContract);
    }
  });

  it('handles a loss', () => {
    const r = calculate({ ...BASE, keptPct: -30 });
    expect(r.actualProfit).toBe(-180_000);
    expect(r.shortfall).toBe(780_000);
    expect(r.shortfallPctOfExpected).toBe(130);
    // The shortfall includes climbing back from the loss to the estimate.
    expect(r.additionalProfit).toBe(195_000);
    expect(r.couldHaveMade).toBe(15_000);
    expect(calculate({ ...BASE, keptPct: -30, recoveryPct: 100 }).couldHaveMade).toBe(600_000);
    expect(formatDollars(r.actualProfit)).toBe('-$180,000');
  });

  it('shows no gap when everything estimated was kept', () => {
    const r = calculate({ ...BASE, keptPct: 100 });
    expect(r.shortfall).toBe(0);
    expect(r.favorable).toBe(0);
    expect(r.shortfallPctOfExpected).toBeNull();
    expect(r.additionalProfit).toBe(0);
    expect(r.couldHaveMade).toBe(600_000);
    expect(calculate({ ...BASE, keptPct: 100, recoveryPct: 100 }).couldHaveMade).toBe(600_000);
    expect(r.annualAdditional).toBe(0);
  });
});

describe('the results as percentages of contract value', () => {
  it('matches the founder’s example: $2.2M job, 13.5% expected, kept 40%, $154,000 recovered', () => {
    const r = calculate({ ...BASE, contractValue: 2_200_000, expectedPct: 13.5, keptPct: 40, recoveryPct: (154_000 / 178_200) * 100 });
    expect(r.expectedProfit).toBe(297_000);
    expect(r.actualProfit).toBe(118_800);
    expect(r.couldHaveMade).toBe(272_800);
    expect(formatPct1(r.plannedPctOfContract)).toBe('13.5%');
    expect(formatPct1(r.actualPctOfContract)).toBe('5.4%');
    expect(formatPct1(r.couldPctOfContract)).toBe('12.4%');
  });

  it('shows the default and a loss to one decimal place', () => {
    const d = calculate(BASE);
    expect([d.plannedPctOfContract, d.actualPctOfContract, d.couldPctOfContract].map(formatPct1)).toEqual(['12.0%', '4.8%', '6.6%']);
    const loss = calculate({ ...BASE, keptPct: -30 });
    expect(formatPct1(loss.actualPctOfContract)).toBe('-3.6%');
    expect(formatPct1(loss.couldPctOfContract)).toBe('0.3%');
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
    expect(calculate(BASE).annualAdditional).toBe(450_000);
    expect(calculate({ ...BASE, projects: 1 }).annualAdditional).toBe(90_000);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) expect(calculate({ ...BASE, projects: n }).annualAdditional).toBe(90_000 * n);
    expect(calculate({ ...BASE, projects: 24 }).annualAdditional).toBe(2_160_000);
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
    const { heading, closing } = content.RACE_TO_BOTTOM;
    expect([...heading.lines, heading.emphasis].join(' ')).toBe('Winning the job means nothing if you lose the profit.');
    expect(closing.before + closing.emphasis + closing.after).toBe('Compete through performance, not sacrifice.');
    expect(content.RACE_TO_BOTTOM.comparison.map((p) => p.outcome)).toEqual([
      'Greater financial exposure.',
      'Greater competitive strength.',
    ]);
    expect(content.COMPOUNDING.statement.join(' ')).toBe(
      "Operational excellence creates pricing flexibility. Pricing flexibility doesn't create operational excellence.",
    );
    expect(content.HOW_JITPRO.concepts.map((c) => c.title)).toEqual(['Clarity', 'Control', 'Coordination', 'Performance']);
    expect(content.HOW_JITPRO.heading).toBe('Four disciplines. One stronger project.');
    expect(content.HOW_JITPRO.concepts.map((c) => c.body)).toEqual([
      'Know what needs to happen.',
      'Give every requirement an owner and a date.',
      'Keep everyone working toward the same plan.',
      'Protect the work and the profit.',
    ]);
    expect(content.HOW_JITPRO.closing).toBe('Better preparation leads to better execution.');
    expect(content.COMPOUNDING.heading.lines.join(' ')).toBe('Control compounds into advantage.');
    expect(content.COMPOUNDING.steps).toEqual(['Stronger control', 'More reliable execution', 'Greater retained profit', 'Greater competitive strength']);
  });
});
