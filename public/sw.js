importScripts("localforage.min.js");
const CACHE_NAME = "cache-v1.3";
const OFFLINE_URL = "offline.html";
const CACHED_ASSETS = [

];
self.addEventListener("install", function (event) {
  console.info("Hello world from the Service Worker 🤙");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  //console.info('Fetch event for ', event.request.url, event.request.mode)
  const url = new URL(event.request.url);
  const triliocv = 'https://triliocv.azurewebsites.net/uploadmulti';
  console.log("fetch event url", url)
  if (event.request.method === 'POST' &&
    url.pathname === '/api/uploads') {
    event.respondWith((async () => {
      let formData = await event.request.formData();
      await localforage.setItem("FORMDATA",formData);
      formData.append('apikey','this#is#a#secret#key!')
      // formData.append('email','teddy@qnp.co.id')
      // // const link = formData.get('link') || '';
      // const responseUrl = await saveBookmark(link);
      try {
        await fetch(triliocv,{method:'POST',body:formData});
        return Response.redirect("/hello", 303);
      } catch (error) {
        console.log(error)
      }
    })());
  }
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    console.info("navigate to ", event.request.url);
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            console.info("preload response to ", event.request.url);
            return preloadResponse;
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.info("Fetch failed; returning offline page instead.", error);

          const lang = await localforage.getItem("language");
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(
            lang === "id-ID" ? OFFLINE_URL : OFFLINE_URL_EN
          );
          return cachedResponse;
        }
      })()
    );
  }

  if (event.request.mode === "no-cors")
    // if it fetch only for static files
    event.respondWith(
      caches
        .match(event.request.url)
        .then((response) => {
          if (response) {
            //console.info('Found ', event.request.url, ' in cache');
            return response;
          }
          //console.info('Network request for ', event.request.url);
          return fetch(event.request).then((response) => {
            // TODO 5 - Respond with custom 404 page
            return caches.open(CACHE_NAME).then((cache) => {
              if (!event.request.url.includes("chrome-extension"))
                cache.put(event.request.url, response.clone());
              return response;
            });
          });

          // TODO 4 - Add fetched files to the cache
        })
        .catch((error) => {
          // TODO 6 - Respond with custom offline page
          console.info("error fetch event", error);
        })
    );
});