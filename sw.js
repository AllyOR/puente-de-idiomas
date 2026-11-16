// Service worker de Puente de Idiomas: guarda la app para abrirla sin conexión.
//
// - Los archivos de la app se piden primero a la red (para recibir las
//   actualizaciones) y, si no hay conexión, se sirven de la copia guardada.
// - Las tipografías de Google Fonts se guardan la primera vez y después se
//   sirven siempre de la copia.
// - Las peticiones al servicio de traducción no pasan por aquí.

const CACHE = "puente-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const isFont = (url) => {
  try { return FONT_HOSTS.includes(new URL(url).hostname); } catch { return false; }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// En la primera visita la página carga las tipografías antes de que este worker
// la controle, así que la página le envía sus direcciones para guardarlas.
self.addEventListener("message", (event) => {
  const urls = event.data && event.data.cacheUrls;
  if (!Array.isArray(urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) => Promise.all(urls.filter(isFont).map(async (url) => {
      try {
        if (await cache.match(url)) return;
        const response = await fetch(url, { mode: "cors" });
        if (response.ok) await cache.put(url, response);
      } catch { /* sin conexión: se guardará en otra visita */ }
    }))),
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === "navigate") {
      const shell = await cache.match("./index.html");
      if (shell) return shell;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (FONT_HOSTS.includes(url.hostname)) event.respondWith(cacheFirst(request));
  else if (url.origin === self.location.origin) event.respondWith(networkFirst(request));
});
