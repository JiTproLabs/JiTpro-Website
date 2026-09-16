/**
 * Parsing and validation of a lead-magnet request body.
 *
 * Every value the browser sends is re-validated here (lead-gen plan §9):
 * email syntax and length, asset id and placement against the registry,
 * consent text version against the versioned texts, and attribution strings
 * trimmed, stripped of query strings and fragments (Decision 6, 2026-09-15),
 * and truncated. No Deno-specific or browser-specific APIs.
 */

import { isConsentTextVersion, type ConsentTextVersion } from './consentTexts.ts';
import {
  isLeadMagnetId,
  isLeadMagnetPlacement,
  type LeadMagnetId,
  type LeadMagnetPlacement,
} from './registry.ts';

export const EMAIL_MIN_LENGTH = 3;
export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_LOCAL_PART_MAX_LENGTH = 64;
export const PATH_MAX_LENGTH = 512;
export const REFERRER_MAX_LENGTH = 1024;
export const UTM_MAX_LENGTH = 256;
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

/** The hidden field real visitors never fill in (server-checked honeypot, D5.4). */
export const HONEYPOT_FIELD = 'website';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/**
 * Trims and lowercases an email address and checks it is plausible. Returns
 * the normalised address, or null. The result always satisfies the database
 * check `email = lower(btrim(email))` (Decision S2-2).
 */
export function normaliseEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH) return null;
  if (!EMAIL_PATTERN.test(email)) return null;
  const localPart = email.slice(0, email.indexOf('@'));
  if (localPart.length > EMAIL_LOCAL_PART_MAX_LENGTH) return null;
  return email;
}

function removeControlCharacters(value: string): string {
  let result = '';
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code > 0x1f && code !== 0x7f) result += character;
  }
  return result;
}

function cleanString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = removeControlCharacters(value).trim();
  return cleaned === '' ? null : cleaned;
}

function stripQueryAndFragment(value: string): string {
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

/** A site path such as `/field-guide`, with any query string and fragment removed. */
export function sanitisePath(value: unknown): string | null {
  const cleaned = cleanString(value);
  if (cleaned === null) return null;
  const path = stripQueryAndFragment(cleaned).trim();
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path.slice(0, PATH_MAX_LENGTH);
}

/** An http(s) referrer URL with any query string and fragment removed. */
export function sanitiseReferrer(value: unknown): string | null {
  const cleaned = cleanString(value);
  if (cleaned === null) return null;
  const url = stripQueryAndFragment(cleaned).trim();
  if (!/^https?:\/\/[^/\s]+/i.test(url)) return null;
  return url.slice(0, REFERRER_MAX_LENGTH);
}

/** One UTM value: trimmed, control characters removed, truncated. */
export function sanitiseUtm(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned === null ? null : cleaned.slice(0, UTM_MAX_LENGTH);
}

export type LeadMagnetRequestInput = {
  email: string;
  assetId: LeadMagnetId;
  placement: LeadMagnetPlacement;
  pagePath: string | null;
  landingPath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  marketingOptIn: boolean;
  consentTextVersion: ConsentTextVersion;
  turnstileToken: string | null;
};

export type ParseResult =
  | { kind: 'valid'; input: LeadMagnetRequestInput }
  | { kind: 'honeypot'; assetId: LeadMagnetId | null }
  | { kind: 'invalid'; error: 'invalid_request' | 'invalid_email'; assetId: LeadMagnetId | null };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHoneypotFilled(value: unknown): boolean {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

function parseTurnstileToken(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const token = value.trim();
  if (token === '' || token.length > TURNSTILE_TOKEN_MAX_LENGTH) return null;
  return token;
}

/**
 * Order matters and follows the plan: the honeypot is checked before any
 * validation (a bot receives an ordinary-looking success), then the asset,
 * then the email, then the remaining fields.
 */
export function parseLeadMagnetRequest(body: unknown): ParseResult {
  if (!isPlainObject(body)) return { kind: 'invalid', error: 'invalid_request', assetId: null };

  const assetId = isLeadMagnetId(body.asset_id) ? body.asset_id : null;

  if (isHoneypotFilled(body[HONEYPOT_FIELD])) return { kind: 'honeypot', assetId };

  if (assetId === null) return { kind: 'invalid', error: 'invalid_request', assetId: null };

  const email = normaliseEmail(body.email);
  if (email === null) return { kind: 'invalid', error: 'invalid_email', assetId };

  if (!isLeadMagnetPlacement(body.placement)) return { kind: 'invalid', error: 'invalid_request', assetId };
  if (!isConsentTextVersion(body.consent_text_version)) {
    return { kind: 'invalid', error: 'invalid_request', assetId };
  }
  if (typeof body.marketing_opt_in !== 'boolean') return { kind: 'invalid', error: 'invalid_request', assetId };

  return {
    kind: 'valid',
    input: {
      email,
      assetId,
      placement: body.placement,
      pagePath: sanitisePath(body.page_path),
      landingPath: sanitisePath(body.landing_path),
      referrer: sanitiseReferrer(body.referrer),
      utmSource: sanitiseUtm(body.utm_source),
      utmMedium: sanitiseUtm(body.utm_medium),
      utmCampaign: sanitiseUtm(body.utm_campaign),
      utmContent: sanitiseUtm(body.utm_content),
      utmTerm: sanitiseUtm(body.utm_term),
      marketingOptIn: body.marketing_opt_in,
      consentTextVersion: body.consent_text_version,
      turnstileToken: parseTurnstileToken(body.turnstile_token),
    },
  };
}
