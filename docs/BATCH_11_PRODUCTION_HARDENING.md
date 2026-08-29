# Batch 11 — v1.1 Production & Scholarly Hardening

## Purpose

Batch 11 does not add another biblical era. Genesis → Revelation was completed in Batch 10. This release hardens the application and research workflow around the existing corpus.

## Goals

1. Remove the MiniSearch dependency and its local-build bottleneck.
2. Make search deterministic and testable with no runtime search dependency.
3. Add a generated content-pack manifest.
4. Add machine-readable provenance health reporting.
5. Create a complete live-verification review queue rather than claiming unverified bibliography is authoritative.
6. Improve keyboard/focus accessibility and reduced-motion behavior.
7. Add conservative PWA/runtime caching without interfering with PMTiles Range requests.
8. Add pull-request quality gates and a Batch 11 regression audit.
9. Preserve all Batch 4–10 historical guardrails unchanged.

## Search architecture

The search corpus contains 1,006 documents:

```text
405 places
246 people
265 events
90 stories
```

Scoring is deterministic. The engine requires every query token to match the same document and weights exact names, prefixes, aliases, Scripture references, dates, and summaries differently. Bounded Levenshtein distance is used only for longer tokens.

No external search library is needed.

## Provenance model

The `SourceRef` schema now has optional fields ready for live source verification:

```text
verificationStatus
verificationNote
accessedAt
doi
isbn
edition
pages
```

The structural audit never promotes an external source to “verified” automatically.

Possible future verification statuses are:

```text
project-authored
primary-verified
research-supplied
needs-verification
```

A `primary-verified` record must have a stable URL and a checked date.

## PWA policy

The service worker is intentionally narrow:

- same-origin only;
- GET requests only;
- navigation uses network-first with cached fallback;
- app/data assets use stale-while-revalidate;
- Range requests are bypassed;
- external PMTiles are not silently cached.

This keeps GitHub Pages deployment simple and avoids corrupting PMTiles byte-range behavior.

## Accessibility policy

The map is a visual enhancement, not the only content interface. Unlocated records, map points, events, people, and stories remain accessible through ordinary HTML controls.

Reduced-motion users receive instantaneous MapLibre camera moves and completed route geometry instead of animated fly/route sequences.

## Explicit non-goals

Batch 11 does **not**:

- claim external source records have been checked live;
- download or redistribute Pleiades, Copernicus, OSM, museum imagery, or other third-party datasets;
- bundle the complete BSB/WEB text without official-source verification;
- invent DOI/page/license metadata;
- add speculative historical claims merely to increase content count.
