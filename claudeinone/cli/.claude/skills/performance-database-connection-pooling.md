# Database Connection Pooling

Efficient database connection management.

## PostgreSQL Pooling

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'user',
  password: 'password',
  max: 20,              // Maximum connections
  min: 5,               // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(text: string, values?: any[]) {
  return pool.query(text, values);
}
```

## Connection Reuse

```typescript
// Good: Reuse connections
const result = await pool.query('SELECT * FROM users WHERE id = $1', [1]);

// Avoid: Creating new connections
const client = new Client(); // Don't do this repeatedly
await client.connect();
const result = await client.query('...');
await client.disconnect();
```

## Monitoring

```typescript
setInterval(() => {
  console.log('Pool stats:', {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  });
}, 10000);
```

## Best Practices

✅ **Size appropriately** - Not too large, not too small
✅ **Monitor metrics** - Track usage
✅ **Connection timeouts** - Prevent hangs
✅ **Error handling** - Graceful degradation
✅ **Idle timeouts** - Clean up unused connections

## Resources

- [PG Pool Documentation](https://node-postgres.com/api/pool)
