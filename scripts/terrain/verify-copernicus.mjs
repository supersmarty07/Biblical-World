import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const regionIndex = args.indexOf('--region');
const region = regionIndex >= 0 ? args[regionIndex + 1] : 'jerusalem';
const root = process.cwd();
const manifestPath = path.join(root, 'source-manifest/copernicus-tiles.json');
if (!fs.existsSync(manifestPath)) throw new Error('Run node scripts/terrain/generate-source-manifest.mjs first.');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const rows = manifest.rows.filter((row) => region === 'all' || row.region === region);
if (!rows.length) throw new Error(`No Copernicus rows found for region ${region}`);

const unique = [...new Map(rows.map((row) => [row.https_url, row])).values()];
const verified = [];
const isTiff = (bytes) => {
  if (bytes.length < 4) return false;
  return (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a);
};

for (const row of unique) {
  process.stdout.write(`Verifying ${row.tile_id} ... `);
  const response = await fetch(row.https_url, { headers: { Range: 'bytes=0-3', 'Accept-Encoding': 'identity' }, redirect: 'follow' });
  const finalUrl = response.url;
  const contentRange = response.headers.get('content-range');
  const contentType = response.headers.get('content-type') || '';
  const etag = response.headers.get('etag') || '';
  const lastModified = response.headers.get('last-modified') || '';
  const acceptRanges = response.headers.get('accept-ranges') || '';
  if (response.status !== 206 || !contentRange?.startsWith('bytes 0-3/')) {
    await response.body?.cancel();
    throw new Error(`${row.tile_id} did not honor byte-range verification: HTTP ${response.status}, Content-Range=${contentRange || 'missing'}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!isTiff(bytes)) throw new Error(`${row.tile_id} returned non-TIFF magic bytes.`);
  const totalBytes = Number(contentRange.split('/')[1]);
  if (!Number.isFinite(totalBytes) || totalBytes <= 0) throw new Error(`${row.tile_id} has invalid object length in Content-Range.`);
  verified.push({ ...row, final_url: finalUrl, http_status: response.status, content_length: totalBytes, content_type: contentType, etag, last_modified: lastModified, accept_ranges: acceptRanges, verified: true });
  console.log(`OK (${totalBytes} bytes)`);
}

const outputDir = path.join(root, 'terrain-verification');
fs.mkdirSync(outputDir, { recursive: true });
const output = path.join(outputDir, `copernicus-${region}-verified.json`);
fs.writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), region, verified }, null, 2) + '\n');
console.log(`Verified ${verified.length} unique Copernicus objects. Report: ${path.relative(root, output)}`);
