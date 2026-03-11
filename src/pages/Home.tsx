import { ArrowRight, Clock, FileCheck, GitBranch, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const problemPoints = [
  {
    title: 'Selections arrive late',
    description:
      'Windows, equipment, steel, finishes, and other critical items cannot move until key decisions are made.',
  },
  {
    title: 'Dependencies stay hidden',
    description:
      'Submittals, design signoff, owner input, and vendor lead times stack up long before the field feels the delay.',
  },
  {
    title: 'Recovery gets expensive',
    description:
      'By the time the schedule shows the impact, options are limited and the team is already reacting instead of controlling.',
  },
];

const solutionPoints = [
  {
    icon: Search,
    title: 'Identify critical procurement items',
    description:
      'Find the materials, approvals, and design decisions that can damage the schedule if they move too late.',
  },
  {
    icon: GitBranch,
    title: 'Map upstream dependencies',
    description:
      'Make the chain visible behind each item, including submittals, reviews, approvals, and release timing.',
  },
  {
    icon: Clock,
    title: 'Set decision deadlines from install dates',
    description:
      'Work backward from required onsite dates so the team sees risk while there is still time to act.',
  },
  {
    icon: FileCheck,
    title: 'Keep a defensible record',
    description:
      'Capture approvals, timing, and changes in a clear history that supports accountability and documentation.',
  },
];

const workflowSteps = [
  {
    title: 'Identify procurement scope',
    description: 'Define the items and decisions that can affect schedule performance.',
  },
  {
    title: 'Map dependencies and lead times',
    description: 'Show what each item depends on before it can be released or fabricated.',
  },
  {
    title: 'Set decision deadlines',
    description: 'Tie procurement timing to required installation dates, not hopeful assumptions.',
  },
  {
    title: 'Track approvals before they become delays',
    description: 'Surface drift early so the team can resolve issues before the field pays for them.',
  },
  {
    title: 'Maintain a permanent record',
    description: 'Keep a clear history of what happened, when it happened, and where delays originated.',
  },
];

const audiences = [
  {
    title: 'General Contractors',
    description:
      'See procurement risk before it turns into field delay, coordination churn, or expensive recovery.',
  },
  {
    title: 'Owners & Developers',
    description:
      'Know which decisions are truly schedule-critical and where unresolved choices threaten project dates.',
  },
  {
    title: 'Architects & Engineers',
    description:
      'Understand which approvals, selections, and releases must move early to protect downstream work.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            Procurement clarity for construction projects
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Construction schedules break when procurement constraints stay invisible
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            JiTpro helps general contractors, owners, and design teams identify long-lead
            decisions early, map procurement dependencies, and tie decisions to required
            onsite dates before schedule damage shows up in the field.
          </p>

          <p className="text-base md:text-lg text-slate-500 mb-12">
            Built for general contractors, owners &amp; developers, and architects &amp;
            engineers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
            >
              See how JiTpro works
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-8 py-4 text-lg font-medium hover:border-slate-900 transition-colors"
            >
              Request Demo
            </Link>
          </div>

          <p className="text-sm text-slate-500">
            Works with your existing project management tools. No process overhaul required.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why projects fall behind
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Long-lead materials are only part of the problem. The real schedule damage
              happens when the decisions tied to those materials are not visible early enough.
              Selections drift. Approvals wait. Procurement windows close. By the time the
              schedule reflects the impact, recovery is harder and more expensive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problemPoints.map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 p-8 rounded-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/why"
              className="inline-flex items-center gap-2 text-slate-900 font-medium text-lg hover:text-amber-600 transition-colors"
            >
              See the procurement problem
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What JiTpro makes visible
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              JiTpro is not another generic PM layer. It gives the team visibility into the
              procurement decisions, dependencies, and timing constraints that drive schedule
              performance long before those problems hit the field.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {solutionPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="border border-slate-200 p-8 rounded-xl bg-white"
                >
                  <div className="w-12 h-12 bg-amber-500 flex items-center justify-center mb-6 rounded-lg">
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              How JiTpro works
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              JiTpro helps the team work backward from required onsite dates, expose what each
              procurement item depends on, and keep decisions moving before schedule damage
              becomes visible downstream.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <div className="text-sm font-semibold text-amber-600 mb-3">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-slate-900 font-medium text-lg hover:text-amber-600 transition-colors"
            >
              Explore the full workflow
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Built for the teams who carry procurement risk
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              JiTpro is designed for the people who have to make decisions early, coordinate
              across disciplines, and protect the schedule when procurement timing matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {audiences.map((item) => (
              <div key={item.title} className="border border-slate-200 rounded-xl p-8 bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/roles"
              className="inline-flex items-center gap-2 text-slate-900 font-medium text-lg hover:text-amber-600 transition-colors"
            >
              See who JiTpro is built for
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Works with the tools you already use
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              JiTpro adds procurement visibility, decision timing, and accountability to the
              systems your team already relies on. It is a control layer for procurement, not a
              replacement for the rest of your project workflow.
            </p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 text-amber-300 font-medium text-lg hover:text-amber-200 transition-colors"
            >
              See what JiTpro enables
              <ArrowRight size={20} />
            </Link>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built from construction experience
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              JiTpro comes from seeing the same failure repeat across projects: the schedule
              looks fine until procurement decisions happen too late to protect it. The goal is
              simple — make those constraints visible while the team still has time to act.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-amber-300 font-medium text-lg hover:text-amber-200 transition-colors"
            >
              Meet the founder
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            See the procurement problem before it hits your schedule
          </h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            When procurement constraints are visible early, teams can make better decisions,
            protect installation dates, and avoid schedule damage that shows up too late to fix.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Request Demo
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/why"
              className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-8 py-4 text-lg font-medium hover:border-slate-900 transition-colors"
            >
              Why JiTpro exists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
