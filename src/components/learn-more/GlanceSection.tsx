import { GLANCE_ITEMS, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'elevated' as const;

/**
 * 00 - What JiTpro is.
 *
 * The whole offer in six items, for the reader who will decide from this
 * section alone whether the rest of the page is worth their time. It is
 * scannable by construction: a short label and one sentence, nothing longer.
 *
 * It is the page's definitional answer (revised 2026-09-04). One of the six
 * items says what JiTpro is NOT, because the reader arrives holding several
 * wrong guesses and removing them is faster than arguing around them.
 *
 * NOT CARDS (Section 48.2). These are six related facts, not six discrete
 * units, so they take hairline separation and whitespace. A card wall here
 * would be exactly the stock-SaaS reading Section 47.2 rules out.
 *
 * NO AMBER beyond the section ordinal (Section 48.7). The band's own top and
 * bottom edges mark it; nothing inside it is accented.
 */
export default function GlanceSection() {
  const tone = TONE[surface];
  const section = SECTION['00'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="JiTpro in about a minute."
      />

      <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-14">
        {GLANCE_ITEMS.map((item) => (
          <div key={item.label} className={`border-t pt-6 ${tone.rule}`}>
            <dt
              className={`font-heading text-[1.125rem] font-semibold leading-snug ${tone.heading} sm:text-[1.1875rem]`}
            >
              {item.label}
            </dt>
            <dd className={`mt-3 max-w-[44ch] text-[1rem] leading-[1.65] ${tone.muted} sm:text-[1.0625rem]`}>
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </NumberedSection>
  );
}
