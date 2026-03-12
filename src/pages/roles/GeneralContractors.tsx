import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GeneralContractors() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            Roles
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            JITpro for General Contractors
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            You carry the schedule. You carry the risk. When procurement decisions drift, the GC absorbs the damage — in the field, in the budget, and in the relationship with the owner. JITpro gives you early control over the procurement decisions that protect your schedule.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            Your role in procurement
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              The general contractor is responsible for building the project on time and on budget. That means coordinating dozens of trades, managing material deliveries, and keeping the schedule moving forward — all while depending on decisions from owners, architects, and engineers that are often outside your direct control.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Procurement sits at the center of that responsibility. The GC determines what needs to be ordered, when it needs to arrive, and who needs to approve it before it can move. When those decisions happen late, the GC is the one scrambling to recover.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            Where procurement breaks down
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Long-lead items surface too late</h3>
              <p className="text-slate-600 leading-relaxed">
                Structural steel, switchgear, elevators, custom curtain wall — these items have lead times measured in months. When they are not identified early enough, the procurement window closes before anyone realizes it.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Submittals sit in review too long</h3>
              <p className="text-slate-600 leading-relaxed">
                Submittals — the documents sent for approval before ordering materials — get stuck in review cycles with no clear deadline. By the time they come back, the order window has passed.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Owner selections drift</h3>
              <p className="text-slate-600 leading-relaxed">
                Finishes, fixtures, and equipment selections require owner decisions. Without hard deadlines tied to the schedule, these decisions get deferred until they become emergencies.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">No one owns the delay</h3>
              <p className="text-slate-600 leading-relaxed">
                When materials arrive late, the finger-pointing starts. Without clear records of who was responsible for which decision and when it was due, the GC absorbs the blame and the cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            How JITpro helps
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Early procurement visibility</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                JITpro identifies all procurement items at the start of the project and maps the decisions, approvals, and lead times behind each one. You see the full procurement picture before construction begins — not when problems show up in the field.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Decision deadlines tied to install dates</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                JITpro works backward from required onsite dates to calculate when each decision must be made. Owners, architects, and engineers see hard deadlines — not suggestions — based on real procurement timing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Clear responsibility assignment</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every procurement item has an assigned decision-maker and a deadline. When approvals are pending, the responsible party knows it. When deadlines pass, the record shows who held the decision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Defensible documentation</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                JITpro maintains a locked audit trail of every approval, revision, and delay. If schedule disputes arise, you have timestamped records showing exactly what happened and who caused it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            Practical benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Fewer schedule surprises from late procurement decisions',
              'Clear accountability when approvals are delayed',
              'Reduced rework caused by out-of-sequence material deliveries',
              'Better coordination between trades on material timing',
              'Less firefighting during construction',
              'Stronger position in delay disputes and change order negotiations',
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-600 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Better procurement control starts early
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
            If your project is entering the transition from design to construction, this is the moment to establish visibility. JITpro helps you take control before delays take control of your project.
          </p>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors"
          >
            See how JITpro works
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
