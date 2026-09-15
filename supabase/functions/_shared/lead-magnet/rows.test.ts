import { describe, expect, it } from 'vitest';
import type { LeadMagnetRequestInput } from './request.ts';
import { buildExistingContactUpdate, buildNewContactRow, buildRequestRow } from './rows.ts';

const NOW = '2026-09-15T12:00:00.000Z';
const REQUEST_ID = '6f1d7c2e-2f44-4d7e-9a0a-1b2c3d4e5f60';
const CONTACT_ID = '0b9f5e1a-7c3d-4e2f-8a1b-9c8d7e6f5a40';

const input: LeadMagnetRequestInput = {
  email: 'delivered+lm-test@resend.dev',
  assetId: 'procurement-field-guide',
  placement: 'landing-page',
  pagePath: '/field-guide',
  landingPath: '/field-guide',
  referrer: 'https://www.linkedin.com/feed/',
  utmSource: 'linkedin',
  utmMedium: 'social',
  utmCampaign: 'lm-test',
  utmContent: 'run-1',
  utmTerm: null,
  marketingOptIn: false,
  consentTextVersion: 'v1',
  turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
};

describe('buildNewContactRow', () => {
  it('writes identity, first-touch attribution, and consent', () => {
    expect(buildNewContactRow(input, NOW)).toEqual({
      email: 'delivered+lm-test@resend.dev',
      first_seen_at: NOW,
      last_seen_at: NOW,
      first_source: 'linkedin',
      first_medium: 'social',
      first_campaign: 'lm-test',
      first_landing_path: '/field-guide',
      first_referrer: 'https://www.linkedin.com/feed/',
      updated_at: NOW,
      consent_status: 'transactional_only',
      marketing_opt_in_at: null,
      consent_text_version: 'v1',
      consent_recorded_at: NOW,
      consent_method: 'checkbox',
      consent_placement: 'landing-page',
      consent_page_path: '/field-guide',
      consent_asset_id: 'procurement-field-guide',
    });
  });

  it('never includes the Turnstile token', () => {
    expect(JSON.stringify(buildNewContactRow(input, NOW))).not.toContain('DUMMY');
  });
});

describe('buildExistingContactUpdate', () => {
  it('touches only last seen and updated when the checkbox is unchecked', () => {
    expect(buildExistingContactUpdate('unsubscribed', input, NOW)).toEqual({
      last_seen_at: NOW,
      updated_at: NOW,
    });
  });

  it('never overwrites first-touch attribution', () => {
    const update = buildExistingContactUpdate('transactional_only', { ...input, marketingOptIn: true }, NOW);
    for (const column of ['email', 'first_seen_at', 'first_source', 'first_medium', 'first_campaign', 'first_landing_path', 'first_referrer']) {
      expect(update).not.toHaveProperty(column);
    }
    expect(update).toMatchObject({ consent_status: 'marketing_opt_in', marketing_opt_in_at: NOW });
  });
});

describe('buildRequestRow', () => {
  it('records the request with the registry version and a null email status', () => {
    expect(buildRequestRow({ input, requestId: REQUEST_ID, contactId: CONTACT_ID, isRepeat: true })).toEqual({
      id: REQUEST_ID,
      contact_id: CONTACT_ID,
      email: 'delivered+lm-test@resend.dev',
      asset_id: 'procurement-field-guide',
      asset_version: '2026-09',
      placement: 'landing-page',
      page_path: '/field-guide',
      landing_path: '/field-guide',
      referrer: 'https://www.linkedin.com/feed/',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'lm-test',
      utm_content: 'run-1',
      utm_term: null,
      is_repeat: true,
      marketing_opt_in_checked: false,
      consent_text_version: 'v1',
      consent_method: 'checkbox',
      turnstile_passed: true,
      fulfilment_status: 'delivered_inline',
      email_status: null,
    });
  });
});
