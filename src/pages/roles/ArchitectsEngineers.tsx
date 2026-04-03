import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ArchitectsEngineers() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            Roles
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            JiTpro for Architects &amp; Engineers
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
Your review and approval decisions directly affect whether materials get ordered on time. But most of the time, you are reviewing submittals without knowing which ones are schedule-critical and which ones can wait. JiTpro changes that.
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
              Architects and engineers are responsible for design intent. On the procurement side, that means reviewing submittals, approving material selections, confirming specifications, and releasing design information that contractors and fabricators need before they can order.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              The challenge is that submittal reviews arrive in batches with no clear priority. Without visibility into which reviews are tied to critical path materials, the ones that matter most can sit in queue behind items that are not schedule-sensitive.
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">Submittals arrive without priority</h3>
              <p className="text-slate-600 leading-relaxed">
                You receive a stack of submittals with no indication of which ones are tied to long-lead materials or critical path work. Everything looks equally urgent — or equally deferrable.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Review deadlines are vague</h3>
              <p className="text-slate-600 leading-relaxed">
                Contracts typically require submittal review within a set number of days, but that timeline is not connected to the actual procurement schedule. A 14-day review window means nothing if the material needed to be ordered last week.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Design decisions are still in progress</h3>
              <p className="text-slate-600 leading-relaxed">
                Sometimes you cannot approve a submittal because the owner has not made a selection, or coordination between disciplines is not complete. But without a structured process, those gaps are invisible until they cause delays.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Blame arrives after the fact</h3>
              <p className="text-slate-600 leading-relaxed">
                When materials are late, the design team often gets blamed for slow reviews — even when the real cause was an upstream decision that was never made. Without clear records, it is difficult to demonstrate what actually happened.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
            How JiTpro helps
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Prioritized review queues</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
JiTpro shows you which submittals are tied to critical path procurement and which ones have more runway. You review the items that matter most to the schedule first — not the ones that happen to land on your desk first.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deadlines tied to real procurement timing</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
Instead of generic contractual review windows, JiTpro provides deadlines based on actual material lead times and required onsite dates. You see exactly when your review must be complete to avoid a schedule impact.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visibility into upstream dependencies</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
When a submittal cannot be approved because a design decision is pending or an owner selection is missing, JiTpro makes that visible. The gap is documented — not assumed to be a review delay.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Protected review record</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every review, approval, revision, and concern you raise is recorded with timestamps. If questions arise later about whether the design team held up procurement, the record speaks for itself.
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
              'Clear visibility into which reviews are schedule-critical',
              'Deadlines based on actual procurement timing, not arbitrary windows',
              'Documentation that protects your team when delays are disputed',
              'Early identification of missing owner decisions blocking your review',
              'Reduced back-and-forth caused by incomplete submittal packages',
              'Better coordination with the GC on procurement sequencing',
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
            Review what matters. Document what happened.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
JiTpro gives your team the context to prioritize reviews and the documentation to protect your position. You focus on design intent. JiTpro handles the procurement timing.
          </p>
          <Link
            to="/contact/architect"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Let's Talk Procurement
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
