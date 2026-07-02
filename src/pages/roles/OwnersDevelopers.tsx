import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function OwnersDevelopers() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
            Roles
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            JiTpro for Owners &amp; Developers
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
Your decisions drive procurement. Material selections, finish approvals, equipment choices — these are owner decisions, and each one has a deadline tied to the construction schedule. JiTpro makes those deadlines visible so you can make decisions on time instead of finding out after the fact that a delay started with you.
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
              Owners and developers fund the project and make the decisions that shape it. On the procurement side, that means approving material selections, signing off on equipment specifications, and authorizing purchases — often for items that have long manufacturing or fabrication lead times.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              The challenge is understanding which decisions are truly time-sensitive. Not every approval is equally urgent, but without visibility into procurement timing, it is difficult to know which choices need to be made now and which ones can wait.
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
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Selections are requested without context</h3>
              <p className="text-slate-400 leading-relaxed">
                You receive a list of selections to make but no clear indication of which ones are schedule-critical. Without that context, lower-priority decisions get attention while time-sensitive ones wait.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Schedule impact is invisible</h3>
              <p className="text-slate-400 leading-relaxed">
                You may not realize that delaying an equipment decision by two weeks pushes a delivery date by three months. The connection between your decision timeline and the construction schedule is not visible.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Change orders appear without warning</h3>
              <p className="text-slate-400 leading-relaxed">
                When procurement delays cause schedule compression, the cost shows up as change orders for acceleration, overtime, or re-sequencing. The root cause — a late decision — is often obscured by the time the bill arrives.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/[0.03] p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Disputes lack clear records</h3>
              <p className="text-slate-400 leading-relaxed">
                When delays occur, determining who was responsible for what and when becomes a matter of interpretation. Without a structured record, owners can end up paying for delays that were not their responsibility.
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
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Decisions prioritized by schedule impact</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro shows you which of your pending decisions are tied to critical path materials and long-lead items. You see what needs to happen now versus what has more runway — so your time goes where it matters most.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Clear deadlines with consequences</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Each decision has a deadline based on actual procurement lead times and required onsite dates. You see exactly how much time remains and what happens to the schedule if the decision is late.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Visibility into the full procurement chain</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro shows you the complete path from your decision to material delivery. You understand the downstream impact of your choices — not just the approval itself, but the fabrication, shipping, and installation that follows.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Protected approval record</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Every decision you make is recorded with timestamps in a locked audit trail. If disputes arise later, you have clear documentation of what you approved, when you approved it, and that your decisions were made on time.
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
              'Clear understanding of which decisions are schedule-critical',
              'Fewer surprise change orders caused by late procurement',
              'Visibility into how your timeline connects to the construction schedule',
              'Documentation that protects you in delay disputes',
              'Better communication with the GC and design team on timing',
              'Confidence that your project schedule is being protected',
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
            Know which decisions matter most — and when they are due
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
JiTpro gives owners the visibility to make timely procurement decisions and the documentation to prove it. Your decisions drive the schedule — make sure you know when they are needed.
          </p>
          <Link
            to="/contact/owner"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400"
          >
            Let's Talk Procurement
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
