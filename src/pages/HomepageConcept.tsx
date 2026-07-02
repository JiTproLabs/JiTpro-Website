import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Clock, DollarSign, ShieldCheck, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const chainSteps = [
  'Decision slips',
  'Approval stalls',
  'Release date moves',
  'Fabrication starts late',
  'Delivery misses the field',
  'Profit gets consumed',
];

const controlItems = [
  {
    title: 'Decisions',
    body: 'What has to be decided, who owns it, and when the job actually needs the answer.',
  },
  {
    title: 'Approvals',
    body: 'The review windows that must hold if the schedule is going to hold.',
  },
  {
    title: 'Submittals',
    body: 'The packages, revisions, and response cycles that quietly control the field date.',
  },
  {
    title: 'Releases',
    body: 'The point where a late answer becomes a missed fabrication window.',
  },
  {
    title: 'Fabrication',
    body: 'The real-world time the job cannot compress after the pressure starts.',
  },
  {
    title: 'Delivery',
    body: 'The required-on-site reality your field schedule depends on.',
  },
];

const comparison = [
  {
    label: '$5M company',
    title: 'The owner is still the system',
    points: [
      'Critical items live in memory',
      'PMs chase decisions by phone',
      'Excel feels good enough',
      'Recovery is painful but survivable',
    ],
  },
  {
    label: '$20M company',
    title: 'The old system starts breaking',
    points: [
      'Too many decisions to remember',
      'Too many reviews to chase manually',
      'One miss moves more people',
      'Recovery starts eating the job',
    ],
  },
];



const constraintExamples = [
  {
    title: 'Kitchen design incomplete',
    result: 'Cabinet shop drawings cannot proceed.',
  },
  {
    title: 'Structural details unresolved',
    result: 'Steel shop drawings cannot be produced.',
  },
  {
    title: 'Fixture selections unfinished',
    result: 'The plumbing package cannot be submitted for approval.',
  },
  {
    title: 'Approval window missed',
    result: 'Release dates move and fabrication starts late.',
  },
];


export default function HomepageConcept() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white text-slate-900">
      {/* Review banner */}
      <div className="bg-amber-500 text-slate-950 px-6 py-2 text-center text-sm font-semibold">
        Unlisted homepage concept for review only — not linked from site navigation.
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#030a19] text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.22), transparent 32%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.12), transparent 30%)',
          }}
        />
        <div className="absolute right-0 bottom-0 w-[58%] max-w-4xl opacity-30 pointer-events-none hidden lg:block">
          <img
            src={`${import.meta.env.BASE_URL}assets/hero/house-render.png`}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain mix-blend-lighten"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#030a19] via-[#030a19]/92 to-[#030a19]/60" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-36">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-amber-300 mb-6">
              Thin-margin construction requires early control
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] mb-8">
              One missed item can erase the profit on your project.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Not because the field failed. Because a decision slipped, an approval stalled, a release date moved, or a delivery missed the date the field needed it.
            </p>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto mb-10">
              JiTpro helps growth-stage GCs control that chain before it turns into schedule compression, rework, and lost profit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#next-project-review"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7 py-4 text-base md:text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Review my next project
                <ArrowRight size={20} />
              </a>
              <a
                href="#what-this-is"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 text-base md:text-lg font-semibold rounded-lg hover:border-white/45 transition-colors"
              >
                What do you mean by procurement?
              </a>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-sm p-5 md:p-8 shadow-2xl">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-500/10 px-4 py-2 mb-5">
                  <TrendingDown className="text-red-300" size={18} />
                  <span className="text-xs uppercase tracking-[0.22em] text-red-100 font-semibold">Profit exposure chain</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-3">
                  See how one missed item becomes the job.
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  It rarely looks like one big failure. It moves through the project one missed handoff at a time.
                </p>
              </div>

              <div className="hidden lg:grid grid-cols-6 gap-3 relative">
                <div className="absolute left-8 right-8 top-[2.35rem] h-px bg-gradient-to-r from-amber-300/40 via-amber-300/30 to-red-300/40" />
                {chainSteps.map((step, index) => (
                  <div key={step} className="relative">
                    <div className={`relative z-10 mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${index < 3 ? 'bg-amber-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                      {index + 1}
                    </div>
                    <div className={`min-h-36 rounded-2xl border p-4 ${index < 3 ? 'border-amber-300/20 bg-amber-500/10' : 'border-red-300/20 bg-red-500/10'}`}>
                      <p className={`text-sm font-bold leading-snug ${index < 3 ? 'text-amber-100' : 'text-red-100'}`}>{step}</p>
                      <p className="mt-3 text-xs leading-relaxed text-slate-400">
                        {index === 0 && 'The first missed answer feels manageable.'}
                        {index === 1 && 'The review window starts absorbing time.'}
                        {index === 2 && 'The job loses the date it needed.'}
                        {index === 3 && 'Real-world production time cannot compress enough.'}
                        {index === 4 && 'The field is ready before the item is.'}
                        {index === 5 && 'Recovery starts spending projected profit.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:hidden space-y-3">
                {chainSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-amber-500/15 text-amber-200 border border-amber-400/30' : 'bg-red-500/15 text-red-200 border border-red-400/30'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 rounded-lg border border-white/10 bg-slate-950/40 px-4 py-3 text-slate-200 font-medium">
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-red-500/10 border border-red-400/30 p-4">
                <p className="text-red-100 font-semibold text-center text-lg">
                  The field did not create the loss. It revealed it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLAIN ENGLISH DEFINITION */}
      <section id="what-this-is" className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              Plain English
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              You may not call it procurement. But it is where the job starts to miss.
            </h2>
          </div>
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
            <p>
              Most growth-stage GCs hear procurement and think purchasing department. That is not what we mean.
            </p>
            <p className="text-2xl font-semibold text-slate-900 leading-snug">
              Procurement is the path from decision to delivery.
            </p>
            <p>
              It is every selection, approval, submittal, release, fabrication step, and delivery that has to happen before the field can build. When that chain slips, the schedule compresses. When the schedule compresses, margin gets consumed.
            </p>
          </div>
        </div>
      </section>


      {/* CONSTRAINTS */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              Constraints
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              The field feels the delay last. Procurement gets blocked first.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              A constraint is anything unresolved that must be answered, decided, detailed, approved, or selected before procurement can move to the next step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {constraintExamples.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-4">
                  Constraint
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <div className="h-px bg-slate-200 mb-4" />
                <p className="text-slate-600 leading-relaxed">{item.result}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
            <div className="rounded-2xl bg-slate-950 text-white p-7 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 mb-4">
                Inherited risk
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">
                Inherited constraints become GC risk.
              </h3>
              <p className="text-slate-300 leading-relaxed mb-5">
                Projects often arrive with unresolved selections, incomplete details, open approvals, missing information, and decisions still in motion.
              </p>
              <p className="text-slate-200 font-semibold leading-relaxed">
                The GC may not control every decision, but the GC is still expected to keep the project moving.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-300/30 bg-amber-50 p-7 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-5">
                Turn constraints into coordination before they become blame.
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed mb-5">
                JiTpro brings inherited constraints into the open early, clarifies what each procurement step is waiting on, and gives the project team time to coordinate decisions before urgency takes over.
              </p>
              <a href="#next-project-review" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-700 transition-colors">
                Find the constraints in my next project
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              Why this matters now
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              In this market, recovery is too expensive.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Contractors are pricing aggressively to win work. Margins are thin. There is less room for rework, overtime, expediting, owner pressure, or weeks of field recovery caused by one package that was not controlled early enough.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
              <DollarSign className="text-amber-600 mb-5" size={32} />
              <h3 className="text-xl font-bold mb-3">Margins are already thin</h3>
              <p className="text-slate-600 leading-relaxed">You do not have enough profit in the job to absorb repeated late decisions, expediting, and field recovery.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
              <Clock className="text-amber-600 mb-5" size={32} />
              <h3 className="text-xl font-bold mb-3">Time is expensive</h3>
              <p className="text-slate-600 leading-relaxed">Once fabrication windows close or deliveries miss the field date, recovery costs more than early control ever would have.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
              <ShieldCheck className="text-amber-600 mb-5" size={32} />
              <h3 className="text-xl font-bold mb-3">One miss can become the project</h3>
              <p className="text-slate-600 leading-relaxed">A window package, steel item, cabinet release, tile selection, or equipment delay can consume the margin you thought you had.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GROWTH TRAP */}
      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 mb-4">
              The growth-stage trap
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Bigger jobs will not forgive the habits that worked when you were smaller.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Growth does not fix informal systems. It exposes them. The same missed decision that was survivable at $5M can bury a team and consume the job at $20M.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {comparison.map((column, index) => (
              <div key={column.label} className={`rounded-2xl border p-7 ${index === 0 ? 'border-slate-700 bg-slate-800/60' : 'border-amber-400/40 bg-amber-500/10'}`}>
                <p className={`text-sm font-semibold uppercase tracking-[0.2em] mb-3 ${index === 0 ? 'text-slate-400' : 'text-amber-300'}`}>{column.label}</p>
                <h3 className="text-2xl font-bold mb-6">{column.title}</h3>
                <ul className="space-y-4">
                  {column.points.map((point) => (
                    <li key={point} className="flex gap-3 items-start text-slate-200">
                      <CheckCircle2 className={index === 0 ? 'text-slate-500 mt-0.5' : 'text-amber-300 mt-0.5'} size={20} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT JITPRO CONTROLS */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              What JiTpro controls
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              JiTpro controls the chain before the field pays for it.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              We turn the work your schedule depends on into a controlled sequence with owners, dates, risk signals, and accountability visible early.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {controlItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 p-6 bg-white hover:border-amber-300 transition-colors">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slate-950 text-white p-7 md:p-9">
            <div>
              <p className="text-2xl font-bold mb-2">Your current software tracks the project. JiTpro keeps procurement from dictating it.</p>
              <p className="text-slate-400">Most systems show what is happening once the job is already moving. JiTpro gives the GC a plan to direct the decisions, approvals, releases, fabrication, and deliveries the field depends on — before missed timing forces the project into reactive firefighting.</p>
              <Link to="/roles/general-contractors" className="mt-6 inline-flex items-center gap-2 text-amber-300 font-semibold hover:text-amber-200">
                See the GC page
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER AUTHORITY */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div className="max-w-sm">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
              <img
                src={`${import.meta.env.BASE_URL}assets/team/jeff.jpg`}
                alt="Jeff Kaufman, Founder of JiTpro"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              Built from the jobsite, not a conference room
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              Built by a contractor who got tired of watching good teams lose money to preventable project failure.
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed mb-6">
              “The painful part was not that projects were complex. The painful part was watching contractors lose margin on problems that were visible months earlier.”
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              JiTpro comes from 38+ years of seeing the same pattern repeat: good contractors, good PMs, and good supers forced into recovery because the path from decision to delivery was not controlled early enough.
            </p>
            <Link to="/founder-story" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-700 transition-colors">
              Read Jeff’s founder story
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FORM */}
      <section id="next-project-review" className="px-6 py-20 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 mb-4">
              Start with one upcoming project
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              See where your next project is exposed before the field pays for it.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">
              Send the basics. We’ll review the decision, approval, submittal, release, fabrication, and delivery risks most likely to cost schedule or margin.
            </p>
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-3">What you get back</h3>
              <ul className="space-y-3 text-slate-200">
                <li className="flex gap-3"><CheckCircle2 className="text-amber-300 mt-0.5" size={20} />Top procurement-risk points in plain English</li>
                <li className="flex gap-3"><CheckCircle2 className="text-amber-300 mt-0.5" size={20} />Where the schedule is likely to compress</li>
                <li className="flex gap-3"><CheckCircle2 className="text-amber-300 mt-0.5" size={20} />What needs control before construction pressure begins</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-slate-900 p-6 md:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto text-slate-950 mb-5" size={48} />
                <h3 className="text-2xl font-bold mb-3">Concept form received</h3>
                <p className="text-slate-600 leading-relaxed">
                  This review page is not wired to production submission yet. In the launched version, this would send the request for a next-project risk review.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="concept-name" className="block text-sm font-bold text-slate-900 mb-2">Name *</label>
                  <input id="concept-name" required className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="concept-company" className="block text-sm font-bold text-slate-900 mb-2">Company *</label>
                    <input id="concept-company" required className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label htmlFor="concept-phone" className="block text-sm font-bold text-slate-900 mb-2">Phone</label>
                    <input id="concept-phone" type="tel" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="concept-email" className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
                  <input id="concept-email" type="email" required className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="concept-project" className="block text-sm font-bold text-slate-900 mb-2">What are you building next? *</label>
                  <select id="concept-project" required className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none bg-white">
                    <option value="">Select one</option>
                    <option>Luxury residential</option>
                    <option>Light commercial</option>
                    <option>Hospitality / winery</option>
                    <option>Mixed use</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="concept-method" className="block text-sm font-bold text-slate-900 mb-2">How are you controlling decisions and materials today? *</label>
                  <select id="concept-method" required className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none bg-white">
                    <option value="">Select one</option>
                    <option>Excel / spreadsheet</option>
                    <option>Procore or PM software</option>
                    <option>Microsoft Project / schedule</option>
                    <option>PM memory and follow-up</option>
                    <option>Informal / not sure</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="concept-message" className="block text-sm font-bold text-slate-900 mb-2">Optional: What went wrong on the last job?</label>
                  <textarea id="concept-message" rows={4} className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-slate-800 transition-colors">
                  Review my next project
                </button>
                <p className="text-sm text-slate-500 text-center">
                  No long demo form. No generic sales pitch. One project. One honest look at the risk.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
