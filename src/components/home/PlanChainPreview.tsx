import { useId, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { CHAIN, formatDate } from '../demo/screens/procurement-chain/chainLayout';
import ChainText from '../demo/screens/procurement-chain/ChainText';
import { FAMILY_ICON, FAMILY_LEGEND, diamond, gradientBottom, tokenFor, v } from '../demo/screens/procurement-chain/chainVocabulary';
import { useChainMeasure } from '../demo/screens/procurement-chain/useChainMeasure';
import { buildTicks } from '../demo/screens/procurement-schedule/ganttTicks';
import { GanttItemCell, GanttItemHeader, GanttPeriodHeader } from '../demo/screens/procurement-schedule/GanttParts';
import { LegendChip, ScheduleHeader, ScheduleToolbar } from '../demo/screens/procurement-schedule/ScheduleScreenChrome';
import { parse, type PhaseFamily } from '../demo/screens/procurement-schedule/scheduleModel';
import JiTproShell from '../demo/shell/JiTproShell';
import {
  APP,
  FOCAL_ROW,
  LIST_ITEM,
  LIST_TOTAL,
  ROW_ITEMS,
  buildPlanScene,
  HEADER,
  calendarGrid,
  listCrossingFade,
  listItemAt,
  listLayout,
  planStateAt,
  revealAt,
  transformOf,
  type Frame,
  type PlanRow,
  type PlanScene,
  type PlanState,
} from './planChainScene';
import { CONNECT_TIMING, buildConnectScene, connectFrame, connectStateAt, type ConnectState } from './connectChainScene';
import '../demo/tokens.css';
import '../demo/screens/procurement-schedule/scheduleTokens.css';
import '../demo/screens/procurement-chain/chainTokens.css';

/**
 * The Plan tab's visual: one procurement chain built backward from its
 * Required On Site date, then revealed as one row of the project's
 * procurement schedule (Design System Section 54.4.2).
 *
 * THE APPLICATION (refined 2026-11-10). The schedule resolves into the JiTpro
 * Schedule module: the same application shell the Procurement Register uses
 * (`JiTproShell`, Schedule lit), the Schedule screen's own page header,
 * toolbar, item column, period header and legend chips (shared with
 * `ProcurementScheduleScreen`), with these chains in its timeline. The screen
 * fades in as the camera pulls back to it.
 *
 * THE STEP LIST (refined 2026-11-10). Six consolidated steps, in backward
 * order, beside the chain: each appears as its part of the chain starts to
 * build, and the step being built carries the register's selected-row tint
 * and amber bar. On the pull-back the same six entries shrink and travel, on
 * one continuous path each, into two columns in the free area beside the
 * frame (or, without one, into the room left of the application window).
 * One state drives it all.
 *
 * Drawn in the procurement chain's own language (Section 51): its layout
 * engine, tokens, gradients, icons, milestone diamonds and type. It is an
 * illustration, not the interactive figure: no inspection, no controls, and
 * the visual column is aria-hidden (Section 46.12).
 *
 * ONE CLOCK (§46.3, §51.12). Everything that moves is read each frame from
 * `planStateAt(scene, frame, t)`; this component only applies it: the canvas
 * transform, the planning edge's clip, and opacities. Not played: parked on
 * the opening frame. Played: one pass, then rest. Reduced motion: the
 * resting state at once (§46.5).
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** The dependency summary's rise as it fades in, px (the step list's, Section 54.4.2). */
const SUMMARY_RISE = 6;
/** The opening panel's rise as it fades in, px (Section 54.4.2). */
const LEAD_RISE = 8;

type Aside = {
  /** An unclipped layer the size of the frame's inner box, beside it. */
  host: HTMLElement | null;
  /** Free room outside the frame, in the frame's coordinates (§54.4.2). */
  region: { x: number; y: number; w: number; h: number } | null;
};

export default function PlanChainPreview({
  played,
  aside,
  variant = 'plan',
  categoriesRef,
}: {
  played: boolean;
  aside?: Aside;
  /**
   * Connect only: the copy's dependency summary (Section 54.2.2), a list whose
   * items this visual reveals from its one clock as the animation comes to
   * rest. The list belongs to the copy; only its reveal is driven from here.
   */
  categoriesRef?: RefObject<HTMLElement | null>;
  /** Plan (Section 54.4.2), or Connect (Section 54.4.3): the same scene, a second timeline. */
  variant?: 'plan' | 'connect';
}) {
  const region = aside?.region ?? null;
  const host = aside?.host ?? null;
  const uid = useId().replace(/:/g, '');
  const measure = useChainMeasure();
  const scene = useMemo(() => buildPlanScene(measure), [measure]);
  const connect = useMemo(() => (variant === 'connect' ? buildConnectScene(scene, measure) : null), [variant, scene, measure]);
  const endAt = connect ? connect.times.end : scene.times.end;
  const commitRefs = useRef<{ leader: SVGLineElement | null; mark: SVGPathElement | null; card: SVGGElement | null }[]>([]);

  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const othersRef = useRef<SVGGElement>(null);
  const rosRuleRef = useRef<SVGGElement>(null);
  const rosMarkRef = useRef<SVGGElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLinesInRef = useRef<SVGGElement>(null);
  const headerLinesOutRef = useRef<SVGGElement>(null);
  const headerTiersRef = useRef<{ months: HTMLDivElement | null; weeks: HTMLDivElement | null; years: HTMLDivElement | null; monthsShort: HTMLDivElement | null }>({
    months: null,
    weeks: null,
    years: null,
    monthsShort: null,
  });
  const gridDayRef = useRef<SVGGElement>(null);
  const gridWeekRef = useRef<SVGGElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const leadBgRef = useRef<HTMLDivElement>(null);
  const leadRuleRef = useRef<HTMLSpanElement>(null);
  const leadTextRef = useRef<HTMLParagraphElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);

  /* When this pass began; survives a scene rebuild (fonts arriving) mid-pass. */
  const startedAt = useRef<number | null>(null);

  useLayoutEffect(() => {
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    if (!frameEl || !canvas) return;
    const stateAt = (fr: Frame, at: number): PlanState => (connect ? connectStateAt(scene, connect, fr, at) : planStateAt(scene, fr, at));
    const reveals = [...canvas.querySelectorAll<SVGElement>('[data-reveal-x]')].map((el) => ({
      el,
      x: Number(el.dataset.revealX),
    }));
    const longLabels = [...canvas.querySelectorAll<SVGGElement>('[data-long-label]')].map((el) => ({
      el,
      id: el.dataset.longLabel!,
    }));
    let frame: Frame = { w: frameEl.clientWidth, h: frameEl.clientHeight, aside: region };

    const apply = (s: PlanState) => {
      canvas.style.transform = transformOf(s.view, frame);
      clipRef.current?.setAttribute('x', String(s.edgeX));
      for (const r of reveals) r.el.style.opacity = String(revealAt(r.x, s.edgeX));
      // A long bar's label, in the part of the bar in view.
      for (const l of longLabels) l.el.setAttribute('transform', `translate(${s.labelShift[l.id] ?? 0} 0)`);
      if (othersRef.current) othersRef.current.style.opacity = String(s.others);
      for (const g of [rosRuleRef.current, rosMarkRef.current]) if (g) g.style.opacity = String(s.ros);
      if (summaryRef.current) summaryRef.current.style.opacity = String(s.summary);
      // The timescale header: pinned to the chart's top, placed through the camera.
      const h = s.header;
      if (headerRef.current) {
        Object.assign(headerRef.current.style, {
          transform: `translate(${h.box.x}px, ${h.box.y}px)`,
          width: `${h.box.w}px`,
          opacity: String(h.opacity),
          visibility: h.opacity > 0 ? 'visible' : 'hidden',
        });
        const lines = `translate(${h.a - h.box.x} 0) scale(${h.b} 1)`;
        headerLinesInRef.current?.setAttribute('transform', lines);
        headerLinesOutRef.current?.setAttribute('transform', lines);
        headerLinesInRef.current?.style.setProperty('opacity', String(h.zoomIn));
        headerLinesOutRef.current?.style.setProperty('opacity', String(1 - h.zoomIn));
        const tiers = headerTiersRef.current;
        const place = (el: HTMLDivElement | null, labels: { x: number; text: string; show: boolean }[], opacity: number) => {
          if (!el) return;
          el.style.opacity = String(opacity);
          labels.forEach((l, i) => {
            const span = el.children[i] as HTMLElement | undefined;
            if (!span) return;
            span.style.transform = `translateX(${l.x - h.box.x}px)`;
            span.style.visibility = l.show ? 'visible' : 'hidden';
            if (span.textContent !== l.text) span.textContent = l.text;
          });
        };
        place(tiers.months, h.months, h.zoomIn);
        place(tiers.years, h.years, 1 - h.zoomIn);
        place(tiers.monthsShort, h.monthsShort, 1 - h.zoomIn);
        if (tiers.weeks) {
          tiers.weeks.style.opacity = String(h.zoomIn * h.weekLabels);
          h.weeks.forEach((x, i) => {
            const span = tiers.weeks!.children[i] as HTMLElement | undefined;
            if (span) span.style.transform = `translateX(${x - h.box.x + 4}px)`;
          });
        }
      }
      if (gridDayRef.current) gridDayRef.current.style.opacity = String(s.grid.day);
      if (gridWeekRef.current) gridWeekRef.current.style.opacity = String(s.grid.week);
      if (appRef.current) {
        appRef.current.style.opacity = String(s.app);
        // Nothing to paint while it is invisible.
        appRef.current.style.visibility = s.app > 0 ? 'visible' : 'hidden';
      }

      const lay = listLayout(connect ? connectFrame(frame) : frame);
      // Connect: each dependency's diamond, connector and card (Section 54.4.3).
      if (connect) {
        (s as ConnectState).cards.forEach((c, i) => {
          const r = commitRefs.current[i];
          const card = connect.cards[i];
          if (!r) return;
          if (r.leader) {
            r.leader.style.strokeDashoffset = String(1 - c.leader);
            r.leader.style.opacity = c.leader > 0 ? '1' : '0';
          }
          if (r.mark) {
            r.mark.style.opacity = String(c.mark);
            r.mark.setAttribute('transform', `translate(${card.markX} ${card.markY}) scale(${0.4 + 0.6 * c.mark}) translate(${-card.markX} ${-card.markY})`);
          }
          if (r.card) {
            r.card.style.opacity = String(c.card);
            r.card.setAttribute('transform', `translate(0 ${(1 - c.card) * CONNECT_TIMING.CARD_RISE})`);
          }
        });
        // The copy's dependency summary, revealed as the camera comes to rest.
        const items = categoriesRef?.current?.children;
        (s as ConnectState).categories.forEach((o, i) => {
          const el = items?.[i] as HTMLElement | undefined;
          if (!el) return;
          el.style.opacity = String(o);
          el.style.transform = o < 1 ? `translateY(${(1 - o) * SUMMARY_RISE}px)` : '';
        });
      }
      // The application window, on the frame's own ground.
      const win = windowRef.current;
      if (win) {
        Object.assign(win.style, {
          // Only when the window shares the frame with the list.
          opacity: String(lay.mode === 'stacked' ? s.app : 0),
          transform: `translate(${lay.window.x}px, ${lay.window.y}px)`,
          width: `${APP.w * lay.window.s}px`,
          height: `${APP.h * lay.window.s}px`,
        });
      }
      // The build panel, which gives way as the list moves.
      const panel = panelRef.current;
      if (panel) {
        Object.assign(panel.style, {
          opacity: String(1 - s.list.morph),
          transform: `translate(${lay.panel.x}px, ${lay.panel.y}px)`,
          width: `${lay.panel.w}px`,
          height: `${lay.panel.h}px`,
          borderRight: lay.mode === 'side' ? '1px solid var(--jpd-border-subtle)' : 'none',
          borderTop: lay.mode === 'stacked' ? '1px solid var(--jpd-border-subtle)' : 'none',
        });
      }
      // The same six entries, travelling from the panel to their final place.
      const placed = connect ? [] : scene.list.map((_, i) => listItemAt(lay, i, s.list.morph));
      // Where the columns cross on the way out, the second fades back.
      const fade = listCrossingFade(lay, s.list.morph);
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = placed[i];
        const x = p.x;
        const y = p.y + (1 - s.list.appear[i]) * 6;
        const k = p.s;
        // With nowhere to rest outside the frame, the entries fade with the rail.
        el.style.opacity = String(s.list.appear[i] * fade[i] * (lay.mode === 'side' ? (s.list.rail ?? 1) : 1));
        el.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
        const hl = el.firstElementChild as HTMLElement | null;
        if (hl) hl.style.opacity = String(s.list.active[i]);
      });
      // The rail's heading and total: on the rail only, and gone as the schedule is revealed.
      const onRail = lay.mode === 'aside' || lay.mode === 'side';
      const rail = s.list.rail ?? 1;
      const first = lay.start[0];
      const last = lay.start[lay.start.length - 1];
      if (titleRef.current && first) {
        titleRef.current.style.opacity = String(onRail ? (s.list.title ?? 0) * rail : 0);
        titleRef.current.style.transform = `translate(${first.x}px, 14px) scale(${first.s})`;
      }
      if (totalRef.current && last) {
        const o = onRail ? (s.list.total ?? 0) * rail : 0;
        totalRef.current.style.opacity = String(o);
        totalRef.current.style.transform = `translate(${last.x}px, ${last.y + (LIST_ITEM.h + LIST_TOTAL.gap) * last.s + (1 - (s.list.total ?? 0)) * 6}px) scale(${last.s})`;
      }
      // The rail's opening state: the rail's own box, in navy, with its rule and statement.
      if (leadRef.current) {
        const bg = s.list.leadBg ?? 0;
        const rule = s.list.leadRule ?? 0;
        const text = s.list.lead ?? 0;
        Object.assign(leadRef.current.style, {
          visibility: bg > 0 || rule > 0 || text > 0 ? 'visible' : 'hidden',
          transform: `translate(${lay.panel.x}px, ${lay.panel.y}px)`,
          width: `${lay.panel.w}px`,
          height: `${lay.panel.h}px`,
        });
        if (leadBgRef.current) leadBgRef.current.style.opacity = String(bg);
        if (leadRuleRef.current) {
          leadRuleRef.current.style.opacity = String(rule);
          // Drawn out from its left end as it appears.
          leadRuleRef.current.style.transform = `scaleX(${0.4 + 0.6 * (s.list.leadRuleIn ?? 1)})`;
        }
        if (leadTextRef.current) {
          leadTextRef.current.style.opacity = String(text);
          // A small rise on the way in only; it leaves by fading, without moving.
          leadTextRef.current.style.transform = `translateY(${(1 - (s.list.leadIn ?? 1)) * LEAD_RISE}px)`;
        }
      }
      // The field's requirement, stated at the chart's top left, clear of the milestone's rule.
      if (cardRef.current) {
        const o = s.list.card ?? 0;
        Object.assign(cardRef.current.style, {
          opacity: String(o),
          visibility: o > 0 ? 'visible' : 'hidden',
          left: `${lay.area.x + 14}px`,
          top: `${lay.area.y + HEADER.h + 12}px`,
          maxWidth: `${lay.area.w - 28}px`,
        });
      }
      // The summary row sits under the chain's own area.
      if (summaryRef.current) {
        Object.assign(summaryRef.current.style, {
          left: `${lay.area.x}px`,
          width: `${lay.area.w}px`,
          bottom: `${frame.h - (lay.area.y + lay.area.h)}px`,
        });
      }
    };

    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    let raf = 0;
    let t = 0;
    if (!played) {
      startedAt.current = null;
      t = 0;
    } else if (reduced) {
      t = endAt;
    } else {
      startedAt.current ??= performance.now();
      const tick = () => {
        t = Math.min(endAt, performance.now() - startedAt.current!);
        apply(stateAt(frame, t));
        if (t < endAt) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    apply(stateAt(frame, played && !reduced ? Math.min(endAt, performance.now() - startedAt.current!) : t));

    /* A resize re-frames the same moment: every view is computed from the frame. */
    const ro = new ResizeObserver(() => {
      frame = { w: frameEl.clientWidth, h: frameEl.clientHeight, aside: region };
      apply(stateAt(frame, t));
    });
    ro.observe(frameEl);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [played, scene, connect, endAt, region, host, categoriesRef]);

  const { others, place: P } = scene;
  /* Connect draws the same chain with its commitments, its bar where Plan's is. */
  const focal = connect ? connect.focal : scene.focal;
  const L = focal.layout;
  const families = [...new Set([focal, ...others].flatMap((r) => r.layout.segments.map((s) => s.family)))];
  /* The calendar grid's paths, from the top of the scene down to the focal axis. */
  const grid = useMemo(() => {
    const g = calendarGrid(scene.focal.layout);
    // From the top of the scene down through the whole chart beneath the
    // chain; the timescale header covers the lines' top.
    const y2 = scene.focal.dy + scene.focal.layout.height + 2000;
    const lines = (xs: number[]) => xs.map((x) => `M${x} 0V${y2}`).join('');
    return {
      days: lines(g.days),
      weeks: lines(g.weeks),
      nonWorking: g.nonWorking.map((r) => `M${r.x} 0h${r.w}V${y2}h${-r.w}Z`).join(''),
    };
  }, [scene.focal]);
  /* The header's lines, in chain x; the camera's map is applied as a transform. */
  const headerPaths = useMemo(() => {
    const ts = scene.timescale;
    const full = (xs: number[]) => xs.map((x) => `M${x} 0V${HEADER.h}`).join('');
    const lower = (xs: number[]) => xs.map((x) => `M${x} ${HEADER.top}V${HEADER.h}`).join('');
    return {
      monthsFull: full(ts.months.map((p) => p.x0)),
      weekTicks: lower(ts.weeks.map((w) => w.x)),
      yearsFull: full(ts.years.map((p) => p.x0)),
      monthTicks: lower(ts.monthsShort.map((p) => p.x0)),
    };
  }, [scene]);

  /* The six entries, each placed by the state every frame. */
  const stepList = (
    <>
      {scene.list.map((e, i) => (
        <div
          key={e.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="pointer-events-none absolute top-0 left-0 origin-top-left"
          style={{ width: LIST_ITEM.w, height: LIST_ITEM.h, opacity: 0, fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
        >
          {/* The step being built: the register's selected-row treatment. */}
          <span className="absolute inset-0 rounded-[4px]" style={{ opacity: 0, background: v('--jpd-row-tint') }}>
            <span className="absolute inset-y-0 left-0 w-[3px] rounded-l-[4px]" style={{ background: v('--jpd-row-bar') }} />
          </span>
          <div className="relative flex items-start gap-2 pt-[3px] pr-1.5 pl-2.5">
            {e.workdays === null ? (
              <span className="mt-[4px] ml-px size-[9px] shrink-0 rotate-45 rounded-[1px]" style={{ background: v('--jpd-chain-ros') }} />
            ) : (
              <span className="mt-[3px] size-[11px] shrink-0 rounded-[2px]" style={{ background: v(tokenFor(e.family)) }} />
            )}
            <div className="min-w-0">
              <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: '16px', color: v('--jpd-text-strong') }}>
                {e.label}
              </div>
              <div className="truncate" style={{ fontSize: 11, lineHeight: '14px', color: v('--jpd-text-secondary') }}>
                {e.workdays === null ? `Milestone · ${shortDate(e.date!)}` : `${e.workdays} working days`}
              </div>
            </div>
          </div>
          {/* Its working days, to the longest group's scale: the weight of the work. */}
          {e.workdays !== null && (
            <span
              className="absolute bottom-0 left-[29px] h-[2.5px] rounded-full"
              style={{ width: Math.max(4, e.weight * (LIST_ITEM.w - 37)), background: v(tokenFor(e.family)) }}
            />
          )}
        </div>
      ))}
      {/* The rail's heading: the item whose plan this is. */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-0 left-0 origin-top-left"
        style={{ width: LIST_ITEM.w, opacity: 0, fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
      >
        <div style={{ paddingLeft: 10, paddingRight: 4, fontSize: 13.5, fontWeight: 700, lineHeight: '17px', letterSpacing: '-0.01em', color: v('--jpd-text-strong') }}>
          {scene.itemTitle}
        </div>
      </div>
      {/* The total beneath the list. */}
      <div
        ref={totalRef}
        className="pointer-events-none absolute top-0 left-0 origin-top-left"
        style={{ width: LIST_ITEM.w, height: LIST_TOTAL.h, opacity: 0, fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{ marginLeft: 10, marginRight: 6, paddingTop: 5, borderTop: `1px solid ${v('--jpd-border')}`, fontSize: 11, lineHeight: '13px', color: v('--jpd-text-secondary') }}
        >
          <span>Total</span>
          <span style={{ fontWeight: 700, color: v('--jpd-text-strong') }}>{`${scene.totalWorkdays} working days`}</span>
        </div>
      </div>

    </>
  );

  return (
    <div ref={frameRef} className="jpd relative h-full overflow-hidden" style={{ background: v('--jpd-surface') }}>
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: APP.w, height: APP.h }}
      >
        {/* The application screen, beneath the chains; it fades in on the pull-back. */}
        <div ref={appRef} className="absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>
          <PlanScheduleScreen scene={scene} />
        </div>

        {/* The chains, placed into the screen's timeline. */}
        <svg width={APP.w} height={APP.h} className="absolute inset-0" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            {families.map((f) => (
              <linearGradient key={f} id={`${uid}-g-${f}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: v(tokenFor(f)) }} />
                <stop offset="1" style={{ stopColor: gradientBottom(f) }} />
              </linearGradient>
            ))}
            <filter id={`${uid}-shadow`} x="-5%" y="-30%" width="110%" height="170%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" style={{ floodColor: v('--jpd-chain-shadow') }} />
            </filter>
            {/* The planning edge: the focal chain shows to its right. */}
            <clipPath id={`${uid}-edge`}>
              <rect ref={clipRef} x={0} y={0} width={scene.width} height={scene.height} />
            </clipPath>
          </defs>

          <g transform={`translate(${P.ox} ${P.oy}) scale(${P.k})`}>
          {/* The calendar grid, behind everything (§54.4.2): days and their
              non-working shading, then weeks. Not clipped by the edge. */}
          <g ref={gridDayRef} style={{ opacity: 0 }}>
            <path d={grid.nonWorking} style={{ fill: v('--jpd-chain-nonworking') }} />
            <path d={grid.days} style={{ fill: 'none', stroke: v('--jpd-chain-grid-day'), strokeWidth: 1.25 }} />
          </g>
          <g ref={gridWeekRef} style={{ opacity: 0 }}>
            <path d={grid.weeks} style={{ fill: 'none', stroke: v('--jpd-chain-grid-week'), strokeWidth: 1.25 }} />
          </g>

          {/* The project's other procurement items: bars and milestones only. */}
          <g ref={othersRef} style={{ opacity: 0 }}>
            {others.map((row) => (
              <Row key={row.item.id} row={row} uid={uid} />
            ))}
          </g>

          {/* THE FOCAL CHAIN */}
          <g transform={`translate(0 ${focal.dy})`}>
            {/* Required On Site's date rule, behind everything */}
            <g ref={rosRuleRef} style={{ opacity: 0 }}>
              {L.ros && (
                <line x1={L.ros.x} x2={L.ros.x} y1={L.ros.ruleTop} y2={L.ros.ruleBottom} style={{ stroke: v('--jpd-chain-rule'), strokeWidth: 1.5, strokeDasharray: '6 6' }} />
              )}
            </g>

            {/* Connect: the commitments' connectors and cards, above the chain
                (Section 51.10's design, on-plan colours only, Section 54.4.3). */}
            {connect?.cards.map((c, i) => (
              <g key={`commit-${c.id}`}>
                <line
                  ref={(el) => {
                    commitRefs.current[i] = { ...commitRefs.current[i], leader: el };
                  }}
                  x1={c.leader.x2}
                  y1={c.leader.y2}
                  x2={c.leader.x1}
                  y2={c.leader.y1}
                  pathLength={1}
                  style={{ stroke: v('--jpd-chain-commitment'), strokeWidth: 1.5, strokeDasharray: '1 1', strokeDashoffset: 1, opacity: 0 }}
                />
                <g
                  ref={(el) => {
                    commitRefs.current[i] = { ...commitRefs.current[i], card: el };
                  }}
                  style={{ opacity: 0 }}
                >
                  <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={10} style={{ fill: v('--jpd-chain-commitment-fill'), stroke: v('--jpd-chain-commitment'), strokeWidth: 1.5 }} />
                  <ChainText block={c.text} />
                </g>
              </g>
            ))}

            {/* milestone stems, revealed with their milestone */}
            {L.labels.map(
              (l) =>
                l.stem && (
                  <line
                    key={`stem-${l.key}`}
                    data-reveal-x={l.stem.x}
                    x1={l.stem.x}
                    x2={l.stem.x}
                    y1={l.stem.y1}
                    y2={l.stem.y2}
                    style={{ stroke: v('--jpd-chain-milestone'), strokeWidth: 1, opacity: 0 }}
                  />
                ),
            )}

            {/* the bar, revealed from its right end by the planning edge */}
            <g clipPath={`url(#${uid}-edge)`}>
              <g style={{ filter: `url(#${uid}-shadow)` }}>
                {L.segments.map((s) => (
                  <path key={s.step.id} d={s.path} style={{ fill: `url(#${uid}-g-${s.family})` }} />
                ))}
              </g>
            </g>

            {/* each activity's icon and name, once the edge clears its start */}
            {L.segments.map((s) => {
              const Icon = FAMILY_ICON[s.family as PhaseFamily];
              return (
                <g key={`content-${s.step.id}`} data-reveal-x={s.x0} style={{ opacity: 0 }}>
                  <g data-long-label={scene.longLabels.some((l) => l.id === s.step.id) ? s.step.id : undefined}>
                  {s.icon && Icon && (
                    <Icon
                      x={s.icon.x}
                      y={s.icon.y}
                      width={CHAIN.ICON}
                      height={CHAIN.ICON}
                      strokeWidth={2.25}
                      color="currentColor"
                      aria-hidden="true"
                      style={{ color: v('--jpd-chain-on-fill') }}
                    />
                  )}
                  {s.inner && <ChainText block={s.inner} fill={v('--jpd-chain-on-fill')} />}
                  </g>
                </g>
              );
            })}

            {/* durations and milestone labels below the bar */}
            {L.labels.map((l) => {
              const seg = L.segments.find((s) => `dur-${s.step.id}` === l.key);
              return (
                <g key={l.key} data-reveal-x={seg ? seg.x0 : l.text.x} style={{ opacity: 0 }}>
                  <ChainText block={l.text} halo />
                </g>
              );
            })}

            {/* milestones; Required On Site with the anchor */}
            {L.milestones.map((m) =>
              m.isRos ? null : (
                <path
                  key={m.step.id}
                  data-reveal-x={m.x}
                  d={diamond(m.x, m.y, m.size)}
                  style={{ fill: v('--jpd-chain-milestone'), stroke: v('--jpd-surface'), strokeWidth: 2, strokeLinejoin: 'round', opacity: 0 }}
                />
              ),
            )}
            {/* Connect: the commitments' diamonds, at their required-by dates, over the bar's edge */}
            {connect?.cards.map((c, i) => (
              <path
                key={`commit-mark-${c.id}`}
                ref={(el) => {
                  commitRefs.current[i] = { ...commitRefs.current[i], mark: el };
                }}
                d={diamond(c.markX, c.markY, CHAIN.COMMIT_MARK)}
                style={{ fill: v('--jpd-chain-commitment'), stroke: v('--jpd-chain-commitment'), strokeWidth: 2, strokeLinejoin: 'round', opacity: 0 }}
              />
            ))}
            {/* Required On Site: the anchor, first and alone; drawn last so nothing covers it */}
            <g ref={rosMarkRef} style={{ opacity: 0 }}>
              <RosMark row={focal} />
            </g>
          </g>
          </g>
        </svg>
      </div>

      {/* THE TIMESCALE HEADER (§54.4.2): pinned to the top of the chain's
          area, above the bars, as in a scheduling tool. Months over weeks,
          or years over months zoomed out; placed through the one camera. */}
      <div
        ref={headerRef}
        className="pointer-events-none absolute top-0 left-0 overflow-hidden"
        style={{
          height: HEADER.h,
          opacity: 0,
          visibility: 'hidden',
          background: v('--jpd-surface'),
          borderBottom: `1px solid ${v('--jpd-chain-grid-week')}`,
          fontFamily: '"Inter Tight", Inter, system-ui, sans-serif',
        }}
      >
        <svg className="absolute inset-0 h-full w-full" style={{ overflow: 'hidden' }}>
          <line x1="0" x2="100%" y1={HEADER.top + 0.5} y2={HEADER.top + 0.5} style={{ stroke: v('--jpd-chain-grid-day'), strokeWidth: 1 }} />
          <g ref={headerLinesInRef}>
            <path d={headerPaths.monthsFull} style={{ fill: 'none', stroke: v('--jpd-chain-grid-week'), strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }} />
            <path d={headerPaths.weekTicks} style={{ fill: 'none', stroke: v('--jpd-chain-grid-week'), strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }} />
          </g>
          <g ref={headerLinesOutRef} style={{ opacity: 0 }}>
            <path d={headerPaths.yearsFull} style={{ fill: 'none', stroke: v('--jpd-chain-grid-week'), strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }} />
            <path d={headerPaths.monthTicks} style={{ fill: 'none', stroke: v('--jpd-chain-grid-week'), strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }} />
          </g>
        </svg>
        {(
          [
            ['months', scene.timescale.months, 'top'],
            ['years', scene.timescale.years, 'top'],
            ['monthsShort', scene.timescale.monthsShort, 'bottom'],
          ] as const
        ).map(([key, periods, tier]) => (
          <div
            key={key}
            ref={(el) => {
              headerTiersRef.current[key] = el;
            }}
            className="absolute inset-0"
          >
            {periods.map((p) => (
              <span
                key={p.key}
                className="absolute left-0 whitespace-nowrap"
                style={
                  tier === 'top'
                    ? { top: 0, lineHeight: `${HEADER.top}px`, fontSize: 12, fontWeight: 700, color: v('--jpd-chain-ink') }
                    : { top: HEADER.top, lineHeight: `${HEADER.h - HEADER.top}px`, fontSize: 11, fontWeight: 500, color: v('--jpd-chain-ink-secondary') }
                }
              >
                {p.variants[0].text}
              </span>
            ))}
          </div>
        ))}
        <div
          ref={(el) => {
            headerTiersRef.current.weeks = el;
          }}
          className="absolute inset-0"
        >
          {scene.timescale.weeks.map((w) => (
            <span
              key={w.key}
              className="absolute left-0 whitespace-nowrap"
              style={{ top: HEADER.top, lineHeight: `${HEADER.h - HEADER.top}px`, fontSize: 11, fontWeight: 500, color: v('--jpd-chain-ink-secondary') }}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>

      {/* The application window's edge, on the frame's own ground. */}
      <div
        ref={windowRef}
        className="pointer-events-none absolute top-0 left-0 rounded-[4px]"
        style={{
          opacity: 0,
          border: `1px solid ${v('--jpd-grid-strong')}`,
          boxShadow: '0 0 0 100vmax color-mix(in srgb, var(--jp-ink-secondary) 4%, var(--jp-surface-light))',
        }}
      />

      {/* The build panel: the application's own side-panel surface. */}
      {!connect && <div ref={panelRef} className="pointer-events-none absolute top-0 left-0" style={{ background: v('--jpd-surface-sunken') }} />}

      {/* THE STEP LIST: rendered beside the frame when the section offers an
          unclipped layer, so it can rest outside the frame; else in it. */}
      {/* Stage 1: THE RAIL'S OPENING STATE (Section 54.4.2). The rail itself,
          edge to edge, turns to the application's navy and carries the
          statement; then it returns to its light surface and the list
          begins. Nothing floats and nothing moves but the statement's small
          rise. The application's own navy, amber and light text tokens. */}
      {!connect && (
        <div ref={leadRef} className="pointer-events-none absolute top-0 left-0 flex items-center" style={{ visibility: 'hidden' }}>
          <div ref={leadBgRef} className="absolute inset-0" style={{ opacity: 0, background: v('--jpd-nav-bg-start') }} />
          <div className="relative" style={{ padding: '0 22px', fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}>
            <span
              ref={leadRuleRef}
              className="block origin-left"
              style={{ opacity: 0, width: 28, height: 3, marginBottom: 14, background: v('--jpd-accent') }}
            />
            <p
              ref={leadTextRef}
              className="text-balance"
              style={{
                opacity: 0,
                margin: 0,
                fontSize: 21,
                fontWeight: 600,
                lineHeight: '26px',
                letterSpacing: '-0.02em',
                color: v('--jpd-nav-text'),
              }}
            >
              {scene.lead}
            </p>
          </div>
        </div>
      )}

      {/* Stage 1: the field's requirement, stated plainly (Section 54.4.2). */}
      {!connect && (
        <div
          ref={cardRef}
          className="pointer-events-none absolute"
          style={{ opacity: 0, fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: '20px', letterSpacing: '-0.015em', color: v('--jpd-text-strong') }}>{scene.itemTitle}</div>
          <div style={{ marginTop: 3, fontSize: 12.5, lineHeight: '17px', color: v('--jpd-text-secondary') }}>
            Required On Site: <span style={{ fontWeight: 700, color: v('--jpd-text-strong') }}>{formatDate(scene.focal.item.requiredOnSiteDate)}</span>
          </div>
        </div>
      )}

      {connect ? null : host ? createPortal(<div className="jpd absolute inset-0">{stepList}</div>, host) : stepList}

      {/* The chain's own summary row (Section 51.9), while the whole chain is in view. */}
      <div
        ref={summaryRef}
        className="pointer-events-none absolute bottom-0 flex flex-wrap justify-center gap-x-4 gap-y-0.5 px-3 pb-2.5 text-[0.75rem] leading-snug"
        style={{ opacity: 0, color: v('--jpd-chain-ink'), fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
      >
        <span>
          <span className="font-bold">Start:</span> {formatDate(L.summary.startDate)}
        </span>
        <span style={{ color: v('--jpd-chain-ink-secondary') }}>
          Total duration: <span className="font-bold" style={{ color: v('--jpd-chain-ink') }}>{L.summary.totalWorkdays} working days</span>
        </span>
        <span>
          <span className="font-bold">Required On Site:</span> {formatDate(L.summary.requiredOnSiteDate)}
        </span>
      </div>

    </div>
  );
}

/** The application's short date register (as its Required On-Site column). */
const shortDate = (d: string) =>
  parse(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const MS = 86400000;
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS);
const LEGEND_ORDER: PhaseFamily[] = ['buyout', 'coordination', 'preparation', 'review', 'revision', 'production', 'logistics'];

/**
 * The JiTpro Schedule module around the finished schedule: the shared shell
 * with Schedule lit, the Schedule screen's page header and toolbar, then the
 * schedule box (item column, period header, month gridlines, row bands with
 * the featured row selected) and a legend of the activity families drawn.
 * Every position comes from the scene's placement, so the bars land in their
 * rows and on their dates.
 */
function PlanScheduleScreen({ scene }: { scene: PlanScene }) {
  const P = scene.place;
  const L = scene.focal.layout;
  const domainStart = parse(L.domainStart);
  const domainEnd = new Date(domainStart);
  domainEnd.setUTCMonth(domainEnd.getUTCMonth() + L.axis.months.length);
  const ticks = buildTicks(domainStart, domainEnd, 'months');
  const pxPerDay = L.pxPerDay * P.k;
  const drawn = new Set([scene.focal, ...scene.others].flatMap((r) => r.layout.segments.map((s) => s.family)));

  return (
    <JiTproShell activeNav="Schedule">
      <main
        className="shrink-0"
        style={{ width: APP.w - APP.sidebar, paddingLeft: APP.padL, paddingRight: APP.padR, background: v('--jpd-surface') }}
      >
        <div style={{ height: APP.toolsH }}>
          <ScheduleHeader itemCount={ROW_ITEMS.length} />
          <ScheduleToolbar zoom="months" onZoom={() => undefined} enabled={false} health={{ atRisk: 0, impacted: 0 }} />
        </div>

        <div
          className="flex"
          style={{ marginTop: APP.ganttGap, width: P.box.w, border: '1px solid var(--jpd-border)', borderRadius: 6, overflow: 'hidden' }}
        >
          <div style={{ width: APP.leftW, flex: 'none' }}>
            <GanttItemHeader height={APP.periodH} />
            {ROW_ITEMS.map((it, i) => (
              <GanttItemCell
                key={it.id}
                item={it}
                height={P.bands[i].height}
                selected={i === FOCAL_ROW}
                nameLines={P.nameLines}
                showHealth={false}
              />
            ))}
          </div>
          <div style={{ width: P.timelineW, flex: 'none' }}>
            <GanttPeriodHeader ticks={ticks} domainStart={domainStart} pxPerDay={pxPerDay} height={APP.periodH} />
            <div style={{ position: 'relative' }}>
              {ticks.map((t) => (
                <span
                  key={t.key}
                  style={{
                    position: 'absolute',
                    left: dayDiff(domainStart, t.start) * pxPerDay,
                    top: 0,
                    height: P.rowsBottom - P.rowsTop,
                    borderLeft: '1px solid var(--jpd-grid)',
                  }}
                />
              ))}
              {P.bands.map((b, i) => (
                <div
                  key={ROW_ITEMS[i].id}
                  style={{
                    height: b.height,
                    borderBottom: '1px solid var(--jpd-grid)',
                    background: i === FOCAL_ROW ? 'var(--jpd-row-tint)' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center" style={{ marginTop: 12, paddingLeft: 2, gap: 15, flexWrap: 'wrap' }}>
          {LEGEND_ORDER.filter((f) => drawn.has(f)).map((f) => (
            <LegendChip key={f} color={v(tokenFor(f))} label={FAMILY_LEGEND[f]?.title ?? f} />
          ))}
          <LegendChip color={v('--jpd-chain-milestone')} diamond label="Milestone" />
          <LegendChip color={v('--jpd-chain-ros')} diamond label="Required On Site" />
        </div>
      </main>
    </JiTproShell>
  );
}

/** The Required On Site diamond and label (Section 51.5). */
function RosMark({ row }: { row: PlanRow }) {
  const L = row.layout;
  const m = L.milestones.find((x) => x.isRos);
  if (!m || !L.ros) return null;
  return (
    <>
      <path d={diamond(m.x, m.y, m.size)} style={{ fill: v('--jpd-chain-ros'), stroke: v('--jpd-surface'), strokeWidth: 2, strokeLinejoin: 'round' }} />
      <ChainText block={L.ros.text} />
    </>
  );
}

/** One of the project's other items: its bar and milestones, on the shared axis. */
function Row({ row, uid }: { row: PlanRow; uid: string }) {
  const L = row.layout;
  return (
    <g transform={`translate(0 ${row.dy})`}>
      {L.segments.map((s) => (
        <path key={s.step.id} d={s.path} style={{ fill: `url(#${uid}-g-${s.family})` }} />
      ))}
      {L.milestones.map((m) => (
        <path
          key={m.step.id}
          d={diamond(m.x, m.y, m.size)}
          style={{ fill: v(m.isRos ? '--jpd-chain-ros' : '--jpd-chain-milestone'), stroke: v('--jpd-surface'), strokeWidth: 2, strokeLinejoin: 'round' }}
        />
      ))}
    </g>
  );
}
