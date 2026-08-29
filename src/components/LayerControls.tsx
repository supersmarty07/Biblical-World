import { atlasConfig } from '../config';
import { useAtlasStore } from '../state/useAtlasStore';
import { LayersIcon } from './Icons';

export function LayerControls() {
  const layers = useAtlasStore((s) => s.layers);
  const toggleLayer = useAtlasStore((s) => s.toggleLayer);
  const terrainReady = Boolean(atlasConfig.terrainPmtilesUrl);

  const rows = [
    { key: 'places' as const, label: 'Biblical places', detail: 'Established, probable, candidate, and traditional points' },
    { key: 'journeys' as const, label: 'Biblical journeys', detail: 'Textual sequence with reconstructed and unknown corridors' },
    { key: 'regions' as const, label: 'Historical context', detail: 'Time-aware cultural-geographic context, never modern-style hard borders' },
    { key: 'terrain' as const, label: '3D terrain', detail: terrainReady ? 'External PMTiles terrain' : 'Optional: set VITE_TERRAIN_PMTILES_URL', disabled: !terrainReady }
  ];

  return (
    <section className="floating-panel layer-panel" id="layer-panel" tabIndex={-1}>
      <div className="floating-panel__title"><LayersIcon /> Layers</div>
      {rows.map((row) => (
        <label className={`layer-row ${row.disabled ? 'layer-row--disabled' : ''}`} key={row.key}>
          <span><strong>{row.label}</strong><small>{row.detail}</small></span>
          <input type="checkbox" checked={layers[row.key]} disabled={row.disabled} onChange={() => toggleLayer(row.key)} />
        </label>
      ))}
      <p className="panel-disclaimer">Unlocated places remain searchable but are intentionally not forced onto the map. Dashed routes are reconstructions.</p>
    </section>
  );
}
