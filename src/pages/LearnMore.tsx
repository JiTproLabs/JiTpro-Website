import LearnMoreHero from '../components/learn-more/LearnMoreHero';
import GlanceSection from '../components/learn-more/GlanceSection';
import GuideNav from '../components/learn-more/GuideNav';
import ChaosSection from '../components/learn-more/ChaosSection';
import ControlSection from '../components/learn-more/ControlSection';
import MethodStepsSection from '../components/learn-more/MethodStepsSection';
import BackwardSection from '../components/learn-more/BackwardSection';
import ProducesSection from '../components/learn-more/ProducesSection';
import ChangesSection from '../components/learn-more/ChangesSection';
import OneProjectSection from '../components/learn-more/OneProjectSection';
import FirstProjectSection from '../components/learn-more/FirstProjectSection';
import WhoSection from '../components/learn-more/WhoSection';
import BuiltByContractorsSection from '../components/learn-more/BuiltByContractorsSection';
import LearnMoreFinalCTA from '../components/learn-more/LearnMoreFinalCTA';
import GuideRail from '../components/learn-more/GuideRail';
import { GUIDE_ANCHOR_ID } from '../content/learnMore';
import { SECTION_SCROLL_MT } from '../components/learn-more/guideLayout';

/**
 * `/learn-more` - the long-form explainer page (Design System Section 50,
 * approved 2026-09-03).
 *
 * WHERE THE READER COMES FROM. This is the destination of the homepage
 * secondary action "Or click here to learn more". The reader arriving here has
 * recognized the problem on the homepage and is NOT yet ready to click "Start
 * with one project".
 *
 * THE PAGE DOES NOT RESTART THE SALES ARGUMENT (revised 2026-09-04). The
 * homepage has already established the pain and the point of view. This page
 * answers the questions that come next, in the order a contractor asks them:
 *
 *   what exactly is JiTpro                   hero, 00
 *   why would I need it                      01, 02
 *   what do you do on my project             03
 *   what does the JIT mean                   04
 *   what do I actually get                   05
 *   what changes for my team                 06
 *   how do I start, and is it for me         07, 08, 09
 *   why should I believe you                 10
 *   the close                                11
 *
 * A section that does not answer one of those questions does not belong on
 * this page, whatever else it might be worth saying. The previous build spent
 * sections 01 through 03 on three adjacent versions of the same argument
 * before it reached the method; it now reaches the method at 03.
 *
 * THE THREE ACTS, carried by surface (Section 50.7), and identical in shape to
 * the homepage's so the two read as one product:
 *
 *   ACT ONE   --jp-background, with 00 on the elevated band
 *             hero, 00, the guide, 01, 02 - what it is, and why it is needed
 *   ACT TWO   --jp-surface-light
 *             03, 04, 05 - the method, the philosophy behind it, what it
 *             produces. 03 and 04 swapped places on 2026-09-04; both are on
 *             this surface, so the acts are unchanged.
 *   ACT THREE --jp-surface, then --jp-background
 *             06 - 11 - what changes, the small first step, fit, trust, action
 *
 * A surface change here always marks a change of act. Alternating for variety
 * is prohibited (Section 48.6).
 *
 * THREE PRIMARY ACTIONS (Section 50.5): the opening, section 07, and the
 * close. All three are the same PrimaryAction component, so all three carry
 * the same label and the same destination as the homepage's. No two are
 * visible together at any supported width. The page carries exactly one
 * secondary action, "Start the guide", in the opening.
 *
 * THE GUIDE HAS TWO PRESENTATIONS AND ONE SOURCE (Sections 50.4, 50.9).
 * Both are generated from GUIDE_SECTIONS, the same list the sections take
 * their ids from, so the table of contents cannot drift from the page.
 *
 *   below xl   GuideNav, in the flow between 00 and 01, as it always was
 *   at xl      GuideRail, sticky in the left column of the guide area
 *
 * Exactly one is in the layout at any width (`xl:hidden` against
 * `hidden xl:block`), so neither assistive technology nor the reader ever
 * meets the guide twice.
 *
 * THE GUIDE AREA IS THE STICKY CONTAINER, and that is the entire reason the
 * rail can be `position: sticky` rather than `fixed`. Because the rail lives
 * in a grid column of this wrapper, it enters when section 00 does, releases
 * when section 11 ends, and cannot reach the site header, the hero, or the
 * footer. Nothing measures the page to make that true.
 *
 * THE WRAPPER OWNS THE CONTAINER. It carries `max-w-7xl` and the page
 * gutters; the sections inside it carry a bleed that cancels those gutters
 * below xl and stops at the column edge at xl (see NumberedSection). That is
 * what keeps the act surfaces full-bleed at narrow widths while letting them
 * become panels beside the rail at wide ones.
 *
 * COPY GOVERNANCE for every string on this page lives with the copy, in
 * src/content/learnMore.ts. Section 20.1 applies in full, and em dashes are
 * prohibited (Section 50.7).
 */
export default function LearnMore() {
  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <LearnMoreHero />

      {/* The guide area. `GUIDE_ANCHOR_ID` sits here rather than on either
          guide presentation, so the opening's "Start the guide" action lands
          at the start of the guide at every width, and does not need to know
          which presentation is rendered. */}
      <div
        id={GUIDE_ANCHOR_ID}
        className={`${SECTION_SCROLL_MT} mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 xl:grid xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-x-14`}
      >
        <GuideRail />

        {/* `min-w-0` so a wide child (a table, a long word, an image) cannot
            push the column past its track and produce horizontal overflow. */}
        <div className="min-w-0">
          <GlanceSection />
          <GuideNav />
          <ChaosSection />
          <ControlSection />

          <MethodStepsSection />
          <BackwardSection />
          <ProducesSection />

          <ChangesSection />
          <OneProjectSection />
          <FirstProjectSection />
          <WhoSection />
          <BuiltByContractorsSection />
          <LearnMoreFinalCTA />
        </div>
      </div>
    </div>
  );
}
