import ProfitHero from '../components/home/ProfitHero';
import CoreBeliefSection from '../components/home/CoreBeliefSection';
import ProcurementSection from '../components/home/ProcurementSection';
import FewerSurprisesSection from '../components/home/FewerSurprisesSection';
import HowWeDoItSection from '../components/home/HowWeDoItSection';
import AudienceSection from '../components/home/AudienceSection';
import ThroughoutProjectSection from '../components/home/ThroughoutProjectSection';
import NextProblemCTA from '../components/home/NextProblemCTA';

/**
 * The homepage (Decision Log 2026-11-05; Section 20.1 amendment of the same
 * date, revised since). Plain English first: the business problem, JiTpro's
 * approach, the benefits, and one invitation to begin with one project.
 *
 *   ACT ONE — the problem and the promise, on --jp-background
 *     1 Hero                  broken schedules, promises, profits
 *     1a What we believe      the core belief, on the --jp-surface band
 *     1b Procurement          more than buying materials (2026-11-06)
 *     2 Fewer surprises       see it coming; keep a clear record
 *     2a How we do it         the plan few projects receive, on the
 *                             --jp-surface band (restored 2026-11-09)
 *
 *   ACT TWO — the work, on --jp-surface-light
 *     3 Audience section      who JiTpro helps, and how (2026-11-09,
 *                             Design System Section 54); replaces
 *                             Know what's coming
 *     4 Throughout            one project at a time; with you throughout
 *
 *   ACT THREE — the action, on --jp-background
 *     6 Final CTA             start with one project (2026-11-13)
 *
 * Both primary actions read "Let's talk about your project" and go to
 * /contact. The hero's quiet secondary goes to /learn-more.
 *
 * WHAT LEFT THIS PAGE, AND WHERE IT IS. The previous homepage's sections
 * (HomeHero, ProblemSection with DependencyChain, MethodSection with
 * MethodologyFigure and the five product screens, OutcomesSection,
 * HomeFinalCTA) and the Field Guide band are no longer rendered here. Their
 * source files, assets and infrastructure are kept, unchanged, for reuse on
 * the supporting pages; the band and the screens still run on /learn-more,
 * and the Field Guide stays reachable from the footer on every page. The
 * previous homepage is preserved at tag
 * `homepage-pre-messaging-simplification-2026-11-05`.
 *
 * KNOW WHAT'S COMING (2026-11-09). The four-step sticky stack and its three
 * figures are no longer rendered here; the audience section takes section 3.
 * Its intro panel continues as HowWeDoItSection, directly before it.
 * `KnowWhatsComingSection` and its figures stay in the codebase, unchanged,
 * for reuse, and are preserved at tag `homepage-four-step-stack-2026-11-09`
 * (docs/archive/homepage-four-step-stack.md).
 *
 * PROTECT YOUR PROFIT (removed 2026-11-13). Section 5 repeated the financial
 * argument the procurement section and Fewer surprises already make, so it is
 * no longer rendered here. `ProtectProfitSection` stays in the codebase,
 * unchanged, and its copy and restore steps are in
 * docs/archive/homepage-protect-profit.md.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <ProfitHero />
      <CoreBeliefSection />
      <ProcurementSection />
      <FewerSurprisesSection />
      <HowWeDoItSection />
      <AudienceSection />
      <ThroughoutProjectSection />
      <NextProblemCTA />
    </div>
  );
}
