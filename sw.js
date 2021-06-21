function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  

self.importScripts('js/localforage.min.js');

// Files to cache
const cacheName = 'wpa-loader-v1';
const appShellFiles = [
  '/wpa-loader/',
  '/wpa-loader/index.html',
  '/wpa-loader/app.js',
  '/wpa-loader/js/jquery-3.6.0.min.js',
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

self.addEventListener('activate', async () => {
    self.importScripts('js/jquery-3.6.0.min.js');
    let device = await localforage.getItem("device-uuid");
    if(!device){
        device = uuidv4();
        await localforage.setItem("device-uuid",device);
    }
    let resp = await fetch("/wpa-loader/"+device+".json");
    console.log(resp);
});