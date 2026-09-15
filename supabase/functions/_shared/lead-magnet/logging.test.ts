import { describe, expect, it } from 'vitest';
import { maskEmail, summariseError } from './logging.ts';

describe('maskEmail', () => {
  it('keeps the first two characters of the local part and the domain', () => {
    expect(maskEmail('delivered+lm-test@resend.dev')).toBe('de***@resend.dev');
    expect(maskEmail('john@abccontracting.com')).toBe('jo***@abccontracting.com');
  });

  it('reveals at most one character of a short local part', () => {
    expect(maskEmail('jo@abc.com')).toBe('j***@abc.com');
    expect(maskEmail('j@abc.com')).toBe('j***@abc.com');
  });

  it('never returns the full address', () => {
    for (const email of ['delivered+lm-test@resend.dev', 'ab@c.co', 'x@y.z']) {
      expect(maskEmail(email)).not.toBe(email);
    }
  });

  it('masks malformed values completely', () => {
    expect(maskEmail('no-at-sign')).toBe('***');
    expect(maskEmail('@domain.com')).toBe('***');
    expect(maskEmail('local@')).toBe('***');
  });
});

describe('summariseError', () => {
  it('uses the error message, truncated', () => {
    expect(summariseError(new Error('POST contacts failed: HTTP 500'))).toBe('POST contacts failed: HTTP 500');
    expect(summariseError(new Error('x'.repeat(500)))).toHaveLength(200);
  });

  it('does not stringify unknown values', () => {
    expect(summariseError({ secret: 'value' })).toBe('unknown error');
    expect(summariseError('raw string')).toBe('unknown error');
  });
});
