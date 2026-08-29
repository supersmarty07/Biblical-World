# V2 verification packet integration

Version target: `2.0.0-alpha.9`

This phase imports the user-supplied **THE BIBLICAL WORLD V2 — VERIFIED SOURCE & ASSET PACKET** into the repository as structured metadata. The packet was supplied as `New info 2_260830_020629.pdf` on 2026-08-30.

## Verification boundary

The current execution environment has no live web access. Therefore this build does **not** relabel packet claims as independently live-verified by the application team. Machine-readable records use the packet as a research provenance source and preserve qualifications, restrictions, and unresolved issues.

No raw third-party terrain, road, archaeological, or image asset bytes were supplied with the packet. Consequently this phase does **not** pretend that the 95–100% research-readiness scores mean the corresponding production assets are already installed.

## Integrated now

- `public/data/verification/registry.json` stores packet-derived resource licensing, historical guardrails, identifiers, and scene integration status.
- Verified Pleiades IDs from the packet are attached to matching existing atlas place records using `externalIds.pleiades`.
- Packet-supplied Wikidata QIDs are attached only to the six records explicitly listed in the packet.
- The place information panel exposes external identifiers without using Wikidata coordinates as geographic evidence.
- Immersive scenes display packet-backed verification context separately from v1 source records.
- Optional DARE/AWMC-style Roman-road GeoJSON is supported through `VITE_ROMAN_ROADS_GEOJSON_URL`; the app never requires ORBIS.
- CI validates verification-registry integrity, place/scene links, license-risk classifications, and the continued absence of forbidden coordinate claims.

## Deliberately not integrated yet

- Copernicus GLO-30 bytes: not supplied.
- DARE `roads.geojson`: not supplied in the conversation.
- Specific Open Context Megiddo dataset: repository-level licensing is not enough; a concrete dataset DOI/license is still required before ingestion.
- Historical coastline polygons: not supplied; these must be independently authored derived reconstructions and labeled as such.
- Jerusalem bare-earth/ancient-surface mesh: not supplied and remains interpretive.
- Matson/Met/Wikimedia image assets: individual asset verification remains required before binding. The packet contains at least one mixed-source image entry, so no image bytes are imported automatically.

## Safety rules retained

The integration must never turn research readiness into historical certainty. Mount Sinai, Yam Suph crossing, First Temple footprint, textual Golgotha/tomb, unnamed Transfiguration mountain, and Revelation's visionary geography retain their existing uncertainty/coordinate-free rules.
