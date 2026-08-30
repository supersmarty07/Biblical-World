#!/usr/bin/env bash
set -euo pipefail

REGION="${1:-jerusalem}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
node scripts/terrain/generate-source-manifest.mjs >/dev/null
node scripts/terrain/verify-copernicus.mjs --region "$REGION"

OUT_DIR="terrain-source/copernicus"
mkdir -p "$OUT_DIR"

node - "$REGION" <<'NODE' | while IFS=$'\t' read -r url filename; do
const fs = require('fs');
const region = process.argv[2];
const manifest = JSON.parse(fs.readFileSync('source-manifest/copernicus-tiles.json', 'utf8'));
const rows = manifest.rows.filter((row) => region === 'all' || row.region === region);
const unique = [...new Map(rows.map((row) => [row.https_url, row])).values()];
for (const row of unique) console.log(`${row.https_url}\t${row.filename}`);
NODE
  target="$OUT_DIR/$filename"
  echo "Downloading $filename"
  curl --fail --location --retry 3 --retry-delay 2 --continue-at - --output "$target" "$url"
  test -s "$target"
  gdalinfo "$target" >/dev/null
  echo "Validated $target"
done

echo "Terrain source download complete."
du -sh "$OUT_DIR"
