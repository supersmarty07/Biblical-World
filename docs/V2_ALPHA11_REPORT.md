# V2 alpha.11 — release and deployment hardening

Version: `2.0.0-alpha.11`

## Implemented

- Registry-driven Sources/Data attribution drawer.
- Keyboard Escape close, focus trapping, and focus restoration for the attribution dialog.
- Runtime external-asset health model for terrain, basemap, and Roman roads.
- Browser deployment diagnostics with bounded timeouts.
- PMTiles HTTPS/CORS/byte-range probe (`Range: bytes=0-0`).
- Roman-road origin probe with HEAD and bounded range fallback.
- MapLibre source-success/source-error reporting.
- Graceful fallback from failed terrain to the flat atlas.
- Graceful fallback from failed external basemap to bundled Natural Earth.
- Graceful hiding/retry of failed Roman-road context.
- Successful diagnostics can reinitialize MapLibre sources without a page reload.
- External basemap fails closed unless an explicit attribution string is configured.
- Runtime Roman-road source attribution is constrained to known verification resource IDs.
- GitHub Pages deployment accepts optional terrain/basemap/roads repository Variables while retaining repository base-path handling.
- Service-worker PMTiles Range bypass remains intact.
- New alpha.11 CI regression audit.

## Historical/evidence impact

None of these changes alter place confidence, coordinate roles, journey certainty, source conclusions, or visionary-geography rules. External assets remain presentation/context layers and cannot upgrade historical certainty.

## Verification actually executed

- `npm run check` — PASS after alpha.11 implementation.
- `npm test` — could not start because `vitest` is not installed (`node_modules` absent).
- `npm run build` — prebuild validation/catalog/search generation passes, then TypeScript stops because `vite/client` and Node typings are unavailable without dependencies.
- Syntax-only TypeScript transpilation — PASS across the complete `src` TS/TSX tree.

The production Vite bundle is therefore not claimed as passing in this environment.

## Remaining release work

The code is prepared for external production assets, but real terrain/roads/paleogeography/image bytes still need to be supplied/configured. The deployment diagnostics are specifically intended to validate those origins after they exist.
