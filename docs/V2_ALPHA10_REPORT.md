# V2 alpha.10 — production asset pipeline report

## Scope

Alpha.10 follows the verification-packet integration (`alpha.9`) with the first executable production-asset workflow. No external data was downloaded because live web access is unavailable in this environment.

## Implemented

- machine-readable V2 asset plan at `public/data/assets/manifest.json`;
- generated installed-runtime registry at `src/generated/installedAssets.json`;
- checksum-verified registration of the existing Natural Earth land fallback;
- license-aware asset validator wired into `npm run check`;
- DARE road GeoJSON normalizer/installer;
- lazy road loading so road geometry is not fetched at application startup;
- external terrain PMTiles registration command;
- derived paleogeography installer requiring citations, uncertainty, and `noExactEventCoordinateClaims=true`;
- GitHub Pages-safe runtime URL resolution;
- scene-level Asset Pipeline status UI;
- service-worker network-first handling for the asset manifest while preserving Range-request bypass;
- alpha.10 CI regression audit.

## What alpha.10 deliberately does not claim

- no Copernicus DEM bytes are installed;
- no DARE road file is installed;
- no paleolake/paleocoastline geometry has been fabricated;
- no Jerusalem ancient surface has been generated;
- no Open Context Megiddo dataset has been selected without its dataset-specific DOI/license;
- no Babylon GIS file has been accepted from the packet's broad license summary;
- no image is imported from the mixed Trumpeting Stone/LOC packet entry.

## Hosting model

GitHub Pages continues to host the application shell, JSON/GeoJSON, small assets, and fallback map. Large terrain and panorama assets remain external static-object-storage candidates. The project stays frontend-only.

## Verification performed in this environment

The following checks were actually executed on alpha.10:

- `npm run check` — passes all atlas, immersive, verification, asset, historical, provenance, V2, PWA/static audits.
- `npm run build:catalog` — rebuilt the 9-pack content manifest at `2.0.0-alpha.10`.
- `npm run build:search` — rebuilt 1,095 dependency-free search documents.
- TypeScript syntax transpilation using TypeScript 5.8.3 — all 37 TS/TSX files, zero syntax diagnostics.
- road ingester dry-run against synthetic test-only GeoJSON — passed; non-line geometry was dropped and no files were committed.
- derived-GeoJSON installer dry-run against synthetic test-only polygon/metadata — passed and no files were committed.
- external-terrain registrar dry-run — passed URL validation and made no changes.

Dependency-backed verification remains unavailable because `node_modules` is absent in this execution environment. `npm test` exits because `vitest` is not installed. `npm run build` completes the entire prebuild validation/catalog/search phase, then `tsc` stops because `vite/client` and Node type definitions cannot be resolved. No production Vite bundle is claimed as passing.
