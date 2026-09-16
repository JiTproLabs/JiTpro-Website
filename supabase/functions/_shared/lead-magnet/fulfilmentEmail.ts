/**
 * The visitor's Field Guide fulfilment email (lead-gen plan §7.1, §25.7;
 * senders per S2-19; footer per S3-1; presentation approved 2026-09-16).
 *
 * Strictly transactional: the recipient explicitly asked for the guide and this
 * message delivers it. It never becomes a marketing message, carries no
 * unsubscribe link (D3.6), and **carries no postal address** (S3-1). Marketing
 * stays governed by the separate, unchecked opt-in.
 *
 * Presentation rules that the tests enforce:
 *   - table-based, inline styles, email-safe fonts, no web fonts;
 *   - a centred 640px white card on a light neutral canvas, fluid below that;
 *   - spacing is table-cell padding or spacer rows, never CSS margins, so
 *     Outlook desktop (Word engine) lays it out predictably;
 *   - the CTA is a bulletproof button: VML for Outlook, a padded anchor
 *     elsewhere, dark ink on brand amber;
 *   - the logo carries meaningful ALT text and the message still reads with
 *     images blocked, because the descriptor line is live text.
 *
 * Identity, titles, subject, and preheader all come from the registry, so the
 * email cannot drift from the asset it delivers. No Deno-specific or
 * browser-specific APIs.
 */

import { escapeHtml, type RenderedEmail } from './recoveryAlert.ts';
import { getLeadMagnet, type LeadMagnetId } from './registry.ts';

export const LEAD_MAGNET_FULFILMENT_FROM = 'JiTpro <info@jit-pro.com>';
export const LEAD_MAGNET_REPLY_TO = 'info@jit-pro.com';
export const LEAD_MAGNET_LOGO_URL = 'https://jit-pro.com/assets/logo/jitpro-logo-email.png';
export const LEAD_MAGNET_LOGO_ALT = 'JiTpro';

/** The two approved footer lines, and nothing else (S3-1). */
export const FULFILMENT_FOOTER_REASON =
  'You received this email because you requested the JiTpro Field Guide at jit-pro.com.';
export const FULFILMENT_FOOTER_CONTACT = 'Questions? info@jit-pro.com';
export const LEAD_MAGNET_CONTACT_EMAIL = 'info@jit-pro.com';

export const FULFILMENT_BUTTON_LABEL = 'Open the Field Guide';
/** The arrow is visual treatment; the approved label is unchanged. */
export const FULFILMENT_BUTTON_HTML_LABEL = `${FULFILMENT_BUTTON_LABEL} &rarr;`;
export const FULFILMENT_CLOSING =
  'Construction problems discovered six months from now often already exist today. JiTpro helps you find them while there is still time to act.';
export const FULFILMENT_HEADLINE_LEAD = 'Thanks for requesting';
export const FULFILMENT_SIGNATURE_NAME = 'JiTpro';
export const FULFILMENT_SIGNATURE_LINE = 'Construction Procurement Control';

/** Brand tokens, as literals because email clients cannot read CSS variables. */
const BRAND_AMBER = '#F59E0B';
const INK = '#02101B';
const BODY_TEXT = '#374151';
const MUTED_TEXT = '#6B7280';
const HAIRLINE = '#E5E7EB';
const CANVAS = '#F4F5F7';
const CARD = '#FFFFFF';
const FONT_STACK = 'Arial,Helvetica,sans-serif';

export const CARD_MAX_WIDTH = 640;
export const CTA_WIDTH = 420;

export type FulfilmentEmailDetails = {
  assetId: LeadMagnetId;
  /** The stable guide URL, never the versioned filename. */
  guideUrl: string;
};

export function fulfilmentParagraphs(assetId: LeadMagnetId): { first: string; second: string } {
  const asset = getLeadMagnet(assetId);
  return {
    first: `${FULFILMENT_HEADLINE_LEAD} ${asset.publicationTitle}`,
    second:
      `${asset.subtitle} explains how general contractors can connect field demand to the decisions, ` +
      'information, approvals, products, materials, services, and commitments required to keep work moving.',
  };
}

/** A 1px rule that survives Outlook: an explicit table row, not a border. */
function divider(): string {
  return (
    `<tr><td class="pad-x" style="padding:0 40px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${HAIRLINE}">&nbsp;</td>` +
    `</tr></table></td></tr>`
  );
}

function ctaButton(guideUrl: string): string {
  const href = escapeHtml(guideUrl);
  return (
    `<!--[if mso]>` +
    `<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" ` +
    `href="${href}" style="height:54px;v-text-anchor:middle;width:${CTA_WIDTH}px" arcsize="12%" stroke="f" fillcolor="${BRAND_AMBER}">` +
    `<w:anchorlock/>` +
    `<center style="color:${INK};font-family:${FONT_STACK};font-size:17px;font-weight:bold">${FULFILMENT_BUTTON_HTML_LABEL}</center>` +
    `</v:roundrect>` +
    `<![endif]-->` +
    `<!--[if !mso]><!-- -->` +
    `<a class="btn-a" href="${href}" style="display:inline-block;width:${CTA_WIDTH}px;max-width:100%;` +
    `box-sizing:border-box;background-color:${BRAND_AMBER};color:${INK};font-family:${FONT_STACK};font-size:17px;` +
    `font-weight:bold;line-height:1.2;text-align:center;text-decoration:none;padding:17px 24px;border-radius:6px;` +
    `mso-hide:all">${FULFILMENT_BUTTON_HTML_LABEL}</a>` +
    `<!--<![endif]-->`
  );
}

export function renderFulfilmentEmail({ assetId, guideUrl }: FulfilmentEmailDetails): RenderedEmail {
  const asset = getLeadMagnet(assetId);
  const { first, second } = fulfilmentParagraphs(assetId);
  const textCell = `font-family:${FONT_STACK};font-size:16px;line-height:1.5;color:${BODY_TEXT};mso-line-height-rule:exactly`;

  const html =
    `<!DOCTYPE html><html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">` +
    `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="x-apple-disable-message-reformatting">` +
    `<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->` +
    `<title>${escapeHtml(asset.email.subject)}</title>` +
    `<style>@media only screen and (max-width:620px){` +
    `.pad-x{padding-left:22px!important;padding-right:22px!important}` +
    `.h1{font-size:22px!important;line-height:1.3!important}` +
    `.btn-a{display:block!important;width:100%!important}` +
    `}</style></head>` +
    `<body style="margin:0;padding:0;background-color:${CANVAS}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(asset.email.preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CANVAS}" style="background-color:${CANVAS};margin:0;padding:0">` +
    `<tr><td align="center" style="padding:32px 12px">` +
    `<!--[if mso]><table role="presentation" width="${CARD_MAX_WIDTH}" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:${CARD_MAX_WIDTH}px;width:100%;background-color:${CARD};border:1px solid ${HAIRLINE}">` +

    // Header: logo, then the live-text descriptor. Spacing is padding, not margin.
    `<tr><td align="center" class="pad-x" style="padding:36px 40px 0 40px">` +
    `<img src="${LEAD_MAGNET_LOGO_URL}" width="150" alt="${LEAD_MAGNET_LOGO_ALT}" style="display:block;border:0;outline:none;text-decoration:none">` +
    `</td></tr>` +
    `<tr><td align="center" class="pad-x" style="padding:12px 40px 28px 40px;font-family:${FONT_STACK};font-size:13px;line-height:1.4;color:${MUTED_TEXT};letter-spacing:.02em;mso-line-height-rule:exactly">` +
    `${FULFILMENT_SIGNATURE_LINE}</td></tr>` +

    divider() +

    // Two-level headline: lead line, then the publication title as the strongest element.
    `<tr><td class="pad-x" style="padding:36px 40px 0 40px;font-family:${FONT_STACK};font-size:16px;line-height:1.4;color:${MUTED_TEXT};mso-line-height-rule:exactly">` +
    `${FULFILMENT_HEADLINE_LEAD}</td></tr>` +
    `<tr><td class="pad-x h1" style="padding:8px 40px 0 40px;font-family:${FONT_STACK};font-size:26px;line-height:1.25;font-weight:bold;color:${INK};mso-line-height-rule:exactly">` +
    `${escapeHtml(asset.publicationTitle)}</td></tr>` +

    `<tr><td class="pad-x" style="padding:26px 40px 0 40px;${textCell}">${escapeHtml(second)}</td></tr>` +

    // Primary action, with deliberate space above and below.
    `<tr><td align="center" class="pad-x" style="padding:40px 40px">${ctaButton(guideUrl)}</td></tr>` +

    `<tr><td class="pad-x" style="padding:0 40px;${textCell}">${escapeHtml(FULFILMENT_CLOSING)}</td></tr>` +

    `<tr><td class="pad-x" style="padding:28px 40px 36px 40px;${textCell}">` +
    `<strong style="color:${INK}">${FULFILMENT_SIGNATURE_NAME}</strong><br>${FULFILMENT_SIGNATURE_LINE}</td></tr>` +

    divider() +

    `<tr><td class="pad-x" style="padding:20px 40px 36px 40px;font-family:${FONT_STACK};font-size:13px;line-height:1.5;color:${MUTED_TEXT};mso-line-height-rule:exactly">` +
    `${escapeHtml(FULFILMENT_FOOTER_REASON)}<br>Questions? ` +
    `<a href="mailto:${LEAD_MAGNET_CONTACT_EMAIL}" style="color:${MUTED_TEXT};text-decoration:underline">${LEAD_MAGNET_CONTACT_EMAIL}</a>` +
    `</td></tr>` +

    `</table>` +
    `<!--[if mso]></td></tr></table><![endif]-->` +
    `</td></tr></table></body></html>`;

  const text = [
    first,
    '',
    second,
    '',
    `${FULFILMENT_BUTTON_LABEL}: ${guideUrl}`,
    '',
    FULFILMENT_CLOSING,
    '',
    FULFILMENT_SIGNATURE_NAME,
    FULFILMENT_SIGNATURE_LINE,
    '',
    FULFILMENT_FOOTER_REASON,
    FULFILMENT_FOOTER_CONTACT,
    '',
  ].join('\n');

  return { subject: asset.email.subject, html, text };
}
