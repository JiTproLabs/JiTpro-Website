import { describe, expect, it } from 'vitest';
import {
  FULFILMENT_BUTTON_LABEL,
  FULFILMENT_CLOSING,
  FULFILMENT_FOOTER_CONTACT,
  FULFILMENT_FOOTER_REASON,
  FULFILMENT_SIGNATURE_LINE,
  FULFILMENT_SIGNATURE_NAME,
  LEAD_MAGNET_FULFILMENT_FROM,
  LEAD_MAGNET_REPLY_TO,
  renderFulfilmentEmail,
} from './fulfilmentEmail.ts';
import { getLeadMagnet } from './registry.ts';

const GUIDE_URL = 'https://jit-pro.com/guides/procurement-field-guide';
const asset = getLeadMagnet('procurement-field-guide');
const email = renderFulfilmentEmail({ assetId: 'procurement-field-guide', guideUrl: GUIDE_URL });

describe('fulfilment email identity (D3.2, S2-19)', () => {
  it('sends from the approved visitor identity with an explicit Reply-To', () => {
    expect(LEAD_MAGNET_FULFILMENT_FROM).toBe('JiTpro <info@jit-pro.com>');
    expect(LEAD_MAGNET_REPLY_TO).toBe('info@jit-pro.com');
    expect(LEAD_MAGNET_FULFILMENT_FROM).not.toContain('mail.jit-pro.com');
    expect(LEAD_MAGNET_FULFILMENT_FROM).not.toContain('jeff@');
  });

  it('uses the approved subject and preheader from the registry', () => {
    expect(email.subject).toBe('Your JiTpro Construction Procurement Field Guide');
    expect(email.subject).toBe(asset.email.subject);
    expect(email.html).toContain(asset.email.preheader);
  });
});

describe('fulfilment email copy (§25.7)', () => {
  it('opens by thanking the visitor for the publication they requested', () => {
    expect(email.html).toContain('Thanks for requesting <strong>What Will Stop Work Six Months From Now?</strong>');
    expect(email.text).toContain('Thanks for requesting What Will Stop Work Six Months From Now?');
  });

  it('describes the guide with the approved sentence', () => {
    const second =
      'The JiTpro Field Guide to Construction Procurement Control explains how general contractors can connect field demand to the decisions, information, approvals, products, materials, services, and commitments required to keep work moving.';
    expect(email.text).toContain(second);
    expect(email.html).toContain('explains how general contractors can connect field demand');
  });

  it('carries the approved button, closing, and signature', () => {
    expect(FULFILMENT_BUTTON_LABEL).toBe('Open the Field Guide');
    expect(email.html).toContain(FULFILMENT_BUTTON_LABEL);
    expect(email.html).toContain(FULFILMENT_CLOSING);
    expect(email.text).toContain(`${FULFILMENT_BUTTON_LABEL}: ${GUIDE_URL}`);
    expect(email.text).toContain(FULFILMENT_CLOSING);
    expect(email.text).toContain(`${FULFILMENT_SIGNATURE_NAME}\n${FULFILMENT_SIGNATURE_LINE}`);
  });

  it('links the permanent guide route, never the versioned filename', () => {
    expect(email.html).toContain(`href="${GUIDE_URL}"`);
    expect(email.text).toContain(GUIDE_URL);
    expect(email.html).not.toContain(asset.fileName);
    expect(email.text).not.toContain(asset.fileName);
    expect(`${email.html}${email.text}`).not.toContain('.pdf');
  });
});

describe('fulfilment email footer (S3-1)', () => {
  it('is exactly the two approved lines', () => {
    expect(FULFILMENT_FOOTER_REASON).toBe(
      'You received this email because you requested the JiTpro Field Guide at jit-pro.com.',
    );
    expect(FULFILMENT_FOOTER_CONTACT).toBe('Questions? info@jit-pro.com');
    expect(email.html).toContain(FULFILMENT_FOOTER_REASON);
    expect(email.html).toContain(FULFILMENT_FOOTER_CONTACT);
    expect(email.text.trimEnd().endsWith(`${FULFILMENT_FOOTER_REASON}\n${FULFILMENT_FOOTER_CONTACT}`)).toBe(true);
  });

  it('carries no postal address, in any form', () => {
    const body = `${email.html}\n${email.text}`;
    expect(body.toLowerCase()).not.toContain('placeholder');
    expect(body).not.toMatch(/\b(suite|ste\.?|p\.? ?o\.? box|avenue|ave\.?|street|st\.?\s+\d|road|rd\.?|drive|dr\.?|boulevard|blvd\.?)\b/i);
    expect(body).not.toMatch(/\b\d{1,6}\s+[A-Z][a-z]+\s+(Street|Avenue|Road|Drive|Lane|Way|Boulevard)\b/);
    expect(body).not.toMatch(/\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/);
  });

  it('carries no unsubscribe link: the message is transactional (D3.6)', () => {
    expect(`${email.html}${email.text}`.toLowerCase()).not.toContain('unsubscribe');
  });

  it('adds no sales call to action (D6.11)', () => {
    const body = `${email.html}${email.text}`.toLowerCase();
    for (const phrase of ['start with one project', 'book a call', 'schedule', 'demo', 'contact us']) {
      expect(body).not.toContain(phrase);
    }
  });
});

describe('fulfilment email hygiene', () => {
  it('uses no em dashes in customer-facing copy (Design System §7.7)', () => {
    expect(`${email.html}${email.text}`).not.toContain('—');
  });

  it('escapes the guide URL it is given', () => {
    const hostile = renderFulfilmentEmail({
      assetId: 'procurement-field-guide',
      guideUrl: 'https://jit-pro.com/"><script>alert(1)</script>',
    });
    expect(hostile.html).not.toContain('<script>');
    expect(hostile.html).toContain('&lt;script&gt;');
  });

  it('provides a plain-text part in the same order as the HTML', () => {
    const order = [
      'Thanks for requesting',
      'explains how general contractors',
      `${FULFILMENT_BUTTON_LABEL}: `,
      'Construction problems discovered',
      `${FULFILMENT_SIGNATURE_NAME}\n${FULFILMENT_SIGNATURE_LINE}`,
      FULFILMENT_FOOTER_REASON,
      FULFILMENT_FOOTER_CONTACT,
    ];
    let cursor = 0;
    for (const fragment of order) {
      const next = email.text.indexOf(fragment, cursor);
      expect(next, `${fragment} should follow the previous section`).toBeGreaterThanOrEqual(cursor);
      cursor = next + fragment.length;
    }
  });
});
