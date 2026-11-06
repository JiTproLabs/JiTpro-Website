/**
 * Section 3 — know what's coming (Decision Log 2026-11-05).
 *
 * Opens the light act (--jp-surface-light), which carries sections 3 and 4:
 * what JiTpro does at the start, and what it does every week after. This is
 * the plain-English summary of the method that the Section 20.1 amendment of
 * 2026-11-05 approves for the homepage; the operational detail lives on
 * /learn-more.
 *
 * THE CAPACITY MESSAGE (added 2026-11-05 after review) opens the section:
 * contractors know early planning matters, but the start of a job crowds it
 * out, and JiTpro gives their team dedicated planning support from the
 * start. Support, never replacement: the GC's team keeps running the job. It replaces the former opening line
 * ("We don't wait until your project is in trouble."), which said the same
 * thing less specifically.
 *
 * THE FOUR QUESTIONS are an ordered list. Ordinals follow §48.9 on the light
 * surface: the data face, small, tracked, --jp-ink-secondary above the §8.8
 * floor. The question itself carries the sequence without them. Hierarchy on
 * this surface is ink; amber carries nothing here (§8.8).
 */

const QUESTIONS = [
  'What does your project need?',
  'When does it need it?',
  'Who is responsible for getting it done?',
  'What’s missing or putting the schedule at risk?',
];

export default function KnowWhatsComingSection() {
  return (
    <section className="bg-jp-surface-light px-6 pt-24 pb-14 sm:px-8 sm:pt-28 sm:pb-16 lg:px-10 lg:pt-32 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-[24ch] font-heading text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.5rem] lg:text-[3rem]">
          Know what&apos;s coming. From day one.
        </h2>

        {/* Why the early planning gets skipped: the reader already knows it
            matters, and the start of a job leaves no time for it. Capacity,
            never competence (§20.1 audience rule). */}
        <div className="mt-8 max-w-[62ch] lg:mt-10">
          <h3 className="font-heading text-[1.25rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.375rem]">
            Every contractor knows planning ahead matters.
          </h3>
          <div className="mt-4 space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem]">
            <p>
              But when a new project starts, there&apos;s so much to do that accurate planning gets pushed aside. Before long, you&apos;re putting out the same fires you promised yourself you&apos;d avoid after the last project.
            </p>
            <p className="font-semibold text-jp-background">
              JiTpro gives your team dedicated planning support from the start, so you can stay ahead of problems instead of chasing them.
            </p>
          </div>
        </div>

        <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:mt-12">
          <p>We start by looking at your schedule, drawings, and project information.</p>
          <p>Then we answer four simple questions:</p>
        </div>

        <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-x-10">
          {QUESTIONS.map((question, i) => (
            <li key={question} className="border-t border-jp-ink-secondary/20 pt-6">
              <span className="block font-mono text-xs tracking-[0.2em] text-jp-ink-secondary/85">
                <span className="sr-only">Question </span>
                {`0${i + 1}`}
              </span>
              <p className="mt-3 max-w-[22ch] font-heading text-[1.1875rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.25rem]">
                {question}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:mt-14">
          We turn those answers into a clear plan your team can follow.
        </p>

        <p className="mt-6 max-w-[36ch] font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance text-jp-background sm:text-[1.75rem] lg:text-[2rem]">
          You know what&apos;s coming. Your team knows what to do. Your client knows what to expect.
        </p>
      </div>
    </section>
  );
}
