# REST API Design

Best practices for designing RESTful APIs.

## HTTP Methods

```typescript
// GET - Retrieve resource
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);
});

// POST - Create resource
app.post('/api/users', async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

// PUT - Replace entire resource
app.put('/api/users/:id', async (req, res) => {
  const user = await db.users.update(req.params.id, req.body);
  res.json(user);
});

// PATCH - Partial update
app.patch('/api/users/:id', async (req, res) => {
  const user = await db.users.patch(req.params.id, req.body);
  res.json(user);
});

// DELETE - Remove resource
app.delete('/api/users/:id', async (req, res) => {
  await db.users.delete(req.params.id);
  res.status(204).send();
});
```

## Status Codes

```typescript
// 2xx Success
// 200 OK - Request succeeded
// 201 Created - Resource created
// 204 No Content - Success, no response body

// 4xx Client Error
// 400 Bad Request - Invalid input
// 401 Unauthorized - Authentication required
// 403 Forbidden - No permission
// 404 Not Found - Resource doesn't exist
// 409 Conflict - Resource conflict (duplicate)
// 422 Unprocessable Entity - Validation failed

// 5xx Server Error
// 500 Internal Server Error
// 503 Service Unavailable

app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const existing = await db.users.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const user = await db.users.create({ email, name });
  res.status(201).json(user);
});
```

## Pagination

```typescript
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const users = await db.users.find()
    .offset(offset)
    .limit(limit);

  const total = await db.users.count();

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

## Filtering & Sorting

```typescript
app.get('/api/users', async (req, res) => {
  let query = db.users;

  // Filter
  if (req.query.role) {
    query = query.where('role', req.query.role);
  }

  if (req.query.status) {
    query = query.where('status', req.query.status);
  }

  // Sort
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order || 'desc';
  query = query.orderBy(sortBy, order);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const users = await query
    .offset((page - 1) * limit)
    .limit(limit);

  res.json(users);
});
```

## Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

app.use((err: any, req: any, res: any, next: any) => {
  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An error occurred';

  res.status(status).json({
    error: {
      code,
      message,
      details: err.details
    }
  });
});
```

## API Versioning

```typescript
// URL versioning
app.get('/api/v1/users', async (req, res) => {
  // v1 implementation
});

app.get('/api/v2/users', async (req, res) => {
  // v2 implementation with breaking changes
});

// Header versioning
app.get('/api/users', async (req, res) => {
  const version = req.headers['api-version'] || '1';

  if (version === '2') {
    // v2 response format
  } else {
    // v1 response format
  }
});
```

## Rate Limiting & Caching

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);

// Cache response
app.get('/api/users/:id', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');

  const user = await db.users.findById(req.params.id);
  res.json(user);
});
```

## Best Practices

✅ **Consistent naming** - Use nouns, not verbs (/users not /getUsers)
✅ **Proper HTTP methods** - GET for retrieval, POST for creation
✅ **Meaningful status codes** - Indicate success/failure clearly
✅ **Document with OpenAPI** - Generate API documentation
✅ **CORS headers** - Control cross-origin requests

## Resources

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [OpenAPI Specification](https://spec.openapis.org/)
