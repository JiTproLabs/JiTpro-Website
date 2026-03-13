import { ArrowRight, Clock, FileCheck, GitBranch, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const problemPoints = [
  {
    title: 'Design & specification decisions',
    description:
      'Unresolved design and specification decisions quietly become procurement constraints that destabilize execution.',
  },
  {
    title: 'Submittal Coordination & Prep',
    description:
      'When time is not allocated for proper submittal sequencing, mistakes and rework become common.',
  },
  {
    title: 'Submittal Review & Approval',
    description:
      'Expedited reviews overwhelm consultants and delay procurement approvals.',
  },
];

const solutionPoints = [
  {
    icon: Search,
    title: 'Procurement tasks',
    description:
      'Identify every procurement action required across the project.',
  },
  {
    icon: GitBranch,
    title: 'Responsible parties',
    description:
      'Assign ownership so every decision and approval has a clear responsible party.',
  },
  {
    icon: Clock,
    title: 'Delivery deadlines',
    description:
      'Set deadlines tied to required onsite dates, not assumptions.',
  },
  {
    icon: FileCheck,
    title: 'Constraint identification',
    description:
      'Surface timing risks early so the team can act before the schedule slips.',
  },
];

const workflowSteps = [
  {
    title: 'Buyout',
    description: 'Contracts and purchase orders are issued.',
  },
  {
    title: 'Submittals',
    description: 'Shop drawings and product data are submitted for review.',
  },
  {
    title: 'Review Cycles',
    description: 'Track each step of review through to approval.',
  },
  {
    title: 'Fabrication',
    description: 'Custom items are manufactured to specification.',
  },
  {
    title: 'Delivery',
    description: 'Materials arrive onsite when required.',
  },
];

const audiences = [
  {
    to: '/roles/general-contractors',
    title: 'General Contractors',
    description:
      'JiTpro gives GCs control over procurement timing so schedule commitments hold up in the field.',
  },
  {
    to: '/roles/owners-developers',
    title: 'Owners & Developers',
    description:
      'When your GC uses JiTpro, you get early visibility into the decisions and constraints that drive your project dates.',
  },
  {
    to: '/roles/architects-engineers',
    title: 'Architects & Engineers',
    description:
      'JiTpro clarifies which design decisions and approvals are schedule-critical, reducing last-minute pressure on your team.',
  },
  {
    to: '/roles/subcontractors',
    title: 'Subcontractors',
    description:
      'When the GC tracks procurement with JiTpro, subs get clearer timelines and fewer surprises on submittals and deliveries.',
  },
  {
    to: '/roles/project-managers',
    title: 'Project Managers / CMs',
    description:
      'JiTpro gives PMs a single view of procurement status across the project with clear ownership and deadlines.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${import.meta.env.BASE_URL}assets/video/hero-bg.mp4`} type="video/mp4" />
        </video>


        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400 mb-6">
            Procurement Intelligence for Construction
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Get Ahead of the Job Before It Gets Ahead of You
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            JiTpro empowers general contractors to take control of missing decisions, buyout, approvals, and long-lead items before they turn into schedule delays and daily firefighting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors"
            >
              See how JiTpro works
              <ArrowRight size={20} />
            </Link>

          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Where Construction Schedules Begin to Unravel
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Procurement—buyout, submittals, approvals, fabrication, and delivery—is the operational backbone that supports the construction schedule.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Construction schedules break down when procurement dependencies surface too late. Every material and product delivered to a jobsite depends on a chain of upstream steps.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              When those dependencies aren't identified early and tied to procurement tasks, procurement cannot support the schedule—and instability spreads across the project.
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
              What JiTpro does
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              JiTpro maps procurement workflows across the project and identifies timing risks early. It tracks the information the team needs to keep procurement on schedule.
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
              JiTpro maps the complete procurement sequence backwards from required onsite dates to ensure materials arrive when needed. Every item follows this chain.
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
              Built for general contractors, valuable to the whole team
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              JiTpro is built for the GC managing procurement risk. When the GC uses it, every stakeholder on the project benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-8">
            {audiences.map((item) => (
              <Link key={item.title} to={item.to} className="border border-slate-200 rounded-xl p-8 bg-white hover:border-slate-400 transition-colors group block">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </Link>
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
              JiTpro adds procurement visibility to your existing workflow. No process overhaul required.
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
              JiTpro was built because procurement decisions happen too late on too many projects. The goal is simple — make constraints visible while there is still time to act.
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
            See procurement risk before it hits your schedule
          </h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            When procurement constraints are visible early, teams protect installation dates and avoid schedule damage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
            >
              How It Works
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
