import { describe, expect, it } from 'vitest';
import { HOME_KPIS, HOME_PAGE, HOME_ROWS, SELECTED, STORY_ITEM, formatRegisterDate } from './homeRegisterData';
import { buildSteelWindowsChain, CHAIN_REQUIRED_ON_SITE } from '../procurement-chain/chainScenario';
import { ROWS } from '../../fixtures/productRegister';

describe('homepage Product Register (Section 52)', () => {
  it('derives the selected item from the Procurement Chain scenario', () => {
    const chain = buildSteelWindowsChain();
    const fab = chain.steps.find((s) => s.family === 'production')!;
    expect(STORY_ITEM.requiredOnSiteDate).toBe(CHAIN_REQUIRED_ON_SITE);
    expect(SELECTED.requiredOnSite).toBe(formatRegisterDate(chain.requiredOnSiteDate));
    expect(SELECTED.requiredOnSite).toBe('Nov 30, 2027');
    expect(SELECTED.fabricationWorkdays).toBe(fab.durationWorkdays);
    expect(SELECTED.fabricationWorkdays).toBe(180);
    expect(SELECTED.supplier).toBe(fab.responsibleOrganization);
    expect(SELECTED.supplier).toBe('Heritage Steel Window & Door');
    expect(SELECTED.category).toBe(chain.category);
  });

  it('presents the approved selected product', () => {
    expect(SELECTED.name).toBe('Heritage Steel Windows and Doors');
    expect(SELECTED.status).toBe('pending');
    expect(HOME_PAGE.title).toBe('Product Register');
    expect(HOME_PAGE.project).toBe('Oak Ridge Residence');
  });

  it('never shows the older schedule package date or lead time for the story item', () => {
    const old = ROWS.find((r) => r.id === 'PRD-0246')!;
    expect(SELECTED.requiredOnSite).not.toBe(old.requiredOnSite);
    expect(JSON.stringify(SELECTED)).not.toMatch(/Jun 07, 2027|14 weeks/);
  });

  it('is a curated sample: six products, four cards, one selected', () => {
    expect(HOME_ROWS).toHaveLength(6);
    expect(HOME_ROWS.filter((r) => r.selected)).toEqual([SELECTED]);
    expect(HOME_ROWS.map((r) => r.name)).toEqual([
      'Heritage Steel Windows and Doors',
      'Exterior Stone Veneer',
      'Custom HVAC Equipment',
      'Tile Package',
      'Passenger Elevator',
      'Roofing Membrane',
    ]);
    expect(HOME_KPIS.map((k) => k.label)).toEqual(['Total Products', 'Approved', 'Pending Approval', 'Long Lead Items']);
    expect(HOME_PAGE.showing).toBe('Showing 6 of 246 products');
  });

  it('keeps the other rows consistent with the full register', () => {
    for (const r of HOME_ROWS.slice(1)) {
      const full = ROWS.find((x) => x.id === r.id)!;
      expect(r.requiredOnSite, r.id).toBe(full.requiredOnSite);
      expect(r.status, r.id).toBe(full.status);
      // The full register shows lead time as weeks of the same working days.
      expect(`${Math.round(r.fabricationWorkdays / 5)} weeks`, r.id).toBe(full.leadTime);
    }
  });
});
