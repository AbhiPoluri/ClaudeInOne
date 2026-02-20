# Web Vitals & UX Metrics

Measuring and optimizing user experience metrics.

## Core Web Vitals

```typescript
// Measure Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Cumulative Layout Shift
getCLS(metric => {
  console.log('CLS:', metric.value); // Goal: < 0.1
});

// First Input Delay
getFID(metric => {
  console.log('FID:', metric.value); // Goal: < 100ms
});

// First Contentful Paint
getFCP(metric => {
  console.log('FCP:', metric.value); // Goal: < 1.8s
});

// Largest Contentful Paint
getLCP(metric => {
  console.log('LCP:', metric.value); // Goal: < 2.5s
});

// Time to First Byte
getTTFB(metric => {
  console.log('TTFB:', metric.value); // Goal: < 600ms
});
```

## Monitoring in Production

```typescript
// Send metrics to analytics
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendMetric(metric: any) {
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(metric));
  } else {
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
      keepalive: true
    });
  }
}

getCLS(sendMetric);
getFID(sendMetric);
getLCP(sendMetric);

// Backend to store metrics
app.post('/api/metrics', async (req, res) => {
  const metric = req.body;

  await db.metrics.create({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: new Date(),
    url: req.headers.referer
  });

  res.json({ ok: true });
});
```

## Performance Budgets

```typescript
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/main.js",
      "maxSize": "100 kB"
    },
    {
      "path": "./dist/*.js",
      "maxSize": "50 kB"
    }
  ]
}
```

## Image Optimization

```typescript
// Next.js Image with automatic optimization
import Image from 'next/image';

<Image
  src="/large-photo.jpg"
  alt="Photo"
  width={1200}
  height={800}
  quality={75}
  priority={false}
  placeholder="blur"
/>

// Manual optimization
function optimizeImage(src: string, format: 'webp' | 'avif' = 'webp') {
  return `${src}?fm=${format}&q=80&w=1200`;
}
```

## Interaction to Next Paint (INP)

```typescript
import { onINP } from 'web-vitals';

onINP(metric => {
  console.log('INP:', metric.value); // Goal: < 200ms
  
  // Track which interactions are slow
  if (metric.value > 200) {
    console.warn('Slow interaction:', {
      element: metric.attribution?.interactionTarget,
      duration: metric.value
    });
  }
});
```

## Performance Monitoring

```typescript
// Use PerformanceObserver to track metrics
const perfObserver = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.renderTime || entry.loadTime);
    }
    
    if (entry.entryType === 'layout-shift') {
      if (!entry.hadRecentInput) {
        console.log('CLS:', entry.value);
      }
    }
  }
});

perfObserver.observe({
  entryTypes: ['largest-contentful-paint', 'layout-shift']
});
```

## Best Practices

✅ **Measure continuously** - Track metrics over time
✅ **Set budgets** - Define acceptable limits
✅ **Optimize images** - Huge impact on LCP
✅ **Reduce JavaScript** - Code-split and lazy load
✅ **Minimize layout shifts** - Reserve space for dynamic content

## Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
