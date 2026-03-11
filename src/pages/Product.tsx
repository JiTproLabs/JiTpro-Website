import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Product() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Procurement intelligence and forecasting
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            JITpro manages the full procurement lifecycle from scope identification to material delivery. It forecasts risk, enforces decision timing, and maintains complete accountability.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Works alongside your existing project management tools—Procore, Planera, or any other system you use. JITpro adds the procurement intelligence layer they don't provide.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Full-scope procurement lifecycle
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Transform project scope into a managed procurement process. Identify all scope items, generate submittal registries, and tie materials to project milestones. JITpro tracks the entire lifecycle from selection through delivery.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Procurement forecasting
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Work backward from install dates to determine when materials must arrive, when orders must be placed, when approvals must close. See procurement risk weeks ahead, not when it's too late.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Approval routing and visibility
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Route approvals to owners, architects, and engineers with clear timelines. Everyone sees what's pending, who's responsible, and when decisions are due.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Delay attribution
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              When decisions miss deadlines, JITpro records the delay and who caused it. You have a timestamped record of exactly what happened and when.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Locked audit trail
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Once approved, records are locked. No after-the-fact changes. Complete history of every approval, revision, and delay for claims protection and dispute resolution.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Complements your existing tools
          </h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            JITpro integrates with your current PM software. It doesn't replace what you use—it adds the forecasting and procurement control layer those tools don't provide.
          </p>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors"
          >
            See how it works
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
