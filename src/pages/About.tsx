import JiTproWordmark, { brandText } from '../components/JiTproWordmark';

export default function About() {
  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About <JiTproWordmark variant="slate" />
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Built from real construction problems. Designed to fix what actually breaks schedules.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              The problem we solve
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
{brandText('JITpro was built by construction professionals who watched schedules fail because procurement decisions happened too late.')}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
{brandText("The issue wasn't lack of tools. It was lack of enforcement and forecasting. No system made decisions happen on time or showed procurement risk weeks ahead. JITpro fixes this.")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Our mission
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Construction schedules should succeed or fail based on execution, not procurement delays caused by late decisions.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
{brandText('JITpro exists to give construction professionals control over procurement timing and clear accountability when delays occur. Schedule certainty through better procurement intelligence.')}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Who we serve
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
{brandText('JITpro is built for general contractors, owners, developers, and design professionals who understand that procurement timing determines schedule success.')}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
{brandText("If you've ever had a project delay because a material decision came too late, JITpro prevents that from happening again.")}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Serious software for serious problems
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
{brandText('JITpro solves one problem completely: procurement decisions that happen too late and destroy schedules.')}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Forecast procurement risk. Enforce decision timing. Maintain accountability. Protect schedules.
          </p>
        </div>
      </section>
    </div>
  );
}
