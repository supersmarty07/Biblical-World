# Batch 4 Execution Report

## Completed

### Architecture

- Added a third static content pack: `public/data/united-monarchy/`.
- Runtime loader now merges Genesis + Exodus–Judges + United Monarchy.
- Build-time validator and search-index generator now load all three packs.
- Package version advanced to `0.4.0`.
- Added `npm run audit:batch4` and made it part of `prebuild`.

### UI

- Updated application identity to **Genesis → United Monarchy · Batch 4**.
- Added Ruth, Samuel, Saul, David, Absalom, and Solomon artistic character styling.
- Added Ruth, monarchy, Jerusalem, and Solomon inline SVG story scenes.
- Expanded context-region palette for Phoenician, Aramean, frontier, Jerusalem, and South Arabian contexts.
- Updated timeline language for the Iron I → Iron II / early monarchy transition.
- Added a dedicated Jerusalem/Zion guided story with close camera views.

### Data

Validated totals:

| Pack | Places | People | Events | Journeys | Stories | Sources | Context regions |
|---|---:|---:|---:|---:|---:|---:|---:|
| Genesis | 34 | 15 | 12 | 6 | 5 | 7 | 4 |
| Exodus–Judges | 75 | 23 | 27 | 11 | 12 | 10 | 10 |
| United Monarchy | 47 | 20 | 26 | 10 | 10 | 6 | 7 |
| **Total** | **156** | **58** | **65** | **27** | **27** | **23** | **21** |

## Batch 4 editorial audit

`scripts/audit-batch4.mjs` adds release-specific assertions beyond generic schema validation.

It verifies:

- Ruth, 1 Samuel, 2 Samuel, 1 Kings, 1 Chronicles, and 2 Chronicles all have explicit coverage;
- Zion remains unpinned;
- the First Temple exact site remains unpinned;
- Araunah/Ornan’s threshing floor remains unpinned;
- Ophir, Ziklag, Nob, and the Forest of Ephraim remain unpinned;
- the physical Temple Mount remains a mapped established place separate from First Temple footprint claims;
- the Hazor/Megiddo/Gezer royal-building event remains explicitly debated rather than high-confidence archaeological attribution;
- every Batch 4 journey segment contains an uncertainty/reconstruction note;
- every guided story contains Scripture references;
- every Batch 4 context polygon contains a generalization/boundary warning.

## Validation commands passed

```text
node scripts/validate-data.mjs
node scripts/audit-batch4.mjs
node scripts/check-static.mjs
node --check scripts/validate-data.mjs
node --check scripts/build-search-index.mjs
TypeScript/TSX syntax transpilation with the installed TypeScript compiler
```

The generic validator additionally checks:

- globally unique IDs across all content packs;
- source references;
- person/place/event/story cross-links;
- coordinate ranges;
- journey endpoint proximity to mapped anchors;
- story-camera proximity to mapped places;
- route-certainty enums;
- character enums;
- confidence enums;
- Scripture-reference structure;
- context-region temporal ranges and polygon geometry;
- absence of production `demo` flags;
- license-manifest schema.

## Build limitation

The repository does not contain `node_modules`, and external package installation is unavailable in this execution environment. The final Vite/React dependency-resolving production bundle therefore cannot be executed locally here.

GitHub Actions installs dependencies and runs the authoritative `npm run build`, including Batch 4’s editorial audit.

## Editorial caution

Passing automated validation does not mean every historical claim is peer reviewed. The most sensitive Batch 4 subjects—10th-century chronology, scale of the early monarchy, Jerusalem’s urban extent, Zion terminology, First Temple archaeology, and specific royal attributions—are deliberately represented as layered claims rather than single certainties.
