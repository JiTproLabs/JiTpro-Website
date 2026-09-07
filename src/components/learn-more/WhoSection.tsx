import { FIT_FOR, FIT_NOT_FOR, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'elevated' as const;

/**
 * 09 - Where JiTpro fits.
 *
 * Qualification, and the section most easily written badly. RE-AIMED
 * 2026-09-04 onto the one distinction that matters commercially: JiTpro is
 * preventive, and it is not a rescue service for a project already in
 * recovery. A reader who brings us the wrong project is a worse outcome than a
 * reader who brings us none, so the second column says so first and plainly.
 *
 * Two rules still govern it (Section 50.2):
 *
 *   IT DISQUALIFIES BY POSTURE, NEVER BY CHARACTER. Every line in the second
 *   column describes a way of operating, in the passive voice, without a
 *   subject to insult. A reader who recognizes themselves there should be able
 *   to disagree with the position without feeling described as a bad builder.
 *
 *   THE READER IS NOT DYSFUNCTIONAL (Section 20.1, audience). They are
 *   successful and reaching the limits of the methods that got them here. No
 *   line here may imply otherwise, and no numerical qualification of the
 *   audience may ever appear on this page.
 *
 * The two columns are typographically equal for the same reason the earlier
 * comparisons are: the second column is not a warning, and drawing it in a
 * different weight or a semantic colour would make it one (Sections 8.3.1,
 * 50.6).
 */
export default function WhoSection() {
  const tone = TONE[surface];
  const section = SECTION['09'];

  const columns = [
    { heading: 'JiTpro fits where:', items: FIT_FOR },
    { heading: 'JiTpro is probably not the right fit where:', items: FIT_NOT_FOR },
  ];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="This works best before a project is in trouble."
        lede={
          <p>
            JiTpro is preventive. It is at its most useful on a project early enough that decisions, information, and commitments can still be worked, for a contractor who has paid for preventable problems before and does not want to repeat it on the next one.
          </p>
        }
      />

      <div className="mt-14 grid gap-x-10 gap-y-12 lg:mt-16 lg:grid-cols-2 lg:gap-x-16">
        {columns.map((column) => (
          <div key={column.heading} className={`border-t pt-6 ${tone.rule}`}>
            <h3
              className={`max-w-[26ch] font-heading text-[1.25rem] font-semibold leading-snug text-balance sm:text-[1.375rem] ${tone.heading}`}
            >
              {column.heading}
            </h3>
            <ul className="mt-6 space-y-4">
              {column.items.map((item) => (
                <li
                  key={item}
                  className={`max-w-[52ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.body}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </NumberedSection>
  );
}
