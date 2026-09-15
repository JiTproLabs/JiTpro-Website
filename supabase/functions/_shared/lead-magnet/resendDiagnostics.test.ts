import { describe, expect, it } from 'vitest';
import { describeFetchFailure, describeResendResponse, sanitiseDiagnosticText } from './resendDiagnostics.ts';

describe('describeResendResponse', () => {
  it('returns the message id on success', () => {
    expect(describeResendResponse(200, '{"id":"49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"}')).toEqual({
      ok: true,
      status: 200,
      messageId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    });
  });

  it('keeps the Step 3 domain-verification error readable', () => {
    const body =
      '{"statusCode":403,"name":"validation_error","message":"Domain not verified: Verify mail.jit-pro.com or update your from domain."}';
    expect(describeResendResponse(403, body)).toEqual({
      ok: false,
      status: 403,
      errorName: 'validation_error',
      errorMessage: 'Domain not verified: Verify mail.jit-pro.com or update your from domain.',
    });
  });

  it('masks email addresses and redacts key-like and long token values', () => {
    const body = JSON.stringify({
      name: 'validation_error',
      message: `Bad to: delivered+lm-test@resend.dev key re_AbCdEf123456789 token ${'x'.repeat(40)}`,
    });
    const outcome = describeResendResponse(422, body);
    expect(outcome.ok).toBe(false);
    const message = outcome.ok ? '' : String(outcome.errorMessage);
    expect(message).toContain('de***@resend.dev');
    expect(message).not.toContain('delivered+lm-test@resend.dev');
    expect(message).not.toContain('re_AbCdEf123456789');
    expect(message).not.toContain('x'.repeat(40));
    expect(message).toContain('[redacted]');
  });

  it('never logs unparsable bodies, unsafe error names, or unsafe ids', () => {
    expect(describeResendResponse(500, '<html>upstream error for jane@abc.com</html>')).toEqual({
      ok: false,
      status: 500,
      errorName: null,
      errorMessage: null,
    });
    expect(describeResendResponse(403, '{"name":"bad name!","message":"m"}')).toMatchObject({ errorName: null });
    expect(describeResendResponse(200, '{"id":"<script>alert(1)</script>"}')).toEqual({
      ok: true,
      status: 200,
      messageId: null,
    });
  });

  it('truncates long messages', () => {
    expect(sanitiseDiagnosticText('word '.repeat(100))).toHaveLength(200);
  });
});

describe('describeFetchFailure', () => {
  it('reports the error type and a sanitised message', () => {
    const timeout = Object.assign(new Error('Signal timed out for jane@abc.com'), { name: 'TimeoutError' });
    expect(describeFetchFailure(timeout)).toEqual({
      errorType: 'TimeoutError',
      errorMessage: 'Signal timed out for ja***@abc.com',
    });
  });

  it('falls back safely for non-Error values', () => {
    expect(describeFetchFailure('boom')).toEqual({ errorType: 'UnknownError', errorMessage: 'unknown error' });
    expect(describeFetchFailure({ secret: 'value' })).toEqual({ errorType: 'UnknownError', errorMessage: 'unknown error' });
  });
});
