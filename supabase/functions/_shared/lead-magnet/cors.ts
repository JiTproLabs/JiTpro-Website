/**
 * CORS for the lead-magnet functions (Decision 4, approved 2026-09-15).
 *
 * Browser requests are allowed only from the production site, Cloudflare
 * Pages previews of this project, and the local dev server. An origin is
 * echoed back only after it matches exactly; anything else receives no
 * `Access-Control-Allow-Origin` header. Command-line requests are unaffected.
 * No Deno-specific or browser-specific APIs.
 */

const EXACT_ALLOWED_ORIGINS = ['https://jit-pro.com', 'http://localhost:5173'] as const;

/** One DNS label under the project's Pages domain, e.g. `https://feature-x.jitpro-website.pages.dev`. */
const PAGES_PREVIEW_ORIGIN = /^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.jitpro-website\.pages\.dev$/;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if ((EXACT_ALLOWED_ORIGINS as readonly string[]).includes(origin)) return true;
  return PAGES_PREVIEW_ORIGIN.test(origin);
}

/**
 * The test-fault headers are deliberately absent from `Allow-Headers`, so a
 * browser can never send them cross-origin.
 */
export const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization, X-Client-Info, Apikey';

export function corsHeadersFor(origin: string | null): Record<string, string> {
  if (!isAllowedOrigin(origin)) return { Vary: 'Origin' };
  return {
    'Access-Control-Allow-Origin': origin as string,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}
