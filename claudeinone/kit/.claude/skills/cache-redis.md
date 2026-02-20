# Redis Caching

In-memory data store for caching, sessions, and real-time data.

## Setup

```bash
npm install redis ioredis
```

## Basic Caching

```typescript
import { createClient } from 'redis';

const redis = createClient({
  host: 'localhost',
  port: 6379
});

await redis.connect();

// Set cache
await redis.set('user:123', JSON.stringify({ id: '123', name: 'John' }), {
  EX: 3600 // Expire in 1 hour
});

// Get cache
const cached = await redis.get('user:123');
const user = JSON.parse(cached || '{}');

// Delete cache
await redis.del('user:123');

// Check exists
const exists = await redis.exists('user:123');
```

## Cache-Aside Pattern

```typescript
async function getUser(userId: string) {
  // Check cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const user = await db.users.findById(userId);

  // Store in cache
  if (user) {
    await redis.set(`user:${userId}`, JSON.stringify(user), {
      EX: 3600
    });
  }

  return user;
}
```

## Cache Invalidation

```typescript
// Invalidate on update
async function updateUser(userId: string, updates: any) {
  const user = await db.users.update(userId, updates);

  // Clear cache
  await redis.del(`user:${userId}`);
  
  // Clear related caches
  await redis.del(`user:${userId}:posts`);

  return user;
}

// Pattern invalidation
async function invalidateUserCaches(userId: string) {
  const keys = await redis.keys(`user:${userId}:*`);
  if (keys.length > 0) {
    await redis.del(keys);
  }
}
```

## Session Storage

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';

const redisClient = createClient();

const sessionStore = new RedisStore({ client: redisClient });

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);
```

## Lists & Queues

```typescript
// Push to queue
await redis.lPush('email:queue', JSON.stringify({
  to: 'user@example.com',
  subject: 'Welcome'
}));

// Pop from queue
const job = await redis.rPop('email:queue');

// List length
const count = await redis.lLen('email:queue');

// Get range
const jobs = await redis.lRange('email:queue', 0, -1);
```

## Sorted Sets (Leaderboards)

```typescript
// Add score
await redis.zAdd('leaderboard', {
  score: 100,
  member: 'user:123'
});

// Increment score
await redis.zIncrBy('leaderboard', 10, 'user:123');

// Get top 10
const topPlayers = await redis.zRevRange('leaderboard', 0, 9, {
  WITHSCORES: true
});

// Get rank
const rank = await redis.zRevRank('leaderboard', 'user:123');
```

## Pub/Sub

```typescript
// Subscriber
const subscriber = redis.duplicate();
await subscriber.connect();

await subscriber.subscribe('channel:notifications', (message) => {
  console.log('Notification:', message);
});

// Publisher
await redis.publish('channel:notifications', JSON.stringify({
  type: 'user:created',
  userId: '123'
}));
```

## Transactions

```typescript
const pipeline = redis.multi();

pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.get('key1');
pipeline.incr('counter');

const results = await pipeline.exec();
```

## Best Practices

✅ **TTL values** - Always set expiration times
✅ **Key naming** - Use consistent patterns (entity:id:property)
✅ **Connection pooling** - Reuse connections
✅ **Monitoring** - Track hit rates and evictions
✅ **Persistence** - Enable AOF/RDB for important data

## Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Node.js Client](https://github.com/luin/ioredis)
