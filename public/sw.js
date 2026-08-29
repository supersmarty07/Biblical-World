const CACHE_PREFIX = 'biblical-world-';
const CACHE_NAME = `${CACHE_PREFIX}v2-alpha11-runtime`;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (response.ok) await cache.put(request, response.clone());
    return response;
  }).catch(() => undefined);

  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  return (await update) || Response.error();
}

function isVersionSensitiveData(url) {
  return url.pathname.endsWith('/data/immersive/manifest.json') ||
    url.pathname.includes('/data/generated/content-manifest.json') ||
    url.pathname.includes('/data/generated/search-documents.json') ||
    url.pathname.includes('/data/verification/registry.json') ||
    url.pathname.includes('/data/assets/manifest.json');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Manifests/indexes are small and version-sensitive. Prefer the network so a
  // newly deployed GitHub Pages shell does not pair with an older scene/search catalog.
  if (isVersionSensitiveData(url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  const cacheable = url.pathname.includes('/data/') || ['script', 'style', 'image', 'font'].includes(request.destination);
  if (cacheable) event.respondWith(staleWhileRevalidate(event, request));
});
