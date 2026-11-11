import { describe, expect, it } from 'vitest';
import {
  CANVAS,
  MIN_SCALE,
  cameraAt,
  cameraView,
  coverScale,
  viewScale,
  type CameraView,
  type Frame,
} from './identifyRegisterCamera';

/** The preview frame at 1280×800, 1440×900 / 1920×1080, and a phone. */
const DESKTOP: Frame[] = [
  { w: 558, h: 348 },
  { w: 598, h: 373 },
];
const PHONE: Frame = { w: 340, h: 212 };
const FRAMES: Frame[] = [...DESKTOP, PHONE];

/** The part of the canvas a view shows, in canvas px. */
function shown(f: Frame, v: CameraView) {
  return { left: -v.x / v.scale, top: -v.y / v.scale, right: (f.w - v.x) / v.scale, bottom: (f.h - v.y) / v.scale };
}
function covers(f: Frame, v: CameraView) {
  const r = shown(f, v);
  return r.left >= -1e-9 && r.top >= -1e-9 && r.right <= CANVAS.w + 1e-9 && r.bottom <= CANVAS.h + 1e-9;
}

describe('Identify register camera (Design System Section 54.4.1)', () => {
  for (const f of FRAMES) {
    describe(`${f.w}×${f.h} frame`, () => {
      it('never shows anything outside the interface, at any view or between views', () => {
        const steps = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
        for (const pan of steps) expect(covers(f, cameraAt(f, pan))).toBe(true);
        for (const out of steps) expect(covers(f, cameraAt(f, 1, out))).toBe(true);
      });

      it('ends on the whole application: its full width, from its top', () => {
        const v = cameraAt(f, 1, 1);
        expect(v).toEqual(cameraView(f, 'overview'));
        expect(v.scale).toBeCloseTo(coverScale(f));
        const r = shown(f, v);
        expect(r.left).toBeCloseTo(0);
        expect(r.right).toBeCloseTo(CANVAS.w);
        expect(r.top).toBeCloseTo(0);
        /* The sidebar, the heading, the cards, the toolbar and the table's first six rows. */
        expect(r.bottom).toBeGreaterThanOrEqual(832);
      });

      it('pulls back in one direction: the scale only falls', () => {
        const scales = [0, 0.25, 0.5, 0.75, 1].map((out) => cameraAt(f, 1, out).scale);
        for (let i = 1; i < scales.length; i++) expect(scales[i]).toBeLessThan(scales[i - 1]);
      });

      it('moves by one vertical pan: the same scale and left edge, only lower', () => {
        const a = cameraView(f, 'inventory');
        const b = cameraView(f, 'items');
        expect(cameraAt(f, 0)).toEqual(a);
        expect(cameraAt(f, 1)).toEqual(b);
        expect(b.scale).toBe(a.scale);
        expect(b.x).toBe(a.x);
        expect(shown(f, b).top).toBeGreaterThan(shown(f, a).top);
        expect(cameraAt(f, 0.5).scale).toBeCloseTo(a.scale);
      });

      it('stays readable, and larger than merely covering the frame', () => {
        expect(viewScale(f)).toBeGreaterThanOrEqual(MIN_SCALE);
        expect(viewScale(f)).toBeGreaterThan(coverScale(f));
      });

      it('arrives on the register heading and its summary cards', () => {
        const r = shown(f, cameraView(f, 'inventory'));
        expect(r.top).toBeLessThanOrEqual(91); // the page title's ink
        expect(r.bottom).toBeGreaterThanOrEqual(347); // the foot of the cards
        expect(r.left).toBeLessThanOrEqual(227); // the content's left edge
      });

      it('pans to the table: its header and at least three whole rows, from Product ID', () => {
        const r = shown(f, cameraView(f, 'items'));
        expect(r.top).toBeLessThanOrEqual(406); // the header's top
        expect(r.bottom).toBeGreaterThanOrEqual(653); // the foot of the third row
        expect(r.left).toBeLessThanOrEqual(227);
        expect(r.right).toBeGreaterThanOrEqual(612); // through Trade, on any frame
      });
    });
  }

  it('shows the Status column whole in the rows view on desktop frames', () => {
    for (const f of DESKTOP) expect(shown(f, cameraView(f, 'items')).right).toBeGreaterThanOrEqual(842);
  });
});
