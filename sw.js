const CACHE_NAME = 'links-ccb-v3-corrigido'; // Mudei o nome para forçar atualização
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://i.imgur.com/AZBrg4r.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Força o novo SW a assumir imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Tenta rede primeiro para garantir versão nova (Network First para HTML)
        if (event.request.mode === 'navigate') {
            return fetch(event.request).catch(() => response);
        }
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});