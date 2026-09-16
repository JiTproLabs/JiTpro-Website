/**
 * Decisions around the fulfilment send (lead-gen plan D2.2, D3.6, D5.3, §13).
 *
 * Every branch still grants the visitor the guide; these functions only decide
 * whether an email is attempted and what the row honestly records.
 * No Deno-specific or browser-specific APIs.
 */

import { shouldSendFulfilmentEmail } from './cooldown.ts';
import type { FulfilmentEmailStatus } from './outcome.ts';
import type { ResendOutcome } from './resendDiagnostics.ts';

export type FulfilmentPlan =
  | { action: 'send' }
  | { action: 'skip'; status: Extract<FulfilmentEmailStatus, 'skipped_cooldown' | 'suppressed'> };

/**
 * A suppressed contact is never emailed. Otherwise the one-hour cooldown
 * decides, measured from the most recent successfully sent request.
 */
export function planFulfilment(options: {
  contactSuppressedAt: string | null;
  lastSentAt: Date | null;
  now: Date;
  /**
   * Test-mode-only override (S3-2). Skips the cooldown, and only the cooldown:
   * suppression still wins, so a suppressed contact is never emailed.
   */
  bypassCooldown?: boolean;
}): FulfilmentPlan {
  if (options.contactSuppressedAt) return { action: 'skip', status: 'suppressed' };
  if (options.bypassCooldown) return { action: 'send' };
  if (!shouldSendFulfilmentEmail(options.lastSentAt, options.now)) {
    return { action: 'skip', status: 'skipped_cooldown' };
  }
  return { action: 'send' };
}

const SUPPRESSION_HINT = /suppress|blocked recipient|recipient.*(blocked|denied)/i;

/**
 * Maps a Resend rejection to a row status. Only a clearly suppression-shaped
 * rejection counts as `suppressed`; everything else is `failed`, so a transient
 * provider problem never marks a contact undeliverable.
 */
export function classifyResendFailure(outcome: Extract<ResendOutcome, { ok: false }>): Extract<
  FulfilmentEmailStatus,
  'suppressed' | 'failed'
> {
  const haystack = `${outcome.errorName ?? ''} ${outcome.errorMessage ?? ''}`;
  return SUPPRESSION_HINT.test(haystack) ? 'suppressed' : 'failed';
}

/** True when the row's status means the contact should be marked suppressed. */
export function shouldRecordContactSuppression(
  status: FulfilmentEmailStatus,
  contactSuppressedAt: string | null,
): boolean {
  return status === 'suppressed' && contactSuppressedAt === null;
}
