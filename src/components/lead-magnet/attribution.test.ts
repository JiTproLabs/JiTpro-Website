import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTION_STORAGE_KEY,
  EMPTY_ATTRIBUTION,
  attributionFromArrival,
  normaliseLandingPath,
  normaliseReferrer,
  readUtms,
  resolveAttribution,
  type ArrivalContext,
  type AttributionStore,
} from './attribution';

const ORIGIN = 'https://jit-pro.com';

function arrival(overrides: Partial<ArrivalContext> = {}): ArrivalContext {
  return { search: '', pathname: '/', referrer: '', ...overrides };
}

function memoryStore(initial: Record<string, string> = {}): AttributionStore & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe('readUtms', () => {
  it('reads all five parameters', () => {
    const utms = readUtms('?utm_source=linkedin&utm_medium=social&utm_campaign=guide&utm_content=post-a&utm_term=gc');
    expect(utms).toEqual({
      source: 'linkedin',
      medium: 'social',
      campaign: 'guide',
      content: 'post-a',
      term: 'gc',
    });
  });

  it('works with or without the leading question mark', () => {
    expect(readUtms('utm_source=x').source).toBe('x');
    expect(readUtms('?utm_source=x').source).toBe('x');
  });

  it('treats absent and blank alike as null', () => {
    const utms = readUtms('?utm_source=&utm_medium=%20%20');
    expect(utms.source).toBeNull();
    expect(utms.medium).toBeNull();
    expect(utms.campaign).toBeNull();
  });

  it('truncates an over-long value to the server limit', () => {
    const long = 'a'.repeat(300);
    expect(readUtms('?utm_source=' + long).source).toHaveLength(256);
  });

  it('strips control characters', () => {
    expect(readUtms('?utm_source=a%00b%09c').source).toBe('abc');
  });
});

describe('normaliseReferrer', () => {
  it('keeps an off-site referrer', () => {
    expect(normaliseReferrer('https://www.linkedin.com/feed/', ORIGIN)).toBe('https://www.linkedin.com/feed/');
  });

  it('drops the query string and fragment', () => {
    expect(normaliseReferrer('https://x.test/a?token=secret#frag', ORIGIN)).toBe('https://x.test/a');
  });

  it('rejects an internal referrer, which is not an arrival', () => {
    expect(normaliseReferrer('https://jit-pro.com/learn-more', ORIGIN)).toBeNull();
    expect(normaliseReferrer('https://jit-pro.com', ORIGIN)).toBeNull();
  });

  it('rejects the empty string and a non-http scheme', () => {
    expect(normaliseReferrer('', ORIGIN)).toBeNull();
    expect(normaliseReferrer('javascript:alert(1)', ORIGIN)).toBeNull();
    expect(normaliseReferrer('android-app://com.example', ORIGIN)).toBeNull();
  });

  it('keeps an off-site referrer when the origin is unknown', () => {
    expect(normaliseReferrer('https://x.test/a', null)).toBe('https://x.test/a');
  });
});

describe('normaliseLandingPath', () => {
  it('keeps a normal path', () => {
    expect(normaliseLandingPath('/field-guide')).toBe('/field-guide');
  });

  it('rejects a protocol-relative path and a non-rooted path', () => {
    expect(normaliseLandingPath('//evil.test')).toBeNull();
    expect(normaliseLandingPath('field-guide')).toBeNull();
  });

  it('rejects the empty string', () => {
    expect(normaliseLandingPath('')).toBeNull();
  });
});

describe('attributionFromArrival', () => {
  it('captures UTMs, referrer, and landing path together', () => {
    const result = attributionFromArrival(
      arrival({ search: '?utm_source=linkedin', pathname: '/field-guide', referrer: 'https://linkedin.com/x' }),
      ORIGIN,
    );
    expect(result.utmSource).toBe('linkedin');
    expect(result.landingPath).toBe('/field-guide');
    expect(result.referrer).toBe('https://linkedin.com/x');
  });

  it('records the landing path even for a plain direct arrival', () => {
    const result = attributionFromArrival(arrival({ pathname: '/' }), ORIGIN);
    expect(result.utmSource).toBeNull();
    expect(result.referrer).toBeNull();
    expect(result.landingPath).toBe('/');
  });
});

describe('resolveAttribution', () => {
  it('captures on the first call and writes it to the store', () => {
    const store = memoryStore();
    const result = resolveAttribution(
      arrival({ search: '?utm_campaign=first', pathname: '/field-guide' }),
      ORIGIN,
      store,
    );
    expect(result.utmCampaign).toBe('first');
    expect(JSON.parse(store.data[ATTRIBUTION_STORAGE_KEY]).utmCampaign).toBe('first');
  });

  it('is FIRST touch: a stored record is never overwritten by a later page', () => {
    const store = memoryStore();
    resolveAttribution(arrival({ search: '?utm_campaign=first', pathname: '/field-guide' }), ORIGIN, store);
    const second = resolveAttribution(
      arrival({ search: '?utm_campaign=second', pathname: '/contact' }),
      ORIGIN,
      store,
    );
    expect(second.utmCampaign).toBe('first');
    expect(second.landingPath).toBe('/field-guide');
  });

  it('does not store an empty arrival, so a later campaign link still wins', () => {
    const store = memoryStore();
    resolveAttribution(arrival({ pathname: '' }), ORIGIN, store);
    expect(store.data[ATTRIBUTION_STORAGE_KEY]).toBeUndefined();

    const later = resolveAttribution(arrival({ search: '?utm_campaign=real', pathname: '/' }), ORIGIN, store);
    expect(later.utmCampaign).toBe('real');
  });

  it('falls back to the live arrival when there is no store at all', () => {
    const result = resolveAttribution(arrival({ search: '?utm_source=x', pathname: '/' }), ORIGIN, null);
    expect(result.utmSource).toBe('x');
  });

  it('survives a store that throws on read', () => {
    const throwing: AttributionStore = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };
    expect(resolveAttribution(arrival({ search: '?utm_source=x' }), ORIGIN, throwing).utmSource).toBe('x');
  });

  it('survives a store that throws on write, as Safari private mode does', () => {
    const throwing: AttributionStore = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(resolveAttribution(arrival({ search: '?utm_source=x' }), ORIGIN, throwing).utmSource).toBe('x');
  });

  it('ignores corrupt stored JSON and recaptures', () => {
    const store = memoryStore({ [ATTRIBUTION_STORAGE_KEY]: '{not json' });
    expect(resolveAttribution(arrival({ search: '?utm_source=x' }), ORIGIN, store).utmSource).toBe('x');
  });

  it('ignores a stored record of the wrong shape', () => {
    const store = memoryStore({ [ATTRIBUTION_STORAGE_KEY]: '["array"]' });
    expect(resolveAttribution(arrival({ search: '?utm_source=x' }), ORIGIN, store).utmSource).toBe('x');
  });

  it('never invents a key the server does not accept', () => {
    const store = memoryStore({
      [ATTRIBUTION_STORAGE_KEY]: JSON.stringify({ utmSource: 'x', rogue: 'value' }),
    });
    const result = resolveAttribution(arrival(), ORIGIN, store);
    expect(Object.keys(result).sort()).toEqual(Object.keys(EMPTY_ATTRIBUTION).sort());
  });
});
