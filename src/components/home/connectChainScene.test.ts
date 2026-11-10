import { describe, expect, it } from 'vitest';
import type { Measure } from '../demo/screens/procurement-chain/chainLayout';
import { CHAIN } from '../demo/screens/procurement-chain/chainLayout';
import { FOCAL_ITEM, HEADER, buildPlanScene, planStateAt, scheduleView, type Frame } from './planChainScene';
import { CONNECT_ITEM, CONNECT_TIMING, buildConnectScene, connectFrame, connectStateAt } from './connectChainScene';

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

  it('has the three dependencies, each required on the first day of the activity it supports', () => {
    const rows = CONNECT_ITEM.commitments.map((c) => [c.name, c.typeLabel, c.ownerRole, c.requiredBy, c.requiredForStepName]);
    expect(rows).toEqual([
      ['Final Window & Door Design', 'Design Commitment', 'Architect', '2026-07-06', 'Submittal Coordination'],
      ['Frame Finish & Color Selection', 'Owner Selection', 'Owner', '2026-08-10', 'Submittal Preparation'],
      ['Final Glazing Specification', 'Design Commitment', 'Architect', '2026-10-14', 'First Revision Cycle'],
    ]);
    for (const c of CONNECT_ITEM.commitments) {
      expect(c.requiredBy).toBe(CONNECT_ITEM.steps.find((s) => s.id === c.requiredForStepId)!.startDate);
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

  it('runs in order: the schedule, into the chain, forward, the schedule again', () => {
    expect(T.zoomIn).toBe(c.START_HOLD);
    expect(T.travel).toBe(c.START_HOLD + c.ZOOM_IN);
    expect(T.end).toBe(T.travelEnd + c.ZOOM_OUT);
    connect.moves.forEach((m, i) => {
      expect(m.start).toBe(connect.stations[i].leave);
      expect(m.end).toBe(connect.stations[i + 1].arrive);
      expect(m.end - m.start).toBeGreaterThanOrEqual(c.MOVE_MIN);
      expect(m.end - m.start).toBeLessThanOrEqual(c.MOVE_MAX);
    });
  });

  it('travels forward only, through the dependencies in date order, to Required On Site', () => {
    const xs = connect.stations.map((s) => s.x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(connect.cards.map((cd) => cd.commitment!.requiredBy)).toEqual(['2026-07-06', '2026-08-10', '2026-10-14']);
    expect(xs[0]).toBe(scene.chainLeft);
    expect(xs[xs.length - 1]).toBe(scene.chainRight);
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

  it('reveals each dependency on arrival: diamond, then connector, then card, then holds to read', () => {
    const f = FRAMES[0];
    connect.cards.forEach((card, i) => {
      const s = connect.stations.find((st) => st.card === i)!;
      expect(card.revealAt).toBe(s.arrive);
      expect(at(f, s.arrive - 1).cards[i]).toEqual({ mark: 0, leader: 0, card: 0 });
      const mid = at(f, s.arrive + c.LEADER_AT + c.LEADER / 2).cards[i];
      expect(mid.mark).toBeGreaterThan(mid.leader);
      expect(mid.card).toBe(0);
      const read = at(f, s.arrive + c.CARD_AT + c.CARD).cards[i];
      expect(read).toEqual({ mark: 1, leader: 1, card: 1 });
      // The camera holds still for the whole read.
      expect(s.leave - (s.arrive + c.CARD_AT + c.CARD)).toBe(c.READ);
      expect(at(f, s.leave - 1).view).toEqual(at(f, s.arrive).view);
    });
  });

  it('keeps every revealed card while the chain is in view, and clears them on the return', () => {
    const f = FRAMES[0];
    const before = at(f, T.travelEnd - 1).cards;
    expect(before.every((cd) => cd.card === 1)).toBe(true);
    expect(at(f, T.end).cards.every((cd) => cd.card === 0 && cd.mark === 0 && cd.leader === 0)).toBe(true);
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
        it('holds each card wholly in view, below the header, with its diamond, through its read', () => {
          connect.cards.forEach((card, i) => {
            const s = connect.stations.find((st) => st.card === i)!;
            for (let t = s.arrive + CONNECT_TIMING.CARD_AT + CONNECT_TIMING.CARD; t < s.leave; t += 200) {
              const dy = connect.focal.dy;
              const tl = screen(f, t, card.x, dy + card.y);
              const br = screen(f, t, card.x + card.w, dy + card.y + card.h);
              const mark = screen(f, t, card.markX, dy + card.markY);
              expect(tl.x).toBeGreaterThanOrEqual(0);
              expect(br.x).toBeLessThanOrEqual(f.w);
              expect(tl.y).toBeGreaterThanOrEqual(HEADER.h);
              expect(mark.y).toBeLessThanOrEqual(f.h);
              // The supported activity starts at the diamond, in view.
              expect(mark.x).toBeGreaterThan(0);
              expect(mark.x).toBeLessThan(f.w * 0.6);
            }
          });
        });

      it('moves continuously: no jump in position or scale', () => {
        for (let t = 0; t < T.end; t += 5) {
          const a = at(f, t).view;
          const b = at(f, t + 5).view;
          expect(Math.abs(b.scale * (a.cx - b.cx))).toBeLessThan(4);
          expect(Math.abs(b.scale * (a.cy - b.cy))).toBeLessThan(4);
          expect(Math.abs(Math.log(b.scale / a.scale))).toBeLessThan(0.02);
        }
      });

      it('keeps the build scale while the chain is in view, easing back only on the long move', () => {
        const scales = connect.stations.map((s) => at(f, s.arrive + 1).view.scale);
        scales.forEach((sc) => expect(sc).toBeCloseTo(scales[0], 9));
        const long = connect.moves[connect.moves.length - 1];
        expect(at(f, (long.start + long.end) / 2).view.scale).toBeLessThan(scales[0] * 0.7);
        for (const m of connect.moves.slice(0, -1)) expect(at(f, (m.start + m.end) / 2).view.scale).toBeCloseTo(scales[0], 9);
      });
    });
  }
});

describe('Connect marks', () => {
  it('puts each diamond on its required-by day, at the bar\'s top edge', () => {
    const L = connect.focal.layout;
    for (const card of connect.cards) {
      const seg = L.segments.find((s) => s.step.id === card.commitment!.requiredForStepId)!;
      expect(card.markX).toBe(seg.x0 + L.pxPerDay / 2);
      expect(card.markY).toBe(L.barTop);
      expect(card.leader.y2).toBe(L.barTop - CHAIN.COMMIT_MARK / 2);
    }
  });
});
