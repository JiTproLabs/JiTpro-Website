import { ArrowDown, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const unresolvedItems = [
  'Owner decisions',
  'Design clarifications',
  'Engineering coordination',
  'Product selections',
  'Shop drawing reviews',
  'Long-lead procurement releases',
  'Agency approvals',
];

const migrationPath = [
  'Owner',
  'Architect',
  'Engineer',
  'General Contractor',
  'Procurement',
  'Fabrication',
  'Field',
];

const recordFacts = [
  'What information was missing',
  'Who owned the next decision',
  'When it was requested',
  'When it was delivered',
  'How long it remained unresolved',
  'What downstream commitments depended on it',
];

const cannotDo = [
  'It cannot prevent every owner delay.',
  'It cannot force an architect to answer faster.',
  'It cannot manufacture structural steel earlier.',
];

const preserves = ['Responsibility', 'Commitments', 'Communication', 'Timing', 'Downstream impacts'];

const flowSteps = [
  'Unresolved commitment',
  'Documented responsibility',
  'Continuous visibility',
  'Defensible position',
  'Protected margin',
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function Documentation() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_38%)]" />
        <div className="relative mx-auto max-w-4xl">
          <SectionLabel>Documentation &amp; Risk</SectionLabel>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Documentation is not record keeping.
          </h1>
          <p className="mt-6 font-heading text-2xl font-semibold leading-snug tracking-tight text-slate-300 md:text-3xl">
            It is how you hold your position while responsibility quietly migrates toward you.
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Margin is usually lost long before work reaches the field. The field is simply where the
            consequences become visible. Documentation&mdash;captured while events are still
            developing&mdash;is what protects you in the gap between the two.
          </p>
        </div>
      </section>

      {/* You have lived this */}
      <section className="border-b border-white/10 bg-slate-900 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>You have lived this</SectionLabel>
          <div className="space-y-4 text-lg leading-8 text-slate-300">
            <p>
              You&apos;ve watched a delay surface in the field months after the decision that caused
              it went missing.
            </p>
            <p>You&apos;ve watched everyone forget where the problem actually started.</p>
            <p>You&apos;ve watched responsibility quietly migrate toward you.</p>
            <p>You&apos;ve been expected to recover problems you didn&apos;t create.</p>
          </div>
          <p className="mt-8 font-heading text-2xl font-semibold leading-snug text-slate-100">
            JiTpro protects against exactly that.
          </p>
        </div>
      </section>

      {/* Where it starts */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Where it starts</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Every project carries unresolved information.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                On every project, some of the information the work depends on does not exist yet:
              </p>
              <div className="flex flex-wrap gap-2">
                {unresolvedItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-base text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p>
                None of these are inherently your responsibility. But when they are not actively
                documented, assigned, tracked, and communicated, responsibility begins migrating
                toward you&mdash;quietly, and without anyone deciding it should.
              </p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                  By the time procurement slips, fabrication misses its production slot, or delivery
                  arrives late&mdash;everyone remembers the delay.
                </p>
                <p className="mt-3 text-slate-300">
                  Very few people remember who actually owned the decision that caused it. JiTpro
                  exists to preserve that truth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Silent risk transfer */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Silent risk transfer</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Responsibility rarely transfers through a contract. It transfers through time.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Every day an unresolved commitment sits undocumented, unmanaged, or uncommunicated,
              expectations shift a little further. No meeting decides it. Nothing records it. But by
              the time the consequence arrives, everyone in the room assumes you own the outcome.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-2xl border border-white/10 bg-slate-950/60 p-6 md:p-8">
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              How an unanswered question travels
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {migrationPath.map((stop, index) => (
                <div key={stop} className="flex items-center gap-2">
                  <span
                    className={`rounded-lg border px-4 py-2 font-heading text-base font-semibold ${
                      stop === 'General Contractor'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-white/10 bg-slate-900/70 text-slate-200'
                    }`}
                  >
                    {stop}
                  </span>
                  {index < migrationPath.length - 1 && (
                    <ArrowRight size={16} className="shrink-0 text-slate-600" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-slate-400">
              The question starts upstream. Left undocumented, ownership of the consequence settles
              on you long before the impact ever reaches the field.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="font-heading text-xl font-semibold leading-snug text-slate-100">
              JiTpro interrupts that migration&mdash;documenting responsibility continuously while
              events are unfolding, instead of reconstructing them months later.
            </p>
          </div>
        </div>
      </section>

      {/* What the record shows */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>What the record shows</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Documentation is not about proving someone made a mistake.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              It is about preserving six facts while they are still fresh:
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recordFacts.map((fact) => (
              <div key={fact} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
                <CheckCircle2 className="mb-4 text-amber-400" size={22} />
                <p className="text-lg leading-7 text-slate-200">{fact}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
                <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Without the record
                </p>
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-300">
                  &ldquo;You should have managed this.&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-center text-slate-600">
                <ArrowRight size={24} className="hidden md:block" />
                <ArrowDown size={24} className="md:hidden" />
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
                <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
                  With the record
                </p>
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                  &ldquo;This could not proceed because this prerequisite remained
                  unresolved.&rdquo;
                </p>
              </div>
            </div>
            <p className="mt-8 text-center font-heading text-xl font-semibold text-slate-100">
              That is a completely different discussion.
            </p>
          </div>
        </div>
      </section>

      {/* Before the delay */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>Before the delay, not after</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Good documentation changes behavior before problems occur.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                When everyone on the project can clearly see who owns the next action, when it is
                due, and what downstream work depends on it, people respond sooner. Architects
                answer before an item goes critical. Owners make selections while there is still
                runway. Vendors raise problems while options still exist.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-400">
                Many delays simply never happen. The record is not a filing cabinet&mdash;it is one
                of the most effective management tools on the project.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Critical package
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold text-slate-100">
                    Structural steel &mdash; connection design clarification
                  </p>
                </div>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide text-amber-300">
                  Unresolved
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Decision requested
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">Mar 4</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Decision received
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">&mdash;</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Responsible party
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">Structural engineer</p>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
                    Days outstanding
                  </p>
                  <p className="mt-1 text-lg font-semibold text-amber-300">23</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 sm:col-span-2">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Downstream impacts
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">
                    Fabrication release &middot; Production slot &middot; Erection start
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-400">
                Everyone sees the same fact at the same time: this package cannot move until this
                answer arrives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Defensible Position */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionLabel>The outcome</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                A Defensible Position
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                JiTpro is honest about what it cannot do.
              </p>
              <div className="mt-6 grid gap-3">
                {cannotDo.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-4 font-heading text-lg font-semibold leading-snug text-slate-100"
                  >
                    {line}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                What it can do is preserve an indisputable record of:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {preserves.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-base font-medium text-amber-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-8 font-heading text-xl font-semibold leading-snug text-slate-100">
                So when a delay becomes a schedule discussion, a change order discussion, or a
                financial discussion, you are not relying on memory. You are relying on documented
                facts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                How the record protects margin
              </p>
              <div className="flex flex-col items-stretch gap-2">
                {flowSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-xl border p-4 text-center font-heading text-lg font-semibold ${
                        index === flowSteps.length - 1
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                          : 'border-white/10 bg-slate-900/70 text-slate-100'
                      }`}
                    >
                      {step}
                    </div>
                    {index < flowSteps.length - 1 && (
                      <ArrowDown size={18} className="text-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <ShieldCheck size={28} />
          </div>
          <SectionLabel>While it is still developing</SectionLabel>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Stop reconstructing what happened. Start documenting while it is happening.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Put your next project&apos;s critical packages on one board&mdash;what is unresolved,
            who owns the answer, and what depends on it&mdash;so the record builds itself while the
            project moves.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Protect your next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/6 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              See how JiTpro works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
