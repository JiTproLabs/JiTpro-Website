export default function FounderStory() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Opening */}
      <section className="bg-slate-950 px-6 pt-20 pb-12 md:pt-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 md:gap-12 items-start">
          <div className="md:col-span-2">
            <div className="aspect-4/5 w-full max-w-xs md:max-w-none mx-auto overflow-hidden rounded-xl border border-white/10">
              <img
                src={`${import.meta.env.BASE_URL}assets/team/jeff.jpg`}
                alt="Jeff Kaufman, Founder of JiTpro"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
              From the Founder
            </p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-50 leading-tight mb-8">
              Most construction instability doesn&apos;t begin in the field.
              <br />
              It begins before construction ever starts.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Over nearly four decades in construction, I&apos;ve seen the same pattern repeat itself across different projects, teams, and markets.
            </p>
          </div>
        </div>
      </section>

      {/* The pattern */}
      <section className="border-y border-white/10 bg-slate-900 px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-300 leading-relaxed">
          <div>
            <p>Projects are awarded with incomplete information.</p>
            <p>Critical decisions remain unresolved.</p>
            <p>Procurement timelines are assumed rather than understood.</p>
          </div>

          <p>Those conditions don&apos;t disappear once construction begins.</p>

          <p>
            They become schedule delays, stacked trades, expediting, rework, lost productivity, and margin erosion.
          </p>

          <p className="font-heading text-xl md:text-2xl font-semibold text-slate-100 leading-snug">
            The instability was there from the beginning.
          </p>

          <p>Most contractors don&apos;t see it until they&apos;re paying for it.</p>
        </div>
      </section>

      {/* The turn — discipline */}
      <section className="bg-slate-950 px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-300 leading-relaxed">
          <p className="font-heading text-xl md:text-2xl font-semibold text-slate-100 leading-snug">
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
      <section className="border-y border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg leading-relaxed">
          <p className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-slate-50 leading-snug">
            That discipline became JiTpro.
          </p>
          <div className="space-y-3 text-slate-300">
            <p>JiTpro makes procurement constraints visible before they impact the schedule.</p>
            <p>It gives missing decisions an owner and a deadline.</p>
            <p>It aligns procurement with the realities of construction before work begins.</p>
          </div>
          <div className="space-y-2 text-slate-400">
            <p>It&apos;s not a scheduling tool.</p>
            <p>It&apos;s not a field management tool.</p>
          </div>
          <p className="font-heading text-xl font-semibold text-slate-100">
            It&apos;s the layer of procurement control that should exist before execution ever starts.
          </p>
        </div>
      </section>

      {/* Closing + signature */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-slate-300 leading-relaxed">
          <p>I built JiTpro because projects shouldn&apos;t have to absorb preventable instability.</p>
          <p className="font-heading text-xl md:text-2xl font-semibold text-slate-100 leading-snug">
            Construction schedules should be something you can stand behind.
          </p>
          <div className="pt-8 border-t border-white/10">
            <p className="text-slate-100 font-semibold">— Jeff Kaufman</p>
            <p className="text-slate-400">Founder, JiTpro</p>
          </div>
        </div>
      </section>
    </div>
  );
}
