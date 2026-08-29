# Data Licenses

## Code

Application code is licensed under MIT unless a file states otherwise.

## Original project curation

The current Genesis, Exodus–Judges, Ruth–United Monarchy, Divided Kingdom + Prophets, Exile/Babylon/Persia/Restoration, Second Temple, Gospels, Acts + Paul, and Revelation JSON, schematic routes, confidence/provenance metadata, broad contextual polygons, event-dating metadata, and project-authored SVG/CSS illustrations are original project curation.

Per-pack machine-readable metadata is stored in:

```text
public/data/genesis/licenses.json
public/data/exodus-judges/licenses.json
public/data/united-monarchy/licenses.json
public/data/divided-kingdom/licenses.json
public/data/exile-restoration/licenses.json
public/data/second-temple/licenses.json
public/data/gospels/licenses.json
public/data/acts-paul/licenses.json
public/data/revelation/licenses.json
```

The project currently recommends **CC BY 4.0** for original curated data while application code remains MIT. Before a public collaborative release, repository-level licensing should make the data-license choice explicit.

## Scholarly and ancient-source references

Books, articles, excavation publications, inscriptions, monuments, cuneiform tablets, papyri, and ancient texts listed in `sources.json` are **sources**, not bundled third-party datasets.

The repository does not claim copyright over ancient inscriptions and does not redistribute copyrighted modern translations, photographs, drawings, plates, facsimiles, or scholarly prose merely because a source is referenced.

Batch 6 source metadata includes the Babylonian Chronicles, Jehoiachin ration tablets, Lachish ostraca, Ketef Hinnom amulets, Al-Yahudu archive scholarship, Cyrus Cylinder, Behistun Inscription, and Elephantine papyri. Only project-authored descriptions are stored.

## Not bundled yet

The repository currently contains no bulk redistribution of:

- Pleiades
- Copernicus DEM
- NASA SRTM
- OpenStreetMap
- AWMC
- DARE
- museum open-access image collections
- a complete Bible translation

Before third-party bytes are added, record exact current license, attribution language, source version, redistribution terms, and derivative/share-alike requirements.

## Bible text

The user supplied 2026 research stating that the Berean Standard Bible entered the public domain / CC0 in 2023. The current Batch 8 repository still stores Scripture references and project-authored summaries only. Official licensing should be rechecked before a full-text import.

## Primary-source images and modern editions

A source being ancient or public-domain in substance does **not** mean a modern photograph, scan, edition, translation, or museum image is automatically reusable. Any future image or facsimile import must have object-level rights metadata.

## Future geospatial imports

Keep raw-source provenance and derived-artifact licensing separate. ODbL or Share-Alike source data must never be silently relicensed as project-authored CC BY data.

## Batch 7 data

Batch 7 adds the original `public/data/second-temple/` content pack. Its project-authored summaries, confidence metadata, route reconstructions, structured textual references, and broad historical-context polygons are intended for the same **CC BY 4.0** project-data licensing approach as earlier packs.

Machine-readable licensing is recorded in:

```text
public/data/second-temple/licenses.json
```

The pack references 1–2 Maccabees, Josephus, Greek/Roman historians, papyri, inscriptions, and archaeological publications as **sources**. It does not redistribute copyrighted modern translations, scans, photographs, excavation figures, or publication maps.

The new `source.kind` metadata is descriptive and does not override the legal rights of an underlying edition, image, object record, or database.


## Batch 8 data

Batch 8 adds the original `public/data/gospels/` content pack. Its project-authored summaries, confidence metadata, route reconstructions, Gospel story structure, candidate/tradition separations, and broad historical-context polygons are intended for the same **CC BY 4.0** project-data licensing approach as earlier packs.

Machine-readable licensing is recorded in:

```text
public/data/gospels/licenses.json
```

The pack references canonical Gospel texts, Josephus, Philo, Tacitus, inscriptions, archaeology, and modern scholarship as **sources**. It does not redistribute copyrighted modern editions, scans, photographs, excavation illustrations, or publication maps.

Traditional-site and candidate-site labels are project metadata and do not transfer any ownership or reuse rights in photographs, archaeological plans, museum content, or publications about those sites.


## Bundled Natural Earth derivative

`public/data/basemap/land.geojson` is a small dissolved/simplified derivative of Natural Earth low-resolution geometry. Natural Earth is public domain. The project removes modern country attributes/borders and uses only generalized land geometry for physical orientation.

Machine-readable provenance is stored in `public/data/basemap/licenses.json`. The exact upstream Natural Earth release number is not encoded in the locally available fixture and should be reverified/replaced from the official source before an academic-critical publication.

## Batch 9 data

Batch 9 adds the original `public/data/acts-paul/` content pack. Project-authored summaries, confidence metadata, route reconstructions, story structure, candidate-site distinctions, and broad Roman-period context polygons follow the same intended **CC BY 4.0** project-data licensing approach as earlier packs.

Machine-readable licensing is recorded in:

```text
public/data/acts-paul/licenses.json
public/data/revelation/licenses.json
```

The pack cites Acts, Pauline letters, Josephus, Suetonius, an ancient inscription, archaeological research, and modern scholarship as sources. It does not redistribute copyrighted modern editions, photographs, scans, inscription facsimiles, excavation illustrations, proprietary atlas geometry, or road-network databases.

Candidate/traditional labels and reconstructed route polylines are original project metadata. They do not transfer rights in underlying publications, images, archaeological plans, or datasets.


## Batch 10 data and visionary artwork

Batch 10 adds `public/data/revelation/` and project-authored SVG/CSS visionary visualizations. The underlying canonical references and cited scholarly works remain source references; the repository stores project-authored summaries and visualization code rather than copyrighted commentary text or publication figures.

Machine-readable licensing is recorded in:

```text
public/data/revelation/licenses.json
```

The symbolic visualizations are original project artwork/code. Any future third-party iconography, museum object image, manuscript image, or archaeological photograph must receive object-level rights metadata before bundling.
