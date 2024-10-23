// Cache assets for offline use
const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event - Cache the app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    console.log('Service Worker Installed');
});

// Activate event - Clean up old caches if needed
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    console.log('Service Worker Activated');
});

// Fetch event - Serve cached assets if available
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Push event - Display push notification
self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'pwa-notification'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
