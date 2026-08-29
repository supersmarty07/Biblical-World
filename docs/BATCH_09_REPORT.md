# Batch 9 Execution & QA Report

## Release

Version: `0.9.0`

Content pack: `public/data/acts-paul/`

Scope: Acts 1–28, Paul, selected Pauline recipient geography, and first-century Roman provincial context through the early 60s CE.

## Added content

Batch 9 adds:

- 73 places / regions / candidate sites;
- 45 people;
- 40 events;
- 8 animated journeys;
- 13 guided stories;
- 30 source/provenance records;
- 12 context regions.

Atlas totals after integration:

- 388 places;
- 241 people;
- 245 events;
- 68 journeys;
- 83 guided stories;
- 152 source records;
- 74 context regions.

## Platform changes

- added `acts-paul` as the eighth production content pack;
- extended timeline maximum from 40 CE to 70 CE;
- added Acts/Paul timeline labels;
- added Paul/Acts character IDs and visual accents;
- added `acts`, `mission`, and `voyage` story-art themes;
- updated map branding to Batch 9 / Genesis → Acts & Paul;
- added Batch 9 to runtime loading, validation, and search-index generation;
- added `audit:batch9` to the prebuild chain;
- extended long-lived Antioch-on-the-Orontes and Seleucia-Pieria records into the Roman/Acts period.

## Corrections caught during implementation

### Duplicate James son of Zebedee

The first Batch 9 draft created a second `james-zebedee` person record. The cross-pack validator caught the duplicate. The new record was removed and Acts 12 now reuses the Gospel-pack person ID.

### Corinth bema confidence vocabulary

An early bema record accidentally used a geographic confidence token in the historical-interpretation field. Validation caught the mismatch and it was corrected to the proper interpretation vocabulary.

### Philip in Samaria

The first draft risked highlighting Samaria/Sebaste city for Acts 8. The final event uses the broad Samaria-region record instead and explicitly avoids forcing the episode into Sebaste.

### Paul's “Arabia”

An early visualization used Petra as a possible Nabataean context endpoint. That route was removed because it could visually imply that Paul named Petra as his destination. `arabia-galatians` remains unpinned and has no animated journey.

### Missionary-journey route completeness

A route audit found that the first journey had been visually over-compressed on the return, the second journey stopped prematurely at Ephesus, and the third journey skipped the Macedonia/Greece circuit. The release now preserves the first-journey return sequence to Antioch, carries the second journey through Cenchreae/Ephesus/Caesarea back to Antioch, and uses broad regional anchors for the third journey where Acts names Macedonia/Greece without enumerating every city.

### Reused Rhodes and Ptolemais

The initial Batch 9 pack created Acts-specific Rhodes and Ptolemais records even though the same ancient places already existed in Batch 7. Those duplicates were removed. The shared global records were extended into the Acts period and now carry Acts references.

## Historical guardrails

The release preserves:

- Beautiful Gate, Akeldama, Stephen's stoning site, Judas's Damascus house, Derbe, Philippi prayer place/prison, Hall of Tyrannus, Phoenix, exact Malta wreck site, Three Taverns, Paul's Roman lodging, and Pauline Arabia as unpinned;
- Derbe vs. Kerti Höyük candidate separation;
- Acts 15 vs. Galatians 2 correlation as debated;
- Gallio inscription as a chronology anchor that does not mention Paul;
- c. 51–52 CE Gallio chronology;
- 44 CE Agrippa I death with Acts and Josephus kept as separate accounts;
- Claudian famine and expulsion chronology as approximate;
- Festus accession/hearing chronology as c. 59–60, not one false exact year;
- Malta as a probable island-level Melite identification, with exact wreck bay unknown;
- Areopagus physical hill vs. council/venue ambiguity;
- Acts ending with Roman house arrest rather than a project-invented death event;
- Pauline recipient geography separate from disputed composition/authorship questions.

## Validation

Release QA runs:

- `node scripts/validate-data.mjs`;
- Batch 4–9 editorial/regression audits;
- `node scripts/check-static.mjs`;
- JSON / GeoJSON parsing;
- Node script syntax checks;
- TypeScript / TSX syntax checks where the compiler runtime is available;
- ZIP integrity verification.

## Final QA result

The complete repository-wide validation pass succeeded for all eight content packs. Batch 4–9 editorial audits passed, 66 JSON/GeoJSON public files parsed successfully, all Node `.mjs` scripts passed `node --check`, and TypeScript/TSX syntax transpilation passed across 25 source files.

## Build-environment limitation

A complete `npm run build` was attempted. Its prebuild chain successfully completed data validation, every Batch 4–9 editorial audit, and the static-repository guard. The run then stopped at `scripts/build-search-index.mjs` because this working environment does not have the declared `minisearch` npm package installed and cannot fetch external packages. No application/data validation failed. GitHub Actions runs `npm install` before the same validation/search/build pipeline, so dependency resolution occurs in the deployment environment.

## Research-verification limitation

Live web search is disabled in this environment. Before an academic-critical publication, recheck current source editions, Gallio-inscription catalog metadata, Josephus/Suetonius references, archaeological project metadata, exact modern-site coordinates, external IDs, official URLs, and licenses.
