# Biome (Linter + Formatter)

## Overview
Biome is a fast, all-in-one linter and formatter for JavaScript/TypeScript — replaces ESLint + Prettier in one tool.

## Setup

```bash
npm install -D @biomejs/biome
npx @biomejs/biome init
```

## biome.json Configuration

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": { "recommended": true },
      "security": { "recommended": true },
      "performance": { "noDelete": "warn" },
      "correctness": { "noUnusedVariables": "error" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": ["node_modules", "dist", ".next", "coverage"]
  }
}
```

## Scripts

```json
// package.json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --apply .",
    "format": "biome format --write .",
    "check": "biome check .",
    "check:fix": "biome check --apply ."
  }
}
```

## VS Code Integration

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

## CI/CD Integration

```yaml
# .github/workflows/ci.yml
- name: Lint and Format check
  run: npx @biomejs/biome ci .
```

## Best Practices
- Use `biome check --apply` in pre-commit hooks for auto-fix
- Biome is 20-100x faster than ESLint + Prettier
- Migrate gradually with `biome migrate eslint --include-inspired`
- Set `"linter.rules.recommended": true` as base

## Resources
- [Biome docs](https://biomejs.dev/guides/getting-started/)
