import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const errors = [];
const fail = (message) => errors.push(message);

const manifest = await readJson('public/data/immersive/manifest.json');
const places = await readJson('public/data/gospels/places.json');
const stories = await readJson('public/data/gospels/stories.json');
const placeById = new Map(places.map((place) => [place.id, place]));
const sceneIds = new Set(manifest.scenes.map((scene) => scene.id));

for (const id of ['passion-night-jerusalem', 'pilate-trial-geography', 'golgotha-burial-explorer', 'resurrection-geography-context']) {
  if (!sceneIds.has(id)) fail(`missing Batch 6 scene ${id}`);
}

for (const id of ['upper-room-jerusalem', 'praetorium-pilate', 'gabbatha', 'golgotha', 'tomb-jesus', 'emmaus-luke', 'galilee-resurrection-mountain']) {
  const place = placeById.get(id);
  if (!place) fail(`missing Gospel place ${id}`);
  else if ('coordinates' in place) fail(`${id} must remain intentionally unpinned`);
}
for (const id of ['gethsemane', 'holy-sepulchre', 'garden-tomb']) {
  const place = placeById.get(id);
  if (!place) fail(`missing Gospel place ${id}`);
  else if (place.coordinateRole !== 'traditional-site') fail(`${id} must remain traditional-site, got ${place.coordinateRole}`);
}

const passion = await readJson('public/data/immersive/scenes/passion-night-jerusalem.json');
const hearing = passion.hotspots.find((hotspot) => hotspot.id === 'annas-caiaphas-hearing-unlocated');
if (!hearing || hearing.evidenceClass !== 'unknown-disputed' || hearing.confidence !== 'unknown') fail('Annas/Caiaphas hearing building must remain unknown/disputed');
if (!hearing?.whyShown?.alternatives?.toLowerCase().includes('not promoted')) fail('Passion-night scene must state that later House of Caiaphas traditions are not promoted to established event geography');

const trial = await readJson('public/data/immersive/scenes/pilate-trial-geography.json');
const trialOptions = new Map(trial.comparison?.options?.map((option) => [option.id, option]));
if (trialOptions.get('textual-praetorium')?.camera?.coordinateRole !== 'display-anchor') fail('textual praetorium must use a display-anchor camera, not a claimed site');
if (trialOptions.get('western-palace-model')?.status !== 'possible') fail('western palace trial model must remain possible rather than established');
if (trialOptions.get('antonia-tradition')?.status !== 'traditional') fail('Antonia trial identification must remain traditional');
if (!trial.hotspots.some((hotspot) => hotspot.id === 'via-dolorosa-not-recovered' && hotspot.whyShown?.inference?.toLowerCase().includes('no exact'))) fail('trial scene must explicitly reject an exact recovered Via Dolorosa route');

const burial = await readJson('public/data/immersive/scenes/golgotha-burial-explorer.json');
const burialOptions = new Map(burial.comparison?.options?.map((option) => [option.id, option]));
if (burialOptions.get('textual-golgotha-tomb')?.camera?.coordinateRole !== 'display-anchor') fail('textual Golgotha/tomb view must use a display-anchor camera');
if (burialOptions.get('holy-sepulchre-tradition')?.status !== 'traditional') fail('Holy Sepulchre must remain traditional in the comparison');
if (burialOptions.get('garden-tomb-alternative')?.status !== 'traditional') fail('Garden Tomb must remain a traditional/alternative site, not established');
for (const id of ['textual-golgotha', 'textual-tomb']) {
  const hotspot = burial.hotspots.find((item) => item.id === id);
  if (!hotspot || hotspot.evidenceClass !== 'unknown-disputed') fail(`${id} must remain unknown/disputed`);
}

const resurrection = await readJson('public/data/immersive/scenes/resurrection-geography-context.json');
if (!resurrection.disclaimer.toLowerCase().includes('supernatural') || !resurrection.disclaimer.toLowerCase().includes('archaeological')) fail('resurrection scene must separate supernatural claims from archaeological adjudication');
const resurrectionOptions = new Map(resurrection.comparison?.options?.map((option) => [option.id, option]));
if (resurrectionOptions.get('emmaus-textual')?.camera?.coordinateRole !== 'display-anchor') fail('textual Emmaus must remain a display orientation, not a site coordinate');
if (resurrectionOptions.get('qubeibeh-tradition')?.status !== 'traditional') fail('el-Qubeibeh must remain a traditional Emmaus identification');
if (resurrectionOptions.get('galilee-mountain-unlocated')?.status !== 'unknown') fail('Matthew 28 Galilee mountain must remain unknown');
const lake = resurrectionOptions.get('sea-galilee-context');
if (lake?.status !== 'established' || !lake.summary.toLowerCase().includes('sea of galilee')) fail('established status in resurrection scene may apply only to the securely identified Sea of Galilee geography');

const expected = new Map([
  ['story-final-week-gospels/fw-temple', ['jerusalem-historical-terrain', undefined, 'circa-30-ce', 'temple-mount-precinct']],
  ['story-final-week-gospels/fw-supper', ['passion-night-jerusalem', undefined, undefined, 'upper-room-unlocated']],
  ['story-final-week-gospels/fw-geth', ['passion-night-jerusalem', undefined, undefined, 'gethsemane-tradition']],
  ['story-pilate-trial/pt-praetorium', ['pilate-trial-geography', 'textual-praetorium', undefined, 'praetorium-unlocated']],
  ['story-pilate-trial/pt-gabbatha', ['pilate-trial-geography', 'textual-praetorium', undefined, 'gabbatha-unlocated']],
  ['story-crucifixion-burial/cb-golgotha', ['golgotha-burial-explorer', 'textual-golgotha-tomb', undefined, 'textual-golgotha']],
  ['story-crucifixion-burial/cb-holy', ['golgotha-burial-explorer', 'holy-sepulchre-tradition', undefined, 'holy-sepulchre-site']],
  ['story-crucifixion-burial/cb-garden', ['golgotha-burial-explorer', 'garden-tomb-alternative', undefined, 'garden-tomb-site']],
  ['story-crucifixion-burial/cb-tomb', ['golgotha-burial-explorer', 'textual-golgotha-tomb', undefined, 'textual-tomb']],
  ['story-resurrection-geography/rg-jerusalem', ['resurrection-geography-context', 'jerusalem-tomb-narratives', undefined, 'resurrection-textual-tomb']],
  ['story-resurrection-geography/rg-emmaus', ['resurrection-geography-context', 'emmaus-textual', undefined, 'emmaus-unlocated']],
  ['story-resurrection-geography/rg-galilee', ['resurrection-geography-context', 'sea-galilee-context', undefined, 'sea-galilee-geography']]
]);
for (const story of stories) {
  for (const chapter of story.chapters || []) {
    const key = `${story.id}/${chapter.id}`;
    const value = expected.get(key);
    if (!value) continue;
    const [sceneId, variantId, periodId, hotspotId] = value;
    if (chapter.immersiveSceneId !== sceneId) fail(`${key} must open ${sceneId}`);
    if ((chapter.immersiveVariantId || undefined) !== variantId) fail(`${key} must select variant ${variantId || '(none)'}`);
    if ((chapter.immersivePeriodId || undefined) !== periodId) fail(`${key} must select period ${periodId || '(none)'}`);
    if ((chapter.immersiveHotspotId || undefined) !== hotspotId) fail(`${key} must select hotspot ${hotspotId}`);
    expected.delete(key);
  }
}
for (const key of expected.keys()) fail(`missing expected guided-story chapter ${key}`);

if (errors.length) {
  console.error(`V2 Batch 6 audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('V2 Batch 6 Passion audit passed: unlocated Gospel places remain unpinned, candidate/traditional sites remain qualified, resurrection geography stays methodologically separated, and story deep-links target valid scene states.');
