/**
 * Log hygiene for the lead-magnet functions (lead-gen plan, Decision D5.7).
 *
 * Ordinary function logs never contain a full email address, a raw IP, an IP
 * hash, or any secret. The durable row holds the full address; the
 * persistence-failure recovery alert is the one deliberate exception (D6.13).
 */

/** `delivered+lm-test@resend.dev` → `de***@resend.dev`. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at <= 0 || at === email.length - 1) return '***';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  return `${visible}***@${domain}`;
}

const MAX_ERROR_SUMMARY_LENGTH = 200;

/** A short, secret-free description of a caught value, for logs and the recovery alert. */
export function summariseError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message.slice(0, MAX_ERROR_SUMMARY_LENGTH);
  }
  return 'unknown error';
}
