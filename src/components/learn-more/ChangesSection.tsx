import { CHANGE_PAIRS, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'elevated' as const;

const WITHOUT_LABEL = 'Found in the field';
const WITH_LABEL = 'Found early';

/**
 * 06 - What changes.
 *
 * The second paired-condition comparison (Section 50.6), and the page's turn
 * into act three. CUT FROM EIGHT ROWS TO FOUR ON 2026-09-04, and the four are
 * the four outcomes the section is actually arguing: problems become visible
 * earlier, accountability becomes explicit, the team keeps more options, and
 * margin is not forced to be the first recovery tool. The rows that went were
 * four more illustrations of those same four ideas, and the reader was being
 * asked to read the argument twice. Same rules as section 02: the two columns are
 * typographically identical, and colour carries none of the contrast. Neither
 * column is a state, so neither takes a semantic token; --jp-success in
 * particular has one meaning in this system (confirmed successful completion,
 * Section 8.3.1) and a marketing comparison is not it.
 *
 * THE STANDING LABEL (Section 50.6) is rendered on EVERY pair, and drawn once
 * as a header row where the columns sit side by side. A reader who lands
 * mid-section on a phone must never be reading one column of a comparison
 * without knowing which one.
 *
 * Where the header row is drawn, the per-pair labels go to `sr-only` rather
 * than `hidden`: the visual duplication is removed, the announcement is not.
 * The header row is the decoration of the two, so it is the one that is
 * aria-hidden.
 *
 * CLAIM STRENGTH (Section 20.1): the right column stops at better chances,
 * more time, and available alternatives. It does not promise a schedule that
 * holds, a delivery that arrives, or a project without problems. The closing
 * line says so in as many words, because a reader who finishes this section
 * believing a guarantee was made has been misled by it.
 */
export default function ChangesSection() {
  const tone = TONE[surface];
  const section = SECTION['06'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="The same problem, found at two different times."
        lede={
          <p>
            Nothing below changes what the problem is. What changes is the moment your team learns about it, and therefore how many ways they still have to deal with it.
          </p>
        }
      />

      {/* The standing labels, where the columns are side by side. */}
      <div
        className={`mt-12 hidden border-b pb-4 sm:grid sm:grid-cols-2 sm:gap-x-10 lg:mt-14 lg:gap-x-16 ${tone.rule}`}
        aria-hidden="true"
      >
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}>
          {WITHOUT_LABEL}
        </p>
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}>
          {WITH_LABEL}
        </p>
      </div>

      <ul className="mt-12 sm:mt-0">
        {CHANGE_PAIRS.map((pair) => (
          <li
            key={pair.without}
            className={`grid gap-y-4 border-b py-5 sm:grid-cols-2 sm:gap-x-10 lg:gap-x-16 ${tone.rule}`}
          >
            <div>
              <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] sm:sr-only ${tone.muted}`}>
                {WITHOUT_LABEL}
              </p>
              <p className={`mt-2 text-[1rem] leading-[1.6] sm:mt-0 sm:text-[1.0625rem] ${tone.body}`}>
                {pair.without}
              </p>
            </div>
            <div>
              <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] sm:sr-only ${tone.muted}`}>
                {WITH_LABEL}
              </p>
              <p className={`mt-2 text-[1rem] leading-[1.6] sm:mt-0 sm:text-[1.0625rem] ${tone.body}`}>
                {pair.with}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className={`mt-10 max-w-[62ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] ${tone.body}`}>
        None of this is a promise of a perfect project. Construction does not offer one, and finding a problem early does not make it go away. Your options do. What earlier visibility and explicit accountability give your team is time, and a far better chance to prevent or soften the recovery that would otherwise be paid for out of margin.
      </p>
    </NumberedSection>
  );
}
