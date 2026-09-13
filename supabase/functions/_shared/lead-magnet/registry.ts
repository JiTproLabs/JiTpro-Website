/**
 * Lead-magnet registry: the one source of truth for what each asset IS.
 *
 * Shared by the edge functions (fulfilment, email) and the website (CTA,
 * dialog, landing page). The site imports this file directly, so there is one
 * definition of every asset's id, version, file, stable route, and titles, and
 * nothing to keep in agreement by hand.
 *
 * RULES FOR THIS MODULE
 *   - No Deno-specific and no browser-specific APIs. It is imported by Deno
 *     (edge functions), by Vite (the site), and by Vitest (tests).
 *   - Copy that is only ever rendered by the site lives in
 *     `src/content/leadMagnets.ts`, not here. This module holds identity,
 *     versioning, delivery, and the strings the server needs for email.
 *   - A new asset is a new entry here plus a PDF under `public/guides/` and a
 *     `_redirects` line; the consistency test enforces that they agree.
 *
 * Approved in docs/superpowers/plans/2026-09-12-procurement-guide-lead-gen-plan.md
 * (Decisions D5.1, D5.2, D4.3; copy Section 25).
 */

/**
 * Where a request came from. Stamped on every request row and every funnel
 * event (Decision D4.3). Adding a placement means adding it here; both the
 * site and the server validate against this list.
 */
export const LEAD_MAGNET_PLACEMENTS = [
  'home-band',
  'learn-more-band',
  'footer-link',
  'landing-page',
] as const;

export type LeadMagnetPlacement = (typeof LEAD_MAGNET_PLACEMENTS)[number];

export function isLeadMagnetPlacement(value: unknown): value is LeadMagnetPlacement {
  return typeof value === 'string' && (LEAD_MAGNET_PLACEMENTS as readonly string[]).includes(value);
}

/** The stable public route convention: `/guides/<asset-slug>` (Decision D5.2). */
export const GUIDES_ROUTE_PREFIX = '/guides/';

export type LeadMagnetAsset = {
  /** Stable forever. Doubles as the route slug. */
  id: string;
  /** Date-based label of the PDF currently served. Stored on every request row. */
  version: string;
  /** Stable public route. Redirects (302) to `fileName` via `public/_redirects`. */
  publicPath: string;
  /** The versioned file under `public/guides/`. */
  fileName: string;
  /** The clean name a visitor sees when saving the PDF (Content-Disposition). */
  downloadFileName: string;
  /** The campaign landing route that renders the capture form inline. */
  landingPath: string;
  /** Page count of the approved asset, for reference and verification. */
  pageCount: number;
  /** Title-case publication title. Email and PDF surfaces only (Design System §7.7 note). */
  publicationTitle: string;
  /** Full subtitle. Only where Design System §20.1 does not apply. */
  subtitle: string;
  /** Sentence-case main title for site headings. */
  siteTitle: string;
  email: {
    subject: string;
    preheader: string;
  };
};

export const LEAD_MAGNET_ASSETS = {
  'procurement-field-guide': {
    id: 'procurement-field-guide',
    version: '2026-09',
    publicPath: '/guides/procurement-field-guide',
    fileName: 'jitpro-construction-procurement-field-guide-2026-09.pdf',
    downloadFileName: 'JiTpro-Construction-Procurement-Field-Guide.pdf',
    landingPath: '/field-guide',
    pageCount: 31,
    publicationTitle: 'What Will Stop Work Six Months From Now?',
    subtitle: 'The JiTpro Field Guide to Construction Procurement Control',
    siteTitle: 'What will stop work six months from now?',
    email: {
      subject: 'Your JiTpro Construction Procurement Field Guide',
      preheader: 'What Will Stop Work Six Months From Now? Your link is inside.',
    },
  },
} as const satisfies Record<string, LeadMagnetAsset>;

export type LeadMagnetId = keyof typeof LEAD_MAGNET_ASSETS;

export const LEAD_MAGNET_IDS = Object.keys(LEAD_MAGNET_ASSETS) as LeadMagnetId[];

export function isLeadMagnetId(value: unknown): value is LeadMagnetId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LEAD_MAGNET_ASSETS, value);
}

export function getLeadMagnet(id: LeadMagnetId): LeadMagnetAsset {
  return LEAD_MAGNET_ASSETS[id];
}

/** The route an asset's id implies under the `/guides/<asset-slug>` convention. */
export function stableRouteFor(id: string): string {
  return `${GUIDES_ROUTE_PREFIX}${id}`;
}
