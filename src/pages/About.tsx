export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            About JiTpro
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Built from real construction problems. Designed to fix what actually breaks schedules.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-50 mb-4">
              The problem we solve
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              JiTpro was built by construction professionals who watched schedules fail because procurement decisions happened too late.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              The issue wasn't lack of tools. It was lack of enforcement and forecasting. No system made decisions happen on time or showed procurement risk weeks ahead. JiTpro fixes this.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-50 mb-4">
              Our mission
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              Construction schedules should succeed or fail based on execution, not procurement delays caused by late decisions.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              JiTpro exists to give construction professionals control over procurement timing and clear accountability when delays occur. Schedule certainty through better procurement control.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-50 mb-4">
              Who we serve
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              JiTpro is built for general contractors, owners, developers, and design professionals who understand that procurement timing determines schedule success.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              If you've ever had a project delay because a material decision came too late, JiTpro prevents that from happening again.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-50 mb-6">
            Serious software for serious problems
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            JiTpro solves one problem completely: procurement decisions that happen too late and destroy schedules.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            Forecast procurement risk. Enforce decision timing. Maintain accountability. Protect schedules.
          </p>
        </div>
      </section>
    </div>
  );
}
