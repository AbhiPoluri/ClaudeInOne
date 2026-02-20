# Caching Strategies

Implementing effective caching.

## Cache Invalidation

```typescript
// Time-based expiration
async function getCachedUser(id: string) {
  const cache = new Map();
  const CacheTTL = 60 * 60 * 1000; // 1 hour

  const cached = cache.get(id);
  if (cached && Date.now() - cached.timestamp < CacheTTL) {
    return cached.data;
  }

  const user = await db.users.findById(id);
  cache.set(id, { data: user, timestamp: Date.now() });
  return user;
}

// Event-based invalidation
async function updateUser(id: string, data: any) {
  const user = await db.users.update(id, data);
  
  // Clear cache
  cache.delete(`user:${id}`);
  cache.delete('users:list');
  
  // Publish event
  eventBus.emit('user:updated', user);
  
  return user;
}

// Dependency-based
const userCache = cache.with('user', {
  expires: 3600,
  dependencies: ['user']
});
```

## Multi-Level Caching

```typescript
// L1: Memory, L2: Redis, L3: Database
async function getUser(id: string) {
  // L1: Memory cache
  if (memoryCache.has(`user:${id}`)) {
    return memoryCache.get(`user:${id}`);
  }

  // L2: Redis
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    const user = JSON.parse(cached);
    memoryCache.set(`user:${id}`, user);
    return user;
  }

  // L3: Database
  const user = await db.users.findById(id);
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
  memoryCache.set(`user:${id}`, user);
  
  return user;
}
```

## Cache Warming

```typescript
async function warmCache() {
  const users = await db.users.find({ featured: true });
  
  for (const user of users) {
    await redis.set(`user:${user.id}`, JSON.stringify(user), 'EX', 86400);
  }
  
  console.log('Cache warmed');
}

// Run on startup
app.listen(3000, () => {
  warmCache().catch(console.error);
});
```

## Best Practices

✅ **Cache invalidation** - Know when to clear
✅ **TTL strategy** - Appropriate expiration
✅ **Multi-level** - Memory + Redis + DB
✅ **Monitoring** - Track hit rates
✅ **Size limits** - Prevent memory bloat

## Resources

- [Caching Patterns](https://codeahoy.com/2017/08/11/caching-strategies-explained/)
