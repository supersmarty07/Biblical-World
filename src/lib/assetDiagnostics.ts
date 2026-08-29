import type { RuntimeAssetHealth, RuntimeAssetKey } from '../types/runtimeAssets';

const timeoutMs = 8000;

function nowIso() {
  return new Date().toISOString();
}

function absoluteUrl(value: string): string {
  return new URL(value, window.location.href).toString();
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } finally {
    window.clearTimeout(timer);
  }
}

async function diagnosePmtiles(key: RuntimeAssetKey, configuredUrl?: string): Promise<RuntimeAssetHealth> {
  if (!configuredUrl) return { state: 'not-configured', message: 'No external PMTiles URL is configured.' };
  const url = absoluteUrl(configuredUrl);
  try {
    const response = await fetchWithTimeout(url, { headers: { Range: 'bytes=0-0' } });
    const contentRange = response.headers.get('content-range');
    const acceptsRanges = response.headers.get('accept-ranges');
    response.body?.cancel().catch(() => undefined);
    const rangeSupported = response.status === 206 || Boolean(contentRange) || acceptsRanges?.toLowerCase() === 'bytes';
    if (!response.ok) {
      return { state: 'error', message: `Origin returned HTTP ${response.status}.`, checkedAt: nowIso(), url, httpStatus: response.status, rangeSupported };
    }
    if (!rangeSupported) {
      return { state: 'degraded', message: 'Origin responded, but HTTP byte-range support was not detected. PMTiles may fail or download inefficiently.', checkedAt: nowIso(), url, httpStatus: response.status, rangeSupported: false };
    }
    return { state: 'ready', message: 'HTTPS/CORS request succeeded and byte-range support was detected.', checkedAt: nowIso(), url, httpStatus: response.status, rangeSupported: true };
  } catch (error) {
    return { state: 'error', message: `Could not reach the PMTiles origin: ${error instanceof Error ? error.message : String(error)}. Check HTTPS, CORS, and Range support.`, checkedAt: nowIso(), url };
  }
}

async function diagnoseGeoJson(configuredUrl?: string): Promise<RuntimeAssetHealth> {
  if (!configuredUrl) return { state: 'not-configured', message: 'No Roman-road GeoJSON URL is configured.' };
  const url = absoluteUrl(configuredUrl);
  try {
    let response = await fetchWithTimeout(url, { method: 'HEAD' });
    if (response.status === 405 || response.status === 501) {
      response = await fetchWithTimeout(url, { headers: { Range: 'bytes=0-2047' } });
    }
    const contentType = response.headers.get('content-type') || '';
    response.body?.cancel().catch(() => undefined);
    if (!response.ok) {
      return { state: 'error', message: `Road origin returned HTTP ${response.status}.`, checkedAt: nowIso(), url, httpStatus: response.status };
    }
    const contentTypeLooksUseful = /json|geojson|text\/plain/i.test(contentType) || !contentType;
    return {
      state: contentTypeLooksUseful ? 'ready' : 'degraded',
      message: contentTypeLooksUseful ? 'Road origin is reachable through the browser.' : `Origin is reachable, but returned content type “${contentType}”.`,
      checkedAt: nowIso(),
      url,
      httpStatus: response.status
    };
  } catch (error) {
    return { state: 'error', message: `Could not reach the road dataset: ${error instanceof Error ? error.message : String(error)}. Check HTTPS and CORS.`, checkedAt: nowIso(), url };
  }
}

export async function diagnoseRuntimeAsset(key: RuntimeAssetKey, configuredUrl?: string): Promise<RuntimeAssetHealth> {
  if (key === 'roman-roads') return diagnoseGeoJson(configuredUrl);
  return diagnosePmtiles(key, configuredUrl);
}

export const runtimeAssetRetryEvent = 'biblical-world:retry-map-asset';
