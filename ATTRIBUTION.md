# Attribution

## Current status — V2 alpha.9 verification integration

The repository currently contains project-authored JSON summaries, confidence classifications, structured event-dating metadata, broad time-aware context polygons, schematic journey reconstructions, and inline SVG/CSS artwork covering **Genesis through the Gospels**, including the Second Temple / Hellenistic / Hasmonean / Herodian bridge and first-century Galilee/Judea context.

It does **not** currently bundle bulk bytes from Pleiades, Copernicus DEM, OpenStreetMap, AWMC, DARE, museum-image collections, or a complete Bible translation. It **does** bundle a very small dissolved/simplified physical land silhouette derived from Natural Earth low-resolution geometry; modern country attributes and borders are removed.

## Scripture references

The project stores Scripture references and project-authored summaries rather than full verse text.

The user supplied 2026 research stating that the Berean Standard Bible is public domain / CC0. Before a future full-text import, the official declaration should be checked again and its exact current wording recorded.

## Scholarly orientation sources

The source registries reference academic works including:

- **The Sacred Bridge: Carta’s Atlas of the Biblical World** — Anson F. Rainey and R. Steven Notley
- **The Anchor Yale Bible Dictionary** — David Noel Freedman, ed.
- **The Oxford History of the Biblical World** — Michael D. Coogan, ed.
- **Archaeology of the Land of the Bible: 10,000–586 B.C.E.** — Amihai Mazar
- **A History of Ancient Israel and Judah** — J. Maxwell Miller and John H. Hayes
- **Anchor Bible / Yale commentaries on Kings** — Mordechai Cogan; Mordechai Cogan and Hayim Tadmor
- **The Context of Scripture** — William W. Hallo and K. Lawson Younger Jr., eds.
- **The Renewed Archaeological Excavations at Lachish (1973–1994)** — David Ussishkin
- scholarly Samaria/Northern Kingdom excavation and historical literature

These are research/bibliographic sources. Their copyrighted prose, maps, figures, photographs, and proprietary data are **not redistributed** by this repository.

## Primary ancient evidence referenced in Batch 5

The project records source metadata for ancient evidence including:

- Mesha Stele / Moabite Stone
- Tel Dan Aramaic Stele
- Shalmaneser III’s Kurkh Monolith / Qarqar inscription
- Shalmaneser III’s Black Obelisk
- Tiglath-pileser III and other Neo-Assyrian royal inscriptions
- Sargon II inscriptions concerning Samaria
- Sennacherib’s 701 BCE campaign inscriptions
- Sennacherib’s Lachish relief program
- Siloam Tunnel Inscription

The repository currently stores **original project summaries of what these sources contribute**, not copyrighted modern photographs, facsimiles, edition plates, or full modern translations.

Royal inscriptions are treated as historically valuable ideological texts, not neutral statistical reports.

## Project-created artwork

Story illustrations, map traveler icons, and character silhouettes are project-authored lightweight SVG/CSS graphics. They are explicitly labeled **artistic context / artistic reconstruction** and are not historical portraits or archaeological plans.

## Previously researched future datasets

- **Pleiades** — future ancient-gazetteer cross-check/import
- **Natural Earth** — a small public-domain-derived physical land silhouette is now bundled; richer official-source physical layers remain future work
- **Copernicus GLO-30 / NASA SRTM** — future terrain sources
- **AWMC / DARE** — future Roman/classical geodata

None of those bulk datasets is embedded in the current repository.

## Release requirement for future external bytes

Whenever external data or imagery is imported, this file and the relevant `public/data/<pack>/licenses.json` must record:

- exact official attribution wording;
- source URL;
- license URL;
- version/download date;
- whether the artifact is raw, transformed, or derived;
- modification notes;
- checksum when practical;
- share-alike/database obligations when applicable.

## Batch 6 — Exile, Babylon, Persia & Restoration

Batch 6 adds project-authored historical-geography metadata for the late Kingdom of Judah, Babylonian conquest/exile, Neo-Babylonian and Achaemenid contexts, and Persian-period restoration.

Primary ancient evidence referenced by metadata includes:

- Neo-Assyrian royal inscriptions naming Manasseh of Judah;
- Babylonian Chronicle material for Carchemish and the 597 BCE capture of Jerusalem;
- Babylonian ration tablets naming Jehoiachin/Yaukin;
- Lachish ostraca;
- Ketef Hinnom silver amulets;
- the Babylonian Chronicle of Nineveh’s 612 BCE fall;
- Al-Yahudu/Judean exile cuneiform archives;
- the Nabonidus Chronicle;
- the Cyrus Cylinder;
- the Behistun Inscription;
- Elephantine Aramaic papyri.

The repository stores **original project summaries and provenance metadata only**. It does not redistribute copyrighted modern translations, facsimiles, photographs, excavation plates, or edition text from those sources.

Important attribution/interpretive limitations encoded in the project:

- the Cyrus Cylinder is cited as comparative Persian/Babylonian restoration evidence and **does not name Jerusalem, Judah, Judeans, or the Jerusalem temple**;
- the Nabonidus Chronicle supports the historical 539 BCE fall of Babylon but is not presented as evidence for every detail in Daniel 5;
- Susa archaeology establishes the royal center but does not independently establish Esther’s individual narrative episodes;
- Elephantine evidence is presented as fifth-century BCE diaspora context, separate from the chronology of Nehemiah’s narrative;
- generalized political polygons are original project reconstructions and are not copied from proprietary historical atlases.

Scholarly works referenced in Batch 6 include works by Oded Lipschits, Mordechai Cogan and Hayim Tadmor, J. A. Thompson, Daniel I. Block, John J. Collins, Pierre Briant, Amélie Kuhrt, H. G. M. Williamson, Lester L. Grabbe, Adele Berlin, J. J. M. Roberts, and Paul R. Raabe. These publications are bibliographic sources only; their copyrighted prose and figures are not bundled.

## Batch 7 — Second Temple / Hellenistic / Hasmonean / Herodian transition

Batch 7 adds project-authored historical-geography metadata for the period from Alexander’s conquest through the Ptolemaic and Seleucid eras, the Maccabean revolt, Hasmonean rule, Roman intervention, and Herod the Great.

Ancient literary sources referenced by metadata include:

- 1 Maccabees;
- 2 Maccabees;
- Josephus, *Jewish Antiquities* Books 12–14;
- Josephus, *Jewish War* Book 1;
- Arrian, *Anabasis of Alexander*;
- Polybius, *Histories*;
- Diodorus Siculus;
- Strabo;
- Appian;
- Plutarch.

Documentary/inscriptional context includes the Zenon papyri and the Heliodorus/Seleucus IV administrative inscription tradition. Archaeological summaries reference published work on Mount Gerizim, Maresha, Qumran, Masada, Herodium, Jericho palace complexes, and Caesarea Maritima.

The repository stores **project-authored descriptions and reference metadata only**. It does not redistribute copyrighted modern translations, excavation plans, photographs, facsimiles, or atlas geometry.

Batch 7 also introduces explicit source typing so the UI can distinguish canonical text, deuterocanonical text, ancient literary sources, inscriptions, documentary sources, archaeology, modern scholarship, and project methodology.

Important interpretive limitations encoded in the project:

- the later Josephus tradition of Alexander visiting Jerusalem is not promoted into an independently established event;
- 1–2 Maccabees are cited through a neutral ancient-text reference channel rather than silently inserted into the default BSB text bundle;
- the Jerusalem Acra remains unpinned;
- Mount Gerizim archaeology is separated from the historical attribution of its destruction to John Hyrcanus;
- Qumran is not automatically equated with a single sect or with authorship/ownership of every Dead Sea Scroll;
- Hasmonean and Herodian territorial polygons are generalized project reconstructions, not copied borders;
- the Leontopolis temple tradition is associated in the project model with Onias IV, while the precise temple footprint remains uncertain;
- Herod’s 40 BCE Roman appointment is kept distinct from his 37 BCE capture of Jerusalem.


## Batch 8 — Gospels / first-century context

Batch 8 adds project-authored historical-geography metadata for Matthew, Mark, Luke, and John and their first-century setting. It references canonical Gospel texts, Josephus, Philo, Tacitus, inscriptional evidence including the Pontius Pilate inscription, archaeological literature, and modern historical/geographic scholarship.

The repository stores **original project summaries and provenance metadata only**. It does not redistribute copyrighted modern Bible translations, modern Josephus/Philo/Tacitus translations, excavation plans, publication figures, photographs, museum images, or proprietary atlas geometry.

Important source/attribution distinctions encoded in Batch 8 include:

- Machaerus is linked to John the Baptist through Josephus; the fortress is not named in the Gospel execution narratives;
- the Pilate inscription is treated as independent inscriptional evidence for Pontius Pilate and his prefectural title;
- the ossuary often associated with Caiaphas is treated as supporting family-context evidence rather than conclusive personal identification;
- archaeological remains at Al-Maghtas document an ancient baptismal/pilgrimage landscape but do not establish the exact point of Jesus' baptism;
- the Church of the Holy Sepulchre and Garden Tomb are mapped as separate traditions/candidates rather than converted into textual coordinates for Golgotha or the tomb;
- resurrection geography is represented as textual/traditional geography without claiming archaeology can verify or falsify the supernatural event itself.

Shared bibliographic sources already registered in earlier packs are reused by stable source ID rather than duplicated.


## Natural Earth physical land derivative

`public/data/basemap/land.geojson` is a small generalized physical-land derivative created from a locally available Natural Earth low-resolution fixture. Country features were dissolved, clipped to the atlas working region, and simplified; modern country names and borders are not retained.

Natural Earth data is public domain. Polite attribution used by the project: **“Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com.”**

The local source fixture reports a DBF last-update date of 2018-09-01 but does not encode an exact upstream release number. Before an academic-critical release, replace or verify this derivative against an official current Natural Earth download and record the exact upstream version/checksum.

## Batch 9 — Acts and Paul

Batch 9 adds project-authored historical-geography metadata for Acts 1–28 and selected Pauline recipient geography. It references canonical Acts/Pauline texts, Josephus, Suetonius, the Delphi/Gallio inscription, archaeology, and modern historical-geographic scholarship.

The repository stores original project summaries and bibliographic/provenance metadata only. It does not redistribute copyrighted modern Bible translations, modern Josephus/Suetonius translations, inscription photographs or editions, excavation plans, publication figures, proprietary road GIS, or atlas imagery.

Important distinctions encoded in Batch 9 include:

- the Gallio inscription is independent evidence for Gallio's chronology and **does not mention Paul**;
- Acts 15 and Galatians 2 are cross-referenced without being automatically equated;
- Derbe remains a disputed textual location, while Kerti Höyük is only a candidate;
- Paul's Galatians “Arabia” remains unpinned and Petra is not treated as his named destination;
- the Areopagus hill is distinguished from the question of where the council/speech episode occurred;
- Malta is an island-level identification while the exact wreck bay remains unknown;
- St Paul's Bay is not presented as archaeologically proven;
- Paul's Roman rented lodging and later death location are not invented.


## Batch 10 — Revelation

Batch 10 adds project-authored historical-geography and visionary-mode metadata for Revelation. It cites the canonical text, standard historical geography, archaeology of western Asia Minor, early Christian literary testimony, and modern Revelation scholarship.

The pack intentionally distinguishes:

- Patmos and the seven churches as terrestrial historical geography;
- the Cave of the Apocalypse as later tradition;
- Pergamum’s Great Altar as archaeology but not an established identification of “Satan’s throne”;
- Rome as a strong interpretive referent for Babylon the Great without replacing the symbolic city with a Rome coordinate;
- Har-Magedon from the archaeological site of Megiddo;
- John of Patmos from the debated traditional identification with John son of Zebedee;
- visionary New Jerusalem and related scenes from ordinary map geography.

The `VisionaryOverlay` SVG/CSS artwork is project-authored and does not reproduce manuscript illuminations, museum objects, proprietary maps, or copyrighted publication artwork.

## Batch 11 project-authored interface assets

The v1.1 app icon (`public/icons/atlas-mark.svg`), service-worker logic, accessibility styles, dependency-free search implementation, provenance tooling, and generated catalog/report structures are project-authored code/interface assets. They do not add any new third-party historical imagery or datasets.

## V2 verification packet integration — alpha.9

The user-supplied 2026-08-30 verification packet has been imported as machine-readable metadata at `public/data/verification/registry.json`. Because this build environment has no live web access, packet conclusions are represented as **research-packet supplied**, not silently promoted to independently live-verified facts.

Packet-backed open-data attribution records now include:

- **Copernicus DEM GLO-30** — mandatory notice: “Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.” No DEM bytes are bundled yet.
- **Pleiades: A Gazetteer of Past Places** — CC BY 4.0; selected identifiers are now stored in `PlaceRecord.externalIds.pleiades`.
- **DARE / Digital Atlas of the Roman Empire** — CC BY 4.0 according to the packet. No road bytes are bundled; an optional road URL can be configured with `VITE_ROMAN_ROADS_GEOJSON_URL`.
- **AWMC Antiquity À-la-carte** — CC BY 4.0 according to the packet.
- **Natural Earth** — public domain; the existing small land silhouette remains the only bundled third-party geospatial derivative in this repository.
- **Wikidata structured data** — packet classifies structured data as CC0. Only selected QIDs are stored; Wikidata coordinates do not override atlas confidence classifications.

**ORBIS** and **Digital Augustan Rome** remain optional non-commercial research resources and are not production dependencies. **Open Context** is treated as dataset-specific: repository policy is not sufficient to ingest a particular excavation dataset without checking that dataset's own DOI/license record.

No Matson, Met, Wikimedia, excavation-plan, DEM, or road-network image/data bytes were automatically imported from the research packet.
