# Drizzle ORM

Lightweight TypeScript-first ORM with native async/await support and zero dependencies.

## Setup

```bash
npm install drizzle-orm drizzle-kit
npm install pg # for PostgreSQL
npm install -D @types/pg

# Initialize schema
npx drizzle-kit init
```

## Schema Definition

```typescript
import { pgTable, serial, text, varchar, boolean, timestamp, integer, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email)
  })
);

// Posts table
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    published: boolean('published').default(false),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  (table) => ({
    authorIdx: index('author_idx').on(table.authorId)
  })
);

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}));
```

## Migrations

```bash
# Generate migration
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg

# Create migration manually
npx drizzle-kit up:pg

# Drop schema
npx drizzle-kit drop

# View migration status
npx drizzle-kit status:pg
```

## Database Connection

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  database: 'mydb'
});

// Create Drizzle ORM instance
export const db = drizzle(pool);
```

## Basic Queries

```typescript
import { db } from './db';
import { users, posts } from './schema';
import { eq } from 'drizzle-orm';

// Create
const newUser = await db.insert(users).values({
  email: 'john@example.com',
  name: 'John Doe',
  password: 'hashed_password'
});

// Read - single
const user = await db.select().from(users).where(eq(users.id, 1));

// Read - all
const allUsers = await db.select().from(users);

// Read - with condition
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.status, 'active'));

// Update
const updated = await db
  .update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, 1));

// Delete
await db.delete(users).where(eq(users.id, 1));
```

## Relationships and Joins

```typescript
// Get user with all posts
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: {
    posts: true
  }
});

// Join syntax
const postsWithAuthors = await db
  .select({
    postId: posts.id,
    title: posts.title,
    authorName: users.name
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Multiple joins
const postsWithComments = await db
  .select()
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .leftJoin(comments, eq(posts.id, comments.postId));
```

## Filtering and Conditions

```typescript
import { and, or, like, gte, lte, inArray } from 'drizzle-orm';

// Multiple conditions (AND)
const posts = await db
  .select()
  .from(posts)
  .where(
    and(
      eq(posts.published, true),
      gte(posts.createdAt, new Date('2024-01-01'))
    )
  );

// OR condition
const results = await db
  .select()
  .from(users)
  .where(
    or(
      eq(users.email, 'john@example.com'),
      eq(users.email, 'jane@example.com')
    )
  );

// LIKE search
const search = await db
  .select()
  .from(users)
  .where(like(users.name, '%John%'));

// IN clause
const specific = await db
  .select()
  .from(posts)
  .where(inArray(posts.authorId, [1, 2, 3]));
```

## Pagination and Ordering

```typescript
// Pagination
const pageSize = 10;
const page = 1;

const paginated = await db
  .select()
  .from(posts)
  .limit(pageSize)
  .offset((page - 1) * pageSize)
  .orderBy(posts.createdAt);

// Get total count
const total = await db
  .select({ count: countDistinct(posts.id) })
  .from(posts);

const totalPages = Math.ceil(total[0].count / pageSize);
```

## Aggregations

```typescript
import { count, sum, avg, max, min } from 'drizzle-orm';

// Count
const postCount = await db
  .select({ value: count() })
  .from(posts);

// With grouping
const postsByAuthor = await db
  .select({
    authorId: posts.authorId,
    count: count(posts.id)
  })
  .from(posts)
  .groupBy(posts.authorId)
  .orderBy(({ count: cnt }) => desc(cnt));

// Aggregations
const stats = await db
  .select({
    totalPosts: count(posts.id),
    avgLength: avg(posts.content),
    maxLength: max(posts.content)
  })
  .from(posts)
  .where(eq(posts.published, true));
```

## Transactions

```typescript
// Atomic transactions
const result = await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({
    email: 'john@example.com',
    name: 'John',
    password: 'hash'
  });

  const post = await tx.insert(posts).values({
    title: 'First Post',
    content: 'Content...',
    authorId: user[0].id
  });

  return { user, post };
});

// Rollback on error
try {
  await db.transaction(async (tx) => {
    // Operations
    throw new Error('Rollback!');
  });
} catch (err) {
  console.log('Transaction rolled back');
}
```

## Parameterized Queries (SQL Injection Prevention)

```typescript
import { sql } from 'drizzle-orm';

// Safe parameter usage
const email = 'john@example.com';
const user = await db
  .select()
  .from(users)
  .where(sql`${users.email} = ${email}`);

// Raw SQL with parameters
const query = await db.execute(
  sql`SELECT * FROM ${users} WHERE email = ${email}`
);
```

## Migrations with Version History

```bash
# Show migrations status
npx drizzle-kit status:pg --dir ./drizzle

# Migrate to specific version
npx drizzle-kit migrate --migrations ./drizzle

# View all migrations
ls drizzle/migrations/
```

## Best Practices

✅ **Type safety** - Full TypeScript support with zero-cost abstractions
✅ **Minimal ORM** - No magic, explicit queries
✅ **Auto-migrations** - Generate migrations from schema changes
✅ **Connection pooling** - Reuse connections efficiently
✅ **Prepared statements** - SQL injection protected by default
✅ **Query building** - Composable, chainable queries
✅ **Relations** - Optional eager loading with `with` syntax

## Performance Tips

- Use `select()` with specific columns to reduce payload
- Add indexes to frequently filtered columns
- Use connection pooling in production
- Batch inserts: `db.insert().values([...])`
- Monitor slow queries with database logs

## When to Use Drizzle

✅ Want lightweight, TypeScript-first ORM
✅ Need explicit SQL control
✅ PostgreSQL, MySQL, SQLite projects
✅ Building serverless apps (Vercel, AWS Lambda)
✅ Prefer generated migrations

❌ Need GraphQL-first tooling (use Prisma)
❌ Complex stored procedures needed
❌ Learning ORM for the first time

## Resources

- [Drizzle Documentation](https://orm.drizzle.team/)
- [Drizzle ORM API](https://orm.drizzle.team/docs/get-started)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- [Examples](https://github.com/drizzle-team/drizzle-orm/tree/main/examples)
