import { describe, expect, it } from 'vitest';
import { ROWS } from '../demo/fixtures/productRegister';
import { PROJECT } from '../demo/fixtures/project';
import {
  DOCUMENTS,
  IDENTIFY_DURATION_MS,
  IDENTIFY_TIMING as T,
  INVENTORY_PROJECT,
  PANEL,
  REQUIREMENTS,
  SHEET,
  STORY,
  identifyStateAt,
  markAt,
  rowAt,
  settle,
} from './identifyStoryScene';

const END = IDENTIFY_DURATION_MS;
const samples = (step = 50) => Array.from({ length: Math.floor(END / step) + 1 }, (_, i) => i * step);

describe('Identify story: content (Design System Section 54.4.1)', () => {
  it('shows four kinds of project document', () => {
    expect(DOCUMENTS.map((d) => d.kind)).toEqual(['architectural', 'specifications', 'schedule', 'consultant']);
  });

  it('keeps every document on the canvas, scattered and gathered, and the gathered ones clear of the inventory', () => {
    for (const d of DOCUMENTS) {
      expect(d.from.x).toBeGreaterThanOrEqual(0);
      expect(d.from.x + SHEET.w).toBeLessThanOrEqual(STORY.w);
      expect(d.from.y).toBeGreaterThanOrEqual(0);
      expect(d.from.y + SHEET.h + 14).toBeLessThanOrEqual(STORY.h); // with its caption
      expect(d.to.x + SHEET.w * SHEET.gathered).toBeLessThan(PANEL.x);
      expect(d.to.y + SHEET.h * SHEET.gathered).toBeLessThanOrEqual(STORY.h);
    }
    const tops = DOCUMENTS.map((d) => d.to.y);
    for (let i = 1; i < tops.length; i++) expect(tops[i] - tops[i - 1]).toBeGreaterThanOrEqual(SHEET.h * SHEET.gathered);
  });

  it('fits the inventory, its six rows and its key on the canvas', () => {
    expect(REQUIREMENTS).toHaveLength(6);
    expect(PANEL.header + REQUIREMENTS.length * PANEL.row).toBeLessThan(PANEL.h);
    expect(PANEL.x + PANEL.w).toBeLessThanOrEqual(STORY.w);
    expect(PANEL.y + PANEL.h).toBeLessThanOrEqual(STORY.h);
  });

  it('leads with Windows & Doors, defined: the item Plan and Connect follow', () => {
    expect(REQUIREMENTS[0]).toMatchObject({ name: 'Windows & Doors', condition: 'defined' });
  });

  it('distinguishes defined, missing information and unresolved scope, with a note on each gap only', () => {
    expect(new Set(REQUIREMENTS.map((r) => r.condition))).toEqual(new Set(['defined', 'missing-info', 'unresolved']));
    for (const r of REQUIREMENTS) {
      if (r.condition === 'defined') expect(r.note, r.name).toBeUndefined();
      else expect(r.note?.length, r.name).toBeGreaterThan(0);
    }
    expect(REQUIREMENTS.filter((r) => r.condition !== 'defined')).toHaveLength(3);
  });

  it('reads the project and the shared drawing references from the register fixtures', () => {
    expect(INVENTORY_PROJECT).toBe(PROJECT.name);
    const source = (id: string) => ROWS.find((r) => r.id === id)!.source;
    expect(REQUIREMENTS.find((r) => r.id === 'windows-doors')!.source).toBe(source('PRD-0246'));
    expect(REQUIREMENTS.find((r) => r.id === 'exterior-cladding')!.source).toBe(source('PRD-0245'));
  });

  it('agrees with the register where they overlap: windows approved, cladding still pending', () => {
    expect(ROWS.find((r) => r.id === 'PRD-0246')!.status).toBe('approved');
    expect(ROWS.find((r) => r.id === 'PRD-0245')!.status).toBe('pending');
  });

  it('keeps Plan, Connect and Control out of it: no dates, lateness or recovery, and no automation claim', () => {
    const words = REQUIREMENTS.flatMap((r) => [r.name, r.note ?? '']).join(' ');
    expect(words).not.toMatch(/late|overdue|delay|behind|recover|risk|scan|extract|ai\b|automat|validat|verified/i);
  });
});

describe('Identify story: sequence (Design System Section 54.4.1)', () => {
  it('opens on the scattered documents alone', () => {
    const s = identifyStateAt(0);
    expect(s).toMatchObject({ gather: 0, panel: 0, legend: 0, story: 1, register: 0, pan: 0, out: 0 });
    expect(s.rows.every((o) => o === 0)).toBe(true);
    expect(s.marks.every((o) => o === 0)).toBe(true);
  });

  it('holds the documents before anything moves', () => {
    expect(T.GATHER_AT).toBeGreaterThanOrEqual(1500);
    expect(identifyStateAt(T.GATHER_AT).gather).toBe(0);
  });

  it('runs the four stages in order, each finished before the next begins', () => {
    const lastRowDone = rowAt(REQUIREMENTS.length - 1) + T.ROW;
    const lastMarkDone = Math.max(...REQUIREMENTS.map((_, i) => markAt(i))) + T.MARK;
    expect(T.GATHER_AT + T.GATHER).toBeLessThanOrEqual(rowAt(0));
    expect(T.PANEL_AT + T.PANEL).toBeLessThanOrEqual(rowAt(0));
    expect(lastRowDone).toBeLessThanOrEqual(T.DEFINED_AT);
    expect(lastMarkDone).toBeLessThan(T.REGISTER_AT);
    expect(T.REGISTER_AT + T.CROSSFADE).toBeLessThan(T.PAN_AT);
    expect(T.PAN_AT + T.PAN).toBeLessThan(T.OUT_AT);
    expect(END).toBe(T.OUT_AT + T.OUT);
  });

  it('adds requirements one at a time, in list order', () => {
    for (const t of samples()) {
      const { rows } = identifyStateAt(t);
      for (let i = 1; i < rows.length; i++) expect(rows[i]).toBeLessThanOrEqual(rows[i - 1]);
    }
    expect(T.ROW_STAGGER).toBeGreaterThanOrEqual(T.ROW);
  });

  it('marks nothing until every requirement is listed, then the defined ones, then each gap in turn', () => {
    const before = identifyStateAt(T.DEFINED_AT);
    expect(before.rows.every((o) => o === 1)).toBe(true);
    expect(before.marks.every((o) => o === 0)).toBe(true);
    const gaps = REQUIREMENTS.map((r, i) => ({ r, at: markAt(i) })).filter((x) => x.r.condition !== 'defined');
    for (const { r, at } of gaps) expect(at, r.name).toBeGreaterThanOrEqual(T.DEFINED_AT + T.MARK);
    for (let i = 1; i < gaps.length; i++) expect(gaps[i].at - gaps[i - 1].at).toBeGreaterThanOrEqual(T.MARK);
  });

  it('leaves the last gap readable for at least a second before the register replaces it', () => {
    const lastMarkDone = Math.max(...REQUIREMENTS.map((_, i) => markAt(i))) + T.MARK;
    expect(T.REGISTER_AT - lastMarkDone).toBeGreaterThanOrEqual(1000);
  });

  it('cross-fades the story and the register, so the frame is never empty', () => {
    for (const t of samples(25)) {
      const s = identifyStateAt(t);
      expect(s.story + s.register).toBeCloseTo(1);
    }
  });

  it('holds the register on its heading before the single pan', () => {
    expect(T.PAN_AT - (T.REGISTER_AT + T.CROSSFADE)).toBeGreaterThanOrEqual(700);
    expect(identifyStateAt(T.PAN_AT).pan).toBe(0);
  });

  it('holds the rows close up, then pulls back once to the whole application', () => {
    expect(T.OUT_AT - (T.PAN_AT + T.PAN)).toBeGreaterThanOrEqual(600);
    expect(identifyStateAt(T.OUT_AT)).toMatchObject({ pan: 1, out: 0 });
    expect(identifyStateAt(END).out).toBe(1);
  });

  it('pulls back from rest and decelerates into place, without overshoot', () => {
    expect(settle(0)).toBe(0);
    expect(settle(1)).toBe(1);
    const steps = Array.from({ length: 21 }, (_, i) => settle(i / 20));
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1]);
    for (const v of steps) expect(v).toBeLessThanOrEqual(1);
    /* Slow to start, and slower still to finish than to start. */
    expect(steps[1]).toBeLessThan(0.05);
    expect(1 - steps[19]).toBeLessThan(steps[1]);
    /* Most of the distance is covered before the midpoint: the rest is the settle. */
    expect(settle(0.5)).toBeGreaterThan(0.7);
  });

  it('only ever moves forward, and rests on the whole register application', () => {
    let prev = identifyStateAt(0);
    for (const t of samples()) {
      const s = identifyStateAt(t);
      for (const k of ['gather', 'panel', 'legend', 'register', 'pan', 'out'] as const) expect(s[k]).toBeGreaterThanOrEqual(prev[k]);
      s.rows.forEach((o, i) => expect(o).toBeGreaterThanOrEqual(prev.rows[i]));
      s.marks.forEach((o, i) => expect(o).toBeGreaterThanOrEqual(prev.marks[i]));
      prev = s;
    }
    expect(identifyStateAt(END)).toMatchObject({ story: 0, register: 1, pan: 1, out: 1 });
    expect(identifyStateAt(END + 60000)).toEqual(identifyStateAt(END));
  });

  it('keeps the pass to 13 s: the four stages, then the pull-back', () => {
    expect(END).toBeLessThanOrEqual(13000);
  });
});
