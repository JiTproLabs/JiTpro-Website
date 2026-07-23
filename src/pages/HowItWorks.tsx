import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const phases = [
  {
    number: '01',
    title: 'Assess the Project',
    body: [
      'JiTpro reviews the drawings, specifications, schedule, and procurement strategy—looking for long-lead items, missing decisions, coordination risks, constraints, and schedule exposure before any of it can impact construction.',
      'The assessment answers the question every GC should be able to answer at award, and almost never can: where is this job already exposed?',
    ],
    deliverables: [
      'Executive Procurement Risk Assessment',
      'Initial Constraint Register',
      'Priority Action List',
    ],
  },
  {
    number: '02',
    title: 'Build the Procurement Plan',
    body: [
      'Every material, product, and service on the job is organized into a structured procurement plan—with milestones, responsible parties, and the dates the field actually needs each package onsite.',
      'The plan works backward from required onsite dates, so date pressure is visible months before it becomes field pressure.',
    ],
    deliverables: [
      'Specification Register',
      'Procurement Register',
      'Procurement Schedule',
    ],
  },
  {
    number: '03',
    title: 'Assign Accountability',
    body: [
      'Every decision, approval, review, and constraint is assigned to a responsible party with a required completion date—and linked to the procurement activity it can delay.',
      'Open items stop floating in meeting minutes and memory. Accountability is separated from blame: the register shows who owns the answer, not who to point at.',
    ],
    deliverables: [
      'Decision & Deadline Matrix',
      'Constraint Register',
      'Responsible Party Assignments',
    ],
  },
  {
    number: '04',
    title: 'Monitor Procurement',
    body: [
      'JiTpro monitors procurement progress week over week—identifying emerging risks, tracking deadlines, and keeping critical activities moving before delays reach the field.',
      'Your team sees the same board: what is moving, what is stalled, and what needs attention this week.',
    ],
    deliverables: [
      'Weekly Procurement Dashboard',
      'Executive Status Reports',
      'Action Tracking',
      'Constraint Management',
    ],
  },
  {
    number: '05',
    title: 'Recover Before Margin Is Lost',
    body: [
      'When a procurement activity starts to slip, JiTpro identifies the cause, recommends corrective action, and develops a recovery strategy—while the delay is still a paperwork problem, not a field problem.',
      'This is where the process pays for itself: the slip that would have surfaced as a field crisis in eight weeks gets resolved as a decision this week.',
    ],
    deliverables: [
      'Procurement Recovery Plan',
      'Schedule Impact Analysis',
      'Executive Recommendations',
    ],
  },
];

const noTransformation = [
  'No company-wide rollout.',
  'No disruptive implementation.',
  'No months of configuration.',
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
      {children}
    </p>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_86%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-300/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              Consulting-first. Software-supported.
            </p>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-50 md:text-6xl lg:text-7xl">
              The JiTpro Control Process
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              What happens after you hire JiTpro? A consulting engagement, supported by the JiTpro system, that takes one project&apos;s procurement from unknown to under control—in five phases.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact/contractor"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Protect your next project
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/6 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                See the Single Project Approach
              </Link>
            </div>
          </div>
        </div>
      </section>

      {phases.map((phase, index) => (
        <section
          key={phase.number}
          className={
            index % 2 === 1
              ? 'border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28'
              : 'bg-slate-950 px-6 py-20 md:py-28'
          }
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div>
                <SectionLabel>{`Phase ${phase.number}`}</SectionLabel>
                <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                  {phase.title}
                </h2>
                <div className="mt-6 space-y-4 text-lg leading-8 text-slate-300">
                  {phase.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Deliverables
                </p>
                <div className="grid gap-3">
                  {phase.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                      <CheckCircle2 className="shrink-0 text-amber-400" size={18} />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-y border-white/10 bg-slate-900 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>No transformation required</SectionLabel>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Start with One Project
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              <p>
                Most software asks you to transform the company before you see value. JiTpro does not. Start with one upcoming project, one procurement plan, and one set of constraints.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {noTransformation.map((line) => (
                  <div key={line} className="rounded-xl border border-white/10 bg-slate-950/60 p-4 font-heading text-lg font-semibold leading-snug text-slate-100">
                    {line}
                  </div>
                ))}
              </div>
              <p className="font-heading text-2xl font-semibold leading-snug text-slate-100">
                JiTpro helps protect the 3–4% of project revenue that procurement failures quietly consume.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel>The first step</SectionLabel>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            Put your next project under control.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            The Control Process starts with an assessment of one project—drawings, schedule, and procurement strategy—before a single package is at risk in the field.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Protect your next project
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/6 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              See the Single Project Approach
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
