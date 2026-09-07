import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PhaseInspector, {
  useEscapeToDismiss,
  targetId,
  useInspection,
  type Anchor,
  type InspectTarget,
} from './PhaseInspector';
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

const familyVar = (f: string) => `var(--jpd-phase-${f})`;

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
   * THREE SEPARATE STATES, NOT ONE.
   *
   * Hover is transient pointer state and must never behave like a selection.
   * Focus belongs to the keyboard. Pinning is an intentional touch action.
   * Collapsing them into a single `anchor` was the bug: a mouse hover wrote a
   * value nothing was responsible for clearing, so the card outlived the
   * gesture that created it.
   *
   * Priority: focused, then hovered, then pinned.
   */
  const [hovered, setHovered] = useState<Anchor | null>(null);
  const [focused, setFocused] = useState<Anchor | null>(null);
  const [pinned, setPinned] = useState<Anchor | null>(null);
  const anchor = focused ?? hovered ?? pinned;

  const hostRef = useRef<HTMLDivElement>(null);
  /** The element the hover bubble currently belongs to. */
  const activeElRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    activeElRef.current = null;
    setHovered(null);
    setFocused(null);
    setPinned(null);
  }, []);
  useEscapeToDismiss(!!anchor, dismiss);

  /**
   * THE HOVER BUBBLE BELONGS TO ONE SEGMENT, NOT TO ANY CONTAINER.
   *
   * The previous attempt tested the pointer against the whole Gantt's rect,
   * which is a ~943x786 safe zone - so the card survived blank timeline space,
   * other rows and most of the schedule. The boundary is now the ACTIVE
   * SEGMENT's own rect plus a 12px grace ring, and nothing larger.
   *
   * Each pointermove asks three questions, in cost order:
   *
   *   1. Is the pointer within 12px of the active target's LIVE rect?
   *      -> keep. This is anti-flicker tolerance and nothing more.
   *   2. Is it over some OTHER inspectable segment?
   *      -> keep; that segment's own enter handler re-targets the card. This
   *         is what keeps fast horizontal scrubbing continuous.
   *   3. Otherwise -> clear immediately.
   *
   * The rect is re-read from the live element rather than reused from the
   * stored anchor, so scrolling, zooming or a resize cannot leave a stale
   * boundary behind. `elementFromPoint` is consulted only when the cheap
   * distance test fails, and it reports what is under the cursor rather than
   * the card, because the card is `pointer-events: none`.
   *
   * Only mouse input is governed here. Touch has no hover to end.
   */
  const GRACE_PX = 12;

  useEffect(() => {
    if (!hovered) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;

      const el = activeElRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        if (Math.hypot(dx, dy) <= GRACE_PX) return;
      }

      const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (under && under.closest('button.jpd-step, button.jpd-commit, button.jpd-issue')) return;

      activeElRef.current = null;
      setHovered(null);
    };
    document.addEventListener('pointermove', onMove, true);
    return () => document.removeEventListener('pointermove', onMove, true);
  }, [hovered]);

  /**
   * A zoom-band change or a different selected item moves or replaces every
   * segment, so a hover measured against the old layout is stale by
   * definition.
   */
  useEffect(() => {
    activeElRef.current = null;
    setHovered(null);
  }, [zoom, selectedItemId]);

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
   * The segment hit area, tracking the fitted row pitch. 34px at the authored
   * 63px row; never so tall that the row loses its blank margin, never so
   * short that an 18px bar becomes hard to hit.
   */
  const hitH = Math.max(22, Math.min(34, rowHeight - 20));

  /**
   * THE RAISED BAND.
   *
   * External commitments sit ABOVE the bar rather than on it, because they are
   * not part of the procurement work - they are what the work is waiting for.
   * Height carries that distinction on its own: anything on the bar line is
   * the package's own sequence, anything raised above it is owed by someone
   * else. Colour and shape reinforce it; position is what makes it readable at
   * a glance across fifteen rows.
   *
   * Derived from the bar rather than fixed, so it tracks the fitted row pitch.
   * Floored so the marker cannot ride up into the row divider on a tight row.
   */
  const barTop = (rowHeight - 18) / 2;
  const commitCY = Math.max(7, barTop - 8);
  const COMMIT_HIT = 13;

  /**
   * ISSUES SIT BELOW THE BAR, COMMITMENTS ABOVE IT.
   *
   * The two raised bands mean different things and are separated by side so
   * they can be told apart without reading either one: above the bar is what
   * the package is WAITING FOR, below it is what has GONE WRONG. It also keeps
   * their hit areas from competing on a row that carries both.
   */
  const issueCY = Math.min(rowHeight - 7, rowHeight - commitCY);
  const ISSUE_HIT = 13;

  /**
   * The card is placed against the ROW, not the cursor, so the row rect is
   * captured alongside the segment. `rowId` lets the inspector hold its
   * position while the visitor scrubs along one procurement path.
   */
  const makeAnchor = (el: HTMLElement, target: InspectTarget, rowId: string): Anchor => {
    const row = el.closest('[data-gantt-row]') as HTMLElement | null;
    return {
      segRect: el.getBoundingClientRect(),
      rowRect: (row ?? el).getBoundingClientRect(),
      rowId,
      target,
    };
  };

  // Touch: a tap anywhere that is not a segment clears the pinned card.
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest('button.jpd-step, button.jpd-commit, button.jpd-issue')) setPinned(null);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [pinned]);

  /**
   * Changing the selected procurement item clears every transient state, so
   * phase detail from the previous item can never be left floating over the
   * newly selected one. An intentional pin is cleared too: it belonged to the
   * item the visitor just navigated away from.
   */
  const selectItem = useCallback(
    (id: string) => {
      activeElRef.current = null;
      setHovered(null);
      setPinned(null);
      setFocused(null);
      onSelectItem(id);
    },
    [onSelectItem],
  );

  return (
    <div
      ref={hostRef}
      className="flex"
      style={{ position: 'relative' }}
      onPointerLeave={(e) => {
        // Fast path only. The per-segment distance test is the guarantee.
        if (e.pointerType !== 'mouse') return;
        activeElRef.current = null;
        setHovered(null);
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
          activeElRef.current = null;
          setHovered(null);
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
                  {it.steps.map((s) => {
                    const isMilestone = s.kind === 'milestone';
                    const isRos = s.family === 'required';
                    const left = x(s.startDate);
                    const w = Math.max(2, x(s.endDate) + pxPerDay - left);

                    // Hit area can exceed the visible mark so narrow segments
                    // stay targetable; the visible geometry is never inflated.
                    const hitW = isMilestone ? 14 : Math.max(w, 8);
                    const hitLeft = isMilestone ? left - 7 : left;

                    const isActive = anchor != null && targetId(anchor.target) === s.id;
                    const common = {
                      className:
                        `jpd-step${enabled ? ' jpd-step--interactive' : ''}` +
                        (s.status === 'complete' ? ' jpd-step--complete' : '') +
                        (isActive ? ' jpd-step--active' : ''),
                      /**
                       * THE HIT AREA IS THE BAR, NOT THE ROW.
                       *
                       * These were `top: 0; bottom: 0`, so every segment's
                       * target was a full-height column spanning the 63px row.
                       * Anywhere in the row band therefore counted as "over a
                       * segment", which is what kept the hover bubble alive no
                       * matter which container-level dismissal was tried.
                       *
                       * The target is the 18px bar plus vertical padding:
                       * comfortably clickable, while leaving real blank space
                       * above and below that reads as blank.
                       *
                       * It is derived from `rowHeight` rather than fixed at
                       * 34, because the row pitch is fitted to the canvas and
                       * a constant would eat the whole row once the rows
                       * compress - the blank margin that makes a row feel like
                       * a row would vanish first, and the hit areas of stacked
                       * rows would end up touching. Centred either way, so the
                       * bar, the diamond and the Required On-Site cap (all
                       * `top: 50%` inside this button) stay aligned with it at
                       * every pitch.
                       */
                      style: {
                        left: hitLeft,
                        width: hitW,
                        top: '50%',
                        height: hitH,
                        transform: 'translateY(-50%)',
                      } as const,
                      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
                        if (!enabled || e.pointerType !== 'mouse') return;
                        const el = e.currentTarget as HTMLElement;
                        activeElRef.current = el;
                        setHovered(makeAnchor(el, { kind: 'step', step: s }, it.id));
                      },
                      // Touch and pen pin intentionally; a mouse click never
                      // creates persistent state, so it cannot go stale.
                      onPointerUp: (e: React.PointerEvent<HTMLElement>) => {
                        if (!enabled || e.pointerType === 'mouse') return;
                        e.stopPropagation();
                        setPinned(makeAnchor(e.currentTarget as HTMLElement, { kind: 'step', step: s }, it.id));
                      },
                      onFocus: (e: React.FocusEvent<HTMLElement>) => {
                        if (!enabled) return;
                        setFocused(makeAnchor(e.currentTarget as HTMLElement, { kind: 'step', step: s }, it.id));
                      },
                      onBlur: () => setFocused(null),
                      onClick: (e: React.MouseEvent<HTMLElement>) => e.stopPropagation(),
                    };

                    if (isRos) {
                      return (
                        <button
                          key={s.id}
                          type="button"
                          {...common}
                          tabIndex={enabled ? 0 : -1}
                          aria-label={`${it.name}: Required On-Site ${s.startDate}`}
                        >
                          <span className="jpd-ros" style={{ left: 7 }} />
                          <span className="jpd-ros__cap" style={{ left: 8 }} />
                        </button>
                      );
                    }

                    return (
                      <button
                        key={s.id}
                        type="button"
                        {...common}
                        tabIndex={enabled ? 0 : -1}
                        aria-label={`${it.name}: ${s.name}`}
                      >
                        {isMilestone ? (
                          <span
                            className="jpd-step__diamond"
                            style={{ left: 7, background: familyVar(s.family) }}
                          />
                        ) : (
                          <span
                            className="jpd-step__bar"
                            style={{ left: 0, width: w, background: familyVar(s.family) }}
                          />
                        )}
                      </button>
                    );
                  })}

                  {/* ------------------------------ EXTERNAL COMMITMENTS
                      Drawn after the steps so a commitment sitting over the
                      top edge of a bar's hit area wins the pointer: where the
                      two overlap, the raised marker is the more specific
                      target. Positioned from `requiredBy` through the same
                      `x()` the bars use, so it cannot drift from its date
                      under horizontal scroll or a zoom-band change. */}
                  {it.commitments.map((c) => {
                    const cx = x(c.requiredBy) + pxPerDay / 2;
                    const isActive =
                      anchor != null && targetId(anchor.target) === c.id;
                    const target: InspectTarget = { kind: 'commitment', commitment: c };
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={
                          `jpd-commit jpd-commit--${c.status}` +
                          (enabled ? ' jpd-commit--interactive' : '') +
                          (isActive ? ' jpd-commit--active' : '')
                        }
                        tabIndex={enabled ? 0 : -1}
                        aria-label={`${it.name}: ${c.name} required by ${c.requiredBy}, owned by ${c.ownerRole}`}
                        style={{
                          left: cx - COMMIT_HIT / 2,
                          width: COMMIT_HIT,
                          top: commitCY - COMMIT_HIT / 2,
                          height: COMMIT_HIT,
                        }}
                        onPointerEnter={(e) => {
                          if (!enabled || e.pointerType !== 'mouse') return;
                          const el = e.currentTarget as HTMLElement;
                          activeElRef.current = el;
                          setHovered(makeAnchor(el, target, it.id));
                        }}
                        onPointerUp={(e) => {
                          if (!enabled || e.pointerType === 'mouse') return;
                          e.stopPropagation();
                          setPinned(makeAnchor(e.currentTarget as HTMLElement, target, it.id));
                        }}
                        onFocus={(e) => {
                          if (!enabled) return;
                          setFocused(makeAnchor(e.currentTarget as HTMLElement, target, it.id));
                        }}
                        onBlur={() => setFocused(null)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="jpd-commit__mark" />
                      </button>
                    );
                  })}

                  {/* ------------------------------------ ISSUES / RISKS
                      Placed at the date the project LEARNED of the problem,
                      which is what makes the early-warning story legible: the
                      marker sits months to the left of the work it threatens.
                      Same x() as everything else, so it cannot drift under
                      scroll or a zoom change. */}
                  {it.issues.map((is) => {
                    const ix = x(is.identifiedOn) + pxPerDay / 2;
                    const isActive =
                      anchor != null && targetId(anchor.target) === is.id;
                    const target: InspectTarget = {
                      kind: 'issue',
                      issue: is,
                      item: it,
                    };
                    return (
                      <button
                        key={is.id}
                        type="button"
                        className={
                          `jpd-issue jpd-issue--${it.health}` +
                          (enabled ? ' jpd-issue--interactive' : '') +
                          (isActive ? ' jpd-issue--active' : '')
                        }
                        tabIndex={enabled ? 0 : -1}
                        aria-label={`${it.name}: ${is.title}, identified ${is.identifiedOn}, package ${it.health}`}
                        style={{
                          left: ix - ISSUE_HIT / 2,
                          width: ISSUE_HIT,
                          top: issueCY - ISSUE_HIT / 2,
                          height: ISSUE_HIT,
                        }}
                        onPointerEnter={(e) => {
                          if (!enabled || e.pointerType !== 'mouse') return;
                          const el = e.currentTarget as HTMLElement;
                          activeElRef.current = el;
                          setHovered(makeAnchor(el, target, it.id));
                        }}
                        onPointerUp={(e) => {
                          if (!enabled || e.pointerType === 'mouse') return;
                          e.stopPropagation();
                          setPinned(makeAnchor(e.currentTarget as HTMLElement, target, it.id));
                        }}
                        onFocus={(e) => {
                          if (!enabled) return;
                          setFocused(makeAnchor(e.currentTarget as HTMLElement, target, it.id));
                        }}
                        onBlur={() => setFocused(null)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="jpd-issue__mark" />
                      </button>
                    );
                  })}
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
