import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (flag) => args.includes(flag);
const input = valueOf('--input');
const dryRun = has('--dry-run');
const outputRel = valueOf('--output') || 'assets/v2/roads/dare-roads.geojson';

if (!input) {
  console.error('Usage: node scripts/ingest-roman-roads.mjs --input <roads.geojson> [--output assets/v2/roads/dare-roads.geojson] [--dry-run]');
  process.exit(2);
}

const root = process.cwd();
const source = JSON.parse(await fs.readFile(input, 'utf8'));
if (source?.type !== 'FeatureCollection' || !Array.isArray(source.features)) throw new Error('Road input must be a GeoJSON FeatureCollection.');

let coordinateCount = 0;
let dropped = 0;
function validatePosition(pos) {
  if (!Array.isArray(pos) || pos.length < 2) throw new Error('Invalid road coordinate.');
  const [lon, lat] = pos;
  if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) throw new Error(`Road coordinate out of WGS84 bounds: ${lon}, ${lat}`);
  coordinateCount += 1;
  return [lon, lat];
}
function normalizeGeometry(geometry) {
  if (!geometry || !['LineString', 'MultiLineString'].includes(geometry.type)) return undefined;
  if (geometry.type === 'LineString') return { type: 'LineString', coordinates: geometry.coordinates.map(validatePosition) };
  return { type: 'MultiLineString', coordinates: geometry.coordinates.map((line) => line.map(validatePosition)) };
}
function safeProperties(properties) {
  const out = {};
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return out;
  for (const [key, value] of Object.entries(properties)) {
    if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) out[key] = value;
  }
  return out;
}

const features = [];
for (const feature of source.features) {
  const geometry = normalizeGeometry(feature?.geometry);
  if (!geometry) { dropped += 1; continue; }
  features.push({ type: 'Feature', ...(feature.id !== undefined ? { id: feature.id } : {}), properties: safeProperties(feature.properties), geometry });
}
const normalized = { type: 'FeatureCollection', features };
const text = `${JSON.stringify(normalized)}\n`;
const digest = crypto.createHash('sha256').update(text).digest('hex');
const bytes = Buffer.byteLength(text);
console.log(`Roman-road normalization: ${features.length} line feature(s), ${coordinateCount} coordinate(s), ${dropped} non-line feature(s) dropped, ${bytes} bytes, sha256 ${digest}.`);
if (dryRun) process.exit(0);

if (bytes > 16 * 1024 * 1024) throw new Error('Normalized road GeoJSON exceeds 16 MiB. Convert to vector PMTiles/external delivery instead of bundling this file.');
const output = path.join(root, 'public', outputRel);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, text);

const installedPath = path.join(root, 'src', 'generated', 'installedAssets.json');
const installed = JSON.parse(await fs.readFile(installedPath, 'utf8'));
installed.runtime.romanRoadsGeojson = outputRel;
installed.installed = (installed.installed || []).filter((item) => item.assetId !== 'dare-roman-roads');
installed.installed.push({ assetId: 'dare-roman-roads', path: outputRel, sha256: digest, sizeBytes: bytes, sourceResourceId: 'dare-roman-roads' });
await fs.writeFile(installedPath, `${JSON.stringify(installed, null, 2)}\n`);

const manifestPath = path.join(root, 'public', 'data', 'assets', 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const asset = manifest.assets.find((item) => item.id === 'dare-roman-roads');
if (!asset) throw new Error('Asset manifest is missing dare-roman-roads.');
asset.status = 'installed';
asset.delivery = 'bundled';
asset.publicPath = outputRel;
asset.sha256 = digest;
asset.sizeBytes = bytes;
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Installed normalized Roman roads at public/${outputRel}.`);
