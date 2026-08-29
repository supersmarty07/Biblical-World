# The Biblical World V2 — Batch 5 Report

**Version:** `2.0.0-alpha.5`  
**Scope:** Galilee + Jesus ministry geography  
**Baseline:** V2 Batch 4 / `2.0.0-alpha.4`

## Implemented

Batch 5 adds three immersive Gospel landscapes without replacing or rewriting the v1 Gospel data model.

### 1. Galilee Ministry Landscapes

`public/data/immersive/scenes/galilee-ministry-landscape.json`

The panorama has four evidence-aware regional modes:

- Lower Galilee — Nazareth is established; Cana remains unpinned and disputed.
- Northwestern lakeshore — Capernaum and Magdala are archaeological anchors; the rendered settlement silhouettes are schematic.
- Lake crossings — the Sea of Galilee is certain geography, while individual Gospel boat tracks are not recoverable.
- Bethsaida question — the Gospel place remains unpinned and el-Araj / et-Tell remain separate candidate records.

The traditional Mount of Beatitudes is shown only as a traditional orientation. The east-shore Gerasenes/Gadarenes/Gergesenes problem remains unresolved.

### 2. Caesarea Philippi + the Unnamed Mountain

`public/data/immersive/scenes/northern-ministry-transfiguration.json`

This MapLibre scene separates four different claims:

- Paneas / Caesarea Philippi district — established geographic anchor.
- The Transfiguration mountain — unknown and intentionally unpinned.
- Mount Tabor — physical mountain displayed in its traditional Transfiguration role.
- Mount Hermon — physical massif displayed only as a possible modern proposal.

The comparison cameras carry explicit coordinate roles. A broad display camera for the unnamed mountain is labeled as regional context only and is not stored as the mountain's coordinate.

### 3. Judean Wilderness + Eastern Approach

`public/data/immersive/scenes/judean-wilderness-eastern-approach.json`

The panorama distinguishes:

- the broad Judean Wilderness environment from exact temptation/preaching locations;
- the Jordan baptism setting from the disputed “Bethany beyond the Jordan” identification;
- al-Maghtas as an important archaeological/pilgrimage landscape rather than proof of the baptism coordinate;
- established Jericho from a generalized ascent toward Jerusalem;
- probable Bethany and established Mount of Olives geography from less certain Bethphage orientation.

### 4. Guided story → immersive scene bridge

`StoryChapter` now supports optional `immersiveSceneId` metadata. Relevant Gospel chapters can enter an immersive scene directly and return to the same guided chapter when the scene closes.

This does **not** replace journey animation. The existing journey record remains responsible for textual sequence and route certainty; the scene supplies environmental context.

The new links cover selected chapters in:

- John the Baptist & the Jordan
- Nazareth, Cana & Capernaum
- Around the Sea of Galilee
- Tyre, Sidon & Caesarea Philippi
- The Road Toward Jerusalem

### 5. Validation and regression protection

The immersive validator now also verifies every `immersiveSceneId` found in content-pack stories against the scene catalog.

`audit:v2-batch5` protects several Gospel uncertainty rules:

- Cana remains unpinned.
- Bethsaida remains unpinned.
- Bethany beyond the Jordan remains unpinned.
- The Transfiguration mountain remains unpinned and `unknown`.
- The Mount of Beatitudes retains `traditional-site` orientation.
- Tabor remains `traditional` for Transfiguration comparison.
- Hermon remains only `possible` for that comparison.

## Verification actually run

`npm run check` passed after the Batch 5 changes. It validated all nine content packs and all historical/provenance/static checks, plus the V2 Batch 4 and Batch 5 audits.

Totals remain:

- 405 places
- 246 people
- 265 events
- 69 journeys
- 90 stories
- 166 source records
- 10 Revelation visionary scenes

The immersive validator reports **10 scenes**, **0 bundled visual bytes**, and valid scene/place/source/story-scene links.

A TypeScript syntax-transpilation pass using the globally available TypeScript 5.8.3 compiler checked **32 TS/TSX files with 0 syntax error diagnostics**.

`npm test` was attempted but cannot run because `vitest` is not installed (`node_modules` is absent).

`npm run build` was attempted. Its prebuild phase completed successfully, including all checks, content-manifest generation, and rebuilding the dependency-free **1,006-document** search corpus. TypeScript project compilation then stopped because `vite/client` and Node type definitions are unavailable without installed dependencies. Therefore no dependency-backed Vite production build is claimed as passed.

## External verification still required

No new external source, DEM, archaeological image, excavation plan, or scientific environmental dataset was claimed as live-verified in Batch 5.

Before these scenes become `ready`, verify and integrate as appropriate:

- Galilee/Judea DEM source and license;
- Sea of Galilee shoreline/geomorphology and harbor evidence;
- Capernaum, Magdala, Nazareth, Paneas/Banias, Bethsaida, and baptism-site primary archaeological sources;
- reusable imagery/panorama licenses;
- first-century regional paleoenvironment evidence;
- Android GPU/memory behavior with real high-resolution scene media.

