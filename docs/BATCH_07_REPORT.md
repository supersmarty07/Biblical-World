# Batch 7 Execution & QA Report

## Release

**Version:** 0.7.0  
**Content pack:** `public/data/second-temple/`

## Added content

Batch 7 adds:

- 36 places/regions/sites
- 31 people
- 33 events
- 7 animated journeys
- 10 guided stories
- 10 time-aware context regions
- 27 source/provenance records

Atlas totals after Batch 7:

- 265 places
- 162 people
- 165 events
- 52 journeys
- 58 stories
- 52 context regions
- 94 source records

## Platform changes

### Sixth runtime content pack

The loader, validator, and search-index builder now merge:

```text
genesis
exodus-judges
united-monarchy
divided-kingdom
exile-restoration
second-temple
```

### Ancient textual references

New optional model:

```ts
interface TextualReference {
  label: string;
  sourceId: string;
  kind: 'deuterocanonical' | 'ancient-literary' | 'inscription' | 'documentary';
}
```

The UI can now display 1–2 Maccabees/Josephus/inscriptional references separately from canonical Scripture chips.

### Source typing

New optional source classification:

```text
canonical-text
deuterocanonical-text
ancient-literary
inscription
documentary
archaeology
modern-scholarship
project-methodology
```

### Search

The static search index now includes `textualReferences` labels when the dependency-resolving build runs.

### Timeline

The historical-context labels now extend through:

- Alexander / Successors
- Ptolemaic Judea
- Seleucid Judea
- Maccabean revolt
- Hasmonean state
- Roman intervention
- Herodian kingdom
- early Roman / New Testament threshold

Slider precision is now one year rather than ten years, allowing dates such as 167, 63, 40, 37, and 31 BCE to be selected directly.

### Map styling

New context-region families receive distinct restrained map colors:

- Macedonian
- Ptolemaic
- Seleucid
- Hasmonean
- Idumean
- Nabataean
- Roman
- Herodian

### UI wording

Non-biblical events are now labeled **Historical event** rather than automatically “Biblical event.”

Place panels use **historical & biblical geography**.

## Corrections made during QA

### Onias IV

The first content draft incorrectly attached the Leontopolis temple tradition to Onias III.

That was caught and corrected before release:

- Onias III remains the deposed Jerusalem high priest;
- Onias IV receives a separate record;
- the Leontopolis event references Onias IV;
- the Batch 7 audit prevents regression.

### Alexander/Jerusalem audit false positive

The first automated audit matched the name **Alexander Jannaeus** while testing for Alexander III’s later Jerusalem-visit tradition. The rule was narrowed to the actual `alexander-iii` person ID so it detects the historical problem without producing false positives.

### Journey epistemic notes

Three route notes were strengthened to say explicitly that the drawn line is not a recovered exact route:

- Gaza → Egypt in Alexander’s campaign;
- Antioch → Ptolemais in the Antiochus IV context;
- Joppa → Jerusalem in Herod’s return campaign.

## Historical guardrails implemented

The release audit enforces:

- Modein unpinned;
- Issus battlefield unpinned;
- Adasa unpinned;
- Elasa unpinned;
- Jerusalem Acra unpinned;
- exact Hasmonean palace unpinned;
- Maccabean Emmaus distinguished from New Testament Emmaus;
- 1–2 Maccabees typed as deuterocanonical textual sources;
- no 1–2 Maccabees references stored in the default BSB Scripture field;
- Alexander III not mapped to Jerusalem as an independently established event;
- Septuagint translation process separated from later idealized court narrative;
- Qumran/Essenes association remains an interpretation;
- John Hyrcanus / Gerizim destruction remains archaeological-historical correlation;
- Idumean incorporation retains source criticism;
- Leontopolis uses Onias IV;
- Roman-dominated Judea after 63 BCE is not mislabeled as the later direct province;
- 40 BCE Herod appointment and 37 BCE capture remain separate;
- political context polygons remain generalized;
- Herodian platform archaeology remains distinct from sanctuary reconstruction.

## Validation performed

Passed:

```text
node scripts/validate-data.mjs
node scripts/audit-batch4.mjs
node scripts/audit-batch5.mjs
node scripts/audit-batch6.mjs
node scripts/audit-batch7.mjs
node scripts/check-static.mjs
```

Results:

```text
6 content packs validated
265 places
162 people
165 events
52 journeys
58 stories
94 sources
48 public files checked
0 oversized static assets
```

All `.mjs` files also pass Node syntax checks.

All TypeScript/TSX source files pass syntax transpilation using the globally installed TypeScript compiler module.

## Build limitation

The container does not contain this repository’s `node_modules`, and external npm installation is unavailable in the working environment.

Therefore the complete dependency-resolving command:

```bash
npm run build
```

cannot be executed locally here because it requires React, MapLibre, Zod, MiniSearch, Vite, etc.

The GitHub Actions workflow runs `npm install` first and remains the authoritative full build/deploy path.

## Research limitation

Live web search is disabled in this environment. This release uses project-authored summaries based on established historical/archaeological scholarship and deliberately conservative uncertainty labels.

Before describing the public site as a peer-reviewed or critical academic atlas, independently verify current source editions, exact page/section references, current external database identifiers, licenses, and image/object rights.
