# Database Query Optimization

Techniques for improving database performance.

## Indexes

```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Full-text index
CREATE FULLTEXT INDEX idx_articles_content ON articles(title, content);

-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';
```

## Query Analysis

```typescript
// Analyze slow queries
import { db } from './db';

// Enable query logging
db.logger.setLogLevel('query');

// Use explain to see execution plan
const plan = await db.connection.explain(`
  SELECT u.*, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  WHERE u.status = 'active'
  GROUP BY u.id
`);

console.log('Query plan:', plan);
```

## N+1 Problem

```typescript
// Bad: N+1 queries
const users = await db.users.find(); // 1 query
for (const user of users) {
  user.posts = await db.posts.find({ userId: user.id }); // N queries
}

// Good: Single query with join
const users = await db.users.find({
  include: { posts: true }
});

// Good: Use pagination
const users = await db.users.find({
  include: {
    posts: {
      select: { id: true, title: true }, // Only needed fields
      take: 5 // Limit related records
    }
  }
});
```

## Connection Pooling

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Use pool for queries
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

## Denormalization

```typescript
// Normalized schema (slow queries)
users (id, email, name)
posts (id, user_id, content)
comments (id, post_id, user_id, text)

// Query requires 3 joins
SELECT u.name, COUNT(c.id) as comment_count
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY u.id

// Denormalized schema (faster queries)
posts (id, user_id, user_name, comment_count)

// Query is direct
SELECT user_name, comment_count FROM posts
```

## Query Caching

```typescript
import { redis } from './redis';

async function getUserWithCache(userId: string) {
  const cacheKey = `user:${userId}`;
  
  // Check cache
  let user = await redis.get(cacheKey);
  if (user) return JSON.parse(user);
  
  // Query database
  user = await db.users.findById(userId);
  
  // Store in cache (1 hour TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}

// Invalidate on update
async function updateUser(userId: string, data: any) {
  const user = await db.users.update(userId, data);
  
  // Clear cache
  await redis.del(`user:${userId}`);
  
  return user;
}
```

## Batch Operations

```typescript
// Bad: Individual inserts
for (const item of items) {
  await db.items.create(item); // N queries
}

// Good: Batch insert
await db.items.createMany(items); // 1 query

// Good: Batch update
await db.items.updateMany(
  { status: 'pending' },
  { status: 'active' }
);

// Good: Upsert
await db.items.upsertMany(
  items,
  { upsertFields: ['externalId'] }
);
```

## Partitioning & Sharding

```sql
-- Partition by date (time-series data)
CREATE TABLE logs (
  id INT,
  timestamp TIMESTAMP,
  message TEXT
) PARTITION BY RANGE (YEAR(timestamp)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Shard by user_id (horizontal scaling)
-- Each shard holds data for subset of users
-- Shard 1: users 1-1M
-- Shard 2: users 1M-2M
-- etc.
```

## Best Practices

✅ **Index strategically** - Only on frequently queried columns
✅ **Avoid N+1** - Eager load related data
✅ **Monitor slow queries** - Log and analyze slow operations
✅ **Use pagination** - Don't fetch all rows
✅ **Denormalize carefully** - Trade consistency for performance

## Resources

- [PostgreSQL Query Performance](https://www.postgresql.org/docs/current/performance.html)
- [MySQL Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Database Design for Performance](https://www.sqlshack.com/query-optimization-performance-tuning/)
