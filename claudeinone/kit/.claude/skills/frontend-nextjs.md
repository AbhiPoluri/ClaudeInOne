# Next.js 15+

Full-stack React framework with App Router, Server Actions, and server-side rendering.

## App Router Fundamentals

### File Structure
```
app/
├── layout.tsx           # Root layout (wraps all pages)
├── page.tsx             # Home page (/)
├── dashboard/
│   ├── layout.tsx       # Dashboard layout (wraps dashboard pages)
│   ├── page.tsx         # /dashboard
│   └── [id]/
│       └── page.tsx     # /dashboard/[id] (dynamic route)
├── api/
│   └── users/
│       └── route.ts     # POST /api/users
└── (auth)/
    └── login/
        └── page.tsx     # /login (grouped route, no URL segment)
```

### Layouts & Nesting
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// Layouts don't re-render on navigation, only children do
```

## Server Components (Default)

```typescript
// Components are server components by default in App Router
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

**Benefits:**
- Access databases directly (no API needed)
- Keep API keys server-side
- Reduce JavaScript sent to client
- Improved performance and SEO

## Client Components

```typescript
'use client'; // Directive at top of file

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

Use when you need:
- State management (useState, useReducer)
- Lifecycle hooks (useEffect)
- Event listeners
- Browser APIs

## Server Actions

```typescript
// app/actions.ts
'use server';

export async function updateUser(formData: FormData) {
  const name = formData.get('name');
  // Access database directly, no API endpoint needed
  const user = await db.user.update({ name });
  revalidatePath('/'); // Revalidate cache after mutation
  return user;
}

// In component
'use client';
import { updateUser } from './actions';

export default function Form() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

## Data Fetching Patterns

### Server Components
```typescript
// Direct fetch in server component
async function Posts() {
  const posts = await fetch('...', { next: { revalidate: 3600 } });
  return <PostList posts={posts} />;
}
```

### Caching Strategies
- **Default (Full Cache)**: GET requests cached indefinitely
- **Revalidate Time**: `revalidate: 3600` (revalidate after 1 hour)
- **Revalidate On Demand**: `revalidatePath('/blog')` in Server Actions
- **No Cache**: `cache: 'no-store'`

### API Routes
```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  const data = await db.user.list();
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create(body);
  return Response.json(user, { status: 201 });
}
```

## Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await db.post.findAll();
  return posts.map(p => ({ slug: p.slug }));
}

export default function Post({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;
}
```

## Image Optimization

```typescript
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // Load immediately (LCP image)
    />
  );
}
```

## Performance Features

- **Automatic code splitting**: Each route only loads necessary code
- **Prefetching**: Links prefetch on hover/visibility
- **Font optimization**: Self-hosted fonts, automatic loading
- **Image optimization**: Responsive images, modern formats
- **CSS-in-JS**: Zero-runtime CSS with built-in support

## Best Practices

1. **Use Server Components by default** - only add 'use client' when needed
2. **Fetch in Server Components** - eliminates API layer for internal data
3. **Revalidate cache thoughtfully** - balance freshness with performance
4. **Organize routes logically** - group related pages with layouts
5. **Optimize images** - use next/image, responsive sizes
6. **Handle errors** - create error.tsx and not-found.tsx files
7. **Use Server Actions** for mutations - cleaner than form submissions

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Actions RFC](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
