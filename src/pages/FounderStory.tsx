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
              Over nearly four decades in construction, I've seen the same pattern repeat itself across different projects, teams, and markets.
            </p>
          </div>
        </div>
      </section>

      {/* The pattern */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-700 leading-relaxed">
          <div>
            <p>Projects are awarded with incomplete information.</p>
            <p>Critical decisions remain unresolved.</p>
            <p>Procurement timelines are assumed rather than understood.</p>
          </div>

          <p>Those conditions don't disappear once construction begins.</p>

          <p>
            They become schedule delays, stacked trades, expediting, rework, lost productivity, and margin erosion.
          </p>

          <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            The instability was there from the beginning.
          </p>

          <p>Most contractors don't see it until they're paying for it.</p>
        </div>
      </section>

      {/* The turn — discipline */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-700 leading-relaxed">
          <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            After watching this happen over and over, I stopped accepting it as normal.
          </p>
          <p>I developed a simple discipline:</p>
          <ul className="space-y-3 border-l-2 border-amber-500 pl-6">
            <li>Identify constraints early</li>
            <li>Assign ownership for unresolved information</li>
            <li>Sequence procurement from the date materials, products, and services are required onsite</li>
            <li>Commit only to schedules that can be supported</li>
          </ul>
        </div>
      </section>

      {/* JiTpro reveal */}
      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto space-y-8 text-lg leading-relaxed">
          <p className="text-2xl md:text-3xl font-semibold leading-snug">
            That discipline became JiTpro.
          </p>
          <div className="space-y-3 text-slate-300">
            <p>JiTpro makes procurement constraints visible before they impact the schedule.</p>
            <p>It gives missing decisions an owner and a deadline.</p>
            <p>It aligns procurement with the realities of construction before work begins.</p>
          </div>
          <div className="space-y-2 text-slate-300">
            <p>It's not a scheduling tool.</p>
            <p>It's not a field management tool.</p>
          </div>
          <p className="text-xl text-white font-medium">
            It's the layer of procurement control that should exist before execution ever starts.
          </p>
        </div>
      </section>

      {/* Closing + signature */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-700 leading-relaxed">
          <p>I built JiTpro because projects shouldn't have to absorb preventable instability.</p>
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
