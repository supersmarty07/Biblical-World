# The Biblical World V2 — Alpha.15 Report

Version: `2.0.0-alpha.15`

## Scope

Alpha.15 is a production-resilience pass. It exists because a successful GitHub Pages job can still produce a blank page if the wrong artifact is published, a compiled bundle fails at runtime, or a stale service worker controls an older deployment.

The release does not alter historical content, geographic confidence, or reconstruction claims.

## Startup resilience

- Added a React `AppErrorBoundary` around the complete application.
- Fatal render errors now show a recoverable diagnostic screen instead of a blank viewport.
- Recovery actions include normal reload and **Reset local cache & reload**.
- Runtime reset unregisters service workers and deletes only `biblical-world-*` caches before reloading.
- The error view reports the build branch injected by GitHub Actions.

## Pre-React boot fallback

`index.html` now contains a tiny dependency-free startup watchdog. If the module application has not initialized after eight seconds, the static HTML displays an explanatory fallback rather than leaving an empty dark screen.

When `main.tsx` starts normally it marks the document as booted and hides the fallback immediately.

This specifically makes deployment failures easier to distinguish:

- published HTML but missing/broken JS -> boot fallback;
- React render failure -> AppErrorBoundary;
- atlas JSON failure -> existing atlas data error view;
- external terrain/media failure -> existing graceful asset fallback.

## GitHub Pages post-build smoke check

Added `npm run smoke:dist`.

After the Vite production build, the GitHub Pages workflow now verifies that:

- `dist/index.html` exists;
- the output no longer references `/src/main.tsx`;
- a compiled `/assets/...` module entry exists on disk;
- service worker, manifest, content/search manifests, immersive manifest, artwork manifest, and terrain registry are present.

The workflow runs:

```text
npm run build && npm run smoke:dist
```

before uploading `dist/` to Pages. This protects the deployment model that fixed the earlier blank-page issue.

## Service-worker freshness

- Runtime cache version advanced to `v2-alpha15-runtime`.
- The new cinematic artwork manifest is network-first/version-sensitive.
- PMTiles Range requests continue to bypass the service worker.

## Mobile cinematic defaults

Animated reconstruction quality now starts conservatively:

- <= 480 px viewport -> Low
- <= 860 px viewport -> Medium
- larger viewport -> High

Users can still change quality manually. Reduced-motion behavior remains authoritative.

## Deployment branch

`BIBLE-WORLD-V4` remains the active working deployment branch alongside `main`.

## Evidence boundaries retained

No alpha.15 resilience/performance feature changes the evidence model. In particular, Yam Suph still has no exact crossing site model and cinematic imagery remains artistic reconstruction.

## Verification

`npm run check` includes `audit:v2-alpha15`, protecting the startup fallback, error boundary, mobile quality defaults, service-worker versioning, `BIBLE-WORLD-V4` branch trigger, and Pages dist smoke check.

The current local environment still lacks project `node_modules`, so dependency-backed Vitest and final Vite compilation cannot complete here. GitHub Actions remains the authoritative full build/test environment.
