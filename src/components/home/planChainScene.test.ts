import { describe, expect, it } from 'vitest';
import type { Measure } from '../demo/screens/procurement-chain/chainLayout';
import { SCHEDULE_ITEMS } from '../demo/screens/procurement-schedule/scheduleFixture';
import { buildSteelWindowsChain } from '../demo/screens/procurement-chain/chainScenario';
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
  PLAN_STEP_GROUPS,
  SIDE_MIN_W,
  chainView,
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

  it('brings each entry in as its part of the chain starts to build', () => {
    expect(scene.list[0].appearAt).toBe(T.rosIn);
    expect(scene.list[0].activeUntil).toBe(T.buildStart);
    const startsOf = (fams: readonly string[]) => scene.steps.filter((st) => fams.includes(st.family)).map((st) => st.start);
    scene.list.slice(1).forEach((e, i) => {
      expect(e.appearAt).toBe(Math.min(...startsOf(PLAN_STEP_GROUPS[i + 1].families)));
    });
    // Each takes over as the step being built exactly where the last one ends.
    for (let i = 1; i < scene.list.length; i++) expect(scene.list[i].appearAt).toBe(scene.list[i - 1].activeUntil);
    expect(scene.list[scene.list.length - 1].activeUntil).toBe(T.buildEnd);
  });

  it('marks one step at a time as the one being built, and none once the build is done', () => {
    const f = { w: 558, h: 348 };
    for (let t = T.rosIn + 200; t < T.buildEnd - 50; t += 40) {
      const { active } = planStateAt(scene, f, t).list;
      const full = active.filter((a) => a > 0.99).length;
      const partial = active.filter((a) => a > 0.01 && a <= 0.99).length;
      expect(full + partial).toBeGreaterThanOrEqual(1);
      expect(full).toBeLessThanOrEqual(1);
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

  it('rests on each completed activity, a little longer on a milestone, and nowhere else', () => {
    for (const s of scene.steps) {
      expect(s.dwell).toBe(TIMING.STEP_DWELL + (s.milestone ? TIMING.MILESTONE_DWELL : 0));
      expect(s.dwell).toBeGreaterThanOrEqual(250);
      expect(s.dwell).toBeLessThanOrEqual(450);
    }
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

      it('rests on the whole application window beside the list, and stays there', () => {
        const end = planStateAt(scene, f, T.end);
        expect(end.view).toEqual(scheduleView(scene, f));
        expect(end.others).toBe(1);
        expect(end.summary).toBe(0);
        expect(end.app).toBe(1);
        expect(end.focalAxis).toBe(0);
        expect(end.list.morph).toBe(1);
        expect(end.list.appear.every((a) => a === 1)).toBe(true);
        expect(end.list.active.every((a) => a === 0)).toBe(true);
        expect(planStateAt(scene, f, T.end + 10000)).toEqual(end);
        // The whole application screen is in the frame, at the window's place.
        const lay = listLayout(f);
        const { cx, cy, scale } = end.view;
        expect(f.w / 2 - scale * cx).toBeCloseTo(lay.window.x);
        expect(f.h / 2 - scale * cy).toBeCloseTo(lay.window.y);
        expect(lay.window.x).toBeGreaterThanOrEqual(0);
        expect(lay.window.y).toBeGreaterThanOrEqual(0);
        expect(lay.window.x + APP.w * lay.window.s).toBeLessThanOrEqual(f.w + 1e-6);
        expect(lay.window.y + APP.h * lay.window.s).toBeLessThanOrEqual(f.h + 1e-6);
      });

      it('sets the finished list in two columns of three, clear of the window, inside the frame', () => {
        const lay = listLayout(f);
        const win = { x: lay.window.x, y: lay.window.y, r: lay.window.x + APP.w * lay.window.s, b: lay.window.y + APP.h * lay.window.s };
        const xs = [...new Set(lay.end.map((p) => Math.round(p.x)))];
        expect(xs).toHaveLength(2);
        for (const p of lay.end) {
          const r = p.x + LIST_ITEM.w * p.s;
          const b = p.y + LIST_ITEM.h * p.s;
          expect(p.x).toBeGreaterThanOrEqual(0);
          expect(r).toBeLessThanOrEqual(f.w);
          expect(b).toBeLessThanOrEqual(f.h);
          // Beside the window (side) or beneath it (stacked): never over it.
          if (lay.mode === 'side') expect(r).toBeLessThanOrEqual(win.x);
          else expect(p.y).toBeGreaterThanOrEqual(win.b);
        }
        expect(lay.mode).toBe(f.w >= SIDE_MIN_W ? 'side' : 'stacked');
        // Reading order: down the first column, then down the second.
        expect(lay.end[0].x).toBeLessThan(lay.end[3].x);
        expect(lay.end[0].y).toBeLessThan(lay.end[1].y);
        if (lay.mode === 'side') expect(lay.end[0].s).toBeLessThan(lay.start[0].s);
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
        expect(crossing).toBeLessThan(400);
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

      it('falls back to resting inside the frame when there is no free area', () => {
        expect(listLayout({ w: f.w, h: f.h }).mode).toBe('side');
        expect(listLayout({ w: f.w, h: f.h, aside: { ...f.aside!, h: 40 } }).mode).toBe('side');
      });
    });
  }
});
