/**
 * Section 4 — throughout the project (Decision Log 2026-11-05).
 *
 * Closes the light act begun by Section 3. The two share --jp-surface-light,
 * so the boundary is a hairline inside the container rather than a change of
 * surface (§48.6).
 *
 * ENGAGEMENT MODEL (§20.1, binding): the weekly list goes to the GC's team,
 * and the GC's team runs the job. Nothing here may suggest JiTpro contacts
 * project participants itself or replaces the project manager.
 */
export default function ThroughoutProjectSection() {
  return (
    <section className="bg-jp-surface-light px-6 pt-14 pb-24 sm:px-8 sm:pt-16 sm:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-7xl border-t border-jp-ink-secondary/20 pt-12 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 lg:pt-14 xl:gap-x-20">
        <h2 className="max-w-[18ch] font-heading text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.5rem] lg:text-[3rem]">
          We&apos;re with you throughout the project.
        </h2>

        <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem] lg:mt-2">
          <p>JiTpro isn&apos;t a one-time report that sits on a shelf.</p>
          <p>We do most of our planning work right at the start.</p>
          <p>Then, every week, we give your team a clear list of what needs to happen next.</p>
          <p>
            We show them which decisions are due, who needs to be contacted, which materials need attention, and what could become a problem if nobody acts.
          </p>
          <p>Your PMs still run the job. We help them stay ahead of it.</p>
          <p>And when things change, we update the plan and keep track of what happened.</p>
        </div>
      </div>
    </section>
  );
}
