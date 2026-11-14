import { describe, expect, it } from 'vitest';
import { HYSTERESIS, SWITCH_AT, progressForTab, regionDistance, tabForProgress } from './audienceScroll';

describe('regionDistance', () => {
  it('runs through the last tab’s zone, then releases', () => {
    expect(regionDistance(4, 100)).toBe(350);
    expect(regionDistance(3, 100)).toBe(250);
    expect(regionDistance(1, 100)).toBe(50);
    expect(regionDistance(0, 100)).toBe(0);
  });
});

describe('tabForProgress: scroll selects a whole tab', () => {
  it('maps each zone to one tab, for four tabs', () => {
    const at = (p: number) => tabForProgress(p, 4);
    expect([-1, 0, 0.5, 0.74].map(at)).toEqual([0, 0, 0, 0]);
    expect([0.76, 1, 1.74].map(at)).toEqual([1, 1, 1]);
    expect([1.76, 2.74].map(at)).toEqual([2, 2]);
    expect([2.76, 3.5, 9].map(at)).toEqual([3, 3, 3]);
  });

  it('maps each zone to one tab, for three tabs', () => {
    const at = (p: number) => tabForProgress(p, 3);
    expect([0.2, 1.2, 2.2, 2.5, 5].map(at)).toEqual([0, 1, 2, 2, 2]);
  });

  it('always returns a whole, in-range tab, so no partial state exists', () => {
    for (let p = -2; p <= 6; p += 0.013) {
      const t = tabForProgress(p, 4);
      expect(Number.isInteger(t)).toBe(true);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(3);
    }
  });

  it('is symmetric, so scrolling back selects the same tabs in reverse', () => {
    const ps = [0.25, 1.25, 2.25, 3.25];
    expect(ps.map((p) => tabForProgress(p, 4))).toEqual([0, 1, 2, 3]);
    expect([...ps].reverse().map((p) => tabForProgress(p, 4))).toEqual([3, 2, 1, 0]);
  });

  it('keeps the current tab while resting within the hysteresis band at a boundary', () => {
    const b = 1 + SWITCH_AT; // between tab 1 and tab 2
    expect(tabForProgress(b + HYSTERESIS / 2, 4, 1)).toBe(1);
    expect(tabForProgress(b - HYSTERESIS / 2, 4, 2)).toBe(2);
    expect(tabForProgress(b + HYSTERESIS * 1.5, 4, 1)).toBe(2);
    expect(tabForProgress(b - HYSTERESIS * 1.5, 4, 2)).toBe(1);
  });

  it('takes a fast scroll across several zones directly', () => {
    expect(tabForProgress(3.2, 4, 0)).toBe(3);
    expect(tabForProgress(0.1, 4, 3)).toBe(0);
  });

  it('is stationary for a single tab', () => {
    expect(tabForProgress(2, 1)).toBe(0);
  });
});

describe('progressForTab', () => {
  it('lands a clicked tab inside its own zone, clear of the hysteresis band', () => {
    for (const count of [3, 4]) {
      for (let i = 0; i < count; i++) {
        const p = progressForTab(i);
        expect(tabForProgress(p, count)).toBe(i);
        for (const current of [i - 1, i + 1]) {
          if (current >= 0 && current < count) expect(tabForProgress(p, count, current)).toBe(i);
        }
      }
    }
  });
});
