import ProfitHero from '../components/home/ProfitHero';
import CoreBeliefSection from '../components/home/CoreBeliefSection';
import ProcurementSection from '../components/home/ProcurementSection';
import FewerSurprisesSection from '../components/home/FewerSurprisesSection';
import HowWeDoItSection from '../components/home/HowWeDoItSection';
import AudienceSection from '../components/home/AudienceSection';
import ThroughoutProjectSection from '../components/home/ThroughoutProjectSection';
import ProtectProfitSection from '../components/home/ProtectProfitSection';
import NextProblemCTA from '../components/home/NextProblemCTA';

/**
 * The six-section homepage (Decision Log 2026-11-05; Section 20.1 amendment
 * of the same date). Plain English first: the business problem, the two ways
 * JiTpro protects profit, how the work starts, how it continues, why it
 * matters, and one action.
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
 *     4 Throughout            the weekly list; your PMs still run the job
 *
 *   ACT THREE — the outcome and the action, on --jp-surface then
 *   --jp-background
 *     5 Protect your profit   fewer delays, fewer surprises, clear answers
 *     6 Final CTA             let's find it early
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
      <ProtectProfitSection />
      <NextProblemCTA />
    </div>
  );
}
