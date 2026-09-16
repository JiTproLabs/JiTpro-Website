import { describe, expect, it } from 'vitest';
import { FULFILMENT_EMAIL_COOLDOWN_MS, shouldSendFulfilmentEmail } from './cooldown.ts';

describe('fulfilment email cooldown (Decision D2.2)', () => {
  const now = new Date('2026-09-15T12:00:00.000Z');

  it('is one hour', () => {
    expect(FULFILMENT_EMAIL_COOLDOWN_MS).toBe(60 * 60 * 1000);
  });

  it('sends when no successful email has been sent before', () => {
    expect(shouldSendFulfilmentEmail(null, now)).toBe(true);
  });

  it('does not send again within the hour', () => {
    expect(shouldSendFulfilmentEmail(new Date('2026-09-15T11:30:00.000Z'), now)).toBe(false);
    expect(shouldSendFulfilmentEmail(new Date('2026-09-15T11:00:00.000Z'), now)).toBe(false);
  });

  it('sends again once the last successful email is more than an hour old', () => {
    expect(shouldSendFulfilmentEmail(new Date('2026-09-15T10:59:59.999Z'), now)).toBe(true);
  });
});
