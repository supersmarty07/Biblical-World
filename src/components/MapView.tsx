import { useEffect, useMemo, useRef } from 'react';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { atlasConfig, terrainPmtilesForRegion } from '../config';
import { interpolateLine } from '../lib/geometry';
import { runtimeAssetRetryEvent } from '../lib/assetDiagnostics';
import { isActiveAtYear } from '../lib/time';
import { useAtlasStore } from '../state/useAtlasStore';
import type { JourneyRecord, PlaceRecord } from '../types/domain';
import type { ImmersiveScene } from '../types/immersive';

function asAbsoluteAssetUrl(value: string): string {
  return new URL(value, window.location.href).toString();
}

function ensureRomanRoadLayer(map: MapLibreMap, visible: boolean): void {
  if (!atlasConfig.romanRoadsGeojsonUrl) return;
  if (!visible) {
    if (map.getLayer('roman-roads-line')) map.setLayoutProperty('roman-roads-line', 'visibility', 'none');
    return;
  }
  const roadHealth = useAtlasStore.getState().runtimeAssets['roman-roads'];
  if (roadHealth.state === 'error' && map.getSource('roman-roads')) {
    if (map.getLayer('roman-roads-line')) map.removeLayer('roman-roads-line');
    map.removeSource('roman-roads');
  }
  if (!map.getSource('roman-roads')) {
    useAtlasStore.getState().setRuntimeAssetHealth('roman-roads', { state: 'checking', message: 'Loading Roman-road context…', url: atlasConfig.romanRoadsGeojsonUrl });
    map.addSource('roman-roads', { type: 'geojson', data: asAbsoluteAssetUrl(atlasConfig.romanRoadsGeojsonUrl) });
    map.addLayer({
      id: 'roman-roads-line',
      type: 'line',
      source: 'roman-roads',
      minzoom: 4,
      paint: {
        'line-color': '#9f8f70',
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.7, 8, 1.5, 11, 2.2],
        'line-opacity': 0.48,
        'line-dasharray': [4, 2]
      },
      layout: { visibility: 'visible' }
    });
  } else if (map.getLayer('roman-roads-line')) {
    map.setLayoutProperty('roman-roads-line', 'visibility', 'visible');
  }
}

type TerrainMap = MapLibreMap & { __terrainSourceUrl?: string };

function ensureTerrainSource(map: MapLibreMap, visible: boolean, terrainUrl = atlasConfig.terrainPmtilesUrl): void {
  const terrainMap = map as TerrainMap;
  if (!terrainUrl) {
    if (map.getSource('terrain-dem')) { map.setTerrain(null); map.removeSource('terrain-dem'); }
    delete terrainMap.__terrainSourceUrl;
    return;
  }
  if (terrainMap.__terrainSourceUrl && terrainMap.__terrainSourceUrl !== terrainUrl && map.getSource('terrain-dem')) {
    map.setTerrain(null);
    map.removeSource('terrain-dem');
    delete terrainMap.__terrainSourceUrl;
  }
  const terrainHealth = useAtlasStore.getState().runtimeAssets.terrain;
  if (terrainHealth.state === 'error' && map.getSource('terrain-dem')) {
    map.setTerrain(null);
    map.removeSource('terrain-dem');
    delete terrainMap.__terrainSourceUrl;
  }
  if (!map.getSource('terrain-dem')) {
    useAtlasStore.getState().setRuntimeAssetHealth('terrain', { state: 'checking', message: 'Loading external terrain…', url: terrainUrl });
    map.addSource('terrain-dem', { type: 'raster-dem', url: `pmtiles://${asAbsoluteAssetUrl(terrainUrl)}`, tileSize: 256, encoding: 'mapbox' });
    terrainMap.__terrainSourceUrl = terrainUrl;
  }
  map.setTerrain(visible ? { source: 'terrain-dem', exaggeration: 1.08 } : null);
}

function ensureExternalBasemap(map: MapLibreMap): void {
  if (!atlasConfig.basemapPmtilesUrl) return;
  const health = useAtlasStore.getState().runtimeAssets.basemap;
  if (health.state === 'error' && map.getSource('external-basemap')) {
    if (map.getLayer('external-basemap-raster')) map.removeLayer('external-basemap-raster');
    map.removeSource('external-basemap');
  }
  if (!map.getSource('external-basemap')) {
    useAtlasStore.getState().setRuntimeAssetHealth('basemap', { state: 'checking', message: 'Loading external basemap…', url: atlasConfig.basemapPmtilesUrl });
    map.addSource('external-basemap', { type: 'raster', url: `pmtiles://${asAbsoluteAssetUrl(atlasConfig.basemapPmtilesUrl)}`, tileSize: 256 });
    map.addLayer({ id: 'external-basemap-raster', type: 'raster', source: 'external-basemap', paint: { 'raster-opacity': 0.86, 'raster-saturation': -0.55, 'raster-brightness-max': 0.62 } }, 'graticule-line');
  }
}


type SiteModelMap = MapLibreMap & { __immersiveSiteSceneId?: string };

function removeSiteModel(map: MapLibreMap): void {
  for (const id of ['immersive-site-model-labels', 'immersive-site-model-outline', 'immersive-site-model-extrusion']) {
    if (map.getLayer(id)) map.removeLayer(id);
  }
  if (map.getSource('immersive-site-model')) map.removeSource('immersive-site-model');
  delete (map as SiteModelMap).__immersiveSiteSceneId;
}

function siteModelPeriodFilter(periodId?: string): maplibregl.FilterSpecification | undefined {
  if (!periodId) return undefined;
  return ['any', ['in', 'all', ['get', 'periodIds']], ['in', periodId, ['get', 'periodIds']]] as maplibregl.FilterSpecification;
}

function ensureSiteModel(map: MapLibreMap, scene?: ImmersiveScene, periodId?: string): void {
  const model = scene?.world?.siteModel;
  const currentScene = (map as SiteModelMap).__immersiveSiteSceneId;
  if (!model) {
    if (map.getSource('immersive-site-model')) removeSiteModel(map);
    return;
  }
  if (currentScene && currentScene !== scene?.id) removeSiteModel(map);
  if (!map.getSource('immersive-site-model')) {
    const dataUrl = `${import.meta.env.BASE_URL}${model.src.replace(/^\/+/, '')}`;
    map.addSource('immersive-site-model', { type: 'geojson', data: dataUrl });
    const filter = siteModelPeriodFilter(periodId);
    map.addLayer({
      id: 'immersive-site-model-extrusion',
      type: 'fill-extrusion',
      source: 'immersive-site-model',
      ...(filter ? { filter } : {}),
      metadata: { evidenceBoundary: 'derived-display-geometry' },
      paint: {
        'fill-extrusion-color': ['match', ['get', 'evidenceClass'], 'artistic-reconstruction', '#766f82', 'unknown-disputed', '#9a6f61', 'tradition', '#8b7659', 'known-archaeology', '#c3a66c', '#a98d67'],
        'fill-extrusion-height': ['*', ['coalesce', ['get', 'heightMeters'], 1], model.verticalScale],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.72
      }
    });
    map.addLayer({
      id: 'immersive-site-model-outline',
      type: 'line',
      source: 'immersive-site-model',
      ...(filter ? { filter } : {}),
      paint: { 'line-color': '#f0cf89', 'line-opacity': 0.7, 'line-width': 1.2 }
    });
    map.addLayer({
      id: 'immersive-site-model-labels',
      type: 'symbol',
      source: 'immersive-site-model',
      ...(filter ? { filter } : {}),
      minzoom: 8,
      layout: { 'text-field': ['get', 'label'], 'text-size': 10, 'text-anchor': 'center', 'text-allow-overlap': false },
      paint: { 'text-color': '#f2e6cc', 'text-halo-color': '#0a0f12', 'text-halo-width': 1.6 }
    });
    (map as SiteModelMap).__immersiveSiteSceneId = scene?.id;
  } else {
    const filter = siteModelPeriodFilter(periodId);
    for (const id of ['immersive-site-model-extrusion', 'immersive-site-model-outline', 'immersive-site-model-labels']) {
      if (map.getLayer(id)) map.setFilter(id, filter ?? null);
    }
  }
}

const protocol = new Protocol();
let protocolRegistered = false;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function makePlaces(places: PlaceRecord[], year: number): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: places
      .filter((place) => Boolean(place.coordinates) && isActiveAtYear(year, place.validFrom, place.validTo))
      .map((place) => ({
        type: 'Feature',
        id: place.id,
        properties: {
          id: place.id,
          name: place.name,
          confidence: place.confidence.geographicIdentification,
          coordinateRole: place.coordinateRole || 'identified-site'
        },
        geometry: { type: 'Point', coordinates: place.coordinates! }
      }))
  };
}

function makeRegions(regions: GeoJSON.FeatureCollection, year: number): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.features.filter((feature) => {
      const p = feature.properties as { validFrom?: number; validTo?: number } | null;
      return isActiveAtYear(year, p?.validFrom, p?.validTo);
    })
  };
}

function makeGraticule(): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = [];
  for (let lon = 5; lon <= 60; lon += 5) features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[lon, 10], [lon, 47]] } });
  for (let lat = 10; lat <= 45; lat += 5) features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[5, lat], [60, lat]] } });
  return { type: 'FeatureCollection', features };
}

function makeSceneHotspots(scene?: ImmersiveScene, variantId?: string, periodId?: string): FeatureCollection<Point> {
  if (!scene || scene.renderer !== 'map-terrain') return { type: 'FeatureCollection', features: [] };
  return {
    type: 'FeatureCollection',
    features: scene.hotspots.filter((hotspot) => {
      const variantVisible = !hotspot.variantIds?.length || Boolean(variantId && hotspot.variantIds.includes(variantId));
      const periodVisible = !hotspot.periodIds?.length || Boolean(periodId && hotspot.periodIds.includes(periodId));
      return variantVisible && periodVisible;
    }).flatMap((hotspot) => hotspot.position.kind === 'geographic' ? [{
      type: 'Feature' as const,
      id: hotspot.id,
      properties: { id: hotspot.id, label: hotspot.label, evidenceClass: hotspot.evidenceClass },
      geometry: { type: 'Point' as const, coordinates: hotspot.position.coordinates }
    }] : [])
  };
}

function makeJourneys(journeys: JourneyRecord[]): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = [];
  journeys.forEach((journey) => journey.segments.forEach((segment) => {
    features.push({
      type: 'Feature',
      properties: {
        id: segment.id,
        journeyId: journey.id,
        name: journey.name,
        person: journey.person,
        routeCertainty: segment.routeCertainty
      },
      geometry: { type: 'LineString', coordinates: segment.coordinates }
    });
  }));
  return { type: 'FeatureCollection', features };
}

function travelerElement(character: JourneyRecord['character'], label: string) {
  const el = document.createElement('div');
  el.className = `traveler-marker traveler-marker--${character || 'generic'}`;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `${label} traveler — artistic reconstruction, not a historical portrait`);
  el.innerHTML = `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" class="traveler-marker__halo"/>
      <path class="traveler-marker__figure" d="M25 9.5c2.8 0 4.8 1.9 4.8 4.7 0 2.4-1.6 4.3-4 4.7l3.2 5.8 4.5 3.6-2.1 2.7-5.4-4.1-1.7-2.8-.8 6.9 6.3 5.7-2.5 2.5-7-6.4-1.3-6.4-2.4 5.6-5.3 4.3-2.2-2.9 4.3-3.5 2.8-8.4c.6-1.7 1.9-3.1 3.6-3.6l2-.7A4.5 4.5 0 0 1 25 9.5Z"/>
      <path class="traveler-marker__robe" d="m19 24-2.5 14h13L27 24l-4 5Z"/>
      <path class="traveler-marker__staff" d="M34 14 37 40"/>
    </svg>`;
  return el;
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const travelerRef = useRef<Marker | null>(null);
  const animationRef = useRef<number | null>(null);

  const data = useAtlasStore((s) => s.data);
  const year = useAtlasStore((s) => s.year);
  const selectedPlaceId = useAtlasStore((s) => s.selectedPlaceId);
  const activeStoryId = useAtlasStore((s) => s.activeStoryId);
  const activeChapter = useAtlasStore((s) => s.activeChapter);
  const activeJourneyId = useAtlasStore((s) => s.activeJourneyId);
  const activeJourneySegment = useAtlasStore((s) => s.activeJourneySegment);
  const layers = useAtlasStore((s) => s.layers);
  const activeScene = useAtlasStore((s) => s.activeScene);
  const activeSceneVariantId = useAtlasStore((s) => s.activeSceneVariantId);
  const activeScenePeriodId = useAtlasStore((s) => s.activeScenePeriodId);
  const selectPlace = useAtlasStore((s) => s.selectPlace);
  const setActiveHotspot = useAtlasStore((s) => s.setActiveHotspot);
  const setRuntimeAssetHealth = useAtlasStore((s) => s.setRuntimeAssetHealth);

  const placesGeoJson = useMemo(() => data ? makePlaces(data.places, year) : undefined, [data, year]);
  const regionsGeoJson = useMemo(() => data ? makeRegions(data.regions, year) : undefined, [data, year]);

  useEffect(() => {
    if (!containerRef.current || !data || mapRef.current) return;

    setRuntimeAssetHealth('terrain', atlasConfig.terrainPmtilesUrl ? { state: 'idle', message: 'Terrain is configured and will load only when requested.', url: atlasConfig.terrainPmtilesUrl } : { state: 'not-configured', message: 'No terrain PMTiles URL configured.' });
    setRuntimeAssetHealth('basemap', atlasConfig.basemapPmtilesUrl ? { state: 'idle', message: 'External basemap is configured.', url: atlasConfig.basemapPmtilesUrl } : { state: 'not-configured', message: 'Using bundled Natural Earth fallback.' });
    setRuntimeAssetHealth('roman-roads', atlasConfig.romanRoadsGeojsonUrl ? { state: 'idle', message: 'Roman roads are configured and will load only when enabled.', url: atlasConfig.romanRoadsGeojsonUrl } : { state: 'not-configured', message: 'No Roman-road GeoJSON URL configured.' });

    if (!protocolRegistered) {
      maplibregl.addProtocol('pmtiles', protocol.tile);
      protocolRegistered = true;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [36.5, 32.7],
      zoom: 3.7,
      minZoom: 2,
      maxZoom: 13,
      attributionControl: false,
      style: {
        version: 8,
        name: 'The Biblical World — Genesis to Revelation V2',
        sources: {},
        layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#0b1417' } }]
      }
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Genesis → Revelation · V2 · Natural Earth physical land · evidence-aware reconstruction; see Sources & Provenance' }), 'bottom-right');

    map.on('load', () => {
      const currentState = useAtlasStore.getState();
      const currentLayers = currentState.layers;

      map.addSource('physical-land', { type: 'geojson', data: `${import.meta.env.BASE_URL}data/basemap/land.geojson` });
      map.addLayer({ id: 'physical-land-fill', type: 'fill', source: 'physical-land', paint: { 'fill-color': '#162220', 'fill-opacity': 0.96 } });
      map.addLayer({ id: 'physical-land-line', type: 'line', source: 'physical-land', paint: { 'line-color': '#40504b', 'line-opacity': 0.62, 'line-width': 0.8 } });

      // Optional user-supplied raster PMTiles basemap. The bundled Natural Earth land silhouette remains underneath as a fallback.
      map.addSource('graticule', { type: 'geojson', data: makeGraticule() });
      map.addLayer({ id: 'graticule-line', type: 'line', source: 'graticule', paint: { 'line-color': '#8e9a92', 'line-opacity': 0.075, 'line-width': 0.7 } });
      ensureExternalBasemap(map);

      map.addSource('context-regions', { type: 'geojson', data: makeRegions(data.regions, currentState.year) });
      map.addLayer({
        id: 'context-regions-fill', type: 'fill', source: 'context-regions',
        paint: {
          'fill-color': ['match', ['get', 'family'], 'egyptian', '#7b805d', 'canaanite', '#8d704d', 'mesopotamian', '#6e7664', 'philistine', '#80645f', 'highland', '#6f775b', 'transjordan', '#786c54', 'desert', '#6f6859', 'phoenician', '#637b75', 'aramean', '#6d6b82', 'frontier', '#806b58', 'jerusalem', '#8a7456', 'south-arabia', '#7a6754', 'israel', '#67755c', 'judah', '#826a55', 'assyrian', '#665f6f', 'macedonian', '#6a6680', 'ptolemaic', '#607b78', 'seleucid', '#726276', 'hasmonean', '#7b7056', 'idumean', '#7d6658', 'nabataean', '#7a6650', 'roman', '#655f69', 'herodian', '#826a56', 'decapolis', '#5f7270', 'galilee', '#60705d', 'samaria', '#756761', '#76644f'],
          'fill-opacity': 0.12
        },
        layout: { visibility: currentLayers.regions ? 'visible' : 'none' }
      });
      map.addLayer({
        id: 'context-regions-line', type: 'line', source: 'context-regions',
        paint: { 'line-color': '#b69b69', 'line-opacity': 0.34, 'line-width': 1.1, 'line-dasharray': [3, 3] },
        layout: { visibility: currentLayers.regions ? 'visible' : 'none' }
      });

      map.addSource('journeys', { type: 'geojson', data: makeJourneys(data.journeys) });
      map.addLayer({
        id: 'journeys-line', type: 'line', source: 'journeys',
        paint: {
          'line-color': ['match', ['get', 'routeCertainty'], 'known-sequence', '#dec17f', 'reconstructed', '#b99a64', '#8d806d'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.25, 8, 2.8],
          'line-opacity': ['match', ['get', 'routeCertainty'], 'unknown', 0.30, 0.48],
          'line-dasharray': [2, 2]
        },
        layout: { visibility: currentLayers.journeys ? 'visible' : 'none' }
      });

      map.addSource('active-journey', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'active-journey-line', type: 'line', source: 'active-journey', paint: { 'line-color': '#f3ca76', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2.4, 8, 4.5], 'line-opacity': 0.95 } });

      map.addSource('places', { type: 'geojson', data: makePlaces(data.places, currentState.year) });
      map.addLayer({
        id: 'places-glow', type: 'circle', source: 'places',
        paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 9, 18], 'circle-color': '#d8b778', 'circle-opacity': 0.07, 'circle-blur': 0.6 },
        layout: { visibility: currentLayers.places ? 'visible' : 'none' }
      });
      map.addLayer({
        id: 'places-points', type: 'circle', source: 'places',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3.5, 9, 6.5],
          'circle-color': ['match', ['get', 'confidence'], 'established', '#f4d98f', 'probable', '#e4c078', 'possible', '#c69d62', 'traditional', '#bda778', 'disputed', '#c48262', 'unknown', '#8c938c', '#8c938c'],
          'circle-stroke-color': ['match', ['get', 'coordinateRole'], 'traditional-site', '#8b7650', 'candidate-site', '#6f6250', '#13181a'],
          'circle-stroke-width': ['match', ['get', 'coordinateRole'], 'candidate-site', 2, 'traditional-site', 2, 1.4]
        },
        layout: { visibility: currentLayers.places ? 'visible' : 'none' }
      });
      map.addLayer({
        id: 'places-labels', type: 'symbol', source: 'places', minzoom: 4.1,
        layout: { 'text-field': ['get', 'name'], 'text-size': 12, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-allow-overlap': false },
        paint: { 'text-color': '#e8e2d4', 'text-halo-color': '#0c1417', 'text-halo-width': 1.4 }
      });

      map.addSource('scene-hotspots', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'scene-hotspots-points', type: 'circle', source: 'scene-hotspots',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 6, 11, 10],
          'circle-color': ['match', ['get', 'evidenceClass'], 'known-archaeology', '#e6c77f', 'real-terrain', '#9eb6a3', 'historical-inference', '#c5a875', '#bfa276'],
          'circle-stroke-color': '#0a0f12',
          'circle-stroke-width': 2,
          'circle-opacity': 0.94
        }
      });
      map.addLayer({
        id: 'scene-hotspots-labels', type: 'symbol', source: 'scene-hotspots', minzoom: 7,
        layout: { 'text-field': ['get', 'label'], 'text-size': 11, 'text-offset': [0, 1.25], 'text-anchor': 'top' },
        paint: { 'text-color': '#f2eadb', 'text-halo-color': '#0a0f12', 'text-halo-width': 1.6 }
      });

      if (currentLayers.terrain) ensureTerrainSource(map, true);
      ensureRomanRoadLayer(map, currentLayers.roads);

      map.on('mouseenter', 'places-points', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'places-points', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'places-points', (event) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (id) selectPlace(id);
      });
      map.on('mouseenter', 'scene-hotspots-points', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'scene-hotspots-points', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'scene-hotspots-points', (event) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (id) setActiveHotspot(id);
      });

      map.on('sourcedata', (event) => {
        if (!event.isSourceLoaded) return;
        if (event.sourceId === 'terrain-dem') currentState.setRuntimeAssetHealth('terrain', { state: 'ready', message: 'Terrain source loaded successfully.', url: (map as TerrainMap).__terrainSourceUrl || atlasConfig.terrainPmtilesUrl });
        if (event.sourceId === 'external-basemap') currentState.setRuntimeAssetHealth('basemap', { state: 'ready', message: 'External basemap loaded successfully.', url: atlasConfig.basemapPmtilesUrl });
        if (event.sourceId === 'roman-roads') currentState.setRuntimeAssetHealth('roman-roads', { state: 'ready', message: 'Roman-road source loaded successfully.', url: atlasConfig.romanRoadsGeojsonUrl });
      });
    });

    map.on('error', (event) => {
      const sourceId = (event as unknown as { sourceId?: string }).sourceId;
      const message = event.error?.message || 'Map source failed to load.';
      const state = useAtlasStore.getState();
      if (sourceId === 'terrain-dem') {
        state.setRuntimeAssetHealth('terrain', { state: 'error', message: `${message} Falling back to the flat atlas map.`, url: (map as TerrainMap).__terrainSourceUrl || atlasConfig.terrainPmtilesUrl });
        try { map.setTerrain(null); } catch { /* fallback is already the flat map */ }
      }
      if (sourceId === 'external-basemap') state.setRuntimeAssetHealth('basemap', { state: 'error', message: `${message} Bundled Natural Earth remains available.`, url: atlasConfig.basemapPmtilesUrl });
      if (sourceId === 'roman-roads') {
        state.setRuntimeAssetHealth('roman-roads', { state: 'error', message: `${message} Biblical places and journeys remain available.`, url: atlasConfig.romanRoadsGeojsonUrl });
        if (map.getLayer('roman-roads-line')) map.setLayoutProperty('roman-roads-line', 'visibility', 'none');
      }
    });


    map.on('click', (event) => {
      if (!map.getLayer('immersive-site-model-extrusion')) return;
      const features = map.queryRenderedFeatures(event.point, { layers: ['immersive-site-model-extrusion'] });
      const hotspotId = features[0]?.properties?.hotspotId as string | undefined;
      if (hotspotId) useAtlasStore.getState().setActiveHotspot(hotspotId);
    });

    map.on('mousemove', (event) => {
      const interactive = map.getLayer('immersive-site-model-extrusion')
        ? map.queryRenderedFeatures(event.point, { layers: ['immersive-site-model-extrusion'] }).length > 0
        : false;
      map.getCanvas().style.cursor = interactive ? 'pointer' : '';
    });

    const retryMapAsset = (event: Event) => {
      if (!map.isStyleLoaded()) return;
      const key = (event as CustomEvent<{ key?: string }>).detail?.key;
      if (key === 'terrain') {
        if (map.getSource('terrain-dem')) { map.setTerrain(null); map.removeSource('terrain-dem'); }
        const state = useAtlasStore.getState();
        ensureTerrainSource(map, state.layers.terrain || Boolean(state.activeScene?.world) || state.activeScene?.renderer === 'map-terrain', terrainPmtilesForRegion(state.activeScene?.world?.terrainRegion));
      }
      if (key === 'roman-roads') {
        if (map.getLayer('roman-roads-line')) map.removeLayer('roman-roads-line');
        if (map.getSource('roman-roads')) map.removeSource('roman-roads');
        ensureRomanRoadLayer(map, useAtlasStore.getState().layers.roads);
      }
      if (key === 'basemap') {
        if (map.getLayer('external-basemap-raster')) map.removeLayer('external-basemap-raster');
        if (map.getSource('external-basemap')) map.removeSource('external-basemap');
        ensureExternalBasemap(map);
      }
    };
    const sceneCameraCommand = (event: Event) => {
      const command = (event as CustomEvent<{ command?: 'orbit-left' | 'orbit-right' | 'top-down' | 'reset' }>).detail?.command;
      if (!command) return;
      const state = useAtlasStore.getState();
      const scene = state.activeScene;
      const base = scene?.world?.mapCamera || scene?.entryCamera;
      if (!base) return;
      const periodCamera = scene?.periods.find((period) => period.id === state.activeScenePeriodId)?.camera;
      const variantCamera = scene?.comparison?.options.find((option) => option.id === state.activeSceneVariantId)?.camera;
      const target = variantCamera || periodCamera || base;
      const currentBearing = map.getBearing();
      const duration = prefersReducedMotion() ? 0 : 700;
      if (command === 'orbit-left') map.easeTo({ bearing: currentBearing - 24, pitch: Math.max(45, map.getPitch()), duration, essential: false });
      if (command === 'orbit-right') map.easeTo({ bearing: currentBearing + 24, pitch: Math.max(45, map.getPitch()), duration, essential: false });
      if (command === 'top-down') map.easeTo({ pitch: 0, bearing: 0, duration, essential: false });
      if (command === 'reset') map.easeTo({ center: target.center, zoom: target.zoom, pitch: target.pitch ?? 0, bearing: target.bearing ?? 0, duration, essential: false });
    };

    window.addEventListener(runtimeAssetRetryEvent, retryMapAsset);
    window.addEventListener('biblical-world:scene-camera', sceneCameraCommand);

    mapRef.current = map;
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      travelerRef.current?.remove();
      window.removeEventListener(runtimeAssetRetryEvent, retryMapAsset);
      window.removeEventListener('biblical-world:scene-camera', sceneCameraCommand);
      map.remove();
      mapRef.current = null;
    };
  }, [data, selectPlace, setActiveHotspot, setRuntimeAssetHealth]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (placesGeoJson) (map.getSource('places') as GeoJSONSource | undefined)?.setData(placesGeoJson);
    if (regionsGeoJson) (map.getSource('context-regions') as GeoJSONSource | undefined)?.setData(regionsGeoJson);
  }, [placesGeoJson, regionsGeoJson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    ensureRomanRoadLayer(map, layers.roads);
  }, [layers.roads]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibility = (on: boolean) => on ? 'visible' : 'none';
    for (const id of ['places-glow', 'places-points', 'places-labels']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(layers.places));
    if (map.getLayer('journeys-line')) map.setLayoutProperty('journeys-line', 'visibility', visibility(layers.journeys));
    for (const id of ['context-regions-fill', 'context-regions-line']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(layers.regions));
    if (map.getLayer('roman-roads-line')) map.setLayoutProperty('roman-roads-line', 'visibility', visibility(layers.roads));
    const terrainRequested = layers.terrain || Boolean(activeScene?.world) || activeScene?.renderer === 'map-terrain';
    const terrainUrl = terrainPmtilesForRegion(activeScene?.world?.terrainRegion);
    ensureTerrainSource(map, terrainRequested, terrainUrl);
    ensureSiteModel(map, activeScene, activeScenePeriodId);
  }, [layers, activeScene, activeScenePeriodId]);

  useEffect(() => {
    const map = mapRef.current;
    const place = data?.places.find((item) => item.id === selectedPlaceId);
    if (!map || !place?.coordinates) return;
    const camera = { center: place.coordinates, zoom: Math.max(map.getZoom(), 7) };
    if (prefersReducedMotion()) map.jumpTo(camera);
    else map.flyTo({ ...camera, duration: 1200, essential: false });
  }, [data, selectedPlaceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('scene-hotspots') as GeoJSONSource | undefined;
    source?.setData(makeSceneHotspots(activeScene, activeSceneVariantId, activeScenePeriodId));
    const baseCamera = activeScene?.world?.mapCamera || activeScene?.entryCamera;
    if (!activeScene || !baseCamera) return;
    ensureSiteModel(map, activeScene, activeScenePeriodId);
    const variantCamera = activeScene.comparison?.options.find((option) => option.id === activeSceneVariantId)?.camera;
    const periodCamera = activeScene.periods.find((period) => period.id === activeScenePeriodId)?.camera;
    const selectedCamera = variantCamera || periodCamera || baseCamera;
    const camera = {
      center: selectedCamera.center,
      zoom: selectedCamera.zoom,
      pitch: selectedCamera.pitch ?? 0,
      bearing: selectedCamera.bearing ?? 0
    };
    if (prefersReducedMotion()) map.jumpTo(camera);
    else map.flyTo({ ...camera, duration: 1400, essential: false });
  }, [activeScene, activeSceneVariantId, activeScenePeriodId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    travelerRef.current?.remove();
    travelerRef.current = null;
    const activeSource = map.getSource('active-journey') as GeoJSONSource | undefined;
    activeSource?.setData({ type: 'FeatureCollection', features: [] });

    if (!data) return;

    const directJourney = activeJourneyId ? data.journeys.find((item) => item.id === activeJourneyId) : undefined;
    if (directJourney) {
      const segmentIndex = Math.min(Math.max(0, activeJourneySegment), Math.max(0, directJourney.segments.length - 1));
      const segment = directJourney.segments[segmentIndex];
      const coords = segment?.coordinates || [];
      const source = map.getSource('active-journey') as GeoJSONSource | undefined;
      if (!source || coords.length < 2) return;

      const bounds = coords.reduce((acc, coordinate) => acc.extend(coordinate), new maplibregl.LngLatBounds(coords[0], coords[0]));
      map.fitBounds(bounds, { padding: { top: 100, right: 70, bottom: 120, left: 70 }, maxZoom: 8.5, duration: prefersReducedMotion() ? 0 : 1100 });

      if (prefersReducedMotion()) {
        source.setData({ type: 'Feature', properties: { journeyId: directJourney.id, segmentId: segment.id }, geometry: { type: 'LineString', coordinates: coords } });
        travelerRef.current = new maplibregl.Marker({ element: travelerElement(directJourney.character, directJourney.person), anchor: 'center' }).setLngLat(coords[coords.length - 1]).addTo(map);
        return;
      }

      travelerRef.current = new maplibregl.Marker({ element: travelerElement(directJourney.character, directJourney.person), anchor: 'center' }).setLngLat(coords[0]).addTo(map);
      const started = performance.now();
      const duration = Math.min(9000, Math.max(3600, coords.length * 720));
      const frame = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
        const point = interpolateLine(coords, eased);
        const pointCount = Math.max(2, Math.floor(eased * (coords.length - 1)) + 1);
        const partial = coords.slice(0, pointCount);
        partial[partial.length - 1] = point;
        source.setData({ type: 'Feature', properties: { journeyId: directJourney.id, segmentId: segment.id }, geometry: { type: 'LineString', coordinates: partial } });
        travelerRef.current?.setLngLat(point);
        if (progress < 1) animationRef.current = requestAnimationFrame(frame);
      };
      animationRef.current = requestAnimationFrame(frame);
      return;
    }

    const story = data.stories.find((item) => item.id === activeStoryId);
    const chapter = story?.chapters[activeChapter];
    if (!chapter) return;

    if (chapter.camera) {
      const camera = { center: chapter.camera.center, zoom: chapter.camera.zoom, pitch: chapter.camera.pitch ?? 0, bearing: chapter.camera.bearing ?? 0 };
      if (prefersReducedMotion()) map.jumpTo(camera);
      else map.flyTo({ ...camera, duration: 1500, essential: false });
    }
    if (!chapter.journeyId) return;

    const journey = data.journeys.find((item) => item.id === chapter.journeyId);
    if (!journey) return;
    const coords = journey.segments.flatMap((segment, index) => index === 0 ? segment.coordinates : segment.coordinates.slice(1));
    if (coords.length < 2) return;
    const source = map.getSource('active-journey') as GeoJSONSource | undefined;
    if (!source) return;

    if (prefersReducedMotion()) {
      source.setData({ type: 'Feature', properties: { journeyId: journey.id }, geometry: { type: 'LineString', coordinates: coords } });
      travelerRef.current = new maplibregl.Marker({ element: travelerElement(journey.character, journey.person), anchor: 'center' }).setLngLat(coords[coords.length - 1]).addTo(map);
      return;
    }

    travelerRef.current = new maplibregl.Marker({ element: travelerElement(journey.character, journey.person), anchor: 'center' }).setLngLat(coords[0]).addTo(map);
    const started = performance.now();
    const duration = Math.min(12000, Math.max(6000, coords.length * 900));

    const frame = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
      const point = interpolateLine(coords, eased);
      const pointCount = Math.max(2, Math.floor(eased * (coords.length - 1)) + 1);
      const partial = coords.slice(0, pointCount);
      partial[partial.length - 1] = point;
      source.setData({ type: 'Feature', properties: { journeyId: journey.id }, geometry: { type: 'LineString', coordinates: partial } });
      travelerRef.current?.setLngLat(point);
      if (progress < 1) animationRef.current = requestAnimationFrame(frame);
    };
    animationRef.current = requestAnimationFrame(frame);
  }, [activeChapter, activeJourneyId, activeJourneySegment, activeStoryId, data]);

  return (
    <div className="map-wrap">
      <p id="map-accessibility-note" className="visually-hidden">The map is a supplementary visual interface. All mapped and intentionally unlocated records can also be reached through search, stories, and information panels.</p>
      <div ref={containerRef} className="map" role="region" aria-label="Interactive Genesis through Revelation historical-geography map" aria-describedby="map-accessibility-note" />
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-period-badge"><span>V2 · immersive foundation</span><strong>Genesis → Revelation</strong><small>Hardened atlas + evidence-aware scenes</small></div>
      <div className="map-legend" aria-label="Map confidence legend">
        <span><i className="legend-dot legend-dot--established" /> Established</span>
        <span><i className="legend-dot legend-dot--probable" /> Probable</span>
        <span><i className="legend-dot legend-dot--disputed" /> Disputed / candidate</span>
      </div>
    </div>
  );
}
