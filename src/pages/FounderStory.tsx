export default function FounderStory() {
  return (
    <div>
      {/* Opening */}
      <section className="px-6 pt-20 pb-12 md:pt-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 md:gap-12 items-start">
          <div className="md:col-span-2">
            <div className="aspect-[4/5] w-full max-w-xs md:max-w-none mx-auto overflow-hidden rounded-xl bg-slate-100 shadow-sm">
              <img
                src={`${import.meta.env.BASE_URL}assets/team/jeff.jpg`}
                alt="Jeff Kaufman, Founder of JiTpro"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
              From the Founder
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
              Most construction instability doesn't begin in the field.
              <br />
              It begins before construction ever starts.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              I've spent 38 years watching that play out — on jobsites, in project offices, across more than $450 million in managed work over the past 20 years — with nearly four decades in construction behind it.
            </p>
          </div>
        </div>
      </section>

      {/* The pattern */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-10 text-lg text-slate-700 leading-relaxed">
          <div className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            <p>Different markets.</p>
            <p>Different teams.</p>
            <p>Different decades.</p>
            <p className="mt-4">Same pattern.</p>
          </div>

          <div>
            <p>Projects awarded with incomplete drawings.</p>
            <p>Selections unresolved.</p>
            <p>Procurement timelines that never had a chance of supporting the schedule.</p>
          </div>

          <p>Those aren't minor oversights.</p>

          <p className="text-xl font-medium text-slate-900">
            They're constraints built into the job before anyone mobilizes.
          </p>

          <div>
            <p>The instability is already there.</p>
            <p>
              It just shows up later — when the schedule starts slipping, trades stack on top of each other, and the project begins to bleed.
            </p>
          </div>
        </div>
      </section>

      {/* What I watched */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-10 text-lg text-slate-700 leading-relaxed">
          <div className="space-y-4">
            <p>I watched great project managers hold that together through sheer effort.</p>
            <p>
              Late nights. Constant calls.
              <br />
              Tracking things no system was tracking.
            </p>
            <p>And when they left — the system left with them.</p>
          </div>

          <div className="space-y-4">
            <p>I watched contractors promise expedited delivery dates they had no realistic way to meet.</p>
            <p>
              Not because they were careless.
              <br />
              Because they didn't have visibility into what procurement actually required.
            </p>
            <p>Those promises don't disappear.</p>
            <div>
              <p>They turn into pressure.</p>
              <p>Rework.</p>
              <p>Cost.</p>
              <p>And months of trying to recover time that was never there.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The turn — discipline */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-700 leading-relaxed">
          <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            At some point, I stopped accepting that as normal.
          </p>
          <p>I made it a discipline:</p>
          <ul className="space-y-3 border-l-2 border-amber-500 pl-6">
            <li>Identify constraints at project award</li>
            <li>Assign responsibility for unresolved information</li>
            <li>Sequence procurement backward from required onsite dates</li>
            <li>And never commit to a schedule I couldn't defend</li>
          </ul>
        </div>
      </section>

      {/* JiTpro reveal */}
      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto space-y-8 text-lg leading-relaxed">
          <p className="text-2xl md:text-3xl font-semibold leading-snug">
            That discipline is what JiTpro is.
          </p>
          <p className="text-xl text-slate-200">
            JiTpro is the system I wish I had for 38 years.
          </p>
          <div className="space-y-3 text-slate-300">
            <p>It makes procurement constraints visible early.</p>
            <p>It gives every missing decision an owner and a deadline.</p>
            <p>It aligns real lead times with the schedule before construction begins.</p>
          </div>
          <div className="space-y-2 text-slate-300">
            <p>It's not a field management tool.</p>
            <p>It's not a scheduling tool.</p>
          </div>
          <p className="text-xl text-white font-medium">
            It's the layer before execution that construction has always been missing.
          </p>
        </div>
      </section>

      {/* Closing + signature */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-700 leading-relaxed">
          <p>I built it because this pattern doesn't have to repeat.</p>
          <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            Construction schedules should be something you can stand behind.
          </p>
          <div className="pt-8 border-t border-slate-200">
            <p className="text-slate-900 font-semibold">— Jeff Kaufman</p>
            <p className="text-slate-600">Founder, JiTpro</p>
          </div>
        </div>
      </section>
    </div>
  );
}
