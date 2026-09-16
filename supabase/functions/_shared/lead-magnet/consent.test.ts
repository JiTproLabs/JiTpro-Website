import { describe, expect, it } from 'vitest';
import {
  consentForNewContact,
  consentUpdateForExistingContact,
  isConsentStatus,
  type ConsentContext,
} from './consent.ts';

const NOW = '2026-09-15T12:00:00.000Z';

function context(checked: boolean): ConsentContext {
  return {
    checked,
    textVersion: 'v1',
    placement: 'home-band',
    pagePath: '/',
    assetId: 'procurement-field-guide',
    nowIso: NOW,
  };
}

const expectedEvidence = {
  consent_text_version: 'v1',
  consent_recorded_at: NOW,
  consent_method: 'checkbox',
  consent_placement: 'home-band',
  consent_page_path: '/',
  consent_asset_id: 'procurement-field-guide',
};

describe('consent for a new contact', () => {
  it('unchecked checkbox → transactional_only, never marketing consent', () => {
    expect(consentForNewContact(context(false))).toEqual({
      consent_status: 'transactional_only',
      marketing_opt_in_at: null,
      ...expectedEvidence,
    });
  });

  it('checked checkbox → marketing_opt_in with evidence', () => {
    expect(consentForNewContact(context(true))).toEqual({
      consent_status: 'marketing_opt_in',
      marketing_opt_in_at: NOW,
      ...expectedEvidence,
    });
  });
});

describe('consent for an existing contact', () => {
  it('existing marketing_opt_in + unchecked → unchanged', () => {
    expect(consentUpdateForExistingContact('marketing_opt_in', context(false))).toEqual({});
  });

  it('existing unsubscribed + unchecked → unchanged (an unsubscribe is never overwritten)', () => {
    expect(consentUpdateForExistingContact('unsubscribed', context(false))).toEqual({});
  });

  it('existing transactional_only + unchecked → unchanged', () => {
    expect(consentUpdateForExistingContact('transactional_only', context(false))).toEqual({});
  });

  it('existing transactional_only + checked → marketing_opt_in', () => {
    expect(consentUpdateForExistingContact('transactional_only', context(true))).toEqual({
      consent_status: 'marketing_opt_in',
      marketing_opt_in_at: NOW,
      ...expectedEvidence,
    });
  });

  it('existing unsubscribed + explicitly checked → new marketing_opt_in with fresh evidence', () => {
    expect(consentUpdateForExistingContact('unsubscribed', context(true))).toEqual({
      consent_status: 'marketing_opt_in',
      marketing_opt_in_at: NOW,
      ...expectedEvidence,
    });
  });

  it('existing marketing_opt_in + checked → refreshed evidence, original opt-in time kept', () => {
    const update = consentUpdateForExistingContact('marketing_opt_in', context(true));
    expect(update).toEqual(expectedEvidence);
    expect(update).not.toHaveProperty('marketing_opt_in_at');
    expect(update).not.toHaveProperty('consent_status');
  });

  it('no unchecked request ever produces marketing_opt_in', () => {
    for (const status of ['transactional_only', 'marketing_opt_in', 'unsubscribed'] as const) {
      expect(consentUpdateForExistingContact(status, context(false))).not.toHaveProperty('consent_status');
    }
    expect(consentForNewContact(context(false)).consent_status).not.toBe('marketing_opt_in');
  });
});

describe('isConsentStatus', () => {
  it('accepts only the three approved states', () => {
    expect(isConsentStatus('transactional_only')).toBe(true);
    expect(isConsentStatus('marketing_opt_in')).toBe(true);
    expect(isConsentStatus('unsubscribed')).toBe(true);
    expect(isConsentStatus('subscribed')).toBe(false);
    expect(isConsentStatus(null)).toBe(false);
  });
});
