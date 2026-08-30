# V2 alpha.12 — Immersive Worlds

Version: `2.0.0-alpha.12`

Alpha.12 makes the first four flagship environments explicitly dual-mode: **3D site map** plus **animated historical reconstruction**. The two modes are intentionally separated so cinematic period imagery never masquerades as measured terrain or archaeology.

## Flagship worlds

- Jerusalem Through Time
- Galilee Ministry Landscapes
- Megiddo + Jezreel Valley
- Sinai Wilderness
- Yam Suph / Sea Crossing Environments (paired with the Sinai/Exodus world)

Each world now carries a `world` configuration with:

- a pitched 3D teaching camera;
- a regional terrain key;
- optional local evidence-aware site geometry;
- an animated reconstruction configuration;
- five independently layered bundled illustration assets;
- restrained environmental motion metadata;
- a user-facing mode switch between 3D map and animated reconstruction.

## Animated reconstruction system

Alpha.12 bundles 25 lightweight project-authored SVG layers (18,213 bytes total) across five environments. Runtime motion includes slow camera/parallax movement, cloud drift, haze, water shimmer, vegetation sway, and bird movement where appropriate.

The animation system:

- pauses on request;
- respects `prefers-reduced-motion`;
- keeps all generated layers classified as `artistic-reconstruction`;
- displays a reconstruction disclaimer inside the scene;
- keeps evidence hotspots and source/provenance UI separate from visual atmosphere.

These SVGs are a production-capable layered animation foundation, not claims of photorealistic archaeological reconstruction. Higher-resolution AVIF/WebP generation layers can replace them later without changing the scene interaction model.

## 3D site-map system

MapLibre now supports scene-specific `fill-extrusion` site geometry over the existing atlas. Alpha.12 bundles project-authored display geometry for:

- Jerusalem: Herodian platform display shell, southern approaches, southeastern-ridge display zone, and late-Iron-Age western-expansion reference;
- Galilee: Capernaum/Magdala site volumes plus separately classified el-Araj and et-Tell Bethsaida candidate volumes;
- Megiddo: a tel display mass and a separate gate foundation concept;
- Sinai: candidate/traditional display plinths only.

Every bundled extrusion is explicitly `derived-display-geometry` with `heightBasis: illustrative`. None is classified as `known-archaeology` geometry because alpha.12 does not contain surveyed third-party polygons. The Temple Mount display shell is `historical-inference`, not an exact archaeological footprint, and does not encode a First Temple footprint.

Without a configured DEM, these extrusions appear over a pitched **flat elevation base**. When a compatible Terrain-RGB PMTiles source is configured, the same site layer appears over real terrain relief.

## Regional terrain packaging

Alpha.12 adds `public/data/terrain/regions.json` for separately hosted terrain archives:

- `jerusalem`
- `galilee`
- `megiddo`
- `sinai`
- `delta`

Supported repository variables:

- `VITE_TERRAIN_JERUSALEM_PMTILES_URL`
- `VITE_TERRAIN_GALILEE_PMTILES_URL`
- `VITE_TERRAIN_MEGIDDO_PMTILES_URL`
- `VITE_TERRAIN_SINAI_PMTILES_URL`
- `VITE_TERRAIN_DELTA_PMTILES_URL`

Each falls back to `VITE_TERRAIN_PMTILES_URL` when unset. MapLibre switches the external raster-DEM source when the active immersive world changes.

The supplied Copernicus research is treated as research metadata rather than source bytes. Jerusalem/Galilee/Megiddo tile targets are recorded; Sinai is deliberately marked `incomplete-research-tile-list` because the supplied 27–31 N / 32–35 E extent lists only four tiles.

## Historical safeguards preserved

- No exact Exodus route or Yam Suph crossing point is created.
- Sinai candidate markers remain candidate/traditional display geometry, never identified-site geometry.
- No exact First Temple footprint is created.
- Jerusalem derived volumes are not described as surveyed polygons.
- Bethsaida alternatives remain disputed/candidate sites.
- Modern DEM relief remains distinct from reconstructed ancient shorelines and built environments.
- Animated images remain `artistic-reconstruction` even when informed by archaeology or texts.

## Validation

`npm run check` passes the full inherited data/history/provenance/immersive/deployment suite plus `audit:v2-alpha12`.

The new alpha.12 audit enforces:

- five dual-mode immersive worlds;
- 25 bundled animated layers;
- four local site-model GeoJSON files with 12 evidence-aware features;
- no `known-archaeology` classification for illustrative extrusion geometry;
- Sinai candidate-role protection;
- Yam Suph no-site-model/no-crossing-point protection;
- reduced-motion support;
- regional terrain registry and environment-variable configuration.

A dependency-free TypeScript transpilation pass covers all 41 TS/TSX files with zero syntax diagnostics.
