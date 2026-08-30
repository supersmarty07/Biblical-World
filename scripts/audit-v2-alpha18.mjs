import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const pkg = json('package.json');
const match = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!match || Number(match[1]) < 18) throw new Error(`Expected alpha.18 or later, found ${pkg.version}`);

const map = read('src/components/MapView.tsx');
for (const needle of ['setContextLayerVisibility', "'Natural Earth · Sources'", 'terrainExaggerationForRegion']) {
  if (!map.includes(needle)) throw new Error(`Regional immersive map guardrail missing: ${needle}`);
}
if (!map.includes('!immersiveWorld && layers.places') || !map.includes('!immersiveWorld && layers.journeys') || !map.includes('!immersiveWorld && layers.regions')) {
  throw new Error('Immersive 3D mode must suppress unrelated global atlas layers.');
}

const workflow = read('.github/workflows/build-terrain.yml');
for (const needle of ['workflow_dispatch', 'Verify Copernicus objects live', 'Build lossless Terrain-RGB PMTiles', 'actions/upload-artifact@v4', 'Publish to Cloudflare R2']) {
  if (!workflow.includes(needle)) throw new Error(`Terrain workflow missing: ${needle}`);
}
const deploy = read('.github/workflows/deploy.yml');
if (!deploy.includes('branches: [main, BIBLE-WORLD-V4]')) throw new Error('BIBLE-WORLD-V4 deployment branch must remain active.');

const build = read('scripts/terrain/build-terrain.sh');
if (!build.includes('--format png')) throw new Error('Terrain-RGB build must use lossless PNG tiles.');
if (build.includes('--format webp')) throw new Error('Terrain-RGB build must never use lossy WebP.');
if (!build.includes('-te_srs EPSG:4326')) throw new Error('gdalwarp crop bounds must declare EPSG:4326 before reprojection.');

const verify = read('scripts/terrain/verify-copernicus.mjs');
for (const needle of ["Range: 'bytes=0-3'", 'response.status !== 206', 'isTiff(bytes)']) {
  if (!verify.includes(needle)) throw new Error(`Live Copernicus verification missing: ${needle}`);
}

const source = json('source-manifest/copernicus-tiles.json');
const sinai = source.rows.filter((row) => row.region === 'sinai');
if (sinai.length !== 20) throw new Error(`Expected 20 Sinai source rows for 27–31.3 N / 32–35.2 E, found ${sinai.length}`);
for (const tile of ['N27E035','N28E035','N29E035','N30E035','N31E035']) {
  if (!sinai.some((row) => row.tile_id === tile)) throw new Error(`Missing required Sinai east-column tile ${tile}`);
}
const unique = new Set(source.rows.map((row) => row.https_url));
if (source.rows.length !== 43 || unique.size !== 29) throw new Error(`Unexpected terrain source coverage: ${source.rows.length} rows / ${unique.size} unique URLs`);

const attribution = read('src/components/AttributionDrawer.tsx');
if (!attribution.includes('atlasConfig.hasAnyTerrain')) throw new Error('Regional terrain must activate Copernicus attribution.');
const sw = read('public/sw.js');
if (!sw.includes('v2-alpha18-runtime')) throw new Error('Service-worker cache must be bumped to alpha.18.');

console.log('V2 alpha.18 audit passed: scene-only regional 3D maps, live Copernicus verification, complete Sinai E035 coverage, lossless Terrain-RGB generation, PMTiles artifacts/R2 publishing, attribution, and BIBLE-WORLD-V4 deployment are protected.');
