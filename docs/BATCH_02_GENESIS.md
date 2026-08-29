# Batch 2 — Genesis Content Release

## Objective

Turn the Batch 1 platform skeleton into the first real content release: an evidence-aware Genesis atlas covering early Genesis geography and the patriarchal narratives through Joseph and the family's move to Egypt.

## Scope delivered

### Content
- 34 geographic records
- 15 people
- 12 major events
- 6 journey datasets
- 5 guided story experiences
- 4 broad historical-context regions
- 7 provenance/source records

### Guided stories
1. Early Genesis — Geography and Uncertainty
2. Abraham — Journey of Promise
3. Isaac — Wells, Gerar, and Beersheba
4. Jacob — Exile, Return, and Israel
5. Joseph — From Dothan to Egypt

### Accuracy model
Batch 2 deliberately distinguishes:
- established ancient locations;
- probable identifications;
- candidate sites;
- traditional/canonical identifications;
- disputed places;
- unlocated geography;
- symbolic/literary geography.

A place no longer requires coordinates. Eden, Sodom, Gomorrah, and Beer-lahai-roi can therefore exist as fully searchable evidence records without being assigned false GPS precision.

Mapped points also declare a coordinate role:
- `identified-site`
- `candidate-site`
- `traditional-site`
- `approximate-area`
- `display-anchor`

### Route methodology
Genesis usually gives a sequence of named destinations, not the exact road between them. Journey segments therefore distinguish:
- `known-sequence`
- `reconstructed`
- `unknown`

The animated traveler is an artistic silhouette and never a historical portrait.

### Chronology policy
Batch 2 does not assign a single exact archaeological date to Abraham, Isaac, Jacob, or Joseph. The timeline controls broad contextual layers. Individual Genesis places are not hidden based on an arbitrary patriarchal date range.

## Research basis

This batch uses:
- Genesis as the primary source for narrative sequence;
- the scholarly bibliography identified during planning, especially *The Sacred Bridge*, *The Macmillan Bible Atlas*, and *The Anchor Yale Bible Dictionary*;
- the user's 2026 web research concerning Pleiades, Natural Earth, BSB licensing, PMTiles, and other production datasets;
- conservative project-authored geographic metadata where no reusable external dataset is bundled.

The environment used to build Batch 2 had no live web access, so exact page-level scholarly citations, current upstream dataset snapshots, and current license wording have not been independently re-fetched. The source records say this explicitly.

## Important limitations

Batch 2 is a serious curated release, but not yet an academic critical edition. Before calling a record publication-grade, future editorial passes should add:
- pinpoint page/article citations;
- exact Pleiades/Wikidata IDs where verified;
- upstream dataset versions and checksums;
- current official license snapshots;
- archaeological bibliography for disputed sites;
- a verified public-domain/CC0 Bible text dump if full verse text is later bundled.

## Technical additions

- Optional coordinates in the place schema
- Coordinate-role metadata
- Historical context and archaeology fields
- Competing interpretation records
- First-class people and event schemas
- Person/event URL state
- People/events in static search
- Story library rather than one preview story
- Animated person-specific traveler styling
- Responsive artistic character silhouettes
- Time-filtered historical context regions
- Searchable unlocated places
- Expanded data cross-reference validator

