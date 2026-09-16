/**
 * First-touch attribution for the lead-magnet funnel (Decisions D2.3, D4.5).
 *
 * The rule is FIRST touch, not last: the UTMs, referrer, and landing path are
 * captured once per browsing session and never overwritten, so a visitor who
 * arrives from a campaign, reads three pages, and then requests the guide is
 * still attributed to the campaign that brought them.
 *
 * Storage is `sessionStorage`, which dies with the tab. No cookie, no
 * identifier, nothing that outlives the session (plan §4.7, §8.4). The page
 * path and placement are read at submit time instead, because they describe
 * the request rather than the visit.
 *
 * This module is pure apart from the two injected sources (the URL and the
 * store), so the whole of it is unit-tested without a browser.
 */

export const ATTRIBUTION_STORAGE_KEY = 'jp.leadMagnet.attribution.v1';

/** The five UTM parameters recorded on every request row. */
export const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  landingPath: string | null;
};

export const EMPTY_ATTRIBUTION: Attribution = {
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
  referrer: null,
  landingPath: null,
};

/**
 * The slice of `sessionStorage` this module needs. Narrowed to an interface so
 * tests pass a plain object and the component passes the real store.
 */
export type AttributionStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

/** Everything the capture needs about the arrival, injected rather than read. */
export type ArrivalContext = {
  /** `window.location.search`, with or without its leading `?`. */
  search: string;
  /** `window.location.pathname`. */
  pathname: string;
  /** `document.referrer`; the empty string when there is none. */
  referrer: string;
};

const UTM_MAX_LENGTH = 256;
const REFERRER_MAX_LENGTH = 1024;
const PATH_MAX_LENGTH = 512;

function clean(value: string | null, maxLength: number): string | null {
  if (value === null) return null;
  let result = '';
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code > 0x1f && code !== 0x7f) result += character;
  }
  const trimmed = result.trim();
  return trimmed === '' ? null : trimmed.slice(0, maxLength);
}

function stripQueryAndFragment(value: string): string {
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

/**
 * An internal referrer is not attribution: a visitor moving from `/learn-more`
 * to `/field-guide` did not arrive from anywhere. Only an off-site origin is
 * recorded, and its query string is dropped so a referring URL cannot smuggle
 * personal data into the row (Decision 6, 2026-09-15).
 */
export function normaliseReferrer(referrer: string, currentOrigin: string | null): string | null {
  const cleaned = clean(referrer, REFERRER_MAX_LENGTH);
  if (cleaned === null) return null;
  if (!/^https?:\/\/[^/\s]+/i.test(cleaned)) return null;
  if (currentOrigin && cleaned.toLowerCase().startsWith(`${currentOrigin.toLowerCase()}/`)) return null;
  if (currentOrigin && cleaned.toLowerCase() === currentOrigin.toLowerCase()) return null;
  return clean(stripQueryAndFragment(cleaned), REFERRER_MAX_LENGTH);
}

export function normaliseLandingPath(pathname: string): string | null {
  const cleaned = clean(pathname, PATH_MAX_LENGTH);
  if (cleaned === null) return null;
  const path = stripQueryAndFragment(cleaned);
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path.slice(0, PATH_MAX_LENGTH);
}

/** Reads the five UTMs out of a query string. Absent and blank are both null. */
export function readUtms(search: string): Record<UtmKey, string | null> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const result = {} as Record<UtmKey, string | null>;
  for (const key of UTM_KEYS) result[key] = clean(params.get(`utm_${key}`), UTM_MAX_LENGTH);
  return result;
}

export function attributionFromArrival(arrival: ArrivalContext, currentOrigin: string | null): Attribution {
  const utms = readUtms(arrival.search);
  return {
    utmSource: utms.source,
    utmMedium: utms.medium,
    utmCampaign: utms.campaign,
    utmContent: utms.content,
    utmTerm: utms.term,
    referrer: normaliseReferrer(arrival.referrer, currentOrigin),
    landingPath: normaliseLandingPath(arrival.pathname),
  };
}

function isEmpty(attribution: Attribution): boolean {
  return (Object.keys(EMPTY_ATTRIBUTION) as (keyof Attribution)[]).every(
    (key) => attribution[key] === null,
  );
}

function parseStored(raw: string | null): Attribution | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    const result = { ...EMPTY_ATTRIBUTION };
    for (const key of Object.keys(EMPTY_ATTRIBUTION) as (keyof Attribution)[]) {
      const value = record[key];
      result[key] = typeof value === 'string' && value !== '' ? value : null;
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Returns this session's attribution, capturing it on the first call.
 *
 * A stored record always wins, which is what makes the attribution first
 * touch. Nothing is written when the arrival carries no attribution at all,
 * so a visitor who lands on the homepage with no campaign and later clicks a
 * campaign link within the same session is still attributed to that campaign.
 *
 * Every storage access is wrapped: Safari private mode throws on `setItem`,
 * and a visitor with storage blocked must still be able to request the guide.
 */
export function resolveAttribution(
  arrival: ArrivalContext,
  currentOrigin: string | null,
  store: AttributionStore | null,
): Attribution {
  const fresh = attributionFromArrival(arrival, currentOrigin);
  if (!store) return fresh;

  let stored: Attribution | null = null;
  try {
    stored = parseStored(store.getItem(ATTRIBUTION_STORAGE_KEY));
  } catch {
    return fresh;
  }
  if (stored && !isEmpty(stored)) return stored;

  if (isEmpty(fresh)) return fresh;
  try {
    store.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    /* Storage unavailable. The request still carries `fresh` in this page's memory. */
  }
  return fresh;
}
