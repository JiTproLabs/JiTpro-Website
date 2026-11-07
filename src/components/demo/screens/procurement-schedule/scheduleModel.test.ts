import { describe, expect, it } from 'vitest';
import { backwardPass, buildItem, type CommitmentSpec, type StepSpec } from './scheduleModel';
import { isWorkingDay, nextWorkday, parse, subWorkdays, workdaysBetween, iso } from './workCalendar';

/**
 * SCHEDULING ENGINE TESTS (Decision Log 2026-11-07, scheduling correction).
 *
 * Governing rule: activities consume time; milestones record events. A
 * zero-duration milestone never adds a working day to a procurement path.
 */

const phase = (id: string, days: number, extra: Partial<StepSpec> = {}): StepSpec => ({
  id, name: id, family: 'preparation', kind: 'phase', days,
  org: 'gc', owner: 'AW', owed: 'Test activity.', ...extra,
});
const milestone = (id: string, extra: Partial<StepSpec> = {}): StepSpec => ({
  id, name: id, family: 'approval', kind: 'milestone',
  org: 'gc', owner: 'AW', owed: 'Test milestone.', ...extra,
});
const ros = (id = 'ros') => milestone(id, { family: 'required' });

const byId = (item: ReturnType<typeof buildItem>) => new Map(item.steps.map((s) => [s.id, s]));

/**
 * The approved custom steel windows and doors scenario: 332 working days of
 * activity and six zero-duration milestones, Required On Site 30 Nov 2027.
 */
const STEEL_WINDOWS: StepSpec[] = [
  phase('buyout', 20, { family: 'buyout', name: 'Buyout' }),
  phase('coord', 25, { family: 'coordination', name: 'Submittal Coordination' }),
  phase('prep', 30, { family: 'preparation', name: 'Submittal Preparation' }),
  milestone('initial', { family: 'preparation', name: 'Initial Submittal' }),
  phase('review1', 15, { family: 'review', name: 'First Submittal Review' }),
  phase('revision1', 12, { family: 'revision', name: 'First Revision Cycle' }),
  milestone('resub1', { family: 'revision', name: 'First Resubmittal' }),
  phase('review2', 15, { family: 'review', name: 'Second Submittal Review' }),
  phase('revision2', 12, { family: 'revision', name: 'Second Revision Cycle' }),
  milestone('resub2', { family: 'revision', name: 'Second Resubmittal' }),
  phase('review3', 15, { family: 'review', name: 'Third Submittal Review' }),
  milestone('approval', { name: 'Final Approval' }),
  milestone('release', { name: 'Release for Fabrication' }),
  phase('fab', 180, { family: 'production', name: 'Fabrication' }),
  phase('ship', 8, { family: 'logistics', name: 'Shipping and Delivery' }),
  ros(),
];
const STEEL_WINDOWS_ROS = '2027-11-30';

describe('zero-duration milestones', () => {
  it('1. add no working days to the path', () => {
    const withMs = buildItem('a', 'A', 'c', '2027-06-07', [phase('p1', 10), milestone('m'), phase('p2', 5), ros()]);
    const without = buildItem('b', 'B', 'c', '2027-06-07', [phase('p1', 10), phase('p2', 5), ros()]);
    expect(withMs.durationWorkdays).toBe(15);
    expect(withMs.startDate).toBe(without.startDate);
    expect(byId(withMs).get('m')!.durationWorkdays).toBe(0);
  });

  it('2. a finish milestone shares the completion date of its preceding activity', () => {
    const item = buildItem('a', 'A', 'c', '2027-06-07', [phase('p1', 10), milestone('m'), phase('p2', 5), ros()]);
    const s = byId(item);
    expect(s.get('m')!.startDate).toBe(s.get('p1')!.endDate);
    expect(s.get('m')!.endDate).toBe(s.get('p1')!.endDate);
    expect(s.get('m')!.milestoneAnchor).toBe('finish');
  });

  it('3. the next activity starts on the next working day after the milestone', () => {
    // Required On Site Mon 7 Jun 2027; p2 is 5 days, so p1 and the milestone
    // finish on Fri 28 May and p2 starts Tue 1 Jun - Memorial Day (31 May)
    // and the weekend are skipped.
    const item = buildItem('a', 'A', 'c', '2027-06-07', [phase('p1', 10), milestone('m'), phase('p2', 5), ros()]);
    const s = byId(item);
    expect(s.get('m')!.endDate).toBe('2027-05-28');
    expect(s.get('p2')!.startDate).toBe('2027-06-01');
    expect(s.get('p2')!.startDate).toBe(iso(nextWorkday(parse(s.get('m')!.endDate))));
  });

  it('4. consecutive milestones can share one date', () => {
    const item = buildItem('a', 'A', 'c', '2027-06-07', [
      phase('review', 10), milestone('approval'), milestone('release'), phase('fab', 20), ros(),
    ]);
    const s = byId(item);
    expect(s.get('approval')!.endDate).toBe(s.get('review')!.endDate);
    expect(s.get('release')!.endDate).toBe(s.get('approval')!.endDate);
    expect(s.get('fab')!.startDate).toBe(iso(nextWorkday(parse(s.get('release')!.endDate))));
  });

  it('5. Required On Site shares the completion date of Shipping and Delivery', () => {
    const item = buildItem('w', 'W', 'c', STEEL_WINDOWS_ROS, STEEL_WINDOWS);
    const s = byId(item);
    expect(s.get('ship')!.endDate).toBe(STEEL_WINDOWS_ROS);
    expect(s.get('ros')!.startDate).toBe(STEEL_WINDOWS_ROS);
    expect(s.get('ros')!.endDate).toBe(STEEL_WINDOWS_ROS);
  });

  it('6. backward scheduling respects weekends and observed holidays', () => {
    const item = buildItem('w', 'W', 'c', STEEL_WINDOWS_ROS, STEEL_WINDOWS);
    // 8 working days ending Tue 30 Nov 2027 skip Thanksgiving (25 Nov) and a
    // weekend, so Shipping starts Thu 18 Nov.
    expect(byId(item).get('ship')!.startDate).toBe('2027-11-18');
    for (const st of item.steps) {
      expect(isWorkingDay(parse(st.startDate)), `${st.id} start`).toBe(true);
      expect(isWorkingDay(parse(st.endDate)), `${st.id} end`).toBe(true);
    }
    // A Required On Site on a non-working day snaps back to the working day
    // before it (Sat 4 Dec 2027 -> Fri 3 Dec).
    const sat = buildItem('s', 'S', 'c', '2027-12-04', [phase('p', 3), ros()]);
    expect(byId(sat).get('p')!.endDate).toBe('2027-12-03');
  });

  it('7. explicit gaps are preserved exactly', () => {
    // A phase gap of 3 leaves two idle working days before the phase.
    const pg = byId(buildItem('a', 'A', 'c', '2027-06-07', [phase('p1', 5), phase('p2', 5, { gap: 3 }), ros()]));
    expect(workdaysBetween(parse(pg.get('p1')!.endDate), parse(pg.get('p2')!.startDate)) - 2).toBe(2);
    // A milestone gap of 3 leaves its predecessor finishing two working days
    // before it - float before the event, still no day for the event itself.
    const mg = byId(buildItem('b', 'B', 'c', '2027-06-07', [phase('p1', 5), milestone('m', { gap: 3 }), phase('p2', 5), ros()]));
    expect(mg.get('p1')!.endDate).toBe(iso(subWorkdays(parse(mg.get('m')!.endDate), 2)));
    // Default gaps add nothing.
    const none = buildItem('c', 'C', 'c', '2027-06-07', [phase('p1', 5), milestone('m'), phase('p2', 5), ros()]);
    expect(none.durationWorkdays).toBe(10);
  });

  it('a start milestone, declared explicitly, shares its successor\'s start date', () => {
    const s = byId(buildItem('a', 'A', 'c', '2027-06-07', [
      phase('p1', 10), milestone('kickoff', { anchor: 'start' }), phase('p2', 5), ros(),
    ]));
    expect(s.get('kickoff')!.startDate).toBe(s.get('p2')!.startDate);
    expect(s.get('kickoff')!.milestoneAnchor).toBe('start');
    expect(s.get('p2')!.startDate).toBe(iso(nextWorkday(parse(s.get('p1')!.endDate))));
    expect(() => backwardPass('2027-06-07', [phase('p1', 5), milestone('dangling', { anchor: 'start' })])).toThrow();
  });
});

describe('derived records stay on the corrected dates', () => {
  it('8. the baseline uses the same milestone logic as the current schedule', () => {
    const specs = [phase('p1', 10), milestone('m'), phase('lead', 20), ros()];
    const same = buildItem('a', 'A', 'c', '2027-06-07', specs, [], { baselineOverrides: [{ stepId: 'lead', days: 20 }] });
    for (const st of same.steps) {
      expect(same.baseline!.stepDates[st.id]).toEqual({ startDate: st.startDate, endDate: st.endDate });
    }
    expect(same.baseline!.pathAdvancedWorkdays).toBe(0);

    const shorter = buildItem('b', 'B', 'c', '2027-06-07', specs, [], { baselineOverrides: [{ stepId: 'lead', days: 15 }] });
    const b = shorter.baseline!.stepDates;
    expect(b.m.endDate).toBe(b.p1.endDate);
    expect(shorter.baseline!.pathAdvancedWorkdays).toBe(5);
  });

  it('9. commitment required-by dates follow their controlling step', () => {
    const commitments: CommitmentSpec[] = [
      { id: 'c-ms', name: 'For the milestone', type: 'design', ownerRole: 'Architect', owner: 'JS', org: 'architect',
        requiredForStepId: 'm', description: 'Required by the milestone itself.' },
      { id: 'c-lead', name: 'Ahead of the phase', type: 'selection', ownerRole: 'Owner', owner: 'EM', org: 'owner',
        requiredForStepId: 'p2', leadDays: 2, description: 'Required two working days before the phase.' },
    ];
    const item = buildItem('a', 'A', 'c', '2027-06-07', [phase('p1', 10), milestone('m'), phase('p2', 5), ros()], commitments);
    const s = byId(item);
    const c = new Map(item.commitments.map((x) => [x.id, x]));
    expect(c.get('c-ms')!.requiredBy).toBe(s.get('m')!.startDate);
    expect(c.get('c-ms')!.requiredBy).toBe(s.get('p1')!.endDate);
    expect(c.get('c-lead')!.requiredBy).toBe(iso(subWorkdays(parse(s.get('p2')!.startDate), 2)));
  });

  it('10. activity durations are unchanged by the milestone correction', () => {
    const item = buildItem('w', 'W', 'c', STEEL_WINDOWS_ROS, STEEL_WINDOWS);
    for (const spec of STEEL_WINDOWS) {
      const st = byId(item).get(spec.id)!;
      if (spec.kind === 'phase') {
        expect(st.durationWorkdays, spec.id).toBe(spec.days);
        expect(workdaysBetween(parse(st.startDate), parse(st.endDate)), spec.id).toBe(spec.days);
      } else {
        expect(st.durationWorkdays, spec.id).toBe(0);
      }
    }
  });
});

describe('regression: custom steel windows and doors', () => {
  const item = buildItem('w', 'Custom Steel Windows and Doors', 'Exterior Enclosure', STEEL_WINDOWS_ROS, STEEL_WINDOWS);
  const s = byId(item);

  it('spans exactly the 332 working days of its activities', () => {
    const activityDays = item.steps.filter((x) => x.kind === 'phase').reduce((n, x) => n + x.durationWorkdays, 0);
    expect(activityDays).toBe(332);
    expect(item.durationWorkdays).toBe(332);
    expect(workdaysBetween(parse(item.startDate), parse(STEEL_WINDOWS_ROS))).toBe(332);
    expect(item.steps.filter((x) => x.kind === 'milestone')).toHaveLength(6);
  });

  it('lands on the dates of an independent working-day count', () => {
    // Verified 2026-11-07 against a count that shares no code with the engine.
    expect(item.startDate).toBe('2026-08-03');
    expect(s.get('prep')!.endDate).toBe('2026-11-18');
    expect(s.get('initial')!.endDate).toBe('2026-11-18');
    expect(s.get('review1')!.startDate).toBe('2026-11-19');
    expect(s.get('review3')!.endDate).toBe('2027-03-02');
    expect(s.get('approval')!.endDate).toBe('2027-03-02');
    expect(s.get('release')!.endDate).toBe('2027-03-02');
    expect(s.get('fab')!.startDate).toBe('2027-03-03');
    expect(s.get('fab')!.endDate).toBe('2027-11-17');
  });

  it('keeps every step in sequence with no hidden days between them', () => {
    for (let i = 0; i < item.steps.length - 1; i++) {
      const a = item.steps[i];
      const b = item.steps[i + 1];
      if (b.kind === 'milestone') expect(b.startDate, `${a.id}->${b.id}`).toBe(a.endDate);
      else expect(b.startDate, `${a.id}->${b.id}`).toBe(iso(nextWorkday(parse(a.endDate))));
    }
  });
});
