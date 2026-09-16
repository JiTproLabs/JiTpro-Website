import { describe, expect, it } from 'vitest';
import {
  INITIAL_STATE,
  leadCaptureReducer,
  outcomeFor,
  validateEmail,
  type LeadCaptureState,
  type SubmitResult,
} from './leadCaptureMachine';

const GUIDE = 'https://jit-pro.com/guides/procurement-field-guide';

function submitted(email = 'buyer@example.com'): LeadCaptureState {
  return leadCaptureReducer(INITIAL_STATE, { type: 'submit', email });
}

function settle(result: SubmitResult, email = 'buyer@example.com'): LeadCaptureState {
  return leadCaptureReducer(submitted(email), { type: 'settled', email, result });
}

describe('validateEmail', () => {
  it('accepts an ordinary address', () => {
    expect(validateEmail('buyer@example.com')).toBeNull();
  });

  it('accepts a plus-labelled address, which Resend test recipients use', () => {
    expect(validateEmail('delivered+lm-s4@resend.dev')).toBeNull();
  });

  it('reports an empty field as empty, not invalid', () => {
    expect(validateEmail('')).toBe('empty');
    expect(validateEmail('   ')).toBe('empty');
  });

  it('rejects malformed addresses', () => {
    expect(validateEmail('buyer')).toBe('invalid');
    expect(validateEmail('buyer@')).toBe('invalid');
    expect(validateEmail('buyer@example')).toBe('invalid');
    expect(validateEmail('@example.com')).toBe('invalid');
    expect(validateEmail('a b@example.com')).toBe('invalid');
  });

  it('rejects an over-long address and an over-long local part', () => {
    expect(validateEmail('a'.repeat(250) + '@example.com')).toBe('invalid');
    expect(validateEmail('a'.repeat(65) + '@example.com')).toBe('invalid');
  });
});

describe('outcomeFor: the §13.3 to §13.2 collapse', () => {
  it('maps a stored and sent request to success', () => {
    expect(outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' })).toEqual({
      outcome: 'success',
      retryable: false,
    });
  });

  it('maps the one-hour cooldown to the repeat state', () => {
    expect(
      outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'skipped_cooldown' }),
    ).toEqual({ outcome: 'repeat_within_hour', retryable: false });
  });

  it('maps a failed send to email not sent', () => {
    expect(outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'failed' }).outcome).toBe(
      'email_not_sent',
    );
  });

  it('maps a suppressed address to email not sent', () => {
    expect(
      outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'suppressed' }).outcome,
    ).toBe('email_not_sent');
  });

  it('shows a bot plain success on the honeypot path, so the trap stays hidden (§13.3)', () => {
    // The function answers a honeypot-filled request with stored: true and no
    // email status. A distinguishable message would teach a spammer to stop
    // filling the field in.
    expect(outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: null })).toEqual({
      outcome: 'success',
      retryable: false,
    });
  });

  it('maps a persistence failure to email not sent even when the response is ok', () => {
    expect(outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: false, emailStatus: null }).outcome).toBe(
      'email_not_sent',
    );
  });

  it('never claims success when the request was not stored, whatever the email status says', () => {
    expect(outcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: false, emailStatus: 'sent' }).outcome).toBe(
      'email_not_sent',
    );
  });

  it('maps rate limiting to email not sent without offering a retry', () => {
    expect(outcomeFor({ kind: 'rejected', error: 'rate_limited', guideUrl: GUIDE })).toEqual({
      outcome: 'email_not_sent',
      retryable: false,
    });
  });

  it('maps a failed browser check to email not sent without offering a retry', () => {
    expect(outcomeFor({ kind: 'rejected', error: 'verification_failed', guideUrl: GUIDE })).toEqual({
      outcome: 'email_not_sent',
      retryable: false,
    });
  });

  it('maps a server error to email not sent without offering a retry', () => {
    expect(outcomeFor({ kind: 'rejected', error: 'server_error', guideUrl: GUIDE }).retryable).toBe(false);
  });

  it('offers Try again for network failure and timeout only', () => {
    expect(outcomeFor({ kind: 'network', guideUrl: GUIDE })).toEqual({
      outcome: 'email_not_sent',
      retryable: true,
    });
  });
});

describe('the reducer', () => {
  it('starts idle with no error and no live validation', () => {
    expect(INITIAL_STATE).toEqual({
      phase: 'idle',
      outcome: null,
      submittedEmail: null,
      guideUrl: null,
      retryable: false,
      fieldError: null,
      validateLive: false,
    });
  });

  it('does not validate while the visitor is first typing (§24.1)', () => {
    const typed = leadCaptureReducer(INITIAL_STATE, { type: 'edit', value: 'b' });
    expect(typed.fieldError).toBeNull();
    expect(typed).toBe(INITIAL_STATE);
  });

  it('blocks submit on an empty field and turns on live validation', () => {
    const state = leadCaptureReducer(INITIAL_STATE, { type: 'submit', email: '' });
    expect(state.phase).toBe('idle');
    expect(state.fieldError).toBe('empty');
    expect(state.validateLive).toBe(true);
  });

  it('validates live once the field has been marked invalid, and clears as it is corrected', () => {
    let state = leadCaptureReducer(INITIAL_STATE, { type: 'submit', email: 'nope' });
    expect(state.fieldError).toBe('invalid');
    state = leadCaptureReducer(state, { type: 'edit', value: 'nope@' });
    expect(state.fieldError).toBe('invalid');
    state = leadCaptureReducer(state, { type: 'edit', value: 'nope@example.com' });
    expect(state.fieldError).toBeNull();
  });

  it('enters submitting on a valid submit', () => {
    const state = submitted();
    expect(state.phase).toBe('submitting');
    expect(state.fieldError).toBeNull();
  });

  it('reaches the success outcome with the guide URL and the submitted address', () => {
    const state = settle({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' });
    expect(state.phase).toBe('outcome');
    expect(state.outcome).toBe('success');
    expect(state.guideUrl).toBe(GUIDE);
    expect(state.submittedEmail).toBe('buyer@example.com');
    expect(state.retryable).toBe(false);
  });

  it('grants guide access on every non-validation failure (fail open, D5.6)', () => {
    const results: SubmitResult[] = [
      { kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'failed' },
      { kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'suppressed' },
      { kind: 'accepted', guideUrl: GUIDE, stored: false, emailStatus: null },
      { kind: 'rejected', error: 'rate_limited', guideUrl: GUIDE },
      { kind: 'rejected', error: 'verification_failed', guideUrl: GUIDE },
      { kind: 'rejected', error: 'server_error', guideUrl: GUIDE },
      { kind: 'rejected', error: 'test_mode_refused', guideUrl: GUIDE },
      { kind: 'rejected', error: 'invalid_request', guideUrl: GUIDE },
      { kind: 'network', guideUrl: GUIDE },
    ];
    for (const result of results) {
      const state = settle(result);
      expect(state.phase).toBe('outcome');
      expect(state.guideUrl).toBe(GUIDE);
      expect(state.outcome).toBe('email_not_sent');
    }
  });

  it('turns a server-rejected email into an inline field error, not an outcome', () => {
    const state = settle({ kind: 'rejected', error: 'invalid_email', guideUrl: null });
    expect(state.phase).toBe('idle');
    expect(state.outcome).toBeNull();
    expect(state.fieldError).toBe('invalid');
    expect(state.validateLive).toBe(true);
  });

  it('degrades an unexpected response with no guide URL to the field error rather than a dead button', () => {
    const state = settle({ kind: 'accepted', guideUrl: null, stored: true, emailStatus: 'sent' });
    expect(state.phase).toBe('idle');
    expect(state.fieldError).toBe('invalid');
  });

  it('offers Try again only on the retryable outcome, and returns to the form', () => {
    const network = settle({ kind: 'network', guideUrl: GUIDE });
    expect(network.retryable).toBe(true);
    const retried = leadCaptureReducer(network, { type: 'retry' });
    expect(retried.phase).toBe('idle');
    expect(retried.outcome).toBeNull();
  });

  it('ignores Try again on an outcome that is not retryable', () => {
    const success = settle({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' });
    expect(leadCaptureReducer(success, { type: 'retry' })).toBe(success);
  });

  it('resets to the initial state', () => {
    const success = settle({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' });
    expect(leadCaptureReducer(success, { type: 'reset' })).toEqual(INITIAL_STATE);
  });
});
