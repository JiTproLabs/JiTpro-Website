/**
 * THE JITPRO PROCUREMENT CHAIN (Design System Section 51).
 *
 * One procurement item as ONE continuous bar of color-coded chevrons on a
 * calendar axis, planned backward from a fixed Required On Site date.
 * Commitments - what other parties owe the chain - sit above it; issues sit
 * below it. Every coordinate comes from `buildChainLayout`, which reads dates
 * from the scheduling engine; nothing here positions anything by hand.
 *
 * TWO LAYERS FROM ONE LAYOUT. The SVG draws every shape. An HTML layer of
 * transparent buttons, one per mark, carries the shared mark classes so the
 * unchanged `useMarkInspection` hook and `PhaseInspector` provide hover,
 * keyboard focus, touch pinning and the detail card.
 *
 * Static only. The backward-building reveal (Section 51.12) is not built; the
 * layout already exposes `revealOrder` for it.
 */

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CalendarDays } from 'lucide-react';
import PhaseInspector, { targetId, type InspectTarget } from '../procurement-schedule/PhaseInspector';
import { useMarkInspection } from '../procurement-schedule/useMarkInspection';
import { InspectionContext } from '../../inspection';
import type { ScheduleItem } from '../procurement-schedule/scheduleModel';
import {
  buildChainLayout,
  CHAIN,
  FONT,
  formatDate,
  type ChainCard,
} from './chainLayout';
import ChainText from './ChainText';
import { FAMILY_ICON, FAMILY_LEGEND, diamond, gradientBottom, tokenFor, v } from './chainVocabulary';
import { useChainMeasure } from './useChainMeasure';
import '../../tokens.css';
import '../procurement-schedule/scheduleTokens.css';
import './chainTokens.css';

/* ---------------------------------------------------------- vocabulary */

/**
 * The dark-ground logo (`JiTpro_Amber_white_text.svg`, white wordmark with
 * the amber mark - the variant the site's dark investor navigation already
 * uses). Its viewBox (660 x 320) is already cropped to the artwork, so it is
 * sized from that ratio and the file is used unmodified.
 */
const LOGO = { viewW: 660, viewH: 320, displayH: 52 };

/* -------------------------------------------------------------- drawing */

const triangle = (x: number, y: number, size: number) => {
  const r = size / 2;
  return `M${x} ${y - r} L${x + r * 1.1} ${y + r * 0.8} L${x - r * 1.1} ${y + r * 0.8} Z`;
};

/** The active-mark ring: a surface halo under an ink line, legible on any fill. */
function Ring({ d }: { d: string }) {
  return (
    <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <path d={d} style={{ fill: 'none', stroke: v('--jpd-surface'), strokeWidth: 6, strokeLinejoin: 'round' }} />
      <path d={d} style={{ fill: 'none', stroke: v('--jpd-text'), strokeWidth: 2.25, strokeLinejoin: 'round' }} />
    </g>
  );
}

/* ------------------------------------------------------------ component */

type Props = {
  item: ScheduleItem;
  /** Authored short labels by step id (Section 51.6). */
  labels?: Record<string, string>;
  title?: string;
  subtitle?: string;
};

export default function ProcurementChain({
  item,
  labels,
  title = `Procurement Chain — ${item.name}`,
  subtitle = 'From buyout through submittals, reviews, fabrication and delivery, planned backward from the Required On Site date.',
}: Props) {
  const uid = useId().replace(/:/g, '');
  const measure = useChainMeasure();

  /* ---- width ---- */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hostW, setHostW] = useState(0);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const read = () => setHostW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(
    () => buildChainLayout(item, { containerWidth: hostW, measure, labels }),
    [item, hostW, measure, labels],
  );

  /* The fixed date first: open scrolled to Required On Site (Section 51.9). */
  const scrolledOnce = useRef(false);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !hostW || scrolledOnce.current) return;
    el.scrollLeft = el.scrollWidth;
    scrolledOnce.current = true;
  }, [hostW, layout.width]);

  /* ---- inspection: the existing hook and card, unchanged ---- */
  const enabled = true;
  const { anchor, dismiss, clearHover, clearPin, handlersFor } = useMarkInspection(enabled);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const host = document.createElement('div');
    host.className = 'jpd';
    document.body.appendChild(host);
    setPortalEl(host);
    return () => host.remove();
  }, []);
  const capabilities = useMemo(() => ({ enabled, portalTarget: portalEl }), [enabled, portalEl]);
  useEffect(() => {
    if (!anchor) return;
    const onScroll = () => {
      clearHover();
      clearPin();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [anchor, clearHover, clearPin]);
  useEffect(() => dismiss(), [layout.pxPerDay, dismiss]);

  const activeId = anchor ? targetId(anchor.target) : null;
  const L = layout;
  const families = [...new Set(L.segments.map((s) => s.family))];

  /* ---- the hit layer, in date order so Tab walks the chain ---- */
  const bandTop = L.barTop - 22;
  const bandH = CHAIN.H + 44;
  type Hit = { key: string; x: number; className: string; style: CSSProperties; label: string; target: InspectTarget };
  const hits: Hit[] = [
    ...L.segments.map((s) => ({
      key: s.step.id,
      x: s.x0,
      className: 'jpd-step jpd-step--interactive jpd-chain-hit',
      style: { left: s.x0 + CHAIN.G / 2, width: s.x1 - s.x0 - CHAIN.G, top: L.barTop - bandTop, height: CHAIN.H },
      label: `${s.step.name}, ${s.step.durationWorkdays} working days, ${formatDate(s.step.startDate)} to ${formatDate(s.step.endDate)}`,
      target: { kind: 'step', step: s.step } as InspectTarget,
    })),
    ...L.milestones.map((m) => {
      const h = m.stackSize > 1 ? CHAIN.STACK_SPACING : Math.max(24, m.size);
      const w = Math.max(24, m.size);
      return {
        key: m.step.id,
        x: m.x,
        className: 'jpd-step jpd-step--interactive jpd-chain-hit',
        style: { left: m.x - w / 2, width: w, top: m.y - h / 2 - bandTop, height: h, zIndex: 1 },
        label: `${m.step.name}, milestone, ${formatDate(m.step.startDate)}`,
        target: { kind: 'step', step: m.step } as InspectTarget,
      };
    }),
    ...L.commitments.map((c) => ({
      key: c.id,
      x: c.markX,
      className: 'jpd-commit jpd-commit--interactive jpd-chain-hit',
      style: { left: c.markX - 11, width: 22, top: c.markY - 11 - bandTop, height: 22, zIndex: 2 },
      label: `Commitment: ${c.commitment!.name}, owed by the ${c.commitment!.ownerRole}, required by ${formatDate(c.commitment!.requiredBy)} for ${c.commitment!.requiredForStepName}`,
      target: { kind: 'commitment', commitment: c.commitment! } as InspectTarget,
    })),
    ...L.issues.map((i) => ({
      key: i.id,
      x: i.markX,
      className: 'jpd-issue jpd-issue--interactive jpd-chain-hit',
      style: { left: i.markX - 11, width: 22, top: i.markY - 11 - bandTop, height: 22, zIndex: 2 },
      label: `Issue: ${i.issue!.title}, identified ${formatDate(i.issue!.identifiedOn)}`,
      target: { kind: 'issue', issue: i.issue!, item } as InspectTarget,
    })),
  ].sort((a, b) => a.x - b.x);

  const commitStroke = (c: ChainCard) =>
    c.commitment!.status === 'beyond-required' ? v('--jpd-chain-commitment-late') : v('--jpd-chain-commitment');
  const commitFill = (c: ChainCard) =>
    c.commitment!.status === 'open' ? v('--jpd-surface') : commitStroke(c);
  const issueTone = (c: ChainCard) =>
    c.issue && item.health === 'impacted' ? v('--jpd-chain-issue-impacted') : v('--jpd-chain-issue-at-risk');
  const issueFill = () =>
    item.health === 'impacted' ? v('--jpd-chain-issue-fill-impacted') : v('--jpd-chain-issue-fill');

  return (
    <InspectionContext.Provider value={capabilities}>
      <figure className="jpd m-0 rounded-[22px] bg-[var(--jpd-surface)]" aria-label={title}>
        {/* ------------------------------------------------------ header
            The dark navy band (Section 51.9, amended 2026-11-07): --jp-surface,
            the site's dark band tone, with the dark-ground logo and the
            approved light-on-dark ink. Only the header is dark; the chain body
            stays white. */}
        <header className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-t-[22px] bg-jp-surface px-5 py-4 sm:px-7 sm:py-5">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo/JiTpro_Amber_white_text.svg`}
            alt="JiTpro"
            className="shrink-0"
            style={{ height: LOGO.displayH, width: (LOGO.displayH * LOGO.viewW) / LOGO.viewH }}
          />
          <span aria-hidden="true" className="hidden h-16 w-px bg-jp-border/25 sm:block" />
          <div className="min-w-0 flex-1">
            <h3
              className="text-[1.375rem] font-bold leading-tight tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.75rem]"
              style={{ fontFamily: '"Inter Tight", Inter, system-ui, sans-serif' }}
            >
              {title}
            </h3>
            <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-jp-text-secondary sm:text-base">
              {subtitle}
            </p>
          </div>
        </header>

        <div className="p-4 sm:p-6">

        {/* --------------------------------------------- the scrolling chain */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={`${item.name} procurement chain timeline. Scroll horizontally to see the full chain.`}
          tabIndex={0}
          className="overflow-x-auto overflow-y-hidden overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jpd-text)]"
          onScroll={() => clearHover()}
        >
          <div className="relative" style={{ width: L.width, height: L.height }}>
            <svg width={L.width} height={L.height} viewBox={`0 0 ${L.width} ${L.height}`} aria-hidden="true" style={{ display: 'block' }}>
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
              </defs>

              {/* calendar axis */}
              <g>
                <line
                  x1={CHAIN.PAD_L}
                  x2={L.width - CHAIN.PAD_R}
                  y1={L.axis.y}
                  y2={L.axis.y}
                  style={{ stroke: v('--jpd-chain-axis'), strokeWidth: 1 }}
                />
                {L.axis.months.map((m) => (
                  <g key={m.x}>
                    <line x1={m.x} x2={m.x} y1={L.axis.y} y2={L.axis.y + (m.major ? 10 : 6)} style={{ stroke: v('--jpd-chain-axis'), strokeWidth: 1 }} />
                    <text
                      x={m.x + 5}
                      y={L.axis.y + 22}
                      style={{ font: FONT.axis, fill: v(m.major ? '--jpd-chain-ink' : '--jpd-chain-ink-secondary') }}
                    >
                      {m.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Required On Site date rule, behind everything */}
              {L.ros && (
                <line
                  x1={L.ros.x}
                  x2={L.ros.x}
                  y1={L.ros.ruleTop}
                  y2={L.ros.ruleBottom}
                  style={{ stroke: v('--jpd-chain-rule'), strokeWidth: 1.5, strokeDasharray: '6 6' }}
                />
              )}

              {/* leaders, behind cards, labels and marks */}
              {[...L.commitments, ...L.issues].map((c) => (
                <line
                  key={`leader-${c.id}`}
                  x1={c.leader.x1}
                  y1={c.leader.y1}
                  x2={c.leader.x2}
                  y2={c.leader.y2}
                  style={{ stroke: c.kind === 'commitment' ? commitStroke(c) : issueTone(c), strokeWidth: 1.5 }}
                />
              ))}

              {/* commitment cards (above) */}
              {L.commitments.map((c) => (
                <g key={c.id}>
                  <rect
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx={10}
                    style={{ fill: v('--jpd-chain-commitment-fill'), stroke: commitStroke(c), strokeWidth: activeId === c.id ? 2.5 : 1.5 }}
                  />
                  <ChainText block={c.text} />
                </g>
              ))}

              {/* issue cards (below) */}
              {L.issues.map((c) => (
                <g key={c.id}>
                  <rect
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx={10}
                    style={{ fill: issueFill(), stroke: issueTone(c), strokeWidth: activeId === c.id ? 2.5 : 1.5 }}
                  />
                  <ChainText block={c.text} />
                </g>
              ))}

              {/* milestone stems for labels that dropped a row */}
              {L.labels.map(
                (l) =>
                  l.stem && (
                    <line
                      key={`stem-${l.key}`}
                      x1={l.stem.x}
                      x2={l.stem.x}
                      y1={l.stem.y1}
                      y2={l.stem.y2}
                      style={{ stroke: v('--jpd-chain-milestone'), strokeWidth: 1 }}
                    />
                  ),
              )}

              {/* THE CHAIN: one continuous bar */}
              <g style={{ filter: `url(#${uid}-shadow)` }}>
                {L.segments.map((s) => (
                  <path
                    key={s.step.id}
                    d={s.path}
                    style={{
                      fill: `url(#${uid}-g-${s.family})`,
                      filter: activeId === s.step.id ? 'brightness(1.08)' : undefined,
                    }}
                  />
                ))}
              </g>
              {L.segments.map((s) => {
                const Icon = FAMILY_ICON[s.family];
                return (
                  <g key={`content-${s.step.id}`} style={{ pointerEvents: 'none' }}>
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
              {L.segments.filter((s) => s.step.id === activeId).map((s) => (
                <Ring key="ring" d={s.path} />
              ))}

              {/* labels below the bar */}
              {L.labels.map((l) => (
                <ChainText key={l.key} block={l.text} halo />
              ))}

              {/* milestones: zero-duration events at their instant */}
              {L.milestones.map((m) => {
                const d = diamond(m.x, m.y, m.size);
                return (
                  <g key={m.step.id}>
                    <path
                      d={d}
                      style={{
                        fill: v(m.isRos ? '--jpd-chain-ros' : '--jpd-chain-milestone'),
                        stroke: v('--jpd-surface'),
                        strokeWidth: 2,
                        strokeLinejoin: 'round',
                      }}
                    />
                    {activeId === m.step.id && <Ring d={d} />}
                  </g>
                );
              })}
              {L.ros && <ChainText block={L.ros.text} />}

              {/* commitment marks (above), issue marks (below) */}
              {L.commitments.map((c) => {
                const d = diamond(c.markX, c.markY, CHAIN.COMMIT_MARK);
                return (
                  <g key={`mark-${c.id}`}>
                    <path d={d} style={{ fill: commitFill(c), stroke: commitStroke(c), strokeWidth: 2, strokeLinejoin: 'round' }} />
                    {activeId === c.id && <Ring d={d} />}
                  </g>
                );
              })}
              {L.issues.map((c) => {
                const d = triangle(c.markX, c.markY, CHAIN.ISSUE_MARK);
                return (
                  <g key={`mark-${c.id}`}>
                    <path d={d} style={{ fill: issueTone(c), stroke: v('--jpd-surface'), strokeWidth: 1.5, strokeLinejoin: 'round' }} />
                    {activeId === c.id && <Ring d={d} />}
                  </g>
                );
              })}
            </svg>

            {/* ------------------------------------------ the hit layer */}
            <div data-gantt-row={item.id} className="absolute left-0" style={{ top: bandTop, height: bandH, width: L.width }}>
              {hits.map((h) => (
                <button
                  key={h.key}
                  type="button"
                  className={h.className}
                  style={h.style}
                  aria-label={h.label}
                  {...handlersFor(h.target, item.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- summary row */}
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 text-[0.9375rem] sm:text-base"
          style={{ color: v('--jpd-chain-ink') }}
        >
          <p>
            <span className="font-bold">Start:</span> {formatDate(L.summary.startDate)}
          </p>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-[var(--jpd-grid-strong)] md:block" />
          <p style={{ color: v('--jpd-chain-ink-secondary') }}>
            Total duration: <span className="font-bold" style={{ color: v('--jpd-chain-ink') }}>{L.summary.totalWorkdays} working days</span>
          </p>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-[var(--jpd-grid-strong)] md:block" />
          <p>
            <span className="font-bold">Required On Site:</span> {formatDate(L.summary.requiredOnSiteDate)}
          </p>
        </div>

        {/* --------------------------------------------------------- legend */}
        <div className="mt-5 rounded-[18px] border border-[var(--jpd-grid-strong)] px-4 py-4 sm:px-6">
          <p className="sr-only">Legend</p>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-x-6 gap-y-4" style={{ color: v('--jpd-chain-ink') }}>
            {families.map((f) => (
              <li key={f} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-0.5 h-4 w-7 shrink-0 rounded-[5px]" style={{ background: v(tokenFor(f)) }} />
                <span>
                  <span className="block text-[0.875rem] font-bold leading-tight">{FAMILY_LEGEND[f]?.title ?? f}</span>
                  <span className="block text-[0.8125rem] leading-snug" style={{ color: v('--jpd-chain-ink-secondary') }}>
                    {FAMILY_LEGEND[f]?.body}
                  </span>
                </span>
              </li>
            ))}
            <li className="flex gap-2.5">
              <CalendarDays aria-hidden="true" size={18} strokeWidth={2.25} className="mt-0.5 shrink-0" style={{ color: v('--jpd-chain-ros') }} />
              <span>
                <span className="block text-[0.875rem] font-bold leading-tight">Required On Site</span>
                <span className="block text-[0.8125rem] leading-snug" style={{ color: v('--jpd-chain-ink-secondary') }}>
                  The fixed date the field needs it; everything is planned backward from here
                </span>
              </span>
            </li>
            {[
              { key: 'ms', title: 'Milestone', body: 'A dated event with zero duration', d: diamond(9, 9, 15), style: { fill: v('--jpd-chain-milestone') } },
              { key: 'cm', title: 'Commitment', body: 'Owed by another party, dated when it is needed', d: diamond(9, 9, 14), style: { fill: v('--jpd-chain-commitment') } },
              { key: 'is', title: 'Issue', body: 'A risk, delay or missed commitment, dated when identified', d: triangle(9, 10, 15), style: { fill: v('--jpd-chain-issue-at-risk') } },
            ].map((k) => (
              <li key={k.key} className="flex gap-2.5">
                <svg aria-hidden="true" width="18" height="18" className="mt-0.5 shrink-0">
                  <path d={k.d} style={k.style} />
                </svg>
                <span>
                  <span className="block text-[0.875rem] font-bold leading-tight">{k.title}</span>
                  <span className="block text-[0.8125rem] leading-snug" style={{ color: v('--jpd-chain-ink-secondary') }}>
                    {k.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figcaption className="mt-3 px-1 text-[0.8125rem] leading-snug" style={{ color: v('--jpd-chain-ink-secondary') }}>
          Representative demonstration data. Every date is calculated backward from the fixed Required On Site date on a
          working-day calendar that excludes weekends and U.S. federal holidays.
        </figcaption>

        </div>

        {/* The same chain, in order, for assistive technology. */}
        <ol className="jpd-sr-list" aria-label={`${item.name} procurement chain, in order`}>
          {item.steps.map((s) => (
            <li key={s.id}>
              {s.kind === 'milestone'
                ? `${s.name}: milestone, ${formatDate(s.startDate)}.`
                : `${s.name}: ${s.durationWorkdays} working days, ${formatDate(s.startDate)} to ${formatDate(s.endDate)}.`}
            </li>
          ))}
          {item.commitments.map((c) => (
            <li key={c.id}>{`Commitment: ${c.name}, owed by the ${c.ownerRole}, required by ${formatDate(c.requiredBy)} for ${c.requiredForStepName}.`}</li>
          ))}
          {item.issues.map((i) => (
            <li key={i.id}>{`Issue: ${i.title}, identified ${formatDate(i.identifiedOn)}. ${i.impact}`}</li>
          ))}
        </ol>

        <PhaseInspector anchor={anchor} />
      </figure>
    </InspectionContext.Provider>
  );
}
