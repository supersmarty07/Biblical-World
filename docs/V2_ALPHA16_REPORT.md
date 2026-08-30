# V2 Alpha.16 — Immersive Mobile Experience

Version: `2.0.0-alpha.16`

## Goal

Shift the mobile product hierarchy from a legacy map-first shell toward an immersive historical-atlas experience while preserving the existing evidence, uncertainty, scene, journey, and deployment architecture.

## What changed

- Added an immersive-first mobile landing experience with four flagship worlds:
  - Jerusalem Through Time
  - The Galilee of Jesus
  - Megiddo & the Great Valley
  - Wilderness & Exodus Environment
- The landing cards use the existing project-authored layered reconstruction art and enter the already evidence-aware immersive scene runtime.
- Added a first-class mobile Explore tab and explicit Map tab.
- Changed mobile map defaults so macro journeys and historical-context regions start hidden; users can enable them deliberately.
- Increased mobile place-label minimum zoom and reduced mobile point/glow size to reduce label/route congestion.
- Converted Layers from a desktop floating panel into a dismissible mobile bottom sheet.
- Converted the global historical timeline into a compact mobile period chip that expands only when requested.
- Hidden the global timeline while an immersive scene or immersive landing experience is active; scene-specific period controls remain authoritative inside immersive worlds.
- Tightened mobile immersive-scene presentation for fuller-screen reconstruction and 3D-map use.
- Made the brand a direct return path to the immersive-worlds landing experience.
- Bumped the service-worker runtime cache to `biblical-world-v2-alpha16-runtime`.
- Preserved deployment from `BIBLE-WORLD-V4` and `main`.

## Historical/evidence behavior unchanged

No alpha.16 visual change alters geographic confidence, coordinate roles, archaeological provenance, historical interpretation confidence, or symbolic/visionary coordinate rules. Existing Sinai, Yam Suph, Moriah/Zion, First Temple, Gospel-location, Pauline, and Revelation safeguards remain protected by the inherited audits.

## Verification

- `npm run check`: PASS.
- 9 content packs remain valid: 405 places, 246 people, 265 events, 69 journeys, 90 stories, 166 sources.
- Immersive validation: 20 scenes, 25 animated layers, 12 evidence-aware 3D display features.
- Static search corpus: 1,095 documents.
- TypeScript/TSX syntax transpilation: 43 files, 0 syntax diagnostics.
- ZIP/static file budgets remain within existing repository limits.
- `npm test`: cannot start in this execution environment because project `node_modules` is absent (`vitest: not found`).
- `npm run build`: all prebuild validation/catalog/search steps pass; TypeScript then stops because `vite/client` and Node type definitions are unavailable without installed dependencies. GitHub Actions remains the authoritative dependency-backed build/test environment.

## Deployment

The GitHub Pages workflow continues to deploy from:

- `main`
- `BIBLE-WORLD-V4`

The workflow still builds Vite, runs `smoke:dist`, uploads `dist`, and deploys through the `github-pages` environment.
