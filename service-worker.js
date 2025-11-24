// --- service-worker.js ---

// 🔴 ACTION: INCREMENT THE VERSION NUMBER TO SIGNAL AN UPDATE
const CACHE_NAME = 'swt-portal-v18'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',// <--- This file will be re-downloaded!
  './manifest.json',
  // Your existing files, including the one you changed:
  './physiology.html',// <--- This file will be re-downloaded!
  './micro radio.html',// <--- This file will be re-downloaded!
  './fmt.html',// <--- This file will be re-downloaded!
  './anasthesia.html', // <--- This file will be re-downloaded!
  './paediatrics.html',// <--- This file will be re-downloaded!
  './derma and psych.html',// <--- This file will be re-downloaded!
  './mock2.html',// <--- This file will be re-downloaded!
  './biochem final.html',// <--- This file will be re-downloaded!
  './Anatomy.html',// <--- This file will be re-downloaded!
  './pathology.html',// <--- This file will be re-downloaded!
  './parise.html',// <--- This file will be re-downloaded!
];

// 1. INSTALL: Cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      // The browser will fetch the new versions of all these files.
      return cache.addAll(ASSETS_TO_CACHE); 
    })
  );
  self.skipWaiting(); 
});

// 2. ACTIVATE: Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); 
});

// 3. FETCH: Network First, then Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
