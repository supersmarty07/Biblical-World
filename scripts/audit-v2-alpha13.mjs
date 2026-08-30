import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 13) throw new Error(`Expected package version at least 2.0.0-alpha.13, found ${pkg.version}`);

const overlay = fs.readFileSync(path.join(root, 'src/components/ImmersiveSceneOverlay.tsx'), 'utf8');
for (const needle of [
  'scene-cinematic--${timeOfDay}',
  "setQuality",
  "setTimeOfDay",
  "biblical-world:scene-camera",
  "Orbit left",
  "Top down",
  "Reset view"
]) {
  if (!overlay.includes(needle)) throw new Error(`Immersive scene overlay missing alpha.13 feature: ${needle}`);
}

const mapView = fs.readFileSync(path.join(root, 'src/components/MapView.tsx'), 'utf8');
for (const needle of [
  "queryRenderedFeatures(event.point, { layers: ['immersive-site-model-extrusion'] })",
  'hotspotId',
  "biblical-world:scene-camera",
  "orbit-left",
  "top-down",
  "map.easeTo"
]) {
  if (!mapView.includes(needle)) throw new Error(`MapView missing alpha.13 interactive 3D feature: ${needle}`);
}

const style = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
for (const needle of [
  'scene-cinematic__grade',
  'scene-cinematic__sun-glow',
  'bw-camera-pan',
  'terrain-scene-hud__camera',
  'data-quality'
]) {
  if (!style.includes(needle)) throw new Error(`styles.css missing alpha.13 cinematic/3D feature: ${needle}`);
}

const modelFiles = ['jerusalem.geojson', 'galilee.geojson', 'megiddo.geojson', 'sinai.geojson'];
let clickable = 0;
for (const filename of modelFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/site-models', filename), 'utf8'));
  for (const feature of data.features || []) {
    const p = feature.properties || {};
    if (p.hotspotId) clickable += 1;
    if (p.geometryRole !== 'derived-display-geometry') throw new Error(`${filename}/${p.id} lost derived-display-geometry boundary`);
    if (p.evidenceClass === 'known-archaeology') throw new Error(`${filename}/${p.id} cannot become known-archaeology without surveyed geometry`);
  }
}
if (clickable < 10) throw new Error(`Expected at least 10 clickable 3D site features, found ${clickable}`);

const terrainRegistry = JSON.parse(fs.readFileSync(path.join(root, 'public/data/terrain/regions.json'), 'utf8'));
if (terrainRegistry.version !== pkg.version) throw new Error('terrain registry version must match package version');
const sinaiTerrainStatus = terrainRegistry.regions.find((item) => item.id === 'sinai')?.status;
if (Number(alphaMatch[1]) < 18 && sinaiTerrainStatus !== 'incomplete-research-tile-list') throw new Error('Pre-alpha.18 Sinai tile research must remain explicitly incomplete');
if (Number(alphaMatch[1]) >= 18 && sinaiTerrainStatus !== 'builder-ready-source-unverified-until-action-run') throw new Error('Alpha.18+ Sinai terrain must remain unverified until the live terrain workflow runs');

const yam = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/scenes/yam-suph-environment-explorer.json'), 'utf8'));
if (yam.world?.siteModel) throw new Error('Yam Suph must not acquire an exact 3D site model');

console.log(`V2 alpha.13 audit passed: ${clickable} clickable evidence-aware 3D features plus cinematic time/quality/camera controls.`);
