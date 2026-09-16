import { useEffect } from 'react';
import LeadMagnetCTA from '../../components/lead-magnet/LeadMagnetCTA';

/**
 * LEAD MAGNET - TEAM REVIEW. Unlisted.
 *
 * Sprint 4 builds the capture experience but registers no production
 * placement; the homepage, Learn More and the footer are Sprint 5 and are
 * deliberately untouched. This page is the "single development placement for
 * QA" the plan asks for: somewhere to exercise the §20.2 band, the dialog, the
 * form states, keyboard and focus behaviour, and the responsive passes without
 * putting the offer in front of a visitor.
 *
 * It follows the precedent of `/review/procurement-schedule`: in the build so
 * it is reachable on a Cloudflare preview for Jeff's visual approval, not
 * linked from any surface, not in a sitemap (the site has none), and marked
 * noindex, nofollow both here and, on Cloudflare Pages, by `public/_headers`
 * for all of `/review/*`.
 *
 * It is deleted when Sprint 5 puts the band on its real surfaces.
 */
export default function LeadMagnetReview() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Lead magnet · Team Review | JiTpro';
    // The SPA serves one index.html for every path, so this is set per page.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="bg-jp-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-jp-text-muted">
          Team review
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-jp-text-primary">
          Lead magnet capture
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-jp-text-secondary">
          The offer band and its dialog, rendered outside any production surface. Unlisted and noindex; the real placements arrive in Sprint 5.
        </p>
      </div>

      <LeadMagnetCTA placement="home-band" variant="band" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <p className="mb-3 text-sm font-semibold text-jp-text-secondary">Footer-link variant</p>
        <LeadMagnetCTA placement="footer-link" variant="footer-link" />
      </div>
    </div>
  );
}
