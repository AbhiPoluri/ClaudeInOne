# Neon Serverless Postgres

## Overview
Neon is serverless PostgreSQL with branching, autoscaling to zero, and a generous free tier.

## Setup

```bash
npm install @neondatabase/serverless
```

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Direct SQL

```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

const users = await sql`SELECT * FROM users WHERE active = true LIMIT 20`;
const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
const [newUser] = await sql`INSERT INTO users (email, name) VALUES (${email}, ${name}) RETURNING *`;
```

## With Prisma

```bash
npm install prisma @prisma/client @prisma/adapter-neon
```

```typescript
import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
export const prisma = new PrismaClient({ adapter });
```

```env
# Use pooled for app, direct for migrations
DATABASE_URL=...?pgbouncer=true
DIRECT_URL=...  # without pgbouncer
```

## Database Branching for PRs

```bash
# Create branch for PR preview
neon branches create --name preview/pr-123 --parent main

# Get connection string
neon connection-string preview/pr-123

# Delete branch after PR merge
neon branches delete preview/pr-123
```

## Best Practices
- Always use pooled connection URL for serverless functions
- Use `DIRECT_URL` for Prisma migrations
- Enable autoscale-to-zero on dev/staging to save costs
- Use branching in CI for isolated integration tests

## Resources
- [Neon docs](https://neon.tech/docs)
- [Neon + Prisma](https://neon.tech/docs/guides/prisma)
