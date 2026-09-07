import { CONTROL_PAIRS, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'dark' as const;

const OUTSIDE_LABEL = 'What you may not control';
const INSIDE_LABEL = 'What you can control';

/**
 * 02 - What you can actually control.
 *
 * The page's central conceptual turn, built as the approved paired-condition
 * comparison (Design System Section 50.6). SHORTENED 2026-09-04 to four pairs
 * and a tighter lede: the reader has the distinction by the second pair, and
 * the section's job is to hand off to the method, not to prove the point seven
 * times.
 *
 * THE TWO COLUMNS ARE TYPOGRAPHICALLY IDENTICAL. Same face, same size, same
 * weight, same ink. The argument is carried entirely by the words, because the
 * moment the right-hand column is drawn heavier or warmer the section stops
 * being an observation and becomes an advertisement. Nothing here is amber,
 * nothing is a success token, and neither column is a state (Sections 8.7,
 * 47.3, 50.6).
 *
 * EVERY ROW CARRIES BOTH LABELS at every width. On a narrow screen the two
 * halves stack, and a reader who scrolls into the middle of the section has to
 * be able to tell which side they are reading without scrolling back up
 * (Section 50.6, the standing label).
 *
 * THE RIGHT COLUMN NEVER PROMISES THE LEFT ONE. It describes management of the
 * dependency: identification, ownership, a required-by date, and visibility
 * when it moves. It must never be rewritten into control over the person
 * (Sections 20.1 engagement model, 50.2).
 */
export default function ControlSection() {
  const tone = TONE[surface];
  const section = SECTION['02'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="The dependency has always belonged to you."
        lede={
          <>
            <p>
              You do not decide when an owner finalizes a selection, how fast a design question comes back, or what a fabricator does on their own floor. Those belong to other people, and they always will. None of this is about pretending otherwise.
            </p>
            <p>
              What has always been yours is how the dependency is managed: whether it is identified early, what specifically is required, who carries the next move, when it is required, what work it releases, whether it is moving, and when it needs to be escalated.
            </p>
          </>
        }
      />

      <ul className="mt-14 lg:mt-16">
        {CONTROL_PAIRS.map((pair) => (
          <li key={pair.subject} className={`border-t pt-7 pb-8 ${tone.rule}`}>
            <h3
              className={`font-heading text-[1.1875rem] font-semibold leading-snug ${tone.heading} sm:text-[1.25rem]`}
            >
              {pair.subject}
            </h3>

            <div className="mt-5 grid gap-y-6 sm:grid-cols-2 sm:gap-x-10 lg:gap-x-16">
              <div>
                <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}>
                  {OUTSIDE_LABEL}
                </p>
                <p className={`mt-3 max-w-[52ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.body}`}>
                  {pair.outside}
                </p>
              </div>

              {/* The divider belongs to the pair, so it is drawn on the second
                  half and only where the halves sit side by side. Stacked,
                  proximity already does the grouping. */}
              <div className={`sm:border-l sm:pl-10 lg:pl-16 ${tone.rule}`}>
                <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}>
                  {INSIDE_LABEL}
                </p>
                <p className={`mt-3 max-w-[52ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.body}`}>
                  {pair.inside}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p
        className={`mt-10 max-w-[46ch] border-t pt-12 font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance sm:text-[1.4375rem] lg:text-[1.5rem] ${tone.rule} ${tone.heading}`}
      >
        JiTpro puts that structure in place before the field is the thing creating the urgency.
      </p>
    </NumberedSection>
  );
}
