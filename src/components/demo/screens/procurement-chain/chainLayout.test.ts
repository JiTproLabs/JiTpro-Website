import { describe, expect, it } from 'vitest';
import { buildChainLayout, CHAIN, type ChainCard, type Measure } from './chainLayout';
import { buildSteelWindowsChain, CHAIN_LABELS, CHAIN_REQUIRED_ON_SITE, CHAIN_STEPS } from './chainScenario';
import { nextWorkday, parse, iso, workdaysBetween } from '../procurement-schedule/workCalendar';
import { buildItem, type ScheduleItem } from '../procurement-schedule/scheduleModel';

/** Deterministic stand-in for canvas measurement: a generous average glyph. */
const measure: Measure = (text, font) => text.length * Number(/(\d+)px/.exec(font)![1]) * 0.58;

const MS = 86400000;
const calDays = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / MS);

const item = buildSteelWindowsChain();
const L = buildChainLayout(item, { containerWidth: 1200, measure, labels: CHAIN_LABELS });
const X = (d: string) => CHAIN.PAD_L + calDays(L.domainStart, d) * L.pxPerDay;
const step = (id: string) => item.steps.find((s) => s.id === id)!;
const seg = (id: string) => L.segments.find((s) => s.step.id === id)!;
const ms = (id: string) => L.milestones.find((m) => m.step.id === id)!;

describe('scenario', () => {
  it('spans 312 working days, calculated by the engine', () => {
    const days = Object.fromEntries(item.steps.map((s) => [s.id, s.durationWorkdays]));
    // Reviews and revisions shorten as issues are resolved.
    expect([days['swd-5'], days['swd-6'], days['swd-8'], days['swd-9'], days['swd-11']]).toEqual([15, 12, 10, 7, 5]);
    // Everything else is unchanged.
    expect([days['swd-1'], days['swd-2'], days['swd-3'], days['swd-14'], days['swd-15']]).toEqual([20, 25, 30, 180, 8]);
    expect(L.summary.activityWorkdays).toBe(312);
    expect(L.summary.totalWorkdays).toBe(312);
    expect(workdaysBetween(parse(item.startDate), parse(CHAIN_REQUIRED_ON_SITE))).toBe(312);
  });

  it('lands on the dates of an independent working-day count', () => {
    // Verified 2026-11-07 against a count that shares no code with the engine.
    const dates = (id: string) => [step(id).startDate, step(id).endDate];
    expect(item.startDate).toBe('2026-08-31');
    expect(dates('swd-2')).toEqual(['2026-09-29', '2026-11-03']);
    expect(dates('swd-3')).toEqual(['2026-11-04', '2026-12-17']);
    expect(dates('swd-5')).toEqual(['2026-12-18', '2027-01-11']);
    expect(dates('swd-6')).toEqual(['2027-01-12', '2027-01-28']);
    expect(dates('swd-8')).toEqual(['2027-01-29', '2027-02-11']);
    expect(dates('swd-9')).toEqual(['2027-02-12', '2027-02-23']);
    expect(dates('swd-11')).toEqual(['2027-02-24', '2027-03-02']);
    expect(dates('swd-14')).toEqual(['2027-03-03', '2027-11-17']);
    expect(dates('swd-15')).toEqual(['2027-11-18', '2027-11-30']);
    expect(step('swd-16').startDate).toBe(CHAIN_REQUIRED_ON_SITE);
  });

  it('keeps its representative relationships when the anchor date moves', () => {
    for (const ros of ['2027-11-30', '2028-06-15', '2029-02-27']) {
      const it2 = buildSteelWindowsChain(ros);
      const c2 = it2.commitments.find((c) => c.id === 'swd-c2')!;
      const c3 = it2.commitments.find((c) => c.id === 'swd-c3')!;
      expect(it2.durationWorkdays, ros).toBe(312);
      expect(c2.requiredBy).toBe(it2.steps.find((s) => s.id === 'swd-3')!.startDate);
      expect(c2.committedFor).toBe(c2.requiredBy);
      expect(c2.completionVarianceWorkdays, ros).toBe(6);
      expect(c3.varianceWorkdays, ros).toBe(4);
      expect(it2.issues[0].identifiedOn).toBe(c2.completedDate);
    }
  });
});

describe('one continuous, proportional chain', () => {
  it('draws exactly one segment per activity and nothing else on the bar', () => {
    expect(L.segments).toHaveLength(item.steps.filter((s) => s.kind === 'phase').length);
    expect(L.segments.map((s) => s.step.id)).toEqual(item.steps.filter((s) => s.kind === 'phase').map((s) => s.id));
  });

  it('derives every span from dates: start to the next working day after the finish', () => {
    const last = L.segments[L.segments.length - 1];
    for (const s of L.segments) {
      expect(s.x0).toBeCloseTo(X(s.step.startDate), 6);
      // The final activity ends at the calendar end of its last day - the
      // Required On Site instant - since no work follows it to connect to.
      const end = s === last ? X(s.step.endDate) + L.pxPerDay : X(iso(nextWorkday(parse(s.step.endDate))));
      expect(s.x1, s.step.id).toBeCloseTo(end, 6);
    }
  });

  it('is continuous: each activity begins exactly where the previous one ends', () => {
    for (let i = 1; i < L.segments.length; i++) {
      expect(L.segments[i].x0, L.segments[i].step.id).toBeCloseTo(L.segments[i - 1].x1, 6);
    }
  });

  it('is proportional: widths are calendar days times one scale', () => {
    const fab = seg('swd-14');
    const review = seg('swd-5');
    const fabDays = calDays(step('swd-14').startDate, iso(nextWorkday(parse(step('swd-14').endDate))));
    const revDays = calDays(step('swd-5').startDate, iso(nextWorkday(parse(step('swd-5').endDate))));
    expect((fab.x1 - fab.x0) / (review.x1 - review.x0)).toBeCloseTo(fabDays / revDays, 6);
    expect(fab.x1 - fab.x0).toBeGreaterThan(10 * (review.x1 - review.x0));
  });

  it('never compresses below the minimum scale, and widens to fill a large container', () => {
    expect(L.pxPerDay).toBe(CHAIN.MIN_PX_PER_DAY);
    const wide = buildChainLayout(item, { containerWidth: 9000, measure, labels: CHAIN_LABELS });
    expect(wide.pxPerDay).toBeGreaterThan(CHAIN.MIN_PX_PER_DAY);
    expect(wide.width).toBeCloseTo(9000, 6);
  });

  it('labels every activity at the minimum scale, inside (A) or beneath (B)', () => {
    for (const s of L.segments) expect(['A', 'B'], s.step.id).toContain(s.tier);
  });
});

describe('milestones, commitments and issues sit on their dates', () => {
  it('places finish milestones at the end of their date, where the activity ends', () => {
    expect(ms('swd-4').x).toBeCloseTo(X(step('swd-4').endDate) + L.pxPerDay, 6);
    expect(ms('swd-4').x).toBeCloseTo(X(step('swd-3').endDate) + L.pxPerDay, 6);
  });

  it('stacks Final Approval and Release at one x, without moving either date', () => {
    const a = ms('swd-12');
    const r = ms('swd-13');
    expect(step('swd-12').startDate).toBe(step('swd-13').startDate);
    expect(a.x).toBeCloseTo(r.x, 6);
    expect(a.y).toBeLessThan(r.y);
    expect([a.stackSize, r.stackSize]).toEqual([2, 2]);
  });

  it('places Required On Site at the end of its date, where Shipping and Delivery ends', () => {
    const ros = ms('swd-16');
    expect(ros.isRos).toBe(true);
    expect(ros.x).toBeCloseTo(seg('swd-15').x1, 6);
    expect(L.ros!.x).toBeCloseTo(ros.x, 6);
  });

  const leaderEndsOnMark = (c: ChainCard) => {
    expect(c.leader.x2 === c.markX || c.leader.x1 === c.markX).toBe(true);
  };

  it('places each commitment mark at its required-by date, above the bar', () => {
    for (const c of L.commitments) {
      expect(c.markX).toBeCloseTo(X(c.commitment!.requiredBy) + L.pxPerDay / 2, 6);
      expect(c.y + c.h).toBeLessThan(L.barTop);
      leaderEndsOnMark(c);
    }
  });

  it('places each issue mark at its identified date, below the bar', () => {
    for (const i of L.issues) {
      expect(i.markX).toBeCloseTo(X(i.issue!.identifiedOn) + L.pxPerDay / 2, 6);
      expect(i.y).toBeGreaterThan(L.barBottom);
      leaderEndsOnMark(i);
    }
  });

  it('never overlaps two cards, and never overlaps two labels', () => {
    const boxes = (cards: ChainCard[]) => cards.map((c) => ({ x: c.x, y: c.y, w: c.w, h: c.h }));
    const clash = (bs: { x: number; y: number; w: number; h: number }[]) =>
      bs.some((a, i) => bs.some((b, j) => i < j && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h));
    expect(clash(boxes(L.commitments))).toBe(false);
    expect(clash(boxes(L.issues))).toBe(false);
    expect(clash(L.labels.map((l) => l.box))).toBe(false);
  });

  it('dates the current scenario\'s milestones from the recalculated schedule', () => {
    const date = (id: string) => step(id).startDate;
    expect(date('swd-4')).toBe('2026-12-17');
    expect(date('swd-7')).toBe('2027-01-28');
    expect(date('swd-10')).toBe('2027-02-23');
    expect(date('swd-12')).toBe('2027-03-02');
    expect(date('swd-13')).toBe('2027-03-02');
    expect(date('swd-16')).toBe('2027-11-30');
  });

  it('orders the future reveal from Required On Site backward', () => {
    expect(L.revealOrder[0]).toBe('swd-16');
    expect(L.revealOrder.indexOf('swd-15')).toBeLessThan(L.revealOrder.indexOf('swd-1'));
  });
});

/**
 * REGRESSION (2026-11-07): milestones must follow the recalculated schedule.
 * A chevron's end and its finish milestone were once positioned by two
 * different rules, so any milestone falling before a weekend or holiday sat
 * days inside its chevron. These checks hold for any anchor date and any
 * durations, not just the current scenario.
 */
describe('milestones always follow the recalculated chain', () => {
  /** Every finish milestone sits exactly where the activity it completes ends. */
  const assertAttached = (it2: ScheduleItem, label: string) => {
    const lay = buildChainLayout(it2, { containerWidth: 1200, measure, labels: CHAIN_LABELS });
    const x = (d: string) => CHAIN.PAD_L + calDays(lay.domainStart, d) * lay.pxPerDay;
    for (const m of lay.milestones) {
      const i = it2.steps.indexOf(m.step);
      const pred = it2.steps.slice(0, i).reverse().find((s) => s.kind === 'phase')!;
      const predSeg = lay.segments.find((s) => s.step === pred)!;
      // Same instant as the end of the work it completes...
      expect(m.x, `${label} ${m.step.id}`).toBeCloseTo(predSeg.x1, 6);
      // ...which is a function of the milestone's own, recalculated date.
      expect(m.step.startDate, `${label} ${m.step.id}`).toBe(pred.endDate);
      const nextPhase = it2.steps.slice(i).find((s) => s.kind === 'phase');
      if (nextPhase) expect(m.x, `${label} ${m.step.id}`).toBeCloseTo(x(nextPhase.startDate), 6);
    }
    const ros = lay.milestones.find((m) => m.isRos)!;
    expect(ros.x, label).toBeCloseTo(x(ros.step.startDate) + lay.pxPerDay, 6);
    expect(lay.ros!.x, label).toBeCloseTo(ros.x, 6);
    // Same-date milestones share one x and stack; no two dates share an x.
    for (const a of lay.milestones)
      for (const b of lay.milestones)
        if (a !== b) expect(Math.abs(a.x - b.x) < 0.01, `${label} ${a.step.id}/${b.step.id}`).toBe(a.step.startDate === b.step.startDate);
  };

  it('for every Required On Site date across a year and a half (weekends and holidays included)', () => {
    const d0 = Date.UTC(2027, 0, 4);
    for (let k = 0; k < 180; k++) {
      const ros = new Date(d0 + k * 3 * MS).toISOString().slice(0, 10);
      assertAttached(buildSteelWindowsChain(ros), ros);
    }
  });

  it('when activity durations change, with no other edit', () => {
    const variants: Record<string, number>[] = [
      { 'swd-8': 15, 'swd-9': 12, 'swd-11': 15 }, // the earlier, longer cycles
      { 'swd-5': 3, 'swd-6': 4, 'swd-8': 2, 'swd-9': 1, 'swd-11': 1 },
      { 'swd-3': 41, 'swd-14': 97 },
    ];
    for (const v of variants) {
      const specs = CHAIN_STEPS.map((s) => (v[s.id] ? { ...s, days: v[s.id] } : s));
      const it2 = buildItem('variant', 'Variant', 'c', CHAIN_REQUIRED_ON_SITE, specs);
      assertAttached(it2, JSON.stringify(v));
      const shift = buildChainLayout(it2, { containerWidth: 1200, measure, labels: CHAIN_LABELS });
      // The milestone really moved with the work: its x is its new date's.
      const initial = shift.milestones.find((m) => m.step.id === 'swd-4')!;
      const prep = shift.segments.find((s) => s.step.id === 'swd-3')!;
      expect(initial.x).toBeCloseTo(prep.x1, 6);
    }
  });

  it('for the current scenario', () => {
    assertAttached(item, 'current');
    expect(ms('swd-4').x).toBeCloseTo(seg('swd-3').x1, 6);
    expect(ms('swd-7').x).toBeCloseTo(seg('swd-6').x1, 6);
    expect(ms('swd-10').x).toBeCloseTo(seg('swd-9').x1, 6);
    expect(ms('swd-12').x).toBeCloseTo(seg('swd-11').x1, 6);
    expect(ms('swd-13').x).toBeCloseTo(seg('swd-11').x1, 6);
  });
});

describe('a shared calendar domain (Section 54.4.2)', () => {
  const domain = { start: '2026-03-01', end: '2028-01-01' };
  const shared = buildChainLayout(item, { containerWidth: 0, measure, labels: CHAIN_LABELS, domain });

  it('places every date on the shared axis, at the same scale', () => {
    expect(shared.domainStart).toBe('2026-03-01');
    expect(shared.pxPerDay).toBe(CHAIN.MIN_PX_PER_DAY);
    const sx = (d: string) => CHAIN.PAD_L + calDays('2026-03-01', d) * shared.pxPerDay;
    expect(shared.segments[0].x0).toBe(sx(item.startDate));
    expect(shared.axis.months[0].label).toBe('Mar 2026');
    expect(shared.axis.months).toHaveLength(22);
  });

  it('keeps every width: only the origin moves', () => {
    const own = buildChainLayout(item, { containerWidth: 0, measure, labels: CHAIN_LABELS });
    const shift = shared.segments[0].x0 - own.segments[0].x0;
    shared.segments.forEach((s, i) => {
      expect(s.x0 - shift).toBeCloseTo(own.segments[i].x0);
      expect(s.x1 - shift).toBeCloseTo(own.segments[i].x1);
      expect(s.tier).toBe(own.segments[i].tier);
    });
  });

  it('refuses a domain that is not whole months or does not contain the item', () => {
    expect(() => buildChainLayout(item, { containerWidth: 0, measure, domain: { start: '2026-03-02', end: '2028-01-01' } })).toThrow();
    expect(() => buildChainLayout(item, { containerWidth: 0, measure, domain: { start: '2026-10-01', end: '2028-01-01' } })).toThrow();
  });
});
