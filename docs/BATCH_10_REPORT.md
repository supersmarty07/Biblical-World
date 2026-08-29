# Batch 10 Execution Report

## Release

**The Biblical World 1.0.0 — Genesis → Revelation**

## Added in Batch 10

- 17 Revelation geographic/symbolic place records
- 5 people
- 20 events
- 1 explicitly schematic seven-church literary sequence
- 7 guided stories
- 14 source records
- 3 context regions
- 10 visionary-scene records
- animated visionary overlay system
- final Genesis → Revelation guided story

## Whole-atlas totals

- 405 places
- 246 people
- 265 events
- 69 journey/sequence datasets
- 90 guided stories
- 77 context regions
- 166 source records
- 10 visionary scenes
- 9 runtime content packs

## Key corrections / protections

Batch 10’s audit requires:

- no Earth coordinates for visionary New Jerusalem, Babylon the Great, Gog/Magog, Abyss, lake of fire, or river/tree-of-life vision;
- Patmos cave marked traditional;
- Pergamum Great Altar correlation kept low-confidence;
- Har-Magedon not equated automatically with Tell Megiddo;
- Revelation composition dating explicitly marked debated;
- Revelation not claimed to name Domitian;
- John of Patmos modeled separately from John son of Zebedee;
- no invented route to/from Patmos;
- seven-church connector described as textual order, not recovered itinerary;
- Laodicea water metaphor kept as contextual proposal;
- New Jerusalem stadion conversion marked approximate.

## Validation completed

The nine-pack validator and Batch 4–10 editorial audits pass. Static hosting checks pass. JSON/GeoJSON and source-reference graph checks pass.

The final Vite build requires npm dependencies. In the current environment these external project packages are not installed; the GitHub Actions workflow installs them before running the same `npm run build` pipeline.

## Remaining scholarly-release work

Before marketing the project as an academic critical edition:

1. live-verify current official dataset/license versions;
2. add page/section-level citations to more modern scholarship;
3. replace broad hand-authored regional polygons with vetted scholarly GIS where legally available;
4. ingest verified Pleiades IDs/coordinates systematically rather than selectively;
5. add a redistribution-cleared full Bible text bundle;
6. add object-level rights metadata for any museum/site photography;
7. commission/review paleoenvironmental layers with domain specialists.

The architecture is ready for all of these additions without a backend.

## Final build attempt

`npm run build` was executed after the complete Batch 10 audit suite. It successfully completed:

- nine-pack data validation;
- Batch 4–10 historical/editorial audits;
- static-repository checks.

It then stopped in `build:search` because the local environment does not contain the declared `minisearch` package. This is the same dependency-availability limitation documented in prior batches. The checked-in GitHub Actions workflow runs `npm install` before `npm run build`, so the dependency is expected to resolve in the deployment environment.

Independent local syntax QA additionally transpiled all 26 TypeScript/TSX source files with TypeScript 5.8.3 and reported zero syntax errors; every `.mjs` script also passes `node --check`.
