/**
 * The visitor's Field Guide fulfilment email (lead-gen plan §7.1, §25.7;
 * senders per S2-19; footer per S3-1).
 *
 * Strictly transactional: the recipient explicitly asked for the guide and this
 * message delivers it. It never becomes a marketing message, carries no
 * unsubscribe link (D3.6), and **carries no postal address** (S3-1). Marketing
 * stays governed by the separate, unchecked opt-in.
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

/** The two approved footer lines, and nothing else (S3-1). */
export const FULFILMENT_FOOTER_REASON =
  'You received this email because you requested the JiTpro Field Guide at jit-pro.com.';
export const FULFILMENT_FOOTER_CONTACT = 'Questions? info@jit-pro.com';

export const FULFILMENT_BUTTON_LABEL = 'Open the Field Guide';
export const FULFILMENT_CLOSING =
  'Construction problems discovered six months from now often already exist today. JiTpro helps you find them while there is still time to act.';
export const FULFILMENT_SIGNATURE_NAME = 'JiTpro';
export const FULFILMENT_SIGNATURE_LINE = 'Construction Procurement Control';

/** Brand amber, matching --jp-brand-amber. Email clients need literal colours. */
const BRAND_AMBER = '#F59E0B';
const INK = '#02101B';
const BODY_TEXT = '#333333';
const MUTED_TEXT = '#6B7280';

export type FulfilmentEmailDetails = {
  assetId: LeadMagnetId;
  /** The stable guide URL, never the versioned filename. */
  guideUrl: string;
};

export function fulfilmentParagraphs(assetId: LeadMagnetId): { first: string; second: string } {
  const asset = getLeadMagnet(assetId);
  return {
    first: `Thanks for requesting ${asset.publicationTitle}`,
    second:
      `${asset.subtitle} explains how general contractors can connect field demand to the decisions, ` +
      'information, approvals, products, materials, services, and commitments required to keep work moving.',
  };
}

export function renderFulfilmentEmail({ assetId, guideUrl }: FulfilmentEmailDetails): RenderedEmail {
  const asset = getLeadMagnet(assetId);
  const { first, second } = fulfilmentParagraphs(assetId);
  const url = escapeHtml(guideUrl);

  const html =
    `<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(asset.email.preheader)}</span>` +
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:sans-serif;color:${BODY_TEXT};background-color:#ffffff">` +
    `<tr><td align="left" style="padding:20px 20px 12px 20px">` +
    `<img src="${LEAD_MAGNET_LOGO_URL}" width="160" alt="JiTpro" style="display:block;border:0"></td></tr>` +
    `<tr><td style="padding:5px 20px;line-height:1.5">` +
    `<p style="margin:0 0 16px 0;font-size:16px">Thanks for requesting <strong>${escapeHtml(asset.publicationTitle)}</strong></p>` +
    `<p style="margin:0 0 24px 0;font-size:16px">${escapeHtml(second)}</p>` +
    `<p style="margin:0 0 24px 0"><a href="${url}" style="display:inline-block;padding:14px 28px;background-color:${BRAND_AMBER};color:${INK};font-weight:bold;text-decoration:none;border-radius:8px">${FULFILMENT_BUTTON_LABEL}</a></p>` +
    `<p style="margin:0 0 16px 0;font-size:16px">${escapeHtml(FULFILMENT_CLOSING)}</p>` +
    `<p style="margin:0 0 4px 0;font-size:16px"><strong>${FULFILMENT_SIGNATURE_NAME}</strong></p>` +
    `<p style="margin:0 0 24px 0;font-size:16px">${FULFILMENT_SIGNATURE_LINE}</p>` +
    `</td></tr>` +
    `<tr><td style="padding:16px 20px 24px 20px;border-top:1px solid #E5E7EB;font-size:13px;line-height:1.5;color:${MUTED_TEXT}">` +
    `<p style="margin:0 0 4px 0">${escapeHtml(FULFILMENT_FOOTER_REASON)}</p>` +
    `<p style="margin:0">${escapeHtml(FULFILMENT_FOOTER_CONTACT)}</p>` +
    `</td></tr></table>`;

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
