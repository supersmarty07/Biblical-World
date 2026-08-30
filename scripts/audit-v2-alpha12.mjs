import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 12) throw new Error(`Expected package version >= 2.0.0-alpha.12, found ${pkg.version}`);


const terrainRegistry = JSON.parse(fs.readFileSync(path.join(root, 'public/data/terrain/regions.json'), 'utf8'));
if (terrainRegistry.version !== pkg.version) throw new Error('terrain region registry must match package version');
for (const region of ['jerusalem', 'galilee', 'megiddo', 'sinai', 'delta']) {
  const item = terrainRegistry.regions.find((candidate) => candidate.id === region);
  if (!item) throw new Error(`terrain region registry missing ${region}`);
  if (!item.envVar || !item.bbox || item.bbox.length !== 4) throw new Error(`terrain region ${region} requires envVar and bbox`);
}
const sinaiTerrainStatus = terrainRegistry.regions.find((item) => item.id === 'sinai')?.status;
if (Number(alphaMatch[1]) < 18 && sinaiTerrainStatus !== 'incomplete-research-tile-list') throw new Error('Pre-alpha.18 Sinai terrain research list must remain explicitly incomplete');
if (Number(alphaMatch[1]) >= 18 && sinaiTerrainStatus !== 'builder-ready-source-unverified-until-action-run') throw new Error('Alpha.18+ Sinai terrain must remain unverified until the live terrain workflow runs');
const configText = fs.readFileSync(path.join(root, 'src/config.ts'), 'utf8');
for (const envName of ['VITE_TERRAIN_JERUSALEM_PMTILES_URL', 'VITE_TERRAIN_GALILEE_PMTILES_URL', 'VITE_TERRAIN_MEGIDDO_PMTILES_URL', 'VITE_TERRAIN_SINAI_PMTILES_URL', 'VITE_TERRAIN_DELTA_PMTILES_URL']) {
  if (!configText.includes(envName)) throw new Error(`regional terrain config missing ${envName}`);
}

const sceneIds = [
  'jerusalem-historical-terrain',
  'galilee-ministry-landscape',
  'megiddo-terrain-prototype',
  'sinai-wilderness-prototype',
  'yam-suph-environment-explorer'
];

let animatedLayers = 0;
for (const id of sceneIds) {
  const scenePath = path.join(root, 'public', 'data', 'immersive', 'scenes', `${id}.json`);
  const scene = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
  if (!scene.world) throw new Error(`${id} must declare an immersive world configuration`);
  if (!['3d-map', 'animated-reconstruction'].includes(scene.world.defaultMode)) throw new Error(`${id} has invalid world default mode`);
  if (!scene.world.mapCamera || scene.world.mapCamera.pitch < 35) throw new Error(`${id} must provide a pitched 3D teaching camera`);
  if (!scene.world.reconstruction?.layers?.length || scene.world.reconstruction.layers.length < 5) throw new Error(`${id} must provide at least five animated reconstruction layers`);
  if (!scene.evidenceLegend.some((entry) => entry.class === 'artistic-reconstruction')) throw new Error(`${id} must visibly distinguish artistic reconstruction`);
  const assetMap = new Map(scene.assets.map((asset) => [asset.id, asset]));
  for (const layer of scene.world.reconstruction.layers) {
    const asset = assetMap.get(layer.assetId);
    if (!asset) throw new Error(`${id} reconstruction layer ${layer.assetId} is missing from assets`);
    if (asset.provenance.verificationStatus !== 'project-authored') throw new Error(`${id} layer ${layer.assetId} must remain project-authored artistic reconstruction`);
    const filePath = path.join(root, 'public', asset.src);
    if (!fs.existsSync(filePath)) throw new Error(`${id} layer file missing: ${asset.src}`);
    animatedLayers += 1;
  }
}

const siteModels = ['jerusalem.geojson', 'galilee.geojson', 'megiddo.geojson', 'sinai.geojson'];
let siteFeatures = 0;
for (const filename of siteModels) {
  const modelPath = path.join(root, 'public', 'data', 'immersive', 'site-models', filename);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  if (!model.metadata?.warning) throw new Error(`${filename} must carry an explicit geometry warning`);
  for (const feature of model.features || []) {
    siteFeatures += 1;
    const p = feature.properties || {};
    if (p.geometryRole !== 'derived-display-geometry') throw new Error(`${filename}/${p.id} must be derived-display-geometry`);
    if (p.heightBasis !== 'illustrative') throw new Error(`${filename}/${p.id} extrusion height must be marked illustrative`);
    if (p.evidenceClass === 'known-archaeology') throw new Error(`${filename}/${p.id} cannot be known-archaeology without surveyed geometry`);
    if (!p.note || p.note.length < 40) throw new Error(`${filename}/${p.id} needs a substantive geometry boundary note`);
  }
}

const jerusalem = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/site-models/jerusalem.geojson'), 'utf8'));
const templeMount = jerusalem.features.find((feature) => feature.properties?.id === 'temple-mount-display');
if (!templeMount || templeMount.properties.evidenceClass !== 'historical-inference') throw new Error('Jerusalem Temple Mount display shell must remain historical-inference');
if (!/not a surveyed polygon/i.test(templeMount.properties.note)) throw new Error('Jerusalem Temple Mount display shell must state it is not a surveyed polygon');

const sinai = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/site-models/sinai.geojson'), 'utf8'));
if (sinai.features.some((feature) => feature.properties?.coordinateRole === 'identified-site')) throw new Error('Sinai candidate display markers must never be identified-site geometry');

const yam = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/scenes/yam-suph-environment-explorer.json'), 'utf8'));
if (yam.world.siteModel) throw new Error('Yam Suph environment must not install an exact site model');
if (/crossing point coordinate|exact crossing point/i.test(JSON.stringify(yam.world.reconstruction)) && !/no crossing|no exact/i.test(JSON.stringify(yam.world.reconstruction))) throw new Error('Yam Suph reconstruction must not imply an exact crossing point');

const overlay = fs.readFileSync(path.join(root, 'src/components/ImmersiveSceneOverlay.tsx'), 'utf8');
for (const needle of ['AnimatedWorldView', 'WorldModeSwitch', "'3d-map'", "'animated-reconstruction'", 'prefers-reduced-motion']) {
  if (!overlay.includes(needle)) throw new Error(`ImmersiveSceneOverlay missing alpha.12 feature: ${needle}`);
}
const mapView = fs.readFileSync(path.join(root, 'src/components/MapView.tsx'), 'utf8');
for (const needle of ['immersive-site-model-extrusion', "type: 'fill-extrusion'", 'derived-display-geometry', 'ensureSiteModel']) {
  if (!mapView.includes(needle)) throw new Error(`MapView missing alpha.12 3D site geometry feature: ${needle}`);
}

const totalVisualBytes = sceneIds.flatMap((id) => {
  const scene = JSON.parse(fs.readFileSync(path.join(root, 'public/data/immersive/scenes', `${id}.json`), 'utf8'));
  return scene.world.reconstruction.layers.map((layer) => {
    const asset = scene.assets.find((candidate) => candidate.id === layer.assetId);
    return fs.statSync(path.join(root, 'public', asset.src)).size;
  });
}).reduce((sum, size) => sum + size, 0);
if (totalVisualBytes > 1024 * 1024) throw new Error(`Alpha.12 bundled animated layers exceed 1 MiB: ${totalVisualBytes} bytes`);

console.log(`V2 alpha.12 audit passed: ${sceneIds.length} immersive worlds, ${animatedLayers} animated layers, ${siteFeatures} evidence-aware 3D display features, ${totalVisualBytes} visual bytes.`);
