import installedAssets from './generated/installedAssets.json';

function publicAssetUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (/^https:\/\//i.test(value)) return value;
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`;
}

const configuredBasemapUrl = (import.meta.env.VITE_BASEMAP_PMTILES_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.basemapPmtiles);
const configuredBasemapAttribution = (import.meta.env.VITE_BASEMAP_ATTRIBUTION as string | undefined)?.trim();
const configuredRoadSourceId = ((import.meta.env.VITE_ROMAN_ROADS_SOURCE_ID as string | undefined) || 'dare-roman-roads').trim();
const allowedRoadSourceIds = new Set(['dare-roman-roads', 'awmc-antiquity-alacarte']);

export const atlasConfig = {
  title: 'The Biblical World',
  subtitle: 'Genesis → Revelation',
  terrainPmtilesUrl: (import.meta.env.VITE_TERRAIN_PMTILES_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.terrainPmtiles),
  basemapPmtilesUrl: configuredBasemapUrl && configuredBasemapAttribution ? configuredBasemapUrl : undefined,
  basemapAttribution: configuredBasemapAttribution,
  basemapConfigurationWarning: configuredBasemapUrl && !configuredBasemapAttribution ? 'External basemap URL ignored because VITE_BASEMAP_ATTRIBUTION is missing.' : undefined,
  romanRoadsGeojsonUrl: (import.meta.env.VITE_ROMAN_ROADS_GEOJSON_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.romanRoadsGeojson),
  romanRoadsSourceId: allowedRoadSourceIds.has(configuredRoadSourceId) ? configuredRoadSourceId : 'dare-roman-roads',
  romanRoadsConfigurationWarning: allowedRoadSourceIds.has(configuredRoadSourceId) ? undefined : `Unsupported Roman-road source id “${configuredRoadSourceId}”; defaulting attribution to DARE.`,
  installedAssetVersion: installedAssets.version
};
