import { describe, expect, it, vi } from 'vitest';
import {
  FUNNEL_ERROR_KINDS,
  FUNNEL_EVENTS,
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

describe('sendFunnelEvent is inert until Sprint 6', () => {
  it('sends nothing over the network', () => {
    const fetchSpy = vi.fn();
    const original = globalThis.fetch;
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    try {
      sendFunnelEvent({
        event: 'lead_magnet_form_submit',
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
        event: 'lead_magnet_cta_click',
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
