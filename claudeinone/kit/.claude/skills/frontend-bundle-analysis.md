# Bundle Analysis & Optimization

Analyzing and reducing bundle sizes.

## Webpack Bundle Analyzer

```bash
npm install -D webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

## Size Limits

```json
{
  "bundlesize": [
    {
      "path": "./dist/main.js",
      "maxSize": "100kb"
    },
    {
      "path": "./dist/vendor.js",
      "maxSize": "200kb"
    }
  ]
}
```

## Code Splitting

```typescript
// Dynamic import
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Tree shaking
import { debounce } from 'lodash-es'; // ESM import
import { debounce } from 'lodash';   // CommonJS (includes all)
```

## Next.js Bundle Analysis

```bash
# Analyze bundle
ANALYZE=true npm run build

# Generate report
npm install -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});
```

## Dependency Audit

```bash
# Find unused dependencies
npm install -D depcheck
npx depcheck

# Check for vulnerabilities
npm audit
npm audit fix

# Check bundle impact
npm install -D bundlesize
npm run bundlesize
```

## Optimization Strategies

```typescript
// 1. Remove unused packages
// Before: 2.5MB
// Remove lodash, moment (use date-fns)
// After: 1.8MB

// 2. Code splitting
// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// 3. Lazy load heavy libraries
// Only load PDF viewer when needed
const PDFViewer = lazy(() => import('./PDFViewer'));

// 4. Use lighter alternatives
// moment.js (67KB) → date-fns (13KB)
// lodash (70KB) → lodash-es with tree shaking

// 5. Minification
// webpack minifies by default
// Next.js compresses with gzip

// 6. Remove debug code
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}; // Remove logs
}
```

## Monitoring Bundle

```typescript
// src/utils/bundleMetrics.ts
if (typeof window !== 'undefined') {
  console.log('Bundle metrics:', {
    initialLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
    firstPaint: performance.getEntriesByName('first-paint')[0],
    resources: performance.getEntriesByType('resource').length
  });
}
```

## Best Practices

✅ **Regular audits** - Monitor bundle size
✅ **Code splitting** - Chunk by route or feature
✅ **Tree shaking** - Use ES modules
✅ **Lazy loading** - Load on demand
✅ **Compression** - Enable gzip

## Resources

- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Web.dev Bundle](https://web.dev/reduce-javascript-for-faster-site-performance/)
