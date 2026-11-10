import { useId, useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CHAIN, FONT, formatDate } from '../demo/screens/procurement-chain/chainLayout';
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
  ROW_ITEMS,
  buildPlanScene,
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

type Aside = {
  /** An unclipped layer the size of the frame's inner box, beside it. */
  host: HTMLElement | null;
  /** Free room outside the frame, in the frame's coordinates (§54.4.2). */
  region: { x: number; y: number; w: number; h: number } | null;
};

export default function PlanChainPreview({ played, aside }: { played: boolean; aside?: Aside }) {
  const region = aside?.region ?? null;
  const host = aside?.host ?? null;
  const uid = useId().replace(/:/g, '');
  const measure = useChainMeasure();
  const scene = useMemo(() => buildPlanScene(measure), [measure]);

  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const othersRef = useRef<SVGGElement>(null);
  const rosRuleRef = useRef<SVGGElement>(null);
  const rosMarkRef = useRef<SVGGElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const focalAxisRef = useRef<SVGGElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* When this pass began; survives a scene rebuild (fonts arriving) mid-pass. */
  const startedAt = useRef<number | null>(null);

  useLayoutEffect(() => {
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    if (!frameEl || !canvas) return;
    const reveals = [...canvas.querySelectorAll<SVGElement>('[data-reveal-x]')].map((el) => ({
      el,
      x: Number(el.dataset.revealX),
    }));
    let frame: Frame = { w: frameEl.clientWidth, h: frameEl.clientHeight, aside: region };

    const apply = (s: PlanState) => {
      canvas.style.transform = transformOf(s.view, frame);
      clipRef.current?.setAttribute('x', String(s.edgeX));
      for (const r of reveals) r.el.style.opacity = String(revealAt(r.x, s.edgeX));
      if (othersRef.current) othersRef.current.style.opacity = String(s.others);
      for (const g of [rosRuleRef.current, rosMarkRef.current]) if (g) g.style.opacity = String(s.ros);
      if (summaryRef.current) summaryRef.current.style.opacity = String(s.summary);
      if (focalAxisRef.current) focalAxisRef.current.style.opacity = String(s.focalAxis);
      if (appRef.current) {
        appRef.current.style.opacity = String(s.app);
        // Nothing to paint while it is invisible.
        appRef.current.style.visibility = s.app > 0 ? 'visible' : 'hidden';
      }

      const lay = listLayout(frame);
      // The application window, on the frame's own ground.
      const win = windowRef.current;
      if (win) {
        Object.assign(win.style, {
          // Only when the window shares the frame with the list.
          opacity: String(lay.mode === 'aside' ? 0 : s.app),
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
      const placed = scene.list.map((_, i) => listItemAt(lay, i, s.list.morph));
      // Where the columns cross on the way out, the second fades back.
      const fade = listCrossingFade(lay, s.list.morph);
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = placed[i];
        const x = p.x;
        const y = p.y + (1 - s.list.appear[i]) * 6;
        const k = p.s;
        el.style.opacity = String(s.list.appear[i] * fade[i]);
        el.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
        const hl = el.firstElementChild as HTMLElement | null;
        if (hl) hl.style.opacity = String(s.list.active[i]);
      });
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
      t = scene.times.end;
    } else {
      startedAt.current ??= performance.now();
      const tick = () => {
        t = Math.min(scene.times.end, performance.now() - startedAt.current!);
        apply(planStateAt(scene, frame, t));
        if (t < scene.times.end) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    apply(planStateAt(scene, frame, played && !reduced ? Math.min(scene.times.end, performance.now() - startedAt.current!) : t));

    /* A resize re-frames the same moment: every view is computed from the frame. */
    const ro = new ResizeObserver(() => {
      frame = { w: frameEl.clientWidth, h: frameEl.clientHeight, aside: region };
      apply(planStateAt(scene, frame, t));
    });
    ro.observe(frameEl);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [played, scene, region, host]);

  const { focal, others, place: P } = scene;
  const L = focal.layout;
  const families = [...new Set([focal, ...others].flatMap((r) => r.layout.segments.map((s) => s.family)))];

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
        </div>
      ))}

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
          {/* The project's other procurement items: bars and milestones only. */}
          <g ref={othersRef} style={{ opacity: 0 }}>
            {others.map((row) => (
              <Row key={row.item.id} row={row} uid={uid} />
            ))}
          </g>

          {/* THE FOCAL CHAIN */}
          <g transform={`translate(0 ${focal.dy})`}>
            {/* its own calendar axis, handed over to the schedule's on the pull-back */}
            <g ref={focalAxisRef}>
              <Axis layout={L} y={L.axis.y} />
            </g>

            {/* Required On Site's date rule, behind everything */}
            <g ref={rosRuleRef} style={{ opacity: 0 }}>
              {L.ros && (
                <line x1={L.ros.x} x2={L.ros.x} y1={L.ros.ruleTop} y2={L.ros.ruleBottom} style={{ stroke: v('--jpd-chain-rule'), strokeWidth: 1.5, strokeDasharray: '6 6' }} />
              )}
            </g>

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
            {/* Required On Site: the anchor, first and alone; drawn last so nothing covers it */}
            <g ref={rosMarkRef} style={{ opacity: 0 }}>
              <RosMark row={focal} />
            </g>
          </g>
          </g>
        </svg>
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
      <div ref={panelRef} className="pointer-events-none absolute top-0 left-0" style={{ background: v('--jpd-surface-sunken') }} />

      {/* THE STEP LIST: rendered beside the frame when the section offers an
          unclipped layer, so it can rest outside the frame; else in it. */}
      {host ? createPortal(<div className="jpd absolute inset-0">{stepList}</div>, host) : stepList}

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

/** A month band across the shared domain (Section 51.3). */
function Axis({ layout: L, y }: { layout: PlanRow['layout']; y: number }) {
  return (
    <>
      <line x1={CHAIN.PAD_L} x2={L.width - CHAIN.PAD_R} y1={y} y2={y} style={{ stroke: v('--jpd-chain-axis'), strokeWidth: 1 }} />
      {L.axis.months.map((m) => (
        <g key={m.x}>
          <line x1={m.x} x2={m.x} y1={y} y2={y + (m.major ? 10 : 6)} style={{ stroke: v('--jpd-chain-axis'), strokeWidth: 1 }} />
          <text x={m.x + 5} y={y + 22} style={{ font: FONT.axis, fill: v(m.major ? '--jpd-chain-ink' : '--jpd-chain-ink-secondary') }}>
            {m.label}
          </text>
        </g>
      ))}
    </>
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
