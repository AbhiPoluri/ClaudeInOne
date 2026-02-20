# Bundle Optimization

## Overview
Reduce JavaScript bundle size with code splitting, tree shaking, lazy loading, and dependency auditing.

## Analyze Bundle Size

```bash
# Vite
npm install -D rollup-plugin-visualizer

# Next.js
npm install -D @next/bundle-analyzer
```

```typescript
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default withBundleAnalyzer({});
```

```bash
ANALYZE=true npm run build
```

## Code Splitting with React.lazy

```tsx
import { lazy, Suspense } from 'react';

// Load only when needed
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

## Dynamic Import with Preloading

```typescript
// Preload on hover for faster perceived navigation
function NavLink({ to, component }: { to: string; component: () => Promise<any> }) {
  return (
    <Link to={to} onMouseEnter={() => component()}>
      {/* ... */}
    </Link>
  );
}

<NavLink to="/dashboard" component={() => import('./Dashboard')} />
```

## Tree Shaking — Named Imports

```typescript
// BAD — imports entire lodash bundle
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD — only imports debounce
import debounce from 'lodash/debounce';
// or
import { debounce } from 'lodash-es'; // ES module version
```

## Next.js Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Load heavy component only on client, not in SSR
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

// Load on user interaction
const Modal = dynamic(() => import('./Modal'));
```

## Bundle Size Checklist
- [ ] `lodash` → `lodash-es` or individual imports
- [ ] `moment.js` → `date-fns` (60x smaller)
- [ ] `@mui/material` → import from subpath, not root
- [ ] Images: use `<Image>` in Next.js with proper sizing
- [ ] Check `bundlephobia.com` before adding any dependency

## Resources
- [Bundlephobia](https://bundlephobia.com) — check package sizes
- [Next.js bundle analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
