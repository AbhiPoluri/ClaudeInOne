# Performance Optimization

Techniques for improving application speed and efficiency.

## Code Splitting

```typescript
// Next.js dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default function Page() {
  return <HeavyComponent />;
}
```

## Image Optimization

```jsx
import Image from 'next/image';

// Automatic format conversion, lazy loading, responsive
<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // Load immediately (not lazy)
  quality={80} // Compress
/>
```

## Database Query Optimization

```typescript
// Bad: N+1 queries
const users = await db.users.find();
for (const user of users) {
  user.posts = await db.posts.find({ userId: user.id }); // Runs for each user!
}

// Good: Batch query
const users = await db.users.find({
  include: { posts: true }
});

// Good: Specific columns only
const users = await db.users.find({
  select: { id: true, email: true, name: true }
});

// Good: Pagination
const page = 1;
const pageSize = 20;
const users = await db.users.find({
  skip: (page - 1) * pageSize,
  take: pageSize
});
```

## Caching Strategy

```typescript
// Cache database queries
async function getCachedUser(userId: string) {
  const cacheKey = `user:${userId}`;
  let user = await redis.get(cacheKey);
  
  if (user) {
    return JSON.parse(user);
  }

  user = await db.users.findById(userId);
  
  // Cache for 1 hour
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);
  
  return user;
}

// Invalidate on update
async function updateUser(userId: string, data: any) {
  const user = await db.users.update(userId, data);
  
  // Clear cache
  await redis.del(`user:${userId}`);
  
  return user;
}
```

## Frontend Performance

```typescript
// Use useCallback to prevent unnecessary re-renders
import { useCallback, useMemo } from 'react';

export function DataTable({ data }) {
  const handleSort = useCallback((column) => {
    // Only changes if data changes
  }, [data]);

  const sortedData = useMemo(() => {
    return data.sort();
  }, [data]);

  return <Table data={sortedData} onSort={handleSort} />;
}

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

## Compression

```bash
# Enable gzip compression
# nginx.conf
gzip on;
gzip_types text/plain application/json application/javascript;
gzip_min_length 1000;
```

```typescript
// Express middleware
import compression from 'compression';

app.use(compression());
```

## Lazy Loading

```jsx
// Images
<img src="placeholder.jpg" loading="lazy" alt="..." />

// Components
import { Suspense, lazy } from 'react';

const Modal = lazy(() => import('./Modal'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Modal />
    </Suspense>
  );
}
```

## Monitoring Performance

```typescript
// Measure function execution
function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  
  return result;
}

// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Best Practices

✅ **Code splitting** - Load what you need
✅ **Caching** - Cache database and API responses
✅ **Database indexing** - Index frequently queried columns
✅ **Lazy loading** - Defer non-critical resources
✅ **Monitoring** - Track performance metrics

## Resources

- [Next.js Performance](https://nextjs.org/learn/seo/web-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
