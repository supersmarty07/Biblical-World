import { useEffect, useMemo, useRef } from 'react';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { atlasConfig } from '../config';
import { interpolateLine } from '../lib/geometry';
import { isActiveAtYear } from '../lib/time';
import { useAtlasStore } from '../state/useAtlasStore';
import type { JourneyRecord, PlaceRecord } from '../types/domain';

const protocol = new Protocol();
let protocolRegistered = false;

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
  const layers = useAtlasStore((s) => s.layers);
  const selectPlace = useAtlasStore((s) => s.selectPlace);

  const placesGeoJson = useMemo(() => data ? makePlaces(data.places, year) : undefined, [data, year]);
  const regionsGeoJson = useMemo(() => data ? makeRegions(data.regions, year) : undefined, [data, year]);

  useEffect(() => {
    if (!containerRef.current || !data || mapRef.current) return;

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
        name: 'The Biblical World — Genesis to Acts & Paul',
        sources: {},
        layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#0b1417' } }]
      }
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Genesis → Acts & Paul · Batch 9 · Natural Earth physical land · evidence-aware reconstruction; see Sources & Provenance' }), 'bottom-right');

    map.on('load', () => {
      const currentState = useAtlasStore.getState();
      const currentLayers = currentState.layers;

      map.addSource('physical-land', { type: 'geojson', data: `${import.meta.env.BASE_URL}data/basemap/land.geojson` });
      map.addLayer({ id: 'physical-land-fill', type: 'fill', source: 'physical-land', paint: { 'fill-color': '#162220', 'fill-opacity': 0.96 } });
      map.addLayer({ id: 'physical-land-line', type: 'line', source: 'physical-land', paint: { 'line-color': '#40504b', 'line-opacity': 0.62, 'line-width': 0.8 } });

      // Optional user-supplied raster PMTiles basemap. The bundled Natural Earth land silhouette remains underneath as a fallback.
      if (atlasConfig.basemapPmtilesUrl) {
        map.addSource('external-basemap', { type: 'raster', url: `pmtiles://${atlasConfig.basemapPmtilesUrl}`, tileSize: 256 });
        map.addLayer({ id: 'external-basemap-raster', type: 'raster', source: 'external-basemap', paint: { 'raster-opacity': 0.86, 'raster-saturation': -0.55, 'raster-brightness-max': 0.62 } });
      }

      map.addSource('graticule', { type: 'geojson', data: makeGraticule() });
      map.addLayer({ id: 'graticule-line', type: 'line', source: 'graticule', paint: { 'line-color': '#8e9a92', 'line-opacity': 0.075, 'line-width': 0.7 } });

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

      if (atlasConfig.terrainPmtilesUrl) {
        map.addSource('terrain-dem', { type: 'raster-dem', url: `pmtiles://${atlasConfig.terrainPmtilesUrl}`, tileSize: 256, encoding: 'mapbox' });
      }

      map.on('mouseenter', 'places-points', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'places-points', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'places-points', (event) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (id) selectPlace(id);
      });
    });

    mapRef.current = map;
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      travelerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [data, selectPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (placesGeoJson) (map.getSource('places') as GeoJSONSource | undefined)?.setData(placesGeoJson);
    if (regionsGeoJson) (map.getSource('context-regions') as GeoJSONSource | undefined)?.setData(regionsGeoJson);
  }, [placesGeoJson, regionsGeoJson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibility = (on: boolean) => on ? 'visible' : 'none';
    for (const id of ['places-glow', 'places-points', 'places-labels']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(layers.places));
    if (map.getLayer('journeys-line')) map.setLayoutProperty('journeys-line', 'visibility', visibility(layers.journeys));
    for (const id of ['context-regions-fill', 'context-regions-line']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(layers.regions));
    if (atlasConfig.terrainPmtilesUrl && map.getSource('terrain-dem')) map.setTerrain(layers.terrain ? { source: 'terrain-dem', exaggeration: 1.15 } : null);
  }, [layers]);

  useEffect(() => {
    const map = mapRef.current;
    const place = data?.places.find((item) => item.id === selectedPlaceId);
    if (!map || !place?.coordinates) return;
    map.flyTo({ center: place.coordinates, zoom: Math.max(map.getZoom(), 7), duration: 1200, essential: true });
  }, [data, selectedPlaceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    travelerRef.current?.remove();
    travelerRef.current = null;
    const activeSource = map.getSource('active-journey') as GeoJSONSource | undefined;
    activeSource?.setData({ type: 'FeatureCollection', features: [] });

    const story = data?.stories.find((item) => item.id === activeStoryId);
    const chapter = story?.chapters[activeChapter];
    if (!chapter || !data) return;

    if (chapter.camera) map.flyTo({ center: chapter.camera.center, zoom: chapter.camera.zoom, pitch: chapter.camera.pitch ?? 0, bearing: chapter.camera.bearing ?? 0, duration: 1500, essential: true });
    if (!chapter.journeyId) return;

    const journey = data.journeys.find((item) => item.id === chapter.journeyId);
    if (!journey) return;
    const coords = journey.segments.flatMap((segment, index) => index === 0 ? segment.coordinates : segment.coordinates.slice(1));
    if (coords.length < 2) return;
    const source = map.getSource('active-journey') as GeoJSONSource | undefined;
    if (!source) return;

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
  }, [activeChapter, activeStoryId, data]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" aria-label="Interactive Genesis through Revelation historical-geography map" />
      <div className="map-vignette" aria-hidden="true" />
      <div className="map-period-badge"><span>Batch 10 · complete arc</span><strong>Genesis → Revelation</strong><small>Historical map + separate visionary mode</small></div>
      <div className="map-legend" aria-label="Map confidence legend">
        <span><i className="legend-dot legend-dot--established" /> Established</span>
        <span><i className="legend-dot legend-dot--probable" /> Probable</span>
        <span><i className="legend-dot legend-dot--disputed" /> Disputed / candidate</span>
      </div>
    </div>
  );
}
