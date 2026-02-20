# Performance Testing

Load testing, stress testing, and performance profiling.

## Setup

```bash
npm install -D k6 autocannon clinic
```

## K6 Load Testing

```typescript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,           // 100 virtual users
  duration: '30s',    // 30 second duration
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1']
  }
};

export default function () {
  const response = http.get('http://localhost:3000/api/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500
  });

  sleep(1);
}
```

## Autocannon Benchmarking

```bash
# Simple benchmark
autocannon http://localhost:3000

# Custom configuration
autocannon -c 100 -d 30 -p 10 http://localhost:3000/api/users
```

## Clinic.js Profiling

```bash
# Profiler
clinic doctor -- node app.js

# Flame graph
clinic flame -- node app.js

# Bubbleprof
clinic bubbleprof -- node app.js
```

## Custom Performance Tests

```typescript
import { describe, it, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Performance Benchmarks', () => {
  it('should calculate fibonacci < 1ms', () => {
    const start = performance.now();
    
    const result = fibonacci(10);
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1);
    expect(result).toBe(55);
  });

  it('should handle 1000 items in array map < 5ms', () => {
    const items = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const doubled = items.map(x => x * 2);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(5);
    expect(doubled[0]).toBe(0);
  });
});
```

## Memory Profiling

```typescript
import { performance, PerformanceObserver } from 'perf_hooks';

// Track memory usage
function monitorMemory() {
  const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      console.log(`Memory: ${Math.round(entry.duration)} MB`);
    });
  });

  obs.observe({ entryTypes: ['measure'] });

  const start = performance.now();
  
  // Your code here
  const largeArray = Array(1000000).fill(0);
  
  const end = performance.now();
  performance.measure('memory-test', start, end);
}
```

## Database Query Performance

```typescript
import { performance } from 'perf_hooks';

describe('Query Performance', () => {
  it('should fetch 1000 users < 100ms', async () => {
    const start = performance.now();
    
    const users = await db('users')
      .limit(1000)
      .select();
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('should index improves query speed', async () => {
    // Without index
    const noIndexTime = await measureQuery(
      () => db('users').where('email', '=', 'test@example.com').first()
    );

    // With index (after adding)
    const withIndexTime = await measureQuery(
      () => db('users').where('email', '=', 'test@example.com').first()
    );

    // Index should be 10x faster
    expect(withIndexTime).toBeLessThan(noIndexTime / 10);
  });
});
```

## Best Practices

✅ **Establish baselines** - Record current performance
✅ **Test under load** - Realistic user volumes
✅ **Profile regularly** - Catch regressions early
✅ **Monitor thresholds** - Set SLOs and alert on breaches
✅ **Isolate variables** - Test one change at a time

## Resources

- [K6 Documentation](https://k6.io/docs/)
- [Autocannon](https://github.com/mcollina/autocannon)
- [Clinic.js](https://clinicjs.org/)
