import { atlasConfig } from '../config';
import { useAtlasStore } from '../state/useAtlasStore';
import { CloseIcon, LayersIcon } from './Icons';
import { DeploymentDiagnostics } from './DeploymentDiagnostics';

export function LayerControls() {
  const layers = useAtlasStore((s) => s.layers);
  const toggleLayer = useAtlasStore((s) => s.toggleLayer);
  const terrainReady = atlasConfig.hasAnyTerrain;
  const roadsReady = Boolean(atlasConfig.romanRoadsGeojsonUrl);
  const runtimeAssets = useAtlasStore((s) => s.runtimeAssets);
  const mobileLayersOpen = useAtlasStore((s) => s.mobileLayersOpen);
  const setMobileLayersOpen = useAtlasStore((s) => s.setMobileLayersOpen);

  const rows = [
    { key: 'places' as const, label: 'Biblical places', detail: 'Established, probable, candidate, and traditional points' },
    { key: 'journeys' as const, label: 'Biblical journeys', detail: 'Textual sequence with reconstructed and unknown corridors' },
    { key: 'regions' as const, label: 'Historical context', detail: 'Time-aware cultural-geographic context, never modern-style hard borders' },
    { key: 'roads' as const, label: 'Roman roads', detail: roadsReady ? `Verified/licensed road network · ${runtimeAssets['roman-roads'].state}` : 'Optional: set VITE_ROMAN_ROADS_GEOJSON_URL', disabled: !roadsReady },
    { key: 'terrain' as const, label: '3D terrain', detail: terrainReady ? `${atlasConfig.terrainPmtilesUrl ? 'Global/regional' : 'Regional'} PMTiles terrain · ${runtimeAssets.terrain.state}` : 'Optional: configure a global or regional terrain PMTiles URL', disabled: !terrainReady }
  ];

  return (
    <>
      <button className={`layer-sheet-backdrop ${mobileLayersOpen ? 'is-open' : ''}`} aria-hidden={!mobileLayersOpen} tabIndex={-1} onClick={() => setMobileLayersOpen(false)} />
      <section className={`floating-panel layer-panel ${mobileLayersOpen ? 'layer-panel--mobile-open' : ''}`} id="layer-panel" tabIndex={-1} aria-label="Map layers">
        <div className="floating-panel__title"><LayersIcon /> Layers <button type="button" className="layer-panel__mobile-close" onClick={() => setMobileLayersOpen(false)} aria-label="Close layers"><CloseIcon /></button></div>
        {rows.map((row) => (
          <label className={`layer-row ${row.disabled ? 'layer-row--disabled' : ''}`} key={row.key}>
            <span><strong>{row.label}</strong><small>{row.detail}</small></span>
            <input type="checkbox" checked={layers[row.key]} disabled={row.disabled} onChange={() => toggleLayer(row.key)} />
          </label>
        ))}
        <p className="panel-disclaimer">Unlocated places remain searchable but are intentionally not forced onto the map. Dashed routes are reconstructions.</p>
        <DeploymentDiagnostics />
      </section>
    </>
  );
}
