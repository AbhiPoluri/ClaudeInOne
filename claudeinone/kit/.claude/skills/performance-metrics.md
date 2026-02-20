# Performance Metrics

## Overview
Track Core Web Vitals and custom metrics with real-user monitoring (RUM).

## web-vitals Package

```bash
npm install web-vitals
```

```typescript
import { onCLS, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    page: window.location.pathname,
  });
  navigator.sendBeacon('/api/metrics', body);
}

onCLS(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

## Custom Performance Marks

```typescript
export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  console.log(`${name}: ${duration.toFixed(2)}ms`);
  return result;
}

// Usage
const user = await measureAsync('fetchUser', () => getUser(id));
```

## API Latency Middleware (Express)

```typescript
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log({ method: req.method, path: req.path, status: res.statusCode, ms: ms.toFixed(2) });
  });
  next();
}
```

## Thresholds (Core Web Vitals)
| Metric | Good | Poor |
|--------|------|------|
| LCP | < 2.5s | > 4s |
| INP | < 200ms | > 500ms |
| CLS | < 0.1 | > 0.25 |
| TTFB | < 800ms | > 1.8s |

## Best Practices
- Measure real users (RUM) not just Lighthouse lab scores
- Track p75 and p95, not averages
- Set performance budgets in CI with `bundlesize` or `lighthouse-ci`

## Resources
- [web-vitals library](https://github.com/GoogleChrome/web-vitals)
- [Core Web Vitals](https://web.dev/explore/metrics)
