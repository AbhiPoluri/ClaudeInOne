# Vite

## Overview
Vite is a fast build tool using native ES modules in dev and Rollup for production builds.

## Setup

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

## vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true }
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  }
});
```

## Environment Variables

```env
# .env.development
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=My App Dev

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
```

```typescript
// Access in code (must start with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
```

## Path Aliases in TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true })]
});
```

## Best Practices
- Use path aliases (`@/`) for clean imports
- Use `manualChunks` to split vendor and feature bundles
- Run `vite preview` before deploying to test production build locally
- Use `import.meta.env.PROD` to conditionally include debug tools

## Resources
- [Vite docs](https://vitejs.dev/guide/)
