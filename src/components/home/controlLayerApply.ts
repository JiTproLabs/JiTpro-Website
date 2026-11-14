import { CONTROL_TIMING, RECEDED, morphBox, morphPt, type BoardLayout, type BoardState, type ControlState } from './controlChainScene';
import { ease, lerp } from './planChainScene';

/**
 * The Control visual's elements, and the functions that set them from
 * `controlStateAt`'s one state every animation frame (Design System Sections
 * 46.3, 54.4.4). Nothing here decides a time or a state: it turns the state's
 * progress values into attributes. The elements themselves are drawn by
 * ControlLayer.tsx (the close-up) and ControlBoard.tsx (the schedule and the
 * list).
 */

/** The board's type scale, per design (px at scale 1). */
export const BOARD_TYPE = {
  desktop: { title: 15, name: 12.5, status: 10, month: 10, year: 9, kicker: 9, flag: 9.5, flagW: 96, partyT: 10, partyB: 11, dateT: 12, dateB: 14, action: 13.5, detail: 10.5, due: 9.5, foot: 9.5 },
  phone: { title: 12.5, name: 11.5, status: 0, month: 9, year: 8.5, kicker: 8.5, flag: 9, flagW: 84, partyT: 9, partyB: 9, dateT: 11, dateB: 12.5, action: 12.5, detail: 9.5, due: 9, foot: 9 },
} as const;

export type ControlRefs = {
  line: HTMLDivElement | null;
  label: HTMLDivElement | null;
  wash: HTMLDivElement | null;
  mark: HTMLDivElement | null;
  tags: (HTMLDivElement | null)[];
  boards: HTMLDivElement | null;
};

export const emptyControlRefs = (): ControlRefs => ({ line: null, label: null, wash: null, mark: null, tags: [], boards: null });

const shown = (el: HTMLElement | SVGElement, o: number) => {
  el.style.opacity = String(o);
  el.style.visibility = o > 0 ? 'visible' : 'hidden';
};

/** The close-up: the date line and its flag, the wash over finished work, the ring and the annotations. */
export function applyControl(r: ControlRefs, s: ControlState, boards: Record<string, BoardLayout>) {
  const T = CONTROL_TIMING;
  const { today, wash, mark } = s;
  if (r.line) {
    shown(r.line, today.draw > 0 ? today.o : 0);
    // Drawn downward from the chart's top.
    r.line.style.transform = `translate(${today.x - 1}px, ${today.top}px)`;
    r.line.style.height = `${Math.max(0, today.bottom - today.top) * today.draw}px`;
  }
  if (r.label) {
    shown(r.label, today.label * today.o);
    r.label.style.transform = `translate(${today.x + 1}px, ${today.top + 6}px)`;
  }
  if (r.wash) {
    shown(r.wash, wash.o);
    Object.assign(r.wash.style, { transform: `translate(${wash.box.x}px, ${wash.box.y}px)`, width: `${wash.box.w}px`, height: `${wash.box.h}px` });
  }
  if (r.mark) {
    shown(r.mark, mark.o);
    Object.assign(r.mark.style, { transform: `translate(${mark.x}px, ${mark.y}px)`, width: `${mark.w}px`, height: `${mark.h}px` });
  }
  s.tags.forEach((g, i) => {
    const el = r.tags[i];
    if (!el) return;
    shown(el, g.o);
    // A small rise on the way in only; it leaves by fading.
    el.style.transform = `translate(${g.x}px, ${g.y + (1 - g.in) * T.TAG_RISE}px) translate(-50%, -100%)`;
  });
  r.boards?.querySelectorAll<SVGSVGElement>('[data-board]').forEach((svg) => {
    const mode = svg.dataset.board!;
    const on = s.board.on && mode === s.board.mode;
    svg.style.display = on ? 'block' : 'none';
    if (on) applyBoard(svg, boards[mode], s.board);
  });
}

/* The board's parts, found once per SVG. */
type Parts = Record<string, SVGElement[]>;
const cache = new WeakMap<SVGSVGElement, Parts>();
function partsOf(svg: SVGSVGElement): Parts {
  let p = cache.get(svg);
  if (!p) {
    p = {};
    svg.querySelectorAll<SVGElement>('[data-k]').forEach((el) => {
      const k = el.dataset.k!;
      const i = el.dataset.i;
      if (i === undefined) (p![k] ??= []).push(el);
      else (p![k] ??= [])[Number(i)] = el;
    });
    cache.set(svg, p);
  }
  return p;
}
const setO = (el: SVGElement | undefined, o: number) => {
  if (el) el.style.opacity = String(o);
};

/** The schedule, its transition and the list, from one BoardState. */
export function applyBoard(svg: SVGSVGElement, b: BoardLayout, s: BoardState) {
  const P = partsOf(svg);
  const F = BOARD_TYPE[b.mode];
  svg.style.width = `${b.w * s.s}px`;
  svg.style.height = `${b.h * s.s}px`;

  /* How the schedule gives way: quickly for what only the schedule has, and the list's furniture in the move's second half. */
  const leaving = 1 - ease(s.move / 0.4);
  const arriving = ease((s.move - 0.5) / 0.5);

  P.sched?.[0]?.setAttribute('transform', `translate(0 ${s.dy})`);
  P.clip?.[0]?.setAttribute('x', String(s.clipX));
  P.zoom?.[0]?.setAttribute('transform', `translate(${s.todayX - b.todayX * s.zoomX} 0) scale(${s.zoomX} 1)`);
  setO(P.chrome?.[0], s.rest * leaving);

  /* Rows: a chain with nothing required recedes; one with a requirement keeps its mark while its other activities recede. */
  b.rows.forEach((row, i) => {
    const back = row.priority ? RECEDED.own : RECEDED.others;
    const bars = lerp(1, back, s.recede) * leaving;
    setO(P.bars?.[i], (i === b.focalRow ? s.focal : s.rest) * bars);
    setO(P.row?.[i], s.rest * lerp(1, row.priority ? 1 : RECEDED.others, s.recede) * leaving);
    // The party takes the status line's place; a row with two requirements gives its name's place too.
    if (row.priority) {
      setO(P.status?.[i], 1 - s.recede);
      setO(P.ros?.[i], lerp(1, RECEDED.own, s.recede));
      if (row.nameYields) setO(P.name?.[i], 1 - s.recede);
    }
    const lit = Math.max(0, ...b.marks.filter((m) => m.row === i).map((m) => s.lit[b.marks.indexOf(m)]));
    setO(P.rowmark?.[i], lit);
  });

  /* The marks, lit; each gives way to the rule that travels in its place. */
  const handOff = ease(s.move / 0.15);
  b.marks.forEach((_, i) => {
    const listed = b.entries.some((e) => e.mark === i);
    setO(P.mark?.[i], s.lit[i] * (listed ? 1 - handOff : leaving));
  });

  /* Today: the line, and its flag, which moves to the list's corner and stays. */
  const todayEl = P.today?.[0];
  if (todayEl) {
    todayEl.setAttribute('transform', `translate(${s.todayX} 0)`);
    setO(todayEl, s.focal * (1 - ease(s.move / 0.3)));
  }
  const flag = P.flag?.[0];
  if (flag) {
    flag.setAttribute('transform', `translate(${lerp(s.todayX, b.x1 - F.flagW / 2, s.move)} 0)`);
    setO(flag, s.focal);
  }
  setO(P.titleA?.[0], s.rest * (1 - ease(s.move / 0.5)));
  setO(P.titleB?.[0], arriving);
  setO(P.listHead?.[0], arriving);

  b.entries.forEach((e, i) => {
    const link = s.link[i];
    const mark = b.marks[e.mark];
    /* The connector is drawn out to the date, and withdrawn as the move begins. */
    setO(P.link?.[i], link > 0 ? 1 - ease(s.move / 0.25) : 0);
    P.leader?.[i]?.style.setProperty('stroke-dashoffset', String(1 - link));

    /* The mark becomes the row's amber rule; a commitment's diamond turns square as it goes. */
    const rule = P.rule?.[i];
    if (rule) {
      const box = morphBox(mark.box, e.rule, s.move);
      rule.setAttribute('x', String(box.x));
      rule.setAttribute('y', String(box.y));
      rule.setAttribute('width', String(box.w));
      rule.setAttribute('height', String(box.h));
      const turn = mark.kind === 'commitment' ? 45 * (1 - s.move) : 0;
      rule.setAttribute('transform', `rotate(${turn} ${box.x + box.w / 2} ${box.y + box.h / 2})`);
      setO(rule, s.lit[e.mark] * handOff);
    }

    /* The date travels straight down its own column. */
    const date = P.date?.[i];
    if (date) {
      const at = morphPt(e.dateT, e.dateB, s.move);
      date.setAttribute('x', String(at.x));
      date.setAttribute('y', String(at.y));
      date.style.fontSize = `${lerp(F.dateT, F.dateB, s.move)}px`;
      setO(date, link);
    }

    /* The party travels to its group's heading; where the group already shows it, it merges into it. */
    const party = P.party?.[i];
    if (party) {
      const head = e.partyB ?? b.entries.find((x) => x.req.party === e.req.party)!.partyB!;
      const at = morphPt(e.partyT, head, s.move);
      party.setAttribute('x', String(at.x));
      party.setAttribute('y', String(at.y));
      party.style.fontSize = `${lerp(F.partyT, F.partyB, s.move)}px`;
      setO(party, link * (e.partyB ? 1 : 1 - s.move));
    }

    setO(P.detail?.[i], s.detail[i]);
  });
  setO(P.idle?.[0], s.idle);
}
