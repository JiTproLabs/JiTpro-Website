/**
 * The JiTpro privacy notice, exactly as approved in the lead-gen plan,
 * Section 27 (Round 6, 2026-09-12, with Jeff's three revisions and the
 * 2026-09-15 S3-1 amendment).
 *
 * WHAT IS AND IS NOT HERE
 *   - Every sentence below is approved visitor-facing copy. The page renders
 *     it; it does not paraphrase, summarise, or extend it.
 *   - The plan's bracketed notes ([verify at Sprint 5], [verify against the
 *     actual launch implementation], the S3-1 amendment line) are editorial
 *     instructions to the implementers, not text for a visitor, so they are
 *     not rendered. Three of them were checked against the running system on
 *     2026-09-16 and are recorded in `VERIFIED_CLAIMS`; two required the copy
 *     to change and were corrected with Jeff's approval. `PENDING_VERIFICATION`
 *     now holds only the publication date.
 *   - NO POSTAL ADDRESS ANYWHERE (S3-1, 2026-09-15). Contact is
 *     `info@jit-pro.com` and nothing else. The test beside this file enforces
 *     that, so the address cannot return by accident.
 *
 * STATUS: approved for build, SUBJECT TO LEGAL REVIEW before production
 * launch (plan item L-3). Jeff's approval is editorial, not legal approval.
 * The page carries that designation visibly until L-3 closes.
 */

export const PRIVACY_CONTACT_EMAIL = 'info@jit-pro.com';

/**
 * The publication date is set when the page goes live (Sprint 6), because a
 * notice that has not been published has no "last updated" date to state. It
 * is deliberately null rather than a guess: plan §41 and Appendix C forbid
 * inferring a value in place of a TODO.
 */
export const PRIVACY_LAST_UPDATED: string | null = null;

export type PrivacySection = {
  /** The bold lead-in that opens the paragraph, as approved. */
  heading: string;
  /** Paragraphs following the heading. */
  body?: string[];
  /** A bulleted list, where the approved copy uses one. */
  bullets?: string[];
  /** A closing paragraph after the bullets. */
  after?: string[];
};

export const PRIVACY_INTRO = {
  title: 'JiTpro Privacy Notice',
  /** L-3. Removed when legal review closes, before production launch. */
  reviewNotice:
    'This notice is a draft pending legal review. It describes the system as designed and is published here for review, not as final legal advice.',
};

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    heading: 'Who we are.',
    body: [
      'JiTpro provides construction procurement control services to general contractors. This notice explains what information we collect through jit-pro.com, why we collect it, who helps us process it, how long we keep it, and the choices you have. If you have a question about anything here, email us at info@jit-pro.com.',
    ],
  },
  {
    heading: 'What this notice covers.',
    body: [
      'The jit-pro.com website, including the Field Guide request form, the contact form, and the investor access request form.',
    ],
  },
  {
    heading: 'Information you give us.',
    bullets: [
      'Field Guide request: your email address, and whether you ticked the box asking for occasional JiTpro insights.',
      'Contact form: your first name, last name, email address, your role, and the note you write.',
      'Investor access request: your name, email address, company, and investment interest.',
    ],
  },
  {
    heading: 'Information collected automatically when you request the Field Guide.',
    body: [
      'So we can understand which parts of the website and which campaigns are useful, we record with your request: which offer you used and where it appeared, the page you were on, the first page of your visit, the site that referred you (if any), any campaign tags in the link you followed (for example utm_source), which version of the guide you received, the time of the request, whether you had requested the guide before, and whether the email copy could be sent. During your visit, your browser holds the first-visit details (campaign tags, referring site, first page) in session storage, which is cleared when you close the tab or browser. We do not use cookies for this.',
    ],
  },
  {
    heading: 'Information used only to prevent abuse.',
    body: ['To stop automated submissions and protect our email reputation:'],
    bullets: [
      'The request form uses Cloudflare Turnstile, a service that distinguishes people from automated programs. Cloudflare processes technical signals from your browser to do this; its Turnstile privacy notice describes that processing.',
      'We keep a one-way, salted hash of your IP address for up to 24 hours so we can limit how many requests come from one network in a short period. The hash is designed so that JiTpro does not need to retain the underlying IP address: the salt changes every day, the hash is never linked to your email address or your request record, and it is deleted automatically. We do not store your IP address itself in our database.',
    ],
  },
  {
    heading: 'Website analytics.',
    body: [
      'We use Cloudflare Web Analytics to understand page views, visits, referring sites, countries, device types, browsers, and page performance. Cloudflare describes this service as privacy-first and states that it does not track individuals across websites; its documentation describes how it works. Separately, we count how many people see, click, open, and submit the Field Guide offer. Those counts contain no identifier, no email address, and no IP address; they are numbers about pages and buttons, not about you. We do not use Google Analytics or advertising trackers.',
    ],
  },
  {
    heading: 'Cookies.',
    body: [
      'We do not set cookies for analytics or advertising. The infrastructure providers that serve and protect the website and process your request may set strictly necessary technical cookies for security and performance. For example, submitting the Field Guide form may cause a short-lived security cookie to be set as part of processing and protecting the request. Session storage, described above, is not a cookie and is cleared at the end of your visit.',
    ],
  },
  {
    heading: 'Why we use your information.',
    bullets: [
      'To send you the Field Guide you requested, by opening it in your browser and by emailing you a link.',
      'To notify the JiTpro team that a request or message has arrived, and to reply to you.',
      'To understand which pages, offers, and campaigns lead people to request the guide or contact us.',
      'To prevent abuse of our forms and to keep our email deliverable.',
      'To send you occasional JiTpro insights only if you ticked the box asking for them.',
    ],
  },
  {
    heading: 'Marketing email and your choices.',
    body: [
      'Requesting the Field Guide does not sign you up for marketing. Unless you tick the optional box, we treat your address as transactional only: you receive the guide, a repeat of it if you ask again, and any message needed to deliver what you asked for, and nothing else. If you tick the box, we record when and how you did so, and we may send occasional insights on keeping projects ahead of the field. You can withdraw that consent at any time by emailing info@jit-pro.com, and, once we begin sending such messages, by using the unsubscribe link in any of them. We will not send marketing email to anyone who has withdrawn consent.',
    ],
  },
  {
    heading: 'Email delivery records.',
    body: [
      'We use an email provider to deliver the guide. The provider processes delivery information and may stop delivering to an address it identifies as undeliverable or problematic. When we send you the guide you requested, we record the immediate result our provider returns for that attempt, so we know whether the message was accepted and can tell you if it was not.',
    ],
  },
  {
    heading: 'Who processes your information for us.',
    body: ['We use a small number of service providers, each acting on our instructions:'],
    bullets: [
      'Cloudflare hosts and serves the website, provides Turnstile, and provides Web Analytics.',
      'Supabase stores our request and contact records and runs the code that processes your request, in a data centre in the United States.',
      'Resend delivers our email, from infrastructure in the United States.',
      'Microsoft 365 provides the JiTpro mailbox (info@jit-pro.com) that receives notifications and your replies.',
    ],
    after: ['We do not sell your personal information, and we do not share it with advertisers or data brokers.'],
  },
  {
    heading: 'Where your information is processed.',
    body: [
      'In the United States. If you are outside the United States, your information is transferred to and processed there.',
    ],
  },
  {
    heading: 'How long we keep it.',
    body: [
      'Field Guide requests and contact records are kept for as long as we need them to understand our relationship with you and how people find JiTpro, unless you ask us to delete them. The IP-address hash is deleted within 24 hours. Session storage is cleared when your visit ends. Cloudflare and Resend keep their own operational records for the periods described in their documentation.',
    ],
  },
  {
    heading: 'Your rights and requests.',
    body: [
      'You can ask us to tell you what information we hold about you, to correct it, to delete it, or to stop sending you marketing email. Email info@jit-pro.com from the address in question, or tell us which address you mean, so we can confirm the request is yours. We will respond to verified requests as required by applicable law. Depending on where you live, you may have additional rights under applicable law; we will honour them.',
    ],
  },
  {
    heading: 'Children.',
    body: ['Our website and services are for businesses and are not directed to children.'],
  },
  {
    heading: 'Changes to this notice.',
    body: [
      'If we change how we handle information, we will update this page and the date at the top.',
    ],
  },
  {
    heading: 'Contact.',
    body: ['JiTpro. Email: info@jit-pro.com.'],
  },
];

/**
 * The plan's [verify] markers, kept as a working list rather than rendered.
 * Each is checked against the actual implementation before the page is
 * published (plan §27, Sprint 5 and Sprint 6).
 */
export const PENDING_VERIFICATION: readonly string[] = [
  'Last updated: set the publication date at go-live (Sprint 6).',
];

/**
 * The implementation-dependent claims the draft carried, and what verifying
 * them produced. Kept here rather than deleted so the next person can see that
 * each was checked against the running system rather than assumed.
 */
export const VERIFIED_CLAIMS: readonly string[] = [
  'Cookies: VERIFIED AND CORRECTED 2026-09-16. jit-pro.com itself sets no cookies on any route, but a short-lived security cookie is set when the browser calls the Supabase Edge Functions that process a request. The sentence previously attributed all cookies to the provider serving the website; it now covers the providers that process the request as well.',
  'Email delivery records: VERIFIED AND CORRECTED 2026-09-16. The original paragraph described a system with a webhook receiver. There is none (F-7 is deferred), so JiTpro never receives asynchronous bounce or complaint notifications; it records only the immediate result of its own send attempt, and the provider handles suppression. The paragraph now says exactly that.',
  'Service providers: VERIFIED ACCURATE 2026-09-16, unchanged. The services that actually receive data are Resend (email), Cloudflare (hosting and Turnstile), Supabase (database and functions) and Microsoft 365 (the info@ mailbox). No advertiser, data broker or enrichment service is involved, and nothing is sold.',
];

/** Every string a visitor reads on the privacy page, for the governance tests. */
export const PRIVACY_STRINGS: readonly string[] = [
  PRIVACY_INTRO.title,
  PRIVACY_INTRO.reviewNotice,
  ...PRIVACY_SECTIONS.flatMap((section) => [
    section.heading,
    ...(section.body ?? []),
    ...(section.bullets ?? []),
    ...(section.after ?? []),
  ]),
];
