import { describe, expect, it } from 'vitest';
import { PROJECT } from '../demo/fixtures/project';
import { PREVIEW_COLUMNS, PREVIEW_PROJECT, PREVIEW_ROWS } from './identifyRegisterPreviewData';

describe('Identify register preview (Design System Section 54.4.1)', () => {
  it('shows the approved rows, read from the register fixture, first row first', () => {
    expect(PREVIEW_ROWS.map((r) => [r.name, r.trade, r.source])).toEqual([
      ['Heritage Steel Windows', 'Glazing', 'A5.11'],
      ['Exterior Stone Veneer', 'Masonry', 'A4.20'],
      ['Custom HVAC Equipment', 'HVAC', 'M1.02'],
      ['Custom Interior Doors', 'Carpentry', 'A6.01'],
      ['Tile Package', 'Tile', 'A1.12'],
      ['Roofing Membrane', 'Roofing', 'R1.01'],
    ]);
  });

  it('shows only the three Identify-stage columns', () => {
    expect(PREVIEW_COLUMNS).toEqual(['Item / Description', 'Trade', 'Source']);
    for (const row of PREVIEW_ROWS) {
      expect(Object.keys(row).sort()).toEqual(['description', 'id', 'name', 'source', 'trade']);
    }
  });

  it('names the register’s own project', () => {
    expect(PREVIEW_PROJECT).toBe(PROJECT.name);
  });
});
