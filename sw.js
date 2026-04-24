// ─── 버전 관리 ───────────────────────────────────────
const VERSION = 'bps-quote-v14';
// ─────────────────────────────────────────────────────

const FILES = [
  '/quote/index.html',
  '/quote/manifest.json',
  '/quote/vehicles.json',
  '/quote/icon-192.png',
  '/quote/icon-512.png',
];

// 설치: 캐시 저장
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 전부 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// fetch: 네트워크 우선 → 실패 시 캐시
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
