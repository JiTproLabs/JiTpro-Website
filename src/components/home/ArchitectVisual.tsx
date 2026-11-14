import type { ReactNode } from 'react';
import { v } from '../demo/screens/procurement-chain/chainVocabulary';
import type { ScheduleItem } from '../demo/screens/procurement-schedule/scheduleModel';
import { ROW_ITEMS } from './planChainScene';
import {
  ARCH_CANVAS,
  ARCHITECT_FIRM,
  AS_OF,
  COMMITMENTS,
  COMMITMENTS_CLOSING,
  COORDINATION_LANES,
  DELIVERABLES,
  DELIVERABLES_FOOTNOTE,
  EMPTY_LANE,
  PEAK,
  PHONE_NOTE,
  PLANNING_NOTE,
  STONE_APPROVAL,
  WEEKS,
  WEEKS_END,
  WORK_LANES,
  dayNumber,
  monthDay,
  monthName,
  weekTotals,
  type ArchitectTabId,
} from './architectVisuals';
import '../demo/tokens.css';
import '../demo/screens/procurement-chain/chainTokens.css';

/**
 * The Architects tabs' visuals (Design System Section 54.4.6): three static
 * document compositions, the general contractor's plan behind and an
 * architect-facing document in front. No motion and no clock. Each has a
 * desktop and a narrow design, on the owner visuals' canvases; a container
 * query on the frame's width picks one. Tokens only. The visual column is
 * aria-hidden (Section 46.2): the tab's copy carries the meaning.
 */

const FACE = '"Inter Tight", Inter, system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const NAVY = v('--jpd-nav-bg-start');
const INK = 'var(--jp-ink-secondary)';
const PAPER = 'var(--jp-surface-white)';
const AMBER = 'var(--jp-brand-amber)';
const MILESTONE = v('--jpd-chain-milestone');
const FAMILY: Record<string, string> = {
  buyout: v('--jpd-chain-buyout'),
  coordination: v('--jpd-chain-coordination'),
  preparation: v('--jpd-chain-preparation'),
  review: v('--jpd-chain-review'),
  revision: v('--jpd-chain-revision'),
  approval: MILESTONE,
  production: v('--jpd-chain-production'),
  logistics: v('--jpd-chain-logistics'),
};
const ARCHITECT = /Sierra Ridge/;

/* ------------------------------------------------------------ primitives */

type TextOpts = { z?: number; w?: number; c?: string; mono?: boolean; a?: 'start' | 'middle' | 'end'; it?: boolean; caps?: boolean };
function T({ x, y, z = 9, w = 500, c = NAVY, mono, a, it, caps, children }: TextOpts & { x: number; y: number; children: ReactNode }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={a}
      style={{
        fontFamily: mono ? MONO : FACE,
        fontSize: z,
        fontWeight: w,
        fill: c,
        letterSpacing: caps ? '0.12em' : undefined,
        textTransform: caps ? 'uppercase' : undefined,
        fontStyle: it ? 'italic' : undefined,
      }}
    >
      {children}
    </text>
  );
}
/** A kicker, column head or small date: the data face, bold, uppercase, tracked. */
const Kick = ({ x, y, z = 6.4, c = INK, a, children }: { x: number; y: number; z?: number; c?: string; a?: 'start' | 'middle' | 'end'; children: ReactNode }) => (
  <T x={x} y={y} z={z} w={700} c={c} mono caps a={a}>
    {children}
  </T>
);
const Rule = ({ x1, y1, x2, y2, c = INK, o = 0.25, w = 0.6 }: { x1: number; y1: number; x2: number; y2: number; c?: string; o?: number; w?: number }) => (
  <path d={`M${x1} ${y1}L${x2} ${y2}`} style={{ fill: 'none', stroke: c, strokeOpacity: o, strokeWidth: w }} />
);
/** A sheet of the Identify documents' paper: white, a slate edge, a soft offset beneath. */
const Sheet = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x + 2.5} y={y + 3.5} width={w} height={h} rx={2} style={{ fill: INK, fillOpacity: 0.1 }} />
    <rect x={x} y={y} width={w} height={h} rx={2} style={{ fill: PAPER, stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.8 }} />
  </>
);
/** The frame's faint drafting grid. */
const Ground = ({ w, h, g }: { w: number; h: number; g: number }) => (
  <path
    d={[...Array.from({ length: Math.ceil(w / g) }, (_, i) => `M${i * g} 0V${h}`), ...Array.from({ length: Math.ceil(h / g) }, (_, i) => `M0 ${i * g}H${w}`)].join('')}
    style={{ fill: 'none', stroke: INK, strokeOpacity: 0.05, strokeWidth: 0.6 }}
  />
);
/** A due date: an amber diamond with a fine navy edge. */
const Due = ({ x, y, r = 2.8 }: { x: number; y: number; r?: number }) => (
  <path d={`M${x} ${y - r}l${r} ${r}l${-r} ${r}l${-r} ${-r}z`} style={{ fill: AMBER, stroke: NAVY, strokeWidth: 0.45 }} />
);
/** The amber emphasis on a table row: a wash and a tick at its left edge. */
const Marked = ({ x, y, w, h, wash = 0.12 }: { x: number; y: number; w: number; h: number; wash?: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} style={{ fill: AMBER, fillOpacity: wash }} />
    <rect x={x} y={y} width={2.6} height={h} style={{ fill: AMBER }} />
  </>
);
/** The annotation, in the approved *Your project* style: an amber dot on its subject, a fine navy leader, a short note. */
function Note({ dot, end, at, words, a = 'start', z = 8.6 }: { dot: [number, number]; end: [number, number]; at: [number, number]; words: string[]; a?: 'start' | 'end'; z?: number }) {
  return (
    <>
      <path d={`M${dot[0]} ${dot[1]}L${end[0]} ${end[1]}`} style={{ fill: 'none', stroke: NAVY, strokeOpacity: 0.55, strokeWidth: 0.7, strokeLinecap: 'round' }} />
      <circle cx={dot[0]} cy={dot[1]} r={1.7} style={{ fill: AMBER, stroke: NAVY, strokeWidth: 0.5 }} />
      {words.map((line, i) => (
        <T key={line} x={at[0]} y={at[1] + i * 10} z={z} w={700} a={a}>
          {line}
        </T>
      ))}
    </>
  );
}
/** A front sheet's head: its kicker, its title, a one- or two-line label at the right, and a navy rule. */
function Head({ x, y, w, kicker, title, right, tz = 13.5, kz = 6.4 }: { x: number; y: number; w: number; kicker: string; title: string; right: string[]; tz?: number; kz?: number }) {
  return (
    <>
      <Kick x={x + 12} y={y + 14} z={kz}>
        {kicker}
      </Kick>
      <T x={x + 12} y={y + 31} z={tz} w={800}>
        {title}
      </T>
      {right.map((r, i) => (
        <Kick key={r} x={x + w - 12} y={y + 31 - (right.length - 1 - i) * 9.5} c={NAVY} a="end">
          {r}
        </Kick>
      ))}
      <Rule x1={x + 12} y1={y + 40} x2={x + w - 12} y2={y + 40} c={NAVY} o={0.7} w={0.8} />
    </>
  );
}

/* ------------------------------------------------------------ the plan behind */

const pick = (re: RegExp) => {
  const item = ROW_ITEMS.find((i) => re.test(i.name));
  if (!item) throw new Error(`ArchitectVisual: no schedule item matches ${re}`);
  return item;
};
type Row = { label: string; item: ScheduleItem };
const rows = (list: [string, RegExp][]): Row[] => list.map(([label, re]) => ({ label, item: pick(re) }));

/** The first of each month from `from` to `to`. */
function monthStarts(from: string, to: string): string[] {
  const out: string[] = [];
  let y = Number(from.slice(0, 4));
  let m = Number(from.slice(5, 7)) - 1;
  if (Number(from.slice(8, 10)) > 1) m += 1;
  for (;;) {
    if (m > 11) {
      m = 0;
      y += 1;
    }
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-01`;
    if (iso > to) return out;
    out.push(iso);
    m += 1;
  }
}

/** The contractor's plan: a Gantt of chains in the Section 51 colours on a month axis. */
function Gantt({ x, y, w, list, from, to, label, rh, every = 3, yearOn = [], outline, today, band, labels = true, lz = 6 }: {
  x: number; y: number; w: number; list: Row[]; from: string; to: string; label: number; rh: number; every?: number; yearOn?: string[]; outline?: boolean; today?: string; band?: [string, string]; labels?: boolean; lz?: number;
}) {
  const d0 = dayNumber(from);
  const d1 = dayNumber(to);
  const X = (iso: string) => x + label + ((dayNumber(iso) - d0) / (d1 - d0)) * (w - label);
  const bottom = y + list.length * rh;
  return (
    <>
      {monthStarts(from, to).map((iso) => {
        const mi = Number(iso.slice(5, 7)) - 1;
        const named = labels && mi % every === 0;
        const withYear = mi === 0 || yearOn.includes(iso.slice(0, 7));
        return (
          <g key={iso}>
            <Rule x1={X(iso)} y1={y - 4} x2={X(iso)} y2={bottom} o={0.12} w={0.5} />
            {named && (
              <Kick x={X(iso) + 1.5} y={y - 6} z={5.2}>
                {withYear ? `${monthName(mi)} ${iso.slice(2, 4)}` : monthName(mi)}
              </Kick>
            )}
          </g>
        );
      })}
      {band && <rect x={X(band[0])} y={y - 4} width={X(band[1]) - X(band[0])} height={list.length * rh + 4} style={{ fill: AMBER, fillOpacity: 0.16 }} />}
      {list.map((r, i) => {
        const cy = y + i * rh + rh / 2;
        return (
          <g key={r.label}>
            <Rule x1={x} y1={y + (i + 1) * rh} x2={x + w} y2={y + (i + 1) * rh} o={0.1} w={0.5} />
            {labels && (
              <T x={x + 2} y={cy + 2.2} z={lz} w={600}>
                {r.label}
              </T>
            )}
            {r.item.steps.map((s) => {
              if (s.endDate < from || s.startDate > to || s.family === 'required') return null;
              const a = X(s.startDate < from ? from : s.startDate);
              if (s.startDate === s.endDate) return <path key={s.id} d={`M${a} ${cy - 2.6}l2.6 2.6l-2.6 2.6l-2.6 -2.6z`} style={{ fill: FAMILY[s.family] ?? MILESTONE }} />;
              const b = Math.max(a + 1.2, X(s.endDate > to ? to : s.endDate));
              const own = outline && ARCHITECT.test(s.responsibleOrganization);
              return (
                <rect
                  key={s.id}
                  x={a}
                  y={cy - 2.6}
                  width={b - a}
                  height={5.2}
                  rx={1}
                  style={{ fill: FAMILY[s.family] ?? MILESTONE, fillOpacity: own ? 1 : 0.78, stroke: own ? NAVY : undefined, strokeWidth: own ? 1.1 : undefined }}
                />
              );
            })}
          </g>
        );
      })}
      {today && (
        <>
          <Rule x1={X(today)} y1={y - 4} x2={X(today)} y2={bottom} c={AMBER} o={1} w={1} />
          <Kick x={X(today) + 2} y={bottom - 2} z={5} c={NAVY}>
            Today
          </Kick>
        </>
      )}
    </>
  );
}
/** The back sheet as seen on a narrow frame: a corner, enough to say there is more. */
const Corner = ({ children }: { children: ReactNode }) => (
  <g transform="rotate(-2 60 30)">
    <Sheet x={-18} y={-10} w={150} h={60} />
    {children}
  </g>
);
/** The back sheet's title block. */
const BackTitle = ({ title, right }: { title: string; right: string }) => (
  <>
    <Kick x={26} y={28}>
      General contractor
    </Kick>
    <T x={26} y={42} z={10.5} w={800}>
      {title}
    </T>
    <Kick x={332} y={42} z={5.6} c={NAVY} a="end">
      {right}
    </Kick>
  </>
);

/* ------------------------------------------------------------ 1. See what's coming */

const SCHEDULE_ROWS = rows([
  ['Building permit', /Permit/],
  ['Concrete & reinforcing', /Concrete/],
  ['Structural steel', /Structural Steel/],
  ['Steel windows & doors', /Steel Windows/],
  ['Engineered framing', /Lumber/],
  ['Switchgear', /Switchgear/],
  ['Exterior stone', /Stone/],
  ['Air handling & HVAC', /Air Handling/],
  ['Elevator', /Elevator/],
  ['Cabinetry', /Cabinetry/],
  ['Metal railings', /Railings/],
]);
const AS_OF_LABEL = `As of ${monthDay(AS_OF)}, ${AS_OF.slice(0, 4)}`;

function SeeWhatsComing({ narrow }: { narrow: boolean }) {
  if (narrow) {
    const X = 16, Y = 22, W = 308, H = 182;
    return (
      <>
        <Ground w={340} h={212} g={21} />
        <Corner>
          <Gantt x={-10} y={14} w={136} list={SCHEDULE_ROWS.slice(0, 4)} from="2026-06-01" to="2027-12-01" label={2} rh={7} labels={false} />
        </Corner>
        <Sheet x={X} y={Y} w={W} h={H} />
        <Head x={X} y={Y} w={W} kicker="From the general contractor" title="Architect deliverables" right={[`As of ${monthDay(AS_OF)}`]} tz={12.5} kz={6.2} />
        {DELIVERABLES.slice(0, 3).map((r, i) => {
          const ry = Y + 48 + i * 40;
          return (
            <g key={r.what}>
              {i === 0 && <Marked x={X + 5} y={ry} w={W - 10} h={40} />}
              <T x={X + 13} y={ry + 15} z={9.6} w={600}>{r.what}</T>
              <T x={X + W - 12} y={ry + 15} z={9.4} w={700} mono a="end">{monthDay(r.by)}</T>
              <T x={X + 13} y={ry + 29} z={8} c={INK}>{r.why.join(' ')}</T>
              <Rule x1={X + 12} y1={ry + 40} x2={X + W - 12} y2={ry + 40} o={0.22} />
            </g>
          );
        })}
      </>
    );
  }
  const X = 172, Y = 98, W = 374, H = 244;
  const c1 = X + 12, c2 = X + 160, c3 = X + 224, top = Y + 54, rh = 33;
  return (
    <>
      <Ground w={560} h={350} g={28} />
      <g transform="rotate(-1.6 170 140)">
        <Sheet x={14} y={14} w={336} h={236} />
        <Kick x={26} y={28}>General contractor</Kick>
        <T x={26} y={42} z={10.5} w={800}>Project procurement schedule</T>
        <Kick x={338} y={42} z={5.6} c={NAVY} a="end">{`${ROW_ITEMS.length} packages`}</Kick>
        <Gantt x={26} y={60} w={312} list={SCHEDULE_ROWS} from="2026-06-01" to="2027-12-01" label={74} rh={16} outline today={AS_OF} yearOn={['2026-06']} />
      </g>
      <Sheet x={X} y={Y} w={W} h={H} />
      <Head x={X} y={Y} w={W} kicker="From the general contractor" title="Architect deliverables" right={[`To ${ARCHITECT_FIRM}`, AS_OF_LABEL]} />
      <Kick x={c1} y={top}>Deliverable</Kick>
      <Kick x={c2} y={top}>Required by</Kick>
      <Kick x={c3} y={top}>Why it matters</Kick>
      {DELIVERABLES.map((r, i) => {
        const ry = top + 5 + i * rh;
        return (
          <g key={r.what}>
            {i === 0 && <Marked x={X + 6} y={ry} w={W - 12} h={rh} />}
            <T x={c1} y={ry + 14} z={9.5} w={600}>{r.what}</T>
            <T x={c1} y={ry + 25.5} z={7.6} c={INK}>{r.pkg}</T>
            <T x={c2} y={ry + 14} z={9.2} w={700} mono>{monthDay(r.by)}</T>
            {r.why.map((line, j) => (
              <T key={line} x={c3} y={ry + 14 + j * 10.5} z={8.3} c={INK}>{line}</T>
            ))}
            <Rule x1={X + 12} y1={ry + rh} x2={X + W - 12} y2={ry + rh} o={0.22} />
          </g>
        );
      })}
      <T x={X + 12} y={Y + H - 9} z={7.4} c={INK} it>{DELIVERABLES_FOOTNOTE}</T>
      <Note dot={[X + 168, Y + 25]} end={[X + 192, Y - 9]} at={[X + 196, Y - 12]} words={['Filtered from the full schedule']} />
    </>
  );
}

/* ------------------------------------------------------------ 2. Plan your workload */

const WORK_ROWS = rows([
  ['Interior doors', /Interior Door/],
  ['Cabinetry', /Cabinetry/],
  ['Metal railings', /Railings/],
  ['Plumbing fixtures', /Plumbing/],
  ['Decorative lighting', /Lighting/],
  ['Tile', /Tile/],
  ['Elevator', /Elevator/],
]);
const PEAK_BAND: [string, string] = [WEEKS[PEAK], `${WEEKS[PEAK].slice(0, 8)}${String(Number(WEEKS[PEAK].slice(8, 10)) + 5).padStart(2, '0')}`];

function PlanYourWorkload({ narrow }: { narrow: boolean }) {
  const totals = weekTotals();
  if (narrow) {
    const X = 16, Y = 22, W = 308, H = 182;
    const gx = X + 26, cw = 54, base = Y + 134;
    return (
      <>
        <Ground w={340} h={212} g={21} />
        <Corner>
          <Gantt x={-10} y={14} w={136} list={WORK_ROWS.slice(0, 4)} from="2027-01-15" to="2027-07-15" label={2} rh={7} labels={false} band={PEAK_BAND} />
        </Corner>
        <Sheet x={X} y={Y} w={W} h={H} />
        <Head x={X} y={Y} w={W} kicker="From the general contractor’s schedule" title="Architect workload outlook" right={['Apr–May 2027']} tz={12.5} kz={6.2} />
        <rect x={X + 12} y={Y + 50} width={8} height={6} rx={1} style={{ fill: NAVY, fillOpacity: 0.85 }} />
        <T x={X + 23} y={Y + 55.5} z={6.8} c={INK}>Architect reviews & deliverables</T>
        <rect x={X + 150} y={Y + 50} width={8} height={6} rx={1} style={{ fill: PAPER, stroke: NAVY, strokeOpacity: 0.45, strokeWidth: 0.6 }} />
        <T x={X + 161} y={Y + 55.5} z={6.8} c={INK}>Selections & consultant work</T>
        {WEEKS.map((w, i) => {
          const cx = gx + i * cw;
          return (
            <g key={w}>
              {i === PEAK && (
                <>
                  <rect x={cx - 4} y={Y + 66} width={cw - 6} height={base - Y - 66 + 16} style={{ fill: AMBER, fillOpacity: 0.14 }} />
                  <rect x={cx - 4} y={Y + 66} width={cw - 6} height={2.4} style={{ fill: AMBER }} />
                </>
              )}
              {Array.from({ length: totals[i].all }, (_, k) => {
                const own = k < totals[i].own;
                return <rect key={k} x={cx + 6} y={base - 12 - k * 12} width={26} height={9} rx={1.6} style={{ fill: own ? NAVY : PAPER, fillOpacity: own ? 0.85 : 1, stroke: NAVY, strokeOpacity: own ? 0 : 0.45, strokeWidth: 0.6 }} />;
              })}
              <Kick x={cx + 19} y={base + 10} c={i === PEAK ? NAVY : INK} a="middle">{monthDay(w)}</Kick>
            </g>
          );
        })}
        <T x={X + 12} y={Y + H - 9} z={8.4} w={700}>{PHONE_NOTE}</T>
      </>
    );
  }
  const X = 166, Y = 58, W = 380, H = 284;
  const lx = X + 12, gx = X + 112, gw = W - 124, cw = gw / WEEKS.length, top = Y + 58;
  const span = dayNumber(WEEKS_END) + 3 - dayNumber(WEEKS[0]);
  const DX = (iso: string) => gx + Math.min(1, Math.max(0, (dayNumber(iso) - dayNumber(WEEKS[0])) / span)) * gw;
  let ry = top + 3;
  const lanes = WORK_LANES.map((lane) => {
    const y0 = ry;
    const lh = Math.max(26, 7 + lane.bars.length * 12);
    ry += lh + 4;
    return { lane, y0, rule: ry - 2 };
  });
  const ny = ry + 20;
  const nh = Y + H - 10 - ny;
  const px = gx + PEAK * cw + cw / 2;
  return (
    <>
      <Ground w={560} h={350} g={28} />
      <g transform="rotate(-1.6 170 140)">
        <Sheet x={14} y={14} w={330} h={236} />
        <BackTitle title="Future requirements plan" right="Spring 2027" />
        <Gantt x={26} y={62} w={306} list={WORK_ROWS} from="2027-01-15" to="2027-07-15" label={72} rh={18} every={1} band={PEAK_BAND} />
      </g>
      <Sheet x={X} y={Y} w={W} h={H} />
      <Head x={X} y={Y} w={W} kicker="From the general contractor’s schedule" title="Architect workload outlook" right={['Apr–May 2027']} />
      <Due x={X + W - 72} y={Y + 11.6} />
      <T x={X + W - 66} y={Y + 14} z={6.8} c={INK}>Due that week</T>
      {WEEKS.map((w, i) => {
        const cx = gx + i * cw;
        return (
          <g key={w}>
            {i === PEAK ? (
              <>
                <rect x={cx} y={top - 16} width={cw} height={150} style={{ fill: AMBER, fillOpacity: 0.14 }} />
                <rect x={cx} y={top - 16} width={cw} height={2.4} style={{ fill: AMBER }} />
              </>
            ) : (
              <Rule x1={cx} y1={top - 10} x2={cx} y2={top + 134} o={0.12} w={0.5} />
            )}
            <Kick x={cx + 4} y={top - 4} z={6.6} c={i === PEAK ? NAVY : INK}>{monthDay(w)}</Kick>
          </g>
        );
      })}
      {lanes.map(({ lane, y0, rule }) => (
        <g key={lane.label}>
          <T x={lx} y={y0 + 11} z={8.4} w={700}>{lane.label}</T>
          <T x={lx} y={y0 + 20.5} z={6.4} c={INK}>{lane.who}</T>
          {lane.bars.length === 0 && <T x={gx + 4} y={y0 + 11} z={7.2} c={INK} it>{EMPTY_LANE}</T>}
          {lane.bars.map((b, j) => {
            const by = y0 + 3 + j * 12;
            if (b.due !== undefined) {
              const dx = DX(b.due);
              return (
                <g key={b.name}>
                  <Due x={dx} y={by + 5} r={3.2} />
                  <T x={dx + 6} y={by + 7.6} z={7.2} w={600}>{b.name}</T>
                </g>
              );
            }
            const a = DX(b.start!);
            const z = DX(b.end!);
            const runsOn = b.end! > WEEKS_END;
            // A label that would run past the sheet sits before its bar.
            const before = a + 4 + b.name.length * 3.9 > X + W - 14;
            return (
              <g key={b.name}>
                <rect x={a} y={by} width={z - a} height={10} rx={b.start! < WEEKS[0] || runsOn ? 0 : 1.6} style={{ fill: NAVY, fillOpacity: 0.08, stroke: NAVY, strokeOpacity: 0.32, strokeWidth: 0.5 }} />
                <T x={before ? a - 4 : a + 4} y={by + 7.4} z={7.2} w={600} a={before ? 'end' : 'start'}>{b.name}</T>
                {runsOn ? <path d={`M${z - 1} ${by + 2}l3.5 3l-3.5 3`} style={{ fill: 'none', stroke: NAVY, strokeWidth: 0.8 }} /> : <Due x={z} y={by + 5} r={3} />}
              </g>
            );
          })}
          <Rule x1={lx} y1={rule} x2={X + W - 12} y2={rule} o={0.2} />
        </g>
      ))}
      <T x={lx} y={ry + 10} z={7.2} c={INK} it>Scheduled items, not hours</T>
      {totals.map((t, i) => (
        <T key={WEEKS[i]} x={gx + i * cw + 4} y={ry + 10.5} z={8.8} w={i === PEAK ? 800 : 500} c={i === PEAK ? NAVY : INK} mono>{String(t.all)}</T>
      ))}
      <rect x={lx} y={ny} width={W - 24} height={nh} rx={1.5} style={{ fill: NAVY, fillOpacity: 0.035, stroke: INK, strokeOpacity: 0.3, strokeWidth: 0.5 }} />
      <rect x={lx} y={ny} width={2.4} height={nh} style={{ fill: AMBER }} />
      <T x={lx + 10} y={ny + 13} z={8.4} w={800}>{PLANNING_NOTE.title}</T>
      {PLANNING_NOTE.tips.map((tip, i) => (
        <T key={tip} x={lx + 10 + (i < 3 ? 0 : 172)} y={ny + 25.5 + (i % 3) * 10.2} z={7.3} c={INK}>{`•  ${tip}`}</T>
      ))}
      <Note dot={[px, top - 16]} end={[px - 2, Y - 10]} at={[X + W, Y - 14]} words={['Busiest week, seen six months ahead']} a="end" />
    </>
  );
}

/* ------------------------------------------------------------ 3. Protect your reputation */

const CHAIN = COMMITMENTS.filter((c) => c.chain);
/** Which coordination lane a step's responsible party sits in. */
const laneOf = (org: string) => (/Owner/.test(org) ? 0 : ARCHITECT.test(org) ? 1 : org === 'General Contractor' ? 3 : /Engineer|Design|Vertical Transportation/.test(org) ? 2 : 4);

function CoordinationPlan({ x, y, w, rh, from, to, labels = true }: { x: number; y: number; w: number; rh: number; from: string; to: string; labels?: boolean }) {
  const d0 = dayNumber(from);
  const d1 = dayNumber(to);
  const lw = 66;
  const X = (iso: string) => x + lw + ((dayNumber(iso) - d0) / (d1 - d0)) * (w - lw);
  const cy = (lane: number) => y + lane * rh + rh / 2;
  // The plan's hand-offs: every milestone in the window, on its party's lane.
  const marks = ROW_ITEMS.flatMap((item) => item.steps.filter((s) => s.startDate === s.endDate && s.family !== 'required' && s.endDate >= from && s.endDate <= to).map((s) => ({ key: s.id, x: X(s.endDate), lane: laneOf(s.responsibleOrganization) })));
  const chain: [number, number][] = [[X(CHAIN[0].by), 0], [X(CHAIN[1].by), 1], [X(CHAIN[2].by), 4], [X(STONE_APPROVAL), 1]];
  return (
    <>
      {monthStarts(from, to).map((iso) => (
        <g key={iso}>
          <Rule x1={X(iso)} y1={y - 4} x2={X(iso)} y2={y + COORDINATION_LANES.length * rh} o={0.12} w={0.5} />
          {labels && <Kick x={X(iso) + 1.5} y={y - 6} z={5.2}>{monthName(Number(iso.slice(5, 7)) - 1)}</Kick>}
        </g>
      ))}
      {COORDINATION_LANES.map((lane, i) => (
        <g key={lane}>
          {labels && <T x={x + 2} y={cy(i) + 2.2} z={6} w={600}>{lane}</T>}
          <Rule x1={x} y1={y + (i + 1) * rh} x2={x + w} y2={y + (i + 1) * rh} o={0.1} w={0.5} />
        </g>
      ))}
      <path d={chain.map(([cx, l], i) => `${i ? 'L' : 'M'}${cx} ${cy(l)}`).join('')} style={{ fill: 'none', stroke: AMBER, strokeWidth: 1.3, strokeLinejoin: 'round' }} />
      {marks.map((m) => (
        <path key={m.key} d={`M${m.x} ${cy(m.lane) - 3}l3 3l-3 3l-3 -3z`} style={{ fill: MILESTONE, fillOpacity: 0.8 }} />
      ))}
      {chain.map(([cx, l], i) => (
        <Due key={i} x={cx} y={cy(l)} r={3.6} />
      ))}
    </>
  );
}

function ProtectYourReputation({ narrow }: { narrow: boolean }) {
  if (narrow) {
    const X = 16, Y = 22, W = 308, H = 182;
    return (
      <>
        <Ground w={340} h={212} g={21} />
        <Corner>
          <CoordinationPlan x={-10} y={12} w={136} rh={7} from="2026-11-01" to="2027-03-31" labels={false} />
        </Corner>
        <Sheet x={X} y={Y} w={W} h={H} />
        <Head x={X} y={Y} w={W} kicker="Coordinated by the general contractor" title="Coordination commitments" right={['Dec 2026 – Feb 2027']} tz={12.5} kz={6.2} />
        {CHAIN.map((r, i) => {
          const ry = Y + 48 + i * 34;
          const supports = r.supports.join(' ');
          return (
            <g key={r.what}>
              <Marked x={X + 5} y={ry} w={W - 10} h={34} wash={0.1} />
              <T x={X + 13} y={ry + 14} z={9.4} w={600}>{r.what}</T>
              <T x={X + W - 12} y={ry + 14} z={9.2} w={700} mono a="end">{monthDay(r.by)}</T>
              <T x={X + 13} y={ry + 26} z={7.6} c={INK}>{`${r.who}${r.via ? ` ${r.via}` : ''} · supports ${supports.charAt(0).toLowerCase()}${supports.slice(1)}`}</T>
              <Rule x1={X + 12} y1={ry + 34} x2={X + W - 12} y2={ry + 34} o={0.22} />
            </g>
          );
        })}
        <T x={X + 12} y={Y + H - 9} z={8.4} w={800}>{COMMITMENTS_CLOSING}</T>
      </>
    );
  }
  const X = 162, Y = 106, W = 384, H = 236;
  const c1 = X + 12, c2 = X + 152, c3 = X + 232, c4 = X + 280, top = Y + 54, rh = 29;
  const firstChain = COMMITMENTS.findIndex((c) => c.chain);
  const ay = top + 5 + firstChain * rh + rh / 2;
  return (
    <>
      <Ground w={560} h={350} g={28} />
      <g transform="rotate(-1.6 170 140)">
        <Sheet x={14} y={14} w={330} h={178} />
        <BackTitle title="Project coordination plan" right="Nov 2026 – Mar 2027" />
        <CoordinationPlan x={26} y={60} w={306} rh={22} from="2026-11-01" to="2027-03-31" />
      </g>
      <Sheet x={X} y={Y} w={W} h={H} />
      <Head x={X} y={Y} w={W} kicker="Requested and coordinated by the general contractor" title="Coordination commitments" right={['Nov 2026 – Feb 2027']} />
      <Kick x={c1} y={top}>Requirement</Kick>
      <Kick x={c2} y={top}>Responsible</Kick>
      <Kick x={c3} y={top}>Required</Kick>
      <Kick x={c4} y={top}>Supports</Kick>
      {COMMITMENTS.map((r, i) => {
        const ry = top + 5 + i * rh;
        return (
          <g key={r.what}>
            {r.chain && <Marked x={X + 6} y={ry} w={W - 12} h={rh} wash={0.1} />}
            <T x={c1} y={ry + 13.5} z={8.8} w={600}>{r.what}</T>
            <T x={c1} y={ry + 23.5} z={7} c={INK}>{r.pkg}</T>
            <T x={c2} y={ry + 13.5} z={8.4} w={600}>{r.who}</T>
            {r.via && <T x={c2} y={ry + 23.5} z={7} c={INK}>{r.via}</T>}
            <T x={c3} y={ry + 13.5} z={8.6} w={700} mono>{monthDay(r.by)}</T>
            {r.supports.map((line, j) => (
              <T key={line} x={c4} y={ry + 13.5 + j * 10} z={7.8} c={INK}>{line}</T>
            ))}
            <Rule x1={X + 12} y1={ry + rh} x2={X + W - 12} y2={ry + rh} o={0.22} />
          </g>
        );
      })}
      <T x={X + 12} y={Y + H - 11} z={9.4} w={800}>{COMMITMENTS_CLOSING}</T>
      <Note dot={[X + 6, ay]} end={[X - 26, ay + 40]} at={[X - 28, ay + 50]} words={['One chain,', 'three parties']} a="end" z={8.4} />
    </>
  );
}

/* ------------------------------------------------------------ the frame */

const DRAWING: Record<ArchitectTabId, (p: { narrow: boolean }) => ReactNode> = {
  'arch-see-whats-coming': SeeWhatsComing,
  'arch-plan-workload': PlanYourWorkload,
  'arch-protect-reputation': ProtectYourReputation,
};

/**
 * One tab's visual, filling the section's 16:10 frame. Both designs are drawn; a container query on the frame's width
 * shows the narrow one below 460px and the desktop one from it. The class names spell the width out, because Tailwind
 * only generates classes it can read; it is `ARCH_NARROW_BELOW` (the owner visuals' threshold), and a test keeps the two equal.
 */
export default function ArchitectVisual({ tab }: { tab: ArchitectTabId }) {
  const Drawing = DRAWING[tab];
  const { desktop, phone } = ARCH_CANVAS;
  return (
    <div className="jpd @container relative h-full w-full overflow-hidden">
      <svg viewBox={`0 0 ${phone.w} ${phone.h}`} className="absolute inset-0 block h-full w-full @min-[460px]:hidden">
        <Drawing narrow />
      </svg>
      <svg viewBox={`0 0 ${desktop.w} ${desktop.h}`} className="absolute inset-0 hidden h-full w-full @min-[460px]:block">
        <Drawing narrow={false} />
      </svg>
    </div>
  );
}
