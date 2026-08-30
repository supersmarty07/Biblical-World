import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const pkg = json('package.json');
const alphaMatch = /^2\.0\.0-alpha\.(\d+)$/.exec(pkg.version);
if (!alphaMatch || Number(alphaMatch[1]) < 15) throw new Error(`Expected package version alpha.15 or later, found ${pkg.version}`);

const main = read('src/main.tsx');
for (const needle of ['AppErrorBoundary', "document.documentElement.dataset.appBooted = 'true'", 'Service worker registration failed']) {
  if (!main.includes(needle)) throw new Error(`main.tsx missing alpha.15 startup resilience: ${needle}`);
}
const boundary = read('src/components/AppErrorBoundary.tsx');
for (const needle of ['getDerivedStateFromError', 'Reset local cache & reload', "key.startsWith('biblical-world-')", 'Build branch:']) {
  if (!boundary.includes(needle)) throw new Error(`AppErrorBoundary missing alpha.15 recovery behavior: ${needle}`);
}
const html = read('index.html');
for (const needle of ['boot-fallback', 'The Biblical World did not start.', '8000']) {
  if (!html.includes(needle)) throw new Error(`index.html missing alpha.15 boot fallback: ${needle}`);
}
const overlay = read('src/components/ImmersiveSceneOverlay.tsx');
if (!overlay.includes('window.innerWidth <= 480') || !overlay.includes('window.innerWidth <= 860')) throw new Error('Cinematic quality must default down on small/mobile screens');
const sw = read('public/sw.js');
const cacheVersion = /v2-alpha(\d+)-runtime/.exec(sw)?.[1];
if (!cacheVersion || Number(cacheVersion) < 15) throw new Error('Service worker cache must be versioned for alpha.15 or later');
if (!sw.includes("/data/immersive/artwork-manifest.json")) throw new Error('Artwork manifest must be network-first/version-sensitive');
const workflow = read('.github/workflows/deploy.yml');
if (!workflow.includes('npm run build && npm run smoke:dist')) throw new Error('Pages workflow must smoke-test dist after Vite build');
if (!workflow.includes('branches: [main, BIBLE-WORLD-V4]')) throw new Error('BIBLE-WORLD-V4 deployment branch must remain active');
const smoke = read('scripts/smoke-dist.mjs');
for (const needle of ['raw TypeScript source', 'compiled module script', 'data/immersive/artwork-manifest.json']) {
  if (!smoke.includes(needle)) throw new Error(`dist smoke script missing guardrail: ${needle}`);
}
const yam = json('public/data/immersive/scenes/yam-suph-environment-explorer.json');
if (yam.world?.siteModel) throw new Error('Yam Suph must remain without exact 3D site model');
console.log('V2 alpha.15 audit passed: boot/runtime recovery, mobile cinematic defaults, service-worker freshness, BIBLE-WORLD-V4 deployment, and post-build Pages smoke checks are protected.');
