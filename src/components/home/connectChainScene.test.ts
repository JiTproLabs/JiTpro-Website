import { describe, expect, it } from 'vitest';
import type { Measure } from '../demo/screens/procurement-chain/chainLayout';
import { CHAIN } from '../demo/screens/procurement-chain/chainLayout';
import { FOCAL_ITEM, HEADER, buildPlanScene, planStateAt, scheduleView, type Frame } from './planChainScene';
import {
  CONNECT_ITEM,
  CONNECT_TIMING,
  FEATURED_COUNT,
  FIELD_DIMENSIONS_LEAD_DAYS,
  FINISH_LEAD_DAYS,
  GLAZING_DAYS_INTO_FABRICATION,
  INPUT,
  SCOPE_LEAD_DAYS,
  buildConnectScene,
  connectFrame,
  connectLayout,
  connectStateAt,
} from './connectChainScene';
import { addWorkdays, iso, parse, prevWorkday, subWorkdays, workdaysBetween } from '../demo/screens/procurement-schedule/workCalendar';
import { buildSteelWindowsPlannedChain } from '../demo/screens/procurement-chain/chainScenario';

const measure: Measure = (text, font) => text.length * Number(/(\d+)px/.exec(font)![1]) * 0.58;
const scene = buildPlanScene(measure);
const connect = buildConnectScene(scene, measure);
const T = connect.times;
const FRAMES: Frame[] = [
  { w: 558, h: 348 },
  { w: 598, h: 373 },
  { w: 340, h: 212 },
];
const at = (f: Frame, t: number) => connectStateAt(scene, connect, f, t);
/** A canvas point (scene coords) on screen. */
const screen = (f: Frame, t: number, x: number, y: number) => {
  const { cx, cy, scale } = at(f, t).view;
  const { k, ox, oy } = scene.place;
  return { x: f.w / 2 + scale * (ox + k * x - cx), y: f.h / 2 + scale * (oy + k * y - cy) };
};

describe('Connect: one schedule, Plan\'s (Section 54.4.3)', () => {
  it('draws Plan\'s featured chain: the same steps on the same dates, Required On Site September 1, 2027', () => {
    expect(CONNECT_ITEM.requiredOnSiteDate).toBe('2027-09-01');
    expect(CONNECT_ITEM.steps.map((s) => [s.id, s.startDate, s.endDate, s.durationWorkdays])).toEqual(
      FOCAL_ITEM.steps.map((s) => [s.id, s.startDate, s.endDate, s.durationWorkdays]),
    );
    const plan = scene.focal.layout;
    const con = connect.focal.layout;
    expect(con.segments.map((s) => [s.x0, s.x1])).toEqual(plan.segments.map((s) => [s.x0, s.x1]));
    expect(con.domainStart).toBe(plan.domainStart);
  });

  it('places the chain so its bar sits exactly where Plan\'s does', () => {
    expect(connect.focal.dy + connect.focal.layout.barTop).toBe(scene.focal.dy + scene.focal.layout.barTop);
    expect(connect.focal.layout.barBottom - connect.focal.layout.barTop).toBe(scene.focal.layout.barBottom - scene.focal.layout.barTop);
  });

  it('has six dependencies, in date order: who owes each, when, and for which activity (placements approved 2026-11-11)', () => {
    const rows = CONNECT_ITEM.commitments.map((c) => [c.name, c.typeLabel, c.ownerRole, c.requiredBy, c.requiredForStepName]);
    expect(rows).toEqual([
      ['Final Scope Clarification', 'Information Required', 'GC / Glazing Subcontractor', '2026-06-29', 'Buyout'],
      ['Structural Attachment Requirements', 'Engineering Commitment', 'Structural Engineer', '2026-07-22', 'Submittal Coordination'],
      ['Final Window & Door Design', 'Design Commitment', 'Architect', '2026-08-07', 'Submittal Preparation'],
      ['Frame Finish & Color Selection', 'Owner Selection', 'Owner', '2026-10-07', 'First Submittal Review'],
      ['Final Field Dimensions', 'Information Required', 'GC / Glazing Subcontractor', '2026-11-30', 'Release for Fabrication'],
      ['Final Glazing Specification', 'Design Commitment', 'Architect', '2026-12-17', 'Fabrication'],
    ]);
    expect(FEATURED_COUNT).toBe(6);
    expect(new Set(CONNECT_ITEM.commitments.map((c) => c.requiredBy)).size).toBe(6);
  });

  it('leaves the shared scenario untouched: Connect re-places its three commitments, and changes nothing else about them', () => {
    const planned = buildSteelWindowsPlannedChain('2027-09-01');
    expect(planned.commitments).toHaveLength(3);
    for (const p of planned.commitments) {
      // The shared scenario still derives its own date: the first day of the activity it names.
      expect(p.requiredBy).toBe(planned.steps.find((st) => st.id === p.requiredForStepId)!.startDate);
      // Connect's copy differs only in where it is placed.
      const own = CONNECT_ITEM.commitments.find((c) => c.id === p.id)!;
      const placed = ['requiredBy', 'completedDate', 'requiredForStepId', 'requiredForStepName', 'description'];
      const rest = (c: object) => Object.fromEntries(Object.entries(c).filter(([key]) => !placed.includes(key)));
      expect(rest(own)).toEqual(rest(p));
      expect(own.requiredBy).not.toBe(p.requiredBy);
    }
    // And the chain itself is untouched: the same steps, dates and durations.
    expect(CONNECT_ITEM.steps).toEqual(planned.steps);
  });

  it('derives every dependency\'s date from the chain\'s own activity, by its approved rule', () => {
    const step = (id: string) => CONNECT_ITEM.steps.find((st) => st.id === id)!;
    const dep = (name: string) => CONNECT_ITEM.commitments.find((c) => c.name === name)!;
    const before = (date: string, n: number) => iso(subWorkdays(parse(date), n));
    const after = (date: string, n: number) => iso(addWorkdays(parse(date), n));
    const days = (a: string, b: string) => workdaysBetween(parse(a), parse(b));
    // Scope: three working days before Buyout finishes, so it follows Buyout.
    const scope = dep('Final Scope Clarification');
    expect(SCOPE_LEAD_DAYS).toBe(3);
    expect(scope.requiredForStepId).toBe('swd-1');
    expect(scope.requiredBy).toBe(before(step('swd-1').endDate, SCOPE_LEAD_DAYS));
    expect(scope.requiredBy > step('swd-1').startDate).toBe(true);
    // Structural: the midpoint of Submittal Coordination, as many working days before it as after.
    const structural = dep('Structural Attachment Requirements');
    expect(structural.requiredForStepId).toBe('swd-2');
    expect(days(step('swd-2').startDate, structural.requiredBy)).toBe(days(structural.requiredBy, step('swd-2').endDate));
    // Design: the day Submittal Coordination finishes, immediately before Submittal Preparation begins.
    const design = dep('Final Window & Door Design');
    expect(design.requiredForStepId).toBe('swd-3');
    expect(design.requiredBy).toBe(step('swd-2').endDate);
    expect(design.requiredBy).toBe(iso(prevWorkday(parse(step('swd-3').startDate))));
    // Finish and color: three working days before First Submittal Review finishes.
    const finish = dep('Frame Finish & Color Selection');
    expect(FINISH_LEAD_DAYS).toBe(3);
    expect(step('swd-5').name).toBe('First Submittal Review');
    expect(finish.requiredForStepId).toBe('swd-5');
    expect(finish.requiredBy).toBe(before(step('swd-5').endDate, FINISH_LEAD_DAYS));
    expect(finish.requiredBy > step('swd-5').startDate).toBe(true);
    // Field dimensions: unchanged, shortly before the Release for Fabrication milestone, and before fabrication starts.
    const field = dep('Final Field Dimensions');
    expect(step('swd-13').name).toBe('Release for Fabrication');
    expect(field.requiredForStepId).toBe('swd-13');
    expect(field.requiredBy).toBe(before(step('swd-13').startDate, FIELD_DIMENSIONS_LEAD_DAYS));
    expect(field.requiredBy < step('swd-14').startDate).toBe(true);
    // Glazing: ten working days after Fabrication begins.
    const glazing = dep('Final Glazing Specification');
    expect(GLAZING_DAYS_INTO_FABRICATION).toBe(10);
    expect(step('swd-14').name).toBe('Fabrication');
    expect(glazing.requiredForStepId).toBe('swd-14');
    expect(glazing.requiredBy).toBe(after(step('swd-14').startDate, GLAZING_DAYS_INTO_FABRICATION));
    expect(glazing.requiredBy < step('swd-14').endDate).toBe(true);
    // Every date is a working day inside the chain's span.
    for (const c of CONNECT_ITEM.commitments) {
      expect(workdaysBetween(parse(c.requiredBy), parse(c.requiredBy))).toBe(1);
      expect(c.requiredBy >= CONNECT_ITEM.startDate).toBe(true);
      expect(c.requiredBy < CONNECT_ITEM.requiredOnSiteDate).toBe(true);
    }
  });

  it('shows what, who, when and for what, and nothing of status: no agreed, provided or late dates, no issues', () => {
    expect(CONNECT_ITEM.issues).toEqual([]);
    for (const c of CONNECT_ITEM.commitments) {
      expect(c.committedFor).toBeNull();
      expect(c.varianceWorkdays).toBeNull();
      expect(c.completionVarianceWorkdays).toBeNull();
    }
    expect(connect.focal.layout.issues).toEqual([]);
    for (const card of connect.cards) {
      const text = card.text.lines.map((l) => l.text).join(' | ');
      expect(text).not.toMatch(/late|Committed|Provided|variance/i);
      expect(card.text.lines.some((l) => l.tone === 'late')).toBe(false);
      expect(text).toContain('Required by');
    }
  });
});

describe('Connect timeline', () => {
  const c = CONNECT_TIMING;

  it('runs in order: the schedule, into the chain, loose, captured, connected, all three, the schedule again', () => {
    expect(T.zoomIn).toBe(c.START_HOLD);
    expect(T.travel).toBe(c.START_HOLD + c.ZOOM_IN);
    // Loose inputs begin during the zoom and drift until the capture.
    expect(T.loose).toBeGreaterThan(T.zoomIn);
    expect(T.loose).toBeLessThan(T.travel);
    expect(T.capture).toBe(T.travel + c.CAPTURE_AFTER);
    expect(T.captured).toBeGreaterThan(T.capture);
    // The camera waits at the chain's start until everything is captured.
    expect(connect.stations[0].arrive).toBe(T.travel);
    expect(connect.stations[0].leave).toBe(T.captured + c.CAPTURED_HOLD);
    connect.moves.forEach((m, i) => {
      expect(m.start).toBe(connect.stations[i].leave);
      expect(m.end).toBe(connect.stations[i + 1].arrive);
      expect(m.end - m.start).toBeGreaterThanOrEqual(c.MOVE_MIN);
      expect(m.end - m.start).toBeLessThanOrEqual(c.MOVE_MAX);
    });
    expect(T.travelEnd).toBe(connect.stations[connect.stations.length - 1].leave);
    expect(T.allArrive).toBe(T.travelEnd + c.ALL_MOVE);
    expect(T.allLeave).toBe(T.allArrive + c.ALL_HOLD);
    expect(T.end).toBe(T.allLeave + c.ZOOM_OUT);
    // Six dependencies in well under twice the time three took (25.25 s originally).
    expect(T.end).toBeLessThanOrEqual(31500);
  });

  it('travels forward only, through the dependencies in date order', () => {
    const xs = connect.stations.map((s) => s.x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(connect.cards.map((cd) => cd.commitment!.requiredBy)).toEqual(['2026-06-29', '2026-07-22', '2026-08-07', '2026-10-07', '2026-11-30', '2026-12-17']);
    expect(xs[0]).toBe(scene.chainLeft);
    expect(connect.stations.slice(1).map((s) => s.card)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(xs.slice(1)).toEqual(connect.cards.map((cd) => cd.markX));
    // The point the camera holds moves forward, never back.
    for (const m of connect.moves) {
      let prev = -Infinity;
      for (let t = m.start; t <= m.end; t += 20) {
        const u = Math.min(1, (t - m.start) / (m.end - m.start));
        const x = m.from.x + (m.to.x - m.from.x) * (u * u * (3 - 2 * u));
        expect(x).toBeGreaterThanOrEqual(prev);
        prev = x;
      }
    }
  });

  it('reveals each dependency on arrival: its card, then its diamond, then the connector between them, then holds to read', () => {
    const f = FRAMES[0];
    const settled = c.LEADER_AT + c.LEADER;
    connect.cards.forEach((card, i) => {
      const s = connect.stations.find((st) => st.card === i)!;
      expect(card.revealAt).toBe(s.arrive);
      expect(at(f, s.arrive - 1).cards[i]).toEqual({ mark: 0, leader: 0, card: 0 });
      // The card (what, who, when, for what) leads; the connector is last.
      const early = at(f, s.arrive + c.CARD / 2).cards[i];
      expect(early.card).toBeGreaterThan(0);
      expect(early.mark).toBe(0);
      expect(early.leader).toBe(0);
      const mid = at(f, s.arrive + c.LEADER_AT + c.LEADER / 2).cards[i];
      expect(mid.card).toBe(1);
      expect(mid.mark).toBeGreaterThan(mid.leader);
      expect(at(f, s.arrive + settled).cards[i]).toEqual({ mark: 1, leader: 1, card: 1 });
      // The camera holds still for the whole read.
      expect(s.leave - (s.arrive + settled)).toBe(c.READ);
      expect(c.READ).toBeGreaterThanOrEqual(1300);
      expect(at(f, s.leave - 1).view).toEqual(at(f, s.arrive).view);
    });
  });

  it('shows one card at a time: each gives way, with its connector, as the camera leaves; its diamond stays', () => {
    const f = FRAMES[0];
    connect.cards.forEach((card, i) => {
      const s = connect.stations.find((st) => st.card === i)!;
      expect(card.hideAt).toBe(s.leave);
      expect(at(f, s.leave).cards[i]).toEqual({ mark: 1, leader: 1, card: 1 });
      const gone = at(f, s.leave + c.CARD_OUT).cards[i];
      expect(gone).toEqual({ mark: 1, leader: 0, card: 0 });
    });
    // Never two cards fully shown together.
    for (let t = 0; t <= T.end; t += 40) expect(at(f, t).cards.filter((cd) => cd.card > 0.99).length).toBeLessThanOrEqual(1);
    // In the view of them all: every diamond, no card.
    const all = at(f, (T.allArrive + T.allLeave) / 2).cards;
    expect(all.every((cd) => cd.mark === 1 && cd.card === 0 && cd.leader === 0)).toBe(true);
    expect(at(f, T.end).cards.every((cd) => cd.card === 0 && cd.mark === 0 && cd.leader === 0)).toBe(true);
  });

  it('lays each card out alone, directly above its own date, so close dependencies never stack or cross', () => {
    const L = connect.focal.layout;
    const bottoms = connect.cards.map((cd) => cd.y + cd.h);
    for (const cd of connect.cards) {
      expect(cd.tier).toBe(0);
      // Its connector is vertical, from the card's foot to the diamond on the bar.
      expect(cd.leader.x1).toBe(cd.leader.x2);
      expect(cd.leader.x2).toBe(cd.markX);
      expect(cd.markX).toBeGreaterThan(cd.x);
      expect(cd.markX).toBeLessThan(cd.x + cd.w);
      expect(cd.y + cd.h).toBeLessThan(L.barTop);
      expect(cd.y).toBeGreaterThanOrEqual(0);
    }
    // One baseline for every card's foot.
    for (const b of bottoms) expect(b).toBeCloseTo(bottoms[0]);
  });
});

describe('Connect framing', () => {
  for (const f of FRAMES) {
    describe(`${f.w}×${f.h} frame`, () => {
      it('starts and ends on Plan\'s resting application view', () => {
        const app = scheduleView(scene, connectFrame(f));
        expect(at(f, 0).view).toEqual(app);
        expect(at(f, T.end).view).toEqual(app);
        expect(at(f, 0).app).toBe(1);
        expect(at(f, T.end).app).toBe(1);
        // On desktop frames Plan rests on the same view (the list rests beside the frame).
        if (f.w >= 460) {
          const aside = { ...f, aside: { x: -f.w - 80, y: 266, w: f.w, h: 124 } };
          expect(planStateAt(scene, aside, scene.times.end).view).toEqual(app);
        }
      });

      it('shows the timescale header and grid in the chain, and the application only at the ends', () => {
        const s = at(f, T.travel + 10);
        expect(s.focalAxis).toBe(1);
        expect(s.app).toBe(0);
        expect(s.others).toBe(0);
        expect(s.header.box).toEqual({ x: 0, y: 0, w: f.w, h: HEADER.h });
      });

      if (f.w >= 460)
        it('holds each card wholly in view, beside the rail and below the header, with its diamond, through its read', () => {
          const lay = connectLayout(f, connect.inputs.length);
          connect.cards.forEach((card, i) => {
            const s = connect.stations.find((st) => st.card === i)!;
            for (let t = s.arrive + CONNECT_TIMING.CARD_AT + CONNECT_TIMING.CARD; t < s.leave; t += 200) {
              const dy = connect.focal.dy;
              const tl = screen(f, t, card.x, dy + card.y);
              const br = screen(f, t, card.x + card.w, dy + card.y + card.h);
              const mark = screen(f, t, card.markX, dy + card.markY);
              // Never under the rail, never off the frame.
              expect(tl.x).toBeGreaterThanOrEqual(lay.rail.w);
              expect(br.x).toBeLessThanOrEqual(f.w);
              expect(tl.y).toBeGreaterThanOrEqual(HEADER.h);
              expect(mark.y).toBeLessThanOrEqual(f.h);
              // The supported activity starts at the diamond, in the chart.
              expect(mark.x).toBeGreaterThan(lay.rail.w);
              expect(mark.x).toBeLessThan(f.w);
            }
          });
        });

      it('ends the chain on every connection together, clear of the rail, with each diamond large enough to read', () => {
        const lay = connectLayout(f, connect.inputs.length);
        // Beside the rail on a desktop frame; the full width above the band on a phone.
        const left = lay.mode === 'side' ? lay.rail.w : 0;
        const t = (T.allArrive + T.allLeave) / 2;
        const state = at(f, t);
        expect(state.view).toEqual(at(f, T.allArrive).view);
        const dy = connect.focal.dy;
        const xs = connect.cards.map((card) => screen(f, t, card.markX, dy + card.markY).x);
        for (const x of xs) {
          expect(x).toBeGreaterThan(left);
          expect(x).toBeLessThan(f.w);
        }
        for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
        expect(state.linked.every((v) => v === 1)).toBe(true);
        // The diamonds are enlarged as the camera eases back, never beyond a fixed limit.
        const onScreen = CHAIN.COMMIT_MARK * state.view.scale * scene.place.k * state.markScale;
        expect(state.markScale).toBeGreaterThan(1);
        expect(state.markScale).toBeLessThanOrEqual(3.5);
        expect(onScreen).toBeGreaterThanOrEqual(Math.min(9, CHAIN.COMMIT_MARK * state.view.scale * scene.place.k * 3.5) - 1e-6);
        // At the build scale they are drawn as designed.
        if (lay.mode === 'side') expect(at(f, connect.stations[1].arrive).markScale).toBe(1);
      });

      it('keeps the build scale through every connection, and eases back only for the view of all three', () => {
        const scales = connect.stations.map((s) => at(f, s.arrive + 1).view.scale);
        scales.forEach((sc) => expect(sc).toBeCloseTo(scales[0], 9));
        for (const m of connect.moves) expect(at(f, (m.start + m.end) / 2).view.scale).toBeCloseTo(scales[0], 9);
        expect(at(f, T.allArrive).view.scale).toBeLessThan(scales[0]);
        expect(at(f, T.allArrive).view.scale).toBeGreaterThan(at(f, 0).view.scale);
      });
    });
  }
});

describe('Connect: loose inputs, captured (redesigned 2026-11-11)', () => {
  const c = CONNECT_TIMING;
  const DESKTOP = FRAMES.filter((f) => f.w >= 460);

  it('shows the chain\'s six dependencies first, in date order, then illustrative inputs that carry no date, owner or connection', () => {
    expect(connect.inputs.slice(0, FEATURED_COUNT).map((i) => [i.featured, i.title])).toEqual([
      [0, 'Final Scope Clarification'],
      [1, 'Structural Attachment Requirements'],
      [2, 'Final Window & Door Design'],
      [3, 'Frame Finish & Color Selection'],
      [4, 'Final Field Dimensions'],
      [5, 'Final Glazing Specification'],
    ]);
    const plain = connect.inputs.slice(FEATURED_COUNT);
    // The dependencies outnumber the background examples.
    expect(plain.length).toBeGreaterThanOrEqual(2);
    expect(plain.length).toBeLessThan(FEATURED_COUNT);
    const featuredTitles = connect.inputs.slice(0, FEATURED_COUNT).map((i) => i.title.toLowerCase());
    for (const i of plain) {
      expect(i.featured).toBeNull();
      expect(Object.keys(i).sort()).toEqual(['appearAt', 'at', 'captureAt', 'drift', 'featured', 'id', 'slot', 'tag', 'title']);
      // No date, and nothing of Control: no status, lateness or risk.
      expect(i.title).not.toMatch(/\d|late|overdue|risk|delay|approved|pending/i);
      // None restates a scheduled activity of the chain (those are Plan's).
      expect(CONNECT_ITEM.steps.map((st) => st.name)).not.toContain(i.title);
      // None duplicates a dependency that was promoted from the background.
      for (const word of ['structural', 'field dimensions', 'scope']) expect(i.title.toLowerCase()).not.toContain(word);
      expect(featuredTitles).not.toContain(i.title.toLowerCase());
    }
    expect(new Set(connect.inputs.map((i) => i.id)).size).toBe(connect.inputs.length);
    expect(connect.inputs.map((i) => i.slot)).toEqual(connect.inputs.map((_, n) => n));
  });

  it('shows nothing before the camera moves, then brings the inputs in one at a time during the zoom', () => {
    const f = FRAMES[0];
    expect(at(f, T.zoomIn).inputs.every((i) => i.o === 0)).toBe(true);
    expect(at(f, T.loose).inputs.every((i) => i.o === 0)).toBe(true);
    const appear = connect.inputs.map((i) => i.appearAt).sort((a, b) => a - b);
    for (let n = 1; n < appear.length; n++) expect(appear[n] - appear[n - 1]).toBe(c.INPUT_STAGGER);
    expect(appear[0]).toBe(T.loose);
    expect(appear[appear.length - 1] + c.INPUT_IN).toBeLessThanOrEqual(T.capture);
    expect(at(f, T.capture).inputs.every((i) => i.o > 0)).toBe(true);
  });

  for (const f of DESKTOP) {
    describe(`${f.w}×${f.h} frame`, () => {
      const lay = connectLayout(f, connect.inputs.length);
      const box = (i: number, st: { x: number; y: number; s: number }) => {
        const featured = connect.inputs[i].featured !== null;
        return { l: st.x, t: st.y, r: st.x + INPUT.w * st.s, b: st.y + (featured ? INPUT.featuredH : INPUT.plainH) * st.s };
      };

      it('drifts each loose input only a little, slowly, within the frame and below the header', () => {
        const base = connect.inputs.map((i) => ({ x: i.at[0] * f.w, y: i.at[1] * f.h }));
        let prev = at(f, T.travel).inputs;
        for (let t = T.travel; t <= T.capture; t += 50) {
          const now = at(f, t).inputs;
          now.forEach((st, i) => {
            expect(Math.abs(st.x - base[i].x)).toBeLessThanOrEqual(16);
            expect(Math.abs(st.y - base[i].y)).toBeLessThanOrEqual(16);
            expect(st.x).toBeGreaterThanOrEqual(0);
            expect(st.y).toBeGreaterThanOrEqual(HEADER.h);
            expect(st.y + INPUT.featuredH * st.s).toBeLessThanOrEqual(f.h);
            // Slow: well under a pixel a frame.
            expect(Math.hypot(st.x - prev[i].x, st.y - prev[i].y)).toBeLessThan(1.5);
          });
          prev = now;
        }
      });

      it('keeps every loose input clear of every other', () => {
        for (let t = T.travel; t <= T.capture; t += 100) {
          const now = at(f, t).inputs;
          for (let i = 0; i < now.length; i++)
            for (let j = i + 1; j < now.length; j++) {
              const A = box(i, now[i]);
              const B = box(j, now[j]);
              expect(A.l < B.r && B.l < A.r && A.t < B.b && B.t < A.b, `${i} and ${j} at ${t}`).toBe(false);
            }
        }
      });

      it('stills the drift, then moves each input once to its own row: left-aligned, evenly pitched, inside the rail', () => {
        const done = at(f, T.captured);
        done.inputs.forEach((st, i) => {
          expect(st.row).toBe(1);
          expect(st.x).toBeCloseTo(lay.slots[i]!.x);
          expect(st.y).toBeCloseTo(lay.slots[i]!.y);
          const b = box(i, st);
          expect(b.r).toBeLessThanOrEqual(lay.rail.w);
          expect(b.b).toBeLessThanOrEqual(f.h);
        });
        // One common left edge; rows never overlap.
        expect(new Set(lay.slots.map((sl) => sl!.x)).size).toBe(1);
        for (let i = 1; i < done.inputs.length; i++) expect(box(i, done.inputs[i]).t).toBeGreaterThanOrEqual(box(i - 1, done.inputs[i - 1]).b);
        // Each travels monotonically toward its row: no overshoot, no bounce.
        connect.inputs.forEach((inp, i) => {
          let prevRow = 0;
          for (let t = inp.captureAt; t <= inp.captureAt + c.CAPTURE_MOVE; t += 25) {
            const { row } = at(f, t).inputs[i];
            expect(row).toBeGreaterThanOrEqual(prevRow);
            expect(row).toBeLessThanOrEqual(1);
            prevRow = row;
          }
        });
        // And they stay put through the connections.
        expect(at(f, T.travelEnd).inputs.map((st) => [st.x, st.y])).toEqual(done.inputs.map((st) => [st.x, st.y]));
      });

      it('shows the rail only from the capture, and clears it, with the inputs, on the return', () => {
        expect(at(f, T.capture).rail).toBe(0);
        expect(at(f, T.capture + c.RAIL_IN).rail).toBe(1);
        expect(at(f, T.allLeave).rail).toBe(1);
        const end = at(f, T.end);
        expect(end.rail).toBe(0);
        expect(end.railTitle).toBe(0);
        expect(end.inputs.every((i) => i.o === 0)).toBe(true);
        expect(end.focus.every((v) => v === 0)).toBe(true);
        expect(end.linked.every((v) => v === 0)).toBe(true);
      });
    });
  }

  it('marks one row at a time as the one being connected, and gives it the diamond once its connector has settled', () => {
    const f = FRAMES[0];
    for (let t = 0; t <= T.end; t += 60) expect(at(f, t).focus.filter((v) => v > 0.99).length).toBeLessThanOrEqual(1);
    connect.cards.forEach((card, i) => {
      const s = connect.stations.find((st) => st.card === i)!;
      expect(at(f, s.arrive).focus[i]).toBe(1);
      expect(at(f, s.arrive).linked[i]).toBe(0);
      expect(at(f, s.arrive + c.LEADER_AT + c.LEADER).linked[i]).toBe(0);
      expect(at(f, s.leave).linked[i]).toBe(1);
      expect(card.revealAt).toBe(s.arrive);
    });
  });

  it('on a phone, shows only the six dependencies, in two columns in a band beneath the chart', () => {
    const f = FRAMES[2];
    const lay = connectLayout(f, connect.inputs.length);
    expect(lay.mode).toBe('stacked');
    expect(lay.slots.map((sl) => sl !== null)).toEqual(connect.inputs.map((i) => i.featured !== null));
    expect(lay.rail.y + lay.rail.h).toBe(f.h);
    expect(new Set(lay.slots.filter(Boolean).map((sl) => sl!.x)).size).toBe(2);
    for (const sl of lay.slots) if (sl) expect(sl.y + INPUT.featuredH * lay.s).toBeLessThanOrEqual(f.h);
    expect(at(f, T.captured).inputs.slice(FEATURED_COUNT).every((i) => i.o === 0)).toBe(true);
    // The chain stays above the band while each dependency is read.
    connect.cards.forEach((card, i) => {
      const s = connect.stations.find((st) => st.card === i)!;
      const mark = screen(f, s.arrive + 1, card.markX, connect.focal.dy + card.markY);
      expect(mark.y).toBeLessThan(lay.rail.y);
    });
  });
});

describe('Connect marks', () => {
  it('puts each diamond on its required-by day, at the bar\'s top edge', () => {
    const L = connect.focal.layout;
    const DAY = 86400000;
    for (const card of connect.cards) {
      const day = Math.round((parse(card.commitment!.requiredBy).getTime() - parse(L.domainStart).getTime()) / DAY);
      expect(card.markX).toBeCloseTo(CHAIN.PAD_L + day * L.pxPerDay + L.pxPerDay / 2);
      expect(card.markY).toBe(L.barTop);
      expect(card.leader.y2).toBe(L.barTop - CHAIN.COMMIT_MARK / 2);
    }
    // Each that falls during an activity sits within that activity's bar: scope
    // in Buyout, structural and design in Submittal Coordination, finish in
    // First Submittal Review, glazing in Fabrication.
    const within: [string, string][] = [
      ['swd-x-scope', 'swd-1'],
      ['swd-x-structural', 'swd-2'],
      ['swd-c1', 'swd-2'],
      ['swd-c2', 'swd-5'],
      ['swd-c3', 'swd-14'],
    ];
    for (const [id, stepId] of within) {
      const card = connect.cards.find((cd) => cd.id === id)!;
      const seg = L.segments.find((sg) => sg.step.id === stepId)!;
      expect(card.markX).toBeGreaterThan(seg.x0);
      expect(card.markX).toBeLessThan(seg.x1);
    }
  });
});

describe('Connect dependency summary (Section 54.2.2)', () => {
  const c = CONNECT_TIMING;
  const f = FRAMES[0];

  it('stays hidden through the whole animation, until the return to the schedule is nearly complete', () => {
    expect(T.summary).toBeGreaterThan(T.travelEnd + c.ZOOM_OUT / 2);
    for (let t = 0; t <= T.summary; t += 50) expect(at(f, t).categories).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('reveals the six categories in reading order, the last exactly as the camera comes to rest', () => {
    const mid = at(f, T.summary + c.SUMMARY).categories;
    expect(mid[0]).toBe(1);
    for (let i = 1; i < mid.length; i++) expect(mid[i]).toBeLessThanOrEqual(mid[i - 1]);
    expect(mid[mid.length - 1]).toBeLessThan(1);
    expect(at(f, T.end - 1).categories[5]).toBeLessThan(1);
    expect(at(f, T.end).categories).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('only ever appears: no category fades back, and all stay once shown', () => {
    let prev = [0, 0, 0, 0, 0, 0];
    for (let t = T.summary; t <= T.end + 5000; t += 10) {
      const now = at(f, t).categories;
      now.forEach((o, i) => expect(o).toBeGreaterThanOrEqual(prev[i]));
      prev = now;
    }
    expect(prev).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('leaves the cards, camera and application exactly as they were', () => {
    // The summary is read from the same clock and changes nothing else in the state.
    const end = at(f, T.end);
    expect(end.view).toEqual(scheduleView(scene, connectFrame(f)));
    expect(end.app).toBe(1);
    expect(end.cards.every((cd) => cd.card === 0 && cd.mark === 0 && cd.leader === 0)).toBe(true);
  });
});
