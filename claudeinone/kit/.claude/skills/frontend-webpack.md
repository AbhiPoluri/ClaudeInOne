# Webpack

## Overview
Webpack is a module bundler with powerful code splitting, tree shaking, and plugin ecosystem for complex build requirements.

## webpack.config.ts

```typescript
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: { test: /node_modules/, name: 'vendors', chunks: 'all' },
      },
    },
    runtimeChunk: 'single',
  },
};

export default config;
```

## Dev Server

```typescript
import { merge } from 'webpack-merge';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default merge(config, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
```

## Bundle Analysis

```bash
npm install -D webpack-bundle-analyzer
```

```typescript
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
plugins: [new BundleAnalyzerPlugin()]
```

## Best Practices
- Use `[contenthash]` in filenames for long-term caching
- Split vendor chunks separately from app code
- Enable `runtimeChunk: 'single'` to share the runtime across chunks
- Use `ts-loader` with `transpileOnly: true` for faster builds in dev

## Resources
- [Webpack docs](https://webpack.js.org/concepts/)
