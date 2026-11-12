import { describe, expect, it } from 'vitest';
import { HOME_AUDIENCES } from '../../content/homeAudiences';
import { CONNECT_ITEM } from './connectChainScene';
import { partyOf } from './controlChainScene';
import { FOCAL_ITEM, ROW_ITEMS } from './planChainScene';
import {
  FIELD,
  OWNER_CANVAS,
  OWNER_DECISIONS,
  OWNER_ON_SITE,
  OWNER_STAGES,
  OWNER_TABS,
  OWNER_TAKEAWAY,
  REQUEST_PILE,
  RISK,
  buildOwnerScene,
  chainGeometry,
  isOwnerTab,
  lookaheadWindow,
  ownerStateAt,
  requestGeometry,
  stagePosition,
  type OwnerMode,
} from './ownerScenes';

const MODES: OwnerMode[] = ['desktop', 'phone'];
const cueAt = (tab: (typeof OWNER_TABS)[number], k: string) => buildOwnerScene(tab, 'desktop').cues.find((c) => c.k === k)!;

describe('Project Owners visuals: one sample project (Section 54.4.5)', () => {
  it('covers exactly the four owner tabs of the homepage copy', () => {
    const owners = HOME_AUDIENCES.find((a) => a.id === 'owners')!;
    expect(owners.tabs.map((t) => t.id)).toEqual([...OWNER_TABS]);
    for (const t of owners.tabs) expect(isOwnerTab(t.id)).toBe(true);
    expect(isOwnerTab('gc-control')).toBe(false);
    expect(Object.keys(OWNER_TAKEAWAY).sort()).toEqual([...OWNER_TABS].sort());
  });

  it('reads the featured chain as five stages in order, on its own dates', () => {
    expect(OWNER_STAGES.map((s) => s.id)).toEqual(['buyout', 'coordination', 'preparation', 'review', 'fabrication']);
    expect(OWNER_STAGES[0].start).toBe(FOCAL_ITEM.startDate);
    expect(OWNER_ON_SITE).toBe(FOCAL_ITEM.requiredOnSiteDate);
    for (let i = 1; i < OWNER_STAGES.length; i++) expect(OWNER_STAGES[i].start > OWNER_STAGES[i - 1].end).toBe(true);
    // Every activity of the chain belongs to one stage.
    for (const s of FOCAL_ITEM.steps.filter((x) => x.kind === 'phase')) expect(OWNER_STAGES.some((g) => g.start <= s.startDate && s.endDate <= g.end)).toBe(true);
    expect(OWNER_STAGES[OWNER_STAGES.length - 1].end <= OWNER_ON_SITE).toBe(true);
  });

  it('places a date along the stages in proportion, and in order', () => {
    expect(stagePosition(OWNER_STAGES[0].start)).toBe(0);
    expect(stagePosition(OWNER_STAGES[2].start)).toBe(2);
    expect(stagePosition(OWNER_ON_SITE)).toBe(5);
    const dates = ['2026-06-04', '2026-08-07', '2026-10-07', '2026-11-30', '2027-03-01', '2027-09-01'];
    const at = dates.map(stagePosition);
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });

  it('takes Reduce risk and Protect your investment from Connect\'s own dependencies', () => {
    for (const [mine, id] of [
      [RISK, 'swd-c1'],
      [FIELD, 'swd-x-field'],
    ] as const) {
      const c = CONNECT_ITEM.commitments.find((x) => x.id === id)!;
      expect([mine.name, mine.owner, mine.requiredBy, mine.protects]).toEqual([c.name, c.ownerRole, c.requiredBy, c.requiredForStepName]);
      expect(mine.at).toBe(stagePosition(c.requiredBy));
    }
    expect(RISK.name).toBe('Final Window & Door Design');
    // The design requirement falls before shop drawings begin; the field dimensions before fabrication.
    expect(RISK.requiredBy < OWNER_STAGES[2].start).toBe(true);
    expect(FIELD.name).toBe('Final Field Dimensions');
    expect(FIELD.requiredBy < OWNER_STAGES[4].start).toBe(true);
    expect(FIELD.at).toBeGreaterThan(3);
    expect(FIELD.at).toBeLessThan(4);
  });

  it('states consequences as possibilities, never as amounts or promises', () => {
    expect(FIELD.consequences).toHaveLength(5);
    const words = [...FIELD.consequences, FIELD.problem, RISK.condition, ...Object.values(OWNER_TAKEAWAY)].join(' | ');
    expect(words).not.toMatch(/\d|\$|%|guarantee|always|never|eliminate|save[sd]?\b/i);
    expect(FIELD.consequences.some((c) => /^Possible /.test(c))).toBe(true);
  });

  it('finds the owner\'s decisions in the schedule itself: every owner activity, and Connect\'s owner dependency', () => {
    const steps = ROW_ITEMS.flatMap((item) => item.steps.filter((s) => s.kind === 'phase' && partyOf(s.responsibleOrganizationId) === 'owner').map((s) => ({ item, s })));
    const deps = CONNECT_ITEM.commitments.filter((c) => (c.ownerRole as string) === 'Owner');
    expect(OWNER_DECISIONS).toHaveLength(steps.length + deps.length);
    expect(OWNER_DECISIONS.length).toBeGreaterThanOrEqual(3);
    for (const { item, s } of steps) {
      const d = OWNER_DECISIONS.find((x) => x.id === item.id)!;
      expect([d.prepareFrom, d.requiredBy, d.onSite, d.chainStart]).toEqual([s.startDate, s.endDate, item.requiredOnSiteDate, item.startDate]);
      const after = item.steps.slice(item.steps.indexOf(s) + 1).find((q) => q.kind === 'phase')!;
      expect(d.neededFor).toBe(after.name);
    }
    for (const c of deps) {
      const d = OWNER_DECISIONS.find((x) => x.id === c.id)!;
      expect([d.requiredBy, d.neededFor, d.onSite]).toEqual([c.requiredBy, c.requiredForStepName, FOCAL_ITEM.requiredOnSiteDate]);
    }
    // In date order, each on its own date: they are not all due at once.
    const dates = OWNER_DECISIONS.map((d) => d.requiredBy);
    expect(dates).toEqual([...dates].sort());
    expect(new Set(dates).size).toBe(dates.length);
    for (const d of OWNER_DECISIONS) {
      expect(d.title && d.request && d.item).toBeTruthy();
      expect(d.prepareFrom <= d.requiredBy).toBe(true);
      expect(d.requiredBy < d.onSite).toBe(true);
      expect(d.chainStart <= d.prepareFrom).toBe(true);
    }
  });

  it('piles the requests up out of date order, every one once', () => {
    expect([...REQUEST_PILE].sort()).toEqual(OWNER_DECISIONS.map((_, i) => i));
    expect(REQUEST_PILE).not.toEqual(OWNER_DECISIONS.map((_, i) => i));
  });

  it('frames the look-ahead in whole months around every decision and on-site date', () => {
    const w = lookaheadWindow();
    for (const d of OWNER_DECISIONS) {
      expect(Date.parse(d.prepareFrom)).toBeGreaterThanOrEqual(w.start);
      expect(Date.parse(d.onSite)).toBeLessThan(w.end);
    }
    expect(w.months[0].first).toBe(true);
    expect(w.months.filter((m) => m.first).map((m) => m.year)).toEqual([2026, 2027]);
    expect(w.months.length).toBeGreaterThanOrEqual(12);
  });
});

describe('Project Owners visuals: one clock each', () => {
  for (const tab of OWNER_TABS)
    for (const mode of MODES)
      describe(`${tab}, ${mode}`, () => {
        const scene = buildOwnerScene(tab, mode);
        const at = (t: number) => ownerStateAt(scene, t);

        it('has one cue per element, all inside its length, which is concise', () => {
          const keys = scene.cues.map((c) => c.k);
          expect(new Set(keys).size).toBe(keys.length);
          for (const c of scene.cues) {
            expect(c.at).toBeGreaterThanOrEqual(0);
            expect(c.at + (c.dur ?? 350)).toBeLessThanOrEqual(scene.end);
            if (c.out !== undefined) expect(c.out).toBeGreaterThan(c.at);
            if (c.move) expect(c.move.at + c.move.dur).toBeLessThanOrEqual(scene.end);
          }
          expect(scene.end).toBeGreaterThanOrEqual(10000);
          expect(scene.end).toBeLessThanOrEqual(15000);
        });

        it('opens empty, ends on its takeaway, and rests', () => {
          for (const s of Object.values(at(0))) expect(s.o).toBe(0);
          const end = at(scene.end);
          expect(end.takeaway).toEqual({ o: 1, ty: 0, draw: 1, mx: 0, my: 0 });
          // The takeaway is the last thing to appear, and is given time to be read.
          const takeaway = scene.cues.find((c) => c.k === 'takeaway')!;
          expect(Math.max(...scene.cues.map((c) => c.at))).toBe(takeaway.at);
          expect(scene.end - takeaway.at).toBeGreaterThanOrEqual(1300);
          expect(at(scene.end + 5000)).toEqual(end);
          // Everything has settled: shown or gone, drawn in full, in place.
          for (const c of scene.cues) {
            const s = end[c.k];
            expect(s.o).toBeCloseTo(c.out === undefined ? 1 : (c.outTo ?? 0));
            expect(s.ty).toBe(0);
            expect(s.draw).toBe(1);
          }
        });

        it('never eases past its targets, and nothing reappears once gone', () => {
          const gone = new Set<string>();
          for (let t = 0; t <= scene.end; t += 50) {
            const state = at(t);
            for (const c of scene.cues) {
              const s = state[c.k];
              expect(s.o).toBeGreaterThanOrEqual(0);
              expect(s.o).toBeLessThanOrEqual(1);
              expect(s.draw).toBeGreaterThanOrEqual(0);
              expect(s.draw).toBeLessThanOrEqual(1);
              if (gone.has(c.k)) expect(s.o).toBe(0);
              if (c.out !== undefined && c.outTo === undefined && t > c.out + (c.outDur ?? 350)) gone.add(c.k);
            }
          }
        });
      });

  it('Reduce risk: the field date, backward through the chain, the open requirement, its reach, its assignment, its resolution', () => {
    const k = (key: string) => cueAt('owner-reduce-risk', key);
    const stages = [...OWNER_STAGES].reverse().map((s) => k(`stage-${s.id}`).at);
    expect(k('ros').at).toBeLessThan(stages[0]);
    // Backward: fabrication first, buyout last.
    expect(stages).toEqual([...stages].sort((a, b) => a - b));
    const order = [stages[stages.length - 1], k('depOpen').at, k('card').at, k('risk').at, k('assign').at, k('depDone').at, k('takeaway').at];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    // The schedule only appears on track until the open requirement is found.
    expect(k('onTrack').out).toBe(k('depOpen').at);
    // The possible consequence is withdrawn as the requirement is resolved: it is not shown as inevitable.
    for (const key of ['risk', 'riskHalo', 'riskText', 'depOpen']) expect(k(key).out).toBeLessThanOrEqual(k('depDone').at);
    const end = ownerStateAt(buildOwnerScene('owner-reduce-risk', 'desktop'), 1e9);
    expect([end.risk.o, end.riskHalo.o, end.depOpen.o, end.kUnresolved.o, end.kAssigned.o]).toEqual([0, 0, 0, 0, 0]);
    expect([end.depDone.o, end.kResolved.o, end.assign.o, end.card.o]).toEqual([1, 1, 1, 1]);
  });

  it('Protect your investment: the plan, a late discovery and what can follow, then the same chain with it verified early', () => {
    const k = (key: string) => cueAt('owner-protect-investment', key);
    const costs = FIELD.consequences.map((_, i) => k(`cost-${i}`));
    const order = [k('ros').at, k('lateMark').at, costs[0].at, costs[costs.length - 1].at, k('slip').at, k('fieldMark').at, k('proceed').at, k('takeaway').at];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    // The late scenario is wholly gone before the planned one begins.
    const lateOut = Math.max(...['kLate', 'lateMark', 'lateCard', 'slip'].map((key) => k(key).out!), ...costs.map((c) => c.out!));
    expect(lateOut + 350).toBeLessThanOrEqual(k('kPlanned').at);
    const end = ownerStateAt(buildOwnerScene('owner-protect-investment', 'desktop'), 1e9);
    expect([end.lateCard.o, end.slip.o, end['cost-0'].o, end.kLate.o]).toEqual([0, 0, 0, 0]);
    expect([end.fieldCard.o, end.fieldMark.o, end.proceed.o, end.ros.o]).toEqual([1, 1, 1, 1]);
  });

  it('More predictability: field dates, then their procurement, then each owner decision on its own date, then the advance notice', () => {
    const k = (key: string) => cueAt('owner-predictability', key);
    const n = OWNER_DECISIONS.length;
    for (let i = 0; i < n; i++) {
      const order = [k(`site-${i}`).at, k(`chain-${i}`).at, k(`window-${i}`).at, k(`decide-${i}`).at, k(`notice-${i}`).at];
      expect(order).toEqual([...order].sort((a, b) => a - b));
      // The decisions are revealed one after another, not together.
      if (i > 0) expect(k(`decide-${i}`).at - k(`decide-${i - 1}`).at).toBeGreaterThanOrEqual(400);
    }
    expect(k(`site-${n - 1}`).at).toBeLessThan(k('chain-0').at);
    expect(k(`chain-${n - 1}`).at).toBeLessThan(k('window-0').at);
    expect(k('legend').at).toBeGreaterThan(k(`decide-${n - 1}`).at);
  });

  it('Better decisions: requests pile up marked alike, the question, then date order with dates in place of the marks, then why', () => {
    const k = (key: string) => cueAt('owner-better-decisions', key);
    const n = OWNER_DECISIONS.length;
    const lastRequest = Math.max(...OWNER_DECISIONS.map((_, i) => k(`req-${i}`).at));
    expect(k('question').at).toBeGreaterThan(lastRequest + 350);
    for (let i = 0; i < n; i++) {
      const move = k(`req-${i}`).move!;
      expect(move.at).toBeGreaterThan(k('question').out!);
      // The mark gives way to the date: never both.
      expect(k(`asap-${i}`).out! + 300).toBeLessThanOrEqual(k(`due-${i}`).at);
      expect(k(`due-${i}`).at).toBeGreaterThanOrEqual(move.at + move.dur - 100);
    }
    expect(k('first').at).toBeGreaterThan(k(`due-${n - 1}`).at);
    expect(k('why').at).toBeGreaterThan(k('first').at);
    const end = ownerStateAt(buildOwnerScene('owner-better-decisions', 'desktop'), 1e9);
    for (let i = 0; i < n; i++) expect([end[`asap-${i}`].o, end[`due-${i}`].o, end[`req-${i}`].o]).toEqual([0, 1, 1]);
    expect(end.question.o).toBe(0);
  });
});

describe('Project Owners visuals: composed for the frame', () => {
  for (const mode of MODES) {
    const { w, h } = OWNER_CANVAS[mode];

    it(`${mode}: the chain and its on-site mark fit the canvas, with room above for a card and below for the takeaway`, () => {
      const g = chainGeometry(mode);
      expect(g.x).toBeGreaterThanOrEqual(8);
      expect(g.rosX + 16).toBeLessThanOrEqual(w);
      expect(g.x + OWNER_STAGES.length * g.pitch).toBeLessThan(g.rosX);
      expect(g.y).toBeGreaterThanOrEqual(mode === 'desktop' ? 130 : 96);
      expect(g.y + g.h).toBeLessThan(h * 0.62);
      // A position lands inside its own stage.
      expect(g.at(0)).toBe(g.x);
      expect(g.at(2)).toBe(g.x + 2 * g.pitch);
      expect(g.at(2.5)).toBe(g.x + 2 * g.pitch + g.w / 2);
      expect(g.at(5)).toBe(g.x + 4 * g.pitch + g.w);
      expect(g.w).toBeGreaterThanOrEqual(mode === 'desktop' ? 88 : 52);
    });

    it(`${mode}: the requests land in date order, in separate rows, inside the canvas`, () => {
      const g = requestGeometry(mode);
      const scene = buildOwnerScene('owner-better-decisions', mode);
      const end = ownerStateAt(scene, scene.end);
      const landed = OWNER_DECISIONS.map((_, i) => {
        const from = g.pile[REQUEST_PILE.indexOf(i)];
        return { x: from.x + end[`req-${i}`].mx, y: from.y + end[`req-${i}`].my };
      });
      landed.forEach((p, i) => {
        expect(p.x).toBeCloseTo(g.rowX);
        expect(p.y).toBeCloseTo(g.rowY(i));
        expect(p.x + g.card.w).toBeLessThanOrEqual(w);
        if (i > 0) expect(p.y - landed[i - 1].y).toBeGreaterThanOrEqual(g.card.h + 4);
      });
      for (const p of g.pile) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x + g.card.w).toBeLessThanOrEqual(w);
        expect(p.y + g.card.h).toBeLessThan(h * 0.68);
      }
      // Piled, the cards overlap: crowded, as the ordinary experience is.
      expect(g.pile[1].y - g.pile[0].y).toBeLessThan(g.card.h);
      expect(g.why.x + g.why.w).toBeLessThanOrEqual(w);
      expect(g.why.y + g.why.h).toBeLessThan(h - (mode === 'desktop' ? 50 : 30));
      // On a narrow frame the other requests step back for the explanation; on a desktop frame they stay.
      const later = scene.cues.find((c) => c.k === 'req-1')!;
      expect(later.outTo).toBe(mode === 'phone' ? 0.2 : undefined);
    });
  }
});
