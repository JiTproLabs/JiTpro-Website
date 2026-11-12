import { v } from '../demo/screens/procurement-chain/chainVocabulary';
import { BOARD, shortDay, type BoardLayout } from './controlChainScene';
import { BOARD_TYPE } from './controlLayerApply';

/**
 * THE BOARD (Design System Section 54.4.4): the procurement schedule drawn
 * for the frame (stage A), its transition (T) and the list of priorities by
 * responsible party (B). One SVG per design, on its own canvas, scaled to the
 * frame as vector, so type and hairlines stay sharp at any size.
 *
 * It draws; it does not place or time anything. Every element that changes
 * carries a `data-k` key, and `applyBoard` (controlLayerApply.ts) sets it
 * from `controlStateAt`'s one state each animation frame (Section 46.3).
 *
 * Colour: the application's tokens. Activities take the three neutral state
 * tokens; amber (`--jpd-accent`) is only Today and what needs attention.
 */

const FACE = '"Inter Tight", Inter, system-ui, sans-serif';

const diamondAt = (x: number, y: number, r: number) => `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

export default function ControlBoard({ board, today, uid }: { board: BoardLayout; today: string; uid: string }) {
  const B = BOARD[board.mode];
  const F = BOARD_TYPE[board.mode];
  const desktop = board.mode === 'desktop';
  const ink = v('--jpd-text-strong');
  const sec = v('--jpd-text-secondary');
  const amber = v('--jpd-accent');
  const headTop = B.titleH;
  const monthTop = B.titleH + B.yearH;
  const footY = board.bottom + (board.h - board.bottom) / 2 + 3.5;
  const labels: [string, string][] = desktop
    ? [
        ['due', 'Due within 3 weeks'],
        ['active', 'Under way'],
        ['scheduled', 'Scheduled'],
        ['complete', 'Complete'],
        ['ros', 'Required on site'],
      ]
    : [
        ['due', 'Due within 3 weeks'],
        ['active', 'Under way'],
        ['scheduled', 'Scheduled'],
      ];
  const advance = ([k, label]: [string, string]) => (k === 'ros' ? 21 : 27) + label.length * F.foot * 0.52;
  const key = labels.map(([k, label], i) => ({ k, label, x: B.padL + labels.slice(0, i).reduce((n, l) => n + advance(l), 0) }));

  return (
    <svg
      data-board={board.mode}
      viewBox={`0 0 ${board.w} ${board.h}`}
      className="pointer-events-none absolute top-0 left-0"
      style={{ display: 'none', fontFamily: FACE }}
    >
      <defs>
        <clipPath id={`${uid}-cal-${board.mode}`}>
          <rect data-k="clip" x={board.x0} y={0} width={board.w} height={board.h} />
        </clipPath>
      </defs>

      {/* STAGE A: the schedule. The whole group sits lower while the view opens out. */}
      <g data-k="sched">
        {/* Around the bars: the calendar, the row lines and the foot. */}
        <g data-k="chrome" style={{ opacity: 0 }}>
          <rect x={0} y={headTop} width={board.w} height={B.yearH + B.monthH} style={{ fill: v('--jpd-surface-header') }} />
          <path d={`M0 ${headTop + 0.5}H${board.w}M0 ${board.top + 0.5}H${board.w}`} style={{ stroke: v('--jpd-grid-strong'), fill: 'none' }} />
          <path d={`M${board.x0} ${monthTop + 0.5}H${board.w}`} style={{ stroke: v('--jpd-grid-strong'), fill: 'none' }} />
          <text x={B.padL} y={monthTop + B.monthH / 2 + 3.4} style={{ fontSize: F.kicker, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fill: sec }}>
            Procurement item
          </text>
          {/* Years over months: two rows, so a year never crowds its neighbours. */}
          {board.years.map((y) => (
            <g key={y.label}>
              <path d={`M${y.x0 + 0.5} ${headTop}V${board.bottom}`} style={{ stroke: v('--jpd-grid-strong'), fill: 'none' }} />
              <text x={y.x0 + 5} y={headTop + B.yearH / 2 + 3.4} style={{ fontSize: F.year, fontWeight: 700, letterSpacing: '0.04em', fill: ink }}>
                {y.label}
              </text>
            </g>
          ))}
          {board.months.map((m, i) => (
            <g key={i}>
              {!m.year && i > 0 && <path d={`M${m.x + 0.5} ${monthTop}V${board.bottom}`} style={{ stroke: v('--jpd-grid'), fill: 'none' }} />}
              <text x={m.x + 4} y={monthTop + B.monthH / 2 + 3.5} style={{ fontSize: F.month, fontWeight: 500, fill: sec }}>
                {m.label}
              </text>
            </g>
          ))}
          {board.rows.map((r) => (
            <path key={r.id} d={`M0 ${r.y + B.rowH + 0.5}H${board.w}`} style={{ stroke: v('--jpd-grid'), fill: 'none' }} />
          ))}
          {/* The key, and how much of the project is shown. */}
          {key.map(({ k, label, x }) => {
            return (
              <g key={k}>
                {k === 'ros' ? (
                  <path d={diamondAt(x + 5, footY - 3.5, 4.5)} style={{ fill: v('--jpd-chain-ros') }} />
                ) : k === 'scheduled' ? (
                  <rect x={x + 0.5} y={footY - 8} width={15} height={8} rx={2} style={{ fill: v('--jpd-state-scheduled-fill'), stroke: v('--jpd-state-scheduled-edge') }} />
                ) : (
                  <rect x={x} y={footY - 8.5} width={16} height={9} rx={2} style={{ fill: k === 'due' ? amber : k === 'active' ? v('--jpd-state-active') : v('--jpd-state-complete') }} />
                )}
                <text x={x + (k === 'ros' ? 14 : 21)} y={footY} style={{ fontSize: F.foot, fill: sec }}>
                  {label}
                </text>
              </g>
            );
          })}
          <text x={board.x1} y={footY} textAnchor="end" style={{ fontSize: F.foot, fill: v('--jpd-text-muted') }}>
            {`${board.shown.items} of ${board.shown.of} items`}
          </text>
        </g>

        {/* Each row's name, where it stands, and its Required On Site date. */}
        {board.rows.map((r, i) => (
          <g key={r.id} data-k="row" data-i={i} style={{ opacity: 0 }}>
            <rect data-k="rowmark" data-i={i} x={0} y={r.y + 1} width={3} height={B.rowH - 1} style={{ opacity: 0, fill: amber }} />
            <text data-k="name" data-i={i} x={B.padL} y={desktop ? r.cy - 2 : r.cy + 4} style={{ fontSize: F.name, fontWeight: 600, letterSpacing: '-0.01em', fill: ink }}>
              {r.name}
            </text>
            {desktop && (
              <text data-k="status" data-i={i} x={B.padL} y={r.cy + 11.5} style={{ fontSize: F.status, fill: sec }}>
                {r.status}
              </text>
            )}
            {r.ros && (
              <g data-k="ros" data-i={i}>
                <path d={diamondAt(r.ros.x, r.cy, 5.5)} style={{ fill: v('--jpd-chain-ros') }} />
                {r.ros.label && (
                  <text x={r.ros.x + 10} y={r.cy + 3.5} style={{ fontSize: 9.5, fontWeight: 600, fill: sec }}>
                    {r.ros.label}
                  </text>
                )}
              </g>
            )}
          </g>
        ))}

        {/* The calendar's bars: as wide as the chain's close up, easing to this schedule's own scale. */}
        <g clipPath={`url(#${uid}-cal-${board.mode})`}>
          <g data-k="zoom">
            {board.rows.map((r, i) => (
              <g key={r.id} data-k="bars" data-i={i} style={{ opacity: 0 }}>
                {r.bars.map((b) => {
                  const y = Math.round(r.cy - B.barH / 2);
                  return b.state === 'scheduled' ? (
                    <rect key={b.id} x={b.x + 0.5} y={y + 0.5} width={Math.max(1, b.w - 1)} height={B.barH - 1} rx={2} style={{ fill: v('--jpd-state-scheduled-fill'), stroke: v('--jpd-state-scheduled-edge'), vectorEffect: 'non-scaling-stroke' }} />
                  ) : (
                    <rect key={b.id} x={b.x} y={y} width={b.w} height={B.barH} rx={2} style={{ fill: v(b.state === 'complete' ? '--jpd-state-complete' : '--jpd-state-active') }} />
                  );
                })}
              </g>
            ))}
            {/* What needs attention. Current work: the part elapsed solid, the part still to run open, to its due date. A commitment: a diamond on its date. */}
            {board.marks.map((m, i) => (
              <g key={m.id} data-k="mark" data-i={i} style={{ opacity: 0 }}>
                {m.kind === 'activity' ? (
                  <>
                    <rect x={m.box.x + 0.75} y={m.box.y + 0.75} width={m.box.w - 1.5} height={m.box.h - 1.5} rx={3} style={{ fill: v('--jpd-row-tint'), stroke: amber, strokeWidth: 1.5 }} />
                    <rect x={m.box.x} y={m.box.y} width={Math.max(3, m.split - m.box.x)} height={m.box.h} rx={3} style={{ fill: amber }} />
                  </>
                ) : (
                  <path d={diamondAt(m.split, m.box.y + m.box.h / 2, 6.5)} style={{ fill: amber, stroke: v('--jpd-surface'), strokeWidth: 1.5 }} />
                )}
              </g>
            ))}
          </g>
        </g>

        {/* TODAY, across every row. */}
        <path data-k="today" d={`M0 ${B.titleH - 7}V${board.bottom}`} style={{ opacity: 0, stroke: amber, strokeWidth: 2, fill: 'none' }} />

        {/* THE TRANSITION: each requirement's connector to its required date. */}
        {board.entries.map((e, i) => (
          <g key={e.req.id} data-k="link" data-i={i} style={{ opacity: 0 }}>
            <rect x={board.x1 - (desktop ? 50 : 44)} y={e.dateT.y - 12.5} width={desktop ? 64 : 52} height={17} style={{ fill: v('--jpd-surface') }} />
            <path data-k="leader" data-i={i} d={e.leader} pathLength={1} style={{ fill: 'none', stroke: amber, strokeWidth: 1.5, strokeDasharray: '1 1', strokeDashoffset: 1 }} />
          </g>
        ))}
      </g>

      {/* The title, which the list takes over; and the Today flag, which stays. */}
      <text data-k="titleA" x={B.padL} y={B.titleH / 2 + 5} style={{ opacity: 0, fontSize: F.title, fontWeight: 700, letterSpacing: '-0.015em', fill: v('--jpd-nav-bg-start') }}>
        Procurement Schedule
      </text>
      <text data-k="titleB" x={B.padL} y={B.titleH / 2 + 5} style={{ opacity: 0, fontSize: F.title, fontWeight: 700, letterSpacing: '-0.015em', fill: v('--jpd-nav-bg-start') }}>
        Today’s Priorities
      </text>
      <g data-k="flag" style={{ opacity: 0 }}>
        <rect x={-F.flagW / 2} y={B.titleH - 25} width={F.flagW} height={18} rx={2.5} style={{ fill: amber }} />
        <text x={0} y={B.titleH - 12.5} textAnchor="middle" style={{ fontSize: F.flag, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', fill: v('--jpd-nav-bg-start') }}>
          {`Today · ${shortDay(today)}`}
        </text>
      </g>

      {/* STAGE B: the list's own furniture. */}
      <g data-k="listHead" style={{ opacity: 0 }}>
        {desktop ? (
          <>
            <rect x={0} y={B.titleH} width={board.w} height={B.listHead} style={{ fill: v('--jpd-surface-header') }} />
            <path d={`M0 ${B.titleH + 0.5}H${board.w}M0 ${B.titleH + B.listHead + 0.5}H${board.w}`} style={{ stroke: v('--jpd-grid-strong'), fill: 'none' }} />
            {(
              [
                [B.padL, 'start', 'Responsible party'],
                [B.actionX, 'start', 'Required action'],
                [board.x1, 'end', 'Required by'],
              ] as const
            ).map(([x, anchor, label]) => (
              <text key={label} x={x} y={B.titleH + B.listHead / 2 + 3.2} textAnchor={anchor} style={{ fontSize: F.kicker, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fill: sec }}>
                {label}
              </text>
            ))}
          </>
        ) : (
          <path d={`M0 ${B.titleH + 0.5}H${board.w}`} style={{ stroke: v('--jpd-grid-strong'), fill: 'none' }} />
        )}
      </g>
      {board.entries.map((e, i) => (
        <g key={e.req.id} data-k="detail" data-i={i} style={{ opacity: 0 }}>
          <text x={e.actionB.x} y={e.actionB.y} style={{ fontSize: F.action, fontWeight: 700, letterSpacing: '-0.01em', fill: ink }}>
            {e.action}
          </text>
          <text x={e.detailB.x} y={e.detailB.y} style={{ fontSize: F.detail, fill: sec }}>
            {e.detail}
          </text>
          <text x={e.dueB.x} y={e.dueB.y} textAnchor="end" style={{ fontSize: F.due, fill: sec }}>
            {e.due}
          </text>
          <path d={`M${e.groupEnd || !desktop ? 0 : B.actionX} ${e.lineY + 0.5}H${board.w}`} style={{ stroke: v(e.groupEnd ? '--jpd-grid-strong' : '--jpd-grid'), fill: 'none' }} />
        </g>
      ))}
      <g data-k="idle" style={{ opacity: 0 }}>
        {board.idle.map((p) => (
          <g key={p.party}>
            <text x={B.padL} y={p.y} style={{ fontSize: F.partyB, fontWeight: 700, fill: v('--jpd-text-muted') }}>
              {p.party}
            </text>
            <text x={B.actionX + 14} y={p.y} style={{ fontSize: F.detail, fontWeight: 600, fill: sec }}>
              {p.text}
            </text>
            <text x={B.actionX + 14} y={p.y + 14} style={{ fontSize: F.detail, fill: sec }}>
              {p.next}
            </text>
          </g>
        ))}
        {board.more && (
          <text x={B.padL} y={board.more.y} style={{ fontSize: F.detail, fill: sec }}>
            {board.more.text}
          </text>
        )}
      </g>

      {/* WHAT TRAVELS from the schedule into the list: each requirement's amber mark, its party and its date. */}
      {board.entries.map((e, i) => (
        <g key={e.req.id}>
          <rect data-k="rule" data-i={i} rx={2} style={{ opacity: 0, fill: amber }} />
          <text data-k="party" data-i={i} style={{ opacity: 0, fontWeight: 700, fill: ink }}>
            {e.party}
          </text>
          <text data-k="date" data-i={i} textAnchor="end" style={{ opacity: 0, fontWeight: 700, fill: ink }}>
            {e.date}
          </text>
        </g>
      ))}
    </svg>
  );
}
