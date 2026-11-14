/**
 * The Identify tab's cropped register preview: which rows it shows (Design
 * System Section 54.4.1).
 *
 * Every row is READ from the register fixture, never restated, so the
 * preview cannot disagree with the register it is cropped from. Only the
 * three Identify-stage fields are taken: item and description, trade, and
 * source (the drawing reference the item was identified from).
 */

import { ROWS } from '../demo/fixtures/productRegister';
import { PROJECT } from '../demo/fixtures/project';

export type PreviewRow = {
  id: string;
  name: string;
  description: string;
  trade: string;
  source: string;
};

/** In register order; more than the frame shows, so the bottom is cropped. */
export const PREVIEW_ROW_IDS = ['PRD-0246', 'PRD-0245', 'PRD-0244', 'PRD-0243', 'PRD-0242', 'PRD-0240'] as const;

export const PREVIEW_ROWS: readonly PreviewRow[] = PREVIEW_ROW_IDS.map((id) => {
  const row = ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`identifyRegisterPreview: no register row ${id}`);
  return { id: row.id, name: row.name, description: row.description, trade: row.trade, source: row.source };
});

export const PREVIEW_TITLE = 'Procurement Register';
export const PREVIEW_PROJECT = PROJECT.name;
export const PREVIEW_COLUMNS = ['Item / Description', 'Trade', 'Source'] as const;
