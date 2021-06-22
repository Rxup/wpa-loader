self.importScripts('js/localforage.min.js');

// Files to cache
const cacheName = 'wpa-loader-v2';
const appShellFiles = [
  '/wpa-loader/',
  '/wpa-loader/index.html',
  '/wpa-loader/app.js',
  '/wpa-loader/js/jquery-3.6.0.min.js',
  '/wpa-loader/js/localforage.min.js',
  '/wpa-loader/style.css',
  '/wpa-loader/favicon.ico',
  '/wpa-loader/icons/icon-32.png',
  '/wpa-loader/icons/icon-64.png',
  '/wpa-loader/icons/icon-96.png',
  '/wpa-loader/icons/icon-128.png',
  '/wpa-loader/icons/icon-168.png',
  '/wpa-loader/icons/icon-192.png',
  '/wpa-loader/icons/icon-256.png',
  '/wpa-loader/icons/icon-512.png',
];
/*
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);
*/
const contentToCache = appShellFiles;
// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);

    if(!e.request.url.endsWith(".json")){
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
    }

    return response;
  })());
});