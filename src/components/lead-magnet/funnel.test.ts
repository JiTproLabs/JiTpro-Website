import { describe, expect, it, vi } from 'vitest';
import { FUNNEL_EVENTS, recordImpression, sendFunnelEvent, shouldRecordImpression, type FunnelStore } from './funnel';

function memoryStore(): FunnelStore & { data: Record<string, string> } {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe('the event vocabulary', () => {
  it('is exactly the seven names fixed by the plan', () => {
    expect([...FUNNEL_EVENTS]).toEqual([
      'cta_view',
      'cta_click',
      'form_view',
      'form_submit',
      'request_succeeded',
      'request_failed',
      'guide_opened',
    ]);
  });
});

describe('shouldRecordImpression', () => {
  it('reports the first sighting of a placement and suppresses the rest', () => {
    const store = memoryStore();
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', store)).toBe(true);
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', store)).toBe(false);
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', store)).toBe(false);
  });

  it('deduplicates per placement, not per asset', () => {
    const store = memoryStore();
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', store)).toBe(true);
    expect(shouldRecordImpression('procurement-field-guide', 'footer-link', store)).toBe(true);
    expect(shouldRecordImpression('procurement-field-guide', 'landing-page', store)).toBe(true);
  });

  it('over-counts rather than dropping the funnel when storage is unavailable', () => {
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', null)).toBe(true);
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', null)).toBe(true);
  });

  it('survives a store that throws', () => {
    const throwing: FunnelStore = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };
    expect(shouldRecordImpression('procurement-field-guide', 'home-band', throwing)).toBe(true);
  });

  it('keeps its dedupe flag in the browser and nowhere else', () => {
    const store = memoryStore();
    shouldRecordImpression('procurement-field-guide', 'home-band', store);
    const keys = Object.keys(store.data);
    expect(keys).toHaveLength(1);
    expect(keys[0]).toBe('jp.leadMagnet.ctaView.procurement-field-guide.home-band');
    expect(store.data[keys[0]]).toBe('1');
  });
});

describe('sendFunnelEvent is inert until Sprint 6', () => {
  it('sends nothing over the network', () => {
    const fetchSpy = vi.fn();
    const original = globalThis.fetch;
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    try {
      sendFunnelEvent({
        event: 'form_submit',
        assetId: 'procurement-field-guide',
        placement: 'landing-page',
        pagePath: '/field-guide',
      });
    } finally {
      globalThis.fetch = original;
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns undefined and never throws, so analytics cannot break a capture', () => {
    expect(
      sendFunnelEvent({
        event: 'cta_click',
        assetId: 'procurement-field-guide',
        placement: 'home-band',
        pagePath: '/',
      }),
    ).toBeUndefined();
  });

  it('records an impression without touching the network', () => {
    const store = memoryStore();
    expect(() => recordImpression('procurement-field-guide', 'home-band', '/', store)).not.toThrow();
    expect(store.data['jp.leadMagnet.ctaView.procurement-field-guide.home-band']).toBe('1');
  });
});
