import { describe, expect, it } from 'vitest';
import type { Measure } from '../demo/screens/procurement-chain/chainLayout';
import { SCHEDULE_ITEMS } from '../demo/screens/procurement-schedule/scheduleFixture';
import { buildSteelWindowsChain } from '../demo/screens/procurement-chain/chainScenario';
import { CHAIN } from '../demo/screens/procurement-chain/chainLayout';
import { isHoliday, isWorkingDay, iso, parse } from '../demo/screens/procurement-schedule/workCalendar';
import {
  FOCAL_ITEM,
  FOCAL_ROW,
  OTHER_ITEMS,
  PLAN_FOCAL_REQUIRED_ON_SITE,
  REPLACED_FIXTURE_ITEM,
  ROW_ITEMS,
  TIMING,
  buildPlanScene,
  APP,
  LIST_ITEM,
  LIST_TITLE_H,
  LIST_TOTAL,
  PLAN_STEP_GROUPS,
  SIDE_MIN_W,
  HEADER,
  calendarGrid,
  chainView,
  gridAt,
  listCrossingFade,
  listItemAt,
  listLayout,
  lengthened,
  planStateAt,
  revealAt,
  scheduleView,
  toScreen,
  type Frame,
} from './planChainScene';

/** Deterministic stand-in for canvas measurement. */
const measure: Measure = (text, font) => text.length * Number(/(\d+)px/.exec(font)![1]) * 0.58;
const scene = buildPlanScene(measure);
const T = scene.times;
/** The preview frame at 1280×800, at 1440×900, and on a phone. */
const FRAMES: Frame[] = [
  { w: 558, h: 348 },
  { w: 598, h: 373 },
  { w: 340, h: 212 },
];

/** The scene x range a state's camera shows (its view is in screen px). */
const shownX = (f: Frame, t: number) => {
  const { cx, scale } = planStateAt(scene, f, t).view;
  const { k, ox } = scene.place;
  const left = cx - f.w / 2 / scale;
  const right = cx + f.w / 2 / scale;
  return { left: (left - ox) / k, right: (right - ox) / k };
};

describe('Plan scene: the procurement chain only (Section 54.4.2)', () => {
  it('shows no commitments and no issues, on any row', () => {
    for (const row of [scene.focal, ...scene.others]) {
      expect(row.item.commitments).toEqual([]);
      expect(row.item.issues).toEqual([]);
      expect(row.layout.commitments).toEqual([]);
      expect(row.layout.issues).toEqual([]);
    }
  });

  it('is the focal chain plus every other fixture item, the focal chain standing in for the steel windows', () => {
    expect(FOCAL_ITEM.id).toBe('chain-steel-windows');
    expect(OTHER_ITEMS.map((i) => i.id).sort()).toEqual(
      SCHEDULE_ITEMS.filter((i) => i.id !== REPLACED_FIXTURE_ITEM).map((i) => i.id).sort(),
    );
    expect(scene.others).toHaveLength(14);
  });

  it('draws the focal chain as the approved scenario, its whole chain anchored on the homepage date', () => {
    const approved = buildSteelWindowsChain();
    // The same engine output, anchored on the homepage's date.
    expect(FOCAL_ITEM.steps).toEqual(buildSteelWindowsChain(PLAN_FOCAL_REQUIRED_ON_SITE).steps);
    expect(FOCAL_ITEM.requiredOnSiteDate).toBe(PLAN_FOCAL_REQUIRED_ON_SITE);
    // Same activities, same order, same working-day durations: only the dates move.
    expect(FOCAL_ITEM.steps.map((s) => [s.id, s.name, s.kind, s.family, s.durationWorkdays])).toEqual(
      approved.steps.map((s) => [s.id, s.name, s.kind, s.family, s.durationWorkdays]),
    );
    expect(FOCAL_ITEM.durationWorkdays).toBe(312);
  });

  it('draws every row on one calendar axis at the chain\'s approved scale', () => {
    const rows = [scene.focal, ...scene.others];
    for (const r of rows) {
      expect(r.layout.domainStart).toBe(scene.focal.layout.domainStart);
      expect(r.layout.pxPerDay).toBe(8);
      expect(r.layout.width).toBe(scene.width);
    }
  });

  it('puts the focal chain in the middle third, its labels clear of the rows below', () => {
    const n = ROW_ITEMS.length;
    expect(FOCAL_ROW).toBeGreaterThanOrEqual(Math.floor(n / 3));
    expect(FOCAL_ROW).toBeLessThan(Math.ceil((2 * n) / 3));
    expect(ROW_ITEMS[FOCAL_ROW]).toBe(FOCAL_ITEM);
    const f = scene.focal;
    const focalTop = f.dy + f.layout.barTop;
    const focalLabelsBottom = f.dy + Math.max(...f.layout.labels.map((l) => l.box.y + l.box.h));
    const rows = ROW_ITEMS.map((item) => [scene.focal, ...scene.others].find((r) => r.item === item)!);
    rows.forEach((r, i) => {
      if (i < FOCAL_ROW) expect(r.dy + r.layout.barBottom).toBeLessThan(focalTop);
      if (i > FOCAL_ROW) expect(r.dy + r.layout.barTop).toBeGreaterThan(focalLabelsBottom);
    });
    // Each bar sits inside its own row band of the application screen.
    const { k, oy, bands } = scene.place;
    rows.forEach((r, i) => {
      const top = oy + k * (r.dy + r.layout.barTop);
      const bottom = oy + k * (r.dy + r.layout.barBottom);
      expect(top).toBeGreaterThan(bands[i].top);
      expect(bottom).toBeLessThan(bands[i].top + bands[i].height);
    });
  });
});

describe('Plan scene: the surrounding chains (refined 2026-11-10)', () => {
  it('rebuilds a fixture item exactly at a factor of 1, so lengthening changes nothing but durations', () => {
    for (const item of SCHEDULE_ITEMS) {
      const same = lengthened(item, 1);
      expect(same.steps.map((s) => [s.id, s.startDate, s.endDate])).toEqual(item.steps.map((s) => [s.id, s.startDate, s.endDate]));
    }
  });

  it('lengthens every surrounding chain, keeps its Required On Site date, and varies their lengths', () => {
    for (const item of OTHER_ITEMS) {
      const original = SCHEDULE_ITEMS.find((i) => i.id === item.id)!;
      expect(item.requiredOnSiteDate).toBe(original.requiredOnSiteDate);
      expect(item.durationWorkdays).toBeGreaterThan(original.durationWorkdays * 1.3);
      expect(item.steps.map((s) => [s.id, s.kind, s.family])).toEqual(original.steps.map((s) => [s.id, s.kind, s.family]));
    }
    const lengths = OTHER_ITEMS.map((i) => i.durationWorkdays);
    expect(new Set(lengths).size).toBe(lengths.length);
    expect(Math.max(...lengths) - Math.min(...lengths)).toBeGreaterThan(80);
  });

  it('orders the rows strictly by Required On Site date, earliest at the top', () => {
    const finishes = ROW_ITEMS.map((i) => i.requiredOnSiteDate);
    for (let i = 1; i < finishes.length; i++) expect(finishes[i] > finishes[i - 1]).toBe(true);
  });

  it('keeps the chains staggered: no two start together, and starts do not follow the row order', () => {
    const starts = ROW_ITEMS.map((i) => i.startDate);
    expect(new Set(starts).size).toBe(starts.length);
    expect(starts).not.toEqual([...starts].sort());
  });

  it('keeps every surrounding chain on its fixture date', () => {
    for (const item of OTHER_ITEMS)
      expect(item.requiredOnSiteDate).toBe(SCHEDULE_ITEMS.find((i) => i.id === item.id)!.requiredOnSiteDate);
  });
});

describe('Plan step list (refined 2026-11-10)', () => {
  it('is exactly the six founder-specified steps, in backward-planning order', () => {
    expect(scene.list.map((e) => e.label)).toEqual([
      'Required On Site',
      'Fabrication & Delivery',
      'Review & Approvals',
      'Submittal Preparation',
      'Submittal Coordination',
      'Buyout',
    ]);
  });

  it('puts every step and milestone of the chain in exactly one group', () => {
    for (const st of FOCAL_ITEM.steps) {
      expect(PLAN_STEP_GROUPS.filter((g) => g.families.includes(st.family))).toHaveLength(1);
    }
  });

  it('shows each group\'s working days, read from the chain, and Required On Site as a milestone', () => {
    expect(scene.list.map((e) => e.workdays)).toEqual([null, 188, 49, 30, 25, 20]);
    expect(scene.list.reduce((n, e) => n + (e.workdays ?? 0), 0)).toBe(FOCAL_ITEM.durationWorkdays);
    expect(scene.list[0].date).toBe(PLAN_FOCAL_REQUIRED_ON_SITE);
    for (const e of scene.list.slice(1)) expect(e.date).toBeNull();
  });

  it('names every entry before the build begins, one at a time, in backward order (redesigned 2026-11-11)', () => {
    // The milestone is held alone first.
    expect(TIMING.GROUPS_AT - (T.rosIn + T.rosInDuration)).toBeGreaterThanOrEqual(600);
    const appear = scene.list.map((e) => e.appearAt);
    for (let i = 1; i < appear.length; i++) expect(appear[i]).toBeGreaterThan(appear[i - 1]);
    scene.list.forEach((e, i) => expect(e.appearAt).toBe(TIMING.GROUPS_AT + TIMING.LIST_LEAD + i * TIMING.GROUP_STAGGER));
    // One at a time: each has appeared before the next begins.
    expect(TIMING.GROUP_STAGGER).toBeGreaterThanOrEqual(300);
    // Then the total, then time to read it, then the build.
    const lastNamed = appear[appear.length - 1] + 300;
    expect(TIMING.TOTAL_AT).toBeGreaterThanOrEqual(lastNamed);
    expect(T.buildStart - (TIMING.TOTAL_AT + 300)).toBeGreaterThanOrEqual(600);
    const f = { w: 558, h: 348 };
    const before = planStateAt(scene, f, T.buildStart - 1);
    expect(before.list.appear.every((a) => a === 1)).toBe(true);
    expect(before.list.total).toBe(1);
    // And nothing of the chain is drawn until then.
    expect(before.edgeX).toBe(scene.steps[0].from);
  });

  it('opens clean and in order: an empty calendar, then the statement, then the milestone, then the list (corrected 2026-11-11)', () => {
    for (const f of FRAMES) {
      // Through the panel's slide, nothing but the calendar.
      for (let t = 0; t <= TIMING.CARD_IN; t += 20) {
        const s = planStateAt(scene, f, t);
        expect(s.ros).toBe(0);
        expect(s.list.card).toBe(0);
        expect(s.list.title).toBe(0);
        expect(s.list.total).toBe(0);
        expect(s.list.appear.every((a) => a === 0)).toBe(true);
        expect(s.list.active.every((a) => a === 0)).toBe(true);
        expect(s.edgeX).toBe(scene.steps[0].from);
        expect(s.others).toBe(0);
        expect(s.app).toBe(0);
      }
      // The statement is fully shown before the milestone begins.
      expect(TIMING.CARD_IN).toBeGreaterThanOrEqual(450);
      expect(TIMING.ROS_IN).toBeGreaterThanOrEqual(TIMING.CARD_IN + T.rosInDuration);
      const atRos = planStateAt(scene, f, TIMING.ROS_IN);
      expect(atRos.list.card).toBe(1);
      expect(atRos.ros).toBe(0);
      // No list entry, not even Required On Site, before the list has its heading.
      for (let t = 0; t <= TIMING.GROUPS_AT; t += 20) expect(planStateAt(scene, f, t).list.appear.every((a) => a === 0)).toBe(true);
      for (let t = 0; t < T.buildStart; t += 20) {
        const { appear, title } = planStateAt(scene, f, t).list;
        if (appear[0] > 0) expect(title).toBeGreaterThan(0);
      }
      expect(scene.list[0].appearAt).toBeGreaterThanOrEqual(TIMING.GROUPS_AT);
    }
  });

  it('marks each group as the one being built while its own activities build, and Required On Site never', () => {
    const f = { w: 558, h: 348 };
    for (let t = 0; t <= T.end; t += 50) expect(planStateAt(scene, f, t).list.active[0]).toBe(0);
    const startsOf = (fams: readonly string[]) => scene.steps.filter((st) => fams.includes(st.family)).map((st) => st.start);
    scene.list.slice(1).forEach((e, i) => {
      expect(e.activeFrom).toBe(Math.min(...startsOf(PLAN_STEP_GROUPS[i + 1].families)));
    });
    expect(scene.list[1].activeFrom).toBe(T.buildStart);
    // Each takes over as the step being built exactly where the last one ends.
    for (let i = 2; i < scene.list.length; i++) expect(scene.list[i].activeFrom).toBe(scene.list[i - 1].activeUntil);
    expect(scene.list[scene.list.length - 1].activeUntil).toBe(T.buildEnd);
  });

  it('states the requirement first, then hands the item name to the list heading as the work is named', () => {
    const f = { w: 558, h: 348 };
    const at = (t: number) => planStateAt(scene, f, t).list;
    expect(at(0).card).toBe(0);
    expect(at(TIMING.CARD_IN + T.rosInDuration).card).toBe(1);
    expect(at(TIMING.GROUPS_AT).card).toBe(1);
    expect(at(TIMING.GROUPS_AT).title).toBe(0);
    expect(at(TIMING.GROUPS_AT + 300).card).toBe(0);
    expect(at(TIMING.GROUPS_AT + 300).title).toBe(1);
    // The two are never both fully shown.
    for (let t = 0; t < T.buildStart; t += 25) expect((at(t).card ?? 0) + (at(t).title ?? 0)).toBeLessThanOrEqual(1.0001);
    expect(scene.itemTitle).toBe('Custom Steel Windows & Doors');
  });

  it('weighs each group by its working days, and totals them from the chain', () => {
    expect(scene.totalWorkdays).toBe(FOCAL_ITEM.steps.reduce((n, st) => n + (st.kind === 'phase' ? st.durationWorkdays : 0), 0));
    expect(scene.totalWorkdays).toBe(scene.list.reduce((n, e) => n + (e.workdays ?? 0), 0));
    const longest = Math.max(...scene.list.map((e) => e.workdays ?? 0));
    for (const e of scene.list) expect(e.weight).toBeCloseTo((e.workdays ?? 0) / longest);
    expect(scene.list.find((e) => e.id === 'fabrication')!.weight).toBe(1);
  });

  it('marks one step at a time as the one being built, none before the build, and none once it is done', () => {
    const f = { w: 558, h: 348 };
    const count = (t: number) => {
      const { active } = planStateAt(scene, f, t).list;
      return { full: active.filter((a) => a > 0.99).length, any: active.filter((a) => a > 0.01).length };
    };
    for (let t = 0; t < T.buildStart; t += 40) expect(count(t).any).toBe(0);
    for (let t = T.buildStart + 200; t < T.buildEnd - 50; t += 40) {
      expect(count(t).any).toBeGreaterThanOrEqual(1);
      expect(count(t).full).toBeLessThanOrEqual(1);
    }
    expect(planStateAt(scene, f, T.buildEnd + 300).list.active.every((a) => a === 0)).toBe(true);
  });

  it('keeps the list in its build panel until the pull-back, then moves it with the pull-back', () => {
    const f = { w: 558, h: 348 };
    expect(planStateAt(scene, f, T.holdEnd).list.morph).toBe(0);
    expect(planStateAt(scene, f, T.holdEnd - 1).list.appear.every((a) => a === 1)).toBe(true);
    const mid = planStateAt(scene, f, (T.holdEnd + T.end) / 2).list.morph;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });
});

describe('Plan timeline (Section 54.4.2)', () => {
  it('builds backward: Required On Site first, then each activity from the last to the first', () => {
    const segs = scene.focal.layout.segments;
    expect(scene.steps.map((s) => s.id)).toEqual([...segs].reverse().map((s) => s.step.id));
    for (const s of scene.steps) expect(s.to).toBeLessThan(s.from);
    expect(T.rosIn).toBeLessThan(T.buildStart);
  });

  it('runs its stages in order, back to back', () => {
    const times = [T.rosIn, T.buildStart, T.buildEnd, T.chainArrive, T.holdEnd, T.end];
    expect(times).toEqual([...times].sort((a, b) => a - b));
    scene.steps.forEach((s, k) => {
      if (k > 0) {
        const prev = scene.steps[k - 1];
        expect(s.start).toBe(prev.start + prev.duration + prev.dwell);
      }
    });
    const last = scene.steps[scene.steps.length - 1];
    expect(last.start + last.duration + last.dwell).toBe(T.buildEnd);
  });

  it('rests on each completed activity long enough to read, longer on a milestone and after a long activity, and nowhere else', () => {
    for (const s of scene.steps) {
      const long = s.span > TIMING.LONG_SPAN;
      expect(s.dwell).toBe(TIMING.STEP_DWELL + (s.milestone ? TIMING.MILESTONE_DWELL : 0) + (long ? TIMING.LONG_SETTLE : 0));
      // Founder direction 2026-11-10: about 600-800 ms, 800-1000 ms at a milestone.
      if (!long) {
        if (s.milestone) {
          expect(s.dwell).toBeGreaterThanOrEqual(800);
          expect(s.dwell).toBeLessThanOrEqual(1000);
        } else {
          expect(s.dwell).toBeGreaterThanOrEqual(600);
          expect(s.dwell).toBeLessThanOrEqual(800);
        }
      }
    }
    // Only Fabrication is long, and it settles longer than any other rest.
    expect(scene.steps.filter((s) => s.span > TIMING.LONG_SPAN).map((s) => s.id)).toEqual(['swd-14']);
    const fab = scene.steps.find((s) => s.id === 'swd-14')!;
    expect(fab.dwell).toBe(Math.max(...scene.steps.map((s) => s.dwell)));
    // In the approved scenario: Initial Submittal, both resubmittals, and Final Approval with Release.
    expect(scene.steps.filter((s) => s.milestone).map((s) => s.id)).toEqual(['swd-14', 'swd-11', 'swd-8', 'swd-5']);
    // The build is the moves plus the rests, exactly: no other delay accumulates.
    const sum = scene.steps.reduce((n, s) => n + s.duration + s.dwell, 0);
    expect(T.buildEnd - T.buildStart).toBe(sum);
  });

  it('holds the edge, the camera and the labels still through every rest', () => {
    const f = { w: 558, h: 348 };
    for (const s of scene.steps) {
      const a = planStateAt(scene, f, s.start + s.duration);
      const b = planStateAt(scene, f, s.start + s.duration + s.dwell - 1);
      expect(a.edgeX).toBe(s.to);
      expect(b.edgeX).toBe(s.to);
      expect(b.view).toEqual(a.view);
      // The activity just completed is fully labelled while it rests.
      expect(revealAt(s.to, a.edgeX)).toBe(1);
    }
  });

  it('holds the whole chain for 1.5 seconds before the schedule reveal', () => {
    expect(T.holdEnd - T.chainArrive).toBe(1500);
    expect(TIMING.CHAIN_HOLD).toBe(1500);
    for (const f of FRAMES) {
      const a = planStateAt(scene, f, T.chainArrive);
      const b = planStateAt(scene, f, T.holdEnd - 1);
      expect(b.view.scale).toBeCloseTo(a.view.scale);
      expect(b.view.cx).toBeCloseTo(a.view.cx);
      expect(b.others).toBe(0);
    }
  });

  for (const f of FRAMES) {
    describe(`${f.w}×${f.h} frame`, () => {
      it('shows Required On Site alone at the start, with nothing of the chain', () => {
        const s = planStateAt(scene, f, T.buildStart - 1);
        expect(s.ros).toBe(1);
        expect(s.others).toBe(0);
        for (const seg of scene.focal.layout.segments) expect(revealAt(seg.x0, s.edgeX)).toBe(0);
        const shown = shownX(f, T.buildStart - 1);
        expect(scene.rosX).toBeGreaterThan(shown.left);
        expect(scene.rosX).toBeLessThan(shown.right);
      });

      it('moves the planning edge only leftward, and keeps it in view while building', () => {
        let prev = Infinity;
        for (let t = T.buildStart; t < T.buildEnd; t += 25) {
          const s = planStateAt(scene, f, t);
          expect(s.edgeX).toBeLessThanOrEqual(prev + 1e-9);
          prev = s.edgeX;
          const shown = shownX(f, t);
          expect(Math.min(s.edgeX, scene.rosX)).toBeGreaterThan(shown.left);
          expect(Math.min(s.edgeX, scene.rosX)).toBeLessThan(shown.right);
        }
      });

      it('reveals every activity, milestone and label by the end of the build', () => {
        const { edgeX } = planStateAt(scene, f, T.buildEnd);
        for (const seg of scene.focal.layout.segments) expect(revealAt(seg.x0, edgeX)).toBe(1);
        for (const m of scene.focal.layout.milestones) expect(revealAt(m.x, edgeX)).toBe(1);
      });

      it('frames the whole chain during the hold, Required On Site label included', () => {
        const shown = shownX(f, T.chainArrive);
        expect(shown.left).toBeLessThanOrEqual(scene.focal.layout.segments[0].x0);
        expect(shown.right).toBeGreaterThanOrEqual(scene.chainRight - 1);
        expect(planStateAt(scene, f, T.chainArrive).view).toEqual(toScreen(scene, chainView(scene, f)));
      });

      it('rests on the whole application window, and stays there', () => {
        const end = planStateAt(scene, f, T.end);
        expect(end.view).toEqual(scheduleView(scene, f));
        expect(end.others).toBe(1);
        expect(end.summary).toBe(0);
        expect(end.app).toBe(1);
        expect(end.focalAxis).toBe(0);
        expect(end.list.morph).toBe(1);
        expect(end.list.appear.every((a) => a === 1)).toBe(true);
        expect(end.list.active.every((a) => a === 0)).toBe(true);
        expect(end.list.rail).toBe(0);
        expect(planStateAt(scene, f, T.end + 10000)).toEqual(end);
        // The application screen is at the window's place in the frame.
        const lay = listLayout(f);
        const { cx, cy, scale } = end.view;
        expect(f.w / 2 - scale * cx).toBeCloseTo(lay.window.x);
        expect(f.h / 2 - scale * cy).toBeCloseTo(lay.window.y);
        if (lay.mode === 'side') {
          // The software is never shrunk for the list: its whole width, from its top (redesigned 2026-11-11).
          expect(lay.window).toEqual({ x: 0, y: 0, s: Math.max(f.w / APP.w, f.h / APP.h) });
          expect(APP.w * lay.window.s).toBeCloseTo(f.w);
        } else {
          expect(lay.window.x + APP.w * lay.window.s).toBeLessThanOrEqual(f.w + 1e-6);
          expect(lay.window.y + APP.h * lay.window.s).toBeLessThanOrEqual(f.h + 1e-6);
        }
      });

      it('keeps the list where it is when it has nowhere to rest: on its rail, fading with it; in two columns beneath on a phone', () => {
        const lay = listLayout(f);
        expect(lay.mode).toBe(f.w >= SIDE_MIN_W ? 'side' : 'stacked');
        for (const p of [...lay.start, ...lay.end]) {
          expect(p.x).toBeGreaterThanOrEqual(0);
          expect(p.x + LIST_ITEM.w * p.s).toBeLessThanOrEqual(f.w);
          expect(p.y + LIST_ITEM.h * p.s).toBeLessThanOrEqual(f.h);
        }
        if (lay.mode === 'side') {
          expect(lay.end).toEqual(lay.start);
          // One column, inside the rail, with room beneath for the total.
          for (const p of lay.start) expect(p.x + LIST_ITEM.w * p.s).toBeLessThanOrEqual(lay.panel.w);
          const last = lay.start[lay.start.length - 1];
          expect(last.y + (LIST_ITEM.h + LIST_TOTAL.gap + LIST_TOTAL.h) * last.s).toBeLessThanOrEqual(f.h);
          // And room above for the heading.
          expect(lay.start[0].y).toBeGreaterThanOrEqual(14 + LIST_TITLE_H * lay.start[0].s - 1e-6);
          // The entries do not move; the rail's contents fade early in the pull-back.
          for (const m of [0, 0.3, 0.7, 1]) PLAN_STEP_GROUPS.forEach((_, i) => expect(listItemAt(lay, i, m)).toEqual(lay.start[i]));
          const mid = planStateAt(scene, f, T.holdEnd + (T.end - T.holdEnd) * 0.6);
          expect(mid.list.rail).toBe(0);
          expect(planStateAt(scene, f, T.holdEnd).list.rail).toBe(1);
        } else {
          const winBottom = lay.window.y + APP.h * lay.window.s;
          for (const p of lay.end) expect(p.y).toBeGreaterThanOrEqual(winBottom);
          expect(lay.end[0].x).toBeLessThan(lay.end[3].x);
          expect(lay.end[0].y).toBeLessThan(lay.end[1].y);
        }
      });

      it('moves the list without any entry passing over another', () => {
        const lay = listLayout(f);
        const box = (p: { x: number; y: number; s: number }) => ({ l: p.x, t: p.y, r: p.x + LIST_ITEM.w * p.s, b: p.y + LIST_ITEM.h * p.s });
        for (let m = 0; m <= 1.0001; m += 0.02) {
          const boxes = PLAN_STEP_GROUPS.map((_, i) => box(listItemAt(lay, i, Math.min(1, m))));
          for (let i = 0; i < boxes.length; i++)
            for (let j = i + 1; j < boxes.length; j++) {
              const A = boxes[i];
              const B = boxes[j];
              const overlap = A.l < B.r - 0.5 && B.l < A.r - 0.5 && A.t < B.b - 0.5 && B.t < A.b - 0.5;
              expect(overlap, `entries ${i} and ${j} at ${m.toFixed(2)}`).toBe(false);
            }
        }
        // And it arrives exactly at the final layout.
        PLAN_STEP_GROUPS.forEach((_, i) => expect(listItemAt(lay, i, 1)).toEqual(lay.end[i]));
      });

      it('builds the chain clear of the list panel', () => {
        const lay = listLayout(f);
        const { k, ox } = scene.place;
        for (let t = T.buildStart; t < T.buildEnd; t += 50) {
          const st = planStateAt(scene, f, t);
          const sx = f.w / 2 + st.view.scale * (ox + k * Math.min(st.edgeX, scene.rosX) - st.view.cx);
          expect(sx).toBeGreaterThanOrEqual(lay.area.x - 1e-6);
          expect(sx).toBeLessThanOrEqual(lay.area.x + lay.area.w + 1e-6);
        }
      });

      it('keeps the application hidden until the schedule pull-back', () => {
        for (const t of [0, T.buildStart, T.buildEnd, T.chainArrive, T.holdEnd]) expect(planStateAt(scene, f, t).app).toBe(0);
      });

      it('moves the camera continuously: no jumps between frames', () => {
        let prev = planStateAt(scene, f, 0).view;
        for (let t = 16; t <= T.end; t += 16) {
          const v = planStateAt(scene, f, t).view;
          expect(Math.abs(Math.log(v.scale / prev.scale))).toBeLessThan(0.08);
          expect(Math.abs((v.cx - prev.cx) * v.scale)).toBeLessThan(f.w * 0.06);
          prev = v;
        }
      });
    });
  }
});

describe('Plan step list resting beside the frame (refined 2026-11-10)', () => {
  /* The free copy-column area beneath the Plan copy, as the section measures
     it at 1280×800 and at 1440×900 / 1920×1080 (the section's max-w-7xl
     gives those two the same frame), in frame-inner coordinates. */
  const CASES: Frame[] = [
    { w: 558, h: 348, aside: { x: -641, y: 266, w: 560, h: 124 } },
    { w: 598, h: 373, aside: { x: -681, y: 267, w: 600, h: 123 } },
  ];

  for (const f of CASES) {
    describe(`${f.w}×${f.h} frame`, () => {
      const lay = listLayout(f);

      it('keeps the whole frame for the application window, as before the list', () => {
        expect(lay.mode).toBe('aside');
        const cover = Math.max(f.w / APP.w, f.h / APP.h);
        const end = planStateAt(scene, f, T.end).view;
        expect(end.scale).toBeCloseTo(cover);
        expect(f.w / 2 - end.scale * end.cx).toBeCloseTo(0);
        expect(f.h / 2 - end.scale * end.cy).toBeCloseTo(0);
      });

      it('rests larger, about 22% over the build rail\'s 85%, centred as a group with even spacing (refined 2026-11-10)', () => {
        const a = f.aside!;
        const E = lay.end;
        const s = E[0].s;
        expect(s / 0.85).toBeGreaterThanOrEqual(1.2);
        expect(s / 0.85).toBeLessThanOrEqual(1.25);
        const colW = LIST_ITEM.w * s;
        const left = E[0].x - a.x;
        const right = a.x + a.w - (E[3].x + colW);
        const gap = E[3].x - (E[0].x + colW);
        // Centred, and the gap between the columns matches the margins either side (or its cap).
        expect(left).toBeCloseTo(right, 6);
        expect(gap).toBeLessThanOrEqual(left + 1e-6);
        expect(gap).toBeGreaterThanOrEqual(40);
        // Columns aligned; rows evenly pitched and a little more open than at the old 85%.
        for (let i = 0; i < 3; i++) {
          expect(E[i].x).toBe(E[0].x);
          expect(E[i + 3].x).toBe(E[3].x);
          expect(E[i + 3].y).toBe(E[i].y);
        }
        const pitch = E[1].y - E[0].y;
        expect(E[2].y - E[1].y).toBeCloseTo(pitch, 9);
        expect(pitch).toBeGreaterThan(LIST_ITEM.pitch * 0.85 + 6);
        // Entirely within the free area: the copy above and the stage's foot below stay clear.
        expect(E[0].y).toBe(a.y);
        expect(E[2].y + LIST_ITEM.h * s).toBeLessThanOrEqual(a.y + a.h + 1e-6);
      });

      it('rests the list in two readable columns inside the free area, outside the frame', () => {
        const a = f.aside!;
        for (const p of lay.end) {
          expect(p.s).toBeGreaterThanOrEqual(0.7);
          expect(p.x).toBeGreaterThanOrEqual(a.x);
          expect(p.x + LIST_ITEM.w * p.s).toBeLessThanOrEqual(Math.min(a.x + a.w, 0));
          expect(p.y).toBeGreaterThanOrEqual(a.y);
          expect(p.y + LIST_ITEM.h * p.s).toBeLessThanOrEqual(a.y + a.h);
        }
        expect(new Set(lay.end.map((p) => Math.round(p.x))).size).toBe(2);
      });

      /* The list's screen-space boxes at every 60 fps frame of the pull-back,
         through the real clock (planStateAt → listItemAt). The aside layer
         is the frame's inner box, untransformed, so these are screen px
         offset by the frame's own position. */
      const FRAME_MS = 1000 / 60;
      const frames = (() => {
        const out: { t: number; boxes: { l: number; t: number; r: number; b: number; cx: number; cy: number }[]; fade: number[] }[] = [];
        for (let t = T.holdEnd; t <= T.end + 1e-6; t += FRAME_MS) {
          const morph = planStateAt(scene, f, t).list.morph;
          const placed = PLAN_STEP_GROUPS.map((_, i) => listItemAt(lay, i, morph));
          const boxes = placed.map((p) => {
            const w = LIST_ITEM.w * p.s;
            const h = LIST_ITEM.h * p.s;
            return { l: p.x, t: p.y, r: p.x + w, b: p.y + h, cx: p.x + w / 2, cy: p.y + h / 2 };
          });
          out.push({ t, boxes, fade: listCrossingFade(lay, morph) });
        }
        return out;
      })();
      const overlap = (A: { l: number; t: number; r: number; b: number }, B: typeof A) =>
        Math.max(0, Math.min(A.r, B.r) - Math.max(A.l, B.l)) * Math.max(0, Math.min(A.b, B.b) - Math.max(A.t, B.t));

      it('starts on the rail and ends in the final two columns, exactly', () => {
        PLAN_STEP_GROUPS.forEach((_, i) => {
          expect(listItemAt(lay, i, planStateAt(scene, f, T.holdEnd).list.morph)).toEqual(lay.start[i]);
          expect(listItemAt(lay, i, planStateAt(scene, f, T.end).list.morph)).toEqual(lay.end[i]);
        });
      });

      it('moves every entry, and the list as a whole, left and down only: no bounce', () => {
        const EPS = 1e-6;
        for (let k = 1; k < frames.length; k++) {
          const [prev, cur] = [frames[k - 1].boxes, frames[k].boxes];
          cur.forEach((c, i) => {
            const p = prev[i];
            const at = `entry ${i} at ${(frames[k].t - T.holdEnd).toFixed(0)} ms`;
            expect(c.l, at).toBeLessThanOrEqual(p.l + EPS);
            expect(c.cx, at).toBeLessThanOrEqual(p.cx + EPS);
            expect(c.r, at).toBeLessThanOrEqual(p.r + EPS);
            expect(c.t, at).toBeGreaterThanOrEqual(p.t - EPS);
            expect(c.cy, at).toBeGreaterThanOrEqual(p.cy - EPS);
          });
          // The list's bounding box and centroid.
          const bb = (bs: typeof cur) => ({
            l: Math.min(...bs.map((b) => b.l)),
            r: Math.max(...bs.map((b) => b.r)),
            t: Math.min(...bs.map((b) => b.t)),
            b: Math.max(...bs.map((b) => b.b)),
            cx: bs.reduce((n, b) => n + b.cx, 0) / bs.length,
            cy: bs.reduce((n, b) => n + b.cy, 0) / bs.length,
          });
          const [P, C] = [bb(prev), bb(cur)];
          expect(C.l).toBeLessThanOrEqual(P.l + EPS);
          expect(C.r).toBeLessThanOrEqual(P.r + EPS);
          expect(C.cx).toBeLessThanOrEqual(P.cx + EPS);
          expect(C.t).toBeGreaterThanOrEqual(P.t - EPS);
          expect(C.b).toBeGreaterThanOrEqual(P.b - EPS);
          expect(C.cy).toBeGreaterThanOrEqual(P.cy - EPS);
        }
        // It sets off left at once: moving within the first tenth of the pull-back.
        const early = frames[Math.round(frames.length * 0.1)].boxes;
        early.forEach((b, i) => expect(b.l).toBeLessThan(frames[0].boxes[i].l - 5));
      });

      it('never passes through the copy above the free area', () => {
        const a = f.aside!;
        for (const fr of frames)
          fr.boxes.forEach((b, i) => {
            if (b.l < a.x + a.w) expect(b.t, `entry ${i} at ${(fr.t - T.holdEnd).toFixed(0)} ms`).toBeGreaterThanOrEqual(a.y - 0.5);
          });
      });

      it('crosses its columns once, briefly, with the second faded back', () => {
        let crossing = 0;
        let runs = 0;
        let was = false;
        for (const fr of frames) {
          const B = fr.boxes;
          let any = false;
          for (let i = 0; i < 6; i++)
            for (let j = i + 1; j < 6; j++) {
              const o = overlap(B[i], B[j]);
              if (o <= 0.5) continue;
              // Only a first-column entry over a second-column one.
              expect(i < 3 && j >= 3, `entries ${i}/${j}`).toBe(true);
              any = true;
              // A substantial overlap is always faded well back.
              const area = (B[j].r - B[j].l) * (B[j].b - B[j].t);
              if (o / area > 0.1) expect(fr.fade[j]).toBeLessThan(0.75);
            }
          if (any) crossing += FRAME_MS;
          if (any && !was) runs++;
          was = any;
        }
        expect(runs).toBe(1);
        // About half a second since the list rests larger and centred (refined 2026-11-10; was about a third).
        expect(crossing).toBeLessThan(650);
        // The first column is never faded, and nothing is faded at rest.
        for (const fr of frames) fr.fade.slice(0, 3).forEach((o) => expect(o).toBe(1));
        expect(frames[frames.length - 1].fade.every((o) => o === 1)).toBe(true);
        // The fade never flickers: small steps between frames, never below 40%.
        for (let k = 1; k < frames.length; k++)
          frames[k].fade.forEach((o, i) => {
            expect(o).toBeGreaterThanOrEqual(0.4 - 1e-9);
            expect(Math.abs(o - frames[k - 1].fade[i])).toBeLessThan(0.12);
          });
      });

      it('falls back to staying on the rail when there is no free area', () => {
        expect(listLayout({ w: f.w, h: f.h }).mode).toBe('side');
        expect(listLayout({ w: f.w, h: f.h, aside: { ...f.aside!, h: 40 } }).mode).toBe('side');
      });
    });
  }
});

describe('Plan build framing: the chain beside the step list (refined 2026-11-10)', () => {
  const CASES: Frame[] = [
    ...FRAMES,
    { w: 558, h: 348, aside: { x: -641, y: 266, w: 560, h: 124 } },
    { w: 598, h: 373, aside: { x: -681, y: 267, w: 600, h: 123 } },
  ];
  /** A scene x on screen, in frame px. */
  const screenX = (f: Frame, t: number, x: number) => {
    const { cx, scale } = planStateAt(scene, f, t).view;
    const { k, ox } = scene.place;
    return f.w / 2 + scale * (ox + k * x - cx);
  };
  const segs = scene.focal.layout.segments;
  /** Each focal label and the scene x at which the renderer reveals it. */
  const labels = scene.focal.layout.labels.map((l) => {
    const seg = segs.find((s) => `dur-${s.step.id}` === l.key);
    return { ...l, revealX: seg ? seg.x0 : l.text.x };
  });
  /* No overlap. The stand-in measure is wider than the real type, so this is
     conservative: in the browser the closest label clears the list by ~20 px. */
  const MARGIN = 0;

  for (const f of CASES) {
    describe(`${f.w}×${f.h} frame${f.aside ? ', list aside' : ''}`, () => {
      const area = listLayout(f).area;

      it('keeps the planning edge and every revealed label clear of the step list, through the build and the pull-back to the whole chain', () => {
        for (let t = T.buildStart; t <= T.chainArrive; t += 10) {
          const s = planStateAt(scene, f, t);
          // After the build the edge parks past the chain's start, where nothing is drawn.
          if (t < T.buildEnd) expect(screenX(f, t, s.edgeX)).toBeGreaterThanOrEqual(area.x + MARGIN);
          for (const l of labels) {
            if (revealAt(l.revealX, s.edgeX) <= 0) continue;
            expect(screenX(f, t, l.box.x), `${l.key} at ${t} ms`).toBeGreaterThanOrEqual(area.x + MARGIN);
          }
        }
      });

      it('brings the built chain close to the list: the edge rests in the left quarter of the chain area', () => {
        for (const step of scene.steps.slice(1)) {
          const t = step.start + step.duration + step.dwell / 2;
          const x = screenX(f, t, planStateAt(scene, f, t).edgeX);
          expect((x - area.x) / area.w).toBeLessThanOrEqual(0.25);
        }
      });
    });
  }
});

/** Screen px per ms at Fabrication's fastest: about 0.3 (it was about 1.4 before the 2026-11-10 pacing). */
const PEAK_FAB_SPEED = 0.32;

describe('Plan pacing (refined 2026-11-10)', () => {
  const fab = scene.steps.find((s) => s.id === 'swd-14')!;
  const rest = scene.steps.filter((s) => s !== fab);

  it('gives Fabrication a long, slow move: about three seconds, several times any other', () => {
    expect(fab.family).toBe('production');
    expect(fab.duration).toBeGreaterThanOrEqual(3000);
    expect(fab.duration).toBeLessThanOrEqual(TIMING.STEP_MAX);
    expect(fab.duration).toBeGreaterThan(3 * Math.max(...rest.map((s) => s.duration)));
  });

  it('keeps every move at least 700 ms, and longer activities never quicker than shorter ones', () => {
    for (const s of scene.steps) expect(s.duration).toBeGreaterThanOrEqual(TIMING.STEP_MIN);
    const bySpan = [...scene.steps].sort((a, b) => a.span - b.span);
    bySpan.forEach((s, i) => i > 0 && expect(s.duration).toBeGreaterThanOrEqual(bySpan[i - 1].duration));
  });

  it("moves Fabrication's content across the screen at a followable speed, with no jump", () => {
    for (const f of FRAMES) {
      const step = 10;
      let peak = 0;
      // The content passing through the frame's centre: the motion the eye follows.
      for (let t = fab.start; t < fab.start + fab.duration + fab.dwell; t += step) {
        const a = planStateAt(scene, f, t).view;
        const b = planStateAt(scene, f, t + step).view;
        const xAtCentre = a.cx; // canvas x at the frame's centre at t
        const later = f.w / 2 + b.scale * (xAtCentre - b.cx);
        peak = Math.max(peak, Math.abs(later - f.w / 2) / step);
      }
      expect(peak).toBeLessThan(PEAK_FAB_SPEED);
    }
  });

  it('moves the camera continuously through the whole build: no jump in position or scale', () => {
    for (const f of FRAMES) {
      const step = 5;
      for (let t = T.rosIn; t < T.end; t += step) {
        const a = planStateAt(scene, f, t).view;
        const b = planStateAt(scene, f, t + step).view;
        // In screen px: the canvas point at the centre moves under 3 px per 5 ms, and scale under 1.5%.
        expect(Math.abs(f.w / 2 + b.scale * (a.cx - b.cx) - f.w / 2)).toBeLessThan(3);
        expect(Math.abs(Math.log(b.scale / a.scale))).toBeLessThan(0.015);
      }
    }
  });

  it('times the step list from the same steps, so it stays in sync', () => {
    for (const [i, e] of scene.list.entries()) {
      if (i === 0) continue;
      const own = scene.steps.filter((s) => PLAN_STEP_GROUPS[i].families.includes(s.family));
      expect(e.activeFrom).toBe(Math.min(...own.map((s) => s.start)));
      expect(e.activeUntil).toBe(Math.max(...own.map((s) => s.start + s.duration + s.dwell)));
    }
  });

  it('keeps the whole pass under half a minute', () => {
    expect(T.end).toBeLessThanOrEqual(30000);
  });

  it('opens with the rail in its navy state carrying the founder-supplied statement, and returns it to the list (redesigned 2026-11-11)', () => {
    expect(scene.lead).toBe('Start with when the field needs it.');
    const f = { w: 558, h: 348 };
    const at = (t: number) => planStateAt(scene, f, t).list;
    const L = TIMING;
    // Nothing through the panel's 450 ms slide.
    for (let t = 0; t <= 450; t += 25) {
      expect(at(t).leadBg).toBe(0);
      expect(at(t).leadRule).toBe(0);
      expect(at(t).lead).toBe(0);
    }
    // In order: the navy ground, then the rule, then the statement.
    expect(L.LEAD_BG_AT).toBeLessThan(L.LEAD_RULE_AT);
    expect(L.LEAD_RULE_AT).toBeLessThan(L.LEAD_TEXT_AT);
    const mid = L.LEAD_TEXT_AT + 50;
    expect(at(mid).leadBg!).toBeGreaterThan(at(mid).leadRule!);
    expect(at(mid).leadRule!).toBeGreaterThan(at(mid).lead!);
    // Held: everything fully shown for about a second.
    const fullFrom = L.LEAD_TEXT_AT + L.LEAD_TEXT;
    const fullUntil = L.GROUPS_AT - L.LEAD_CONTENT_OUT_BEFORE;
    for (const t of [fullFrom, (fullFrom + fullUntil) / 2, fullUntil]) expect(at(t)).toMatchObject({ leadBg: 1, leadRule: 1, lead: 1, leadIn: 1 });
    expect(fullUntil - fullFrom).toBeGreaterThanOrEqual(1000);
    // Out: the statement and rule first, then the ground, complete exactly as the list begins.
    const contentGone = fullUntil + L.LEAD_CONTENT_OUT;
    expect(at(contentGone).lead).toBe(0);
    expect(at(contentGone).leadRule).toBe(0);
    expect(at(contentGone).leadBg!).toBeGreaterThan(0);
    for (let t = L.GROUPS_AT; t <= T.end; t += 100) expect(at(t)).toMatchObject({ leadBg: 0, leadRule: 0, lead: 0 });
    // The statement rises on the way in only.
    expect(at(L.GROUPS_AT - 100).leadIn).toBe(1);
    // And the list does not begin until the rail is light again.
    for (let t = 0; t < L.GROUPS_AT; t += 20) {
      const { title, appear } = at(t);
      expect(title).toBe(0);
      expect(appear.every((a) => a === 0)).toBe(true);
    }
  });
});

describe('Plan calendar grid (refined 2026-11-10)', () => {
  const L = scene.focal.layout;
  const g = calendarGrid(L);
  const DAY = 86400000;
  const start = parse(L.domainStart).getTime();
  const dateAt = (x: number) => new Date(start + Math.round((x - CHAIN.PAD_L) / L.pxPerDay) * DAY);
  const onGrid = (x: number) => {
    const n = (x - CHAIN.PAD_L) / L.pxPerDay;
    return Math.abs(n - Math.round(n)) < 1e-9;
  };

  it('puts a line on every calendar-day boundary, the Mondays as week lines', () => {
    const all = [...g.days, ...g.weeks].sort((a, b) => a - b);
    expect(all[0]).toBe(CHAIN.PAD_L);
    expect(all[all.length - 1]).toBeCloseTo(L.width - CHAIN.PAD_R);
    all.forEach((x, i) => i > 0 && expect(x - all[i - 1]).toBeCloseTo(L.pxPerDay));
    for (const x of g.weeks) expect(dateAt(x).getUTCDay()).toBe(1);
    for (const x of g.days) expect(dateAt(x).getUTCDay()).not.toBe(1);
    expect(g.weeks.length).toBeGreaterThan(50);
  });

  it("lands every activity's start and end, and every milestone date, on a day line", () => {
    for (const s of L.segments) {
      expect(onGrid(s.x0)).toBe(true);
      expect(onGrid(s.x1)).toBe(true);
      expect(iso(dateAt(s.x0))).toBe(s.step.startDate);
    }
  });

  it('shades exactly the non-working days of the calendar the backward pass counts', () => {
    const shaded = new Set<string>();
    for (const r of g.nonWorking) {
      expect(onGrid(r.x)).toBe(true);
      for (let d = 0; d < Math.round(r.w / L.pxPerDay); d++) shaded.add(iso(new Date(dateAt(r.x).getTime() + d * DAY)));
    }
    const all = [...g.days, ...g.weeks].sort((a, b) => a - b).slice(0, -1);
    for (const x of all) expect(shaded.has(iso(dateAt(x)))).toBe(!isWorkingDay(dateAt(x)));
    // Every Saturday and Sunday, and the observed holidays too.
    expect([...shaded].some((d) => isHoliday(parse(d)) && ![0, 6].includes(parse(d).getUTCDay()))).toBe(true);
    // No activity starts on a shaded day.
    for (const s of L.segments) if (s.step.kind === 'phase') expect(shaded.has(s.step.startDate)).toBe(false);
  });

  it('shows days and weeks at the build scale, only weeks in the long pull-back, and neither at the whole-chain hold', () => {
    for (const f of FRAMES.slice(0, 2)) {
      const at = (t: number) => planStateAt(scene, f, t).grid;
      expect(at(T.buildStart)).toEqual({ day: 1, week: 1 });
      const fab = scene.steps.find((s) => s.id === 'swd-14')!;
      const mid = at(fab.start + fab.duration / 2);
      expect(mid.day).toBe(0);
      expect(mid.week).toBeGreaterThan(0.5);
      expect(at(T.chainArrive)).toEqual({ day: 0, week: 0 });
      expect(at(T.end)).toEqual({ day: 0, week: 0 });
    }
  });

  it('derives the grid from the same camera, so it moves with the chain and never on its own', () => {
    const f = FRAMES[0];
    for (let t = 0; t <= T.end; t += 50) {
      const s = planStateAt(scene, f, t);
      expect(s.grid).toEqual(gridAt(scene, s.view, s.focalAxis));
    }
  });
});

describe('Plan timescale header (refined 2026-11-10)', () => {
  const L = scene.focal.layout;
  const g = calendarGrid(L);
  const ts = scene.timescale;
  const DAY = 86400000;
  const start = parse(L.domainStart).getTime();
  const dateAt = (x: number) => new Date(start + Math.round((x - CHAIN.PAD_L) / L.pxPerDay) * DAY);
  const CASES: Frame[] = [...FRAMES, { w: 558, h: 348, aside: { x: -641, y: 266, w: 560, h: 124 } }];

  it('puts every month at its 1st and every week at its Monday, on the grid\'s own lines', () => {
    const lines = new Set([...g.days, ...g.weeks]);
    for (const m of ts.months) {
      expect(lines.has(m.x0)).toBe(true);
      expect(dateAt(m.x0).getUTCDate() === 1 || m.x0 === CHAIN.PAD_L).toBe(true);
    }
    expect(ts.weeks.map((w) => w.x)).toEqual(g.weeks);
    for (const w of ts.weeks) expect(String(dateAt(w.x).getUTCDate())).toBe(w.text);
    for (const y of ts.years.slice(1)) expect(iso(dateAt(y.x0)).endsWith('-01-01')).toBe(true);
  });

  for (const f of CASES) {
    describe(`${f.w}×${f.h} frame${f.aside ? ', list aside' : ''}`, () => {
      const area = listLayout(f).area;

      it('stays pinned to the top of the chart while the camera moves and zooms', () => {
        for (let t = 0; t <= T.end; t += 100) {
          const h = planStateAt(scene, f, t).header;
          expect(h.box).toEqual({ x: area.x, y: area.y, w: area.w, h: HEADER.h });
        }
      });

      it('places its lines and labels through the same camera as the chain, so they cannot drift', () => {
        for (let t = T.buildStart; t <= T.holdEnd; t += 137) {
          const s = planStateAt(scene, f, t);
          const { cx, scale } = s.view;
          for (const x of [CHAIN.PAD_L, scene.rosX, ...ts.weeks.slice(0, 5).map((w) => w.x)]) {
            expect(s.header.a + s.header.b * x).toBeCloseTo(f.w / 2 + scale * (scene.place.ox + scene.place.k * x - cx), 6);
          }
          ts.weeks.forEach((w, i) => expect(s.header.weeks[i]).toBeCloseTo(s.header.a + s.header.b * w.x, 6));
        }
      });

      it('keeps each shown label inside its own period', () => {
        for (let t = T.buildStart; t <= T.holdEnd; t += 97) {
          const h = planStateAt(scene, f, t).header;
          for (const [periods, labels] of [[ts.months, h.months], [ts.years, h.years], [ts.monthsShort, h.monthsShort]] as const) {
            periods.forEach((p, i) => {
              const l = labels[i];
              if (!l.show) return;
              const w = p.variants.find((v) => v.text === l.text)!.w;
              expect(l.x).toBeGreaterThanOrEqual(h.a + h.b * p.x0 + HEADER.pad - 1e-6);
              expect(l.x + w).toBeLessThanOrEqual(h.a + h.b * p.x1 - HEADER.pad + 1e-6);
            });
          }
        }
      });

      it('reads months over weeks through the whole build, Fabrication included, and years over months at the hold', () => {
        for (let t = T.buildStart; t < T.buildEnd; t += 50) expect(planStateAt(scene, f, t).header.zoomIn).toBe(1);
        const hold = planStateAt(scene, f, T.chainArrive).header;
        expect(hold.zoomIn).toBe(0);
        expect(hold.years.some((y) => y.show)).toBe(true);
        // At the build scale, a month carries its full name and year.
        const build = planStateAt(scene, f, T.buildStart).header;
        const shown = build.months.filter((m) => m.show);
        expect(shown.length).toBeGreaterThan(0);
        if (f.w > 460) for (const m of shown) expect(m.text).toMatch(/^[A-Z][a-z]+ \d{4}$/);
      });

      it('fades with the grid on the pull-back, and is gone in the application view', () => {
        expect(planStateAt(scene, f, T.end).header.opacity).toBe(0);
        expect(planStateAt(scene, f, T.buildStart).header.opacity).toBe(1);
      });

      it('keeps the bar below the header and centres the chain in the chart beneath it', () => {
        for (let t = T.buildStart; t < T.buildEnd; t += 50) {
          const { cy, scale } = planStateAt(scene, f, t).view;
          const barTop = f.h / 2 + scale * (scene.place.oy + scene.place.k * (scene.focal.dy + L.barTop) - cy);
          expect(barTop).toBeGreaterThan(area.y + HEADER.h);
        }
      });
    });
  }
});

describe('Plan: a long activity keeps its in-bar label in view (refined 2026-11-10)', () => {
  const fab = scene.steps.find((s) => s.id === 'swd-14')!;
  const seg = scene.focal.layout.segments.find((s) => s.step.id === 'swd-14')!;
  const L = scene.longLabels[0];
  const CASES: Frame[] = [...FRAMES.slice(0, 2), { w: 558, h: 348, aside: { x: -641, y: 266, w: 560, h: 124 } }];
  const screenX = (f: Frame, t: number, x: number) => {
    const { cx, scale } = planStateAt(scene, f, t).view;
    return f.w / 2 + scale * (scene.place.ox + scene.place.k * x - cx);
  };

  it('applies to Fabrication alone, with its icon and name', () => {
    expect(scene.longLabels.map((l) => l.id)).toEqual(['swd-14']);
    expect(seg.tier).toBe('A');
    expect(seg.inner!.lines.map((l) => l.text)).toEqual(['Fabrication']);
  });

  for (const f of CASES) {
    describe(`${f.w}×${f.h} frame${f.aside ? ', list aside' : ''}`, () => {
      const area = listLayout(f).area;

      it('shows it whole, in the chart and inside the bar, from the end of Fabrication\'s move while the bar is in view', () => {
        const from = fab.start + fab.duration;
        let seen = 0;
        for (let t = from; t < T.chainArrive; t += 25) {
          const s = planStateAt(scene, f, t);
          const c = L.c0 + s.labelShift[L.id];
          // Inside the bar, clear of its ends: the start's milestones and the chevron point.
          expect(c - L.half).toBeGreaterThanOrEqual(seg.x0 + 34 - 1e-6);
          expect(c + L.half).toBeLessThanOrEqual(seg.x1 - 34 + 1e-6);
          const l = screenX(f, t, c - L.half);
          const r = screenX(f, t, c + L.half);
          const barRight = Math.min(screenX(f, t, seg.x1), area.x + area.w);
          const barLeft = Math.max(screenX(f, t, seg.x0), area.x);
          // Wherever enough of the bar is in view to hold it, all of it is on screen.
          if (barRight - barLeft >= r - l + 2 * 34 * s.view.scale * scene.place.k) {
            expect(l).toBeGreaterThanOrEqual(area.x - 1e-6);
            expect(r).toBeLessThanOrEqual(area.x + area.w + 1e-6);
            seen += 25;
          }
        }
        // Readable for the whole of Fabrication's rest, and on into the next activities.
        expect(seen).toBeGreaterThan(fab.dwell + 1000);
      });

      it('is revealed as the backward pass completes Fabrication, not before', () => {
        const during = planStateAt(scene, f, fab.start + fab.duration * 0.5);
        expect(revealAt(seg.x0, during.edgeX)).toBe(0);
        const done = planStateAt(scene, f, fab.start + fab.duration);
        expect(revealAt(seg.x0, done.edgeX)).toBe(1);
      });

      it('sits at the bar\'s true centre wherever the whole bar is in view', () => {
        for (const t of [T.chainArrive, T.holdEnd - 1]) expect(planStateAt(scene, f, t).labelShift[L.id]).toBe(0);
      });

      it('moves continuously, never faster than the bar\'s ends or the frame edge it sits between', () => {
        for (let t = fab.start; t < T.end; t += 5) {
          const at = (u: number) => screenX(f, u, L.c0 + planStateAt(scene, f, u).labelShift[L.id]);
          const d = (x: number) => Math.abs(screenX(f, t + 5, x) - screenX(f, t, x));
          const { cx: c1, scale: k1 } = planStateAt(scene, f, t).view;
          const { cx: c2, scale: k2 } = planStateAt(scene, f, t + 5).view;
          // The canvas points at the chart's two edges: they move on screen as the camera does.
          const edgeX = (c: number, k: number, fx: number) => (c + (fx - f.w / 2) / k - scene.place.ox) / scene.place.k;
          const edges = [area.x, area.x + area.w].map((fx) => Math.max(d(edgeX(c1, k1, fx)), d(edgeX(c2, k2, fx))));
          const bound = Math.max(d(seg.x0), d(seg.x1), ...edges);
          expect(Math.abs(at(t + 5) - at(t))).toBeLessThanOrEqual(bound + 0.5);
        }
      });
    });
  }
});
