import { describe, expect, it } from 'vitest';
import {
  PENDING_VERIFICATION,
  VERIFIED_CLAIMS,
  PRIVACY_CONTACT_EMAIL,
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
  PRIVACY_STRINGS,
} from './privacyNotice';
import { CONSENT_TEXTS, CURRENT_CONSENT_TEXT_VERSION } from './consentTexts';

const EM_DASH = '—';

/**
 * The privacy notice is approved copy under legal review (L-3). These tests
 * hold the parts that could silently drift back: the S3-1 no-address rule,
 * the consent model the page describes, and the copy-governance rules.
 */

describe('S3-1: no postal address anywhere in this workflow', () => {
  it('names info@jit-pro.com as the only contact route', () => {
    expect(PRIVACY_CONTACT_EMAIL).toBe('info@jit-pro.com');
    const contact = PRIVACY_SECTIONS.find((section) => section.heading === 'Contact.');
    expect(contact?.body?.[0]).toBe('JiTpro. Email: info@jit-pro.com.');
  });

  it('carries no street, suite, city, state, postcode, or PO box anywhere', () => {
    const addressish = [
      /\bP\.?O\.?\s*Box\b/i,
      /\bSuite\b/i,
      /\bStreet\b/i,
      /\bAvenue\b/i,
      /\bRoad\b/i,
      /\bDrive\b/i,
      /\bBoulevard\b/i,
      /\bFloor\b/i,
      /\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/,
      /\b\d{5}(-\d{4})?\b/,
      /\bmailing address\b/i,
      /\bpostal address\b/i,
    ];
    for (const value of PRIVACY_STRINGS) {
      for (const pattern of addressish) {
        expect(pattern.test(value), `${pattern} matched: ${value}`).toBe(false);
      }
    }
  });
});

describe('the consent model the notice describes', () => {
  it('states plainly that requesting the guide is not marketing consent (D3.4)', () => {
    const marketing = PRIVACY_SECTIONS.find((section) => section.heading === 'Marketing email and your choices.');
    expect(marketing?.body?.[0]).toContain('Requesting the Field Guide does not sign you up for marketing.');
    expect(marketing?.body?.[0]).toContain('transactional only');
  });

  it('describes the opt-in as the ticked box the form actually renders', () => {
    const given = PRIVACY_SECTIONS.find((section) => section.heading === 'Information you give us.');
    expect(given?.bullets?.[0]).toContain('whether you ticked the box asking for occasional JiTpro insights');
    expect(CONSENT_TEXTS[CURRENT_CONSENT_TEXT_VERSION].text).toContain('Also send me occasional JiTpro insights');
  });

  it('offers withdrawal by email, since V1 has no unsubscribe endpoint (D3.6)', () => {
    const marketing = PRIVACY_SECTIONS.find((section) => section.heading === 'Marketing email and your choices.');
    expect(marketing?.body?.[0]).toContain('emailing info@jit-pro.com');
  });
});

describe('what the notice claims about the implementation', () => {
  it('describes session storage, not cookies, for first-touch attribution', () => {
    const cookies = PRIVACY_SECTIONS.find((section) => section.heading === 'Cookies.');
    expect(cookies?.body?.[0]).toContain('We do not set cookies for analytics or advertising.');
    expect(cookies?.body?.[0]).toContain('Session storage, described above, is not a cookie');
  });

  /**
   * Corrected 2026-09-16 after verification. jit-pro.com sets no cookies on any
   * route, but submitting the form causes a short-lived security cookie to be
   * set by the infrastructure that processes the request. The old sentence
   * attributed every cookie to the provider serving the website.
   */
  it('covers the providers that PROCESS a request, not only the one serving the site', () => {
    const cookies = PRIVACY_SECTIONS.find((section) => section.heading === 'Cookies.')?.body?.[0] ?? '';
    expect(cookies).toContain('process your request');
    expect(cookies).toContain('submitting the Field Guide form may cause a short-lived security cookie');
    // The superseded attribution must not come back.
    expect(cookies).not.toContain('Cloudflare, which serves our website, may set');
  });

  /**
   * Corrected 2026-09-16. There is no Resend webhook receiver (F-7 deferred),
   * so JiTpro never receives asynchronous bounce or complaint notifications.
   * The old paragraph described a system that does.
   */
  it('claims only the immediate send result, never asynchronous bounce or complaint notices', () => {
    const email = PRIVACY_SECTIONS.find((s) => s.heading === 'Email delivery records.')?.body?.[0] ?? '';
    expect(email).toContain('we record the immediate result our provider returns for that attempt');
    expect(email).toContain('may stop delivering to an address it identifies as undeliverable or problematic');
    for (const withdrawn of [
      'tells us whether a message was delivered, bounced, or was reported as unwanted',
      'If an address bounces or is reported as unwanted, we stop sending to it',
      'We keep that status so we do not try again',
    ]) {
      expect(email, withdrawn).not.toContain(withdrawn);
    }
  });

  it('records what verification produced, so the checks are visible rather than assumed', () => {
    expect(VERIFIED_CLAIMS).toHaveLength(3);
    for (const claim of VERIFIED_CLAIMS) expect(claim).toMatch(/VERIFIED/);
    // Only the publication date is still outstanding.
    expect(PENDING_VERIFICATION).toHaveLength(1);
    expect(PENDING_VERIFICATION[0]).toContain('Last updated');
  });

  it('describes the salted IP hash and its 24-hour retention (D2.7)', () => {
    const abuse = PRIVACY_SECTIONS.find((section) => section.heading === 'Information used only to prevent abuse.');
    expect(abuse?.bullets?.[1]).toContain('one-way, salted hash');
    expect(abuse?.bullets?.[1]).toContain('up to 24 hours');
    expect(abuse?.bullets?.[1]).toContain('We do not store your IP address itself in our database.');
  });

  it('claims no identifier in the funnel counts (D4.6, D4.7)', () => {
    const analytics = PRIVACY_SECTIONS.find((section) => section.heading === 'Website analytics.');
    expect(analytics?.body?.[0]).toContain('no identifier, no email address, and no IP address');
    expect(analytics?.body?.[0]).toContain('We do not use Google Analytics or advertising trackers.');
  });
});

describe('editorial governance', () => {
  it('renders no internal verification marker to a visitor', () => {
    for (const value of PRIVACY_STRINGS) {
      expect(value, value).not.toContain('[verify');
      expect(value, value).not.toContain('TODO');
      expect(value, value).not.toContain('[launch date]');
    }
  });

  it('keeps the outstanding verification items as a working list instead', () => {
    expect(PENDING_VERIFICATION.length).toBeGreaterThan(0);
  });

  it('renders no verification bookkeeping to a visitor', () => {
    for (const value of PRIVACY_STRINGS) {
      expect(value, value).not.toContain('VERIFIED');
      expect(value, value).not.toContain('F-7');
    }
  });

  it('uses no em dashes (§7.7)', () => {
    for (const value of PRIVACY_STRINGS) expect(value, value).not.toContain(EM_DASH);
  });

  it('carries the legal-review designation until L-3 closes', () => {
    expect(PRIVACY_INTRO.reviewNotice).toContain('pending legal review');
  });

  it('states no publication date until the page goes live, rather than guessing one', () => {
    expect(PRIVACY_LAST_UPDATED).toBeNull();
  });

  it('covers every section of the approved notice', () => {
    expect(PRIVACY_SECTIONS.map((section) => section.heading)).toEqual([
      'Who we are.',
      'What this notice covers.',
      'Information you give us.',
      'Information collected automatically when you request the Field Guide.',
      'Information used only to prevent abuse.',
      'Website analytics.',
      'Cookies.',
      'Why we use your information.',
      'Marketing email and your choices.',
      'Email delivery records.',
      'Who processes your information for us.',
      'Where your information is processed.',
      'How long we keep it.',
      'Your rights and requests.',
      'Children.',
      'Changes to this notice.',
      'Contact.',
    ]);
  });
});
