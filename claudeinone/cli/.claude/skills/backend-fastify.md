# Fastify

Fast and low-overhead Node.js web framework for building APIs with built-in JSON schema validation.

## Basic Setup

```javascript
const fastify = require('fastify')({ logger: true });

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
```

## Schemas & Validation

```javascript
const schema = {
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' }
      }
    }
  }
};

fastify.post('/users', { schema }, async (request, reply) => {
  // Data is validated, typed, and serialized efficiently
  const user = await db.user.create(request.body);
  reply.status(201).send(user);
});
```

## Plugins & Hooks

```javascript
// Register plugin
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/jwt'), { secret: 'secret' });

// Pre-handler hook
fastify.addHook('preHandler', async (request, reply) => {
  await request.jwtVerify();
});

// Route-level hook
fastify.post('/protected', {
  onRequest: [fastify.authenticate]
}, async (request, reply) => {
  return { user: request.user };
});
```

## Error Handling

```javascript
fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message
    });
  } else {
    reply.status(500).send({ statusCode: 500, error: 'Internal Server Error' });
  }
});
```

## Performance

- Serializes responses using schema
- Efficient JSON parsing
- Built-in compression and caching
- Zero-copy response generation

## Best Practices

1. Always define schemas for validation
2. Use TypeScript for type safety
3. Leverage plugins for common functionality
4. Implement proper error handling
5. Monitor performance metrics

## Resources

- [Fastify Documentation](https://www.fastify.io/)
- [JSON Schema](https://json-schema.org/)
