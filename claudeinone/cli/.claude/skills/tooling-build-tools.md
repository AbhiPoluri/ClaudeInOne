# Build Tools

Compilation, bundling, and asset optimization.

## Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

## Webpack Configuration

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

## ESBuild

```typescript
import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: 'esnext',
  loader: {
    '.png': 'dataurl'
  }
});
```

## Bun Runtime

```bash
# Install
curl -fsSL https://bun.sh/install | bash

# Run TypeScript directly
bun run src/index.ts

# Bundle
bun build ./src/index.ts --outdir ./dist
```

## Rollup

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs()
  ],
  external: ['react']
};
```

## SWC (Rust Compiler)

```json
{
  ".swcrc": {
    "jsc": {
      "parser": {
        "syntax": "typescript"
      },
      "target": "es2020",
      "minify": {
        "compress": true
      }
    }
  }
}
```

## Best Practices

✅ **Code splitting** - Chunk dependencies
✅ **Lazy loading** - Load routes/features on demand
✅ **Tree shaking** - Remove unused code
✅ **Caching** - Use content hashes
✅ **Source maps** - Debug production code

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [Webpack Guide](https://webpack.js.org/guides/)
- [ESBuild](https://esbuild.github.io/)
- [Bun Runtime](https://bun.sh/)
