
export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Identify scope and generate registry',
      description: 'Use ScopeBuilder to identify all areas of scope. Automatically generate submittal registry from scope items. Tie each item to project milestones.'
    },
    {
      number: '02',
      title: 'Forecast backward from install dates',
      description: 'Set required install dates. JiTpro calculates backward: when materials must arrive, when submittals must approve, when orders must place, when reviews must complete.'
    },
    {
      number: '03',
      title: 'Route approvals with deadlines',
      description: 'Assign approvals to responsible parties with hard deadlines tied to forecast timing. Clear accountability and schedule impact.'
    },
    {
      number: '04',
      title: 'Track, notify, and escalate',
      description: 'Monitor time remaining. Send advance notifications weeks ahead. Escalate approaching deadlines. Record delays with attribution.'
    },
    {
      number: '05',
      title: 'Lock records for audit trail',
      description: 'Finalize approvals with timestamps. Lock records to create immutable history. Maintain legally defensible documentation.'
    }
  ];

  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How JiTpro works
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Transform scope into a managed procurement lifecycle. Forecast timing by working backward from install dates. Enforce accountability at every step.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="pt-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Simple to implement
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
JiTpro integrates with your existing workflow. No process overhaul. Just add the control and accountability layer that prevents schedule delays.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
Your team continues working as they do today. JiTpro simply enforces the timing and documentation that keeps projects on schedule.
          </p>
        </div>
      </section>
    </div>
  );
}
