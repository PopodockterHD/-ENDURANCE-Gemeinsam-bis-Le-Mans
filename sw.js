/* Same-origin static offline cache. Career data stays in localStorage, not this cache. */
'use strict';
const CACHE = 'endurance-static-v1.0.0';
const BASE = new URL('./', self.registration.scope);
const FILES = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('endurance-static-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE), key = new URL('index.html', BASE).href;
      try {
        const response = await fetch(request);
        if (response.ok) { await cache.put(key, response.clone()); return response; }
        return await cache.match(key) || response;
      } catch {
        return await cache.match(key) || new Response('ENDURANCE ist noch nicht offline gespeichert. Bitte die Website einmal online öffnen.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  if (!FILES.some(path => new URL(path, BASE).pathname === url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE), cached = await cache.match(request);
    return cached || fetch(request);
  })());
});
