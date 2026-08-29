import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes('--dry-run');
const assetId = valueOf('--asset');
const input = valueOf('--input');
const metadataPath = valueOf('--metadata');
if (!assetId || !input || !metadataPath) {
  console.error('Usage: node scripts/install-derived-geojson.mjs --asset <manifest-id> --input <layer.geojson> --metadata <derivation.json>');
  process.exit(2);
}
const root = process.cwd();
const manifestPath = path.join(root, 'public', 'data', 'assets', 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const asset = manifest.assets.find((item) => item.id === assetId);
if (!asset) throw new Error(`Unknown asset ${assetId}.`);
if (asset.kind !== 'derived-geojson') throw new Error(`${assetId} is not a derived-geojson asset.`);

const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
if (metadata.schemaVersion !== 1 || metadata.assetId !== assetId) throw new Error('Derivation metadata must have schemaVersion 1 and matching assetId.');
if (metadata.derivationMethod !== 'independently-authored') throw new Error('Derived paleogeography must declare derivationMethod independently-authored.');
if (!Array.isArray(metadata.citations) || metadata.citations.length === 0) throw new Error('Derivation metadata requires citations.');
if (typeof metadata.uncertainty !== 'string' || !metadata.uncertainty.trim()) throw new Error('Derivation metadata requires an uncertainty statement.');
if (metadata.noExactEventCoordinateClaims !== true) throw new Error('Derivation metadata must explicitly set noExactEventCoordinateClaims=true.');

const geojson = JSON.parse(await fs.readFile(input, 'utf8'));
if (geojson?.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) throw new Error('Derived layer must be a GeoJSON FeatureCollection.');
const allowed = new Set(['Polygon', 'MultiPolygon', 'LineString', 'MultiLineString']);
function walkCoordinates(value, depth = 0) {
  if (!Array.isArray(value)) throw new Error('Invalid coordinates in derived GeoJSON.');
  if (value.length >= 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    const [lon, lat] = value;
    if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) throw new Error(`Coordinate out of WGS84 bounds: ${lon}, ${lat}`);
    return;
  }
  if (depth > 8) throw new Error('Unexpected coordinate nesting depth.');
  for (const item of value) walkCoordinates(item, depth + 1);
}
for (const feature of geojson.features) {
  if (!allowed.has(feature?.geometry?.type)) throw new Error(`Unsupported derived geometry ${feature?.geometry?.type}.`);
  walkCoordinates(feature.geometry.coordinates);
  feature.properties = { ...(feature.properties || {}), evidenceClass: 'historical-inference', reconstruction: true, assetId };
}
const text = `${JSON.stringify(geojson)}\n`;
const digest = crypto.createHash('sha256').update(text).digest('hex');
if (dryRun) {
  console.log(`Derived-layer dry run passed for ${assetId}: ${geojson.features.length} feature(s), sha256 ${digest}. No files changed.`);
  process.exit(0);
}
const outRel = `assets/v2/derived/${assetId}.geojson`;
const metaRel = `assets/v2/derived/${assetId}.meta.json`;
await fs.mkdir(path.join(root, 'public', 'assets', 'v2', 'derived'), { recursive: true });
await fs.writeFile(path.join(root, 'public', outRel), text);
await fs.writeFile(path.join(root, 'public', metaRel), `${JSON.stringify(metadata, null, 2)}\n`);
asset.status = 'installed';
asset.delivery = 'bundled';
asset.publicPath = outRel;
asset.metadataPath = metaRel;
asset.sha256 = digest;
asset.sizeBytes = Buffer.byteLength(text);
asset.citations = metadata.citations;
asset.notes = `${asset.notes} Derivation uncertainty: ${metadata.uncertainty}`;
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Installed derived layer ${assetId}: ${geojson.features.length} feature(s), sha256 ${digest}.`);
