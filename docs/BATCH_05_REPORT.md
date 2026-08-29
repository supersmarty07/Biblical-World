# Batch 5 Execution Report — Divided Kingdom + Prophets

## Release status

Batch 5 is complete at the source/data level and extends the atlas through the divided-monarchy and Assyrian-crisis horizon. The project remains static/frontend-only and deployable through the existing GitHub Pages workflow.

## Content delivered

### Batch 5 pack

- 33 places / regions / physical features
- 30 people
- 28 events
- 9 animated journeys
- 10 guided stories
- 10 time-aware historical-context regions
- 17 Batch 5 source records

### Combined atlas totals

- 189 places
- 88 people
- 93 events
- 36 journeys
- 37 guided stories
- 31 context regions
- 40 source/provenance records

## Canonical / historical coverage

The release covers the main geographic and historical arc of:

- 1 Kings 12–22
- 2 Kings 1–20
- relevant 2 Chronicles parallels
- Amos
- Hosea
- Jonah as mapped textual geography without a built-in genre verdict
- Isaiah's eighth-century Assyrian-crisis geography
- Micah's Samaria/Jerusalem/Shephelah horizon

The Babylonian destruction and exile are intentionally deferred to Batch 6.

## Key historical implementation decisions

### Political geography

Israel, Judah, Aram-Damascus, Moab, Phoenicia, and Assyria are represented with broad, time-aware orientation polygons. They are not presented as surveyed modern borders. Searchable polity points are explicitly display anchors rather than territorial centroids of precision.

### Shoshenq I / Shishak

The biblical account and the Karnak/Bubastite Portal campaign evidence are separate source streams. The project does not present the Egyptian place list as a line-by-line transcription of Kings/Chronicles.

### Qarqar

The 853 BCE battle is included as extra-biblical historical context from the Assyrian inscriptional tradition. It deliberately has no fabricated Scripture reference.

### Elijah and Elisha

Tishbe and Kerith remain unpinned. Mount Carmel is mapped as a physical ridge without an exact altar/event coordinate. Horeb/Sinai inherits the earlier unlocated-Sinai rule. Elisha's map avoids assuming that every biblical place called Gilgal is identical.

### Jehu

Ramoth-gilead remains disputed/unpinned, so the animated coup route begins from broad Gilead context. The Black Obelisk is treated as independent Assyrian evidence, and the Assyrian “house/son of Omri” label is not interpreted as biological genealogy.

### Jonah and Tarshish

Joppa and Nineveh are secure anchors. Tarshish remains disputed and has no coordinate. The journey animation moves from Joppa into the Mediterranean and stops rather than selecting a modern Tarshish theory. Event confidence does not classify the Jonah narrative as “symbolic,” so the map does not encode a genre/historicity verdict.

### Fall of Samaria

The event preserves the historical attribution problem: Kings names Shalmaneser V in the siege sequence, while Sargon II later claims conquest/deportation associated with Samaria. The atlas does not silently collapse those sources into a single certain final-capture attribution.

### Siloam water system

The physical tunnel is established. The Siloam inscription is kept as its own primary-evidence source and is explicitly noted not to name Hezekiah. Royal attribution therefore remains a separate historical inference.

### Sennacherib in 701 BCE

Lachish and Jerusalem are separately modeled. The Assyrian sources are accurately summarized as claiming devastation, Hezekiah's confinement, and tribute while not claiming the capture of Jerusalem. Biblical theological claims remain Scripture claims rather than being converted into archaeological statements.

## Platform work delivered

Batch 5 adds:

- structured `EventDating` metadata
- `historical`, `conventional`, `approximate`, and `textual` dating bases
- human-readable `dateLabel` support for ancient source records
- guided-story `contextYear` support
- timeline context labels for divided-monarchy / Assyrian phases
- date-aware static search metadata
- expanded character identifiers and artwork styling
- new divided-monarchy, prophet, and Assyrian inline SVG story scenes
- a fourth content-pack loader entry
- Batch 5-specific historical/editorial audit rules

## QA and validation

The following checks passed in the release workspace:

1. Generic atlas validation across all four content packs.
2. Global unique IDs across places, people, events, journeys, stories, and sources.
3. Cross-pack place/person/event/story/source reference integrity.
4. Coordinate bounds and coordinate-role rules.
5. Scripture-reference object structure.
6. Journey endpoint checks against mapped place anchors.
7. Journey uncertainty-note requirements.
8. Guided-story camera/reference sanity.
9. Time-aware context-region range and geometry validation.
10. Static GitHub Pages file-size guard.
11. Batch 4 editorial guardrails (regression check).
12. Batch 5 editorial guardrails.
13. Required primary-evidence source records, including Shoshenq/Karnak, Mesha, Tel Dan, Kurkh/Qarqar, Black Obelisk, Sargon/Samaria, Sennacherib 701, and Siloam.
14. Mandatory unpinned status for Kerith, Tishbe, Abel-meholah, Ramoth-gilead, Aphek in the Aramean context, Tarshish, Halah, Libnah, the Upper Pool conduit, and Moresheth-gath.
15. Exact historical dating preservation for Qarqar (853 BCE), Jehu's Assyrian tribute episode (c. 841 BCE), and the 701 BCE Lachish/Jerusalem campaign events.
16. Jonah non-symbolic-genre guardrail.
17. Ancient primary-source display-date guardrail (human-readable labels, no raw negative year output).
18. JSON parsing of every static JSON dataset.
19. Node syntax checking across all `.mjs` scripts.
20. TypeScript/TSX syntax transpilation across all 25 source files using TypeScript 5.8.3.

Final generic validation result:

```text
Atlas data validation passed across 4 content packs:
 - genesis: 34 places, 15 people, 12 events, 6 journeys, 5 stories, 7 sources, 4 context regions.
 - exodus-judges: 75 places, 23 people, 27 events, 11 journeys, 12 stories, 10 sources, 10 context regions.
 - united-monarchy: 47 places, 20 people, 26 events, 10 journeys, 10 stories, 6 sources, 7 context regions.
 - divided-kingdom: 33 places, 30 people, 28 events, 9 journeys, 10 stories, 17 sources, 10 context regions.
Total: 189 places, 88 people, 93 events, 36 journeys, 37 stories, 40 sources.
```

## Build limitation in this environment

A full dependency-resolving Vite production bundle was not executed because this environment does not contain the npm dependencies and external package installation is unavailable. `scripts/build-search-index.mjs` therefore cannot execute locally because `minisearch` is absent.

This is not hidden by the release: GitHub Actions performs `npm install` and then `npm run build`; the prebuild lifecycle runs data validation, Batch 4 and Batch 5 audits, static-file validation, and search-index generation before TypeScript/Vite bundling.

## Research limitation

Live web access was unavailable during implementation. The pack therefore uses established source traditions and conservative metadata, but publisher URLs, object-catalog identifiers, page-level citations, current editions, and current license wording still require a later live-source verification pass before the project should be described as a peer-reviewed or critical historical GIS edition.

## Next batch

Batch 6 should cover Babylon, the destruction of Jerusalem, Jeremiah, Ezekiel, Daniel's imperial context, exile/deportation geography, Neo-Babylonian rule, Cyrus and Persia, Ezra-Nehemiah, Esther/Susa, and return routes.
