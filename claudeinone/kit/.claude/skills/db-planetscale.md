# PlanetScale

## Overview
PlanetScale is a MySQL-compatible serverless database with Git-like branching and horizontal scaling via Vitess.

## Setup

```bash
npm install @planetscale/database
```

```env
DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/mydb?ssl={"rejectUnauthorized":true}
```

## Direct SQL

```typescript
import { connect } from '@planetscale/database';
const conn = connect({ url: process.env.DATABASE_URL });

const { rows } = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
const result = await conn.execute('INSERT INTO users (id, email, name) VALUES (?, ?, ?)', [id, email, name]);
console.log(result.insertId);
```

## With Prisma

```prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"  // PlanetScale disables FK constraints
}
```

```bash
npx prisma db push  # Use db push instead of migrate for PlanetScale
```

## With Drizzle

```typescript
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

const connection = connect({ url: process.env.DATABASE_URL });
const db = drizzle(connection);

const results = await db.select().from(users).where(eq(users.email, email));
await db.insert(users).values({ id: crypto.randomUUID(), email, name });
```

## Branch Workflow

```bash
# Create dev branch
pscale branch create mydb dev

# Connect to dev branch locally
pscale connect mydb dev --port 3309

# Create deploy request (schema PR)
pscale deploy-request create mydb dev

# Merge (runs online DDL, no downtime)
pscale deploy-request deploy mydb 1
```

## Best Practices
- Use `relationMode = "prisma"` since PlanetScale disables FK constraints
- Never modify main branch directly — always use branches + deploy requests
- Use deploy requests for zero-downtime schema migrations

## Resources
- [PlanetScale quickstart](https://planetscale.com/docs/tutorials/planetscale-quickstart-guide)
