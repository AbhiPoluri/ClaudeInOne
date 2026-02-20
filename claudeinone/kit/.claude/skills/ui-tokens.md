# Design Tokens

## Overview
Design tokens are named variables for design decisions (colors, spacing, typography) that maintain consistency across platforms.

## CSS Custom Properties (Variables)

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;

  /* Semantic colors */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-border: #e2e8f0;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}

[data-theme="dark"] {
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-muted: #1e293b;
  --color-border: #334155;
}
```

## Tailwind CSS v4 Tokens

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --font-family-sans: 'Inter', sans-serif;
  --spacing-page: 1.5rem;
  --radius-card: 0.75rem;
}
```

## TypeScript Token Object

```typescript
// lib/tokens.ts
export const tokens = {
  colors: {
    primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
    gray: { 50: '#f9fafb', 500: '#6b7280', 900: '#111827' },
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  fontSize: { sm: '14px', base: '16px', lg: '18px', xl: '20px', '2xl': '24px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
} as const;

type Colors = typeof tokens.colors;
export type ColorKey = keyof Colors;
```

## Best Practices
- Use semantic tokens (`--color-background`) not literal tokens (`--color-white`) in components
- Dark mode: swap semantic tokens, not all literal tokens
- Define tokens once in CSS variables, reference everywhere
- Use Tailwind v4 `@theme` to expose tokens as utility classes

## Resources
- [Tailwind v4 theming](https://tailwindcss.com/docs/theme)
- [Design Tokens W3C spec](https://www.w3.org/community/design-tokens/)
