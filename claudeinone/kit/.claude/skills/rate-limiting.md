# Rate Limiting

## Overview
Protect APIs from abuse with per-IP or per-user rate limits using Redis.

## Upstash Redis (Serverless / Next.js)

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: Math.floor((reset - Date.now()) / 1000) },
      { status: 429, headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': Math.floor((reset - Date.now()) / 1000).toString(),
      }}
    );
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
```

## express-rate-limit

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many login attempts.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

## Best Practices
- Use Redis for distributed rate limiting (not in-memory in serverless)
- Limit by API key for authenticated users, by IP for public endpoints
- Always return `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` headers
- Use tiered limits: free (100/hr), pro (1000/hr)

## Resources
- [@upstash/ratelimit](https://github.com/upstash/ratelimit-js)
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
