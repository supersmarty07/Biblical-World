import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dataRoot = path.join(root, 'public', 'data');
const immersiveRoot = path.join(dataRoot, 'immersive');
const catalogPath = path.join(immersiveRoot, 'manifest.json');
const errors = [];
const MAX_CATALOG_BYTES = 128 * 1024;
const MAX_SCENE_JSON_BYTES = 256 * 1024;
const MAX_BUNDLED_ASSET_BYTES = 4 * 1024 * 1024;
const MAX_BUNDLED_TOTAL_BYTES = 12 * 1024 * 1024;

const fail = (message) => errors.push(message);
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const isId = (value) => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
const isString = (value) => typeof value === 'string' && value.trim().length > 0;
const inRange = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

const packNames = (await fs.readdir(dataRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !['generated', 'basemap', 'immersive', 'verification', 'assets'].includes(entry.name))
  .map((entry) => entry.name);

const placeIds = new Set();
const sourceIds = new Set();
for (const pack of packNames) {
  for (const place of await readJson(path.join(dataRoot, pack, 'places.json'))) placeIds.add(place.id);
  for (const source of await readJson(path.join(dataRoot, pack, 'sources.json'))) sourceIds.add(source.id);
}

const catalogStat = await fs.stat(catalogPath);
if (catalogStat.size > MAX_CATALOG_BYTES) fail(`immersive manifest is too large: ${catalogStat.size} bytes`);
const catalog = await readJson(catalogPath);
if (catalog.schemaVersion !== 1) fail('immersive manifest: schemaVersion must be 1');
if (!Array.isArray(catalog.scenes)) fail('immersive manifest: scenes must be an array');

const catalogIds = new Set();
const sceneIndex = new Map();
let bundledBytes = 0;
for (const entry of catalog.scenes || []) {
  if (!isId(entry.id)) fail(`immersive manifest: invalid scene id ${String(entry.id)}`);
  if (catalogIds.has(entry.id)) fail(`immersive manifest: duplicate scene id ${entry.id}`);
  catalogIds.add(entry.id);
  if (!['map-terrain', 'panorama', 'parallax'].includes(entry.renderer)) fail(`${entry.id}: unsupported renderer ${entry.renderer}`);
  if (!['prototype', 'ready'].includes(entry.availability)) fail(`${entry.id}: unsupported availability ${entry.availability}`);
  if (!isString(entry.scenePath) || !/^data\/immersive\/scenes\/[a-z0-9-]+\.json$/.test(entry.scenePath)) fail(`${entry.id}: scenePath must stay under data/immersive/scenes`);
  for (const placeId of entry.placeIds || []) if (!placeIds.has(placeId)) fail(`${entry.id}: unknown catalog placeId ${placeId}`);

  const file = path.join(root, 'public', entry.scenePath || '');
  let scene;
  try {
    const stat = await fs.stat(file);
    if (stat.size > MAX_SCENE_JSON_BYTES) fail(`${entry.id}: scene JSON is too large (${stat.size} bytes)`);
    scene = await readJson(file);
  } catch (error) {
    fail(`${entry.id}: cannot read scene JSON: ${error.message}`);
    continue;
  }

  sceneIndex.set(entry.id, scene);
  if (scene.schemaVersion !== 1) fail(`${entry.id}: schemaVersion must be 1`);
  if (scene.id !== entry.id) fail(`${entry.id}: scene id does not match catalog`);
  if (scene.renderer !== entry.renderer) fail(`${entry.id}: renderer does not match catalog`);
  if (scene.availability !== entry.availability) fail(`${entry.id}: availability does not match catalog`);
  if (!isString(scene.disclaimer)) fail(`${entry.id}: disclaimer is required`);
  for (const placeId of scene.placeIds || []) if (!placeIds.has(placeId)) fail(`${entry.id}: unknown scene placeId ${placeId}`);
  if (entry.renderer === 'map-terrain' && !scene.entryCamera) fail(`${entry.id}: map-terrain scene requires entryCamera`);
  if (entry.renderer === 'panorama' && !scene.panorama) fail(`${entry.id}: panorama scene requires panorama configuration`);
  if (entry.renderer === 'parallax' && !scene.parallax) fail(`${entry.id}: parallax scene requires parallax configuration`);

  if (scene.entryCamera) {
    const [lon, lat] = scene.entryCamera.center || [];
    if (!inRange(lon, -180, 180) || !inRange(lat, -90, 90)) fail(`${entry.id}: invalid entryCamera center`);
    if (scene.entryCamera.pitch !== undefined && !inRange(scene.entryCamera.pitch, 0, 85)) fail(`${entry.id}: invalid entryCamera pitch`);
  }
  if (scene.panorama) {
    if (!inRange(scene.panorama.initialPan, 0, 1)) fail(`${entry.id}: panorama.initialPan must be 0..1`);
    if (!inRange(scene.panorama.worldWidthPercent, 100, 400)) fail(`${entry.id}: panorama.worldWidthPercent must be 100..400`);
    if (!isString(scene.panorama.alt)) fail(`${entry.id}: panorama alt text is required`);
  }

  const periodIds = new Set((scene.periods || []).map((period) => period.id));
  if (scene.defaultPeriodId && !periodIds.has(scene.defaultPeriodId)) fail(`${entry.id}: defaultPeriodId must reference a declared period`);
  for (const period of scene.periods || []) {
    if (!isId(period.id) || !isString(period.label) || !isString(period.note)) fail(`${entry.id}: periods require id, label, and note`);
    if (period.camera) {
      const [lon, lat] = period.camera.center || [];
      if (!inRange(lon, -180, 180) || !inRange(lat, -90, 90)) fail(`${entry.id}/${period.id}: invalid period camera center`);
      if (!['identified-site', 'approximate-area', 'candidate-site', 'traditional-site', 'display-anchor'].includes(period.camera.coordinateRole)) fail(`${entry.id}/${period.id}: period camera requires an explicit coordinateRole`);
      if (!isString(period.camera.note)) fail(`${entry.id}/${period.id}: period camera requires a note explaining its coordinate role`);
    }
  }

  const comparisonIds = new Set();
  if (scene.comparison) {
    if (scene.comparison.presentation && !['alternatives', 'regions', 'concepts'].includes(scene.comparison.presentation)) fail(`${entry.id}: unsupported comparison presentation`);
    if (!isString(scene.comparison.label) || !isString(scene.comparison.intro)) fail(`${entry.id}: comparison label and intro are required`);
    if (!Array.isArray(scene.comparison.options) || scene.comparison.options.length < 2) fail(`${entry.id}: comparison requires at least two options`);
    for (const option of scene.comparison.options || []) {
      if (!isId(option.id) || comparisonIds.has(option.id)) fail(`${entry.id}: comparison option ids must be unique ids`);
      comparisonIds.add(option.id);
      if (!['established', 'probable', 'possible', 'traditional', 'disputed', 'unknown', 'symbolic'].includes(option.status)) fail(`${entry.id}/${option.id}: invalid comparison status`);
      if (!isString(option.summary) || !isString(option.rationale)) fail(`${entry.id}/${option.id}: comparison summary and rationale are required`);
      if (!Array.isArray(option.sourceIds) || option.sourceIds.length === 0) fail(`${entry.id}/${option.id}: comparison sourceIds required`);
      for (const sourceId of option.sourceIds || []) if (!sourceIds.has(sourceId)) fail(`${entry.id}/${option.id}: unknown comparison sourceId ${sourceId}`);
      for (const placeId of option.placeIds || []) if (!placeIds.has(placeId)) fail(`${entry.id}/${option.id}: unknown comparison placeId ${placeId}`);
      if (option.camera) {
        const [lon, lat] = option.camera.center || [];
        if (!inRange(lon, -180, 180) || !inRange(lat, -90, 90)) fail(`${entry.id}/${option.id}: invalid comparison camera center`);
        if (!['identified-site', 'approximate-area', 'candidate-site', 'traditional-site', 'display-anchor'].includes(option.camera.coordinateRole)) fail(`${entry.id}/${option.id}: comparison camera requires an explicit coordinateRole`);
        if (!isString(option.camera.note)) fail(`${entry.id}/${option.id}: comparison camera requires a note explaining its coordinate role`);
      }
      if (option.fallbackEnvironment && !['mountain-wilderness', 'delta-marsh', 'gulf-coast', 'arid-gulf', 'coastal-plain', 'central-highlands', 'jezreel-lowlands', 'jordan-valley', 'shephelah', 'galilean-hills', 'galilee-lakeshore', 'judean-wilderness', 'negev'].includes(option.fallbackEnvironment)) fail(`${entry.id}/${option.id}: unsupported fallback environment`);
    }
    if (!comparisonIds.has(scene.comparison.defaultOptionId)) fail(`${entry.id}: comparison.defaultOptionId must reference a declared option`);
  }

  const assets = new Map();
  for (const asset of scene.assets || []) {
    if (!isString(asset.id) || assets.has(asset.id)) fail(`${entry.id}: asset ids must be unique non-empty strings`);
    assets.set(asset.id, asset);
    if (!['bundled', 'external'].includes(asset.hosting)) fail(`${entry.id}/${asset.id}: invalid hosting`);
    if (!isString(asset.provenance?.notes) || !isString(asset.provenance?.verificationStatus)) fail(`${entry.id}/${asset.id}: provenance status and notes are required`);
    if (asset.provenance?.verificationStatus === 'primary-verified' && !asset.provenance?.sourceUrl) fail(`${entry.id}/${asset.id}: primary-verified asset requires sourceUrl`);
    if (asset.hosting === 'external') {
      if (!/^https:\/\//.test(asset.src || '')) fail(`${entry.id}/${asset.id}: external asset must use https`);
      if (entry.availability === 'ready' && asset.provenance?.verificationStatus === 'needs-verification') fail(`${entry.id}/${asset.id}: ready scene cannot depend on an unverified external asset`);
    } else {
      if (!isString(asset.src) || asset.src.startsWith('/') || asset.src.includes('..')) fail(`${entry.id}/${asset.id}: bundled asset src must be a safe public-relative path`);
      else {
        try {
          const stat = await fs.stat(path.join(root, 'public', asset.src));
          bundledBytes += stat.size;
          if (stat.size > MAX_BUNDLED_ASSET_BYTES) fail(`${entry.id}/${asset.id}: bundled asset exceeds 4 MiB budget`);
        } catch (error) {
          fail(`${entry.id}/${asset.id}: bundled asset missing: ${error.message}`);
        }
      }
    }
  }

  if (scene.panorama?.assetId && !assets.has(scene.panorama.assetId)) fail(`${entry.id}: panorama assetId does not exist`);
  for (const assetId of scene.parallax?.layerAssetIds || []) if (!assets.has(assetId)) fail(`${entry.id}: parallax asset ${assetId} does not exist`);
  for (const option of scene.comparison?.options || []) if (option.panoramaAssetId && !assets.has(option.panoramaAssetId)) fail(`${entry.id}/${option.id}: comparison panoramaAssetId does not exist`);

  const legendClasses = new Set((scene.evidenceLegend || []).map((item) => item.class));
  const hotspotIds = new Set();
  for (const hotspot of scene.hotspots || []) {
    if (!isString(hotspot.id) || hotspotIds.has(hotspot.id)) fail(`${entry.id}: hotspot ids must be unique`);
    hotspotIds.add(hotspot.id);
    if (!legendClasses.has(hotspot.evidenceClass)) fail(`${entry.id}/${hotspot.id}: hotspot evidence class is missing from the scene legend`);
    if (!Array.isArray(hotspot.sourceIds) || hotspot.sourceIds.length === 0) fail(`${entry.id}/${hotspot.id}: sourceIds required`);
    for (const sourceId of hotspot.sourceIds || []) if (!sourceIds.has(sourceId)) fail(`${entry.id}/${hotspot.id}: unknown sourceId ${sourceId}`);
    if (hotspot.placeId && !placeIds.has(hotspot.placeId)) fail(`${entry.id}/${hotspot.id}: unknown placeId ${hotspot.placeId}`);
    for (const variantId of hotspot.variantIds || []) if (!comparisonIds.has(variantId)) fail(`${entry.id}/${hotspot.id}: unknown comparison variantId ${variantId}`);
    for (const periodId of hotspot.periodIds || []) if (!periodIds.has(periodId)) fail(`${entry.id}/${hotspot.id}: unknown periodId ${periodId}`);
    if (hotspot.position?.kind === 'image') {
      if (!inRange(hotspot.position.x, 0, 1) || !inRange(hotspot.position.y, 0, 1)) fail(`${entry.id}/${hotspot.id}: image position must be normalized 0..1`);
    } else if (hotspot.position?.kind === 'geographic') {
      const [lon, lat] = hotspot.position.coordinates || [];
      if (!inRange(lon, -180, 180) || !inRange(lat, -90, 90)) fail(`${entry.id}/${hotspot.id}: invalid geographic coordinates`);
    } else fail(`${entry.id}/${hotspot.id}: unsupported hotspot position`);
  }
}

for (const pack of packNames) {
  const stories = await readJson(path.join(dataRoot, pack, 'stories.json'));
  for (const story of stories) {
    for (const chapter of story.chapters || []) {
      const context = `${pack}/${story.id}/${chapter.id}`;
      const hasSceneState = chapter.immersiveVariantId || chapter.immersivePeriodId || chapter.immersiveHotspotId;
      if (hasSceneState && !chapter.immersiveSceneId) fail(`${context}: immersive scene state requires immersiveSceneId`);
      if (chapter.immersiveSceneId && !catalogIds.has(chapter.immersiveSceneId)) fail(`${context}: unknown immersiveSceneId ${chapter.immersiveSceneId}`);
      const linkedScene = chapter.immersiveSceneId ? sceneIndex.get(chapter.immersiveSceneId) : undefined;
      if (linkedScene) {
        const variantIds = new Set((linkedScene.comparison?.options || []).map((option) => option.id));
        const periodIds = new Set((linkedScene.periods || []).map((period) => period.id));
        const hotspotById = new Map((linkedScene.hotspots || []).map((hotspot) => [hotspot.id, hotspot]));
        if (chapter.immersiveVariantId && !variantIds.has(chapter.immersiveVariantId)) fail(`${context}: unknown immersiveVariantId ${chapter.immersiveVariantId} for ${linkedScene.id}`);
        if (chapter.immersivePeriodId && !periodIds.has(chapter.immersivePeriodId)) fail(`${context}: unknown immersivePeriodId ${chapter.immersivePeriodId} for ${linkedScene.id}`);
        if (chapter.immersiveHotspotId && !hotspotById.has(chapter.immersiveHotspotId)) fail(`${context}: unknown immersiveHotspotId ${chapter.immersiveHotspotId} for ${linkedScene.id}`);
        const linkedHotspot = chapter.immersiveHotspotId ? hotspotById.get(chapter.immersiveHotspotId) : undefined;
        if (linkedHotspot?.variantIds?.length && (!chapter.immersiveVariantId || !linkedHotspot.variantIds.includes(chapter.immersiveVariantId))) fail(`${context}: selected hotspot ${linkedHotspot.id} is not visible for immersiveVariantId ${chapter.immersiveVariantId || '(none)'}`);
        if (linkedHotspot?.periodIds?.length && (!chapter.immersivePeriodId || !linkedHotspot.periodIds.includes(chapter.immersivePeriodId))) fail(`${context}: selected hotspot ${linkedHotspot.id} is not visible for immersivePeriodId ${chapter.immersivePeriodId || '(none)'}`);
      }
    }
  }
}

if (bundledBytes > MAX_BUNDLED_TOTAL_BYTES) fail(`bundled immersive assets exceed 12 MiB total budget (${bundledBytes} bytes)`);

if (errors.length) {
  console.error(`Immersive data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`Immersive validation passed: ${catalog.scenes.length} scene(s), ${bundledBytes} bundled visual bytes, all scene/place/source links valid.`);
