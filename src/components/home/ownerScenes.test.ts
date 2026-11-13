import { describe, expect, it } from 'vitest';
import { HOME_AUDIENCES } from '../../content/homeAudiences';
import { CONNECT_ITEM } from './connectChainScene';
import { partyOf } from './controlChainScene';
import { FOCAL_ITEM, ROW_ITEMS } from './planChainScene';
import {
  GAMBLE_CAPTION,
  GAMBLE_CONTRACT,
  GAMBLE_DICE,
  GAMBLE_NOTICES,
  GAMBLE_PLAN,
  GAMBLE_SPECS,
  GAMBLE_TURN,
  GAMBLE_URGENT,
  HOUSE_RENDER,
  OWNER_CANVAS,
  OWNER_DECISIONS,
  OWNER_TABS,
  OWNER_TAKEAWAY,
  TEAM,
  TEAM_CONTRACTOR,
  TEAM_FOOT,
  TEAM_MARK,
  TEAM_PARTIES,
  TEAM_RUSH,
  TEAM_STATES,
  TEAM_WASTE_ROUNDS,
  SWEEP_HAND,
  boxCorners,
  CHOICE_COUNT,
  CHOICE_FOOT,
  CHOICE_TIMED,
  CHOICE_WORDS,
  buildOwnerScene,
  choiceGeometry,
  cueStateAt,
  gambleGeometry,
  houseBackdrop,
  isOwnerTab,
  lookaheadWindow,
  ownerStateAt,
  requestLabel,
  textWidth,
  shieldPath,
  teamGeometry,
  travelInto,
  type OwnerMode,
  type SweepBox,
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

  it('Protect your investment: the general contractor in the middle, and the four groups the contractor\'s coordination reaches', () => {
    expect(TEAM.map((t) => t.label)).toEqual(['Owner', 'Design team', 'Consultants', 'Vendors']);
    expect([...TEAM_CONTRACTOR.lines, TEAM_CONTRACTOR.short]).toEqual(['General', 'contractor', 'Contractor']);
    expect([TEAM_STATES.out, TEAM_STATES.in]).toEqual(['Weak procurement planning', 'Precise procurement planning']);
    // Weak planning costs each group something of its own: two requests, and what they add up to (founder, 2026-11-12).
    expect(TEAM.map((t) => [...t.requests])).toEqual([['Surprise', 'Rushed decision'], ['ASAP', 'No priority'], ['ASAP', 'No priority'], ['Rushed deadlines', 'Rescheduled']]);
    expect(TEAM.map((t) => t.effect)).toEqual(['Last-minute decisions', 'Competing urgent requests', 'Competing urgent requests', 'Stop-start work']);
    // And one calm word each once the contractor is in control. No two alike.
    expect(TEAM.map((t) => t.calm)).toEqual(['In control', 'Aligned', 'Coordinated', 'Ready']);
    expect(new Set(TEAM.map((t) => t.calm)).size).toBe(TEAM.length);
    expect(OWNER_TAKEAWAY['owner-protect-investment']).toBe('A coordinated contractor protects your investment.');
    expect(OWNER_TAKEAWAY['owner-protect-investment']).not.toBe(OWNER_TAKEAWAY['owner-reduce-risk']);
    expect(TEAM_MARK).toBe('JiTpro');
    // The foot of each state, in the founder's words: a line, and a phrase beneath it. The second state's line is the closing line.
    expect(TEAM_FOOT.out).toEqual({ head: 'Weak procurement planning puts your investment at risk.', support: 'Preventable delays. Rising costs. Eroding profits.' });
    expect(TEAM_FOOT.in).toEqual({ head: 'A coordinated contractor protects your investment.', support: 'JiTpro gets the field what it needs, when it needs it.' });
    expect(TEAM_FOOT.in.head).toBe(OWNER_TAKEAWAY['owner-protect-investment']);
  });

  it('Protect your investment: every group is sent two rushed requests with different marks, the second after everyone has had a first', () => {
    TEAM.forEach((_, to) => {
      const mine = TEAM_RUSH.filter((r) => r.to === to);
      expect(mine.map((r) => r.round)).toEqual([0, 1]);
      expect(requestLabel(mine[0])).not.toBe(requestLabel(mine[1]));
    });
    expect(TEAM_RUSH.map((r) => r.round)).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
    for (const r of TEAM_RUSH) expect(requestLabel(r)).toBeTruthy();
  });

  it('Protect your investment: says coordination, never a timetable, an amount or a promise', () => {
    const words = [...TEAM.flatMap((t) => [t.label, t.effect, t.calm, ...t.requests]), ...TEAM_CONTRACTOR.lines, TEAM_CONTRACTOR.short, TEAM_STATES.out, TEAM_STATES.in, ...Object.values(TEAM_FOOT.out), ...Object.values(TEAM_FOOT.in)].join(' | ');
    // *Rescheduled* on a vendor's request is the founder's (2026-11-12): a disruption, not a timetable.
    expect(words.replace('Rescheduled', '')).not.toMatch(/\d|\$|%|guarantee|always|never|eliminate|save[sd]?\b|change order|waste|insur|schedul/i);
  });

  it('Reduce risk: an illustration of a contract and a gamble, in the founder\'s words, with no project data', () => {
    expect([...GAMBLE_CONTRACT.terms]).toEqual(['Budget', 'Completion date']);
    expect(GAMBLE_CAPTION.join(' ')).toBe('Hoping everything goes according to plan?');
    expect([...GAMBLE_NOTICES]).toEqual(['Change order', 'Schedule delay', 'Cost overrun', 'Decision needed now', 'More revisions', 'Another surprise']);
    expect(GAMBLE_NOTICES[GAMBLE_URGENT]).toBe('Decision needed now');
    // Three project documents: drawings (no lettering), the contract, and the specifications.
    expect([GAMBLE_CONTRACT.title, GAMBLE_SPECS.title, GAMBLE_SPECS.short]).toEqual(['Construction contract', 'Specifications', 'Specs']);
    expect([...GAMBLE_PLAN.lines]).toEqual(['Critical needs identified', 'Decisions scheduled', 'Responsibilities assigned', 'Long-lead items planned', 'Key approvals tracked', 'Risks surfaced early']);
    expect(OWNER_TAKEAWAY['owner-reduce-risk']).toBe('Confidence requires a plan.');
    expect(GAMBLE_PLAN.support.join(' ')).toBe('Your contractor’s procurement plan. Powered by JiTpro.');
    // The plan is the contractor's, and carries the JiTpro mark.
    expect(GAMBLE_PLAN.whose).toMatch(/contractor/i);
    expect(GAMBLE_PLAN.mark).toBe('JiTpro');
  });

  it('Reduce risk: names a budget and a date but never an amount, a day or a promise', () => {
    const words = [GAMBLE_CONTRACT.title, GAMBLE_CONTRACT.short, ...GAMBLE_CONTRACT.terms, ...GAMBLE_CAPTION, ...GAMBLE_NOTICES, GAMBLE_PLAN.whose, GAMBLE_PLAN.title, ...GAMBLE_PLAN.lines, ...GAMBLE_PLAN.support, OWNER_TAKEAWAY['owner-reduce-risk']].join(' | ');
    expect(words).not.toMatch(/\d|\$|%|guarantee|always|never|eliminate|save[sd]?\b|casino|jackpot|\bbet\b/i);
    // Two dice, each a real face; not a pair, and not a seven.
    expect(GAMBLE_DICE).toHaveLength(2);
    for (const face of GAMBLE_DICE) expect([2, 3, 4, 5]).toContain(face);
    expect(GAMBLE_DICE[0]).not.toBe(GAMBLE_DICE[1]);
    expect(GAMBLE_DICE[0] + GAMBLE_DICE[1]).not.toBe(7);
  });

  it('closes every visual on a line with no amount and no promise', () => {
    expect(Object.values(OWNER_TAKEAWAY).join(' | ')).not.toMatch(/\d|\$|%|guarantee|always|never|eliminate|save[sd]?\b/i);
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
            if (c.arc) expect(c.arc.at + c.arc.dur).toBeLessThanOrEqual(scene.end);
            if (c.push) expect(c.push.at + c.push.dur).toBeLessThanOrEqual(scene.end);
            if (c.roll) expect(c.at + c.roll.dur).toBeLessThanOrEqual(scene.end);
          }
          expect(scene.end).toBeGreaterThanOrEqual(10000);
          expect(scene.end).toBeLessThanOrEqual(26000);
        });

        it('opens empty, ends on its takeaway, and rests', () => {
          for (const s of Object.values(at(0))) expect(s.o).toBe(0);
          const end = at(scene.end);
          expect(end.takeaway).toEqual({ o: 1, ty: 0, draw: 1, mx: 0, my: 0, rot: 0, sc: 1 });
          // The takeaway is the last thing to appear, and is given time to be read. In Protect your investment it is the
          // second state's foot words, which come in as that state is named (founder, 2026-11-12), so the state completes after it.
          const takeaway = scene.cues.find((c) => c.k === 'takeaway')!;
          if (tab === 'owner-protect-investment') expect(takeaway.at).toBeGreaterThan(scene.cues.find((c) => c.k === 'stateIn')!.at);
          else expect(Math.max(...scene.cues.map((c) => c.at))).toBe(takeaway.at);
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

  it('Reduce risk: three documents, the dice across them, six surprises around the dice, a pause, a hand that sweeps them away, a reset, then the plan', () => {
    const k = (key: string) => cueAt('owner-reduce-risk', key);
    const dice = GAMBLE_DICE.map((_, i) => k(`die-${i}`));
    const notices = GAMBLE_NOTICES.map((_, i) => k(`notice-${i}`));
    const lines = GAMBLE_PLAN.lines.map((_, i) => k(`line-${i}`));
    const documents = ['drawings', 'contract', 'specs'];
    const paper = [...documents, 'term-0', 'term-1'];
    const plan = k('plan');
    const hand = k('hand');
    // The sheet they lie on is there from the first moment and is never moved or withdrawn; only the closing stage covers it.
    expect([k('ground').at, k('ground').out]).toEqual([0, undefined]);
    expect(k('ground').push ?? k('ground').move ?? k('ground').from ?? k('ground').rise).toBeUndefined();
    expect(k('ground').at + k('ground').dur!).toBeLessThanOrEqual(k('drawings').at + k('drawings').dur!);
    // 1. Trust: three project documents, one after another, and both promises, in place before anything disturbs them.
    const opening = paper.map((key) => k(key).at);
    expect(opening).toEqual([...opening].sort((a, b) => a - b));
    expect(new Set(documents.map((key) => k(key).at)).size).toBe(3);
    expect(dice[0].at).toBeGreaterThanOrEqual(k('term-1').at + 700);
    // 2. Uncertainty, within the first few seconds: the dice roll in from the right, across the documents; a restrained roll.
    for (const die of dice) {
      expect(die.roll!.dx).toBeGreaterThan(0);
      expect(die.roll!.hops).toBe(2);
      expect(die.roll!.turns).toBeLessThanOrEqual(1);
      expect(die.at + die.roll!.dur).toBeLessThanOrEqual(4200);
    }
    // The question waits for the dice to settle, and then stays: through the surprises and the pause, until the hand comes in.
    const settled = Math.max(...dice.map((die) => die.at + die.roll!.dur));
    expect(k('caption').at).toBeGreaterThanOrEqual(settled);
    // 3. Six surprises, one at a time, once the question has been read; each sooner after the last and faster to land.
    expect(notices).toHaveLength(6);
    expect(notices[0].at).toBeGreaterThanOrEqual(k('caption').at + 700);
    const gaps = notices.slice(1).map((c, i) => c.at - notices[i].at);
    expect(gaps).toEqual([...gaps].sort((a, b) => b - a));
    expect(new Set(gaps).size).toBe(gaps.length);
    expect(gaps[gaps.length - 1]).toBeGreaterThanOrEqual(240);
    const speeds = notices.map((c) => c.dur!);
    expect(speeds).toEqual([...speeds].sort((a, b) => b - a));
    expect(new Set(speeds).size).toBe(speeds.length);
    notices.forEach((c, i) => i > 0 && expect(c.at + c.dur!).toBeGreaterThan(notices[i - 1].at + notices[i - 1].dur!));
    // 4. Then a brief pause, long enough to register and no longer: documents, dice, question and six notices, all in view, all still.
    const piled = Math.max(...notices.map((c) => c.at + c.dur!));
    const sweep = hand.push!;
    expect(sweep.at - piled).toBeGreaterThanOrEqual(600);
    expect(sweep.at - piled).toBeLessThanOrEqual(900);
    const scene = buildOwnerScene('owner-reduce-risk', 'desktop');
    const held = ownerStateAt(scene, piled);
    const table = [...paper, 'caption', 'die-0', 'die-1', ...notices.map((_, i) => `notice-${i}`)];
    for (let t = piled; t <= sweep.at; t += 100) {
      const now = ownerStateAt(scene, t);
      for (const key of table) {
        expect(now[key], key).toEqual(held[key]);
        expect([now[key].o, now[key].mx, now[key].my, now[key].rot], key).toEqual([1, 0, 0, 0]);
      }
    }
    // 5. A hand sweeps all eight off, up and to the right: every notice and both dice ride the same sweep as the hand, the
    // same way; none is simply faded out.
    const cleared = sweep.at + sweep.dur;
    expect(sweep.reach).toBe(0);
    expect(sweep.ux).toBeGreaterThan(0);
    expect(sweep.uy).toBeLessThan(0);
    expect(Math.hypot(sweep.ux, sweep.uy)).toBeCloseTo(1);
    // Diagonal: neither level nor straight up.
    expect(-sweep.uy / sweep.ux).toBeGreaterThan(0.3);
    expect(-sweep.uy / sweep.ux).toBeLessThan(1);
    expect(sweep.dur).toBeGreaterThanOrEqual(1000);
    expect(sweep.dur).toBeLessThanOrEqual(1600);
    for (const c of [...notices, ...dice]) {
      expect([c.push!.at, c.push!.dur, c.push!.travel, c.push!.ux, c.push!.uy]).toEqual([sweep.at, sweep.dur, sweep.travel, sweep.ux, sweep.uy]);
      expect(c.push!.reach).toBeGreaterThan(0);
      expect(c.move).toBeUndefined();
      expect(c.out).toBe(cleared);
    }
    expect(hand.out).toBe(cleared);
    // The question goes as the hand comes in.
    expect(k('caption').out).toBe(sweep.at);
    // 6. The documents are never swept: they neither move nor fade while the hand crosses.
    for (const key of paper) {
      expect(k(key).push ?? k(key).move ?? k(key).from, key).toBeUndefined();
      expect(k(key).out).toBeGreaterThanOrEqual(cleared);
    }
    const swept = ownerStateAt(scene, cleared);
    for (const key of paper) expect([swept[key].o, swept[key].mx, swept[key].my], key).toEqual([1, 0, 0]);
    // 7. A brief reset: the documents are seen alone for a beat, then step back to a ghost of themselves, together.
    const reset = k('drawings').out!;
    for (const key of paper) expect([k(key).out, k(key).outTo], key).toEqual([reset, k('drawings').outTo]);
    expect(k('drawings').outTo).toBeGreaterThan(0);
    expect(k('drawings').outTo).toBeLessThanOrEqual(0.25);
    expect(reset - cleared).toBeLessThanOrEqual(400);
    // The turn: once everything swept is gone, one line is shown alone on the cleared table, the founder's words exactly. It
    // is held long enough to read once and no longer, and it is gone before the plan sets out.
    expect(GAMBLE_TURN).toBe('It doesn’t have to be this way.');
    const turn = k('turn');
    expect(turn.at).toBeGreaterThanOrEqual(cleared + 100);
    expect(turn.at).toBeGreaterThanOrEqual(reset);
    expect(turn.push ?? turn.move ?? turn.from ?? turn.roll).toBeUndefined();
    const read = turn.out! - (turn.at + (turn.dur ?? 350));
    expect(read).toBeGreaterThanOrEqual(900);
    expect(read).toBeLessThanOrEqual(1500);
    expect(plan.at).toBeGreaterThanOrEqual(turn.out! + turn.outDur!);
    expect(plan.at - cleared).toBeLessThanOrEqual(2200);
    const reading = ownerStateAt(scene, turn.out!);
    expect(reading.turn.o).toBe(1);
    for (const key of ['die-0', 'die-1', 'caption', 'hand', 'plan', 'stage', 'takeaway', ...notices.map((_, i) => `notice-${i}`)]) expect(reading[key].o, key).toBe(0);
    for (const key of paper) expect(reading[key].o, key).toBeCloseTo(k('drawings').outTo!);
    expect(plan.from!.dx).toBeGreaterThan(0);
    // 8. The plan, as before: its six lines appear and are checked one at a time.
    expect(lines).toHaveLength(6);
    lines.forEach((line, i) => {
      const check = k(`check-${i}`);
      expect(line.at).toBeGreaterThanOrEqual(plan.at + plan.dur!);
      expect(check.at).toBeGreaterThan(line.at);
      if (i > 0) expect(line.at - lines[i - 1].at).toBeGreaterThanOrEqual(250);
    });
    // Confidence: every line is checked before the camera pushes in on the plan; the navy stage is drawn as it does, and stays.
    const push = plan.move!;
    const lastCheck = k(`check-${lines.length - 1}`);
    expect(push.at).toBeGreaterThanOrEqual(lastCheck.at + lastCheck.dur!);
    expect(push.scale).toBeGreaterThan(1);
    expect(push.rot).toBeUndefined();
    expect([k('stage').at, k('stage').out]).toEqual([push.at, undefined]);
    expect(k('takeaway').at).toBeGreaterThanOrEqual(push.at + 600);
    expect(k('takeaway').at).toBeLessThanOrEqual(push.at + push.dur);
    expect(scene.end).toBeLessThanOrEqual(17000);
    expect(scene.end - (push.at + push.dur)).toBeGreaterThanOrEqual(1400);
    // At rest: the stage, the plan with every line checked, and the closing lockup. No hand, no notices, no dice, no question;
    // the documents are ghosts beneath the stage.
    const end = ownerStateAt(scene, 1e9);
    for (const key of ['die-0', 'die-1', 'caption', 'hand', 'turn', ...notices.map((_, i) => `notice-${i}`)]) expect(end[key].o, key).toBe(0);
    for (const key of paper) expect(end[key].o, key).toBeCloseTo(k('drawings').outTo!);
    for (const key of ['plan', 'stage', 'takeaway', ...lines.flatMap((_, i) => [`line-${i}`, `check-${i}`])]) expect(end[key].o, key).toBe(1);
    const g = gambleGeometry('desktop');
    expect([end.plan.mx, end.plan.my, end.plan.rot, end.plan.sc]).toEqual([g.lockup.dx, g.lockup.dy, 0, g.lockup.scale]);
  });

  it('Reduce risk: the dice roll in from the side, hop lower each time, and come to rest exactly where they are drawn', () => {
    for (const mode of MODES) {
      const scene = buildOwnerScene('owner-reduce-risk', mode);
      const die = scene.cues.find((c) => c.k === 'die-0')!;
      const roll = die.roll!;
      const at = (t: number) => ownerStateAt(scene, t)['die-0'];
      // It sets out off the canvas and never passes its resting place.
      expect(gambleGeometry(mode).dice[0].cx + at(die.at).mx - gambleGeometry(mode).die / 2).toBeGreaterThanOrEqual(OWNER_CANVAS[mode].w);
      let peak = 0;
      let previous = Infinity;
      const peaks: number[] = [];
      for (let t = die.at; t <= die.at + roll.dur; t += 10) {
        const s = at(t);
        expect(s.mx).toBeGreaterThanOrEqual(0);
        expect(s.mx).toBeLessThanOrEqual(previous);
        previous = s.mx;
        // It leaves the ground upward only, and never higher than its first hop allows.
        expect(s.my).toBeLessThanOrEqual(0);
        expect(-s.my).toBeLessThanOrEqual(roll.hop);
        if (-s.my > peak) peak = -s.my;
        else if (-s.my < 0.05 && peak > 0) {
          peaks.push(peak);
          peak = 0;
        }
      }
      expect(peaks.length).toBeGreaterThanOrEqual(2);
      expect(peaks).toEqual([...peaks].sort((a, b) => b - a));
      const rest = at(die.at + roll.dur);
      expect([rest.mx, rest.my, rest.rot, rest.o]).toEqual([0, 0, 0, 1]);
      // And it stays there, untouched, until the hand sweeps the table.
      expect(at(die.push!.at)).toEqual(rest);
    }
  });

  it('Reduce risk: the hand reaches in from the lower left and pushes up to the right; each notice and die waits until it is reached, then goes off the table; the hand is drawn back', () => {
    const smooth = (u: number) => {
      const x = Math.min(1, Math.max(0, u));
      return x * x * (3 - 2 * x);
    };
    for (const mode of MODES) {
      const scene = buildOwnerScene('owner-reduce-risk', mode);
      const g = gambleGeometry(mode);
      const { w, h } = OWNER_CANVAS[mode];
      const { go, fingers, front, outline } = g.sweep;
      const H = g.hand;
      const cue = scene.cues.find((c) => c.k === 'hand')!;
      const sweep = cue.push!;
      const start = sweep.at;
      const end = sweep.at + sweep.dur;
      const letGo = start + sweep.dur * H.letGo;
      const inside = (p: { x: number; y: number }) => p.x > 0 && p.x < w && p.y > 0 && p.y < h;
      const wrists = new Map<number, { x: number; y: number }>();
      const wristAt = (t: number) => {
        if (!wrists.has(t)) wrists.set(t, { x: H.ax + cueStateAt(cue, t).mx, y: H.ay + cueStateAt(cue, t).my });
        return wrists.get(t)!;
      };
      /** Points of the hand's outline, where they are at a moment. */
      const handAt = (t: number, points: readonly { x: number; y: number }[]) => {
        const wrist = wristAt(t);
        return points.map((p) => ({ x: wrist.x + p.x, y: wrist.y + p.y }));
      };
      /** How far the hand has gone, the way it travels. */
      const gone = (t: number) => (wristAt(t).x - H.ax) * go.x + (wristAt(t).y - H.ay) * go.y;
      /** How far the sweep has gone: what everything that has been reached travels with. */
      const swept = (t: number) => sweep.travel * smooth((t - start) / sweep.dur);

      // It travels up and to the right, on a diagonal, and it leads with its fingers: they point up and to the right too, a
      // little more steeply than it travels, so it is neither a stiff upright arm nor a level one, and it goes slightly side-on.
      expect(H.dir).toBeGreaterThanOrEqual(18);
      expect(H.dir).toBeLessThanOrEqual(40);
      expect(go.x).toBeGreaterThan(0);
      expect(go.y).toBeLessThan(0);
      expect(fingers.x).toBeGreaterThan(0);
      expect(fingers.y).toBeLessThan(0);
      const lead = 90 - H.tilt - H.dir;
      expect(lead).toBeGreaterThanOrEqual(0);
      expect(lead).toBeLessThanOrEqual(20);
      expect([sweep.ux, sweep.uy]).toEqual([go.x, go.y]);
      expect(sweep.reach).toBe(0);
      // One finished illustration moved as one object: it is carried, never turned, stretched or redrawn on the way.
      for (let t = start; t <= end; t += 50) expect([cueStateAt(cue, t).rot, cueStateAt(cue, t).sc, cueStateAt(cue, t).ty]).toEqual([0, 1, 0]);

      // Before the sweep the whole of it is out of sight, beyond the lower left corner: fingers, thumb, cuff and all of the sleeve.
      for (const p of handAt(start, outline)) expect(inside(p), `${mode} start`).toBe(false);
      expect(wristAt(start).x).toBeLessThan(w * 0.25);
      expect(wristAt(start).y).toBeGreaterThan(h);
      // It goes out and comes back, once: forward to a single furthest point, then back the way it came, to where it started.
      let furthest = 0;
      let turnedAt = start;
      for (let t = start; t <= end; t += 5) {
        if (gone(t) > furthest) {
          furthest = gone(t);
          turnedAt = t;
        }
      }
      for (let t = start + 5; t <= end; t += 5) {
        if (t <= turnedAt) expect(gone(t)).toBeGreaterThanOrEqual(gone(t - 5) - 1e-9);
        else expect(gone(t)).toBeLessThanOrEqual(gone(t - 5) + 1e-9);
        // It never leaves its line, and never gets ahead of what it has pushed.
        expect((wristAt(t).x - H.ax) * go.y - (wristAt(t).y - H.ay) * go.x).toBeCloseTo(0, 6);
        expect(gone(t)).toBeLessThanOrEqual(swept(t) + 1e-9);
      }
      // Until it lets go it keeps exactly with the sweep; it lets go only after the last thing has been set moving.
      for (let t = start; t <= letGo; t += 5) expect(gone(t)).toBeCloseTo(swept(t), 6);
      expect(turnedAt).toBeGreaterThan(letGo);
      expect(turnedAt).toBeLessThan(start + sweep.dur * 0.7);
      // At its furthest the hand is well into the frame, fingertips and all: it is seen doing the pushing. The cut end of
      // the sleeve is never seen, and nor is anything but hand and sleeve: the forearm does not cross the frame.
      const tips = handAt(turnedAt, front).filter((_, i) => i < front.length * 0.8);
      expect(tips.filter(inside).length / tips.length).toBeGreaterThan(0.9);
      expect(wristAt(turnedAt).x).toBeGreaterThan(w * 0.3);
      const far = outline.map((p, i) => ({ i, far: Math.hypot(p.x, p.y) })).filter((p) => p.far > SWEEP_HAND.arm * H.scale * 0.9);
      expect(far.length).toBeGreaterThan(0);
      for (let t = start; t <= end; t += 20) for (const p of far) expect(inside({ x: wristAt(t).x + outline[p.i].x, y: wristAt(t).y + outline[p.i].y }), `${mode} sleeve end at ${t}`).toBe(false);
      // And after it, out of sight again, where it began.
      expect(gone(end)).toBeCloseTo(0, 6);
      for (const p of handAt(end, outline)) expect(inside(p), `${mode} end`).toBe(false);
      expect(cue.out).toBe(end);

      const things = [
        ...g.notices.map((n, i) => ({ key: `notice-${i}`, from: n.from as { dx: number; dy: number; rot: number } | null })),
        ...g.dice.map((_, i) => ({ key: `die-${i}`, from: null })),
      ].map((thing, i) => ({ ...thing, box: g.boxes[i], reach: [...g.reach.notices, ...g.reach.dice][i] }));
      /** A thing's outline, closely spaced, moved by an offset. */
      const rim = (box: SweepBox, by: number) => {
        const corners = boxCorners(box);
        return corners.flatMap((a, n) => {
          const b = corners[(n + 1) % 4];
          return Array.from({ length: 40 }, (_, k) => ({ x: a.x + ((b.x - a.x) * k) / 40 + go.x * by, y: a.y + ((b.y - a.y) * k) / 40 + go.y * by }));
        });
      };
      /** Is any of these points within `pad` of the box? */
      const touches = (points: { x: number; y: number }[], box: SweepBox, pad: number) => points.some((p) => travelInto(p, go, box, pad) === 0);
      const moved = (box: SweepBox, by: number): SweepBox => ({ ...box, cx: box.cx + go.x * by, cy: box.cy + go.y * by });
      for (const thing of things) {
        const own = scene.cues.find((c) => c.k === thing.key)!;
        const at = (t: number) => cueStateAt(own, t);
        expect(own.push!.reach).toBe(thing.reach);
        if (thing.from) {
          expect([at(own.at).mx, at(own.at).my, at(own.at).rot]).toEqual([thing.from.dx, thing.from.dy, thing.from.rot]);
          const landed = at(own.at + own.dur!);
          expect([landed.mx, landed.my, landed.rot, landed.o]).toEqual([0, 0, 0, 1]);
        }
        let touchedAt = -1;
        for (let t = start; t <= end; t += 10) {
          const s = at(t);
          // In full view for the whole sweep: pushed away, never faded away.
          expect(s.o, thing.key).toBe(1);
          const carried = s.mx * go.x + s.my * go.y;
          if (s.mx === 0 && s.my === 0) {
            // Not yet reached: it has not stirred, and the hand is not yet upon it.
            expect(touchedAt).toBe(-1);
            expect(s.rot).toBe(0);
            expect(swept(t)).toBeLessThanOrEqual(thing.reach + 1e-9);
          } else {
            // Reached: from here it goes the way the hand goes, up and to the right, exactly with the sweep.
            if (touchedAt < 0) touchedAt = t;
            expect(carried).toBeCloseTo(swept(t) - thing.reach, 6);
            expect(s.mx).toBeGreaterThan(0);
            expect(s.my).toBeLessThan(0);
            expect(s.my / s.mx).toBeCloseTo(go.y / go.x, 6);
          }
          // The hand is never drawn through it: no point of the hand's leading outline is ever inside it.
          expect(touches(handAt(t, front), moved(thing.box, carried), -1.5), `${mode} ${thing.key} run through at ${t}`).toBe(false);
        }
        expect(touchedAt, thing.key).toBeGreaterThan(start);
        // By three-quarters of the way through it is wholly off the canvas; only at the end is it removed.
        const last = at(end);
        expect(inside({ x: thing.box.cx + last.mx - thing.box.hw * 1.3, y: thing.box.cy + last.my + thing.box.hh * 1.3 })).toBe(false);
        const early = at(start + sweep.dur * 0.75);
        expect(thing.box.cx + early.mx - thing.box.hw > w || thing.box.cy + early.my + thing.box.hh < 0, `${mode} ${thing.key} off by three-quarters`).toBe(true);
        expect(at(own.out! + own.outDur!).o).toBe(0);
      }
      // What set each thing moving, at the moment it was: the hand itself, come within a sliver of it while it still kept up
      // with the sweep; or something already moving that ran into it (a pile goes as a pile, a die knocks on a card).
      // Never nothing: every thing's going is traced back, thing by thing, to the hand.
      const handAtReach = (reach: number) => front.map((p) => ({ x: H.ax + go.x * reach + p.x, y: H.ay + go.y * reach + p.y }));
      const byHand = things.map((thing) => thing.reach <= swept(letGo) && touches(handAtReach(thing.reach), thing.box, H.gap + 1.5) && !touches(handAtReach(thing.reach), thing.box, H.gap - 1.5));
      expect(g.byHand).toEqual(byHand);
      expect(byHand.filter(Boolean).length).toBeGreaterThanOrEqual(1);
      const accounted = [...byHand];
      for (let found = true; found; ) {
        found = false;
        things.forEach((thing, i) => {
          if (accounted[i]) return;
          const ranInto = things.some((other, j) => {
            const lead = thing.reach - other.reach;
            return accounted[j] && lead >= -1e-6 && (touches(rim(other.box, lead), thing.box, 1.5) || touches(rim(thing.box, 0), moved(other.box, lead), 1.5));
          });
          if (ranInto) {
            accounted[i] = true;
            found = true;
          }
        });
      }
      things.forEach((thing, i) => expect(accounted[i], `${mode} ${thing.key} set moving by something`).toBe(true));
      // And it is at the dice when they go: its fingertips are within a finger's width of each die as the die is set moving.
      for (const die of things.filter((thing) => thing.key.startsWith('die'))) {
        const handThen = front.map((p) => ({ x: H.ax + go.x * die.reach + p.x, y: H.ay + go.y * die.reach + p.y }));
        expect(touches(handThen, die.box, 16 * H.scale), `${mode} ${die.key} with the hand at it`).toBe(true);
      }
    }
  });

  it('Protect your investment: the contractor out of control, disorder spreading to all four; then the same contractor in control, and the same four calm', () => {
    const k = (key: string) => cueAt('owner-protect-investment', key);
    const idx = TEAM.map((_, i) => i);
    const n = idx.length;
    const rush = TEAM_RUSH.map((_, i) => k(`rush-${i}`));
    const friction = idx.map((i) => k(`friction-${i}`));
    const effects = idx.map((i) => k(`effect-${i}`));
    // The sheet it is drawn on is there from the start and stays; it is background, and nothing waits for it.
    expect([k('ground').at, k('ground').out]).toEqual([0, undefined]);
    idx.forEach((i) => expect([k(`node-${i}`).at, k(`node-${i}`).out]).toEqual([k(`link-${i}`).at, undefined]));
    // 1. The contractor first, in the middle; then the state is named and the four groups appear around.
    expect(k('loose').at).toBe(0);
    expect(k('stateOut').at).toBeLessThan(k('card-0').at);
    const cards = idx.map((i) => k(`card-${i}`).at);
    expect(cards).toEqual([...cards].sort((a, b) => a - b));
    // Disorder starts at the contractor and travels outward: friction, then requests along it, then what it costs each group, then more requests.
    friction.forEach((c, i) => {
      expect(c.at).toBeGreaterThanOrEqual(cards[n - 1] + 350);
      expect(c.draw).toBe(true);
      expect(k(`rush-${i}`).at).toBeGreaterThan(c.at);
    });
    const firstRound = rush.slice(0, n);
    const secondRound = rush.slice(n);
    const landedOnce = Math.max(...firstRound.map((r) => r.at + r.dur!));
    for (const e of effects) expect(e.at).toBeGreaterThanOrEqual(landedOnce);
    for (const r of secondRound) expect(r.at).toBeGreaterThanOrEqual(Math.max(...effects.map((e) => e.at)) + 350);
    for (const round of [firstRound, secondRound]) for (let i = 1; i < n; i++) expect(round[i].at - round[i - 1].at).toBeGreaterThanOrEqual(150);
    // Money is wasted for as long as the disorder lasts: a jobsite dumpster, then bills from the contractor and all four groups in turn.
    const bin = k('bin');
    expect(bin.at).toBeGreaterThanOrEqual(landedOnce);
    expect([k('binBack').at, k('binBack').out, k('binBack').outDur]).toEqual([bin.at, bin.out, bin.outDur]);
    // Everyone loses, the contractor included, and the contractor first: five parties, in launch order, round after round.
    expect([...TEAM_PARTIES]).toEqual(['gc', 0, 1, 2, 3]);
    const stream = Array.from({ length: TEAM_WASTE_ROUNDS }, (_, r) => TEAM_PARTIES.map((who) => k(`bill-${who}-${r}`))).flat();
    expect(stream).toHaveLength(TEAM_WASTE_ROUNDS * (n + 1));
    // One at a time, never together; and the flow builds: each follows the last a little sooner.
    const gaps = stream.slice(1).map((b, j) => b.at - stream[j].at);
    for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(90);
    expect(gaps).toEqual([...gaps].sort((a, b) => b - a));
    expect(gaps[gaps.length - 1]).toBeLessThan(gaps[0]);
    expect(stream[0].at).toBeGreaterThan(bin.at);
    stream.forEach((b, j) => {
      const own = TEAM_PARTIES[j % TEAM_PARTIES.length] === 'gc';
      // Slow enough to follow, on a curve, never a straight dash: over a second across the frame, a little less for the
      // contractor's short fall.
      expect(b.move).toBeUndefined();
      expect(b.arc!.dur).toBeGreaterThanOrEqual(own ? 700 : 1000);
      expect(b.arc!.at).toBeGreaterThan(b.at);
      // It is not faded away in the air: it goes only once it has arrived, inside.
      expect(b.out).toBe(b.arc!.at + b.arc!.dur);
    });
    // A steady drain, kept in hand: never more than about two from each party in the air at once.
    for (let t = stream[0].at; t <= bin.out!; t += 50) expect(stream.filter((b) => t >= b.at && t < b.out!).length).toBeLessThanOrEqual(11);
    // It runs through the disorder, alongside the second requests.
    expect(stream[0].at).toBeLessThan(secondRound[0].at);
    expect(stream[stream.length - 1].at).toBeGreaterThan(secondRound[n - 1].at);
    // No new bill once the disorder is withdrawn; those in the air finish; then the dumpster goes, as the shield begins.
    const lastLaunch = stream[stream.length - 1].at;
    const lastLanded = Math.max(...stream.map((b) => b.out!));
    expect(lastLaunch).toBeLessThan(k('loose').out!);
    expect(lastLanded).toBeLessThanOrEqual(bin.out!);
    expect(bin.out).toBeGreaterThanOrEqual(k('loose').out!);
    expect(bin.out).toBeLessThanOrEqual(k('guard').at);
    expect(bin.out! + bin.outDur!).toBeLessThan(k('shield').at);
    // It is held, then withdrawn all at once. The four groups stay.
    const rewind = k('loose').out!;
    // Held, complete, long enough to take in: four seconds from the last request landing.
    expect(rewind - Math.max(...rush.map((r) => r.at + r.dur!))).toBeGreaterThanOrEqual(3900);
    expect(rewind).toBe(k('loose').out);
    for (const c of [...rush, ...friction, ...effects, k('stateOut')]) expect(c.out).toBe(rewind);
    // THE FOOT IS SCENERY (founder, 2026-11-12): one navy bar, in with the opening and never fading; only its words change.
    const scene = buildOwnerScene('owner-protect-investment', 'desktop');
    expect(k('foot').at).toBe(0);
    expect(k('foot').out).toBeUndefined();
    expect(k('foot').move ?? k('foot').rise).toBeUndefined();
    for (let t = k('foot').at + k('foot').dur!; t <= scene.end + 5000; t += 50) expect(ownerStateAt(scene, t).foot.o).toBe(1);
    expect(scene.cues.some((c) => c.k === 'footOut' || c.k === 'band')).toBe(false);
    // The first state's words come in once the friction has been drawn, are read for at least three seconds, and go with
    // the state; the second state's come in the same way, as it is named, and stay. Never both at once.
    expect(k('footOutWords').at).toBeGreaterThanOrEqual(friction[0].at);
    expect(k('footOutWords').rise).toBe(k('takeaway').rise);
    expect(k('footOutWords').dur).toBe(k('takeaway').dur);
    expect(k('footOutWords').out).toBe(rewind);
    expect(rewind - (k('footOutWords').at + 350)).toBeGreaterThanOrEqual(3000);
    expect(k('takeaway').at).toBeGreaterThan(k('footOutWords').out! + k('footOutWords').outDur!);
    expect(k('takeaway').at).toBeGreaterThan(k('stateIn').at);
    expect(k('takeaway').at - k('stateIn').at).toBeLessThanOrEqual(800);
    expect(k('takeaway').out).toBeUndefined();
    for (const i of idx) expect(k(`card-${i}`).out).toBeUndefined();
    // 2. The shield is drawn around the contractor, calmly, on a clear frame; then it stands and the state is named again.
    const guard = k('guard');
    expect(guard.at).toBeGreaterThanOrEqual(rewind + 350);
    expect(guard.draw).toBe(true);
    expect(guard.dur).toBeGreaterThanOrEqual(700);
    expect(guard.from ?? guard.roll ?? guard.move).toBeUndefined();
    expect(k('shield').at).toBeGreaterThan(guard.at);
    expect(k('shield').at).toBeLessThanOrEqual(guard.at + guard.dur!);
    expect(k('stateIn').at).toBeGreaterThanOrEqual(k('shield').at + k('shield').dur!);
    expect(k('stateIn').at).toBeGreaterThanOrEqual(k('stateOut').out! + 350);
    // The same four are reached in turn by a level line, at an even pace, and each settles as it is reached.
    const links = idx.map((i) => k(`link-${i}`));
    links.forEach((link, i) => {
      expect(link.at).toBeGreaterThanOrEqual(k('stateIn').at + 350);
      expect(k(`calm-${i}`).at).toBeGreaterThan(link.at);
      expect(k(`calm-${i}`).at).toBeLessThanOrEqual(link.at + link.dur!);
      if (i > 0) expect(link.at - links[i - 1].at).toBe(links[1].at - links[0].at);
    });
    // Then value is protected: once every group is connected and calm, a small shield with a dollar sign settles beside each of
    // the five, one by one, the contractor last; all of it well after the last bill and the dumpster have gone, and before the close.
    const keeps = [...idx.map((i) => k(`keep-${i}`)), k('keep-gc')];
    expect(keeps).toHaveLength(TEAM_PARTIES.length);
    keeps.forEach((c, j) => {
      expect(c.at).toBeGreaterThanOrEqual(k(`calm-${n - 1}`).at + 350);
      expect(c.at).toBeGreaterThan(k('bin').out! + k('bin').outDur! + 1000);
      expect(c.out).toBeUndefined();
      expect(c.from ?? c.roll ?? c.move ?? c.arc).toBeUndefined();
      if (j > 0) expect(c.at - keeps[j - 1].at).toBeGreaterThanOrEqual(150);
    });
    // 3. The close: nothing is taken away. The second state, once whole, is held at least three seconds before it rests.
    expect(scene.end).toBeGreaterThanOrEqual(18000);
    expect(scene.end).toBeLessThanOrEqual(23000);
    expect(scene.end - (keeps[keeps.length - 1].at + keeps[keeps.length - 1].dur!)).toBeGreaterThanOrEqual(3000);
    // The first is withdrawn in a beat before the shield is drawn.
    expect(guard.at - rewind).toBeGreaterThanOrEqual(500);
    // The calm state is given at least as long on screen as the disorder was.
    expect(scene.end - guard.at).toBeGreaterThanOrEqual(rewind - friction[0].at);
    // At rest: the contractor in the shield, the four groups connected and calm, and the closing line. Nothing of the first state.
    // Nothing has moved from where it is drawn, and nothing is enlarged.
    const end = ownerStateAt(scene, 1e9);
    const gone = /^(rush|friction|effect|bill)-|^(loose|stateOut|footOutWords|bin|binBack)$/;
    for (const c of scene.cues) {
      expect(end[c.k].o, c.k).toBe(gone.test(c.k) ? 0 : 1);
      if (!gone.test(c.k)) expect([end[c.k].mx, end[c.k].my, end[c.k].rot, end[c.k].sc], c.k).toEqual([0, 0, 0, 1]);
    }
  });

  it('Protect your investment: the Hero\'s house render sits whole behind the picture, its foot on the closing band', () => {
    const box = houseBackdrop();
    const { w, h } = OWNER_CANVAS.desktop;
    // Never cropped or stretched: it is as wide as its own proportions allow in the height above the band, and no wider than the frame.
    expect(box.width).toBeGreaterThan(0.8);
    expect(box.width).toBeLessThanOrEqual(1);
    const drawnHeight = (box.width * w * HOUSE_RENDER.h) / HOUSE_RENDER.w;
    expect(drawnHeight).toBeCloseTo(teamGeometry('desktop').band.y);
    expect(box.bottom).toBeCloseTo(1 - teamGeometry('desktop').band.y / h);
    // On a narrow frame the band begins a little higher: the render's foot goes under it, never above it.
    expect(1 - box.bottom).toBeGreaterThanOrEqual(teamGeometry('phone').band.y / OWNER_CANVAS.phone.h);
    expect([HOUSE_RENDER.w, HOUSE_RENDER.h]).toEqual([1600, 954]);
  });

  it('Protect your investment: every wasted bill leaves its own card, curves over, and drops through the dumpster\'s open top', () => {
    for (const mode of MODES) {
      const g = teamGeometry(mode);
      const scene = buildOwnerScene('owner-protect-investment', mode);
      const { w, h } = OWNER_CANVAS[mode];
      const B = g.bin;
      // A roll-off dumpster: long and low, substantial but not dominant; low in the middle, under the contractor's card,
      // between the two lower groups, above where the band will rise.
      // Its near wall and the end seen beside it are, together, centred in the frame.
      expect(B.cx + B.skew / 2).toBeCloseTo(w / 2, 0);
      // A box flat on the ground: nothing is laid out beneath its foot, and its far edge is seen up and to one side.
      expect(Object.keys(B).sort()).toEqual(['cx', 'h', 'rim', 'skew', 'top', 'w']);
      expect(B.skew).toBeGreaterThan(0);
      expect(B.skew).toBeLessThanOrEqual(B.rim);
      expect(B.w).toBeGreaterThanOrEqual(B.h * 2.5);
      expect(B.h).toBeGreaterThanOrEqual(mode === 'desktop' ? 36 : 20);
      expect(B.w).toBeLessThan(g.shield.w);
      expect(B.w).toBeGreaterThan(g.card.w * 0.6);
      // The open top is plainly visible: a third of the box's height, or so, of opening.
      expect(B.rim).toBeGreaterThanOrEqual(B.h * 0.28);
      expect(B.top - B.rim).toBeGreaterThan(g.shield.cy + g.loose.h / 2 + 10);
      expect(B.top + B.h + 3).toBeLessThan(g.band.y);
      expect(B.cx - B.w / 2).toBeGreaterThan(g.at[3].x + g.card.w + 20);
      expect(B.cx + B.w / 2 + B.skew).toBeLessThan(g.at[2].x - 20);
      // The contractor's card, with a margin, and half a bill: no bill's middle may come inside it.
      const keepX = g.loose.w / 2 + 2 + g.bill.w / 2;
      const keepY = g.loose.h / 2 + 3 + g.bill.h / 2;
      TEAM_PARTIES.forEach((who) => {
        for (let r = 0; r < TEAM_WASTE_ROUNDS; r++) {
          const path = g.billPath(who, r);
          if (who === 'gc') {
            // The contractor's own money leaves from the foot of the contractor's card, directly above the dumpster.
            expect(Math.abs(path.from.x - g.shield.cx)).toBeLessThanOrEqual(g.loose.w / 4);
            expect(path.from.y).toBeGreaterThan(g.shield.cy + g.loose.h / 2);
            expect(path.from.y).toBeLessThan(B.top - B.rim);
          } else {
            // A group's money leaves from its own card: the foot of an upper card, the inner edge of a lower one.
            const p = g.at[who];
            expect(path.from.x).toBeGreaterThanOrEqual(p.x);
            expect(path.from.x).toBeLessThanOrEqual(p.x + g.card.w);
            expect(path.from.y).toBeGreaterThanOrEqual(p.y + g.card.h / 2);
            expect(path.from.y).toBeLessThanOrEqual(p.y + g.card.h + 4);
            if (r > 0) expect(Math.abs(path.to.x - B.cx)).toBeGreaterThan(Math.abs(g.billPath(who, r - 1).to.x - B.cx));
          }
          // The last stretch is straight down: the curve's last control point stands directly above its end, over the opening.
          expect(path.c2.x).toBe(path.to.x);
          expect(path.c2.y).toBeLessThan(B.top - 6);
          // It comes to rest inside, far enough below the near edge that the wall hides all of it, however it is turned,
          // and above the floor, well within the walls.
          expect(path.to.y - B.top).toBeGreaterThanOrEqual(Math.hypot(g.bill.w, g.bill.h) / 2 - 2);
          expect(path.to.y).toBeLessThan(B.top + B.h);
          expect(Math.abs(path.to.x - B.cx)).toBeLessThanOrEqual(B.w / 2 - g.bill.w / 2 - 6);
          // Follow it through the air.
          const key = `bill-${who}-${r}`;
          const cue = scene.cues.find((c) => c.k === key)!;
          const arc = cue.arc!;
          let previous = { x: path.from.x, y: path.from.y };
          let crossed = false;
          let highest = Infinity;
          for (let t = arc.at; t <= arc.at + arc.dur; t += 10) {
            const s = ownerStateAt(scene, t)[key];
            const at = { x: path.from.x + s.mx, y: path.from.y + s.my };
            highest = Math.min(highest, at.y);
            // Always in the frame, never across the contractor's card, and it never jumps: a smooth path.
            expect(at.x).toBeGreaterThan(0);
            expect(at.x).toBeLessThan(w);
            expect(at.y).toBeGreaterThan(0);
            expect(at.y).toBeLessThan(h);
            expect(Math.abs(at.x - g.shield.cx) < keepX && Math.abs(at.y - g.shield.cy) < keepY, `${mode} ${key} at ${t}`).toBe(false);
            expect(Math.hypot(at.x - previous.x, at.y - previous.y)).toBeLessThan(mode === 'desktop' ? 9 : 6);
            // Fully visible all the way in: it is never faded out above the opening.
            if (at.y <= B.top) expect(s.o).toBe(1);
            // Through the open top, not through a wall: where it crosses the near edge it is between the walls, and moving down.
            if (!crossed && at.y >= B.top) {
              crossed = true;
              expect(Math.abs(at.x - B.cx)).toBeLessThanOrEqual(B.w / 2 - g.bill.w / 2 - 2);
              expect(at.y).toBeGreaterThan(previous.y);
              expect(Math.abs(at.x - previous.x), `${mode} ${key} enters steeply`).toBeLessThan(at.y - previous.y);
            }
            // Once inside it only goes down.
            if (crossed) expect(at.y).toBeGreaterThanOrEqual(previous.y);
            previous = at;
          }
          expect(crossed).toBe(true);
          // It approached from above: at its highest it was clear of the opening.
          expect(highest).toBeLessThan(B.top - 8);
          const arrived = ownerStateAt(scene, arc.at + arc.dur)[key];
          expect(path.from.x + arrived.mx).toBeCloseTo(path.to.x);
          expect(path.from.y + arrived.my).toBeCloseTo(path.to.y);
          expect(arrived.o).toBe(1);
          expect(ownerStateAt(scene, cue.out! + cue.outDur!)[key].o).toBe(0);
        }
      });
    }
  });

  it('Protect your investment: protected value is the same small shield for each of the five, legible, and never nested in the great shield', () => {
    for (const mode of MODES) {
      const g = teamGeometry(mode);
      const b = g.badge;
      const s = g.shield;
      // Small beside a card, a shield's proportions, and large enough for its dollar sign to be read at the size it is drawn.
      expect(b.w).toBeLessThanOrEqual(g.card.w * 0.16);
      expect(b.h).toBeLessThanOrEqual(g.card.h * 0.34);
      expect(b.h / b.w).toBeCloseTo(s.h / s.w, 1);
      expect(b.h * 0.56).toBeGreaterThanOrEqual(mode === 'desktop' ? 11 : 8);
      expect(shieldPath({ cx: 0, cy: 0, ...b })).toMatch(/^M-?[\d.]+ -?[\d.]+Q.*Z$/);
      TEAM.forEach((_, i) => {
        const at = g.keepAt(i);
        const p = g.at[i];
        // On the card, at its inner foot, wholly inside it.
        expect(at.x - b.w / 2).toBeGreaterThanOrEqual(p.x + 3);
        expect(at.x + b.w / 2).toBeLessThanOrEqual(p.x + g.card.w - 3);
        expect(at.y + b.h / 2).toBeLessThanOrEqual(p.y + g.card.h - 3);
        expect(at.y - b.h / 2).toBeGreaterThan(p.y + g.card.h * 0.4);
        expect(Math.abs(at.x - (g.onLeft(i) ? p.x + g.card.w : p.x))).toBeLessThan(g.card.w * 0.25);
      });
      // The contractor's: beside the great shield's lower right, where the shield has drawn in toward its point, so it stands
      // wholly outside it; clear of the lines that leave the shield higher up; inside the canvas, above the band.
      const hero = g.keepAt('gc');
      expect(hero.y - b.h / 2).toBeGreaterThan(g.meets.low + 8);
      expect(hero.y - b.h / 2).toBeGreaterThan(s.cy + s.h * 0.2);
      expect(hero.x - b.w / 2).toBeGreaterThan(s.cx + s.w * 0.28);
      expect(hero.x + b.w / 2).toBeLessThan(g.at[2].x - 8);
      expect(hero.y + b.h / 2 + 4).toBeLessThan(g.band.y);
      // The shield's edge at the badge's height: it runs from the waist (full width) in to the point; a straight line between
      // them lies outside the true curve, so clearing that line by a margin clears the shield.
      const waist = s.cy + s.h * 0.12;
      const reach = (y: number) => (s.w / 2) * (1 - (y - waist) / (s.cy + s.h / 2 - waist));
      expect(hero.x - b.w / 2).toBeGreaterThan(s.cx + reach(hero.y - b.h / 2) * 0.9);
    }
  });

  it('Protect your investment: every rushed request sets out from the contractor, in the middle', () => {
    for (const mode of MODES) {
      const g = teamGeometry(mode);
      const scene = buildOwnerScene('owner-protect-investment', mode);
      TEAM_RUSH.forEach((r, i) => {
        const cue = scene.cues.find((c) => c.k === `rush-${i}`)!;
        const rest = g.tagAt(r.to, r.round);
        const s = ownerStateAt(scene, cue.at)[`rush-${i}`];
        expect(rest.cx + s.mx).toBeCloseTo(g.shield.cx);
        expect(rest.cy + s.my).toBeCloseTo(g.shield.cy);
        const landed = ownerStateAt(scene, cue.at + cue.dur!)[`rush-${i}`];
        expect([landed.mx, landed.my, landed.rot, landed.o]).toEqual([0, 0, 0, 1]);
      });
    }
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

  it('Better decisions: one continuous story; the line and six options travel together, keep all six at the early stop, and two at the late one', () => {
    const k = (key: string) => cueAt('owner-better-decisions', key);
    const scene = buildOwnerScene('owner-better-decisions', 'desktop');
    const g = choiceGeometry('desktop');
    const at = (t: number) => ownerStateAt(scene, t);
    // The words: the founder's messages and feet.
    expect(CHOICE_FOOT.in).toEqual({ head: 'Early planning preserves your choices.', support: 'More options. Better decisions.' });
    expect(CHOICE_FOOT.out).toEqual({ head: 'Late planning limits your choices.', support: 'Less time. Fewer options. More pressure.' });
    expect(CHOICE_TIMED).toEqual({
      head: 'Correctly timed decisions protect your options.',
      support: 'JiTpro helps your contractor identify what decisions are needed, when they are needed, and why the timing matters.',
    });
    expect(OWNER_TAKEAWAY['owner-better-decisions']).toBe(CHOICE_TIMED.head);
    expect(CHOICE_WORDS.early).toBe('Decision identified early');
    expect(CHOICE_WORDS.late).toBe('Decision identified late');
    expect([CHOICE_WORDS.more, CHOICE_WORDS.time]).toEqual(['More options', 'Time passes']);
    expect(Object.values(CHOICE_WORDS).join(' | ')).not.toMatch(/\d|\$|%|funnel|tile|finish|material|guarantee|always|never/i);
    // The cone is drawn once, before anything moves, and does not move.
    const drawn = ['ground', 'cone', 'wall-top', 'wall-bottom', 'axis', 'time', 'more', 'foot'];
    const SHOWN = k('line').at;
    for (const key of drawn) {
      expect(k(key).at + (k(key).dur ?? 350), key).toBeLessThanOrEqual(SHOWN);
      expect(k(key).move, key).toBeUndefined();
    }
    // The sheet and the foot's bar (founder, 2026-11-12) never go: once in, the bar stays to the end; only its words change.
    for (const key of ['ground', 'foot']) expect(k(key).out, key).toBeUndefined();
    for (let t = k('foot').at + k('foot').dur!; t <= scene.end + 5000; t += 50) expect(at(t).foot.o).toBe(1);
    expect(scene.cues.some((c) => c.k === 'footIn' || c.k === 'footOut')).toBe(false);
    // ONE GROUP: the line and the six cards are moved by the same two cues, so they cannot part; nothing else moves them.
    const cards = g.cards.map((_, j) => `card-${j}`);
    for (const key of ['line', ...cards]) expect(k(key).move, key).toBeUndefined();
    const run1 = k('now').move!;
    const run2 = k('nowOn').move!;
    const early = g.stop('early');
    const late = g.stop('late');
    expect(g.start.x + run1.dx).toBeCloseTo(early.x);
    expect(g.start.x + run1.dx + run2.dx).toBeCloseTo(late.x);
    expect(run2.at).toBeGreaterThan(run1.at + run1.dur + 4000);
    expect(run2.dur).toBeGreaterThanOrEqual(4500);
    // Shown at the mouth, all six, before time passes; the column never closes up.
    for (const key of ['line', ...cards]) expect(k(key).at + k(key).dur!, key).toBeLessThanOrEqual(run1.at);
    for (let j = 1; j < g.cards.length; j++) expect(g.cards[j].y - g.cards[j - 1].y).toBeCloseTo(g.cards[1].y - g.cards[0].y);
    // THE CONE DECIDES: at the early stop it holds all six (timed properly, nothing lost); at the late stop, two.
    // Early: about a quarter of the way along the cone. Late: 85 to 90% of the way.
    const along = (x: number) => (x - g.cone.x0) / (g.cone.x1 - g.cone.x0);
    expect(along(early.x)).toBeCloseTo(0.25, 1);
    expect(along(late.x)).toBeGreaterThanOrEqual(0.85);
    expect(along(late.x)).toBeLessThanOrEqual(0.9);
    expect(early.open).toBe(CHOICE_COUNT);
    expect(late.open).toBe(2);
    expect(g.lost).toHaveLength(CHOICE_COUNT - 2);
    // Each is lost, from the outside in, at the moment the moving group reaches the point where the cone stops holding it.
    const offs = g.lost.map((l) => k(`off-${l.option}`));
    const outside = (j: number) => Math.abs(g.cards[j].y - g.cone.cy);
    offs.forEach((c, i) => {
      const l = g.lost[i];
      expect(l.x).toBeGreaterThan(early.x);
      expect(l.x).toBeLessThanOrEqual(late.x);
      expect(c.at).toBeGreaterThan(run2.at);
      expect(c.at).toBeLessThanOrEqual(run2.at + run2.dur);
      expect(at(c.at).nowOn.mx / run2.dx).toBeCloseTo((l.x - early.x) / (late.x - early.x), 1);
      // From the outside in, one at a time: each alternative has its own latest viable moment.
      if (i) {
        expect(outside(l.option)).toBeLessThan(outside(g.lost[i - 1].option));
        expect(c.at - offs[i - 1].at).toBeGreaterThanOrEqual(250);
      }
    });
    // Identifying early is not deciding early: no choice is shown being made.
    expect(scene.cues.some((c) => /chosen|tick|pick/.test(c.k))).toBe(false);
    const open = g.cards.map((_, j) => j).filter((j) => !g.lost.some((l) => l.option === j));
    expect(open).toEqual([2, 3]);
    // Lost options stay seen: the card is never withdrawn before the story is, and the cross is laid over it.
    for (const l of g.lost) expect(k(`card-${l.option}`).out).toBe(k(`off-${l.option}`).out);
    // The early stop: its message and foot once the group is there, held about four seconds, gone before it moves on.
    expect(k('msgEarly').at).toBeGreaterThanOrEqual(run1.at + run1.dur);
    expect(k('footInWords').at).toBeGreaterThan(k('msgEarly').at);
    expect(k('msgEarly').out!).toBeLessThanOrEqual(run2.at);
    // Each stop is held four to five and a half seconds from the moment the group arrives.
    expect(k('msgEarly').out! - (run1.at + run1.dur)).toBeGreaterThanOrEqual(4000);
    expect(k('msgEarly').out! - (run1.at + run1.dur)).toBeLessThanOrEqual(5500);
    // The late stop: the pressure as the cone narrows; then its message and foot, held.
    expect(k('pressure').at).toBeGreaterThan(run2.at);
    expect(k('msgLate').at).toBeGreaterThanOrEqual(run2.at + run2.dur);
    expect(k('footOutWords').at).toBeGreaterThan(k('msgLate').at);
    // The foot's words cross over at the late stop: the first line goes as the second comes, with no gap and no overlap
    // long enough to read both.
    const inGone = k('footInWords').out! + k('footInWords').outDur!;
    expect(k('footInWords').out!).toBeGreaterThanOrEqual(run2.at + run2.dur);
    expect(k('footOutWords').at).toBeGreaterThanOrEqual(k('footInWords').out!);
    expect(k('footOutWords').at).toBeLessThanOrEqual(inGone);
    // PLAYED ONCE (founder, 2026-11-12): the late stop is complete once its foot words are in; it is held about a second;
    // then the whole illustration fades away together, smoothly, while the bar stays.
    const lateDone = k('footOutWords').at + k('footOutWords').dur!;
    const story = ['cone', 'wall-top', 'wall-bottom', 'axis', 'time', 'more', 'line', 'pressure', 'msgLate', ...cards, ...offs.map((c) => c.k)];
    const fade = k('msgLate').out!;
    for (const key of story) {
      expect(k(key).out, key).toBe(fade);
      expect(k(key).outDur, key).toBe(k('msgLate').outDur);
    }
    expect(fade - lateDone).toBeGreaterThanOrEqual(800);
    expect(fade - lateDone).toBeLessThanOrEqual(1300);
    expect(k('msgLate').outDur!).toBeGreaterThanOrEqual(700);
    const cleared = fade + k('msgLate').outDur!;
    // The group's carriers only move it; they never fade, so nothing fades twice over.
    for (const key of ['now', 'nowOn']) expect(k(key).out, key).toBeUndefined();
    // The late foot words stay while the cone fades, and are gone before the close begins.
    expect(k('footOutWords').out!).toBeGreaterThan(fade);
    const lateWordsGone = k('footOutWords').out! + k('footOutWords').outDur!;
    expect(lateWordsGone).toBeLessThanOrEqual(cleared + 200);
    // The close: correctly timed decisions. Only once the frame is clear: the six options again, all open, one after
    // another; then the line about JiTpro; last, the closing line on the foot. Nothing is crossed out; nothing leaves.
    const timed = g.cards.map((_, j) => k(`timed-${j}`));
    timed.forEach((c, j) => {
      expect(c.at, c.k).toBeGreaterThanOrEqual(cleared);
      expect(c.at).toBeGreaterThanOrEqual(lateWordsGone);
      expect(c.out, c.k).toBeUndefined();
      if (j) expect(c.at).toBeGreaterThan(timed[j - 1].at);
    });
    expect(k('timedWords').at).toBeGreaterThan(timed[timed.length - 1].at);
    expect(k('takeaway').at).toBeGreaterThan(k('timedWords').at);
    expect(scene.end).toBeGreaterThanOrEqual(20000);
    expect(scene.end).toBeLessThanOrEqual(26000);
    // It rests on the close, which reduced motion shows at once: the bar, its closing line, the six options and the line
    // about JiTpro; none of the cone's story.
    const rest = at(scene.end);
    for (const key of ['ground', 'foot', 'takeaway', 'timedWords', ...timed.map((c) => c.k)]) expect(rest[key].o, key).toBe(1);
    for (const key of [...story, 'msgEarly', 'footInWords', 'footOutWords']) expect(rest[key].o, key).toBe(0);
  });
});

describe('Project Owners visuals: composed for the frame', () => {
  for (const mode of MODES) {
    const { w, h } = OWNER_CANVAS[mode];

    it(`${mode}: Protect your investment sets the contractor in the middle, the four groups in the corners, and the band along the foot`, () => {
      const g = teamGeometry(mode);
      const d = mode === 'desktop';
      const s = g.shield;
      const { left, right, high, low, turnL, turnR } = g.meets;
      const [owner, design, consultants, vendors] = g.at;
      // The contractor is in the middle of the frame and of the four cards, and is the largest thing in the picture.
      expect(s.cx).toBe(w / 2);
      expect(s.cy).toBeCloseTo((owner.y + vendors.y + g.card.h) / 2, 0);
      expect(s.h).toBeGreaterThan(g.card.h * 2);
      expect(s.w).toBeGreaterThan(g.card.w * 0.75);
      expect(g.loose.w).toBeLessThanOrEqual(s.w);
      expect(g.loose.h).toBeLessThan(s.h);
      expect(Math.abs(g.loose.turn)).toBeGreaterThanOrEqual(3);
      expect(Math.abs(g.loose.turn)).toBeLessThanOrEqual(8);
      expect(shieldPath(s)).toMatch(/^M[\d.]+ [\d.]+Q.*Z$/);
      // The anchor of the picture: taller than two cards and their gap is not, but it reaches from near the top cards' top to near the bottom cards' foot.
      expect(s.cy - s.h / 2).toBeLessThanOrEqual(owner.y + g.card.h * 0.5);
      expect(s.cy + s.h / 2).toBeGreaterThanOrEqual(vendors.y + g.card.h * 0.5);
      // The background is a grid and nothing more: no decorative outline is laid out anywhere.
      expect(Object.keys(g.ground)).toEqual(['grid']);
      // The state is named above the shield.
      expect(g.stateY).toBeLessThan(s.cy - s.h / 2 - 8);
      // Four corners, mirrored about the middle, each clear of the shield and inside the canvas.
      expect([owner.y, design.y]).toEqual([owner.y, owner.y]);
      expect([vendors.y, consultants.y]).toEqual([vendors.y, vendors.y]);
      expect([owner.x, design.x]).toEqual([vendors.x, consultants.x]);
      expect(owner.x).toBeCloseTo(w - (design.x + g.card.w));
      expect(g.at.map((_, i) => g.onLeft(i))).toEqual([true, false, false, true]);
      expect(owner.x + g.card.w).toBeLessThan(turnL - 6);
      expect(design.x).toBeGreaterThan(turnR + 6);
      expect(vendors.y).toBeGreaterThanOrEqual(owner.y + g.card.h + (d ? 40 : 24));
      expect(owner.y).toBeGreaterThanOrEqual(g.stateY + 6);
      expect(s.cy + s.h / 2 + 6).toBeLessThan(g.band.y);
      // Requests rest at each card's inner corners, the first across the top and the second just below the foot. Each is as
      // wide as its words need, at full size, and runs outward from the inner corner: inside the canvas, clear of the shield
      // and the contractor's card, clear of the state's name, the closing band and every other request, and off the words
      // on every card.
      type Box = { x0: number; y0: number; x1: number; y1: number };
      type Pt = { x: number; y: number };
      const corners = (b: Box): Pt[] => [{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y0 }, { x: b.x1, y: b.y1 }, { x: b.x0, y: b.y1 }];
      /** A slip's outline as it rests, turned. */
      const slipShape = (t: { cx: number; cy: number; w: number; turn: number }): Pt[] => {
        const c = Math.cos((t.turn * Math.PI) / 180);
        const sn = Math.sin((t.turn * Math.PI) / 180);
        return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => ({ x: t.cx + c * u * (t.w / 2) - sn * v * (g.tag.h / 2), y: t.cy + sn * u * (t.w / 2) + c * v * (g.tag.h / 2) }));
      };
      /** Do two convex outlines overlap? (No line can be drawn between them.) */
      const meet = (p: Pt[], q: Pt[]) =>
        [p, q].every((shape) =>
          shape.every((a, i) => {
            const b = shape[(i + 1) % shape.length];
            const axis = { x: -(b.y - a.y), y: b.x - a.x };
            const span = (pts: Pt[]) => pts.map((pt) => pt.x * axis.x + pt.y * axis.y);
            return Math.max(...span(p)) > Math.min(...span(q)) && Math.max(...span(q)) > Math.min(...span(p));
          }),
        );
      /** A slip's bounding box, turned as it rests. */
      const slipBox = (t: { cx: number; cy: number; w: number; turn: number }): Box => {
        const pts = slipShape(t);
        return { x0: Math.min(...pts.map((pt) => pt.x)), y0: Math.min(...pts.map((pt) => pt.y)), x1: Math.max(...pts.map((pt) => pt.x)), y1: Math.max(...pts.map((pt) => pt.y)) };
      };
      const fs = d ? { name: 10, icon: 18, pad: 10, state: 9 } : { name: 8, icon: 12, pad: 7, state: 7.5 };
      const header = textWidth(TEAM_STATES.out, fs.state, { caps: true, tracking: 0.12 });
      const words: Box[] = [{ x0: w / 2 - header / 2, y0: g.stateY - fs.state * 0.75, x1: w / 2 + header / 2, y1: g.stateY + 1 }];
      g.at.forEach((p, i) => {
        const left = g.onLeft(i);
        const edge = left ? p.x + fs.pad : p.x + g.card.w - fs.pad;
        const nameW = fs.icon + (d ? 7 : 5) + textWidth(TEAM[i].label, fs.name, { caps: true, tracking: 0.08 });
        const nameY = p.y + (d ? 11 : 7.5) + fs.icon / 2 + fs.name * 0.36;
        words.push({ x0: left ? edge : edge - nameW, y0: nameY - fs.name * 0.75, x1: left ? edge + nameW : edge, y1: nameY + 1 });
        const lines = g.effectLines(i);
        const lineY = p.y + (d ? 45 : 31);
        lines.forEach((line, n) => {
          const y = lineY + (n - (lines.length - 1) / 2) * g.effectSize * 1.18;
          const lw = textWidth(line, g.effectSize);
          // Each line of what it costs the group stays between the card's edges, and below the group's name.
          expect(lw, `${mode} ${line}`).toBeLessThanOrEqual(g.card.w - 2 * fs.pad);
          expect(y - g.effectSize * 0.75).toBeGreaterThan(nameY + 3);
          expect(y + g.effectSize * 0.25).toBeLessThan(p.y + g.card.h - (d ? 10 : 7));
          words.push({ x0: left ? edge : edge - lw, y0: y - g.effectSize * 0.75, x1: left ? edge + lw : edge, y1: y + g.effectSize * 0.25 });
        });
      });
      const loose = { x0: s.cx - g.loose.w / 2 - 6, y0: s.cy - g.loose.h / 2 - 6, x1: s.cx + g.loose.w / 2 + 6, y1: s.cy + g.loose.h / 2 + 6 };
      const slips = TEAM_RUSH.map((r) => ({ r, t: g.tagAt(r.to, r.round) }));
      slips.forEach(({ r, t }, j) => {
        const box = slipBox(t);
        const label = `${mode} ${requestLabel(r)} (${TEAM[r.to].label})`;
        // Its words at full size, with room either side: never squeezed to fit.
        expect(t.w, label).toBeGreaterThanOrEqual(textWidth(requestLabel(r), g.tag.size, { caps: true, tracking: 0.06 }) + 2 * g.tag.pad - 1e-9);
        expect(box.x0, label).toBeGreaterThanOrEqual(2);
        expect(box.x1, label).toBeLessThanOrEqual(w - 2);
        expect(box.y1, label).toBeLessThan(g.band.y - 2);
        expect(meet(slipShape(t), corners(loose)), label).toBe(false);
        const p = g.at[r.to];
        const innerEdge = g.onLeft(r.to) ? p.x + g.card.w : p.x;
        if (g.onLeft(r.to)) expect(t.cx + t.w / 2).toBeLessThan(left);
        else expect(t.cx - t.w / 2).toBeGreaterThan(right);
        // Its inner end at the inner corner, the rest of it running outward over the card.
        expect(Math.abs((g.onLeft(r.to) ? t.cx + t.w / 2 : t.cx - t.w / 2) - innerEdge)).toBeLessThanOrEqual(d ? 10 : 8);
        if (r.round === 0) expect(t.cy).toBeLessThan(p.y + 4);
        else expect(t.cy).toBeGreaterThan(p.y + g.card.h);
        for (const word of words) expect(meet(slipShape(t), corners(word)), `${label} over words`).toBe(false);
        slips.forEach(({ t: other }, k) => k !== j && expect(meet(slipShape(t), slipShape(other)), `${label} over another`).toBe(false));
      });
      g.at.forEach((p, i) => {
        const innerEdge = g.onLeft(i) ? p.x + g.card.w : p.x;
        // The friction runs from the contractor's card to this card's inner edge, and is jagged.
        const jag = g.friction(i);
        expect(jag.split('L').length - 1).toBeGreaterThanOrEqual(5);
        expect(jag.endsWith(`L${innerEdge} ${p.y + g.card.h / 2}`)).toBe(true);
        // The line of the second state is level and square: from the shield, out, to the card's middle.
        const top = i < 2;
        const path = g.link(i);
        expect(path.startsWith(`M${g.onLeft(i) ? left : right} ${top ? high : low}H`)).toBe(true);
        expect(path.endsWith(`H${innerEdge}`)).toBe(true);
        // Two rounded corners about the turning line, and nothing else: no diagonal, no third turn.
        expect(path.match(/Q/g)).toHaveLength(2);
        expect(path.replace(/[\d. -]/g, '')).toBe('MHQVQH');
        expect(path).toContain(`Q${g.onLeft(i) ? turnL : turnR} `);
        expect(g.linkEnd(i)).toEqual({ shield: { x: g.onLeft(i) ? left : right, y: top ? high : low }, card: { x: innerEdge, y: p.y + g.card.h / 2 } });
        // There is room for both corners on every run of the line.
        expect(Math.abs(p.y + g.card.h / 2 - (top ? high : low))).toBeGreaterThanOrEqual(g.bend * 2 + 2);
        expect(Math.abs((g.onLeft(i) ? turnL : turnR) - innerEdge)).toBeGreaterThanOrEqual(g.bend);
        // It turns up to a top card and down to a bottom one, so the two on one side never share a path.
        if (top) expect(p.y + g.card.h / 2).toBeLessThan(high);
        else expect(p.y + g.card.h / 2).toBeGreaterThan(low);
      });
      expect(high).toBeGreaterThan(s.cy - s.h / 2 + s.w * 0.11);
      expect(low).toBeLessThan(s.cy + s.h * 0.12);
      expect([left, right]).toEqual([s.cx - s.w / 2, s.cx + s.w / 2]);
      // The band along the foot holds the closing line and the phrase beneath it, inside the canvas; the closing line is the larger and fits.
      const B = g.band;
      expect(B.y).toBeGreaterThanOrEqual(h * 0.78);
      expect(B.headY - B.head).toBeGreaterThanOrEqual(B.y + 4);
      expect(B.supportY - B.headY).toBeGreaterThanOrEqual(B.support * 1.5);
      expect(B.supportY).toBeLessThanOrEqual(h - 8);
      expect(B.head).toBeGreaterThan(B.support * 1.3);
      expect(OWNER_TAKEAWAY['owner-protect-investment'].length * B.head * 0.56).toBeLessThanOrEqual(w - 12);
    });

    it(`${mode}: Reduce risk spreads three documents across the frame, rests the dice in the middle, and piles the notices either side of them`, () => {
      const g = gambleGeometry(mode);
      const d = mode === 'desktop';
      const floor = h - (d ? 60 : 38); // above where the closing lockup's foot would be
      const c = g.contract;
      const p = g.plan;
      // Three documents across the frame: drawings left, contract in the middle, specifications right; overlapping a little, never much.
      const docs = [g.sheet, c, g.specs];
      for (const box of docs) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.w).toBeLessThanOrEqual(w);
        expect(box.y).toBeGreaterThanOrEqual(8);
        expect(box.y + box.h + 6).toBeLessThanOrEqual(g.caption.y - (d ? 13 : 10));
      }
      expect(g.sheet.x + g.sheet.w / 2).toBeLessThan(w * 0.33);
      expect(Math.abs(c.x + c.w / 2 - w / 2)).toBeLessThanOrEqual(2);
      expect(g.specs.x + g.specs.w / 2).toBeGreaterThan(w * 0.67);
      // Balanced: what is left of the contract mirrors what is right of it, near enough, and the margins are alike.
      expect(Math.abs(g.sheet.x - (w - (g.specs.x + g.specs.w)))).toBeLessThanOrEqual(d ? 12 : 6);
      for (const [a, b] of [
        [g.sheet, c],
        [c, g.specs],
      ]) {
        const overlap = a.x + a.w - b.x;
        expect(overlap).toBeGreaterThan(-20);
        expect(overlap).toBeLessThan(Math.min(a.w, b.w) * 0.2);
      }
      expect(g.sheet.turn * g.specs.turn).toBeLessThan(0);
      // Both promises are on the contract, in its upper part, one above the other, their labels inside it.
      for (const y of g.termY) {
        expect(y).toBeGreaterThan(c.y + (d ? 50 : 34));
        expect(y).toBeLessThan(c.y + c.h * 0.55);
      }
      expect(g.termY[1] - g.termY[0]).toBeGreaterThanOrEqual(d ? 30 : 26);
      expect(g.termX).toBeGreaterThan(c.x + (d ? 30 : 22));
      // The dice rest in the middle of the frame, on the contract, below its promises and above its signatures.
      const r = g.die / 2;
      const diceBox = { l: Math.min(...g.dice.map((die) => die.cx - r)), r: Math.max(...g.dice.map((die) => die.cx + r)), t: Math.min(...g.dice.map((die) => die.cy - r)), b: Math.max(...g.dice.map((die) => die.cy + r)) };
      expect(Math.abs((diceBox.l + diceBox.r) / 2 - w / 2)).toBeLessThanOrEqual(d ? 6 : 4);
      expect(Math.abs((diceBox.t + diceBox.b) / 2 - h / 2)).toBeLessThanOrEqual(h * 0.1);
      expect(diceBox.l).toBeGreaterThan(c.x);
      expect(diceBox.r).toBeLessThan(c.x + c.w);
      expect(diceBox.t).toBeGreaterThan(g.termY[1] + (d ? 14 : 10));
      expect(diceBox.b).toBeLessThan(c.y + c.h - (d ? 20 : 12));
      expect(g.dice[1].cx - g.dice[0].cx).toBeGreaterThanOrEqual(g.die * 0.9);
      // They roll in from beyond the right edge: across the specifications and the contract.
      expect(g.dice[0].cx + g.roll.dx - r).toBeGreaterThanOrEqual(w);
      // Six notices, alternating sides as they arrive: a column of three to the left of the dice and one to the right.
      const { w: nw, h: nh } = g.notice;
      expect(g.notices).toHaveLength(GAMBLE_NOTICES.length);
      const left = [0, 2, 4].map((i) => g.notices[i]);
      const right = [1, 3, 5].map((i) => g.notices[i]);
      /** A notice's reach once turned: how far its corners stand out from its middle. */
      const reachX = (turn: number) => (nw / 2) * Math.cos((turn * Math.PI) / 180) + (nh / 2) * Math.abs(Math.sin((turn * Math.PI) / 180));
      const reachY = (turn: number) => (nh / 2) * Math.cos((turn * Math.PI) / 180) + (nw / 2) * Math.abs(Math.sin((turn * Math.PI) / 180));
      for (const n of g.notices) {
        // Inside the frame, above the question, barely turned.
        expect(n.cx - reachX(n.turn)).toBeGreaterThanOrEqual(0);
        expect(n.cx + reachX(n.turn)).toBeLessThanOrEqual(w);
        expect(n.cy - reachY(n.turn)).toBeGreaterThanOrEqual(0);
        expect(n.cy + reachY(n.turn)).toBeLessThanOrEqual(g.caption.y - (d ? 13 : 10));
        expect(Math.abs(n.turn)).toBeLessThanOrEqual(8);
      }
      // THE DICE ARE NEVER COVERED: no notice, however it is turned, comes within a clear margin of either die.
      for (const n of left) expect(n.cx + reachX(n.turn)).toBeLessThanOrEqual(diceBox.l - (d ? 12 : 8));
      for (const n of right) expect(n.cx - reachX(n.turn)).toBeGreaterThanOrEqual(diceBox.r + (d ? 12 : 8));
      // Nor are the contract's two promises: the notices stand outside their labels.
      for (const n of left) expect(n.cx + reachX(n.turn)).toBeLessThanOrEqual(g.termX - (d ? 16 : 12));
      for (const n of right) expect(n.cx - reachX(n.turn)).toBeGreaterThanOrEqual(c.x + c.w - (d ? 14 : 12));
      // Within a column each lands low enough to leave the heading above it readable, overlapping only slightly, turned the other way.
      for (const column of [left, right]) {
        for (let i = 1; i < column.length; i++) {
          expect(column[i].cy - column[i - 1].cy).toBeGreaterThanOrEqual(nh * 0.9);
          expect(column[i].cy - column[i - 1].cy).toBeLessThanOrEqual(nh * 1.3);
          expect(Math.abs(column[i].cx - column[i - 1].cx)).toBeLessThanOrEqual(nw * 0.1);
          expect(column[i].turn * column[i - 1].turn).toBeLessThan(0);
        }
      }
      // The two columns mirror each other about the dice.
      expect(Math.abs(w - (left[0].cx + right[0].cx))).toBeLessThanOrEqual(d ? 10 : 6);
      expect(nw).toBeGreaterThanOrEqual(d ? 160 : 116);
      expect(g.die).toBeGreaterThanOrEqual(d ? 30 : 22);
      // The question runs on one line beneath it all, centred, inside the frame.
      expect(g.caption.x).toBe(w / 2);
      expect(g.caption.y).toBeGreaterThan(diceBox.b + 20);
      expect(g.caption.y).toBeLessThanOrEqual(h - (d ? 60 : 24));
      expect(GAMBLE_CAPTION.join(' ').length * (d ? 13 : 10) * 0.56).toBeLessThanOrEqual(w - 16);
      // The plan is laid inside the frame, over the documents once they have stepped back.
      expect(p.y).toBeGreaterThanOrEqual(8);
      expect(p.y + p.h).toBeLessThanOrEqual(floor);
      expect(p.x + p.w).toBeLessThanOrEqual(w - 4);
      // The plan sets out from beyond the canvas.
      expect(p.x + g.planFrom).toBeGreaterThanOrEqual(w);
      // The plan's six lines sit inside it, evenly spaced.
      const ys = GAMBLE_PLAN.lines.map((_, i) => g.lineY(i));
      expect(ys[0]).toBeGreaterThan(p.y + (d ? 56 : 40));
      expect(ys[ys.length - 1] + (d ? 12 : 9)).toBeLessThanOrEqual(p.y + p.h);
      for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(d ? 22 : 19);
      // The closing frame: the plan enlarged at the left of the stage, wholly inside the canvas with an even margin, and the hero of it.
      const L = g.lockup;
      const card = { w: p.w * L.scale, h: p.h * L.scale, cx: p.x + p.w / 2 + L.dx, cy: p.y + p.h / 2 + L.dy };
      const margin = card.cy - card.h / 2;
      expect(L.scale).toBeGreaterThan(1.1);
      expect(L.scale).toBeLessThanOrEqual(1.5);
      expect(margin).toBeGreaterThanOrEqual(d ? 24 : 10);
      expect(card.cy).toBeCloseTo(h / 2, 0);
      expect(card.cx - card.w / 2).toBeGreaterThanOrEqual(margin * 0.6);
      expect(card.h).toBeGreaterThanOrEqual(h * 0.75);
      expect(card.w).toBeGreaterThanOrEqual(w * 0.44);
      // The lockup stands to its right, clear of it: a rule, the headline on two lines, the supporting line, and whose power it is.
      expect(L.textX).toBeGreaterThanOrEqual(card.cx + card.w / 2 + (d ? 20 : 12));
      const down = [L.ruleY, ...L.headY, ...L.supportY];
      expect(down).toEqual([...down].sort((a, b) => a - b));
      expect(L.headY).toHaveLength(2);
      expect(L.headY[0] - L.ruleY).toBeGreaterThanOrEqual(L.head);
      expect(L.headY[1] - L.headY[0]).toBeGreaterThanOrEqual(L.head * 1.1);
      expect(L.supportY).toHaveLength(d ? 2 : 3);
      expect(L.supportY[0] - L.headY[1]).toBeGreaterThanOrEqual(L.support * 2);
      // The headline is the largest type in the frame; the block is centred on the card's height, inside the canvas.
      expect(L.head).toBeGreaterThanOrEqual(L.support * 1.6);
      expect(Math.abs((L.ruleY + L.supportY[L.supportY.length - 1]) / 2 - card.cy)).toBeLessThanOrEqual(d ? 12 : 8);
      // Its longest line fits beside the card (a generous estimate of its width).
      const widest = Math.max('requires a plan.'.length * L.head * 0.56, (d ? GAMBLE_PLAN.support[0].length : 'procurement plan.'.length) * L.support * 0.56);
      expect(L.textX + widest).toBeLessThanOrEqual(w - g.stage.inset - 4);
      expect(g.stage.inset).toBeLessThan(margin);
    });

    it(`${mode}: Better decisions sets the cone between the messages and the band, the options apart, and every word clear`, () => {
      const g = choiceGeometry(mode);
      const d = mode === 'desktop';
      const T = g.type;
      const C = g.cone;
      type Box = { x0: number; y0: number; x1: number; y1: number; name: string };
      const text = (name: string, x: number, base: number, words: string, size: number, opts: { caps?: boolean; tracking?: number; anchor?: 'start' | 'middle' } = {}): Box => {
        const tw = textWidth(words, size, opts);
        const x0 = opts.anchor === 'middle' ? x - tw / 2 : x;
        return { name, x0, y0: base - size * 0.75, x1: x0 + tw, y1: base + size * 0.25 };
      };
      const meet = (p: Box, q: Box) => p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1;
      const inside = (p: Box, q: Box) => p.x0 >= q.x0 && p.x1 <= q.x1 && p.y0 >= q.y0 && p.y1 <= q.y1;
      const frame: Box = { name: 'frame', x0: 2, y0: 2, x1: w - 2, y1: g.band.y - 2 };
      const W = g.card.w;
      const Hc = g.card.h;
      const topAt = (x: number) => C.cy - g.half(x);
      const bottomAt = (x: number) => C.cy + g.half(x);
      /** A card as it rests about (x, y), its soft offset included. */
      const cardBox = (name: string, x: number, y: number): Box => ({ name, x0: x - W / 2, y0: y - Hc / 2, x1: x + W / 2 + 1.2 * g.k, y1: y + Hc / 2 + 2 * g.k });
      // The cone: wide at its mouth, narrow at its tip, inside the frame, above the time axis, which is above the band.
      expect(g.half(C.x0)).toBeGreaterThan(g.half(C.x1) * 5);
      expect(C.x0).toBeGreaterThanOrEqual(frame.x0 + 10);
      expect(C.x1 + g.pressure.thick).toBeLessThanOrEqual(frame.x1 - 10);
      // Time: one unbroken axis; its words above its start, under the mouth, clear of the cone and of the ticks; the
      // marker's pointer beneath it, above the band.
      const A = g.axis;
      const time = text('time', A.label.x, A.label.y, CHOICE_WORDS.time, T.label, { caps: true, tracking: 0.08 });
      expect(time.y0).toBeGreaterThanOrEqual(bottomAt(time.x0) + 2);
      expect(time.y1).toBeLessThanOrEqual(A.y - A.tick - 1);
      expect(A.y + A.pointer.h).toBeLessThanOrEqual(g.band.y - 2);
      for (const x of A.ticks) {
        expect(x).toBeGreaterThan(A.x0);
        expect(x).toBeLessThan(A.x1);
      }
      // *More options* above the mouth, clear of the cone.
      const more = text('more', g.more.x, g.more.y, CHOICE_WORDS.more, T.label);
      expect(inside(more, frame)).toBe(true);
      expect(more.y1).toBeLessThanOrEqual(topAt(more.x1) - 2);
      // The line reaches across the cone wherever it stands (it is clipped to it).
      expect(g.start.y0).toBeLessThanOrEqual(topAt(g.start.x));
      expect(g.start.y1).toBeGreaterThanOrEqual(bottomAt(g.start.x));
      // Each card is named, *OPTION A* to *OPTION F*, legibly: at least 6.5 units, with room either side and above and below.
      expect(g.card.label).toBeGreaterThanOrEqual(6.5);
      g.cards.forEach((_, j) => {
        const name = g.name(j);
        expect(`${name.word} ${name.letter}`).toBe(`Option ${'ABCDEF'[j]}`);
        expect(textWidth(`${name.word} ${name.letter}`, g.card.label, { caps: true, tracking: 0.06 })).toBeLessThanOrEqual(W - (d ? 10 : 6));
      });
      expect(g.card.label * 0.72).toBeLessThanOrEqual(Hc - (d ? 6 : 4));
      // The cards: apart; wholly inside the cone at the mouth and at the early stop; and wherever the group goes, inside
      // the frame, clear of the messages, of the time axis and its words, and of *More options*.
      g.cards.forEach((c, j) => j && expect(c.y - g.cards[j - 1].y - Hc).toBeGreaterThanOrEqual(2.5));
      for (const x of [g.start.x, g.stop('early').x])
        for (const c of g.cards) {
          expect(x - W / 2).toBeGreaterThanOrEqual(C.x0);
          expect(g.half(x + W / 2) - Math.abs(c.y - C.cy) - Hc / 2).toBeGreaterThanOrEqual(0);
        }
      const messages = (['early', 'late'] as const).map((when) => {
        const M = g.message(CHOICE_WORDS[when]);
        expect(M.lines).toHaveLength(1);
        return M.lines.map((l, i) => text(`${when} ${i}`, M.x, l.y, l.line, T.message, { caps: true, tracking: 0.1, anchor: 'middle' }));
      });
      for (const lines of messages)
        for (const m of lines) {
          expect(inside(m, frame), m.name).toBe(true);
          expect(meet(m, more), m.name).toBe(false);
          // Above the cone along its whole width.
          expect(m.y1, m.name).toBeLessThanOrEqual(topAt(Math.max(C.x0, m.x0)) - 2);
        }
      for (const x of [g.start.x, g.stop('early').x, g.stop('late').x])
        for (const c of g.cards) {
          const card = cardBox('card', x, c.y);
          expect(inside(card, frame)).toBe(true);
          expect(card.y1).toBeLessThan(A.y - A.tick - 1);
          for (const m of messages.flat()) expect(meet(card, m), `${m.name} at ${x}`).toBe(false);
          expect(meet(card, more)).toBe(false);
          expect(meet(card, time)).toBe(false);
        }
      // The close: six options in a level row, centred, apart and inside the frame; the line about JiTpro beneath them on
      // at most two lines, each inside the frame and clear of the row; and the closing line fits the foot on its own.
      const t = g.timed;
      const cards = t.xs.map((x, j) => cardBox(`timed ${j}`, x, t.y));
      expect((t.xs[0] + t.xs[t.xs.length - 1]) / 2).toBeCloseTo(w / 2, 0);
      cards.forEach((c, j) => {
        expect(inside(c, frame), c.name).toBe(true);
        if (j) expect(c.x0 - cards[j - 1].x1).toBeGreaterThanOrEqual(4);
      });
      expect(t.support.lines.length).toBeLessThanOrEqual(2);
      expect(t.support.lines.map((l) => l.line).join(' ')).toBe(CHOICE_TIMED.support);
      for (const l of t.support.lines) {
        const line = text(l.line, t.support.x, l.y, l.line, t.support.size, { anchor: 'middle' });
        expect(inside(line, { ...frame, x0: frame.x0 + 8, x1: frame.x1 - 8 }), l.line).toBe(true);
        for (const c of cards) expect(line.y0, l.line).toBeGreaterThan(c.y1 + 6);
      }
      expect(textWidth(CHOICE_TIMED.head, g.band.head)).toBeLessThanOrEqual(w - 16);
    });
  }
});
