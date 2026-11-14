import { useCallback, useEffect, useRef, useState } from 'react';
import { useEscapeToDismiss, type Anchor, type InspectTarget } from './PhaseInspector';

/**
 * THE MARK INSPECTION STATE, shared by every surface that draws schedule
 * marks: the full Gantt and the homepage Build-the-chain comparison.
 *
 * Extracted from DemoGantt without behavioural change (Decision Log
 * 2026-11-06). Everything below is the logic that used to live inline there;
 * the comments are carried with it.
 *
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

/** Every inspectable mark carries one of these classes. */
export const MARK_SELECTOR = 'button.jpd-step, button.jpd-commit, button.jpd-issue';

/**
 * The card is placed against the ROW, not the cursor, so the row rect is
 * captured alongside the segment. `rowId` lets the inspector hold its
 * position while the visitor scrubs along one procurement path.
 */
export function makeAnchor(el: HTMLElement, target: InspectTarget, rowId: string): Anchor {
  const row = el.closest('[data-gantt-row]') as HTMLElement | null;
  return {
    segRect: el.getBoundingClientRect(),
    rowRect: (row ?? el).getBoundingClientRect(),
    rowId,
    target,
  };
}

export type MarkHandlers = {
  onPointerEnter: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export function useMarkInspection(enabled: boolean) {
  const [hovered, setHovered] = useState<Anchor | null>(null);
  const [focused, setFocused] = useState<Anchor | null>(null);
  const [pinned, setPinned] = useState<Anchor | null>(null);
  const anchor = focused ?? hovered ?? pinned;

  /** The element the hover bubble currently belongs to. */
  const activeElRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    activeElRef.current = null;
    setHovered(null);
    setFocused(null);
    setPinned(null);
  }, []);
  useEscapeToDismiss(!!anchor, dismiss);

  /** Clears transient pointer state only. */
  const clearHover = useCallback(() => {
    activeElRef.current = null;
    setHovered(null);
  }, []);

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
      if (under && under.closest(MARK_SELECTOR)) return;

      activeElRef.current = null;
      setHovered(null);
    };
    document.addEventListener('pointermove', onMove, true);
    return () => document.removeEventListener('pointermove', onMove, true);
  }, [hovered]);

  // Touch: a tap anywhere that is not a segment clears the pinned card.
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest(MARK_SELECTOR)) setPinned(null);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [pinned]);

  /** Clears an intentional touch pin only. */
  const clearPin = useCallback(() => setPinned(null), []);

  /** The five handlers every mark carries, for one target on one row. */
  const handlersFor = (target: InspectTarget, rowId: string): MarkHandlers => ({
    onPointerEnter: (e) => {
      if (!enabled || e.pointerType !== 'mouse') return;
      const el = e.currentTarget as HTMLElement;
      activeElRef.current = el;
      setHovered(makeAnchor(el, target, rowId));
    },
    // Touch and pen pin intentionally; a mouse click never creates persistent
    // state, so it cannot go stale.
    onPointerUp: (e) => {
      if (!enabled || e.pointerType === 'mouse') return;
      e.stopPropagation();
      setPinned(makeAnchor(e.currentTarget as HTMLElement, target, rowId));
    },
    onFocus: (e) => {
      if (!enabled) return;
      setFocused(makeAnchor(e.currentTarget as HTMLElement, target, rowId));
    },
    onBlur: () => setFocused(null),
    onClick: (e) => e.stopPropagation(),
  });

  return { anchor, hovered, pinned, dismiss, clearHover, clearPin, handlersFor };
}
