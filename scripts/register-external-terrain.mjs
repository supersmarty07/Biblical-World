import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const url = valueOf('--url');
const dryRun = args.includes('--dry-run');
if (!url || !/^https:\/\//.test(url)) {
  console.error('Usage: node scripts/register-external-terrain.mjs --url https://<static-host>/terrain.pmtiles [--sha256 <digest>]');
  process.exit(2);
}
const sha256 = valueOf('--sha256');
if (sha256 && !/^[a-f0-9]{64}$/i.test(sha256)) throw new Error('--sha256 must be a 64-character hexadecimal digest.');

if (dryRun) {
  console.log(`Terrain registration dry run passed for ${url}. No files changed.`);
  process.exit(0);
}

const root = process.cwd();
const installedPath = path.join(root, 'src', 'generated', 'installedAssets.json');
const manifestPath = path.join(root, 'public', 'data', 'assets', 'manifest.json');
const installed = JSON.parse(await fs.readFile(installedPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
installed.runtime.terrainPmtiles = url;
const asset = manifest.assets.find((item) => item.id === 'copernicus-glo30-terrain');
if (!asset) throw new Error('Asset manifest is missing copernicus-glo30-terrain.');
asset.status = 'configured-external';
asset.delivery = 'external';
asset.externalUrl = url;
if (sha256) asset.sha256 = sha256;
await fs.writeFile(installedPath, `${JSON.stringify(installed, null, 2)}\n`);
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Registered external terrain URL. This records configuration only; it does not independently verify remote bytes or source provenance.');
