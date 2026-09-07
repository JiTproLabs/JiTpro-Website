import DependencyChain from './DependencyChain';

/**
 * Section 02 — the problem. One section, two movements (Decision Log
 * 2026-08-26, five-section architecture):
 *
 *   MOVEMENT A — detection      why a capable team finds these conditions late
 *   MOVEMENT B — the response   what happens to the options while the condition
 *                window         stays unresolved
 *
 * This combines the former ProblemDetectionSection and ResponseWindowSection
 * (both preserved at tag `homepage-eight-section-beat3-2026-08-26`). The
 * doctrine that separated them survives INSIDE the section: two movements, one
 * causal story told once. Movement A owns the mechanism — the custom steel
 * window chain, which stops at exposure. Movement B owns the economics and
 * MUST NOT re-narrate the package or the submittal chain; its subject is what
 * the shrinking option set costs, not how the condition reached the field.
 *
 * HIERARCHY (§7.7, one primary statement per surface): the six-month question
 * is the section's only h2. The centered figure-statement block is now THREE
 * elements rather than the approved pair (statement, cost paragraph, terminal
 * line — Decision Log 2026-09-04). It creates no new register: all three sit
 * in registers this section already used, and the two balanced statements keep
 * their 46ch `text-balance` measure while the running paragraph between them
 * takes a wider one, because centered running copy set to a statement measure
 * reads as a stack of fragments. "The problem gets expensive before it becomes
 * obvious." — movement B's former section heading — steps down to the existing
 * full-width-statement register (1.5/1.75/2 bold), above its secondary heading
 * and body. No new register is created.
 *
 * AMBER (§48.7): the section's accent is the ladder's warming rail, plus the
 * §48.9 ordinals. The detection reframe close ("The field is where you find
 * out…") is deliberately INK — it is the hinge between the movements, not a
 * second accent system.
 *
 * COPY BUDGET (approved plan, 2026-08-26): ~175 narrative words for the whole
 * section. Chain labels, the ladder's tier titles and one-line bodies, and
 * captions are visual labels outside the budget.
 *
 * THE BUDGET WAS RAISED ON 2026-09-04 (Decision Log) by two supplied
 * paragraphs, and the rule it protected is now carried explicitly instead:
 *
 *   Movement A gains the attention paragraph ("The challenge isn't knowing
 *   that information is missing…"), which reframes the section from DETECTION
 *   to PRIORITISATION. That is the movement's argument now: the team knows
 *   things are open; what they cannot see is which one is about to matter.
 *
 *   The centered figure-statement block gains the cost paragraph ("When
 *   critical information gets attention too late…").
 *
 * KNOWN OVERLAP, ACCEPTED DELIBERATELY: the cost paragraph names expediting,
 * resequencing, and crews waiting, which the warming ladder below and movement
 * B's own paragraph already carry. It was supplied as written and approved
 * with the overlap understood. Nothing FURTHER may be added to movement A that
 * re-narrates the ladder or the option-set economics, and movement B's
 * paragraph is the place to cut if the repetition is ever trimmed rather than
 * this one.
 *
 * The tracked example remains custom steel windows, never a long-lead story,
 * and no lead time may be stated anywhere in the section (§20.1).
 *
 * SURFACE: one ground — --jp-background — for both movements. A mid-section
 * surface change would read as two sections and defeat the merge; the act
 * boundary is the change to --jp-surface-light at the Method section.
 */

type Tier = {
  title: string;
  /** One line only (approved 2026-08-26) — a label, not a paragraph. */
  body: string;
  /** Warming hairline — reinforcement only; the copy carries the order (§8.7). */
  rule: string;
  dot: string;
};

const TIERS: Tier[] = [
  {
    title: 'The decision is still open',
    body: 'Nothing looks wrong, and the fix is still your own team’s decision.',
    rule: 'bg-jp-border/12',
    dot: 'bg-jp-border',
  },
  {
    title: 'The answer now has a deadline',
    body: 'The date it is needed by belongs to someone outside your company.',
    rule: 'bg-jp-brand-amber/25',
    dot: 'bg-jp-brand-amber/40',
  },
  {
    title: 'The fix has to be bought',
    body: 'Paid for, negotiated, or forced through someone else’s schedule.',
    rule: 'bg-jp-brand-amber/45',
    dot: 'bg-jp-brand-amber/65',
  },
  {
    title: 'The field absorbs it',
    body: 'Crews wait or work around it, and everything behind it moves.',
    rule: 'bg-jp-brand-amber/70',
    dot: 'bg-jp-brand-amber',
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-jp-background px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 lg:px-10 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        {/* MOVEMENT A — detection. The opening keeps the approved §17.1
            environmental composition: the question and its short answer
            weighted left, the project-team photograph forming the environment
            at the right, reaching beneath the copy. */}
        <div className="lg:relative lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-x-14 lg:overflow-hidden xl:gap-x-16">
          <div className="lg:relative lg:z-10">
            <h2 className="max-w-[26ch] font-heading text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[2.5rem] lg:text-[3rem]">
              What&apos;s the one thing your team isn&apos;t focused on today that will stop work in the field six months from now?
            </h2>

            <div className="mt-6 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:mt-8 lg:text-[1.1875rem]">
              <p>The problem that stops work six months from now often already exists today.</p>
              <p>
                A missing selection. An unresolved detail. An undefined product. A scope gap. A decision no one knows they own.
              </p>
              <p>
                The challenge isn&apos;t knowing that information is missing. It&apos;s knowing{' '}
                <strong className="font-semibold text-jp-text-primary">
                  what needs attention now, what can wait, and when waiting becomes a problem.
                </strong>
              </p>
            </div>
          </div>

          {/* Explicit aspect ratios reserve the layout before the image
              arrives (§17.1); eager loading because this sits at the first
              scroll position below the hero. At lg the photograph keeps its
              native 16:9 composition, fills the movement's height, and
              reaches left beneath the copy. */}
          <div className="mt-10 sm:mt-12 lg:mt-0">
            <div className="lg:absolute lg:inset-y-0 lg:right-0">
              <img
                src={`${import.meta.env.BASE_URL}assets/below_hero-1600.webp`}
                srcSet={`${import.meta.env.BASE_URL}assets/below_hero-800.webp 800w, ${import.meta.env.BASE_URL}assets/below_hero-1600.webp 1600w`}
                sizes="(min-width: 1024px) 65vw, 100vw"
                width={1600}
                height={900}
                alt="Construction project team reviewing drawings and schedule information around a conference table"
                loading="eager"
                decoding="async"
                className="aspect-[2/1] w-full object-cover object-[50%_38%] sm:aspect-[21/9] lg:aspect-video lg:h-full lg:w-auto lg:max-w-none"
              />
              {/* A short ramp over the photograph's own first widths keeps
                  its physical left edge seamless. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-[7%] bg-[linear-gradient(90deg,var(--jp-background)_0%,transparent_100%)] lg:block"
              />
            </div>
          </div>

          {/* The dissolve spans the whole opening movement rather than the
              photograph, so its stops track the text column's share of the
              row at every width. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_oklab,var(--jp-background)_78%,transparent)_0%,color-mix(in_oklab,var(--jp-background)_78%,transparent)_30%,color-mix(in_oklab,var(--jp-background)_62%,transparent)_40%,color-mix(in_oklab,var(--jp-background)_46%,transparent)_50%,color-mix(in_oklab,var(--jp-background)_20%,transparent)_56%,transparent_62%)] lg:block"
          />
        </div>

        {/* The mechanism, on one named package, at full container width. The
            statement is the argument; the figure carries the rest — no setup
            paragraph re-tells what the chain's first link already says
            (approved plan: the visual proves it, the prose moves on).

            It centers on the chain's own axis as the figure's title block
            (§7.7 centered figure statement, Decision Log 2026-08-27) — held on
            the left edge it read as a third paragraph of the copy column
            above. The pair keeps this section's EXISTING registers: the
            statement stays at 1.3125/1.4375 semibold, the supporting line
            takes the secondary body register, so the step between them is
            size, weight and text level only. No divider, no eyebrow, no
            accent — the section's amber is spent on the rail and the
            ordinals (§48.7). */}
        <div className="border-t border-jp-border/12 pt-12 lg:pt-14">
          <div className="text-center">
            <h3 className="mx-auto max-w-[46ch] font-heading text-[1.3125rem] font-semibold leading-snug text-balance text-jp-text-primary sm:text-[1.4375rem]">
              Preventable schedule failures destroy margin.
            </h3>
            {/* The cost of late attention, added 2026-09-04. It sits between
                the statement and the terminal line at the section's existing
                secondary body register, on a wider measure than the two
                balanced statements around it: it is running copy, and holding
                it at 46ch with `text-balance` would set five sentences as a
                stack of short centered lines. */}
            <p className="mx-auto mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem]">
              When critical information gets attention too late, the options disappear. Decisions get rushed. Products get expedited. Work gets resequenced. Crews wait. And problems that could have been resolved months earlier become expensive field problems.
            </p>
            <p className="mx-auto mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-balance text-jp-text-secondary sm:text-[1.125rem]">
              The schedule cannot hold if what the field needs arrives late or wrong.
            </p>
          </div>

          <DependencyChain />

          {/* The hinge between the movements, in ink (§48.7 — the section's
              amber is spent on the warming rail below). Movement A ends on
              where the problem SURFACES; movement B begins with what it does
              to the options. One sentence per line by design. */}
          <p className="mt-14 font-heading text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-jp-text-primary sm:text-[1.4375rem] lg:mt-16">
            <span className="block">The field is where you find out.</span>
            <span className="block">It is not where it started.</span>
          </p>
        </div>

        {/* MOVEMENT B — the response window. The former section heading holds
            the movement's left column at the demoted register; the approved
            secondary heading and paragraph share the canvas at the right. */}
        <div className="mt-16 border-t border-jp-border/12 pt-12 lg:mt-20 lg:pt-14">
          <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
            <h3 className="max-w-[18ch] font-heading text-[1.5rem] font-bold leading-[1.15] tracking-[-0.02em] text-balance text-jp-text-primary sm:text-[1.75rem] lg:text-[2rem]">
              The problem gets expensive before it becomes obvious.
            </h3>
            <div className="mt-6 max-w-[62ch] lg:mt-1">
              <h4 className="font-heading text-[1.25rem] font-semibold leading-snug text-balance text-jp-text-primary sm:text-[1.375rem]">
                The problem does not go away. Your options do.
              </h4>
              <p className="mt-4 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:text-[1.1875rem]">
                The longer an issue stays unresolved, the fewer good choices the team has left. What could have been handled early with a calm decision eventually becomes expediting, substitution, resequencing, escalation, or a problem the field has no choice but to absorb.
              </p>
            </div>
          </div>

          {/* The rail mirrors the ol's grid so each dot lands exactly on its
              column's left edge. The first three segments extend through the
              grid gap, so the four opacity steps join into one line that warms
              left to right across the full container. */}
          <div
            aria-hidden="true"
            className="mt-14 hidden gap-x-8 sm:grid sm:grid-cols-4 lg:mt-16 lg:gap-x-10"
          >
            {TIERS.map((tier, i) => (
              <div
                key={tier.title}
                className={`flex items-center gap-3 ${
                  i < TIERS.length - 1 ? '-mr-[1.25rem] lg:-mr-[1.75rem]' : ''
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tier.dot}`} />
                <span className={`h-px flex-1 ${tier.rule}`} />
              </div>
            ))}
          </div>

          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {TIERS.map((tier, i) => (
              <li key={tier.title}>
                <div className="flex items-center gap-3 sm:hidden" aria-hidden="true">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tier.dot}`} />
                  <span className={`h-px flex-1 ${tier.rule}`} />
                </div>
                <span className="mt-6 block font-mono text-xs tracking-[0.2em] text-jp-brand-amber/80 sm:mt-0">
                  <span className="sr-only">Stage </span>
                  {`0${i + 1}`}
                </span>
                <h4 className="mt-3 max-w-[22ch] font-heading text-[1.1875rem] font-semibold leading-snug text-balance text-jp-text-primary sm:text-[1.25rem]">
                  {tier.title}
                </h4>
                <p className="mt-3 max-w-[40ch] text-[1rem] leading-[1.65] text-jp-text-muted">
                  {tier.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
