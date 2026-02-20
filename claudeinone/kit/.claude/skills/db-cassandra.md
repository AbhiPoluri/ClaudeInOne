# Apache Cassandra

## Overview
Cassandra is a distributed NoSQL database designed for high write throughput, linear scalability, and no single point of failure.

## Setup with cassandra-driver

```bash
npm install cassandra-driver
```

```typescript
import { Client, auth } from 'cassandra-driver';

const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST!],
  localDataCenter: 'datacenter1',
  credentials: {
    username: process.env.CASSANDRA_USER!,
    password: process.env.CASSANDRA_PASSWORD!,
  },
  keyspace: 'myapp',
});

await client.connect();
```

## Schema (CQL)

```sql
CREATE KEYSPACE IF NOT EXISTS myapp
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE myapp;

-- Time-series events table (common pattern)
CREATE TABLE IF NOT EXISTS user_events (
  user_id UUID,
  event_time TIMESTAMP,
  event_type TEXT,
  data TEXT,
  PRIMARY KEY (user_id, event_time)
) WITH CLUSTERING ORDER BY (event_time DESC);

-- Wide row for user timeline
CREATE TABLE IF NOT EXISTS user_timeline (
  user_id UUID,
  post_id TIMEUUID,
  content TEXT,
  PRIMARY KEY (user_id, post_id)
) WITH CLUSTERING ORDER BY (post_id DESC);
```

## CRUD Operations

```typescript
// Insert
await client.execute(
  'INSERT INTO user_events (user_id, event_time, event_type, data) VALUES (?, ?, ?, ?)',
  [userId, new Date(), 'login', JSON.stringify({ ip: '127.0.0.1' })],
  { prepare: true }
);

// Query
const result = await client.execute(
  'SELECT * FROM user_events WHERE user_id = ? ORDER BY event_time DESC LIMIT 20',
  [userId],
  { prepare: true }
);
const events = result.rows;

// Batch write
const batch = [
  { query: 'INSERT INTO user_events ...', params: [...] },
  { query: 'UPDATE user_stats ...', params: [...] },
];
await client.batch(batch, { prepare: true });
```

## Best Practices
- Design tables for query patterns — denormalize heavily
- Use `prepare: true` for all parameterized queries
- Partition key determines which node holds data — choose for even distribution
- Avoid `ALLOW FILTERING` — it causes full table scans
- Use TTL for time-series or expiring data: `INSERT ... USING TTL 86400`

## Resources
- [cassandra-driver docs](https://docs.datastax.com/en/developer/nodejs-driver/)
- [Cassandra data modeling](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/)
