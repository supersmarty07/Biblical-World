# Batch 3 — Exodus → Judges

## Goal

Extend the production atlas from Genesis through the end of Judges without turning debated biblical geography into false cartographic certainty.

Batch 3 is implemented as a second static content pack under `public/data/exodus-judges/`. Genesis remains a separate pack. The runtime merges packs after Zod validation, while the build validator checks cross-pack IDs and references.

## Production content added

- 75 new places / regions / archaeological anchors
- 23 people
- 27 events
- 11 animated journeys
- 12 guided stories
- 10 time-aware historical-context regions
- 10 new source records
- expanded character-art support for Moses, Joshua, Deborah, Gideon, and Samson

Combined with Batch 2, the loaded atlas now contains:

- 109 places
- 38 people
- 39 events
- 17 journeys
- 17 guided stories
- 17 source records
- 14 context regions

## Geographic research rules

### Egypt and the departure

- Rameses is mapped to the Pi-Ramesses/Qantir complex as a **probable biblical identification** while keeping the archaeological city separate from claims about the biblical event.
- Pithom is **disputed**. Tell el-Maskhuta and Tell er-Retaba are separate candidate records.
- Succoth, Etham, Pi-hahiroth, Migdol, and Baal-zephon remain unpinned when no responsible unique coordinate is available.
- The sea crossing is represented by an unlocated `Yam Suph / Sea Crossing Region` record with interpretation families rather than a definitive crossing pin.
- The Pharaoh of the Exodus is explicitly unnamed. No Ramesside king is silently substituted for the biblical text.

### Sinai and the wilderness

- Leviticus is represented through its repeated Sinai framing, preserving canonical geographic continuity without assigning Sinai a coordinate.

- Biblical Mount Sinai/Horeb has **no coordinate**.
- Jebel Musa is a separate **traditional-site** record.
- Har Karkom is a separate **candidate-site** record with low interpretive confidence.
- Marah, Elim, Wilderness of Sin, Rephidim, Hazeroth, and Kibroth-hattaavah remain unlocated.
- Kadesh-barnea is shown at the ʿAin el-Qudeirat oasis complex as a **probable** identification while warning that its Iron Age remains do not date every wilderness tradition.
- Mount Hor is shown at Jabal Harun only as a **traditional** identification.

### Transjordan

- Moab is a broad regional anchor, not a fixed polygon.
- Arnon/Wadi Mujib and Dibon/Dhiban are high-confidence geographic identifications.
- Heshbon/Tell Hesban is marked probable because site identification and narrative chronology are distinct problems.
- Mount Nebo is a probable ridge-level identification; the exact summit and Moses' burial location are not claimed.

### Joshua

- Jericho/Tell es-Sultan is geographically **established** while the Joshua 6 archaeological-event correlation is explicitly **disputed**.
- Ai reuses the Batch 2 disputed record and the guided story surfaces the occupation-history problem associated with et-Tell.
- Gibeon, Hazor, Shiloh, Mount Ebal, Mount Gerizim, Megiddo, Taanach, and Beth-shean are mapped at their well-established ancient sites/landforms.
- Exact campaign lines are schematic. A narrative sequence between known endpoints is not treated as an excavated road.
- Gilgal remains unlocated.

### Judges

- Deborah/Barak uses strong regional anchors such as Kedesh, Mount Tabor, and the Kishon; Harosheth-hagoyim remains unpinned.
- Gideon's Ophrah remains unlocated; the Spring of Harod is shown at the common ʿAin Jalud identification as probable.
- Jephthah's broad Gilead setting is mapped, while Mizpah of Gilead remains unlocated.
- Samson's major frontier geography uses Zorah, Timnah, the Sorek Valley, Ashkelon, and Gaza; Lehi remains unlocated.
- Early Judges material now includes Othniel/Debir, Ehud/Moab/Jericho, and Abimelech/Shechem/Thebez.
- Judges 18 maps the Danite migration to securely identified Tel Dan while treating the route as reconstruction.
- Judges 19–21 adds Bethlehem, probable Gibeah and Mizpah candidates, unlocated Jabesh-gilead, and established Shiloh without inventing precise battle polygons.

## Tribal allotments

Batch 3 does **not** ship hard-edged tribal-allotment polygons. Joshua 13–21 contains textual boundary traditions, but a responsible cartographic product requires careful boundary-by-boundary scholarly tracing. The project deliberately prefers an explicit omission over low-quality synthetic polygons. Shiloh and the allotment event are represented, and a later cartographic sub-batch can add translucent textual-allotment reconstructions with source-by-source provenance.

## Historical-context timeline

The context slider now supports broad lenses such as:

- New Kingdom Egypt
- Late Bronze Canaanite city-state zone
- Sinai geographic context
- Midian / northwest Arabia orientation
- Moab core-region orientation
- Early Iron highland settlement zone
- Philistine coastal heartland
- Canaanite lowland persistence

These are intentionally generalized cultural/geographic envelopes, not surveyed political borders.

## Guided stories

1. Exodus — From Egypt to the Sea
2. Sinai & Wilderness — Covenant and Uncertainty
3. Toward Moab — The Final Wilderness Route
4. Joshua — Jordan, Jericho, and the Central Highlands
5. Joshua — Gibeon, Hazor, and Shiloh
6. Deborah & Barak — Tabor and the Kishon
7. Gideon — Harod and the Midianite Pursuit
8. Jephthah — Gilead and Ammon
9. Samson — The Philistine Frontier
10. Early Judges — Othniel, Ehud, and Abimelech
11. Danite Migration — From Zorah to Laish
12. End of Judges — Gibeah and Civil War

## Source posture

Batch 3 uses the canonical text as the primary source for narrative sequence and established academic works as orientation for archaeology and historical geography. It does not reproduce proprietary atlas maps or copyrighted source text.

Important source families include:

- *The Sacred Bridge* — Rainey & Notley
- *The Anchor Yale Bible Dictionary* — Freedman, ed.
- *The Oxford History of the Biblical World* — Coogan, ed.
- *Israel in Egypt* — Hoffmeier
- *Ancient Israel in Sinai* — Hoffmeier
- *Who Were the Early Israelites and Where Did They Come From?* — Dever
- *The Archaeology of the Israelite Settlement* — Finkelstein
- *Digging Up Jericho* — Kenyon
- *The Archaeology of Ancient Israel* — Ben-Tor, ed.
- *The Archaeology of Jordan* — MacDonald, Adams & Bienkowski, eds.

These sources represent different scholarly approaches. Inclusion does not imply that the atlas adopts every conclusion in any one work.

## Release caveat

Live web access was unavailable in the implementation environment. Therefore current publisher pages, page-level citations, precise upstream gazetteer IDs, and current official license wording were not independently refreshed during Batch 3. The application uses conservative summaries and records this limitation rather than fabricating verification.
