import { useMemo, useState } from 'react';
import { atlasConfig } from '../config';
import { diagnoseRuntimeAsset, runtimeAssetRetryEvent } from '../lib/assetDiagnostics';
import { useAtlasStore } from '../state/useAtlasStore';
import type { RuntimeAssetHealth, RuntimeAssetKey } from '../types/runtimeAssets';

const definitions: Array<{ key: RuntimeAssetKey; label: string; url?: string; needsRange: boolean }> = [
  { key: 'terrain', label: 'Terrain PMTiles', url: atlasConfig.terrainPmtilesUrl, needsRange: true },
  { key: 'basemap', label: 'Basemap PMTiles', url: atlasConfig.basemapPmtilesUrl, needsRange: true },
  { key: 'roman-roads', label: 'Roman roads', url: atlasConfig.romanRoadsGeojsonUrl, needsRange: false }
];

function statusLabel(health: RuntimeAssetHealth) {
  return health.state.replaceAll('-', ' ');
}

export function DeploymentDiagnostics() {
  const health = useAtlasStore((s) => s.runtimeAssets);
  const setHealth = useAtlasStore((s) => s.setRuntimeAssetHealth);
  const [running, setRunning] = useState(false);
  const configuredCount = useMemo(() => definitions.filter((item) => item.url).length, []);

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
    } finally {
      setRunning(false);
    }
  }

  return <details className="deployment-diagnostics">
    <summary><span>Deployment diagnostics</span><strong>{configuredCount} configured</strong></summary>
    <div className="deployment-diagnostics__body">
      <p>Run this after deploying to verify browser CORS access. PMTiles checks also require byte-range responses.</p>
      {definitions.map((item) => <div className="deployment-health" key={item.key}>
        <div><strong>{item.label}</strong><small>{item.url ? 'configured' : 'optional / not configured'}{item.needsRange ? ' · Range required' : ''}</small></div>
        <span className={`deployment-health__state deployment-health__state--${health[item.key].state}`}>{statusLabel(health[item.key])}</span>
        {health[item.key].message && <p>{health[item.key].message}</p>}
      </div>)}
      <button type="button" className="secondary-action" onClick={() => void runDiagnostics()} disabled={running}>{running ? 'Checking…' : 'Run diagnostics / retry'}</button>
      <small className="deployment-diagnostics__note">A failed external asset must degrade to the bundled map shell rather than block atlas data or historical content.</small>
    </div>
  </details>;
}
