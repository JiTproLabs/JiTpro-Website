import { METHOD_STEPS, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'light' as const;

/**
 * 03 - What JiTpro actually does.
 *
 * MOVED FROM 04 TO 03 ON 2026-09-04, ahead of the JIT section that used to
 * precede it. The reader asks what we do on their project before they ask
 * where the name came from, and the backward chain in 04 is far easier to read
 * once these five steps have named the work. Both sections sit on the light
 * act surface, so the swap reorders two sections and changes nothing about the
 * page's acts (Section 50.7).
 *
 * The homepage teaches the method through an interactive stage rail
 * (Section 46.8). THIS PAGE DELIBERATELY DOES NOT REPEAT IT. A reader on a
 * long-form page is reading, not exploring, and a selector here would hide
 * four fifths of the method behind a control on the one surface whose job is
 * to explain all of it. All five steps are open, in order, at all times.
 *
 * It is also not a restatement of the homepage's five stages. Those stages are
 * product doctrine naming what each one PRODUCES
 * (src/content/methodologyStages.ts), and they are rendered as written in
 * section 05 below. These five are the same work described as the reader
 * experiences it: what we do, in order, on their project. The two must stay
 * distinguishable, and neither may be edited to look like the other.
 *
 * Step ordinals take the Section 48.9 light convention, the same as the
 * section ordinal above them: one numbering convention on the page, not two.
 */
export default function MethodStepsSection() {
  const tone = TONE[surface];
  const section = SECTION['03'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="Understand, find, assign, plan, track."
        lede={
          <p>
            Five steps, run on your actual project, in this order. JiTpro works alongside your construction management team, and your team keeps every project relationship it already owns. What changes is that the work those relationships depend on becomes explicit, dated, and visible.
          </p>
        }
      />

      <ol className="mt-14 lg:mt-16">
        {METHOD_STEPS.map((step, i) => (
          <li
            key={step.title}
            className={`border-t py-8 first:pt-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 xl:gap-x-20 ${tone.rule}`}
          >
            <div className="flex items-baseline gap-4">
              <span className={`shrink-0 font-mono text-xs tracking-[0.2em] ${tone.ordinal}`}>
                <span className="sr-only">Step </span>
                {`0${i + 1}`}
              </span>
              <h3
                className={`font-heading text-[1.25rem] font-semibold leading-snug text-balance sm:text-[1.375rem] ${tone.heading}`}
              >
                {step.title}
              </h3>
            </div>
            <p
              className={`mt-4 max-w-[58ch] pl-[calc(1rem+3ch)] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:mt-0 lg:pl-0 ${tone.body}`}
            >
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </NumberedSection>
  );
}
