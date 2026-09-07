import { useEffect } from 'react';
import JiTproWordmark from '../../components/JiTproWordmark';
import ScheduleViewer from '../../demo-lab/schedule/ScheduleViewer';

/**
 * PROCUREMENT SCHEDULE - TEAM REVIEW. Unlisted.
 *
 * A plain URL the JiTpro team can open to use the current procurement
 * schedule prototype. It renders ScheduleViewer, the same presentation the
 * dev lab uses, so there is exactly one schedule: a change to the fixture,
 * the engine, the Gantt or the inspector appears here and in the lab at once.
 *
 * Not a marketing surface. No site navigation, no footer, no copy beyond the
 * name of what is on the page. Not linked from anywhere; not in a sitemap
 * (the site has none); marked noindex, nofollow here and, on Cloudflare
 * Pages, by public/_headers as well. Not authenticated - access control, if
 * wanted, is applied at the host.
 */
export default function ProcurementScheduleReview() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Procurement Schedule · Team Review | JiTpro';
    // Route-level robots directive. The SPA serves one index.html for every
    // path, so this is set per page rather than in the document head.
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
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <header className="border-b border-jp-border/20">
        <div className="mx-auto flex max-w-[1560px] items-center gap-4 px-6 py-4">
          <JiTproWordmark variant="amber" className="text-[20px]" />
          <span aria-hidden="true" className="h-5 w-px bg-jp-border/30" />
          <h1 className="text-[15px] font-semibold tracking-tight">
            Procurement Schedule
            <span className="font-medium text-jp-text-muted"> · Team Review</span>
          </h1>
          <span className="ml-auto rounded-full border border-jp-border/40 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-jp-text-muted">
            Internal review
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1560px] px-6 py-6">
        {/* Fits the width down to 80% of the authored canvas; narrower than
            that, the schedule keeps its geometry and scrolls sideways. */}
        <ScheduleViewer enabled minScale={0.8} />
      </main>
    </div>
  );
}
