const CACHE = "quantova-v2";
const FICHEIROS = [
  "./index.html", "./add.html", "./historico.html",
  "./style.css", "./app.js", "./add.js",
  "./historico.js", "./settings.js", "./db-local.js",
  "./manifest.json", "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(FICHEIROS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  e.respondWith(caches.match(e.request).then(function(cached) {
    return cached || fetch(e.request).catch(function() { return cached; });
  }));
});