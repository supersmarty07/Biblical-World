# The Biblical World V2 — Batch 7 Report

**Version:** `2.0.0-alpha.7`  
**Scope:** Imperial cities and Pauline / early-Christian urban contexts  
**Baseline:** V2 Batch 6 / `2.0.0-alpha.6`

## Implemented

Batch 7 adds six immersive experiences covering all seven priority locations in this batch. Susa and Persepolis intentionally share one comparative scene because their biblical roles differ: Susa is explicitly named in biblical narratives, whereas Persepolis is included as securely identified Achaemenid imperial context.

### 1. Babylon: City, Exile & Empire

`public/data/immersive/scenes/babylon-imperial-city.json`

The scene separates:

- the securely identified archaeological city of Babylon;
- Nebuchadnezzar II's excavated Southern Palace as imperial/court context;
- the broader Judean exile world in Babylonia;
- the historically documented 539 BCE Persian transition;
- Genesis 11's Babel/Babylon literary association.

The scene explicitly does **not** identify a Tower of Babel structure, Daniel 5 banquet hall, exact deportee residence, or conquest-route point.

### 2. Nineveh: Assyrian Capital & Biblical Horizon

`public/data/immersive/scenes/nineveh-assyrian-city.json`

Period states distinguish:

- archaeological Nineveh;
- late Neo-Assyrian imperial context;
- Jonah's named literary destination;
- the historically anchored 612 BCE fall.

The city is treated as archaeologically secure while Jonah's genre/date/historicity questions remain methodologically separate. The 612 BCE fall is not turned into a street-by-street battle reconstruction.

### 3. Persian Royal Centers: Susa + Persepolis

`public/data/immersive/scenes/persian-royal-centers.json`

A regional comparison distinguishes:

- **Susa / Shushan** — securely identified and explicitly named in Esther, Daniel 8, and Nehemiah 1;
- **Persepolis / Parsa** — securely identified monumental Achaemenid center included as imperial context, not as a biblical event location.

No excavated room is labeled as Esther's banquet hall, Daniel's vision location, or Nehemiah's audience chamber. The scene explicitly states that the Hebrew Bible does not name Persepolis.

### 4. Ephesus: Paul, Artemis & Roman Asia

`public/data/immersive/scenes/ephesus-roman-city.json`

The scene uses established archaeological anchors for:

- Ephesus;
- the Great Theater;
- the Artemision / Temple of Artemis.

Paul's extended Ephesian ministry is represented at city level. The Hall of Tyrannus remains unpinned and receives no geographic hotspot.

The scene also explicitly labels the current map/coastline as modern reference: no unverified first-century harbor shoreline has been drawn. Historical coastline reconstruction remains an external-verification task.

### 5. Rome: Paul's Arrival & Imperial Context

`public/data/immersive/scenes/rome-paul-imperial-city.json`

The scene distinguishes:

- securely identified Rome;
- Puteoli as a secure Acts 28 anchor;
- Appii Forum as an approximate route-context anchor;
- the broad Puteoli-to-Rome approach;
- Paul in Rome at city level;
- a Revelation/Rome interpretive lens.

Three Taverns and Paul's rented lodging remain intentionally unpinned. No exact overland route is drawn.

The Revelation lens records that Rome is a strong first-century interpretive referent for Babylon imagery in much modern scholarship, while **Babylon the Great remains a separate coordinate-free visionary entity**.

### 6. Patmos: Historical Island & Visionary Threshold

`public/data/immersive/scenes/patmos-historical-island.json`

The scene distinguishes:

- Patmos as the securely identified island named in Revelation 1:9;
- John's exact location on the island as unknown;
- the Cave of the Apocalypse as later Christian tradition.

The Cave remains `traditional-site`, and the scene explicitly keeps Revelation's visionary geography in the separate non-terrestrial visionary subsystem.

## Guided-story integration

Batch 7 adds scene-state deep links to selected chapters in:

- `public/data/exile-restoration/stories.json`
- `public/data/acts-paul/stories.json`
- `public/data/revelation/stories.json`

Examples include:

- Nineveh's fall → `fall-612-bce` period state;
- Babylonian exile chapters → Babylon city, palace, or exile-zone context;
- Daniel / Esther / Nehemiah at Susa → Susa comparison state;
- Roman Ephesus → city archaeology;
- Hall of Tyrannus chapter → Paul-ministry lens **without** a false Tyrannus hotspot;
- Acts 19 theater chapter → established Great Theater hotspot;
- Acts 28 approach → Appii Forum context;
- Acts 28 Rome → Rome city hotspot while Paul's residence stays unknown;
- Patmos → island-level geography;
- Cave chapter → traditional-site state.

The existing journey animation remains authoritative for journey sequence and route-certainty semantics.

## Regression protection

`audit:v2-batch7` now fails CI if later changes:

- give coordinates to Hall of Tyrannus, Paul's Roman lodging, or Three Taverns;
- give coordinates to Revelation's Babylon the Great;
- promote the Cave of the Apocalypse beyond tradition;
- remove the island-level/unknown-point distinction for Patmos;
- treat Persepolis as a named biblical event location;
- turn Ephesus's modern coastline into an unlabeled first-century coastline;
- identify a specific Babylon palace room as Daniel 5's banquet hall;
- collapse Nineveh archaeology into proof of Jonah's narrative;
- break required guided-story scene-state links.

## Verification actually run

`npm run check` passed after the Batch 7 changes. It validated:

- all 9 content packs;
- immersive catalog/data;
- V2 Batch 4–7 audits;
- all inherited Batch 4–10 historical audits;
- provenance structure;
- Batch 11 hardening;
- static repository constraints.

Atlas totals remain:

- 405 places
- 246 people
- 265 events
- 69 journeys
- 90 guided stories
- 166 source records
- 10 Revelation visionary scenes

The immersive validator reports **20 scenes**, **0 bundled visual bytes**, and valid scene/place/source/story-state links.

`npm run build:catalog` rebuilt the generated content manifest at `2.0.0-alpha.7`.

`npm run build:search` rebuilt the dependency-free **1,006-document** search corpus.

A TypeScript syntax-transpilation pass using the globally available TypeScript 5.8.3 compiler checked **32 TS/TSX files with 0 syntax diagnostics**.

`npm test` was attempted and cannot start because `vitest` is not installed; `node_modules` is absent.

`npm run build` was attempted. Its complete prebuild phase passed again (data/immersive/history/provenance/static checks plus catalog/search generation). TypeScript project compilation then stopped because `vite/client` and Node type definitions are unavailable without installed dependencies. No dependency-backed Vite production bundle is claimed as passed.

## External verification still required

No new external source, terrain dataset, archaeological image, city plan, coastline reconstruction, or road dataset is claimed as live-verified in Batch 7.

Before these scenes move to `ready`, the highest-value verification targets are:

- Babylon and Nineveh official/academic archaeological GIS/site-plan sources and image licenses;
- Susa and Persepolis official archaeological/heritage datasets and plan/image reuse rights;
- Ephesus excavation/project data, especially Roman harbor/shoreline change and urban plan licensing;
- verified Roman-road data for Puteoli → Appii Forum → Rome and the Appian corridor;
- first-century Rome topography/urban datasets and image licensing;
- Patmos historical topography and licensed imagery;
- release-quality DEM coverage and PMTiles conversion/hosting terms for Mesopotamia, Iran, western Anatolia, Italy, and Patmos;
- Android GPU/memory profiling with real terrain and imagery.
