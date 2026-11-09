import { describe, expect, it } from 'vitest';
import { HOME_KPIS, HOME_PAGE, HOME_ROWS, RoSD_NOT_ESTABLISHED, SELECTED, STORY_ITEM, formatRegisterDate } from './homeRegisterData';
import { buildSteelWindowsChain, CHAIN_REQUIRED_ON_SITE } from '../procurement-chain/chainScenario';
import { ROWS } from '../../fixtures/productRegister';
import { SCHEDULE_ITEMS } from '../procurement-schedule/scheduleFixture';
import { FIELD_ACTIVITIES, PRODUCT_IDS } from '../home-schedule/homeScheduleData';

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
      'Structural Steel',
      'Roofing Membrane',
    ]);
    expect(HOME_KPIS.map((k) => k.label)).toEqual(['Total Products', 'Approved', 'Pending Approval', 'Long Lead Items']);
    expect(HOME_PAGE.showing).toBe('Showing 6 of 246 products');
  });

  it('keeps the fixture-read rows consistent with the full register', () => {
    for (const r of HOME_ROWS.filter((x) => x.id !== SELECTED.id && x.id !== PRODUCT_IDS.steel)) {
      const full = ROWS.find((x) => x.id === r.id)!;
      expect(r.name, r.id).toBe(full.name);
      expect(r.status, r.id).toBe(full.status);
      // The full register shows lead time as weeks of the same working days.
      expect(`${Math.round(r.fabricationWorkdays / 5)} weeks`, r.id).toBe(full.leadTime);
    }
    for (const id of ['PRD-0245', 'PRD-0244']) {
      const r = HOME_ROWS.find((x) => x.id === id)!;
      expect(r.requiredOnSite, id).toBe(ROWS.find((x) => x.id === id)!.requiredOnSite);
    }
  });

  it('takes the Step 02 products\' dates from the Step 02 activities (Section 52.1)', () => {
    for (const a of FIELD_ACTIVITIES) {
      const r = HOME_ROWS.find((x) => x.id === a.productId)!;
      expect(r, a.id).toBeDefined();
      expect(r.requiredOnSiteDate, a.id).toBe(a.requiredOnSiteDate);
      expect(r.requiredOnSite, a.id).toBe(formatRegisterDate(a.requiredOnSiteDate));
    }
    const byName = Object.fromEntries(HOME_ROWS.map((r) => [r.name, r.requiredOnSite]));
    expect(byName['Structural Steel']).toBe('Mar 08, 2027');
    expect(byName['Roofing Membrane']).toBe('Sep 29, 2027');
    expect(byName['Heritage Steel Windows and Doors']).toBe('Nov 30, 2027');
    expect(byName['Tile Package']).toBe('Feb 22, 2028');
  });

  it('formats every displayed date from its ISO date', () => {
    for (const r of HOME_ROWS) expect(r.requiredOnSite, r.id).toBe(formatRegisterDate(r.requiredOnSiteDate));
  });

  it('reads Structural Steel facts from the shared steel package', () => {
    const steel = HOME_ROWS.find((r) => r.id === PRODUCT_IDS.steel)!;
    const pkg = SCHEDULE_ITEMS.find((i) => i.id === 'itm-steel')!;
    const fab = pkg.steps.filter((s) => s.kind === 'phase' && s.family === 'production');
    expect(steel.category).toBe(pkg.category);
    expect(steel.supplier).toBe(fab[0].responsibleOrganization);
    expect(steel.fabricationWorkdays).toBe(fab.reduce((n, s) => n + s.durationWorkdays, 0));
    expect(ROWS.some((r) => r.id === PRODUCT_IDS.steel)).toBe(false);
  });

  it('shows no date in Step 01 while keeping every date in the data (Section 52.5)', () => {
    for (const r of HOME_ROWS) {
      expect(RoSD_NOT_ESTABLISHED.reveal(r), r.id).toBe(0);
      expect(r.requiredOnSiteDate, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(RoSD_NOT_ESTABLISHED.panel).toBe(0);
  });
});
