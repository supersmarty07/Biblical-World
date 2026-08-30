#!/usr/bin/env bash
set -euo pipefail
REGION="${1:-jerusalem}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

OUTPUT="$(node - "$REGION" <<'NODE'
const fs = require('fs');
const id = process.argv[2];
const spec = JSON.parse(fs.readFileSync('scripts/terrain/regions.json', 'utf8'));
const region = spec.regions.find((item) => item.id === id);
if (!region) throw new Error(`Unknown region ${id}`);
console.log(region.output);
NODE
)"
FILE="dist-terrain/$OUTPUT"
test -s "$FILE"
SIZE="$(stat -c %s "$FILE" 2>/dev/null || stat -f %z "$FILE")"
if [ "$SIZE" -lt 1024 ]; then
  echo "Terrain archive is unexpectedly small: $SIZE bytes" >&2
  exit 1
fi
pmtiles show "$FILE" | tee "${FILE}.metadata.txt"
sha256sum "$FILE" | tee "${FILE}.sha256"
echo "Validated $FILE ($SIZE bytes)."
