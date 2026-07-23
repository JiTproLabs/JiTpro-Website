import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import InvestorStatCard from '../../components/investor/InvestorStatCard';
import { getStatsByIds, getStatById } from '../../content/investorStats';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.hiddenCost;

const costStats = getStatsByIds([
  'annual-rework-cost',
  'non-productive-hours',
  'gc-net-margin',
  'daily-carry-cost',
]);

const delayStats = getStatsByIds([
  'late-owner-selections',
  'rfi-density',
  'on-time-on-budget',
]);

const marginStat = getStatById('gc-net-margin');
const reworkStat = getStatById('annual-rework-cost');

const funnelStages = [
  { label: 'Incomplete design & specifications', impact: 'Unpriced risk enters bids' },
  { label: 'Unassigned decision responsibility', impact: 'Delays have no owner' },
  { label: 'Unsequenced procurement', impact: 'Long-lead items ordered late' },
  { label: 'Reactive RFI generation', impact: 'Information gaps surface in field' },
  { label: 'Schedule compression', impact: 'Overtime, acceleration, crew stacking' },
  { label: 'Margin erosion', impact: 'Profit consumed by avoidable cost' },
];

export default function HiddenCost() {
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
            {costStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Design clarity */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.designClarity.title} />
          <p className="text-slate-300 leading-relaxed">{copy.designClarity.body}</p>
        </div>
      </section>

      {/* Rework */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.rework.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.rework.body}</p>
          {reworkStat && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-amber-500 mb-2">{reworkStat.value}</div>
              <div className="text-slate-400 text-sm">annual rework cost across U.S. construction</div>
              <div className="text-slate-500 text-xs mt-2">{reworkStat.sourceShortName}</div>
            </div>
          )}
        </div>
      </section>

      {/* Margin fragility */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.marginFragility.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.marginFragility.body}</p>
          {marginStat && (
            <div className="bg-slate-800 border border-red-500/30 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">{marginStat.value}</div>
              <div className="text-slate-400 text-sm">average GC net profit margin</div>
              <div className="text-slate-500 text-xs mt-2">Almost no room for error</div>
            </div>
          )}
        </div>
      </section>

      {/* Margin leakage funnel */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-2xl mx-auto">
          <InvestorSectionHeader
            title="How ambiguity becomes margin erosion"
            subtitle="Each stage compounds cost downstream."
            align="center"
          />
          <div className="space-y-0">
            {funnelStages.map((stage, i) => {
              const widthPct = 100 - i * 10;
              return (
                <div key={i} className="flex justify-center">
                  <div
                    className="border-b border-slate-700 py-4 px-6 flex items-center justify-between gap-4"
                    style={{ width: `${widthPct}%` }}
                  >
                    <span className="text-slate-300 text-sm font-medium">{stage.label}</span>
                    <span className="text-slate-500 text-xs text-right shrink-0">{stage.impact}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-2">
            <div className="w-2/5 text-center py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm font-semibold">
              Profit eliminated
            </div>
          </div>
        </div>
      </section>

      {/* Missed decision */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.missedDecision.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.missedDecision.body}</p>

          {/* Cost of delay visual */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-6">
              Cost of delay — $10M project (illustrative)
            </h4>
            <div className="space-y-4">
              {[
                { days: '1 day', low: '$10K', high: '$50K' },
                { days: '1 week', low: '$70K', high: '$350K' },
                { days: '2 weeks', low: '$140K', high: '$700K' },
                { days: '1 month', low: '$300K', high: '$1.5M' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-20 shrink-0">{row.days}</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-red-500 rounded-full"
                      style={{ width: `${(i + 1) * 25}%` }}
                    />
                  </div>
                  <span className="text-slate-300 text-sm w-32 text-right shrink-0">
                    {row.low}–{row.high}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Ranges based on typical general conditions and overhead allocation. Actual costs vary.
            </p>
          </div>
        </div>
      </section>

      {/* Delay economics */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.delayEconomics.title} />
          <p className="text-slate-300 leading-relaxed">{copy.delayEconomics.body}</p>
        </div>
      </section>

      {/* RFI density */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.rfiDensity.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.rfiDensity.body}</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {delayStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline: ambiguity → compression */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader
            title="What starts as ambiguity becomes schedule compression"
            align="center"
          />
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {[
              { phase: 'Award', state: 'Ambiguity', color: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-500' },
              { phase: 'Pre-mobilization', state: 'Unresolved decisions', color: 'border-orange-500/40 bg-orange-500/10', text: 'text-orange-400' },
              { phase: 'Mobilization', state: 'Missing information', color: 'border-red-500/40 bg-red-500/10', text: 'text-red-400' },
              { phase: 'Execution', state: 'Schedule compression', color: 'border-red-600/40 bg-red-600/10', text: 'text-red-500' },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                {i > 0 && (
                  <div className="hidden md:block w-full h-px bg-slate-700 -mt-px" />
                )}
                <div className={`w-full border rounded-lg p-5 text-center ${step.color}`}>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{step.phase}</div>
                  <div className={`text-sm font-semibold ${step.text}`}>{step.state}</div>
                </div>
                {i < 3 && (
                  <div className="text-slate-600 py-2 md:hidden">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
