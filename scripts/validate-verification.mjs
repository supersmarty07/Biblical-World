import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dataRoot = path.join(root, 'public/data');
const registryPath = path.join(dataRoot, 'verification/registry.json');
const manifestPath = path.join(dataRoot, 'immersive/manifest.json');
const packNames = ['genesis','exodus-judges','united-monarchy','divided-kingdom','exile-restoration','second-temple','gospels','acts-paul','revelation'];
const errors = [];
const fail = (message) => errors.push(message);
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const registry = await readJson(registryPath);
const manifest = await readJson(manifestPath);

if (registry.schemaVersion !== 1) fail('verification registry schemaVersion must be 1');
if (registry.packet?.independentLiveVerification !== false) fail('verification packet boundary must record independentLiveVerification=false in this environment');

const sceneIds = new Set(manifest.scenes.map((scene) => scene.id));
const placeIds = new Set();
const placesById = new Map();
for (const pack of packNames) {
  const places = await readJson(path.join(dataRoot, pack, 'places.json'));
  for (const place of places) {
    placeIds.add(place.id);
    placesById.set(place.id, place);
  }
}

const resourceIds = new Set();
for (const resource of registry.resources || []) {
  if (!resource.id || resourceIds.has(resource.id)) fail(`resource ids must be unique: ${resource.id}`);
  resourceIds.add(resource.id);
  if (!resource.name || !resource.sourceUrl || !resource.license || !resource.licenseUrl || !resource.notes) fail(`${resource.id}: incomplete resource metadata`);
  for (const sceneId of resource.sceneIds || []) if (!sceneIds.has(sceneId)) fail(`${resource.id}: unknown sceneId ${sceneId}`);
  if (resource.packetStatus === 'non-commercial-only' && resource.commercialUse !== 'restricted') fail(`${resource.id}: non-commercial-only resource must declare commercialUse=restricted`);
  if (resource.id === 'orbis-stanford' && resource.packetStatus !== 'non-commercial-only') fail('ORBIS must remain non-commercial-only');
  if (resource.id === 'digital-augustan-rome' && resource.packetStatus !== 'non-commercial-only') fail('Digital Augustan Rome must remain non-commercial-only');
  if (resource.id === 'open-context' && resource.packetStatus !== 'dataset-specific') fail('Open Context must remain dataset-specific until a concrete dataset is verified');
}

const claimIds = new Set();
for (const claim of registry.claims || []) {
  if (!claim.id || claimIds.has(claim.id)) fail(`claim ids must be unique: ${claim.id}`);
  claimIds.add(claim.id);
  if (!claim.statement || !claim.guardrail || !Array.isArray(claim.citations) || claim.citations.length === 0) fail(`${claim.id}: incomplete claim metadata`);
  for (const sceneId of claim.sceneIds || []) if (!sceneIds.has(sceneId)) fail(`${claim.id}: unknown sceneId ${sceneId}`);
}

for (const id of ['sinai-location-unresolved','yam-suph-no-exact-crossing','first-temple-footprint-unknown','revelation-symbolic-coordinate-free']) {
  if (!claimIds.has(id)) fail(`required guardrail claim missing: ${id}`);
}

const identifierPlaceIds = new Set();
for (const identifier of registry.identifiers || []) {
  if (!placeIds.has(identifier.placeId)) fail(`identifier references unknown place ${identifier.placeId}`);
  if (identifierPlaceIds.has(identifier.placeId)) fail(`duplicate identifier mapping for ${identifier.placeId}`);
  identifierPlaceIds.add(identifier.placeId);
  if (!/^\d+$/.test(identifier.pleiades || '')) fail(`${identifier.placeId}: invalid Pleiades id`);
  if (identifier.wikidata && !/^Q\d+$/.test(identifier.wikidata)) fail(`${identifier.placeId}: invalid Wikidata QID`);
  const place = placesById.get(identifier.placeId);
  if (place?.externalIds?.pleiades !== identifier.pleiades) fail(`${identifier.placeId}: place record missing packet Pleiades id ${identifier.pleiades}`);
  if (identifier.wikidata && place?.externalIds?.wikidata !== identifier.wikidata) fail(`${identifier.placeId}: place record missing packet Wikidata id ${identifier.wikidata}`);
}

for (const assessment of registry.sceneAssessments || []) {
  if (!sceneIds.has(assessment.sceneId)) fail(`scene assessment references unknown scene ${assessment.sceneId}`);
  if (!Number.isInteger(assessment.packetReadinessPercent) || assessment.packetReadinessPercent < 0 || assessment.packetReadinessPercent > 100) fail(`${assessment.sceneId}: invalid packet readiness percentage`);
  if (!assessment.integrationStatus || !assessment.note) fail(`${assessment.sceneId}: scene assessment requires integration status and note`);
}

// Historical guardrails remain authoritative even after source-packet import.
const zion = placesById.get('zion-biblical');
if (zion?.coordinates) fail('zion-biblical must remain coordinate-free');
const textualGolgotha = placesById.get('golgotha-textual');
if (textualGolgotha?.coordinates) fail('textual Golgotha must remain coordinate-free');
const transfiguration = placesById.get('transfiguration-mountain');
if (transfiguration?.coordinates) fail('unnamed Transfiguration mountain must remain coordinate-free');
const babylonGreat = placesById.get('babylon-great-revelation');
if (babylonGreat?.coordinates) fail('Babylon the Great must remain coordinate-free');

if (errors.length) {
  console.error(`Verification registry validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`Verification registry validation passed: ${registry.resources.length} resources, ${registry.claims.length} claims, ${registry.identifiers.length} identifier mappings, ${registry.sceneAssessments.length} scene assessments.`);
