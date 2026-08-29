# Contributing

## Historical-data rule

Do not add a place, route, border, date, image, archaeological claim, or interpretive identification without:

- at least one source record;
- explicit confidence classification;
- a coordinate role when geometry is supplied;
- a reconstruction note for inferred routes/boundaries;
- a dating basis when an event receives a structured historical date.

## Production data

Current production content lives in `public/data/<content-pack>/`. The complete 1.0 runtime includes nine packs from `genesis` through `revelation`.

Batch 1 structural fixtures are archived under `docs/archive/batch1-demo/` and must not be reintroduced into runtime data.

## Accuracy policy

Do not create a coordinate merely because a biblical place has a name. Unlocated or disputed places may have no coordinates.

Do not present an interpolated journey line as an exact path walked by a biblical character or army.

Do not assign an exact BCE date merely because a later chronology can be calculated. Use event dating only when the chosen basis is explicit.

Do not turn Assyrian, Egyptian, Moabite, Aramaic, or biblical royal claims into neutral historical fact without indicating source genre and disagreement where material.

## Batch 5 guardrails

The following records must remain unpinned unless new evidence and editorial review justify a change:

- Kerith/Cherith
- Tishbe
- Abel-meholah
- Ramoth-gilead
- Aphek of the Aram conflict
- Tarshish
- Halah
- Libnah
- Moresheth-gath
- Upper Pool / Fuller’s Field road

Do not:

- identify Mount Carmel’s event site with a modern shrine by default;
- label a modern point as Naboth’s vineyard;
- claim Shalmaneser V or Sargon II as the uncontested sole captor of Samaria;
- state that Sennacherib captured Jerusalem in 701 BCE;
- state that the Siloam Inscription names Hezekiah;
- assign Tarshish to Spain or another proposal as settled fact;
- make the Northern Kingdom, Judah, Aram-Damascus, or Assyria display-anchor points substitute for territorial polygons.

## Before opening a pull request

```bash
npm run validate:data
npm run audit:batch4
npm run audit:batch5
npm run audit:batch6
npm run audit:batch7
npm run audit:batch8
npm run audit:batch9
npm run audit:batch10
npm run validate:repo
npm test
npm run build
```

For third-party data, update `ATTRIBUTION.md`, `DATA_LICENSES.md`, and the machine-readable license manifest in the same pull request.

## Content packs

Add new biblical eras as separate `public/data/<content-pack>/` directories. IDs must remain globally unique because validation and runtime loading merge every pack. Cross-pack references are allowed and validated.

## Jerusalem / monarchy guardrails

Do not collapse the physical Temple Mount, exact First Temple footprint, Araunah/Ornan’s threshing floor, southeastern ridge, and changing biblical toponym Zion into one coordinate. Do not label a Hazor, Megiddo, or Gezer monumental complex “Solomonic” without explicit chronological/attribution caveats.

## Batch 6 non-negotiable historical guardrails

For `public/data/exile-restoration/`:

- do not merge the **597 BCE** capture/deportation with the **587/586 BCE** destruction event;
- preserve the 587/586 one-year calendrical issue;
- do not place **Topheth**, Jeremiah 13’s **Perath**, Egyptian **Migdol**, Ezekiel’s **Tel-abib**, **Al-Yahudu**, Daniel’s **Plain of Dura**, **Ahava**, **Casiphia**, the Persian-period Second Temple footprint, or Nehemiah’s complete wall circuit at precise modern coordinates unless new research justifies it;
- never identify Ezekiel’s Kebar automatically with the northern Khabur River;
- never say the **Cyrus Cylinder mentions Jerusalem/Judah** — it does not;
- never use the Cyrus Cylinder as though it were the text of Ezra’s decree;
- keep **Darius the Mede** historically unresolved unless a future source record documents a defensible consensus;
- do not treat the historical fall of Babylon in 539 BCE as independent verification of every detail in Daniel 5;
- do not treat excavated Susa palace architecture as independent verification of Esther’s individual narrative episodes;
- preserve the debate around Ezra’s absolute chronology; 458 BCE may be shown as conventional/traditional, not unquestionable;
- do not represent Persian-period Yehud, Samaria, Beyond-the-River, or imperial boundaries as modern surveyed frontiers;
- keep the 407 BCE Elephantine correspondence separate from Nehemiah’s narrative chronology and do not make Sanballat a direct participant when the letter refers to his sons;
- treat prophetic geography (Zephaniah, Nahum, Habakkuk, Obadiah, Malachi) as literary/historical context rather than invented travel itineraries;
- do not use Nineveh’s independently attested 612 BCE fall to force a single composition date for Nahum.

`scripts/audit-batch6.mjs` encodes many of these rules and must pass before release.

## Batch 7 non-negotiable historical guardrails

For `public/data/second-temple/`:

- do not map Josephus’s later story of **Alexander visiting Jerusalem** as an independently established event;
- keep **Modein**, the exact **Issus battlefield**, **Adasa**, **Elasa**, the Jerusalem **Acra**, and the exact **Hasmonean palace** unpinned unless a future evidence review justifies a specific candidate layer;
- keep Maccabean Emmaus separate from the New Testament Emmaus identification debate;
- cite **1–2 Maccabees** through `textualReferences` / source metadata rather than silently treating them as part of the default BSB text bundle;
- never use the Heliodorus inscription as though it independently verifies every detail of 2 Maccabees 3;
- keep Mount Gerizim’s archaeological sanctuary separate from the interpretive attribution of its destruction to **John Hyrcanus**;
- do not reduce Josephus’s account of Idumean incorporation to a modern ethnicity/border polygon;
- do not equate **Qumran** automatically with “the Essenes” or treat every Dead Sea Scroll as written by the settlement’s residents;
- associate the Leontopolis/Oniad temple tradition with **Onias IV**, not Onias III, unless a documented source-critical revision is made;
- preserve **63 BCE** Pompeian capture of Jerusalem, **40 BCE** Herod’s Roman appointment, and **37 BCE** Herod’s capture of Jerusalem as distinct chronological events;
- do not label post-63 BCE Judea as though it were already identical to the later directly administered province of Judaea;
- do not draw one permanent Hasmonean or Herodian border across decades of changing territory;
- treat Herod’s Temple Mount platform/retaining-wall archaeology separately from reconstructions of the sanctuary superstructure.

`scripts/audit-batch7.mjs` encodes these release guardrails and must pass before publication.


## Batch 8 non-negotiable Gospel-geography guardrails

When editing `public/data/gospels/`:

- do not give normal coordinates to `cana-galilee`, `bethsaida-gospels`, `sychar`, `bethany-beyond-jordan`, `aenon-salim`, `praetorium-pilate`, `gabbatha`, `golgotha`, `tomb-jesus`, `emmaus-luke`, `mount-transfiguration`, or `galilee-resurrection-mountain`;
- model candidate/traditional sites as separate records with `candidate-site` or `traditional-site` coordinate roles;
- do not label Khirbet Qana, Kafr Kanna, el-Araj, et-Tell, Al-Maghtas, the Holy Sepulchre, or the Garden Tomb as archaeologically proven exact Gospel-event locations;
- keep the historically attested Quirinian census at 6 CE and preserve the Herod/Quirinius chronology problem rather than silently harmonizing it;
- keep Pontius Pilate's prefecture approximately 26–36 CE and preserve the inscriptional evidence separately from Gospel narrative;
- do not present the Caiaphas ossuary as conclusive personal identification;
- do not draw a modern Via Dolorosa as a recovered first-century street-by-street route;
- do not merge Matthew's and Luke's infancy itineraries into one synthetic journey;
- do not equate Matthew 28's unnamed Galilean mountain with the Transfiguration mountain;
- do not encode a genre/theological verdict by classifying resurrection events as `symbolic`; explain instead what the map can and cannot assess archaeologically;
- keep the Samaria region distinct from the city of Samaria/Sebaste;
- every animated Gospel route must contain an epistemic note explaining whether it is textual sequence, generalized corridor, traditional endpoint, or candidate-based visualization.

Run `npm run audit:batch8` before opening a pull request that modifies Gospel-era content.

## Batch 9 non-negotiable Acts / Pauline-geography guardrails

When editing `public/data/acts-paul/`:

- keep the Beautiful Gate, Akeldama, Stephen's execution site, Judas's Damascus house, Derbe, Philippi's prayer place/prison, Hall of Tyrannus, Phoenix, exact Malta wreck site, Three Taverns, Paul's Roman lodging, and Pauline Arabia unpinned unless new evidence justifies a separate candidate layer;
- keep `derbe-acts` separate from `kerti-hoyuk-derbe`; a candidate route must say it is using a candidate;
- do not draw an exact “Arabia” itinerary for Paul or silently make Petra his destination;
- preserve the Acts 15 / Galatians 2 correlation as debated;
- preserve Gallio around 51–52 CE and state that the Delphi inscription does not mention Paul;
- treat the Corinth bema as an established monument but only a possible correlation with Paul's hearing;
- preserve Agrippa I's 44 CE death while keeping Acts and Josephus as separate accounts;
- keep Claudian famine/expulsion and Festus chronology approximate where appropriate;
- do not identify a specific Malta bay as the proven Acts 27 wreck site;
- keep Fair Havens probable and Phoenix disputed;
- preserve Areopagus hill/council semantic ambiguity;
- do not create an exact Pauline martyrdom/death event as though it were narrated in Acts;
- do not convert Pauline recipient geography into unqualified composition-site or authorship claims;
- every animated Acts/Paul route segment must explain whether it is textual sequence, generalized corridor, reconstructed road, candidate visualization, or schematic sailing track;
- context polygons must remain generalized orientation layers, never modern-style surveyed ancient borders.

Run `npm run audit:batch9` before opening a pull request that modifies Acts/Paul content.


## Batch 10 / Revelation guardrails

For `public/data/revelation/`:

- never assign ordinary Earth coordinates to New Jerusalem, Babylon the Great, the heavenly throne room, the Abyss, Gog/Magog, the lake of fire, or river/tree-of-life visionary space;
- do not equate Har-Magedon automatically with Tell Megiddo;
- keep the Cave of the Apocalypse as a traditional site;
- keep the Pergamum Great Altar → “Satan’s throne” proposal explicitly non-established;
- do not claim Revelation names Domitian;
- preserve debate over Revelation’s date;
- keep `john-of-patmos` distinct from `john-zebedee` unless a future editorial policy explicitly chooses otherwise;
- the Seven Churches connector is literary order, not a recovered courier itinerary;
- never animate an invented John journey to or from Patmos;
- all explicitly visionary story chapters should use `visionarySceneId` when visualization is useful instead of fake map coordinates.

## Batch 11 contribution gates

Use the consolidated checks before opening a pull request:

```bash
npm test
npm run check
npm run build
```

Do not reintroduce a third-party browser search dependency for the current corpus without documenting why the dependency-free engine is inadequate.

### Source verification

When you verify an external source, update the source record rather than only editing prose. Prefer stable official URLs, DOI/ISBN/edition/page locators, a checked date, and a short note explaining what the source actually supports.

Never set `verificationStatus: "primary-verified"` merely because a citation appears plausible or because another AI/tool supplied the citation. Live inspection of the primary/official source or a citable edition is required.

Regenerate the review queue with:

```bash
npm run audit:provenance
```

### Accessibility / offline rules

- Keep all important content reachable without clicking the map.
- Respect `prefers-reduced-motion` for new animations.
- Preserve keyboard-visible focus.
- Do not remove the search dialog focus trap/restore behavior.
- Service-worker changes must continue to bypass HTTP Range requests so PMTiles remains viable.
