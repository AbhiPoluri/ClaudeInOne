# OpenAPI / Swagger

## Overview
Document REST APIs with OpenAPI 3.x specs for auto-generated clients, validation, and interactive docs.

## Setup with Swagger UI (Express)

```bash
npm install swagger-ui-express @asteasolutions/zod-to-openapi
```

```typescript
import swaggerUi from 'swagger-ui-express';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const registry = new OpenAPIRegistry();

// Define schemas
const UserSchema = registry.register('User', z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
}));

// Register paths
registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'User found',
      content: { 'application/json': { schema: UserSchema } },
    },
    404: { description: 'User not found' },
  },
});

// Generate spec
const generator = new OpenApiGeneratorV3(registry.definitions);
const spec = generator.generateDocument({
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
  servers: [{ url: 'https://api.example.com' }],
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/api/openapi.json', (req, res) => res.json(spec));
```

## Next.js with next-swagger-doc

```bash
npm install next-swagger-doc swagger-ui-react
```

```typescript
// pages/api/doc.ts
import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Next.js API', version: '0.1.0' },
  },
  apiFolder: 'pages/api',
});
export default swaggerHandler;
```

## JSDoc Annotations

```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(req: Request) {
  // handler...
}
```

## Best Practices
- Generate spec from code (not hand-write YAML) to keep it in sync
- Use `zod-to-openapi` to reuse validation schemas as OpenAPI models
- Document all error responses, not just success
- Version the spec URL: `/api/v1/openapi.json`

## Resources
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.0)
- [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
