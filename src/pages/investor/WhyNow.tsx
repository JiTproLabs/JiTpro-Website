import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import InvestorStatCard from '../../components/investor/InvestorStatCard';
import { getStatsByIds } from '../../content/investorStats';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.whyNow;

const urgencyStats = getStatsByIds([
  'lead-time-increase',
  'manual-procurement',
  'late-owner-selections',
  'on-time-on-budget',
]);

const complexityStack = [
  { label: 'Owner expectations', description: 'Higher standards for predictability and communication' },
  { label: 'Design complexity', description: 'More integrated systems, more material options' },
  { label: 'Supply-chain volatility', description: 'Lead times 2–4x longer than pre-2020 norms' },
  { label: 'Labor scarcity', description: 'Fewer skilled workers, less schedule recovery capacity' },
  { label: 'Manual workflows', description: '60%+ still using Excel for procurement' },
];

export default function WhyNow() {
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

      {/* Stat band */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {urgencyStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Supply chain */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.supplyChain.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.supplyChain.body}</p>

          {/* Lead-time volatility visual */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-6">
              Lead-time shifts by category (illustrative)
            </h4>
            <div className="space-y-5">
              {[
                { category: 'Electrical switchgear', before: '8–12 wks', after: '36–52 wks', pctBefore: 15, pctAfter: 65 },
                { category: 'HVAC equipment', before: '6–10 wks', after: '24–40 wks', pctBefore: 12, pctAfter: 50 },
                { category: 'Structural steel', before: '8–14 wks', after: '20–30 wks', pctBefore: 18, pctAfter: 38 },
                { category: 'Custom millwork', before: '10–16 wks', after: '16–28 wks', pctBefore: 20, pctAfter: 35 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{item.category}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 w-20 shrink-0">{item.before}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden relative">
                      <div
                        className="absolute h-full bg-slate-500 rounded-full"
                        style={{ width: `${item.pctBefore}%` }}
                      />
                      <div
                        className="absolute h-full bg-amber-500 rounded-full opacity-70"
                        style={{ width: `${item.pctAfter}%` }}
                      />
                    </div>
                    <span className="text-xs text-amber-500 w-20 text-right shrink-0">{item.after}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-0.5">
                    <span className="text-slate-600">Pre-2020</span>
                    <span className="text-amber-500/60">Current</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Ranges are representative. Actual lead times vary by supplier, region, and specification.
            </p>
          </div>
        </div>
      </section>

      {/* Labor */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.labor.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.labor.body}</p>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Labor pressure indicators
            </h4>
            <ul className="space-y-3">
              {[
                'Average age of skilled construction workers continues to rise',
                'Fewer entrants into construction trades programs',
                'Schedule slips caused by labor shortages cannot be recovered through overtime',
                'Competitive labor market increases cost of crew mobilization and retention',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Complexity */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.complexity.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.complexity.body}</p>

          {/* Complexity stack */}
          <div className="space-y-3">
            {complexityStack.map((layer, i) => (
              <div
                key={i}
                className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <span className="text-slate-200 font-medium">{layer.label}</span>
                <span className="text-slate-500 text-sm">{layer.description}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Each layer adds decision complexity before mobilization
          </p>
        </div>
      </section>

      {/* Owner expectations */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.ownerExpectations.title} />
          <p className="text-slate-300 leading-relaxed">{copy.ownerExpectations.body}</p>
        </div>
      </section>

      {/* Spreadsheets break at scale */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.spreadsheetFailure.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.spreadsheetFailure.body}</p>

          {/* Manual vs structured comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-red-500/20 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">
                Manual / Spreadsheet
              </h4>
              <ul className="space-y-3">
                {[
                  'No single source of truth',
                  'Version conflicts across team',
                  'No automated deadline tracking',
                  'Responsibility unclear',
                  'No constraint visibility',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                    <span className="mt-1 text-red-400 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 border border-amber-500/30 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
                Structured Control (JiTpro)
              </h4>
              <ul className="space-y-3">
                {[
                  'Centralized procurement status',
                  'Real-time team alignment',
                  'Automated deadline enforcement',
                  'Clear responsibility assignment',
                  'Constraints surfaced proactively',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="mt-1 text-amber-500 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Procurement drives schedule */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.procurementDrivesSchedule.title} />
          <p className="text-slate-300 leading-relaxed">{copy.procurementDrivesSchedule.body}</p>
        </div>
      </section>
    </div>
  );
}
