import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const pkg = json('package.json');
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 14) throw new Error(`Expected package version at least 2.0.0-alpha.14, found ${pkg.version}`);

const deploy = read('.github/workflows/deploy.yml');
if (!deploy.includes('branches: [main, BIBLE-WORLD-V4]')) throw new Error('Pages deployment must target main and BIBLE-WORLD-V4');
if (deploy.includes('bible-world-v2')) throw new Error('Legacy bible-world-v2 deployment branch must not remain active');
for (const key of [
  'VITE_DEPLOY_BRANCH',
  'VITE_TERRAIN_JERUSALEM_PMTILES_URL',
  'VITE_CINEMATIC_JERUSALEM_MASTER_URL',
  'VITE_CINEMATIC_JERUSALEM_MASTER_CREDIT',
  'VITE_CINEMATIC_GALILEE_MASTER_URL',
  'VITE_CINEMATIC_MEGIDDO_MASTER_URL',
  'VITE_CINEMATIC_SINAI_MASTER_URL',
  'VITE_CINEMATIC_DELTA_MASTER_URL'
]) {
  if (!deploy.includes(key)) throw new Error(`Deployment workflow missing ${key}`);
}

const config = read('src/config.ts');
for (const needle of ['terrainSources', 'hasAnyTerrain', 'cinematicMasterForRegion', 'VITE_CINEMATIC_JERUSALEM_MASTER_CREDIT', 'deployBranch']) {
  if (!config.includes(needle)) throw new Error(`config.ts missing alpha.14 runtime feature: ${needle}`);
}

const overlay = read('src/components/ImmersiveSceneOverlay.tsx');
for (const needle of ['cinematicMasterForRegion', 'scene-cinematic__master', 'High-resolution reconstruction master', 'final high-resolution master not configured']) {
  if (!overlay.includes(needle)) throw new Error(`Immersive overlay missing alpha.14 cinematic feature: ${needle}`);
}

const diagnostics = read('src/components/DeploymentDiagnostics.tsx');
for (const needle of ['Regional terrain archives', 'terrainSources', 'Checking CORS + byte ranges', 'Build branch:']) {
  if (!diagnostics.includes(needle)) throw new Error(`Deployment diagnostics missing alpha.14 regional feature: ${needle}`);
}

const layers = read('src/components/LayerControls.tsx');
if (!layers.includes('atlasConfig.hasAnyTerrain')) throw new Error('Layers panel must recognize regional-only terrain configuration');

const artwork = json('public/data/immersive/artwork-manifest.json');
if (artwork.version !== pkg.version) throw new Error('Artwork manifest version must match package version');
if (artwork.worlds.length !== 5) throw new Error(`Expected 5 flagship artwork slots, found ${artwork.worlds.length}`);
for (const world of artwork.worlds) {
  if (world.evidenceClass !== 'artistic-reconstruction') throw new Error(`${world.id} cinematic master must remain artistic-reconstruction`);
  if (!world.urlEnvVar || !world.creditEnvVar) throw new Error(`${world.id} must require URL + credit env vars`);
}
const delta = artwork.worlds.find((world) => world.id === 'delta');
if (!delta?.guardrail?.includes('No exact Exodus crossing point')) throw new Error('Delta cinematic artwork must retain Exodus crossing guardrail');

const terrain = json('public/data/terrain/regions.json');
if (terrain.version !== pkg.version) throw new Error('Terrain registry version must match package version');
if (terrain.regions.find((item) => item.id === 'sinai')?.status !== 'incomplete-research-tile-list') throw new Error('Sinai terrain research must remain explicitly incomplete');

const yam = json('public/data/immersive/scenes/yam-suph-environment-explorer.json');
if (yam.world?.siteModel) throw new Error('Yam Suph must not acquire an exact 3D site model');

console.log('V2 alpha.14 audit passed: BIBLE-WORLD-V4 deployment, independent regional terrain diagnostics, and five credited cinematic-master slots are protected.');
