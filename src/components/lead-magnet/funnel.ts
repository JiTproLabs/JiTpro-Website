/**
 * The funnel event vocabulary and its transport.
 *
 * Sprint 4 fixed the seven names (plan §8.1) and wrote every call site behind
 * an inert sender; Sprint 6 turned the funnel on by replacing that one
 * function, exactly as intended, with no call site touched.
 *
 * WHAT MAY NEVER BE SENT (Decisions D4.6, D4.7, §8.4): no email address, no
 * visitor or session id, no raw referrer, no UTMs, nothing personal. An event
 * is an anonymous count carrying an asset, a placement, and a page path. The
 * only per-visitor state is the impression-dedupe flag, which never leaves the
 * browser.
 */

import type { LeadMagnetId, LeadMagnetPlacement } from '../../content/leadMagnets';
import type { SubmitResult } from './leadCaptureMachine';

/**
 * The seven names, fixed by plan §8.1. Implementation and reporting use these
 * exactly, and the `lead_magnet_events` CHECK constraint is written from this
 * same list, so a name that drifts here fails at the database rather than
 * silently producing an unreadable funnel.
 */
export const FUNNEL_EVENTS = [
  'lead_magnet_cta_view',
  'lead_magnet_cta_click',
  'lead_magnet_form_view',
  'lead_magnet_form_submit',
  'lead_magnet_request_success',
  'lead_magnet_request_error',
  'lead_magnet_download_click',
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

/** The five classifications carried on a failed request (§6.4, §8.1). */
export const FUNNEL_ERROR_KINDS = [
  'network',
  'validation',
  'verification',
  'rate_limited',
  'server',
] as const;

export type FunnelErrorKind = (typeof FUNNEL_ERROR_KINDS)[number];

export type FunnelPayload = {
  event: FunnelEvent;
  assetId: LeadMagnetId;
  placement: LeadMagnetPlacement;
  pagePath: string;
  /**
   * Set ONLY on `lead_magnet_request_error` (§6.4). The database carries a
   * constraint to the same effect, because an `error_kind` attached to a
   * non-error event would corrupt the funnel silently.
   */
  errorKind?: FunnelErrorKind;
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
/** The wire body `record-lead-magnet-event` parses. Snake case, five keys. */
export function buildEventBody(payload: FunnelPayload): Record<string, unknown> {
  return {
    event_name: payload.event,
    asset_id: payload.assetId,
    placement: payload.placement,
    page_path: payload.pagePath,
    // §6.4: present only on the error event. The endpoint and the table both
    // reject it anywhere else, so sending it would lose the event.
    error_kind: payload.event === 'lead_magnet_request_error' ? (payload.errorKind ?? null) : null,
  };
}

/**
 * Sends one funnel event, and CANNOT break a capture.
 *
 * `sendBeacon` is used first because it survives the page unloading, which
 * matters for `lead_magnet_download_click`: the guide opens in a new tab and
 * the visitor may leave immediately. It is fire-and-forget by design and
 * returns only whether the browser queued the request, never what the server
 * said. `fetch` with `keepalive` is the fallback where `sendBeacon` is absent
 * or refuses (it has its own queue limits).
 *
 * Every failure path is swallowed. The endpoint answers 204 to everything for
 * the same reason: analytics must never be visible in the visitor experience
 * (contract approved 2026-09-16).
 */
export function sendFunnelEvent(payload: FunnelPayload): void {
  try {
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!baseUrl || !anonKey) return;

    const url = `${baseUrl}/functions/v1/record-lead-magnet-event`;
    const body = JSON.stringify(buildEventBody(payload));

    // sendBeacon cannot set the apikey header, so the key rides in the query
    // string, which is how a beacon authenticates to a Supabase function. The
    // anon key is public by design: it is already in the browser bundle, and
    // the function grants nothing beyond inserting one constrained row.
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const beaconUrl = `${url}?apikey=${encodeURIComponent(anonKey)}`;
      if (navigator.sendBeacon(beaconUrl, new Blob([body], { type: 'application/json' }))) return;
    }

    void fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* Analytics never surfaces. The event is lost; the capture is unaffected. */
  }
}

/**
 * The outcome of a submit, as the funnel records it (§8.1, §6.4).
 *
 * SUCCESS MEANS THE LEAD WAS STORED AND ACCESS WAS GRANTED. It does NOT mean
 * the email was delivered. §8.1 defines `lead_magnet_request_success` as "the
 * server returned success (lead recorded; access granted)", so a stored
 * request whose email hit the one-hour cooldown, failed, or went to a
 * suppressed address is still a successful lead-magnet request here. Email
 * outcomes are measured separately, from `lead_magnet_requests.email_status`
 * (saved query 6); folding them in would count the same fact twice in two
 * places and let the two disagree.
 *
 * This also keeps the honeypot indistinguishable: it answers with
 * `stored: true`, so a bot logs a success exactly as a visitor does (§13.3).
 */
export function funnelOutcomeFor(result: SubmitResult): FunnelPayloadOutcome {
  if (result.kind === 'network') {
    return { event: 'lead_magnet_request_error', errorKind: 'network' };
  }

  if (result.kind === 'accepted') {
    if (result.stored) return { event: 'lead_magnet_request_success' };
    // Accepted but not persisted: the function failed open and still granted
    // the guide, but no lead exists, so this is not a conversion.
    return { event: 'lead_magnet_request_error', errorKind: 'server' };
  }

  switch (result.error) {
    case 'invalid_email':
    case 'invalid_request':
      return { event: 'lead_magnet_request_error', errorKind: 'validation' };
    case 'verification_failed':
      return { event: 'lead_magnet_request_error', errorKind: 'verification' };
    case 'rate_limited':
      return { event: 'lead_magnet_request_error', errorKind: 'rate_limited' };
    case 'server_error':
    case 'test_mode_refused':
    default:
      return { event: 'lead_magnet_request_error', errorKind: 'server' };
  }
}

export type FunnelPayloadOutcome =
  | { event: 'lead_magnet_request_success'; errorKind?: undefined }
  | { event: 'lead_magnet_request_error'; errorKind: FunnelErrorKind };

/** `lead_magnet_cta_view`, deduplicated per placement per session. */
export function recordImpression(
  assetId: LeadMagnetId,
  placement: LeadMagnetPlacement,
  pagePath: string,
  store: FunnelStore | null,
): void {
  if (!shouldRecordImpression(assetId, placement, store)) return;
  sendFunnelEvent({ event: 'lead_magnet_cta_view', assetId, placement, pagePath });
}
