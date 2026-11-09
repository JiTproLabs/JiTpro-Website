/**
 * Section 3 — know what's coming (Decision Log 2026-11-05).
 *
 * Opens the light act, which carries sections 3 and 4: what JiTpro does at
 * the start, and what it does every week after. This is
 * the plain-English summary of the method that the Section 20.1 amendment of
 * 2026-11-05 approves for the homepage; the operational detail lives on
 * /learn-more.
 *
 * THREE ZONES (Decision Log 2026-11-05, --jp-surface-white): the challenge on
 * --jp-surface-light, the process on --jp-surface-white, the result on
 * --jp-surface. From lg up, zone 1 takes Section 4's 5fr/7fr grid; zone 2's
 * steps are full-width panels.
 *
 * THE CAPACITY MESSAGE (added 2026-11-05 after review) opens the section:
 * contractors know early planning matters, but the start of a job crowds it
 * out, and JiTpro gives their team dedicated planning support from the
 * start. Support, never replacement: the GC's team keeps running the job. It replaces the former opening line
 * ("We don't wait until your project is in trouble."), which said the same
 * thing less specifically.
 *
 * THE FOUR STEPS are a §46.11 sticky step stack (Decision Log 2026-11-06,
 * superseding the §46.10 disclosure list here): one opaque full-width panel
 * per step, every description visible. From lg, on a view tall enough, with
 * motion allowed, each panel is position:sticky, so as the reader scrolls the
 * next step rises from below and covers the last, and scrolling up uncovers
 * it again. Nothing is animated, snapped or intercepted; the movement is the
 * reader's own scroll. After Step 04 the stack scrolls away normally.
 * Otherwise the panels are ordinary content. Ordinals follow §48.9 on the
 * light surface, with a restrained "01 / 04" count. Hierarchy on this surface
 * is ink; amber carries nothing here.
 *
 * THE INTRO PANEL opens the stack without a number, on the dark band tone:
 * what makes the plan valuable ("How we do it"), which Step 01 then rises
 * over and covers.
 *
 * Steps 03 and 04 are distinct activities: 03 builds the procurement chain,
 * 04 links what keeps that chain moving. The approved copy carries the
 * distinction, so every row shares one treatment.
 */

import { useEffect, useRef } from 'react';
import BuildTheChainComparison from './BuildTheChainComparison';
import HomeProductRegisterFigure from '../demo/screens/home-register/HomeProductRegisterFigure';
import HomeRoSDFigure from '../demo/screens/home-schedule/HomeRoSDFigure';

const STEPS = [
  {
    title: 'What does the project need?',
    description:
      'Identify every product, material, and service required to complete the work.',
  },
  {
    title: 'When does it need to arrive on-site?',
    description:
      'Establish when each item must be available to support the construction schedule.',
  },
  {
    title: 'Build the chain.',
    description:
      'Identify and sequence every step required to get each item to the field, using realistic durations and working backward from its required on-site date.',
  },
  {
    title: 'Link everything required to support the chain.',
    description:
      'Connect the decisions, information, approvals, and commitments each step depends on. Identify who’s responsible and when action is required.',
  },
];

/**
 * Each panel's sticky offset (§46.11). A panel that fits below the sticky
 * navigation sticks there; a taller one (Step 03 with its comparison) gets a
 * negative offset so it scrolls fully into view first and sticks only once its
 * bottom reaches the bottom of the window. Nothing is ever covered before it
 * has been seen. Re-measured on resize, zoom and content change. The CSS
 * decides whether sticking applies at all, so this only supplies the number.
 */
function useStackOffsets() {
  const panels = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const navH = rem * 5 + 1; // the navigation's h-20 bar and its 1px border
      for (const el of panels.current) {
        if (!el) continue;
        const top = Math.min(navH, window.innerHeight - el.offsetHeight);
        el.style.setProperty('--jp-stack-top', `${top}px`);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    panels.current.forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return panels;
}

export default function KnowWhatsComingSection() {
  const panels = useStackOffsets();

  return (
    <section>
      {/* Zone 1 — the challenge. */}
      <div className="bg-jp-surface-light px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20 lg:px-10 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
          <h2 className="max-w-[24ch] font-heading text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-jp-background sm:text-[2.5rem] lg:text-[3rem]">
            Know what&apos;s coming. From day one.
          </h2>

          {/* Why the early planning gets skipped: the reader already knows it
              matters, and the start of a job leaves no time for it. Capacity,
              never competence (§20.1 audience rule). */}
          <div className="mt-8 max-w-[62ch] lg:mt-2">
            <h3 className="font-heading text-[1.25rem] font-semibold leading-snug text-balance text-jp-background sm:text-[1.375rem]">
              Every contractor knows planning ahead matters.
            </h3>
            <div className="mt-4 space-y-5 text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:text-[1.125rem]">
              <p>
                But when a new project starts, your team gets buried in the same problems as the last job, and detailed planning gets pushed aside. Before long, you&apos;re putting out the same fires you promised yourself you&apos;d avoid next time.
              </p>
              <p className="font-semibold text-jp-background">
                JiTpro gives your team dedicated planning support from the start, so you can stay ahead of problems instead of chasing them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2 — the process: one §46.11 stack. The intro panel and the
          step list share this wrapper, so the intro keeps sticking while
          Step 01 rises over it, exactly as each step covers the one before. */}
      <div>
        {/* THE INTRO PANEL (Decision Log 2026-11-06, revised). Opens the
            stack, but is not a step: no ordinal, no count, not in the list.
            It sells the plan; the four steps then show how it is made.
            On the elevated dark band tone (--jp-surface, §48.6 hairline), so
            Step 01 (white) visibly rises over it.

              LEFT   eyebrow (the panel's only amber, §48.7) and the heading at
                     the homepage section-heading register
              RIGHT  the two paragraphs at the secondary body register, then
                     the closing statement at the semibold statement register:
                     emphasized, a clear step below the heading

            From lg the 5fr/7fr grid the homepage already uses, columns
            vertically centred in the panel; stacked below lg. */}
        <div
          ref={(el) => {
            panels.current[0] = el;
          }}
          className="jp-step-stack flex flex-col justify-center border-t border-jp-border/12 bg-jp-surface px-6 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100svh_-_5rem_-_1px)] lg:px-10 lg:py-20"
        >
          <div className="mx-auto w-full max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-14 xl:gap-x-20">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
                How we do it
              </p>
              <h3 className="mt-5 max-w-[18ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:mt-6 sm:text-[2.5rem] lg:text-[3rem]">
                The level of procurement planning every project needs, but few receive.
              </h3>
            </div>

            <div className="mt-8 max-w-[58ch] lg:mt-0">
              <div className="space-y-5 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:text-[1.1875rem]">
                <p>
                  We examine your schedule, drawings, specifications, and project information to identify everything the field will need.
                </p>
                <p>
                  Then we build a detailed, step-by-step procurement plan that shows what needs to happen, in what order, who&apos;s responsible, and when each step must be completed.
                </p>
              </div>
              <p className="mt-8 font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance text-jp-text-primary sm:mt-10 sm:text-[1.4375rem] lg:text-[1.5rem]">
                Every product. Every required step. Every critical commitment.
              </p>
            </div>
          </div>
        </div>

        {/* §46.11: one opaque full-width panel per step, each at least one
            view tall from lg, stacked by position:sticky so the next step
            rises over the last. Step 03 grows past one view to hold its
            comparison and is fully seen before Step 04 covers it. Surfaces
            alternate white / light / white / light (Decision Log 2026-11-06)
            so each rising panel reads against the one it covers; Step 03's
            comparison stays on white. */}
        <ol>
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                panels.current[i + 1] = el;
              }}
              className={`jp-step-stack jp-step-cover flex ${i % 2 === 0 ? 'bg-jp-surface-white' : 'bg-jp-surface-light'} flex-col justify-center border-t border-jp-ink-secondary/20 px-6 py-14 sm:px-8 sm:py-16 lg:min-h-[calc(100svh_-_5rem_-_1px)] lg:px-10 lg:py-20`}
            >
              <div className="mx-auto w-full max-w-7xl">
                <p className="font-mono text-xs tracking-[0.2em] text-jp-ink-secondary/85">
                  <span className="sr-only">Step </span>
                  {`0${i + 1}`}
                  <span aria-hidden="true"> / 0{STEPS.length}</span>
                  <span className="sr-only"> of {STEPS.length}</span>
                </p>
                <h3 className="mt-5 max-w-[24ch] font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance text-jp-background sm:mt-6 sm:text-[2.125rem] lg:text-[2.5rem]">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-ink-secondary sm:mt-6 sm:text-[1.125rem] lg:text-[1.1875rem]">
                  {step.description}
                </p>
                {/* Step 01 carries the curated Product Register (Design
                    System Section 52), introducing the item every later
                    step follows. */}
                {i === 0 && (
                  <div className="mt-10 lg:mt-12">
                    <HomeProductRegisterFigure />
                  </div>
                )}
                {/* Step 02 shows the schedule establishing Required
                    On-Site Dates and carries them into the register
                    (Design System Section 53.1). */}
                {i === 1 && (
                  <div className="mt-10 lg:mt-12">
                    <HomeRoSDFigure />
                  </div>
                )}
                {/* Step 03 carries the JiTpro procurement schedule (Decision
                    Log 2026-11-06; its typical-schedule comparison removed
                    2026-11-08). */}
                {i === 2 && (
                  <div className="mt-10 lg:mt-12">
                    <BuildTheChainComparison />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Zone 3 — the result. A dark close on --jp-surface; one sentence per
          line, with the section's single amber on the first (§48.7). */}
      <div className="bg-jp-surface px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem]">
            We turn those answers into a clear plan your team can follow.
          </p>

          <p className="mt-6 font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-jp-text-primary sm:mt-8 sm:text-[2.125rem] lg:text-[2.5rem]">
            <span className="block text-jp-brand-amber">You know what&apos;s coming.</span>{' '}
            <span className="block text-balance">Your team knows what to do and when to do it.</span>{' '}
            <span className="block text-balance">Your client knows what to expect.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
