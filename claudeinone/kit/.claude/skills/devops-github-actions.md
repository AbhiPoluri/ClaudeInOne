# GitHub Actions

CI/CD workflow automation for GitHub repositories.

## Basic Workflow

```yaml
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Common Actions

```yaml
# Checkout code
- uses: actions/checkout@v3

# Setup Node
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'

# Run tests with coverage
- run: npm test -- --coverage

# Upload artifacts
- uses: actions/upload-artifact@v3
  with:
    name: coverage
    path: coverage/

# Create release
- uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ github.run_number }}
```

## Best Practices

✅ **Cache dependencies** - Speed up builds
✅ **Use secrets** - Never hardcode credentials
✅ **Run on schedule** - Use cron for periodic tasks
✅ **Matrix builds** - Test multiple versions
✅ **Status checks** - Require passing builds

## Resources

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Marketplace](https://github.com/marketplace?type=actions)
