/**
 * Turnstile recovery policy (Issue #54; Decision D5.4 and lead-gen plan §13.3).
 *
 * D5.4 and the §13.3 failure matrix both require that an expired or failed
 * browser check is "reset silently for a later attempt". That reset was never
 * implemented: `expired-callback` and `error-callback` shared one handler that
 * nulled the token and did nothing else, so a form whose token expired or
 * errored stayed tokenless for the rest of its life. This module holds the
 * decision of when to reset, so the rule is proven by unit tests rather than
 * buried in an effect.
 *
 * ERROR CODES. Cloudflare's client-side error codes were read from the current
 * Turnstile documentation (developers.cloudflare.com/turnstile/troubleshooting/
 * client-side-errors/error-codes/) rather than assumed. The documentation
 * classifies some codes as retryable and some as configuration problems that
 * only the site owner can fix; resetting on the latter would spin forever, so
 * the two are separated here and every reset is capped besides.
 *
 * Pure: no DOM, no React, no network.
 */

/**
 * Where the widget currently is. Held per widget mount. This is internal
 * lifecycle state only; Issue #54 explicitly excludes sending it anywhere, so
 * nothing here reaches the database or an analytics event.
 */
export type TurnstileStatus =
  /** Rendered (or about to be) and a token may still arrive on its own. */
  | 'pending'
  /** A token is in hand. */
  | 'ready'
  /** Cloudflare asked for an interactive challenge; a human must act. */
  | 'interactive'
  /** Recovery is exhausted or the error is not recoverable. */
  | 'error'
  /** The Turnstile script never became available. */
  | 'unavailable';

/** How many times one widget mount may be reset after an error. */
export const MAX_ERROR_RESETS = 2;

/** How long to wait before re-rendering after a retryable error. */
export const ERROR_RESET_BACKOFF_MS = 500;

/**
 * How long the script-availability poll runs before giving up.
 *
 * The poll previously ran forever with no timeout and no failure signal, so a
 * blocked or stalled `api.js` produced a perfectly normal-looking form that
 * could never yield a token. Ten seconds is far longer than a healthy load and
 * short enough that a submit is not waiting on a script that is never coming.
 */
export const SCRIPT_WATCHDOG_MS = 10_000;

/**
 * Codes the documentation describes as configuration problems: the site owner
 * must fix them, and no number of resets will help.
 */
const NON_RETRYABLE_CODES = new Set([
  '110100', // Invalid sitekey
  '110110', // Sitekey not found
  '110200', // Domain not authorized
  '200100', // Clock or cache problem
  '400020', // Invalid sitekey
  '400070', // Sitekey disabled
]);

/**
 * Codes the documentation describes as transient, where a retry is the
 * documented remedy.
 */
const RETRYABLE_CODES = new Set([
  '110600', // Challenge timed out
  '110620', // Interaction timed out
  '200500', // Iframe load error
]);

/** Families the documentation describes as generic challenge failures. */
const RETRYABLE_PREFIXES = ['300', '600'];

/**
 * Families the documentation describes as configuration errors. Checked after
 * the explicit retryable list, because `110600` and `110620` are timeouts that
 * live inside the otherwise-configuration `110` family.
 */
const NON_RETRYABLE_PREFIXES = ['110', '400'];

/**
 * Whether a reset could plausibly clear this error.
 *
 * An unrecognised code is treated as retryable. That is safe because every
 * reset is capped: an unknown transient fault recovers, and an unknown
 * permanent one costs at most `MAX_ERROR_RESETS` attempts before stopping.
 */
export function isRetryableTurnstileError(code: string | null | undefined): boolean {
  if (code === null || code === undefined) return true;
  const value = String(code).trim();
  if (value === '') return true;

  if (RETRYABLE_CODES.has(value)) return true;
  if (NON_RETRYABLE_CODES.has(value)) return false;
  if (RETRYABLE_PREFIXES.some((prefix) => value.startsWith(prefix))) return true;
  if (NON_RETRYABLE_PREFIXES.some((prefix) => value.startsWith(prefix))) return false;
  return true;
}

export type RecoveryKind = 'expired' | 'error';

export type RecoveryInput = {
  kind: RecoveryKind;
  /** Cloudflare's error code, for `error` only. */
  code?: string | null;
  /** How many resets this widget mount has already performed after an error. */
  errorResets: number;
};

/**
 * `reset` re-runs the widget; `stop` leaves it alone and fails open.
 *
 * Expiry always resets and is never capped. It cannot loop: a token must live
 * its full 300 seconds before it can expire, so expiry resets are rate-limited
 * by Cloudflare's own token lifetime.
 *
 * An error resets only when the code is retryable AND the mount has attempts
 * left, which is what keeps a configuration error from spinning.
 */
export function resetDecisionFor({ kind, code, errorResets }: RecoveryInput): 'reset' | 'stop' {
  if (kind === 'expired') return 'reset';
  if (!isRetryableTurnstileError(code)) return 'stop';
  return errorResets < MAX_ERROR_RESETS ? 'reset' : 'stop';
}

/**
 * Whether a submit with no token should wait for one.
 *
 * Only `pending` is worth waiting on. An interactive challenge needs a human,
 * a missing script is not coming back inside the bounded wait, and an exhausted
 * error will not resolve itself, so in those states the request goes
 * immediately and fails open rather than making the visitor wait for nothing.
 * A reset returns the widget to `pending`, so a recovered widget is waitable
 * again.
 */
export function shouldWaitForToken(status: TurnstileStatus): boolean {
  return status === 'pending';
}
