/**
 * PROCUREMENT CHAIN LAYOUT (Design System Section 51). PURE: no DOM, no React.
 *
 * Input: one resolved ScheduleItem. Output: every coordinate the renderer
 * draws. Every horizontal position is a function of a date, through one
 * calendar-day scale; every width is a function of two dates. Nothing here
 * schedules - dates are read from the engine's output and never adjusted.
 *
 * Text is measured through an injected `measure` so this module stays
 * testable outside a browser.
 */

import type {
  PhaseFamily,
  ScheduleCommitment,
  ScheduleIssue,
  ScheduleItem,
  ScheduleStep,
} from '../procurement-schedule/scheduleModel';
import { iso, nextWorkday, parse } from '../procurement-schedule/workCalendar';

/* ------------------------------------------------------------- constants */

export const CHAIN = {
  /** Bar height (Section 51.4). */
  H: 56,
  /** Chevron point depth, round(0.3 x H). */
  D: 17,
  /** Joint gap between interlocking chevrons. */
  G: 3,
  /** Floor on the scale. Durations are never compressed below it (51.3). */
  MIN_PX_PER_DAY: 8,
  PAD_L: 24,
  /** Room for the Required On Site label to the right of the domain. */
  PAD_R: 210,
  TOP_PAD: 12,
  ICON: 20,
  ICON_GAP: 8,
  INNER_PAD: 6,
  /** Milestone diamond, 0.46 x H across (51.5). */
  DIAMOND: 26,
  ROS_SCALE: 1.35,
  /** Vertical spacing of same-instant milestones (51.14). */
  STACK_SPACING: 20,
  COMMIT_MARK: 14,
  ISSUE_MARK: 16,
  LEADER_MIN: 30,
  CARD_GAP: 14,
  CARD_MIN_W: 220,
  CARD_MAX_W: 300,
  CARD_PAD_X: 14,
  CARD_PAD_Y: 12,
  TIER_GAP: 14,
  LABEL_TOP_GAP: 14,
  LABEL_PAD_X: 10,
  AXIS_H: 40,
} as const;

const FACE = '"Inter Tight", Inter, system-ui, sans-serif';
export const FONT = {
  chevron: `700 14px ${FACE}`,
  duration: `500 13px ${FACE}`,
  label: `700 12px ${FACE}`,
  labelDate: `500 12px ${FACE}`,
  kicker: `600 11px ${FACE}`,
  cardTitle: `700 14px ${FACE}`,
  cardBody: `500 13px ${FACE}`,
  axis: `500 12px ${FACE}`,
  rosTitle: `700 14px ${FACE}`,
  rosBody: `500 13px ${FACE}`,
} as const;
export type FontKey = keyof typeof FONT;

const LINE_H: Record<FontKey, number> = {
  chevron: 17,
  duration: 16,
  label: 15,
  labelDate: 15,
  kicker: 15,
  cardTitle: 19,
  cardBody: 17,
  axis: 14,
  rosTitle: 18,
  rosBody: 17,
};

export type Measure = (text: string, font: string) => number;

/* ----------------------------------------------------------------- types */

export type TextLine = { text: string; font: FontKey; tone?: 'ink' | 'secondary' | 'late' };

/** A block of lines whose top-left (or top-centre) is placed by the layout. */
export type TextBlock = { x: number; y: number; anchor: 'start' | 'middle'; lines: (TextLine & { baseline: number })[] };

export type ChainSegment = {
  step: ScheduleStep;
  family: PhaseFamily;
  /** The visual span: start date to the start of the next working day. */
  x0: number;
  x1: number;
  path: string;
  tier: 'A' | 'B' | 'C';
  /** Icon top-left, when drawn (tiers A and B). */
  icon: { x: number; y: number } | null;
  /** The label inside the chevron (tier A). */
  inner: TextBlock | null;
};

export type ChainMilestone = {
  step: ScheduleStep;
  x: number;
  y: number;
  size: number;
  isRos: boolean;
  stackIndex: number;
  stackSize: number;
};

export type ChainCard = {
  id: string;
  kind: 'commitment' | 'issue';
  /** The mark's true x - the date - and the mark's centre y. */
  markX: number;
  markY: number;
  x: number;
  y: number;
  w: number;
  h: number;
  tier: number;
  text: TextBlock;
  /** The leader, from the card edge to the mark. */
  leader: { x1: number; y1: number; x2: number; y2: number };
  commitment?: ScheduleCommitment;
  issue?: ScheduleIssue;
};

export type ChainLabel = {
  key: string;
  box: { x: number; y: number; w: number; h: number };
  text: TextBlock;
  /** A stem back to the mark when the label had to drop a row. */
  stem: { x: number; y1: number; y2: number } | null;
};

export type ChainLayout = {
  width: number;
  height: number;
  pxPerDay: number;
  domainStart: string;
  barTop: number;
  barBottom: number;
  cy: number;
  segments: ChainSegment[];
  milestones: ChainMilestone[];
  commitments: ChainCard[];
  issues: ChainCard[];
  labels: ChainLabel[];
  ros: { x: number; ruleTop: number; ruleBottom: number; text: TextBlock } | null;
  axis: { y: number; months: { x: number; label: string; major: boolean }[] };
  summary: { startDate: string; requiredOnSiteDate: string; totalWorkdays: number; activityWorkdays: number };
  /** Mark ids from Required On Site backward, for the future reveal (51.12). */
  revealOrder: string[];
};

export type LayoutOptions = {
  /** The width the figure may fill. Wider containers spread the scale. */
  containerWidth: number;
  measure: Measure;
  /** Authored display labels by step id; the full name is the fallback. */
  labels?: Record<string, string>;
  /**
   * A shared calendar domain, for several chains drawn on one axis (the
   * homepage Plan schedule, Design System Section 54.4.2). Both ends are the
   * first day of a month; `end` is exclusive. It must contain the item's own
   * domain. Omitted: the item's own whole-month domain (Section 51.3).
   */
  domain?: { start: string; end: string };
};

/* --------------------------------------------------------------- helpers */

const MS = 86400000;
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS);

/** Long-form date, the figure's one absolute-date register (51.8). */
export const formatDate = (d: string) =>
  parse(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const workdays = (n: number) => `${n} working ${n === 1 ? 'day' : 'days'}`;

function wrap(text: string, font: FontKey, maxW: number, measure: Measure): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, FONT[font]) > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** The best two-line split of a label: the one with the narrower widest line. */
function splitTwo(text: string, measure: Measure): string[] | null {
  const words = text.split(' ');
  if (words.length < 2) return null;
  let best: string[] | null = null;
  let bestW = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const w = Math.max(measure(a, FONT.chevron), measure(b, FONT.chevron));
    if (w < bestW) {
      bestW = w;
      best = [a, b];
    }
  }
  return best;
}

function block(x: number, y: number, anchor: 'start' | 'middle', lines: TextLine[]): TextBlock {
  let cursor = y;
  return {
    x,
    y,
    anchor,
    lines: lines.map((l) => {
      const lh = LINE_H[l.font];
      cursor += lh;
      return { ...l, baseline: cursor - Math.round(lh * 0.27) };
    }),
  };
}

const blockHeight = (lines: TextLine[]) => lines.reduce((n, l) => n + LINE_H[l.font], 0);
const blockWidth = (lines: TextLine[], measure: Measure) =>
  Math.max(0, ...lines.map((l) => measure(l.text, FONT[l.font])));

/* ------------------------------------------------------------- the layout */

export function buildChainLayout(item: ScheduleItem, opts: LayoutOptions): ChainLayout {
  const { measure } = opts;
  const label = (s: ScheduleStep) => opts.labels?.[s.id] ?? s.name;
  const C = CHAIN;

  /* ---- the scale. Domain padded to whole months; never the scale. ---- */
  const dates = [
    item.startDate,
    item.requiredOnSiteDate,
    ...item.commitments.map((c) => c.requiredBy),
    ...item.issues.map((i) => i.identifiedOn),
  ].sort();
  const ds = parse(dates[0]);
  ds.setUTCDate(1);
  const de = parse(dates[dates.length - 1] > item.requiredOnSiteDate ? dates[dates.length - 1] : item.requiredOnSiteDate);
  de.setUTCMonth(de.getUTCMonth() + 1, 1);
  if (opts.domain) {
    const shared = { start: parse(opts.domain.start), end: parse(opts.domain.end) };
    if (shared.start.getUTCDate() !== 1 || shared.end.getUTCDate() !== 1)
      throw new Error('chainLayout: a shared domain must run between month starts');
    if (shared.start > ds || shared.end < de)
      throw new Error(`chainLayout: the shared domain does not contain ${item.id}`);
    ds.setTime(shared.start.getTime());
    de.setTime(shared.end.getTime());
  }
  const domainDays = dayDiff(ds, de);
  const pxPerDay = Math.max(C.MIN_PX_PER_DAY, (opts.containerWidth - C.PAD_L - C.PAD_R) / domainDays);
  const width = C.PAD_L + domainDays * pxPerDay + C.PAD_R;
  const X = (d: string) => C.PAD_L + dayDiff(ds, parse(d)) * pxPerDay;

  /* ---- commitment cards: sized and tiered first, so the bar can sit
     beneath however many tiers they need. ---- */
  const cardText = (lines: TextLine[]) => {
    const maxText = C.CARD_MAX_W - 2 * C.CARD_PAD_X;
    const wrapped: TextLine[] = lines.flatMap((l) =>
      wrap(l.text, l.font, maxText, measure).map((t) => ({ ...l, text: t })),
    );
    const w = Math.min(C.CARD_MAX_W, Math.max(C.CARD_MIN_W, blockWidth(wrapped, measure) + 2 * C.CARD_PAD_X));
    return { lines: wrapped, w, h: blockHeight(wrapped) + 2 * C.CARD_PAD_Y };
  };

  const commitmentLines = (c: ScheduleCommitment): TextLine[] => {
    const lines: TextLine[] = [
      { text: c.typeLabel, font: 'kicker', tone: 'secondary' },
      { text: c.name, font: 'cardTitle' },
      { text: `Required by ${formatDate(c.requiredBy)}`, font: 'cardBody' },
      { text: `${c.ownerRole} · for ${c.requiredForStepName}`, font: 'cardBody', tone: 'secondary' },
    ];
    if (c.committedFor && (c.varianceWorkdays ?? 0) > 0)
      lines.push({ text: `Committed ${formatDate(c.committedFor)} · ${workdays(c.varianceWorkdays!)} late`, font: 'cardBody', tone: 'late' });
    if (c.completedDate && (c.completionVarianceWorkdays ?? 0) > 0)
      lines.push({ text: `Provided ${formatDate(c.completedDate)} · ${workdays(c.completionVarianceWorkdays!)} late`, font: 'cardBody', tone: 'late' });
    return lines;
  };
  const issueLines = (i: ScheduleIssue): TextLine[] => [
    { text: i.kindLabel, font: 'kicker', tone: 'secondary' },
    { text: i.title, font: 'cardTitle' },
    { text: `Identified ${formatDate(i.identifiedOn)}`, font: 'cardBody' },
    { text: i.impact, font: 'cardBody', tone: 'secondary' },
  ];

  /** Left-to-right placement: push apart within a tier, else rise a tier.
      The mark never moves; only the card does (51.10). */
  function tierCards<T extends { markX: number; w: number }>(cards: T[]): (T & { x: number; tier: number })[] {
    const rights: number[] = [];
    return [...cards]
      .sort((a, b) => a.markX - b.markX)
      .map((c) => {
        const desired = Math.min(Math.max(c.markX - c.w / 2, 8), width - c.w - 8);
        for (let t = 0; ; t++) {
          const left = Math.max(desired, (rights[t] ?? -Infinity) + C.CARD_GAP);
          if (left - desired <= c.w / 2 - 16 || t >= 2) {
            rights[t] = left + c.w;
            return { ...c, x: left, tier: t };
          }
        }
      });
  }

  const commitmentDraft = tierCards(
    item.commitments.map((c) => ({ c, markX: X(c.requiredBy) + pxPerDay / 2, ...cardText(commitmentLines(c)) })),
  );
  const commitTiers = commitmentDraft.length ? Math.max(...commitmentDraft.map((d) => d.tier)) + 1 : 0;
  const commitRowH = Math.max(0, ...commitmentDraft.map((d) => d.h)) + C.TIER_GAP;
  const commitBand = commitTiers ? commitTiers * commitRowH + C.LEADER_MIN : C.LEADER_MIN;

  /* ---- the bar ---- */
  const barTop = C.TOP_PAD + commitBand;
  const barBottom = barTop + C.H;
  const cy = barTop + C.H / 2;

  const commitments: ChainCard[] = commitmentDraft.map((d) => {
    const bottom = barTop - C.LEADER_MIN - d.tier * commitRowH;
    const y = bottom - d.h;
    const markY = barTop;
    const lx = Math.min(Math.max(d.markX, d.x + 12), d.x + d.w - 12);
    return {
      id: d.c.id,
      kind: 'commitment',
      markX: d.markX,
      markY,
      x: d.x,
      y,
      w: d.w,
      h: d.h,
      tier: d.tier,
      text: block(d.x + d.w / 2, y + C.CARD_PAD_Y, 'middle', d.lines),
      leader: { x1: lx, y1: bottom, x2: d.markX, y2: markY - C.COMMIT_MARK / 2 },
      commitment: d.c,
    };
  });

  /* ---- segments: one continuous chain of chevrons ---- */
  const phases = item.steps.filter((s) => s.kind === 'phase');

  /**
   * WHERE WORK THAT FINISHES ON A DATE ENDS, ON SCREEN. The single rule
   * shared by a chevron's right edge and every finish milestone, so the two
   * can never disagree (corrected 2026-11-07: they used to be computed
   * separately, and every milestone falling before a weekend or holiday sat
   * days inside its chevron instead of at its end).
   *
   * Work finishing before more work follows ends at the start of the next
   * working day - the chevron reaches across the non-working days between,
   * so the chain stays one continuous bar. The chain's final work ends at
   * the calendar end of its last day, which is the Required On Site instant.
   * Both are pure functions of the date; nothing is positioned by hand.
   */
  const lastWorkEnd = phases.length ? phases[phases.length - 1].endDate : null;
  const workEndX = (date: string) =>
    lastWorkEnd !== null && date < lastWorkEnd ? X(iso(nextWorkday(parse(date)))) : X(date) + pxPerDay;

  const spans = phases.map((s) => ({ s, x0: X(s.startDate), x1: workEndX(s.endDate) }));
  /** Depth of the joint at the right edge of span i, shared with its neighbour. */
  const jointD = spans.map((sp, i) => {
    const w = sp.x1 - sp.x0;
    const next = spans[i + 1];
    const adjacent = next && Math.abs(next.x0 - sp.x1) < 0.5;
    return Math.min(C.D, w * 0.35, adjacent ? (next.x1 - next.x0) * 0.35 : Infinity);
  });

  const segments: ChainSegment[] = spans.map((sp, i) => {
    const { s, x0, x1 } = sp;
    const first = i === 0;
    const prevAdjacent = i > 0 && Math.abs(spans[i - 1].x1 - x0) < 0.5;
    const dL = first ? 0 : prevAdjacent ? jointD[i - 1] : Math.min(C.D, (x1 - x0) * 0.35);
    const dR = jointD[i];
    const y0 = barTop;
    const y1 = barBottom;
    // Joints are centred on the boundary date, so each chevron's area is
    // exactly its span x H: the point adds what the notch removes.
    const xr = x1 - dR / 2 - C.G / 2;
    const tip = x1 + dR / 2 - C.G / 2;
    let path: string;
    let innerL: number;
    if (first) {
      const r = Math.min(C.H / 2, (x1 - x0) / 3);
      path = `M${x0 + r} ${y0} L${xr} ${y0} L${tip} ${cy} L${xr} ${y1} L${x0 + r} ${y1} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
      innerL = x0 + r * 0.6 + C.INNER_PAD;
    } else {
      const xl = x0 - dL / 2 + C.G / 2;
      const notch = x0 + dL / 2 + C.G / 2;
      path = `M${xl} ${y0} L${xr} ${y0} L${tip} ${cy} L${xr} ${y1} L${xl} ${y1} L${notch} ${cy} Z`;
      innerL = notch + C.INNER_PAD;
    }
    const innerR = xr - C.INNER_PAD;
    const innerW = innerR - innerL;

    const name = label(s);
    const oneW = measure(name, FONT.chevron);
    let lines: string[] | null = null;
    if (C.ICON + C.ICON_GAP + oneW <= innerW) lines = [name];
    else {
      const two = splitTwo(name, measure);
      if (two && C.ICON + C.ICON_GAP + Math.max(...two.map((t) => measure(t, FONT.chevron))) <= innerW) lines = two;
    }

    if (lines) {
      const textW = Math.max(...lines.map((t) => measure(t, FONT.chevron)));
      const gx = innerL + (innerW - (C.ICON + C.ICON_GAP + textW)) / 2;
      const textTop = cy - (lines.length * LINE_H.chevron) / 2;
      return {
        step: s, family: s.family, x0, x1, path, tier: 'A',
        icon: { x: gx, y: cy - C.ICON / 2 },
        inner: block(gx + C.ICON + C.ICON_GAP, textTop, 'start', lines.map((t) => ({ text: t, font: 'chevron' }))),
      };
    }
    if (C.ICON <= innerW) {
      return {
        step: s, family: s.family, x0, x1, path, tier: 'B',
        icon: { x: innerL + (innerW - C.ICON) / 2, y: cy - C.ICON / 2 }, inner: null,
      };
    }
    return { step: s, family: s.family, x0, x1, path, tier: 'C', icon: null, inner: null };
  });

  /* ---- milestones: instants, stacked when they share one (51.14) ---- */
  const milestoneSteps = item.steps.filter((s) => s.kind === 'milestone');
  // A finish milestone sits where the work it completes ends (workEndX); a
  // start milestone where the work it opens begins. Always from the date.
  const mx = (s: ScheduleStep) => (s.milestoneAnchor === 'start' ? X(s.startDate) : workEndX(s.startDate));
  const groups = new Map<number, ScheduleStep[]>();
  for (const s of milestoneSteps) {
    const k = Math.round(mx(s) * 100);
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  const milestones: ChainMilestone[] = milestoneSteps.map((s) => {
    const g = groups.get(Math.round(mx(s) * 100))!;
    const k = g.length;
    const j = g.indexOf(s);
    const isRos = s.family === 'required';
    return {
      step: s,
      x: mx(s),
      y: cy + (j - (k - 1) / 2) * C.STACK_SPACING,
      size: isRos ? C.DIAMOND * C.ROS_SCALE : C.DIAMOND,
      isRos,
      stackIndex: j,
      stackSize: k,
    };
  });

  /* ---- labels below the bar: durations first, then milestone blocks,
     each dropped to the first free row (skyline placement). ---- */
  const labelBase = barBottom + C.LABEL_TOP_GAP;
  const placed: { x: number; y: number; w: number; h: number }[] = item.issues.map((i) => {
    const x = X(i.identifiedOn) + pxPerDay / 2;
    return { x: x - C.ISSUE_MARK / 2 - 4, y: barBottom, w: C.ISSUE_MARK + 8, h: C.ISSUE_MARK + 4 };
  });
  const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
    a.x < b.x + b.w + C.LABEL_PAD_X && b.x < a.x + a.w + C.LABEL_PAD_X && a.y < b.y + b.h && b.y < a.y + a.h;
  const place = (cx: number, w: number, h: number) => {
    const candidates = [labelBase, ...placed.map((p) => p.y + p.h + 4)].filter((y) => y >= labelBase).sort((a, b) => a - b);
    for (const y of candidates) {
      const box = { x: cx - w / 2, y, w, h };
      if (!placed.some((p) => overlaps(box, p))) {
        placed.push(box);
        return box;
      }
    }
    const y = Math.max(labelBase, ...placed.map((p) => p.y + p.h + 4));
    const box = { x: cx - w / 2, y, w, h };
    placed.push(box);
    return box;
  };

  const labels: ChainLabel[] = [];
  for (const seg of segments) {
    const lines: TextLine[] =
      seg.tier === 'A'
        ? [{ text: workdays(seg.step.durationWorkdays), font: 'duration', tone: 'secondary' }]
        : [
            { text: label(seg.step), font: 'label' },
            { text: workdays(seg.step.durationWorkdays), font: 'duration', tone: 'secondary' },
          ];
    const cx = (seg.x0 + seg.x1) / 2;
    const w = blockWidth(lines, measure);
    // Tier C keeps its duration only where the span can hold it.
    if (seg.tier === 'C' && w > seg.x1 - seg.x0) continue;
    const box = place(cx, w, blockHeight(lines));
    labels.push({ key: `dur-${seg.step.id}`, box, text: block(cx, box.y, 'middle', lines), stem: null });
  }
  for (const steps of groups.values()) {
    if (steps.some((s) => s.family === 'required')) continue; // labelled to the right
    const x = mx(steps[0]);
    const sameDate = steps.every((s) => s.startDate === steps[0].startDate);
    const lines: TextLine[] = sameDate
      ? [...steps.map((s) => ({ text: label(s), font: 'label' as const })), { text: formatDate(steps[0].startDate), font: 'labelDate', tone: 'secondary' }]
      : steps.flatMap((s) => [
          { text: label(s), font: 'label' as const },
          { text: formatDate(s.startDate), font: 'labelDate' as const, tone: 'secondary' as const },
        ]);
    const box = place(x, blockWidth(lines, measure), blockHeight(lines));
    labels.push({
      key: `ms-${steps[0].id}`,
      box,
      text: block(x, box.y, 'middle', lines),
      stem: box.y > labelBase + 1 ? { x, y1: barBottom + 2, y2: box.y - 3 } : null,
    });
  }
  const labelBottom = Math.max(labelBase, ...labels.map((l) => l.box.y + l.box.h));

  /* ---- issue cards, below the labels ---- */
  const issueDraft = tierCards(
    item.issues.map((i) => ({ i, markX: X(i.identifiedOn) + pxPerDay / 2, ...cardText(issueLines(i)) })),
  );
  const issueRowH = Math.max(0, ...issueDraft.map((d) => d.h)) + C.TIER_GAP;
  const issueTop = labelBottom + C.LEADER_MIN;
  const issues: ChainCard[] = issueDraft.map((d) => {
    const y = issueTop + d.tier * issueRowH;
    const markY = barBottom + C.ISSUE_MARK / 2 + 2;
    const lx = Math.min(Math.max(d.markX, d.x + 12), d.x + d.w - 12);
    return {
      id: d.i.id,
      kind: 'issue',
      markX: d.markX,
      markY,
      x: d.x,
      y,
      w: d.w,
      h: d.h,
      tier: d.tier,
      text: block(d.x + d.w / 2, y + C.CARD_PAD_Y, 'middle', d.lines),
      leader: { x1: d.markX, y1: markY + C.ISSUE_MARK / 2, x2: lx, y2: y },
      issue: d.i,
    };
  });
  const issueTiers = issueDraft.length ? Math.max(...issueDraft.map((d) => d.tier)) + 1 : 0;
  const issueBottom = issueTiers ? issueTop + issueTiers * issueRowH - C.TIER_GAP : labelBottom;

  /* ---- calendar axis ---- */
  const axisY = issueBottom + 28;
  const months: ChainLayout['axis']['months'] = [];
  for (const c = new Date(ds); c < de; c.setUTCMonth(c.getUTCMonth() + 1)) {
    const major = months.length === 0 || c.getUTCMonth() === 0;
    months.push({
      x: X(iso(c)),
      label: c.toLocaleDateString('en-US', { month: 'short', ...(major ? { year: 'numeric' } : {}), timeZone: 'UTC' }),
      major,
    });
  }

  /* ---- Required On Site: the controlling deadline ---- */
  const rosMs = milestones.find((m) => m.isRos) ?? null;
  const ros = rosMs
    ? {
        x: rosMs.x,
        ruleTop: C.TOP_PAD,
        ruleBottom: axisY,
        text: block(rosMs.x + rosMs.size / 2 + 14, cy - (LINE_H.rosTitle + LINE_H.rosBody * 2) / 2, 'start', [
          { text: label(rosMs.step), font: 'rosTitle' },
          { text: formatDate(rosMs.step.startDate), font: 'rosBody' },
          { text: 'Fixed', font: 'rosBody', tone: 'secondary' },
        ]),
      }
    : null;

  const activityWorkdays = phases.reduce((n, s) => n + s.durationWorkdays, 0);
  const revealOrder = [
    ...[...item.steps].sort((a, b) => (a.endDate === b.endDate ? item.steps.indexOf(b) - item.steps.indexOf(a) : a.endDate < b.endDate ? 1 : -1)).map((s) => s.id),
    ...item.commitments.map((c) => c.id),
    ...item.issues.map((i) => i.id),
  ];

  return {
    width,
    height: axisY + C.AXIS_H,
    pxPerDay,
    domainStart: iso(ds),
    barTop,
    barBottom,
    cy,
    segments,
    milestones,
    commitments,
    issues,
    labels,
    ros,
    axis: { y: axisY, months },
    summary: {
      startDate: item.startDate,
      requiredOnSiteDate: item.requiredOnSiteDate,
      totalWorkdays: item.durationWorkdays,
      activityWorkdays,
    },
    revealOrder,
  };
}
