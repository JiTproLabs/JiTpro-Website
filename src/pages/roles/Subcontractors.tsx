import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Subcontractors() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
            Roles
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            JiTpro for Subcontractors
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
You are often the first to feel the impact of late procurement decisions — and the last to know they are coming. When materials do not show up on time, your crew sits idle, your schedule compresses, and your margin disappears. JiTpro gives you visibility into the decisions that affect your work before they become problems.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-8 pb-4 border-b border-white/10">
            Your role in procurement
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              Subcontractors are responsible for executing their scope of work on schedule. That means having the right materials on site at the right time — but many of those materials depend on submittals, approvals, and selections that are managed by others.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              You submit your shop drawings and product data, then wait. You may not know where your submittal is in the review process, whether an owner decision is holding it up, or how close you are to missing your fabrication window.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-8 pb-4 border-b border-white/10">
            Where procurement breaks down
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Approved submittals come back late</h3>
              <p className="text-slate-400 leading-relaxed">
                You submit shop drawings on time, but the review takes weeks longer than expected. By the time approval comes back, your fabrication lead time pushes the delivery past the installation window.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Owner selections are not made</h3>
              <p className="text-slate-400 leading-relaxed">
                You cannot order finishes, fixtures, or equipment until the owner makes a selection. If that decision is delayed, your procurement timeline compresses — but you are still expected to meet the original install date.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Coordination gaps between trades</h3>
              <p className="text-slate-400 leading-relaxed">
                Your work depends on other trades completing theirs first. When their materials are late, your start date shifts — but no one adjusts the downstream schedule until the damage is done.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Acceleration costs fall on you</h3>
              <p className="text-slate-400 leading-relaxed">
                When procurement delays compress your installation window, you are asked to accelerate — overtime crews, expedited shipping, out-of-sequence work. The cost of someone else's late decision becomes your problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-8 pb-4 border-b border-white/10">
            How JiTpro helps
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Visibility into your submittal status</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro shows you where your submittals are in the review process, who is responsible for the next action, and how much time remains before a delay impacts your procurement timeline.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Early warning on upstream decisions</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
If an owner selection or design decision that affects your scope is running behind, JiTpro surfaces that risk early. You know about it before it becomes a compressed fabrication window.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Clear documentation of delay causes</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
When procurement delays affect your work, JiTpro records who caused the delay and when it occurred. If you are asked to accelerate due to someone else's late decision, you have documentation to support your position.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Coordination with other trades</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro maps dependencies between trades so you can see how upstream procurement delays might affect your start date. Better visibility means fewer surprises when you are ready to mobilize.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-8 pb-4 border-b border-white/10">
            Practical benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Visibility into where your submittals are and who is holding them',
              'Early warning when upstream decisions threaten your timeline',
              'Documentation to support change orders caused by others\' delays',
              'Better planning for fabrication and delivery timing',
              'Reduced idle crew time from materials arriving late',
              'Clearer communication with the GC on procurement status',
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-lg text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Stop absorbing the cost of someone else's late decision
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
JiTpro gives subcontractors the visibility and documentation they need to protect their schedule, their margin, and their position when procurement decisions drift.
          </p>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400"
          >
            See the JiTpro Control Process
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
