# Batch 7 — Second Temple / Hellenistic / Hasmonean / Herodian Transition

## Goal

Bridge the Persian-restoration world of Batch 6 to the historical environment of the Gospels without treating the roughly three centuries between them as an empty gap.

The pack covers:

```text
Later Persian context
→ Alexander III
→ Ptolemaic Judea / Alexandria
→ Seleucid takeover
→ Antiochus IV / Jerusalem crisis
→ Maccabean revolt
→ Hasmonean state
→ Second Temple Jewish/Samaritan diversity
→ Nabataea / Idumea
→ Pompey and Roman intervention
→ Herod the Great / immediate Gospel-era infrastructure
```

## Core research principles

### 1. No canon flattening

The default Bible-text plan is not changed to a different canon in Batch 7.

1–2 Maccabees are historically indispensable for this era but are stored through structured `textualReferences` with `deuterocanonical` source typing. This permits Catholic/Orthodox/deuterocanonical material to be cited accurately without silently pretending it belongs to the project’s default BSB text bundle.

### 2. Ancient literature is not archaeology

Josephus, 1–2 Maccabees, Arrian, Polybius, Diodorus, Strabo, Appian and Plutarch are tagged as ancient textual witnesses.

Where archaeological or inscriptional evidence exists, it is sourced independently.

### 3. No fake coordinates

The following are deliberately unpinned:

- exact Issus battlefield;
- Modein;
- Adasa;
- Elasa;
- Jerusalem Acra;
- exact Hasmonean palace in Jerusalem.

### 4. No permanent ancient borders

Ptolemaic, Seleucid, Hasmonean, Roman and Herodian context polygons are generalized time lenses. None receives `established` geometric confidence.

### 5. Immediate Gospel background without preempting Batch 8

Batch 7 introduces Herod, Augustus, Caesarea, Herodium, Masada, Jericho’s palace complex, Sebaste and Herodian Temple expansion, but it does not yet build Jesus’ ministry geography or settle New Testament site debates.

## New static content pack

```text
public/data/second-temple/
  places.json
  people.json
  events.json
  journeys.json
  stories.json
  context-regions.geojson
  sources.json
  licenses.json
```

## Geographic coverage

### Macedonian / Hellenistic

- Pella
- Granicus region
- Issus battle region (unpinned)
- Alexandria
- Antioch on the Orontes
- Seleucia Pieria
- Ptolemais/Akko
- Panium/Paneas

### Maccabean / Hasmonean

- Modein (unpinned)
- Emmaus-Nicopolis
- Beth-horon
- Beth-zur
- Beth-zechariah
- Adasa (unpinned)
- Elasa (unpinned)
- Jerusalem Acra (unpinned)
- Mount Gerizim sanctuary
- Idumea
- Maresha/Marisa
- Adora
- Jamnia/Yavneh
- Dor

### Second Temple diversity

- Qumran
- Leontopolis/Oniad temple candidate region
- Alexandria
- Mount Gerizim
- Jerusalem Temple Mount

### Nabataean / Roman / Herodian

- Petra
- Avdat/Oboda
- Rome
- Actium region
- Rhodes
- Caesarea Maritima
- Masada
- Herodium
- Jericho palace complex
- Samaria/Sebaste
- Alexandrium

## Key chronology

```text
332 BCE     Alexander takes Tyre and Gaza
331 BCE     Alexandria foundation (conventional)
301–200     sustained Ptolemaic Judean context
200 BCE     Battle of Panium
175 BCE     Antiochus IV begins reign
169–167     Jerusalem crisis sequence
167 BCE     revolt begins (conventional)
165 BCE     Emmaus (conventional)
164 BCE     temple rededication
162 BCE     Beth-zechariah
161 BCE     Nicanor / Adasa
160 BCE     Judas dies at Elasa
152 BCE     Jonathan becomes high priest
142–141     effective Judean independence / Acra transition
c.125       Idumea incorporated under John Hyrcanus
c.111/110   Gerizim destruction correlation
104/103     Aristobulus I kingship
103–76      Alexander Jannaeus
76–67       Salome Alexandra
67–63       Hasmonean civil war
63 BCE      Pompey captures Jerusalem
40 BCE      Roman Senate recognizes Herod as king
37 BCE      Herod captures Jerusalem
31 BCE      Actium
30 BCE      Herod/Octavian meeting on Rhodes (Josephus)
20/19 BCE   Herodian Temple expansion begins (conventional)
c.10–9      Caesarea dedication/completion phase
```

## Important historical separations

### Alexander and Jerusalem

The conquests of Tyre/Gaza/Egypt are historical.

Josephus’s much later story of Alexander visiting Jerusalem is **not promoted into the event table as established history**.

### Septuagint

The existence of a Greek Torah translation in Hellenistic Egypt is historical.

The Letter-of-Aristeas-style royal translation scene is not treated as a literal one-day court transcript.

### Heliodorus

The Seleucid administrative inscriptional tradition provides independent evidence for temple oversight.

It does not verify every narrative detail of 2 Maccabees 3.

### Acra

The fortress/garrison is historically central but its exact footprint is disputed. No fixed geometry is drawn.

### Mount Gerizim

The sanctuary precinct is archaeologically established.

Its destruction is historically associated with John Hyrcanus, but archaeological correlation and ruler attribution remain distinct layers.

### Qumran

Established:

- archaeological settlement;
- nearby manuscript caves;
- Dead Sea Scrolls corpus.

Not automatically established:

- one specific sectarian identity for the entire settlement history;
- authorship of all scrolls by settlement residents;
- a one-to-one equation of Qumran with every description of Essenes.

### Leontopolis

The Oniad temple tradition is modeled through **Onias IV**. Onias III remains a separate earlier high-priestly figure.

The Egyptian site is a candidate-area record, not a recovered temple footprint.

### Herod

Two dates are mandatory:

```text
40 BCE  Roman appointment
37 BCE  capture of Jerusalem / effective rule
```

They must never be merged.

## Guided stories

1. Alexander & the Hellenistic Turn
2. Ptolemaic Judea & Alexandria
3. From Ptolemy to Seleucus
4. Antiochus IV & the Jerusalem Crisis
5. The Maccabean Revolt
6. From Revolt to Hasmonean State
7. Second Temple Judaism Beyond One Map
8. Nabataea, Idumea & the Southern Corridors
9. Rome Enters Judea
10. Herod & the Roman Transition

## Source architecture extension

Batch 7 adds source typing:

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

It also adds `textualReferences` so a story/event may display precise ancient references without conflating them with the default Scripture field.

## Visual work

New visual families:

- Hellenistic coastal/column/ship scene
- Maccabean hill-country/fortress scene
- Roman standards/architecture scene
- Herodian harbor/monumental scene

New character silhouettes include:

- Alexander III
- Antiochus IV
- Mattathias
- Judas Maccabeus
- Jonathan
- Simon
- John Hyrcanus I
- Pompey
- Herod the Great
- Augustus

All are labeled artistic reconstruction/silhouette and are not portrait claims.

## Validation requirements

Batch 7 adds `scripts/audit-batch7.mjs`, which enforces:

- required unpinned places;
- key historical dates;
- Alexander/Jerusalem non-promotion;
- Septuagint tradition caveat;
- Qumran/Essenes uncertainty;
- Gerizim archaeology-vs-attribution separation;
- Idumean identity caution;
- Onias IV / Leontopolis correction;
- deuterocanonical source typing;
- use of `textualReferences` instead of default BSB Scripture for 1–2 Maccabees;
- Emmaus-period distinction;
- Roman domination vs. later direct Judaea province;
- generalized context-region warnings;
- route reconstruction notes;
- Herodian platform vs. sanctuary reconstruction.

## Known limitations

Live web search was unavailable during implementation. Before an academic-grade public release, verify:

- current editions and exact page/section citations;
- official archaeological project pages;
- Pleiades/Wikidata identifiers;
- exact object/catalogue IDs for inscriptions/papyri;
- current licenses and attribution wording;
- object-level image rights;
- high-resolution boundary reconstructions.
