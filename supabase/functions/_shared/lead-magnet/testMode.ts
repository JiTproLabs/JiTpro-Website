/**
 * Test-mode safeguards for integration testing on `jitpro_website`, the
 * website's only Supabase project (lead-gen plan G-8, §15.2; Decisions 1A,
 * 1B, and 2 approved 2026-09-15).
 *
 * Everything here is inert unless `LEAD_MAGNET_TEST_MODE` is exactly `true`.
 * At go-live that secret, `LEAD_MAGNET_TURNSTILE_TEST_SECRET`, and
 * `LEAD_MAGNET_TEST_FAULT_SECRET` are removed (launch item L-6), which
 * disables every hook in this module. No Deno-specific or browser-specific APIs.
 */

import { constantTimeEqual } from './crypto.ts';

export function isTestModeEnabled(value: string | undefined | null): boolean {
  return value === 'true';
}

/** Recipients allowed while test mode is on (Decision D3.9). Exact domains; no subdomains. */
export const TEST_MODE_ALLOWED_EMAIL_DOMAINS = ['resend.dev', 'jit-pro.com'] as const;

/** Expects a normalised address. */
export function isTestModeRecipientAllowed(email: string): boolean {
  const domain = email.slice(email.lastIndexOf('@') + 1);
  return (TEST_MODE_ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain);
}

export type TurnstileSecretChoice = {
  secret: string | null;
  source: 'test' | 'production';
};

/**
 * Decision 1A: the Cloudflare test secret is honoured only in test mode. The
 * shared `TURNSTILE_SECRET_KEY` is read, never changed.
 */
export function resolveTurnstileSecret(options: {
  testMode: boolean;
  testSecret: string | undefined;
  productionSecret: string | undefined;
}): TurnstileSecretChoice {
  const testSecret = options.testSecret?.trim();
  if (options.testMode && testSecret) return { secret: testSecret, source: 'test' };
  const productionSecret = options.productionSecret?.trim();
  return { secret: productionSecret ? productionSecret : null, source: 'production' };
}

export const TEST_FAULT_HEADER = 'x-lead-magnet-test-fault';
export const TEST_FAULT_SECRET_HEADER = 'x-lead-magnet-test-fault-secret';
export const TEST_FAULT_PERSISTENCE = 'persistence';
/** A configured fault secret shorter than this disables the hook. */
export const TEST_FAULT_SECRET_MIN_LENGTH = 32;

/**
 * Decision 1B: a simulated persistence failure requires ALL of test mode, the
 * fault header set to `persistence`, a configured fault secret of adequate
 * length, and a request header matching that secret. The header alone never
 * activates it.
 */
export async function isPersistenceFaultRequested(options: {
  testMode: boolean;
  faultHeader: string | null;
  providedSecret: string | null;
  configuredSecret: string | undefined;
}): Promise<boolean> {
  if (!options.testMode) return false;
  if (options.faultHeader !== TEST_FAULT_PERSISTENCE) return false;
  const configured = options.configuredSecret;
  if (!configured || configured.length < TEST_FAULT_SECRET_MIN_LENGTH) return false;
  if (!options.providedSecret) return false;
  return constantTimeEqual(options.providedSecret, configured);
}
