# V2 Batch 4 Report — Jerusalem / Moriah / Zion

**Version:** `2.0.0-alpha.4`  
**Baseline:** V2 Batch 3 / `2.0.0-alpha.3`  
**Architecture:** frontend-only Vite + React + TypeScript + MapLibre + static data

## Scope completed

Batch 4 establishes Jerusalem as a dedicated immersive subsystem without modifying or flattening the v1 place/evidence model.

### 1. Jerusalem Through Time

`public/data/immersive/scenes/jerusalem-historical-terrain.json`

The scene contains ten topographic/period states:

- physical setting
- pre-monarchic context
- Davidic context
- First Temple context
- late Iron Age
- Persian period
- Hasmonean period
- Herodian period
- c. 30 CE
- 70 CE

Every period camera declares a `coordinateRole` and a note explaining what the camera does and does not claim. The UI now exposes BCE/CE ranges for period states instead of leaving them only in JSON.

The scene separates the southeastern ridge / City of David archaeological zone, Gihon Spring, Kidron Valley, Mount of Olives, Temple Mount precinct, Siloam Tunnel, Second Temple Pool of Siloam, Moriah association, Zion semantics, and the unknown First Temple footprint.

### 2. First Temple uncertainty is encoded, not merely described

The exact First Temple footprint is represented by a dedicated warning hotspot with:

- `evidenceClass: unknown-disputed`
- `confidence: unknown`

The physical Temple Mount / Haram al-Sharif precinct remains an `identified-site` in the inherited atlas data. This allows the scene to show established physical geography without pretending direct excavation has supplied an exact First Temple building plan.

### 3. Moriah + Zion concept explorer

`public/data/immersive/scenes/moriah-zion-meaning-explorer.json`

Batch 4 generalizes the existing comparison presentation with a third mode, `concepts`. This is intentionally different from `alternatives` and `regions`: textual meanings are not being presented as rival candidate sites.

The explorer provides lenses for:

- Zion in 2 Samuel 5
- later broadened Zion usage
- Moriah in Genesis 22
- Moriah in 2 Chronicles 3:1
- Temple Mount as a physical precinct

The inherited `zion-biblical` record remains coordinate-free. Scene hotspots that must occupy a clickable map position explicitly explain that the coordinate is a display anchor and is **not** written back to Zion as a geographic identification.

The inherited Moriah record remains `traditional-site`. The Genesis 22 lens uses only a `display-anchor`; the 2 Chronicles lens uses the inherited traditional association.

### 4. New regression audit

`scripts/audit-v2-batch4.mjs`

The audit fails if a future change:

- adds coordinates to `zion-biblical`
- changes Moriah away from `traditional-site`
- changes the physical Temple Mount record away from `identified-site`
- removes required Jerusalem subsystem records
- removes core period states
- represents the exact First Temple footprint as known
- removes the explanation that Zion scene anchors are not Zion coordinates
- changes the Moriah/Zion explorer away from conceptual lenses
- turns the Genesis 22 Moriah view into a located candidate/site camera

The audit is included in `npm run check`.

## Assets and historical verification

Batch 4 introduces **0 bundled visual bytes**. It does not claim to ship:

- verified DEM terrain
- ancient wall polygons
- First Temple building footprints
- Herodian architectural meshes
- historical street networks
- photogrammetry
- panoramas
- third-party archaeological plans or photography

Live web browsing remains unavailable in this environment, so no new external bibliography or license has been marked primary-verified. The scene uses already-curated v1 source records and project-authored methodological distinctions.

## Verification performed

`npm run check` passed after the Batch 4 changes. The check runs:

- atlas data validation across all nine v1 content packs
- immersive scene validation
- the new V2 Batch 4 Jerusalem audit
- v1 historical editorial audits
- provenance audit
- Batch 11 production-hardening audit
- static repository checks

At the time of this report the immersive validator reports 7 scenes, 0 bundled visual bytes, and valid scene/place/source links.

Additional verification performed:

- a TypeScript syntax-transpilation pass covered all 32 `src/**/*.ts` / `src/**/*.tsx` files with 0 syntax diagnostics
- `npm test` was invoked and could not start because `vitest` is not installed (`node_modules` is absent)
- `npm run build` was invoked; its prebuild phase successfully reran the full checks, rebuilt the 9-pack content manifest, and rebuilt the 1,006-document static search corpus, then `tsc -b` stopped because `vite/client` and Node type definitions are unavailable without installed dependencies

Previous dependency-install attempts were blocked by npm registry DNS/network access. This report therefore does **not** claim Vitest, full dependency-backed type checking, or the Vite production bundle passed.

## What Batch 5 should add

Batch 5 should move north and east into the Gospel landscape while reusing the systems built in Batches 1–4:

- Sea of Galilee regional scene
- Capernaum
- Nazareth hills
- Caesarea Philippi region
- Judean wilderness
- Bethany / Mount of Olives
- Jesus' ministry geography linked to existing Gospel journeys and stories
- period-aware first-century environmental context
- no invented route segments or exact unnamed-mountain identifications

The more specialized Passion-location candidate work remains Batch 6.
