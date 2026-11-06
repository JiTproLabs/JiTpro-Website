/**
 * Section 5 — protect your profit (Decision Log 2026-11-05).
 *
 * The elevated band (--jp-surface with border-y hairlines, §48.6) that opens
 * the closing act. Profit is named as the business outcome JiTpro helps
 * protect, under the Section 20.1 amendment of 2026-11-05: no figures, no
 * guarantees. No amber on this band.
 *
 * Beneath the heading, one question separates the profit the contractor bid
 * from the profit they keep (added 2026-11-05). The 12% is an illustration of
 * the reader's own bid, permitted by the §20.1 illustrative-figures rule.
 */
export default function ProtectProfitSection() {
  return (
    <section className="border-y border-jp-border/12 bg-jp-surface px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
        <div>
          <h2 className="max-w-[18ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[2.5rem] lg:text-[3rem]">
            Protect your profit. Protect your reputation.
          </h2>

          {/* Estimated profit against retained profit. The 12% is the
              reader's own bid as an illustration (§20.1, illustrative
              figures, 2026-11-05) and the question stays open. */}
          <p className="mt-8 max-w-[24ch] font-heading text-[1.375rem] font-bold leading-[1.25] tracking-[-0.015em] text-balance text-jp-text-primary sm:mt-10 sm:text-[1.625rem] lg:text-[1.75rem]">
            You bid the job at 12% profit. How much of that do you actually keep?
          </p>
        </div>

        <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:mt-2 lg:text-[1.1875rem]">
          <p>Every avoidable delay can cost you money.</p>
          <p>Every unexpected problem can hurt your client&apos;s trust.</p>
          <p>
            JiTpro helps you prevent the problems you can, and clearly explain the ones you can&apos;t.
          </p>
          <p className="font-semibold text-jp-text-primary">Fewer delays. Fewer surprises. Clear answers.</p>
          <p>That&apos;s what better planning looks like.</p>
        </div>
      </div>
    </section>
  );
}
