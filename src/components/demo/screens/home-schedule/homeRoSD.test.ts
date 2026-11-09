import { describe, expect, it } from 'vitest';
import { FIELD_ACTIVITIES, PRODUCT_IDS } from './homeScheduleData';
import { DOMAIN, ESTABLISHED_PRODUCT_IDS, FRAME, G, GANTT_TOP, MONTHS, PX_PER_DAY, RoSD_ROWS, ROWS_BOTTOM, CANVAS, xEndOf, xOf, YEARS } from './homeRoSDLayout';
import { CHAIN_REQUIRED_ON_SITE, buildSteelWindowsChain } from '../procurement-chain/chainScenario';
import { HOME_ROWS, SELECTED } from '../home-register/homeRegisterData';
import { isWorkingDay, parse, workdaysBetween } from '../procurement-schedule/workCalendar';

describe('Step 02 construction schedule data (Section 53.1.1)', () => {
  it('holds the four approved activities, in order, with their approved dates', () => {
    expect(FIELD_ACTIVITIES.map((a) => [a.name, a.startDate, a.requiredOnSiteDate])).toEqual([
      ['Structural Steel Erection', '2027-03-15', '2027-03-08'],
      ['Roofing Installation', '2027-10-04', '2027-09-29'],
      ['Steel Windows and Doors Installation', '2027-12-01', '2027-11-30'],
      ['Floor and Wall Tile Installation', '2028-03-06', '2028-02-22'],
    ]);
  });

  it('reads the windows RoSD from the Procurement Chain scenario', () => {
    const windows = FIELD_ACTIVITIES.find((a) => a.productId === PRODUCT_IDS.windows)!;
    expect(windows.requiredOnSiteDate).toBe(CHAIN_REQUIRED_ON_SITE);
    expect(windows.requiredOnSiteDate).toBe(buildSteelWindowsChain().requiredOnSiteDate);
    expect(windows.emphasis).toBe(true);
    expect(FIELD_ACTIVITIES.filter((a) => a.emphasis)).toEqual([windows]);
  });

  it('puts every RoSD and start on a working day, every RoSD before its start', () => {
    for (const a of FIELD_ACTIVITIES) {
      expect(isWorkingDay(parse(a.startDate)), a.id).toBe(true);
      expect(isWorkingDay(parse(a.requiredOnSiteDate)), a.id).toBe(true);
      expect(a.requiredOnSiteDate < a.startDate, a.id).toBe(true);
    }
  });

  it('computes each finish on the working-day calendar, duration inclusive', () => {
    for (const a of FIELD_ACTIVITIES) {
      expect(isWorkingDay(parse(a.finishDate)), a.id).toBe(true);
      expect(workdaysBetween(parse(a.startDate), parse(a.finishDate)), a.id).toBe(a.durationWorkdays);
    }
  });

  it('preserves the field sequence: steel, roofing, windows, then interiors', () => {
    const starts = FIELD_ACTIVITIES.map((a) => a.startDate);
    expect([...starts].sort()).toEqual(starts);
  });

  it('agrees with the homepage register on every product and date', () => {
    for (const a of FIELD_ACTIVITIES) {
      const row = HOME_ROWS.find((r) => r.id === a.productId)!;
      expect(row, a.id).toBeDefined();
      expect(row.requiredOnSiteDate, a.id).toBe(a.requiredOnSiteDate);
    }
    expect(HOME_ROWS.find((r) => r.id === PRODUCT_IDS.windows)).toBe(SELECTED);
  });
});

describe('Step 02 layout (Section 53.1.2)', () => {
  const day = (iso: string) => (parse(iso).getTime() - parse(DOMAIN.start).getTime()) / 86_400_000;

  it('uses one calendar-day scale across the timeline', () => {
    expect(xOf(DOMAIN.start)).toBe(G.TL_X0);
    expect(xOf(DOMAIN.end)).toBeCloseTo(G.TL_X1, 6);
    expect(PX_PER_DAY).toBeCloseTo((G.TL_X1 - G.TL_X0) / 486, 9);
  });

  it('places every marker at the end of its own RoSD date', () => {
    for (const r of RoSD_ROWS) {
      expect(r.from.x, r.activity.id).toBeCloseTo(G.TL_X0 + (day(r.activity.requiredOnSiteDate) + 1) * PX_PER_DAY, 9);
      expect(r.from.y, r.activity.id).toBe(r.bar.y);
    }
  });

  it('draws every bar from the start of its start date to the end of its finish', () => {
    for (const r of RoSD_ROWS) {
      expect(r.bar.x0, r.activity.id).toBe(xOf(r.activity.startDate));
      expect(r.bar.x1, r.activity.id).toBe(xEndOf(r.activity.finishDate));
      expect(r.from.x <= r.bar.x0, r.activity.id).toBe(true);
    }
  });

  it('meets the windows bar exactly: Nov 30 ends where Dec 1 begins', () => {
    const w = RoSD_ROWS.find((r) => r.emphasis)!;
    expect(w.from.x).toBeCloseTo(w.bar.x0, 9);
  });

  it('keeps everything inside the timeline and the canvas', () => {
    for (const r of RoSD_ROWS) {
      expect(r.bar.x0 >= G.TL_X0 && r.bar.x1 <= G.TL_X1, r.activity.id).toBe(true);
      // The date label (about 100px) still fits to the right of the marker.
      expect(r.from.x + r.labelDx + 100 <= CANVAS.w, r.activity.id).toBe(true);
    }
    expect(ROWS_BOTTOM).toBeLessThanOrEqual(CANVAS.h);
  });

  it('establishes exactly the four activity products, leaving the other two pending', () => {
    expect([...ESTABLISHED_PRODUCT_IDS].sort()).toEqual([PRODUCT_IDS.steel, PRODUCT_IDS.roofing, PRODUCT_IDS.windows, PRODUCT_IDS.tile].sort());
    const pending = HOME_ROWS.filter((r) => !ESTABLISHED_PRODUCT_IDS.has(r.id)).map((r) => r.name);
    expect(pending).toEqual(['Exterior Stone Veneer', 'Custom HVAC Equipment']);
  });

  it('places the schedule card at the top of the Step 01 register frame', () => {
    expect(FRAME).toEqual({ w: 1280, h: 740 });
    expect(GANTT_TOP).toBe(0);
    expect(CANVAS.h).toBeLessThan(FRAME.h);
    expect(CANVAS.w).toBe(FRAME.w);
  });

  it('builds a whole-month timescale from Feb 2027 to May 2028', () => {
    expect(MONTHS).toHaveLength(16);
    expect(MONTHS[0].label).toBe('Feb');
    expect(MONTHS[MONTHS.length - 1].label).toBe('May');
    expect(MONTHS[0].x0).toBe(G.TL_X0);
    expect(MONTHS[MONTHS.length - 1].x1).toBeCloseTo(G.TL_X1, 6);
    expect(YEARS.map((y) => y.label)).toEqual(['2027', '2028']);
    expect(YEARS[1].x0).toBe(MONTHS.find((m) => m.yearStart)!.x0);
  });
});
