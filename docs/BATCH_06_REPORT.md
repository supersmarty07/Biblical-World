# Batch 6 Execution & QA Report

## Release

**Version:** 0.6.0  
**Content pack:** `public/data/exile-restoration/`  
**Scope:** late Judah → Babylonian exile → Achaemenid Persia → restoration / Esther / Ezra / Nehemiah / Malachi

## Delivered content

Batch 6 contains:

- 40 places/regions/sites;
- 43 people;
- 39 events;
- 9 journeys;
- 11 guided stories;
- 27 sources;
- 11 context regions;
- 3 machine-readable license records.

Atlas totals after integration:

- 229 places;
- 131 people;
- 132 events;
- 45 journeys;
- 48 stories;
- 67 sources;
- 42 context regions.

## Platform changes

- runtime loader now merges five production content packs;
- static search generator indexes all five packs;
- validator recognizes Batch 6 character silhouettes;
- app metadata/search hints/map badge updated to Batch 6;
- timeline labels now distinguish final Judah, Neo-Babylonian exile, early Persian restoration, and fifth-century Persian Yehud;
- new story-art themes added for exile, Babylon, Persia, and restoration;
- character artwork supports Josiah, Jeremiah, Zedekiah, Nebuchadnezzar II, Ezekiel, Daniel, Cyrus II, Zerubbabel, Darius I, Esther, Ezra, and Nehemiah;
- new `audit:batch6` is part of the production prebuild.

## Validation completed

### Cross-pack data validator

Passed across all five content packs.

Validated:

- global unique IDs;
- source references;
- person/place/event cross-links;
- Scripture-reference structure;
- coordinates and coordinate roles;
- confidence enums;
- event dating metadata;
- journey segment endpoints;
- route coordinates;
- story references;
- story camera sanity;
- context-region geometry and time windows;
- machine-readable license manifests.

### Historical editorial audits

Passed:

- Batch 4 audit;
- Batch 5 audit;
- Batch 6 audit.

Batch 6 audit specifically enforces:

- late-prophetic canonical coverage;
- unpinned uncertain locations;
- 612/609/605/597/539/407 historical anchors;
- 587/586 BCE destruction range;
- Cyrus Cylinder limitation;
- Darius-the-Mede uncertainty;
- Kebar/Khabur distinction;
- Esther historical-setting distinction;
- Ezra chronology debate;
- Al-Yahudu unknown site;
- Daniel literary-setting distinction;
- Elephantine/Sanballat chronology wording;
- no Persian-Yehud anachronism in Gedaliah’s administration;
- generalized empire/province polygons;
- journey uncertainty notes;
- primary-source registry presence.

### Repository/static-host checks

Passed.

No public asset violates the repository’s static-file size guard.

### Syntax checks

- all Node `.mjs` scripts passed `node --check`;
- TypeScript/TSX syntax transpilation passed across **26 files** using the locally installed global TypeScript compiler module.

## Full Vite build limitation

`node_modules` is not present and the required npm packages are not available in the local npm cache. Network package installation is unavailable in this execution environment, so a dependency-resolving `tsc -b && vite build` was not run locally.

GitHub Actions remains the authoritative full build path:

1. `npm install`;
2. prebuild data validation;
3. Batch 4–6 editorial audits;
4. static-repository validation;
5. static search-index generation;
6. TypeScript compile;
7. Vite build;
8. GitHub Pages deploy.

## Editorial corrections made during Batch 6

The implementation caught and corrected several issues before release:

1. **Gedaliah anachronism:** his post-586 administration was initially cross-linked to Persian `yehud-province`; that link was removed.
2. **Elephantine/Sanballat:** the 407 BCE petition was initially linked directly to the Nehemiah Sanballat entity; direct participation was removed because the document references Sanballat’s sons.
3. **Canonical gap:** initial scope began with Josiah, which would have skipped Manasseh/Amon and late prophetic books; the release was expanded to include them.
4. **Route overview camera validation:** story overview chapters that centered long journeys were decoupled from distant place IDs so map-camera semantics remain consistent.
5. **Cross-chapter Cyrus reference:** Isaiah 44:28–45:1 was split into structurally valid chapter-specific references.

## Release status

Batch 6 is ready for GitHub publication as the next project baseline.

It remains an evidence-aware scholarly-oriented atlas, not a peer-reviewed critical historical GIS edition. Page-level bibliographic verification and current official-source metadata remain future editorial tasks.
