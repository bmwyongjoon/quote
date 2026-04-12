// ─── 버전 관리 ───────────────────────────────────────
// 업데이트 배포 시 이 숫자만 올리면 모든 사용자 자동 업데이트
const VERSION = 'bps-quote-v7';
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
