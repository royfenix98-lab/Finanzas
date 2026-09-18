const CACHE_NAME = 'finanzas-app-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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
  const req = event.request;

  // No cachear ni interceptar nada que no sea GET, ni llamadas a Supabase
  if (req.method !== 'GET' || req.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((response) => response || fetch(req))
  );
});
