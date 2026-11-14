import { targetId, type Anchor, type InspectTarget } from './PhaseInspector';
import type { ScheduleItem } from './scheduleModel';
import type { MarkHandlers } from './useMarkInspection';

/**
 * ONE PROCUREMENT ROW'S MARKS: its phases and milestones on the bar line,
 * its external commitments raised above it, and its issues below it.
 *
 * Extracted from DemoGantt without behavioural change (Decision Log
 * 2026-11-06) so the homepage Build-the-chain comparison draws Heritage Steel
 * through the very code the full schedule uses. EVERY POSITION IS DERIVED
 * FROM A DATE through the host's `x()`; nothing here authors a pixel width.
 *
 * Each duration phase and each milestone is its own DOM element, which is what
 * makes them independently inspectable and independently focusable. The row is
 * never a single bar, gradient or flat image.
 *
 * Rendered inside the host's `[data-gantt-row]` element, which the inspector
 * anchors against.
 */

const familyVar = (f: string) => `var(--jpd-phase-${f})`;

type Props = {
  item: ScheduleItem;
  /** Date -> px from the host's domain start, at the host's scale. */
  x: (date: string) => number;
  pxPerDay: number;
  rowHeight: number;
  enabled: boolean;
  anchor: Anchor | null;
  handlersFor: (target: InspectTarget, rowId: string) => MarkHandlers;
};

export default function ScheduleRowMarks({
  item: it,
  x,
  pxPerDay,
  rowHeight,
  enabled,
  anchor,
  handlersFor,
}: Props) {
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
   * MILESTONES ARE POINTS IN TIME (Design System Section 51.14).
   *
   * A finish milestone happens at the END of its date - the instant its
   * predecessor's bar ends - so its diamond sits on that bar's right edge. A
   * start milestone happens at the START of its date. The date is never moved
   * for spacing.
   *
   * Several milestones can share one instant (Approval and Release, Delivery
   * and Required On-Site). They are STACKED VERTICALLY at that same x: the
   * horizontal position still states the date exactly, and each keeps its own
   * mark, its own slice of the hit area and its own focus stop, in sequence
   * order top to bottom.
   */
  const milestoneX = (s: (typeof it.steps)[number]) =>
    x(s.startDate) + (s.milestoneAnchor === 'start' ? 0 : pxPerDay);
  const stacks = new Map<number, string[]>();
  for (const s of it.steps) {
    if (s.kind !== 'milestone') continue;
    const key = Math.round(milestoneX(s) * 100);
    stacks.set(key, [...(stacks.get(key) ?? []), s.id]);
  }
  const rowCY = rowHeight / 2;
  const stackOf = (s: (typeof it.steps)[number]) => {
    const ids = stacks.get(Math.round(milestoneX(s) * 100)) ?? [s.id];
    const k = ids.length;
    const j = ids.indexOf(s.id);
    const spacing = k > 1 ? Math.min(9, 18 / (k - 1)) : 0;
    const sliceH = hitH / k;
    const sliceTop = rowCY - hitH / 2 + j * sliceH;
    return { k, sliceTop, sliceH, markY: rowCY + (j - (k - 1) / 2) * spacing - sliceTop };
  };

  return (
    <>
      {it.steps.map((s) => {
        const isMilestone = s.kind === 'milestone';
        const isRos = s.family === 'required';
        const left = isMilestone ? milestoneX(s) : x(s.startDate);
        const w = Math.max(2, x(s.endDate) + pxPerDay - left);
        const stack = isMilestone ? stackOf(s) : null;
        const stacked = stack != null && stack.k > 1;

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
          style: stacked
            ? {
                left: hitLeft,
                width: hitW,
                top: stack.sliceTop,
                height: stack.sliceH,
                zIndex: 1,
              }
            : {
                left: hitLeft,
                width: hitW,
                top: '50%',
                height: hitH,
                transform: 'translateY(-50%)',
                // A finish milestone sits on the joint between two bars;
                // it is the more specific target there.
                ...(isMilestone ? { zIndex: 1 } : {}),
              },
          ...handlersFor({ kind: 'step', step: s }, it.id),
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
              {/* The rule spans the full mark height even when stacked; only
                  the cap takes a stack position. The rule never captures the
                  pointer, so it cannot steal a neighbour's slice. */}
              <span
                className="jpd-ros"
                style={
                  stacked
                    ? {
                        left: 7,
                        top: rowCY - hitH / 2 - stack.sliceTop + 2,
                        bottom: 'auto',
                        height: hitH - 4,
                        pointerEvents: 'none',
                      }
                    : { left: 7 }
                }
              />
              <span
                className="jpd-ros__cap"
                style={stacked ? { left: 8, top: stack.markY } : { left: 8 }}
              />
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
                style={{
                  left: 7,
                  background: familyVar(s.family),
                  ...(stacked ? { top: stack.markY } : {}),
                }}
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
        const isActive = anchor != null && targetId(anchor.target) === c.id;
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
              // Above the milestone layer, so the raised marker still wins.
              zIndex: 2,
            }}
            {...handlersFor(target, it.id)}
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
        const isActive = anchor != null && targetId(anchor.target) === is.id;
        const target: InspectTarget = { kind: 'issue', issue: is, item: it };
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
              zIndex: 2,
            }}
            {...handlersFor(target, it.id)}
          >
            <span className="jpd-issue__mark" />
          </button>
        );
      })}
    </>
  );
}
