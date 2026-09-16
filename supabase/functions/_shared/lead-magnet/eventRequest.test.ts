import { describe, expect, it } from 'vitest';
import {
  ASSET_ID_MAX_LENGTH,
  FUNNEL_ERROR_KINDS,
  FUNNEL_EVENT_NAMES,
  buildEventRow,
  isFunnelErrorKind,
  isFunnelEventName,
  parseFunnelEvent,
} from './eventRequest.ts';

function body(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    event_name: 'lead_magnet_cta_click',
    asset_id: 'procurement-field-guide',
    placement: 'home-band',
    page_path: '/',
    ...overrides,
  };
}

describe('the fixed vocabulary', () => {
  it('is exactly the seven §8.1 names, in order', () => {
    expect([...FUNNEL_EVENT_NAMES]).toEqual([
      'lead_magnet_cta_view',
      'lead_magnet_cta_click',
      'lead_magnet_form_view',
      'lead_magnet_form_submit',
      'lead_magnet_request_success',
      'lead_magnet_request_error',
      'lead_magnet_download_click',
    ]);
  });

  it('is exactly the five §6.4 error kinds', () => {
    expect([...FUNNEL_ERROR_KINDS]).toEqual([
      'network',
      'validation',
      'verification',
      'rate_limited',
      'server',
    ]);
  });

  it('recognises known values and rejects unknown ones', () => {
    expect(isFunnelEventName('lead_magnet_form_view')).toBe(true);
    expect(isFunnelEventName('form_view')).toBe(false);
    expect(isFunnelEventName('')).toBe(false);
    expect(isFunnelErrorKind('rate_limited')).toBe(true);
    expect(isFunnelErrorKind('teapot')).toBe(false);
  });
});

describe('parseFunnelEvent', () => {
  it('accepts a well-formed event', () => {
    const result = parseFunnelEvent(body());
    expect(result.kind).toBe('valid');
    if (result.kind !== 'valid') return;
    expect(result.input).toEqual({
      eventName: 'lead_magnet_cta_click',
      assetId: 'procurement-field-guide',
      placement: 'home-band',
      pagePath: '/',
      errorKind: null,
    });
  });

  it('accepts every one of the seven names', () => {
    for (const eventName of FUNNEL_EVENT_NAMES) {
      expect(parseFunnelEvent(body({ event_name: eventName })).kind, eventName).toBe('valid');
    }
  });

  it('accepts every one of the four placements', () => {
    for (const placement of ['home-band', 'learn-more-band', 'footer-link', 'landing-page']) {
      expect(parseFunnelEvent(body({ placement })).kind, placement).toBe('valid');
    }
  });

  it('rejects a shortened event name, the exact drift this guards against', () => {
    const result = parseFunnelEvent(body({ event_name: 'cta_click' }));
    expect(result).toEqual({ kind: 'invalid', reason: 'unknown_event_name' });
  });

  it('rejects an unknown placement', () => {
    expect(parseFunnelEvent(body({ placement: 'sidebar' }))).toEqual({
      kind: 'invalid',
      reason: 'unknown_placement',
    });
  });

  it('rejects a body that is not an object', () => {
    for (const value of [null, undefined, 'x', 42, ['a']]) {
      expect(parseFunnelEvent(value).kind, String(value)).toBe('invalid');
    }
  });

  it('rejects a missing, empty, or over-long asset id', () => {
    expect(parseFunnelEvent(body({ asset_id: undefined }))).toEqual({
      kind: 'invalid',
      reason: 'missing_asset_id',
    });
    expect(parseFunnelEvent(body({ asset_id: '   ' }))).toEqual({ kind: 'invalid', reason: 'bad_asset_id' });
    expect(parseFunnelEvent(body({ asset_id: 'a'.repeat(ASSET_ID_MAX_LENGTH + 1) }))).toEqual({
      kind: 'invalid',
      reason: 'bad_asset_id',
    });
  });

  it('rejects a path that is not rooted, and a protocol-relative one', () => {
    expect(parseFunnelEvent(body({ page_path: 'field-guide' })).kind).toBe('invalid');
    expect(parseFunnelEvent(body({ page_path: '//evil.test' })).kind).toBe('invalid');
    expect(parseFunnelEvent(body({ page_path: '' })).kind).toBe('invalid');
  });

  it('strips a query string and fragment, so a path cannot smuggle personal data', () => {
    const result = parseFunnelEvent(body({ page_path: '/field-guide?email=someone@example.com#x' }));
    expect(result.kind).toBe('valid');
    if (result.kind !== 'valid') return;
    expect(result.input.pagePath).toBe('/field-guide');
  });

  it('accepts an error kind on the error event', () => {
    const result = parseFunnelEvent(
      body({ event_name: 'lead_magnet_request_error', error_kind: 'rate_limited' }),
    );
    expect(result.kind).toBe('valid');
    if (result.kind !== 'valid') return;
    expect(result.input.errorKind).toBe('rate_limited');
  });

  it('accepts the error event with no error kind, since §6.4 leaves it nullable', () => {
    const result = parseFunnelEvent(body({ event_name: 'lead_magnet_request_error' }));
    expect(result.kind).toBe('valid');
    if (result.kind !== 'valid') return;
    expect(result.input.errorKind).toBeNull();
  });

  it('refuses an error kind on any other event, matching the table scope constraint', () => {
    for (const eventName of FUNNEL_EVENT_NAMES.filter((n) => n !== 'lead_magnet_request_error')) {
      expect(parseFunnelEvent(body({ event_name: eventName, error_kind: 'server' })), eventName).toEqual({
        kind: 'invalid',
        reason: 'error_kind_on_non_error_event',
      });
    }
  });

  it('rejects an unknown error kind', () => {
    expect(
      parseFunnelEvent(body({ event_name: 'lead_magnet_request_error', error_kind: 'exploded' })),
    ).toEqual({ kind: 'invalid', reason: 'unknown_error_kind' });
  });

  it('treats an explicit null error kind as absent', () => {
    const result = parseFunnelEvent(body({ error_kind: null }));
    expect(result.kind).toBe('valid');
  });
});

describe('buildEventRow', () => {
  it('writes exactly the five approved columns and nothing else', () => {
    const result = parseFunnelEvent(body());
    if (result.kind !== 'valid') throw new Error('expected valid');
    expect(Object.keys(buildEventRow(result.input)).sort()).toEqual([
      'asset_id',
      'error_kind',
      'event_name',
      'page_path',
      'placement',
    ]);
  });

  it('never carries an identifier, however the caller decorates the body', () => {
    const result = parseFunnelEvent(
      body({ email: 'someone@example.com', session_id: 'abc', ip: '1.2.3.4', referrer: 'https://x.test' }),
    );
    if (result.kind !== 'valid') throw new Error('expected valid');
    const row = buildEventRow(result.input);
    for (const forbidden of ['email', 'session_id', 'visitor_id', 'ip', 'ip_hash', 'referrer', 'user_agent']) {
      expect(forbidden in row, forbidden).toBe(false);
    }
  });
});
