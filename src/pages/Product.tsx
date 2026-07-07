import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const entryPoints = [
  {
    title: 'One project',
    body: 'Apply JiTpro to a single upcoming job. No company-wide rollout, no migration, no retraining every project manager.',
  },
  {
    title: 'One procurement plan',
    body: 'Every critical package sequenced backward from the dates the field actually needs it.',
  },
  {
    title: 'One set of constraints',
    body: 'The decisions, approvals, and releases threatening margin on that job, made visible early enough to act.',
  },
];

const projectFlow = [
  'Buyout Subcontracts & PO’s',
  'Final Design & Engineering',
  'Final Selections',
  'Submittal Coordination & Prep',
  'Review Cycles & Approvals',
  'Fulfillment',
  'Shipping/Delivery',
  'Onsite & Ready',
];

const constraintRows = [
  {
    constraint: 'Window & door finish selection',
    owner: 'Owner',
    due: '12 days',
    consequence: 'Fabrication slot lost — dry-in slides',
  },
  {
    constraint: 'Millwork shop drawings',
    owner: 'Architect',
    due: '8 days',
    consequence: 'Finish sequence breaks — trades stack',
  },
  {
    constraint: 'Process equipment release',
    owner: 'Engineer',
    due: '21 days',
    consequence: 'Long-lead delivery misses startup',
  },
  {
    constraint: 'Switchgear utility approval',
    owner: 'Utility + engineer',
    due: '21 days',
    consequence: 'Power-on date at risk',
  },
];

const projectTypes = [
  'Custom residential',
  'Estate homes',
  'Wineries',
  'Hospitality',
  'Complex private construction',
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function Product() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_86%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              A consultancy-first program for general contractors
            </p>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-50 md:text-6xl lg:text-7xl">
              Start with one project. Protect the margin already at risk.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              JiTpro gives general contractors a procurement control system for the next project—without requiring a company-wide software overhaul. Start with one job at award, expose the decisions and constraints that will threaten the schedule, and protect the 3–4% of revenue that procurement failures quietly consume.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact/contractor"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Protect your next project
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                See the JiTpro Control Process
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>The problem</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                You are not losing margin because you are a bad builder.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                Most general contractors lose margin because procurement risk is invisible until it becomes a field problem. The owner decision that slipped, the submittal waiting on an answer, the long-lead release nobody flagged—none of it shows up until the field is already paying for it.
              </p>
              <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                JiTpro brings that risk forward while there is still time to act on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>The entry point</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                The entry point is intentionally simple.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                JiTpro is not asking you to rebuild your company, adopt an enterprise system, or change how every project manager works overnight. It runs as a consultancy-first program: we stand up procurement control with you on one project, starting at award—before procurement pressure ever reaches the field.
              </p>
              <p className="mt-4 font-heading text-xl font-semibold leading-snug text-slate-100">
                JiTpro is not a rescue plan for a job already in trouble. The time to engage is early—at award, during buyout, before mobilization—while every option is still open.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-400">
                It works alongside whatever you already run—Procore, spreadsheets, or a PM&apos;s memory. JiTpro adds the procurement control layer those tools do not provide, without replacing them.
              </p>
            </div>

            <div className="grid gap-4">
              {entryPoints.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-white/[0.03] p-6">
                  <h3 className="font-heading text-xl font-bold text-slate-100">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Project-level control</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Organized around how your project actually moves.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              JiTpro does not impose a generic workflow. It follows the path every package already takes—and shows you where that path is at risk.
            </p>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {projectFlow.map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                <p className="mb-5 font-mono text-xs text-slate-500">0{index + 1}</p>
                <h3 className="font-heading text-lg font-bold text-slate-100">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Constraint visibility</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Every constraint has an owner, a date, and a consequence.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              JiTpro tracks what is blocking procurement, who owns the decision, when it is due, and what happens if it slips.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.035] p-3 md:p-4">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/90">
              <div className="border-b border-slate-800 px-5 py-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">One project constraint board</p>
              </div>

              <div className="lg:hidden">
                <div className="divide-y divide-slate-800">
                  {constraintRows.map((row) => (
                    <div key={row.constraint} className="px-5 py-5">
                      <h3 className="font-heading text-lg font-semibold text-slate-100">{row.constraint}</h3>
                      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Who owns it</p>
                          <p className="mt-1 text-slate-300">{row.owner}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Due</p>
                          <p className="mt-1 font-mono text-slate-300">{row.due}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">If it slips</p>
                          <p className="mt-1 text-slate-300">{row.consequence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Constraint</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Who owns it</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Due</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">If it slips</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {constraintRows.map((row) => (
                      <tr key={row.constraint} className="h-14">
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-100">{row.constraint}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-400">{row.owner}</td>
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-slate-300">{row.due}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-300">{row.consequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>The economics</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Protect the 3–4% of revenue procurement quietly consumes.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                The estimate sets the margin. Procurement is your first opportunity to protect it. By the time you&apos;re paying for rework, overtime, resequencing, and expediting, the margin was already lost. The field is simply where the bill comes due.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">On a project of</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-slate-100">$5M</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Revenue at risk</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-slate-100">3–4%</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-amber-500">Margin to protect</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-slate-100">$150–200K</p>
                </div>
              </div>
              <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                JiTpro is not chasing new profit for you. It protects the margin you have already earned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Who it is for</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Built for the projects you actually run.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                JiTpro is built for general contractors managing custom, owner-driven work—where selections are heavy, decisions are personal, and no two jobs repeat.
              </p>
              <div className="flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                  <span key={type} className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-2.5 font-heading text-base font-semibold text-slate-200">
                    {type}
                  </span>
                ))}
              </div>
              <p>
                One-of-a-kind projects concentrate procurement risk: more selections, more owner decisions, more long-lead packages—and more margin exposed when answers arrive late.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel>Start with one project</SectionLabel>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            This is not another platform to roll out.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            You do not need an enterprise transformation to control procurement. Start before the risk reaches the field—on your next project. One job, one procurement plan, one board your team can act on.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Protect your next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/roles/general-contractors"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              See how it works for GCs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
