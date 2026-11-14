import { useMemo, useState } from 'react';
import ProcurementChain from '../../components/demo/screens/procurement-chain/ProcurementChain';
import {
  buildSteelWindowsChain,
  CHAIN_LABELS,
  CHAIN_REQUIRED_ON_SITE,
} from '../../components/demo/screens/procurement-chain/chainScenario';

/**
 * PROCUREMENT CHAIN LAB - dev-only (Design System Section 51; Decision Log
 * 2026-11-07). The isolated preview of the new Procurement Chain, outside the
 * homepage. The Required On Site control proves the scenario's claim that
 * every date follows the one fixed anchor: change it and the whole chain,
 * its commitments and its issue move together, relationships intact.
 */
export default function ProcurementChainLab() {
  const [ros, setRos] = useState(CHAIN_REQUIRED_ON_SITE);
  const item = useMemo(() => buildSteelWindowsChain(ros), [ros]);

  return (
    <main className="min-h-screen bg-jp-surface-light px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 text-jp-ink-secondary">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em]">Demo lab · isolated preview</p>
            <p className="text-[0.9375rem]">Procurement Chain - not yet on the homepage.</p>
          </div>
          <label className="flex items-center gap-3 text-[0.875rem]">
            <span>Required On Site (lab control)</span>
            <input
              type="date"
              value={ros}
              onChange={(e) => e.target.value && setRos(e.target.value)}
              className="rounded-md border border-jp-ink-secondary/40 bg-jp-surface-white px-2 py-1 text-jp-background"
            />
            {ros !== CHAIN_REQUIRED_ON_SITE && (
              <button
                type="button"
                onClick={() => setRos(CHAIN_REQUIRED_ON_SITE)}
                className="rounded-md border border-jp-ink-secondary/40 px-2 py-1"
              >
                Reset
              </button>
            )}
          </label>
        </div>
        <ProcurementChain key={ros} item={item} labels={CHAIN_LABELS} />
      </div>
    </main>
  );
}
