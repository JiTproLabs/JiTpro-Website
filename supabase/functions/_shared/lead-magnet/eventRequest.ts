/**
 * Parsing and validation of a funnel-event body (`record-lead-magnet-event`).
 *
 * The seven event names and five error kinds are the fixed vocabulary of plan
 * §8.1 and §6.4, and the `lead_magnet_events` CHECK constraints are written
 * from the same lists. Validating here as well is not redundancy for its own
 * sake: it means a malformed beacon is dropped and logged rather than turned
 * into a database error, and it keeps the endpoint's behaviour testable
 * without a database.
 *
 * WHAT MAY NEVER BE ACCEPTED (Decisions D4.6, D4.7, §8.4): no email, no
 * visitor or session id, no IP, no referrer, no UTMs, nothing personal. Any
 * key not named here is ignored rather than stored, so a client that starts
 * sending extra fields cannot quietly widen what this table holds.
 *
 * No Deno-specific or browser-specific APIs.
 */

import { isLeadMagnetPlacement, type LeadMagnetPlacement } from './registry.ts';
import { sanitisePath } from './request.ts';

/** The seven fixed names of §8.1. */
export const FUNNEL_EVENT_NAMES = [
  'lead_magnet_cta_view',
  'lead_magnet_cta_click',
  'lead_magnet_form_view',
  'lead_magnet_form_submit',
  'lead_magnet_request_success',
  'lead_magnet_request_error',
  'lead_magnet_download_click',
] as const;

export type FunnelEventName = (typeof FUNNEL_EVENT_NAMES)[number];

/** The event that may carry an `error_kind`, and the only one (§6.4). */
export const FUNNEL_ERROR_EVENT: FunnelEventName = 'lead_magnet_request_error';

/** The five fixed classifications of §6.4. */
export const FUNNEL_ERROR_KINDS = [
  'network',
  'validation',
  'verification',
  'rate_limited',
  'server',
] as const;

export type FunnelErrorKind = (typeof FUNNEL_ERROR_KINDS)[number];

export const ASSET_ID_MAX_LENGTH = 64;

export function isFunnelEventName(value: unknown): value is FunnelEventName {
  return typeof value === 'string' && (FUNNEL_EVENT_NAMES as readonly string[]).includes(value);
}

export function isFunnelErrorKind(value: unknown): value is FunnelErrorKind {
  return typeof value === 'string' && (FUNNEL_ERROR_KINDS as readonly string[]).includes(value);
}

export type FunnelEventInput = {
  eventName: FunnelEventName;
  assetId: string;
  placement: LeadMagnetPlacement;
  pagePath: string;
  errorKind: FunnelErrorKind | null;
};

export type EventParseResult =
  | { kind: 'valid'; input: FunnelEventInput }
  | { kind: 'invalid'; reason: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Every rejection carries a short reason. It is logged, never returned: the
 * endpoint answers 204 whatever happens, because a `sendBeacon` target must
 * not be able to surface an error in the capture experience.
 */
export function parseFunnelEvent(body: unknown): EventParseResult {
  if (!isPlainObject(body)) return { kind: 'invalid', reason: 'body_not_object' };

  if (!isFunnelEventName(body.event_name)) return { kind: 'invalid', reason: 'unknown_event_name' };
  if (!isLeadMagnetPlacement(body.placement)) return { kind: 'invalid', reason: 'unknown_placement' };

  if (typeof body.asset_id !== 'string') return { kind: 'invalid', reason: 'missing_asset_id' };
  const assetId = body.asset_id.trim();
  if (assetId === '' || assetId.length > ASSET_ID_MAX_LENGTH) {
    return { kind: 'invalid', reason: 'bad_asset_id' };
  }

  // Reuses the request parser's path rules: query string and fragment removed
  // so a path can never smuggle personal data into the table.
  const pagePath = sanitisePath(body.page_path);
  if (pagePath === null) return { kind: 'invalid', reason: 'bad_page_path' };

  // §6.4: an error kind belongs only to the error event. Accepting it anywhere
  // else would violate the table's scope constraint and corrupt the funnel.
  let errorKind: FunnelErrorKind | null = null;
  if (body.error_kind !== undefined && body.error_kind !== null) {
    if (!isFunnelErrorKind(body.error_kind)) return { kind: 'invalid', reason: 'unknown_error_kind' };
    if (body.event_name !== FUNNEL_ERROR_EVENT) {
      return { kind: 'invalid', reason: 'error_kind_on_non_error_event' };
    }
    errorKind = body.error_kind;
  }

  return {
    kind: 'valid',
    input: { eventName: body.event_name, assetId, placement: body.placement, pagePath, errorKind },
  };
}

/** The row shape inserted into `lead_magnet_events`. Nothing else is stored. */
export function buildEventRow(input: FunnelEventInput): Record<string, unknown> {
  return {
    event_name: input.eventName,
    asset_id: input.assetId,
    placement: input.placement,
    page_path: input.pagePath,
    error_kind: input.errorKind,
  };
}
