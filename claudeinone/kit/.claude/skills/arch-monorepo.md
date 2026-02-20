# Monorepo with Turborepo

## Overview
Host multiple apps and packages in one repo with shared code, tooling, and independent deployments.

## Setup

```bash
npx create-turbo@latest my-monorepo
```

## Structure

```
my-monorepo/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
├── packages/
│   ├── ui/         # Shared React components
│   ├── types/      # Shared TypeScript types
│   └── config/     # Shared ESLint, Tailwind, TS configs
├── turbo.json
└── package.json
```

## turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "outputs": ["coverage/**"] }
  }
}
```

## Shared UI Package

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "exports": {
    "./button": "./src/button/index.tsx"
  }
}
```

```tsx
// packages/ui/src/button/index.tsx
export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded" {...props}>{children}</button>;
}
```

## Using Shared Packages

```json
// apps/web/package.json
{ "dependencies": { "@repo/ui": "*" } }
```

```tsx
import { Button } from '@repo/ui/button';
```

## Commands

```bash
turbo dev              # all apps in dev mode
turbo build            # build all
turbo build --filter=web  # build specific app
turbo test             # test all packages
```

## Best Practices
- Use `workspace:*` to link internal packages
- Enable Vercel Remote Cache for fast CI builds
- Keep `packages/config` for shared ESLint and Tailwind configs
- Build shared packages before dependent apps (`dependsOn: ["^build"]`)

## Resources
- [Turborepo docs](https://turbo.build/repo/docs)
