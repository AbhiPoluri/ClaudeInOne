# Session Authentication

## Overview
Server-side sessions store user state on the server, giving the client only an encrypted session cookie.

## iron-session (Next.js)

```bash
npm install iron-session
```

```typescript
// lib/session.ts
import { SessionOptions } from 'iron-session';

export interface SessionData { userId?: string; role?: string; }

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  },
};
```

```typescript
// app/api/auth/login/route.ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.userId = user.id;
  session.role = user.role;
  await session.save();
  return Response.json({ success: true });
}

// app/api/auth/logout/route.ts
export async function POST() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  return Response.json({ success: true });
}
```

## Express Sessions with Redis

```bash
npm install express-session connect-redis redis
```

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' }
}));
```

## Best Practices
- Use `httpOnly: true` and `secure: true` in production
- Use Redis — never memory store in production
- Regenerate session ID on login to prevent fixation: `req.session.regenerate(cb)`
- Set `sameSite: 'lax'` to prevent CSRF

## Resources
- [iron-session](https://github.com/vvo/iron-session)
