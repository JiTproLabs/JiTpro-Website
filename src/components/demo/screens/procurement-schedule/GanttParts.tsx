import type { Tick } from './ganttTicks';
import { parse, type ScheduleItem } from './scheduleModel';

/**
 * The Gantt's left data area and period header, as presentational parts.
 * Extracted unchanged from `DemoGantt` (2026-11-10) so the full Procurement
 * Schedule and the homepage Plan schedule (Design System Section 54.4.2)
 * render one definition of the item column and the time header.
 */

const MS = 86400000;
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS);

/** The left data area's header cell. */
export function GanttItemHeader({ height }: { height: number }) {
  return (
    <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 11,
        fontSize: 9.6,
        fontWeight: 600,
        letterSpacing: '-0.006em',
        color: 'var(--jpd-text-strong)',
        borderBottom: '1px solid var(--jpd-grid-strong)',
      }}
    >
      Item
    </div>
  );
}

/** One item's row in the left data area: its name and Required On-Site date. */
export function GanttItemCell({
  item: it,
  height,
  selected: sel,
  onClick,
  nameLines = 2,
  showHealth = true,
}: {
  item: ScheduleItem;
  height: number;
  selected: boolean;
  onClick?: () => void;
  /** Lines the name may take before its ellipsis. */
  nameLines?: number;
  /** Whether the health badge is drawn; a view without issues omits it. */
  showHealth?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height,
        paddingLeft: sel ? 8 : 11,
        paddingRight: 8,
        borderBottom: '1px solid var(--jpd-grid)',
        borderLeft: sel ? '3px solid var(--jpd-row-bar)' : 'none',
        background: sel ? 'var(--jpd-row-tint)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <div
        /* Up to two lines, then ellipsis. The reference truncated at
           one line, but two of these package names are genuinely
           longer than the reference's were and clipping an item name
           is avoidable here. */
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          lineHeight: '14px',
          color: 'var(--jpd-text-strong)',
          display: '-webkit-box',
          WebkitLineClamp: nameLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {it.name}
      </div>
      {/* Required On-Site is first-class: it is on every row, not
          hidden behind a tooltip, and it is the same value the
          terminal milestone renders from. */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
        {/* Health rides beside the date it is a judgement about. Only
            the exceptions are drawn: a badge on all twelve healthy
            rows would be twelve marks carrying no information. */}
        {showHealth && it.health !== 'healthy' && (
          <span className={`jpd-health jpd-health--${it.health}`}>
            {it.health === 'impacted' ? 'IMPACTED' : 'AT RISK'}
          </span>
        )}
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.07em',
            color: 'var(--jpd-text-muted)',
          }}
        >
          REQ ON-SITE
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--jpd-text-body)' }}>
          {parse(it.requiredOnSiteDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          })}
        </span>
      </div>
    </div>
  );
}

/** The timeline's period header: one labelled band per tick. */
export function GanttPeriodHeader({
  ticks,
  domainStart,
  pxPerDay,
  height,
}: {
  ticks: Tick[];
  domainStart: Date;
  pxPerDay: number;
  height: number;
}) {
  return (
    <div
      style={{
        height,
        position: 'relative',
        borderBottom: '1px solid var(--jpd-grid-strong)',
      }}
    >
      {ticks.map((t) => (
        <div
          key={t.key}
          style={{
            position: 'absolute',
            left: dayDiff(domainStart, t.start) * pxPerDay,
            width: dayDiff(t.start, t.end) * pxPerDay,
            top: 0,
            bottom: 0,
            borderLeft: '1px solid var(--jpd-grid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9.5,
            fontWeight: 500,
            color: 'var(--jpd-text-secondary)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
