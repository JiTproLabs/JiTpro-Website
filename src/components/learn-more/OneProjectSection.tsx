import { SECTION } from '../../content/learnMore';
import { NumberedSection, PrimaryAction, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'dark' as const;

/**
 * 07 - Start with one project.
 *
 * The section whose only job is to make the next step small. Everything here
 * is subtraction: what the reader does NOT have to do in order to find out
 * whether this works. The governing sentence, added 2026-09-04, is that you do
 * not have to change your company to find out.
 *
 * THE PAGE'S SECOND PRIMARY ACTION (Section 50.5). It carries the same label
 * and the same destination as the opening's and the close's, because they are
 * one offer appearing three times, not three offers. A different label here
 * would be a positioning decision, not a layout one.
 *
 * The existing systems are named because the reader is already running one and
 * the unspoken objection is that this replaces it. Naming them answers the
 * objection. It does not describe JiTpro as software, as a layer, or as a
 * competitor to them, and it must never be edited into a comparison
 * (Section 20.1, retired language).
 *
 * Nothing here states a price, a term, a duration, or a deliverable count.
 * None is approved anywhere in this system, and an absent decision is not
 * permission to infer one (Appendix C).
 */
export default function OneProjectSection() {
  const tone = TONE[surface];
  const section = SECTION['07'];

  const NOT_REQUIRED = [
    {
      title: 'You do not retool the company.',
      body: 'No company-wide rollout, no process redesign, and no asking every project team to work differently before anyone has seen a result.',
    },
    {
      title: 'You do not replace what you already run.',
      body: 'Procore, Autodesk, CMiC, or whatever your team works in stays exactly where it is and keeps doing what it does.',
    },
    {
      title: 'You do not commit the organization.',
      body: 'One project team, one project. The rest of the company keeps running the way it runs today.',
    },
    {
      title: 'You do not rebuild your processes first.',
      body: 'We work with the documents, the schedule, and the team as they exist right now. That is the starting condition, not a problem to fix beforehand.',
    },
  ];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="You do not have to change your company to find out."
        lede={
          <p>
            One project is the whole commitment. Pick an upcoming one and let JiTpro be tested on work you already know, with people you already trust to tell you the truth about it.
          </p>
        }
      />

      <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:gap-x-16">
        {NOT_REQUIRED.map((item) => (
          <li key={item.title} className={`border-t pt-6 ${tone.rule}`}>
            <h3
              className={`font-heading text-[1.1875rem] font-semibold leading-snug text-balance sm:text-[1.25rem] ${tone.heading}`}
            >
              {item.title}
            </h3>
            <p className={`mt-3 max-w-[48ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.muted}`}>
              {item.body}
            </p>
          </li>
        ))}
      </ul>

      <div className={`mt-14 border-t pt-12 lg:mt-16 ${tone.rule}`}>
        <p
          className={`max-w-[34ch] font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance sm:text-[1.75rem] lg:text-[2rem] ${tone.heading}`}
        >
          Start with one upcoming project. Judge it on that project.
        </p>
        <p className={`mt-6 max-w-[58ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] ${tone.body}`}>
          JiTpro works alongside your project team. We build the structure, your team keeps every relationship it already owns, and you judge the value on real work rather than on a demonstration.
        </p>

        <div className="mt-10">
          <PrimaryAction />
        </div>
      </div>
    </NumberedSection>
  );
}
