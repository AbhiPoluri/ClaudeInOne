# API Caching

## Overview
Cache API responses at multiple layers — HTTP headers, CDN, Redis, and in-memory — to reduce latency and database load.

## HTTP Cache Headers (Next.js)

```typescript
// Cache API response for 60s, allow stale for 10s while revalidating
export async function GET() {
  const data = await fetchExpensiveData();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=10',
    }
  });
}

// Per-request cache (Next.js fetch cache)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 } // revalidate every 60s
});
```

## Redis Cache Layer

```typescript
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL!);

async function getCachedUser(id: string) {
  const cacheKey = `user:${id}`;

  // 1. Try cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Fetch from DB
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  // 3. Store with 5min TTL
  await redis.setex(cacheKey, 300, JSON.stringify(user));
  return user;
}

// Invalidate on update
async function updateUser(id: string, data: Partial<User>) {
  const user = await prisma.user.update({ where: { id }, data });
  await redis.del(`user:${id}`);
  return user;
}
```

## In-Memory LRU Cache (single instance)

```bash
npm install lru-cache
```

```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, unknown>({
  max: 500,           // max 500 items
  ttl: 1000 * 60 * 5, // 5 minute TTL
});

export function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as T | undefined;
  if (hit !== undefined) return Promise.resolve(hit);
  return fetcher().then(result => { cache.set(key, result); return result; });
}
```

## Stale-While-Revalidate Pattern

```typescript
const cache = new Map<string, { data: unknown; fetchedAt: number }>();

async function staleWhileRevalidate<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  const isStale = !entry || Date.now() - entry.fetchedAt > ttl;

  if (isStale) {
    // Revalidate in background, return stale data immediately if available
    const fresh = fetcher().then(data => { cache.set(key, { data, fetchedAt: Date.now() }); return data; });
    if (!entry) return fresh; // No stale data, must wait
  }

  return entry!.data as T;
}
```

## Best Practices
- Cache at the lowest layer possible (HTTP > CDN > Redis > in-memory)
- Always set expiry — never cache indefinitely without TTL
- Cache key should include all query parameters
- Use `stale-while-revalidate` for non-critical data (better UX)

## Resources
- [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [ioredis](https://github.com/redis/ioredis)
