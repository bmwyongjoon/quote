// ─── 버전 관리 ───────────────────────────────────────
const VERSION = 'bps-quote-v9';
// ─────────────────────────────────────────────────────

const FILES = [
  '/index.html',
  '/manifest.json',
  '/vehicles.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(FILES))
  );
  // 설치 즉시 skipWaiting → waiting 상태 없이 바로 활성화
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
