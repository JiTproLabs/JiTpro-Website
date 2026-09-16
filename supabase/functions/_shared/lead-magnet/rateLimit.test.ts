import { describe, expect, it } from 'vitest';
import {
  EVENT_RATE_LIMIT,
  IP_ACTIVITY_RETENTION_MS,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_RATE_LIMIT,
  clientIpFrom,
  hashIp,
  ipActivityRetentionCutoff,
  isOverLimit,
  parseContentRangeTotal,
  rateLimitWindowStart,
} from './rateLimit.ts';

describe('rate-limit constants (Decision D5.5)', () => {
  it('matches the approved ceilings and windows', () => {
    expect(REQUEST_RATE_LIMIT).toBe(10);
    expect(EVENT_RATE_LIMIT).toBe(100);
    expect(RATE_LIMIT_WINDOW_MS).toBe(10 * 60 * 1000);
    expect(IP_ACTIVITY_RETENTION_MS).toBe(24 * 60 * 60 * 1000);
  });
});

describe('isOverLimit', () => {
  it('allows the tenth attempt and refuses the eleventh', () => {
    expect(isOverLimit(1, REQUEST_RATE_LIMIT)).toBe(false);
    expect(isOverLimit(10, REQUEST_RATE_LIMIT)).toBe(false);
    expect(isOverLimit(11, REQUEST_RATE_LIMIT)).toBe(true);
  });
});

describe('clientIpFrom', () => {
  it('takes the first x-forwarded-for entry', () => {
    expect(clientIpFrom('203.0.113.7, 10.0.0.1')).toBe('203.0.113.7');
    expect(clientIpFrom(' 2001:db8::1 ')).toBe('2001:db8::1');
  });

  it('returns null when the address is missing or implausible', () => {
    expect(clientIpFrom(null)).toBeNull();
    expect(clientIpFrom('')).toBeNull();
    expect(clientIpFrom('unknown')).toBeNull();
    expect(clientIpFrom('<script>')).toBeNull();
  });
});

describe('hashIp', () => {
  const day1 = new Date('2026-09-15T08:00:00.000Z');
  const laterDay1 = new Date('2026-09-15T23:59:59.000Z');
  const day2 = new Date('2026-09-16T00:00:01.000Z');

  it('is a 64-character hex digest that does not contain the address', async () => {
    const hash = await hashIp('203.0.113.7', 'salt-value', day1);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain('203');
  });

  it('is stable within a UTC day', async () => {
    expect(await hashIp('203.0.113.7', 'salt-value', day1)).toBe(await hashIp('203.0.113.7', 'salt-value', laterDay1));
  });

  it('changes with the UTC date and with the salt, so hashes cannot be linked across days', async () => {
    const base = await hashIp('203.0.113.7', 'salt-value', day1);
    expect(await hashIp('203.0.113.7', 'salt-value', day2)).not.toBe(base);
    expect(await hashIp('203.0.113.7', 'other-salt', day1)).not.toBe(base);
  });
});

describe('time windows', () => {
  const now = new Date('2026-09-15T12:00:00.000Z');

  it('starts the rate-limit window ten minutes ago', () => {
    expect(rateLimitWindowStart(now)).toBe('2026-09-15T11:50:00.000Z');
  });

  it('expires IP activity after 24 hours', () => {
    expect(ipActivityRetentionCutoff(now)).toBe('2026-09-14T12:00:00.000Z');
  });
});

describe('parseContentRangeTotal', () => {
  it('reads the total from PostgREST content-range headers', () => {
    expect(parseContentRangeTotal('*/11')).toBe(11);
    expect(parseContentRangeTotal('0-10/11')).toBe(11);
    expect(parseContentRangeTotal('*/0')).toBe(0);
  });

  it('returns null when no total is available', () => {
    expect(parseContentRangeTotal(null)).toBeNull();
    expect(parseContentRangeTotal('0-10/*')).toBeNull();
  });
});
