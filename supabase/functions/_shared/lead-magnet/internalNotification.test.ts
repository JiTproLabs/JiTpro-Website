import { describe, expect, it } from 'vitest';
import {
  LEAD_MAGNET_NOTIFICATIONS_FROM,
  LEAD_MAGNET_NOTIFY_TO,
  NOTIFICATION_SUBJECT_PREFIX,
  notificationRows,
  renderInternalNotification,
  sourceSummary,
  type NotificationDetails,
} from './internalNotification.ts';

const details: NotificationDetails = {
  email: 'delivered+lm-test@resend.dev',
  placement: 'home-band',
  pagePath: '/',
  landingPath: '/field-guide',
  utmSource: 'linkedin',
  utmMedium: 'social',
  utmCampaign: 'lm-test',
  referrer: 'https://www.linkedin.com/feed/',
  isRepeat: true,
  marketingOptIn: true,
  emailStatus: 'sent',
  requestId: '6f1d7c2e-2f44-4d7e-9a0a-1b2c3d4e5f60',
  timestampIso: '2026-09-16T09:00:00.000Z',
};

describe('internal notification (§25.8, S2-19)', () => {
  it('uses the approved sender, recipient, and subject pattern', () => {
    expect(LEAD_MAGNET_NOTIFICATIONS_FROM).toBe('JiTpro Notifications <info@jit-pro.com>');
    expect(LEAD_MAGNET_NOTIFY_TO).toBe('info@jit-pro.com');
    expect(renderInternalNotification(details).subject).toBe(`${NOTIFICATION_SUBJECT_PREFIX} · home-band`);
  });

  it('carries every approved field', () => {
    const { text } = renderInternalNotification(details);
    expect(text).toContain('Requester email: delivered+lm-test@resend.dev');
    expect(text).toContain('Placement: home-band');
    expect(text).toContain('Page: /');
    expect(text).toContain('Landing page: /field-guide');
    expect(text).toContain('Source: linkedin / social / lm-test');
    expect(text).toContain('Repeat request: yes');
    expect(text).toContain('Marketing opt-in: yes');
    expect(text).toContain('Fulfilment email: sent');
    expect(text).toContain(`Request id: ${details.requestId}`);
    expect(text).toContain('Timestamp: 2026-09-16T09:00:00.000Z');
    expect(notificationRows(details)).toHaveLength(10);
  });

  it('reports each fulfilment status honestly', () => {
    for (const status of ['sent', 'skipped_cooldown', 'failed', 'suppressed'] as const) {
      expect(renderInternalNotification({ ...details, emailStatus: status }).text).toContain(
        `Fulfilment email: ${status}`,
      );
    }
    expect(renderInternalNotification({ ...details, emailStatus: null }).text).toContain(
      'Fulfilment email: not attempted',
    );
  });

  it('never carries IP data or a user agent', () => {
    const { html, text } = renderInternalNotification(details);
    expect(`${html}${text}`.toLowerCase()).not.toMatch(/ip address|ip_hash|user agent|user-agent/);
  });

  it('escapes hostile values', () => {
    const { html } = renderInternalNotification({ ...details, pagePath: '/<img src=x onerror=alert(1)>' });
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });

  it('marks missing attribution rather than inventing it', () => {
    const { text } = renderInternalNotification({ ...details, pagePath: null, landingPath: null });
    expect(text).toContain('Page: (not provided)');
    expect(text).toContain('Landing page: (not provided)');
  });
});

describe('sourceSummary', () => {
  it('prefers the UTM summary', () => {
    expect(sourceSummary(details)).toBe('linkedin / social / lm-test');
    expect(sourceSummary({ ...details, utmMedium: null })).toBe('linkedin / lm-test');
  });

  it('falls back to the referrer host, then to "direct"', () => {
    const noUtms = { ...details, utmSource: null, utmMedium: null, utmCampaign: null };
    expect(sourceSummary(noUtms)).toBe('www.linkedin.com');
    expect(sourceSummary({ ...noUtms, referrer: null })).toBe('direct');
  });
});
