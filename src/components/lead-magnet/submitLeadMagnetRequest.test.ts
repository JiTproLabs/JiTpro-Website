import { describe, expect, it } from 'vitest';
import { HONEYPOT_FIELD } from '../../../supabase/functions/_shared/lead-magnet/request.ts';
import { parseLeadMagnetRequest } from '../../../supabase/functions/_shared/lead-magnet/request.ts';
import { EMPTY_ATTRIBUTION } from './attribution';
import { buildRequestBody, interpretResponse, type LeadMagnetSubmission } from './submitLeadMagnetRequest';

const GUIDE = 'https://jit-pro.com/guides/procurement-field-guide';

function submission(overrides: Partial<LeadMagnetSubmission> = {}): LeadMagnetSubmission {
  return {
    email: 'buyer@example.com',
    assetId: 'procurement-field-guide',
    placement: 'landing-page',
    pagePath: '/field-guide',
    marketingOptIn: false,
    consentTextVersion: 'v1',
    turnstileToken: 'token',
    attribution: { ...EMPTY_ATTRIBUTION, utmSource: 'linkedin', landingPath: '/field-guide' },
    honeypot: '',
    ...overrides,
  };
}

describe('buildRequestBody', () => {
  it('produces a body the server accepts as valid', () => {
    const result = parseLeadMagnetRequest(buildRequestBody(submission()));
    expect(result.kind).toBe('valid');
  });

  it('carries the attribution through under the server key names', () => {
    const body = buildRequestBody(submission());
    expect(body.utm_source).toBe('linkedin');
    expect(body.landing_path).toBe('/field-guide');
    expect(body.asset_id).toBe('procurement-field-guide');
    expect(body.consent_text_version).toBe('v1');
  });

  it('sends the honeypot under the exact field name the server checks', () => {
    const body = buildRequestBody(submission());
    expect(HONEYPOT_FIELD in body).toBe(true);
    expect(body[HONEYPOT_FIELD]).toBe('');
  });

  it('is detected as a bot by the server when the honeypot is filled', () => {
    const result = parseLeadMagnetRequest(buildRequestBody(submission({ honeypot: 'http://spam.test' })));
    expect(result.kind).toBe('honeypot');
  });

  it('sends marketing opt-in as a real boolean, false by default', () => {
    expect(buildRequestBody(submission()).marketing_opt_in).toBe(false);
    expect(buildRequestBody(submission({ marketingOptIn: true })).marketing_opt_in).toBe(true);
  });

  it('never sends a field the server does not parse', () => {
    const allowed = new Set([
      'email',
      'asset_id',
      'placement',
      'page_path',
      'landing_path',
      'referrer',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'marketing_opt_in',
      'consent_text_version',
      'turnstile_token',
      HONEYPOT_FIELD,
    ]);
    for (const key of Object.keys(buildRequestBody(submission()))) {
      expect(allowed.has(key)).toBe(true);
    }
  });
});

describe('interpretResponse', () => {
  it('reads an accepted, sent response', () => {
    const result = interpretResponse(
      true,
      { ok: true, request_id: 'r', guide_url: GUIDE, stored: true, email_status: 'sent' },
      GUIDE,
    );
    expect(result).toEqual({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' });
  });

  it('reads the cooldown status', () => {
    const result = interpretResponse(
      true,
      { ok: true, request_id: 'r', guide_url: GUIDE, stored: true, email_status: 'skipped_cooldown' },
      GUIDE,
    );
    expect(result).toMatchObject({ kind: 'accepted', emailStatus: 'skipped_cooldown' });
  });

  it('reports stored false honestly', () => {
    const result = interpretResponse(
      true,
      { ok: true, request_id: 'r', guide_url: GUIDE, stored: false, email_status: null },
      GUIDE,
    );
    expect(result).toMatchObject({ kind: 'accepted', stored: false, emailStatus: null });
  });

  it('keeps an invalid email free of a guide URL so the form shows a field error', () => {
    const result = interpretResponse(
      false,
      { ok: false, request_id: 'r', guide_url: null, stored: false, email_status: null, error: 'invalid_email' },
      GUIDE,
    );
    expect(result).toEqual({ kind: 'rejected', error: 'invalid_email', guideUrl: null });
  });

  it('carries the guide URL on every other rejection', () => {
    for (const error of ['rate_limited', 'verification_failed', 'server_error', 'test_mode_refused'] as const) {
      const result = interpretResponse(
        false,
        { ok: false, request_id: 'r', guide_url: GUIDE, stored: false, email_status: null, error },
        GUIDE,
      );
      expect(result).toEqual({ kind: 'rejected', error, guideUrl: GUIDE });
    }
  });

  it('falls back to the locally known guide URL when the response omits one', () => {
    const result = interpretResponse(false, { ok: false, error: 'server_error' }, GUIDE);
    expect(result).toMatchObject({ kind: 'rejected', guideUrl: GUIDE });
  });

  it('treats a null body as a server error rather than trusting it', () => {
    expect(interpretResponse(true, null, GUIDE)).toEqual({
      kind: 'rejected',
      error: 'server_error',
      guideUrl: GUIDE,
    });
  });

  it('treats an unrecognised error code as a server error', () => {
    const result = interpretResponse(false, { ok: false, error: 'teapot' }, GUIDE);
    expect(result).toMatchObject({ kind: 'rejected', error: 'server_error' });
  });

  it('treats an unrecognised email status as no status rather than guessing', () => {
    const result = interpretResponse(
      true,
      { ok: true, guide_url: GUIDE, stored: true, email_status: 'queued' },
      GUIDE,
    );
    expect(result).toMatchObject({ kind: 'accepted', emailStatus: null });
  });

  it('does not accept a 200 whose body is not ok', () => {
    const result = interpretResponse(true, { ok: false, error: 'rate_limited', guide_url: GUIDE }, GUIDE);
    expect(result).toMatchObject({ kind: 'rejected', error: 'rate_limited' });
  });

  it('ignores an array body', () => {
    expect(interpretResponse(true, ['nope'], GUIDE)).toMatchObject({ kind: 'rejected', error: 'server_error' });
  });
});
