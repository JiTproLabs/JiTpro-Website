import { describe, expect, it } from 'vitest';
import { CALENDAR_DAYS, CALENDAR_START, MONTHS, SCHEDULE, dayNumber, shortDate } from './architectScheduleData';

describe('the illustrative A&E procurement schedule', () => {
  it('has the four approved items with their RoSDs', () => {
    expect(SCHEDULE.map((i) => [i.name, shortDate(i.rosd)])).toEqual([
      ['Custom Steel Windows', 'May 15'],
      ['Exterior Doors', 'May 22'],
      ['Architectural Lighting', 'Jun 12'],
      ['Custom Millwork', 'Jun 20'],
    ]);
  });

  it('draws each item as one continuous bar: no gaps, no overlaps, ending on its RoSD', () => {
    for (const item of SCHEDULE) {
      const acts = item.activities;
      expect(acts[acts.length - 1].finish).toBe(item.rosd);
      for (let i = 1; i < acts.length; i++) {
        expect(dayNumber(acts[i].start)).toBe(dayNumber(acts[i - 1].finish) + 1);
        expect(acts[i].left).toBeCloseTo(acts[i - 1].left + acts[i - 1].width, 10);
      }
      for (const a of acts) expect(dayNumber(a.finish) - dayNumber(a.start) + 1).toBe(a.days);
      expect(item.rosdAt).toBeCloseTo(acts[acts.length - 1].left + acts[acts.length - 1].width, 10);
    }
  });

  it('keeps every bar on the shared January to June calendar', () => {
    for (const item of SCHEDULE) {
      expect(dayNumber(item.activities[0].start)).toBeGreaterThanOrEqual(CALENDAR_START);
      expect(item.rosdAt).toBeLessThanOrEqual(1);
    }
    expect(CALENDAR_DAYS).toBe(181);
    expect(MONTHS.map((m) => m.label)).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  });

  it('gives every item its own sequence, not one sequence shifted', () => {
    const shapes = SCHEDULE.map((i) => i.activities.map((a) => `${a.team}:${a.days}`).join(','));
    expect(new Set(shapes).size).toBe(SCHEDULE.length);
    const lengths = SCHEDULE.map((i) => i.activities.reduce((n, a) => n + a.days, 0));
    expect(new Set(lengths).size).toBe(SCHEDULE.length);
  });

  it('names the next activity, and gives every team work on every item', () => {
    for (const item of SCHEDULE) {
      expect(item.activities[item.activities.length - 1].next).toBeNull();
      item.activities.slice(0, -1).forEach((a, i) => expect(a.next).toBe(item.activities[i + 1].name));
      expect(new Set(item.activities.map((a) => a.team))).toEqual(new Set(['owner', 'design', 'gc', 'trade']));
    }
  });
});
