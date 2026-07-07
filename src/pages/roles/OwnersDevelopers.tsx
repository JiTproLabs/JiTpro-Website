import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const lostControl = [
  {
    title: 'Missing information compounds',
    body: 'One late decision delays a submittal. The submittal delays a release. The release misses a fabrication slot. The problem grows at every handoff.',
  },
  {
    title: 'Recovery becomes expensive',
    body: 'Expediting, resequencing, overtime, redesign, management time, schedule compression. The inexpensive version of the fix expired months earlier.',
  },
  {
    title: 'GC margins erode',
    body: 'Your contractor absorbs recovery costs first. A contractor losing money on your project is not protection—it is pressure.',
  },
  {
    title: 'Change orders increase',
    body: 'Eventually those costs reach you. They arrive late, stacked together, with little room left to consider alternatives.',
  },
  {
    title: 'Responsibility becomes difficult to prove',
    body: 'Months later, no one can clearly show who owned the decision that started the slide. Disputes fill the gap where documentation should be.',
  },
  {
    title: 'Relationships suffer',
    body: 'Owner and contractor end up negotiating blame instead of building the project.',
  },
];

const withJiTpro = [
  {
    title: 'Early visibility',
    body: 'Every unresolved item is identified at the start of the project—named, dated, and visible to everyone who needs to act on it.',
  },
  {
    title: 'Assigned responsibility',
    body: 'Every open commitment has an owner and a deadline. Nothing waits in an inbox or in someone’s memory.',
  },
  {
    title: 'Procurement stays on schedule',
    body: 'Decisions, submittals, releases, and deliveries are sequenced against the dates the field actually needs.',
  },
  {
    title: 'Constraints resolved early',
    body: 'Problems surface while they are still inexpensive—while options exist and no one is paying for recovery.',
  },
  {
    title: 'Margins protected',
    body: 'Your contractor is not burning money on preventable recovery—which means they are not under pressure to recover it elsewhere.',
  },
  {
    title: 'Only legitimate change orders reach you',
    body: 'When conditions genuinely change, the record shows it clearly. When they have not, the change order never gets written.',
  },
  {
    title: 'Better collaboration',
    body: 'You, the design team, and the contractor work from the same visible facts instead of competing recollections.',
  },
];

const ownerBenefits = [
  'Fewer surprise change orders',
  'Better budget protection',
  'Greater confidence in your general contractor',
  'Transparent accountability',
  'Better communication',
  'Fewer disputes',
  'Better project outcomes',
];

const howItWorks = [
  'Every issue is assigned',
  'Every commitment has an owner',
  'Every deadline is visible',
  'Every action is documented',
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function OwnersDevelopers() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_38%)]" />
        <div className="relative mx-auto max-w-4xl">
          <SectionLabel>For owners &amp; developers</SectionLabel>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            The most expensive project problems start months before you see them.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            By the time a delay or a change order reaches your desk, its cause is usually months
            old&mdash;an unresolved decision, an incomplete detail, an unanswered question that
            quietly compounded through procurement.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            JiTpro is the system that lets your general contractor control those risks
            early&mdash;while they are still small, still visible, and still inexpensive to solve.
            This page explains why owners are beginning to require it.
          </p>
        </div>
      </section>

      {/* Inherits more than the contract */}
      <section className="border-b border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Where risk begins</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Your general contractor inherits more than the contract.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                The day construction is awarded, your contractor inherits every unresolved piece of
                the project: owner decisions still pending, design details still developing,
                unanswered RFIs, missing specifications, and procurement unknowns.
              </p>
              <p>
                That is not a criticism of anyone. No project starts complete. It is simply how
                projects begin.
              </p>
              <p>
                But every open item silently transfers risk to the builder&mdash;and starts a
                clock. Procurement can only absorb so much waiting before the schedule starts
                paying for it.
              </p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                  Unresolved information does not disappear. It compounds.
                </p>
                <p className="mt-3 text-slate-300">
                  And once procurement loses control, the cost of fixing a problem grows with every
                  week it stays hidden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When control is lost */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Without early control</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              What happens when control is lost early
            </h2>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lostControl.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="font-heading text-xl font-bold text-slate-100">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* With JiTpro */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>With JiTpro</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              What happens when your contractor uses JiTpro
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Early procurement control is not a concession you ask of your contractor. It protects
              both of you.
            </p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {withJiTpro.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-slate-950/60 p-6">
                <CheckCircle2 className="mb-4 text-amber-400" size={22} />
                <h3 className="font-heading text-xl font-bold text-slate-100">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How JiTpro works */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>How it works</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                One system holding every unresolved commitment.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                JiTpro tracks the project&apos;s unresolved commitments from the beginning&mdash;every
                open decision, design clarification, approval, and long-lead release, sequenced
                against the dates the schedule actually needs.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {howItWorks.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-4 font-heading text-lg font-semibold leading-snug text-slate-100"
                  >
                    {line}
                  </div>
                ))}
              </div>
              <p>
                When something outside your contractor&apos;s control affects schedule or budget,
                the record already exists: what was needed, who owned it, when it was requested,
                and what depended on it.
              </p>
              <p className="font-heading text-xl font-semibold leading-snug text-slate-100">
                That documentation protects your contractor. It protects you just as much&mdash;because
                decisions get made on facts instead of arguments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner benefits */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>What you get</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                The outcomes owners actually care about.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Not another portal to log into. A project where problems are handled while they are
                still small&mdash;and a record you can trust when they are not.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ownerBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  <span className="text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel>Before procurement begins</SectionLabel>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Require JiTpro on Your Project
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            The best time to prevent unnecessary change orders is before procurement begins. Ask
            your General Contractor to use JiTpro so unresolved project information is managed
            while problems are still inexpensive to solve.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/contact/owner"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Request JiTpro for My Project
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
