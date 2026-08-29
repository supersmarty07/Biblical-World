# V2 asset pipeline — alpha.10

Version `2.0.0-alpha.10` turns the verification packet into an executable, license-gated asset workflow. It does **not** fabricate or download missing external data.

## Principles

1. Research readiness and installed bytes are separate states.
2. Large DEM/PMTiles/panoramas belong on R2/S3/CDN, not GitHub Pages.
3. HTTP Range requests must bypass the service worker.
4. A derived historical coastline or terrain surface is always `historical-inference`, never `real-terrain`.
5. Open Context and similar repositories are verified per dataset/DOI, not by repository policy alone.
6. Collection-level image licensing never substitutes for item-level verification.
7. Non-commercial resources such as ORBIS/Digital Augustan Rome cannot become production runtime dependencies through this pipeline.

## Registries

`public/data/assets/manifest.json` is the human/runtime asset plan. It records what each scene needs, source-resource IDs, delivery strategy, evidence class, installation state, and uncertainty notes.

`src/generated/installedAssets.json` contains only assets that are actually present or explicitly configured for runtime use. This file is intentionally conservative. In alpha.10 the only bundled verified asset registered there is the existing Natural Earth fallback land GeoJSON.

`public/data/verification/registry.json` remains the research/licensing provenance layer imported from the user-supplied packet.

## Validation

```bash
npm run validate:assets
```

The validator checks:

- asset IDs/statuses/kinds;
- scene/resource links;
- installed-file existence, size, and SHA-256;
- HTTPS for configured external assets;
- derived layers remain `historical-inference`;
- Open Context archaeology cannot be installed without a specific dataset DOI/license;
- non-commercial resources cannot become production runtime dependencies;
- collection-level image packs cannot be marked installed as a licensing shortcut.

It is part of `npm run check`.

## Roman roads

When a verified DARE `roads.geojson` file becomes available:

```bash
npm run assets:roads -- --input /path/to/roads.geojson
```

The ingester:

- requires a GeoJSON FeatureCollection;
- keeps only LineString/MultiLineString geometry;
- validates WGS84 coordinate bounds;
- removes nested/non-scalar properties;
- writes deterministic compact GeoJSON;
- records SHA-256 and byte size;
- updates the installed registry and asset manifest.

Road data is **lazy-loaded only when the user enables the Roman roads layer**, so a multi-megabyte GeoJSON file does not inflate initial startup.

If normalized roads exceed 16 MiB, the script refuses to bundle them and the next step should be vector-PMTiles/external delivery.

## External terrain

Large Copernicus-derived terrain should be hosted on static object storage with CORS + Range support. Once a verified PMTiles URL exists:

```bash
npm run assets:terrain -- --url https://cdn.example.org/biblical-world/terrain.pmtiles
```

Optionally record an out-of-band checksum:

```bash
npm run assets:terrain -- --url https://cdn.example.org/biblical-world/terrain.pmtiles --sha256 <64-hex-digest>
```

Registration does **not** claim that this execution environment downloaded or independently inspected the remote archive. It records deployment configuration only.

MapLibre resolves bundled relative paths against `import.meta.env.BASE_URL`, preserving repository-style GitHub Pages deployment.

## Derived paleogeography

Derived historical coastline/lake polygons require a separate metadata file and cannot be installed from geometry alone.

Example metadata:

```json
{
  "schemaVersion": 1,
  "assetId": "yam-suph-paleolakes",
  "derivationMethod": "independently-authored",
  "citations": ["Drews & Han 2010, DOI 10.1371/journal.pone.0012481"],
  "uncertainty": "Regional approximation; not an event-location reconstruction.",
  "noExactEventCoordinateClaims": true
}
```

Install with:

```bash
npm run assets:derived -- \
  --asset yam-suph-paleolakes \
  --input /path/to/authored.geojson \
  --metadata /path/to/derivation.json
```

The installer validates geographic bounds and stamps every feature with:

```text
evidenceClass = historical-inference
reconstruction = true
```

This makes it harder for a derived ancient shoreline to be mistaken for measured modern geography.

## Scene status UI

Every immersive scene's Research Packet drawer now includes an **Asset pipeline** section. It can therefore show, at the same time:

- `100% research readiness` from the packet; and
- `awaiting source bytes`, `awaiting derived geometry`, or another actual repository state.

The distinction is deliberate and release-critical.

## Current alpha.10 states

- Natural Earth fallback: installed and checksum-verified.
- Copernicus terrain: awaiting source/hosted PMTiles bytes.
- DARE roads: awaiting source bytes.
- Yam Suph paleolakes: awaiting independently authored derived geometry.
- Galilee shoreline: awaiting source-backed derived geometry.
- Ephesus coastline: awaiting source-backed derived geometry.
- Jerusalem ancient surface: awaiting a clearly labeled reconstructed terrain model.
- Megiddo archaeology: awaiting a specific licensed Open Context dataset.
- Babylon spatial GIS: blocked pending specific file/license verification.
- Historic image pack: awaiting individual item selection/license verification.
