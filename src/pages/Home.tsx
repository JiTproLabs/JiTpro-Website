import ProcurementFlowHero from '../components/hero/ProcurementFlowHero';
import ProcurementFailureSection from '../components/ProcurementFailureSection';
import ControlledProcurementSection from '../components/ControlledProcurementSection';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <ProcurementFlowHero />

      {/* PROCUREMENT — DIAGNOSIS */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-snug">
            Construction Schedules Depend on Procurement. So Do Healthy Margins.
          </h2>
          <div className="text-lg text-slate-600 leading-relaxed space-y-5">
            <p>
              Every construction project relies on materials, products, services, decisions, approvals, and information arriving at the right place and the right time.
            </p>
            <p>
              When procurement is sequenced correctly, work flows as planned, trade partners remain productive, and margins are protected.
            </p>
            <p>
              When procurement falls behind, the cost of recovery compounds through expediting, rework, remobilization, and lost productivity.
            </p>
            <p>
              No contractor, owner, architect, or supplier can bypass this reality. The choice is whether procurement will be managed deliberately or allowed to dictate outcomes after the fact.
            </p>
            <p className="text-slate-900 font-medium">
              JiTpro helps teams take control before procurement takes control of them.
            </p>
          </div>
        </div>
      </section>

      {/* PROCUREMENT FAILURE — play-button video */}
      <ProcurementFailureSection />

      {/* CONTROLLED PROCUREMENT — animated detailed Gantt */}
      <ControlledProcurementSection />

      {/* CREDIBILITY */}
      <section className="px-6 py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
            Built on three decades of complex residential and light commercial construction.
          </p>
        </div>
      </section>
    </div>
  );
}
