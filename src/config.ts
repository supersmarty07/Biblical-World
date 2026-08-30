import installedAssets from './generated/installedAssets.json';

function publicAssetUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (/^https:\/\//i.test(value)) return value;
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`;
}

function externalHttpsUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && /^https:\/\//i.test(trimmed) ? trimmed : undefined;
}

const defaultTerrainUrl = (import.meta.env.VITE_TERRAIN_PMTILES_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.terrainPmtiles);
const terrainPmtilesByRegion = {
  jerusalem: (import.meta.env.VITE_TERRAIN_JERUSALEM_PMTILES_URL as string | undefined) || defaultTerrainUrl,
  galilee: (import.meta.env.VITE_TERRAIN_GALILEE_PMTILES_URL as string | undefined) || defaultTerrainUrl,
  megiddo: (import.meta.env.VITE_TERRAIN_MEGIDDO_PMTILES_URL as string | undefined) || defaultTerrainUrl,
  sinai: (import.meta.env.VITE_TERRAIN_SINAI_PMTILES_URL as string | undefined) || defaultTerrainUrl,
  delta: (import.meta.env.VITE_TERRAIN_DELTA_PMTILES_URL as string | undefined) || defaultTerrainUrl
} as const;

const terrainRegionLabels = {
  jerusalem: 'Jerusalem + Judea',
  galilee: 'Galilee + Sea of Galilee',
  megiddo: 'Megiddo + Jezreel',
  sinai: 'Sinai Peninsula',
  delta: 'Eastern Nile Delta'
} as const;

const terrainExaggerationByRegion = {
  jerusalem: 1.15,
  galilee: 1.15,
  megiddo: 1.15,
  sinai: 1.3,
  delta: 1.0
} as const;

export function terrainPmtilesForRegion(region?: string): string | undefined {
  if (!region) return defaultTerrainUrl;
  return terrainPmtilesByRegion[region as keyof typeof terrainPmtilesByRegion] || defaultTerrainUrl;
}

export function terrainExaggerationForRegion(region?: string): number {
  if (!region) return 1.08;
  return terrainExaggerationByRegion[region as keyof typeof terrainExaggerationByRegion] || 1.08;
}

export const terrainSources = Object.entries(terrainPmtilesByRegion).map(([id, url]) => ({
  id,
  label: terrainRegionLabels[id as keyof typeof terrainRegionLabels],
  url
}));

const cinematicMasterByRegion = {
  jerusalem: {
    url: externalHttpsUrl(import.meta.env.VITE_CINEMATIC_JERUSALEM_MASTER_URL as string | undefined),
    credit: (import.meta.env.VITE_CINEMATIC_JERUSALEM_MASTER_CREDIT as string | undefined)?.trim()
  },
  galilee: {
    url: externalHttpsUrl(import.meta.env.VITE_CINEMATIC_GALILEE_MASTER_URL as string | undefined),
    credit: (import.meta.env.VITE_CINEMATIC_GALILEE_MASTER_CREDIT as string | undefined)?.trim()
  },
  megiddo: {
    url: externalHttpsUrl(import.meta.env.VITE_CINEMATIC_MEGIDDO_MASTER_URL as string | undefined),
    credit: (import.meta.env.VITE_CINEMATIC_MEGIDDO_MASTER_CREDIT as string | undefined)?.trim()
  },
  sinai: {
    url: externalHttpsUrl(import.meta.env.VITE_CINEMATIC_SINAI_MASTER_URL as string | undefined),
    credit: (import.meta.env.VITE_CINEMATIC_SINAI_MASTER_CREDIT as string | undefined)?.trim()
  },
  delta: {
    url: externalHttpsUrl(import.meta.env.VITE_CINEMATIC_DELTA_MASTER_URL as string | undefined),
    credit: (import.meta.env.VITE_CINEMATIC_DELTA_MASTER_CREDIT as string | undefined)?.trim()
  }
} as const;

export function cinematicMasterForRegion(region?: string): { url: string; credit: string } | undefined {
  if (!region) return undefined;
  const candidate = cinematicMasterByRegion[region as keyof typeof cinematicMasterByRegion];
  return candidate?.url && candidate.credit ? { url: candidate.url, credit: candidate.credit } : undefined;
}

const configuredBasemapUrl = (import.meta.env.VITE_BASEMAP_PMTILES_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.basemapPmtiles);
const configuredBasemapAttribution = (import.meta.env.VITE_BASEMAP_ATTRIBUTION as string | undefined)?.trim();
const configuredRoadSourceId = ((import.meta.env.VITE_ROMAN_ROADS_SOURCE_ID as string | undefined) || 'dare-roman-roads').trim();
const allowedRoadSourceIds = new Set(['dare-roman-roads', 'awmc-antiquity-alacarte']);

export const atlasConfig = {
  title: 'The Biblical World',
  subtitle: 'Genesis → Revelation',
  terrainPmtilesUrl: defaultTerrainUrl,
  terrainPmtilesByRegion,
  hasAnyTerrain: terrainSources.some((item) => Boolean(item.url)),
  cinematicMasterByRegion,
  basemapPmtilesUrl: configuredBasemapUrl && configuredBasemapAttribution ? configuredBasemapUrl : undefined,
  basemapAttribution: configuredBasemapAttribution,
  basemapConfigurationWarning: configuredBasemapUrl && !configuredBasemapAttribution ? 'External basemap URL ignored because VITE_BASEMAP_ATTRIBUTION is missing.' : undefined,
  romanRoadsGeojsonUrl: (import.meta.env.VITE_ROMAN_ROADS_GEOJSON_URL as string | undefined) || publicAssetUrl(installedAssets.runtime.romanRoadsGeojson),
  romanRoadsSourceId: allowedRoadSourceIds.has(configuredRoadSourceId) ? configuredRoadSourceId : 'dare-roman-roads',
  romanRoadsConfigurationWarning: allowedRoadSourceIds.has(configuredRoadSourceId) ? undefined : `Unsupported Roman-road source id “${configuredRoadSourceId}”; defaulting attribution to DARE.`,
  deployBranch: (import.meta.env.VITE_DEPLOY_BRANCH as string | undefined)?.trim() || 'local',
  installedAssetVersion: installedAssets.version
};
