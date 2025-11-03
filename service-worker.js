const VERSION = '1.0.0';
const CACHE_NAME = `event-manager-${VERSION}`;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

// Check version and notify clients
const checkVersion = async () => {
  try {
    const response = await fetch('./index.html', { cache: 'no-store' });
    const text = await response.text();
    const match = text.match(/version">v([\d\.]+)<\/span>/);
    const newVersion = match ? match[1] : VERSION;
    
    if (newVersion !== VERSION) {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'UPDATE_AVAILABLE', version: newVersion });
      });
    }
  } catch (err) {
    console.log('Version check failed:', err);
  }
};

// Listen for version check requests from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    checkVersion();
  }
});

// Check version on page load and focus
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Check version when page is loaded
    event.waitUntil(checkVersion());
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // Optionally cache fetched assets
        return resp;
      }).catch(() => {
        // fallback could be added here
      });
    })
  );
});
