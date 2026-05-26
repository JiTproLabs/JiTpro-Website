import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveProcurementSchedule } from '../components/InteractiveProcurementSchedule';
import ProcurementFlowHero from '../components/hero/ProcurementFlowHero';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <ProcurementFlowHero />

      {/* PRIMARY ICP — GENERAL CONTRACTORS */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            You've seen this.
          </h2>

          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            General Contractors
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-snug">
            You're losing money on jobs before they even start.
          </h3>
          <div className="text-lg text-slate-600 leading-relaxed space-y-4 mb-8">
            <p>
              You commit to a schedule without fully knowing what it will take to actually procure the work.
            </p>
            <div className="space-y-1">
              <p>Missing design.</p>
              <p>Undefined decisions.</p>
              <p>Unclear ownership.</p>
            </div>
            <p>
              It all shows up later — and now you're chasing the job, paying for it in change orders, expediting, and lost margin.
            </p>
          </div>
          <Link
            to="/roles/general-contractors"
            className="inline-flex items-center gap-2 text-slate-900 font-medium hover:text-amber-600 transition-colors"
          >
            Read more
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* DIAGNOSIS */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Projects don't destabilize in the field. They destabilize in procurement — weeks or months before construction begins.
          </p>
          <p className="text-lg text-slate-900 leading-relaxed font-medium">
            JiTpro makes those constraints visible before they impact the schedule.
          </p>
        </div>
      </section>

      {/* INTERACTIVE PROCUREMENT SCHEDULE */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug">
              Here's what it looks like.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A real procurement schedule. Hover any segment to see the phase, dates, and duration. Zoom across quarters, months, weeks, or days.
            </p>
          </div>
          <InteractiveProcurementSchedule />
        </div>
      </section>

      {/* STAKEHOLDER ROUTER */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            These aren't isolated problems. They're the same problem showing up across the project ecosystem.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-900 mb-12 leading-snug">
            WHEN PROCUREMENT IS CONTROLLED, THE WHOLE PROJECT STABILIZES.
          </h2>
          <div className="space-y-10">
            <div>
              <p className="text-lg text-slate-700 mb-3 leading-relaxed">
                For owners: predictable outcomes, not mid-project surprises.
              </p>
              <Link
                to="/roles/owners-developers"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                → See the Owners &amp; Developers page
              </Link>
            </div>
            <div>
              <p className="text-lg text-slate-700 mb-3 leading-relaxed">
                For architects: clear decision timing that protects design intent.
              </p>
              <Link
                to="/roles/architects-engineers"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                → See the Architects &amp; Engineers page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="px-6 py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-4">
            Built on three decades of complex residential and light commercial construction.
          </p>
          <Link
            to="/founder-story"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Founder Story →
          </Link>
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

      {/* SOURCES */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            ¹ PlanGrid/FMI, Construction Disconnected, 2018.
          </p>
        </div>
      </section>
    </div>
  );
}
