import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOME_AUDIENCES } from '../../content/homeAudiences';
import { ROW_ITEMS } from './planChainScene';
import { OWNER_NARROW_BELOW, textWidth } from './ownerScenes';
import {
  ARCH_CANVAS,
  ARCH_NARROW_BELOW,
  ARCHITECT_TABS,
  AS_OF,
  COMMITMENTS,
  COMMITMENTS_CLOSING,
  DELIVERABLES,
  DELIVERABLES_FOOTNOTE,
  OWN_LANES,
  PEAK,
  PLANNING_NOTE,
  STONE_APPROVAL,
  WEEKS,
  WEEKS_END,
  WORK_LANES,
  inWeek,
  isArchitectTab,
  monthDay,
  weekTotals,
} from './architectVisuals';

/* Design System Section 54.4.6: three static document compositions for the Architects tabs. */
describe('Architects visuals (Section 54.4.6)', () => {
  it('draws one visual for each Architects tab, on the owner visuals’ canvases and threshold', () => {
    const architects = HOME_AUDIENCES.find((a) => a.id === 'architects')!;
    expect(architects.tabs.map((t) => t.id)).toEqual([...ARCHITECT_TABS]);
    for (const t of architects.tabs) expect(isArchitectTab(t.id)).toBe(true);
    expect(isArchitectTab('gc-plan')).toBe(false);
    expect(ARCH_CANVAS).toEqual({ desktop: { w: 560, h: 350 }, phone: { w: 340, h: 212 } });
    expect(ARCH_NARROW_BELOW).toBe(OWNER_NARROW_BELOW);
    // The container query spells the threshold out (Tailwind reads class names literally): keep it equal to the constant.
    const source = readFileSync(new URL('./ArchitectVisual.tsx', import.meta.url), 'utf8');
    expect(source.match(/@min-\[(\d+)px\]/g)).toEqual([`@min-[${ARCH_NARROW_BELOW}px]`, `@min-[${ARCH_NARROW_BELOW}px]`]);
    // Static: no clock, no animation, no state.
    expect(source).not.toMatch(/useState|useEffect|requestAnimationFrame|animation|transition/);
  });

  it('draws its back sheets from packages Plan’s schedule has', () => {
    for (const re of [/Permit/, /Concrete/, /Structural Steel/, /Steel Windows/, /Lumber/, /Switchgear/, /Stone/, /Air Handling/, /Elevator/, /Cabinetry/, /Railings/, /Interior Door/, /Plumbing/, /Lighting/, /Tile/]) {
      expect(ROW_ITEMS.filter((i) => re.test(i.name)), String(re)).toHaveLength(1);
    }
  });

  it('See what’s coming: the architect’s next five deliverables, soonest first, each with why its date matters', () => {
    expect(DELIVERABLES).toHaveLength(5);
    const dates = DELIVERABLES.map((d) => d.by);
    expect([...dates].sort()).toEqual(dates);
    for (const d of DELIVERABLES) {
      expect(d.by > AS_OF).toBe(true);
      expect(d.why.length).toBeGreaterThanOrEqual(1);
      expect(d.why.length).toBeLessThanOrEqual(2);
    }
    expect(DELIVERABLES[0]).toMatchObject({ what: 'Third submittal review', by: '2026-12-02' });
    // Known requirements are planned; RFIs are not predicted.
    expect(DELIVERABLES_FOOTNOTE).toBe('Planned reviews and known design information. RFIs are answered as questions arise.');
    expect(monthDay('2026-12-02')).toBe('Dec 2');
  });

  it('Plan your workload: five weeks, one busiest week where three architect reviews overlap', () => {
    expect(WEEKS).toHaveLength(5);
    for (const w of WEEKS) expect(new Date(`${w}T00:00Z`).getUTCDay()).toBe(1);
    const totals = weekTotals();
    expect(totals.map((t) => t.all)).toEqual([3, 4, 4, 5, 4]);
    // The amber week is the one busiest week, not one of several.
    expect(totals.filter((t) => t.all === Math.max(...totals.map((x) => x.all)))).toHaveLength(1);
    expect(totals[PEAK].all).toBe(Math.max(...totals.map((t) => t.all)));
    expect(WORK_LANES[0].bars.filter((b) => inWeek(b, WEEKS[PEAK]))).toHaveLength(3);
    // The architect's own lanes come first; owner selections are the owner's decisions.
    expect(WORK_LANES.slice(0, OWN_LANES).every((l) => l.who === 'Architect')).toBe(true);
    expect(WORK_LANES[2].who).toBe('Owner decides; architect supports');
    for (const lane of WORK_LANES) for (const b of lane.bars) if (b.due === undefined) expect(b.start! < b.end!).toBe(true);
    expect(WEEKS_END > WEEKS[WEEKS.length - 1]).toBe(true);
    expect(PLANNING_NOTE.title).toBe('Planning note · week of May 10');
    expect(PLANNING_NOTE.tips).toHaveLength(5);
  });

  it('Protect your reputation: one chain of three parties, adjacent and in order, and the approved closing line', () => {
    const chain = COMMITMENTS.map((c, i) => (c.chain ? i : -1)).filter((i) => i >= 0);
    expect(chain).toEqual([2, 3, 4]);
    const rows = chain.map((i) => COMMITMENTS[i]);
    expect(rows.map((r) => r.who)).toEqual(['Owner', 'Architect', 'Stone fabricator']);
    expect(rows.map((r) => r.by)).toEqual([...rows.map((r) => r.by)].sort());
    expect(STONE_APPROVAL > rows[2].by).toBe(true);
    // The party who completes each, and who coordinates where that differs.
    expect(rows[2].via).toBe('via the GC');
    expect(COMMITMENTS_CLOSING).toBe('Clear expectations. Coordinated commitments. Fewer surprises.');
  });

  it('keeps its words plain: no em dash, no guarantee, no figure beyond durations', () => {
    const words = [
      ...DELIVERABLES.flatMap((d) => [d.what, d.pkg, ...d.why]),
      DELIVERABLES_FOOTNOTE,
      ...WORK_LANES.flatMap((l) => [l.label, l.who, ...l.bars.map((b) => b.name)]),
      PLANNING_NOTE.title,
      ...PLANNING_NOTE.tips,
      ...COMMITMENTS.flatMap((c) => [c.what, c.pkg, c.who, c.via ?? '', ...c.supports]),
      COMMITMENTS_CLOSING,
    ].join(' | ');
    expect(words).not.toContain('—');
    expect(words).not.toMatch(/guarantee|eliminat|never late|\$|%/i);
  });

  it('fits its words in their columns (measured wide, so they fit on the page with room to spare)', () => {
    // Desktop front sheets: column widths in canvas units.
    for (const d of DELIVERABLES) {
      expect(textWidth(d.what, 9.5) * 0.92, d.what).toBeLessThanOrEqual(160 - 8);
      expect(textWidth(d.pkg, 7.6), d.pkg).toBeLessThanOrEqual(160 - 8);
      for (const line of d.why) expect(textWidth(line, 8.3) * 0.92, line).toBeLessThanOrEqual(374 - 224 - 12);
    }
    for (const c of COMMITMENTS) {
      expect(textWidth(c.what, 8.8) * 0.92, c.what).toBeLessThanOrEqual(152 - 12 - 4);
      expect(textWidth(c.who, 8.4) * 0.92, c.who).toBeLessThanOrEqual(232 - 152 - 2);
      for (const line of c.supports) expect(textWidth(line, 7.8) * 0.92, line).toBeLessThanOrEqual(384 - 280 - 10);
    }
    expect(textWidth(COMMITMENTS_CLOSING, 9.4) * 0.92).toBeLessThanOrEqual(384 - 24);
    // Narrow front sheet: the deliverable and its date on one line, the reason beneath.
    for (const d of DELIVERABLES.slice(0, 3)) expect(textWidth(d.why.join(' '), 8) * 0.92, d.what).toBeLessThanOrEqual(308 - 26);
  });
});
