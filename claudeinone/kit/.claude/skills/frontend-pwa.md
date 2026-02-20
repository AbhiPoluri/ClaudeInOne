# Progressive Web Apps (PWA)

## Overview
PWAs use service workers, web manifests, and modern browser APIs to deliver app-like experiences on the web.

## Web App Manifest

```json
// public/manifest.json
{
  "name": "My App",
  "short_name": "MyApp",
  "description": "A progressive web app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

## Service Worker (Cache-First)

```typescript
// public/sw.js
const CACHE_NAME = 'myapp-v1';
const STATIC_ASSETS = ['/', '/offline.html', '/styles.css'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('/offline.html') as Promise<Response>);
    })
  );
});
```

## Register Service Worker

```typescript
// app/layout.tsx or _app.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.error('SW failed:', err));
}
```

## Next.js with next-pwa

```bash
npm install next-pwa
```

```typescript
// next.config.ts
import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})({});
```

## Push Notifications

```typescript
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
});
await fetch('/api/push/subscribe', {
  method: 'POST', body: JSON.stringify(subscription),
  headers: { 'Content-Type': 'application/json' }
});
```

## Best Practices
- Use `maskable` icon purpose for adaptive icons on Android
- Implement background sync for offline form submissions
- Cache API responses with network-first strategy, static assets with cache-first
- Test with Lighthouse PWA audit

## Resources
- [web.dev PWA guide](https://web.dev/explore/progressive-web-apps)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
