import { useMemo, useState } from 'react';
import { atlasConfig, terrainSources } from '../config';
import { diagnoseRuntimeAsset, runtimeAssetRetryEvent } from '../lib/assetDiagnostics';
import { useAtlasStore } from '../state/useAtlasStore';
import type { RuntimeAssetHealth, RuntimeAssetKey } from '../types/runtimeAssets';

const definitions: Array<{ key: RuntimeAssetKey; label: string; url?: string; needsRange: boolean }> = [
  { key: 'terrain', label: 'Global terrain PMTiles', url: atlasConfig.terrainPmtilesUrl, needsRange: true },
  { key: 'basemap', label: 'Basemap PMTiles', url: atlasConfig.basemapPmtilesUrl, needsRange: true },
  { key: 'roman-roads', label: 'Roman roads', url: atlasConfig.romanRoadsGeojsonUrl, needsRange: false }
];

type LocalProbe = { state: RuntimeAssetHealth['state']; message?: string };

function statusLabel(health: RuntimeAssetHealth | LocalProbe) {
  return health.state.replaceAll('-', ' ');
}

export function DeploymentDiagnostics() {
  const health = useAtlasStore((s) => s.runtimeAssets);
  const setHealth = useAtlasStore((s) => s.setRuntimeAssetHealth);
  const [regionalHealth, setRegionalHealth] = useState<Record<string, LocalProbe>>({});
  const [running, setRunning] = useState(false);
  const configuredCount = useMemo(() => definitions.filter((item) => item.url).length + terrainSources.filter((item) => item.url).length, []);

  async function runDiagnostics() {
    setRunning(true);
    try {
      await Promise.all(definitions.map(async (item) => {
        if (!item.url) {
          setHealth(item.key, { state: 'not-configured', message: 'Optional asset is not configured.' });
          return;
        }
        setHealth(item.key, { state: 'checking', message: 'Checking browser access…', url: item.url });
        const result = await diagnoseRuntimeAsset(item.key, item.url);
        setHealth(item.key, result);
        if (result.state === 'ready' || result.state === 'degraded') {
          window.dispatchEvent(new CustomEvent(runtimeAssetRetryEvent, { detail: { key: item.key } }));
        }
      }));

      const uniqueRegionalUrls = new Map<string, string[]>();
      for (const source of terrainSources) {
        if (!source.url) continue;
        const ids = uniqueRegionalUrls.get(source.url) || [];
        ids.push(source.id);
        uniqueRegionalUrls.set(source.url, ids);
      }
      await Promise.all([...uniqueRegionalUrls.entries()].map(async ([url, ids]) => {
        for (const id of ids) setRegionalHealth((current) => ({ ...current, [id]: { state: 'checking', message: 'Checking CORS + byte ranges…' } }));
        const result = await diagnoseRuntimeAsset('terrain', url);
        for (const id of ids) setRegionalHealth((current) => ({ ...current, [id]: { state: result.state, message: result.message } }));
      }));
    } finally {
      setRunning(false);
    }
  }

  return <details className="deployment-diagnostics">
    <summary><span>Deployment diagnostics</span><strong>{configuredCount} configured</strong></summary>
    <div className="deployment-diagnostics__body">
      <p>Run this after deploying to verify browser CORS access. PMTiles checks also require byte-range responses.</p>
      <small className="deployment-diagnostics__note">Build branch: {atlasConfig.deployBranch}</small>
      {definitions.map((item) => <div className="deployment-health" key={item.key}>
        <div><strong>{item.label}</strong><small>{item.url ? 'configured' : 'optional / not configured'}{item.needsRange ? ' · Range required' : ''}</small></div>
        <span className={`deployment-health__state deployment-health__state--${health[item.key].state}`}>{statusLabel(health[item.key])}</span>
        {health[item.key].message && <p>{health[item.key].message}</p>}
      </div>)}
      <section className="deployment-regions" aria-label="Regional terrain diagnostics">
        <h4>Regional terrain archives</h4>
        {terrainSources.map((source) => {
          const local = regionalHealth[source.id] || { state: source.url ? 'idle' : 'not-configured' as const };
          return <div className="deployment-health" key={source.id}>
            <div><strong>{source.label}</strong><small>{source.url ? 'regional PMTiles configured · Range required' : 'not configured'}</small></div>
            <span className={`deployment-health__state deployment-health__state--${local.state}`}>{statusLabel(local)}</span>
            {local.message && <p>{local.message}</p>}
          </div>;
        })}
      </section>
      <button type="button" className="secondary-action" onClick={() => void runDiagnostics()} disabled={running}>{running ? 'Checking…' : 'Run diagnostics / retry'}</button>
      <small className="deployment-diagnostics__note">A failed external asset must degrade to the bundled map shell rather than block atlas data or historical content.</small>
    </div>
  </details>;
}
