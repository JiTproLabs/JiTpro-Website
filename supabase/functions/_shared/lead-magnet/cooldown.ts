/**
 * The fulfilment-email re-send cooldown (lead-gen plan, Decisions D2.2, D5.3).
 *
 * A request is always recorded and always granted access. The guide email is
 * sent again only when the last SUCCESSFUL fulfilment email to that address is
 * more than one hour old. Used by the send step in Sprint 3.
 * No Deno-specific or browser-specific APIs.
 */

export const FULFILMENT_EMAIL_COOLDOWN_MS = 60 * 60 * 1000;

export function shouldSendFulfilmentEmail(lastSuccessfulSendAt: Date | null, now: Date): boolean {
  if (lastSuccessfulSendAt === null) return true;
  return now.getTime() - lastSuccessfulSendAt.getTime() > FULFILMENT_EMAIL_COOLDOWN_MS;
}
