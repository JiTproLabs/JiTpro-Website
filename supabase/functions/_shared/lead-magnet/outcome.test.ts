import { describe, expect, it } from 'vitest';
import { DEFAULT_SITE_URL, LEAD_MAGNET_ERROR_STATUS, acceptedResponse, errorResponse, guideUrlFor } from './outcome.ts';

const REQUEST_ID = 'req-1';
const GUIDE = 'https://jit-pro.com/guides/procurement-field-guide';

describe('guideUrlFor', () => {
  it('builds the stable guide URL from SITE_URL', () => {
    expect(guideUrlFor('procurement-field-guide', 'https://jit-pro.com')).toBe(GUIDE);
    expect(guideUrlFor('procurement-field-guide', 'https://jit-pro.com///')).toBe(GUIDE);
  });

  it('defaults to the production site', () => {
    expect(DEFAULT_SITE_URL).toBe('https://jit-pro.com');
    expect(guideUrlFor('procurement-field-guide')).toBe(GUIDE);
    expect(guideUrlFor('procurement-field-guide', '  ')).toBe(GUIDE);
  });
});

describe('acceptedResponse', () => {
  it('is HTTP 200 with the guide and an honest stored flag', () => {
    expect(acceptedResponse(REQUEST_ID, GUIDE, true)).toEqual({
      status: 200,
      body: { ok: true, request_id: REQUEST_ID, guide_url: GUIDE, stored: true, email_status: null },
    });
    expect(acceptedResponse(REQUEST_ID, GUIDE, false).body.stored).toBe(false);
  });

  it('reports email_status as null in Sprint 2 (Decision 3)', () => {
    expect(acceptedResponse(REQUEST_ID, GUIDE, true).body.email_status).toBeNull();
  });
});

describe('errorResponse', () => {
  it('maps each error to the approved status', () => {
    expect(LEAD_MAGNET_ERROR_STATUS).toEqual({
      invalid_email: 400,
      invalid_request: 400,
      verification_failed: 403,
      test_mode_refused: 403,
      rate_limited: 429,
      server_error: 500,
    });
  });

  it('keeps the guide URL for every failure except an invalid email (fail open)', () => {
    for (const code of ['invalid_request', 'verification_failed', 'test_mode_refused', 'rate_limited', 'server_error'] as const) {
      const response = errorResponse(code, REQUEST_ID, GUIDE);
      expect(response.status).toBe(LEAD_MAGNET_ERROR_STATUS[code]);
      expect(response.body).toEqual({
        ok: false,
        request_id: REQUEST_ID,
        guide_url: GUIDE,
        stored: false,
        email_status: null,
        error: code,
      });
    }
  });

  it('withholds the guide URL for an invalid email so the site shows the field error', () => {
    expect(errorResponse('invalid_email', REQUEST_ID, GUIDE).body.guide_url).toBeNull();
  });
});
