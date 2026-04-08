// ─── 버전 관리 ───────────────────────────────────────
// 업데이트 배포 시 이 숫자만 올리면 모든 사용자 자동 업데이트
const VERSION = 'bps-quote-v3';
// ─────────────────────────────────────────────────────

const FILES = [
  '/index.html',
  '/manifest.json',
  '/vehicles.json',
  '/icon-192.png',
  '/icon-512.png',
];

// 설치: 새 캐시에 파일 저장 후 즉시 대기
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FILES))
  );
  // skipWaiting 하지 않음 - 앱에서 버튼 누를 때 전환
});

// 활성화: 이전 버전 캐시 전부 삭제 후 모든 탭 즉시 제어
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// fetch: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
  );
});

// 앱에서 업데이트 버튼 누를 때 즉시 skipWaiting
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
