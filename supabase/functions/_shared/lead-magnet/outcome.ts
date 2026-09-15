/**
 * The response contract of `submit-lead-magnet-request` (lead-gen plan §13,
 * Decision D5.6: fail open for guide access).
 *
 * Every response carries the guide URL except an invalid email (the site
 * shows an inline field error) and a payload whose asset cannot be
 * identified. `stored` is never true for a real request that was not saved.
 * No Deno-specific or browser-specific APIs.
 */

import { getLeadMagnet, type LeadMagnetId } from './registry.ts';

export const LEAD_MAGNET_ERROR_STATUS = {
  invalid_email: 400,
  invalid_request: 400,
  verification_failed: 403,
  test_mode_refused: 403,
  rate_limited: 429,
  server_error: 500,
} as const;

export type LeadMagnetErrorCode = keyof typeof LEAD_MAGNET_ERROR_STATUS;

/** Set by the Sprint 3 send step. Null while no send has been attempted (Decision S2-3). */
export type FulfilmentEmailStatus = 'sent' | 'failed' | 'skipped_cooldown' | 'suppressed';

export type LeadMagnetResponseBody = {
  ok: boolean;
  request_id: string;
  guide_url: string | null;
  stored: boolean;
  email_status: FulfilmentEmailStatus | null;
  error?: LeadMagnetErrorCode;
};

export type LeadMagnetResponse = {
  status: number;
  body: LeadMagnetResponseBody;
};

export const DEFAULT_SITE_URL = 'https://jit-pro.com';

export function guideUrlFor(assetId: LeadMagnetId, siteUrl?: string): string {
  const base = (siteUrl?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '');
  return `${base}${getLeadMagnet(assetId).publicPath}`;
}

/** HTTP 200: the request was accepted; `stored` says honestly whether it was saved. */
export function acceptedResponse(requestId: string, guideUrl: string | null, stored: boolean): LeadMagnetResponse {
  return {
    status: 200,
    body: { ok: true, request_id: requestId, guide_url: guideUrl, stored, email_status: null },
  };
}

export function errorResponse(
  code: LeadMagnetErrorCode,
  requestId: string,
  guideUrl: string | null,
): LeadMagnetResponse {
  return {
    status: LEAD_MAGNET_ERROR_STATUS[code],
    body: {
      ok: false,
      request_id: requestId,
      guide_url: code === 'invalid_email' ? null : guideUrl,
      stored: false,
      email_status: null,
      error: code,
    },
  };
}
