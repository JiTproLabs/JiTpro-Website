import { describe, expect, it } from 'vitest';
import { CORS_ALLOWED_HEADERS, corsHeadersFor, isAllowedOrigin } from './cors.ts';

describe('isAllowedOrigin (Decision 4)', () => {
  it.each([
    'https://jit-pro.com',
    // S6-3 (2026-09-18, Issue #54): `www` is a second production custom domain.
    // The Cloudflare www → apex 301 is the primary canonical-host control; this
    // is the secondary control behind it, so losing that rule cannot silently
    // break lead capture again.
    'https://www.jit-pro.com',
    'http://localhost:5173',
    'https://feature-navigation-simplific.jitpro-website.pages.dev',
    'https://a0b70718.jitpro-website.pages.dev',
  ])('allows %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(true);
  });

  it.each([
    null,
    '',
    'null',
    'http://jit-pro.com',
    // S6-3 keeps every near-miss on the www host refused: the allowance is one
    // exact string, not a pattern.
    'http://www.jit-pro.com',
    'https://www.jit-pro.com/',
    'https://www2.jit-pro.com',
    'https://www.jit-pro.com.evil.example',
    'https://jit-pro.com.evil.example',
    'https://evil.example',
    'https://jitpro-website.pages.dev',
    'https://a.b.jitpro-website.pages.dev',
    'https://preview.jitpro-website.pages.dev.evil.example',
    'https://preview.jitpro-website.pages.dev:8443',
    'https://-preview.jitpro-website.pages.dev',
    'https://other-project.pages.dev',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://jit-pro.com/',
  ])('refuses %j', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(false);
  });
});

describe('corsHeadersFor', () => {
  it('echoes an allowed origin exactly', () => {
    const headers = corsHeadersFor('https://jit-pro.com');
    expect(headers['Access-Control-Allow-Origin']).toBe('https://jit-pro.com');
    expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(headers.Vary).toBe('Origin');
  });

  /**
   * S6-3: the www host is echoed back as itself, never rewritten to the apex.
   * Rewriting it would fail the browser's CORS check, which compares the header
   * against the requesting origin byte for byte.
   */
  it('echoes the www production origin as itself', () => {
    const headers = corsHeadersFor('https://www.jit-pro.com');
    expect(headers['Access-Control-Allow-Origin']).toBe('https://www.jit-pro.com');
  });

  it('never reflects a disallowed origin', () => {
    const headers = corsHeadersFor('https://evil.example');
    expect(headers).toEqual({ Vary: 'Origin' });
    expect(JSON.stringify(headers)).not.toContain('evil');
  });

  it('does not allow browsers to send the test-fault headers', () => {
    expect(CORS_ALLOWED_HEADERS.toLowerCase()).not.toContain('x-lead-magnet');
  });
});
