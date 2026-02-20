# Multi-Tenancy

## Overview
Multi-tenancy serves multiple organizations from a single application with isolated data.

## Strategies
| Strategy | Isolation | Complexity | Cost |
|----------|-----------|------------|------|
| Row-level (shared DB) | Low | Low | Low |
| Schema-per-tenant | Medium | Medium | Medium |
| Database-per-tenant | High | High | High |

## Row-Level Isolation (Most Common)

```typescript
// Every query scoped by tenantId
const posts = await prisma.post.findMany({
  where: { tenantId: req.tenant.id },
});

// Middleware to inject tenant into every request
export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const subdomain = req.hostname.split('.')[0];
  const tenant = await prisma.tenant.findUnique({ where: { subdomain } });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  req.tenant = tenant;
  next();
}
```

## Prisma Extension for Automatic Tenant Scoping

```typescript
import { PrismaClient } from '@prisma/client';

export function createTenantClient(tenantId: string) {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async create({ args, query }) {
          args.data = { ...args.data, tenantId };
          return query(args);
        },
      },
    },
  });
}

// Usage
const db = createTenantClient(req.tenant.id);
const users = await db.user.findMany(); // automatically scoped
```

## Tenant Resolution from Subdomain

```typescript
// middleware.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') ?? '';
  const subdomain = hostname.replace(`.${process.env.ROOT_DOMAIN}`, '');

  if (subdomain && subdomain !== www) {
    return NextResponse.rewrite(new URL(`/t/${subdomain}${req.nextUrl.pathname}`, req.url));
  }
}
```

## Best Practices
- Add `tenantId` index on every multi-tenant table
- Validate tenant access on every query (defense in depth)
- Use Prisma extensions or middleware to enforce scoping automatically
- Rate limit per tenant to prevent noisy-neighbor problems

## Resources
- [Prisma multi-tenancy guide](https://www.prisma.io/docs/guides/other/multi-tenancy)
