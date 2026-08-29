# Batch 1 execution report

## Status

Completed at source level.

## Delivered

- React/Vite/TypeScript application shell
- MapLibre GL JS integration
- PMTiles protocol and optional terrain adapter
- responsive desktop/mobile UI
- timeline and BC/AD formatting
- URL-persisted year/place/story state
- confidence-aware place records
- “Why is this shown here?” evidence panel
- declarative guided-story engine
- animated route and traveler marker
- layer controls
- MiniSearch integration and build-time index generator
- Zod runtime parsing of loaded atlas data
- source/provenance records
- license/attribution policy documents
- GitHub Pages deployment workflow
- demo-data validation
- oversized-static-asset guard
- unit tests for time/geometry helpers
- Batch 1 architecture and data-model documentation

## Verification performed in the build environment

- `node scripts/validate-data.mjs` — PASS
- `node scripts/check-static.mjs` — PASS
- TypeScript syntax transpilation for every `.ts`/`.tsx` source file — PASS
- standalone TypeScript compilation of pure time/geometry utilities — PASS

## Verification not executable in this environment

The environment does not contain the project npm dependencies and external package installation is unavailable. Therefore `npm install`, `npm test`, and the complete `npm run build` were not executed here.

The GitHub Pages workflow will install dependencies, run validation, generate the static MiniSearch index, type-check, build Vite, and deploy when the repository is pushed to GitHub.

## Historical-content boundary

All map/story data under `public/data/demo/` is visibly marked `demo: true`. It demonstrates architecture only and is intentionally not represented as the final researched Genesis dataset. That replacement begins in Batch 2.
