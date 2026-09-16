import HomeHero from '../components/home/HomeHero';
import ProblemSection from '../components/home/ProblemSection';
import MethodSection from '../components/home/MethodSection';
import OutcomesSection from '../components/home/OutcomesSection';
import HomeFinalCTA from '../components/home/HomeFinalCTA';
import LeadMagnetCTA from '../components/lead-magnet/LeadMagnetCTA';

/**
 * The five-section homepage on the buyer's psychological journey, in three
 * narrative acts (Decision Log 2026-08-26; approved plan at
 * docs/design/homepage-five-section-compression-plan.md).
 *
 *   ACT ONE — the problem, on --jp-background
 *     01 Hero          recognition, and enough orientation to continue
 *     02 Problem       detection and the response window: two movements,
 *                      one causal story told once
 *
 *   ACT TWO — the answer, on --jp-surface-light
 *     03 Method        the operating requirement, the five-stage rail and
 *                      figure, closing on the §17.1 terminal field band
 *
 *   ACT THREE — trust and action, on --jp-surface then --jp-background
 *     04 Why JiTpro    trust, the engagement model, and what changes
 *     05 Timing + CTA  at award, during buyout, before mobilization
 *
 * The buyer journey (recognition → understanding → interest → respect →
 * trust → timing) remains the organizing doctrine; the stages share sections
 * rather than each owning one. Each section still creates the question the
 * next one answers, and the backgrounds carry the acts.
 *
 * COMPRESSION IN PROGRESS: sections 01–03 are built. Slots 04–05 are served
 * by stand-ins until their pass is approved:
 *   04  OutcomesSection  -> gains the trust movement, the §20.1 engagement
 *                           model, and concrete what-changes copy
 *   05  HomeFinalCTA     -> gains the timing markers (award, preconstruction,
 *                           buyout, mobilization); already the 05 base
 *
 * THE FIELD GUIDE BAND sits AFTER section 05, outside the five-section
 * doctrine (Design System §20.2, approved 2026-09-12; lead-gen plan A7,
 * D6.6). It is a post-CTA band, never a sixth section: it follows the final
 * commercial CTA and never precedes it, its eyebrow is its only amber, and
 * its action is the §26.1 hairline secondary so the page keeps exactly one
 * Brand Amber primary, `Protect your next project` (§48.1). Nothing above it
 * changes.
 *
 * Preserved states: the pre-rebuild homepage at tag
 * `homepage-pre-buyer-journey-rebuild-2026-08-25`, and the eight-section
 * beat-three build at tag `homepage-eight-section-beat3-2026-08-26`.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <HomeHero />
      <ProblemSection />
      <MethodSection />

      <OutcomesSection />
      <HomeFinalCTA />

      <LeadMagnetCTA placement="home-band" variant="band" />
    </div>
  );
}
