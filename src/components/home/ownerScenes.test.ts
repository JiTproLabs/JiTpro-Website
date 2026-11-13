import { describe, expect, it } from 'vitest';
import { HOME_AUDIENCES } from '../../content/homeAudiences';
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
  OWNER_TABS,
  OWNER_TAKEAWAY,
  TEAM,
  TEAM_CONTRACTOR,
  TEAM_FOOT,
  TEAM_MARK,
  TEAM_PARTIES,
  TEAM_RUSH,
  TEAM_WASTE_ROUNDS,
  SWEEP_HAND,
  boxCorners,
  CHOICE_COUNT,
  CHOICE_KNOWN,
  LANDING_FOOT,
  LANDING_WORDS,
  WINDOW_CLOSE,
  WINDOW_CLOSE_SUPPORT,
  WINDOW_LOSS_REASONS,
  WINDOW_SHAPE,
  WINDOW_STAGES,
  WINDOW_WORDS,
  buildOwnerScene,
  windowCloseSupportSize,
  windowGeometry,
  cueStateAt,
  gambleGeometry,
  houseBackdrop,
  isOwnerTab,
  landingGeometry,
  ownerStateAt,
  requestLabel,
  textWidth,
  shieldPath,
  teamFootHead,
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
    // Weak planning costs each group something of its own: two requests, and what they add up to (founder, 2026-11-12).
    expect(TEAM.map((t) => [...t.requests])).toEqual([['Surprise', 'Rushed decision'], ['ASAP', 'No priority'], ['ASAP', 'No priority'], ['Rushed deadlines', 'Rescheduled']]);
    expect(TEAM.map((t) => t.effect)).toEqual(['Last-minute decisions', 'Competing urgent requests', 'Competing urgent requests', 'Stop-start work']);
    // And one calm word each once the contractor is in control. No two alike.
    expect(TEAM.map((t) => t.calm)).toEqual(['In control', 'Aligned', 'Coordinated', 'Ready']);
    expect(new Set(TEAM.map((t) => t.calm)).size).toBe(TEAM.length);
    expect(OWNER_TAKEAWAY['owner-protect-investment']).toBe('Early, precise procurement planning protects your investment.');
    expect(OWNER_TAKEAWAY['owner-protect-investment']).not.toBe(OWNER_TAKEAWAY['owner-reduce-risk']);
    expect(TEAM_MARK).toBe('JiTpro');
    // The foot of each state, in the founder's words: a line, and a phrase beneath it. The second state's line is the closing line.
    // The founder's words, exactly (2026-11-13): about the planning process, never the contractor as problem or hero.
    expect(TEAM_FOOT.out).toEqual({ head: 'Weak procurement planning creates waste across the entire project.', support: 'More disruption. Higher costs. Greater risk to your investment.' });
    expect(TEAM_FOOT.in).toEqual({ head: 'Early, precise procurement planning protects your investment.', support: 'Less disruption. Better coordination. Greater cost control.' });
    expect(Object.values({ ...TEAM_FOOT.out, ...TEAM_FOOT.in }).join(' ')).not.toMatch(/contractor/i);
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
    const words = [...TEAM.flatMap((t) => [t.label, t.effect, t.calm, ...t.requests]), ...TEAM_CONTRACTOR.lines, TEAM_CONTRACTOR.short].join(' | ');
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
          // Better decisions follows the founder's pacing: three discoveries and four losses, each paused on (2026-11-13).
          expect(scene.end).toBeLessThanOrEqual(tab === 'owner-better-decisions' ? 35000 : 26000);
        });

        it('opens empty, ends on its takeaway, and rests', () => {
          // Nothing is shown at the start but what is meant to be there from the first frame: a cue with no duration at
          // the start (Protect your investment's sheet, foot bar, foot words and state name, 2026-11-13).
          const first = new Set(scene.cues.filter((c) => c.at === 0 && c.dur === 0).map((c) => c.k));
          for (const [key, s] of Object.entries(at(0))) expect(s.o, key).toBe(first.has(key) ? 1 : 0);
          const end = at(scene.end);
          expect(end.takeaway).toEqual({ o: 1, ty: 0, draw: 1, mx: 0, my: 0, rot: 0, sc: 1, sx: 1 });
          // The takeaway is the last thing to appear, and is given time to be read. In Protect your investment it is the
          // second scene's foot words, which open that scene before its illustration (founder, 2026-11-13).
          const takeaway = scene.cues.find((c) => c.k === 'takeaway')!;
          if (tab === 'owner-protect-investment') expect(takeaway.at).toBeLessThan(scene.cues.find((c) => c.k === 'guard')!.at);
          // More predictability's foot words are there from the first frame (founder, 2026-11-13).
          else if (tab === 'owner-predictability') expect([takeaway.at, takeaway.dur]).toEqual([0, 0]);
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

  it('Protect your investment: two scenes, each message first, illustration second, held, and the first faded out as one', () => {
    const k = (key: string) => cueAt('owner-protect-investment', key);
    const scene = buildOwnerScene('owner-protect-investment', 'desktop');
    const at = (t: number) => ownerStateAt(scene, t);
    const idx = TEAM.map((_, i) => i);
    const n = idx.length;
    const rush = TEAM_RUSH.map((_, i) => k(`rush-${i}`));
    const friction = idx.map((i) => k(`friction-${i}`));
    const effects = idx.map((i) => k(`effect-${i}`));
    const cards = idx.map((i) => k(`card-${i}`));
    const cardsIn = idx.map((i) => k(`cardIn-${i}`));
    const bills = scene.cues.filter((c) => c.k.startsWith('bill-'));
    // No heading names either scene (founder, 2026-11-13).
    expect(scene.cues.some((c) => /^state/.test(c.k))).toBe(false);
    // THE FRAME: the sheet and the foot's bar are there from the first frame and never leave.
    for (const key of ['ground', 'foot']) {
      expect([k(key).at, k(key).dur, k(key).out]).toEqual([0, 0, undefined]);
      for (let t = 0; t <= scene.end + 5000; t += 50) expect(at(t)[key].o).toBe(1);
    }
    expect(scene.cues.some((c) => c.k === 'footOut' || c.k === 'band')).toBe(false);

    // SCENE 1. Message first: the words fade in (500 to 800 ms) on an otherwise empty frame; then, after a short pause,
    // the contractor; then the four groups; then the disorder, at its own pace.
    const words1 = k('footOutWords');
    expect(words1.at).toBeGreaterThan(0);
    expect(words1.dur).toBeGreaterThanOrEqual(500);
    expect(words1.dur).toBeLessThanOrEqual(800);
    const wordsIn = words1.at + words1.dur!;
    expect(k('loose').at - wordsIn).toBeGreaterThanOrEqual(300);
    expect(k('loose').at - wordsIn).toBeLessThanOrEqual(500);
    for (const c of scene.cues) if (!['ground', 'foot', 'footOutWords'].includes(c.k)) expect(c.at, c.k).toBeGreaterThanOrEqual(k('loose').at);
    expect(k('loose').rise ?? k('loose').from ?? k('loose').move).toBeUndefined();
    expect(cards.map((c) => c.at)).toEqual([...cards.map((c) => c.at)].sort((a, b) => a - b));
    expect(cards[0].at).toBeGreaterThanOrEqual(k('loose').at + k('loose').dur!);
    for (const c of cards) expect(c.rise ?? c.from ?? c.move).toBeUndefined();
    // The disorder keeps its order and pace: friction outward, requests along it, what each group pays, more requests;
    // a dumpster, and bills from all five in turn, each a little sooner than the last.
    friction.forEach((c, i) => {
      expect(c.at).toBeGreaterThanOrEqual(cards[n - 1].at + cards[n - 1].dur!);
      expect(c.draw).toBe(true);
      expect(rush[i].at).toBeGreaterThan(c.at);
    });
    const firstRound = rush.slice(0, n);
    const secondRound = rush.slice(n);
    const landedOnce = Math.max(...firstRound.map((r) => r.at + r.dur!));
    for (const e of effects) expect(e.at).toBeGreaterThanOrEqual(landedOnce);
    for (const r of secondRound) expect(r.at).toBeGreaterThanOrEqual(Math.max(...effects.map((e) => e.at)) + 350);
    expect([...TEAM_PARTIES]).toEqual(['gc', 0, 1, 2, 3]);
    expect(bills).toHaveLength(TEAM_WASTE_ROUNDS * (n + 1));
    const gaps = bills.slice(1).map((b, j) => b.at - bills[j].at);
    for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(90);
    expect(gaps).toEqual([...gaps].sort((a, b) => b - a));
    expect(bills[0].at).toBeGreaterThan(k('bin').at);
    for (const b of bills) expect(b.out).toBe(b.arc!.at + b.arc!.dur);
    // Complete once the last request has landed and the last bill is in; HELD, with nothing moving, 3 to 4 s.
    const done1 = Math.max(...rush.map((r) => r.at + r.dur!), ...bills.map((b) => b.out! + b.outDur!));
    const out1 = words1.out!;
    expect(out1 - done1).toBeGreaterThanOrEqual(3000);
    expect(out1 - done1).toBeLessThanOrEqual(4000);
    // THEN IT FADES OUT AS ONE: every element of the scene, its words included, leaves at the same moment over the same
    // 600 to 900 ms. The bar stays.
    const scene1 = [words1, k('loose'), ...cards, ...friction, ...rush, ...effects, k('bin'), k('binBack')];
    for (const c of scene1) {
      expect([c.out, c.outDur], c.k).toEqual([out1, words1.outDur]);
      expect(c.outTo ?? 0).toBe(0);
    }
    expect(words1.outDur).toBeGreaterThanOrEqual(600);
    expect(words1.outDur).toBeLessThanOrEqual(900);
    const clear = out1 + words1.outDur!;
    const live = (t: number) => Object.entries(at(t)).filter(([key, st]) => !['ground', 'foot'].includes(key) && st.o > 0).map(([key]) => key);
    expect(live(clear)).toEqual([]);

    // SCENE 2. After a short beat on the clear frame, the same way: the words fade in; after a short pause, the shield is
    // drawn and stands; then the four groups; then a level line reaches each, it settles, and value is kept.
    const words2 = k('takeaway');
    expect(words2.at - clear).toBeGreaterThanOrEqual(200);
    expect(words2.at - clear).toBeLessThanOrEqual(500);
    expect(words2.dur).toBe(words1.dur);
    expect(words2.out).toBeUndefined();
    for (const c of scene.cues) if (c.at > clear && c.k !== 'takeaway') expect(c.at, c.k).toBeGreaterThanOrEqual(words2.at + words2.dur! + 300);
    const guard = k('guard');
    expect(guard.at - (words2.at + words2.dur!)).toBeLessThanOrEqual(500);
    expect(guard.draw).toBe(true);
    expect(k('shield').at).toBeGreaterThan(guard.at);
    expect(cardsIn[0].at).toBeGreaterThanOrEqual(k('shield').at + k('shield').dur!);
    cardsIn.forEach((c, i) => {
      expect(c.out).toBeUndefined();
      if (i) expect(c.at).toBeGreaterThan(cardsIn[i - 1].at);
    });
    const links = idx.map((i) => k(`link-${i}`));
    links.forEach((link, i) => {
      expect(link.at).toBeGreaterThanOrEqual(cardsIn[n - 1].at + cardsIn[n - 1].dur!);
      expect(k(`calm-${i}`).at).toBeGreaterThan(link.at);
      expect(k(`calm-${i}`).at).toBeLessThanOrEqual(link.at + link.dur!);
      if (i > 0) expect(link.at - links[i - 1].at).toBe(links[1].at - links[0].at);
    });
    expect(TEAM.map((t) => t.calm)).toEqual(['In control', 'Aligned', 'Coordinated', 'Ready']);
    const keeps = [...idx.map((i) => k(`keep-${i}`)), k('keep-gc')];
    keeps.forEach((c, j) => {
      expect(c.at).toBeGreaterThanOrEqual(k(`calm-${n - 1}`).at);
      if (j) expect(c.at - keeps[j - 1].at).toBeGreaterThanOrEqual(150);
    });
    // Held, complete, at least 3 s, and it rests there: the visual plays once and does not restart, so the outcome is its
    // last frame (and reduced motion's). Its words are on the bar throughout scene 2.
    const done2 = Math.max(...scene.cues.map((c) => c.at + (c.dur ?? 350)));
    expect(scene.end - done2).toBeGreaterThanOrEqual(3000);
    for (let t = words2.at + words2.dur!; t <= scene.end + 5000; t += 50) expect(at(t).takeaway.o).toBe(1);
    // The words are blank only at the very start (before the first fade) and in the short beat between scenes.
    let blank = 0;
    for (let t = wordsIn; t <= scene.end; t += 10) if (at(t).footOutWords.o + at(t).takeaway.o < 0.05) blank += 10;
    expect(blank).toBeLessThanOrEqual(words1.outDur! / 2 + 500 + words2.dur! / 2);
    expect(scene.end).toBeLessThanOrEqual(26000);
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

  it('More predictability: one aircraft on one stable approach; the projected finish narrows into the planned finish as each waypoint appears; it lands there', () => {
    const k = (key: string) => cueAt('owner-predictability', key);
    const scene = buildOwnerScene('owner-predictability', 'desktop');
    const g = landingGeometry('desktop');
    const at = (t: number) => ownerStateAt(scene, t);
    // The founder's words, exactly (2026-11-13); no promise, no amount.
    expect(LANDING_FOOT).toEqual({ head: 'Better procurement planning helps your project stay on course.', support: 'More predictable schedules. Better cost control. Greater confidence in the finish.' });
    expect(OWNER_TAKEAWAY['owner-predictability']).toBe(LANDING_FOOT.head);
    expect(LANDING_WORDS.gates).toEqual(['Requirements identified', 'Commitments scheduled', 'Deliveries coordinated']);
    expect(LANDING_WORDS.forecast).toBe('Projected finish');
    expect(LANDING_WORDS.target).toBe('Planned completion zone');
    expect(LANDING_WORDS.delayLines.join(' · ').toLowerCase()).toBe(LANDING_WORDS.delay.toLowerCase());
    const words = [...Object.values(LANDING_FOOT), LANDING_WORDS.target, LANDING_WORDS.delay, LANDING_WORDS.forecast, ...LANDING_WORDS.gates, ...LANDING_WORDS.gatesShort].join(' | ');
    expect(words).not.toMatch(/\d|\$|%|guarantee|always|never|eliminate|crash/i);
    // ONE of each: one aircraft, one approach, one runway, one planned finish.
    for (const key of ['plane', 'glide', 'runway', 'target', 'delay']) expect(scene.cues.filter((c) => c.k === key)).toHaveLength(1);
    // The foot and its words are there from the first frame and never change: never blank.
    for (const key of ['foot', 'takeaway']) expect([k(key).at, k(key).dur, k(key).out]).toEqual([0, 0, undefined]);
    for (let t = 0; t <= scene.end + 5000; t += 50) {
      expect(at(t).foot.o).toBe(1);
      expect(at(t).takeaway.o).toBe(1);
    }
    // A STABLE APPROACH: one even curve from the start to touchdown, along the planned approach; never above or below it.
    const fly = k('fly').arc!;
    expect(fly.even).toBe(true);
    const pos = (t: number) => {
      const st = at(t);
      return { x: g.start.x + st.fly.mx + st.roll.mx + st.settle.mx, y: g.start.y + st.fly.my + st.roll.my + st.settle.my, rot: st.fly.rot + st.roll.rot + st.settle.rot };
    };
    let last = pos(fly.at);
    let pace = 0;
    for (let t = fly.at + 20; t <= fly.at + fly.dur; t += 20) {
      const p = pos(t);
      expect(Math.abs(p.y - g.approachY(p.x)), `on the approach at ${t}`).toBeLessThan(0.5);
      // Forward and down, at a steady pace: no stops, no sudden changes.
      expect(p.x).toBeGreaterThan(last.x);
      expect(p.y).toBeGreaterThanOrEqual(last.y - 1e-9);
      const v = p.x - last.x;
      if (pace) expect(Math.abs(v - pace)).toBeLessThan(pace * 0.25);
      pace = v;
      last = p;
    }
    // A shallow approach: no steeper than about 25 degrees anywhere, and flatter at the flare than at the start.
    const slope = (x: number) => (g.approachY(x + 1) - g.approachY(x - 1)) / 2;
    for (let x = g.start.x + 2; x < g.touchdown.x - 2; x += 2) expect(Math.atan(slope(x)) * (180 / Math.PI)).toBeLessThanOrEqual(26);
    expect(slope(g.touchdown.x - 4)).toBeLessThan(slope(g.start.x + 4));
    // A gentle flare: the nose lifts three degrees by touchdown; on the main gear first, the nose settles within a second.
    expect(pos(fly.at + fly.dur).rot).toBeCloseTo(-3, 6);
    const settle = k('settle').move!;
    expect(settle.at).toBe(fly.at + fly.dur);
    expect(settle.dur).toBeLessThanOrEqual(1000);
    expect(pos(settle.at + settle.dur).rot).toBeCloseTo(0, 6);
    expect(pos(scene.end).rot).toBeCloseTo(0, 6);
    // Wheels stay on the runway from touchdown to the stop.
    for (let t = fly.at + fly.dur; t <= scene.end; t += 25) expect(pos(t).y).toBeCloseTo(g.runway.y, 6);
    // The rollout sets off at the approach's own pace and slows to rest.
    const roll = k('roll').move!;
    expect(roll.ease).toBe('out');
    expect(roll.at).toBe(fly.at + fly.dur);
    const rollStart = (pos(roll.at + 20).x - pos(roll.at).x) / 20;
    const flyEnd = (pos(roll.at).x - pos(roll.at - 20).x) / 20;
    expect(Math.abs(rollStart - flyEnd)).toBeLessThan(flyEnd * 0.35);
    // THE FORECAST: wide and red in the added-cost zone at first; after each waypoint narrower and nearer the planned finish;
    // inside it, amber, at the last.
    const F = g.forecast;
    expect(F[0].x - F[0].w / 2).toBeGreaterThanOrEqual(g.delay.x0);
    expect(F[3].x - F[3].w / 2).toBeGreaterThanOrEqual(g.target.x0);
    expect(F[3].x + F[3].w / 2).toBeLessThanOrEqual(g.target.x1);
    F.forEach((f, i) => {
      if (!i) return;
      expect(f.w).toBeLessThan(F[i - 1].w);
      expect(f.x).toBeLessThan(F[i - 1].x);
    });
    g.gates.forEach((gate, i) => {
      // Each waypoint lies on the approach, appears ahead of the aircraft, and the forecast moves with it, as one eased move.
      expect(gate.y).toBeCloseTo(g.approachY(gate.x), 6);
      const appear = k(`gate-${i}`).at;
      const pass = k(`pass-${i}`).at;
      expect(pass - appear).toBeGreaterThanOrEqual(1200);
      expect(pos(appear).x).toBeLessThan(gate.x);
      expect(Math.abs(pos(pass).x - gate.x)).toBeLessThan(2);
      const move = k(`f-${i}`).move!;
      const narrow = k(`fw-${i}`).move!;
      expect([move.at, narrow.at, move.dur]).toEqual([appear, appear, narrow.dur]);
      expect(move.dx).toBeCloseTo(F[i + 1].x - F[i].x, 6);
      expect(narrow.scaleX).toBeCloseTo(F[i + 1].w / F[i].w, 9);
      if (i) expect(appear).toBeGreaterThan(k(`gate-${i - 1}`).at + move.dur);
    });
    // Its centre and width, followed through the story: continuous, and only ever narrowing and moving toward the target.
    let prev = { x: Infinity, w: Infinity };
    for (let t = 0; t <= scene.end; t += 25) {
      const st = at(t);
      const x = F[0].x + [0, 1, 2].reduce((n, i) => n + st[`f-${i}`].mx, 0);
      const wNow = F[0].w * [0, 1, 2].reduce((n, i) => n * st[`fw-${i}`].sx, 1);
      expect(x).toBeLessThanOrEqual(prev.x + 1e-9);
      expect(wNow).toBeLessThanOrEqual(prev.w + 1e-9);
      prev = { x, w: wNow };
    }
    expect(prev.x).toBeCloseTo(F[3].x, 6);
    expect(prev.w).toBeCloseTo(F[3].w, 6);
    // Red until the last waypoint brings it inside, then amber, read there for at least half a second; its words give way as
    // the aircraft passes the last waypoint, and its band, on the planned finish, as the aircraft touches down on it.
    expect(k('forecastLate').out).toBe(k('forecastOn').at);
    expect(k('forecastOn').at).toBeGreaterThanOrEqual(k('gate-2').at);
    expect(k('forecastLabel').out! - (k('f-2').move!.at + k('f-2').move!.dur)).toBeGreaterThanOrEqual(500);
    expect(k('forecastLabel').out).toBe(k('pass-2').at);
    expect(k('forecast').out).toBe(roll.at + roll.dur);
    // THE RUNWAY: a long planned completion zone, then a boundary, then the overrun.
    const zone = g.target.x1 - g.target.x0;
    expect(zone).toBeGreaterThanOrEqual(2 * (g.planeSpan.back + g.planeSpan.front) * 0.85);
    expect(g.boundary.x).toBeGreaterThan(g.target.x1);
    expect(g.boundary.x).toBeLessThan(g.delay.x0);
    // It lands: the main gear touches down in the first third of the planned zone; it rolls out and comes to a complete
    // stop wholly inside the zone, with runway left (at least a fifth of the zone) before the boundary; it never reaches
    // the overrun.
    expect(g.touchdown.x).toBeGreaterThan(g.target.x0);
    expect(g.touchdown.x).toBeLessThanOrEqual(g.target.x0 + zone / 3);
    const rest = pos(scene.end);
    expect(rest.x).toBeCloseTo(g.rollout.x, 6);
    expect(rest.y).toBeCloseTo(g.runway.y, 6);
    expect(rest.x - g.planeSpan.back).toBeGreaterThanOrEqual(g.target.x0);
    expect(g.target.x1 - (rest.x + g.planeSpan.front)).toBeGreaterThanOrEqual(zone / 5);
    for (let t = 0; t <= scene.end; t += 25) expect(pos(t).x + g.planeSpan.front).toBeLessThan(g.boundary.x);
    // It decelerates smoothly to a stop: never faster than at touchdown, slower and slower, and still at the end.
    let v0 = Infinity;
    for (let t = roll.at; t < roll.at + roll.dur; t += 50) {
      const v = pos(t + 50).x - pos(t).x;
      expect(v).toBeLessThanOrEqual(v0 + 1e-9);
      expect(v).toBeGreaterThanOrEqual(0);
      v0 = v;
    }
    expect(pos(roll.at + roll.dur + 500).x).toBeCloseTo(pos(roll.at + roll.dur).x, 9);
    // The stop marker comes in as it stops; the forecast's band, under the stopping point, gives way then.
    expect(k('stop').at).toBe(roll.at + roll.dur);
    expect(g.forecast[3].x).toBeCloseTo(g.rollout.x, 6);
    expect(k('landed').at).toBeGreaterThanOrEqual(roll.at + roll.dur);
    const end = at(scene.end);
    for (const key of ['landed', 'stop', 'target', 'aim', 'boundary', 'targetLabel', 'delay', 'glide', ...g.gates.map((_, i) => `pass-${i}`)]) expect(end[key].o, key).toBe(1);
    expect(end.forecast.o).toBe(0);
    expect(end.forecastLabel.o).toBe(0);
  });

  it('Better decisions: 3 known choices, 3 discovered one at a time, 6 viable, 4 lost one at a time, 2 remain; then the close', () => {
    const k = (key: string) => cueAt('owner-better-decisions', key);
    const scene = buildOwnerScene('owner-better-decisions', 'desktop');
    const g = windowGeometry('desktop');
    const at = (t: number) => ownerStateAt(scene, t);
    // The founder's words, exactly (2026-11-13).
    expect(WINDOW_STAGES.early).toEqual({ heading: 'Information still developing', foot: { head: 'Premature decisions can limit your choices.', support: 'Incomplete information. Unnecessary commitments.' } });
    expect(WINDOW_STAGES.right).toEqual({ heading: 'The right time to decide', foot: { head: 'The right timing preserves your choices.', support: 'Enough information. Enough time. Better decisions.' } });
    expect(WINDOW_STAGES.late).toEqual({ heading: 'Options become limited', foot: { head: 'Delayed decisions can eliminate your options.', support: 'Less time. Fewer choices. Greater pressure.' } });
    expect(WINDOW_CLOSE).toBe('Correctly timed information and decisions protect your options.');
    expect(WINDOW_CLOSE_SUPPORT).toBe('JiTpro helps your contractor plan early and communicate exactly when decisions are needed.');
    expect(OWNER_TAKEAWAY['owner-better-decisions']).toBe(WINDOW_CLOSE);
    expect(WINDOW_WORDS).toEqual({
      now: 'Now',
      time: 'Time passes',
      zones: ['Too early', 'Right time', 'Too late'],
      choice: 'Choice',
      known: 'Known options',
      six: 'Six viable options',
      two: 'Only two viable options remain',
      found: 'New option discovered',
    });
    // Why each is lost, in order (founder, 2026-11-13): no generic callout remains.
    expect(WINDOW_LOSS_REASONS).toEqual(['Lead time too long', 'Production slot lost', 'Price no longer viable', 'Approval time exhausted']);
    expect(Object.values(WINDOW_WORDS).flat().join(' | ')).not.toMatch(/no longer (viable|available)/i);
    expect(g.cards.map((_, j) => `${g.name(j).word} ${g.name(j).letter}`)).toEqual(['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5', 'Choice 6']);

    // The states at the three stops: three known (the others not drawn at all); six; two, four lost.
    const count = (when: 'early' | 'right' | 'late', state: string) => g.stop(when).states.filter((x) => x === state).length;
    expect(g.stop('early').states).toEqual(['available', 'available', 'available', 'undiscovered', 'undiscovered', 'undiscovered']);
    expect([count('right', 'available'), count('right', 'unavailable')]).toEqual([6, 0]);
    expect([count('late', 'available'), count('late', 'unavailable')]).toEqual([2, 4]);
    // Lost one at a time, in place, as the corridor narrows: Choices 6, 1, 5, 2; Choices 3 and 4 remain.
    expect(g.changes.map((c) => [c.option + 1, c.to])).toEqual([[6, 'unavailable'], [1, 'unavailable'], [5, 'unavailable'], [2, 'unavailable']]);
    expect(g.stop('late').states.map((x, j) => (x === 'available' ? j + 1 : 0)).filter(Boolean)).toEqual([3, 4]);
    for (const c of g.changes) expect(c.x).toBeGreaterThan(g.shape.peak);
    g.changes.forEach((c, n) => n && expect(c.x - g.changes[n - 1].x).toBeGreaterThanOrEqual(8));

    // An undiscovered choice is not on the picture: nothing of it is drawn until it is found.
    for (const j of [3, 4, 5]) {
      const found = k(`card-${j}`).at;
      for (let t = 0; t < found; t += 50) for (const key of [`card-${j}`, `glow-${j}`, `found-${j}`]) expect(at(t)[key].o, `${key} at ${t}`).toBe(0);
    }
    expect(scene.cues.some((c) => /^prov-/.test(c.k))).toBe(false);
    for (const j of [0, 1, 2]) expect(k(`card-${j}`).at).toBeLessThan(3000);

    // The group moves in legs, the marker and the stack together, and stops at each discovery and each loss.
    const legs = scene.cues.filter((c) => /^leg-/.test(c.k));
    expect(legs).toHaveLength(g.discover.length + 1 + g.changes.length + 1);
    legs.forEach((l, n) => {
      expect(l.move!.dx).toBeGreaterThan(0);
      if (n) expect(l.move!.at).toBeGreaterThan(legs[n - 1].move!.at + legs[n - 1].move!.dur);
    });
    const stops = [g.stop('early').x];
    for (const l of legs) stops.push(stops[stops.length - 1] + l.move!.dx);
    expect(stops.map((x) => Math.round(x))).toEqual([g.stop('early').x, ...g.discover, g.stop('right').x, ...g.changes.map((c) => c.x), g.stop('late').x].map((x) => Math.round(x)));
    const groupX = (t: number) => g.stop('early').x + legs.reduce((sum, l) => sum + at(t)[l.k].mx, 0);

    // Each discovery, one at a time, while the group stands still: the card arrives as the stack moves up half a step;
    // an amber outline and *New option discovered*; read at least half a second; then the callout and outline go and the card stays.
    const discoveries = [3, 4, 5].map((j) => ({ j, card: k(`card-${j}`), glow: k(`glow-${j}`), note: k(`found-${j}`), shift: k(`shift-${j}`) }));
    discoveries.forEach((d, n) => {
      expect(d.shift.move).toMatchObject({ at: d.card.at, dx: 0, dy: -g.stackStep });
      expect(Math.abs(groupX(d.card.at) - g.discover[n])).toBeLessThan(0.01);
      expect(groupX(d.note.out! + d.note.outDur!)).toBeCloseTo(g.discover[n], 6);
      expect(d.note.at).toBeGreaterThanOrEqual(d.card.at);
      expect(d.note.out! - (d.note.at + d.note.dur!)).toBeGreaterThanOrEqual(500);
      expect([d.glow.out, d.glow.outDur]).toEqual([d.note.out, d.note.outDur]);
      expect(d.card.out).toBe(k('card-0').out);
      if (n) expect(d.card.at).toBeGreaterThan(discoveries[n - 1].note.out! + discoveries[n - 1].note.outDur!);
    });
    // The known label goes with the first discovery; six viable at the right time; two remain at the end.
    expect(k('statusKnown').out).toBe(discoveries[0].card.at);
    const right = k('headRight');
    expect(k('statusSix').at).toBeGreaterThan(right.at);
    expect(k('statusSix').at).toBeGreaterThan(discoveries[2].note.out!);
    // The right time is held 4 to 5 s, the longest hold.
    const lossLegs = legs.slice(g.discover.length + 1);
    const held = lossLegs[0].move!.at - legs[g.discover.length].move!.at - legs[g.discover.length].move!.dur;
    expect(held).toBeGreaterThanOrEqual(4000);
    expect(held).toBeLessThanOrEqual(5000);

    // Each loss, one at a time, while the group stands at the point where the choice no longer fits: a red outline and its
    // reason; read 0.5 to 0.8 s; the red X; the reason and outline go; the card stays, crossed out.
    const losses = g.changes.map((c) => ({ c, warn: k(`warn-${c.option}`), note: k(`lost-${c.option}`), off: k(`off-${c.option}`) }));
    losses.forEach((l, n) => {
      expect(Math.abs(groupX(l.warn.at) - l.c.x)).toBeLessThan(0.01);
      expect(groupX(l.note.out! + l.note.outDur!)).toBeCloseTo(l.c.x, 6);
      expect(l.off.at - (l.note.at + l.note.dur!)).toBeGreaterThanOrEqual(500);
      expect(l.off.at - (l.note.at + l.note.dur!)).toBeLessThanOrEqual(800);
      expect(l.note.out).toBeGreaterThanOrEqual(l.off.at + l.off.dur!);
      expect([l.warn.out, l.warn.outDur]).toEqual([l.note.out, l.note.outDur]);
      expect(l.off.out).toBe(k('card-0').out);
      if (n) expect(l.warn.at).toBeGreaterThan(losses[n - 1].note.out! + losses[n - 1].note.outDur!);
    });
    expect(k('statusTwo').at).toBeGreaterThan(losses[losses.length - 1].note.out!);
    expect(k('takeaway').at - k('headLate').at).toBeGreaterThanOrEqual(4000);

    // The window comes in on the last leg into it; the haze clears on the way in; the risk comes on only on the way out.
    const intoWindow = legs[g.discover.length];
    expect(k('window').at).toBe(intoWindow.move!.at);
    expect(k('haze').out).toBe(legs[0].move!.at);
    expect(k('pressure').at).toBeGreaterThan(lossLegs[0].move!.at);
    // The foot: the bar never leaves; only its words change, one set at a time.
    expect(k('foot').out).toBeUndefined();
    const feet = ['footEarly', 'footRight', 'footLate', 'takeaway'];
    for (let t = k('footEarly').at; t <= scene.end; t += 50) {
      expect(at(t).foot.o).toBe(1);
      expect(feet.filter((f) => at(t)[f].o > 0.5).length).toBeLessThanOrEqual(1);
    }
    // No choice is made: no selection, no check mark.
    expect(scene.cues.some((c) => /select|check|chosen/.test(c.k))).toBe(false);
    // It rests on the close, which reduced motion shows at once: the corridor, its window and stage names, the six choices
    // all available, and the closing line; none of the moving group, its labels, the callouts, the headings or the risk.
    const rest = at(scene.end);
    for (const key of ['ground', 'cone', 'window', 'zones', 'axis', 'foot', 'takeaway', ...g.cards.map((_, j) => `rest-${j}`)]) expect(rest[key].o, key).toBe(1);
    for (const key of ['marker', 'pressure', 'haze', 'headEarly', 'headRight', 'headLate', 'footEarly', 'footRight', 'footLate', 'statusKnown', 'statusSix', 'statusTwo', ...g.cards.map((_, j) => `card-${j}`)])
      expect(rest[key].o, key).toBe(0);
    for (const c of g.changes) for (const key of [`off-${c.option}`, `warn-${c.option}`, `lost-${c.option}`]) expect(rest[key].o, key).toBe(0);
    expect(k('rest-0').at).toBeGreaterThanOrEqual(k('marker').out! + k('marker').outDur!);
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
      // No heading names the state (founder, 2026-11-13); the words checked are the cards' and what lands on them.
      const words: Box[] = [];
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
      // Each line of the foot fits on one line, at one size: the band's own, or a half-point step smaller where the
      // founder's longer line needs it (2026-11-13), never much smaller.
      const size = teamFootHead(mode);
      expect(size).toBeLessThanOrEqual(B.head);
      expect(size).toBeGreaterThanOrEqual(B.head * 0.9);
      for (const line of [TEAM_FOOT.out.head, TEAM_FOOT.in.head]) expect(textWidth(line, size)).toBeLessThanOrEqual(w - 16);
      for (const line of [TEAM_FOOT.out.support, TEAM_FOOT.in.support]) expect(textWidth(line, B.support)).toBeLessThanOrEqual(w - 16);
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

    it(`${mode}: More predictability sets the runway above the band, its zones labelled, and every word clear of the approach and the aircraft`, () => {
      const g = landingGeometry(mode);
      const T = g.type;
      type Box = { x0: number; y0: number; x1: number; y1: number; name: string };
      const text = (name: string, x: number, base: number, words: string, size: number, anchor: 'middle' | 'end'): Box => {
        const tw = textWidth(words, size, { caps: true, tracking: 0.08 });
        const x0 = anchor === 'middle' ? x - tw / 2 : x - tw;
        return { name, x0, y0: base - size * 0.75, x1: x0 + tw, y1: base + size * 0.25 };
      };
      const meet = (p: Box, q: Box) => p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1;
      const inside = (p: Box, q: Box) => p.x0 >= q.x0 && p.x1 <= q.x1 && p.y0 >= q.y0 && p.y1 <= q.y1;
      const frame: Box = { name: 'frame', x0: 2, y0: 2, x1: w - 2, y1: g.band.y - 2 };
      const R = g.runway;
      expect(R.x0).toBeLessThan(g.target.x0);
      expect(g.target.x1).toBeLessThan(g.delay.x0);
      expect(g.delay.x1).toBeLessThanOrEqual(R.x1);
      expect(R.y + R.h).toBeLessThanOrEqual(g.ground.y + 0.01);
      const target = text('target', (g.target.x0 + g.target.x1) / 2, g.labelY, LANDING_WORDS.target, T.zone, 'middle');
      const delay = LANDING_WORDS.delayLines.map((line, i) => text(line, (g.delay.x0 + g.delay.x1) / 2, g.labelY + i * g.labelStep, line, T.zone, 'middle'));
      for (const b of [target, ...delay]) {
        expect(inside(b, frame), b.name).toBe(true);
        expect(b.y0).toBeGreaterThan(g.ground.y);
      }
      for (const b of delay) {
        expect(meet(target, b)).toBe(false);
        expect(b.x0).toBeGreaterThanOrEqual(g.boundary.x);
      }
      // The projected finish's label, at each of its four places, inside the frame and above the runway.
      for (const f of g.forecast) {
        const b = text('forecast', f.x, R.y - g.forecastLabel, LANDING_WORDS.forecast, T.label, 'middle');
        expect(inside(b, frame)).toBe(true);
        expect(b.y1).toBeLessThan(R.y);
        // Clear of the boundary post (and its cap) wherever it passes.
        expect(b.y1).toBeLessThan(R.y - g.boundary.h - 2.5 * g.k);
      }
      // The waypoints' labels: beneath and left of the approach, inside the frame, clear of it, of the runway and of each other.
      const labels = g.gates.map((gate, i) => text(`gate ${i}`, gate.x - g.gateLabel.dx, gate.y + g.gateLabel.dy, gate.label, T.label, 'end'));
      for (const b of labels) {
        expect(inside(b, frame), b.name).toBe(true);
        expect(b.y1).toBeLessThan(R.y - 2);
        // Clear of the runway's near end.
        expect(b.x1).toBeLessThan(R.x0 - 2);
        for (let x = Math.max(b.x0, g.start.x); x <= b.x1; x += 1) expect(b.y0, `${b.name} vs approach at ${x}`).toBeGreaterThan(g.approachY(x) + 1);
      }
      labels.forEach((b, i) => i && expect(meet(b, labels[i - 1])).toBe(false));
      // The aircraft, wherever it is once in view, is inside the frame and never covers a waypoint's label or the forecast's.
      const scene = buildOwnerScene('owner-predictability', mode);
      const s = g.plane;
      for (let t = 0; t <= scene.end; t += 25) {
        const st = ownerStateAt(scene, t);
        if (st.plane.o < 1) continue;
        const px = g.start.x + st.fly.mx + st.roll.mx + st.settle.mx;
        const py = g.start.y + st.fly.my + st.roll.my + st.settle.my;
        const part = (name: string, x0: number, y0: number, x1: number, y1: number): Box => ({ name, x0: px + x0 * s, y0: py + y0 * s, x1: px + x1 * s, y1: py + y1 * s });
        // Its parts: fin, tail cone (which rises to the fin), cabin and nose, and gear.
        const plane = [part('fin', -38, -31.5, -21.5, -15), part('tailcone', -41, -20, -20, -12.5), part('cabin', -20, -21.5, 37.5, -7), part('gear', -1, -8, 28, 0)];
        const whole: Box = { name: 'plane', x0: px - g.planeSpan.back, y0: py - g.planeSpan.up - 1, x1: px + g.planeSpan.front, y1: py };
        expect(inside(whole, { ...frame, y1: g.ground.y + 1 }), `plane at ${t}`).toBe(true);
        labels.forEach((b, i) => {
          if (st[`gate-${i}`].o > 0) for (const p of plane) expect(meet(p, b), `plane ${p.name} over ${b.name} at ${t}`).toBe(false);
        });
        if (st.forecast.o * st.forecastLabel.o > 0.05) {
          const fx = g.forecast[0].x + [0, 1, 2].reduce((n, i) => n + st[`f-${i}`].mx, 0);
          const b = text('forecast', fx, R.y - g.forecastLabel, LANDING_WORDS.forecast, T.label, 'middle');
          for (const p of plane) expect(meet(p, b), `plane ${p.name} over the forecast at ${t}`).toBe(false);
        }
      }
      expect(textWidth(LANDING_FOOT.head, g.band.head)).toBeLessThanOrEqual(w - 16);
      expect(textWidth(LANDING_FOOT.support, g.band.support)).toBeLessThanOrEqual(w - 16);
    });

    it(`${mode}: Better decisions sets the window between the heading and the band, the options apart, and every word clear`, () => {
      const g = windowGeometry(mode);
      const d = mode === 'desktop';
      const T = g.type;
      const C = g.shape;
      type Box = { x0: number; y0: number; x1: number; y1: number; name: string };
      const text = (name: string, x: number, base: number, words: string, size: number, opts: { caps?: boolean; tracking?: number; anchor?: 'start' | 'middle' | 'end' } = {}): Box => {
        const tw = textWidth(words, size, opts);
        const x0 = opts.anchor === 'middle' ? x - tw / 2 : opts.anchor === 'end' ? x - tw : x;
        return { name, x0, y0: base - size * 0.75, x1: x0 + tw, y1: base + size * 0.25 };
      };
      const meet = (p: Box, q: Box) => p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1;
      const inside = (p: Box, q: Box) => p.x0 >= q.x0 && p.x1 <= q.x1 && p.y0 >= q.y0 && p.y1 <= q.y1;
      const frame: Box = { name: 'frame', x0: 2, y0: 2, x1: w - 2, y1: g.band.y - 2 };
      const W = g.card.w;
      const Hc = g.card.h;
      const topAt = (x: number) => C.cy - g.half(x);
      const bottomAt = (x: number) => C.cy + g.half(x);
      const cardBox = (name: string, x: number, y: number): Box => ({ name, x0: x - W / 2, y0: y - Hc / 2, x1: x + W / 2 + 1.2 * g.k, y1: y + Hc / 2 + 2 * g.k });
      // The corridor: an elongated lens, narrow, widest a little before the middle, narrow again, the right end the narrowest.
      const S = WINDOW_SHAPE;
      expect(g.half(C.peak)).toBeCloseTo(g.k * S.hM, 6);
      expect(g.half(C.x0)).toBeCloseTo(g.k * S.hL, 6);
      expect(g.half(C.x1)).toBeCloseTo(g.k * S.hR, 6);
      expect(g.half(C.peak) / g.half(C.x0)).toBeGreaterThan(2);
      expect(g.half(C.x0) / g.half(C.x1)).toBeGreaterThan(3);
      let prev = 0;
      for (let x = C.x0; x <= C.peak; x += 1) {
        expect(g.half(x)).toBeGreaterThanOrEqual(prev - 1e-9);
        prev = g.half(x);
      }
      prev = Infinity;
      for (let x = C.peak; x <= C.x1; x += 1) {
        expect(g.half(x)).toBeLessThanOrEqual(prev + 1e-9);
        prev = g.half(x);
      }
      expect(topAt(C.peak)).toBeGreaterThan(g.tag.y + g.tag.h);
      expect(C.x0).toBeGreaterThanOrEqual(frame.x0 + 10);
      expect(C.x1 + g.pressure.thick).toBeLessThanOrEqual(frame.x1 - 10);
      // The decision window lies about the peak, inside the corridor.
      expect(g.window.from).toBeLessThan(C.peak);
      expect(g.window.to).toBeGreaterThan(C.peak);
      expect(g.window.x0).toBeGreaterThan(C.x0);
      expect(g.window.x1).toBeLessThan(C.x1);
      // The heading, at the top, on one line, inside the frame and above the NOW tag at every stop.
      const headings = (['early', 'right', 'late'] as const).map((when) => text(when, g.heading.x, g.heading.y, WINDOW_STAGES[when].heading, T.heading, { caps: true, tracking: 0.1, anchor: 'middle' }));
      for (const h of headings) {
        expect(inside(h, frame), h.name).toBe(true);
        expect(h.y1).toBeLessThanOrEqual(g.tag.y - 2);
      }
      // The NOW tag holds its word; the marker runs from it to above the stage names; its pointer sits on the axis, above the band.
      expect(textWidth(WINDOW_WORDS.now, T.tag, { caps: true, tracking: 0.12 })).toBeLessThanOrEqual(g.tag.w - 6);
      expect(T.tag).toBeGreaterThanOrEqual(6.5);
      const zones = g.zones.map((z) => text(z.word, z.x, z.y, z.word, T.zone, { caps: true, tracking: 0.08, anchor: 'middle' }));
      for (const z of zones) {
        expect(inside(z, frame), z.name).toBe(true);
        expect(z.y0).toBeGreaterThan(g.line.y1);
        expect(z.y0).toBeGreaterThanOrEqual(bottomAt(z.x0) + 2);
        expect(z.y0).toBeGreaterThanOrEqual(bottomAt(z.x1) + 2);
        expect(z.y1).toBeLessThanOrEqual(g.axis.y - g.axis.tick - 1);
      }
      zones.forEach((z, i) => i && expect(z.x0).toBeGreaterThan(zones[i - 1].x1 + 8));
      const A = g.axis;
      expect(A.y + A.pointer.h).toBeLessThanOrEqual(g.band.y - 2);
      // *TIME PASSES*, beneath the arrow's end, above the band, clear of the marker's pointer at every stop.
      const time = text('time', A.label.x, A.label.y, WINDOW_WORDS.time, T.label, { caps: true, tracking: 0.08, anchor: 'end' });
      expect(time.y0).toBeGreaterThan(A.y);
      expect(time.y1).toBeLessThanOrEqual(g.band.y - 2);
      for (const when of ['early', 'right', 'late'] as const) {
        const x = g.stop(when).x;
        expect(meet(time, { name: 'pointer', x0: x - A.pointer.w, y0: A.y, x1: x + A.pointer.w, y1: A.y + A.pointer.h })).toBe(false);
      }
      // Each card is named, *CHOICE 1* to *CHOICE 6*, legibly, with room around its name.
      expect(g.card.label).toBeGreaterThanOrEqual(6.5);
      g.cards.forEach((_, j) => {
        const name = g.name(j);
        expect(`${name.word} ${name.letter}`).toBe(`Choice ${j + 1}`);
        expect(textWidth(`${name.word} ${name.letter}`, g.card.label, { caps: true, tracking: 0.06 })).toBeLessThanOrEqual(W - (d ? 10 : 6));
      });
      g.cards.forEach((c, j) => j && expect(c.y - g.cards[j - 1].y - Hc).toBeGreaterThanOrEqual(2.5));
      // Wherever the group stands (every stop: the three stages, each discovery and each loss), every known card is inside
      // the frame, between the tag and the stage names, clear of the headings, and wholly inside the corridor while it
      // is available; its callout and the group's status label are inside the frame and clear of the cards.
      const N = g.note;
      const stopsAt: { x: number; n: number; note?: { j: number; words: string; left?: boolean } }[] = [
        { x: g.stop('early').x, n: CHOICE_KNOWN },
        ...g.discover.map((x, n) => ({ x, n: CHOICE_KNOWN + n + 1, note: { j: CHOICE_KNOWN + n, words: WINDOW_WORDS.found } })),
        { x: g.stop('right').x, n: CHOICE_COUNT },
        ...g.changes.map((c, i) => ({ x: c.x, n: CHOICE_COUNT, note: { j: c.option, words: WINDOW_LOSS_REASONS[i], left: true } })),
        { x: g.stop('late').x, n: CHOICE_COUNT },
      ];
      for (const st of stopsAt) {
        const cardsHere = Array.from({ length: st.n }, (_, j) => cardBox(`card ${j + 1} at ${st.x}`, st.x, g.stackY(j, st.n)));
        cardsHere.forEach((card, j) => {
          expect(inside(card, frame), card.name).toBe(true);
          expect(card.y0).toBeGreaterThan(g.tag.y + g.tag.h);
          for (const z of zones) expect(meet(card, z), `${card.name} ${z.name}`).toBe(false);
          for (const h of headings) expect(meet(card, h)).toBe(false);
          // Before the losses begin, every known card fits the corridor.
          if (st.x <= g.stop('right').x) expect(g.fits(j, st.x, st.n), card.name).toBe(true);
        });
        if (st.note) {
          const tw = textWidth(st.note.words, N.size, { caps: true, tracking: 0.08 });
          const y = g.stackY(st.note.j, st.n);
          const pw = tw + 2 * N.pad;
          const x0 = st.note.left ? st.x - N.dx - pw : st.x + N.dx;
          const pill: Box = { name: st.note.words, x0, y0: y - N.h / 2, x1: x0 + pw, y1: y + N.h / 2 };
          expect(inside(pill, frame), `${pill.name} at ${st.x}`).toBe(true);
          for (const card of cardsHere) expect(meet(pill, card), `${pill.name} / ${card.name}`).toBe(false);
          // Clear of the marker's line, which runs through the middle of the stack.
          expect(pill.x1 < st.x - 1 || pill.x0 > st.x + 1, `${pill.name} / marker`).toBe(true);
          expect(N.size).toBeGreaterThanOrEqual(6);
        }
      }
      for (const [words, n, x] of [[WINDOW_WORDS.known, CHOICE_KNOWN, g.stop('early').x], [WINDOW_WORDS.six, CHOICE_COUNT, g.stop('right').x], [WINDOW_WORDS.two, CHOICE_COUNT, g.stop('late').x]] as const) {
        const label = text(words, x, g.statusY(n), words, T.zone, { caps: true, tracking: 0.1, anchor: 'middle' });
        expect(inside(label, frame), words).toBe(true);
        expect(label.y0).toBeGreaterThan(g.tag.y + g.tag.h);
        expect(label.y1).toBeLessThan(g.stackY(0, n) - g.card.h / 2);
      }
      g.cards.forEach((c) => {
        const card = cardBox('rest', g.close.x, c.y);
        expect(inside(card, frame)).toBe(true);
        expect(card.x0).toBeGreaterThan(g.window.x0);
        expect(card.x1).toBeLessThan(g.window.x1);
      });
      // The foot: each line and phrase, and the closing line, on one line inside the frame.
      for (const st of Object.values(WINDOW_STAGES)) {
        expect(textWidth(st.foot.head, g.band.head)).toBeLessThanOrEqual(w - 16);
        expect(textWidth(st.foot.support, g.band.support)).toBeLessThanOrEqual(w - 16);
      }
      expect(textWidth(WINDOW_CLOSE, g.band.head)).toBeLessThanOrEqual(w - 16);
      // The closing amber line: on one line, at the band's size or a half-point step below it, never smaller.
      const closeSize = windowCloseSupportSize(mode);
      expect(closeSize).toBe(d ? g.band.support : g.band.support - 0.5);
      expect(textWidth(WINDOW_CLOSE_SUPPORT, closeSize)).toBeLessThanOrEqual(w - 16);
    });
  }
});
