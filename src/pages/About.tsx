import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const beliefs = [
  {
    lead: 'Contractors inherit risk that often never belonged to them.',
    body: 'Unresolved decisions, incomplete design, and outside approvals land on the builder simply because the builder is the one holding the schedule.',
  },
  {
    lead: 'Procurement deserves the same discipline field operations receive.',
    body: 'No one would run a jobsite from memory and scattered emails. That is how most companies run the path from decision to delivery.',
  },
  {
    lead: 'Accountability requires visibility.',
    body: 'You cannot hold anyone to a commitment no one can see. Visibility has to come first, or accountability turns into blame.',
  },
  {
    lead: 'Predictable projects are created months before crews mobilize.',
    body: 'By the time work is in the ground, the project is mostly collecting the results of decisions already made—or not made.',
  },
  {
    lead: 'Margin is protected long before the first piece of work is installed.',
    body: 'The estimate sets it. What happens between contract and mobilization decides how much of it survives.',
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Section 1: Why JiTpro exists */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_38%)]" />
        <div className="relative mx-auto max-w-4xl">
          <SectionLabel>About JiTpro</SectionLabel>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Why JiTpro exists
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-slate-300">
            <p>
              JiTpro was not created because the industry needed another project management
              application.
            </p>
            <p>
              It was created because too many contractors lose schedule, margin, and leverage for
              reasons that were visible long before construction began.
            </p>
            <p>The problem was never that people weren&apos;t working hard.</p>
            <p>
              The problem was that procurement commitments were scattered across meetings, emails,
              RFIs, submittals, spreadsheets, phone calls, and memory.
            </p>
            <p className="font-heading text-xl font-semibold leading-snug text-slate-100">
              Everyone was reacting. No one owned the entire sequence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Built by people who have lived it */}
      <section className="border-b border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>Who is behind it</SectionLabel>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
            Built by people who have lived it
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-slate-300">
            <p>This is not a company that studied construction from the outside.</p>
            <p>
              We&apos;ve sat in OAC meetings where the schedule was already gone and everyone in the
              room knew it. We&apos;ve managed buyout. We&apos;ve coordinated owner selections that
              arrived late and changed twice. We&apos;ve waited on long-lead materials with crews
              already sequenced against them.
            </p>
            <p>
              We&apos;ve watched a fabrication slot disappear while a submittal cycled through one
              more review. And we&apos;ve stood in front of owners defending schedule delays that
              never should have become our responsibility.
            </p>
            <p>
              None of that fits on a slide. It&apos;s just the work&mdash;decades of it&mdash;and
              it is where JiTpro came from.
            </p>
          </div>
          <Link
            to="/founder-story"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Read the founder&apos;s story
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Section 3: What we believe */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>What we believe</SectionLabel>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
            The principles JiTpro is built on
          </h2>
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {beliefs.map((belief) => (
              <div key={belief.lead} className="py-8">
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                  {belief.lead}
                </p>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-400">{belief.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Why we built JiTpro */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>Why we built it</SectionLabel>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
            JiTpro is the software we wished had existed while we were managing projects.
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-slate-300">
            <p>
              It brings procurement into a structured sequence instead of a scattered one. It
              identifies commitments before they become constraints. It creates accountability
              without blame.
            </p>
            <p>
              And it preserves a defensible record of what happened, when it happened, who owned
              it, and how it affected the project&mdash;built while events unfold, not
              reconstructed afterward.
            </p>
            <p>
              It is not trying to run your whole company. It holds the one layer that has always
              been managed from memory&mdash;the stretch between a signed contract and work the
              field can actually build.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Closing vision */}
      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel>Where this is going</SectionLabel>
          <div className="space-y-5 font-heading text-2xl font-semibold leading-snug text-slate-200 md:text-3xl">
            <p>Contractors deserve better than constant recovery.</p>
            <p>Projects can begin with clarity instead of uncertainty.</p>
            <p>Stable projects build stronger companies.</p>
            <p>And this industry deserves tools built by people who understand the work.</p>
          </div>
          <p className="mx-auto mt-12 max-w-3xl font-heading text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
            We spent decades absorbing problems that started upstream. We built JiTpro so you
            don&apos;t have to.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Protect your next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/founder-story"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/6 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Read the founder&apos;s story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
