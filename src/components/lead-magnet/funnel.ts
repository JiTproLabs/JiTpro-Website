/**
 * The funnel event vocabulary and its transport.
 *
 * SPRINT 4 SHIPS THIS AS A NO-OP. The seven event names (plan §8.1) are fixed
 * now and the call sites are written now, so Sprint 6 turns the funnel on by
 * replacing one sender rather than by threading calls through finished
 * components. Until `lead_magnet_events` and `record-lead-magnet-event` exist
 * (Sprint 6), `sendFunnelEvent` deliberately does nothing.
 *
 * WHAT MAY NEVER BE SENT (Decisions D4.6, D4.7, §8.4): no email address, no
 * visitor or session id, no raw referrer, no UTMs, nothing personal. An event
 * is an anonymous count carrying an asset, a placement, and a page path. The
 * only per-visitor state is the impression-dedupe flag, which never leaves the
 * browser.
 */

import type { LeadMagnetId, LeadMagnetPlacement } from '../../content/leadMagnets';

/** The seven names, fixed by the plan. Implementation and reporting use these exactly. */
export const FUNNEL_EVENTS = [
  'cta_view',
  'cta_click',
  'form_view',
  'form_submit',
  'request_succeeded',
  'request_failed',
  'guide_opened',
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export type FunnelPayload = {
  event: FunnelEvent;
  assetId: LeadMagnetId;
  placement: LeadMagnetPlacement;
  pagePath: string;
};

const DEDUPE_KEY_PREFIX = 'jp.leadMagnet.ctaView.';

export type FunnelStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

/**
 * `cta_view` fires once per placement per session. Without this a visitor who
 * scrolls the band in and out of view repeatedly would inflate the impression
 * count and make every conversion rate meaningless.
 *
 * Returns true when this is the first sighting, and records it. A browser with
 * storage blocked reports every sighting as first: an over-count is a better
 * failure than a silently dropped funnel.
 */
export function shouldRecordImpression(
  assetId: LeadMagnetId,
  placement: LeadMagnetPlacement,
  store: FunnelStore | null,
): boolean {
  if (!store) return true;
  const key = `${DEDUPE_KEY_PREFIX}${assetId}.${placement}`;
  try {
    if (store.getItem(key) !== null) return false;
    store.setItem(key, '1');
    return true;
  } catch {
    return true;
  }
}

/**
 * Sprint 6 replaces this body with a `navigator.sendBeacon` call (fetch with
 * `keepalive` as the fallback) to `record-lead-magnet-event`. Its signature
 * and every call site are already correct.
 *
 * It never throws and never returns a promise the caller must handle:
 * analytics must not be able to break a capture.
 */
export function sendFunnelEvent(payload: FunnelPayload): void {
  /* Sprint 6 (plan §22). Intentionally inert: no network, no storage, no log.
     The payload is accepted and discarded so every call site is already
     correct when the sender is implemented. */
  void payload;
}

/** `cta_view`, deduplicated per placement per session. */
export function recordImpression(
  assetId: LeadMagnetId,
  placement: LeadMagnetPlacement,
  pagePath: string,
  store: FunnelStore | null,
): void {
  if (!shouldRecordImpression(assetId, placement, store)) return;
  sendFunnelEvent({ event: 'cta_view', assetId, placement, pagePath });
}
