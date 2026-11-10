import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * The *How we do it* band (Design System Section 54.1; Decision Log
 * 2026-11-09, restoring the intro panel of 2026-11-06 / heading 2026-11-07).
 *
 * This was the unnumbered intro panel that opened the *Know what's coming*
 * step stack. When that section left the homepage on 2026-11-09, the band
 * went with it unintentionally; it is restored here, directly before the
 * audience section, from the archived implementation at commit `2ea5926`
 * (tag `homepage-four-step-stack-2026-11-09`). The original stays, untouched,
 * inside KnowWhatsComingSection.tsx.
 *
 * COPY, LAYOUT, TYPE, COLOR AND SPACING ARE THE ARCHIVED PANEL'S, class for
 * class. Two deliberate differences, neither visible:
 *   - No `jp-step-stack` and no offset ref. The §46.11 sticky mechanism only
 *     means something inside a stack; outside one it would pin this band to
 *     the top of the view while the rest of the homepage scrolled over it.
 *   - The heading is now this section's h2 (it was an h3 under the old
 *     section's h2). Its register is unchanged.
 *
 *   LEFT   eyebrow (amber, §48.7) and the heading at the homepage
 *          section-heading register
 *   RIGHT  the two paragraphs at the secondary body register, the closing
 *          statement at the semibold statement register, then the closing
 *          text link (§54.1, added 2026-11-09): Brand Amber, below the
 *          statement's register, the arrow nudging right on hover only.
 *
 * On the elevated dark band tone (--jp-surface, §48.6 hairline). From lg the
 * 5fr/7fr grid the homepage already uses, columns vertically centred in a
 * band at least one view tall; stacked below lg. "Procurement" is the intro
 * panel's scoped exception, carried over (§20.1).
 */
export default function HowWeDoItSection() {
  return (
    <section className="flex flex-col justify-center border-t border-jp-border/12 bg-jp-surface px-6 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100svh_-_5rem_-_1px)] lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-14 xl:gap-x-20">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-jp-brand-amber sm:text-sm sm:tracking-[0.18em]">
            How we do it
          </p>
          <h2 className="mt-5 max-w-[18ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:mt-6 sm:text-[2.5rem] lg:text-[3rem]">
            The level of procurement planning every project needs, but few receive.
          </h2>
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
          {/* One link, text and arrow together. The last word and the arrow are
              kept on one line; the rest wraps as ordinary text. The 12px
              padding is part of the gap above and makes the 44px target. */}
          <p className="mt-3 sm:mt-5">
            <Link
              to="/product"
              className="group inline-block rounded py-3 font-heading text-base font-semibold leading-[1.4] text-jp-brand-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jp-text-primary sm:text-[1.0625rem]"
            >
              One project at a time. Your team. Our{' '}
              <span className="whitespace-nowrap">
                expertise.
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="ml-2 inline-block align-[-0.2em] transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
