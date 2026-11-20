import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * About page, Sections 5 and 6 (Design System §76, §79, §80): *Our experience* and *What we believe*, below *How we
 * work together* (HowWeWorkTogetherSection.tsx, §78). Each is its own named component. Section 7 is the homepage's
 * final call to action, the shared NextProblemCTA (§81), so it is not in this file.
 *
 * POSITIONING (§76.1, binding on every later design here): JiTpro is service-led, supported by a disciplined
 * methodology and purpose-built technology. It works alongside the contractor's team and performs the detailed
 * upstream planning. Not primarily a software product, not a staffing agency, not a consultant who only advises.
 */

/**
 * The Leadership Team page's route. PLACEHOLDER (Design System §79.2): that page does not exist yet, so this is null
 * and *Meet the people behind JiTpro.* renders in the link's type without being a link. Set it to the approved route
 * when the page ships; nothing else changes.
 */
const LEADERSHIP_TEAM_PATH: string | null = null;

const LINK_TYPE =
  'font-heading text-base font-semibold leading-snug text-jp-background underline decoration-jp-brand-amber decoration-2 underline-offset-[5px] sm:text-[1.0625rem]';

/** *Meet the people behind JiTpro.*: the role link's treatment (§54.2.5), or its placeholder until the route exists. */
function MeetThePeople() {
  const label = 'Meet the people behind JiTpro.';
  if (!LEADERSHIP_TEAM_PATH) {
    return <p className={`inline-block py-3 ${LINK_TYPE}`}>{label}</p>;
  }
  return (
    <p>
      <Link
        to={LEADERSHIP_TEAM_PATH}
        className={`group inline-block rounded py-3 ${LINK_TYPE} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-background`}
      >
        Meet the people behind{' '}
        <span className="whitespace-nowrap">
          JiTpro.
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="ml-2 inline-block align-[-0.2em] transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </Link>
    </p>
  );
}

/**
 * Section 5: *Our experience* (Design System §79, Decision Log 2026-11-19). MESSAGE: JiTpro comes from decades of
 * firsthand construction experience; its people have carried the responsibilities its clients carry. Leads to the
 * people behind JiTpro.
 *
 *   lg+   about 5 : 7, the eyebrow and h2 at left; the narrative, the statement and the link at right
 *   <lg   one column
 *
 * Amber is decorative on the light ground (§8.8): the eyebrow bar, the statement's bar, the link's underline. No
 * imagery, no icons, no motion.
 */
export function OurExperienceSection() {
  const body = 'text-[1.0625rem] leading-[1.65] text-pretty text-jp-background/85 lg:text-[1.125rem]';
  return (
    <section id="our-experience" aria-labelledby="our-experience-heading" className="bg-jp-surface-light">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:px-10 lg:py-24">
        <div className="max-w-[44rem]">
          {/* Authored in sentence case, uppercased in CSS (§7.7); slate on light, the bar amber (§8.8). */}
          <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm">
            <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
            Our experience
          </p>
          <h2
            id="our-experience-heading"
            className="mt-5 font-heading text-[min(2rem,8.4vw)] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.375rem] lg:text-[clamp(2rem,2.8vw,2.625rem)]"
          >
            Built by people who have lived it.
          </h2>
        </div>

        <div className="mt-8 max-w-[44rem] lg:mt-12 lg:max-w-[40rem]">
          <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[1.25rem]">
            JiTpro was born from decades of firsthand experience managing complex construction projects, leading teams, and
            navigating the challenges that contractors face every day.
          </p>
          <p className={`mt-5 ${body}`}>
            We&apos;ve lived through the missed deadlines, incomplete drawings, unanswered questions, mounting pressure, and
            difficult conversations with owners. We&apos;ve seen talented project managers and superintendents work
            themselves to exhaustion trying to overcome problems that could have been prevented months earlier.
          </p>
          <p className={`mt-5 ${body}`}>
            And we&apos;ve seen what happens when projects are properly planned, teams are prepared, and everyone knows
            what&apos;s expected of them.
          </p>

          {/* The emphasized statement: the hero's closing-statement treatment (§74, §79.2). */}
          <div className="relative mt-9 pl-5 sm:pl-6">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="font-heading text-[1.25rem] font-bold leading-[1.4] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.375rem] lg:text-[1.5rem]">
              We didn&apos;t create JiTpro because we thought construction needed another tool.{' '}
              <span className="font-extrabold">We created it because we know construction can be better.</span>
            </p>
          </div>

          <p className={`mt-9 ${body}`}>
            Our experience shapes how we work. We understand the responsibilities our clients carry because we&apos;ve
            carried them ourselves.
          </p>
          <div className="mt-3">
            <MeetThePeople />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 6: *What we believe* (Design System §80, Decision Log 2026-11-19). MESSAGE: better construction management
 * protects schedules and profits, and also the people who deliver the work: capable, resilient teams that are not
 * consumed by preventable problems. Typography alone carries it: no cards, icons, imagery or diagrams.
 *
 *   lg+   about 5 : 7 as Section 5, the eyebrow and h2 (one sentence per line) at left; the narrative at right
 *   <lg   one column
 *   all   the concluding statement on a full-width --jp-surface band
 *
 * Amber is restrained (§8.8): the eyebrow bar and the first statement's bar on white, the short rule on the band.
 */
export function WhatWeBelieveSection() {
  const body = 'text-[1.0625rem] leading-[1.65] text-pretty text-jp-background/85 lg:text-[1.125rem]';
  return (
    <section id="what-we-believe" aria-labelledby="what-we-believe-heading" className="bg-jp-surface-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:px-10 lg:py-24">
        <div className="@container max-w-[44rem]">
          {/* Authored in sentence case, uppercased in CSS (§7.7); slate on light, the bar amber (§8.8). */}
          <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-jp-ink-secondary sm:text-sm">
            <span aria-hidden="true" className="block h-5 w-1 shrink-0 rounded-full bg-jp-brand-amber" />
            What we believe
          </p>
          {/* One sentence per line at every width (§80.2). The sizes are the placeholder's, capped by the column's
              width (cqw) so no line wraps; the last line is about 18% larger, navy with an amber underline. Amber is
              never the text on this white ground (§8.8: 2.15:1). */}
          <h2
            id="what-we-believe-heading"
            className="mt-5 font-heading text-[min(2rem,8cqw)] font-extrabold leading-[1.1] tracking-[-0.025em] text-jp-background sm:text-[min(2.375rem,8cqw)] lg:text-[min(clamp(2rem,2.8vw,2.625rem),8cqw)]"
          >
            <span className="block">Protect your schedule.</span> <span className="block">Protect your profits.</span>{' '}
            <span className="mt-[0.12em] block text-[min(1.18em,9.45cqw)] underline decoration-jp-brand-amber decoration-[0.07em] underline-offset-[0.2em]">
              Protect your people.
            </span>
          </h2>
        </div>

        <div className="mt-8 max-w-[44rem] lg:mt-12 lg:max-w-[40rem]">
          <p className="text-[1.125rem] leading-[1.6] text-pretty text-jp-background/85 lg:text-[1.25rem]">
            We believe the strength of a construction company is measured by more than the projects it completes or the
            profits it earns. It&apos;s also measured by the people it develops and the conditions under which they work.
          </p>
          <p className={`mt-5 ${body}`}>
            Construction will always be demanding. Plans change. Problems arise. Difficult decisions must be made, often
            under pressure. But there is a difference between a team that is prepared to handle those challenges and one
            that is constantly overwhelmed by them.
          </p>
          <p className={`mt-5 ${body}`}>
            We&apos;ve watched capable project managers, superintendents, and tradespeople become exhausted and discouraged
            by the relentless cycle of preventable emergencies. We&apos;ve seen good people lose their passion for an
            industry they once loved.
          </p>

          {/* The first emphasized statement: Section 5's treatment (§79.2, §80.2). */}
          <div className="relative my-9 pl-5 sm:pl-6">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-jp-brand-amber" />
            <p className="font-heading text-[1.25rem] font-bold leading-[1.4] tracking-[-0.01em] text-pretty text-jp-background sm:text-[1.375rem] lg:text-[1.5rem]">
              We don&apos;t believe that should be accepted as the cost of doing business.
            </p>
          </div>

          <p className={body}>
            When teams have a clear plan, understand their responsibilities, and can see what&apos;s coming, they gain
            something more valuable than a better schedule. They gain the confidence and capacity to lead, make sound
            decisions, solve problems, and perform under pressure without being consumed by it.
          </p>
          <p className={`mt-5 ${body}`}>
            Better planning protects profits. Better preparation protects schedules. And both help protect the people
            responsible for delivering the work.
          </p>
        </div>
      </div>

      {/* The concluding statement: the section's strongest emphasis, on the closing-banner band (§78.2, §80.2). */}
      <div className="bg-jp-surface">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <span aria-hidden="true" className="mx-auto block h-1 w-14 rounded-full bg-jp-brand-amber" />
          <p className="mx-auto mt-7 max-w-[56rem] font-heading text-[1.5rem] font-extrabold leading-[1.25] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[1.875rem] lg:text-[clamp(2rem,2.6vw,2.5rem)]">
            We believe better construction companies are built by developing stronger teams, not by demanding more from
            exhausted ones.
          </p>
        </div>
      </div>
    </section>
  );
}