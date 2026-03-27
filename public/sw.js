const CACHE_NAME = 'santri-portal-v4'

// Only cache truly static assets (icons, manifest)
// HTML pages should NOT be cached to avoid stale chunk references
const STATIC_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
]

// Routes that should NOT be cached (always fetch from network)
const NETWORK_ONLY_ROUTES = [
  '/api/',
  '/_next/',
  '/auth/',
  '/dashboard/'
]

// HTML pages - use network-first strategy
const HTML_PAGES = [
  '/santri',
  '/santri/',
  '/santri/pondok',
  '/santri/smp',
  '/santri/smk'
]

// Install event - only cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets only')
        return cache.addAll(STATIC_ASSETS)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Check if request should be network-only (not cached)
function shouldUseNetworkOnly(url) {
  // Check for payment notification query params - always fetch from network
  if (url.searchParams.has('payment_status') ||
      url.searchParams.has('payment_type') ||
      url.searchParams.has('order_id')) {
    return true
  }
  return NETWORK_ONLY_ROUTES.some(route => url.pathname.startsWith(route))
}

// Check if request is for an HTML page
function isHTMLPage(url) {
  return HTML_PAGES.some(page => url.pathname === page || url.pathname === page + '/')
}

// Fetch event - different strategies based on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Skip non-GET requests (POST, PUT, DELETE, etc.) - always use network
  if (event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.error('Network request failed:', error)
          return new Response(
            JSON.stringify({ error: 'Network error', offline: true }),
            { 
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        })
    )
    return
  }

  // Network-only for API routes and dynamic content
  if (shouldUseNetworkOnly(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response
        })
        .catch((error) => {
          console.error('Network request failed:', error)
          return caches.match(event.request)
        })
    )
    return
  }

  // Network-first for HTML pages to avoid stale chunk references
  if (isHTMLPage(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the response for offline fallback only
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch((error) => {
          console.error('Network request failed, trying cache:', error)
          // Fallback to cache if network fails (offline scenario)
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response
              }
              // Return offline fallback
              return new Response(
                '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
                { 
                  status: 503,
                  headers: { 'Content-Type': 'text/html' }
                }
              )
            })
        })
    )
    return
  }

  // Cache-first for static assets only
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // Fetch in background to update cache (stale-while-revalidate)
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, networkResponse)
                  })
              }
            })
            .catch(() => {
              // Ignore fetch errors for background update
            })
          
          return response
        }

        // No cache - fetch from network
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
      .catch((error) => {
        console.error('Fetch failed:', error)
        // Return offline page or fallback
        return caches.match('/santri')
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari Santri Portal',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('Santri Portal', options)
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/santri')
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Skipping waiting, activating new service worker')
    self.skipWaiting()
  }
})

async function syncTransactions() {
  // Sync pending transactions when back online
  console.log('Syncing transactions...')
}
