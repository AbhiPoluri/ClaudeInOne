# Next.js Advanced

Advanced patterns and optimizations for Next.js applications.

## Server Components

```typescript
// app/users/page.tsx
import { Suspense } from 'react';

async function UsersList() {
  const users = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // Cache for 1 hour
  }).then(r => r.json());

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UsersList />
    </Suspense>
  );
}
```

## Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add header
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
```

## Route Handlers

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  const user = await db.users.findById(id);

  return NextResponse.json(user);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await db.users.create(body);

  return NextResponse.json(user, { status: 201 });
}
```

## Incremental Static Regeneration (ISR)

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(post => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: any) {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function PostPage({ params }: any) {
  const post = await getPost(params.slug);

  return <article>{post.content}</article>;
}

export const revalidate = 3600; // Revalidate every hour
```

## Streaming

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function Analytics() {
  const data = await fetch('https://api.example.com/analytics', {
    next: { revalidate: 60 }
  }).then(r => r.json());

  return <div>{data.stats}</div>;
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

## Image Optimization

```typescript
import Image from 'next/image';

export function ProfilePicture() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
      quality={80}
      placeholder="blur"
      blurDataURL="data:image/png;base64,..."
      priority
    />
  );
}
```

## Error Handling

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

## Best Practices

✅ **Server components by default** - Move data fetching to server
✅ **Streaming** - Progressive rendering for better UX
✅ **ISR** - Cache static content, regenerate periodically
✅ **Image optimization** - Use next/image
✅ **Error boundaries** - Handle errors gracefully

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
