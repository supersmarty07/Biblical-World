# V2 Alpha.18 — Regional 3D Worlds + Self-Verifying Real Terrain Builder

Version: `2.0.0-alpha.18`

## Purpose

Alpha.18 closes two gaps exposed by Android testing:

1. immersive 3D scenes no longer inherit the global atlas clutter; and
2. real Copernicus terrain can now be built reproducibly on GitHub's internet-connected runners rather than trusting research-supplied HTTP metadata.

## Regional 3D scene behavior

While an immersive world is open, MapLibre suppresses unrelated global place markers, journey lines, historical-context polygons, Roman roads, and the active global journey. Scene hotspots and scene-specific display geometry remain. Closing the scene restores the user's atlas layer choices.

The long custom MapLibre provenance banner has been reduced to a compact `Natural Earth · Sources` attribution. The full evidence/source explanation remains available through the scene Info drawer and Credits UI.

Sinai's teaching camera was tightened to the candidate landscape. This changes presentation only and does not identify biblical Mount Sinai.

## Real terrain source policy

The terrain builder uses Copernicus DEM GLO-30 as a **modern physical DSM**. It never silently converts that surface into biblical-period terrain. Historical lake levels, ancient Nile channels, Jerusalem valley-fill corrections, and archaeological reconstructions remain separate evidence-labeled layers.

Gemini supplied a corrected AWS object naming pattern, but its repeated placeholder-like HTTP metadata is not accepted as proof. The GitHub terrain workflow independently verifies each object with a live `Range: bytes=0-3` request and TIFF magic-byte check before download.

## Deterministic source coverage

The source manifest is generated from region bounds, not a manually maintained tile list:

- Jerusalem: 4 region-tile rows
- Galilee: 6
- Megiddo: 4
- Sinai: 20
- Eastern Delta: 9
- Total rows: 43
- Unique Copernicus objects: 29

The Sinai extent `32.0–35.2 E / 27.0–31.3 N` correctly requires the E035 column: `N27E035` through `N31E035`.

## GitHub workflow

`.github/workflows/build-terrain.yml` is manual (`workflow_dispatch`) and offers:

- `jerusalem`
- `galilee`
- `megiddo`
- `sinai`
- `delta`

The workflow:

1. installs GDAL, rasterio/rio-rgbify, and the PMTiles CLI;
2. generates the deterministic source manifest;
3. verifies every required Copernicus object live;
4. downloads only verified COGs;
5. mosaics and crops with GDAL;
6. reprojects to EPSG:3857 while declaring crop bounds as EPSG:4326;
7. encodes **lossless PNG Mapbox Terrain-RGB**;
8. converts MBTiles to PMTiles;
9. validates and checksums the archive;
10. uploads the PMTiles + metadata as a GitHub Actions artifact;
11. optionally uploads to Cloudflare R2 when configured.

Lossy WebP is deliberately forbidden for Terrain-RGB because elevation is stored in RGB values.

## R2 publishing

Optional R2 publishing uses repository secrets:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

Optional repository variable:

- `R2_PUBLIC_BASE_URL`

The published PMTiles object uses `application/vnd.pmtiles` and long immutable caching. The existing application deployment diagnostics remain responsible for browser-side CORS and byte-range validation.

## Verification performed locally

- `npm run check`: PASS
- terrain shell scripts: `bash -n` PASS
- terrain Node scripts: syntax PASS
- alpha.18 audit: PASS
- source-manifest coverage: 43 rows / 29 unique objects / 20 Sinai rows

Live Copernicus HTTP verification and the actual PMTiles build cannot be truthfully claimed in this offline environment; those are intentionally delegated to the new GitHub Action.

## Dependency-backed build status

This execution environment still has no project `node_modules`:

- `npm test` cannot start because `vitest` is not installed.
- `npm run build` completes all prebuild audits/catalog/search generation, then TypeScript stops because `vite/client` and Node type definitions are unavailable.

GitHub Actions remains the authoritative dependency-backed application build. The new terrain workflow has its own tool installation and live-network verification steps and must be run on GitHub before any PMTiles output is described as successfully generated.
