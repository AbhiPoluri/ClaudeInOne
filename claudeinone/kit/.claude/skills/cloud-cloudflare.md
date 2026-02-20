# Cloudflare

Edge computing platform with Workers, KV, and D1 database.

## Workers

```typescript
// Basic worker
export default {
  async fetch(request: Request) {
    return new Response('Hello World!', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

## KV Storage

```typescript
// Store data
await NAMESPACE.put('key', 'value', { expirationTtl: 3600 });

// Retrieve data
const value = await NAMESPACE.get('key');

// Delete
await NAMESPACE.delete('key');
```

## D1 Database

```typescript
// Query database
const { success, results } = await env.DB.prepare(
  'SELECT * FROM users WHERE id = ?'
).bind(1).all();

// Insert
await env.DB.prepare(
  'INSERT INTO users (name, email) VALUES (?, ?)'
).bind('John', 'john@example.com').run();
```

## Routes

```toml
# wrangler.toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[routes]]
pattern = "example.com/api/*"
zone_name = "example.com"

[env.production]
routes = [
  { pattern = "example.com/*", zone_name = "example.com" }
]
```

## Best Practices

✅ **Use caching** - Reduce origin requests
✅ **Monitor metrics** - Track performance
✅ **Secure with authentication** - Use API keys
✅ **Enable WAF rules** - Protect from attacks

## Resources

- [Cloudflare Docs](https://developers.cloudflare.com/)
- [Workers Guide](https://developers.cloudflare.com/workers/)
