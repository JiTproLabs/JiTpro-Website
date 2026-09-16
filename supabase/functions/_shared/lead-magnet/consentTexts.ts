/**
 * Versioned consent texts for the lead-capture marketing checkbox.
 *
 * Every sentence a visitor could have agreed to lives here, forever, under a
 * version id. The request row and the contact record store the version id,
 * so a record from any date can be read back against the exact words shown.
 *
 * THE RULE (lead-gen plan, Decision D3.10): a version that has been used in
 * production is NEVER edited. A wording change is a NEW entry with a new id
 * and `introduced` date, and `CURRENT_CONSENT_TEXT_VERSION` moves to it. The
 * test beside the site copy holds a frozen copy of each released text and
 * fails if one is altered.
 *
 * Shared by the edge function (which validates the version id it receives and
 * records it) and the site (which renders the current text). No Deno-specific
 * or browser-specific APIs.
 *
 * Final wording remains subject to legal review before production launch
 * (plan Section 15.1, item L-3). Approval on 2026-09-12 is editorial.
 */

export type ConsentText = {
  version: string;
  /** ISO date the version was introduced. */
  introduced: string;
  /** The sentence shown beside the unchecked checkbox, verbatim. */
  text: string;
};

export const CONSENT_TEXTS = {
  v1: {
    version: 'v1',
    introduced: '2026-09-12',
    text: 'Also send me occasional JiTpro insights on keeping projects ahead of the field. I can unsubscribe at any time.',
  },
} as const satisfies Record<string, ConsentText>;

export type ConsentTextVersion = keyof typeof CONSENT_TEXTS;

export const CURRENT_CONSENT_TEXT_VERSION: ConsentTextVersion = 'v1';

export function isConsentTextVersion(value: unknown): value is ConsentTextVersion {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(CONSENT_TEXTS, value);
}

/** How consent is expressed in V1. Recorded on every consent-bearing row (Decision D3.4). */
export const CONSENT_METHOD = 'checkbox' as const;

/**
 * The lifecycle states a contact can be in (Decisions D2.5, D3.5).
 *   transactional_only  the default; the guide and asset-related service mail only
 *   marketing_opt_in    the checkbox was ticked; a future approved sequence may be sent
 *   unsubscribed        marketing withdrawn; never overwritten by a later unchecked request
 */
export const CONSENT_STATUSES = ['transactional_only', 'marketing_opt_in', 'unsubscribed'] as const;

export type ConsentStatus = (typeof CONSENT_STATUSES)[number];
