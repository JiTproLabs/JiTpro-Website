/**
 * The lead-capture form's state machine.
 *
 * This module holds the whole of the plan's §13.3 internal failure matrix and
 * its collapse into the THREE visitor-facing states of §13.2. It is pure so
 * every row of that matrix is proven by a unit test rather than by clicking.
 *
 * THE GOVERNING RULE IS FAIL OPEN (Decision D5.6). Apart from an invalid email
 * (which is not yet a request), every terminal state grants access to the
 * guide. The visitor is never told about databases, rate limits, verification,
 * or networks (§33.1, D6.10); the distinctions survive in logs and on the
 * request row, not on screen.
 */

import type { FulfilmentEmailStatus, LeadMagnetErrorCode } from '../../../supabase/functions/_shared/lead-magnet/outcome.ts';

/** What the form is doing. */
export type LeadCapturePhase = 'idle' | 'submitting' | 'outcome';

/** Which of the three §13.2 bodies the outcome shows. */
export type VisitorOutcome = 'success' | 'repeat_within_hour' | 'email_not_sent';

/** The inline field error, when the email itself is the problem. */
export type FieldError = 'empty' | 'invalid';

export type LeadCaptureState = {
  phase: LeadCapturePhase;
  /** Set only in the `outcome` phase. */
  outcome: VisitorOutcome | null;
  /** The address the outcome sentence names. */
  submittedEmail: string | null;
  /** The URL the outcome's primary action opens. Never null in an outcome. */
  guideUrl: string | null;
  /** §13.2: the quiet Try again link, shown for network failure and timeout only. */
  retryable: boolean;
  fieldError: FieldError | null;
  /** True once the field has been marked invalid: §24.1 then validates live. */
  validateLive: boolean;
};

export const INITIAL_STATE: LeadCaptureState = {
  phase: 'idle',
  outcome: null,
  submittedEmail: null,
  guideUrl: null,
  retryable: false,
  fieldError: null,
  validateLive: false,
};

/**
 * What the API client reports back. `network` covers a rejected fetch and the
 * hard timeout alike, because they are the same thing to the visitor and are
 * the only two conditions where retrying is genuinely useful.
 */
export type SubmitResult =
  | { kind: 'accepted'; guideUrl: string | null; stored: boolean; emailStatus: FulfilmentEmailStatus | null }
  | { kind: 'rejected'; error: LeadMagnetErrorCode; guideUrl: string | null }
  | { kind: 'network'; guideUrl: string | null };

export type LeadCaptureEvent =
  | { type: 'edit'; value: string }
  | { type: 'submit'; email: string }
  | { type: 'settled'; email: string; result: SubmitResult }
  | { type: 'retry' }
  | { type: 'reset' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/**
 * Client-side validation. Deliberately the same shape as the server's
 * `normaliseEmail`, and deliberately no stricter: the server is the authority,
 * and a client that rejected an address the server would accept would simply
 * lose a lead.
 */
export function validateEmail(value: string): FieldError | null {
  const email = value.trim();
  if (email === '') return 'empty';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return 'invalid';
  if (email.slice(0, email.indexOf('@')).length > 64) return 'invalid';
  return null;
}

/**
 * The §13.3 → §13.2 collapse, in one place.
 *
 * `success` requires BOTH that the request was stored and that the email was
 * sent, because the success sentence promises an email. Everything else that
 * still grants access resolves to `email_not_sent`, whose sentence is honest
 * about exactly that and offers `info@jit-pro.com`.
 */
export function outcomeFor(result: SubmitResult): { outcome: VisitorOutcome; retryable: boolean } {
  if (result.kind === 'network') return { outcome: 'email_not_sent', retryable: true };
  if (result.kind === 'rejected') return { outcome: 'email_not_sent', retryable: false };

  if (!result.stored) return { outcome: 'email_not_sent', retryable: false };

  switch (result.emailStatus) {
    case 'sent':
      return { outcome: 'success', retryable: false };
    case 'skipped_cooldown':
      return { outcome: 'repeat_within_hour', retryable: false };
    case 'failed':
    case 'suppressed':
    case null:
    default:
      return { outcome: 'email_not_sent', retryable: false };
  }
}

/**
 * True when the response leaves the visitor with no guide to open. Only an
 * invalid email reaches here in practice: the function returns the guide URL
 * on every other path, by design. It is handled anyway so a malformed or
 * truncated response degrades to the inline field error rather than to an
 * outcome panel with a dead button.
 */
function hasNoGuide(result: SubmitResult): boolean {
  return result.guideUrl === null;
}

export function leadCaptureReducer(state: LeadCaptureState, event: LeadCaptureEvent): LeadCaptureState {
  switch (event.type) {
    case 'edit':
      // §24.1: do not validate while the visitor is first typing. Once the
      // field has been marked invalid, validate live so the error clears.
      if (!state.validateLive) return state;
      return { ...state, fieldError: validateEmail(event.value) };

    case 'submit': {
      const fieldError = validateEmail(event.email);
      if (fieldError) return { ...state, fieldError, validateLive: true };
      return { ...state, phase: 'submitting', fieldError: null, retryable: false };
    }

    case 'settled': {
      const { result } = event;

      // The server rejected the address itself: an inline field error, not an
      // outcome. The visitor can correct it and submit again.
      if (result.kind === 'rejected' && result.error === 'invalid_email') {
        return { ...state, phase: 'idle', fieldError: 'invalid', validateLive: true };
      }
      if (hasNoGuide(result)) {
        return { ...state, phase: 'idle', fieldError: 'invalid', validateLive: true };
      }

      const { outcome, retryable } = outcomeFor(result);
      return {
        ...state,
        phase: 'outcome',
        outcome,
        submittedEmail: event.email,
        guideUrl: result.guideUrl,
        retryable,
        fieldError: null,
      };
    }

    case 'retry':
      // Only offered on the retryable outcome; returns to the filled form.
      if (state.phase !== 'outcome' || !state.retryable) return state;
      return { ...state, phase: 'idle', outcome: null, retryable: false };

    case 'reset':
      return INITIAL_STATE;

    default:
      return state;
  }
}
