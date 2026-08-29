# Atlas Data Model

The Biblical World uses static JSON/GeoJSON content packs with runtime Zod validation and build-time cross-reference / historical guardrail validation.

## Runtime content packs

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

Every pack contains:

```text
places.json
people.json
events.json
journeys.json
stories.json
context-regions.geojson
sources.json
licenses.json
```

The Revelation pack additionally contains `visionary-scenes.json`.

IDs are globally unique. Cross-pack references are allowed and validated. Later packs should reuse earlier places such as Jerusalem, Tyre, Gaza, Damascus, Jericho, Samaria, Babylon, Susa, Egypt, and the Temple Mount instead of cloning them.

## Confidence layers

Geographic identification:

```ts
type ConfidenceLevel =
  | 'established'
  | 'probable'
  | 'possible'
  | 'traditional'
  | 'disputed'
  | 'unknown'
  | 'symbolic';
```

Historical interpretation is separate:

```ts
type InterpretationConfidence =
  | 'high'
  | 'moderate'
  | 'low'
  | 'traditional'
  | 'symbolic';
```

A securely identified archaeological site can still have a disputed biblical/historical interpretation.

## Place

Places may intentionally have **no coordinates**.

```ts
interface PlaceRecord {
  id: string;
  name: string;
  aliases: string[];
  coordinates?: [longitude, latitude];
  coordinateRole?:
    | 'identified-site'
    | 'approximate-area'
    | 'candidate-site'
    | 'traditional-site'
    | 'display-anchor';
  locationNote?: string;
  summary: string;
  historicalContext?: string;
  archaeology?: string;
  validFrom?: number;
  validTo?: number;
  category: 'city' | 'region' | 'mountain' | 'site' | 'water' | 'other';
  confidence: {
    geographicIdentification: ConfidenceLevel;
    historicalInterpretation: InterpretationConfidence;
    explanation: string;
  };
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  sourceIds: string[];
  externalIds?: Record<string, string>;
  interpretations?: InterpretationRecord[];
}
```

### Coordinate semantics

A coordinate means only “there is geometry worth displaying.” Its epistemic meaning comes from `coordinateRole` and confidence.

Examples:

```text
Jerusalem                    identified-site
Jebel Musa                   traditional-site
Wadi Tumilat                 approximate-area
Beth-zechariah               candidate-site
Achaemenid Empire record     display-anchor
Mount Sinai                  no coordinate
Zion                         no single coordinate
Modein                       no coordinate
Jerusalem Acra               no coordinate
```

A display anchor is never a substitute for a border polygon.

## Scripture vs. other ancient textual witnesses

Batch 7 introduces a neutral textual-reference channel:

```ts
interface TextualReference {
  label: string;
  sourceId: string;
  kind:
    | 'deuterocanonical'
    | 'ancient-literary'
    | 'inscription'
    | 'documentary';
}
```

`scripture` remains the field used by the default Bible-text integration.

`textualReferences` lets the atlas cite, for example:

- 1 Maccabees 4:36–59;
- 2 Maccabees 10:1–8;
- Josephus, *Antiquities* 14;
- an inscription;
- a papyrus/archive;

without claiming those sources have the same canonical, literary, archaeological, or evidentiary status.

This also avoids forcing a denominational decision into the default BSB bundle: 1–2 Maccabees are explicitly typed as deuterocanonical textual witnesses in Batch 7.

## Person

People are first-class searchable records:

```ts
interface PersonRecord {
  id: string;
  name: string;
  aliases: string[];
  era: string;
  summary: string;
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  relatedPlaceIds: string[];
  sourceIds: string[];
  artisticNote?: string;
}
```

Animated character treatments are artistic silhouettes, never claimed portraits.

## Event

```ts
interface EventRecord {
  id: string;
  title: string;
  summary: string;
  confidence: InterpretationConfidence;
  placeIds: string[];
  personIds: string[];
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  sourceIds: string[];
  historicalNote?: string;
  dating?: EventDating;
}
```

Place certainty and event certainty are independent.

Examples:

```text
Mount Gerizim sanctuary        established archaeological place
Hasmonean destruction phase    archaeological interpretation
John Hyrcanus attribution      literary-historical correlation
```

## Structured historical dating

```ts
interface EventDating {
  from?: number;
  to?: number;
  label: string;
  basis:
    | 'historical'
    | 'conventional'
    | 'approximate'
    | 'textual';
  note?: string;
}
```

Rules:

- `historical` — strong chronological anchoring;
- `conventional` — a commonly accepted reconstruction/conversion;
- `approximate` — broad date window only;
- `textual` — sequence/date mainly belongs to the literary framework.

The presence of this field is **not permission to back-fill exact dates for Abraham, Moses, Joshua, or other earlier narratives**.

Batch 7 uses it to preserve distinctions such as:

```text
200 BCE     Panium
167 BCE     conventional opening of Maccabean revolt
164 BCE     temple rededication
63 BCE      Pompey captures Jerusalem
40 BCE      Rome recognizes Herod as king
37 BCE      Herod captures Jerusalem
31 BCE      Actium
20/19 BCE   conventional start of Herodian temple expansion
```

## Journey

```ts
type RouteCertainty =
  | 'known-sequence'
  | 'reconstructed'
  | 'unknown';
```

Every production segment must carry an epistemic note.

`known-sequence` means the textual/historical sources establish endpoint order. It never means the exact polyline is recovered.

Examples:

- Alexander: Macedonia → Levant → Egypt = historical campaign sequence; generalized polyline.
- Pompey: Syrian command zone → Judea/Jerusalem = historical sequence; route reconstructed.
- Herod: post-Actium travel to Rhodes = ancient literary report; maritime line schematic.
- Nabataean Petra → Negev → Gaza = historical trade-network visualization; not one preserved road.

## Story

```ts
interface StoryChapter {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  placeId?: string;
  journeyId?: string;
  scripture: ScriptureRef[];
  textualReferences?: TextualReference[];
  contextYear?: number;
  visionarySceneId?: string;
  camera?: {
    center: [number, number];
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
}
```

`contextYear` changes the timeline lens. It is not automatically a claim that the literary episode occurred in that exact year.

## Source registry

Batch 7 adds optional source typing:

```ts
type SourceKind =
  | 'canonical-text'
  | 'deuterocanonical-text'
  | 'ancient-literary'
  | 'inscription'
  | 'documentary'
  | 'archaeology'
  | 'modern-scholarship'
  | 'project-methodology';
```

A source record may include:

```text
id
title
author/editor
organization
year or dateLabel
URL
license / license URL
attribution
verification date
notes
kind
```

The UI displays the source kind when available.

Ancient literary texts, royal inscriptions, papyri, and archaeological publications are **source witnesses with different genres and evidentiary limits**. They are not interchangeable truth tables.

## Context regions

Context polygons are broad, time-aware historical lenses. No political/cultural polygon may imply modern surveyed borders.

Families now include earlier categories plus:

```text
macedonian
ptolemaic
seleucid
hasmonean
idumean
nabataean
roman
herodian
```

Rules:

- use `possible`/`probable`, never `established`, for broad political geometry;
- describe the polygon as generalized/broad in `note`;
- use multiple temporal snapshots instead of one permanent border when territory changes materially.

## Batch 7 guardrail examples

The following records intentionally remain unpinned:

```text
Issus battlefield
Modein
Adasa
Elasa
Jerusalem Acra
exact Hasmonean palace in Jerusalem
```

The following are mapped physical anchors:

```text
Alexandria
Antioch
Ptolemais/Akko
Mount Gerizim sanctuary
Maresha
Qumran
Petra
Masada
Herodium
Caesarea Maritima
```

Important separations:

```text
Alexander's conquest          historical
Alexander visits Jerusalem    later Josephus tradition, not promoted to established event

Qumran site                   established
scroll caves/manuscripts      established archaeological/documentary corpus
Qumran = Essenes              interpretation
all scrolls written by site   not assumed

Herod appointed king          40 BCE
Herod captures Jerusalem      37 BCE

Temple Mount platform         archaeological physical complex
Herodian sanctuary elevation  reconstructed model
```

## Validation

Generic validation:

```bash
npm run validate:data
```

Historical/editorial audits:

```bash
npm run audit:batch4
npm run audit:batch5
npm run audit:batch6
npm run audit:batch7
npm run audit:batch8
```

Batch 7’s audit specifically checks:

- required unpinned sites;
- key exact historical dates;
- Herod 40 vs. 37 BCE;
- Alexander/Jerusalem non-promotion;
- Septuagint tradition caveat;
- Qumran/Essenes uncertainty;
- Gerizim attribution separation;
- Idumean identity caveat;
- Onias IV at Leontopolis;
- source typing;
- deuterocanonical references outside the default Scripture field;
- Roman-dominated Judea vs. later direct province;
- generalized context polygons;
- route-vs-evidence notes;
- Herodian platform vs. sanctuary reconstruction.

## Licensing

Original project curation is intended for CC BY 4.0. Application code is MIT.

Source records do not transfer rights in an underlying book, photograph, scan, excavation figure, modern translation, database, or museum object image. Future external bytes must carry object/file-level license metadata and attribution.


## Batch 8 Gospel-geography pattern

Batch 8 formalizes a four-way separation that future New Testament packs should preserve:

```text
textual place/event
archaeologically mapped physical site
later religious/historical tradition
modern scholarly candidate/reconstruction
```

These may point to the same general landscape, but they are not interchangeable claims.

Examples:

```text
Cana of Galilee        textual place, unpinned
Khirbet Qana           possible candidate
Kafr Kanna             traditional identification

Bethsaida              textual place, unpinned
el-Araj                possible candidate
et-Tell                 possible candidate

Golgotha               textual location, unpinned
Holy Sepulchre         traditional / historically early candidate complex
Garden Tomb            later traditional candidate with archaeological objections
```

### Regional display anchors

A broad region may use a mapped `display-anchor`, but its `locationNote` must state that the point is not a surveyed center or boundary. Batch 8 uses this for `samaria-region-gospels` so John 4's regional geography is not confused with the city of Samaria/Sebaste.

### Supernatural/theological claims

The generic event confidence field describes confidence in the **mapped historical/narrative context**, not a scientific probability assigned to a miracle or theological claim. Events such as resurrection appearances therefore must not use `symbolic` merely as a proxy for skepticism or belief. Their notes should state the methodological boundary explicitly.

### Batch 8 audit

`scripts/audit-batch8.mjs` protects:

- required unpinned Gospel places;
- Cana and Bethsaida candidate separation;
- baptism landscape vs. exact-event distinction;
- Machaerus source distinction;
- Herod/Quirinius chronology;
- Pilate and Caiaphas dates;
- praetorium uncertainty;
- Golgotha/tomb/Emmaus uncertainty;
- separate Transfiguration and Matthew 28 mountains;
- resurrection-methodology neutrality;
- separate infancy itineraries;
- route epistemic notes;
- generalized first-century context polygons;
- Samaria region/city distinction;
- Gospel-period visibility of reused earlier records.

## Batch 9 Acts / Pauline itinerary pattern

Batch 9 extends the evidence model from Gospel micro-geography to long-distance narrative travel.

A journey line represents one of three things:

```text
known-sequence   named textual endpoints / sequence
reconstructed    historically plausible corridor between known endpoints
unknown          visualization where even the connecting corridor is substantially uncertain
```

Every Batch 9 segment must also include a human-readable `note` explaining that the polyline is schematic, generalized, reconstructed, candidate-based, or otherwise not a recovered GPS track.

### Textual city vs. modern candidate

Derbe demonstrates the required pattern:

```text
derbe-acts          textual city, disputed modern identification, unpinned
kerti-hoyuk-derbe   modern candidate, candidate-site coordinate role
```

A journey may use a candidate only if the segment note states that the candidate is a visualization hypothesis.

### Island-level vs. event-site geography

Malta uses:

```text
malta-acts             probable island-level Melite identification
paul-shipwreck-site    exact wreck location, unknown and unpinned
```

Do not convert a traditional bay into the textual event coordinate.

### Historical anchor vs. narrative proof

The Gallio inscription is typed as `inscription` and can anchor Gallio's proconsulship around 51–52 CE. It must not be described as an inscription about Paul.

### Cross-source chronology

Acts, Pauline letters, Josephus, Suetonius, inscriptions, and archaeology remain separate source records. Correlations such as Acts 15 / Galatians 2, Claudian famine notices, and Festus chronology should be explicit rather than silently harmonized.

### Batch 9 audit

`scripts/audit-batch9.mjs` protects unpinned sites, Derbe candidates, Pauline Arabia, Gallio chronology, Agrippa I chronology, Claudian/Festus caveats, Malta shipwreck uncertainty, Areopagus semantics, generalized region polygons, route epistemic notes, and the fact that Acts ends before Paul's death.


## Visionary scene

Batch 10 adds an explicit non-terrestrial visualization record:

```ts
interface VisionaryScene {
  id: string;
  title: string;
  subtitle: string;
  visualType:
    | 'throne'
    | 'cosmos'
    | 'dragon'
    | 'beasts'
    | 'babylon'
    | 'armageddon'
    | 'judgment'
    | 'new-jerusalem'
    | 'river-tree'
    | 'genesis-revelation';
  summary: string;
  scripture: ScriptureRef[];
  sourceIds: string[];
  metrics?: { label: string; value: string; note?: string }[];
}
```

A visionary scene is not a replacement for a `PlaceRecord`. It is used when the text intentionally moves beyond terrestrial geography. A story chapter can reference one through `visionarySceneId`.

Rules:

- visionary entities may remain searchable `PlaceRecord`s with no coordinates;
- `VisionaryOverlay` renders symbolic art instead of a MapLibre point;
- do not create Earth coordinates merely to make a vision visually convenient;
- historical referents (for example Rome as an interpretive referent for Babylon the Great) remain interpretations rather than coordinate substitutions;
- quantitative visionary descriptions may be visualized, but conversions must disclose uncertainty.
