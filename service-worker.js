
const CACHE_NAME = 'optipdf-v4-6-1-rebuild2';
const ASSETS = ['./','./index.html','./lawyers.html','./about.html','./privacy.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./assets/demo.gif','./assets/logo.png'];
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const network = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      if (request.method === 'GET' && request.url.startsWith(self.location.origin)) {
        cache.put(request, network.clone());
      }
      return network;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
