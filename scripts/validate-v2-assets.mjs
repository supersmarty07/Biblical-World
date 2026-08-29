import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifestPath = path.join(root, 'public', 'data', 'assets', 'manifest.json');
const verificationPath = path.join(root, 'public', 'data', 'verification', 'registry.json');
const installedPath = path.join(root, 'src', 'generated', 'installedAssets.json');
const immersivePath = path.join(root, 'public', 'data', 'immersive', 'manifest.json');
const errors = [];
const warnings = [];

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const sha256 = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const isId = (value) => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
const allowedStatuses = new Set([
  'installed',
  'configured-external',
  'awaiting-source-bytes',
  'awaiting-derived-geometry',
  'awaiting-derived-terrain',
  'awaiting-dataset-selection',
  'awaiting-item-selection',
  'blocked-verification'
]);
const allowedKinds = new Set(['terrain-pmtiles', 'vector-geojson', 'derived-geojson', 'derived-terrain', 'archaeology-dataset', 'image-set']);

const [manifest, verification, installed, immersive] = await Promise.all([
  readJson(manifestPath), readJson(verificationPath), readJson(installedPath), readJson(immersivePath)
]);

if (manifest.schemaVersion !== 1) errors.push('asset manifest schemaVersion must be 1');
if (installed.schemaVersion !== 1) errors.push('installed asset registry schemaVersion must be 1');
if (manifest.version !== installed.version) errors.push(`asset manifest version ${manifest.version} does not match installed registry ${installed.version}`);
if (manifest.policy?.rangeRequestsMustBypassServiceWorker !== true) errors.push('asset policy must require Range-request service-worker bypass');
if (manifest.policy?.historicalReconstructionRequiresExplicitUncertainty !== true) errors.push('asset policy must require explicit uncertainty for historical reconstruction');

const resourceById = new Map(verification.resources.map((resource) => [resource.id, resource]));
const sceneIds = new Set(immersive.scenes.map((scene) => scene.id));
const assetById = new Map();

for (const asset of manifest.assets || []) {
  if (!isId(asset.id)) errors.push(`invalid asset id: ${String(asset.id)}`);
  if (assetById.has(asset.id)) errors.push(`duplicate asset id: ${asset.id}`);
  assetById.set(asset.id, asset);
  if (!allowedKinds.has(asset.kind)) errors.push(`${asset.id}: unsupported kind ${asset.kind}`);
  if (!allowedStatuses.has(asset.status)) errors.push(`${asset.id}: unsupported status ${asset.status}`);
  if (!Array.isArray(asset.sourceResourceIds)) errors.push(`${asset.id}: sourceResourceIds must be an array`);
  for (const resourceId of asset.sourceResourceIds || []) {
    const resource = resourceById.get(resourceId);
    if (!resource) errors.push(`${asset.id}: unknown verification resource ${resourceId}`);
    else if (resource.packetStatus === 'non-commercial-only' && ['installed', 'configured-external'].includes(asset.status)) {
      errors.push(`${asset.id}: production runtime asset cannot depend on non-commercial-only resource ${resourceId}`);
    }
  }
  for (const sceneId of asset.sceneIds || []) if (!sceneIds.has(sceneId)) errors.push(`${asset.id}: unknown sceneId ${sceneId}`);
  if (asset.kind.startsWith('derived-') && asset.evidenceClass !== 'historical-inference') {
    errors.push(`${asset.id}: derived historical layers must be evidenceClass historical-inference`);
  }
  if (asset.status === 'installed') {
    if (!asset.publicPath) errors.push(`${asset.id}: installed bundled asset requires publicPath`);
    if (!asset.sha256) errors.push(`${asset.id}: installed bundled asset requires sha256`);
    if (!Number.isInteger(asset.sizeBytes) || asset.sizeBytes < 0) errors.push(`${asset.id}: installed bundled asset requires sizeBytes`);
    if (asset.publicPath) {
      const file = path.join(root, 'public', asset.publicPath);
      try {
        const stat = await fs.stat(file);
        const digest = await sha256(file);
        if (stat.size !== asset.sizeBytes) errors.push(`${asset.id}: size mismatch, manifest ${asset.sizeBytes}, actual ${stat.size}`);
        if (digest !== asset.sha256) errors.push(`${asset.id}: sha256 mismatch`);
      } catch (error) {
        errors.push(`${asset.id}: installed file missing: ${error.message}`);
      }
    }
  }
  if (asset.status === 'configured-external') {
    if (!asset.externalUrl || !/^https:\/\//.test(asset.externalUrl)) errors.push(`${asset.id}: configured external assets require an https externalUrl`);
  }
  if (asset.kind === 'derived-geojson' && asset.status === 'installed') {
    if (!asset.metadataPath) errors.push(`${asset.id}: installed derived GeoJSON requires metadataPath`);
    else {
      try {
        const metadata = await readJson(path.join(root, 'public', asset.metadataPath));
        if (metadata.schemaVersion !== 1 || metadata.assetId !== asset.id) errors.push(`${asset.id}: derivation metadata identity mismatch`);
        if (metadata.derivationMethod !== 'independently-authored') errors.push(`${asset.id}: derivationMethod must be independently-authored`);
        if (!Array.isArray(metadata.citations) || metadata.citations.length === 0) errors.push(`${asset.id}: derivation metadata requires citations`);
        if (!isString(metadata.uncertainty)) errors.push(`${asset.id}: derivation metadata requires uncertainty`);
        if (metadata.noExactEventCoordinateClaims !== true) errors.push(`${asset.id}: derivation metadata must preserve noExactEventCoordinateClaims=true`);
      } catch (error) {
        errors.push(`${asset.id}: cannot read derivation metadata: ${error.message}`);
      }
    }
  }
  if (asset.kind === 'archaeology-dataset' && asset.status === 'installed' && asset.sourceResourceIds.includes('open-context')) {
    if (!asset.datasetDoi || !asset.datasetLicense) errors.push(`${asset.id}: installed Open Context archaeology requires datasetDoi and datasetLicense`);
  }
  if (asset.status === 'blocked-verification' && asset.sourceResourceIds.length > 0) warnings.push(`${asset.id}: blocked-verification entry has source resources; verify whether a narrower unresolved condition should be recorded`);
}

for (const item of installed.installed || []) {
  const asset = assetById.get(item.assetId);
  if (!asset) errors.push(`installed registry references unknown asset ${item.assetId}`);
  else if (asset.status !== 'installed') errors.push(`installed registry ${item.assetId} must have manifest status installed`);
  if (!resourceById.has(item.sourceResourceId)) errors.push(`installed registry ${item.assetId} references unknown sourceResourceId ${item.sourceResourceId}`);
  const file = path.join(root, 'public', item.path || '');
  try {
    const stat = await fs.stat(file);
    const digest = await sha256(file);
    if (stat.size !== item.sizeBytes) errors.push(`installed registry ${item.assetId}: size mismatch`);
    if (digest !== item.sha256) errors.push(`installed registry ${item.assetId}: sha256 mismatch`);
  } catch (error) {
    errors.push(`installed registry ${item.assetId}: file missing: ${error.message}`);
  }
}

for (const [key, value] of Object.entries(installed.runtime || {})) {
  if (value == null) continue;
  if (typeof value !== 'string' || !value.trim()) errors.push(`runtime.${key} must be null or a non-empty string`);
  if (/^http:\/\//i.test(value)) errors.push(`runtime.${key} must not use insecure HTTP`);
}

if (manifest.assets.some((asset) => asset.id === 'historic-landscape-image-pack' && asset.status === 'installed')) {
  errors.push('historic-landscape-image-pack cannot be marked installed as a collection-level shortcut; individual item-level assets are required');
}

if (errors.length) {
  console.error(`V2 asset validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
for (const warning of warnings) console.warn(`Asset warning: ${warning}`);
console.log(`V2 asset validation passed: ${manifest.assets.length} planned/integrated asset record(s), ${(installed.installed || []).length} bundled asset(s), no restricted runtime dependencies.`);
