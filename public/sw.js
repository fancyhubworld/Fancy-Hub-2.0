const CACHE_NAME = 'fancyhub-v2.2';
const STATIC_ASSETS_TO_CACHE = [
  '/',
  '/shop',
  '/categories',
  '/custom-print',
  '/manifest.json'
];

// Sensitive / Private Routes that MUST NEVER be cached
const PRIVATE_ROUTE_PATTERNS = [
  /\/api\//,
  /\/admin\//,
  /\/account\//,
  /\/checkout/,
  /\/cart/,
  /\/login/,
  /\/register/,
  /\/vendor\/dashboard/,
  /\/vendor\/wallet/,
  /\/vendor\/withdraw/,
  /\/vendor\/staff/,
  /\/vendor\/orders/
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Security Invariant: Never cache private or customer data
  const isPrivateRoute = PRIVATE_ROUTE_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (isPrivateRoute) {
    return; // Pass through directly to network
  }

  // Network-first with Cache fallback strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optionally cache successful responses for static assets
        if (
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/_next/static/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.svg'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// Push Notification Handler
self.addEventListener('push', (event) => {
  let data = { title: 'FancyHub Notification', body: 'New marketplace order update available.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://placehold.co/192x192/1455D9/FFFFFF?text=FH',
    badge: 'https://placehold.co/96x96/1455D9/FFFFFF?text=FH',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Handler (Deep link to target page)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
