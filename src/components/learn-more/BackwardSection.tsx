import { BACKWARD_CHAIN, JIT_DISTINCTIONS, SECTION } from '../../content/learnMore';
import { NumberedSection, SectionHeader } from './LearnMoreShell';
import { TONE } from './tone';

const surface = 'light' as const;

/**
 * 04 - The JIT in JiTpro.
 *
 * ADDED 2026-09-04, in the bucket that used to hold "Control starts earlier",
 * and moved behind the method section it used to precede. The page now
 * explains where the name and the operating philosophy came from, which it
 * never did.
 *
 * THE SECTION EXISTS TO KILL ONE MISREADING. In construction, "just in time"
 * is widely heard as "at the last minute", and a reader who leaves this page
 * with that reading has been actively misinformed about what JiTpro does. The
 * left column's statement is the correction and is the most important sentence
 * on this surface. The second misreading is handled too, in the middle
 * distinction: JiTpro does not ask that every decision be made on day one.
 *
 * IT IS PHILOSOPHY, NOT POSITIONING (Section 20.1, retired language). The
 * just-in-time origin is explained in manufacturing terms and then translated
 * to construction. JiTpro is NEVER named as a just-in-time service or defined
 * by the buying of things, here or anywhere on this page, and the retired word
 * does not appear. The Toyota reference is one clause: this is a construction
 * page, not a manufacturing history.
 *
 * On this ground hierarchy is ink and amber carries no information
 * (Section 8.8), so the figure below is drawn entirely in the light ramp.
 *
 * THE BACKWARD DEPENDENCY SEQUENCE (Section 50.6) reads backward by
 * construction. The field need date is the first entry, and every entry after
 * it is earlier than the one above. A figure that ran forward and called
 * itself backward would be a defect, so the reading direction is stated in the
 * caption rather than left to the reader to infer.
 *
 * PROVENANCE (Section 48.10): methodological. The figure carries no dates, no
 * durations and no counts, so it makes no claim a reader could mistake for
 * evidence and needs no provenance line. Nothing may be added to it that
 * carries one.
 *
 * NO MOTION. The figure is legible at rest and there is nothing here for an
 * animation to explain that the order of the list does not already say
 * (Sections 46.1, 46.2, 47.4).
 */
export default function BackwardSection() {
  const tone = TONE[surface];
  const section = SECTION['04'];

  return (
    <NumberedSection section={section} surface={surface}>
      <SectionHeader
        section={section}
        surface={surface}
        heading="The JIT in JiTpro means just in time."
        lede={
          <>
            <p>
              The name comes from just-in-time thinking, the discipline associated with the Toyota Production System: organize the work so that what is needed becomes available when it is needed, instead of carrying the cost of things sitting around waiting, or the cost of people waiting on things.
            </p>
            <p>
              Construction is not a factory, and we are not going to pretend it is. But the underlying principle translates cleanly. The work upstream has to happen early enough, and reliably enough, for the downstream need to be met at the right time.
            </p>
          </>
        }
      />

      <div className="mt-14 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
        <div>
          <h3
            className={`max-w-[24ch] font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance sm:text-[1.75rem] lg:text-[2rem] ${tone.heading}`}
          >
            Just in time does not mean starting late. It means knowing early enough to act at the right time.
          </h3>
          <p className={`mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] ${tone.body}`}>
            Nothing arrives just in time because somebody placed an order at a clever moment. There is a chain behind that outcome, and every step in it had to happen early enough for the step in front of it to be possible.
          </p>
          <p className={`mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] ${tone.body}`}>
            So JiTpro starts at the other end. When does the field need it? Then everything that has to be true before that date gets established, dated, and assigned.
          </p>
        </div>

        <figure className="mt-12 lg:mt-0">
          <figcaption
            className={`font-mono text-[0.6875rem] uppercase tracking-[0.2em] ${tone.muted}`}
          >
            One dependency chain, read down. Each step has to happen earlier than the one above it.
          </figcaption>

          {/* The spine is one constant weight for its whole length. It is
              structure, not progress: nothing fills, and no step is the
              "current" one. */}
          <ol className="mt-6">
            {BACKWARD_CHAIN.map((link, i) => {
              const isLast = i === BACKWARD_CHAIN.length - 1;

              return (
                <li key={link.label} className="relative pl-8 pb-7 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[4px] top-[0.85rem] w-px bg-jp-ink-secondary/30"
                    />
                  )}
                  {/* The first node is filled: it is the anchor the rest of
                      the chain is measured from, and that difference is
                      weight, not hue. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[4px] top-[0.55rem] h-[9px] w-[9px] -translate-x-1/2 rounded-full ${
                      i === 0 ? 'bg-jp-background' : 'border border-jp-ink-secondary/55 bg-jp-surface-light'
                    }`}
                  />

                  <p
                    className={`text-[1.0625rem] font-semibold leading-snug sm:text-[1.125rem] ${tone.heading}`}
                  >
                    {link.label}
                  </p>
                  <p className={`mt-1.5 max-w-[52ch] text-[0.9375rem] leading-[1.6] sm:text-[1rem] ${tone.muted}`}>
                    {link.note}
                  </p>
                </li>
              );
            })}
          </ol>
        </figure>
      </div>

      {/* The three positions on the timeline. This takes the item-grid
          treatment sections 00, 07 and 08 already use (hairline above, label,
          one short body), so nothing new is introduced here (Section 49.1).
          The middle entry is the one most easily dropped and the one most
          worth keeping: without it the section reads as an argument that
          everything should simply happen sooner, which is the opposite of what
          just in time means. */}
      <dl className={`mt-16 grid gap-x-10 gap-y-10 border-t pt-12 sm:grid-cols-3 lg:mt-20 lg:gap-x-14 ${tone.rule}`}>
        {JIT_DISTINCTIONS.map((item) => (
          <div key={item.label}>
            <dt
              className={`font-heading text-[1.125rem] font-semibold leading-snug sm:text-[1.1875rem] ${tone.heading}`}
            >
              {item.label}
            </dt>
            <dd className={`mt-3 max-w-[44ch] text-[1rem] leading-[1.65] sm:text-[1.0625rem] ${tone.muted}`}>
              {item.body}
            </dd>
          </div>
        ))}
      </dl>

      <p
        className={`mt-16 max-w-[52ch] border-t pt-12 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-balance sm:text-[1.75rem] lg:mt-20 lg:text-[2rem] ${tone.rule} ${tone.heading}`}
      >
        Not everything has to happen earlier. Everything has to happen when it needs to happen, and that means the chain behind it has to be understood early.
      </p>
    </NumberedSection>
  );
}
