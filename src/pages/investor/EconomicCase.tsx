import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import InvestorStatCard from '../../components/investor/InvestorStatCard';
import { getStatsByIds } from '../../content/investorStats';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.economics;

const marginStats = getStatsByIds([
  'gc-net-margin',
  'daily-carry-cost',
  'precon-margin-lift',
]);

export default function EconomicCase() {
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
          <div className="grid sm:grid-cols-3 gap-6">
            {marginStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Margin behavior */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.marginBehavior.title} />
          <p className="text-slate-300 leading-relaxed">{copy.marginBehavior.body}</p>
        </div>
      </section>

      {/* Avoided delay */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.avoidedDelay.title} />
          <p className="text-slate-300 leading-relaxed">{copy.avoidedDelay.body}</p>
        </div>
      </section>

      {/* Asymmetry */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.asymmetry.title} />
          <p className="text-slate-300 leading-relaxed mb-8">{copy.asymmetry.body}</p>

          {/* Asymmetric value visual */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-3">Cost of control</div>
                <div className="h-16 flex items-end justify-center">
                  <div className="w-16 bg-amber-500/30 border border-amber-500/50 rounded-t" style={{ height: '20%' }} />
                </div>
                <div className="text-amber-500 font-semibold mt-2 text-sm">Small, predictable</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-3">Cost of no control</div>
                <div className="h-16 flex items-end justify-center">
                  <div className="w-16 bg-red-500/30 border border-red-500/50 rounded-t h-full" />
                </div>
                <div className="text-red-400 font-semibold mt-2 text-sm">Large, compounding</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 text-center">
              Asymmetric economics: the downside of inaction far exceeds the cost of discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing logic */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.pricingLogic.title} />
          <p className="text-slate-300 leading-relaxed">{copy.pricingLogic.body}</p>
        </div>
      </section>

      {/* First win */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title={copy.firstWin.title} />
          <p className="text-slate-300 leading-relaxed">{copy.firstWin.body}</p>
        </div>
      </section>

      {/* Illustrative model */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader
            title={copy.illustrativeModel.title}
            subtitle={copy.illustrativeModel.subtitle}
          />
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {copy.illustrativeModel.rows.map((row, i) => {
                  const isLast = i === copy.illustrativeModel.rows.length - 1;
                  const isRisk = row.label.includes('risk');
                  return (
                    <tr
                      key={i}
                      className={`border-b border-slate-700 last:border-0 ${
                        isLast ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className={`px-6 py-4 text-sm ${isRisk ? 'text-red-400' : 'text-slate-300'}`}>
                        {row.label}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-medium ${
                        isLast ? 'text-amber-500' : isRisk ? 'text-red-400' : 'text-slate-200'
                      }`}>
                        {row.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            {copy.illustrativeModel.footnote}
          </p>
        </div>
      </section>
    </div>
  );
}
