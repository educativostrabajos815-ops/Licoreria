const CACHE_NAME = 'cajapos-v2';
const ASSETS_TO_CACHE = [
  './pos_ventas.html',
  './manifest.json',
  './icon.svg'
];

// Instalar el Service Worker y guardar en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Interceptar peticiones y servir desde el caché si no hay internet
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Retorna el caché si existe, sino, va a la red
      return cachedResponse || fetch(e.request);
    })
  );
});