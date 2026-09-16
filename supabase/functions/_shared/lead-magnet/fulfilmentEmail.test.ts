import { describe, expect, it } from 'vitest';
import {
  CARD_MAX_WIDTH,
  CTA_WIDTH,
  FULFILMENT_BUTTON_HTML_LABEL,
  FULFILMENT_BUTTON_LABEL,
  FULFILMENT_CLOSING,
  FULFILMENT_FOOTER_CONTACT,
  FULFILMENT_FOOTER_REASON,
  FULFILMENT_SIGNATURE_LINE,
  FULFILMENT_SIGNATURE_NAME,
  LEAD_MAGNET_FULFILMENT_FROM,
  LEAD_MAGNET_LOGO_ALT,
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
  it('opens with a two-level headline: the lead line, then the publication title', () => {
    expect(email.html).toContain('>Thanks for requesting</td>');
    expect(email.html).toContain('>What Will Stop Work Six Months From Now?</td>');
    const lead = email.html.indexOf('Thanks for requesting');
    const title = email.html.indexOf('What Will Stop Work Six Months From Now?', lead);
    expect(title).toBeGreaterThan(lead);
    expect(email.text).toContain('Thanks for requesting What Will Stop Work Six Months From Now?');
  });

  it('makes the publication title the strongest textual element', () => {
    const titleCell = email.html.slice(
      email.html.lastIndexOf('<tr>', email.html.indexOf('>What Will Stop Work Six Months From Now?</td>')),
      email.html.indexOf('>What Will Stop Work Six Months From Now?</td>'),
    );
    expect(titleCell).toContain('font-size:26px');
    expect(titleCell).toContain('font-weight:bold');
    expect(titleCell).toContain('class="pad-x h1"');
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
    expect(email.html).toContain('Questions? ');
    expect(email.html).toContain('href="mailto:info@jit-pro.com"');
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

describe('fulfilment email presentation (approved 2026-09-16)', () => {
  it('is a centred card of the approved width on a light canvas', () => {
    expect(email.html).toContain(`max-width:${CARD_MAX_WIDTH}px`);
    expect(email.html).toContain('background-color:#F4F5F7');
    expect(email.html).toContain('background-color:#FFFFFF');
    expect(email.html).toContain('border:1px solid #E5E7EB');
    expect(email.html).not.toContain('box-shadow');
  });

  it('pins the card width for Outlook with a conditional wrapper', () => {
    expect(email.html).toContain(`<!--[if mso]><table role="presentation" width="${CARD_MAX_WIDTH}"`);
    expect(email.html).toContain('<!--[if mso]></td></tr></table><![endif]-->');
  });

  it('builds the CTA as a bulletproof button: VML for Outlook, an anchor elsewhere', () => {
    expect(email.html).toContain('<!--[if mso]>');
    expect(email.html).toContain('v:roundrect');
    expect(email.html).toContain('arcsize="12%"');
    expect(email.html).toContain(`fillcolor="${'#F59E0B'}"`);
    expect(email.html).toContain('<w:anchorlock/>');
    expect(email.html).toContain('<!--[if !mso]><!-- -->');
    expect(email.html).toContain('<!--<![endif]-->');
    // Both buttons carry the same destination, and nothing else links out.
    const hrefs = [...email.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.filter((href) => href === GUIDE_URL)).toHaveLength(2);
    expect(hrefs.filter((href) => !href.startsWith('mailto:'))).toEqual([GUIDE_URL, GUIDE_URL]);
  });

  it('uses dark JiTpro ink on brand amber for both buttons, never white text', () => {
    const vml = email.html.slice(email.html.indexOf('<v:roundrect'), email.html.indexOf('</v:roundrect>'));
    const anchor = email.html.slice(email.html.indexOf('<a class="btn-a"'), email.html.indexOf('</a>'));
    for (const button of [vml, anchor]) {
      expect(button).toContain('#02101B');
      expect(button).toContain('#F59E0B');
      expect(button).not.toContain('#FFFFFF');
      expect(button).toContain('font-weight:bold');
    }
    expect(anchor).toContain(`width:${CTA_WIDTH}px`);
    expect(anchor).toContain('max-width:100%');
    expect(anchor).toContain('padding:17px 24px');
    expect(anchor).toContain('border-radius:6px');
  });

  it('carries the arrow as visual treatment on the approved label', () => {
    expect(FULFILMENT_BUTTON_HTML_LABEL).toBe('Open the Field Guide &rarr;');
    expect(email.html.match(/Open the Field Guide &rarr;/g)).toHaveLength(2);
    expect(email.text).toContain(`${FULFILMENT_BUTTON_LABEL}: ${GUIDE_URL}`);
    expect(email.text).not.toContain('&rarr;');
  });

  it('scales down on small screens without horizontal scrolling', () => {
    expect(email.html).toContain('@media only screen and (max-width:620px)');
    expect(email.html).toContain('.pad-x{padding-left:22px!important');
    expect(email.html).toContain('.h1{font-size:22px!important');
    expect(email.html).toContain('.btn-a{display:block!important;width:100%!important}');
    expect(email.html).toContain('name="viewport"');
  });

  it('remains coherent when images are blocked', () => {
    expect(email.html).toContain(`alt="${LEAD_MAGNET_LOGO_ALT}"`);
    expect(LEAD_MAGNET_LOGO_ALT).toBe('JiTpro');
    // The descriptor under the logo is live text, not part of the image.
    const images = [...email.html.matchAll(/<img\b/g)];
    expect(images).toHaveLength(1);
    expect(email.html).toContain(`>${FULFILMENT_SIGNATURE_LINE}</td>`);
    const withoutImage = email.html.replace(/<img[^>]*>/g, '');
    for (const fragment of ['Thanks for requesting', FULFILMENT_CLOSING, FULFILMENT_FOOTER_REASON]) {
      expect(withoutImage).toContain(fragment);
    }
  });

  it('draws two hairline dividers as table rows, so Outlook keeps them', () => {
    const rules = [...email.html.matchAll(/height="1" style="height:1px;line-height:1px;font-size:0;background-color:#E5E7EB"/g)];
    expect(rules).toHaveLength(2);
  });

  it('spaces the layout with cell padding rather than CSS margins', () => {
    expect(email.html).not.toMatch(/margin-top:/);
    expect(email.html).not.toMatch(/margin-bottom:/);
    expect(email.html).toContain('mso-line-height-rule:exactly');
  });

  it('uses email-safe fonts only', () => {
    expect(email.html).toContain('Arial,Helvetica,sans-serif');
    expect(email.html).not.toContain('fonts.googleapis.com');
    expect(email.html).not.toMatch(/@font-face/);
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
