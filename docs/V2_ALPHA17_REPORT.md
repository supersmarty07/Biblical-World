# The Biblical World V2 — Alpha.17 Full-Screen Immersive Scene Shell

Version: `2.0.0-alpha.17`
Deployment branch: `BIBLE-WORLD-V4`

## Purpose

Alpha.17 responds directly to Android field screenshots from alpha.16. The scene data/evidence system was functioning, but title, research, geometry and navigation panels occupied too much of the viewport. Alpha.17 makes the historical world the primary surface and moves scholarly scaffolding into an on-demand evidence drawer.

## Visible changes

- Opening an immersive world now hides the global top bar and mobile bottom navigation.
- 3D Map and Animated Reconstruction occupy the full application viewport.
- Permanent scene title/research cards are replaced by a compact translucent HUD containing title, period and Info.
- Evidence disclaimer, verification packet, asset readiness, terrain/geometry boundary, period details, comparison alternatives and evidence legend live in a collapsed Info drawer.
- On phones the Info drawer is a bottom sheet; in landscape it becomes a side drawer.
- 3D orbit-left, orbit-right, top-down and reset controls float directly over the map.
- World mode remains a compact 3D Map / Animated Reconstruction switch at the bottom edge.
- Cinematic reconstruction controls are reduced to a compact strip.
- Device reduced-motion is still respected by default, but the user can explicitly choose Motion: System / On / Off. The choice is stored locally.
- When Motion: On is explicitly selected, cinematic drift/effects can run even when the device has a reduced-motion preference; this override is never automatic.
- Closed drawers do not intercept map touches.

## Evidence safeguards

Alpha.17 changes presentation only. Existing geographic confidence, coordinate roles and historical uncertainty remain unchanged. In particular:

- no exact Mount Sinai identification is introduced;
- no Exodus route or Yam Suph crossing coordinate is introduced;
- First Temple footprint remains unverified;
- Zion/Moriah, Gospel candidate sites and Pauline uncertainty remain protected;
- generated/cinematic imagery remains explicitly artistic reconstruction;
- visionary Revelation geography remains coordinate-free.

## Verification

- `npm run check`: PASS
- 9 data packs: PASS
- 405 places / 246 people / 265 events / 69 journeys / 90 stories / 166 sources
- 20 immersive scenes / 10 visionary scenes
- integrated search corpus: 1,095 documents
- alpha.17 regression audit: PASS
- TS/TSX syntax transpilation: 43 files, 0 diagnostics
- archive integrity: tested during packaging

`npm test` cannot start in this environment because `vitest` is not installed. `npm run build` passes all dependency-free prebuild validation/catalog/search steps and then stops because project `node_modules` is absent, so TypeScript cannot resolve `vite/client` and Node type definitions. GitHub Actions remains the authoritative dependency-backed production build and `dist` smoke-test environment.
