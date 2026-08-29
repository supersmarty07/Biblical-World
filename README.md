# The Biblical World

> **V2 release/deployment hardening / 2.0.0-alpha.11:** adds registry-driven attribution, browser CORS/Range diagnostics, graceful MapLibre external-asset fallbacks/retry, attribution-safe external basemap configuration, source-aware Roman-road credits, and GitHub Pages repository-variable wiring. The alpha.10 license-gated asset pipeline remains intact. See `docs/V2_DEPLOYMENT.md`, `docs/V2_ALPHA11_REPORT.md`, `docs/V2_ASSET_PIPELINE.md`, and `docs/V2_ARCHITECTURE.md`.

> **v1.1.1 hotfix history:** fixed two `null` optional `personId` values that could stop runtime atlas loading. See `docs/HOTFIX_1_1_1.md`.

**An evidence-aware interactive historical atlas from Genesis to Revelation.**

V2 currently builds on the **v1.1.1 hotfix / Batch 11 hardened atlas**. The completed Genesis → Revelation content arc remains intact while immersive scene infrastructure is added alongside it. The app remains frontend-only and deployable to GitHub Pages.

## Current atlas scope

- **405** geographic records
- **246** people
- **265** events
- **69** journey / literary-sequence datasets
- **90** guided stories
- **77** time-aware historical-context regions
- **166** provenance/source records
- **10** Revelation visionary scenes
- **9** static content packs

Content packs:

```text
public/data/genesis/
public/data/exodus-judges/
public/data/united-monarchy/
public/data/divided-kingdom/
public/data/exile-restoration/
public/data/second-temple/
public/data/gospels/
public/data/acts-paul/
public/data/revelation/
```

## What Batch 11 changes

### Dependency-free search

The atlas no longer depends on MiniSearch. Search is now a small deterministic in-project engine with:

- exact-name weighting
- prefix matching
- aliases
- Scripture-reference matching
- historical-date matching
- bounded typo tolerance
- stable alphabetical tie-breaking
- direct journey results
- direct immersive-scene results

The build still exports `public/data/generated/search-documents.json` as a static QA/export corpus. V2 Batch 8 expands it to **1,095 documents**, including all 69 journeys and 20 immersive scenes. The running app builds the search structure from resident atlas data plus the lightweight immersive catalog, avoiding a duplicate search-corpus fetch.

### Follow the Journey

V2 Batch 8 exposes all 69 existing route/literary-sequence datasets through a dedicated journey explorer. Abraham, Exodus, Jesus, and Paul receive featured entry groups, while every other journey remains browsable and searchable. Segment-level route certainty, Scripture/source basis, map animation, related story chapters, and linked immersive landscapes remain connected to the original journey records rather than a duplicated route model.

### Generated content catalog

`npm run build:catalog` creates:

```text
public/data/generated/content-manifest.json
```

The runtime reads this manifest to discover content packs, with a hardcoded fallback list for development/recovery. Future content additions no longer require editing the normal loader path in multiple places.

### Provenance health reporting

`npm run audit:provenance` generates:

```text
public/data/generated/provenance-report.json
docs/SOURCE_VERIFICATION_QUEUE.md
```

The report deliberately distinguishes **project-authored methodology** from external source records that still require live verification. It does not pretend bibliography metadata equals source verification.

Current structural report:

- 166 source records
- 10 project-authored records
- 156 external records queued for live verification

This queue is a release-management tool, not a criticism of the historical guardrails already encoded in the atlas.

### Accessibility hardening

Batch 11 adds:

- skip navigation
- clearer landmark semantics
- live loading/error announcements
- search-dialog focus trapping
- focus restoration after closing search
- visible keyboard focus styling
- hidden explanatory text making clear the map is supplementary, not the only navigation method
- reduced-motion handling for camera movement and animated biblical journeys
- hidden/inert information panels when closed

All content remains reachable through search, stories, and information panels without requiring precise pointer interaction with the map.

### Offline/static resilience

The app now includes:

```text
public/manifest.webmanifest
public/sw.js
public/icons/atlas-mark.svg
```

The service worker caches same-origin app/data assets after they are requested. **HTTP Range requests bypass the service worker**, preserving compatibility with optional PMTiles assets.

The service worker is intentionally conservative: it does not attempt to pre-cache the entire atlas or cache cross-origin PMTiles automatically.

### V2 production asset pipeline

Alpha.10 adds `public/data/assets/manifest.json` and `src/generated/installedAssets.json`. Research readiness, licensing readiness, and actual installed bytes are tracked separately. Roman-road GeoJSON is fetched only after the user enables that layer; large Copernicus-derived terrain remains external and Range-friendly. See `docs/V2_ASSET_PIPELINE.md`.

### CI hardening

GitHub Actions now has:

- main-branch GitHub Pages deployment
- unit tests before deployment
- pull-request quality workflow
- all historical audits
- provenance audit
- Batch 11 regression audit
- static-file checks
- production build

## Evidence model

Geographic identification:

```text
established
probable
possible
traditional
disputed
unknown
symbolic
```

Historical interpretation is separate:

```text
high
moderate
low
traditional
symbolic
```

Coordinates carry a role:

```text
identified-site
approximate-area
candidate-site
traditional-site
display-anchor
```

A place may intentionally remain unpinned. Visionary material in Revelation uses a separate non-terrestrial visualization system rather than fake Earth coordinates.

## Static architecture

```text
GitHub Pages
  ├─ Vite + React + TypeScript
  ├─ MapLibre GL JS
  ├─ static JSON / GeoJSON packs
  ├─ dependency-free browser search
  ├─ PWA/runtime cache
  └─ optional PMTiles URLs

Large optional assets
  └─ Cloudflare R2 / S3 / other Range-capable object storage
```

No application server, database, authentication service, or runtime API is required.

## Local development

```bash
npm install
npm run dev
```

Quality checks without building:

```bash
npm run check
```

Generated static artifacts:

```bash
npm run build:catalog
npm run build:search
```

Full production build:

```bash
npm run build
```

`prebuild` runs data validation, the Batch 4–10 historical audits, provenance audit, Batch 11 hardening audit, static-hosting checks, content-manifest generation, and search-corpus generation before TypeScript/Vite compilation.

## GitHub Pages deployment

1. Create a GitHub repository.
2. Copy this project into it.
3. Push to `main`.
4. In **Settings → Pages**, choose **GitHub Actions**.
5. The included deployment workflow installs dependencies, runs tests and all audits, builds, and deploys `dist/`.

The workflow supplies the repository-name Vite base path automatically.

## Optional PMTiles

Copy `.env.example` to `.env` and set full HTTPS URLs:

```bash
VITE_BASEMAP_PMTILES_URL=https://example.com/basemap.pmtiles
VITE_TERRAIN_PMTILES_URL=https://example.com/terrain.pmtiles
```

Large PMTiles files should normally live on Range-capable object storage rather than in the Git repository.

## Important scholarly-release status

The atlas has strong **internal uncertainty and historical-guardrail modeling**, but it has **not received the final live-source verification pass** required for an academic critical edition. Web access was unavailable during implementation of the later batches.

Before publishing as a scholarly/reference release, work through:

[docs/SOURCE_VERIFICATION_QUEUE.md](docs/SOURCE_VERIFICATION_QUEUE.md)

That pass should add stable URLs/DOIs/ISBNs/pages, exact licenses where relevant, checked dates, and confirmation that each cited source supports the specific claim made by the atlas.

The repository currently stores Scripture references and summaries; it does **not** yet bundle a complete Bible translation. Full-text BSB/WEB ingestion should follow official-source license verification.

## Documentation

- `docs/DATA_MODEL.md`
- `docs/BATCH_11_PRODUCTION_HARDENING.md`
- `docs/BATCH_11_REPORT.md`
- `docs/SOURCE_VERIFICATION_QUEUE.md`
- `docs/RELEASE_CHECKLIST.md`
- `ATTRIBUTION.md`
- `DATA_LICENSES.md`
- `CONTRIBUTING.md`

## Licensing

Application code: MIT unless a file says otherwise.

Original curated historical data, confidence metadata, reconstructed routes/context polygons, and project-authored SVG/CSS visualizations are intended for a CC BY 4.0 data/artwork approach. Third-party source material remains under its original license and is not automatically redistributed merely because it is cited. See `DATA_LICENSES.md` and each content pack's `licenses.json`.
