import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const spec = JSON.parse(fs.readFileSync(path.join(root, 'scripts/terrain/regions.json'), 'utf8'));
const outDir = path.join(root, 'source-manifest');
fs.mkdirSync(outDir, { recursive: true });

const pad = (value, width) => String(Math.abs(value)).padStart(width, '0');
const latCode = (lat) => `${lat >= 0 ? 'N' : 'S'}${pad(lat, 2)}`;
const lonCode = (lon) => `${lon >= 0 ? 'E' : 'W'}${pad(lon, 3)}`;

const rows = [];
for (const region of spec.regions) {
  const [west, south, east, north] = region.bounds;
  const lonStart = Math.floor(west);
  const lonEnd = Math.ceil(east) - 1;
  const latStart = Math.floor(south);
  const latEnd = Math.ceil(north) - 1;
  for (let lat = latStart; lat <= latEnd; lat += 1) {
    for (let lon = lonStart; lon <= lonEnd; lon += 1) {
      const tileId = `${latCode(lat)}${lonCode(lon)}`;
      const objectName = `Copernicus_DSM_COG_10_${latCode(lat)}_00_${lonCode(lon)}_00_DEM`;
      const filename = `${objectName}.tif`;
      const httpsUrl = `${spec.source.baseHttpsUrl}/${objectName}/${filename}`;
      const s3Uri = `s3://${spec.source.s3Bucket}/${objectName}/${filename}`;
      rows.push({ region: region.id, tile_id: tileId, object_name: objectName, https_url: httpsUrl, s3_uri: s3Uri, filename, west: lon, south: lat, east: lon + 1, north: lat + 1 });
    }
  }
}

const columns = ['region', 'tile_id', 'object_name', 'https_url', 's3_uri', 'filename', 'west', 'south', 'east', 'north'];
const csv = [columns.join(','), ...rows.map((row) => columns.map((key) => row[key]).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(outDir, 'copernicus-tiles.csv'), csv);
fs.writeFileSync(path.join(outDir, 'copernicus-tiles.json'), JSON.stringify({ schemaVersion: 1, source: spec.source, rows }, null, 2) + '\n');

const unique = new Map(rows.map((row) => [row.https_url, row]));
console.log(`Generated ${rows.length} region-tile rows covering ${unique.size} unique Copernicus objects.`);
for (const region of spec.regions) {
  const count = rows.filter((row) => row.region === region.id).length;
  console.log(`${region.id}: ${count} tile rows`);
}
