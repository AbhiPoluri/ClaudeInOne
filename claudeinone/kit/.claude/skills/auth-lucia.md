# Lucia Auth

Simple and flexible authentication library for SvelteKit, Astro, and other frameworks.

## Setup

```bash
npm install lucia @lucia-auth/adapter-prisma
```

## Prisma Schema

```prisma
model User {
  id            String    @id @unique
  primary_email String
  created_at    DateTime  @default(now())

  auth_session AuthSession[]
  auth_key     AuthKey[]
}

model AuthSession {
  id             String    @id @unique
  user_id        String    @unique
  user           User      @relation(references: [id], fields: [user_id], onDelete: Cascade)
  active_expires BigInt
  idle_expires   BigInt
}

model AuthKey {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)
}
```

## Lucia Configuration

```typescript
import lucia from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';

export const auth = lucia({
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  adapter: prisma(db),
  getUserAttributes: (data) => {
    return { email: data.primary_email };
  }
});
```

## Login/Signup

```typescript
// Sign up
const user = await auth.createUser({
  key: {
    providerId: 'email',
    providerUserId: email,
    password: hashedPassword
  },
  attributes: { primary_email: email }
});

// Create session
const session = await auth.createSession({ userId: user.userId });

// Login
const key = await auth.useKey('email', email, password);
const session = await auth.createSession({ userId: key.userId });
```

## Session Management

```typescript
// Get session
const { session, user } = await auth.validateSession(sessionId);

// Invalidate session
await auth.invalidateSession(sessionId);

// Update session
await auth.updateUserAttributes(userId, { primary_email: newEmail });
```

## Resources

- [Lucia Docs](https://lucia-auth.com/)
