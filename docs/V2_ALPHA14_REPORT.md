# The Biblical World V2 — Alpha.14 Report

Version: `2.0.0-alpha.14`

## Scope

Alpha.14 is the production bridge between the interactive 3D/cinematic systems from alpha.13 and the future large external asset packages. It does **not** claim that the missing Copernicus PMTiles or final photorealistic reconstruction masters are already installed.

The release concentrates on three production needs:

1. making `BIBLE-WORLD-V4` the active development/deployment branch;
2. treating Jerusalem, Galilee, Megiddo, Sinai, and the eastern Delta as independent terrain deployments rather than one global terrain switch;
3. allowing each flagship Animated Reconstruction to accept a credited high-resolution master image without removing the evidence-aware layered fallback.

## BIBLE-WORLD-V4 deployment

The GitHub Pages workflow now auto-runs on:

- `main`
- `BIBLE-WORLD-V4`

The legacy `bible-world-v2` branch trigger is removed. The build also injects `VITE_DEPLOY_BRANCH=${{ github.ref_name }}` so the browser diagnostics can identify which branch produced the deployment.

## Regional 3D terrain readiness

The app already supported scene-specific terrain URLs internally. Alpha.14 completes that model in the deployment UI:

- the Layers panel recognizes **regional-only** terrain configurations;
- Deployment Diagnostics lists Jerusalem, Galilee, Megiddo/Jezreel, Sinai, and Delta separately;
- each configured archive receives its own browser CORS + HTTP Range probe;
- duplicate URLs are probed once and the result is shared across regions that use them;
- failure of any archive still degrades to the flat atlas rather than blocking the application.

The Copernicus identifiers in `public/data/terrain/regions.json` remain research targets only. No large DEM or PMTiles bytes are represented as installed.

## High-resolution animated reconstruction masters

Alpha.14 adds optional external master-art slots for:

- Jerusalem c. 30 CE
- Galilee c. 30 CE
- Megiddo / Jezreel
- Sinai wilderness
- Eastern Delta / Yam Suph environment

Each slot requires **both** an HTTPS URL and a credit string. If either is missing, the master is ignored and the existing five-layer project-authored animated illustration remains the fallback.

The master is not a static replacement for animation. It participates in the existing cinematic camera drift, time-of-day grading, vignette, motion layers, and quality system. The UI continues to label the scene **Artistic reconstruction**.

`public/data/immersive/artwork-manifest.json` records all five production slots and keeps the Delta/Yam Suph do-not-claim rule explicit.

## New GitHub repository Variables

Optional cinematic variables:

- `VITE_CINEMATIC_JERUSALEM_MASTER_URL`
- `VITE_CINEMATIC_JERUSALEM_MASTER_CREDIT`
- `VITE_CINEMATIC_GALILEE_MASTER_URL`
- `VITE_CINEMATIC_GALILEE_MASTER_CREDIT`
- `VITE_CINEMATIC_MEGIDDO_MASTER_URL`
- `VITE_CINEMATIC_MEGIDDO_MASTER_CREDIT`
- `VITE_CINEMATIC_SINAI_MASTER_URL`
- `VITE_CINEMATIC_SINAI_MASTER_CREDIT`
- `VITE_CINEMATIC_DELTA_MASTER_URL`
- `VITE_CINEMATIC_DELTA_MASTER_CREDIT`

Large final masters should live on R2/S3/CDN and be AVIF/WebP where practical. The GitHub repository should retain only the lightweight fallback art.

## Evidence boundaries retained

Alpha.14 changes no historical confidence levels or coordinate roles. In particular:

- no exact Yam Suph crossing point is introduced;
- no Exodus route is inferred from terrain;
- Sinai remains unresolved and its supplied tile list remains explicitly incomplete;
- Jerusalem site volumes remain derived display geometry, not surveyed First Temple/Herodian reconstruction footprints;
- cinematic masters remain artistic reconstruction even when photorealistic.

## Verification

Run:

```bash
npm run check
```

The alpha.14 audit protects branch deployment, regional terrain diagnostics, credited cinematic-master configuration, the Sinai incompleteness marker, and the Yam Suph coordinate guardrail.

Dependency-backed `npm test` and final Vite build still require installed `node_modules`; GitHub Actions remains the authoritative dependency-backed build environment for this handoff.
