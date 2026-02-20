# Rate Limiting & Throttling

Controlling request rates and protecting APIs.

## Token Bucket Algorithm

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private capacity: number,
    private refillRate: number // tokens per second
  ) {
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  canConsume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  private refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }
}

// Usage
const bucket = new TokenBucket(10, 1); // 10 tokens, 1 per second

if (bucket.canConsume()) {
  processRequest();
} else {
  return res.status(429).json({ error: 'Rate limit exceeded' });
}
```

## Sliding Window Rate Limiting

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();

  canMakeRequest(userId: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get requests in current window
    let userRequests = this.requests.get(userId) || [];
    userRequests = userRequests.filter(time => time > windowStart);

    if (userRequests.length >= limit) {
      return false;
    }

    // Add new request
    userRequests.push(now);
    this.requests.set(userId, userRequests);

    return true;
  }
}

// Usage
const limiter = new RateLimiter();

app.get('/api/data', (req, res) => {
  const userId = req.user.id;

  if (!limiter.canMakeRequest(userId, 100, 60000)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  res.json(data);
});
```

## Redis Rate Limiting

```typescript
import { Redis } from 'ioredis';

const redis = new Redis();

async function checkRateLimit(
  userId: string,
  limit: number = 100,
  windowMs: number = 60000
): Promise<boolean> {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Remove old requests
  await redis.zremrangebyscore(key, 0, windowStart);

  // Get request count
  const count = await redis.zcard(key);

  if (count >= limit) {
    return false;
  }

  // Add current request
  await redis.zadd(key, now, `${now}-${Math.random()}`);

  // Set expiration
  await redis.expire(key, Math.ceil(windowMs / 1000));

  return true;
}

// Usage
app.use(async (req, res, next) => {
  const userId = req.user?.id || req.ip;

  if (!(await checkRateLimit(userId))) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  next();
});
```

## Differentiated Rate Limits

```typescript
function getRateLimit(user: any) {
  switch (user.tier) {
    case 'free':
      return { limit: 100, windowMs: 3600000 }; // 100/hour
    case 'pro':
      return { limit: 10000, windowMs: 3600000 }; // 10k/hour
    case 'enterprise':
      return { limit: Infinity, windowMs: 0 }; // Unlimited
    default:
      return { limit: 100, windowMs: 3600000 };
  }
}

app.use(async (req, res, next) => {
  const { limit, windowMs } = getRateLimit(req.user);

  if (!await checkRateLimit(req.user.id, limit, windowMs)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }

  next();
});
```

## Best Practices

✅ **User-based limits** - Per user, not per IP
✅ **Tiered limits** - Different for different users
✅ **Return headers** - X-RateLimit-Remaining
✅ **Graceful degradation** - Queue requests vs reject
✅ **Monitor abuse** - Track limit violations

## Resources

- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Node.js Rate Limiting](https://www.npmjs.com/package/bottleneck)
