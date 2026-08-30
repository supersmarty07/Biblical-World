import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { loadImmersiveScene } from '../data/immersive';
import { loadVerificationRegistry } from '../data/verification';
import { loadV2AssetManifest } from '../data/assets';
import { atlasConfig, terrainPmtilesForRegion } from '../config';
import { useAtlasStore } from '../state/useAtlasStore';
import type { ImmersiveAsset, ImmersiveScene, ImmersiveWorldMode, SceneComparisonOption, SceneHotspot } from '../types/immersive';
import type { VerificationClaim, VerificationResource, VerificationSceneAssessment } from '../types/verification';
import type { V2AssetPlanEntry } from '../types/assets';
import { CloseIcon, InfoIcon, MapPinIcon } from './Icons';


function SceneVerificationPanel({ sceneId }: { sceneId: string }) {
  const [resources, setResources] = useState<VerificationResource[]>([]);
  const [claims, setClaims] = useState<VerificationClaim[]>([]);
  const [assessment, setAssessment] = useState<VerificationSceneAssessment>();
  const [assets, setAssets] = useState<V2AssetPlanEntry[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    setError(undefined);
    void Promise.all([loadVerificationRegistry(), loadV2AssetManifest()]).then(([registry, assetManifest]) => {
      if (cancelled) return;
      setResources(registry.resources.filter((resource) => resource.sceneIds.includes(sceneId)));
      setClaims(registry.claims.filter((claim) => claim.sceneIds.includes(sceneId)));
      setAssessment(registry.sceneAssessments.find((item) => item.sceneId === sceneId));
      setAssets(assetManifest.assets.filter((asset) => asset.sceneIds.includes(sceneId)));
    }).catch((reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
    });
    return () => { cancelled = true; };
  }, [sceneId]);

  if (error) return <div className="scene-verification scene-verification--error"><strong>Verification metadata unavailable</strong><span>{error}</span></div>;
  if (!resources.length && !claims.length && !assessment && !assets.length) return null;

  return (
    <details className="scene-verification">
      <summary><span>Research packet</span><strong>{assessment ? `${assessment.packetReadinessPercent}% research readiness` : 'evidence-linked'}</strong></summary>
      <div className="scene-verification__body">
        {assessment && <p><b>Integration:</b> {assessment.integrationStatus.replaceAll('-', ' ')}. {assessment.note}</p>}
        <p className="scene-verification__boundary">Packet-derived metadata; not independently live-verified in this build environment.</p>
        {resources.length > 0 && <section><h3>Data & licensing</h3>{resources.map((resource) => <div className="scene-verification__row" key={resource.id}><div><strong>{resource.name}</strong><small>{resource.packetStatus.replaceAll('-', ' ')} · {resource.license}</small></div><a href={resource.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a></div>)}</section>}
        {assets.length > 0 && <section><h3>Asset pipeline</h3>{assets.map((asset) => <div className="scene-verification__row" key={asset.id}><div><strong>{asset.label}</strong><small>{asset.status.replaceAll('-', ' ')} · {asset.delivery}</small></div><span>{asset.status === 'installed' ? 'installed' : 'pending'}</span></div>)}</section>}
        {claims.length > 0 && <section><h3>Evidence guardrails</h3>{claims.map((claim) => <div className="scene-verification__claim" key={claim.id}><strong>{claim.status.replaceAll('-', ' ')}</strong><p>{claim.statement}</p><small>{claim.guardrail}</small></div>)}</section>}
      </div>
    </details>
  );
}

function evidenceLabel(value: SceneHotspot['evidenceClass']): string {
  return value.replaceAll('-', ' ');
}

function assetUrl(asset: ImmersiveAsset): string {
  if (asset.hosting === 'external') return asset.src;
  return `${import.meta.env.BASE_URL}${asset.src.replace(/^\/+/, '')}`;
}

function visibleHotspots(scene: ImmersiveScene, variantId?: string, periodId?: string): SceneHotspot[] {
  return scene.hotspots.filter((hotspot) => {
    const variantVisible = !hotspot.variantIds?.length || Boolean(variantId && hotspot.variantIds.includes(variantId));
    const periodVisible = !hotspot.periodIds?.length || Boolean(periodId && hotspot.periodIds.includes(periodId));
    return variantVisible && periodVisible;
  });
}

function SceneHotspotDetail({ scene, hotspot }: { scene: ImmersiveScene; hotspot: SceneHotspot }) {
  const data = useAtlasStore((s) => s.data);
  const selectPlace = useAtlasStore((s) => s.selectPlace);
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const sourceMap = useMemo(() => new Map(data?.sources.map((source) => [source.id, source])), [data]);

  return (
    <aside className="scene-hotspot-sheet" aria-live="polite" aria-label={`${hotspot.label} evidence details`}>
      <button className="scene-hotspot-sheet__close icon-button" onClick={() => setActiveHotspot(undefined)} aria-label="Close hotspot details"><CloseIcon /></button>
      <span className={`scene-evidence-chip scene-evidence-chip--${hotspot.evidenceClass}`}>{evidenceLabel(hotspot.evidenceClass)}</span>
      <h2>{hotspot.label}</h2>
      <p>{hotspot.summary}</p>
      <dl className="scene-hotspot-facts">
        <div><dt>Confidence</dt><dd>{hotspot.confidence}</dd></div>
        <div><dt>Scene</dt><dd>{scene.availability}</dd></div>
      </dl>
      <section>
        <h3><InfoIcon /> Why is this shown here?</h3>
        <p><strong>Evidence:</strong> {hotspot.whyShown.evidence}</p>
        {hotspot.whyShown.inference && <p><strong>Inference:</strong> {hotspot.whyShown.inference}</p>}
        {hotspot.whyShown.alternatives && <p><strong>Alternatives:</strong> {hotspot.whyShown.alternatives}</p>}
      </section>
      {hotspot.scripture.length > 0 && <section><h3>Scripture</h3><div className="scene-scripture-chips">{hotspot.scripture.map((ref) => <span key={ref.label}>{ref.label}</span>)}</div></section>}
      <section>
        <h3>Sources & status</h3>
        <div className="scene-source-list">
          {hotspot.sourceIds.map((id) => {
            const source = sourceMap.get(id);
            return source ? <div key={id}><strong>{source.title}</strong><small>{source.verificationStatus || (source.kind === 'project-methodology' ? 'project-authored' : 'needs-verification')}</small></div> : <div key={id}><strong>{id}</strong><small>source record not loaded</small></div>;
          })}
        </div>
      </section>
      {hotspot.placeId && <button className="scene-record-link" onClick={() => selectPlace(hotspot.placeId)}><MapPinIcon /> Open atlas record</button>}
    </aside>
  );
}

function PanoramaView({ scene }: { scene: ImmersiveScene }) {
  const config = scene.panorama!;
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const activeVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const activePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const [pan, setPan] = useState(config.initialPan);
  const dragRef = useRef<{ pointerId: number; startX: number; startPan: number; width: number } | null>(null);
  const variant = scene.comparison?.options.find((option) => option.id === activeVariantId);
  const assetId = variant?.panoramaAssetId || config.assetId;
  const panoramaAsset = assetId ? scene.assets.find((asset) => asset.id === assetId) : undefined;
  const travelPercent = ((config.worldWidthPercent - 100) / config.worldWidthPercent) * 100;
  const hotspots = visibleHotspots(scene, activeVariantId, activePeriodId).filter((hotspot) => hotspot.position.kind === 'image');

  useEffect(() => { setPan(config.initialPan); }, [config.initialPan, activeVariantId]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    const width = event.currentTarget.clientWidth;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startPan: pan, width };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const worldExtra = Math.max(1, (config.worldWidthPercent - 100) / 100);
    const delta = (event.clientX - drag.startX) / (drag.width * worldExtra);
    setPan(Math.max(0, Math.min(1, drag.startPan - delta)));
  };
  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); setPan((value) => Math.max(0, value - 0.05)); }
    if (event.key === 'ArrowRight') { event.preventDefault(); setPan((value) => Math.min(1, value + 0.05)); }
    if (event.key === 'Home') { event.preventDefault(); setPan(0); }
    if (event.key === 'End') { event.preventDefault(); setPan(1); }
  };

  const environmentClass = variant?.fallbackEnvironment ? ` scene-panorama-world--${variant.fallbackEnvironment}` : '';
  return (
    <div
      className="scene-panorama-viewport"
      role="group"
      aria-label={`${config.alt}. Drag horizontally or use left and right arrow keys to explore.`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onKeyDown={onKeyDown}
    >
      <div
        className={`scene-panorama-world ${panoramaAsset ? 'scene-panorama-world--asset' : 'scene-panorama-world--schematic'}${environmentClass}`}
        style={{
          width: `${config.worldWidthPercent}%`,
          transform: `translate3d(-${pan * travelPercent}%, 0, 0)`,
          backgroundImage: panoramaAsset ? `linear-gradient(rgba(7,12,14,.08), rgba(7,12,14,.26)), url("${assetUrl(panoramaAsset)}")` : undefined
        }}
      >
        {!panoramaAsset && <>
          <div className="scene-schematic-sky" />
          <div className="scene-schematic-water" />
          <div className="scene-schematic-ridge scene-schematic-ridge--far" />
          <div className="scene-schematic-ridge scene-schematic-ridge--mid" />
          <div className="scene-schematic-ridge scene-schematic-ridge--near" />
          <div className="scene-schematic-wadi" />
          <div className="scene-schematic-marsh" />
        </>}
        {hotspots.map((hotspot) => {
          const position = hotspot.position.kind === 'image' ? hotspot.position : undefined;
          if (!position) return null;
          return (
            <button
              key={hotspot.id}
              className={`scene-hotspot scene-hotspot--${hotspot.evidenceClass}`}
              style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
              onClick={() => setActiveHotspot(hotspot.id)}
              aria-label={`${hotspot.label}. ${evidenceLabel(hotspot.evidenceClass)}.`}
            >
              <span aria-hidden="true" />
              <b>{hotspot.label}</b>
            </button>
          );
        })}
      </div>
      <div className="scene-panorama-hint">Drag to look around - arrow keys supported</div>
    </div>
  );
}

function ParallaxView({ scene }: { scene: ImmersiveScene }) {
  const config = scene.parallax!;
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const activeVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const activePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers = config.layerAssetIds.map((id) => scene.assets.find((asset) => asset.id === id)).filter((asset): asset is ImmersiveAsset => Boolean(asset));
  const hotspots = visibleHotspots(scene, activeVariantId, activePeriodId).filter((hotspot) => hotspot.position.kind === 'image');

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 2, y: ((event.clientY - rect.top) / rect.height - 0.5) * 2 });
  };

  return (
    <div className="scene-parallax-viewport" role="img" aria-label={`${scene.title}. ${scene.disclaimer}`} onPointerMove={onPointerMove} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
      {layers.length > 0 ? layers.map((asset, index) => {
        const depth = ((index + 1) / Math.max(1, layers.length)) * config.pointerDepth;
        return <img key={asset.id} className="scene-parallax-layer" src={assetUrl(asset)} alt="" aria-hidden="true" style={{ transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth}px, 0) scale(1.06)` }} />;
      }) : <>
        <div className="scene-parallax-fallback scene-parallax-fallback--sky" />
        <div className="scene-parallax-fallback scene-parallax-fallback--far" style={{ transform: `translate3d(${pointer.x * 3}px, ${pointer.y * 2}px, 0)` }} />
        <div className="scene-parallax-fallback scene-parallax-fallback--near" style={{ transform: `translate3d(${pointer.x * 8}px, ${pointer.y * 4}px, 0)` }} />
      </>}
      {hotspots.map((hotspot) => hotspot.position.kind === 'image' ? <button key={hotspot.id} className={`scene-hotspot scene-hotspot--${hotspot.evidenceClass}`} style={{ left: `${hotspot.position.x * 100}%`, top: `${hotspot.position.y * 100}%` }} onClick={() => setActiveHotspot(hotspot.id)} aria-label={`${hotspot.label}. ${evidenceLabel(hotspot.evidenceClass)}.`}><span aria-hidden="true" /><b>{hotspot.label}</b></button> : null)}
    </div>
  );
}


function AnimatedWorldView({ scene }: { scene: ImmersiveScene }) {
  const world = scene.world!;
  const config = world.reconstruction;
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [playing, setPlaying] = useState(!reducedMotion);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const layerAssets = new Map(scene.assets.map((asset) => [asset.id, asset]));

  useEffect(() => { setPlaying(!reducedMotion); }, [reducedMotion, scene.id]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !playing) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2
    });
  };

  return (
    <div
      className={`scene-cinematic ${playing ? 'is-playing' : 'is-paused'}`}
      role="img"
      aria-label={`${config.alt} ${config.note}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="scene-cinematic__stack" aria-hidden="true">
        {config.layers.map((layer) => {
          const asset = layerAssets.get(layer.assetId);
          if (!asset) return null;
          return (
            <div
              key={layer.assetId}
              className="scene-cinematic__depth"
              style={{ transform: `translate3d(${pointer.x * layer.depth}px, ${pointer.y * layer.depth * 0.45}px, 0)` }}
            >
              <img
                src={assetUrl(asset)}
                alt=""
                className={`scene-cinematic__layer scene-cinematic__layer--${layer.motion}`}
                style={{ opacity: layer.opacity ?? 1 }}
              />
            </div>
          );
        })}
      </div>
      <div className="scene-cinematic__vignette" aria-hidden="true" />
      <div className="scene-cinematic__caption">
        <span className="scene-evidence-chip scene-evidence-chip--artistic-reconstruction">Artistic reconstruction</span>
        <strong>{config.title}</strong>
        <p>{config.note}</p>
      </div>
      <div className="scene-cinematic__controls">
        <button type="button" onClick={() => setPlaying((value) => !value)} disabled={reducedMotion}>
          {reducedMotion ? 'Motion reduced by device setting' : playing ? 'Pause animation' : 'Play animation'}
        </button>
        <div aria-label="Animated effects">{config.effects.map((effect) => <span key={effect}>{effect}</span>)}</div>
      </div>
    </div>
  );
}

function WorldModeSwitch({ scene, mode, onChange }: { scene: ImmersiveScene; mode: ImmersiveWorldMode; onChange: (mode: ImmersiveWorldMode) => void }) {
  const world = scene.world!;
  return (
    <div className="scene-world-mode" role="tablist" aria-label="Immersive world view">
      <button type="button" role="tab" aria-selected={mode === '3d-map'} onClick={() => onChange('3d-map')}>{world.mapLabel}</button>
      <button type="button" role="tab" aria-selected={mode === 'animated-reconstruction'} onClick={() => onChange('animated-reconstruction')}>{world.reconstructionLabel}</button>
    </div>
  );
}

function TerrainSceneHud({ scene }: { scene: ImmersiveScene }) {
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const activeVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const activePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const regionalTerrainUrl = terrainPmtilesForRegion(scene.world?.terrainRegion);
  const terrainConfigured = Boolean(regionalTerrainUrl);
  const siteGeometryConfigured = Boolean(scene.world?.siteModel);
  return (
    <div className="terrain-scene-hud">
      <div className={`terrain-scene-hud__status ${terrainConfigured ? 'terrain-scene-hud__status--dem' : 'terrain-scene-hud__status--fallback'}`} role="status">
        <strong>{terrainConfigured ? '3D terrain + site geometry' : siteGeometryConfigured ? '3D site geometry · flat elevation base' : 'Pitched geographic map'}</strong>
        <span>{terrainConfigured ? 'Relief uses the configured external raster-DEM. Site extrusions remain evidence-labeled separately.' : siteGeometryConfigured ? `${scene.world?.siteModel?.label} is available now. No measured DEM is loaded, so regional elevation remains flat until terrain PMTiles are configured.` : 'No terrain DEM or local site geometry is loaded. Camera pitch is presentation only.'}</span>
      </div>
      {siteGeometryConfigured && <div className="terrain-scene-hud__geometry-note"><strong>Geometry boundary</strong><span>{scene.world?.siteModel?.note}</span></div>}
      <div className="terrain-scene-hud__hotspots" aria-label="Terrain scene hotspots">
      {visibleHotspots(scene, activeVariantId, activePeriodId).filter((hotspot) => hotspot.position.kind === 'geographic').map((hotspot) => (
        <button key={hotspot.id} onClick={() => setActiveHotspot(hotspot.id)}>
          <span className={`scene-evidence-dot scene-evidence-dot--${hotspot.evidenceClass}`} aria-hidden="true" />
          {hotspot.label}
        </button>
      ))}
      </div>
    </div>
  );
}

function SceneComparisonPanel({ scene }: { scene: ImmersiveScene }) {
  const comparison = scene.comparison!;
  const data = useAtlasStore((s) => s.data);
  const selectPlace = useAtlasStore((s) => s.selectPlace);
  const activeVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const setActiveSceneVariant = useAtlasStore((s) => s.setActiveSceneVariant);
  const sourceMap = useMemo(() => new Map(data?.sources.map((source) => [source.id, source])), [data]);
  const active = (comparison.options.find((option) => option.id === activeVariantId) || comparison.options.find((option) => option.id === comparison.defaultOptionId) || comparison.options[0])!;

  return (
    <aside className="scene-comparison" aria-label={comparison.label}>
      <div className="scene-comparison__heading">
        <span>{comparison.presentation === 'regions' ? 'Explore landscape zones' : comparison.presentation === 'concepts' ? 'Explore textual & historical lenses' : 'Compare alternatives'}</span>
        <strong>{comparison.label}</strong>
        <p>{comparison.intro}</p>
      </div>
      <div className="scene-comparison__tabs" role="tablist" aria-label={comparison.label}>
        {comparison.options.map((option) => <button key={option.id} type="button" role="tab" aria-selected={option.id === active.id} onClick={() => setActiveSceneVariant(option.id)}><span>{option.label}</span><small>{option.status}</small></button>)}
      </div>
      <div className="scene-comparison__detail" role="tabpanel">
        <div><span className={`scene-status scene-status--${active.status}`}>{active.status}</span>{active.camera?.coordinateRole && <span className="scene-camera-role">{active.camera.coordinateRole}</span>}</div>
        <h2>{active.label}</h2>
        <p>{active.summary}</p>
        <p><strong>{comparison.presentation === 'regions' ? 'Geographic character:' : comparison.presentation === 'concepts' ? 'Why this lens matters:' : 'Why considered:'}</strong> {active.rationale}</p>
        {active.objections && <p><strong>{comparison.presentation === 'regions' ? 'Reconstruction limits:' : comparison.presentation === 'concepts' ? 'Interpretive limits:' : 'Limits / objections:'}</strong> {active.objections}</p>}
        {active.camera?.note && <p className="scene-comparison__camera-note"><strong>Map camera:</strong> {active.camera.note}</p>}
        <div className="scene-comparison__sources" aria-label="Sources for selected view">
          {active.sourceIds.map((id) => {
            const source = sourceMap.get(id);
            return <span key={id} title={source?.title || id}>{source?.title || id}<small>{source?.verificationStatus || (source?.kind === 'project-methodology' ? 'project-authored' : 'needs-verification')}</small></span>;
          })}
        </div>
        {active.placeIds.length === 1 && <button className="scene-comparison__record" type="button" onClick={() => selectPlace(active.placeIds[0])}><MapPinIcon /> Open atlas record</button>}
      </div>
    </aside>
  );
}

function formatHistoricalYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year > 0) return `${year} CE`;
  return '1 BCE/CE boundary';
}

function formatPeriodRange(from?: number, to?: number): string | undefined {
  if (from === undefined && to === undefined) return undefined;
  if (from !== undefined && to !== undefined) {
    if (from < 0 && to < 0) return `${Math.abs(from)}–${Math.abs(to)} BCE`;
    if (from > 0 && to > 0) return `${from}–${to} CE`;
    return `${formatHistoricalYear(from)}–${formatHistoricalYear(to)}`;
  }
  return from !== undefined ? `from ${formatHistoricalYear(from)}` : `to ${formatHistoricalYear(to!)}`;
}

function ScenePeriodControl({ scene }: { scene: ImmersiveScene }) {
  const activePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const setActiveScenePeriod = useAtlasStore((s) => s.setActiveScenePeriod);
  if (scene.periods.length === 0) return null;
  const active = scene.periods.find((period) => period.id === activePeriodId) || scene.periods.find((period) => period.id === scene.defaultPeriodId) || scene.periods[0];
  return (
    <div className="scene-period-control" aria-label="Historical period view">
      <small>Period view</small>
      <div role="tablist" aria-label="Historical period view">
        {scene.periods.map((period) => <button key={period.id} type="button" role="tab" aria-selected={period.id === active.id} onClick={() => setActiveScenePeriod(period.id)}><span>{period.label}</span>{formatPeriodRange(period.from, period.to) && <small>{formatPeriodRange(period.from, period.to)}</small>}</button>)}
      </div>
      <p>{formatPeriodRange(active.from, active.to) && <b>{formatPeriodRange(active.from, active.to)} · </b>}{active.note}</p>
    </div>
  );
}

export function ImmersiveSceneOverlay() {
  const activeSceneId = useAtlasStore((s) => s.activeSceneId);
  const activeSceneVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const activeScenePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const catalog = useAtlasStore((s) => s.sceneCatalog);
  const sceneError = useAtlasStore((s) => s.sceneError);
  const activeScene = useAtlasStore((s) => s.activeScene);
  const activeHotspotId = useAtlasStore((s) => s.activeHotspotId);
  const openScene = useAtlasStore((s) => s.openScene);
  const setActiveScene = useAtlasStore((s) => s.setActiveScene);
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const setActiveSceneVariant = useAtlasStore((s) => s.setActiveSceneVariant);
  const setActiveScenePeriod = useAtlasStore((s) => s.setActiveScenePeriod);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [worldMode, setWorldMode] = useState<ImmersiveWorldMode>('3d-map');

  const entry = catalog.find((item) => item.id === activeSceneId);
  const hotspot = activeScene?.hotspots.find((item) => item.id === activeHotspotId);

  useEffect(() => {
    if (!activeSceneId) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (useAtlasStore.getState().activeHotspotId) setActiveHotspot(undefined);
        else openScene(undefined);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [activeSceneId, openScene, setActiveHotspot]);

  useEffect(() => {
    if (!activeSceneId || !entry) return;
    let cancelled = false;
    setLoadError(undefined);
    setActiveScene(undefined);
    void loadImmersiveScene(entry)
      .then((scene) => {
        if (cancelled) return;
        setActiveScene(scene);
        const requested = useAtlasStore.getState().activeSceneVariantId;
        if (scene.comparison) {
          const validRequested = requested && scene.comparison.options.some((option) => option.id === requested);
          if (!validRequested) setActiveSceneVariant(scene.comparison.defaultOptionId);
        } else if (requested) setActiveSceneVariant(undefined);
        queueMicrotask(() => closeRef.current?.focus());
      })
      .catch((error: unknown) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error)); });
    return () => { cancelled = true; };
  }, [activeSceneId, entry, setActiveScene, setActiveSceneVariant]);

  useEffect(() => {
    if (!activeScene?.comparison || !activeSceneVariantId) return;
    const valid = activeScene.comparison.options.some((option: SceneComparisonOption) => option.id === activeSceneVariantId);
    if (!valid) setActiveSceneVariant(activeScene.comparison.defaultOptionId);
  }, [activeScene, activeSceneVariantId, setActiveSceneVariant]);


  useEffect(() => {
    if (!activeScene?.periods.length) return;
    const valid = activeScene.periods.some((period) => period.id === activeScenePeriodId);
    if (!valid) setActiveScenePeriod(activeScene.defaultPeriodId || activeScene.periods[0].id);
  }, [activeScene, activeScenePeriodId, setActiveScenePeriod]);

  useEffect(() => {
    if (activeScene?.world) setWorldMode(activeScene.world.defaultMode);
  }, [activeScene?.id, activeScene?.world]);

  if (!activeSceneId) return null;

  if (sceneError || (catalog.length > 0 && !entry) || loadError) {
    return <section className="immersive-scene immersive-scene--error" role="dialog" aria-modal="true" aria-label="Immersive scene error"><button ref={closeRef} className="scene-close icon-button" onClick={() => openScene(undefined)} aria-label="Close immersive scene"><CloseIcon /></button><strong>Immersive scene could not load.</strong><p>{loadError || sceneError || `Unknown scene: ${activeSceneId}`}</p></section>;
  }

  if (!entry || !activeScene) {
    return <section className="immersive-scene immersive-scene--loading" role="dialog" aria-modal="true" aria-label="Loading immersive scene"><button ref={closeRef} className="scene-close icon-button" onClick={() => openScene(undefined)} aria-label="Close immersive scene"><CloseIcon /></button><div className="loading-orbit" aria-hidden="true" /><strong>Preparing immersive scene...</strong></section>;
  }

  const hasWorld = Boolean(activeScene.world);
  const isMapMode = hasWorld ? worldMode === '3d-map' : activeScene.renderer === 'map-terrain';
  const sceneClass = hasWorld ? (isMapMode ? 'world-map' : 'animated-world') : activeScene.renderer;
  return (
    <section className={`immersive-scene immersive-scene--${sceneClass}`} role={isMapMode ? 'region' : 'dialog'} aria-modal={isMapMode ? undefined : true} aria-label={`${activeScene.title} immersive scene`}>
      <button ref={closeRef} className="scene-close icon-button" onClick={() => openScene(undefined)} aria-label="Close immersive scene"><CloseIcon /></button>
      {hasWorld && !isMapMode && <AnimatedWorldView scene={activeScene} />}
      {!hasWorld && activeScene.renderer === 'panorama' && <PanoramaView scene={activeScene} />}
      {!hasWorld && activeScene.renderer === 'parallax' && <ParallaxView scene={activeScene} />}
      {hasWorld && <WorldModeSwitch scene={activeScene} mode={worldMode} onChange={setWorldMode} />}
      <header className="scene-header">
        <span className="scene-kicker">V2 immersive - {activeScene.availability}</span>
        <h1>{activeScene.title}</h1>
        <p>{activeScene.subtitle}</p>
        <div className="scene-disclaimer"><InfoIcon /> <span>{activeScene.disclaimer}</span></div>
        {isMapMode && <TerrainSceneHud scene={activeScene} />}
        <SceneVerificationPanel sceneId={activeScene.id} />
      </header>
      {activeScene.comparison && <SceneComparisonPanel scene={activeScene} />}
      <div className="scene-evidence-legend" aria-label="Scene evidence legend">
        {activeScene.evidenceLegend.map((item) => <div key={item.class} title={item.description}><i className={`scene-evidence-dot scene-evidence-dot--${item.class}`} /><span>{item.label}</span></div>)}
      </div>
      <ScenePeriodControl scene={activeScene} />
      {hotspot && <SceneHotspotDetail scene={activeScene} hotspot={hotspot} />}
    </section>
  );
}
