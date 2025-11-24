// --- service-worker.js ---

// 🔴 ACTION: INCREMENT THE VERSION NUMBER TO SIGNAL AN UPDATE
const CACHE_NAME = 'swt-portal-v19'; // Keep this at v18 for now, but increment next time!

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Your existing files:
  './physiology.html',
  './micro radio.html',
  './fmt.html',
  './anasthesia.html',
  './paediatrics.html',
  './derma and psych.html',
  './mock2.html',
  './biochem final.html',
  './Anatomy.html',
  './pathology.html',
  './parise.html',
];

// 1. INSTALL: Cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Service Worker: Install - Opened cache and adding assets.');
      // The browser will fetch the new versions of all these files.
      return cache.addAll(ASSETS_TO_CACHE); 
    })
  );
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
});

// 2. ACTIVATE: Delete old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activate - Deleting old caches.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Take control of all clients (pages) under the scope immediately
      return self.clients.claim(); 
    })
  );
});

// 3. FETCH: Network First, then Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try to get the latest from the network
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response; // Return the non-200 response or non-basic response
        }
        
        // IMPORTANT: Clone the response to put in the cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Update the cache with the fresh network response
          cache.put(event.request, responseToCache);
        });
        return response; // Return the original response to the page
      })
      .catch(() => {
        // Network failed, serve the asset from the cache
        console.log('⚠️ Network fetch failed, serving from cache:', event.request.url);
        return caches.match(event.request);
      })
  );
});
