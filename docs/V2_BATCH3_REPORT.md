# V2 Batch 3 Report — Canaan + Megiddo / Jezreel

**Version:** `2.0.0-alpha.3`  
**Status:** implementation foundation complete; release-quality external terrain/environment/archaeology assets pending source verification.

## Scope delivered

Batch 3 extends the immersive engine rather than replacing the v1 atlas model.

### Canaan landscape-zone explorer

A new `canaan-landscape-zones` panorama scene provides seven broad geographic teaching modes:

- central highlands
- coastal plain
- Jezreel lowlands
- Jordan Valley
- Shephelah
- Galilean hills
- Negev

The present visuals are CSS/project-authored schematics. They are explicitly not historical photographs, measured DEM views, exact vegetation reconstructions, ancient coastline reconstructions, or political borders.

The existing Batch 2 comparison machinery was generalized with `presentation: "regions"`, so the same data engine can explain landscape zones without falsely presenting them as competing site identifications.

### Megiddo + Jezreel period explorer

The existing engine prototype was expanded into a content-rich period-aware scene with five explanatory states:

1. physical landscape
2. Judges context
3. united-monarchy context
4. northern-kingdom context
5. late-monarchy context

These are explanatory states, not five photorealistic architectural reconstructions. They alter which hotspots are emphasized and may change the MapLibre teaching camera.

The scene now distinguishes:

- established Tel Megiddo site identification
- established Jezreel Valley geography
- Mount Tabor in Judges context
- Mount Gilboa in Saul's final-battle narrative, without an exact battlefield line
- Mount Carmel as a secure range, without claiming Elijah's exact altar coordinate
- established Tel Jezreel as a northern royal center, while leaving Naboth's vineyard/palace-space precision unresolved
- 1 Kings 9:15's textual association of Megiddo with Solomon's building levy from the separate archaeological question of assigning particular monumental structures/phases to Solomon
- Josiah's Megiddo campaign/death context from any invented exact death coordinate

## Period-state architecture

Batch 3 adds `activeScenePeriodId` to the client state and `period=...` to URL state.

Scene periods can now provide:

- label and explanatory note
- optional camera state
- mandatory coordinate role + camera explanation when a period camera exists

Hotspots can declare `periodIds`, so evidence can be period-specific without duplicating an entire scene file.

This is intentionally foundational for Batch 4 Jerusalem, where the same terrain must support multiple historical periods without collapsing them into one reconstruction.

## Validation additions

The Zod runtime scene schema and `scripts/validate-immersive.mjs` now validate:

- regional comparison presentation mode
- expanded project-authored environment vocabulary
- valid default-period references
- valid hotspot period references
- period-camera coordinates
- explicit coordinate role and explanatory note for every period camera

No third-party visual asset was bundled by Batch 3.

## Verification actually run

`npm run check` passed on `2.0.0-alpha.3`.

That includes:

- all nine v1 content-pack validations
- all historical editorial audits
- provenance audit
- Batch 11 hardening audit
- static repository audit
- V2 immersive validator

The immersive validator reports **5 scenes, 0 bundled visual bytes, all scene/place/source links valid**.

A standalone TypeScript syntax-transpilation pass also passed across **32 TS/TSX files with 0 syntax diagnostics**.

`npm test` was attempted and exited `127` because `vitest` is not installed (`sh: 1: vitest: not found`).

`npm run build` was attempted. Its prebuild validation, catalog generation, and 1,006-document search build completed, but the dependency-backed TypeScript/Vite stage failed because `node_modules` is absent: TypeScript cannot find `vite/client` or Node type definitions. Therefore this batch is structurally/syntax verified, but **not** dependency-backed test/build verified.

The underlying v1 corpus remains **405 places, 246 people, 265 events, 69 journeys, 90 stories, 166 sources, and 10 Revelation visionary scenes**.

## External information still required

Live web browsing is unavailable in this environment. To replace Batch 3's schematics with release-quality visual/data layers, supply copied primary-source information (or downloaded source files) for:

- a DEM candidate such as Copernicus GLO-30 or NASA SRTM: official license/terms, attribution, resolution, vertical datum/encoding, download route, redistribution/derivative permission
- Tel Megiddo official excavation/project pages: site plans, period/stratigraphic descriptions, image/data reuse terms, stable citations
- Jezreel Valley / Megiddo environmental or GIS studies: title, authors, publication, date, DOI/stable link, and the specific claims/data being used
- historical-road datasets (AWMC/DARE or alternatives): license, attribution, downloadable format, geographic/chronological scope, redistribution terms
- regional paleoenvironment/vegetation studies: period covered, spatial resolution, methodology, uncertainties, DOI/stable citation, reuse rights for any data/figures
- any panorama/photography/museum image: creator/institution, exact asset page, rights statement, license, attribution text, derivative permission, download resolution

A URL by itself is not enough in this session because I cannot open the live web. Paste the relevant page text/metadata, attach screenshots/PDFs, or upload the downloaded dataset/document together with the URL.

## Remaining Batch 3 release work

- configure and verify a real DEM asset
- produce/test the terrain PMTiles conversion pipeline
- replace or augment schematics with verified terrain/environment imagery
- add official excavation-derived period overlays if licensing permits
- verify road-corridor evidence before drawing route overlays
- run Android GPU/memory tests with actual terrain and imagery
- install npm dependencies and run Vitest/full TypeScript/Vite build when registry access is available
