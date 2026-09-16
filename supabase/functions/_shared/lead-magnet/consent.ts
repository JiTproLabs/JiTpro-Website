/**
 * Consent decisions for the `contacts` row (lead-gen plan, Decisions D3.4,
 * D3.5, D3.10; behaviour approved by Jeff 2026-09-15).
 *
 *   new contact, unchecked                 → transactional_only
 *   new contact, checked                   → marketing_opt_in
 *   existing marketing_opt_in, unchecked   → unchanged
 *   existing unsubscribed, unchecked       → unchanged
 *   existing transactional_only, checked   → marketing_opt_in
 *   existing unsubscribed, checked         → marketing_opt_in, fresh evidence
 *
 * An unchecked checkbox never creates marketing consent and never overwrites
 * an unsubscribe. No Deno-specific or browser-specific APIs.
 */

import {
  CONSENT_METHOD,
  CONSENT_STATUSES,
  type ConsentStatus,
  type ConsentTextVersion,
} from './consentTexts.ts';
import type { LeadMagnetId, LeadMagnetPlacement } from './registry.ts';

export function isConsentStatus(value: unknown): value is ConsentStatus {
  return typeof value === 'string' && (CONSENT_STATUSES as readonly string[]).includes(value);
}

export type ConsentContext = {
  checked: boolean;
  textVersion: ConsentTextVersion;
  placement: LeadMagnetPlacement;
  pagePath: string | null;
  assetId: LeadMagnetId;
  nowIso: string;
};

export type ConsentEvidence = {
  consent_text_version: ConsentTextVersion;
  consent_recorded_at: string;
  consent_method: typeof CONSENT_METHOD;
  consent_placement: LeadMagnetPlacement;
  consent_page_path: string | null;
  consent_asset_id: LeadMagnetId;
};

function evidenceFor(context: ConsentContext): ConsentEvidence {
  return {
    consent_text_version: context.textVersion,
    consent_recorded_at: context.nowIso,
    consent_method: CONSENT_METHOD,
    consent_placement: context.placement,
    consent_page_path: context.pagePath,
    consent_asset_id: context.assetId,
  };
}

export type NewContactConsent = ConsentEvidence & {
  consent_status: ConsentStatus;
  marketing_opt_in_at: string | null;
};

export function consentForNewContact(context: ConsentContext): NewContactConsent {
  return {
    consent_status: context.checked ? 'marketing_opt_in' : 'transactional_only',
    marketing_opt_in_at: context.checked ? context.nowIso : null,
    ...evidenceFor(context),
  };
}

export type ExistingContactConsentUpdate =
  | Record<string, never>
  | ConsentEvidence
  | (ConsentEvidence & { consent_status: 'marketing_opt_in'; marketing_opt_in_at: string });

/**
 * The consent fields to change on an existing contact. An empty object means
 * no consent field changes. A contact already opted in keeps its original
 * `marketing_opt_in_at`; the evidence moves to the most recent checked request.
 */
export function consentUpdateForExistingContact(
  current: ConsentStatus,
  context: ConsentContext,
): ExistingContactConsentUpdate {
  if (!context.checked) return {};
  if (current === 'marketing_opt_in') return evidenceFor(context);
  return {
    consent_status: 'marketing_opt_in',
    marketing_opt_in_at: context.nowIso,
    ...evidenceFor(context),
  };
}
