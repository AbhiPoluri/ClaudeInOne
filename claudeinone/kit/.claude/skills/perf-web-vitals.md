# Web Vitals Optimization

## Overview
Core Web Vitals (LCP, INP, CLS) measure real-user experience. Optimize them to improve SEO and conversions.

## Measure with web-vitals

```bash
npm install web-vitals
```

```typescript
import { onCLS, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics({ name, value, id }: Metric) {
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({ name, value, id, page: location.pathname }),
    keepalive: true,
  });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

## LCP — Largest Contentful Paint (target: < 2.5s)

```html
<!-- Preload the LCP image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />

<!-- Avoid lazy loading above-the-fold images -->
<img src="/hero.webp" alt="Hero" fetchpriority="high" />
```

```tsx
// Next.js — mark above-fold images as priority
import Image from 'next/image';
<Image src="/hero.webp" alt="Hero" priority width={1200} height={600} />
```

## CLS — Cumulative Layout Shift (target: < 0.1)

```tsx
// Always set width/height on images
<Image src="/photo.jpg" width={400} height={300} alt="" />

// Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {loaded ? <DynamicContent /> : <Skeleton />}
</div>

// Avoid inserting content above existing content
// Use fixed headers, not sticky
```

## INP — Interaction to Next Paint (target: < 200ms)

```typescript
// Defer non-critical work
button.addEventListener('click', (e) => {
  // Critical: immediate feedback
  setLoadingState(true);

  // Defer heavy processing
  setTimeout(() => {
    processData(largeDataset);
    setLoadingState(false);
  }, 0);
});

// Use transitions API for non-urgent updates (React 18+)
import { startTransition } from 'react';
startTransition(() => { setFilteredResults(heavyFilter(data)); });
```

## TTFB — Time to First Byte (target: < 800ms)

```typescript
// Next.js: use ISR or SSG where possible
export const revalidate = 60; // ISR: regenerate every 60s

// Cache expensive DB queries
const data = await unstable_cache(
  () => prisma.post.findMany({ take: 10 }),
  ['homepage-posts'],
  { revalidate: 60 }
)();
```

## Best Practices
- LCP: Preload hero images, use CDN, avoid render-blocking resources
- CLS: Always set dimensions on media, avoid dynamic insertions above content
- INP: Debounce inputs, defer heavy JS, use `startTransition` for state updates
- TTFB: Use CDN, cache at edge, reduce server processing time

## Resources
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
