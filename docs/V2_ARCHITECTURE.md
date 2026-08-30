# The Biblical World V2 — Immersive Architecture

**Status:** V2 Batches 1–8 implemented; verification integrated; asset/deployment hardening complete; dual-mode Immersive Worlds active at `2.0.0-alpha.12`  
**Source baseline:** `biblical-world-v1.1.1-hotfix.zip`

## 1. Repository findings carried forward from v1

The V2 work extends the existing frontend-only atlas. It does not replace the v1 content model.

Verified from the baseline repository:

- Vite + React + TypeScript.
- MapLibre GL JS with an existing PMTiles protocol hook.
- Static JSON / GeoJSON content packs discovered through `public/data/generated/content-manifest.json`.
- Zod runtime parsing for the atlas records.
- 405 places, 246 people, 265 events, 69 journeys, 90 guided stories, 77 context regions, 166 source records, and 10 Revelation visionary scenes.
- GitHub Pages base-path handling through `import.meta.env.BASE_URL` and `VITE_BASE_PATH`.
- GitHub Actions deployment and pull-request quality workflows.
- Dependency-free in-memory search with a generated QA/export corpus.
- PWA manifest and conservative same-origin service worker caching.
- HTTP Range requests bypass the service worker so PMTiles remains compatible.
- Reduced-motion handling for camera travel and journey animation.
- Revelation visionary material remains a separate non-terrestrial visualization system.

The v1.1.1 hotfix is present: `journey-ark-philistia` and `journey-phoenician-supply` no longer serialize `personId: null`, and the data validator rejects a present non-string `personId`.

A separate regression was found in the hotfix archive: `scripts/audit-batch11.mjs` still required package version `1.1.0`, causing the full quality check to fail on the valid `1.1.1` hotfix. V2 changes that audit to validate semantic version syntax rather than pinning a release number.

## 2. Architectural decision

V2 adds an **immersive scene domain beside the atlas domain**.

Do not add panorama URLs, reconstruction layers, DEM metadata, hotspot coordinates, or asset-license records directly to `PlaceRecord`. A place can link to zero or more scene catalog entries, while the heavy scene document is fetched only when a user enters that scene.

```text
GitHub Pages
  application shell
  v1 atlas JSON / GeoJSON
  tiny immersive scene catalog
  small scene metadata documents
  project-authored lightweight UI/SVG assets

Static object storage / CDN
  raster DEM / terrain PMTiles
  large panoramas
  AVIF / WebP reconstruction layers
  optional high-resolution textures
  future historical coastline tiles
```

The runtime remains frontend-only. No database, authentication service, or application server is required for the currently planned V2 capabilities.

## 3. Scene data model

The catalog lives at:

```text
public/data/immersive/manifest.json
```

Each catalog entry is intentionally small:

- `id`
- title/subtitle/summary
- renderer type
- availability (`prototype` or `ready`)
- linked `placeIds`
- tags
- lazy scene JSON path

Scene detail documents live at:

```text
public/data/immersive/scenes/*.json
```

A scene can contain:

- renderer (`map-terrain`, `panorama`, `parallax`)
- explicit reconstruction disclaimer
- evidence legend
- period metadata
- entry camera for terrain scenes
- panorama/parallax configuration
- asset records with separate asset provenance
- evidence-aware hotspots

Hotspots support two coordinate spaces:

- normalized image coordinates (`x`, `y` from 0 to 1)
- geographic coordinates for MapLibre terrain scenes

Hotspot records carry:

- evidence class
- confidence
- Scripture references
- source IDs
- optional linked atlas place
- a structured “Why is this shown here?” explanation containing evidence, inference, and alternatives

## 4. Evidence classes for visual scenes

Scene evidence is deliberately not collapsed into a single confidence badge.

```text
real-terrain
known-archaeology
historical-inference
artistic-reconstruction
tradition
unknown-disputed
```

These classes describe **what kind of visual claim is being made**. They complement, rather than replace, v1 geographic confidence and historical-interpretation confidence.

Examples:

- A DEM hillshade can be `real-terrain` even when the biblical event associated with that landscape is debated.
- A wall traced from excavated remains can be `known-archaeology` while a complete city silhouette may be `artistic-reconstruction`.
- A traditional Golgotha candidate remains `tradition` or `unknown-disputed` as appropriate; a scene must not convert it into an established event coordinate.

## 5. Interactive images and panoramas

### Wide panorama tier

Batch 1 implements a dependency-free wide-panorama renderer:

- pointer/touch drag
- keyboard left/right/Home/End controls
- normalized hotspot anchoring
- responsive layout
- bottom-sheet hotspot evidence on mobile
- reduced-motion compatible behavior
- lazy scene document loading

This tier is appropriate for wide landscape photography, rendered matte paintings, and layered reconstructions.

### True equirectangular 360° tier

Do **not** add a new 360° WebGL dependency until a real asset set is selected and the dependency/license/performance tradeoff can be verified. A future adapter can be added behind the same scene model. Candidates should be evaluated for:

- touch quality on Android
- GPU/memory footprint
- accessibility hooks
- equirectangular tiling support
- hotspot yaw/pitch anchoring
- licensing and maintenance

Batch 1 therefore avoids adding Three.js, Cesium, or a panorama library merely to prove the concept.

## 6. Parallax scenes and alpha.12 animated reconstructions

The V2 renderer supports layered assets with pointer-relative depth. Alpha.12 extends this into a dedicated animated-reconstruction mode for the Jerusalem, Galilee, Megiddo/Jezreel, Sinai, and Yam Suph flagship worlds.

Animated reconstruction is deliberately a separate view from the 3D map. The UI labels it `artistic-reconstruction`, exposes a pause control, and disables automatic motion under `prefers-reduced-motion`. The initial bundled masters are lightweight project-authored SVG layers; higher-resolution AVIF/WebP layers can replace them behind the same scene contract later.

For release scenes, each layer should be separately attributable and categorized where appropriate.

Typical layers:

```text
sky
far terrain
midground terrain
vegetation
known architecture
inferred/reconstructed architecture
figures
foreground
```

Parallax motion must remain restrained and disables effectively under `prefers-reduced-motion`.

## 7. 3D terrain: MapLibre vs Cesium

### Decision: keep MapLibre as the primary terrain engine

MapLibre is already integrated and can render `raster-dem` terrain. V2 terrain scenes reuse the existing map instance, camera system, data layers, PMTiles protocol, URL/base-path behavior, and mobile controls.

Advantages for this project:

- no second geographic rendering stack
- lower bundle and memory cost than a globe-first engine
- direct compatibility with existing place/journey/context layers
- good fit for regional scenes such as Jerusalem, Sinai, Galilee, and Jezreel
- existing PMTiles/static-hosting path remains useful
- simpler GitHub Pages deployment

### Alpha.12 local 3D site geometry

Alpha.12 uses MapLibre `fill-extrusion` for lightweight site-scale explanatory geometry. These local GeoJSON volumes are not a substitute for DEM terrain or surveyed photogrammetry. Every bundled feature carries `geometryRole: derived-display-geometry`, an illustrative-height flag, an evidence class, a coordinate role, and a boundary note.

This allows a useful 3D site map before external terrain is installed while preserving the distinction between display geometry, known archaeology, and future measured datasets.

### Why not Cesium now

Cesium becomes compelling if V2 later requires globe-scale 3D Tiles, photogrammetry, massive streamed meshes, or globe-to-site transitions that MapLibre cannot provide. Those needs are not yet demonstrated. Adding Cesium now would duplicate map state, increase GPU/bundle pressure, complicate mobile behavior, and make evidence-layer integration harder.

### deck.gl

Do not add deck.gl in Batch 1. It remains an optional future overlay engine if custom meshes, dense 3D extrusions, or specialized visualization layers exceed MapLibre's native layer system.

## 8. Terrain asset format

The configuration accepts either one global terrain archive or scene-specific regional archives containing Mapbox-encoded raster DEM / Terrain-RGB tiles:

```text
VITE_TERRAIN_PMTILES_URL=https://.../terrain.pmtiles
VITE_TERRAIN_JERUSALEM_PMTILES_URL=https://.../terrain-jerusalem.pmtiles
VITE_TERRAIN_GALILEE_PMTILES_URL=https://.../terrain-galilee.pmtiles
VITE_TERRAIN_MEGIDDO_PMTILES_URL=https://.../terrain-megiddo.pmtiles
VITE_TERRAIN_SINAI_PMTILES_URL=https://.../terrain-sinai.pmtiles
VITE_TERRAIN_DELTA_PMTILES_URL=https://.../terrain-delta.pmtiles
```

Regional values fall back to the global URL. `public/data/terrain/regions.json` records the research-supplied target extents and explicitly marks regions whose source-tile list is incomplete.

Requirements before release use:

- source/license verified from the primary provider
- conversion pipeline documented
- vertical datum/resolution recorded
- no claim that modern terrain alone reconstructs ancient coastlines, hydrology, or built environments
- hosting origin supports CORS and HTTP Range requests

The scene runtime automatically requests configured terrain for `map-terrain` scenes while retaining the flat fallback when no DEM is configured.

## 9. Asset provenance

Visual/media assets have provenance separate from historical source records.

Each scene asset declares:

- bundled vs external hosting
- verification status
- source URL when known
- license / license URL when known
- attribution when required
- provenance notes

The Batch 1 validator prevents a scene marked `ready` from depending on an external asset still marked `needs-verification`.

No third-party visual asset is bundled in Batch 1.

## 10. Hosting boundary

### Keep on GitHub Pages

- Vite/React/TypeScript app shell
- v1 atlas datasets
- small GeoJSON
- scene catalog and small scene JSON
- search corpus
- manifest/PWA/service-worker files
- small project-authored SVG/icons
- lightweight fallback visual scaffolding

### Put on R2 / S3 / CDN

- terrain PMTiles
- panoramas
- high-resolution AVIF/WebP images
- parallax layer packs
- large archaeological imagery where redistribution is licensed
- historical coastline/hydrology tile packs
- optional high-resolution textures

External media URLs are absolute HTTPS URLs in scene metadata. This keeps GitHub Pages base-path handling independent of the asset CDN.

## 11. Mobile interaction

V2 scene behavior is mobile-first:

- touch drag for panoramas
- MapLibre pinch/rotate/tilt for terrain
- large hotspot tap targets
- evidence details as a bottom sheet on narrow screens
- scene header constrained so it does not consume the entire viewport
- no eager loading of scene media
- no animation required to reach content
- keyboard path remains available on desktop/tablet keyboards
- reduced-motion respected

Future real panorama assets should supply multiple responsive sizes and mobile-oriented decode budgets.

## 12. Performance strategy

Batch 1 introduces CI budgets:

- immersive catalog <= 128 KiB
- each scene JSON <= 256 KiB
- any single GitHub-bundled immersive asset <= 4 MiB
- all GitHub-bundled immersive visual assets <= 12 MiB total
- large media belongs on external static storage

Primary runtime risks:

1. simultaneous DEM + panorama texture memory on mobile
2. decoding very large panoramas
3. excessive MapLibre source/layer counts in Jerusalem period modes
4. too many transparent parallax layers
5. service-worker caching of large same-origin media
6. Range/CORS misconfiguration on PMTiles hosting
7. duplicated high-resolution assets across periods
8. scene prefetching that defeats lazy loading

Mitigations:

- scene-level lazy fetch
- responsive AVIF/WebP
- tiled 360° imagery for very large panoramas
- load one flagship scene at a time
- keep large media cross-origin and outside the current same-origin runtime cache
- reuse terrain tiles between scenes
- prefer data-driven MapLibre layers over duplicated map instances
- scene teardown when closed

## 13. Environmental and historical reconstruction

Ancient environment must be represented at the confidence level supported by the evidence.

Potential evidence families requiring primary-source verification before use:

- pollen / paleobotanical records
- Holocene climate syntheses
- Dead Sea level reconstructions
- Nile paleochannel/hydrology research
- sedimentation and shoreline studies
- ancient harbor/coastline reconstructions
- regional geology and geomorphology

A period scene should distinguish:

- modern physical terrain that is still relevant
- period-specific reconstructed hydrology/coastline
- archaeological observations
- inferred land use / vegetation zones
- purely artistic filler

Do not use a modern shoreline as an unlabeled ancient shoreline where sedimentation or river dynamics materially changed the landscape.

## 14. External datasets/assets needing verification

Web access was not available during this Batch 1 implementation, so no current license or capability is newly asserted as verified.

Candidate source families to verify from primary/official pages before redistribution or processing include:

- Copernicus DEM GLO-30
- NASA SRTM
- Natural Earth
- Pleiades
- Wikidata
- AWMC / DARE road and classical-geography resources
- official excavation project datasets
- museum open collections
- regional archaeological GIS projects
- scientific paleoenvironment/coastline datasets
- Bible text sources such as BSB/WEB if full text is later bundled

For each, capture exact license, attribution, stable URL, check date, redistribution/derivative permissions, and whether the dataset supports the actual visualization claim.

## 15. Batch plan

### V2 Batch 1 — immersive foundation

Implemented/targeted:

- scene catalog + lazy scene loader
- Zod scene runtime schema
- separate asset provenance model
- panorama interaction engine
- parallax renderer foundation
- MapLibre terrain-scene camera/hotspot integration
- “Why is this shown here?” hotspot sheet
- evidence legend
- mobile bottom sheet behavior
- URL-deep-linkable scenes
- reduced-motion path
- static performance/asset validation
- two explicitly marked engine prototypes (Sinai panorama, Megiddo terrain)

### V2 Batch 2 — Sinai + Exodus visual world

Implemented at prototype level:

- Sinai wilderness travel/environment scene
- Yam Suph environmental proposal-family explorer
- Mount Sinai candidate comparison
- explicit route/water/candidate uncertainty
- verified external DEM/paleohydrology assets still pending

### V2 Batch 3 — Canaan + Megiddo

Implemented at prototype level:

- Canaan regional landscape zones
- flagship Megiddo/Jezreel period-aware terrain scene
- Carmel/Tabor/Gilboa context
- period-state deep links and terrain fallback labeling

### V2 Batch 4 — Jerusalem / Moriah / Zion

Implemented at prototype level:

- Jerusalem Through Time period subsystem
- Moriah/Zion concept explorer
- City of David / southeastern ridge, Temple Mount, Gihon/Siloam, Kidron, Mount of Olives
- explicit First Temple-footprint uncertainty
- CI guardrails preventing Zion/Moriah certainty inflation

### V2 Batch 5 — Galilee + Jesus

Implemented at prototype level:

- Galilee ministry landscapes
- Sea of Galilee / Capernaum / Nazareth context
- Caesarea Philippi + unnamed Transfiguration mountain explorer
- Judean wilderness / eastern approach
- guided Gospel story → immersive scene links

### V2 Batch 6 — Passion geography

Implemented at prototype level:

- Passion Night Jerusalem
- Pilate praetorium alternatives
- Golgotha/burial candidate explorer
- resurrection geography with theological/archaeological separation
- story deep links into exact scene variant/period/hotspot states

### V2 Batch 7 — imperial cities

Implemented at prototype level:

- Babylon: archaeological city, exile context, palace context, and 539 BCE transition
- Nineveh: Assyrian archaeology, Jonah literary setting, and 612 BCE fall
- Susa + Persepolis: named biblical royal center vs wider Achaemenid context
- Ephesus: Paul, theater, Artemision, unlocated Hall of Tyrannus, coastline caution
- Rome: Puteoli/Appian approach, city-level Pauline context, unlocated lodging/Three Taverns, Revelation interpretive lens
- Patmos: secure island, unknown exact visionary location, later Cave tradition
- guided Exile/Acts/Revelation story deep links into the new scene states
- CI guardrails preserving symbolic/non-terrestrial Revelation geography

### V2 Batch 8 — integration/release foundation

Implemented:

- Follow the Journey across all 69 inherited journey datasets
- featured Abraham / Exodus / Jesus / Paul journey groups
- segment-level route-certainty UI and MapLibre animation
- journey + segment URL deep links
- journey and immersive-scene search integration
- 1,095-document generated search corpus
- desktop and mobile Journey navigation
- service-worker version-sensitive manifest/search network-first policy
- continued PMTiles HTTP Range bypass
- dedicated Batch 8 integration audit
- post-batch verification intake checklist

Still external/environment dependent:

- real-device Android GPU profiling with production DEM/panorama assets
- verified source/license ingestion
- production terrain/coastline/paleoenvironment asset pipeline
- conversion of individual scenes from `prototype` to `ready`
- dependency-backed final Vite build and test run once packages can be installed

## 16. Definition of a release-quality immersive scene

A scene should not move from `prototype` to `ready` until it has:

- verified asset provenance/licenses
- evidence classes on major visual claims
- source-linked hotspots
- explicit reconstruction disclaimer
- mobile interaction QA
- reduced-motion QA
- performance budget compliance
- alternative interpretations where material
- historical period definition
- “Why is this shown here?” coverage
- no unsupported exact location/route/footprint claims


## Verification-packet integration — alpha.9

The post-batch verification phase is additive to the eight V2 feature batches. `public/data/verification/registry.json` records the user-supplied research packet's licensing conclusions, historical guardrails, selected external identifiers, and scene-readiness assessments without overwriting the original atlas evidence model.

The registry deliberately records `independentLiveVerification: false` because live web access is unavailable in this build environment. Packet-derived records are therefore research provenance, not a claim that this build independently revisited every upstream URL or license.

Selected Pleiades/Wikidata identifiers are copied into `PlaceRecord.externalIds` only for matching established/probable atlas records listed by the packet. They do not change geographic confidence or coordinate roles. Immersive scenes can display packet-backed source/license/guardrail context separately from v1 source records.

Optional Roman-road geometry can be supplied with `VITE_ROMAN_ROADS_GEOJSON_URL`; ORBIS and Digital Augustan Rome remain optional non-commercial research resources rather than mandatory production dependencies. Actual Copernicus DEM, DARE, Open Context, paleo-coastline, and image bytes remain outside the repository until concrete licensed assets are supplied.


## 20. Alpha.10 production asset pipeline

Alpha.10 adds a third state boundary alongside atlas data and research verification: **installed runtime assets**. Research readiness is not treated as proof that bytes exist. `public/data/assets/manifest.json` describes required terrain, roads, derived coastlines, archaeological datasets, and image packs; `src/generated/installedAssets.json` lists only assets actually present or explicitly configured.

The first registered installed asset is the existing Natural Earth land fallback, checksum-verified in CI. Copernicus terrain, DARE roads, Yam Suph paleolakes, Galilee shoreline, Ephesus paleocoastline, Jerusalem reconstructed surface, Megiddo archaeology, Babylon GIS, and historic imagery remain separately gated by source bytes, derivation metadata, dataset-specific licensing, or item-level image verification.

Roman-road GeoJSON is lazy-loaded only when the user enables the layer. External PMTiles terrain remains Range-compatible and should live on static object storage. Derived historical GeoJSON must declare citations, uncertainty, `derivationMethod: independently-authored`, and `noExactEventCoordinateClaims: true`; its features are stamped `historical-inference` and `reconstruction: true`.

See `docs/V2_ASSET_PIPELINE.md` for commands and release policy.


## Alpha.11 deployment hardening

The runtime now treats external terrain, basemap, and Roman-road sources as optional enhancements with explicit health state. Browser diagnostics probe CORS and PMTiles byte-range behavior, MapLibre source errors fall back to the bundled atlas instead of taking down the experience, and successful diagnostics can retry sources without a page refresh.

A registry-driven attribution drawer exposes credits for resources actually used by the build. External basemap configuration fails closed without an explicit attribution string, while Roman-road runtime attribution is restricted to verification-registry source IDs. GitHub Pages remains the shell host and accepts optional external asset URLs through repository Variables.

See `docs/V2_DEPLOYMENT.md`.
