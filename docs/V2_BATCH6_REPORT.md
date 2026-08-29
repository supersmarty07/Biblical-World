# The Biblical World V2 — Batch 6 Report

**Version:** `2.0.0-alpha.6`  
**Scope:** First-century Jerusalem / Passion and resurrection geography  
**Baseline:** V2 Batch 5 / `2.0.0-alpha.5`

## Implemented

Batch 6 extends the existing Gospel stories and Jerusalem subsystem without changing the core v1 place/event/journey evidence model.

### 1. Passion Night: Upper Room, Gethsemane & Hearings

`public/data/immersive/scenes/passion-night-jerusalem.json`

This MapLibre scene distinguishes:

- Jerusalem as established city geography;
- the Last Supper upper room as textually located in Jerusalem but **not** as a recoverable building;
- the Kidron Valley as established physical geography explicitly named in John 18:1;
- the Mount of Olives as established terrain;
- Gethsemane as a traditional-site orientation within a textually strong Mount-of-Olives setting;
- the exact garden boundary, walking route, and arrest point as unrecoverable.

No street-by-street Passion-night route is drawn.

### 2. Pilate's Praetorium: Trial Geography

`public/data/immersive/scenes/pilate-trial-geography.json`

The comparison keeps three claims separate:

- **Textual praetorium** — named in the Gospels, but unlocated in the atlas.
- **Western palace model** — the Herodian western palace is a major historical proposal, encoded only as `possible` for the trial location.
- **Antonia-area tradition** — Antonia's broad physical location is historically significant, while its identification as the trial site remains `traditional` in this scene.

Gabbatha remains coordinate-free. The scene explicitly explains that the modern Via Dolorosa is not a recovered first-century GPS route.

### 3. Golgotha + Burial Explorer

`public/data/immersive/scenes/golgotha-burial-explorer.json`

The textual records `golgotha` and `tomb-jesus` remain intentionally unpinned.

The comparison then evaluates separately:

- the **Church of the Holy Sepulchre** as the principal ancient Christian tradition, with compatible quarry/tomb context but no claim of archaeological proof;
- the **Garden Tomb** as a historically important modern alternative tradition, with the existing earlier-dating objection surfaced rather than hidden.

Display anchors for textual Golgotha/tomb are UI orientation devices only and are not written into the atlas records.

### 4. Resurrection Geography

`public/data/immersive/scenes/resurrection-geography-context.json`

This scene explicitly separates geographic claims from theological adjudication.

It includes lenses for:

- Jerusalem plus the unpinned textual tomb;
- Luke's disputed/unlocated Emmaus destination;
- the later el-Qubeibeh Emmaus tradition;
- the securely identified Sea of Galilee geography used in John 21;
- Matthew's unnamed Galilee mountain, which remains unlocated.

The scene does **not** assign an archaeological confidence score to resurrection itself and does not claim archaeology can prove or disprove a supernatural event.

### 5. Guided-story deep links into exact scene state

`StoryChapter` now supports:

- `immersiveSceneId`
- `immersiveVariantId`
- `immersivePeriodId`
- `immersiveHotspotId`

This allows a guided chapter to open the exact state it is discussing rather than a generic scene default.

Examples:

- the Final Week Temple chapter opens `jerusalem-historical-terrain` at `circa-30-ce` and focuses the Temple Mount precinct;
- the Last Supper chapter opens the upper-room unknown hotspot;
- the Gethsemane chapter opens the traditional Gethsemane orientation;
- the trial chapters open the textual/unlocated praetorium/Gabbatha view;
- the crucifixion/burial story opens textual Golgotha, Holy Sepulchre, Garden Tomb, or textual tomb as appropriate;
- the resurrection story opens the Jerusalem, Emmaus, or Sea-of-Galilee lens appropriate to each chapter.

The existing Gospel journey animation remains intact and continues to own route-sequence/route-certainty semantics.

### 6. Validation and regression protection

The immersive validator now validates story-level scene state references, including:

- scene existence;
- comparison variant existence;
- period existence;
- hotspot existence;
- compatibility between a selected hotspot and its variant/period visibility constraints.

`audit:v2-batch6` additionally protects the following editorial rules:

- upper room, praetorium, Gabbatha, Golgotha, textual tomb, Emmaus, and Matthew's Galilee mountain remain unpinned;
- Gethsemane, Holy Sepulchre, and Garden Tomb remain `traditional-site` records;
- the western-palace trial model is not promoted to established fact;
- the Antonia trial identification remains traditional;
- Holy Sepulchre and Garden Tomb remain distinct traditions rather than replacements for the textual Golgotha/tomb records;
- resurrection geography remains methodologically separate from archaeological adjudication of the supernatural claim.

## Verification actually run

`npm run check` passed after the Batch 6 changes. It validated all nine content packs, the immersive catalog, V2 Batch 4–6 audits, all inherited historical audits, provenance, Batch 11 hardening, and static repository constraints.

Totals remain:

- 405 places
- 246 people
- 265 events
- 69 journeys
- 90 guided stories
- 166 source records
- 10 Revelation visionary scenes

The immersive validator reports **14 scenes**, **0 bundled visual bytes**, and valid scene/place/source/story-state links.

`npm run build:catalog` rebuilt the generated content manifest at `2.0.0-alpha.6`, and `npm run build:search` rebuilt the dependency-free **1,006-document** search corpus.

A TypeScript syntax-transpilation pass using the globally available TypeScript 5.8.3 compiler checked **32 TS/TSX files with 0 syntax error diagnostics**.

`npm test` was attempted but cannot run because `vitest` is not installed and `node_modules` is absent.

A bounded `npm install --no-audit --no-fund` retry timed out and did not create `node_modules`.

`npm run build` was attempted. Its entire prebuild phase passed again (data/immersive/history/provenance/static checks plus catalog/search generation). TypeScript project compilation then stopped because `vite/client` and Node type definitions are unavailable without installed dependencies. Therefore no dependency-backed Vite production bundle is claimed as passed.

## External verification still required

No new external source, DEM, archaeological image, excavation plan, wall reconstruction, or scientific terrain dataset is claimed as live-verified in Batch 6.

Before these scenes become `ready`, verify and integrate as appropriate:

- first-century Jerusalem DEM / terrain data and license;
- western Herodian palace and Antonia primary archaeological/topographic sources;
- first-century wall reconstructions relevant to Golgotha candidate evaluation;
- Holy Sepulchre quarry/tomb archaeology and image/data reuse rights;
- Garden Tomb archaeological dating sources and reuse rights;
- Emmaus textual-distance/candidate literature;
- release-quality Gethsemane, Kidron, Jerusalem, and candidate-site visual assets;
- Android GPU/memory behavior with real terrain and imagery.
