import { describe, expect, it } from 'vitest';
import {
  LEAD_MAGNET_NOTIFICATIONS_FROM,
  LEAD_MAGNET_NOTIFY_TO,
  RECOVERY_ALERT_SUBJECT,
  escapeHtml,
  renderRecoveryAlert,
} from './recoveryAlert.ts';

const details = {
  timestampIso: '2026-09-15T12:00:00.000Z',
  requestId: '6f1d7c2e-2f44-4d7e-9a0a-1b2c3d4e5f60',
  placement: 'landing-page' as const,
  pagePath: '/field-guide',
  errorSummary: 'POST lead_magnet_requests failed: HTTP 500',
  email: 'delivered+lm-test@resend.dev',
};

describe('recovery alert (§25.9)', () => {
  it('uses the approved sender, recipient, and subject', () => {
    expect(LEAD_MAGNET_NOTIFICATIONS_FROM).toBe('JiTpro Notifications <info@jit-pro.com>');
    expect(LEAD_MAGNET_NOTIFY_TO).toBe('info@jit-pro.com');
    expect(renderRecoveryAlert(details).subject).toBe(RECOVERY_ALERT_SUBJECT);
    expect(RECOVERY_ALERT_SUBJECT).toBe('Field Guide request could not be saved');
  });

  it('sends only from the verified jit-pro.com root domain (S2-19)', () => {
    expect(LEAD_MAGNET_NOTIFICATIONS_FROM).toMatch(/<[^@<>]+@jit-pro\.com>$/);
    expect(LEAD_MAGNET_NOTIFICATIONS_FROM).not.toContain('mail.jit-pro.com');
    expect(LEAD_MAGNET_NOTIFY_TO).toBe('info@jit-pro.com');
  });

  it('carries the approved fields, including the full requester email', () => {
    const { html, text } = renderRecoveryAlert(details);
    for (const value of [details.timestampIso, details.requestId, 'landing-page', '/field-guide', details.errorSummary]) {
      expect(text).toContain(value);
      expect(html).toContain(value);
    }
    expect(text).toContain('Requester email: delivered+lm-test@resend.dev');
    expect(html).toContain('delivered+lm-test@resend.dev');
  });

  it('never mentions IP data', () => {
    const { html, text } = renderRecoveryAlert(details);
    expect(`${html}${text}`.toLowerCase()).not.toMatch(/\bip\b|ip_hash|ip address/);
  });

  it('marks a missing page', () => {
    expect(renderRecoveryAlert({ ...details, pagePath: null }).text).toContain('Page: (not provided)');
  });

  it('escapes HTML in every value', () => {
    const { html } = renderRecoveryAlert({ ...details, errorSummary: '<img src=x onerror=alert(1)>' });
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});
