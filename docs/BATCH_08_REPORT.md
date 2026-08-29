# Batch 8 Execution & QA Report

## Release

Version: `0.8.0`

Content pack: `public/data/gospels/`

Scope: Matthew, Mark, Luke, John and their first-century historical/geographic context.

## Added content

Batch 8 adds:

- 50 places / regions / candidate sites;
- 34 people;
- 40 events;
- 8 journey datasets;
- 12 guided stories;
- 28 new provenance records;
- 10 context regions.

Atlas totals after integration:

- 315 places;
- 196 people;
- 205 events;
- 60 journeys;
- 70 guided stories;
- 122 source records;
- 62 context regions.

## Platform changes

- added `gospels` as the seventh production content pack;
- extended the historical context slider to 40 CE;
- added Gospel-era timeline labels;
- added Gospel character IDs and visual accents;
- added Gospel/Galilee/Passion story-art themes;
- updated map branding to Batch 8 / Genesis → Gospels;
- extended shared Paneas/Caesarea Philippi and Samaria records into the Gospel-period time window;
- added Batch 8 to data validation and search-index generation;
- added `audit:batch8` to the prebuild chain.

## Important corrections caught during QA

### Samaria region vs. Samaria city

An early story draft reused the ancient city of Samaria/Sebaste as the anchor for John 4's phrase "through Samaria." This could visually imply a visit to the city. The release now has a separate broad `samaria-region-gospels` display anchor.

### Matthew 28 mountain vs. Transfiguration mountain

An early draft reused `mount-transfiguration` for Matthew 28's unnamed Galilean mountain. This was corrected. `galilee-resurrection-mountain` is now a distinct, unpinned textual place.

### Resurrection event classification

An early draft used the generic confidence token `symbolic` for resurrection-appearance events. That would inadvertently encode a genre/theological conclusion. The events now use `moderate` narrative-geography confidence with explicit methodological notes that archaeology does not adjudicate the supernatural claim.

### Source deduplication

Two scholarly works already represented in the Second Temple pack were initially given new Gospel-pack source IDs. The duplicate source records were removed and the Gospel pack now reuses the existing global IDs.

## Historical guardrails

The release explicitly preserves:

- Cana uncertainty;
- Bethsaida uncertainty;
- Sychar uncertainty;
- Bethany-beyond-Jordan uncertainty;
- unnamed Transfiguration mountain;
- Machaerus as a Josephus-derived geographic connection;
- Herod/Quirinius chronology problem;
- Quirinius's historically attested 6 CE census;
- Pilate c. 26–36 CE;
- Caiaphas c. 18–36 CE;
- disputed Jerusalem praetorium;
- unpinned Golgotha and burial-place textual records;
- separate Holy Sepulchre and Garden Tomb traditions;
- unpinned Emmaus;
- distinct Matthew 28 and Transfiguration mountains;
- no recovered first-century Via Dolorosa route claim.

## Validation completed

The following were executed in the working repository:

- `node scripts/validate-data.mjs` — PASS;
- `node scripts/audit-batch8.mjs` — PASS during implementation;
- all cross-pack IDs and source references checked by the generic validator;
- mapped journey endpoints checked against place anchors by the generic validator;
- route uncertainty notes checked by Batch 8 audit;
- context-region uncertainty checked by Batch 8 audit.

Final release QA additionally runs the prior Batch 4–7 regression audits, repository/static-hosting checks, JSON/GeoJSON parsing, Node syntax checks, TypeScript/TSX syntax transpilation where the local compiler runtime permits, and ZIP integrity verification.

## Build-environment limitation

A full `npm run build` was attempted in the release environment. Every data validator, Batch 4–8 regression/editorial audit, and static-file check completed successfully. The build then stopped at `scripts/build-search-index.mjs` because the local environment does not contain the `minisearch` npm package and external dependency installation is unavailable here.

Independent TypeScript/TSX syntax transpilation succeeded across all 25 source files, and all 56 JSON/GeoJSON data files parsed successfully. The GitHub Actions workflow runs `npm install` before `npm run build`, so the hosted CI path will install `minisearch` and the rest of the declared dependency tree before executing the same prebuild chain and Vite compilation.

## Research-verification limitation

Live web search is disabled in this environment. Batch 8 uses conservative project-authored summaries and provenance metadata based on established historical/geographic scholarship, but a future academically critical release must recheck current source editions, exact page/section citations, official archaeological project metadata, licenses, URLs, and external identifiers against primary/official sources.
