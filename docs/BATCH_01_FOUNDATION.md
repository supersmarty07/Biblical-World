# Batch 1 — Platform Foundation

## Objective

Create the production architecture that every later biblical era can use without introducing a backend or embedding weak historical claims into the platform layer.

## Scope

### Application shell
- [x] Vite + React + TypeScript
- [x] full-screen map workspace
- [x] desktop information panel
- [x] mobile bottom-sheet behavior
- [x] keyboard-accessible search entry
- [x] reduced-motion support

### Map engine
- [x] MapLibre GL JS
- [x] static GeoJSON place source
- [x] static GeoJSON journey source
- [x] contextual polygon source
- [x] confidence-aware place symbology
- [x] clickable map records
- [x] PMTiles protocol registered
- [x] optional raster-dem PMTiles terrain adapter
- [x] lightweight procedural graticule for the no-basemap foundation state

### Time
- [x] historical year slider
- [x] BC/AD formatting
- [x] record validity helper
- [x] year persisted into the shareable URL

### Stories and animation
- [x] declarative story JSON
- [x] camera chapters
- [x] Scripture-reference chips
- [x] animated journey route
- [x] animated traveler silhouette marked as artistic reconstruction
- [x] next/previous chapter navigation

### Evidence and provenance
- [x] separate geographic and interpretation confidence
- [x] “Why is this shown here?” panel
- [x] source records
- [x] source-ID validation
- [x] demo-data warning state
- [x] legal/attribution documents
- [x] machine-readable demo license manifest

### Search
- [x] MiniSearch integration
- [x] fuzzy/prefix lookup
- [x] place/story/Scripture-reference fields
- [x] runtime fallback index
- [x] build-time static-index generator

### Deployment
- [x] GitHub Pages workflow
- [x] repository-name base-path handling
- [x] optional external static PMTiles URLs
- [x] no backend dependency

## Explicitly deferred to Batch 2

Batch 1 does **not** claim to ship the researched Genesis atlas. The records under `public/data/demo` are structural fixtures and are marked `demo: true` in the UI and data.

Batch 2 should introduce verified production sources, canonical external IDs, a real physical basemap, terrain assets, researched Genesis places, archaeological context, and complete attribution records.

## Exit criteria

Batch 1 is complete when:

1. Demo datasets validate with zero broken references.
2. The application source contains no runtime backend requirement.
3. Timeline/layer updates do not recreate the map instance.
4. Search can be prebuilt statically.
5. A guided story can move the camera and animate a route.
6. Every displayed record can explain its confidence and provenance.
7. GitHub Pages deployment configuration is present.
