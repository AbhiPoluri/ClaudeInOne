# ESLint

## Overview
ESLint statically analyzes JavaScript/TypeScript code to find bugs and enforce code style.

## Setup (ESLint v9 flat config)

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
```

## eslint.config.js (Flat Config)

```typescript
// eslint.config.js
import js from '@eslint/js';
import tsPlugin from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tsPlugin.config(
  js.configs.recommended,
  ...tsPlugin.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['dist/**', '.next/**', 'coverage/**', '*.config.js'],
  }
);
```

## Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Next.js ESLint Config

```bash
npm install -D eslint-config-next
```

```javascript
// eslint.config.js (Next.js)
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat();

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { rules: { '@typescript-eslint/no-explicit-any': 'error' } }
];
```

## Pre-commit Hook with lint-staged

```bash
npm install -D husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
echo "npx lint-staged" > .husky/pre-commit
```

## Custom Rule Example

```typescript
// Only allow logger, not console.log
module.exports = {
  rules: {
    'no-restricted-syntax': ['error', {
      selector: "CallExpression[callee.object.name='console'][callee.property.name='log']",
      message: 'Use logger.info() instead of console.log()'
    }]
  }
};
```

## Resources
- [ESLint docs](https://eslint.org/docs/latest/)
- [typescript-eslint](https://typescript-eslint.io)
