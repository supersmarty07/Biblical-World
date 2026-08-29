import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packIds = ['genesis', 'exodus-judges', 'united-monarchy', 'divided-kingdom', 'exile-restoration', 'second-temple', 'gospels', 'acts-paul', 'revelation'];
const readJson = (file) => fs.readFile(path.join(root, file), 'utf8').then(JSON.parse);
const readText = (file) => fs.readFile(path.join(root, file), 'utf8');
const errors = [];
const requireCondition = (condition, message) => { if (!condition) errors.push(message); };

const packageJson = await readJson('package.json');
const immersiveManifest = await readJson('public/data/immersive/manifest.json');
const searchDocs = await readJson('public/data/generated/search-documents.json');
const serviceWorker = await readText('public/sw.js');
const urlState = await readText('src/lib/urlState.ts');
const store = await readText('src/state/useAtlasStore.ts');
const searchRuntime = await readText('src/lib/search.ts');
const searchDialog = await readText('src/components/SearchDialog.tsx');
const journeyPlayer = await readText('src/components/JourneyPlayer.tsx');
const bottomNav = await readText('src/components/BottomNav.tsx');

const journeys = [];
for (const pack of packIds) journeys.push(...await readJson(`public/data/${pack}/journeys.json`));
const journeyIds = new Set(journeys.map((journey) => journey.id));
const sceneIds = new Set((immersiveManifest.scenes || []).map((scene) => scene.id));

const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(packageJson.version);
requireCondition(Boolean(alphaMatch) && Number(alphaMatch?.[1]) >= 8, `package version should remain V2 alpha.8 or later, found ${packageJson.version}`);
requireCondition(journeys.length === 69, `expected 69 inherited journey datasets, found ${journeys.length}`);
requireCondition(sceneIds.size === 20, `expected 20 immersive scenes from Batch 7, found ${sceneIds.size}`);

const featured = {
  Abraham: ['journey-abraham', 'journey-moriah'],
  Exodus: ['journey-exodus-egypt', 'journey-wilderness-sinai', 'journey-kadesh-transjordan'],
  Jesus: ['journey-matthew-infancy', 'journey-luke-infancy', 'journey-cana-capernaum', 'journey-john4-samaria', 'journey-northern-ministry', 'journey-final-jerusalem', 'journey-final-week'],
  Paul: ['journey-paul-damascus', 'journey-first-mission', 'journey-second-mission', 'journey-third-return', 'journey-paul-caesarea-transfer', 'journey-voyage-to-rome']
};
for (const [group, ids] of Object.entries(featured)) for (const id of ids) requireCondition(journeyIds.has(id), `${group} featured journey missing: ${id}`);

for (const journey of journeys) {
  requireCondition(Array.isArray(journey.segments) && journey.segments.length > 0, `journey ${journey.id} must retain at least one segment`);
  for (const segment of journey.segments || []) {
    requireCondition(['known-sequence', 'reconstructed', 'unknown'].includes(segment.routeCertainty), `journey ${journey.id}/${segment.id} has invalid route certainty`);
  }
}

requireCondition(urlState.includes('journey?: string') && urlState.includes('segment?: number'), 'URL state must deep-link journey and segment state');
requireCondition(store.includes('activeJourneyId') && store.includes('activeJourneySegment') && store.includes('openJourney'), 'atlas store must expose journey-following state');
requireCondition(journeyPlayer.includes('Follow the Journey') && journeyPlayer.includes('routeCertainty'), 'JourneyPlayer must expose Follow the Journey and route certainty');
requireCondition(bottomNav.includes('<RouteIcon') && bottomNav.includes('Journeys'), 'mobile bottom navigation must expose Journeys');
requireCondition(searchRuntime.includes("'journey' | 'scene'") && searchRuntime.includes('sceneCatalog.map') && searchRuntime.includes('data.journeys.map'), 'runtime search must index journeys and immersive scenes');
requireCondition(searchDialog.includes("result.kind === 'journey'") && searchDialog.includes("result.kind === 'scene'"), 'search dialog must route journey and scene results');

const counts = new Map();
for (const doc of searchDocs) counts.set(doc.kind, (counts.get(doc.kind) || 0) + 1);
requireCondition(searchDocs.length === 1095, `expected 1,095 integrated search documents, found ${searchDocs.length}`);
requireCondition(counts.get('journey') === 69, `search corpus should contain 69 journeys, found ${counts.get('journey') || 0}`);
requireCondition(counts.get('scene') === 20, `search corpus should contain 20 immersive scenes, found ${counts.get('scene') || 0}`);

requireCondition(serviceWorker.includes("request.headers.has('range')"), 'service worker must continue bypassing HTTP Range requests for PMTiles');
const cacheMatch = /v2-alpha(\d+)-runtime/.exec(serviceWorker);
requireCondition(Boolean(cacheMatch) && Number(cacheMatch?.[1]) >= 8, 'service-worker runtime cache must remain versioned at Batch 8 or later');
requireCondition(serviceWorker.includes('isVersionSensitiveData') && serviceWorker.includes('networkFirst(request)'), 'version-sensitive manifests/search indexes must prefer network-first caching');

if (errors.length) {
  console.error(`V2 Batch 8 integration audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`V2 Batch 8 integration audit passed: ${journeys.length} journeys, ${sceneIds.size} immersive scenes, ${searchDocs.length} integrated search documents.`);
