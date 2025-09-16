const CACHE_NAME = 'wedonet-cache-v2';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(APP_SHELL_URLS);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from network first, fall back to cache, and update cache
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If we get a valid response, clone it, cache it, and return it.
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If the network fails, try to serve from cache.
        return caches.match(event.request).then(response => {
            return response || new Response("You are offline. Some content may not be available.", { status: 404, statusText: "Offline" });
        });
      })
  );
});
