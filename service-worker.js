// Service Worker Teka Teki Pintar: cache-first untuk aset inti, agar bisa offline.
const CACHE_NAME = 'tekateki-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './data-tts-1.js',
  './data-tts-2.js',
  './data-tts-3.js',
  './data-tebak-1.js',
  './data-tebak-2.js',
  './data-sambung-1.js',
  './data-sambung-2.js',
  './data-kuis.js',
  './games.js',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
