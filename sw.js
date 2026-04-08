// ─── 버전 관리 ───────────────────────────────────────
// 업데이트 배포 시 이 숫자만 올리면 모든 사용자 자동 업데이트
const VERSION = 'bps-quote-v2';
// ─────────────────────────────────────────────────────

const FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vehicles.json',
  '/icon-192.png',
  '/icon-512.png',
];

// 설치: 새 캐시에 파일 저장
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// 활성화: 이전 버전 캐시 전부 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== VERSION)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );

  // 열려있는 탭에 새 버전 알림
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'NEW_VERSION', version: VERSION });
    });
  });
});

// fetch: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
  );
});

// 앱에서 업데이트 버튼 누를 때 즉시 전환
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
