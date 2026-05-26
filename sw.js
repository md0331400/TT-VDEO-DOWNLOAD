/* ============================================================
   TT VDO DOWNLOADER — Service Worker
   PWA offline support + smart caching
   ============================================================ */

const VERSION = 'tt-vdo-v1.0.0';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Files cached on install (the app shell)
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/favicon.ico'
];

/* ---------- Install: pre-cache app shell ---------- */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(APP_SHELL).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

/* ---------- Activate: clean up old caches ---------- */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

/* ---------- Fetch strategy ---------- */
self.addEventListener('fetch', event => {
    const req = event.request;

    // Only handle GET
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Never cache: admin panel, Firebase, TikTok API, analytics
    if (url.pathname.startsWith('/admin') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('firebaseio.com') ||
        url.hostname.includes('firebase') ||
        url.hostname.includes('tikwm.com') ||
        url.hostname.includes('ipwho.is') ||
        url.hostname.includes('ipapi.co') ||
        url.hostname.includes('cloudflareinsights') ) {
        return; // let browser handle directly
    }

    // HTML pages -> network first, fallback to cache
    if (req.mode === 'navigate' || (req.destination === 'document')) {
        event.respondWith(
            fetch(req)
                .then(resp => {
                    const copy = resp.clone();
                    caches.open(STATIC_CACHE).then(c => c.put(req, copy)).catch(()=>{});
                    return resp;
                })
                .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
        );
        return;
    }

    // Static assets -> cache first, fallback to network
    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(resp => {
                // Only cache successful same-origin responses
                if (resp && resp.status === 200 && url.origin === self.location.origin) {
                    const copy = resp.clone();
                    caches.open(RUNTIME_CACHE).then(c => c.put(req, copy)).catch(()=>{});
                }
                return resp;
            }).catch(() => cached);
        })
    );
});

/* ---------- Message handler (for skip-waiting) ---------- */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
