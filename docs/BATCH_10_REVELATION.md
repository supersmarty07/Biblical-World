# Batch 10 — Revelation + Final Integration

## Objective

Complete the Genesis → Revelation atlas while keeping Revelation’s **historical geography** and **visionary geography** in different visual/epistemic systems.

## Historical geography scope

- Patmos
- the seven churches in Roman Asia
- first-century Roman provincial context
- later Patmos reception tradition
- selected archaeological contexts at Pergamum, Sardis, and western Asia Minor

## Visionary geography policy

The following are not normal map pins:

- heavenly throne room
- Abyss
- Babylon the Great
- Har-Magedon
- Gog and Magog
- lake of fire
- New Jerusalem
- river and tree of life

These entities remain data records with source/provenance fields, but the UI uses `VisionaryOverlay` instead of terrestrial MapLibre coordinates.

## Seven Churches

The seven churches are real historical cities. The generated connector is a **textual-order visualization**:

```text
Ephesus → Smyrna → Pergamum → Thyatira → Sardis → Philadelphia → Laodicea
```

It is not claimed to be the exact route of John, a courier, or any known ancient road itinerary.

## Patmos

Patmos is established at island scale. The exact location of John’s vision is unknown. The Cave of the Apocalypse is included separately as a later traditional site.

## Dating

A late-first-century setting is used for contextual map layers. The John-on-Patmos event stores a conventional 81–100 CE window and explicitly notes that a Domitianic date is traditional/common but debated. The text itself does not name Domitian.

## John of Patmos

`john-of-patmos` is intentionally distinct from `john-zebedee`. Traditional identification is important reception history, but the data model does not encode the identification as established historical fact.

## Pergamum

Pergamum is secure. The Great Altar is secure archaeology. The equation:

```text
Great Altar = “Satan's throne”
```

is **not** secure and remains a low-confidence interpretive proposal.

## Babylon the Great

The visionary Babylon record has no coordinates. Rome is described as a strong first-century referent in many scholarly readings, but the application does not replace the symbolic entity with a Rome pin or with the ruins of Mesopotamian Babylon.

## Har-Magedon

The text’s place-name remains unpinned. The possible relationship to Megiddo is documented as an interpretation; Tell Megiddo is not silently reused as the Revelation 16 battlefield coordinate.

## New Jerusalem

New Jerusalem is rendered as a geometric visionary visualization. The app shows:

- 12,000 stadia
- length = width = height
- 144-cubit wall measure
- approximate modern conversion caveat

No Earth coordinate is assigned.

## Final canonical integration story

`story-genesis-to-revelation` returns to earlier data records rather than duplicating them:

1. Eden — deliberately unlocated
2. Jerusalem — real historical/archaeological city with layered sacred geography
3. Patmos — real island
4. New Jerusalem — visionary city
5. river/tree of life — final symbolic connection to Genesis

This final story demonstrates the project’s core rule: **different kinds of biblical geography deserve different cartographic treatment**.

## Technical additions

- `VisionaryScene` TypeScript/Zod model
- `visionary-scenes.json`
- `visionarySceneId` on story chapters
- `VisionaryOverlay.tsx`
- dedicated symbolic SVG/CSS animation system
- timeline extended through 110 CE
- Revelation included in runtime loader and search builder
- `audit-batch10.mjs`
- version bump to 1.0.0
