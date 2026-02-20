# Bun Runtime

## Overview
Bun is a fast JavaScript runtime, package manager, bundler, and test runner in one tool.

## Installation

```bash
curl -fsSL https://bun.sh/install | bash
```

## Package Management

```bash
bun install                    # Install all deps (fast!)
bun add react react-dom        # Add packages
bun add -D typescript          # Add dev deps
bun remove lodash              # Remove
bun update                     # Update all
```

## Run Scripts

```bash
bun run dev                    # Run script from package.json
bun run src/index.ts           # Run TypeScript file directly
bun --hot src/server.ts        # Hot reload (like nodemon)
```

## HTTP Server

```typescript
// server.ts
Bun.serve({
  port: 3000,
  async fetch(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === '/api/users') {
      const users = await db.user.findMany();
      return Response.json(users);
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' });
    }

    return new Response('Not Found', { status: 404 });
  },
});
```

## SQLite with Bun

```typescript
import { Database } from 'bun:sqlite';

const db = new Database('myapp.db');
db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT)`);

const insert = db.prepare('INSERT INTO users VALUES ($id, $name, $email)');
insert.run({ $id: crypto.randomUUID(), $name: 'Alice', $email: 'alice@example.com' });

const users = db.prepare('SELECT * FROM users').all();
```

## Testing

```typescript
// users.test.ts
import { describe, expect, it } from 'bun:test';

describe('User service', () => {
  it('creates a user', async () => {
    const user = await createUser({ email: 'test@example.com', name: 'Test' });
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

```bash
bun test             # Run all tests
bun test --watch     # Watch mode
bun test --coverage  # With coverage
```

## Best Practices
- Use `bun:sqlite` for local dev databases — no setup needed
- Use `--hot` flag instead of `nodemon` for server development
- `bun build` for bundling: `bun build ./src/index.ts --outdir ./dist --target node`

## Resources
- [Bun docs](https://bun.sh/docs)
