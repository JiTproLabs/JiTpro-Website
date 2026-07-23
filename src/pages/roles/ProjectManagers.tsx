import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProjectManagers() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
            Roles
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            JiTpro for Project Managers &amp; Construction Managers
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
You manage the schedule, the budget, and the coordination between every party on the project. But procurement — the one area that causes the most schedule damage — is usually tracked in spreadsheets, emails, and memory. JiTpro gives you a structured system to manage procurement timing before it becomes a crisis.
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
              Project managers and construction managers are the operational center of the project. You build the schedule, run the meetings, track the budget, and coordinate between the owner, design team, GC, and subcontractors.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              On the procurement side, you are responsible for making sure materials arrive when they are needed. That means tracking submittals, following up on approvals, monitoring lead times, and flagging problems before they hit the field. In practice, most of that tracking happens informally — and that is where things fall through.
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
            <div className="rounded-xl border border-slate-800 bg-white/3 p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Procurement tracking is scattered</h3>
              <p className="text-slate-400 leading-relaxed">
                Submittal logs live in one system. Lead time information lives in emails. Owner selections are tracked on spreadsheets. There is no single view of where procurement stands across the entire project.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/3 p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Follow-ups rely on memory</h3>
              <p className="text-slate-400 leading-relaxed">
                You know you need to follow up on that steel submittal and the owner's tile selection — but with dozens of items in flight, things fall through the cracks. By the time you remember, the procurement window has closed.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/3 p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Schedule updates lag behind reality</h3>
              <p className="text-slate-400 leading-relaxed">
                The project schedule shows planned material delivery dates, but those dates are not connected to the actual status of submittals and approvals. The schedule looks clean while procurement is already behind.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-white/3 p-8">
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Reporting takes too much time</h3>
              <p className="text-slate-400 leading-relaxed">
                Owners and executives want procurement status updates. Building those reports manually from scattered sources takes hours — and the information is already outdated by the time it is assembled.
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
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Single view of all procurement</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro consolidates every procurement item, submittal, approval, and decision into one system. You see the status of every item, who is responsible, and how much time remains — without chasing emails or updating spreadsheets.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Scheduled notifications and escalation</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro sends advance notifications when deadlines are approaching and escalates items that are at risk. You do not have to remember what needs follow-up — the system handles it.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Procurement schedule aligned to construction schedule</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
JiTpro ties procurement timing to actual installation dates. You see whether materials will arrive on time based on the current status of decisions and approvals — not based on hopeful assumptions in the schedule.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">Ready-made accountability records</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Every action is recorded with timestamps. When you need to report to the owner, explain a delay, or support a schedule claim, the documentation is already built — you do not have to reconstruct it.
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
              'One place to see every procurement item and its status',
              'Scheduled follow-ups instead of manual tracking',
              'Procurement timing tied to the actual construction schedule',
              'Less time building reports, more time managing the project',
              'Early visibility into items at risk of causing schedule delay',
              'Documentation ready for owner updates, claims, and disputes',
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 shrink-0" />
                <p className="text-lg text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Manage procurement the way you manage the schedule
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
JiTpro gives project managers the structure to control procurement timing, the playbook to reduce manual tracking, and the documentation to protect the project when decisions drift.
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
