# The Biblical World V2 — Alpha.13 Report

Version: `2.0.0-alpha.13`

## Scope

Alpha.13 refines the dual-mode Immersive Worlds introduced in alpha.12. It does not change the historical data model or promote uncertain geography. Its purpose is to make both sides of the immersive experience feel interactive rather than decorative:

- the **3D Site Map** becomes an explorable evidence surface;
- the **Animated Reconstruction** becomes a controllable cinematic scene.

## 3D site-world improvements

- All 12 alpha.12 derived site-volume features now carry a `hotspotId` and can open the same evidence sheet used by scene hotspots.
- Map pointer feedback identifies clickable 3D geometry.
- Added scene-camera commands: **Orbit left**, **Orbit right**, **Top down**, and **Reset view**.
- Camera animation respects reduced-motion preferences.
- Period filtering remains active, so Jerusalem/Megiddo geometry changes with the selected historical period.
- Site geometry remains explicitly `derived-display-geometry` with illustrative heights. No feature was promoted to `known-archaeology` geometry.
- Yam Suph still has no exact site model or crossing geometry.

## Animated reconstruction improvements

- Added slow cinematic camera drift in addition to per-layer parallax.
- Added time-of-day grading: **Morning**, **Midday**, **Evening**.
- Added animated sun-glow/color-grade overlays.
- Added quality modes: **Low**, **Medium**, **High**.
- Low quality suppresses the costliest non-essential motion layers and glow treatment.
- Layer images use async decoding and foreground layers can lazy-load.
- Existing cloud, haze, water, vegetation, bird, and slow-drift motions remain available.
- `prefers-reduced-motion` still disables scene animation.

## Evidence boundaries retained

Alpha.13 does not change the core uncertainty/provenance policy:

- Jerusalem site volumes are explanatory derived geometry, not surveyed polygons.
- No exact First Temple footprint is encoded.
- Bethsaida alternatives remain candidate-site geometry.
- Megiddo superstructure heights remain artistic/illustrative.
- Jebel Musa remains traditional and Har Karkom remains a candidate; neither is an identified Mount Sinai.
- Yam Suph has no crossing point or exact crossing model.
- Animated scenes remain visibly labeled **Artistic reconstruction**.

## Verification

`npm run check` passes in full, including all inherited content, provenance, historical, immersive, verification, asset, deployment, alpha.12, and new alpha.13 audits.

Current corpus remains:

- 405 places
- 246 people
- 265 events
- 69 journeys
- 90 stories
- 166 sources
- 20 immersive scenes
- 10 Revelation visionary scenes
- 1,095 integrated search documents

The new alpha.13 audit confirms 12 clickable evidence-aware 3D site features plus cinematic time/quality/camera controls.

Dependency-backed Vitest and the final Vite production build remain unavailable in this build environment because `node_modules` is absent. GitHub Actions should remain the authoritative dependency-backed build/deploy environment.
