import { useCallback, useEffect, useMemo, useRef } from 'react';
import PhaseInspector from './PhaseInspector';
import ScheduleRowMarks from './ScheduleRowMarks';
import { useMarkInspection } from './useMarkInspection';
import { useInspection } from '../../inspection';
import { DATA_DATE, parse, type ScheduleItem } from './scheduleModel';
import { nonWorkingRuns } from './workCalendar';
import './scheduleTokens.css';

/**
 * The Gantt. EVERY POSITION IS DERIVED FROM A DATE - no pixel width is ever
 * authored. Change a duration in the fixture and the bar moves, the milestone
 * moves, and the popover text changes, because all three read one record.
 *
 * Each duration phase and each milestone is its own DOM element, which is what
 * makes them independently inspectable and independently focusable. The row is
 * never a single bar, gradient or flat image.
 */

export type Zoom = 'quarters' | 'months' | 'weeks' | 'days';

/** Pixels per calendar day at each band. Quarters is fitted to the viewport. */
const PX_PER_DAY: Record<Zoom, number> = {
  quarters: 0, // computed to fit
  months: 2.6,
  weeks: 9,
  days: 26,
};

const MS = 86400000;
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS);

type Tick = { key: string; label: string; start: Date; end: Date };

function buildTicks(domainStart: Date, domainEnd: Date, zoom: Zoom): Tick[] {
  const ticks: Tick[] = [];
  const c = new Date(domainStart);
  if (zoom === 'quarters') {
    c.setUTCDate(1);
    c.setUTCMonth(Math.floor(c.getUTCMonth() / 3) * 3);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCMonth(e.getUTCMonth() + 3);
      ticks.push({
        key: s.toISOString(),
        label: `Q${Math.floor(s.getUTCMonth() / 3) + 1} ${s.getUTCFullYear()}`,
        start: s,
        end: e,
      });
      c.setUTCMonth(c.getUTCMonth() + 3);
    }
  } else if (zoom === 'months') {
    c.setUTCDate(1);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCMonth(e.getUTCMonth() + 1);
      ticks.push({
        key: s.toISOString(),
        label: s.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        start: s,
        end: e,
      });
      c.setUTCMonth(c.getUTCMonth() + 1);
    }
  } else if (zoom === 'weeks') {
    while (c.getUTCDay() !== 1) c.setUTCDate(c.getUTCDate() - 1);
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCDate(e.getUTCDate() + 7);
      ticks.push({
        key: s.toISOString(),
        label: s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        start: s,
        end: e,
      });
      c.setUTCDate(c.getUTCDate() + 7);
    }
  } else {
    while (c < domainEnd) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCDate(e.getUTCDate() + 1);
      ticks.push({
        key: s.toISOString(),
        label: String(s.getUTCDate()),
        start: s,
        end: e,
      });
      c.setUTCDate(c.getUTCDate() + 1);
    }
  }
  return ticks;
}

type Props = {
  items: ScheduleItem[];
  zoom: Zoom;
  /** Timeline viewport width in canvas px. */
  viewportWidth: number;
  leftWidth: number;
  rowHeight: number;
  headerHeight: number;
  selectedItemId: string;
  onSelectItem: (id: string) => void;
};

export default function DemoGantt({
  items,
  zoom,
  viewportWidth,
  leftWidth,
  rowHeight,
  headerHeight,
  selectedItemId,
  onSelectItem,
}: Props) {
  const { enabled } = useInspection();

  /**
   * Hover, focus and pin state, the grace ring, tap-outside and Escape live
   * in useMarkInspection (extracted 2026-11-06, behaviour unchanged) so the
   * homepage comparison inspects marks through the same logic.
   */
  const { anchor, hovered, dismiss, clearHover, handlersFor } = useMarkInspection(enabled);

  const hostRef = useRef<HTMLDivElement>(null);

  /**
   * A zoom-band change or a different selected item moves or replaces every
   * segment, so a hover measured against the old layout is stale by
   * definition.
   */
  useEffect(() => {
    clearHover();
  }, [zoom, selectedItemId, clearHover]);

  /** Domain: the earliest scheduled start to the latest Required On-Site,
      padded to whole months so the header bands start cleanly. */
  const { domainStart, pxPerDay, totalWidth, ticks, bands } = useMemo(() => {
    let min = items[0].startDate;
    let max = items[0].requiredOnSiteDate;
    for (const it of items) {
      if (it.startDate < min) min = it.startDate;
      if (it.requiredOnSiteDate > max) max = it.requiredOnSiteDate;
    }
    const ds = parse(min);
    ds.setUTCDate(1);
    const de = parse(max);
    de.setUTCMonth(de.getUTCMonth() + 1, 1);

    const days = dayDiff(ds, de);
    const ppd = zoom === 'quarters' ? viewportWidth / days : PX_PER_DAY[zoom];
    /**
     * NON-WORKING DAYS - weekends and observed federal holidays - from the
     * same calendar the backward pass refuses to count, positioned through
     * the same day scale as the bars. Consecutive days are one band, so a
     * Monday holiday joins its weekend; at Days zoom each date still sits in
     * its own column because the band is `days * ppd` wide, never authored.
     */
    const bands = nonWorkingRuns(ds, de).map((r) => ({
      key: r.start.toISOString(),
      left: dayDiff(ds, r.start) * ppd,
      width: r.days * ppd,
    }));
    return {
      domainStart: ds,
      domainEnd: de,
      pxPerDay: ppd,
      totalWidth: days * ppd,
      ticks: buildTicks(ds, de, zoom),
      bands,
    };
  }, [items, zoom, viewportWidth]);

  const x = useCallback(
    (d: string) => dayDiff(domainStart, parse(d)) * pxPerDay,
    [domainStart, pxPerDay],
  );

  const todayX = x(DATA_DATE);

  /**
   * Changing the selected procurement item clears every transient state, so
   * phase detail from the previous item can never be left floating over the
   * newly selected one. An intentional pin is cleared too: it belonged to the
   * item the visitor just navigated away from.
   */
  const selectItem = useCallback(
    (id: string) => {
      dismiss();
      onSelectItem(id);
    },
    [dismiss, onSelectItem],
  );

  return (
    <div
      ref={hostRef}
      className="flex"
      style={{ position: 'relative' }}
      onPointerLeave={(e) => {
        // Fast path only. The per-segment distance test is the guarantee.
        if (e.pointerType !== 'mouse') return;
        clearHover();
      }}
    >
      {/* ---------------------------------------------- LEFT DATA AREA */}
      <div style={{ width: leftWidth, flex: 'none' }}>
        <div
          style={{
            height: headerHeight,
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
        {items.map((it) => {
          const sel = it.id === selectedItemId;
          return (
            <div
              key={it.id}
              onClick={() => selectItem(it.id)}
              style={{
                height: rowHeight,
                paddingLeft: sel ? 8 : 11,
                paddingRight: 8,
                borderBottom: '1px solid var(--jpd-grid)',
                borderLeft: sel ? '3px solid var(--jpd-row-bar)' : 'none',
                background: sel ? 'var(--jpd-row-tint)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
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
                  WebkitLineClamp: 2,
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
                {it.health !== 'healthy' && (
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
        })}
      </div>

      {/* ------------------------------------------------- TIMELINE AREA */}
      <div

        style={{
          width: viewportWidth,
          flex: 'none',
          overflowX: zoom === 'quarters' ? 'hidden' : 'auto',
          overflowY: 'hidden',
          overscrollBehaviorX: 'contain',
        }}
        onScroll={() => {
          if (!hovered) return;
          clearHover();
        }}
      >
        <div style={{ width: totalWidth, position: 'relative' }}>
          {/* period header */}
          <div
            style={{
              height: headerHeight,
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

          {/* vertical grid, full height of the row block */}
          <div style={{ position: 'relative' }}>
            {ticks.map((t) => (
              <span
                key={t.key}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: dayDiff(domainStart, t.start) * pxPerDay,
                  top: 0,
                  height: items.length * rowHeight,
                  borderLeft: '1px solid var(--jpd-grid)',
                }}
              />
            ))}

            {/* the representative data date, from fixture - never new Date() */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: todayX,
                top: 0,
                height: items.length * rowHeight,
                borderLeft: '1px dashed var(--jpd-today)',
              }}
            />

            {items.map((it) => {
              const sel = it.id === selectedItemId;
              return (
                <div
                  key={it.id}
                  data-gantt-row={it.id}
                  onClick={() => selectItem(it.id)}
                  style={{
                    height: rowHeight,
                    position: 'relative',
                    borderBottom: '1px solid var(--jpd-grid)',
                    background: sel ? 'var(--jpd-row-tint)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {/* NON-WORKING DAYS. Drawn inside the row, beneath its
                      marks and above its background, so the shading survives
                      the selected row's tint instead of being covered by it.
                      Rows are contiguous, so the bands read as one column
                      through the whole grid. Never in the data table on the
                      left: this is a statement about time, not about the
                      package. */}
                  {bands.map((b) => (
                    <span
                      key={b.key}
                      className="jpd-nonworking"
                      aria-hidden="true"
                      style={{ left: b.left, width: b.width }}
                    />
                  ))}
                  <ScheduleRowMarks
                    item={it}
                    x={x}
                    pxPerDay={pxPerDay}
                    rowHeight={rowHeight}
                    enabled={enabled}
                    anchor={anchor}
                    handlersFor={handlersFor}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <PhaseInspector anchor={anchor} />
    </div>
  );
}