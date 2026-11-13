import { useLayoutEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { v } from '../demo/screens/procurement-chain/chainVocabulary';
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
  LOOKAHEAD_STEPS,
  OWNER_CANVAS,
  OWNER_DECISIONS,
  OWNER_NARROW_BELOW,
  OWNER_TAKEAWAY,
  TEAM,
  TEAM_CONTRACTOR,
  TEAM_FOOT,
  TEAM_MARK,
  TEAM_PARTIES,
  TEAM_RUSH,
  TEAM_STATES,
  TEAM_WASTE_ROUNDS,
  CHOICE_FOOT,
  CHOICE_TIMED,
  CHOICE_WORDS,
  buildOwnerScene,
  choiceGeometry,
  fullDay,
  gambleGeometry,
  houseBackdrop,
  requestLabel,
  lookaheadWindow,
  ownerStateAt,
  shieldPath,
  shortDay,
  teamGeometry,
  type OwnerMode,
  type OwnerTabId,
  type TeamId,
} from './ownerScenes';
import { SweepingHand } from './SweepingHand';
import '../demo/tokens.css';
import '../demo/screens/procurement-schedule/scheduleTokens.css';
import '../demo/screens/procurement-chain/chainTokens.css';

/**
 * The Project Owners tabs' visuals (Design System Section 54.4.5): four short
 * stories, each drawn for the frame as vector on its own canvas (a desktop
 * design and a narrow one), never a scaled-down application screen. Reduce
 * risk, Protect your investment and Better decisions are illustrations in
 * Identify's document style; More predictability reads the sample project.
 *
 * ONE CLOCK (Section 46.3). Every element that changes carries a `data-k`
 * key. Each animation frame, `ownerStateAt(scene, t)` gives every key its
 * opacity, rise, drawn length, travel, turn and scale, and this component applies them.
 * Not played: parked on the opening frame. Played: one pass, then rest; none
 * loops. Reduced motion: the resting state at once (Section 46.5).
 *
 * Colour: the application's tokens. Amber (`--jpd-accent`) marks the one
 * thing each scene is about. It is an illustration: the visual column is
 * aria-hidden and nothing here is focusable (Section 46.12).
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FACE = '"Inter Tight", Inter, system-ui, sans-serif';
const ink = v('--jpd-text-strong');
const sec = v('--jpd-text-secondary');
const navy = v('--jpd-nav-bg-start');
const amber = v('--jpd-accent');
const edge = v('--jpd-grid-strong');
const surface = v('--jpd-surface');

const diamond = (x: number, y: number, r: number) => `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

/** An element the clock shows, moves or hides. */
function K({ k, children }: { k: string; children: ReactNode }) {
  return (
    <g data-k={k} style={{ opacity: 0 }}>
      {children}
    </g>
  );
}
/** A line the clock draws along its length. */
function Drawn({ k, d, stroke, width, cap }: { k: string; d: string; stroke: string; width: number; cap?: 'round' | 'butt' }) {
  return <path data-k={k} data-draw="" d={d} pathLength={1} style={{ opacity: 0, fill: 'none', stroke, strokeWidth: width, strokeLinecap: cap ?? 'butt', strokeDasharray: '1 1', strokeDashoffset: 1 }} />;
}
const kicker = (size: number, fill: string) => ({ fontSize: size, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, fill });

function Takeaway({ tab, mode }: { tab: OwnerTabId; mode: OwnerMode }) {
  const d = mode === 'desktop';
  const { w, h } = OWNER_CANVAS[mode];
  const y = h - (d ? 26 : 11);
  return (
    <K k="takeaway">
      <rect x={w / 2 - 12} y={y - (d ? 24 : 17)} width={24} height={3} rx={1.5} style={{ fill: amber }} />
      <text x={w / 2} y={y} textAnchor="middle" style={{ fontSize: d ? 14.5 : 11, fontWeight: 700, letterSpacing: '-0.01em', fill: navy }}>
        {OWNER_TAKEAWAY[tab]}
      </text>
    </K>
  );
}

/* --------------------------------------------------------- 1. Reduce risk */

/* The documents are drawn as Identify's are (Section 54.4.1): white paper, one ink at several strengths. */
const PAPER = 'var(--jp-surface-white)';
/* What the papers lie on in Reduce risk: the light surface, a cool off-white. */
const GROUND = 'var(--jp-surface-light)';
const DOC_INK = 'var(--jp-ink-secondary)';
const docLine = (opacity: number, width = 0.8) => ({ stroke: DOC_INK, strokeOpacity: opacity, strokeWidth: width, fill: 'none' });
const docWash = (opacity: number) => ({ fill: DOC_INK, fillOpacity: opacity });

/** A sheet of paper with a soft offset beneath it, drawn from its top-left corner. */
function Paper({ x, y, w, h, rx = 2 }: { x: number; y: number; w: number; h: number; rx?: number }) {
  return (
    <>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={rx} style={docWash(0.1)} />
      <rect x={x} y={y} width={w} height={h} rx={rx} style={{ fill: PAPER, stroke: DOC_INK, strokeOpacity: 0.55, strokeWidth: 0.9 }} />
    </>
  );
}

/**
 * The house on the drawings: the Hero's house (`assets/hero/house-render`), redrawn as a front elevation. The render
 * is a night perspective; a plan set shows a building flat, in line. So this is drawn from it, not traced and not
 * placed: the tall pylon with its slot of light, the slatted pergola on the roof, the great roof and its overhang,
 * the glazed upper storey behind a balcony rail, the cantilevered balcony slab, the glazed ground storey with the
 * stair seen through it, the garage, the lower wing to the left with its own roof and balcony, and the entry steps.
 * On the sheet's own 230-unit width, the ground at y = 120. Line only: no fill, no shade, no amber.
 */
const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const HOUSE_ELEVATION = {
  masses: [
    box(66, 30, 14, 90), // the pylon
    box(24, 61, 42, 4), // the left wing's roof
    box(31, 65, 35, 22), // its upper storey
    box(16, 87, 50, 4), // its balcony slab
    box(27, 91, 39, 29), // its lower storey
    box(80, 55, 100, 4.5), // the great roof
    box(84, 59.5, 84, 25), // the upper storey
    box(78, 84.5, 102, 4.5), // the balcony slab
    box(84, 89, 52, 31), // the glazed ground storey
    'M136 89H172V120', // the garage wall
    box(142, 97, 26, 23), // the garage door
    'M84 55V37H122V55', // the pergola on the roof
    'M56 120V117H94V120M60 117V114H90V117', // the entry steps
  ].join(''),
  detail: [
    box(71.5, 40, 3, 62), // the slot of light in the pylon
    'M84 41.5H122M84 46H122M84 50.5H122', // the pergola's slats
    'M42 65V87M54 65V87M40 91V120M53 91V120', // the left wing's glazing
    'M16 87V80H31', // its balcony rail
    'M105 59.5V84.5M126 59.5V84.5M147 59.5V84.5', // the upper storey's glazing
    'M80 77H180V84.5', // the balcony rail
    'M101 89V120M118 89V120', // the ground storey's glazing
    'M104 117L132 93', // the stair, seen through the glass
    'M142 103H168M142 109H168M142 115H168', // the garage door's panels
  ].join(''),
};

/** A stack of architectural drawings: two sheets beneath, the house's front elevation on top. Drawn on 230 x 150 and scaled to the sheet. */
function DrawingStack({ sheet }: { sheet: { x: number; y: number; w: number; h: number; turn: number } }) {
  const u = sheet.w / 230;
  const W = 230;
  const H = sheet.h / u;
  /* Line weights are given at full size and kept as the sheet is scaled. */
  const ln = (opacity: number, width = 0.8) => docLine(opacity, width / u);
  const about = `${W / 2} ${H / 2}`;
  return (
    <g transform={`translate(${sheet.x} ${sheet.y}) scale(${u})`}>
      <g transform={`rotate(${sheet.turn - 5} ${about})`}>
        <rect width={W} height={H} style={{ ...ln(0.4), fill: PAPER }} />
      </g>
      <g transform={`rotate(${sheet.turn + 3} ${about}) translate(5 -5)`}>
        <rect width={W} height={H} style={{ ...ln(0.45), fill: PAPER }} />
      </g>
      <g transform={`rotate(${sheet.turn} ${about})`}>
        <rect x={2 / u} y={3 / u} width={W} height={H} style={docWash(0.1)} />
        <rect width={W} height={H} style={{ ...ln(0.55, 0.9), fill: PAPER }} />
        <rect x={6} y={6} width={W - 12} height={H - 12} style={ln(0.4, 0.6)} />
        {/* The front elevation of the Hero's house, drawn flat as a plan set draws it: its masses, the lighter lines within
            them, the ground and a dimension string. */}
        <path d={HOUSE_ELEVATION.masses} style={{ ...ln(0.75), strokeLinejoin: 'round' }} />
        <path d={HOUSE_ELEVATION.detail} style={ln(0.5, 0.5)} />
        <path d="M10 120H184" style={ln(0.85, 1.1)} />
        <path d="M16 133H180M16 130v6M80 130v6M180 130v6" style={ln(0.5, 0.5)} />
        <rect x={14} y={14} width={46} height={2.4} style={docWash(0.35)} />
        {/* The title block, down the right. */}
        <path d={`M186 6V${H - 6}M186 ${H - 44}H${W - 6}`} style={ln(0.4, 0.6)} />
        {[16, 23, 30].map((y) => (
          <rect key={y} x={192} y={y} width={y === 30 ? 18 : 28} height={2.2} style={docWash(0.3)} />
        ))}
      </g>
    </g>
  );
}

/** A die at rest on its centre: one colour, so the pair is the one accented thing while the gamble is on. */
function Die({ size, face }: { size: number; face: number }) {
  const a = size * 0.25;
  const pips: Record<number, [number, number][]> = {
    2: [[-a, -a], [a, a]],
    3: [[-a, -a], [0, 0], [a, a]],
    4: [[-a, -a], [a, -a], [-a, a], [a, a]],
    5: [[-a, -a], [a, -a], [0, 0], [-a, a], [a, a]],
  };
  return (
    <>
      <rect x={-size / 2 + 1.5} y={-size / 2 + 2.5} width={size} height={size} rx={size * 0.2} style={docWash(0.16)} />
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.2} style={{ fill: amber, stroke: navy, strokeWidth: 1.2 }} />
      {(pips[face] ?? pips[3]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={size * 0.085} style={{ fill: navy }} />
      ))}
    </>
  );
}

/** A specification: a bound page with punched holes down one side, a heading, and sections of text under sub-headings. */
function SpecPage({ box, title, d }: { box: { x: number; y: number; w: number; h: number; turn: number }; title: string; d: boolean }) {
  const { x, y, w, h } = box;
  const pad = d ? 14 : 9;
  const inX = x + pad + (d ? 12 : 8);
  const run = x + w - pad - inX;
  const step = d ? 6.2 : 4.6;
  const bar = d ? 2.2 : 1.8;
  /* Sections: a sub-heading bar, then lines of text of these lengths. */
  const sections = d ? [[0.92, 1, 0.74], [1, 0.86, 0.95, 0.6], [0.9, 1, 0.7]] : [[0.92, 1, 0.74], [1, 0.86, 0.6], [0.9, 0.7]];
  let cursor = y + (d ? 40 : 28);
  return (
    <g transform={`rotate(${box.turn} ${x + w / 2} ${y + h / 2})`}>
      <Paper x={x} y={y} w={w} h={h} />
      {[0.2, 0.5, 0.8].map((u) => (
        <circle key={u} cx={x + pad * 0.62} cy={y + h * u} r={d ? 2.6 : 1.8} style={docLine(0.5, 0.8)} />
      ))}
      <text x={inX} y={y + (d ? 20 : 14)} style={{ fontSize: d ? 8.5 : 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fill: DOC_INK }}>
        {title}
      </text>
      <path d={`M${inX} ${y + (d ? 28 : 19)}H${x + w - pad}`} style={docLine(0.45, 0.7)} />
      {sections.map((rows, s) => {
        const top = cursor;
        cursor += (rows.length + 1) * step + (d ? 9 : 6);
        return (
          <g key={s}>
            <rect x={inX} y={top} width={run * 0.4} height={bar + 0.8} style={docWash(0.5)} />
            {rows.map((share, r) => (
              <rect key={r} x={inX} y={top + (r + 1) * step + 1} width={run * share} height={bar} style={docWash(0.26)} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/**
 * A project should not have to feel like a gamble./**
 * A project should not have to feel like a gamble. Trust: a contract on a
 * stack of drawings promises a budget and a completion date. Uncertainty: a
 * pair of dice rolls up against it. Surprises: six notices land on the
 * documents and the dice, faster and faster, and are held. A hand sweeps
 * notices and dice off the table. A better alternative: on the cleared
 * table the contractor's plan is laid beside the contract and its lines are
 * checked. Confidence: a navy stage, the plan alone
 * on it, enlarged, beside "Confidence requires a plan."
 * An illustration: no project data, no date, no amount.
 */
function RiskVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = gambleGeometry(mode);
  const c = g.contract;
  const p = g.plan;
  const { w, h } = OWNER_CANVAS[mode];
  const late = v('--jpd-chain-commitment-late');
  const onNavy = v('--jpd-nav-text');
  const L = g.lockup;
  /* The closing headline on two lines, broken after its first word; the supporting sentence on one line, or two where one will not fit. */
  const closing = OWNER_TAKEAWAY['owner-reduce-risk'];
  const headline = [closing.slice(0, closing.indexOf(' ')), closing.slice(closing.indexOf(' ') + 1)];
  const whose = GAMBLE_PLAN.support[0];
  const support = d ? [whose] : [whose.slice(0, whose.indexOf(' procurement')), whose.slice(whose.indexOf(' procurement') + 1)];
  /* Type and small measures, desktop / narrow. */
  const f = d
    ? { pad: 14, title: 8.5, term: 10, icon: 10, notice: 12, bar: 5, caption: 13, kick: 7.5, plan: 12.5, line: 10.5, box: 12 }
    : { pad: 9, title: 7.5, term: 8.5, icon: 8, notice: 8.5, bar: 4, caption: 10, kick: 7.5, plan: 10, line: 8.5, box: 9.5 };
  const iconX = c.x + f.pad + f.icon;
  const washes = (ys: number[], widths: number[]) => ys.map((y, i) => <rect key={y} x={c.x + f.pad} y={y} width={(c.w - 2 * f.pad) * widths[i]} height={d ? 2.2 : 1.8} style={docWash(0.28)} />);
  const sign = c.y + c.h - (d ? 18 : 12);
  const half = (c.w - 2 * f.pad - (d ? 16 : 10)) / 2;
  /* The completion date's label is set on two lines where one will not fit beside its icon. */
  const terms = GAMBLE_CONTRACT.terms.map((t) => (d || t.length <= 10 ? [t] : t.split(' ')));
  return (
    <>
      {/* The table the documents lie on: a drawing sheet. A cool off-white ground, so the white papers lift off it; the faint
          grid and the border the closing stage has, on the same pitch and inset, here in the documents' ink. Flat: no
          gradient, no image. Drawn past the canvas, so a frame of another shape is still wholly covered. */}
      <K k="ground">
        <rect x={-w} y={-h} width={w * 3} height={h * 3} style={{ fill: GROUND }} />
        <path
          d={[...Array.from({ length: Math.ceil(w / g.stage.grid) - 1 }, (_, i) => `M${(i + 1) * g.stage.grid} 0V${h}`), ...Array.from({ length: Math.ceil(h / g.stage.grid) - 1 }, (_, i) => `M0 ${(i + 1) * g.stage.grid}H${w}`)].join('')}
          style={docLine(0.07, 0.6)}
        />
        <rect x={g.stage.inset} y={g.stage.inset} width={w - 2 * g.stage.inset} height={h - 2 * g.stage.inset} style={docLine(0.22, 0.8)} />
      </K>

      {/* 1. The promise: three project documents. Drawings to the left, the contract in the middle, the specification to the right. */}
      <K k="drawings">
        <DrawingStack sheet={g.sheet} />
      </K>
      <K k="contract">
        <Paper x={c.x} y={c.y} w={c.w} h={c.h} />
        <text x={c.x + f.pad} y={c.y + (d ? 20 : 14)} style={{ fontSize: f.title, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fill: DOC_INK }}>
          {d ? GAMBLE_CONTRACT.title : GAMBLE_CONTRACT.short}
        </text>
        <path d={`M${c.x + f.pad} ${c.y + (d ? 28 : 19)}H${c.x + c.w - f.pad}`} style={docLine(0.45, 0.7)} />
        {washes(d ? [c.y + 37, c.y + 43, c.y + 49] : [c.y + 26, c.y + 31], [1, 0.94, 0.7])}
        {washes(d ? [c.y + 140, c.y + 146] : [c.y + 116, c.y + 121], [1, 0.8])}
        {/* Two signatures. */}
        <path d={`M${c.x + f.pad} ${sign}h${half}M${c.x + c.w - f.pad - half} ${sign}h${half}`} style={docLine(0.6, 0.7)} />
        <path d={`M${c.x + f.pad + 3} ${sign - 3}q${half * 0.12} ${d ? -11 : -8} ${half * 0.22} ${d ? -2 : -1.5}t${half * 0.2} 0t${half * 0.24} ${d ? -4 : -3}`} style={docLine(0.8, 1)} />
        <path d={`M${c.x + c.w - f.pad - half + 3} ${sign - 2}q${half * 0.1} ${d ? -8 : -6} ${half * 0.2} ${d ? -3 : -2}t${half * 0.26} ${d ? 1 : 0.5}t${half * 0.2} ${d ? -5 : -4}`} style={docLine(0.8, 1)} />
      </K>
      <K k="specs">
        <SpecPage box={g.specs} title={d ? GAMBLE_SPECS.title : GAMBLE_SPECS.short} d={d} />
      </K>
      {terms.map((lines, i) => {
        const cy = g.termY[i];
        const top = cy - (lines.length - 1) * (f.term * 0.58);
        return (
          <K key={GAMBLE_CONTRACT.terms[i]} k={`term-${i}`}>
            {i === 0 ? (
              <>
                <circle cx={iconX} cy={cy} r={f.icon} style={{ fill: 'none', stroke: navy, strokeWidth: 1.4 }} />
                <text x={iconX} y={cy + f.icon * 0.42} textAnchor="middle" style={{ fontSize: f.icon * 1.2, fontWeight: 700, fill: navy }}>
                  $
                </text>
              </>
            ) : (
              <>
                <rect x={iconX - f.icon} y={cy - f.icon * 0.82} width={f.icon * 2} height={f.icon * 1.74} rx={2} style={{ fill: 'none', stroke: navy, strokeWidth: 1.4 }} />
                <rect x={iconX - f.icon} y={cy - f.icon * 0.82} width={f.icon * 2} height={f.icon * 0.52} rx={2} style={{ fill: navy }} />
                {[-0.5, 0, 0.5].flatMap((dx) =>
                  [0.14, 0.56].map((dy) => <rect key={`${dx}-${dy}`} x={iconX + dx * f.icon - f.icon * 0.12} y={cy + dy * f.icon - f.icon * 0.12} width={f.icon * 0.24} height={f.icon * 0.24} style={{ fill: navy }} />),
                )}
              </>
            )}
            {lines.map((line, n) => (
              <text key={line} x={g.termX} y={top + n * f.term * 1.16 + f.term * (lines.length > 1 ? 0.36 : 0.1)} style={{ fontSize: f.term, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fill: navy }}>
                {line}
              </text>
            ))}
            {/* Where the figure is written: a line, never a number. */}
            {lines.length === 1 && <rect x={g.termX} y={cy + f.term * 0.62} width={d ? 68 : 42} height={d ? 2.4 : 2} style={docWash(0.3)} />}
          </K>
        );
      })}

      {/* 2. Uncertainty: the dice, in the middle of the frame, on the contract beneath its promises; and the question beneath. */}
      {g.dice.map((die, i) => (
        <g key={i} transform={`translate(${die.cx} ${die.cy})`}>
          <K k={`die-${i}`}>
            <g transform={`rotate(${die.turn})`}>
              <Die size={g.die} face={GAMBLE_DICE[i]} />
            </g>
          </K>
        </g>
      ))}
      <K k="caption">
        <text x={g.caption.x} y={g.caption.y} textAnchor="middle" style={{ fontSize: f.caption, fontWeight: 700, letterSpacing: '-0.01em', fill: navy }}>
          {GAMBLE_CAPTION.join(' ')}
        </text>
      </K>

      {/* 3. The surprises: six, piled in two columns either side of the dice and never on them, every heading in view. */}
      {g.notices.map((n, i) => {
        const { w, h } = g.notice;
        const urgent = i === GAMBLE_URGENT;
        return (
          <g key={GAMBLE_NOTICES[i]} transform={`translate(${n.cx} ${n.cy})`}>
            <K k={`notice-${i}`}>
              <g transform={`rotate(${n.turn})`}>
                <Paper x={-w / 2} y={-h / 2} w={w} h={h} />
                <rect x={-w / 2} y={-h / 2} width={f.bar} height={h} rx={1} style={{ fill: late }} />
                <text x={-w / 2 + f.bar + (d ? 10 : 7)} y={-h / 2 + (d ? 23 : 14.5)} style={{ fontSize: f.notice, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fill: urgent ? late : navy }}>
                  {GAMBLE_NOTICES[i]}
                </text>
                {[0, 1].map((r) => (
                  <rect key={r} x={-w / 2 + f.bar + (d ? 10 : 7)} y={-h / 2 + (d ? 33 : 20.5) + r * (d ? 8 : 5.5)} width={(w - f.bar - (d ? 22 : 15)) * (r ? 0.62 : 1)} height={d ? 2.4 : 1.8} style={docWash(0.28)} />
                ))}
              </g>
            </K>
          </g>
        );
      })}
      {/* 4. The hand that sweeps the table clear: one finished illustration, leaned and moved as a single object. It comes in
          from the lower left and travels up to the right; notices and dice go with it; the documents beneath do not. */}
      <g transform={`translate(${g.hand.ax} ${g.hand.ay})`}>
        <K k="hand">
          <g transform={`rotate(${g.hand.tilt}) scale(${g.hand.scale})`}>
            <SweepingHand />
          </g>
        </K>
      </g>

      {/* The turn: one line on the cleared table, over the documents once they have stepped back. Plain type, the caption's
          own, larger: no rule, no accent. */}
      <K k="turn">
        <text x={g.turn.x} y={g.turn.y} textAnchor="middle" style={{ fontSize: g.turn.size, fontWeight: 700, letterSpacing: '-0.02em', fill: navy }}>
          {GAMBLE_TURN}
        </text>
      </K>

      {/* 5. The stage the story closes on: navy, with the faint grid and border of a drawing sheet. It is drawn
          past the canvas on every side, so a frame of another shape is still wholly navy. */}
      <K k="stage">
        <rect x={-w} y={-h} width={w * 3} height={h * 3} style={{ fill: navy }} />
        <path
          d={[...Array.from({ length: Math.ceil(w / g.stage.grid) - 1 }, (_, i) => `M${(i + 1) * g.stage.grid} 0V${h}`), ...Array.from({ length: Math.ceil(h / g.stage.grid) - 1 }, (_, i) => `M0 ${(i + 1) * g.stage.grid}H${w}`)].join('')}
          style={{ fill: 'none', stroke: onNavy, strokeOpacity: 0.055, strokeWidth: 0.6 }}
        />
        <rect x={g.stage.inset} y={g.stage.inset} width={w - 2 * g.stage.inset} height={h - 2 * g.stage.inset} style={{ fill: 'none', stroke: onNavy, strokeOpacity: 0.2, strokeWidth: 0.8 }} />
      </K>

      {/* 5 and 6. The contractor's plan: laid over the documents once they have stepped back;
          then, at the close, moved to the left of the stage and enlarged about its own centre. */}
      <g transform={`translate(${p.x + p.w / 2} ${p.y + p.h / 2})`}>
        <K k="plan">
          <g transform={`translate(${-(p.x + p.w / 2)} ${-(p.y + p.h / 2)})`}>
            <Paper x={p.x} y={p.y} w={p.w} h={p.h} rx={3} />
            <rect x={p.x} y={p.y} width={p.w} height={d ? 6 : 4} rx={2} style={{ fill: amber }} />
            <text x={p.x + f.pad} y={p.y + (d ? 23 : 15)} style={kicker(f.kick, sec)}>
              {GAMBLE_PLAN.whose}
            </text>
            <text x={p.x + p.w - f.pad} y={p.y + (d ? 23 : 15)} textAnchor="end" style={{ fontSize: d ? 9 : 7.5, fontWeight: 800, letterSpacing: '-0.01em', fill: navy }}>
              {GAMBLE_PLAN.mark}
            </text>
            <text x={p.x + f.pad} y={p.y + (d ? 40 : 28)} style={{ fontSize: f.plan, fontWeight: 700, letterSpacing: '-0.01em', fill: navy }}>
              {GAMBLE_PLAN.title}
            </text>
            <path d={`M${p.x + f.pad} ${p.y + (d ? 50 : 35)}H${p.x + p.w - f.pad}`} style={docLine(0.4, 0.7)} />
            {GAMBLE_PLAN.lines.map((line, i) => {
              const bx = p.x + f.pad;
              const cy = g.lineY(i);
              return (
                <g key={line}>
                  <rect x={bx} y={cy - f.box / 2} width={f.box} height={f.box} rx={2.5} style={{ ...docLine(0.6, 1), fill: PAPER }} />
                  <K k={`line-${i}`}>
                    <text x={bx + f.box + (d ? 9 : 6)} y={cy + f.line * 0.36} style={{ fontSize: f.line, fontWeight: 600, fill: ink }}>
                      {line}
                    </text>
                  </K>
                  <Drawn k={`check-${i}`} d={`M${bx + f.box * 0.2} ${cy + f.box * 0.02}l${f.box * 0.24} ${f.box * 0.26}l${f.box * 0.46} ${-f.box * 0.56}`} stroke={v('--jpd-ok-fg')} width={d ? 2.2 : 1.8} cap="round" />
                </g>
              );
            })}
          </g>
        </K>
      </g>

      {/* The closing lockup, to the right of the plan: a rule, the headline, then whose plan it is. */}
      <K k="takeaway">
        <rect x={L.textX} y={L.ruleY} width={d ? 28 : 20} height={3} rx={1.5} style={{ fill: amber }} />
        {headline.map((line, i) => (
          <text key={line} x={L.textX} y={L.headY[i]} style={{ fontSize: L.head, fontWeight: 700, letterSpacing: '-0.02em', fill: onNavy }}>
            {line}
          </text>
        ))}
        {support.map((line, i) => (
          <text key={line} x={L.textX} y={L.supportY[i]} style={{ fontSize: L.support, fontWeight: 500, fill: onNavy, fillOpacity: 0.78 }}>
            {line}
          </text>
        ))}
        <text x={L.textX} y={L.supportY[support.length]} style={{ fontSize: L.support + 0.5, fontWeight: 700, fill: amber }}>
          {GAMBLE_PLAN.support[1]}
        </text>
      </K>
    </>
  );
}

/* ------------------------------------------------ 2. Protect your investment */

/** A short mark on a slip of paper, centred where it is placed: a rushed request in the late colour, or a planned one in navy with a calendar. */
function Slip({ w, h, label, size, planned = false }: { w: number; h: number; label: string; size: number; planned?: boolean }) {
  const tone = planned ? navy : v('--jpd-chain-commitment-late');
  const cal = h * 0.5;
  return (
    <>
      <rect x={-w / 2 + 1} y={-h / 2 + 2} width={w} height={h} rx={h * 0.22} style={docWash(0.12)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.22} style={{ fill: PAPER, stroke: tone, strokeWidth: 1.2 }} />
      {planned && (
        <>
          <rect x={-w / 2 + h * 0.3} y={-cal / 2} width={cal} height={cal} rx={1} style={{ fill: 'none', stroke: navy, strokeWidth: 1 }} />
          <rect x={-w / 2 + h * 0.3} y={-cal / 2} width={cal} height={cal * 0.32} style={{ fill: navy }} />
        </>
      )}
      <text x={planned ? h * 0.42 : 0} y={size * 0.36} textAnchor="middle" style={{ fontSize: size, fontWeight: 800, letterSpacing: planned ? '0' : '0.06em', textTransform: planned ? 'none' : 'uppercase', fill: tone }}>
        {label}
      </text>
    </>
  );
}

/** A hard hat, standing for the contractor: a dome on a brim, about the middle of its brim. */
function HardHat({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <>
      <path d={`M${cx - r} ${cy}a${r} ${r} 0 0 1 ${r * 2} 0z`} style={{ fill }} />
      <rect x={cx - r * 0.16} y={cy - r * 1.08} width={r * 0.32} height={r * 0.5} rx={r * 0.12} style={{ fill }} />
      <rect x={cx - r * 1.4} y={cy} width={r * 2.8} height={r * 0.3} rx={r * 0.15} style={{ fill }} />
    </>
  );
}

/**
 * A construction roll-off dumpster: a plain rectangular steel box with an
 * open top and a flat bottom, sitting directly on the ground. Corrugated
 * sides, a rail along the top edge, a skid along the foot, a post at each
 * corner. Seen from slightly above and to one side, so the open top and one
 * end show. NO wheels, NO handle, NO taper: it is a box, heavy and grounded.
 *
 * Drawn in two parts so that what falls in goes INSIDE: `part="back"` is the
 * far end and the interior seen through the open top, behind anything
 * falling; `part="front"` is the near wall, in front of anything falling.
 */
function Dumpster({ part, cx, top, w, h, rim, skew }: { part: 'back' | 'front'; cx: number; top: number; w: number; h: number; rim: number; skew: number }) {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const foot = top + h;
  const light = v('--jpd-nav-text');
  const rib = { fill: 'none', stroke: light, strokeOpacity: 0.26, strokeWidth: Math.max(0.8, w * 0.011) };
  if (part === 'back') {
    const opening = `M${l} ${top}L${l + skew} ${top - rim}H${r + skew}L${r} ${top}Z`;
    const end = `M${r} ${top}L${r + skew} ${top - rim}V${foot - rim}L${r} ${foot}Z`;
    return (
      <>
        {/* The end wall, turned away: steel, a shade lighter than the near wall, with two ribs. */}
        <path d={end} style={{ fill: navy }} />
        <path d={end} style={{ fill: light, fillOpacity: 0.16 }} />
        {[0.36, 0.7].map((u) => (
          <path key={u} d={`M${r + skew * u} ${top - rim * u + 2}V${foot - rim * u - 2}`} style={rib} />
        ))}
        {/* The open top: the inside of the box, in shadow, and the rim around it. */}
        <path d={opening} style={{ fill: PAPER }} />
        <path d={opening} style={{ fill: DOC_INK, fillOpacity: 0.62 }} />
        <path d={`M${l + skew} ${top - rim}H${r + skew}`} style={{ fill: 'none', stroke: navy, strokeWidth: 2.2, strokeLinecap: 'round' }} />
        <path d={opening} style={{ fill: 'none', stroke: navy, strokeWidth: 1.2, strokeLinejoin: 'round' }} />
      </>
    );
  }
  const ribs = Math.max(6, Math.round(w / 9));
  const rail = Math.max(3, h * 0.11);
  const post = Math.max(3, w * 0.04);
  return (
    <>
      {/* It sits on the ground: a soft line beneath its whole length, and nothing under it. */}
      <path d={`M${l - 2} ${foot + 1.5}H${r + skew * 0.6}`} style={docLine(0.2, 2.5)} />
      {/* The near wall: a flat rectangle of corrugated steel. */}
      <rect x={l} y={top} width={w} height={h} style={{ fill: navy }} />
      {Array.from({ length: ribs }, (_, k) => {
        const x = l + post + ((w - 2 * post) * (k + 0.5)) / ribs;
        return <path key={k} d={`M${x} ${top + rail + 1}V${foot - rail - 1}`} style={rib} />;
      })}
      {/* A post at each corner, the rail along the top edge, the skid along the foot. */}
      {[l, r - post].map((x) => (
        <rect key={x} x={x} y={top} width={post} height={h} style={{ fill: light, fillOpacity: 0.14 }} />
      ))}
      <rect x={l - 1} y={top - rail * 0.3} width={w + 2} height={rail} style={{ fill: navy }} />
      <path d={`M${l - 1} ${top + rail * 0.7}H${r + 1}`} style={{ fill: 'none', stroke: light, strokeOpacity: 0.4, strokeWidth: 0.8 }} />
      <path d={`M${l} ${foot - rail}H${r}`} style={{ fill: 'none', stroke: light, strokeOpacity: 0.4, strokeWidth: 0.8 }} />
    </>
  );
}

/**
 * Protected value: a small shield with a dollar sign, about the point it is
 * placed at. The picture's own shield, small: navy, an amber edge, a white
 * dollar sign, and nothing else. No figure, no second shield inside it.
 */
function ValueShield({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const outline = shieldPath({ cx: x, cy: y, w, h });
  return (
    <>
      <path d={outline} transform={`translate(0 ${Math.max(1, h * 0.08)})`} style={docWash(0.16)} />
      <path d={outline} style={{ fill: navy, stroke: amber, strokeWidth: Math.max(1.2, w * 0.085), strokeLinejoin: 'round' }} />
      <text x={x} y={y + h * 0.15} textAnchor="middle" style={{ fontSize: h * 0.56, fontWeight: 800, fill: v('--jpd-nav-text') }}>
        $
      </text>
    </>
  );
}

/** One small line glyph per group, drawn on a 16-unit square: a house, a set square, a magnifier, a package. One weight, one colour. */
const GROUP_GLYPH: Record<TeamId, string> = {
  owner: 'M2.5 8L8 3L13.5 8M4 7V13H12V7M7 13V9.5H9V13',
  design: 'M3 13V3L13 13ZM5.5 11V8.5L8 11Z',
  consultants: 'M7 11.5A4.5 4.5 0 1 0 7 2.5A4.5 4.5 0 0 0 7 11.5ZM10.2 10.2L13.5 13.5',
  vendors: 'M3 5.5L8 3L13 5.5V11L8 13.5L3 11ZM3 5.5L8 8L13 5.5M8 8V13.5',
};

/**
 * The general contractor is the hero, in the middle of the frame from first
 * to last, with the owner, the design team, the consultants and the vendors
 * around. Out of control: the contractor's card sits askew, friction runs
 * outward to all four, rushed requests follow it, and each group shows what
 * that costs it. In control: a shield is drawn around the contractor, with
 * JiTpro; level lines reach the same four; each settles. Everything stays
 * for the close. An illustration: no amounts, and the shield stands for
 * control of the process, not for a guarantee.
 *
 * FINISH (refined 2026-11-12): depth by a soft offset beneath each object,
 * never a blur, gradient or glow; a second, inner line on the shield; one
 * glyph and a navy cap on each card; rounded connectors with a node at each
 * end; and, behind it all, the faint grid and crop marks of a drawing sheet.
 */
function InvestmentVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = teamGeometry(mode);
  const { w } = OWNER_CANVAS[mode];
  const s = g.shield;
  const onNavy = v('--jpd-nav-text');
  const late = v('--jpd-chain-commitment-late');
  const f = d ? { name: 10, line: 9.5, pad: 10, hero: 10.5, mark: 11.5, state: 9, icon: 18, hat: 19 } : { name: 8, line: 7.5, pad: 7, hero: 7.5, mark: 8, state: 7.5, icon: 12, hat: 11.5 };
  const caps = (size: number, fill: string, tracking = '0.08em') => ({ fontSize: size, fontWeight: 800, letterSpacing: tracking, textTransform: 'uppercase' as const, fill });
  const outline = shieldPath(s);
  const inset = d ? 7 : 5;
  const inner = shieldPath({ cx: s.cx, cy: s.cy - inset * 0.15, w: s.w - inset * 2, h: s.h - inset * 2.1 });
  /* The contractor's name beneath the hat: two lines where there is room, one short word where there is not. */
  const name = d ? TEAM_CONTRACTOR.lines : [TEAM_CONTRACTOR.short];
  const hatY = s.cy - s.h * (d ? 0.17 : 0.13);
  const nameY = hatY + (d ? 25 : 17);
  const nameStep = d ? 13 : 9;
  const ruleY = nameY + (name.length - 1) * nameStep + (d ? 11 : 8);
  const state = (k: string, label: string, fill: string) => (
    <K k={k}>
      <text x={s.cx} y={g.stateY} textAnchor="middle" style={caps(f.state, fill, '0.12em')}>
        {label}
      </text>
    </K>
  );
  /* The background: the grid and crop marks of a drawing sheet, barely there. Nothing else: no decorative building or site imagery. */
  const G = g.ground;
  const crop = d ? 12 : 8;
  const edge = d ? 8 : 5;
  const top = g.band.y - edge;
  return (
    <>
      <K k="ground">
        <path
          d={[...Array.from({ length: Math.ceil(w / G.grid) - 1 }, (_, i) => `M${(i + 1) * G.grid} 0V${g.band.y}`), ...Array.from({ length: Math.ceil(g.band.y / G.grid) - 1 }, (_, i) => `M0 ${(i + 1) * G.grid}H${w}`)].join('')}
          style={docLine(0.05, 0.6)}
        />
        <path
          d={`M${edge} ${edge + crop}V${edge}H${edge + crop}M${w - edge - crop} ${edge}H${w - edge}V${edge + crop}M${edge} ${top - crop}V${top}H${edge + crop}M${w - edge - crop} ${top}H${w - edge}V${top - crop}`}
          style={docLine(0.28, 0.9)}
        />
      </K>

      {state('stateOut', TEAM_STATES.out, late)}
      {state('stateIn', TEAM_STATES.in, navy)}

      {/* The lines of both states, beneath everything they join: jagged in the first, level and round-cornered in the second. */}
      {TEAM.map((t, i) => (
        <g key={t.id}>
          <Drawn k={`friction-${i}`} d={g.friction(i)} stroke={late} width={d ? 1.6 : 1.3} />
          <Drawn k={`link-${i}`} d={g.link(i)} stroke={navy} width={d ? 2 : 1.6} cap="round" />
        </g>
      ))}

      {/* The four groups the contractor's coordination reaches. Each card's glyph and words are set from its outer edge, so its
          inner corners are free for what arrives from the middle. */}
      {TEAM.map((t, i) => {
        const { x, y } = g.at[i];
        const left = g.onLeft(i);
        const side = left ? 1 : -1;
        const edgeX = left ? x + f.pad : x + g.card.w - f.pad;
        const anchor = left ? 'start' : 'end';
        const iconX = left ? edgeX : edgeX - f.icon;
        const iconY = y + (d ? 11 : 7.5);
        const nameX = edgeX + side * (f.icon + (d ? 7 : 5));
        const lineY = y + (d ? 45 : 31);
        const tick = d ? 9 : 7;
        const tickX = left ? edgeX : edgeX - tick;
        const end = g.linkEnd(i);
        return (
          <g key={t.id}>
            <K k={`card-${i}`}>
              {/* Depth: two soft offsets beneath the card. Then the card, and a navy cap along its top. */}
              <rect x={x} y={y + (d ? 4 : 3)} width={g.card.w} height={g.card.h} rx={5} style={docWash(0.07)} />
              <rect x={x + 0.5} y={y + 1.5} width={g.card.w - 1} height={g.card.h} rx={5} style={docWash(0.09)} />
              <rect x={x} y={y} width={g.card.w} height={g.card.h} rx={5} style={{ fill: PAPER, stroke: DOC_INK, strokeOpacity: 0.4, strokeWidth: 0.9 }} />
              <path d={`M${x + 5} ${y}H${x + g.card.w - 5}a5 5 0 0 1 5 5H${x}a5 5 0 0 1 5 -5z`} style={{ fill: navy }} />
              <rect x={iconX} y={iconY} width={f.icon} height={f.icon} rx={f.icon * 0.22} style={docWash(0.1)} />
              <path d={GROUP_GLYPH[t.id]} transform={`translate(${iconX + f.icon * 0.055} ${iconY + f.icon * 0.055}) scale(${(f.icon * 0.89) / 16})`} style={{ fill: 'none', stroke: navy, strokeWidth: (d ? 1.5 : 1.2) / ((f.icon * 0.89) / 16), strokeLinejoin: 'round', strokeLinecap: 'round' }} />
              <text x={nameX} y={iconY + f.icon / 2 + f.name * 0.36} textAnchor={anchor} style={caps(f.name, navy)}>
                {t.label}
              </text>
              <rect x={left ? edgeX : edgeX - (g.card.w - 2 * f.pad) * 0.5} y={y + g.card.h - (d ? 10 : 7)} width={(g.card.w - 2 * f.pad) * 0.5} height={d ? 2.2 : 1.8} style={docWash(0.2)} />
            </K>
            {/* Out of control: what it costs this group. */}
            <K k={`effect-${i}`}>
              {g.effectLines(i).map((line, n, lines) => (
                <text key={line} x={edgeX} y={lineY + (n - (lines.length - 1) / 2) * g.effectSize * 1.18} textAnchor={anchor} style={{ fontSize: g.effectSize, fontWeight: 700, fill: late }}>
                  {line}
                </text>
              ))}
            </K>
            {/* In control: how this group now stands. A check, one calm word, and the node where its line arrives. */}
            <K k={`calm-${i}`}>
              <path d={`M${tickX} ${lineY - tick * 0.38}l${tick * 0.32} ${tick * 0.34}l${tick * 0.6} ${-tick * 0.72}`} style={{ fill: 'none', stroke: v('--jpd-ok-fg'), strokeWidth: d ? 2 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
              <text x={edgeX + side * (tick + (d ? 6 : 4))} y={lineY} textAnchor={anchor} style={{ fontSize: f.line + 1, fontWeight: 700, fill: navy }}>
                {t.calm}
              </text>
              <circle cx={end.card.x} cy={end.card.y} r={d ? 3.4 : 2.6} style={{ fill: navy, stroke: PAPER, strokeWidth: d ? 1.4 : 1.1 }} />
            </K>
            {/* In control, value is protected: a small shield with a dollar sign settles on the card. */}
            <K k={`keep-${i}`}>
              <ValueShield {...g.keepAt(i)} {...g.badge} />
            </K>
          </g>
        );
      })}

      {/* The rushed requests, each landing on a group already dealing with the last. */}
      {TEAM_RUSH.map((r, i) => {
        const rest = g.tagAt(r.to, r.round);
        return (
          <g key={i} transform={`translate(${rest.cx} ${rest.cy})`}>
            <K k={`rush-${i}`}>
              <g transform={`rotate(${rest.turn})`}>
                <Slip w={rest.w} h={g.tag.h} label={requestLabel(r)} size={g.tag.size} />
              </g>
            </K>
          </g>
        );
      })}

      {/* Out of control, money is wasted: bills leave the contractor's card and each group's and fall into a jobsite dumpster. Avoidable waste,
          never a figure. Layered so that they fall INSIDE: the dumpster's interior, then the bills, then its near wall. */}
      <K k="binBack">
        <Dumpster part="back" {...g.bin} />
      </K>
      {Array.from({ length: TEAM_WASTE_ROUNDS }, (_, r) =>
        TEAM_PARTIES.map((who) => {
          const { from } = g.billPath(who, r);
          const { w: bw, h: bh } = g.bill;
          return (
            <g key={`${who}-${r}`} transform={`translate(${from.x} ${from.y})`}>
              <K k={`bill-${who}-${r}`}>
                <rect x={-bw / 2 + 1} y={-bh / 2 + 1.5} width={bw} height={bh} rx={1.5} style={docWash(0.12)} />
                <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={1.5} style={{ fill: PAPER, stroke: navy, strokeWidth: d ? 1.1 : 0.9 }} />
                <rect x={-bw / 2 + bh * 0.2} y={-bh / 2 + bh * 0.2} width={bw - bh * 0.4} height={bh * 0.6} rx={1} style={docLine(0.35, 0.6)} />
                <circle cx={0} cy={0} r={bh * 0.34} style={{ fill: amber }} />
                <text x={0} y={bh * 0.2} textAnchor="middle" style={{ fontSize: bh * 0.56, fontWeight: 800, fill: navy }}>
                  $
                </text>
              </K>
            </g>
          );
        }),
      )}
      <K k="bin">
        <Dumpster part="front" {...g.bin} />
      </K>

      {/* 1. The contractor out of control: a plain card, askew, the hat tipped. */}
      <g transform={`translate(${s.cx} ${s.cy})`}>
        <K k="loose">
          <g transform={`rotate(${g.loose.turn}) translate(${-s.cx} ${-s.cy})`}>
            <rect x={s.cx - g.loose.w / 2 + 2} y={s.cy - g.loose.h / 2 + 4} width={g.loose.w} height={g.loose.h} rx={6} style={docWash(0.1)} />
            <rect x={s.cx - g.loose.w / 2} y={s.cy - g.loose.h / 2} width={g.loose.w} height={g.loose.h} rx={6} style={{ fill: PAPER, stroke: late, strokeWidth: 1.4 }} />
            <g transform={`rotate(14 ${s.cx} ${s.cy - (d ? 6 : 3)})`}>
              <HardHat cx={s.cx} cy={s.cy - (d ? 6 : 3)} r={d ? 17 : 11} fill={navy} />
            </g>
            {name.map((line, i) => (
              <text key={line} x={s.cx} y={s.cy + (d ? 18 : 13) + i * (d ? 12 : 9)} textAnchor="middle" style={caps(d ? 9.5 : 7.5, navy)}>
                {line}
              </text>
            ))}
          </g>
        </K>
      </g>

      {/* 2. The contractor in control: the shield, the anchor of the whole picture. Its edge is drawn, then it stands:
          a soft offset beneath it, navy, an amber edge, a second fine line inside, the hat and the name, a short rule, JiTpro. */}
      <Drawn k="guard" d={outline} stroke={amber} width={d ? 3 : 2.2} cap="round" />
      <K k="shield">
        <path d={outline} transform={`translate(0 ${d ? 5 : 3.5})`} style={docWash(0.16)} />
        <path d={outline} style={{ fill: navy, stroke: amber, strokeWidth: d ? 3 : 2.2, strokeLinejoin: 'round' }} />
        <path d={inner} style={{ fill: 'none', stroke: onNavy, strokeOpacity: 0.22, strokeWidth: d ? 1 : 0.8, strokeLinejoin: 'round' }} />
        <HardHat cx={s.cx} cy={hatY} r={f.hat} fill={onNavy} />
        {name.map((line, i) => (
          <text key={line} x={s.cx} y={nameY + i * nameStep} textAnchor="middle" style={caps(f.hero, onNavy, '0.1em')}>
            {line}
          </text>
        ))}
        <rect x={s.cx - (d ? 12 : 8)} y={ruleY} width={d ? 24 : 16} height={d ? 2 : 1.6} rx={1} style={{ fill: amber }} />
        <text x={s.cx} y={ruleY + (d ? 18 : 12.5)} textAnchor="middle" style={{ fontSize: f.mark, fontWeight: 800, letterSpacing: '-0.01em', fill: amber }}>
          {TEAM_MARK}
        </text>
      </K>
      {/* The contractor's value is protected too: the same small shield, standing just outside the great one, never on it. */}
      <K k="keep-gc">
        <ValueShield {...g.keepAt('gc')} {...g.badge} />
      </K>
      {/* Where each line leaves the shield: an amber node on its edge, appearing with the line. */}
      {TEAM.map((t, i) => {
        const end = g.linkEnd(i);
        return (
          <K key={t.id} k={`node-${i}`}>
            <circle cx={end.shield.x} cy={end.shield.y} r={d ? 3.4 : 2.6} style={{ fill: amber, stroke: navy, strokeWidth: d ? 1.4 : 1.1 }} />
          </K>
        );
      })}

      {/* The foot of each state: one band, the same for both. The first state's goes when that state is withdrawn; the
          second's rises at the close, under the whole connected picture, and stays. */}
      {/* One bar, there throughout; only its words change. Both feet draw the same bar under the one key. */}
      <TeamFoot mode={mode} band="foot" words="footOutWords" {...TEAM_FOOT.out} />
      <TeamFoot mode={mode} band="foot" words="takeaway" {...TEAM_FOOT.in} />
    </>
  );
}

/**
 * The foot of Protect your investment, used by both of its states so that the
 * two are the same band: navy, an amber edge along its top, a line in white
 * and a phrase beneath it in amber, centred. Drawn past the canvas on every
 * side but its top, so a frame of another shape is still closed by it.
 * `band` and `words` are the keys the clock shows them by.
 */
function TeamFoot({ mode, band, words, head, support }: { mode: OwnerMode; band: string; words: string; head: string; support?: string }) {
  const d = mode === 'desktop';
  const { w, h } = OWNER_CANVAS[mode];
  const B = teamGeometry(mode).band;
  /* A line alone sits in the middle of where the line and the phrase would be. */
  const headY = support === undefined ? (B.headY + B.supportY) / 2 + (B.head - B.support) * 0.3 : B.headY;
  return (
    <>
      <K k={band}>
        <rect x={-w} y={B.y} width={w * 3} height={h * 2} style={{ fill: navy }} />
        <rect x={-w} y={B.y} width={w * 3} height={d ? 2.5 : 2} style={{ fill: amber }} />
      </K>
      <K k={words}>
        <text x={w / 2} y={headY} textAnchor="middle" style={{ fontSize: B.head, fontWeight: 700, letterSpacing: '-0.015em', fill: v('--jpd-nav-text') }}>
          {head}
        </text>
        {support !== undefined && (
          <text x={w / 2} y={B.supportY} textAnchor="middle" style={{ fontSize: B.support, fontWeight: 700, fill: amber }}>
            {support}
          </text>
        )}
      </K>
    </>
  );
}

/* ----------------------------------------------------- 3. More predictability */

function PredictabilityVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const { w } = OWNER_CANVAS[mode];
  const pad = d ? 20 : 10;
  const win = lookaheadWindow();
  const x0 = d ? 214 : 104;
  const x1 = w - pad - 6;
  const X = (date: string) => x0 + ((Date.parse(date) - win.start) / (win.end - win.start)) * (x1 - x0);
  const Xt = (t: number) => x0 + ((t - win.start) / (win.end - win.start)) * (x1 - x0);
  const yearY = d ? 17 : 11;
  const monthY = d ? 31 : 22;
  const top = d ? 40 : 28;
  const pitch = d ? 48 : 32;
  const bottom = top + OWNER_DECISIONS.length * pitch;
  const lead = 60 * 86400000;
  const legendY = bottom + (d ? 26 : 17);
  const L = d ? { x: 112, f: 10, gap: [0, 26, 86, 104, 130, 178, 196, 208] } : { x: 26, f: 8, gap: [0, 18, 62, 74, 94, 130, 142, 152] };
  return (
    <>
      <K k="axis">
        <rect x={0} y={0} width={w} height={top} style={{ fill: v('--jpd-surface-header') }} />
        <path d={`M0 ${top + 0.5}H${w}`} style={{ stroke: edge, fill: 'none' }} />
        {win.months.map((m, i) => {
          const x = Math.round(Xt(m.t));
          const show = d || i % 3 === 0;
          return (
            <g key={m.t}>
              <path d={`M${x + 0.5} ${m.first ? 0 : top}V${bottom}`} style={{ stroke: m.first ? edge : v('--jpd-grid'), fill: 'none' }} />
              {m.first && (
                <text x={x + 4} y={yearY} style={{ fontSize: d ? 9 : 8, fontWeight: 700, letterSpacing: '0.04em', fill: ink }}>
                  {m.year}
                </text>
              )}
              {show && (
                <text x={x + 3} y={monthY} style={{ fontSize: d ? 9.5 : 8, fontWeight: 500, fill: sec }}>
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
        {OWNER_DECISIONS.map((dec, i) => (
          <path key={dec.id} d={`M0 ${top + (i + 1) * pitch + 0.5}H${w}`} style={{ stroke: v('--jpd-grid'), fill: 'none' }} />
        ))}
      </K>
      {OWNER_DECISIONS.map((dec, i) => {
        const cy = top + i * pitch + pitch / 2;
        const a = Math.max(x0, X(dec.prepareFrom));
        const b = X(dec.requiredBy);
        const from = Math.max(x0, Xt(Date.parse(dec.prepareFrom) - lead));
        return (
          <g key={dec.id}>
            {/* What the field needs, and when. */}
            <K k={`site-${i}`}>
              <text x={pad} y={d ? cy - 3 : cy + 3.5} style={{ fontSize: d ? 12 : 9.5, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
                {dec.item}
              </text>
              {d && (
                <text x={x0 - 10} y={cy - 3} textAnchor="end" style={{ fontSize: 9.5, fill: sec }}>
                  {`On site ${shortDay(dec.onSite)}`}
                </text>
              )}
              <path d={diamond(X(dec.onSite), cy, d ? 6.5 : 5)} style={{ fill: v('--jpd-chain-ros') }} />
            </K>
            {/* Backward: the procurement it depends on. */}
            <Drawn k={`chain-${i}`} d={`M${X(dec.onSite) - (d ? 8 : 6)} ${cy}H${Math.max(x0 + 3, X(dec.chainStart))}`} stroke={v('--jpd-state-scheduled-edge')} width={d ? 6 : 4.5} cap="round" />
            {/* Advance notice, then time to prepare, then the decision. */}
            <Drawn k={`notice-${i}`} d={`M${from} ${cy - (d ? 11 : 8)}H${a}`} stroke={amber} width={1.5} />
            <K k={`window-${i}`}>
              <rect x={a} y={cy - (d ? 7 : 5.5)} width={Math.max(6, b - a)} height={d ? 14 : 11} rx={3} style={{ fill: v('--jpd-row-tint'), stroke: amber, strokeWidth: 1.5 }} />
            </K>
            <K k={`decide-${i}`}>
              <path d={diamond(b, cy, d ? 7 : 5.5)} style={{ fill: amber, stroke: surface, strokeWidth: 1.5 }} />
              {d ? (
                <text x={pad} y={cy + 12} style={{ fontSize: 10, fill: sec }}>
                  <tspan style={{ fontWeight: 700, fill: ink }}>{dec.title}</tspan>
                  {` by ${fullDay(dec.requiredBy)}`}
                </text>
              ) : (
                <text x={b + 8} y={cy - 7} style={{ fontSize: 8.5, fontWeight: 700, fill: ink }}>
                  {shortDay(dec.requiredBy)}
                </text>
              )}
            </K>
          </g>
        );
      })}
      <K k="legend">
        <path d={`M${L.x + L.gap[0]} ${legendY - 3}h${d ? 20 : 14}`} style={{ stroke: amber, strokeWidth: 1.5, fill: 'none' }} />
        <rect x={L.x + L.gap[3]} y={legendY - (d ? 8 : 6.5)} width={d ? 20 : 14} height={d ? 10 : 8} rx={2.5} style={{ fill: v('--jpd-row-tint'), stroke: amber, strokeWidth: 1.5 }} />
        <path d={diamond(L.x + L.gap[6], legendY - 3, d ? 5.5 : 4.5)} style={{ fill: amber }} />
        {LOOKAHEAD_STEPS.map((label, i) => (
          <text key={label} x={L.x + L.gap[[1, 4, 7][i]]} y={legendY} style={{ fontSize: L.f, fontWeight: 600, fill: ink }}>
            {label}
          </text>
        ))}
        {[2, 5].map((n) => (
          <text key={n} x={L.x + L.gap[n]} y={legendY} style={{ fontSize: L.f, fill: sec }}>
            →
          </text>
        ))}
      </K>
      <Takeaway tab="owner-predictability" mode={mode} />
    </>
  );
}

/* -------------------------------------------------------- 4. Better decisions */

/**
 * The cone (Design System Section 54.4.5; founder briefs 2026-11-12): one corridor tapering from left to right, wide
 * where the project is early and narrow where it is late. It does not move. One story, never reset: an amber line
 * marking the time, its pointer on the time axis, and a column of six named option cards on it travel together. The
 * group stops a quarter of the way in, all six held (decision identified early); carries on; as the cone narrows, the
 * options it has no room for are left outside its walls one at a time, washed out and crossed out in red but still
 * seen; and it stops near the narrow end with two (decision identified late). Played once: after a beat the cone fades
 * away and the visual closes on correctly timed decisions, the six options again, all open. Drawn as an architectural
 * sheet, in the family of Protect your investment: the faint grid behind, a finer grid within the corridor, double
 * linework and a centre line, paper cards, and the same foot. Nobody is drawn.
 */
function DecisionsVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = choiceGeometry(mode);
  const { w } = OWNER_CANVAS[mode];
  const T = g.type;
  const late = v('--jpd-chain-commitment-late');
  const caps = (size: number, fill: string) => ({ fontSize: size, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, fill });
  const W = g.card.w;
  const Hc = g.card.h;
  const C = g.cone;
  const clip = `choice-cone-${mode}`;
  const press = `choice-press-${mode}`;
  const wash = `choice-wash-${mode}`;
  const warm = `choice-warm-${mode}`;
  /* The pressure near the narrow end: from a little before the late stop to the tip, the walls thicken outward and redden. */
  const wedge = (side: -1 | 1) => {
    const n = 16;
    const at = (j: number) => g.pressure.from + ((C.x1 - g.pressure.from) * j) / n;
    const thick = (j: number) => g.pressure.thick * (j / n) ** 1.4;
    const inner = Array.from({ length: n + 1 }, (_, j) => `${at(j)} ${C.cy + side * g.half(at(j))}`);
    const outer = Array.from({ length: n + 1 }, (_, j) => `${at(j)} ${C.cy + side * (g.half(at(j)) + thick(j))}`).reverse();
    return `M${[...inner, ...outer].join('L')}Z`;
  };
  const message = (k: string, words: string, fill: string) => {
    const M = g.message(words);
    return (
      <K k={k}>
        <text textAnchor="middle" style={{ ...caps(T.message, fill), letterSpacing: '0.1em' }}>
          {M.lines.map((l) => (
            <tspan key={l.line} x={M.x} y={l.y}>
              {l.line}
            </tspan>
          ))}
        </text>
      </K>
    );
  };
  /** An option, drawn about its middle: a paper card with a soft offset beneath it, and its name, *OPTION* and its letter. */
  const option = (j: number) => {
    const name = g.name(j);
    return (
      <>
        <rect x={-W / 2 + 1.2 * g.k} y={-Hc / 2 + 2 * g.k} width={W} height={Hc} rx={g.card.round} style={docWash(0.12)} />
        <rect x={-W / 2} y={-Hc / 2} width={W} height={Hc} rx={g.card.round} style={{ fill: PAPER, stroke: DOC_INK, strokeOpacity: 0.5, strokeWidth: d ? 0.9 : 0.7 }} />
        <text x={0} y={g.card.label * 0.36} textAnchor="middle" style={{ ...caps(g.card.label, sec), fontWeight: 700, letterSpacing: '0.06em' }}>
          {name.word}
          <tspan style={{ fill: navy, fontWeight: 800 }}>{` ${name.letter}`}</tspan>
        </text>
      </>
    );
  };
  /* The red cross over a lost option: corner to corner, inside its edges. */
  const ix = W / 2 - (d ? 5 : 3.5);
  const iy = Hc / 2 - (d ? 3 : 2);
  /* The group moves as one: the line, its pointer and the cards are each wrapped in `now` (to the early stop) and `nowOn` (on to the late one). */
  const moving = (children: ReactNode) => (
    <K k="now">
      <K k="nowOn">{children}</K>
    </K>
  );
  const grid = d ? 28 : 21.2;
  const fine = grid / 2;
  const H = g.band.y;
  const A = g.axis;
  const P = A.pointer;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={g.outline} />
        </clipPath>
        <linearGradient id={press} gradientUnits="userSpaceOnUse" x1={g.pressure.from} y1={0} x2={C.x1} y2={0}>
          <stop offset="0" style={{ stopColor: late, stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: late, stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id={wash} gradientUnits="userSpaceOnUse" x1={g.pressure.from} y1={0} x2={C.x1} y2={0}>
          <stop offset="0" style={{ stopColor: late, stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: late, stopOpacity: 0.12 }} />
        </linearGradient>
        {/* The corridor warms toward its narrow end: clear at the mouth, a breath of amber past the middle, the late colour at the tip. */}
        <linearGradient id={warm} gradientUnits="userSpaceOnUse" x1={C.x0} y1={0} x2={C.x1} y2={0}>
          <stop offset="0.35" style={{ stopColor: amber, stopOpacity: 0 }} />
          <stop offset="0.72" style={{ stopColor: amber, stopOpacity: 0.07 }} />
          <stop offset="1" style={{ stopColor: late, stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>
      {/* The sheet: a faint grid, as Protect your investment's. */}
      <K k="ground">
        <path d={[...Array.from({ length: Math.ceil(w / grid) - 1 }, (_, i) => `M${(i + 1) * grid} 0V${H}`), ...Array.from({ length: Math.ceil(H / grid) - 1 }, (_, i) => `M0 ${(i + 1) * grid}H${w}`)].join('')} style={docLine(0.05, 0.6)} />
      </K>

      {/* The corridor: a soft shadow beneath it, the paper, its warming, a finer grid within it, its centre line and the fine
          line inside each wall. The walls themselves are drawn on, from the mouth. */}
      <K k="cone">
        <path d={g.outline} transform={`translate(0 ${3 * g.k})`} style={docWash(0.07)} />
        <path d={g.outline} style={{ fill: PAPER, fillOpacity: 0.94 }} />
        <path d={g.outline} style={{ fill: `url(#${warm})` }} />
        <g clipPath={`url(#${clip})`}>
          <path d={[...Array.from({ length: Math.ceil(w / fine) }, (_, i) => `M${i * fine} 0V${H}`), ...Array.from({ length: Math.ceil(H / fine) }, (_, i) => `M0 ${i * fine}H${w}`)].join('')} style={docLine(0.07, 0.4)} />
        </g>
        <path d={`M${C.x0 + 6 * g.k} ${C.cy}H${C.x1 - 4 * g.k}`} style={{ ...docLine(0.32, d ? 0.6 : 0.45), strokeDasharray: d ? '12 3 2 3' : '8 2 1.5 2' }} />
        <path d={g.inner(-1)} style={docLine(0.3, d ? 0.5 : 0.4)} />
        <path d={g.inner(1)} style={docLine(0.3, d ? 0.5 : 0.4)} />
      </K>
      <K k="pressure">
        <path d={g.outline} style={{ fill: `url(#${wash})` }} />
        <path d={wedge(-1)} style={{ fill: `url(#${press})` }} />
        <path d={wedge(1)} style={{ fill: `url(#${press})` }} />
      </K>
      <Drawn k="wall-top" d={g.wall(-1)} stroke={DOC_INK} width={d ? 1.3 : 1} cap="round" />
      <Drawn k="wall-bottom" d={g.wall(1)} stroke={DOC_INK} width={d ? 1.3 : 1} cap="round" />
      <Drawn k="axis" d={`M${A.x0} ${A.y}H${A.x1}`} stroke={DOC_INK} width={d ? 1.1 : 0.8} />
      <K k="time">
        <path d={A.ticks.map((x) => `M${x} ${A.y}v${-A.tick}`).join('')} style={docLine(0.6, d ? 0.8 : 0.6)} />
        <path d={`M${A.x1 + (d ? 6 : 4)} ${A.y}l${d ? -8 : -5.5} ${d ? -4 : -2.8}v${d ? 8 : 5.6}z`} style={{ fill: DOC_INK }} />
        <text x={A.label.x} y={A.label.y} style={caps(T.label, DOC_INK)}>
          {CHOICE_WORDS.time}
        </text>
      </K>
      <K k="more">
        <text x={g.more.x} y={g.more.y} style={{ fontSize: T.label, fontWeight: 700, fill: navy }}>
          {CHOICE_WORDS.more}
        </text>
      </K>

      {/* The group. The line marks the present: amber, with a faint halo, clipped to the cone (the clip stays put; the line
          moves within it), so its height is always the cone's where it stands. Its pointer rides beneath the time axis, its
          tip on the line. The cards are not clipped: those the cone has no room for are left outside it. */}
      <g clipPath={`url(#${clip})`}>
        {moving(
          <K k="line">
            <path d={`M${g.start.x} ${g.start.y0}V${g.start.y1}`} style={{ fill: 'none', stroke: amber, strokeOpacity: 0.22, strokeWidth: d ? 5 : 3.5 }} />
            <path d={`M${g.start.x} ${g.start.y0}V${g.start.y1}`} style={{ fill: 'none', stroke: amber, strokeWidth: d ? 1.6 : 1.1 }} />
          </K>,
        )}
      </g>
      {moving(
        <K k="line">
          <path d={`M${g.start.x} ${A.y + 0.5}l${P.w} ${P.h}h${-2 * P.w}z`} style={{ fill: amber, stroke: navy, strokeWidth: d ? 0.8 : 0.6, strokeLinejoin: 'round' }} />
        </K>,
      )}
      {moving(
        g.cards.map((c, j) => (
          <g key={j} transform={`translate(${g.start.x} ${c.y})`}>
            <K k={`card-${j}`}>{option(j)}</K>
            {g.lost.some((l) => l.option === j) && (
              <K k={`off-${j}`}>
                <rect x={-W / 2 - 0.5} y={-Hc / 2 - 0.5} width={W + 1 + 2 * g.k} height={Hc + 1 + 3 * g.k} rx={g.card.round} style={{ fill: v('--jp-surface-light'), fillOpacity: 0.55 }} />
                <rect x={-W / 2} y={-Hc / 2} width={W} height={Hc} rx={g.card.round} style={{ fill: 'none', stroke: DOC_INK, strokeOpacity: 0.45, strokeWidth: d ? 0.9 : 0.7, strokeDasharray: d ? '3 2' : '2 1.5' }} />
                <path d={`M${-ix} ${-iy}L${ix} ${iy}M${ix} ${-iy}L${-ix} ${iy}`} style={{ fill: 'none', stroke: late, strokeWidth: d ? 1.5 : 1, strokeLinecap: 'round' }} />
              </K>
            )}
          </g>
        )),
      )}

      {/* The two callouts, at the top of the frame. */}
      {message('msgEarly', CHOICE_WORDS.early, navy)}
      {message('msgLate', CHOICE_WORDS.late, late)}

      {/* The close: correctly timed decisions. The six options again, all open, in a row; the line about JiTpro beneath. */}
      {g.timed.xs.map((cx, j) => (
        <K key={j} k={`timed-${j}`}>
          <g transform={`translate(${cx} ${g.timed.y})`}>{option(j)}</g>
        </K>
      ))}
      <K k="timedWords">
        <text textAnchor="middle" style={{ fontSize: g.timed.support.size, fontWeight: 600, fill: ink }}>
          {g.timed.support.lines.map((l) => (
            <tspan key={l.line} x={g.timed.support.x} y={l.y}>
              {l.line}
            </tspan>
          ))}
        </text>
      </K>

      {/* One bar, there throughout; only its words change. The three feet draw the same bar under the one key. */}
      <TeamFoot mode={mode} band="foot" words="footInWords" {...CHOICE_FOOT.in} />
      <TeamFoot mode={mode} band="foot" words="footOutWords" {...CHOICE_FOOT.out} />
      <TeamFoot mode={mode} band="foot" words="takeaway" head={CHOICE_TIMED.head} />
    </>
  );
}

const VISUAL: Record<OwnerTabId, (p: { mode: OwnerMode }) => ReactNode> = {
  'owner-reduce-risk': RiskVisual,
  'owner-protect-investment': InvestmentVisual,
  'owner-predictability': PredictabilityVisual,
  'owner-better-decisions': DecisionsVisual,
};

/**
 * The Hero's house render, behind Protect your investment (founder direction,
 * 2026-11-12): the same asset, drawn the Hero's way and turned over for a
 * light surface.
 *
 *   THE SAME   the brand's own render (`house-render-800/1600.webp`), as an
 *              `<img>` sized by its own aspect ratio, so it is never cropped
 *              or stretched; bottom-anchored and centred; its roofline
 *              softened by a short top-edge mask; restrained opacity; and the
 *              Hero's own one-pass reveal (`hero-house-reveal`), which
 *              reduced motion disables, leaving the house present and still.
 *   TURNED     the Hero melts the render's night sky into a dark page with
 *              `lighten`. Here the page is light, so the render is made
 *              grey and inverted, which turns its night sky white and its
 *              lit edges and glass into soft grey line and tone, and
 *              `multiply` then melts that white into the frame. No edge
 *              shows, and the house reads as a quiet drawing behind the work.
 *
 * It is atmosphere only (Design System Section 48.8): beneath everything,
 * aria-hidden, never annotated, and never the subject. Its foot rests on the
 * closing band's top edge.
 */
const HOUSE_SRC = `${import.meta.env.BASE_URL}assets/hero/house-render`;
/** The resting strength of the house behind the picture: present, and well below the cards and the shield. */
const HOUSE_OPACITY = 0.3;

function HouseBackdrop({ played }: { played: boolean }) {
  const box = houseBackdrop();
  const fade = 'linear-gradient(180deg, transparent 0%, black 18%)';
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 mx-auto mix-blend-multiply ${played ? 'hero-house-reveal' : ''}`}
      style={
        {
          width: `${box.width * 100}%`,
          bottom: `${box.bottom * 100}%`,
          opacity: played ? HOUSE_OPACITY : 0,
          filter: 'grayscale(1) invert(1)',
          maskImage: fade,
          WebkitMaskImage: fade,
        } as CSSProperties
      }
    >
      <img
        src={`${HOUSE_SRC}-800.webp`}
        srcSet={`${HOUSE_SRC}-800.webp 800w, ${HOUSE_SRC}-1600.webp 1600w`}
        sizes="(min-width: 1024px) 560px, 90vw"
        width={HOUSE_RENDER.w}
        height={HOUSE_RENDER.h}
        alt=""
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}

export default function OwnerVisual({ tab, played }: { tab: OwnerTabId; played: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scenes = useMemo(() => ({ desktop: buildOwnerScene(tab, 'desktop'), phone: buildOwnerScene(tab, 'phone') }), [tab]);
  /* When this pass began; survives a change of design (a resize) mid-pass. */
  const startedAt = useRef<number | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    /* Both designs are drawn; the frame's width says which is shown. */
    const designs = MODES.map((mode) => {
      const svg = frame.querySelector<SVGSVGElement>(`[data-design="${mode}"]`)!;
      return { mode, svg, parts: [...svg.querySelectorAll<SVGElement>('[data-k]')] };
    });
    let mode: OwnerMode = frame.clientWidth < OWNER_NARROW_BELOW ? 'phone' : 'desktop';
    let t = 0;
    const apply = () => {
      for (const design of designs) {
        const on = design.mode === mode;
        design.svg.style.display = on ? 'block' : 'none';
        if (!on) continue;
        const state = ownerStateAt(scenes[mode], t);
        for (const el of design.parts) {
          const s = state[el.dataset.k!];
          if (!s) continue;
          el.style.opacity = String(s.o);
          if (el.dataset.draw !== undefined) el.style.strokeDashoffset = String(1 - s.draw);
          else el.setAttribute('transform', `translate(${s.mx} ${s.my + s.ty}) rotate(${s.rot}) scale(${s.sc})`);
        }
      }
    };
    const endOf = () => scenes[mode].end;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    let raf = 0;
    if (!played) {
      startedAt.current = null;
      t = 0;
      apply();
    } else if (reduced) {
      t = endOf();
      apply();
    } else {
      startedAt.current ??= performance.now();
      /* One pass, then rest on the last frame. */
      const tick = () => {
        t = Math.min(endOf(), performance.now() - startedAt.current!);
        apply();
        if (t < endOf()) raf = requestAnimationFrame(tick);
      };
      tick();
    }
    /* A resize re-frames the same moment in the other design. */
    const ro = new ResizeObserver(() => {
      mode = frame.clientWidth < OWNER_NARROW_BELOW ? 'phone' : 'desktop';
      if (played && reduced) t = endOf();
      apply();
    });
    ro.observe(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [played, scenes]);

  const Visual = VISUAL[tab];
  return (
    <div ref={frameRef} className="jpd relative isolate h-full overflow-hidden" style={{ background: surface }}>
      {tab === 'owner-protect-investment' && <HouseBackdrop played={played} />}
      {MODES.map((mode) => (
        <svg
          key={mode}
          data-design={mode}
          viewBox={`0 0 ${OWNER_CANVAS[mode].w} ${OWNER_CANVAS[mode].h}`}
          className="absolute inset-0 h-full w-full"
          style={{ display: 'none', fontFamily: FACE }}
        >
          <Visual mode={mode} />
        </svg>
      ))}
    </div>
  );
}

const MODES: readonly OwnerMode[] = ['desktop', 'phone'];
