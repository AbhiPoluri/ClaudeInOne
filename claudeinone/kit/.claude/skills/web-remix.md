# Remix

Full-stack framework for building modern web applications with React and TypeScript.

## Setup

```bash
npm create remix@latest my-app
cd my-app
npm install
npm run dev
```

## Route Handler

```typescript
// app/routes/users.$id.tsx
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await db.users.findById(params.id);

  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ user });
}

export default function UserPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Forms

```typescript
// app/routes/users.new.tsx
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const email = formData.get('email');
  const name = formData.get('name');

  const errors = {};
  if (!email) errors.email = 'Email required';
  if (!name) errors.name = 'Name required';

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  const user = await db.users.create({ email, name });

  return redirect(`/users/${user.id}`);
}

export default function NewUser() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <label>
        Email:
        <input name="email" type="email" required />
        {actionData?.errors.email && <span>{actionData.errors.email}</span>}
      </label>

      <label>
        Name:
        <input name="name" type="text" required />
        {actionData?.errors.name && <span>{actionData.errors.name}</span>}
      </label>

      <button type="submit">Create User</button>
    </Form>
  );
}
```

## Nested Routes

```typescript
// app/routes/dashboard.tsx
import { Outlet } from '@remix-run/react';

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// app/routes/dashboard.overview.tsx
export default function Overview() {
  return <h1>Overview</h1>;
}

// app/routes/dashboard.analytics.tsx
export default function Analytics() {
  return <h1>Analytics</h1>;
}
```

## Database Integration

```typescript
// app/services/user.server.ts
import { db } from '~/utils/db.server';

export async function getUser(id: string) {
  return db.users.findUnique({ where: { id } });
}

export async function createUser(data: CreateUserInput) {
  return db.users.create({ data });
}

// app/routes/api/users.ts
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { createUser } from '~/services/user.server';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const data = await request.json();
  const user = await createUser(data);

  return json(user, { status: 201 });
}
```

## Error Handling

```typescript
// app/routes/users.$id.tsx
import { useRouteError, isRouteErrorResponse } from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data?.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  );
}
```

## Best Practices

✅ **Server functions** - Keep business logic on server
✅ **Progressive enhancement** - Works without JavaScript
✅ **Form handling** - Remix forms > fetch
✅ **Nested routes** - DRY layout patterns
✅ **Database queries** - Use .server files

## Resources

- [Remix Documentation](https://remix.run/docs)
- [Remix Guide](https://remix.run/docs/en/main/start/tutorial)
