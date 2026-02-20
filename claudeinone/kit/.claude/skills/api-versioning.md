# API Versioning

## Overview
Strategies for evolving APIs without breaking existing clients.

## URL Path Versioning

```typescript
// Express versioned routes
const v1 = express.Router();
v1.get('/users', async (req, res) => {
  const users = await db.user.findMany({ select: { id: true, name: true, email: true } });
  res.json(users);
});

const v2 = express.Router();
v2.get('/users', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    db.user.findMany({ skip, take: Number(limit) }),
    db.user.count()
  ]);
  res.json({ data: users, meta: { page: Number(page), limit: Number(limit), total } });
});

app.use('/api/v1', v1);
app.use('/api/v2', v2);
```

## Next.js App Router Versioning

```typescript
// app/api/v1/users/route.ts
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// app/api/v2/users/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 20);
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip: (page - 1) * limit, take: limit }),
    prisma.user.count()
  ]);
  return Response.json({ data: users, meta: { page, limit, total } });
}
```

## Deprecation Headers

```typescript
function addDeprecationHeaders(res: Response, sunset: string) {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', sunset);
  res.setHeader('Link', '</api/v2/users>; rel="successor-version"');
}
```

## Best Practices
- Version from day one
- Keep v1 alive for 12+ months after v2 launch
- Always return `X-API-Version` response header
- Use `Sunset` header to communicate deprecation timelines

## Resources
- [Stripe API versioning](https://stripe.com/docs/api/versioning)
