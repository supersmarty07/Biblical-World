import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const hardGuardBytes = 95 * 1024 * 1024;
const errors = [];
let filesChecked = 0;

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else {
      filesChecked += 1;
      const stat = await fs.stat(file);
      if (stat.size > hardGuardBytes) errors.push(`${path.relative(root, file)} is ${(stat.size / 1024 / 1024).toFixed(1)} MB; keep large map/media assets off GitHub Pages.`);
      if (file.endsWith('.json') || file.endsWith('.geojson')) {
        try { JSON.parse(await fs.readFile(file, 'utf8')); }
        catch (error) { errors.push(`${path.relative(root, file)} is invalid JSON: ${error.message}`); }
      }
    }
  }
}

await walk(publicDir);
if (errors.length) {
  console.error(`Static repository check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`Static repository check passed: ${filesChecked} public file(s), no oversized assets.`);
