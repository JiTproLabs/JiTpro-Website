/**
 * Step 03 comparison — the dates fit, but does the work? (Decision Log
 * 2026-11-06).
 *
 * One procurement item drawn twice on ONE calendar scale, both ending at ONE
 * Required On-Site date:
 *
 *   TYPICAL   an illustrative two-activity schedule (Buyout and Submittals,
 *             Fabrication and Delivery) at optimistic durations, run through
 *             the demo's own backward pass so it lands on the same field
 *             date by the same working-day calendar. Neutral, not inspectable.
 *   JITPRO    Heritage Steel Windows & Exterior Doors, read from
 *             SCHEDULE_ITEMS and drawn by ScheduleRowMarks, the code the full
 *             Procurement Schedule uses: every phase and milestone, commitment
 *             diamonds above the bar, the issue below it, inspected through
 *             the unchanged PhaseInspector.
 *
 * The comparison's whole argument is the difference in START dates, which
 * falls out of the durations; nothing is positioned by hand. No data-date
 * line: this is a planning view, not a status report, so completed work is
 * not dimmed here either (the full schedule keeps both).
 *
 * WIDTH. Fitted to the container, floored at 2.5px per calendar day (just
 * under the full schedule's Months band) so narrow screens scroll the
 * timeline sideways inside the step rather than crush it.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PhaseInspector from '../demo/screens/procurement-schedule/PhaseInspector';
import ScheduleRowMarks from '../demo/screens/procurement-schedule/ScheduleRowMarks';
import { useMarkInspection } from '../demo/screens/procurement-schedule/useMarkInspection';
import { SCHEDULE_ITEMS } from '../demo/screens/procurement-schedule/scheduleFixture';
import { buildItem, parse, type StepSpec } from '../demo/screens/procurement-schedule/scheduleModel';
import { InspectionContext } from '../demo/inspection';
import '../demo/tokens.css';
import '../demo/screens/procurement-schedule/scheduleTokens.css';

const ITEM_ID = 'itm-heritage';

/**
 * THE ILLUSTRATIVE TYPICAL SCHEDULE. Explicitly an assumption, not a record
 * or an industry average: procurement summarised as two activities with
 * optimistic durations (8 and 12 working weeks). It shares the real item's
 * name and Required On-Site date and nothing else.
 */
const TYPICAL_SPECS: StepSpec[] = [
  {
    id: 'typ-1', name: 'Buyout and Submittals', family: 'buyout', kind: 'phase', days: 40,
    org: 'gc', owner: 'AW', owed: 'Illustrative assumption.',
  },
  {
    id: 'typ-2', name: 'Fabrication and Delivery', family: 'production', kind: 'phase', days: 60,
    org: 'gc', owner: 'AW', owed: 'Illustrative assumption.',
  },
  {
    id: 'typ-3', name: 'Required On-Site', family: 'required', kind: 'milestone',
    org: 'gc', owner: 'MO', owed: 'Illustrative assumption.',
  },
];

const MIN_PX_PER_DAY = 2.5;
const ROW_H = 63; // the full schedule's authored row pitch
const MS = 86400000;
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS);

const fmt = (d: string) =>
  parse(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function BuildTheChainComparison() {
  const item = useMemo(() => SCHEDULE_ITEMS.find((i) => i.id === ITEM_ID)!, []);
  const typical = useMemo(
    () => buildItem('typ-heritage', item.name, item.category, item.requiredOnSiteDate, TYPICAL_SPECS),
    [item],
  );
  const typicalBars = typical.steps.filter((s) => s.kind === 'phase');

  /* ------------------------------------------------ the shared calendar */
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostW, setHostW] = useState(0);
  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => setHostW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Padded to whole months, as the full schedule's domain is.
  const { domainStart, months, days } = useMemo(() => {
    const ds = parse(item.startDate < typical.startDate ? item.startDate : typical.startDate);
    ds.setUTCDate(1);
    const de = parse(item.requiredOnSiteDate);
    de.setUTCMonth(de.getUTCMonth() + 1, 1);
    const ms: { key: string; start: Date; end: Date; label: string }[] = [];
    const c = new Date(ds);
    while (c < de) {
      const s = new Date(c);
      const e = new Date(c);
      e.setUTCMonth(e.getUTCMonth() + 1);
      const first = ms.length === 0 || s.getUTCMonth() === 0;
      ms.push({
        key: s.toISOString(),
        start: s,
        end: e,
        label: s.toLocaleDateString('en-US', {
          month: 'short',
          ...(first ? { year: 'numeric' } : {}),
          timeZone: 'UTC',
        }),
      });
      c.setUTCMonth(c.getUTCMonth() + 1);
    }
    return { domainStart: ds, months: ms, days: dayDiff(ds, de) };
  }, [item, typical]);

  const pxPerDay = Math.max(MIN_PX_PER_DAY, hostW / days || MIN_PX_PER_DAY);
  const trackW = days * pxPerDay;
  const x = useCallback((d: string) => dayDiff(domainStart, parse(d)) * pxPerDay, [domainStart, pxPerDay]);
  // Required On-Site is a finish milestone: it falls at the END of its date,
  // where the final activity's bar ends (Design System Section 51.14).
  const rosX = x(item.requiredOnSiteDate) + pxPerDay;

  /* ------------------------------------------------------ inspection */
  const enabled = true;
  const { anchor, dismiss, clearHover, clearPin, handlersFor } = useMarkInspection(enabled);
  // The popover mounts in a `.jpd` host on <body>, not inside the step panel:
  // each §46.11 panel is position:sticky and so its own stacking context, and
  // a card rendered inside Step 03 would paint beneath Step 04 as it rises.
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const host = document.createElement('div');
    host.className = 'jpd';
    document.body.appendChild(host);
    setPortalEl(host);
    return () => host.remove();
  }, []);
  const capabilities = useMemo(() => ({ enabled, portalTarget: portalEl }), [enabled, portalEl]);

  // The card is fixed to the window and placed from the mark's rect, so page
  // scroll would strand it. Hover and touch pins end on scroll; a keyboard
  // focus card is left alone because focusing a mark scrolls it into view.
  useEffect(() => {
    if (!anchor) return;
    const onScroll = () => {
      clearHover();
      clearPin();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [anchor, clearHover, clearPin]);

  // A resize re-lays every mark, so any open card is stale.
  useEffect(() => dismiss(), [pxPerDay, dismiss]);

  const labelCls = 'text-[0.8125rem] font-semibold text-jp-background sm:text-[0.875rem]';
  const metaCls = 'text-[0.75rem] leading-[1.35] text-jp-ink-secondary';

  return (
    <div className="mt-2 pb-8 sm:pb-10">
      <h4 className="font-heading text-[1.1875rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.25rem]">
        The dates fit. But does the work?
      </h4>
      <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem]">
        A schedule can look achievable when buyout, coordination, submittals, and approvals are compressed into a few activities. JiTpro plans each required step using realistic durations, then works backward to show when procurement must begin.
      </p>

      <InspectionContext.Provider value={capabilities}>
        <div className="jpd jpd-plan mt-8">
          <div
            ref={hostRef}
            className="overflow-x-auto overflow-y-hidden overscroll-x-contain"
            onScroll={() => clearHover()}
          >
            <div className="relative" style={{ width: trackW }}>
              {/* Month scale, shared by both schedules. */}
              <div aria-hidden="true" className="relative h-6 border-b border-[var(--jpd-grid-strong)]">
                {months.map((m) => (
                  <span
                    key={m.key}
                    className="absolute inset-y-0 flex items-center overflow-hidden whitespace-nowrap border-l border-[var(--jpd-grid)] pl-1.5 text-[0.6875rem] text-[var(--jpd-text-secondary)]"
                    style={{ left: dayDiff(domainStart, m.start) * pxPerDay, width: dayDiff(m.start, m.end) * pxPerDay }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* One Required On-Site, one right-hand target, through both rows. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 top-6 border-l border-dashed border-[var(--jpd-phase-required)] opacity-40"
                style={{ left: rosX }}
              />
              <div className="relative h-7">
                <span
                  className="absolute top-2 whitespace-nowrap text-[0.6875rem] font-semibold text-[var(--jpd-text-strong)]"
                  style={{ right: trackW - rosX + 6 }}
                >
                  Required On-Site {fmt(item.requiredOnSiteDate)}
                </span>
              </div>

              {/* ---------------------------------- the typical schedule */}
              <div className="sticky left-0 w-fit pr-4">
                <p className={labelCls}>Typical construction schedule</p>
              </div>
              <div className="relative mt-2 h-[4.5rem]">
                {typicalBars.map((s) => {
                  const left = x(s.startDate);
                  const w = Math.max(2, x(s.endDate) + pxPerDay - left);
                  return (
                    <div key={s.id} className="absolute top-0" style={{ left }}>
                      <p className="whitespace-nowrap text-[0.6875rem] font-semibold leading-[1.3] text-[var(--jpd-text-strong)]">
                        {s.name}
                      </p>
                      <p className="whitespace-nowrap text-[0.6875rem] leading-[1.3] text-[var(--jpd-text-secondary)]">
                        {s.durationWorkdays} working days
                      </p>
                      <span
                        aria-hidden="true"
                        className="mt-1.5 block h-[18px] rounded-[2px] bg-[var(--jpd-summary-bar)]"
                        style={{ width: w }}
                      />
                    </div>
                  );
                })}
                <p className={`absolute bottom-0 whitespace-nowrap ${metaCls}`} style={{ left: x(typical.startDate) }}>
                  Starts {fmt(typical.startDate)}
                </p>
              </div>

              {/* ----------------------------------- the JiTpro schedule */}
              <div className="sticky left-0 mt-6 w-fit pr-4">
                <p className={labelCls}>JiTpro procurement schedule</p>
              </div>
              <div data-gantt-row={item.id} className="relative" style={{ height: ROW_H }}>
                <ScheduleRowMarks
                  item={item}
                  x={x}
                  pxPerDay={pxPerDay}
                  rowHeight={ROW_H}
                  enabled={enabled}
                  anchor={anchor}
                  handlersFor={handlersFor}
                />
              </div>
              <div className="relative h-5">
                <p className={`absolute top-0 whitespace-nowrap ${metaCls}`} style={{ left: x(item.startDate) }}>
                  Starts {fmt(item.startDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Key: position carries the meaning, the marks are the real ones. */}
          <div aria-hidden="true" className={`mt-5 flex flex-wrap gap-x-6 gap-y-2 ${metaCls}`}>
            <span className="inline-flex items-center gap-2">
              <span className="jpd-commit jpd-commit--committed" style={{ position: 'static' }}>
                <span className="jpd-commit__mark" />
              </span>
              Above the bar: commitments owed by others
            </span>
            <span className="inline-flex items-center gap-2">
              <span className={`jpd-issue jpd-issue--${item.health}`} style={{ position: 'static' }}>
                <span className="jpd-issue__mark" />
              </span>
              Below the bar: issues
            </span>
          </div>

          <PhaseInspector anchor={anchor} />
        </div>
      </InspectionContext.Provider>

      <p className="mt-5 text-[0.9375rem] leading-[1.6] text-jp-ink-secondary">
        Explore the segments and diamonds to see the work and commitments behind the dates.
      </p>
      <p className="mt-2 max-w-[72ch] text-[0.8125rem] leading-[1.55] text-jp-ink-secondary">
        The typical schedule is an illustrative example, not a measured industry average. The JiTpro schedule uses representative demonstration data. Actual durations depend on the item, scope, project conditions, responsible parties, and available information.
      </p>
    </div>
  );
}
