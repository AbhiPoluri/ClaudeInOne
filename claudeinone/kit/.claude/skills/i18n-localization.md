# Internationalization (i18n)

Multi-language and locale support for applications.

## Setup (Next.js)

```bash
npm install next-intl
```

## Configuration

```typescript
// i18n.config.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

```json
// messages/en.json
{
  "header": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout"
  },
  "common": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "errors": {
    "notFound": "Not found"
  }
}
```

## React Components

```typescript
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export function Header() {
  const t = useTranslations('header');
  const locale = useLocale();

  return (
    <header>
      <h1>{t('welcome')}</h1>
      <div>Current language: {locale}</div>
      <Link href="/en/home">{t('home')}</Link>
      <Link href="/es/home">Inicio</Link>
    </header>
  );
}

export function ProductCard({ product }: { product: any }) {
  const t = useTranslations('products');

  return (
    <div>
      <h2>{t('title', { name: product.name })}</h2>
      <p>{t('price', { price: product.price })}</p>
    </div>
  );
}
```

## Dynamic Messages with Parameters

```json
{
  "products": {
    "title": "{name} Product",
    "price": "Price: ${price}",
    "rating": "{count, plural, =0 {No ratings} one {1 rating} other {# ratings}}"
  }
}
```

## Date & Number Formatting

```typescript
import { useFormatter } from 'next-intl';

export function PriceDisplay({ amount }: { amount: number }) {
  const format = useFormatter();

  return (
    <div>
      Price: {format.number(amount, {
        style: 'currency',
        currency: 'USD'
      })}
    </div>
  );
}

export function DateDisplay({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}
```

## URL Routing

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en'
});

// Config matching paths
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

## Server-Side Translations

```typescript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ locale }: any) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}
```

## Language Switcher

```typescript
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <select onChange={(e) => {
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${e.target.value}`);
      // Navigate
    }}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Best Practices

✅ **Namespace translations** - Organize by feature/page
✅ **Use placeholders** - For dynamic values
✅ **RTL support** - Test with right-to-left languages
✅ **Translation management** - Use Crowdin or similar
✅ **SEO optimization** - Use hreflang for language variants

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [ICU Message Syntax](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
