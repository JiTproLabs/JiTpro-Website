import { describe, expect, it } from 'vitest';
import type { Measure } from '../demo/screens/procurement-chain/chainLayout';
import { buildSteelWindowsPlannedChain } from '../demo/screens/procurement-chain/chainScenario';
import { parse, workdaysBetween } from '../demo/screens/procurement-schedule/workCalendar';
import { CONNECT_ITEM } from './connectChainScene';
import { FOCAL_ITEM, HEADER, ROW_ITEMS, buildPlanScene, type Frame } from './planChainScene';
import {
  BOARD,
  BOARD_NAME,
  CONTROL_TIMING,
  CONTROL_TODAY,
  LOOKAHEAD_WORKDAYS,
  PARTY_LABEL,
  RECEDED,
  TAG,
  WASH,
  activityStateAt,
  boardModeOf,
  boardScale,
  buildControlScene,
  commitmentDueAt,
  commitmentsDueAt,
  controlFrame,
  controlStateAt,
  controlViews,
  idlePartiesAt,
  partyOf,
  prioritiesAt,
  requirementsAt,
  shortDay,
  workdaysUntil,
  type BoardMode,
} from './controlChainScene';

const measure: Measure = (text, font) => text.length * Number(/(\d+)px/.exec(font)![1]) * 0.58;
const scene = buildPlanScene(measure);
const control = buildControlScene(scene);
const T = control.times;
const C = CONTROL_TIMING;
const FRAMES: Frame[] = [
  { w: 558, h: 348 },
  { w: 598, h: 373 },
  { w: 340, h: 212 },
];
const at = (f: Frame, t: number) => controlStateAt(scene, control, f, t);
const stepOf = (id: string) => ROW_ITEMS.flatMap((i) => i.steps).find((s) => s.id === id)!;
const MODES: BoardMode[] = ['desktop', 'phone'];

describe('Control: one date across the schedule (Section 54.4.4)', () => {
  it('uses a fixed, illustrative Today: a working day inside the featured chain', () => {
    expect(control.today).toBe(CONTROL_TODAY);
    expect(workdaysBetween(parse(CONTROL_TODAY), parse(CONTROL_TODAY))).toBe(1);
    expect(CONTROL_TODAY > FOCAL_ITEM.startDate).toBe(true);
    expect(CONTROL_TODAY < FOCAL_ITEM.requiredOnSiteDate).toBe(true);
  });

  it('derives every activity\'s state from its own planned dates', () => {
    const today = '2026-11-18';
    expect(activityStateAt({ startDate: '2026-10-01', endDate: '2026-11-17' }, today)).toBe('complete');
    expect(activityStateAt({ startDate: '2026-11-19', endDate: '2026-12-01' }, today)).toBe('scheduled');
    expect(activityStateAt({ startDate: '2026-11-16', endDate: '2026-11-24' }, today)).toBe('attention');
    // Due on the look-ahead's last day still needs attention; a day later does not.
    expect(workdaysUntil(today, '2026-12-10')).toBe(LOOKAHEAD_WORKDAYS);
    expect(activityStateAt({ startDate: '2026-11-03', endDate: '2026-12-10' }, today)).toBe('attention');
    expect(activityStateAt({ startDate: '2026-11-03', endDate: '2026-12-11' }, today)).toBe('in-progress');
    expect(activityStateAt({ startDate: today, endDate: '2027-02-23' }, today)).toBe('in-progress');
    expect(activityStateAt({ startDate: '2026-11-02', endDate: today }, today)).toBe('attention');
  });

  it('never treats a future date as overdue, nor a past one as falling due', () => {
    const today = '2026-11-18';
    expect(commitmentDueAt('2026-11-30', today)).toBe(true);
    expect(commitmentDueAt(today, today)).toBe(true);
    // Beyond the look-ahead: planned, not yet a priority.
    expect(commitmentDueAt('2026-12-17', today)).toBe(false);
    // Before today: the sample is on plan, so it has been provided; it is not a priority and nothing marks it late.
    expect(commitmentDueAt('2026-10-07', today)).toBe(false);
    for (const r of control.requirements) expect(r.date >= CONTROL_TODAY).toBe(true);
  });

  it('finds current work by the rule alone: under way today, with its hand-off due within the look-ahead', () => {
    const work = prioritiesAt(ROW_ITEMS, CONTROL_TODAY);
    const all = ROW_ITEMS.flatMap((i) => i.steps).filter((s) => s.kind === 'phase' && activityStateAt(s, CONTROL_TODAY) === 'attention');
    expect(work.map((p) => p.id).sort()).toEqual(all.map((s) => s.id).sort());
    for (const p of work) {
      const step = stepOf(p.id);
      expect(p.kind).toBe('activity');
      expect(step.startDate <= CONTROL_TODAY && CONTROL_TODAY <= step.endDate).toBe(true);
      expect(p.date).toBe(step.endDate);
      expect(p.activity).toBe(step.name);
      expect(p.org).toBe(step.responsibleOrganization);
      expect(p.party).toBe(partyOf(step.responsibleOrganizationId));
      const item = ROW_ITEMS.find((i) => i.id === p.itemId)!;
      const after = item.steps.slice(item.steps.findIndex((s) => s.id === p.id) + 1).find((s) => s.kind === 'phase');
      expect(p.protects).toBe(after ? after.name : 'Required On Site');
    }
  });

  it('adds Connect\'s dependencies that fall due, read from Connect and never restated', () => {
    const due = commitmentsDueAt(CONTROL_TODAY);
    expect(due.map((d) => d.id)).toEqual(CONNECT_ITEM.commitments.filter((c) => commitmentDueAt(c.requiredBy, CONTROL_TODAY)).map((c) => c.id));
    expect(due).toHaveLength(1);
    const c = CONNECT_ITEM.commitments.find((x) => x.id === due[0].id)!;
    expect([due[0].kind, due[0].activity, due[0].date, due[0].protects, due[0].party]).toEqual(['commitment', c.name, c.requiredBy, c.requiredForStepName, 'gc']);
    expect(due[0].activity).toBe('Final Field Dimensions');
    // The shared chain is untouched by Control.
    expect(CONNECT_ITEM.steps).toEqual(buildSteelWindowsPlannedChain('2027-09-01').steps);
  });

  it('shows the representative requirements of November 18, 2026, soonest first', () => {
    expect(control.requirements).toEqual(requirementsAt(ROW_ITEMS, CONTROL_TODAY));
    expect(control.requirements.map((p) => [p.kind, PARTY_LABEL[p.party], p.activity, BOARD_NAME[p.itemId], p.date, p.protects])).toEqual([
      ['activity', 'Subcontractors & Vendors', 'Second Revision Cycle', 'Steel Windows & Doors', '2026-11-24', 'Third Submittal Review'],
      ['commitment', 'General Contractor', 'Final Field Dimensions', 'Steel Windows & Doors', '2026-11-30', 'Release for Fabrication'],
      ['activity', 'Architect', 'Material Selection Coordination', 'Exterior Stone', '2026-12-04', 'Sample Coordination'],
      ['activity', 'Consultants', 'Mechanical Engineer Review', 'HVAC Equipment', '2026-12-08', 'Revision'],
      ['activity', 'Consultants', 'Review', 'Lumber & Framing', '2026-12-10', 'Revision if required'],
    ]);
    expect(JSON.stringify(control.requirements)).not.toMatch(/late|overdue|risk|delay|urgent/i);
  });

  it('does not treat all open work as a priority: most chains under way need nothing today', () => {
    const underWay = ROW_ITEMS.filter((i) => i.startDate <= CONTROL_TODAY && CONTROL_TODAY <= i.requiredOnSiteDate);
    const withPriority = new Set(control.requirements.map((p) => p.itemId));
    expect(ROW_ITEMS).toHaveLength(15);
    expect(underWay.length).toBeGreaterThan(withPriority.size);
    expect(withPriority.has('itm-steel')).toBe(false);
  });

  it('names the parties with nothing required now, each with its real next activity', () => {
    const idle = idlePartiesAt(ROW_ITEMS, CONTROL_TODAY, ['vendors', 'gc', 'architect', 'consultants']);
    expect(idle.map((p) => p.party)).toEqual(['owner']);
    const next = idle[0].next!;
    expect(next.date > CONTROL_TODAY).toBe(true);
    const step = ROW_ITEMS.flatMap((i) => i.steps).find((s) => s.name === next.activity && s.startDate === next.date)!;
    expect(partyOf(step.responsibleOrganizationId)).toBe('owner');
  });
});

describe('Control board: the schedule drawn for the frame', () => {
  for (const mode of MODES) {
    describe(mode, () => {
      const b = control.boards[mode];
      const B = BOARD[mode];
      const DAY = 86400000;
      const xOf = (d: string, days = 0) => b.x0 + ((parse(d).getTime() - parse(B.window[0]).getTime()) / DAY + days) * b.pxPerDay;

      it('shows representative chains from the real schedule, in its order, and every chain with a requirement', () => {
        expect(b.rows.map((r) => r.id)).toEqual([...B.items]);
        const order = b.rows.map((r) => ROW_ITEMS.findIndex((i) => i.id === r.id));
        expect(order.every((n) => n >= 0)).toBe(true);
        expect(order).toEqual([...order].sort((x, y) => x - y));
        for (const r of control.requirements) expect(b.rows.some((row) => row.id === r.itemId)).toBe(true);
        expect(b.rows.length).toBeGreaterThanOrEqual(5);
        expect(b.rows.length).toBeLessThanOrEqual(8);
        expect(b.shown).toEqual({ items: b.rows.length, of: 15 });
        expect(b.rows[b.focalRow].id).toBe(FOCAL_ITEM.id);
      });

      it('fits its canvas: the calendar, the rows and a foot, with rows tall enough to read', () => {
        expect(b.top).toBe(B.titleH + B.yearH + B.monthH);
        expect(b.bottom).toBe(b.top + b.rows.length * B.rowH);
        expect(b.h - b.bottom).toBeGreaterThanOrEqual(18);
        expect(B.rowH).toBeGreaterThanOrEqual(mode === 'desktop' ? 34 : 24);
        expect(b.x1).toBeLessThan(b.w);
      });

      it('sets the year above the months, so the turn of the year is legible', () => {
        expect(b.years.map((y) => y.label)).toEqual(['2026', '2027']);
        const january = b.months.find((m) => m.year)!;
        expect(january.label).toBe('Jan');
        expect(b.years[0].x1).toBe(january.x);
        expect(b.years[1].x0).toBe(january.x);
        // Every month has its own label and room for it.
        const xs = b.months.map((m) => m.x);
        for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(18);
        expect(b.months.map((m) => m.label).slice(0, 5)).toEqual(['Sep', 'Oct', 'Nov', 'Dec', 'Jan']);
      });

      it('draws every bar on its own dates, and the Today line on today', () => {
        expect(b.todayX).toBe(Math.round(xOf(CONTROL_TODAY, 0.5)));
        for (const row of b.rows) {
          const item = ROW_ITEMS.find((i) => i.id === row.id)!;
          for (const bar of row.bars) {
            const step = item.steps.find((s) => s.id === bar.id)!;
            expect(bar.state).toBe(activityStateAt(step, CONTROL_TODAY));
            expect(bar.x).toBeCloseTo(Math.max(b.x0, xOf(step.startDate)));
            expect(bar.x + bar.w).toBeLessThanOrEqual(b.x1 + 1e-6);
            // The line crosses exactly the activities under way today.
            const crosses = bar.x <= b.todayX && b.todayX <= bar.x + bar.w + 1.5;
            if (bar.state === 'complete') expect(bar.x + bar.w).toBeLessThan(b.todayX);
            if (bar.state === 'scheduled') expect(bar.x).toBeGreaterThan(b.todayX);
            if (bar.state === 'attention' || bar.state === 'in-progress') expect(crosses).toBe(true);
          }
          const current = item.steps.find((s) => s.kind === 'phase' && s.startDate <= CONTROL_TODAY && CONTROL_TODAY <= s.endDate);
          expect(row.status).toBe(current ? current.name : `Starts ${shortDay(item.startDate)}`);
          if (row.ros) expect(row.ros.x).toBeCloseTo(xOf(item.requiredOnSiteDate, 0.5));
        }
      });

      it('marks current work and future commitments differently, and neither as overdue', () => {
        expect(b.marks.map((m) => m.id).sort()).toEqual(control.requirements.map((r) => r.id).sort());
        for (const m of b.marks) {
          const req = control.requirements.find((r) => r.id === m.id)!;
          expect(m.kind).toBe(req.kind);
          expect(b.rows[m.row].id).toBe(req.itemId);
          if (m.kind === 'activity') {
            // Under way: it began before today, and its remaining part runs on to its due date, right of the line.
            expect(m.box.x).toBeLessThan(b.todayX);
            expect(m.split).toBeGreaterThan(m.box.x);
            expect(m.split).toBeLessThan(m.box.x + m.box.w);
            expect(m.split).toBeCloseTo(xOf(CONTROL_TODAY, 1));
            expect(m.box.x + m.box.w).toBeGreaterThan(b.todayX);
          } else {
            // A commitment still to come: wholly right of the line, on its own date.
            expect(m.box.x).toBeGreaterThan(b.todayX);
            expect(m.split).toBeCloseTo(xOf(req.date, 0.5));
          }
        }
      });

      it('lists the soonest requirements by party, each with its date, what it protects and how soon it is due', () => {
        expect(b.entries.length).toBe(Math.min(B.listed, control.requirements.length));
        const listed = control.requirements.slice(0, B.listed).map((r) => r.id);
        expect(b.entries.map((e) => e.req.id).sort()).toEqual([...listed].sort());
        // Parties in order of their soonest date; a party's rows together.
        const parties = b.entries.map((e) => e.req.party);
        expect(parties.filter((p, i) => parties.indexOf(p) !== i && parties[i - 1] !== p)).toEqual([]);
        for (const e of b.entries) {
          expect(e.action).toBe(e.req.activity);
          expect(e.date).toBe(shortDay(e.req.date));
          expect(e.detail).toContain(`rotects ${e.req.protects}`);
          expect(e.due).toBe(`${workdaysUntil(CONTROL_TODAY, e.req.date)} working days`);
          expect(b.marks[e.mark].id).toBe(e.req.id);
        }
        if (mode === 'desktop') {
          expect(b.entries.map((e) => [e.party, e.action, e.date, e.partyB !== null])).toEqual([
            ['Subcontractors & Vendors', 'Second Revision Cycle', 'Nov 24', true],
            ['General Contractor', 'Final Field Dimensions', 'Nov 30', true],
            ['Architect', 'Material Selection Coordination', 'Dec 4', true],
            ['Consultants', 'Mechanical Engineer Review', 'Dec 8', true],
            ['Consultants', 'Review', 'Dec 10', false],
          ]);
          expect(b.idle.map((p) => p.party)).toEqual(['Owner']);
          expect(b.idle[0].text).toBe('Nothing required now');
          expect(b.idle[0].next).toMatch(/^Next: .+, [A-Z][a-z]{2} \d+, 2027$/);
          // Each line fits beside the party (about half an em a character).
          expect(b.idle[0].next.length * 10.5 * 0.5).toBeLessThanOrEqual(b.x1 - (B.actionX + 14));
          expect(b.idle[0].y + 14).toBeLessThanOrEqual(b.h - 6);
          expect(b.more).toBeNull();
        } else {
          // A narrow frame lists fewer, and says how many it leaves out.
          expect(b.entries).toHaveLength(3);
          expect(b.more!.text).toBe('2 more required by Dec 10');
          expect(b.idle).toEqual([]);
        }
      });

      it('keeps the list inside its canvas, its rows apart and its columns aligned', () => {
        const last = b.entries[b.entries.length - 1];
        const foot = Math.max(last.lineY, ...b.idle.map((p) => p.y), b.more ? b.more.y : 0);
        expect(foot).toBeLessThanOrEqual(b.h - 4);
        for (let i = 1; i < b.entries.length; i++) expect(b.entries[i].rule.y - b.entries[i - 1].rule.y).toBe(B.listRow);
        expect(new Set(b.entries.map((e) => e.rule.x)).size).toBe(1);
        expect(new Set(b.entries.map((e) => e.dateB.x)).size).toBe(1);
        expect(new Set(b.entries.map((e) => e.actionB.x)).size).toBe(1);
        // The longest action fits its column without truncation (about 0.56 em a character, bold).
        const size = mode === 'desktop' ? 13.5 : 12.5;
        const room = b.x1 - 52 - b.entries[0].actionB.x;
        for (const e of b.entries) expect(e.action.length * size * 0.56).toBeLessThanOrEqual(room);
        // On a desktop frame the party's name ends before the action column begins.
        if (mode === 'desktop') for (const e of b.entries) expect(B.padL + e.party.length * 11 * 0.56).toBeLessThanOrEqual(B.actionX - 2);
      });

      it('in the transition, keeps each requirement on its own row: its connector runs from its mark to its date', () => {
        for (const e of b.entries) {
          const m = b.marks[e.mark];
          const row = b.rows[m.row];
          expect(e.dateT.x).toBe(b.x1);
          expect(e.dateT.y).toBeGreaterThan(row.y);
          expect(e.dateT.y).toBeLessThan(row.y + B.rowH);
          expect(e.partyT.y).toBeGreaterThan(row.y);
          expect(e.partyT.y).toBeLessThanOrEqual(row.y + B.rowH - 2);
          expect(e.leader.startsWith('M')).toBe(true);
          // The date travels straight down its column into the list.
          expect(e.dateB.x).toBe(e.dateT.x);
        }
        // Two requirements on one chain take separate lanes.
        const windows = b.entries.filter((e) => e.req.itemId === FOCAL_ITEM.id);
        expect(windows).toHaveLength(2);
        expect(Math.abs(windows[0].dateT.y - windows[1].dateT.y)).toBeGreaterThanOrEqual(13);
        expect(b.rows[b.focalRow].nameYields).toBe(true);
      });
    });
  }
});

describe('Control scene', () => {
  it('puts the chain\'s date line on today\'s own day', () => {
    const seg = scene.focal.layout.segments.find((s) => s.step.startDate <= CONTROL_TODAY && CONTROL_TODAY <= s.step.endDate)!;
    expect(seg.step.name).toBe('Second Revision Cycle');
    expect(control.todayX).toBeGreaterThan(seg.x0);
    expect(control.todayX).toBeLessThan(seg.x1);
    expect(control.focalMark.id).toBe(seg.step.id);
    expect([control.focalMark.x0, control.focalMark.x1]).toEqual([seg.x0, seg.x1]);
  });

  it('annotates the featured chain: what to work on now, and its next two activities as not yet', () => {
    expect(control.tags.map((g) => [g.kind, g.text, stepOf(g.id).name])).toEqual([
      ['now', 'Work on this now', 'Second Revision Cycle'],
      ['notYet', 'Not yet', 'Third Submittal Review'],
      ['notYet', 'Not yet', 'Fabrication'],
    ]);
    for (const g of control.tags.filter((x) => x.kind === 'notYet')) {
      expect(stepOf(g.id).startDate > stepOf(control.tags[0].id).endDate).toBe(true);
      expect(g.x).toBeGreaterThan(control.todayX);
    }
  });
});

describe('Control timeline', () => {
  it('runs in order, with a pause at each teaching moment', () => {
    const order = [0, T.today, T.zoomIn, T.close, T.now, T.notYet, T.zoomOut, T.schedule, T.lit, T.recede, T.link, T.move, T.detail, T.end];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(order.length);
    expect(T.zoomIn - (T.today + C.TODAY_DRAW)).toBeGreaterThanOrEqual(1000);
    expect(T.zoomOut - T.notYet).toBeGreaterThanOrEqual(1500);
    expect(T.lit - T.schedule).toBeGreaterThanOrEqual(800);
    expect(C.PRIORITY_HOLD).toBeGreaterThanOrEqual(1200);
    expect(C.LINK_HOLD).toBeGreaterThanOrEqual(1400);
    expect(T.end).toBeLessThanOrEqual(22000);
  });

  for (const f of FRAMES) {
    describe(`${f.w}×${f.h} frame`, () => {
      const views = controlViews(scene, control, controlFrame(f));
      const mode = boardModeOf(controlFrame(f));
      const b = control.boards[mode];

      it('picks the design for the frame and scales it as one, never far below its drawn size', () => {
        expect(mode).toBe(f.w >= 460 ? 'desktop' : 'phone');
        const s = boardScale(f, b);
        expect(b.w * s).toBeLessThanOrEqual(f.w + 1e-6);
        expect(b.h * s).toBeLessThanOrEqual(f.h + 1e-6);
        expect(s).toBeGreaterThanOrEqual(0.95);
        expect(at(f, T.end).board.s).toBe(s);
      });

      it('opens on the whole featured chain with its summary, and nothing of Control yet', () => {
        const s = at(f, 0);
        expect(s.view).toEqual(views.whole);
        expect(s.summary).toBe(1);
        expect(s.chain).toBe(1);
        expect(s.app).toBe(0);
        expect(s.today.draw).toBe(0);
        expect(s.wash.o).toBe(0);
        expect(s.mark.o).toBe(0);
        expect(s.tags.every((g) => g.o === 0)).toBe(true);
        expect(s.board.on).toBe(false);
      });

      it('draws the Today line, then its flag, then subdues the work before it; and holds', () => {
        expect(at(f, T.today + C.TODAY_DRAW / 2).today.draw).toBeGreaterThan(0);
        expect(at(f, T.today + C.TODAY_DRAW / 2).today.label).toBe(0);
        const held = at(f, T.zoomIn - 1);
        expect(held.today.draw).toBe(1);
        expect(held.today.label).toBe(1);
        expect(held.today.o).toBe(1);
        expect(held.wash.o).toBeCloseTo(WASH.done);
        expect(held.today.x).toBeGreaterThan(0);
        expect(held.today.x).toBeLessThan(f.w);
        expect(held.today.top).toBe(HEADER.h);
        // The wash ends at the line: only work before today is subdued.
        expect(held.wash.box.x + held.wash.box.w).toBeCloseTo(held.today.x);
      });

      it('moves in to today, the line travelling one way only', () => {
        let prev = at(f, T.zoomIn).today.x;
        let dir = 0;
        for (let t = T.zoomIn; t <= T.close; t += 20) {
          const x = at(f, t).today.x;
          const step = x - prev;
          if (Math.abs(step) > 1e-6) {
            if (dir === 0) dir = Math.sign(step);
            expect(Math.sign(step)).toBe(dir);
          }
          prev = x;
        }
        expect(at(f, T.close).view).toEqual(views.close);
      });

      it('close up, rings the activity that needs attention, then annotates the two that do not yet', () => {
        expect(at(f, T.close).mark.o).toBe(0);
        const marked = at(f, T.notYet - 1);
        expect(marked.mark.o).toBe(1);
        expect(marked.tags.map((g) => g.o)).toEqual([1, 0, 0]);
        const all = at(f, T.zoomOut - 1);
        expect(all.tags.every((g) => g.o === 1)).toBe(true);
        const bar = all.mark;
        for (const g of all.tags) {
          expect(g.x).toBeGreaterThan(0);
          expect(g.x).toBeLessThan(f.w);
          expect(g.y).toBeLessThan(bar.y + bar.h);
          expect(g.y).toBeGreaterThan(bar.y - 8);
        }
        expect(all.tags[0].y - TAG.stem.now - 20).toBeGreaterThan(HEADER.h + 24);
        expect(TAG.stem.now - TAG.stem.notYet).toBeGreaterThanOrEqual(20);
        expect(all.tags[2].x - all.tags[1].x).toBeGreaterThan(40);
        expect(bar.x).toBeGreaterThanOrEqual(0);
        expect(bar.x + bar.w).toBeLessThanOrEqual(f.w);
        expect(all.today.x).toBeGreaterThan(bar.x);
        expect(all.today.x).toBeLessThan(bar.x + bar.w);
      });

      it('opens out from exactly where the close-up left today and the featured row, with no jump', () => {
        const s = at(f, T.zoomOut + 1).board;
        const closeUp = at(f, T.zoomOut - 1);
        expect(s.on).toBe(true);
        // Today, in frame px, is where the chain's line is.
        expect(s.todayX * s.s).toBeCloseTo(closeUp.today.x, 0);
        // The featured row's centre is the chain bar's centre.
        const barCy = closeUp.mark.y + closeUp.mark.h / 2;
        expect((b.rows[b.focalRow].cy + s.dy) * s.s).toBeCloseTo(barCy, 0);
        // The calendar is as wide as the chain's: the featured activity is as long as its ring.
        const m = b.marks.find((x) => x.id === control.focalMark.id)!;
        const step = stepOf(m.id);
        const days = (parse(step.endDate).getTime() - parse(step.startDate).getTime()) / 86400000 + 1;
        expect(days * b.pxPerDay * s.zoomX * s.s).toBeCloseTo(closeUp.mark.w - 4, 0);
        expect(s.zoomX).toBeGreaterThan(3);
      });

      it('settles on the schedule: its own scale, the chain gone, every row shown, nothing lit yet', () => {
        const s = at(f, T.schedule);
        expect(s.chain).toBe(0);
        expect(s.today.o).toBe(0);
        expect(s.mark.o).toBe(0);
        expect(s.wash.o).toBe(0);
        expect(s.tags.every((g) => g.o === 0)).toBe(true);
        expect(s.board.todayX).toBe(b.todayX);
        expect(s.board.zoomX).toBeCloseTo(1, 9);
        expect(s.board.dy).toBeCloseTo(0, 9);
        expect(s.board.clipX).toBe(b.x0);
        expect(s.board.focal).toBe(1);
        expect(s.board.rest).toBe(1);
        expect(at(f, T.lit).board.lit.every((v) => v === 0)).toBe(true);
        // The opening out is monotonic: the calendar only narrows, the schedule only rises into place.
        let prev = at(f, T.zoomOut + 1).board;
        for (let t = T.zoomOut + 20; t <= T.schedule; t += 20) {
          const now = at(f, t).board;
          expect(now.zoomX).toBeLessThanOrEqual(prev.zoomX + 1e-9);
          expect(Math.abs(now.dy)).toBeLessThanOrEqual(Math.abs(prev.dy) + 1e-9);
          prev = now;
        }
      });

      it('lights each requirement in turn, then lets the other chains recede and links each to its date', () => {
        const lit = at(f, T.recede - 1).board;
        expect(lit.lit).toEqual(b.marks.map(() => 1));
        expect(lit.recede).toBe(0);
        for (let t = T.lit; t < T.recede; t += 40) {
          const v = at(f, t).board.lit;
          for (let i = 1; i < v.length; i++) expect(v[i]).toBeLessThanOrEqual(v[i - 1]);
        }
        const linked = at(f, T.move - 1).board;
        expect(linked.recede).toBe(1);
        expect(linked.link).toEqual(b.entries.map(() => 1));
        expect(linked.move).toBe(0);
        expect(linked.detail.every((v) => v === 0)).toBe(true);
        expect(RECEDED.others).toBeLessThan(RECEDED.own);
        expect(RECEDED.own).toBeLessThan(1);
      });

      it('ends on the list: the marks, parties and dates have moved, then each row is worded; and it rests', () => {
        const end = at(f, T.end);
        expect(end.board.move).toBe(1);
        expect(end.board.detail).toEqual(b.entries.map(() => 1));
        expect(end.board.idle).toBe(1);
        expect(end.board.lit.every((v) => v === 1)).toBe(true);
        for (let t = T.move; t <= T.end; t += 40) {
          const d = at(f, t).board.detail;
          for (let i = 1; i < d.length; i++) expect(d[i]).toBeLessThanOrEqual(d[i - 1]);
        }
        let prev = 0;
        for (let t = T.move; t <= T.move + C.MOVE; t += 20) {
          const m = at(f, t).board.move;
          expect(m).toBeGreaterThanOrEqual(prev);
          prev = m;
        }
        expect(at(f, T.end + 5000)).toEqual(end);
      });

      it('never eases past its targets: every progress stays within 0 and 1', () => {
        for (let t = 0; t <= T.end; t += 60) {
          const s = at(f, t);
          const v = [s.chain, s.today.draw, s.today.label, s.today.o, s.wash.o, s.mark.o, ...s.tags.map((g) => g.o), s.board.focal, s.board.rest, s.board.recede, s.board.move, s.board.idle, ...s.board.lit, ...s.board.link, ...s.board.detail];
          for (const x of v) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(1);
          }
        }
      });
    });
  }
});
