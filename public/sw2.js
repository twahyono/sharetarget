self.addEventListener("install", function (event) {
    console.info("Hello world from the Service Worker 🤙");
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_ASSETS))
    );
    self.skipWaiting();
  });