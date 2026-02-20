# Astro

Static site generator with partial hydration for fast, content-focused sites.

## Setup

```bash
npm create astro@latest my-site
cd my-site
npm install
npm run dev
```

## Basic Page

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

const title = 'Welcome';
const posts = await getCollection('blog');
---

<Layout title={title}>
  <main>
    <h1>{title}</h1>
    
    <div class="grid">
      {posts.map(post => (
        <Card title={post.data.title} href={post.slug}>
          {post.data.description}
        </Card>
      ))}
    </div>
  </main>
</Layout>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
</style>
```

## Dynamic Routes

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

interface Props {
  post: any;
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={post.data.title}>
  <article>
    <h1>{post.data.title}</h1>
    <time>{post.data.pubDate}</time>
    <Content />
  </article>
</Layout>
```

## React Components

```astro
---
// src/pages/interactive.astro
import Counter from '../components/Counter.jsx';
---

<html>
  <body>
    <!-- Hydrate on client load -->
    <Counter client:load />
    
    <!-- Hydrate on interaction -->
    <Counter client:idle />
    
    <!-- Hydrate when visible -->
    <Counter client:visible />
  </body>
</html>
```

```jsx
// src/components/Counter.jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string()
  })
});

export const collections = { blog };
```

```markdown
---
# src/content/blog/first-post.md
title: First Post
description: My first blog post
pubDate: 2024-01-01
author: John Doe
---

# Welcome!

This is my first post.
```

## API Routes

```typescript
// src/pages/api/posts.json.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  
  return new Response(JSON.stringify(posts.map(p => ({
    title: p.data.title,
    slug: p.slug
  }))), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Integrations

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'hybrid' // Mix static and SSR
});
```

## Best Practices

✅ **Islands Architecture** - Minimal JavaScript
✅ **Content Collections** - Organized content
✅ **Partial hydration** - Load interactive components on demand
✅ **Static generation** - Generate at build time
✅ **Image optimization** - Automatic image optimization

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Integrations](https://astro.build/integrations/)
