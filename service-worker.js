const CACHE_NAME = "dice-app-v2";

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('dice-app').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});