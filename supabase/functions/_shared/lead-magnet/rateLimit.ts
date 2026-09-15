/**
 * Abuse-control decisions for the lead-magnet functions (lead-gen plan
 * Decisions D2.7, D5.5; §9.1). The limits are single named constants so they
 * can be tuned from production behaviour.
 *
 * Rate limiting fails open (Decision 5, 2026-09-15): the caller skips it, and
 * logs why, when the salt, the client IP, hashing, or the database is
 * unavailable. No Deno-specific or browser-specific APIs.
 */

import { sha256Hex } from './crypto.ts';

/** Guide request attempts allowed per salted IP hash per window. */
export const REQUEST_RATE_LIMIT = 10;
/** Funnel events allowed per salted IP hash per window (record-lead-magnet-event, Sprint 6). */
export const EVENT_RATE_LIMIT = 100;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const IP_ACTIVITY_RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * The count includes the attempt just recorded, so the eleventh attempt in a
 * window is the first one refused.
 */
export function isOverLimit(countIncludingThisAttempt: number, limit: number): boolean {
  return countIncludingThisAttempt > limit;
}

const IP_PATTERN = /^[0-9a-f:.]{2,45}$/i;

/** The client address from `x-forwarded-for` (its first entry), or null. */
export function clientIpFrom(forwardedFor: string | null): string | null {
  if (!forwardedFor) return null;
  const first = forwardedFor.split(',')[0].trim();
  return IP_PATTERN.test(first) ? first : null;
}

/**
 * SHA-256 of the secret salt, the UTC date, and the address. Changing the date
 * changes the hash, so hashes cannot be linked across days (§9.1).
 */
export async function hashIp(ip: string, salt: string, now: Date): Promise<string> {
  const utcDate = now.toISOString().slice(0, 10);
  return sha256Hex(`${salt}:${utcDate}:${ip}`);
}

export function rateLimitWindowStart(now: Date): string {
  return new Date(now.getTime() - RATE_LIMIT_WINDOW_MS).toISOString();
}

export function ipActivityRetentionCutoff(now: Date): string {
  return new Date(now.getTime() - IP_ACTIVITY_RETENTION_MS).toISOString();
}

/** The total from a PostgREST `Content-Range` header such as `*\/11` or `0-10/11`. */
export function parseContentRangeTotal(header: string | null): number | null {
  if (!header) return null;
  const match = /\/(\d+)$/.exec(header.trim());
  return match ? Number(match[1]) : null;
}
