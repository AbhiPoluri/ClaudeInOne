# Astro

Build fast, content-focused websites with zero JavaScript by default (islands architecture).

## Basic Setup

```astro
---
// Component code (runs at build time)
const title = "My Site";
const posts = await fetch('/api/posts').then(r => r.json());
---

<html>
  <body>
    <h1>{title}</h1>
    <ul>
      {posts.map(post => (
        <li><a href={post.url}>{post.title}</a></li>
      ))}
    </ul>
  </body>
</html>
```

## Islands Architecture

```astro
---
import Counter from '../components/Counter.jsx';
---

<main>
  <h1>Static content</h1>
  <!-- Island: interactive React component -->
  <Counter client:load />
</main>
```

## Routing

```
src/pages/
├── index.astro              # /
├── about.astro              # /about
├── blog/
│   ├── index.astro          # /blog
│   └── [slug].astro         # /blog/:slug
└── api/
    └── posts.ts             # /api/posts
```

## Dynamic Routes

```astro
---
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { slug } = Astro.params;
const { post } = Astro.props;
---

<article>
  <h1>{post.title}</h1>
  <Fragment set:html={post.content} />
</article>
```

## Performance Benefits

- Zero JavaScript by default
- Build-time HTML generation
- Partial hydration for interactive components
- Fast page loads, excellent Core Web Vitals
- Great for content sites, blogs, docs

## Best Practices

1. Keep islands small and focused
2. Use static rendering where possible
3. Lazy load interactive components
4. Optimize images aggressively
5. Use content collections for organized content

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
