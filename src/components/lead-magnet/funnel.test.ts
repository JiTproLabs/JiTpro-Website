import { describe, expect, it, vi } from 'vitest';
import {
  FUNNEL_ERROR_KINDS,
  FUNNEL_EVENTS,
  buildEventBody,
  funnelOutcomeFor,
  recordImpression,
  sendFunnelEvent,
  shouldRecordImpression,
  type FunnelStore,
} from './funnel';
import type { SubmitResult } from './leadCaptureMachine';

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
  it('is exactly the seven names fixed by §8.1', () => {
    expect([...FUNNEL_EVENTS]).toEqual([
      'lead_magnet_cta_view',
      'lead_magnet_cta_click',
      'lead_magnet_form_view',
      'lead_magnet_form_submit',
      'lead_magnet_request_success',
      'lead_magnet_request_error',
      'lead_magnet_download_click',
    ]);
  });

  it('prefixes every name, so the database CHECK constraint can be written from this list', () => {
    for (const name of FUNNEL_EVENTS) expect(name.startsWith('lead_magnet_')).toBe(true);
  });

  it('is exactly the five error kinds of §6.4', () => {
    expect([...FUNNEL_ERROR_KINDS]).toEqual([
      'network',
      'validation',
      'verification',
      'rate_limited',
      'server',
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

describe('buildEventBody', () => {
  it('sends exactly the five keys the endpoint parses', () => {
    const body = buildEventBody({
      event: 'lead_magnet_cta_click',
      assetId: 'procurement-field-guide',
      placement: 'home-band',
      pagePath: '/',
    });
    expect(Object.keys(body).sort()).toEqual([
      'asset_id',
      'error_kind',
      'event_name',
      'page_path',
      'placement',
    ]);
  });

  it('carries the error kind on the error event', () => {
    const body = buildEventBody({
      event: 'lead_magnet_request_error',
      assetId: 'procurement-field-guide',
      placement: 'landing-page',
      pagePath: '/field-guide',
      errorKind: 'rate_limited',
    });
    expect(body.error_kind).toBe('rate_limited');
  });

  it('never sends an error kind on any other event, which the endpoint would reject', () => {
    for (const event of FUNNEL_EVENTS.filter((e) => e !== 'lead_magnet_request_error')) {
      const body = buildEventBody({
        event,
        assetId: 'procurement-field-guide',
        placement: 'home-band',
        pagePath: '/',
        errorKind: 'server',
      });
      expect(body.error_kind, event).toBeNull();
    }
  });

  it('produces a body the server parser accepts', async () => {
    const { parseFunnelEvent } = await import(
      '../../../supabase/functions/_shared/lead-magnet/eventRequest.ts'
    );
    for (const event of FUNNEL_EVENTS) {
      const body = buildEventBody({
        event,
        assetId: 'procurement-field-guide',
        placement: 'home-band',
        pagePath: '/',
        ...(event === 'lead_magnet_request_error' ? { errorKind: 'network' as const } : {}),
      });
      expect(parseFunnelEvent(body).kind, event).toBe('valid');
    }
  });
});

describe('sendFunnelEvent never breaks a capture', () => {
  it('prefers sendBeacon, which survives the page unloading', () => {
    const beacon = vi.fn(() => true);
    const fetchSpy = vi.fn();
    const originalNavigator = globalThis.navigator;
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, 'navigator', {
      value: { sendBeacon: beacon },
      configurable: true,
    });
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    try {
      sendFunnelEvent({
        event: 'lead_magnet_download_click',
        assetId: 'procurement-field-guide',
        placement: 'home-band',
        pagePath: '/',
      });
    } finally {
      Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true });
      globalThis.fetch = originalFetch;
    }
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to keepalive fetch when sendBeacon refuses', () => {
    const beacon = vi.fn(() => false);
    const fetchSpy = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    const originalNavigator = globalThis.navigator;
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, 'navigator', { value: { sendBeacon: beacon }, configurable: true });
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    try {
      sendFunnelEvent({
        event: 'lead_magnet_cta_view',
        assetId: 'procurement-field-guide',
        placement: 'home-band',
        pagePath: '/',
      });
    } finally {
      Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true });
      globalThis.fetch = originalFetch;
    }
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({ keepalive: true, method: 'POST' });
  });

  it('swallows a throwing transport rather than surfacing it to the visitor', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        sendBeacon: () => {
          throw new Error('blocked');
        },
      },
      configurable: true,
    });
    try {
      expect(() =>
        sendFunnelEvent({
          event: 'lead_magnet_form_submit',
          assetId: 'procurement-field-guide',
          placement: 'home-band',
          pagePath: '/',
        }),
      ).not.toThrow();
    } finally {
      Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true });
    }
  });

  it('records an impression without throwing', () => {
    const store = memoryStore();
    expect(() => recordImpression('procurement-field-guide', 'home-band', '/', store)).not.toThrow();
    expect(store.data['jp.leadMagnet.ctaView.procurement-field-guide.home-band']).toBe('1');
  });
});

describe('funnelOutcomeFor: what counts as a conversion (§8.1)', () => {
  const GUIDE = 'https://jit-pro.com/guides/procurement-field-guide';

  it('counts a stored request as success', () => {
    expect(funnelOutcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' })).toEqual({
      event: 'lead_magnet_request_success',
    });
  });

  /**
   * The correctness fix approved 2026-09-16. Storage and access define the
   * conversion; delivery does not. Counting a cooled-down email as a funnel
   * failure would report real captures as errors and understate conversion.
   */
  it('still counts a stored request as success when the email was not sent', () => {
    for (const emailStatus of ['skipped_cooldown', 'failed', 'suppressed', null] as const) {
      expect(
        funnelOutcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus }),
        `email_status ${String(emailStatus)}`,
      ).toEqual({ event: 'lead_magnet_request_success' });
    }
  });

  it('keeps the honeypot indistinguishable, because it answers stored: true', () => {
    expect(funnelOutcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: null })).toEqual({
      event: 'lead_magnet_request_success',
    });
  });

  it('counts an accepted but unstored request as a server error, not a conversion', () => {
    expect(funnelOutcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: false, emailStatus: null })).toEqual({
      event: 'lead_magnet_request_error',
      errorKind: 'server',
    });
  });

  it('maps every rejection to its approved error kind', () => {
    const cases: Array<[SubmitResult, string]> = [
      [{ kind: 'rejected', error: 'invalid_email', guideUrl: null }, 'validation'],
      [{ kind: 'rejected', error: 'invalid_request', guideUrl: GUIDE }, 'validation'],
      [{ kind: 'rejected', error: 'verification_failed', guideUrl: GUIDE }, 'verification'],
      [{ kind: 'rejected', error: 'rate_limited', guideUrl: GUIDE }, 'rate_limited'],
      [{ kind: 'rejected', error: 'server_error', guideUrl: GUIDE }, 'server'],
      [{ kind: 'rejected', error: 'test_mode_refused', guideUrl: GUIDE }, 'server'],
    ];
    for (const [result, errorKind] of cases) {
      expect(funnelOutcomeFor(result), JSON.stringify(result)).toEqual({
        event: 'lead_magnet_request_error',
        errorKind,
      });
    }
  });

  it('maps a network failure or timeout to the network kind', () => {
    expect(funnelOutcomeFor({ kind: 'network', guideUrl: GUIDE })).toEqual({
      event: 'lead_magnet_request_error',
      errorKind: 'network',
    });
  });

  it('never attaches an error kind to a success', () => {
    const outcome = funnelOutcomeFor({ kind: 'accepted', guideUrl: GUIDE, stored: true, emailStatus: 'sent' });
    expect('errorKind' in outcome && outcome.errorKind !== undefined).toBe(false);
  });

  it('only ever emits kinds the database constraint allows', () => {
    const results: SubmitResult[] = [
      { kind: 'network', guideUrl: GUIDE },
      { kind: 'accepted', guideUrl: GUIDE, stored: false, emailStatus: null },
      { kind: 'rejected', error: 'invalid_email', guideUrl: null },
      { kind: 'rejected', error: 'verification_failed', guideUrl: GUIDE },
      { kind: 'rejected', error: 'rate_limited', guideUrl: GUIDE },
      { kind: 'rejected', error: 'server_error', guideUrl: GUIDE },
    ];
    for (const result of results) {
      const outcome = funnelOutcomeFor(result);
      expect(FUNNEL_ERROR_KINDS).toContain(outcome.errorKind);
    }
  });
});
