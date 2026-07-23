import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import JiTproWordmark from '../components/JiTproWordmark';

export default function BrokenBeforeJobStarts() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Construction Schedules Don’t Break | JiTpro';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Minimal top bar */}
      <header className="border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" aria-label="JiTpro home" className="inline-flex items-center">
            <JiTproWordmark variant="amber" />
          </Link>
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
          >
            Visit JiTpro
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-8">
            Construction Schedules Don&rsquo;t Break in the Field.
            <br />
            <span className="text-amber-500">They Show Up Broken.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4">
            <span className="text-amber-500 font-semibold">$31.3B</span> is lost every year to
            rework caused by miscommunication and bad data.
          </p>
          <p className="text-lg md:text-xl text-slate-100 font-semibold leading-relaxed mb-6">
            How much of that was yours?
          </p>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            Not because your team didn&rsquo;t work. Not because the field didn&rsquo;t push.
            Because decisions weren&rsquo;t made in alignment with procurement reality.
          </p>
        </div>
      </section>

      {/* Article body — single continuous dark background */}
      <article className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Opening */}
          <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed border-t border-slate-800/60 pt-12">
            <p>
              Every General Contractor has had a schedule &ldquo;slip.&rdquo; Something gets
              delayed. Trades stack. The sequence breaks. And the story always starts the same:
            </p>
            <blockquote className="border-l-2 border-amber-500 pl-5 italic text-slate-200 my-6">
              &ldquo;We&rsquo;ll figure it out in the field.&rdquo;
            </blockquote>
            <p>That&rsquo;s the mistake.</p>
            <p className="text-xl md:text-2xl text-slate-100 font-semibold leading-snug pt-2">
              Most schedules don&rsquo;t break in the field. They arrive broken.
            </p>
          </div>

          {/* The Cost Nobody Connects */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">
              The Cost Nobody Connects
            </h2>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                That <span className="text-amber-500 font-semibold">$31.3B</span> isn&rsquo;t
                random. It&rsquo;s what shows up <em>after</em> the real problem.
              </p>
              <p className="text-slate-100 font-semibold">Rework is the symptom.</p>
              <p>
                The problem is decisions made out of sequence with procurement. Not earlier. Not
                later. When procurement actually requires them.
              </p>
              <p>Instead:</p>
              <ul className="space-y-2 pl-0 list-none">
                <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Decisions get pushed</span></li>
                <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Selections get forced</span></li>
                <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Procurement disconnects from the schedule</span></li>
              </ul>
              <p>
                By the time the impact is visible, the schedule is already compromised.
              </p>
            </div>
          </section>

          {/* How It Actually Breaks */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">
              How It Actually Breaks
            </h2>
            <ol className="space-y-2 mb-6">
              {[
                'A decision slips',
                'Submittal gets rushed',
                'Reviews drag or loop',
                'Fabrication doesn’t start',
                'Delivery compresses',
                'Trades stack',
                'Sequence breaks',
              ].map((step, i, arr) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-md px-4 py-2.5"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-amber-500/15 text-amber-500 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 text-base">
                    {step}
                    {i < arr.length - 1 && <span className="text-slate-500"> &rarr;</span>}
                  </span>
                </li>
              ))}
            </ol>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                Now the field is forced to absorb it. And they do. But they&rsquo;re no longer
                executing a plan &mdash; they&rsquo;re reacting to one that never held together.
              </p>
            </div>
          </section>

          {/* What This Creates */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">
              What This Creates
            </h2>
            <ul className="space-y-2 pl-0 list-none mb-6 text-base md:text-lg text-slate-300">
              <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Work out of sequence</span></li>
              <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Constant expediting</span></li>
              <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Rework from incomplete decisions</span></li>
              <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Trade interference</span></li>
              <li className="flex gap-3"><span className="text-amber-500 mt-1.5 text-xs">&#9632;</span><span>Management pulled into reaction</span></li>
            </ul>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                This doesn&rsquo;t show up cleanly. It spreads across the entire job.
              </p>
              <p className="text-slate-100 font-semibold">And it leaks out of your margin.</p>
            </div>
          </section>
        </div>
      </article>

      {/* MID-PAGE CTA */}
      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="border border-amber-500/30 bg-linear-to-br from-amber-500/10 to-slate-900/40 rounded-2xl p-8 md:p-10">
            <p className="text-xl md:text-2xl font-bold text-slate-100 leading-snug mb-3">
              If this feels familiar, it&rsquo;s not a field problem.
              <br />
              <span className="text-amber-500">It&rsquo;s a procurement control problem.</span>
            </p>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-7">
              JiTpro brings structure to the decisions your schedule depends on &mdash; before they
              hit the field.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              See how JiTpro works
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Article body — continued */}
      <article className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* The Industry Calls This Normal */}
          <section className="pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">
              The Industry Calls This Normal
            </h2>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                Late decisions.
                <br />
                Chaotic submittals.
                <br />
                Constant expediting.
              </p>
              <p>Then we expect the schedule to hold.</p>
            </div>
          </section>

          {/* The Reality */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">The Reality</h2>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                A schedule is only as strong as the procurement decisions behind it.
              </p>
              <p>
                If those decisions don&rsquo;t follow procurement logic, the schedule is{' '}
                <span className="text-amber-500 font-semibold">fiction</span>.
              </p>
            </div>
          </section>

          {/* What Actually Needs to Change */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">
              What Actually Needs to Change
            </h2>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>This isn&rsquo;t about better coordination. It&rsquo;s about a different system:</p>
              <ul className="space-y-2.5 pl-0 list-none">
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Clarity</span><span className="text-slate-300">what decisions are required</span></li>
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Sequence</span><span className="text-slate-300">in what order they must happen</span></li>
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Logic</span><span className="text-slate-300">how they connect to procurement</span></li>
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Timing</span><span className="text-slate-300">when procurement actually needs them</span></li>
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Control</span><span className="text-slate-300">so the team isn&rsquo;t overloaded reacting</span></li>
                <li className="flex gap-3"><span className="text-amber-500 font-semibold shrink-0 w-24">Respect</span><span className="text-slate-300">all project resources are treated as finite and highly valued</span></li>
              </ul>
              <p className="pt-2">
                Because cognitive overload is real. When everything feels urgent, nothing is
                controlled.
              </p>
              <p className="text-slate-100 font-semibold">And that&rsquo;s when mistakes compound.</p>
            </div>
          </section>

          {/* Final Thought */}
          <section className="mt-14 pt-12 border-t border-slate-800/60">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-5">Final Thought</h2>
            <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed">
              <p>
                If your schedule depends on the field to &ldquo;figure it out,&rdquo; it&rsquo;s
                not a schedule.
              </p>
              <p className="flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-3 gap-y-1 text-2xl md:text-3xl text-amber-500 font-bold">
                <span>It&rsquo;s a gamble.</span>
                <span>And the house always wins.</span>
              </p>
            </div>
          </section>
        </div>
      </article>

      {/* FINAL CTA */}
      <section className="px-6 py-20 md:py-24 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="border border-amber-500/30 bg-linear-to-br from-amber-500/10 to-slate-900/40 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-5">
              There&rsquo;s a better way to run a job.
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8">
              JiTpro aligns decisions with procurement reality &mdash; so your schedule is supported
              before construction starts.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Visit JiTpro
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Credibility footer */}
      <footer className="px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" aria-label="JiTpro home" className="inline-flex items-center">
            <JiTproWordmark variant="amber" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
