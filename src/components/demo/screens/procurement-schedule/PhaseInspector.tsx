import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  COMMITMENT_STATUS_LABEL,
  PACKAGE_HEALTH_LABEL,
  PHASE_FAMILIES,
  STATUS_LABEL,
  parse,
  type CommitmentStatus,
  type PackageHealth,
  type ScheduleCommitment,
  type ScheduleIssue,
  type ScheduleItem,
  type ScheduleStep,
} from './scheduleModel';
import { useInspection } from '../../inspection';

/**
 * The phase/milestone inspection layer.
 *
 * WHY THIS IS A PORTAL, NOT A CHILD. The JiTpro canvas is drawn at 1448px and
 * scaled to its container - roughly 0.30 in the Learn More column and 0.77 in
 * the expanded dialog. A popover rendered inside that transformed subtree would
 * inherit the scale and set its 13px type at 4px. So the popover renders
 * OUTSIDE the transform and is anchored from the inspected element's
 * `getBoundingClientRect()`, which already reports post-transform viewport
 * coordinates.
 *
 * WHY THE PORTAL TARGET IS INJECTED. The production expanded view is a native
 * <dialog> opened with `showModal()`, which lives in the browser's top layer.
 * Anything portalled to `document.body` paints UNDERNEATH it. The presentation
 * environment therefore supplies its own container through context, and the
 * schedule never needs to know which surface it is on.
 */

const FAMILY_LABEL = Object.fromEntries(PHASE_FAMILIES.map((f) => [f.key, f.label]));

function fmt(d: string) {
  return parse(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const STATUS_TONE: Record<string, { bg: string; bd: string; fg: string }> = {
  complete: { bg: '#eef2f6', bd: '#d8dee6', fg: '#475569' },
  'on-track': { bg: '#e9f6e4', bd: '#cfe8c6', fg: '#217a3c' },
  'at-risk': { bg: '#fef2e1', bd: '#fadfba', fg: '#b7791f' },
  upcoming: { bg: '#f4f4f5', bd: '#e4e4e7', fg: '#6b7280' },
};

/**
 * WHAT IS BEING INSPECTED. Two kinds of record share one card, one placement
 * system and one dismissal path, because they are read the same way: point at
 * a mark, learn what it is and who owes it. A second tooltip system would have
 * meant a second set of placement bugs, and this one took real work to settle.
 *
 * Only the BODY of the card varies by kind. Everything outside this union -
 * anchoring, the viewport-half rule, clamping, the grace ring, focus and pin -
 * is deliberately unaware of which kind it is carrying.
 */
const COMMITMENT_TONE: Record<CommitmentStatus, { bg: string; bd: string; fg: string }> = {
  complete: { bg: '#eef2f6', bd: '#d8dee6', fg: '#475569' },
  committed: { bg: '#e9f6e4', bd: '#cfe8c6', fg: '#217a3c' },
  'beyond-required': { bg: '#fdeaea', bd: '#f6c9c9', fg: '#b02a2a' },
  open: { bg: '#fdf0f6', bd: '#f4cfe0', fg: '#a3266a' },
};

export type InspectTarget =
  | { kind: 'step'; step: ScheduleStep }
  | { kind: 'commitment'; commitment: ScheduleCommitment }
  | { kind: 'issue'; issue: ScheduleIssue; item: ScheduleItem };

/** Identity of whatever is being inspected, for the active-mark highlight. */
export function targetId(t: InspectTarget): string {
  return t.kind === 'step' ? t.step.id : t.kind === 'commitment' ? t.commitment.id : t.issue.id;
}

export type Anchor = {
  /** The inspected segment. Used for horizontal intent and the highlight. */
  segRect: DOMRect;
  /** The whole procurement row. This is the band the card must not cover. */
  rowRect: DOMRect;
  /** Row identity, so the card can stay put while scrubbing within one row. */
  rowId: string;
  target: InspectTarget;
};

/**
 * PLACEMENT: ABOVE OR BELOW THE ROW. NEVER BESIDE IT.
 *
 * The card clears the whole procurement ROW plus a margin, because reading a
 * path means moving horizontally along it and the card must not sit on the
 * sequence being read.
 *
 * THE ABOVE/BELOW DECISION IS PURELY POSITIONAL. It compares the row's centre
 * against the viewport midpoint and nothing else:
 *
 *   row centre in the top half    -> card BELOW the row
 *   row centre in the bottom half -> card ABOVE the row
 *
 * It deliberately does NOT ask whether the card fits. The previous version
 * did, and that was the bug: it tried above, then below, then fell back to a
 * side placement. Because card height varies with description length, two
 * neighbouring segments on the SAME row could get different answers from the
 * fit test, so the card flipped between below, above and left as the cursor
 * moved horizontally. A rule that depends only on the row's position in the
 * viewport gives every segment on a row the same answer.
 *
 * There is no side placement at all. Horizontal overflow is solved by clamping
 * the card into the viewport while keeping it above or below the row.
 *
 * THE CARD IS ANCHORED BY THE EDGE FACING THE ROW, AND GROWS AWAY FROM IT.
 *
 *   below -> `top`    is pinned to the row's bottom; the card grows downward
 *   above -> `bottom` is pinned to the row's top;    the card grows upward
 *
 * This is the whole fix, and it is why the card's height is no longer measured
 * anywhere in this file. The previous version computed `top` for the ABOVE
 * case as `rowTop - margin - height`, then clamped the result into the
 * viewport. Both halves of that were wrong:
 *
 *   1. Height is content-dependent - the title wraps at two lines for some
 *      phases, `whatIsOwed` runs two or three - so `top` moved by tens of
 *      pixels between neighbouring segments on the SAME row. The card jumped
 *      vertically while scrubbing horizontally, which is the very flip the
 *      viewport-half rule was introduced to remove.
 *   2. Clamping a card that does not fit its band slid it back ACROSS the row,
 *      covering the bar being inspected. On any viewport shorter than roughly
 *      920px that happened for every row near the midpoint - and because the
 *      clamp fires on height, it fired for some segments of a row and not
 *      others, reintroducing the flip a second way.
 *
 * Pinning the near edge makes both impossible by construction. The anchored
 * edge is a pure function of the row rect, so content height cannot move it,
 * and the card can only ever extend into space the row does not occupy.
 *
 * OVERFLOW IS ABSORBED BY THE BAND, NOT BY MOVING THE CARD. The card carries a
 * `max-height` equal to the space between the row and the viewport edge, and
 * scrolls internally beyond it. The viewport-half rule guarantees that band is
 * never pathological: the chosen side is always the roomier one, so the band
 * is at least about half the viewport less the row.
 *
 * HYSTERESIS. While inspecting one row, a centre within 60px of the midpoint
 * keeps the previous decision, so a row sitting almost exactly on the centre
 * line cannot rapidly flip. It is scoped to the same row on purpose: one row
 * must never inherit a placement decided for another.
 *
 * SCRUB STABILITY. Horizontal position follows the segment, but only once it
 * has drifted more than a dead zone. Moving between neighbouring phases
 * updates the card's CONTENT while the card itself stays put.
 */
const CARD_W = 320;
const BAND_MARGIN = 18;
const EDGE = 10;
/** How far the segment must move horizontally before the card follows. */
const DEAD_ZONE = 200;
/** Neutral zone around the viewport midpoint where the last choice is kept. */
const FLIP_HYSTERESIS = 60;
/**
 * Floor for the band, for the degenerate case of a row sitting hard against
 * the viewport edge it was placed away from. A sliver of a card reads as a
 * rendering fault; a card that overhangs by a few pixels does not.
 */
const MIN_BAND = 160;

/**
 * One of `top`/`bottom` is a number and the other is null: the number is the
 * edge pinned to the row. Never both, or the card would be stretched between
 * them and height would stop being content-driven.
 */
type Placement = {
  left: number;
  top: number | null;
  bottom: number | null;
  maxH: number;
};

export default function PhaseInspector({ anchor }: { anchor: Anchor | null }) {
  const { portalTarget } = useInspection();
  const [pos, setPos] = useState<Placement | null>(null);
  const last = useRef<{ rowId: string; left: number; below: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!anchor) {
      setPos(null);
      last.current = null;
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { rowRect, segRect } = anchor;

    // --- vertical: viewport half decides, with a neutral zone -------------
    const rowCentreY = rowRect.top + rowRect.height / 2;
    const midY = vh / 2;
    const prev = last.current;

    // Hysteresis applies only while inspecting the SAME row - it exists to
    // absorb small movements of one row around the midpoint (a scroll, say),
    // not to let one row inherit a decision made for another. Moving to a
    // different row always decides afresh from that row's own position.
    const sameRowAsLast = prev != null && prev.rowId === anchor.rowId;
    const below =
      sameRowAsLast && Math.abs(rowCentreY - midY) < FLIP_HYSTERESIS
        ? prev.below
        : rowCentreY < midY;

    // Pin the edge that faces the row and let the card grow into the band on
    // the far side of it. Neither branch reads the card's height, so nothing
    // about the content can move the anchored edge, and there is no vertical
    // clamp that could slide the card back over the row.
    const top = below ? rowRect.bottom + BAND_MARGIN : null;
    const bottom = below ? null : vh - rowRect.top + BAND_MARGIN;
    const band = below
      ? vh - rowRect.bottom - BAND_MARGIN - EDGE
      : rowRect.top - BAND_MARGIN - EDGE;
    const maxH = Math.max(band, MIN_BAND);

    // --- horizontal: follow the segment, clamp to the viewport ------------
    const desired = segRect.left + segRect.width / 2 - CARD_W / 2;
    let left =
      sameRowAsLast && Math.abs(desired - prev.left) < DEAD_ZONE ? prev.left : desired;
    left = Math.min(Math.max(left, EDGE), Math.max(EDGE, vw - CARD_W - EDGE));

    last.current = { rowId: anchor.rowId, left, below };
    setPos({ left, top, bottom, maxH });
  }, [anchor]);

  if (!anchor) return null;

  const target = portalTarget ?? document.body;

  return createPortal(
    <div
      className="jpd-pop"
      role="tooltip"
      style={{
        left: pos ? pos.left : 0,
        // Exactly one of these is a length; the other must be `auto` so the
        // card is anchored by one edge and sized by its content, not stretched
        // between two edges.
        top: pos ? (pos.top ?? 'auto') : 0,
        bottom: pos ? (pos.bottom ?? 'auto') : 'auto',
        maxHeight: pos ? pos.maxH : undefined,
        // The band, not the card, is what gives out first on a short viewport.
        // The card clips and scrolls rather than overhanging the screen or
        // being pushed back across the row it is describing.
        overflowY: 'auto',
        // Hidden for the single layout pass that resolves the placement. The
        // node itself persists across segments, so moving along a row updates
        // the content in place with no close/reopen flicker.
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      {anchor.target.kind === 'step' ? (
        <StepBody s={anchor.target.step} />
      ) : anchor.target.kind === 'commitment' ? (
        <CommitmentBody c={anchor.target.commitment} />
      ) : (
        <IssueBody i={anchor.target.issue} item={anchor.target.item} />
      )}
    </div>,
    target,
  );
}

/**
 * The procurement-activity body. Unchanged from before commitments existed -
 * a phase or handoff milestone reads exactly as it always did.
 */
function StepBody({ s }: { s: ScheduleStep }) {
  const tone = STATUS_TONE[s.status];
  return (
    <>
    <div className="jpd-pop__kicker">
      {FAMILY_LABEL[s.family]}
      {s.kind === 'milestone' ? ' · Milestone' : ''}
    </div>
    <div className="jpd-pop__title">{s.name}</div>

    <div style={{ marginTop: 7 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 5,
          background: tone.bg,
          border: `1px solid ${tone.bd}`,
          color: tone.fg,
        }}
      >
        {STATUS_LABEL[s.status]}
      </span>
    </div>

    {/* Ball in court is the loudest thing after the task name, by design. */}
    <div className="jpd-pop__ball">
      <div className="jpd-pop__label">Ball in court</div>
      <div className="jpd-pop__person">{s.commitmentOwnerName}</div>
      <div className="jpd-pop__org">
        {s.commitmentOwnerRole} · {s.responsibleOrganization}
      </div>
    </div>

    <div className="jpd-pop__section">
      <div className="jpd-pop__slabel">
        {s.kind === 'milestone' ? 'Milestone date' : 'Dates'}
      </div>
      <div className="jpd-pop__dates">
        {s.kind === 'milestone'
          ? fmt(s.startDate)
          : `${fmt(s.startDate)} → ${fmt(s.endDate)}`}
      </div>
      {s.kind === 'phase' && (
        <div className="jpd-pop__text" style={{ marginTop: 1 }}>
          {s.durationWorkdays} working days
        </div>
      )}
    </div>

    <div className="jpd-pop__section">
      <div className="jpd-pop__slabel">
        {s.kind === 'milestone' ? 'What must be true' : 'What is owed'}
      </div>
      <div className="jpd-pop__text">{s.whatIsOwed}</div>
    </div>

    {s.nextHandoffLabel && (
      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Next handoff</div>
        <div className="jpd-pop__text">
          {s.nextHandoffLabel} · {s.nextHandoffParty}
        </div>
      </div>
    )}

    <div className="jpd-pop__foot">
      <span className="jpd-pop__slabel">Required on-site</span>
      <span className="jpd-pop__ros">{fmt(s.requiredOnSiteDate)}</span>
    </div>
    </>
  );
}

/**
 * The external-commitment body.
 *
 * Ordered to answer, in one pass: what is owed, who owes it, when the SCHEDULE
 * needs it, what stops without it, and what the responsible party actually
 * agreed to. Required By is set above Committed For and given the heavier
 * treatment, because the requirement is the fact and the commitment is the
 * promise - a card that let them read as equals would invite exactly the
 * substitution the data model refuses to make.
 */
function CommitmentBody({ c }: { c: ScheduleCommitment }) {
  const tone = COMMITMENT_TONE[c.status];
  return (
    <>
      <div className="jpd-pop__kicker">{c.typeLabel}</div>
      <div className="jpd-pop__title">{c.name}</div>

      <div style={{ marginTop: 7 }}>
        <span className="jpd-pop__badge" style={{ background: tone.bg, borderColor: tone.bd, color: tone.fg }}>
          {COMMITMENT_STATUS_LABEL[c.status]}
        </span>
      </div>

      {/* Who owes it. The role leads, because the role is what survives a
          change of personnel on a two-year project. */}
      <div className="jpd-pop__ball">
        <div className="jpd-pop__label">Owned by</div>
        <div className="jpd-pop__person">{c.ownerRole}</div>
        <div className="jpd-pop__org">
          {c.ownerName} · {c.ownerOrganization}
        </div>
      </div>

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Required by</div>
        <div className="jpd-pop__dates">{fmt(c.baselineRequiredBy ?? c.requiredBy)}</div>
        <div className="jpd-pop__text" style={{ marginTop: 1 }}>
          {c.baselineRequiredBy
            ? `Original requirement. The forecast has since re-planned around the actual and now needs it ${fmt(c.requiredBy)}.`
            : 'Set by the schedule, not by agreement.'}
        </div>
      </div>

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Committed for</div>
        <div className="jpd-pop__dates" style={{ color: c.committedFor ? undefined : 'var(--jpd-text-muted)' }}>
          {c.committedFor ? fmt(c.committedFor) : 'Not yet committed'}
        </div>
        {c.varianceWorkdays !== null && c.varianceWorkdays !== 0 && (
          <div
            className="jpd-pop__text"
            style={{
              marginTop: 1,
              fontWeight: 600,
              color: c.varianceWorkdays > 0 ? 'var(--jpd-commitment-late)' : 'var(--jpd-text-body)',
            }}
          >
            {c.varianceWorkdays > 0
              ? `${c.varianceWorkdays} working days beyond required`
              : `${-c.varianceWorkdays} working days ahead of required`}
          </div>
        )}
      </div>

      {/* Where an actual was recorded, the miss is stated on the commitment
          itself, not only on the issue that reports it. */}
      {c.completedDate && c.completionVarianceWorkdays != null && (
        <div className="jpd-pop__section">
          <div className="jpd-pop__slabel">Completed</div>
          <div className="jpd-pop__dates">{fmt(c.completedDate)}</div>
          {c.completionVarianceWorkdays !== 0 && (
            <div
              className="jpd-pop__text"
              style={{
                marginTop: 1,
                fontWeight: 600,
                color:
                  c.completionVarianceWorkdays > 0
                    ? 'var(--jpd-commitment-late)'
                    : 'var(--jpd-text-body)',
              }}
            >
              {c.completionVarianceWorkdays > 0
                ? `${c.completionVarianceWorkdays} working days late`
                : `${-c.completionVarianceWorkdays} working days early`}
            </div>
          )}
        </div>
      )}

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Required for</div>
        <div className="jpd-pop__text">{c.requiredForStepName}</div>
      </div>

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">What is owed</div>
        <div className="jpd-pop__text">{c.description}</div>
      </div>

      {c.completedDate && (
        <div className="jpd-pop__foot">
          <span className="jpd-pop__slabel">Provided</span>
          <span className="jpd-pop__ros">{fmt(c.completedDate)}</span>
        </div>
      )}
    </>
  );
}

const HEALTH_TONE: Record<PackageHealth, { bg: string; bd: string; fg: string }> = {
  healthy: { bg: 'var(--jpd-ok-bg)', bd: 'var(--jpd-ok-border)', fg: 'var(--jpd-ok-fg)' },
  'at-risk': { bg: 'var(--jpd-warn-bg)', bd: 'var(--jpd-warn-border)', fg: 'var(--jpd-warn-fg)' },
  impacted: { bg: 'var(--jpd-error-bg)', bd: 'var(--jpd-error-border)', fg: 'var(--jpd-error-fg)' },
};

/**
 * The issue body.
 *
 * Built to be read top-down and stopped at any point: what happened, why, what
 * it did, and - the line that matters most to the field - whether the date the
 * material is needed still holds. That answer is given in words rather than as
 * two dates the reader has to compare for themselves.
 *
 * Where an issue has a root commitment, its dates are READ FROM that record
 * rather than restated here, so the issue card and the commitment card can
 * never disagree about when something was required, agreed or delivered.
 */
function IssueBody({ i, item }: { i: ScheduleIssue; item: ScheduleItem }) {
  const tone = HEALTH_TONE[item.health];
  const met = item.forecastVarianceWorkdays === 0;
  const rc = i.rootCommitment;
  return (
    <>
      <div className="jpd-pop__kicker">{i.kindLabel}</div>
      <div className="jpd-pop__title">{i.title}</div>

      <div style={{ marginTop: 7 }}>
        <span
          className="jpd-pop__badge"
          style={{ background: tone.bg, borderColor: tone.bd, color: tone.fg }}
        >
          {PACKAGE_HEALTH_LABEL[item.health]}
        </span>
      </div>

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Identified</div>
        <div className="jpd-pop__dates">{fmt(i.identifiedOn)}</div>
        <div className="jpd-pop__text" style={{ marginTop: 3 }}>
          {i.cause}
        </div>
      </div>

      {/* Lead-time risk: the two assumptions, and what the path had to do. */}
      {i.baselineLeadWorkdays != null && i.currentLeadWorkdays != null && (
        <div className="jpd-pop__section">
          <div className="jpd-pop__slabel">Lead time</div>
          <div className="jpd-pop__dates">
            {i.baselineLeadWorkdays} to {i.currentLeadWorkdays} working days
          </div>
          {item.baseline && item.baseline.pathAdvancedWorkdays > 0 && (
            <div className="jpd-pop__text" style={{ marginTop: 1 }}>
              Procurement path advanced {item.baseline.pathAdvancedWorkdays} working days
            </div>
          )}
        </div>
      )}

      {/* Missed commitment: the root record, read not copied. */}
      {rc && (
        <div className="jpd-pop__ball">
          <div className="jpd-pop__label">Owed by</div>
          <div className="jpd-pop__person">{rc.ownerRole}</div>
          <div className="jpd-pop__org">{rc.name}</div>
          <div className="jpd-pop__cmp">
            <span>Required by</span>
            <span>{fmt(rc.baselineRequiredBy ?? rc.requiredBy)}</span>
          </div>
          {rc.committedFor && (
            <div className="jpd-pop__cmp">
              <span>Committed for</span>
              <span>{fmt(rc.committedFor)}</span>
            </div>
          )}
          {rc.completedDate && (
            <div className="jpd-pop__cmp">
              <span>Completed</span>
              <span>{fmt(rc.completedDate)}</span>
            </div>
          )}
          {rc.completionVarianceWorkdays != null && rc.completionVarianceWorkdays > 0 && (
            <div className="jpd-pop__cmp jpd-pop__cmp--bad">
              <span>Variance</span>
              <span>+{rc.completionVarianceWorkdays} working days</span>
            </div>
          )}
        </div>
      )}

      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Impact</div>
        <div className="jpd-pop__text">{i.impact}</div>
      </div>

      {/* THE ANSWER THE READER CAME FOR. The requirement never moves; what is
          in question is only whether it is going to be met. */}
      <div className="jpd-pop__section">
        <div className="jpd-pop__slabel">Required on-site</div>
        <div className="jpd-pop__dates">{fmt(item.requiredOnSiteDate)}</div>
        {item.forecastOnSiteDate && (
          <div className="jpd-pop__cmp jpd-pop__cmp--bad" style={{ marginTop: 3 }}>
            <span>Current forecast</span>
            <span>
              {fmt(item.forecastOnSiteDate)} (+{item.forecastVarianceWorkdays} wd)
            </span>
          </div>
        )}
      </div>

      <div className="jpd-pop__foot">
        <span className="jpd-pop__slabel">Field requirement</span>
        <span
          className="jpd-pop__ros"
          style={{ color: met ? 'var(--jpd-ok-fg)' : 'var(--jpd-error-fg)' }}
        >
          {met ? 'Protected' : 'Not protected'}
        </span>
      </div>
    </>
  );
}

/**
 * Escape layering. The expanded dialog also closes on Escape, so an open
 * popover must consume the first press and let the second reach the modal.
 * Capture phase, because the dialog's own handler is on the document.
 */
export function useEscapeToDismiss(active: boolean, dismiss: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      dismiss();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, dismiss]);
}
