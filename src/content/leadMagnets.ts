import {
  GUIDES_ROUTE_PREFIX,
  LEAD_MAGNET_ASSETS,
  LEAD_MAGNET_IDS,
  LEAD_MAGNET_PLACEMENTS,
  getLeadMagnet,
  isLeadMagnetId,
  isLeadMagnetPlacement,
  stableRouteFor,
  type LeadMagnetAsset,
  type LeadMagnetId,
  type LeadMagnetPlacement,
} from '../../supabase/functions/_shared/lead-magnet/registry.ts';

export {
  GUIDES_ROUTE_PREFIX,
  LEAD_MAGNET_ASSETS,
  LEAD_MAGNET_IDS,
  LEAD_MAGNET_PLACEMENTS,
  getLeadMagnet,
  isLeadMagnetId,
  isLeadMagnetPlacement,
  stableRouteFor,
  type LeadMagnetAsset,
  type LeadMagnetId,
  type LeadMagnetPlacement,
};

/**
 * Every visitor-facing string for the Field Guide offer, exactly as approved
 * in the lead-gen plan, Section 25 (Round 6, 2026-09-12). Components render
 * these; they do not paraphrase them.
 *
 * COPY GOVERNANCE
 *   - Design System §20.1 applies to the homepage and (via §50.2) Learn More,
 *     and therefore to the dialog, which opens from both: the retired word
 *     "procurement" does not appear in `band`, `dialog`, or `states`. The test
 *     beside this file enforces it. The landing page and the email are outside
 *     that rule and carry the full publication subtitle.
 *   - No em dashes in customer-facing copy (§7.7, Decision Log 2026-09-03).
 *   - Site headings take sentence case; the publication's own title case is
 *     reserved for the email and the PDF (Round 6, A10).
 *   - Strings marked "legal review" in the plan (checkbox, fine print, email
 *     footer) are approved for build and remain subject to review before
 *     production launch (plan item L-3).
 */

export const FIELD_GUIDE = getLeadMagnet('procurement-field-guide');

export const FIELD_GUIDE_COPY = {
  /** The offer band (homepage after the final CTA; Learn More after the close). */
  band: {
    eyebrow: 'Free field guide',
    heading: FIELD_GUIDE.siteTitle,
    supporting:
      'A JiTpro field guide for general contractors on finding the decisions, information, products, materials, services, approvals, and commitments the field will depend on while there is still time to act.',
    button: 'Get the free field guide',
  },

  footer: {
    guideLink: 'Free field guide',
    privacyLink: 'Privacy',
  },

  /** `/field-guide`. Outside §20.1, so the full subtitle is permitted here. */
  landing: {
    browserTitle: `${FIELD_GUIDE.publicationTitle} | JiTpro Field Guide`,
    metaDescription:
      'A free JiTpro field guide for general contractors on construction procurement control: Required on Site Dates, backward planning, named commitments, and a self-assessment.',
    eyebrow: 'Free field guide',
    heading: FIELD_GUIDE.siteTitle,
    subtitle: FIELD_GUIDE.subtitle,
    intro:
      'A 31-page guide for general contractors on identifying the decisions, information, products, materials, services, approvals, and commitments the field will depend on months from now, and establishing accountability while useful options still exist.',
    coversHeading: 'What the guide covers',
    covers: [
      'Why the construction schedule is a statement of future demand.',
      'Why missing information, not late purchasing, is usually what makes procurement late.',
      'Required on Site Dates, and how to plan backward from them through the procurement chain.',
      'Named commitments: who owns the next move, and by when.',
      'Plan, commitment, actual, and forecast, and why preserving change and causality matters.',
      'Managing by exception: item health, project health, and company health.',
      'A procurement-control self-assessment you can run on your own project.',
    ],
    formHeading: 'Get the guide',
  },

  dialog: {
    close: 'Close',
    heading: 'Get the free field guide',
    subline: `${FIELD_GUIDE.siteTitle} We’ll open the guide right away and email you a link.`,
    emailLabel: 'Email address',
    turnstileNotice: 'One quick check before we open your guide.',
    submit: 'Get the free field guide',
    finePrint: {
      before: 'We’ll email you a link to the guide. Read our ',
      linkText: 'privacy notice',
      after: '.',
      linkHref: '/privacy',
    },
  },

  states: {
    submitting: 'Getting your guide…',
    stillWorking: 'Still working…',
    emptyEmail: 'Enter your email address to get the guide.',
    invalidEmail: 'Enter a valid email address, like name@company.com.',
    outcomeHeading: 'Your guide is ready.',
    openButton: 'Open the field guide',
    openButtonScreenReaderNote: 'opens in a new tab',
    success: (email: string) => `We’ve also emailed a link to ${email} so you can return to it later.`,
    repeatWithinHour: (email: string) =>
      `We emailed a link to ${email} within the last hour, so we haven’t sent another. You can open the guide below.`,
    emailNotSent:
      'We couldn’t email your copy just now, but you can open the guide below. If you’d like an emailed copy, write to info@jit-pro.com.',
    tryAgain: 'Try again',
  },
} as const;

/**
 * The strings that render on surfaces governed by Design System §20.1. Used
 * by the copy-governance test; kept here so the list is one place.
 */
export const HOMEPAGE_GOVERNED_STRINGS: readonly string[] = [
  ...Object.values(FIELD_GUIDE_COPY.band),
  ...Object.values(FIELD_GUIDE_COPY.footer),
  FIELD_GUIDE_COPY.dialog.close,
  FIELD_GUIDE_COPY.dialog.heading,
  FIELD_GUIDE_COPY.dialog.subline,
  FIELD_GUIDE_COPY.dialog.emailLabel,
  FIELD_GUIDE_COPY.dialog.turnstileNotice,
  FIELD_GUIDE_COPY.dialog.submit,
  FIELD_GUIDE_COPY.dialog.finePrint.before,
  FIELD_GUIDE_COPY.dialog.finePrint.linkText,
  FIELD_GUIDE_COPY.states.submitting,
  FIELD_GUIDE_COPY.states.stillWorking,
  FIELD_GUIDE_COPY.states.emptyEmail,
  FIELD_GUIDE_COPY.states.invalidEmail,
  FIELD_GUIDE_COPY.states.outcomeHeading,
  FIELD_GUIDE_COPY.states.openButton,
  FIELD_GUIDE_COPY.states.success('name@company.com'),
  FIELD_GUIDE_COPY.states.repeatWithinHour('name@company.com'),
  FIELD_GUIDE_COPY.states.emailNotSent,
  FIELD_GUIDE_COPY.states.tryAgain,
];

/** Every customer-facing string, for the no-em-dash rule. */
export const ALL_CUSTOMER_FACING_STRINGS: readonly string[] = [
  ...HOMEPAGE_GOVERNED_STRINGS,
  FIELD_GUIDE_COPY.landing.browserTitle,
  FIELD_GUIDE_COPY.landing.metaDescription,
  FIELD_GUIDE_COPY.landing.eyebrow,
  FIELD_GUIDE_COPY.landing.heading,
  FIELD_GUIDE_COPY.landing.subtitle,
  FIELD_GUIDE_COPY.landing.intro,
  FIELD_GUIDE_COPY.landing.coversHeading,
  ...FIELD_GUIDE_COPY.landing.covers,
  FIELD_GUIDE_COPY.landing.formHeading,
  FIELD_GUIDE.email.subject,
  FIELD_GUIDE.email.preheader,
];
