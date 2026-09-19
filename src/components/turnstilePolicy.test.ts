import { describe, expect, it } from 'vitest';
import {
  MAX_ERROR_RESETS,
  isRetryableTurnstileError,
  resetDecisionFor,
  shouldWaitForToken,
  type TurnstileStatus,
} from './turnstilePolicy';

/**
 * The error codes below are Cloudflare's, read from the current Turnstile
 * client-side error-code documentation rather than assumed. The distinction
 * that matters is configuration versus transient: resetting on a configuration
 * error would spin forever, which is the failure this policy exists to prevent.
 */

describe('isRetryableTurnstileError', () => {
  it.each([
    ['110600', 'challenge timed out'],
    ['110620', 'interaction timed out'],
    ['200500', 'iframe load error'],
    ['300123', 'generic challenge failure'],
    ['600001', 'generic challenge failure'],
  ])('treats %s (%s) as retryable', (code) => {
    expect(isRetryableTurnstileError(code)).toBe(true);
  });

  it.each([
    ['110100', 'invalid sitekey'],
    ['110110', 'sitekey not found'],
    ['110200', 'domain not authorized'],
    ['200100', 'clock or cache problem'],
    ['400020', 'invalid sitekey'],
    ['400070', 'sitekey disabled'],
  ])('treats %s (%s) as not retryable', (code) => {
    expect(isRetryableTurnstileError(code)).toBe(false);
  });

  /* The 110 family is configuration apart from its two documented timeouts. */
  it('treats an undocumented 110 code as configuration, not transient', () => {
    expect(isRetryableTurnstileError('110999')).toBe(false);
  });

  it('treats an unknown code as retryable, because the cap bounds the cost', () => {
    expect(isRetryableTurnstileError('987654')).toBe(true);
  });

  it.each([null, undefined, '', '   '])('treats %j as retryable', (code) => {
    expect(isRetryableTurnstileError(code)).toBe(true);
  });
});

describe('resetDecisionFor', () => {
  it('always resets on expiry', () => {
    expect(resetDecisionFor({ kind: 'expired', errorResets: 0 })).toBe('reset');
  });

  /**
   * Expiry is not capped and cannot loop: a token must live its full
   * 300-second lifetime before it can expire, so Cloudflare rate-limits it.
   */
  it('still resets on expiry after the error cap is exhausted', () => {
    expect(resetDecisionFor({ kind: 'expired', errorResets: MAX_ERROR_RESETS })).toBe('reset');
  });

  it('resets a retryable error while attempts remain', () => {
    for (let attempt = 0; attempt < MAX_ERROR_RESETS; attempt += 1) {
      expect(resetDecisionFor({ kind: 'error', code: '300100', errorResets: attempt })).toBe('reset');
    }
  });

  it('stops once the retry cap is reached, so an error cannot loop', () => {
    expect(resetDecisionFor({ kind: 'error', code: '300100', errorResets: MAX_ERROR_RESETS })).toBe('stop');
    expect(resetDecisionFor({ kind: 'error', code: '300100', errorResets: MAX_ERROR_RESETS + 5 })).toBe('stop');
  });

  it('never resets a configuration error, even on the first attempt', () => {
    for (const code of ['110100', '110110', '110200', '200100', '400020', '400070']) {
      expect(resetDecisionFor({ kind: 'error', code, errorResets: 0 })).toBe('stop');
    }
  });

  it('caps at two attempts', () => {
    expect(MAX_ERROR_RESETS).toBe(2);
  });
});

describe('shouldWaitForToken', () => {
  it('waits only while a token can still arrive by itself', () => {
    expect(shouldWaitForToken('pending')).toBe(true);
  });

  it.each<TurnstileStatus>(['ready', 'interactive', 'error', 'unavailable'])(
    'does not wait in %s',
    (status) => {
      expect(shouldWaitForToken(status)).toBe(false);
    },
  );
});
