# V2 deployment + immersive terrain — alpha.12

The Biblical World remains a frontend-only Vite/React/MapLibre application. GitHub Pages hosts the shell, JSON, small GeoJSON, PWA files, and lightweight fallbacks. Large terrain/media should remain on a static HTTPS object origin such as Cloudflare R2 or S3/CloudFront.

## GitHub Pages branch

For this repository the Pages workflow auto-runs on both `main` and the working deployment branch `bible-world-v2`. Manual `workflow_dispatch` remains available.

## GitHub Pages base path

The deployment workflow sets:

```text
VITE_BASE_PATH=/${{ github.event.repository.name }}/
```

All application-owned assets must use `import.meta.env.BASE_URL` or the project URL helpers. Do not hard-code root `/data/...` paths.

## Optional GitHub repository Variables

The Pages workflow accepts these repository Variables:

- `VITE_TERRAIN_PMTILES_URL`
- `VITE_TERRAIN_JERUSALEM_PMTILES_URL`
- `VITE_TERRAIN_GALILEE_PMTILES_URL`
- `VITE_TERRAIN_MEGIDDO_PMTILES_URL`
- `VITE_TERRAIN_SINAI_PMTILES_URL`
- `VITE_TERRAIN_DELTA_PMTILES_URL`
- `VITE_BASEMAP_PMTILES_URL`
- `VITE_BASEMAP_ATTRIBUTION`
- `VITE_ROMAN_ROADS_GEOJSON_URL`
- `VITE_ROMAN_ROADS_SOURCE_ID` (`dare-roman-roads` or `awmc-antiquity-alacarte`)

Leaving them unset produces the lightweight bundled fallback build.

An external basemap is deliberately ignored unless `VITE_BASEMAP_ATTRIBUTION` is also set. This prevents a runtime layer from being deployed without a truthful credit string.


## Regional immersive terrain

Alpha.12 supports one PMTiles archive per flagship world. Scene-specific terrain variables fall back to `VITE_TERRAIN_PMTILES_URL` if unset. This is useful for keeping Jerusalem, Galilee, Megiddo, Sinai, and Delta archives independently cacheable and replaceable.

The local 3D site-extrusion layer does **not** depend on these URLs. If no DEM is configured, users still receive a pitched 3D site map with explanatory geometry over a flat elevation base. The UI states this limitation explicitly.

The research-supplied Copernicus identifiers in `public/data/terrain/regions.json` are not downloadable terrain bytes and must not be treated as an installed asset.

## PMTiles origin requirements

Terrain/basemap PMTiles origins must:

1. use HTTPS;
2. permit browser CORS access from the GitHub Pages origin;
3. honor `Range: bytes=...` requests and return a byte-range response;
4. avoid transformations that strip `Content-Range`/range semantics;
5. support normal browser caching/CDN behavior.

The service worker bypasses requests containing a `Range` header. It must never cache-intercept PMTiles range traffic.

## Runtime deployment diagnostics

The desktop Layers panel includes a deployment-diagnostics drawer. It performs bounded, no-cache browser probes:

- PMTiles: one-byte `Range: bytes=0-0` request to test HTTPS/CORS/range capability.
- Roman roads: HEAD request with a small range fallback where HEAD is not supported.

The check is diagnostic, not a historical verification step.

Successful diagnostics can trigger MapLibre to retry a previously failed external source without reloading the page.

## Failure behavior

External assets are optional enhancements:

- terrain failure -> flatten to the normal atlas map;
- external basemap failure -> retain bundled Natural Earth;
- Roman-road failure -> hide the road context layer while places/journeys continue functioning;
- verification/asset manifest failure inside an immersive scene -> scene content remains usable with a visible metadata error.

No external asset failure should cause the core biblical data loader to fail.

## Attribution

A dedicated Sources/Data drawer builds active credits from the verification registry and asset manifest. Natural Earth, Pleiades/Wikidata cross-links, configured terrain, and configured roads are credited according to the active resource metadata.

Non-commercial ORBIS and Digital Augustan Rome data remain research/reference resources, not required production runtime dependencies.

## Production checklist

Before release:

- Run `npm test`.
- Run `npm run check`.
- Run `npm run build` with the repository base path.
- Deploy to the actual Pages URL.
- Open Layers -> Deployment diagnostics and run the browser checks.
- Verify deep links containing `?scene=`, `?journey=`, `?variant=`, and `?period=`.
- Verify mobile portrait and landscape behavior.
- Verify reduced-motion behavior.
- Verify attribution drawer entries against the assets actually enabled in the deployment.
- Confirm no unverified or non-commercial source was promoted into the production runtime.
