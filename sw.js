const CACHE_NAME = 'cajapos-v3';

// Archivos que se guardarán en el disco duro del dispositivo para funcionar offline
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

// 1. Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache abierto, guardando archivos...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activar el Service Worker y limpiar cachés viejos si actualizamos la app
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Borrando caché antiguo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Interceptar peticiones de red (Modo Offline)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Si el archivo está en la memoria del celular/PC, lo devuelve al instante
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Si no está, lo busca en internet
      return fetch(e.request).catch(() => {
          // Si el internet está cortado y se intenta recargar la página principal, devuelve el index.html de memoria
          if (e.request.mode === 'navigate') {
              return caches.match('./index.html');
          }
      });
    })
  );
});
