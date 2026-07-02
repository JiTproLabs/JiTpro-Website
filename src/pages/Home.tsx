import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  FileWarning,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProcurementFailureVideo } from '../components/ProcurementFailureSection';

const chainSteps = [
  'Unresolved answer',
  'Missed release',
  'Lost fabrication window',
  'Late delivery',
  'Field recovery',
];

const solutionSteps = [
  {
    icon: Eye,
    title: 'Expose what is unresolved',
    body: 'Decisions, approvals, assumptions, releases, fabrication windows, and outside constraints are made visible before they become field problems.',
  },
  {
    icon: UserCheck,
    title: 'Show who still owns the answer',
    body: 'JiTpro separates accountability from blame so you can see what has moved onto your project without pretending you control every upstream decision.',
  },
  {
    icon: Clock3,
    title: 'Sequence when it must move',
    body: 'The project works backward from when the field needs each package, so your team can see the date pressure before margin becomes recovery cost.',
  },
];

const outcomes = [
  'Open decisions stop hiding in meetings and memory.',
  'Critical packages are visible before the field is waiting.',
  'Margin exposure is tied to the project, not buried in a generic task list.',
];

const projectSignals = [
  'Selections still moving',
  'Submittals waiting on answers',
  'Approvals consuming float',
  'Long-lead items not released',
  'Delivery dates disconnected from field need',
  'PMs chasing risk from memory',
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_86%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-36">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-heading text-5xl font-extrabold tracking-tight text-slate-50 md:text-7xl lg:text-8xl">
              The next event that erodes your margin is already in motion.
            </h1>
            <p className="mx-auto mt-6 font-heading text-2xl font-semibold tracking-tight text-slate-300 md:text-4xl lg:text-5xl">
              It just hasn&apos;t become visible in the field, yet.
            </p>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              Every missed owner decision, unresolved design item, hidden assumption, and delayed release quietly erodes your margin—until the field is forced into recovery.
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
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>The problem</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Margin disappears when clarity comes too late.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                Most contractors do not lose margin because something failed in the field.
              </p>
              <p>
                They lose it when the field is forced to recover from decisions, approvals, releases, fabrication windows, or deliveries that should have been resolved earlier.
              </p>
              <p>
                And growth makes it worse. The visibility that ran three projects out of your head does not stretch to eight. Nothing in the field changed—you ran out of room to see everything coming.
              </p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">You probably do not call it procurement.</p>
                <p className="mt-3 text-slate-300">
                  You call it waiting on shop drawings. Waiting on owner selections. Waiting on utility approvals. Waiting on long-lead releases. That is procurement—the path from decision to delivery—and it is running on every one of your projects whether anyone is managing it or not.
                </p>
              </div>
              <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                When that path breaks, the schedule absorbs it first. Then the margin does.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Why it happens</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Risk transfers before the work begins.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                The moment a project is awarded, unresolved owner decisions, incomplete design, open assumptions, and external constraints begin moving toward you.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {['You may not own the decision.', 'You may not control the design.', 'You may not control the utility, approval, selection, or vendor response.'].map((line) => (
                  <div key={line} className="rounded-xl border border-white/10 bg-slate-950/60 p-4 font-heading text-lg font-semibold leading-snug text-slate-100">
                    {line}
                  </div>
                ))}
              </div>
              <p>
                But once the project starts, the schedule pressure lands on you anyway.
              </p>
              <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-xl font-semibold text-slate-100">
                  Silent Risk Transfer
                  <span className="text-sm text-amber-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4 space-y-4 text-slate-300">
                  <p>
                    Upstream uncertainty becomes downstream responsibility before anyone names it, sequences it, or assigns it a date.
                  </p>
                  <p>
                    JiTpro gives that transferred risk a visible structure so your team can see what has moved onto your plate, who still owns the answer, and when it must be resolved—while there is still time to act.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>How margin becomes recovery</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              One missed answer does not stay one missed answer.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              It moves through the project one handoff at a time until recovery starts spending the margin you expected to keep.
            </p>
          </div>

          <div className="mt-14 grid gap-3 lg:grid-cols-5">
            {chainSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? 'bg-amber-500' : index < 4 ? 'bg-orange-500' : 'bg-red-500'}`} />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-100">{step}</h3>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
            <SectionLabel>You have lived this one</SectionLabel>
            <div className="space-y-4 text-lg leading-8 text-slate-300">
              <p>
                The owner sits on the window finish selection for three weeks. Nobody chases it, because windows feel like a long way off. The package misses its fabrication slot, delivery slides six weeks, and dry-in slides with it.
              </p>
              <p>
                Now you are resequencing trades, paying for temporary protection, and buying overtime to hold the completion date.
              </p>
              <p className="font-heading text-xl font-semibold leading-snug text-slate-100">
                Buyout said that job carried $110,000 of margin. Recovery spent $40,000 of it. Nothing failed in the field—the answer was just late.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur md:p-4">
              <ProcurementFailureVideo />
            </div>
            <p className="mt-4 text-center text-sm text-slate-400">
              Press play to watch a planned procurement schedule meet reality.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>The JiTpro approach</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Turn hidden risk into a project control plan.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                JiTpro is not a field tool and not another scheduler. It is the layer before execution: one place that holds every critical package&apos;s path from decision to delivery.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-400">
                It does not ask you to rebuild your company. It starts with one project and makes the margin threats visible while there is still time to control them.
              </p>
            </div>

            <div className="grid gap-4">
              {solutionSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-slate-800 bg-white/[0.03] p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-slate-100">{item.title}</h3>
                        <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>What changes</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Your team stops carrying project risk in their heads.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {outcomes.map((point) => (
              <div key={point} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
                <CheckCircle2 className="mb-5 text-amber-400" size={24} />
                <p className="text-lg leading-8 text-slate-200">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionLabel>Start where the risk is</SectionLabel>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
              If these are showing up on one upcoming project, start there.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              JiTpro is not a rescue tool. It is the system you put in place before the next project starts absorbing preventable procurement pressure.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <div className="grid gap-3">
              {projectSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <FileWarning className="text-amber-400" size={18} />
                  <span className="text-slate-200">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:items-center">
            <div className="mx-auto w-full max-w-[280px] lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                <img
                  src={`${import.meta.env.BASE_URL}assets/team/jeff.jpg`}
                  alt="Jeff Kaufman, Founder of JiTpro"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <div>
              <SectionLabel>Built by a builder</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                &ldquo;JiTpro is the system I wish I had for 38 years.&rdquo;
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Jeff Kaufman has spent 38 years in construction, with hundreds of millions in managed work over the past 20. Different markets, different teams, same pattern: projects awarded with incomplete drawings, selections unresolved, and procurement timelines that never had a chance of supporting the schedule.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                JiTpro is that experience turned into a system: identify the constraints at award, give every missing answer an owner and a deadline, and sequence procurement backward from the dates the field actually needs.
              </p>
              <Link
                to="/founder-story"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Read Jeff&apos;s story
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <ShieldCheck size={28} />
          </div>
          <SectionLabel>Start with one upcoming project</SectionLabel>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            You do not need to change how your whole company works.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Start with the next project. Put its critical packages on one board—what is unresolved, who owns the answer, and when it must move—while there is still time to act on it.
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
