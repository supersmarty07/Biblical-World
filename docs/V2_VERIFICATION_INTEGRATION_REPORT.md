# The Biblical World V2 — Verification Integration Report

**Version:** `2.0.0-alpha.9`  
**Input:** user-supplied `New info 2_260830_020629.pdf` verification packet  
**Live web access in this environment:** unavailable

## Purpose

This phase converts the research packet into implementation-ready repository metadata without overstating what has actually been downloaded, independently re-verified, or installed.

## Implemented

### Machine-readable verification registry

Added `public/data/verification/registry.json` with:

- 11 resource/license records;
- 11 historical/evidence guardrail claims;
- 28 Pleiades/Wikidata identifier mappings;
- 8 packet scene-readiness assessments paired with actual repository integration status.

The registry explicitly records `independentLiveVerification: false`. This preserves the difference between user-supplied source verification and verification independently performed by this build environment.

### External identifiers

The packet's selected Pleiades IDs were attached to 28 matching existing place records through `PlaceRecord.externalIds.pleiades`. Six packet-supplied Wikidata QIDs were also attached. These identifiers do not alter `geographicIdentification`, `historicalInterpretation`, or `coordinateRole`.

The place panel now exposes Pleiades/Wikidata links with a warning that external identifiers are cross-reference keys rather than overrides of atlas uncertainty.

### Immersive verification context

Immersive scenes now lazily load the verification registry and expose a **Research packet** disclosure containing:

- packet research-readiness assessment when one exists;
- actual repository integration state (`awaiting-terrain-bytes`, `awaiting-derived-paleovectors`, etc.);
- relevant data/license records;
- relevant historical guardrails;
- an explicit notice that the packet was not independently live-verified in this environment.

### Roman-road ingestion seam

Added optional `VITE_ROMAN_ROADS_GEOJSON_URL` support. When configured, MapLibre loads the road network as a separate contextual line layer that can be toggled independently. It is off by default and disabled when no URL is configured.

No ORBIS dependency was added. The verification registry keeps ORBIS and Digital Augustan Rome classified as non-commercial-only research resources.

### PWA/cache integration

The service-worker cache is versioned to alpha.9, retains Range-request bypass for PMTiles, and now treats the verification registry as version-sensitive/network-first data.

### Validation

Added `scripts/validate-verification.mjs`. It checks:

- unique resource and claim IDs;
- scene and place links;
- external identifier synchronization;
- commercial-risk classifications for ORBIS/Digital Augustan Rome;
- dataset-specific treatment of Open Context;
- required epistemic guardrails;
- continued coordinate-free handling for Zion, textual Golgotha, the unnamed Transfiguration mountain, and Babylon the Great.

`validate:verification` is part of `npm run check`.

## Data intentionally not imported

The packet did not supply actual third-party source bytes, so this phase does **not** bundle:

- Copernicus DEM COGs or derived Terrain-RGB/PMTiles;
- DARE/AWMC road files;
- a specific Open Context Megiddo dataset;
- ancient shoreline/paleolake GeoJSON;
- Jerusalem reconstructed ancient-surface meshes;
- Pedersén Babylon GIS files;
- Matson/Met/Wikimedia images.

The packet contains at least one image entry whose Wikimedia/LOC metadata appears mixed, so image assets are not automatically trusted or imported.

## Verification actually run

### Passed

- `npm run build:catalog`
- `npm run build:search`
- `npm run check`
- verification registry validation: 11 resources, 11 claims, 28 identifier mappings, 8 scene assessments
- inherited atlas validation: 405 places, 246 people, 265 events, 69 journeys, 90 stories, 166 sources, 10 Revelation visionary scenes
- immersive validation: 20 scenes, 0 bundled third-party visual bytes
- integrated search corpus: 1,095 documents
- syntax-only TypeScript transpilation: 35 TS/TSX files, 0 diagnostics
- static repository guard: no oversized public assets

### Not passed / environment limitation

`npm run build` completes all prebuild validation/catalog/search work, then TypeScript project compilation stops because this environment has no `node_modules`. Specifically, `vite/client` and Node type definitions cannot be resolved.

No claim is made that the production Vite bundle or Vitest suite passed.

## Next asset phase

When actual source files become available, the recommended order is:

1. ingest/crop Copernicus GLO-30 and build terrain PMTiles outside the GitHub Pages repository;
2. ingest DARE/AWMC Roman roads and host a derived GeoJSON/PMTiles layer;
3. create independently authored paleogeographic vectors for Yam Suph, Ephesus, and Sea of Galilee contexts;
4. verify and ingest specific Open Context/archaeological datasets;
5. bind individually verified public-domain/CC images;
6. build the Jerusalem ancient-surface reconstruction with explicit reconstruction metadata.
