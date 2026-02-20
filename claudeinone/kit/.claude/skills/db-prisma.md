# Prisma ORM

Type-safe database ORM for Node.js and TypeScript with excellent DX.

## Setup

```bash
npm install @prisma/client
npm install -D prisma typescript ts-node

npx prisma init
```

## Schema Definition (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts    Post[]
  comments Comment[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  comments Comment[]

  @@index([authorId])
}

model Comment {
  id        Int     @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())

  postId Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
}
```

## Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_table

# Create migration (empty)
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy

# View migration status
npx prisma migrate status

# Reset database (WARNING: destructive)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Basic Queries

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed_password'
  }
});

// Read
const userById = await prisma.user.findUnique({
  where: { id: 1 }
});

const userByEmail = await prisma.user.findFirst({
  where: { email: 'john@example.com' }
});

const allUsers = await prisma.user.findMany();

// Update
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' }
});

// Delete
await prisma.user.delete({
  where: { id: 1 }
});

// Upsert (create if not exists, else update)
const upserted = await prisma.user.upsert({
  where: { email: 'john@example.com' },
  update: { name: 'John Updated' },
  create: { email: 'john@example.com', name: 'John', password: 'hash' }
});
```

## Relationships and Eager Loading

```typescript
// Include related data
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    comments: true
  }
});

// Nested include
const userWithPostComments = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: true
      }
    }
  }
});

// Select specific fields
const userNameOnly = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true,
    posts: {
      select: {
        title: true
      }
    }
  }
});

// Create with nested relations
const userWithPost = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John',
    password: 'hash',
    posts: {
      create: [
        { title: 'First Post', content: 'Content...' },
        { title: 'Second Post', content: 'More content...' }
      ]
    }
  },
  include: { posts: true }
});
```

## Filtering and Searching

```typescript
// Where conditions
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      email: { contains: '@example.com' }
    }
  }
});

// OR condition
const results = await prisma.user.findMany({
  where: {
    OR: [
      { email: 'john@example.com' },
      { name: 'Jane' }
    ]
  }
});

// Complex filtering
const active = await prisma.user.findMany({
  where: {
    AND: [
      { createdAt: { gte: new Date('2023-01-01') } },
      { posts: { some: { published: true } } }
    ]
  }
});

// Text search (PostgreSQL)
const search = await prisma.post.findMany({
  where: {
    content: {
      search: 'typescript prisma'
    }
  }
});
```

## Pagination

```typescript
const pageSize = 10;
const page = 1;

const posts = await prisma.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});

// With count
const [posts, total] = await Promise.all([
  prisma.post.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize
  }),
  prisma.post.count()
]);

const totalPages = Math.ceil(total / pageSize);
```

## Aggregations

```typescript
// Count
const userCount = await prisma.user.count();

// Count with where
const publishedPosts = await prisma.post.count({
  where: { published: true }
});

// Aggregations (sum, avg, min, max, count)
const stats = await prisma.post.aggregate({
  where: { published: true },
  _count: true,
  _avg: { views: true },
  _sum: { likes: true }
});

// Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: true,
  orderBy: { _count: { id: 'desc' } }
});
```

## Transactions

```typescript
// Prisma interactive transactions
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: { email: 'john@example.com', name: 'John', password: 'hash' }
  }),
  prisma.post.create({
    data: { title: 'First Post', content: 'Content...', authorId: 1 }
  })
]);

// With dependent queries
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'john@example.com', name: 'John', password: 'hash' }
  });

  const post = await tx.post.create({
    data: {
      title: 'First Post',
      content: 'Content...',
      authorId: user.id
    }
  });

  return { user, post };
});
```

## Raw Queries

```typescript
// Raw SQL
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email LIKE ${'%@example.com'}
`;

// Raw execute
await prisma.$executeRaw`
  DELETE FROM "Post" WHERE "authorId" = ${1}
`;

// Unsafe (parameterized)
const email = 'john@example.com';
const user = await prisma.$queryRawUnsafe(
  'SELECT * FROM User WHERE email = ?',
  email
);
```

## Prisma Client Middleware

```typescript
prisma.$use(async (params, next) => {
  // Log queries
  console.log(`Query ${params.action} on ${params.model}`);

  const result = await next(params);
  return result;
});

// Soft deletes
prisma.$use(async (params, next) => {
  if (params.model === 'Post' && params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deleted: true };
  }
  return next(params);
});
```

## Connection Pooling

```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  // For connection pooling with PgBouncer
  // url = env("DATABASE_POOL_URL")
}
```

## Best Practices

✅ **Type safety** - Prisma generates types from schema
✅ **Migrations** - Always use `prisma migrate` for schema changes
✅ **Connection reuse** - Create single PrismaClient instance
✅ **Lazy init** - Use module-level client initialization
✅ **Error handling** - Catch Prisma-specific errors
✅ **N+1 prevention** - Use `include` or `select` to prevent N+1 queries
✅ **Indexes** - Add indexes for frequently filtered columns

## Common Patterns

```typescript
// Singleton pattern
const prisma = new PrismaClient();

export default prisma;

// Usage in different modules
import prisma from './prisma';

// Disconnect on app shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

## When to Use Prisma

✅ Type-safe ORM needed
✅ Node.js/TypeScript projects
✅ Migration management important
✅ Working with PostgreSQL, MySQL, SQLite
✅ Rapid prototyping with schema-first approach

❌ Complex stored procedures
❌ Need for raw SQL control
❌ NoSQL databases (use native drivers)

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
