# The Biblical World

**An evidence-aware interactive atlas from Genesis to Revelation.**

Version **1.0.0 / Batch 10** completes the planned Genesis → Revelation arc. The project is a frontend-only React/TypeScript/MapLibre application intended for GitHub Pages. It combines historical geography, biblical narrative, archaeology, ancient-source context, uncertainty labels, animated journeys, guided stories, and a separate visionary visualization mode for Revelation.

## Complete production scope

- React + TypeScript + Vite
- MapLibre GL JS
- optional PMTiles basemap/terrain via static object storage
- bundled lightweight physical-land fallback
- **405 geographic records**
- **246 people**
- **265 events**
- **69 animated/schematic journey datasets**
- **90 guided stories**
- **77 time-aware context regions**
- **166 source/provenance records**
- **10 Revelation visionary scenes**
- nine static content packs
- MiniSearch-based browser search
- confidence + coordinate-role classifications
- structured event dating
- canonical Scripture references separated from other ancient textual witnesses
- responsive desktop/mobile UI
- shareable URL state
- GitHub Pages deployment workflow

## Content packs

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

Each pack contains places, people, events, journeys, stories, context regions, sources, and license metadata. Revelation additionally contains `visionary-scenes.json`.

## Batch 10 — Revelation

### Historical map mode

The ordinary map handles locations that can responsibly be treated as terrestrial geography:

- Patmos
- Ephesus
- Smyrna
- Pergamum
- Thyatira
- Sardis
- Philadelphia
- Laodicea
- Roman Asia

The Seven Churches animation follows the **literary order of Revelation 2–3**. It is explicitly not a recovered courier itinerary.

### Visionary mode

When a guided chapter reaches explicitly visionary material, the app switches to a non-terrestrial visualization layer. This is used for:

- the heavenly throne and Lamb
- seals and trumpets
- woman and dragon
- beasts
- Babylon the Great
- Har-Magedon / Armageddon
- great white throne judgment
- New Jerusalem
- river and tree of life
- a final Genesis → Revelation visual arc

Visionary entities remain searchable as records but receive **no fake Earth coordinates**.

### New Jerusalem scale explorer

Revelation 21 gives the city as 12,000 stadia in length, width, and height. The UI presents this as a visionary literary measurement and gives only an approximate modern conversion (about 2,200 km using a common stadion estimate), with an explicit warning that ancient stadion lengths varied. The cube is not plotted on Earth.

### Historical guardrails

Batch 10 deliberately preserves these distinctions:

- **John of Patmos** is modeled separately from **John son of Zebedee** because authorship identification is debated.
- A late-first-century / Domitianic setting is presented as a common conventional framework; Revelation itself does **not** name Domitian.
- The **Cave of the Apocalypse** is a later traditional site, not first-century proof.
- Pergamum’s **Great Altar** is established archaeology; identifying it specifically with “Satan’s throne” is only one proposal.
- **Har-Magedon** is not given Tell Megiddo’s coordinates.
- **Babylon the Great** is not plotted at historical Babylon or Rome. Rome is presented only as a strong first-century interpretive referent in much scholarship.
- **Gog and Magog** are not mapped onto a modern country.
- Laodicea’s water system may illuminate “lukewarm” imagery, but the app labels that as contextual interpretation rather than demonstrated authorial intent.

## Evidence model

Geographic identification:

```text
established
probable
possible
traditional
disputed
unknown
symbolic
```

Historical interpretation is scored separately:

```text
high
moderate
low
traditional
symbolic
```

Coordinates also carry a role:

```text
identified-site
approximate-area
candidate-site
traditional-site
display-anchor
```

A named place is allowed to remain completely unpinned.

## Static deployment architecture

```text
GitHub repository
  ├─ React / TypeScript / Vite app
  ├─ JSON / GeoJSON content packs
  ├─ SVG/CSS artwork and animations
  └─ GitHub Actions
          ↓
      GitHub Pages

Optional large assets
  └─ PMTiles / terrain on Cloudflare R2, S3, etc.
```

No database or runtime API server is required.

## Local development

```bash
npm install
npm run dev
```

Production validation/build:

```bash
npm run build
```

`prebuild` runs all data validation, Batch 4–10 historical audits, static-hosting checks, and search-index generation before TypeScript/Vite compilation.

## GitHub Pages

1. Create a GitHub repository.
2. Copy this repository into it.
3. Push to `main`.
4. In GitHub **Settings → Pages**, select **GitHub Actions** as the deployment source.
5. The included `.github/workflows/deploy.yml` installs dependencies, validates the complete atlas, builds, and deploys `dist/`.

The workflow supplies the repository-name base path automatically.

## Optional PMTiles

Copy `.env.example` to `.env` and configure externally hosted static PMTiles assets if desired:

```bash
VITE_BASEMAP_PMTILES_URL=https://example.com/basemap.pmtiles
VITE_TERRAIN_PMTILES_URL=https://example.com/terrain.pmtiles
```

Large PMTiles files should not be committed to the normal Git repository.

## Research / licensing status

This application is deliberately built around provenance. Source registry records are bibliographic/provenance references; the repository does not automatically redistribute the cited books, excavation figures, photos, proprietary atlases, or modern translations.

The current environment did not have live web search enabled during the later implementation batches, so **official dataset/license versions and page-level bibliographic details should receive a final live-source verification pass before describing the project as an academic critical edition**. The app already models uncertainty conservatively and keeps that verification requirement explicit.

See:

- `docs/DATA_MODEL.md`
- `docs/BATCH_10_REVELATION.md`
- `docs/BATCH_10_REPORT.md`
- `ATTRIBUTION.md`
- `DATA_LICENSES.md`
- `CONTRIBUTING.md`

## Licensing

Application code: MIT, unless a file states otherwise.

Original curated historical data, confidence metadata, route reconstructions, broad context polygons, and project-authored SVG/CSS visualizations are intended for a CC BY 4.0 data/artwork approach. Third-party materials remain under their original licenses. See `DATA_LICENSES.md` and each pack’s `licenses.json`.
