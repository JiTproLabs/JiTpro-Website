/**
 * Sanitised Resend outcomes for function logs (S2-20, approved 2026-09-15).
 *
 * Step 3 showed why this is needed: Resend rejected the recovery alert with
 * 403 "Domain not verified", but the function logged only the status, so the
 * reason was invisible until the Resend dashboard was read by hand.
 *
 * Logs carry the HTTP status, the Resend message id or a sanitised error name
 * and message, and the elapsed time. They never carry the request body,
 * headers, recipients, API key, Turnstile token, fault secret, or idempotency
 * key. No Deno-specific or browser-specific APIs.
 */

import { maskEmail } from './logging.ts';

const MAX_BODY_CHARS = 2000;
const MAX_MESSAGE_CHARS = 200;
const RESEND_KEY_LIKE = /\bre_[A-Za-z0-9_]{8,}/g;
const EMAIL_LIKE = /[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+/g;
const LONG_TOKEN = /[A-Za-z0-9_-]{32,}/g;

/** Masks addresses, then removes key-like and long token-like values, then truncates. */
export function sanitiseDiagnosticText(value: string): string {
  return value
    .replace(RESEND_KEY_LIKE, '[redacted]')
    .replace(EMAIL_LIKE, (match) => maskEmail(match))
    .replace(LONG_TOKEN, '[redacted]')
    .slice(0, MAX_MESSAGE_CHARS);
}

export type ResendOutcome =
  | { ok: true; status: number; messageId: string | null }
  | { ok: false; status: number; errorName: string | null; errorMessage: string | null };

/**
 * Reads a Resend response. Success bodies carry `id`; error bodies carry
 * `name` and `message`. Anything unparsable or unexpected becomes null rather
 * than being logged raw.
 */
export function describeResendResponse(status: number, bodyText: string): ResendOutcome {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(bodyText.slice(0, MAX_BODY_CHARS));
  } catch {
    parsed = null;
  }
  const body = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};

  if (status >= 200 && status < 300) {
    const messageId = typeof body.id === 'string' && /^[A-Za-z0-9-]{1,100}$/.test(body.id) ? body.id : null;
    return { ok: true, status, messageId };
  }

  const errorName = typeof body.name === 'string' && /^[A-Za-z_]{1,64}$/.test(body.name) ? body.name : null;
  const errorMessage = typeof body.message === 'string' ? sanitiseDiagnosticText(body.message) : null;
  return { ok: false, status, errorName, errorMessage };
}

/** For a call that never produced a response: timeout, abort, DNS, or transport failure. */
export function describeFetchFailure(error: unknown): { errorType: string; errorMessage: string } {
  const errorType = error instanceof Error && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : 'UnknownError';
  const errorMessage = error instanceof Error ? sanitiseDiagnosticText(error.message) : 'unknown error';
  return { errorType, errorMessage };
}
