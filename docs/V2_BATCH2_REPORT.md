# V2 Batch 2 Report - Sinai + Exodus Visual World

**Version:** `2.0.0-alpha.2`  
**Starting point:** V2 Batch 1 / `2.0.0-alpha.1`

## Scope delivered

Batch 2 extends the immersive engine without changing the v1 biblical place/event/journey evidence model.

Implemented:

- evidence-aware scene comparison options
- deep-linkable `variant` URL state
- variant-specific image and geographic hotspots
- variant-specific MapLibre camera movement
- explicit coordinate-role metadata for comparison cameras
- comparison rationale, objections, source status, and linked atlas-record access
- project-authored schematic environment modes for non-site-specific visual explanation
- expanded Sinai wilderness travel/water context
- Yam Suph environmental proposal-family explorer
- Mount Sinai candidates explorer
- PWA runtime cache version bump for updated scene JSON

The immersive catalog now contains four scenes total: three Sinai/Exodus experiences and the existing Megiddo terrain prototype.

## Sinai wilderness

The existing Sinai panorama prototype is retained rather than silently converted into a historical landscape claim. It now links from Mount Sinai, Marah, Elim, the Wilderness of Sin, and Rephidim, and adds a dedicated explanation that textual water stations do not provide secure modern site identifications.

The visual remains schematic. No real-site photograph, DEM, ancient hydrology layer, or newly verified environmental dataset is bundled.

## Yam Suph / Sea Crossing Environments

Added `yam-suph-environment-explorer` with three explicitly possible proposal families:

1. eastern Delta / lake-marsh systems
2. Gulf of Suez
3. farther-east / Aqaba-related family

Selecting a family changes only the explanatory environment and family-specific hotspots. It does not create a crossing coordinate, route line, recovered ancient shoreline, or confidence upgrade.

The marsh, gulf, and arid-gulf views are project-authored CSS schematics. They are not scientific paleoenvironment reconstructions.

## Mount Sinai Candidates Explorer

Added `mount-sinai-candidates-explorer` with three comparison states:

- Jebel Musa - `traditional`, using the existing atlas `traditional-site` coordinate
- Har Karkom - `possible`, using the existing atlas `candidate-site` coordinate
- northwestern Arabia family - `possible`, using only the existing broad Midian `approximate-area` orientation

The northwestern-Arabia option intentionally does not invent a specific mountain pin.

The scene entry camera is explicitly a `display-anchor`; it is not a coordinate for biblical Mount Sinai/Horeb. Biblical Sinai remains unlocated.

## Validation changes

`validate:immersive` now checks comparison data in addition to Batch 1 scene/asset rules:

- unique comparison option IDs
- declared default option
- valid confidence/status values
- valid place/source links
- valid comparison camera coordinates
- explicit coordinate role for every comparison camera
- explanatory note for every comparison camera
- valid schematic environment mode
- valid option-specific panorama asset reference
- valid hotspot `variantIds`

This prevents a future candidate scene from silently turning a display camera into a historical-site claim.

## Historical/source boundaries

No v1 place, person, event, journey, story, context region, source record, or Revelation visionary scene was removed or rewritten by Batch 2.

No new source is claimed to have been live verified. The existing provenance audit still reports 166 source records, with 156 external records queued for live verification.

Live web access is disabled in this environment, so Batch 2 does **not** claim current verification of:

- Copernicus GLO-30 or NASA SRTM licensing/capabilities
- Sinai geology or paleoenvironment datasets
- Nile/eastern-Delta paleohydrology
- ancient shoreline/coastline reconstructions
- archaeological project imagery
- museum imagery or redistribution terms

## Verification actually run

`npm run check` passed on `2.0.0-alpha.2`.

That run included:

- all 9-pack atlas data validation
- immersive validation: 4 scenes, 0 bundled visual bytes
- Batch 4-10 historical/editorial audits
- provenance audit
- Batch 11 hardening audit
- static repository validation

`npm run build:catalog` passed and regenerated the content manifest with atlas version `2.0.0-alpha.2`.

`npm run build:search` passed and regenerated the existing 1,006-document dependency-free search corpus.

A TypeScript compiler-API syntax transpilation pass checked all 32 TS/TSX files with zero syntax error diagnostics.

## Verification blocked by missing dependencies

`npm test` was run and failed because `vitest` is not installed (`vitest: not found`).

`npm run build` was run. Its prebuild phase passed all data/audit/static checks and regenerated catalog/search data, but TypeScript compilation then stopped because dependencies are absent:

- `Cannot find type definition file for 'vite/client'`
- `Cannot find type definition file for 'node'`

This is the same dependency-install limitation carried from Batch 1. The repository has no `node_modules` directory. Therefore Batch 2 is structurally and syntax verified, but not dependency-backed test/build verified.

## What remains for a release-quality Batch 2 visual pack

The current scenes should remain `prototype` until the project can verify and integrate suitable primary-source datasets/assets. Remaining work includes:

- real DEM terrain with documented source, resolution, datum, license, and conversion steps
- mobile testing with actual terrain tile loads
- verified paleohydrology/coastline sources for Yam Suph environmental hypotheses
- source-balanced candidate notes beyond the current v1 bibliography
- high-quality attributed imagery or reconstructions
- Android GPU/decode profiling
- full Vitest and Vite build after dependencies can be installed

The current code intentionally prefers an honest schematic over an impressive but unsourced historical reconstruction.
