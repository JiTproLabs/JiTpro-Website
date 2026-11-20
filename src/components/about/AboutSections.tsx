/**
 * About page, Sections 5 to 7 (Design System §76, Decision Log 2026-11-18): the approved structure of the
 * service-led About page below *How we work together* (Sections 3 and 4, now designed: WhatWeDoSection.tsx, §77, and
 * HowWeWorkTogetherSection.tsx, §78). Each section here
 * is a placeholder until it is designed: only its
 * approved eyebrow, its exact h2 and its central message, with a temporary *Design pending* indicator. No other copy,
 * no actions, no imagery (§76.1).
 *
 * Each section is its own named component, so it can be replaced independently; all three render PendingSection,
 * the temporary placeholder (§76.2), which is removed with the last of them.
 *
 * POSITIONING (§76.1, binding on every later design here): JiTpro is service-led, supported by a disciplined
 * methodology and purpose-built technology. It works alongside the contractor's team and performs the detailed
 * upstream planning. Not primarily a software product, not a staffing agency, not a consultant who only advises.
 */

type Surface = 'light' | 'white';

/** The temporary placeholder (§76.2). Sections alternate white and light so each reads as distinct. */
function PendingSection({
  id,
  eyebrow,
  title,
  message,
  surface,
}: {
  id: string;
  eyebrow: string;
  title: string;
  message: string;
  surface: Surface;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={surface === 'light' ? 'bg-jp-surface-light' : 'bg-jp-surface-white'}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="max-w-[48rem]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {/* Authored in sentence case, uppercased in CSS (§7.7); slate on light, the bar amber (§8.8). */}
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm">
              <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
              {eyebrow}
            </p>
            <span className="rounded-full border border-dashed border-jp-ink-secondary/50 px-2.5 py-0.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-jp-ink-secondary">
              Design pending
            </span>
          </div>
          <h2
            id={headingId}
            className="mt-5 font-heading text-[min(2rem,8.4vw)] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.375rem] lg:text-[clamp(2rem,2.8vw,2.625rem)]"
          >
            {title}
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[1.125rem]">{message}</p>
        </div>
      </div>
    </section>
  );
}

/** Section 5: the experience behind JiTpro (will link to the founder story). */
export function OurExperienceSection() {
  return (
    <PendingSection
      id="our-experience"
      eyebrow="Our experience"
      title="Built by people who have lived it."
      message="JiTpro was developed from firsthand experience managing the problems we now help contractors prevent."
      surface="light"
    />
  );
}

/** Section 6: JiTpro's convictions and the outcomes they protect. */
export function WhatWeBelieveSection() {
  return (
    <PendingSection
      id="what-we-believe"
      eyebrow="What we believe"
      title="Protect your schedule. Protect your profits. Protect your people."
      message="Better planning creates better projects, healthier teams, and stronger construction companies."
      surface="white"
    />
  );
}

/** Section 7: the closing invitation (will carry the primary contact action). */
export function OurInvitationSection() {
  return (
    <PendingSection
      id="our-invitation"
      eyebrow="Our invitation"
      title="Break the cycle. One project at a time."
      message="Start with one project. Experience what changes when the work ahead is properly planned."
      surface="light"
    />
  );
}
