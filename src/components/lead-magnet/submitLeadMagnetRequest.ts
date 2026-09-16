/**
 * API client for `submit-lead-magnet-request`.
 *
 * Mirrors `src/pages/contact/submitContact.ts`: same anon-key headers, same
 * plain `fetch`, no Supabase client. It differs in one deliberate way: it
 * NEVER throws. Every failure is turned into a `SubmitResult` the state
 * machine can map to a visitor state, because the plan's fail-open rule means
 * a network error must still open the guide (Decision D5.6, §13.3).
 *
 * The guide URL is known from the registry before any request is made, so the
 * client can supply it even when the function is unreachable.
 */

import {
  DEFAULT_SITE_URL,
  LEAD_MAGNET_ERROR_STATUS,
  type LeadMagnetErrorCode,
  type LeadMagnetResponseBody,
} from '../../../supabase/functions/_shared/lead-magnet/outcome.ts';
import { HONEYPOT_FIELD } from '../../../supabase/functions/_shared/lead-magnet/request.ts';
import type { LeadMagnetId, LeadMagnetPlacement } from '../../content/leadMagnets';
import type { ConsentTextVersion } from '../../content/consentTexts';
import type { Attribution } from './attribution';
import type { SubmitResult } from './leadCaptureMachine';

/** §13.3: the hard timeout that becomes the network case. */
export const SUBMIT_TIMEOUT_MS = 30_000;

export type LeadMagnetSubmission = {
  email: string;
  assetId: LeadMagnetId;
  placement: LeadMagnetPlacement;
  pagePath: string;
  marketingOptIn: boolean;
  consentTextVersion: ConsentTextVersion;
  turnstileToken: string | null;
  attribution: Attribution;
  /** The honeypot's value. Always the empty string for a real visitor. */
  honeypot: string;
};

/** The wire body. Snake case, matching `parseLeadMagnetRequest` exactly. */
export function buildRequestBody(submission: LeadMagnetSubmission): Record<string, unknown> {
  return {
    email: submission.email,
    asset_id: submission.assetId,
    placement: submission.placement,
    page_path: submission.pagePath,
    landing_path: submission.attribution.landingPath,
    referrer: submission.attribution.referrer,
    utm_source: submission.attribution.utmSource,
    utm_medium: submission.attribution.utmMedium,
    utm_campaign: submission.attribution.utmCampaign,
    utm_content: submission.attribution.utmContent,
    utm_term: submission.attribution.utmTerm,
    marketing_opt_in: submission.marketingOptIn,
    consent_text_version: submission.consentTextVersion,
    turnstile_token: submission.turnstileToken,
    [HONEYPOT_FIELD]: submission.honeypot,
  };
}

const ERROR_CODES = Object.keys(LEAD_MAGNET_ERROR_STATUS) as LeadMagnetErrorCode[];

function isErrorCode(value: unknown): value is LeadMagnetErrorCode {
  return typeof value === 'string' && (ERROR_CODES as string[]).includes(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

/**
 * Turns whatever came back into a `SubmitResult`. A response that is missing,
 * malformed, or of an unexpected shape is treated as a rejection rather than
 * trusted, and the caller-supplied fallback guide URL keeps the outcome
 * openable (§13.3, "unexpected response body").
 */
export function interpretResponse(
  ok: boolean,
  body: unknown,
  fallbackGuideUrl: string,
): SubmitResult {
  const record =
    typeof body === 'object' && body !== null && !Array.isArray(body)
      ? (body as Partial<LeadMagnetResponseBody> & Record<string, unknown>)
      : null;

  const guideUrl = record ? asString(record.guide_url) : null;

  if (!ok || record?.ok !== true) {
    const error = isErrorCode(record?.error) ? record.error : 'server_error';
    // An invalid email is the one case with no guide: the site shows an
    // inline field error instead of an outcome.
    return { kind: 'rejected', error, guideUrl: error === 'invalid_email' ? null : guideUrl ?? fallbackGuideUrl };
  }

  const emailStatus = record.email_status;
  return {
    kind: 'accepted',
    guideUrl: guideUrl ?? fallbackGuideUrl,
    stored: record.stored === true,
    emailStatus:
      emailStatus === 'sent' || emailStatus === 'failed' || emailStatus === 'skipped_cooldown' || emailStatus === 'suppressed'
        ? emailStatus
        : null,
  };
}

/** The absolute guide URL this build points at, known without any I/O. */
export function localGuideUrl(publicPath: string): string {
  const origin = typeof window === 'undefined' ? DEFAULT_SITE_URL : window.location.origin;
  return `${origin.replace(/\/+$/, '')}${publicPath}`;
}

export async function submitLeadMagnetRequest(
  submission: LeadMagnetSubmission,
  fallbackGuideUrl: string,
): Promise<SubmitResult> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-lead-magnet-request`;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(buildRequestBody(submission)),
      signal: controller.signal,
    });

    const body: unknown = await response.json().catch(() => null);
    return interpretResponse(response.ok, body, fallbackGuideUrl);
  } catch {
    // A rejected fetch and the abort above are the same thing to the visitor:
    // the guide still opens, and Try again is genuinely useful.
    return { kind: 'network', guideUrl: fallbackGuideUrl };
  } finally {
    clearTimeout(timer);
  }
}
