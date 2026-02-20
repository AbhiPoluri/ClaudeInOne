# Remix Advanced Patterns

Production patterns for Remix applications.

## Loader Data Caching

```typescript
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  const cacheKey = `product:${params.id}`;
  
  // Check cache
  let product = await cache.get(cacheKey);
  
  if (!product) {
    product = await db.products.findById(params.id);
    // Cache for 1 hour
    await cache.set(cacheKey, product, 3600);
  }

  return json({ product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  
  return <div>{product.name}</div>;
}
```

## Optimistic UI

```typescript
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const formData = await request.formData();
    const title = formData.get('title');

    await db.posts.update(params.id, { title });

    return redirect(`/posts/${params.id}`);
  }
}

export default function EditPost() {
  const fetcher = useFetcher();
  const post = useLoaderData();

  const optimisticData = fetcher.formData
    ? { ...post, title: fetcher.formData.get('title') }
    : post;

  return (
    <fetcher.Form method="post">
      <input
        name="title"
        defaultValue={optimisticData.title}
      />
      <button type="submit">Update</button>
    </fetcher.Form>
  );
}
```

## Streaming

```typescript
export async function loader() {
  return defer({
    analytics: getAnalytics(),
    posts: getPosts()
  });
}

export default function Dashboard() {
  const { analytics, posts } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={analytics}>
        {(data) => <AnalyticsWidget data={data} />}
      </Await>

      <Suspense fallback={<div>Loading posts...</div>}>
        <Await resolve={posts}>
          {(data) => <PostList posts={data} />}
        </Await>
      </Suspense>
    </Suspense>
  );
}
```

## Best Practices

✅ **Server-side rendering** - Default behavior
✅ **Streaming** - Progressive rendering
✅ **Data fetching** - Loaders vs Actions
✅ **Caching** - Strategic use
✅ **Error boundaries** - Graceful degradation

## Resources

- [Remix Documentation](https://remix.run/docs)
