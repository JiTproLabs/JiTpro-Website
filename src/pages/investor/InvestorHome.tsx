import { Link } from 'react-router-dom';
import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import InvestorStatCard from '../../components/investor/InvestorStatCard';
import { getStatsByIds } from '../../content/investorStats';

const heroStats = getStatsByIds([
  'total-construction-spend',
  'firm-fragmentation',
  'annual-rework-cost',
  'gc-net-margin',
]);

const industryBehavior = [
  'Projects awarded before design is complete',
  'Procurement sequencing left to field teams',
  'Specifications unresolved at mobilization',
  'Decision responsibility undefined',
  'Schedule pressure treated as inevitable',
];

const jitproDiscipline = [
  'Ambiguity made visible at award',
  'Procurement sequenced before mobilization',
  'Missing information assigned to responsible parties',
  'Unresolved items treated as schedule constraints',
  'Decisions aligned to procurement deadlines',
];

const positioningLayers = [
  {
    label: 'ERP / Accounting',
    description: 'Financial reporting, job costing, payroll',
    color: 'bg-slate-700',
  },
  {
    label: 'Field PM / Collaboration',
    description: 'Daily logs, RFIs, punch lists, document management',
    color: 'bg-slate-700',
  },
  {
    label: 'JiTpro — Pre-Mobilization Control',
    description: 'Procurement sequencing, constraint visibility, decision accountability',
    color: 'bg-amber-500/20 border-amber-500',
    highlight: true,
  },
];

export default function InvestorHome() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight mb-8">
            Control before construction.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mb-12">
            JiTpro helps growth-stage contractors establish procurement control before
            mobilization — making unresolved information visible, assigning responsibility,
            and sequencing decisions against real procurement deadlines.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/investor/market"
              className="inline-block px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-sm hover:bg-amber-400 transition-colors"
            >
              View Market Thesis
            </Link>
            <Link
              to="/investor/appendix"
              className="inline-block px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-sm hover:border-slate-400 hover:text-slate-100 transition-colors"
            >
              Review Investor Appendix
            </Link>
          </div>
        </div>
      </section>

      {/* Proof band — stat cards */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {heroStats.map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Core thesis */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader
            title="The problem is embedded early"
            subtitle="Construction instability is not discovered during execution — it is introduced before execution begins."
          />
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Projects routinely start while design decisions remain unresolved, specifications
              are incomplete, procurement sequencing is undefined, and decision responsibilities
              are unassigned. This creates hidden schedule instability, margin leakage, and
              credibility risk from day one.
            </p>
            <p>
              The industry rewards starting. It does not reward sequencing. The result is that
              early-phase risk — the most consequential kind — has no true owner.
            </p>
            <p>
              JiTpro exists to close that gap. It converts ambiguity into structured constraints,
              assigns responsibility for unresolved information, and aligns decisions to
              procurement deadlines — before mobilization, not after field chaos begins.
            </p>
          </div>
        </div>
      </section>

      {/* Why JiTpro exists — comparison */}
      <section className="px-6 py-20 md:py-28 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <InvestorSectionHeader
            title="Why JiTpro exists"
            subtitle="Current industry behavior versus structured procurement control."
            align="center"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {/* Industry behavior */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-slate-400 mb-6 uppercase tracking-wider text-sm">
                Current Industry Behavior
              </h3>
              <ul className="space-y-4">
                {industryBehavior.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* JiTpro discipline */}
            <div className="bg-slate-800 border border-amber-500/30 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-amber-500 mb-6 uppercase tracking-wider text-sm">
                JiTpro Discipline
              </h3>
              <ul className="space-y-4">
                {jitproDiscipline.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Where JiTpro sits — positioning map */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader
            title="Where JiTpro sits"
            subtitle="An empty layer in the construction technology stack — before ERP, before field management."
            align="center"
          />
          <div className="space-y-4">
            {positioningLayers.map((layer, i) => (
              <div
                key={i}
                className={`rounded-lg p-6 border ${
                  layer.highlight
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h4 className={`font-semibold ${layer.highlight ? 'text-amber-500' : 'text-slate-300'}`}>
                    {layer.label}
                  </h4>
                  <p className={`text-sm ${layer.highlight ? 'text-amber-500/70' : 'text-slate-500'}`}>
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Construction timeline flows downward: pre-mobilization → field execution → close-out
          </p>
        </div>
      </section>

      {/* Charts preview */}
      <section className="px-6 py-20 md:py-28 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <InvestorSectionHeader
            title="The data"
            subtitle="Key metrics that frame the market opportunity and the cost of inaction."
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getStatsByIds([
              'on-time-on-budget',
              'manual-procurement',
              'late-owner-selections',
              'lead-time-increase',
              'non-productive-hours',
              'daily-carry-cost',
            ]).map((stat) => (
              <InvestorStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Investor CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
            Explore the full thesis
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Review the market opportunity, examine the hidden economics of early ambiguity,
            and understand why this category is emerging now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/investor/market"
              className="px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-sm hover:bg-amber-400 transition-colors"
            >
              Market Opportunity
            </Link>
            <Link
              to="/investor/hidden-cost"
              className="px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-sm hover:border-slate-400 hover:text-slate-100 transition-colors"
            >
              Hidden Cost
            </Link>
            <Link
              to="/investor/economics"
              className="px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-sm hover:border-slate-400 hover:text-slate-100 transition-colors"
            >
              Economic Case
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
