import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { v } from '../demo/screens/procurement-chain/chainVocabulary';
import {
  FIELD,
  LOOKAHEAD_STEPS,
  OWNER_CANVAS,
  OWNER_DECISIONS,
  OWNER_ITEM,
  OWNER_NARROW_BELOW,
  OWNER_ON_SITE,
  OWNER_QUESTION,
  OWNER_STAGES,
  OWNER_TAKEAWAY,
  REQUEST_PILE,
  RISK,
  buildOwnerScene,
  chainGeometry,
  fullDay,
  lookaheadWindow,
  ownerStateAt,
  requestGeometry,
  shortDay,
  type OwnerMode,
  type OwnerTabId,
} from './ownerScenes';
import '../demo/tokens.css';
import '../demo/screens/procurement-schedule/scheduleTokens.css';
import '../demo/screens/procurement-chain/chainTokens.css';

/**
 * The Project Owners tabs' visuals (Design System Section 54.4.5): four short
 * stories about one sample project, each drawn for the frame as vector on its
 * own canvas (a desktop design and a narrow one), never a scaled-down
 * application screen.
 *
 * ONE CLOCK (Section 46.3). Every element that changes carries a `data-k`
 * key. Each animation frame, `ownerStateAt(scene, t)` gives every key its
 * opacity, rise, drawn length and travel, and this component applies them.
 * Not played: parked on the opening frame. Played: one pass, then rest.
 * Reduced motion: the resting state at once (Section 46.5).
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
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

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

/** The featured chain as five stages and its Required On Site date. */
function Chain({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = chainGeometry(mode);
  const { w } = OWNER_CANVAS[mode];
  return (
    <>
      {OWNER_STAGES.map((s, i) => {
        const x = g.x + i * g.pitch;
        return (
          <K key={s.id} k={`stage-${s.id}`}>
            <rect x={x + 0.5} y={g.y + 0.5} width={g.w - 1} height={g.h - 1} rx={3} style={{ fill: v('--jpd-state-scheduled-fill'), stroke: v('--jpd-state-scheduled-edge') }} />
            <text x={x + g.w / 2} y={g.y + g.h / 2 + (d ? 3.6 : 3)} textAnchor="middle" style={{ fontSize: d ? 10 : 8, fontWeight: 600, fill: ink }}>
              {d ? s.label : s.short}
            </text>
            <text x={x + 1} y={g.y + g.h + (d ? 13 : 10)} style={{ fontSize: d ? 9.5 : 8, fill: sec }}>
              {shortDay(s.start)}
            </text>
          </K>
        );
      })}
      <K k="ros">
        <path d={diamond(g.rosX, g.y + g.h / 2, d ? 8 : 6)} style={{ fill: v('--jpd-chain-ros') }} />
        {/* Above the chain on a desktop frame; on a narrow one, on its own line beneath the stages' dates. */}
        {d ? (
          <>
            <text x={w - 20} y={g.y - 22} textAnchor="end" style={{ fontSize: 9.5, fill: sec }}>
              Required on site
            </text>
            <text x={w - 20} y={g.y - 8} textAnchor="end" style={{ fontSize: 11.5, fontWeight: 700, fill: ink }}>
              {fullDay(OWNER_ON_SITE)}
            </text>
          </>
        ) : (
          <text x={w - 10} y={g.y + g.h + 21} textAnchor="end" style={{ fontSize: 8.5, fill: sec }}>
            Required on site <tspan style={{ fontWeight: 700, fill: ink }}>{fullDay(OWNER_ON_SITE)}</tspan>
          </text>
        )}
      </K>
    </>
  );
}

function Title({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  return (
    <K k="title">
      <text x={d ? 20 : 10} y={d ? 23 : 14} style={{ fontSize: d ? 13.5 : 10.5, fontWeight: 700, letterSpacing: '-0.01em', fill: navy }}>
        {OWNER_ITEM}
      </text>
    </K>
  );
}

/** A dependency's card above the chain: a box and a stem down to its date. Its text is laid over it by the caller. */
function cardBox(mode: OwnerMode, atX: number) {
  const d = mode === 'desktop';
  const { w } = OWNER_CANVAS[mode];
  const cw = d ? 250 : 210;
  const ch = d ? 88 : 72;
  const x = clamp(atX - cw / 2, d ? 20 : 10, w - (d ? 20 : 10) - cw);
  return { x, y: d ? 34 : 20, w: cw, h: ch };
}
function Rows({ mode, x, y, rows }: { mode: OwnerMode; x: number; y: number; rows: [string, string][] }) {
  const d = mode === 'desktop';
  return (
    <>
      {rows.map(([label, value], i) => (
        <g key={label}>
          <text x={x} y={y + i * (d ? 13 : 11)} style={{ fontSize: d ? 10 : 8.5, fill: sec }}>
            {label}
          </text>
          <text x={x + (d ? 68 : 58)} y={y + i * (d ? 13 : 11)} style={{ fontSize: d ? 10 : 8.5, fontWeight: 700, fill: ink }}>
            {value}
          </text>
        </g>
      ))}
    </>
  );
}

/* --------------------------------------------------------- 1. Reduce risk */

function RiskVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = chainGeometry(mode);
  const { w } = OWNER_CANVAS[mode];
  const depX = g.at(RISK.at);
  const c = cardBox(mode, depX);
  const tx = c.x + (d ? 14 : 10);
  const ry = g.y + g.h + (d ? 27 : 30);
  const after = OWNER_STAGES.map((s, i) => ({ s, i })).filter(({ s }) => s.start >= RISK.requiredBy);
  return (
    <>
      <Title mode={mode} />
      <K k="onTrack">
        <text x={w - (d ? 20 : 10)} y={d ? 23 : 14} textAnchor="end" style={{ fontSize: d ? 10 : 8.5, fill: sec }}>
          {d ? 'Construction schedule: on track' : 'Schedule: on track'}
        </text>
      </K>
      <Chain mode={mode} />

      {/* What could be reached, were it left unresolved. A possibility, shown as such. */}
      <K k="riskHalo">
        {after.map(({ s, i }) => (
          <rect key={s.id} x={g.x + i * g.pitch - 1.5} y={g.y - 1.5} width={g.w + 3} height={g.h + 3} rx={5} style={{ fill: 'none', stroke: amber, strokeWidth: 1.5 }} />
        ))}
      </K>
      <Drawn k="risk" d={`M${depX} ${ry}H${g.rosX}`} stroke={amber} width={2} />
      <K k="riskText">
        <path d={`M${g.rosX} ${ry}l-6 -4v8z`} style={{ fill: amber }} />
        <text x={depX} y={ry + (d ? 16 : 12)} style={{ fontSize: d ? 10.5 : 8.5, fontWeight: 600, fill: v('--jpd-warn-fg') }}>
          Could affect everything that follows
        </text>
      </K>

      <K k="card">
        <path d={`M${depX} ${c.y + c.h}V${g.y - (d ? 8 : 6)}`} style={{ stroke: amber, strokeWidth: 1.5, fill: 'none' }} />
        <rect x={c.x + 0.5} y={c.y + 0.5} width={c.w - 1} height={c.h - 1} rx={6} style={{ fill: surface, stroke: edge }} />
        <text x={tx} y={c.y + (d ? 36 : 27)} style={{ fontSize: d ? 13 : 10.5, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
          {RISK.name}
        </text>
      </K>
      <K k="kUnresolved">
        <text x={tx} y={c.y + (d ? 19 : 14)} style={kicker(d ? 8.5 : 7.5, v('--jpd-warn-fg'))}>
          Unresolved
        </text>
      </K>
      <K k="kAssigned">
        <text x={tx} y={c.y + (d ? 19 : 14)} style={kicker(d ? 8.5 : 7.5, sec)}>
          Identified and assigned
        </text>
      </K>
      <K k="kResolved">
        <text x={tx} y={c.y + (d ? 19 : 14)} style={kicker(d ? 8.5 : 7.5, v('--jpd-ok-fg'))}>
          Resolved early
        </text>
      </K>
      <K k="condition">
        <text x={tx} y={c.y + (d ? 53 : 41)} style={{ fontSize: d ? 10.5 : 8.5, fill: sec }}>
          {RISK.condition}
        </text>
      </K>
      <K k="assign">
        <Rows
          mode={mode}
          x={tx}
          y={c.y + (d ? 53 : 41)}
          rows={[
            ['Responsible', RISK.owner],
            ['Required by', fullDay(RISK.requiredBy)],
            ['Protects', RISK.protects],
          ]}
        />
      </K>

      {/* The requirement on the chain: open, then resolved. */}
      <K k="depOpen">
        <path d={diamond(depX, g.y, d ? 7.5 : 6)} style={{ fill: amber, stroke: surface, strokeWidth: 1.5 }} />
      </K>
      <K k="depDone">
        <path d={diamond(depX, g.y, d ? 8.5 : 6.5)} style={{ fill: v('--jpd-ok-fg'), stroke: surface, strokeWidth: 1.5 }} />
        <path d={`M${depX - 3} ${g.y}l2.2 2.4l4 -4.6`} style={{ fill: 'none', stroke: surface, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      </K>
      <Takeaway tab="owner-reduce-risk" mode={mode} />
    </>
  );
}

/* ------------------------------------------------ 2. Protect your investment */

/** A sentence on two lines, broken at the space nearest its middle. */
function twoLines(text: string): [string, string] {
  const mid = text.length / 2;
  const spaces = [...text].map((ch, i) => (ch === ' ' ? i : -1)).filter((i) => i >= 0);
  const at = spaces.reduce((best, i) => (Math.abs(i - mid) < Math.abs(best - mid) ? i : best), spaces[0] ?? text.length);
  return [text.slice(0, at), text.slice(at + 1)];
}

function InvestmentVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const g = chainGeometry(mode);
  const { w } = OWNER_CANVAS[mode];
  const pad = d ? 20 : 10;
  const late = v('--jpd-chain-commitment-late');
  const lateX = g.at(OWNER_STAGES.length - 0.04);
  const lc = { x: w - pad - (d ? 250 : 210), y: d ? 34 : 20, w: d ? 250 : 210, h: d ? 66 : 52 };
  const [p1, p2] = twoLines(FIELD.problem);
  const fieldX = g.at(FIELD.at);
  const fc = cardBox(mode, fieldX);
  const ftx = fc.x + (d ? 14 : 10);
  const lineY = g.y + g.h + (d ? 27 : 30);
  /* The consequences, set as chips in rows beneath the chain. */
  const size = d ? 10.5 : 8.5;
  const chipH = d ? 22 : 17;
  const chips = FIELD.consequences.reduce<{ label: string; x: number; y: number; w: number }[]>((placed, label) => {
    const cw = Math.round(label.length * size * 0.54 + (d ? 20 : 14));
    const prev = placed[placed.length - 1];
    let x = prev ? prev.x + prev.w + (d ? 8 : 5) : pad;
    let y = prev ? prev.y : g.y + g.h + (d ? 36 : 28);
    if (x + cw > w - pad) {
      x = pad;
      y += chipH + (d ? 7 : 4);
    }
    return [...placed, { label, x, y, w: cw }];
  }, []);
  return (
    <>
      <Title mode={mode} />
      <K k="kLate">
        <text x={w - pad} y={d ? 23 : 14} textAnchor="end" style={kicker(d ? 8.5 : 7.5, sec)}>
          Without early planning
        </text>
      </K>
      <K k="kPlanned">
        <text x={w - pad} y={d ? 23 : 14} textAnchor="end" style={kicker(d ? 8.5 : 7.5, navy)}>
          With early planning
        </text>
      </K>
      <Chain mode={mode} />

      {/* Found late: when the product arrives. */}
      <K k="lateCard">
        <path d={`M${lateX} ${lc.y + lc.h}V${g.y - (d ? 8 : 6)}`} style={{ stroke: late, strokeWidth: 1.5, fill: 'none' }} />
        <rect x={lc.x + 0.5} y={lc.y + 0.5} width={lc.w - 1} height={lc.h - 1} rx={6} style={{ fill: surface, stroke: edge }} />
        <text x={lc.x + (d ? 14 : 10)} y={lc.y + (d ? 19 : 14)} style={kicker(d ? 8.5 : 7.5, late)}>
          Found at delivery
        </text>
        {[p1, p2].map((line, i) => (
          <text key={i} x={lc.x + (d ? 14 : 10)} y={lc.y + (d ? 36 : 28) + i * (d ? 15 : 12)} style={{ fontSize: d ? 12.5 : 10, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
            {line}
          </text>
        ))}
      </K>
      <K k="lateMark">
        <path d={diamond(lateX, g.y, d ? 7.5 : 6)} style={{ fill: late, stroke: surface, strokeWidth: 1.5 }} />
      </K>
      {chips.map((c, i) => (
        <K key={c.label} k={`cost-${i}`}>
          <rect x={c.x + 0.5} y={c.y + 0.5} width={c.w - 1} height={chipH - 1} rx={chipH / 2} style={{ fill: v('--jpd-warn-bg'), stroke: v('--jpd-warn-border') }} />
          <text x={c.x + c.w / 2} y={c.y + chipH / 2 + size * 0.36} textAnchor="middle" style={{ fontSize: size, fontWeight: 600, fill: ink }}>
            {c.label}
          </text>
        </K>
      ))}
      {/* The field's date is no longer certain: an outline beside it, never a new date. */}
      <K k="slip">
        <path d={diamond(g.rosX + (d ? 15 : 11), g.y + g.h / 2, d ? 8 : 6)} style={{ fill: 'none', stroke: late, strokeWidth: 1.5, strokeDasharray: '3 2.5' }} />
      </K>

      {/* Planned: verified before fabrication is released. */}
      <K k="fieldCard">
        <path d={`M${fieldX} ${fc.y + fc.h}V${g.y - (d ? 8 : 6)}`} style={{ stroke: amber, strokeWidth: 1.5, fill: 'none' }} />
        <rect x={fc.x + 0.5} y={fc.y + 0.5} width={fc.w - 1} height={fc.h - 1} rx={6} style={{ fill: surface, stroke: edge }} />
        <text x={ftx} y={fc.y + (d ? 19 : 14)} style={kicker(d ? 8.5 : 7.5, sec)}>
          Verified before fabrication
        </text>
        <text x={ftx} y={fc.y + (d ? 36 : 27)} style={{ fontSize: d ? 13 : 10.5, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
          {FIELD.name}
        </text>
        <Rows
          mode={mode}
          x={ftx}
          y={fc.y + (d ? 53 : 41)}
          rows={[
            ['Responsible', FIELD.owner],
            ['Required by', fullDay(FIELD.requiredBy)],
            ['Protects', FIELD.protects],
          ]}
        />
      </K>
      <K k="fieldMark">
        <path d={diamond(fieldX, g.y, d ? 7.5 : 6)} style={{ fill: amber, stroke: surface, strokeWidth: 1.5 }} />
      </K>
      <Drawn k="proceed" d={`M${g.x} ${lineY}H${g.rosX}`} stroke={v('--jpd-state-active')} width={d ? 3 : 2.5} cap="round" />
      <Takeaway tab="owner-protect-investment" mode={mode} />
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

function DecisionsVisual({ mode }: { mode: OwnerMode }) {
  const d = mode === 'desktop';
  const { w } = OWNER_CANVAS[mode];
  const g = requestGeometry(mode);
  const first = OWNER_DECISIONS[0];
  const y0 = g.rowY(0);
  const why: [string, string][] = [
    ['Required by', fullDay(first.requiredBy)],
    ['Needed for', first.neededFor],
    ['Supports', `${first.item} on site, ${fullDay(first.onSite)}`],
  ];
  const wp = d ? 40 : 26;
  const dotX = g.why.x + (d ? 16 : 12);
  const dotY = (i: number) => g.why.y + (d ? 26 : 17) + i * wp;
  return (
    <>
      {REQUEST_PILE.map((di, order) => {
        const dec = OWNER_DECISIONS[di];
        const at = g.pile[order];
        return (
          <g key={dec.id} transform={`translate(${at.x} ${at.y})`}>
            <K k={`req-${di}`}>
              <rect x={0.5} y={0.5} width={g.card.w - 1} height={g.card.h - 1} rx={6} style={{ fill: surface, stroke: v('--jpd-state-scheduled-edge') }} />
              <text x={d ? 16 : 11} y={g.card.h / 2 + (d ? 4.2 : 3.4)} style={{ fontSize: d ? 12.5 : 9.5, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
                {dec.request}
              </text>
              {/* The ordinary experience: everything marked the same. A neutral tag, not a warning. */}
              <K k={`asap-${di}`}>
                <rect x={g.card.w - (d ? 54 : 40)} y={g.card.h / 2 - (d ? 9 : 7)} width={d ? 42 : 32} height={d ? 18 : 14} rx={3} style={{ fill: v('--jpd-state-active') }} />
                <text x={g.card.w - (d ? 33 : 24)} y={g.card.h / 2 + (d ? 3.2 : 2.7)} textAnchor="middle" style={{ fontSize: d ? 9 : 7.5, fontWeight: 800, letterSpacing: '0.08em', fill: v('--jpd-nav-text') }}>
                  ASAP
                </text>
              </K>
              <K k={`due-${di}`}>
                <text x={g.card.w - (d ? 14 : 10)} y={g.card.h / 2 + (d ? 4.2 : 3.4)} textAnchor="end" style={{ fontSize: d ? 12 : 9, fontWeight: 700, fill: ink }}>
                  {fullDay(dec.requiredBy)}
                </text>
              </K>
            </K>
          </g>
        );
      })}
      <K k="question">
        <text x={w / 2} y={d ? 268 : 158} textAnchor="middle" style={{ fontSize: d ? 17 : 12.5, fontWeight: 700, letterSpacing: '-0.015em', fill: navy }}>
          {`“${OWNER_QUESTION}”`}
        </text>
      </K>
      <K k="first">
        <rect x={g.rowX} y={y0} width={d ? 4 : 3} height={g.card.h} rx={2} style={{ fill: amber }} />
        <text x={g.rowX} y={y0 - (d ? 8 : 5)} style={kicker(d ? 8.5 : 7.5, v('--jpd-warn-fg'))}>
          Needed first
        </text>
      </K>

      {/* Why its date matters: what it is needed for, and what that supports. */}
      <K k="why">
        <rect x={g.why.x + 0.5} y={g.why.y + 0.5} width={g.why.w - 1} height={g.why.h - 1} rx={6} style={{ fill: surface, stroke: edge }} />
        {why.map(([label, value], i) => (
          <g key={label}>
            <circle cx={dotX} cy={dotY(i)} r={d ? 3.5 : 2.8} style={{ fill: i === 0 ? amber : surface, stroke: amber, strokeWidth: 1.5 }} />
            <text x={dotX + (d ? 14 : 10)} y={dotY(i) - (d ? 4 : 2.5)} style={kicker(d ? 8 : 7.5, sec)}>
              {label}
            </text>
            <text x={dotX + (d ? 14 : 10)} y={dotY(i) + (d ? 10 : 7.5)} style={{ fontSize: d ? 10.5 : 8.8, fontWeight: 700, fill: ink }}>
              {value}
            </text>
          </g>
        ))}
      </K>
      <Drawn k="whyPath" d={d ? `M${g.rowX + g.card.w} ${y0 + g.card.h / 2}H${g.why.x}` : `M${g.rowX + 14} ${y0 + g.card.h}V${g.why.y}`} stroke={amber} width={1.5} />
      <Drawn k="whyPath" d={`M${dotX} ${dotY(0) + (d ? 5 : 4)}V${dotY(why.length - 1) - (d ? 5 : 4)}`} stroke={amber} width={1.5} />
      <Takeaway tab="owner-better-decisions" mode={mode} />
    </>
  );
}

const VISUAL: Record<OwnerTabId, (p: { mode: OwnerMode }) => ReactNode> = {
  'owner-reduce-risk': RiskVisual,
  'owner-protect-investment': InvestmentVisual,
  'owner-predictability': PredictabilityVisual,
  'owner-better-decisions': DecisionsVisual,
};

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
          else el.setAttribute('transform', `translate(${s.mx} ${s.my + s.ty})`);
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
    <div ref={frameRef} className="jpd relative h-full overflow-hidden" style={{ background: surface }}>
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
