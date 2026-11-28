import { describe, expect, it } from 'vitest';
import { DEFAULT_INPUTS, calculate, keptSliderRange, type RetentionInputs } from './advantageCalculator';
import { PROFIT, keptSentence } from './advantageContent';

/** The line under "How much did you actually keep?" (founder brief Refine Profit Calculator Language, 2026-11-27). */
const at = (over: Partial<RetentionInputs>) => keptSentence(calculate({ ...DEFAULT_INPUTS, ...over }));

describe('the kept sentence', () => {
  it('tells the default example in the calculator’s own dollars', () => {
    expect(at({})).toBe('You kept $156,750. The other $187,000 slipped away.');
  });

  it('follows the sliders instead of repeating the example', () => {
    expect(at({ keptPct: 50 })).toBe('You kept $171,875. The other $171,875 slipped away.');
    expect(at({ contractValue: 5_000_000, expectedPct: 10, keptPct: 25 })).toBe('You kept $125,000. The other $375,000 slipped away.');
  });

  it('says so when every dollar was kept, including at the slider’s top end', () => {
    expect(at({ keptPct: 100 })).toBe('You kept every dollar of the profit you expected.');
    // The kept slider's maximum, in percent of contract, converted the way the page converts it.
    const { max } = keptSliderRange(DEFAULT_INPUTS.expectedPct);
    expect(at({ keptPct: (max / DEFAULT_INPUTS.expectedPct) * 100 })).toBe('You kept every dollar of the profit you expected.');
  });

  it('breaks even', () => {
    expect(at({ keptPct: 0 })).toBe('You broke even. The $343,750 you expected to make slipped away.');
  });

  it('reports a loss as in the red, against what was expected', () => {
    expect(at({ keptPct: -30 })).toBe('You finished $103,125 in the red, instead of making the $343,750 you expected.');
    expect(keptSentence({ expectedProfit: 343_750, actualProfit: -50_000, shortfall: 393_750, favorable: 0 })).toBe(
      'You finished $50,000 in the red, instead of making the $343,750 you expected.',
    );
  });

  it('reports finishing ahead of the estimate', () => {
    expect(keptSentence({ expectedProfit: 343_750, actualProfit: 368_750, shortfall: 0, favorable: 25_000 })).toBe(
      'You finished $25,000 ahead of what you expected.',
    );
  });

  it('compares whole dollars, as displayed, so a stray cent never reads as $0 slipped away', () => {
    expect(keptSentence({ expectedProfit: 343_750, actualProfit: 343_749.99, shortfall: 0.01, favorable: 0 })).toBe(
      'You kept every dollar of the profit you expected.',
    );
  });

  it('handles an expected profit of zero', () => {
    expect(keptSentence({ expectedProfit: 0, actualProfit: 0, shortfall: 0, favorable: 0 })).toBe('You broke even.');
    expect(keptSentence({ expectedProfit: 0, actualProfit: 5_000, shortfall: 0, favorable: 5_000 })).toBe('You finished $5,000 ahead of what you expected.');
    expect(keptSentence({ expectedProfit: 0, actualProfit: -5_000, shortfall: 5_000, favorable: 0 })).toBe('You finished $5,000 in the red.');
  });

  it('is the sentence the page shows', () => {
    expect(PROFIT.kept.sentence).toBe(keptSentence);
  });
});

describe('the calculator wording', () => {
  it('uses the plain-language questions and hints', () => {
    expect(PROFIT.expectedHint).toBe('What percentage of the job did you expect to keep?');
    expect(PROFIT.improvement.question).toBe('What if you had kept more?');
    expect(PROFIT.improvement.helper).toBe('How much of that lost profit could you have saved?');
  });
});
