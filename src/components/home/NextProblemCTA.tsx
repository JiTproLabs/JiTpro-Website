import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Section 6 — the final CTA (Decision Log 2026-11-05).
 *
 * The composition of the previous final CTA (HomeFinalCTA.tsx, kept in place):
 * centered from `sm:` up, left-aligned and stacked below it (§7.7 centered CTA
 * supporting copy, §48.6), on --jp-background with the same restrained amber
 * glow at the bottom edge.
 *
 * The action carries the same label and destination as the hero's primary,
 * so the page asks for one thing. The surface's amber is the glow and the
 * button.
 *
 * Copy (2026-11-13): the proactive, one-project engagement — start with one
 * project, alongside the GC's own team, without changing how the company
 * operates. The headline is the one dominant element; the two supporting
 * paragraphs share a single quiet body style.
 *
 * No top hairline of its own: it follows the light act directly (Section 5
 * left the homepage on 2026-11-13), and the change from --jp-surface-light to
 * --jp-background marks the boundary.
 */
export default function NextProblemCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-jp-background px-6 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_58%_at_50%_100%,color-mix(in_oklab,var(--jp-brand-amber)_12%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-[46ch] sm:max-w-none sm:text-center">
          <h2 className="font-heading text-[2.125rem] font-extrabold leading-[1.08] tracking-[-0.022em] text-balance text-jp-text-primary sm:mx-auto sm:max-w-[24ch] sm:text-[2.875rem] lg:text-[3.5rem]">
            A better way to deliver your next project.
          </h2>

          <p className="mt-7 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-pretty text-jp-text-secondary sm:mx-auto sm:max-w-[48ch] sm:text-[1.125rem] lg:text-[1.1875rem]">
            You don&apos;t need to change how your entire company operates to improve project results.
          </p>

          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-pretty text-jp-text-secondary sm:mx-auto sm:max-w-[48ch] sm:text-[1.125rem] lg:text-[1.1875rem]">
            Start with one project. We&apos;ll work alongside your team to bring greater clarity, control, and confidence to procurement planning.
          </p>

          <div className="mt-10 sm:mt-12">
            <Link
              to="/contact"
              className="inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl bg-jp-brand-amber px-4 py-4 text-center text-[0.9375rem] font-semibold text-jp-background shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--jp-brand-amber)_60%,transparent)] transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none sm:w-auto sm:px-7 sm:text-base"
            >
              <span className="[text-wrap:balance]">Let&apos;s talk about your project</span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
