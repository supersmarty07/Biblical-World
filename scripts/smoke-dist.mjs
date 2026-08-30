import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const required = [
  'index.html',
  'sw.js',
  'manifest.webmanifest',
  'data/generated/content-manifest.json',
  'data/generated/search-documents.json',
  'data/immersive/manifest.json',
  'data/immersive/artwork-manifest.json',
  'data/terrain/regions.json'
];
for (const file of required) {
  if (!fs.existsSync(path.join(dist, file))) throw new Error(`Pages smoke check missing dist/${file}`);
}

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (html.includes('/src/main.tsx') || html.includes('src/main.tsx')) throw new Error('dist/index.html still references raw TypeScript source; Vite output was not deployed');
const scriptMatch = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/i) || html.match(/<script[^>]+src="([^"]+)"[^>]+type="module"/i);
if (!scriptMatch) throw new Error('dist/index.html has no compiled module script');
const src = scriptMatch[1];
if (!src.includes('/assets/') && !src.includes('assets/')) throw new Error(`Expected compiled Vite asset path, found ${src}`);

const base = (process.env.VITE_BASE_PATH || '/').replace(/\/+$/, '/');
let local = src;
if (/^https?:\/\//i.test(local)) throw new Error('Pages smoke check expected same-origin compiled JS asset');
if (base !== '/' && local.startsWith(base)) local = local.slice(base.length);
local = local.replace(/^\/+/, '');
if (!fs.existsSync(path.join(dist, local))) throw new Error(`Compiled entry referenced by index.html is missing: dist/${local}`);

const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'data/generated/content-manifest.json'), 'utf8'));
if (!manifest.atlasVersion) throw new Error('content manifest lacks atlasVersion');
console.log(`Pages dist smoke check passed: ${manifest.atlasVersion}, entry ${src}`);
