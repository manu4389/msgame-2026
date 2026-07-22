const CACHE = 'manuel-samara-v1';
const ASSETS = [
  './propuesta.html',
  './manifest.json',
  './fotos/portada.jpg',
  './fotos/final.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for HTML so updates always show; cache-first for static images/manifest.
self.addEventListener('fetch', e => {
  const isHTML = e.request.mode === 'navigate' || e.request.url.endsWith('.html');
  if (isHTML) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
