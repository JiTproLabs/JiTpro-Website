/**
 * Section 1b — procurement is more than buying materials (Decision Log
 * 2026-11-06).
 *
 * What procurement actually involves and why it is hard for a GC to manage,
 * between the core belief and Section 2. Still on --jp-background, so it
 * continues the hero's act; Section 2's own amber-start hairline is the seam
 * beneath it, which is why this section carries no bottom padding of its own
 * (§48.6).
 *
 * COMPOSITION: the homepage's 5fr/7fr two-column grid on the shared left
 * edge (as Sections 3, 4 and 5); stacked below `lg`, heading first.
 *
 *   LEFT      the h2 at the homepage section-heading register, then the
 *             supporting statement beneath it (2026-11-10): the semibold
 *             heading-face statement register, in brand amber
 *   RIGHT     the opening paragraph and the six "must" sentences, each set on
 *             its own line so the sequence scans, at the secondary body
 *             register; then the key insight at the semibold heading-face
 *             statement register in primary ink; then the closing paragraph
 *             back at the body register; then the consequence, "Those delays
 *             spread. Costs grow. Profits shrink.", at the bold heading-face
 *             statement register in primary ink, the column's strongest line
 *             and still a step below the h2
 *
 * The approved copy appears exactly once ("procurement" is a scoped exception
 * to §20.1's retired-language rule). One amber element only: the supporting
 * statement, in --jp-brand-amber, the static brand color (§8.1.1, §48.7;
 * Decision Log 2026-11-10, superseding this section's earlier "no amber").
 * No cards, icons or graphics (§48.2, §48.4).
 *
 * THE STATEMENT'S REVEAL (§46; the homepage's own pattern, as AudienceSection
 * uses: a one-shot IntersectionObserver setting a flag, and CSS transitions).
 * Once it is comfortably in view, it fades in and rises 20px over 700 ms,
 * ease-out, and stays: the observer disconnects, so scrolling back does not
 * replay it. Transform and opacity only, so nothing around it moves. Reduced
 * motion: shown at once, without movement (§46.5).
 */
import { useEffect, useRef, useState } from 'react';

const MUST_SENTENCES = [
  'Drawings must be complete.',
  'Decisions must be made.',
  'Products must be selected.',
  'Subcontractors must be hired.',
  'Submittals must be approved.',
  'Materials must be ordered, built, and delivered.',
];

/** Comfortably in view: at least half of it, above the bottom tenth of the view. */
const REVEAL_AT = { threshold: 0.5, rootMargin: '0px 0px -10% 0px' } as const;

export default function ProcurementSection() {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = statementRef.current;
    if (!el || revealed) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setRevealed(true);
        io.disconnect();
      }
    }, REVEAL_AT);
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <section className="bg-jp-background px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
        <div>
          <h2 className="max-w-[18ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[2.5rem] lg:text-[3rem]">
            Procurement is more than buying materials.
          </h2>

          <p
            ref={statementRef}
            className={`mt-5 max-w-[30ch] font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance text-jp-brand-amber transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none sm:mt-6 sm:text-[1.4375rem] lg:text-[1.5rem] ${
              revealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
            }`}
          >
            It&apos;s a complex sequence of activities, each with real durations and dependencies.
          </p>
        </div>

        <div className="mt-8 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:mt-2 lg:text-[1.1875rem]">
          <p>
            Every product, material, and service your project needs depends on a series of intricate steps that must happen in the right order, at the right time, with realistic durations.
          </p>

          <p className="mt-5">
            {MUST_SENTENCES.map((sentence, i) => (
              <span key={sentence} className="block">
                {sentence}
                {i < MUST_SENTENCES.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>

          <p className="mt-8 font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-balance text-jp-text-primary sm:mt-10 sm:text-[1.4375rem] lg:text-[1.5rem]">
            And much of that work depends on people outside your company.
          </p>

          <p className="mt-5 sm:mt-6">
            That&apos;s why procurement is so difficult to get right. One missed decision or late approval can delay deliveries, disrupt crews, and push work further down the schedule.
          </p>

          <p className="mt-6 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance text-jp-text-primary sm:mt-8 sm:text-[1.75rem] lg:text-[2rem]">
            Those delays spread. Costs grow. Profits shrink.
          </p>
        </div>
      </div>
    </section>
  );
}
