import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));
const fail = (message) => { console.error(`V2 Batch 4 audit failed: ${message}`); process.exit(1); };

const genesis = await readJson('public/data/genesis/places.json');
const monarchy = await readJson('public/data/united-monarchy/places.json');
const divided = await readJson('public/data/divided-kingdom/places.json');
const gospels = await readJson('public/data/gospels/places.json');
const places = [...genesis, ...monarchy, ...divided, ...gospels];
const byId = new Map(places.map((place) => [place.id, place]));

const zion = byId.get('zion-biblical');
if (!zion) fail('zion-biblical record is missing');
if ('coordinates' in zion) fail('zion-biblical must remain intentionally unlocated; coordinates were found');

const moriah = byId.get('moriah');
if (!moriah) fail('moriah record is missing');
if (moriah.coordinateRole !== 'traditional-site') fail(`moriah must remain traditional-site, got ${moriah.coordinateRole}`);

const templeMount = byId.get('temple-mount');
if (!templeMount) fail('temple-mount record is missing');
if (templeMount.coordinateRole !== 'identified-site') fail('Temple Mount physical precinct should remain an identified-site record');

for (const id of ['city-of-david-ridge', 'gihon-spring', 'kidron-valley', 'mount-olives', 'siloam-tunnel', 'pool-siloam-second-temple']) {
  if (!byId.has(id)) fail(`required Jerusalem subsystem place missing: ${id}`);
}

const historical = await readJson('public/data/immersive/scenes/jerusalem-historical-terrain.json');
const periodIds = new Set(historical.periods.map((period) => period.id));
for (const id of ['physical-topography', 'davidic-context', 'first-temple-context', 'late-iron-age', 'persian-period', 'hasmonean-period', 'herodian-period', 'circa-30-ce', 'seventy-ce']) {
  if (!periodIds.has(id)) fail(`Jerusalem historical scene is missing period ${id}`);
}
const footprint = historical.hotspots.find((hotspot) => hotspot.id === 'first-temple-footprint-unknown');
if (!footprint || footprint.evidenceClass !== 'unknown-disputed' || footprint.confidence !== 'unknown') fail('exact First Temple footprint must be encoded as unknown/disputed');
const zionHotspot = historical.hotspots.find((hotspot) => hotspot.id === 'zion-has-no-single-pin');
if (!zionHotspot?.whyShown?.inference?.toLowerCase().includes('not a coordinate')) fail('historical scene must explain that its Zion hotspot is not a Zion coordinate');

const concepts = await readJson('public/data/immersive/scenes/moriah-zion-meaning-explorer.json');
if (concepts.comparison?.presentation !== 'concepts') fail('Moriah/Zion explorer must use conceptual lenses, not an alternatives presentation');
const conceptIds = new Set(concepts.comparison.options.map((option) => option.id));
for (const id of ['zion-2-samuel', 'zion-later-usage', 'moriah-genesis-22', 'moriah-chronicles', 'temple-mount-physical']) {
  if (!conceptIds.has(id)) fail(`Moriah/Zion explorer is missing concept lens ${id}`);
}
const chronicles = concepts.comparison.options.find((option) => option.id === 'moriah-chronicles');
if (chronicles?.camera?.coordinateRole !== 'traditional-site') fail('2 Chronicles Moriah lens must preserve traditional-site coordinate role');
const genesisLens = concepts.comparison.options.find((option) => option.id === 'moriah-genesis-22');
if (genesisLens?.status !== 'unknown' || genesisLens?.camera?.coordinateRole !== 'display-anchor') fail('Genesis 22 Moriah lens must not claim a located candidate/site coordinate');

console.log('V2 Batch 4 Jerusalem audit passed: Zion remains unlocated, Moriah remains traditional, First Temple footprint remains unknown, and period/concept guardrails are present.');
