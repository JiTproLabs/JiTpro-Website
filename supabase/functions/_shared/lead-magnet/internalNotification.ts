/**
 * The internal notification for one valid Field Guide request (lead-gen plan
 * §7.2, §25.8; sender per S2-19).
 *
 * Sent independently of the visitor's fulfilment email: its content reports the
 * fulfilment outcome, but its success or failure never affects the visitor.
 * Carries no IP address, no IP hash, and no user agent. No Deno-specific or
 * browser-specific APIs.
 */

import { escapeHtml, LEAD_MAGNET_NOTIFICATIONS_FROM, LEAD_MAGNET_NOTIFY_TO, type RenderedEmail } from './recoveryAlert.ts';
import type { LeadMagnetPlacement } from './registry.ts';
import type { FulfilmentEmailStatus } from './outcome.ts';

export { LEAD_MAGNET_NOTIFICATIONS_FROM, LEAD_MAGNET_NOTIFY_TO };

export const NOTIFICATION_SUBJECT_PREFIX = 'New Field Guide request';

export type NotificationDetails = {
  email: string;
  placement: LeadMagnetPlacement;
  pagePath: string | null;
  landingPath: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  isRepeat: boolean;
  marketingOptIn: boolean;
  emailStatus: FulfilmentEmailStatus | null;
  requestId: string;
  timestampIso: string;
};

/** UTM summary, else the referrer host, else "direct" (§25.8). */
export function sourceSummary(details: NotificationDetails): string {
  const utms = [details.utmSource, details.utmMedium, details.utmCampaign].filter(
    (value): value is string => typeof value === 'string' && value !== '',
  );
  if (utms.length > 0) return utms.join(' / ');
  if (details.referrer) {
    const withoutScheme = details.referrer.replace(/^https?:\/\//i, '');
    const host = withoutScheme.split('/')[0];
    if (host) return host;
  }
  return 'direct';
}

export function notificationRows(details: NotificationDetails): Array<[string, string]> {
  return [
    ['Requester email', details.email],
    ['Placement', details.placement],
    ['Page', details.pagePath ?? '(not provided)'],
    ['Landing page', details.landingPath ?? '(not provided)'],
    ['Source', sourceSummary(details)],
    ['Repeat request', details.isRepeat ? 'yes' : 'no'],
    ['Marketing opt-in', details.marketingOptIn ? 'yes' : 'no'],
    ['Fulfilment email', details.emailStatus ?? 'not attempted'],
    ['Request id', details.requestId],
    ['Timestamp', details.timestampIso],
  ];
}

export function renderInternalNotification(details: NotificationDetails): RenderedEmail {
  const rows = notificationRows(details);

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return {
    subject: `${NOTIFICATION_SUBJECT_PREFIX} · ${details.placement}`,
    html:
      `<p>A visitor requested the JiTpro Field Guide.</p>` +
      `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${htmlRows}</table>`,
    text:
      'A visitor requested the JiTpro Field Guide.\n\n' +
      rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  };
}
