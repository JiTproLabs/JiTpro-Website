import { describe, expect, it } from 'vitest';
import {
  CAMERA_DURATION_MS,
  CAMERA_HOLD_UNTIL_MS,
  CANVAS,
  CHECKLIST_END_MS,
  STOPS,
  cameraKeyframes,
  cameraView,
  coverScale,
  type CameraView,
  type Frame,
} from './identifyRegisterCamera';

/** The preview frame at 1280×800, 1440×900 / 1920×1080, and a phone. */
const FRAMES: Frame[] = [
  { w: 558, h: 348 },
  { w: 598, h: 373 },
  { w: 340, h: 212 },
];
const IDS = ['overview', ...STOPS.map((s) => s.id)] as const;

/** The part of the canvas a view shows, in canvas px. */
function shown(f: Frame, v: CameraView) {
  return { left: -v.x / v.scale, top: -v.y / v.scale, right: (f.w - v.x) / v.scale, bottom: (f.h - v.y) / v.scale };
}
function covers(f: Frame, v: CameraView) {
  const r = shown(f, v);
  return r.left >= -1e-9 && r.top >= -1e-9 && r.right <= CANVAS.w + 1e-9 && r.bottom <= CANVAS.h + 1e-9;
}
function lerp(a: CameraView, b: CameraView, t: number): CameraView {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, scale: a.scale + (b.scale - a.scale) * t };
}

describe('Identify register camera (Design System Section 54.4.1)', () => {
  it('holds the overview until the checklist has finished', () => {
    expect(CAMERA_HOLD_UNTIL_MS).toBeGreaterThan(CHECKLIST_END_MS);
    expect(STOPS[0]).toEqual({ id: 'overview', at: CAMERA_HOLD_UNTIL_MS });
  });

  it('visits the stops in the approved order, once, and ends at rest', () => {
    expect(STOPS.map((s) => s.id)).toEqual(['overview', 'items', 'trades', 'dates', 'source', 'rest']);
    const times = STOPS.map((s) => s.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
    const frames = cameraKeyframes(FRAMES[0]);
    expect(frames[0].offset).toBe(0);
    expect(frames[frames.length - 1].offset).toBe(1);
    expect(CAMERA_DURATION_MS).toBe(STOPS[STOPS.length - 1].at);
  });

  for (const f of FRAMES) {
    describe(`${f.w}×${f.h} frame`, () => {
      it('never shows anything outside the interface, at a stop or between stops', () => {
        for (let i = 0; i < IDS.length; i++) {
          const v = cameraView(f, IDS[i]);
          expect(covers(f, v)).toBe(true);
          if (i > 0) {
            const prev = cameraView(f, IDS[i - 1]);
            for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) expect(covers(f, lerp(prev, v, t))).toBe(true);
          }
        }
      });

      it('opens on the full width of the interface, from its top', () => {
        const r = shown(f, cameraView(f, 'overview'));
        expect(r.left).toBeCloseTo(0);
        expect(r.right).toBeCloseTo(CANVAS.w);
        expect(r.top).toBeCloseTo(0);
        expect(cameraView(f, 'overview').scale).toBeCloseTo(coverScale(f));
      });

      it('tours at a readable scale and pans left to right', () => {
        const tour = (['items', 'trades', 'dates', 'source'] as const).map((id) => cameraView(f, id));
        for (const v of tour) expect(v.scale).toBeGreaterThanOrEqual(0.85);
        const lefts = tour.map((v) => shown(f, v).left);
        expect(lefts).toEqual([...lefts].sort((a, b) => a - b));
        /* The items view starts at the table; the source view reaches the canvas's right edge. */
        expect(shown(f, tour[0]).left).toBeLessThanOrEqual(227);
        expect(shown(f, tour[3]).right).toBeCloseTo(CANVAS.w);
      });

      it('rests readable, on the register heading and the top of the table', () => {
        const v = cameraView(f, 'rest');
        expect(v.scale).toBeGreaterThanOrEqual(0.75);
        const r = shown(f, v);
        expect(r.top).toBeLessThanOrEqual(91); // the page title's ink
      });
    });
  }
});
