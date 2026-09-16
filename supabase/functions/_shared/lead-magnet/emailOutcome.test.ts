import { describe, expect, it } from 'vitest';
import { classifyResendFailure, planFulfilment, shouldRecordContactSuppression } from './emailOutcome.ts';

const NOW = new Date('2026-09-16T12:00:00.000Z');

describe('planFulfilment', () => {
  it('sends when the contact is deliverable and nothing was sent before', () => {
    expect(planFulfilment({ contactSuppressedAt: null, lastSentAt: null, now: NOW })).toEqual({ action: 'send' });
  });

  it('never emails a suppressed contact, even outside the cooldown (D3.6)', () => {
    expect(
      planFulfilment({ contactSuppressedAt: '2026-09-01T00:00:00.000Z', lastSentAt: null, now: NOW }),
    ).toEqual({ action: 'skip', status: 'suppressed' });
  });

  it('skips inside the one-hour cooldown and sends again outside it (D2.2)', () => {
    expect(
      planFulfilment({ contactSuppressedAt: null, lastSentAt: new Date('2026-09-16T11:30:00.000Z'), now: NOW }),
    ).toEqual({ action: 'skip', status: 'skipped_cooldown' });
    expect(
      planFulfilment({ contactSuppressedAt: null, lastSentAt: new Date('2026-09-16T10:59:00.000Z'), now: NOW }),
    ).toEqual({ action: 'send' });
  });

  it('puts suppression ahead of the cooldown', () => {
    expect(
      planFulfilment({
        contactSuppressedAt: '2026-09-01T00:00:00.000Z',
        lastSentAt: new Date('2026-09-16T11:59:00.000Z'),
        now: NOW,
      }),
    ).toEqual({ action: 'skip', status: 'suppressed' });
  });
});

describe('classifyResendFailure', () => {
  it('treats suppression-shaped rejections as suppressed', () => {
    expect(
      classifyResendFailure({ ok: false, status: 422, errorName: 'validation_error', errorMessage: 'Recipient is on the suppression list' }),
    ).toBe('suppressed');
    expect(
      classifyResendFailure({ ok: false, status: 403, errorName: 'validation_error', errorMessage: 'blocked recipient' }),
    ).toBe('suppressed');
  });

  it('treats everything else as failed, so a transient problem never marks a contact undeliverable', () => {
    expect(classifyResendFailure({ ok: false, status: 500, errorName: null, errorMessage: null })).toBe('failed');
    expect(
      classifyResendFailure({ ok: false, status: 429, errorName: 'rate_limit_exceeded', errorMessage: 'Too many requests' }),
    ).toBe('failed');
    expect(
      classifyResendFailure({ ok: false, status: 403, errorName: 'validation_error', errorMessage: 'Domain not verified' }),
    ).toBe('failed');
  });
});

describe('shouldRecordContactSuppression', () => {
  it('records suppression once, and only for a suppressed outcome', () => {
    expect(shouldRecordContactSuppression('suppressed', null)).toBe(true);
    expect(shouldRecordContactSuppression('suppressed', '2026-09-01T00:00:00.000Z')).toBe(false);
    for (const status of ['sent', 'failed', 'skipped_cooldown'] as const) {
      expect(shouldRecordContactSuppression(status, null)).toBe(false);
    }
  });
});

describe('planFulfilment with the S3-2 development cooldown bypass', () => {
  const insideCooldown = { contactSuppressedAt: null, lastSentAt: new Date('2026-09-16T11:30:00.000Z'), now: NOW };

  it('production default: an unauthenticated repeat inside the hour is still held back', () => {
    expect(planFulfilment(insideCooldown)).toEqual({ action: 'skip', status: 'skipped_cooldown' });
    expect(planFulfilment({ ...insideCooldown, bypassCooldown: false })).toEqual({
      action: 'skip',
      status: 'skipped_cooldown',
    });
  });

  it('sends every time when the authenticated bypass is granted', () => {
    expect(planFulfilment({ ...insideCooldown, bypassCooldown: true })).toEqual({ action: 'send' });
    expect(
      planFulfilment({ contactSuppressedAt: null, lastSentAt: new Date(NOW.getTime() - 1000), bypassCooldown: true, now: NOW }),
    ).toEqual({ action: 'send' });
  });

  it('bypasses the cooldown only: a suppressed contact is still never emailed', () => {
    expect(
      planFulfilment({ contactSuppressedAt: '2026-09-01T00:00:00.000Z', lastSentAt: null, bypassCooldown: true, now: NOW }),
    ).toEqual({ action: 'skip', status: 'suppressed' });
  });

  it('does not change the one-hour duration for anyone else', () => {
    expect(planFulfilment({ contactSuppressedAt: null, lastSentAt: new Date('2026-09-16T10:59:00.000Z'), now: NOW })).toEqual({
      action: 'send',
    });
  });
});
