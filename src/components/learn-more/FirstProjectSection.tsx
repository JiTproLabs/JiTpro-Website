import { FIRST_PROJECT_PHASES, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'dark' as const;

/**
 * 08 - What the first project looks like.
 *
 * Makes the engagement tangible enough to picture and no more specific than
 * what is actually established. There are DELIBERATELY no durations, no week
 * counts, no deliverable counts, and no meeting cadence here: none of those is
 * an approved decision, and inventing one on a marketing page turns a
 * placeholder into a commitment the delivery team then has to honour
 * (Appendix C, the non-decision placeholder policy).
 *
 * Phase ordinals take the Section 48.9 dark convention, the same as every
 * other sequence on the page.
 *
 * The phases run in order and the order is the argument: you cannot assign
 * accountability for a dependency you have not found, and you cannot date a
 * dependency you have not assigned.
 *
 * REFRAMED 2026-09-04 to the reader's own steps rather than ours: bring us a
 * project, we put JiTpro to work on it, you see it against real work. The
 * first phase now carries the qualifying condition that matters most, which is
 * that the project should be early enough for meaningful options to still
 * exist. JiTpro is preventive, and a project already in recovery is not what
 * this is for (section 09).
 */
export default function FirstProjectSection() {
  const tone = TONE[surface];
  const section = SECTION['08'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="What actually happens on that project."
        lede={
          <p>
            Four steps, in order. You bring us a project, we put JiTpro to work on it, and you watch it run against work you already know.
          </p>
        }
      />

      <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-12">
        {FIRST_PROJECT_PHASES.map((phase, i) => (
          <li key={phase.name} className={`border-t pt-6 ${tone.rule}`}>
            <p className={`font-mono text-xs tracking-[0.2em] ${tone.ordinal}`}>
              <span className="sr-only">Step </span>
              {`0${i + 1}`}
            </p>
            <h3
              className={`mt-3 max-w-[18ch] font-heading text-[1.1875rem] font-semibold leading-snug text-balance sm:text-[1.25rem] ${tone.heading}`}
            >
              {phase.name}
            </h3>
            <p className={`mt-3 max-w-[42ch] text-[1rem] leading-[1.65] ${tone.muted}`}>
              {phase.body}
            </p>
          </li>
        ))}
      </ol>
    </NumberedSection>
  );
}
