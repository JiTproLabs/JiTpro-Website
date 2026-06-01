import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProcurementFlowHero from '../components/hero/ProcurementFlowHero';
import TypicalScheduleSection from '../components/TypicalScheduleSection';
import ControlledProcurementSection from '../components/ControlledProcurementSection';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <ProcurementFlowHero />

      {/* SEQUENCED PROCUREMENT */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-snug">
            Construction Schedules Depend on Procurement. So Do Healthy Margins.
          </h2>
          <div className="text-lg text-slate-600 leading-relaxed space-y-5">
            <p>
              Every material, product, service, approval, and decision required to build a project must arrive when needed to support the construction schedule.
            </p>
            <p>
              When procurement is sequenced correctly, work flows as planned, trade partners remain productive, and margins are protected.
            </p>
            <p>
              When procurement falls behind, the cost of recovery compounds through expediting, rework, remobilization, and lost productivity.
            </p>
            <p className="text-slate-900 font-bold">
              Healthy schedules create the conditions for healthy margins.
            </p>
          </div>
        </div>
      </section>

      {/* PROCUREMENT IS NOT OPTIONAL */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-snug">
            Procurement Is Not Optional
          </h2>
          <div className="text-lg text-slate-600 leading-relaxed space-y-5">
            <p>
              Every construction project relies on materials, products, services, decisions, approvals, and information arriving at the right place and the right time.
            </p>
            <p>
              When they do, work progresses as planned.
            </p>
            <p>
              When they don't, schedules compress, teams react, and margin begins to erode.
            </p>
            <p>
              No contractor, owner, architect, or supplier can bypass this reality.
            </p>
            <p>
              The choice is not whether procurement will affect the project.
            </p>
            <p>
              The choice is whether procurement will be managed deliberately or allowed to dictate outcomes after the fact.
            </p>
            <p className="text-slate-900 font-medium">
              JiTpro helps teams take control before procurement takes control of them.
            </p>
          </div>
        </div>
      </section>

      {/* TYPICAL SCHEDULE — interactive */}
      <TypicalScheduleSection />

      {/* CONTROLLED PROCUREMENT — animated detailed Gantt */}
      <ControlledProcurementSection />

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
