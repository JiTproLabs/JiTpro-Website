import { describe, expect, it } from 'vitest';
import {
  CONSENT_METHOD,
  CONSENT_STATUSES,
  CONSENT_TEXTS,
  CURRENT_CONSENT_TEXT_VERSION,
  isConsentTextVersion,
} from './consentTexts';

/**
 * FROZEN COPIES OF EVERY RELEASED CONSENT TEXT.
 *
 * A version that visitors may have agreed to is never edited in place
 * (lead-gen plan, Decision D3.10). If wording changes, add `v2` to the
 * registry AND to this table; do not touch `v1`. A failure here means a
 * released sentence was altered and historical consent records would no
 * longer be readable against the words actually shown.
 */
const RELEASED: Record<string, { introduced: string; text: string }> = {
  v1: {
    introduced: '2026-09-12',
    text: 'Also send me occasional JiTpro insights on keeping projects ahead of the field. I can unsubscribe at any time.',
  },
};

describe('consent texts', () => {
  it('never alters a released version', () => {
    for (const [version, frozen] of Object.entries(RELEASED)) {
      expect(CONSENT_TEXTS).toHaveProperty(version);
      const live = CONSENT_TEXTS[version as keyof typeof CONSENT_TEXTS];
      expect(live.version).toBe(version);
      expect(live.introduced).toBe(frozen.introduced);
      expect(live.text).toBe(frozen.text);
    }
  });

  it('has a frozen copy for every registered version', () => {
    expect(Object.keys(CONSENT_TEXTS).sort()).toEqual(Object.keys(RELEASED).sort());
  });

  it('points the current version at a registered entry', () => {
    expect(isConsentTextVersion(CURRENT_CONSENT_TEXT_VERSION)).toBe(true);
    expect(CURRENT_CONSENT_TEXT_VERSION).toBe('v1');
    expect(isConsentTextVersion('v99')).toBe(false);
    expect(isConsentTextVersion(undefined)).toBe(false);
  });

  it('keeps the wording inside the copy rules that govern the dialog', () => {
    for (const { text } of Object.values(CONSENT_TEXTS)) {
      expect(text.toLowerCase()).not.toContain('procurement');
      expect(text).not.toContain('—');
      expect(text.endsWith('.')).toBe(true);
    }
  });

  it('records the V1 consent method and the three lifecycle states', () => {
    expect(CONSENT_METHOD).toBe('checkbox');
    expect([...CONSENT_STATUSES]).toEqual(['transactional_only', 'marketing_opt_in', 'unsubscribed']);
  });
});
