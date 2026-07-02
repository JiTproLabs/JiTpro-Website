import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const exposureRows = [
  {
    item: 'Structural Steel',
    waitingOn: 'Connection details',
    consequence: 'Fabrication blocked',
    exposure: 'CRITICAL',
    tone: 'critical',
  },
  {
    item: 'Custom Steel Doors & Windows',
    waitingOn: 'Frame + glazing approval',
    consequence: 'Release delayed • Fab slot missed',
    exposure: 'HIGH',
    tone: 'critical',
  },
  {
    item: 'HVAC',
    waitingOn: 'Mech room coordination',
    consequence: 'Submittal + fabrication delayed',
    exposure: 'HIGH',
    tone: 'high',
  },
  {
    item: 'Electrical Switch Gear',
    waitingOn: 'Utility + electrical approval',
    consequence: 'Manufacturing slot lost • Startup delayed',
    exposure: 'CRITICAL',
    tone: 'critical',
  },
];

const pressureSteps = [
  'Decision not made',
  'Approval window slips',
  'Release date moves',
  'Fabrication starts late',
  'Field absorbs the cost',
];

const controlLayers = [
  {
    icon: UserCheck,
    title: 'Owners',
    body: 'Every decision, approval, and constraint has an accountable owner before it becomes field pressure.',
  },
  {
    icon: Clock3,
    title: 'Dates',
    body: 'Required-on-site dates drive the sequence backward through submittals, releases, fabrication, and delivery.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk',
    body: 'Priority is visible early enough to coordinate, not after the schedule has already compressed.',
  },
];

const proofPoints = [
  'Built by a 38+ year contractor, not a software team guessing at construction.',
  'Designed for growth-stage GCs where one missed item can erase projected profit.',
  'Focused on procurement control: the path from decision to delivery.',
];

const projectSignals = [
  'Selections still moving',
  'Submittals waiting on answers',
  'Approvals consuming float',
  'Long-lead items not released',
  'Delivery dates disconnected from field need',
  'PMs chasing risk from memory',
];

function StatusBadge({ tone, children }: { tone: string; children: string }) {
  const classes = {
    attention: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    risk: 'border-red-500/30 bg-red-500/10 text-red-200',
    stable: 'border-slate-600 bg-slate-800 text-slate-300',
    critical: 'border-red-500/30 bg-red-500/10 text-red-200',
    high: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}>
      {children}
    </span>
  );
}

function MarginExposureBadge({ tone, children }: { tone: string; children: string }) {
  const classes = tone === 'critical'
    ? 'border-red-500/50 bg-red-500/15 text-red-100'
    : 'border-orange-500/50 bg-orange-500/15 text-orange-100';
  const dotClass = tone === 'critical'
    ? 'bg-red-500 shadow-red-500/40'
    : 'bg-orange-500 shadow-orange-500/40';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] ${classes}`}>
      <span className={`h-2 w-2 rounded-full shadow-[0_0_12px] ${dotClass}`} />
      {children}
    </span>
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
              Your next margin loss is already underway.
            </h1>
            <p className="mx-auto mt-6 font-heading text-2xl font-semibold tracking-tight text-slate-300 md:text-4xl lg:text-5xl">
              It just hasn't shown up in your schedule yet.
            </p>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              Every missed owner decision, unresolved design item, delayed release, and hidden assumption quietly erodes your margin—until the field is forced into recovery.
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

          <div className="mx-auto mt-16 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur md:p-4">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/90">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Next project control board</p>
                  <h2 className="mt-1 font-heading text-xl font-700 text-slate-100">Current Margin Exposure</h2>
                </div>
                <StatusBadge tone="critical">4 Critical Margin Risks</StatusBadge>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full table-fixed border-collapse text-left text-sm">
                  <colgroup>
                    <col className="w-[28%]" />
                    <col className="w-[30%]" />
                    <col className="w-[28%]" />
                    <col className="w-[14%]" />
                  </colgroup>
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr className="font-medium">
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Critical Package</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Waiting On</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Next Consequence</th>
                      <th className="whitespace-nowrap px-5 py-3 font-medium">Margin Exposure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {exposureRows.map((row) => (
                      <tr key={row.item} className="h-16">
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-100">{row.item}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-400">{row.waitingOn}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-300">{row.consequence}</td>
                        <td className="whitespace-nowrap px-5 py-4"><MarginExposureBadge tone={row.tone}>{row.exposure}</MarginExposureBadge></td>
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
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">The problem</p>
              <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-5xl">
                Most schedule failures arrive already built into the project.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                The field usually does not create the failure. It reveals the decisions that slipped, approvals that stalled, and releases that missed the date the job actually needed.
              </p>
              <p className="font-heading text-2xl font-600 leading-snug text-slate-100">
                You probably do not call it procurement. You call it waiting on cabinets, windows, selections, shop drawings, or long-lead materials.
              </p>
              <p>
                JiTpro gives that work a controlled structure so your team can see what is unresolved, who owns it, and when it has to move.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">The chain reaction</p>
            <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-5xl">
              One missed item does not stay one missed item.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              It moves through the project one handoff at a time until recovery starts spending the margin you expected to keep.
            </p>
          </div>

          <div className="mt-14 grid gap-3 lg:grid-cols-5">
            {pressureSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-slate-950/60 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? 'bg-amber-500' : index < 4 ? 'bg-red-400' : 'bg-red-500'}`} />
                </div>
                <h3 className="font-heading text-lg font-700 text-slate-100">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">The JiTpro framework</p>
              <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-5xl">
                Control the path from decision to delivery.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Procurement is the sequence of decisions, approvals, submittals, releases, fabrication, and delivery that must happen before the field can build. JiTpro makes that sequence visible early enough to control it.
              </p>
            </div>

            <div className="grid gap-4">
              {controlLayers.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-slate-800 bg-white/[0.03] p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-700 text-slate-100">{item.title}</h3>
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

      <section className="bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">What changes</p>
            <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-5xl">
              Your team stops managing procurement from memory.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
                <CheckCircle2 className="mb-5 text-amber-400" size={24} />
                <p className="text-lg leading-8 text-slate-200">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Project signals</p>
            <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-5xl">
              If these are already showing up, the job is asking for control.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              JiTpro is not a rescue tool. It is the system you put in place before the next project starts absorbing preventable procurement pressure.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <div className="grid gap-3">
              {projectSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <PackageCheck className="text-amber-400" size={18} />
                  <span className="text-slate-200">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <ShieldCheck size={28} />
          </div>
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Start with one upcoming project</p>
          <h2 className="font-heading text-4xl font-700 tracking-tight text-slate-50 md:text-6xl">
            See what your next project is waiting on before the field finds out.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Send the basics. We will help identify the decisions, approvals, releases, fabrication windows, and delivery risks most likely to cost schedule or margin.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Review my next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/founder-story"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Read Jeff’s story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
