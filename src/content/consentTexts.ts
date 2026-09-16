/**
 * Site-side entry point for the versioned consent texts. The definitions live
 * with the shared lead-magnet modules so the edge function and the site read
 * the same file; this re-export keeps site code importing from `src/content`
 * like every other copy module.
 */
export {
  CONSENT_METHOD,
  CONSENT_STATUSES,
  CONSENT_TEXTS,
  CURRENT_CONSENT_TEXT_VERSION,
  isConsentTextVersion,
  type ConsentStatus,
  type ConsentText,
  type ConsentTextVersion,
} from '../../supabase/functions/_shared/lead-magnet/consentTexts.ts';
