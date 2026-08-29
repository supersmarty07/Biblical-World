# v1.1.1 runtime data hotfix

Fixes two optional `personId` fields serialized as JSON `null` in `public/data/united-monarchy/journeys.json`. The runtime Zod schema accepts a string or an omitted field, but not `null`.

Affected records:
- `journey-ark-philistia`
- `journey-phoenician-supply`

The `personId` keys are now omitted, and `validate-data.mjs` rejects non-string present `personId` values.
