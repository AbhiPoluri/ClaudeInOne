# Remix

## Overview
Remix is a full-stack React framework focused on web standards, nested routing, and server-side rendering.

## Setup

```bash
npx create-remix@latest my-app
cd my-app
npm run dev
```

## Route with Loader and Action

```tsx
// app/routes/users._index.tsx
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, Form, useActionData } from '@remix-run/react';
import { prisma } from '~/lib/db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({ take: 20, orderBy: { createdAt: 'desc' } });
  return json({ users });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const name = String(formData.get('name'));

  if (!email.includes('@')) return json({ error: 'Invalid email' }, { status: 400 });

  await prisma.user.create({ data: { email, name } });
  return json({ success: true });
}

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form method="post">
        <input name="email" type="email" required />
        <input name="name" required />
        <button type="submit">Add User</button>
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      </Form>
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}
```

## Error Boundary

```tsx
// app/routes/users.$id.tsx
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <h2>{error.status}: {error.statusText}</h2>;
  }
  return <h2>Unknown error</h2>;
}
```

## Auth with Session

```typescript
// app/lib/session.server.ts
import { createCookieSessionStorage, redirect } from '@remix-run/node';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    secrets: [process.env.SESSION_SECRET!],
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  }
});

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId) throw redirect('/login');
  return userId;
}
```

## Best Practices
- Use `loader` for data fetching (server-side only)
- Use `action` for mutations (form submissions, API calls)
- Loaders run in parallel for nested routes — use this for performance
- Use `defer()` with `<Await>` for streaming slow data

## Resources
- [Remix docs](https://remix.run/docs)
