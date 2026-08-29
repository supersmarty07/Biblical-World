import fs from 'node:fs/promises';
import process from 'node:process';

const errors = [];
const read = (file) => fs.readFile(file, 'utf8');
const [pkgText, sw, mapView, drawer, diagnostics, diagLib, layerControls, deploy, envExample, manifestText, config] = await Promise.all([
  read('package.json'), read('public/sw.js'), read('src/components/MapView.tsx'), read('src/components/AttributionDrawer.tsx'),
  read('src/components/DeploymentDiagnostics.tsx'), read('src/lib/assetDiagnostics.ts'), read('src/components/LayerControls.tsx'),
  read('.github/workflows/deploy.yml'), read('.env.example'), read('public/data/assets/manifest.json'), read('src/config.ts')
]);
const pkg = JSON.parse(pkgText);
const manifest = JSON.parse(manifestText);

if (pkg.version !== '2.0.0-alpha.11') errors.push(`package version must be 2.0.0-alpha.11, got ${pkg.version}`);
if (manifest.version !== pkg.version) errors.push('asset manifest must match package version');
if (!sw.includes('v2-alpha11-runtime')) errors.push('service worker cache must be alpha11');
if (!sw.includes("request.headers.has('range')")) errors.push('service worker Range bypass must remain present');
if (!drawer.includes('aria-modal="true"') || !drawer.includes('restoreFocusRef') || !drawer.includes("event.key === 'Escape'")) errors.push('attribution drawer must be modal, Escape-closeable, and restore focus');
if (!drawer.includes('loadVerificationRegistry') || !drawer.includes('loadV2AssetManifest')) errors.push('attribution drawer must derive credits from verification + asset manifests');
if (!diagnostics.includes('Run diagnostics / retry') || !diagnostics.includes('Range required')) errors.push('deployment diagnostics must expose retry and Range requirements');
if (!diagLib.includes("Range: 'bytes=0-0'") || !diagLib.includes("cache: 'no-store'")) errors.push('PMTiles browser diagnostic must use a no-cache byte-range request');
if (!diagLib.includes('AbortController')) errors.push('runtime diagnostics must have a bounded timeout');
if (!diagLib.includes('biblical-world:retry-map-asset') || !diagnostics.includes('runtimeAssetRetryEvent') || !mapView.includes('runtimeAssetRetryEvent')) errors.push('successful diagnostics must be able to retry MapLibre external sources without a page reload');
if (!mapView.includes("map.on('error'") || !mapView.includes("map.on('sourcedata'")) errors.push('MapView must expose source success/failure health');
if (!mapView.includes('Falling back to the flat atlas map')) errors.push('terrain failure must explicitly degrade to the flat atlas');
if (!mapView.includes('Bundled Natural Earth remains available')) errors.push('basemap failure must retain bundled fallback');
if (!layerControls.includes('DeploymentDiagnostics')) errors.push('layer panel must expose deployment diagnostics');
for (const envName of ['VITE_TERRAIN_PMTILES_URL', 'VITE_BASEMAP_PMTILES_URL', 'VITE_ROMAN_ROADS_GEOJSON_URL']) {
  if (!envExample.includes(envName)) errors.push(`.env.example missing ${envName}`);
  if (!deploy.includes(`${envName}: \${{ vars.${envName} }}`)) errors.push(`deploy workflow must accept GitHub repository variable ${envName}`);
}
for (const envName of ['VITE_BASEMAP_ATTRIBUTION', 'VITE_ROMAN_ROADS_SOURCE_ID']) {
  if (!envExample.includes(envName)) errors.push(`.env.example missing ${envName}`);
  if (!deploy.includes(`${envName}: \${{ vars.${envName} }}`)) errors.push(`deploy workflow must accept GitHub repository variable ${envName}`);
}
if (!config.includes('External basemap URL ignored because VITE_BASEMAP_ATTRIBUTION is missing')) errors.push('external basemap must fail closed when attribution metadata is missing');
if (!config.includes("new Set(['dare-roman-roads', 'awmc-antiquity-alacarte'])")) errors.push('Roman-road runtime attribution must be constrained to known verification resource ids');
if (!deploy.includes('VITE_BASE_PATH: /${{ github.event.repository.name }}/')) errors.push('GitHub Pages repository base path must remain explicit');
if (!deploy.includes('npm run build')) errors.push('deploy workflow must production-build before upload');

if (errors.length) {
  console.error(`V2 alpha.11 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('V2 alpha.11 audit passed: attribution UI, runtime asset diagnostics, graceful map fallbacks, Range/CORS checks, and GitHub Pages deployment variables are present.');
