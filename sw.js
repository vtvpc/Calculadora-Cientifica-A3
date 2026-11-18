const CACHE = "cybercalc-a3-v2";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./math-engine.js",
  "./storage.js",
  "./numerical.js",
  "./graph-scale.js",
  "./graphs.js",
  "./matrices.js",
  "./combinatorics.js",
  "./calculus.js",
  "./advanced.js",
  "./interface.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./assets/utilities.css",
  "./assets/icons.css",
  "./assets/fonts.css",
  "./assets/jetbrains.woff2",
  "./assets/inter.woff2",
  "./assets/math.js",
  "./assets/webfonts/fa-solid-900.woff2",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("cybercalc-a3-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (
    e.request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(new URL("./", self.location).pathname)
  )
    return;
  // Refresh navigations online; use the cached shell when the network is absent.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});
