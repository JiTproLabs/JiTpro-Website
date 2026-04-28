import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const painPoints = [
  {
    to: '/roles/general-contractors',
    role: 'General Contractors',
    headline: "You're losing money on jobs before they even start.",
    body: (
      <>
        <p>
          You commit to a schedule without fully knowing what it will take to actually procure the work.
        </p>
        <div className="mt-4 space-y-1">
          <p>Missing design.</p>
          <p>Undefined decisions.</p>
          <p>Unclear ownership.</p>
        </div>
        <p className="mt-4">
          It all shows up later — and now you're chasing the job, paying for it in change orders, expediting, and lost margin.
        </p>
      </>
    ),
  },
  {
    to: '/roles/owners-developers',
    role: 'Owners / Developers',
    headline: (
      <>
        Projects don't spiral late.
        <br />
        They spiral early—when no one is in control.
      </>
    ),
    body: (
      <>
        <div className="space-y-1">
          <p>Schedules slip.</p>
          <p>Change orders stack.</p>
          <p>Decisions become urgent.</p>
          <p>And the project starts running you.</p>
        </div>
        <p className="mt-4 font-medium text-slate-900">
          JiTpro brings control in early—before things break.
        </p>
        <div className="mt-4 space-y-1">
          <p>Identify decisions before they become urgent</p>
          <p>Sequence procurement before delays start</p>
          <p>Build the schedule from real constraints</p>
        </div>
      </>
    ),
  },
  {
    to: '/roles/architects-engineers',
    role: 'Architects / Engineers',
    headline: 'Design continues during procurement — but no one owns the timing.',
    body: (
      <p>Submittals become the place where design gets finished instead of verified.</p>
    ),
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${import.meta.env.BASE_URL}assets/video/hero-bg.mp4`} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-300 mb-8 leading-relaxed">
            $31.2B is lost to construction rework every year.
            <br />
            Is some of it in your projects?
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
            Control Before You Build.
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
            JiTpro reveals and sequences the procurement constraints your schedule depends on—before they cost you.
          </p>
        </div>
      </section>

      {/* PAIN IDENTIFICATION */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              You've seen this.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((item) => (
              <Link
                key={item.role}
                to={item.to}
                className="border border-slate-200 rounded-xl p-8 bg-white hover:border-slate-400 transition-colors group flex flex-col h-full"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600 mb-4">
                  {item.role}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-amber-700 transition-colors">
                  {item.headline}
                </h3>
                <div className="text-slate-600 leading-relaxed mb-6">{item.body}</div>
                <span className="inline-flex items-center gap-2 text-slate-900 font-medium group-hover:text-amber-600 transition-colors mt-auto">
                  Read more
                  <ArrowRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGNOSIS */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-semibold text-slate-900 leading-snug mb-8">
            These aren't isolated problems.
            <br />
            They're the same problem showing up in different roles.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Projects don't destabilize in the field. They destabilize in procurement — weeks or months before construction begins.
          </p>
          <p className="text-lg text-slate-900 leading-relaxed font-medium">
            JiTpro makes those constraints visible before they impact the schedule.
          </p>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="px-6 py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
            Built from 38+ years managing complex residential and light commercial projects.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
            >
              See how it works
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-8 py-4 text-lg font-medium hover:border-slate-900 transition-colors"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
