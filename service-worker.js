// Cache assets for offline use
const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    console.log('Service Worker Installed');
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
});

// Fetch event - serves cached assets
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Notification logic
function showNotification() {
    self.registration.showNotification('Reminder', {
        body: 'This is a notification from your PWA!',
        icon: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'pwa-notification'
    });
}

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-pwa') {
        event.waitUntil(showNotification());
    }
});

// Periodic notifications every 5 minutes
setInterval(() => {
    showNotification();
}, 300000); // 300000ms = 5 minutes
