import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.product;

export default function InvestorProduct() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 leading-tight mb-6">
            {copy.hero.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            {copy.hero.subtitle}
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.whatItIs.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.whatItIs.body}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Makes ambiguity visible on day one',
              'Converts risk into sequence',
              'Protects contractor credibility',
              'Stabilizes execution before mobilization',
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 border border-amber-500/20 rounded-lg p-5 text-sm text-slate-300">
                <span className="text-amber-500 mr-2">—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it is not */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.whatItIsNot.title} />
          <div className="space-y-4">
            {copy.whatItIsNot.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 text-slate-400">
                <span className="mt-0.5 text-slate-600 shrink-0">✕</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader
            title={copy.howItWorks.title}
            subtitle="A structured sequence from contract award through mobilization."
          />

          {/* Pre-mobilization workflow */}
          <div className="space-y-0">
            {copy.howItWorks.steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-amber-500 font-semibold text-sm shrink-0">
                    {i + 1}
                  </div>
                  {i < copy.howItWorks.steps.length - 1 && (
                    <div className="w-px flex-1 bg-slate-700 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <h4 className="text-lg font-semibold text-slate-200 mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Constraint ownership map */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader
            title="Constraint ownership"
            subtitle="Every unresolved item has a responsible party."
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { party: 'Owner', examples: 'Material selections, finish decisions, allowance allocations' },
              { party: 'Architect / Engineer', examples: 'Specification completion, design clarifications, submittal reviews' },
              { party: 'Subcontractor', examples: 'Shop drawing submissions, product data, lead-time confirmation' },
              { party: 'GC Team', examples: 'Buyout execution, procurement sequencing, schedule integration' },
            ].map((role, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                <h4 className="text-amber-500 font-semibold text-sm mb-3">{role.party}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{role.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly rhythm */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.weeklyRhythm.title} />
          <p className="text-slate-300 leading-relaxed">{copy.weeklyRhythm.body}</p>
        </div>
      </section>

      {/* Decision-to-install diagram */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader
            title="Decision-to-install timeline"
            subtitle="JiTpro works backward from required onsite dates to establish decision deadlines."
            align="center"
          />
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-stretch gap-0">
              {[
                { phase: 'Decision deadline', desc: 'Owner/architect must decide by this date', color: 'text-amber-500', border: 'border-amber-500/40' },
                { phase: 'Submittal window', desc: 'Sub prepares and submits shop drawings', color: 'text-slate-300', border: 'border-slate-600' },
                { phase: 'Review cycle', desc: 'Architect reviews and approves', color: 'text-slate-300', border: 'border-slate-600' },
                { phase: 'Fabrication / lead time', desc: 'Material manufactured and shipped', color: 'text-slate-300', border: 'border-slate-600' },
                { phase: 'Required onsite', desc: 'Material must arrive for installation', color: 'text-amber-500', border: 'border-amber-500/40' },
              ].map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className={`w-full border rounded-sm p-4 text-center ${step.border}`}>
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${step.color}`}>
                      {step.phase}
                    </div>
                    <div className="text-xs text-slate-500">{step.desc}</div>
                  </div>
                  {i < 4 && (
                    <div className="text-slate-600 py-1 md:rotate-0">→</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-6 text-center">
              JiTpro enforces this sequence for every procurement item on the project.
            </p>
          </div>
        </div>
      </section>

      {/* System not point fix */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.systemNotFix.title} />
          <p className="text-slate-300 leading-relaxed">{copy.systemNotFix.body}</p>
        </div>
      </section>
    </div>
  );
}
