# Hono

Lightweight, ultra-fast web framework for edge runtimes (Cloudflare Workers, Deno, Node.js).

## Hello World

```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello, World!'));

app.post('/users', async (c) => {
  const body = await c.req.json();
  return c.json({ created: body }, 201);
});

export default app;
```

## Routing

```typescript
const app = new Hono();

app.get('/users', async (c) => {
  return c.json(await db.users.list());
});

app.get('/users/:id', async (c) => {
  const id = c.req.param('id');
  const user = await db.users.get(id);
  return c.json(user);
});

app.post('/users', async (c) => {
  const body = await c.req.json();
  const user = await db.users.create(body);
  return c.json(user, 201);
});
```

## Middleware

```typescript
// Built-in middleware
app.use(cors());
app.use(logger());

// Custom middleware
app.use(async (c, next) => {
  const start = Date.now();
  await next();
  console.log(`${Date.now() - start}ms`);
});

// Route-specific middleware
app.post('/api/*', authenticate, (c) => {
  return c.json({ user: c.get('user') });
});
```

## Parameters & Validation

```typescript
app.post('/items/:id', (c) => {
  const id = c.req.param('id');
  const query = c.req.query('page');
  const body = c.req.json();
  
  return c.json({ id, query, body });
});
```

## Edge Runtime Support

```typescript
// Works on Cloudflare Workers, Deno, Node.js
// No environment-specific code needed
export default app;
```

## Best Practices

1. Leverage edge runtime when possible
2. Keep middleware focused
3. Use proper status codes
4. Return structured responses
5. Handle errors consistently

## Resources

- [Hono Documentation](https://hono.dev/)
- [Edge Runtime Compatibility](https://hono.dev/docs/getting-started/cf-workers)
