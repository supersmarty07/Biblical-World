#!/usr/bin/env bash
set -euo pipefail

REGION="${1:-jerusalem}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if ! command -v gdalbuildvrt >/dev/null || ! command -v gdalwarp >/dev/null || ! command -v rio >/dev/null || ! command -v pmtiles >/dev/null; then
  echo "Missing required tooling. Need GDAL, rasterio/rio-rgbify, and the pmtiles CLI." >&2
  exit 1
fi

node scripts/terrain/generate-source-manifest.mjs >/dev/null
readarray -t META < <(node - "$REGION" <<'NODE'
const fs = require('fs');
const regionId = process.argv[2];
const spec = JSON.parse(fs.readFileSync('scripts/terrain/regions.json', 'utf8'));
const region = spec.regions.find((item) => item.id === regionId);
if (!region) throw new Error(`Unknown terrain region ${regionId}`);
console.log(region.bounds.join(' '));
console.log(region.minzoom);
console.log(region.maxzoom);
console.log(region.output);
NODE
)
BOUNDS="${META[0]}"
MINZOOM="${META[1]}"
MAXZOOM="${META[2]}"
OUTPUT="${META[3]}"

mapfile -t FILES < <(node - "$REGION" <<'NODE'
const fs = require('fs');
const region = process.argv[2];
const manifest = JSON.parse(fs.readFileSync('source-manifest/copernicus-tiles.json', 'utf8'));
const rows = manifest.rows.filter((row) => row.region === region);
const unique = [...new Map(rows.map((row) => [row.filename, row])).values()];
for (const row of unique) console.log(`terrain-source/copernicus/${row.filename}`);
NODE
)

for file in "${FILES[@]}"; do
  if [ ! -s "$file" ]; then
    echo "Missing source tile: $file" >&2
    echo "Run ./scripts/terrain/download-terrain.sh $REGION first." >&2
    exit 1
  fi
done

mkdir -p tmp-terrain dist-terrain
VRT="tmp-terrain/${REGION}.vrt"
WARPED="tmp-terrain/${REGION}-3857.tif"
MBTILES="tmp-terrain/${REGION}.mbtiles"
FINAL="dist-terrain/${OUTPUT}"

rm -f "$VRT" "$WARPED" "$MBTILES" "$FINAL"
gdalbuildvrt -srcnodata -32767 -vrtnodata -32767 "$VRT" "${FILES[@]}"
read -r WEST SOUTH EAST NORTH <<< "$BOUNDS"
gdalwarp \
  -t_srs EPSG:3857 \
  -te "$WEST" "$SOUTH" "$EAST" "$NORTH" \
  -te_srs EPSG:4326 \
  -r bilinear \
  -srcnodata -32767 \
  -dstnodata -32767 \
  -multi \
  -wo NUM_THREADS=ALL_CPUS \
  -co TILED=YES \
  -co COMPRESS=DEFLATE \
  -co BIGTIFF=IF_SAFER \
  "$VRT" "$WARPED"

echo "Encoding lossless Mapbox Terrain-RGB PNG tiles: z${MINZOOM}-z${MAXZOOM}"
rio rgbify \
  -b -10000 \
  -i 0.1 \
  --min-z "$MINZOOM" \
  --max-z "$MAXZOOM" \
  --format png \
  "$WARPED" "$MBTILES"

pmtiles convert "$MBTILES" "$FINAL"
pmtiles show "$FINAL"
sha256sum "$FINAL" | tee "${FINAL}.sha256"
echo "Built $FINAL"
du -h "$FINAL"
