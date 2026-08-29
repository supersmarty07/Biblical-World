# The Biblical World V2 — Batch 8 Report

**Version:** `2.0.0-alpha.8`  
**Scope:** Whole-project integration, Follow the Journey, search, mobile/PWA hardening, and verification readiness  
**Baseline:** V2 Batch 7 / `2.0.0-alpha.7`

## Implemented

### 1. Follow the Journey

Batch 8 adds a first-class journey explorer built directly on the existing 69 `JourneyRecord` datasets. No routes were duplicated into a second model.

The explorer provides:

- featured groups for Abraham, Exodus, Jesus, and Paul;
- access to all 69 journey/literary-sequence datasets;
- segment-by-segment navigation;
- explicit `known-sequence`, `reconstructed`, and `unknown` route-certainty explanations;
- Scripture references and segment source records;
- origin/destination atlas links;
- related immersive landscapes where available;
- related guided-story chapters;
- URL deep links using `?journey=...&segment=...`;
- direct MapLibre animation of the selected segment;
- reduced-motion behavior that shows the route without animated travel.

The existing story journey animation remains intact. Direct journey mode and story mode share the same source journey records and therefore the same certainty semantics.

### 2. Search integration

Dependency-free search now indexes:

- places;
- people;
- events;
- guided stories;
- journeys;
- immersive scenes.

The build-time QA/export corpus increased from 1,006 to **1,095 documents**:

- 1,006 existing atlas/story records;
- 69 journeys;
- 20 immersive scenes.

Search results can open a journey directly or enter an immersive scene directly.

### 3. Desktop and mobile discoverability

Journey exploration is available from:

- desktop top-bar route control;
- mobile bottom navigation;
- the information-panel Stories / Journeys tabs;
- search results;
- related story connections.

The mobile bottom navigation now uses five evenly sized actions while retaining Search, Stories, Layers, and Info.

### 4. Map integration

When a direct journey is selected, the map:

- clears the previous active journey animation;
- fits the selected segment rather than pretending the entire journey is one precise route;
- animates the existing traveler marker along that segment;
- uses the journey's existing character/person metadata;
- respects `prefers-reduced-motion`;
- keeps the ordinary background journey layer separate from the highlighted active segment.

### 5. PWA / cache policy hardening

The service-worker cache was versioned for Batch 8.

Existing safeguards remain:

- HTTP Range requests bypass the service worker, preserving PMTiles compatibility;
- cross-origin large assets are not automatically cached by this same-origin runtime cache;
- the service worker does not pre-cache the entire atlas.

Batch 8 additionally makes version-sensitive data network-first:

- immersive scene manifest;
- generated content manifest;
- generated search corpus.

This reduces the chance that a newly deployed application shell is temporarily paired with an older scene/search catalog.

### 6. Regression audit

`audit:v2-batch8` now checks:

- all 69 inherited journeys remain present;
- featured Abraham/Exodus/Jesus/Paul journeys exist;
- journey route-certainty vocabulary remains intact;
- journey/segment URL state exists;
- journey mode exists in the store and UI;
- mobile navigation exposes Journeys;
- runtime search indexes journeys and scenes;
- search result routing supports journeys and scenes;
- generated search corpus contains exactly 69 journey and 20 scene documents;
- HTTP Range bypass remains in the service worker;
- version-sensitive cache behavior remains present.

## Verification actually run

`npm run check` passed after the Batch 8 changes, including:

- all 9 atlas content packs;
- immersive validation;
- V2 Batch 4–8 audits;
- all inherited Batch 4–10 historical audits;
- provenance audit;
- Batch 11 hardening audit;
- static repository validation.

Current totals remain:

- 405 places
- 246 people
- 265 events
- 69 journeys
- 90 guided stories
- 166 source records
- 10 Revelation visionary scenes
- 20 immersive V2 scenes
- 0 bundled third-party immersive visual bytes

`npm run build:catalog` rebuilt the generated content manifest at `2.0.0-alpha.8`.

`npm run build:search` rebuilt **1,095 search documents**.

A syntax-transpilation pass using the globally available TypeScript 5.8.3 compiler checked **33 TS/TSX files with 0 syntax diagnostics**.

`npm test` was attempted. It cannot start because `vitest` is not installed and `node_modules` is absent.

`npm run build` was attempted. Its entire prebuild validation/catalog/search phase passed. TypeScript project compilation then stopped because `vite/client` and Node type definitions are unavailable without installed dependencies. A dependency-backed Vite production bundle is therefore **not claimed as passed**.

## What Batch 8 intentionally does not claim

Batch 8 does not convert prototype scenes to release-ready scenes. It does not claim live verification of:

- DEM licensing or terrain conversion pipelines;
- ancient coastline/hydrology reconstructions;
- excavation GIS/site plans;
- museum/open-image licenses;
- historical road datasets;
- paleoenvironment datasets;
- current scholarly URLs/DOIs/page locators.

Those items belong to the focused post-batch verification and asset-ingestion phase.

## Post-batch phase

The next project phase is **V2 Source, Dataset & Asset Verification** rather than another feature batch.

Use `docs/V2_VERIFICATION_INPUTS.md` to supply primary-source URLs/text/download details. After verification, individual immersive scenes can move from `prototype` toward `ready` with real terrain, licensed imagery, scientifically defensible environmental layers, and documented attribution.
