/**
 * The persistence-failure recovery alert (lead-gen plan §7.2.1, §25.9;
 * Decision D6.13).
 *
 * Sent only when a request could not be saved, so JiTpro can recover the lead
 * by hand. It deliberately carries the FULL requester email address; ordinary
 * logs stay masked. It never carries an IP address or IP hash.
 * No Deno-specific or browser-specific APIs.
 */

import type { LeadMagnetPlacement } from './registry.ts';

/**
 * Internal lead-magnet mail uses the verified marketing-site identity (S2-19).
 * `mail.jit-pro.com` is NOT verified in the marketing-site Resend account and
 * must not appear anywhere in this workflow.
 */
export const LEAD_MAGNET_NOTIFICATIONS_FROM = 'JiTpro Notifications <info@jit-pro.com>';
export const LEAD_MAGNET_NOTIFY_TO = 'info@jit-pro.com';
export const RECOVERY_ALERT_SUBJECT = 'Field Guide request could not be saved';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type RecoveryAlertDetails = {
  timestampIso: string;
  requestId: string;
  placement: LeadMagnetPlacement;
  pagePath: string | null;
  errorSummary: string;
  email: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

export function renderRecoveryAlert(details: RecoveryAlertDetails): RenderedEmail {
  const rows: Array<[string, string]> = [
    ['Timestamp', details.timestampIso],
    ['Request id', details.requestId],
    ['Placement', details.placement],
    ['Page', details.pagePath ?? '(not provided)'],
    ['Error', details.errorSummary],
    ['Requester email', details.email],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return {
    subject: RECOVERY_ALERT_SUBJECT,
    html:
      `<p>A Field Guide request could not be saved. The visitor was still given the guide.</p>` +
      `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${htmlRows}</table>`,
    text:
      'A Field Guide request could not be saved. The visitor was still given the guide.\n\n' +
      rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  };
}
