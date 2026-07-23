import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import InvestorStatCard from '../../components/investor/InvestorStatCard';
import { getStatsByIds } from '../../content/investorStats';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.market;

const growthStageStats = getStatsByIds([
  'total-construction-spend',
  'residential-spend',
  'firm-fragmentation',
  'core-growth-stage',
]);

const fragmentationStats = getStatsByIds([
  'residential-gc-count',
  'total-target-firms',
  'manual-procurement',
]);

export default function MarketOpportunity() {
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

      {/* U.S. market scale */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <InvestorSectionHeader title={copy.scale.title} />
          <p className="text-slate-300 leading-relaxed max-w-3xl mb-12">{copy.scale.body}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthStageStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Relevant segment spend */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.segmentSpend.title} />
          <p className="text-slate-300 leading-relaxed">{copy.segmentSpend.body}</p>
        </div>
      </section>

      {/* Fragmentation */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <InvestorSectionHeader title={copy.fragmentation.title} />
          <p className="text-slate-300 leading-relaxed max-w-3xl mb-12">{copy.fragmentation.body}</p>

          {/* Fragmentation pyramid */}
          <div className="max-w-lg mx-auto space-y-3">
            {[
              { label: '~380K total GC establishments', width: 'w-full', bg: 'bg-slate-700' },
              { label: '~350K+ residential GCs', width: 'w-5/6', bg: 'bg-slate-700' },
              { label: '91% have <20 employees', width: 'w-4/6', bg: 'bg-slate-700' },
              { label: '~45K growth-stage (10–99 emp)', width: 'w-3/6', bg: 'bg-amber-500/20 border border-amber-500/40' },
            ].map((tier, i) => (
              <div key={i} className={`${tier.width} mx-auto`}>
                <div className={`${tier.bg} rounded-sm px-4 py-3 text-center text-sm text-slate-300`}>
                  {tier.label}
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-slate-500 mt-4">
              JiTpro's core segment highlighted
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {fragmentationStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Growth-stage GC profile */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.growthStage.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.growthStage.body}</p>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
              Growth-Stage GC Profile
            </h4>
            <ul className="space-y-3">
              {copy.growthStage.profilePoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why fragmentation matters */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.whyFragmentationMatters.title} />
          <p className="text-slate-300 leading-relaxed">{copy.whyFragmentationMatters.body}</p>
        </div>
      </section>

      {/* Not enterprise-only */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.notEnterprise.title} />
          <p className="text-slate-300 leading-relaxed">{copy.notEnterprise.body}</p>
        </div>
      </section>

      {/* Market size visual */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title="Market sizing" align="center" />
          <div className="space-y-4">
            {[
              { label: 'Total U.S. construction', value: '$1.98T', pct: 100 },
              { label: 'Residential construction', value: '$890B', pct: 45 },
              { label: 'Growth-stage GC segment (est.)', value: '$50–150B', pct: 7, highlight: true },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={bar.highlight ? 'text-amber-500' : 'text-slate-400'}>{bar.label}</span>
                  <span className={bar.highlight ? 'text-amber-500 font-semibold' : 'text-slate-300'}>{bar.value}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.highlight ? 'bg-amber-500' : 'bg-slate-600'}`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Growth-stage segment estimate is illustrative, based on firm count and average project value ranges.
          </p>
        </div>
      </section>
    </div>
  );
}
