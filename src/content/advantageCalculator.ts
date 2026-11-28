/**
 * The profit retention calculator on /the-jitpro-advantage (Design System §83, issue #95).
 *
 * Pure arithmetic, so it can be tested without a browser. A contractor enters a
 * finished project's contract value, the profit they expected as a percentage
 * of that contract value (a share of the contract, not a markup on costs), and
 * how much of that estimated profit they actually kept, as a percentage of it
 * (below zero for a loss). The calculator shows the shortfall, lets them explore recovering a share
 * of it (0% to 100% of the shortfall, so never more than the shortfall; Decision Log 2026-11-27),
 * and multiplies the result across a year of similar projects. Illustrative
 * only: not customer results, and not a promise of savings.
 */

export interface RetentionInputs {
  /** Contract value, dollars. */
  contractValue: number;
  /** Profit expected when the project was priced, percent of contract value (not a markup on costs). */
  expectedPct: number;
  /** Share of the estimated profit actually kept, percent (−30 to 100; below zero is a loss). Not a margin on contract value. */
  keptPct: number;
  /** How much of the shortfall could have been recovered, percent of the shortfall (0 to 100). */
  recoveryPct: number;
  /** Similar projects in a year: whole number, 1 or more. */
  projects: number;
}

export interface RetentionResult {
  /** Contract value × expected percentage, dollars. */
  expectedProfit: number;
  /** Expected profit × kept percentage, dollars; negative for a loss. */
  actualProfit: number;
  /** Expected minus actual when actual is lower, else 0. */
  shortfall: number;
  /** Actual minus expected when actual is higher, else 0. */
  favorable: number;
  /** The shortfall as a whole-number percentage of expected profit; null when expected profit is not above zero. */
  shortfallPctOfExpected: number | null;
  /** The share of the shortfall recovered, percent (0 to 100). */
  recoveryPct: number;
  /** Shortfall × recovery percentage, dollars, rounded to the cent (never more than the shortfall). */
  additionalProfit: number;
  /** Actual profit plus the additional profit. */
  couldHaveMade: number;
  /** Each profit figure as a percentage of contract value: planned, kept, and could have kept. */
  plannedPctOfContract: number;
  actualPctOfContract: number;
  couldPctOfContract: number;
  projects: number;
  /** Additional profit per project times the number of similar projects. */
  annualAdditional: number;
}

/**
 * The example the calculator opens with on every page load, and returns to on reset (founder direction, 2026-11-22):
 * a $2.75M job, 12.5% expected, 5.7% of the contract kept (45.6% of the estimate), 5 similar projects. The recovery
 * opens at exactly $137,500 of the $187,000 shortfall (about 73.5%; founder direction 2026-11-27), the same dollars the
 * earlier +5-points default gave, so it is stored as that exact ratio rather than a rounded percentage.
 */
export const DEFAULT_INPUTS: RetentionInputs = {
  contractValue: 2_750_000,
  expectedPct: 12.5,
  keptPct: 45.6,
  recoveryPct: (137_500 / 187_000) * 100,
  projects: 5,
};

export const LIMITS = {
  contractValue: { min: 250_000, max: 10_000_000, step: 50_000 },
  expectedPct: { min: 8, max: 14, step: 0.1 },
  /** The kept slider moves the kept share of the contract value in tenths of a point (see keptSliderRange). */
  keptPct: { min: -30, max: 100 },
  keptContractStep: 0.1,
  /** Percent of the shortfall, in tenths. */
  recoveryPct: { min: 0, max: 100, step: 0.1 },
  projects: { min: 1, max: 500 },
} as const;

/** The project-count choices offered in the list; anything else is a custom amount. */
export const PROJECT_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const finite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Inputs within their ranges; non-numbers fall back to the example. */
export function normalize(inputs: RetentionInputs): RetentionInputs {
  return {
    contractValue: clamp(finite(inputs.contractValue, DEFAULT_INPUTS.contractValue), LIMITS.contractValue.min, LIMITS.contractValue.max),
    expectedPct: clamp(finite(inputs.expectedPct, DEFAULT_INPUTS.expectedPct), LIMITS.expectedPct.min, LIMITS.expectedPct.max),
    keptPct: clamp(finite(inputs.keptPct, DEFAULT_INPUTS.keptPct), LIMITS.keptPct.min, LIMITS.keptPct.max),
    recoveryPct: clamp(finite(inputs.recoveryPct, DEFAULT_INPUTS.recoveryPct), LIMITS.recoveryPct.min, LIMITS.recoveryPct.max),
    projects: Math.round(clamp(finite(inputs.projects, DEFAULT_INPUTS.projects), LIMITS.projects.min, LIMITS.projects.max)),
  };
}

export function calculate(raw: RetentionInputs): RetentionResult {
  const { contractValue, expectedPct, keptPct, recoveryPct, projects } = normalize(raw);
  const expectedProfit = (contractValue * expectedPct) / 100;
  const actualProfit = Math.round(expectedProfit * keptPct) / 100;
  const shortfall = Math.max(0, expectedProfit - actualProfit);
  const favorable = Math.max(0, actualProfit - expectedProfit);
  const shortfallPctOfExpected = expectedProfit > 0 && shortfall > 0 ? Math.round((shortfall / expectedProfit) * 100) : null;
  // A share of the shortfall, rounded to the cent so floating-point remainders never reach the display or the annual
  // total. At 100% it is the shortfall itself, so the result lands exactly on the original estimate.
  const full = recoveryPct >= LIMITS.recoveryPct.max;
  const additionalProfit = full ? shortfall : Math.min(shortfall, Math.round(shortfall * recoveryPct) / 100);
  const couldHaveMade = full ? Math.max(expectedProfit, actualProfit) : actualProfit + additionalProfit;
  return {
    expectedProfit,
    actualProfit,
    shortfall,
    favorable,
    shortfallPctOfExpected,
    recoveryPct,
    additionalProfit,
    couldHaveMade,
    plannedPctOfContract: (expectedProfit / contractValue) * 100,
    actualPctOfContract: (actualProfit / contractValue) * 100,
    couldPctOfContract: (couldHaveMade / contractValue) * 100,
    projects,
    annualAdditional: additionalProfit * projects,
  };
}

/**
 * The kept slider works in percent of contract value, in tenths: from a loss of 30% of the estimate up to keeping all of
 * it. Both ends are rounded inward to the tenth so the slider never passes them.
 */
export function keptSliderRange(expectedPct: number): { min: number; max: number; step: number } {
  return {
    min: Math.ceil(((LIMITS.keptPct.min * expectedPct) / 100) * 10 - 1e-9) / 10,
    max: Math.floor(((LIMITS.keptPct.max * expectedPct) / 100) * 10 + 1e-9) / 10,
    step: LIMITS.keptContractStep,
  };
}

/** The share of the estimate kept, from a kept share of the contract value: 4.8% of contract at 12% expected is 40%. */
export function keptPctFromContractPct(contractPct: number, expectedPct: number): number {
  return (contractPct / expectedPct) * 100;
}

/** Whole dollars, with a minus sign for a loss: "$650,000", "-$50,000". */
export function formatDollars(value: number): string {
  const rounded = Math.round(value);
  const abs = Math.abs(rounded).toLocaleString('en-US');
  return rounded < 0 ? `-$${abs}` : `$${abs}`;
}

/** Contract value as a headline: "$5 million", "$1.05 million", "$750,000". */
export function formatContract(value: number): string {
  if (value >= 1_000_000) return `$${Number((value / 1_000_000).toFixed(2))} million`;
  return formatDollars(value);
}

/** A percentage with at most one decimal: "12%", "12.5%". */
export function formatPct(value: number): string {
  return `${Number(value.toFixed(1))}%`;
}

/** A percentage to exactly one decimal place: "13.5%", "12.0%", "-1.6%". */
export function formatPct1(value: number): string {
  const fixed = (Math.round(value * 10) / 10).toFixed(1);
  return `${fixed === '-0.0' ? '0.0' : fixed}%`;
}

/** Parses a typed amount: "$1,250,000", "1.25m", "250k", "-50,000". NaN when it is not a number. */
export function parseAmount(text: string): number {
  const cleaned = text.trim().toLowerCase().replace(/[$,\s]/g, '');
  const match = cleaned.match(/^(-?\d*\.?\d+)([km]?)$/);
  if (!match) return Number.NaN;
  const n = Number(match[1]);
  return match[2] === 'm' ? n * 1_000_000 : match[2] === 'k' ? n * 1_000 : n;
}
