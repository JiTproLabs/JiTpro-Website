import { useState } from 'react';
import InvestorSectionHeader from '../../components/investor/InvestorSectionHeader';
import { investorStats } from '../../content/investorStats';
import { appendixSources } from '../../content/appendixSources';
import { investorCopy } from '../../content/investorCopy';

const copy = investorCopy.appendix;

type FilterStatus = 'all' | 'verified' | 'provisional' | 'derived';

export default function InvestorAppendix() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredStats = filter === 'all'
    ? investorStats
    : investorStats.filter((s) => s.verificationStatus === filter);

  function getSource(statId: string) {
    return appendixSources.find((s) => s.statId === statId);
  }

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

      {/* Stat library */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <InvestorSectionHeader title="Data library" />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(['all', 'verified', 'provisional', 'derived'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  filter === status
                    ? 'bg-amber-500 text-slate-900 font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-1 text-xs opacity-70">
                    ({investorStats.filter((s) => s.verificationStatus === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-4 py-3 text-slate-500 font-medium">#</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Value</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Metric</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Source</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Status</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Type</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((stat) => {
                  const source = getSource(stat.id);
                  return (
                    <tr key={stat.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="px-4 py-3 text-slate-500">{stat.footnoteKey}</td>
                      <td className="px-4 py-3 text-amber-500 font-semibold whitespace-nowrap">{stat.value}</td>
                      <td className="px-4 py-3 text-slate-300">{stat.label}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{stat.sourceShortName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={stat.verificationStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {source && <TypeBadge type={source.dataType} />}
                      </td>
                      <td className="px-4 py-3">
                        <ConfidenceBadge level={stat.confidenceLevel} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Source details */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader
            title="Source documentation"
            subtitle="Detailed source information and methodological notes for each data point."
          />
          <div className="space-y-4">
            {appendixSources.map((source) => {
              const stat = investorStats.find((s) => s.id === source.statId);
              return (
                <div key={source.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <span className="text-amber-500 font-semibold text-sm mr-2">
                        [{stat?.footnoteKey}]
                      </span>
                      <span className="text-slate-200 font-medium text-sm">{source.sourceName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={source.verificationStatus} />
                      <TypeBadge type={source.dataType} />
                      {source.publicationYear && (
                        <span className="text-xs text-slate-500">{source.publicationYear}</span>
                      )}
                    </div>
                  </div>
                  {stat && (
                    <div className="text-sm text-slate-400 mb-2">
                      <span className="text-amber-500 font-medium">{stat.value}</span>
                      {' — '}
                      {stat.label}
                    </div>
                  )}
                  {source.notes && (
                    <p className="text-xs text-slate-500 leading-relaxed">{source.notes}</p>
                  )}
                  {source.sourceUrl ? (
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-500/70 hover:text-amber-500 mt-2 inline-block"
                    >
                      View source →
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 mt-2 inline-block">
                      Source URL pending verification
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="px-6 py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <InvestorSectionHeader title="Glossary" />
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {copy.glossary.map((entry, i) => (
                  <tr key={i} className="border-b border-slate-700/50 last:border-0">
                    <td className="px-6 py-3 text-amber-500 font-semibold whitespace-nowrap w-32 align-top">
                      {entry.term}
                    </td>
                    <td className="px-6 py-3 text-slate-300">
                      {entry.definition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <InvestorSectionHeader title="Legend" />
          <div className="grid sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-slate-400 font-medium mb-3 uppercase tracking-wider text-xs">Verification status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><StatusBadge status="verified" /><span className="text-slate-400">Confirmed from primary source</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="provisional" /><span className="text-slate-400">Cited but not independently verified</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="derived" /><span className="text-slate-400">Calculated or estimated from other data</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-slate-400 font-medium mb-3 uppercase tracking-wider text-xs">Data type</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><TypeBadge type="direct" /><span className="text-slate-400">Directly reported by source</span></div>
                <div className="flex items-center gap-2"><TypeBadge type="proxy" /><span className="text-slate-400">Representative estimate from survey or report</span></div>
                <div className="flex items-center gap-2"><TypeBadge type="derived" /><span className="text-slate-400">Calculated from multiple inputs</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-slate-400 font-medium mb-3 uppercase tracking-wider text-xs">Confidence level</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><ConfidenceBadge level="high" /><span className="text-slate-400">Strong source, widely corroborated</span></div>
                <div className="flex items-center gap-2"><ConfidenceBadge level="medium" /><span className="text-slate-400">Reasonable source, limited corroboration</span></div>
                <div className="flex items-center gap-2"><ConfidenceBadge level="low" /><span className="text-slate-400">Estimate or single-source data</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    verified: 'bg-green-500/10 text-green-400 border-green-500/30',
    provisional: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    derived: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-sm border ${styles[status] || 'text-slate-500'}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    direct: 'text-green-400',
    proxy: 'text-amber-400',
    derived: 'text-blue-400',
  };
  return (
    <span className={`text-xs ${styles[type] || 'text-slate-500'}`}>
      {type}
    </span>
  );
}

function ConfidenceBadge({ level }: { level: string }) {
  const dots: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const count = dots[level] || 0;
  const colors: Record<string, string> = { high: 'bg-green-400', medium: 'bg-amber-400', low: 'bg-red-400' };
  const color = colors[level] || 'bg-slate-500';
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < count ? color : 'bg-slate-700'}`} />
      ))}
    </div>
  );
}
