import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const errors = [];
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const assetManifest = JSON.parse(await fs.readFile(path.join(root, 'public', 'data', 'assets', 'manifest.json'), 'utf8'));
const installed = JSON.parse(await fs.readFile(path.join(root, 'src', 'generated', 'installedAssets.json'), 'utf8'));
const sw = await fs.readFile(path.join(root, 'public', 'sw.js'), 'utf8');
const config = await fs.readFile(path.join(root, 'src', 'config.ts'), 'utf8');
const mapView = await fs.readFile(path.join(root, 'src', 'components', 'MapView.tsx'), 'utf8');
const overlay = await fs.readFile(path.join(root, 'src', 'components', 'ImmersiveSceneOverlay.tsx'), 'utf8');

const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version || '');
if (!alphaMatch || Number(alphaMatch[1]) < 10) errors.push(`package version must retain alpha.10+ asset-pipeline semantics, got ${pkg.version}`);
if (assetManifest.version !== pkg.version || installed.version !== pkg.version) errors.push('asset manifest / installed registry must match package version');
if (!/v2-alpha\d+-runtime/.test(sw)) errors.push('service worker cache must remain versioned');
if (!sw.includes('/data/assets/manifest.json')) errors.push('asset manifest must be network-first/version-sensitive');
if (!sw.includes("request.headers.has('range')")) errors.push('service worker must keep Range-request bypass');
if (!config.includes("installedAssets from './generated/installedAssets.json'")) errors.push('config must consume generated installed asset registry');
if (!mapView.includes('asAbsoluteAssetUrl')) errors.push('MapView must resolve GitHub Pages-safe asset URLs');
if (!overlay.includes('Asset pipeline')) errors.push('scene verification panel must expose asset pipeline state');

const naturalEarth = assetManifest.assets.find((asset) => asset.id === 'natural-earth-land-fallback');
if (naturalEarth?.status !== 'installed') errors.push('Natural Earth fallback must remain an actually installed asset');
const terrain = assetManifest.assets.find((asset) => asset.id === 'copernicus-glo30-terrain');
if (!terrain || !['awaiting-source-bytes', 'configured-external'].includes(terrain.status)) errors.push('terrain must remain pending or explicitly configured, never silently installed');
const babylon = assetManifest.assets.find((asset) => asset.id === 'babylon-spatial-layout');
if (babylon?.status !== 'blocked-verification') errors.push('Babylon spatial layout must remain blocked until its specific source/license is verified');
const imagePack = assetManifest.assets.find((asset) => asset.id === 'historic-landscape-image-pack');
if (imagePack?.status !== 'awaiting-item-selection') errors.push('historic image pack must require item-level selection/license verification');

if (errors.length) {
  console.error(`V2 alpha.10 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`V2 alpha.10 audit passed: ${assetManifest.assets.length} asset pipeline records; installed bytes remain explicit and license-gated.`);
