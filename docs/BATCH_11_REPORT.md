# Batch 11 Execution Report

## Release

**Version:** 1.1.0  
**Scope:** Production, accessibility, search, provenance, offline/static, and CI hardening of the completed Genesis → Revelation atlas.

## Implemented

- Replaced MiniSearch with dependency-free deterministic search.
- Added search unit tests covering names, aliases, typo tolerance, Scripture, dates, and multi-token matching.
- Added generated `content-manifest.json` and runtime manifest discovery with fallback.
- Added structural provenance audit and generated machine-readable provenance report.
- Generated a human-readable source verification queue for all external records.
- Extended source schema for future DOI/ISBN/edition/page/check metadata.
- Added source-status honesty to the information panel.
- Added skip navigation, focus visibility, dialog focus trap/restore, landmark improvements, and hidden map-accessibility explanation.
- Added reduced-motion MapLibre camera/journey behavior.
- Added web manifest, project-authored app mark, and conservative runtime service worker.
- Explicitly bypassed HTTP Range requests in the service worker for PMTiles compatibility.
- Added pull-request quality workflow.
- Added Batch 11 regression audit.
- Updated version and production documentation.

## Corpus retained

No historical content count was inflated in Batch 11:

- 405 places
- 246 people
- 265 events
- 69 journeys / literary sequences
- 90 stories
- 77 context regions
- 166 sources
- 10 visionary scenes

## Provenance status

The structural report contains 166 source records.

- 10 project-authored records
- 6 external records currently carry research-supplied metadata
- 150 external records still need live verification metadata
- all 156 external records remain in the live-verification queue until checked directly

This is intentional. Batch 11 does not convert prior research summaries into false “verified” claims.

## Environment limitation

The current environment contains a global TypeScript compiler but does not contain the project runtime/development npm dependency tree (`react`, `vite`, `maplibre-gl`, `zod`, etc.) and cannot fetch it from the network. Therefore the final dependency-resolving Vite bundle cannot be executed locally here.

Unlike Batches 8–10, **search-corpus generation now succeeds locally without npm dependencies**. All Node-only validation/audit/generation stages run to completion.

A complete `npm run build` was attempted after those checks. It reached `tsc -b` and stopped because the local environment does not contain the project-installed `vite/client` and `@types/node` type packages. This is now the first unavailable-dependency boundary; search generation is no longer the blocker.

Independent syntax transpilation succeeds across the TypeScript/TSX source tree, and the dependency-free search engine passes representative smoke queries. GitHub Actions installs the declared dependency tree before tests/build and remains the authoritative full production-build path.
