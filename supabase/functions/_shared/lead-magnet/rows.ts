/**
 * Builds the rows `submit-lead-magnet-request` writes to `contacts` and
 * `lead_magnet_requests` (lead-gen plan §6.1, §6.2; migrations
 * 20260914000001 and 20260914000002). Pure: no I/O, no clock (the caller
 * passes the timestamp). No Deno-specific or browser-specific APIs.
 */

import { CONSENT_METHOD, type ConsentStatus } from './consentTexts.ts';
import {
  consentForNewContact,
  consentUpdateForExistingContact,
  type ConsentContext,
} from './consent.ts';
import { getLeadMagnet } from './registry.ts';
import type { LeadMagnetRequestInput } from './request.ts';

function consentContext(input: LeadMagnetRequestInput, nowIso: string): ConsentContext {
  return {
    checked: input.marketingOptIn,
    textVersion: input.consentTextVersion,
    placement: input.placement,
    pagePath: input.pagePath,
    assetId: input.assetId,
    nowIso,
  };
}

/** Insert body for a first-time contact. First-touch attribution is written once, here. */
export function buildNewContactRow(input: LeadMagnetRequestInput, nowIso: string) {
  return {
    email: input.email,
    first_seen_at: nowIso,
    last_seen_at: nowIso,
    first_source: input.utmSource,
    first_medium: input.utmMedium,
    first_campaign: input.utmCampaign,
    first_landing_path: input.landingPath,
    first_referrer: input.referrer,
    updated_at: nowIso,
    ...consentForNewContact(consentContext(input, nowIso)),
  };
}

/** Update body for a returning contact. First-touch attribution is never overwritten. */
export function buildExistingContactUpdate(
  currentStatus: ConsentStatus,
  input: LeadMagnetRequestInput,
  nowIso: string,
) {
  return {
    last_seen_at: nowIso,
    updated_at: nowIso,
    ...consentUpdateForExistingContact(currentStatus, consentContext(input, nowIso)),
  };
}

export type RequestRowArgs = {
  input: LeadMagnetRequestInput;
  requestId: string;
  contactId: string;
  isRepeat: boolean;
};

/**
 * Insert body for one request. The function's request id becomes the row id
 * so logs, the response, and the row share one identifier. `email_status` is
 * null until an email send is attempted (Decision S2-3; Sprint 3 sets it).
 */
export function buildRequestRow({ input, requestId, contactId, isRepeat }: RequestRowArgs) {
  return {
    id: requestId,
    contact_id: contactId,
    email: input.email,
    asset_id: input.assetId,
    asset_version: getLeadMagnet(input.assetId).version,
    placement: input.placement,
    page_path: input.pagePath,
    landing_path: input.landingPath,
    referrer: input.referrer,
    utm_source: input.utmSource,
    utm_medium: input.utmMedium,
    utm_campaign: input.utmCampaign,
    utm_content: input.utmContent,
    utm_term: input.utmTerm,
    is_repeat: isRepeat,
    marketing_opt_in_checked: input.marketingOptIn,
    consent_text_version: input.consentTextVersion,
    consent_method: CONSENT_METHOD,
    turnstile_passed: true,
    fulfilment_status: 'delivered_inline' as const,
    email_status: null,
  };
}
