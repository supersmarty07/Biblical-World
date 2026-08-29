# V2 Batch 1 Report — Immersive Foundation

**Version:** `2.0.0-alpha.1`  
**Baseline:** `biblical-world-v1.1.1-hotfix.zip`

## Completed

- Preserved all v1 content packs and evidence model.
- Verified the two v1.1.1 `personId: null` hotfix records are corrected.
- Added an immersive scene catalog and lazy scene loading.
- Added Zod schemas and TypeScript domain types for immersive scenes.
- Added independent asset-provenance fields.
- Added dependency-free wide-panorama drag/keyboard interaction.
- Added a parallax renderer foundation.
- Reused the existing MapLibre instance for terrain-scene camera and geographic hotspot behavior.
- Added evidence-aware hotspot details and “Why is this shown here?” explanations.
- Added mobile bottom-sheet behavior.
- Added URL scene deep links.
- Added `validate:immersive` with asset/link/performance guardrails.
- Updated service-worker cache generation while retaining Range-request bypass.
- Fixed the Batch 11 audit's accidental hardcoded `1.1.0` package-version requirement.
- Added two explicit engine prototypes: Sinai panorama and Megiddo terrain.

## Historical/content changes

No v1 place, event, journey, person, story, context-region, source, or Revelation visionary record was removed or rewritten as part of Batch 1.

The two prototype scenes are deliberately conservative:

- Sinai has no third-party image and does not identify Mount Sinai or an Exodus route.
- Megiddo reuses existing atlas place coordinates and activates true relief only if a verified external DEM source is configured.

## Verification performed

`npm run check` passed after the Batch 11 version-audit fix. This includes:

- v1 atlas data validation
- the new immersive validation
- Batch 4–10 historical/editorial audits
- structural provenance audit
- Batch 11 regression audit
- static repository validation

A syntax-only TypeScript transpilation pass using the globally available TypeScript compiler checked all source TS/TSX files with zero syntax diagnostics.

## Verification not completed

`npm install --no-audit --no-fund` first timed out. A bounded retry then failed with `EAI_AGAIN` while resolving `registry.npmjs.org`, confirming registry/network access was unavailable. No `node_modules` directory or lockfile was produced. Therefore:

- Vitest could not run (`vitest: not found`).
- Full TypeScript project type-check could not run because `vite/client` and Node type packages are absent.
- Vite production build could not be run.

Do not describe Batch 1 as fully build-verified until dependencies are installed and `npm test` plus `npm run build` complete successfully.

## External verification status

No live web verification was possible in this environment. No new third-party visual, terrain, archaeology, museum, or scientific asset is marked as primary-verified by this batch.

## Known Batch 1 limitations

- No real DEM is bundled.
- No release panorama is bundled.
- The Sinai scene is schematic UI scaffolding, not historical artwork.
- The panorama renderer is a wide-image renderer, not yet a perspective-correct equirectangular 360° viewer.
- Period metadata is present, but interactive multi-period switching is scheduled for content batches.
- Immersive scenes are linked from place panels but are not yet indexed by global search.
- Scene-specific offline caching/prefetch policy is intentionally conservative until real asset sizes are known.
