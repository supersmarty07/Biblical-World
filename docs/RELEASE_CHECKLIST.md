# Public Release Checklist

## Required automated gates

```bash
npm install
npm test
npm run check
npm run build
```

All GitHub pull requests run the same quality gates through `.github/workflows/quality.yml`.

## Scholarly source verification

Before describing the atlas as an academic/reference edition:

- work through `docs/SOURCE_VERIFICATION_QUEUE.md`;
- replace generic bibliography entries with stable locators where possible;
- record DOI/ISBN/edition/page numbers for material claims;
- verify official dataset/image licenses and exact attribution wording;
- add check/access dates;
- ensure a source supports the exact mapped claim, not merely the general historical period;
- preserve disagreement and alternative identifications in the UI.

## Scripture text

The current repository stores Scripture references and summaries, not the complete Bible text.

Before bundling a translation:

- verify the official license directly;
- preserve the original license/attribution record;
- document the downloaded version/date;
- validate book/chapter/verse structure;
- keep translation text separate from project-authored summaries.

## Geospatial assets

For any production PMTiles/terrain layer:

- verify redistribution rights;
- record source/version/license;
- verify Range + CORS behavior on the hosting origin;
- check tile attribution in the map UI;
- keep large files outside the normal Git repository;
- test GitHub Pages base-path deployment.

## Accessibility

Before public launch, manually test:

- keyboard-only search, stories, layer controls, timeline, and information panel;
- focus visibility and search-dialog focus return;
- mobile screen-reader navigation;
- reduced-motion mode;
- text zoom to 200%;
- color contrast;
- map alternatives via search/story/info panels.

## Performance

Test on a mid-range mobile device:

- first load;
- search responsiveness;
- story transitions;
- map pan/zoom;
- service-worker update behavior;
- offline revisit after first successful load;
- optional PMTiles with Range requests.

## Release metadata

Before tagging a public release:

- update `package.json` version;
- update README version/status;
- regenerate content manifest and search corpus;
- regenerate provenance report/queue;
- run ZIP/repository integrity check;
- tag the Git commit;
- retain the exact source-verification state with the release.

## V2 integrated journeys and scenes

Before a V2 release candidate:

- verify direct search opens places, people, events, stories, journeys, and immersive scenes;
- test `?journey=...&segment=...` deep links on a GitHub Pages repository subpath;
- test Journey mode with keyboard, touch, and reduced motion;
- confirm segment route-certainty text remains visible and is not replaced by a generic route animation claim;
- confirm scene deep links preserve candidate/period state where specified by guided stories;
- verify service-worker update behavior does not pair a new shell with stale immersive/search manifests;
- test optional PMTiles requests still bypass the service worker through HTTP Range requests;
- work through `V2_VERIFICATION_INPUTS.md` before promoting any third-party visual/data asset to verified/ready status.

## V2 external/derived asset gate

- [ ] `npm run validate:assets` passes.
- [ ] Every installed bundled asset has recorded SHA-256 and byte size.
- [ ] External terrain PMTiles is HTTPS and its host supports CORS + HTTP Range requests.
- [ ] Service worker still bypasses Range requests.
- [ ] DARE/AWMC attribution is visible when corresponding road data is deployed.
- [ ] No ORBIS or Digital Augustan Rome data is a required production runtime dependency without an appropriate commercial license.
- [ ] Every Open Context archaeological dataset has its specific DOI/license recorded before ingestion.
- [ ] Every derived paleogeographic layer has citations, an uncertainty statement, independent-authorship metadata, and `noExactEventCoordinateClaims=true`.
- [ ] Every hosted museum/photographic image has an individual item-level license record; collection-level policy alone is insufficient.
- [ ] Research-packet readiness is not presented as installed-asset readiness.
