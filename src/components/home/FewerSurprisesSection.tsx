import { FileText, Layers, Search, type LucideIcon } from 'lucide-react';

/**
 * Section 2 — fewer surprises (Decision Log 2026-11-05; recomposed
 * 2026-11-13).
 *
 * The ways JiTpro protects profit, as three benefits: seeing problems
 * earlier, managing change, and keeping the record. Still on --jp-background,
 * so it continues the hero's act without a seam (§48.6).
 *
 * COMPOSITION (founder brief 2026-11-13; restyled 2026-11-17 to the
 * founder-approved procurement mockup, issue #84, so it reads as the close of
 * the procurement section directly above it):
 *
 *   RULE      a full-width hairline in --jp-border with a short Brand Amber
 *             segment at the shared left edge, like a dimension line's
 *             start mark
 *   LEFT      (about 40%) the heading, the section's anchor: three sentences
 *             at a display register, the outcome, "Keep more of the profit
 *             you've earned.", in Brand Amber (no figure, no guarantee:
 *             §20.1 as amended)
 *   DIVIDER   a vertical hairline from `lg`
 *   RIGHT     three benefits as one list of editorial rows on fine rules:
 *             a Brand Amber lucide icon, the title in bold primary ink, an
 *             em dash, and the sentence in secondary ink, run in. The order
 *             is the life of a problem: before, during, after.
 *
 * Stacked below `lg`: the heading, then the benefits.
 *
 * AMBER (§48.7, with the 2026-11-17 scoped exception): the rule segment, the
 * heading's last line and the three icons (§48.4: icons sized to their
 * titles, aria-hidden). No cards, fills, shadows or motion (§48.2).
 */

const BENEFITS: ReadonlyArray<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: Search,
    title: 'Know the needs. Control the process',
    body: 'Identify the decisions, approvals, and commitments the field depends on, and when each one is due.',
  },
  { Icon: Layers, title: 'Manage change as it happens', body: 'Understand what changed and how it affects your project.' },
  {
    Icon: FileText,
    title: 'Keep the record',
    body: 'Know what happened, who was responsible, and why, without reconstructing the story six months later.',
  },
];

export default function FewerSurprisesSection() {
  return (
    <section className="bg-jp-background px-6 pt-8 pb-20 sm:px-8 sm:pt-10 sm:pb-24 lg:px-10 lg:pt-12 lg:pb-28">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div aria-hidden="true" className="relative h-px bg-jp-border/20">
          <span className="absolute -top-px left-0 h-[3px] w-20 rounded-full bg-jp-brand-amber sm:w-32" />
        </div>

        <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,2fr)_1px_minmax(0,3fr)] lg:items-center lg:gap-x-12 xl:gap-x-14">
          {/* The anchor. The amber line is longer than the two above it,
              so it is balanced across its own lines rather than left
              ragged. */}
          <h2 className="font-heading text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-jp-text-primary sm:text-[2.75rem] lg:text-[clamp(2.5rem,2.9vw,3.25rem)]">
            <span className="block">Fewer surprises.</span>
            <span className="block">More control.</span>
            <span className="mt-1 block max-w-[16ch] text-balance text-jp-brand-amber sm:mt-1.5">
              Keep more of the profit you&apos;ve earned.
            </span>
          </h2>

          <span aria-hidden="true" className="hidden h-full w-px bg-jp-border/30 lg:block" />

          {/* The benefits: one list, editorial rows on fine rules, the
              title run in to its sentence. */}
          <ul className="mt-10 lg:mt-0">
            {BENEFITS.map(({ Icon, title, body }) => (
              <li
                key={title}
                className="flex items-start gap-4 border-b border-jp-border/20 py-5 first:pt-0 last:border-b-0 last:pb-0 sm:gap-5 sm:py-6 sm:first:pt-0 sm:last:pb-0"
              >
                <Icon aria-hidden="true" strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-jp-brand-amber sm:size-7" />
                <div className="min-w-0 text-[1.0625rem] leading-[1.55] sm:text-[1.125rem] lg:text-[1.1875rem]">
                  <h3 className="inline font-heading font-bold tracking-[-0.01em] text-jp-text-primary">{title}</h3>
                  <span aria-hidden="true" className="text-jp-text-secondary"> — </span>
                  <p className="inline text-jp-text-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
