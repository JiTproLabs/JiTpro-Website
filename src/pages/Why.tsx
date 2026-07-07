import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const commitments = [
  'Owner decisions',
  'Design coordination',
  'Scope clarification',
  'Buyout',
  'Submittals',
  'Approvals',
  'Fabrication',
  'Release',
  'Delivery',
];

const decayChain = [
  'Unmanaged commitment',
  'Constraint',
  'Schedule pressure',
  'Field recovery',
  'Spent margin',
];

const recoveryCosts = [
  'Rework',
  'Resequencing',
  'Overtime',
  'Expediting',
  'Lost productivity',
  'Trade stacking',
  'Multiple mobilizations',
  'Extended general conditions',
];

const whatJiTproDoes = [
  {
    title: 'Defines the sequence',
    body: 'Every critical package gets a path from decision to delivery, worked backward from when the field needs it.',
  },
  {
    title: 'Surfaces unresolved commitments',
    body: 'The decisions, clarifications, and approvals other work is waiting on come out of inboxes and into the open.',
  },
  {
    title: 'Assigns ownership',
    body: 'Every open commitment has a name on it—even when the answer lives upstream.',
  },
  {
    title: 'Aligns procurement to the schedule',
    body: 'Buyout, submittals, fabrication, and delivery are sequenced against the dates the field actually needs.',
  },
  {
    title: 'Exposes risk while it can still be controlled',
    body: 'Margin threats show up while there is still time to act—not after the recovery has started.',
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function Why() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Opening: margin-first */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_38%)]" />
        <div className="relative mx-auto max-w-4xl">
          <SectionLabel>Why JiTpro</SectionLabel>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Every project begins with margin.
          </h1>
          <p className="mt-6 font-heading text-2xl font-semibold leading-snug tracking-tight text-slate-300 md:text-3xl">
            The estimate defines the work, predicts the cost, and sets the margin you expect to
            earn. That margin is fragile.
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            From the day the contract is signed, every unresolved owner decision, incomplete design
            item, missing scope clarification, delayed approval, and long-lead procurement item
            begins putting that margin at risk.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Procurement&mdash;the path from decision to delivery&mdash;is the earliest practical
            opportunity you have to protect it.
          </p>
        </div>
      </section>

      {/* The false assumption */}
      <section className="border-b border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>The false assumption</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                The industry has accepted a dangerous assumption: that chaos is normal.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                RFIs pile up. Owners decide late. Procurement falls behind. Trades wait. Overtime
                gets approved. Work gets resequenced.
              </p>
              <p>And everyone shrugs and calls it construction.</p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                  Those are not normal conditions.
                </p>
                <p className="mt-3 text-slate-300">
                  They are symptoms of a project that lost control months earlier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments and constraints */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Commitments, not tasks</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                A project runs on commitments that must happen before other work can happen.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <div className="flex flex-wrap gap-2">
                {commitments.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-base text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p>
                These are not just tasks on a list. Each one is a commitment other work is waiting
                on. If they are not identified, owned, sequenced, and tracked early, they become
                constraints.
              </p>
              <p className="font-heading text-xl font-semibold leading-snug text-slate-100">
                Constraints become schedule pressure. Schedule pressure becomes field recovery.
                Field recovery spends the margin.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-3 lg:grid-cols-5">
            {decayChain.map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index < 2 ? 'bg-amber-500' : index < 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-100">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The field reveals it */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Where the bill comes due</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              The field rarely creates the problem. The field reveals it.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              When a project starts spending margin, it looks like this:
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recoveryCosts.map((cost) => (
              <div
                key={cost}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-center text-slate-200"
              >
                {cost}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-6 text-center text-lg leading-8 text-slate-300">
            <p>
              None of these costs are the problem. They are the invoice for commitments that
              quietly slipped months earlier&mdash;the decision nobody chased, the release nobody
              sequenced, the approval nobody owned.
            </p>
            <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
              By the time these costs appear, the project did not just become unstable. It became
              unstable earlier. The field is simply where the bill comes due.
            </p>
          </div>
        </div>
      </section>

      {/* What JiTpro is */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>Where JiTpro comes in</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                JiTpro is not just a procurement tracker.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Tracking tells you where things stand. Control means the unresolved commitments on
                your project are visible, owned, and sequenced while there is still time to act on
                them.
              </p>
              <p className="mt-4 font-heading text-xl font-semibold leading-snug text-slate-100">
                JiTpro makes invisible risk visible before it becomes field recovery.
              </p>
            </div>

            <div className="grid gap-4">
              {whatJiTproDoes.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-white/[0.03] p-6">
                  <h3 className="font-heading text-xl font-bold text-slate-100">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto close */}
      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel>The JiTpro philosophy</SectionLabel>
          <div className="space-y-5 font-heading text-2xl font-semibold leading-snug text-slate-200 md:text-3xl">
            <p>Every project begins with margin.</p>
            <p>Every unresolved commitment quietly spends it.</p>
            <p>The field simply reveals what procurement failed to control.</p>
            <p>JiTpro exists to make those risks visible while they can still be managed.</p>
          </div>
          <p className="mx-auto mt-12 max-w-3xl font-heading text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
            Projects do not fail in the field. They arrive there already failing.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Protect your next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              See how JiTpro works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
