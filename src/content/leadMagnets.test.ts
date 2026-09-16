import { describe, expect, it } from 'vitest';
import {
  ALL_CUSTOMER_FACING_STRINGS,
  FIELD_GUIDE,
  FIELD_GUIDE_COPY,
  FIELD_GUIDE_ID,
  HOMEPAGE_GOVERNED_STRINGS,
  LEAD_MAGNET_ASSETS,
  LEAD_MAGNET_IDS,
  LEAD_MAGNET_PLACEMENTS,
  isLeadMagnetId,
  isLeadMagnetPlacement,
  stableRouteFor,
} from './leadMagnets';

/**
 * Registry invariants (lead-gen plan, Decisions D5.1, D5.2, D4.3) and copy
 * governance (Design System §20.1, §7.7). The `_redirects` and file-existence
 * checks join this file in Sprint 1b, when the approved PDF is committed.
 */

const EM_DASH = '—';

describe('lead-magnet registry', () => {
  it('registers the Field Guide with the approved identity', () => {
    expect(LEAD_MAGNET_IDS).toEqual(['procurement-field-guide']);
    expect(FIELD_GUIDE.id).toBe('procurement-field-guide');
    expect(FIELD_GUIDE.pageCount).toBe(31);
    expect(FIELD_GUIDE.landingPath).toBe('/field-guide');
    expect(FIELD_GUIDE.publicationTitle).toBe('What Will Stop Work Six Months From Now?');
    expect(FIELD_GUIDE.subtitle).toBe('The JiTpro Field Guide to Construction Procurement Control');
  });

  it.each(LEAD_MAGNET_IDS)('%s follows the /guides/<asset-slug> route convention', (id) => {
    const asset = LEAD_MAGNET_ASSETS[id];
    expect(asset.id).toBe(id);
    expect(asset.publicPath).toBe(stableRouteFor(id));
    expect(asset.publicPath).toBe('/guides/procurement-field-guide');
  });

  it.each(LEAD_MAGNET_IDS)('%s has a date-based version embedded in its versioned filename', (id) => {
    const asset = LEAD_MAGNET_ASSETS[id];
    expect(asset.version).toMatch(/^\d{4}-\d{2}$/);
    expect(asset.fileName).toMatch(/^jitpro-[a-z0-9-]+\.pdf$/);
    expect(asset.fileName.endsWith(`-${asset.version}.pdf`)).toBe(true);
  });

  it.each(LEAD_MAGNET_IDS)('%s presents a clean, version-free filename when saved', (id) => {
    const asset = LEAD_MAGNET_ASSETS[id];
    expect(asset.downloadFileName).toMatch(/^[A-Za-z0-9-]+\.pdf$/);
    expect(asset.downloadFileName).not.toContain(asset.version);
  });

  it('exposes exactly the four approved placements', () => {
    expect([...LEAD_MAGNET_PLACEMENTS]).toEqual(['home-band', 'learn-more-band', 'footer-link', 'landing-page']);
    expect(isLeadMagnetPlacement('home-band')).toBe(true);
    expect(isLeadMagnetPlacement('hero')).toBe(false);
    expect(isLeadMagnetPlacement(42)).toBe(false);
  });

  it('recognises known asset ids and rejects unknown ones', () => {
    expect(isLeadMagnetId('procurement-field-guide')).toBe(true);
    expect(isLeadMagnetId('worksheet')).toBe(false);
    expect(isLeadMagnetId('__proto__')).toBe(false);
    expect(isLeadMagnetId(null)).toBe(false);
  });
});

describe('approved copy', () => {
  it('matches the approved band, dialog, and outcome strings exactly', () => {
    expect(FIELD_GUIDE_COPY.band.heading).toBe('What will stop work six months from now?');
    expect(FIELD_GUIDE_COPY.band.button).toBe('Get the free field guide');
    expect(FIELD_GUIDE_COPY.dialog.heading).toBe('Get the free field guide');
    expect(FIELD_GUIDE_COPY.dialog.emailLabel).toBe('Email address');
    expect(FIELD_GUIDE_COPY.states.outcomeHeading).toBe('Your guide is ready.');
    expect(FIELD_GUIDE_COPY.states.openButton).toBe('Open the field guide');
    expect(FIELD_GUIDE_COPY.states.success('a@b.co')).toBe(
      'We’ve also emailed a link to a@b.co so you can return to it later.',
    );
    expect(FIELD_GUIDE_COPY.landing.covers).toHaveLength(7);
  });

  it('keeps the retired word off homepage-governed surfaces (Design System §20.1)', () => {
    for (const s of HOMEPAGE_GOVERNED_STRINGS) {
      expect(s.toLowerCase(), s).not.toContain('procurement');
    }
  });

  it('uses no em dashes anywhere customers read (Design System §7.7)', () => {
    for (const s of ALL_CUSTOMER_FACING_STRINGS) {
      expect(s, s).not.toContain(EM_DASH);
    }
  });

  it('sets site headings in sentence case and reserves title case for the publication title', () => {
    expect(FIELD_GUIDE_COPY.band.heading).toBe(FIELD_GUIDE.siteTitle);
    expect(FIELD_GUIDE_COPY.landing.heading).toBe(FIELD_GUIDE.siteTitle);
    expect(FIELD_GUIDE.siteTitle).toBe(FIELD_GUIDE.siteTitle.charAt(0) + FIELD_GUIDE.siteTitle.slice(1).toLowerCase());
    expect(FIELD_GUIDE_COPY.landing.browserTitle.startsWith(FIELD_GUIDE.publicationTitle)).toBe(true);
  });
});

describe('the capture experience renders the approved strings verbatim (§25.5, §25.6)', () => {
  it('carries the approved dialog sub line and browser-check notice', () => {
    expect(FIELD_GUIDE_COPY.dialog.subline).toBe(
      'What will stop work six months from now? We’ll open the guide right away and email you a link.',
    );
    expect(FIELD_GUIDE_COPY.dialog.turnstileNotice).toBe('One quick check before we open your guide.');
    expect(FIELD_GUIDE_COPY.dialog.close).toBe('Close');
  });

  it('carries the approved fine print, pointing at the privacy notice', () => {
    expect(FIELD_GUIDE_COPY.dialog.finePrint.before).toBe('We’ll email you a link to the guide. Read our ');
    expect(FIELD_GUIDE_COPY.dialog.finePrint.linkText).toBe('privacy notice');
    expect(FIELD_GUIDE_COPY.dialog.finePrint.after).toBe('.');
    expect(FIELD_GUIDE_COPY.dialog.finePrint.linkHref).toBe('/privacy');
  });

  it('carries the two approved inline field errors', () => {
    expect(FIELD_GUIDE_COPY.states.emptyEmail).toBe('Enter your email address to get the guide.');
    expect(FIELD_GUIDE_COPY.states.invalidEmail).toBe('Enter a valid email address, like name@company.com.');
  });

  it('carries the approved submitting and slow-request labels (§32.1)', () => {
    expect(FIELD_GUIDE_COPY.states.submitting).toBe('Getting your guide…');
    expect(FIELD_GUIDE_COPY.states.stillWorking).toBe('Still working…');
  });

  it('carries the other two approved outcome bodies of §13.2', () => {
    expect(FIELD_GUIDE_COPY.states.repeatWithinHour('a@b.co')).toBe(
      'We emailed a link to a@b.co within the last hour, so we haven’t sent another. You can open the guide below.',
    );
    expect(FIELD_GUIDE_COPY.states.emailNotSent).toBe(
      'We couldn’t email your copy just now, but you can open the guide below. If you’d like an emailed copy, write to info@jit-pro.com.',
    );
    expect(FIELD_GUIDE_COPY.states.tryAgain).toBe('Try again');
  });

  it('shares ONE outcome heading across all three states (D6.10)', () => {
    expect(FIELD_GUIDE_COPY.states.outcomeHeading).toBe('Your guide is ready.');
  });

  it('offers no secondary sales CTA in any outcome state (D6.11)', () => {
    const outcomeStrings = [
      FIELD_GUIDE_COPY.states.outcomeHeading,
      FIELD_GUIDE_COPY.states.openButton,
      FIELD_GUIDE_COPY.states.success('a@b.co'),
      FIELD_GUIDE_COPY.states.repeatWithinHour('a@b.co'),
      FIELD_GUIDE_COPY.states.emailNotSent,
    ];
    for (const s of outcomeStrings) {
      expect(s.toLowerCase(), s).not.toContain('demo');
      expect(s.toLowerCase(), s).not.toContain('contact us');
      expect(s.toLowerCase(), s).not.toContain('book a');
    }
  });

  it('never names a backend cause to the visitor (§33.1, D6.10)', () => {
    const forbidden = ['database', 'rate limit', 'turnstile', 'verification', 'network', 'server', 'timeout'];
    for (const s of HOMEPAGE_GOVERNED_STRINGS) {
      for (const word of forbidden) expect(s.toLowerCase(), s).not.toContain(word);
    }
  });

  it('exposes the asset id at its literal type for the request body and events', () => {
    expect(FIELD_GUIDE_ID).toBe('procurement-field-guide');
    expect(FIELD_GUIDE_ID).toBe(FIELD_GUIDE.id);
  });
});
