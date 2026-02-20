# Clerk Authentication

## Overview
Clerk provides drop-in auth with React components, Next.js middleware, and a full user management dashboard.

## Installation

```bash
npm install @clerk/nextjs
```

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

## Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = { matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
```

## Root Layout

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider><html lang="en"><body>{children}</body></html></ClerkProvider>;
}
```

## Navbar with Auth Buttons

```tsx
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Navbar() {
  return (
    <nav>
      <SignedOut><SignInButton mode="modal" /></SignedOut>
      <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
    </nav>
  );
}
```

## Server Component Auth

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const user = await currentUser();
  return <h1>Welcome, {user?.firstName}</h1>;
}
```

## Sync to Database via Webhooks

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const payload = await req.text();
  const headers = Object.fromEntries(['svix-id','svix-timestamp','svix-signature'].map(h => [h, req.headers.get(h)!]));
  const evt = wh.verify(payload, headers) as WebhookEvent;

  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: { clerkId: evt.data.id, email: evt.data.email_addresses[0].email_address }
    });
  }
  return Response.json({ received: true });
}
```

## Resources
- [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs)
