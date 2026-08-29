import fs from 'node:fs/promises';
import process from 'node:process';

const errors = [];
const requireText = async (file, fragments) => {
  const text = await fs.readFile(file, 'utf8');
  for (const fragment of fragments) if (!text.includes(fragment)) errors.push(`${file}: missing required hardening fragment: ${fragment}`);
  return text;
};

const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(packageJson.version || '')) errors.push(`package.json: invalid semantic version ${packageJson.version}`);
if (packageJson.dependencies?.minisearch || packageJson.devDependencies?.minisearch) errors.push('package.json: MiniSearch must not be reintroduced without an explicit architecture review');

const search = await requireText('src/lib/search.ts', ['class StaticSearchEngine', 'buildSearchDocuments', 'levenshteinAtMostTwo']);
if (/from ['"]minisearch['"]/.test(search)) errors.push('src/lib/search.ts: unexpected MiniSearch import');
await requireText('src/components/SearchDialog.tsx', ['aria-modal="true"', 'restoreFocusRef', 'querySelectorAll<HTMLElement>']);
await requireText('src/App.tsx', ['className="skip-link"', 'id="atlas-workspace"', 'aria-busy={loading}']);
const mapView = await requireText('src/components/MapView.tsx', ['prefersReducedMotion()', 'map.jumpTo', 'map-accessibility-note']);
if (mapView.includes('essential: true')) errors.push('src/components/MapView.tsx: essential:true overrides user reduced-motion preferences');

const sw = await requireText('public/sw.js', ["request.headers.has('range')", "url.origin !== self.location.origin", 'networkFirst', 'staleWhileRevalidate']);
if (!sw.includes("if (request.method !== 'GET' || request.headers.has('range')) return;")) errors.push('public/sw.js: Range requests must bypass the service worker for PMTiles compatibility');
await requireText('public/manifest.webmanifest', ['"display": "standalone"', 'icons/atlas-mark.svg']);
await requireText('.github/workflows/quality.yml', ['pull_request:', 'npm test', 'npm run check', 'npm run build']);
await requireText('docs/SOURCE_VERIFICATION_QUEUE.md', ['live verification', 'Release rule']);
await requireText('scripts/audit-provenance.mjs', ['needs-verification', 'project-authored', 'SOURCE_VERIFICATION_QUEUE.md']);
await requireText('scripts/build-content-manifest.mjs', ['content-manifest.json', 'atlasVersion']);

if (errors.length) {
  console.error(`Batch 11 hardening audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('Batch 11 hardening audit passed: dependency-free search, accessibility hooks, reduced-motion handling, PWA Range bypass, provenance queue, manifest generation, and PR quality gates are present.');
