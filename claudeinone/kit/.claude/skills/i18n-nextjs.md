# Next.js i18n

## Overview
Add internationalization to Next.js with next-intl for type-safe translations and locale routing.

## Setup with next-intl

```bash
npm install next-intl
```

```
messages/
├── en.json
├── es.json
└── ja.json
app/
├── [locale]/
│   ├── layout.tsx
│   └── page.tsx
└── i18n.ts
```

## Configuration

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'ja'],
  defaultLocale: 'en',
});

export const config = { matcher: ['/((?!api|_next|.*\..*).*)'] };
```

## Translation Files

```json
// messages/en.json
{
  "HomePage": {
    "title": "Welcome to {appName}",
    "description": "A Next.js app with i18n"
  },
  "Common": {
    "save": "Save",
    "items": "{count, plural, one {# item} other {# items}}"
  }
}
```

## Server Component Usage

```tsx
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('HomePage');

  return (
    <main>
      <h1>{t('title', { appName: 'My App' })}</h1>
      <p>{t('description')}</p>
    </main>
  );
}

export function generateStaticParams() {
  return ['en', 'es', 'ja'].map(locale => ({ locale }));
}
```

## Client Component Usage

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function SaveButton() {
  const t = useTranslations('Common');
  return <button>{t('save')}</button>;
}
```

## Locale Switcher

```tsx
'use client';
import { useRouter, usePathname } from 'next/navigation';

export function LocaleSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locales = ['en', 'es', 'ja'];

  return (
    <select value={locale} onChange={e => {
      const newPath = pathname.replace(`/${locale}`, `/${e.target.value}`);
      router.replace(newPath);
    }}>
      {locales.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
    </select>
  );
}
```

## Best Practices
- Use `setRequestLocale` in server components for static rendering
- Use `generateStaticParams` to pre-render all locale variants
- Keep translation keys hierarchical: `HomePage.title`, `Common.save`

## Resources
- [next-intl docs](https://next-intl-docs.vercel.app)
