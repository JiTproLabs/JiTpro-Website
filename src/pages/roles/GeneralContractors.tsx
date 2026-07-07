import { ArrowRight, CheckCircle2, Flame, Repeat, ShieldCheck, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const repeatedMistakes = [
  'Selections were not final when procurement needed them.',
  'Submittals moved slower than the schedule allowed.',
  'Release dates slipped before anyone treated them as critical.',
  'Fabrication windows closed while the team was still chasing answers.',
  'Delivery dates moved, and the field had to absorb the impact.',
  'The job finished, but the profit did not land where it was supposed to.',
];

const hiddenCosts = [
  {
    title: 'PM time',
    body: 'Hours spent chasing answers, checking status, re-sending emails, and trying to remember which item is about to become urgent.',
  },
  {
    title: 'Superintendent pressure',
    body: 'Field teams resequence work, stack trades, and solve problems that were already moving upstream weeks earlier.',
  },
  {
    title: 'Expediting and recovery',
    body: 'Rush shipping, overtime, remobilization, and compressed coordination all get treated like normal project cost.',
  },
  {
    title: 'Profit uncertainty',
    body: 'You know the job missed. What is harder to see is how much was consumed by procurement firefighting before the field ever got a fair shot.',
  },
];

const structureItems = [
  {
    title: 'Identify the constraints',
    body: 'What decisions, details, selections, approvals, and information are required before procurement can move?',
  },
  {
    title: 'Sequence the work backward',
    body: 'Start with the date the product or service is required and work backward through submittal, approval, release, fabrication, and delivery.',
  },
  {
    title: 'Clarify who needs to act',
    body: 'Bring inherited constraints into the open early so the project team has time to coordinate instead of react.',
  },
  {
    title: 'Keep procurement moving',
    body: 'Create a rhythm that shows what is waiting, what is next, and what will cost the project if timing slips.',
  },
];

export default function GeneralContractors() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white px-6 py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, rgba(245,158,11,0.20), transparent 30%), radial-gradient(circle at 80% 8%, rgba(148,163,184,0.10), transparent 28%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
            For growth-stage general contractors
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] mb-8">
            Stop repeating the same mistakes that cost you profit last time.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            Every contractor has said it after a hard job: “We are not making those same mistakes again.”
          </p>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto mb-10">
            Then the next project starts. Decisions are still unresolved. Submittals still wait on missing information. Release dates still move. The team still fights the same procurement fires — and the margin gets hit again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact/contractor"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7 py-4 text-base md:text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Review my next project
              <ArrowRight size={20} />
            </Link>
            <a
              href="#same-mistakes"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 text-base md:text-lg font-semibold rounded-lg hover:border-white/45 transition-colors"
            >
              Show me the pattern
            </a>
          </div>
        </div>
      </section>

      {/* SAME MISTAKES */}
      <section id="same-mistakes" className="border-y border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              Contractor to contractor
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-6">
              The painful part is not that the project was hard. It is that the pattern was familiar.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              You knew the last job could have gone better. You knew decisions came late. You knew procurement was being chased instead of led. You knew your team spent too much time recovering.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-center">
                <Repeat size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-100">The same misses keep showing up</h3>
            </div>
            <ul className="space-y-4">
              {repeatedMistakes.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <CheckCircle2 className="text-amber-400 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-slate-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ALREADY DO THE WORK */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              You already procure everything
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-6">
              The work is already happening. It just lacks the structure to reliably support the schedule.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Every project already requires management of buyout, selections, submittals, approvals, releases, fabrication, delivery coordination, and follow-up. The question is not whether procurement work is happening. The question is whether it is sequenced early enough to prevent compounding margin loss later in the project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {hiddenCosts.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-white/[0.03] p-6">
                <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIREFIGHTING COST */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <div>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              The hidden cost
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-6">
              Reactive procurement feels cheaper because nobody is measuring the time it burns.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Most GCs already spend the time and money. They spend it late, under pressure, with fewer options, while the field is waiting and the team is trying to recover.
            </p>
            <p className="font-heading text-xl font-semibold text-slate-100 leading-relaxed">
              JiTpro moves that effort earlier, where it can protect the schedule instead of rescuing it.
            </p>
          </div>
          <div className="rounded-3xl border border-red-300/20 bg-red-500/10 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="text-red-300" size={32} />
              <h3 className="font-heading text-2xl font-bold text-slate-100">Firefighting is still procurement work</h3>
            </div>
            <div className="space-y-4 text-slate-200 leading-relaxed">
              <p>Chasing late approvals is procurement work.</p>
              <p>Expediting a missed release is procurement work.</p>
              <p>Resequencing the field around late material is procurement work.</p>
              <p className="text-red-100 font-semibold pt-2">It is just procurement work done after the project has already lost leverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT JITPRO DOES */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              What JiTpro changes
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-6">
              JiTpro gives the GC a repeatable way to keep procurement from running the job.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              This is not about adding more meetings or more paperwork. It is about giving the procurement process enough structure to support the schedule before the team is forced into reaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {structureItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-white/[0.03] p-6 hover:border-amber-500/40 transition-colors">
                <h3 className="font-heading text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFIT / WHY NOW */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-stretch">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-7 md:p-9">
            <TrendingDown className="text-red-300 mb-6" size={40} />
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-50 leading-tight mb-5">
              Thin margins leave no room to keep learning the same lesson.
            </h2>
            <p className="text-slate-300 leading-relaxed">
              In a tighter market, one bad procurement item can consume the profit the project was supposed to produce. The job does not need ten failures. Sometimes one missed chain of decisions, approvals, release, fabrication, and delivery is enough.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-7 md:p-9">
            <ShieldCheck className="text-amber-300 mb-6" size={40} />
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-50 leading-tight mb-5">
              The goal is to stop the repeat before the next project starts.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-7">
              JiTpro helps the GC reveal inherited constraints, sequence procurement steps, coordinate decisions early, and keep the project from falling back into the same reactive pattern.
            </p>
            <Link
              to="/contact/contractor"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-7 py-4 text-lg font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Review my next project
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
            One project is enough to start
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-6">
            You do not need to overhaul the company to stop repeating the same procurement mistakes.
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10">
            Start with one upcoming project. Identify the constraints. Sequence the procurement steps. Give the team a plan before the pressure starts.
          </p>
          <Link
            to="/contact/contractor"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-8 py-4 text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Start with one project
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
