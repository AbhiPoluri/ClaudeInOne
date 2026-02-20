# Monorepo Management

Organizing multiple related projects in a single repository.

## Turborepo Setup

```bash
npm install -D turbo
npx turbo init
```

```json
{
  "turbo": {
    "tasks": {
      "build": {
        "outputs": ["dist/**"],
        "cache": true
      },
      "test": {
        "outputs": [".coverage/**"]
      },
      "lint": {
        "outputs": []
      }
    }
  }
}
```

## Monorepo Structure

```
monorepo/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   └── package.json
│   └── api/
│       ├── src/
│       └── package.json
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   └── package.json
│   ├── utils/
│   │   ├── src/
│   │   └── package.json
│   └── config/
│       └── package.json
├── turbo.json
└── package.json
```

## Workspace Dependencies

```json
{
  "name": "web",
  "dependencies": {
    "@monorepo/ui": "workspace:*",
    "@monorepo/utils": "workspace:*"
  }
}
```

## Shared Configuration

```javascript
// packages/config/eslint.js
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
};

// apps/web/.eslintrc.js
module.exports = {
  extends: ['@monorepo/config/eslint']
};
```

## Running Tasks

```bash
# Run task in all workspaces
turbo run build

# Run only in changed workspaces
turbo run build --only-affected

# Run with filter
turbo run build --filter=@monorepo/ui

# Run in parallel
turbo run build test --parallel

# Watch mode
turbo run dev
```

## Pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```bash
# Install dependencies across workspaces
pnpm install

# Add dependency to specific workspace
pnpm add react --filter @monorepo/ui

# Run script in workspace
pnpm --filter @monorepo/ui build
```

## CI/CD Integration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: turbo run build --filter=[HEAD~1]
      
      - name: Test
        run: turbo run test
      
      - name: Lint
        run: turbo run lint
```

## Best Practices

✅ **Clear boundaries** - Each package has single purpose
✅ **Shared dependencies** - Hoist common packages
✅ **Version consistency** - Lock versions across workspaces
✅ **Internal dependencies** - Reference via workspace protocol
✅ **Documentation** - Document workspace structure

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Nx Monorepo](https://nx.dev/)
