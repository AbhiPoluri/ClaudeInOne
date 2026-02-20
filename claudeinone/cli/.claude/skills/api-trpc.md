# tRPC

End-to-end typesafe APIs using TypeScript.

## Setup

```bash
npm install @trpc/server @trpc/client zod
```

## Router Definition

```typescript
import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const userRouter = router({
  get: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input: userId }) => {
      return await db.user.findUnique({
        where: { id: userId }
      });
    }),

  list: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
      offset: z.number().default(0)
    }))
    .query(async ({ input }) => {
      return await db.user.findMany({
        take: input.limit,
        skip: input.offset
      });
    }),

  create: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      return await db.user.create({ data: input });
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      return await db.user.update({
        where: { id: input.id },
        data: input
      });
    })
});

export const appRouter = router({
  user: userRouter,
  post: postRouter
});

export type AppRouter = typeof appRouter;
```

## Server Setup

```typescript
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';

const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({
    user: null // Add auth context
  })
});

server.listen(3000);
```

## Middleware & Auth

```typescript
import { TRPCError } from '@trpc/server';

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user: ctx.user }
  });
});

const protectedProcedure = t.procedure.use(isAuthenticated);

export const protectedRouter = router({
  getProfile: protectedProcedure
    .query(({ ctx }) => {
      return ctx.user;
    }),

  updateProfile: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db.user.update({
        where: { id: ctx.user.id },
        data: input
      });
    })
});
```

## React Client

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/router';

const trpc = createTRPCReact<AppRouter>();

function App() {
  const client = trpc.createClient({
    url: 'http://localhost:3000'
  });

  return (
    <trpc.Provider client={client}>
      <UserList />
    </trpc.Provider>
  );
}

function UserList() {
  // Full type safety!
  const users = trpc.user.list.useQuery({ limit: 10 });

  const createUser = trpc.user.create.useMutation();

  if (users.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users.data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      
      <button onClick={() => createUser.mutate({
        email: 'new@example.com',
        name: 'New User'
      })}>
        Add User
      </button>
    </div>
  );
}
```

## Best Practices

✅ **Input validation** - Use Zod for schema validation
✅ **Error handling** - Use TRPCError with proper codes
✅ **Type safety** - Leverage full end-to-end types
✅ **Middleware** - Authentication, logging, rate limiting
✅ **Batch requests** - Reduce HTTP calls

## Resources

- [tRPC Documentation](https://trpc.io/)
- [Zod Schema Validation](https://zod.dev/)
