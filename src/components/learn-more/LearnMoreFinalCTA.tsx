import { SECTION } from '../../content/learnMore';
import { PrimaryAction } from './LearnMoreShell';
import { SECTION_SCROLL_MT } from './guideLayout';
import { TONE } from './tone';

const surface = 'dark' as const;

/**
 * 11 - Start your first project. The page's close and its third and last
 * primary action (Section 50.5, three is the working ceiling).
 *
 * It is the homepage's final CTA composition, not a new one: the same amber
 * wash rising from the bottom edge, the same centered resolution from `sm:`
 * up, the same single action with no secondary link beside it to dilute it
 * (Sections 7.7 centered CTA supporting copy, 48.6).
 *
 * SAME LABEL, SAME DESTINATION as the two above it, by construction: the
 * action is PrimaryAction, which owns both.
 *
 * IT CLOSES AND NOTHING MORE (revised 2026-09-04). No new argument, no new
 * method, no further education: the page has made its case by here, and a
 * close that teaches one more thing is a close that does not close. The
 * supporting copy is two sentences, and the heading is the action itself. It
 * states no price, no term, and no guarantee (Section 20.1).
 *
 * This section is numbered and appears in the guide like every other, and it
 * carries the page's only `h2` set at the closing register. It is still one
 * h2 in one section (Section 50.3).
 */
export default function LearnMoreFinalCTA() {
  const tone = TONE[surface];
  const section = SECTION['11'];

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className={`relative isolate overflow-hidden bg-jp-background ${SECTION_SCROLL_MT} -mx-6 px-6 py-24 sm:-mx-8 sm:px-8 sm:py-28 lg:-mx-10 lg:px-10 lg:py-40 xl:mx-0 xl:px-8`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_58%_at_50%_100%,color-mix(in_oklab,var(--jp-brand-amber)_12%,transparent),transparent_70%)]"
      />

      <div className="relative">
        <div className="max-w-[46ch] sm:max-w-none sm:text-center">
          <p className={`font-mono text-xs tracking-[0.2em] ${tone.ordinal}`}>
            <span className="sr-only">Section </span>
            {section.ordinal}
          </p>

          <h2
            id={`${section.id}-heading`}
            className={`mt-5 font-heading text-[2.125rem] font-extrabold leading-[1.08] tracking-[-0.022em] text-balance sm:mx-auto sm:max-w-[24ch] sm:text-[2.875rem] lg:text-[3.5rem] ${tone.heading}`}
          >
            Start with one project.
          </h2>

          <p
            className={`mt-7 max-w-[58ch] text-[1.0625rem] leading-[1.7] sm:mx-auto sm:max-w-[54ch] sm:text-[1.125rem] lg:text-[1.1875rem] ${tone.body}`}
          >
            Let us look at where JiTpro can create early accountability and help your team get ahead of preventable problems. One project, your documents, your schedule, and your team, starting from wherever that project stands today.
          </p>

          <div className="mt-10 sm:mt-12">
            <PrimaryAction />
          </div>
        </div>
      </div>
    </section>
  );
}
