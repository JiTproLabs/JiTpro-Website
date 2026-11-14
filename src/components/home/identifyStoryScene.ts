/**
 * The Identify visual's story, as data and pure maths (Design System Section
 * 54.4.1, rewritten 2026-11-11).
 *
 * Four stages, one timeline (§46.3):
 *
 *   1. Scattered information   four project documents, as a contractor
 *                              receives them.
 *   2. Identified requirements the documents are gathered to one side and a
 *                              procurement inventory forms beside them, one
 *                              requirement at a time.
 *   3. Visible scope gaps      each requirement is marked: defined, missing
 *                              information, or unresolved scope.
 *   4. The register            the inventory gives way to the JiTpro
 *                              Procurement Register; the camera pans from its
 *                              heading down to its rows, holds, then pulls
 *                              back to the whole application and rests.
 *
 * `identifyStateAt(t)` maps milliseconds since the tab's `played` state
 * turned true to everything that moves. Nothing here knows about the DOM, so
 * the sequence is unit-tested; IdentifyRegisterPreview.tsx only applies it.
 *
 * WHAT IT MAY NOT CLAIM. This illustrates the JiTpro method. Nothing scans,
 * extracts or validates on screen, and the conditions in stage 3 are
 * representative, not findings from a real project. Dates, lateness and
 * recovery belong to Plan, Connect and Control and do not appear.
 */

import { ROWS } from '../demo/fixtures/productRegister';
import { PROJECT } from '../demo/fixtures/project';

/** The story layer's design canvas: 16:10, scaled as one unit to the frame. */
export const STORY = { w: 480, h: 300 } as const;

/* ------------------------------------------------------------------ data */

export type DocumentKind = 'architectural' | 'specifications' | 'schedule' | 'consultant';

export type StoryDocument = {
  kind: DocumentKind;
  /** Caption under the sheet while the documents are scattered. */
  label: string;
  /** Scattered: top-left on the canvas at full size, and a slight turn. */
  from: { x: number; y: number; rotate: number };
  /** Gathered: top-left on the canvas, at SHEET.gathered scale, squared up. */
  to: { x: number; y: number };
};

/** A sheet's own drawing size, and its scale once gathered. */
export const SHEET = { w: 188, h: 118, gathered: 0.5 } as const;

export const DOCUMENTS: readonly StoryDocument[] = [
  { kind: 'architectural', label: 'Architectural drawings', from: { x: 34, y: 20, rotate: -2 }, to: { x: 20, y: 22 } },
  { kind: 'specifications', label: 'Specifications', from: { x: 258, y: 20, rotate: 1.5 }, to: { x: 20, y: 88 } },
  { kind: 'schedule', label: 'Construction schedule', from: { x: 38, y: 160, rotate: 1.5 }, to: { x: 20, y: 154 } },
  { kind: 'consultant', label: 'Consultant drawings', from: { x: 256, y: 160, rotate: -1.5 }, to: { x: 20, y: 220 } },
];

/**
 * A requirement's condition (stage 3). `defined`: identified and sufficiently
 * defined. `missing-info`: identified, but information is missing.
 * `unresolved`: identified, but its scope or responsibility is not settled.
 */
export type Condition = 'defined' | 'missing-info' | 'unresolved';

export type Requirement = {
  id: string;
  name: string;
  /** The document reference it was identified from. */
  source: string;
  condition: Condition;
  /** What needs attention; only for a requirement that is not `defined`. */
  note?: string;
};

/** A register row's own drawing reference, read, never restated. */
function registerSource(rowId: string): string {
  const row = ROWS.find((r) => r.id === rowId);
  if (!row) throw new Error(`identifyStoryScene: no register row ${rowId}`);
  return row.source;
}

/**
 * Six representative requirements, in the register's order where they are
 * also register rows. Windows & Doors is first and defined: it is the item
 * Plan and Connect go on to follow. The three conditions are illustrative.
 * The two that are also in the register's first rows agree with it: the
 * windows are Approved there, the stone veneer cladding is Pending.
 */
export const REQUIREMENTS: readonly Requirement[] = [
  { id: 'windows-doors', name: 'Windows & Doors', source: registerSource('PRD-0246'), condition: 'defined' },
  { id: 'exterior-cladding', name: 'Exterior Cladding', source: registerSource('PRD-0245'), condition: 'missing-info', note: 'Incomplete specification' },
  { id: 'hvac-equipment', name: 'HVAC Equipment', source: registerSource('PRD-0244'), condition: 'defined' },
  { id: 'roofing', name: 'Roofing', source: registerSource('PRD-0240'), condition: 'defined' },
  { id: 'lighting', name: 'Lighting', source: 'E3.01', condition: 'unresolved', note: 'Unassigned scope responsibility' },
  { id: 'plumbing-fixtures', name: 'Plumbing Fixtures', source: 'Spec 22 40 00', condition: 'missing-info', note: 'Undefined product selection' },
];

export const CONDITION_LABEL: Record<Condition, string> = {
  defined: 'Defined',
  'missing-info': 'Missing information',
  unresolved: 'Unresolved scope',
};

export const INVENTORY_TITLE = 'Procurement inventory';
export const INVENTORY_PROJECT = PROJECT.name;

/** The inventory panel on the story canvas. */
export const PANEL = { x: 130, y: 16, w: 334, h: 268, header: 30, row: 34 } as const;

/* ---------------------------------------------------------------- timing */

/** Every time, ms after `played` (§46.3). */
export const IDENTIFY_TIMING = {
  /** 1. The documents rest, scattered, until here. */
  GATHER_AT: 1600,
  GATHER: 800,
  /** 2. The inventory panel, then one requirement at a time. */
  PANEL_AT: 2000,
  PANEL: 400,
  ROW_AT: 2400,
  ROW_STAGGER: 350,
  ROW: 350,
  /** A row's rise as it fades in, px on the story canvas. */
  ROW_RISE: 4,
  /** 3. The defined requirements are marked together; then each gap in turn. */
  DEFINED_AT: 4800,
  GAP_AT: 5300,
  GAP_STAGGER: 600,
  MARK: 350,
  /** 4. The register replaces the inventory, holds on its heading, then pans. */
  REGISTER_AT: 8200,
  CROSSFADE: 600,
  PAN_AT: 9500,
  PAN: 1100,
  /** The rows are held, then the camera pulls back to the whole application. */
  OUT_AT: 11300,
  OUT: 1700,
} as const;

/** The whole pass. The visual rests from here. */
export const IDENTIFY_DURATION_MS = IDENTIFY_TIMING.OUT_AT + IDENTIFY_TIMING.OUT;

/** When each requirement's row starts to appear. */
export function rowAt(index: number): number {
  return IDENTIFY_TIMING.ROW_AT + index * IDENTIFY_TIMING.ROW_STAGGER;
}

/**
 * When each requirement's mark starts to appear: the defined ones together,
 * then each requirement needing attention, one at a time, in list order.
 */
export function markAt(index: number): number {
  const T = IDENTIFY_TIMING;
  if (REQUIREMENTS[index].condition === 'defined') return T.DEFINED_AT;
  const nth = REQUIREMENTS.slice(0, index).filter((r) => r.condition !== 'defined').length;
  return T.GAP_AT + nth * T.GAP_STAGGER;
}

/* ----------------------------------------------------------------- state */

const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
/** Smoothstep: eases in and out, with no overshoot (§46.4). */
export const ease = (u: number) => {
  const x = clamp01(u);
  return x * x * (3 - 2 * x);
};

/**
 * The pull-back's easing: it starts from rest like `ease`, and spends longer
 * slowing, so the whole application settles into place (§46.4: no overshoot).
 */
export const settle = (u: number) => 1 - (1 - ease(u)) ** 2;

export type IdentifyState = {
  /** The documents: 0 scattered, 1 gathered to the side. */
  gather: number;
  /** The inventory panel's frame and heading. */
  panel: number;
  /** One per requirement: its row. */
  rows: number[];
  /** One per requirement: its condition mark, note and tint. */
  marks: number[];
  /** The key to the three conditions. */
  legend: number;
  /** The story layer (documents and inventory) as a whole. */
  story: number;
  /** The register beneath it. */
  register: number;
  /** The register's camera: 0 on its heading, 1 on its rows. */
  pan: number;
  /** The camera's pull-back: 0 on the rows, 1 on the whole application. */
  out: number;
};

export function identifyStateAt(t: number): IdentifyState {
  const T = IDENTIFY_TIMING;
  const register = ease((t - T.REGISTER_AT) / T.CROSSFADE);
  return {
    gather: ease((t - T.GATHER_AT) / T.GATHER),
    panel: ease((t - T.PANEL_AT) / T.PANEL),
    rows: REQUIREMENTS.map((_, i) => ease((t - rowAt(i)) / T.ROW)),
    marks: REQUIREMENTS.map((_, i) => ease((t - markAt(i)) / T.MARK)),
    legend: ease((t - T.DEFINED_AT) / T.MARK),
    story: 1 - register,
    register,
    pan: ease((t - T.PAN_AT) / T.PAN),
    out: settle((t - T.OUT_AT) / T.OUT),
  };
}
