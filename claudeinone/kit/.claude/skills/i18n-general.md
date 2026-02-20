# Internationalization (i18n)

## Overview
Support multiple languages and locales in your application with proper translation management and locale-aware formatting.

## react-i18next

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, es: { translation: es }, ja: { translation: ja } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
```

## Translation Files

```json
// locales/en.json
{
  "common": { "save": "Save", "cancel": "Cancel", "loading": "Loading..." },
  "auth": {
    "login": "Sign in",
    "welcome": "Welcome, {{name}}!",
    "items": "{{count}} item",
    "items_other": "{{count}} items"
  }
}
```

## Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function Header({ user }: { user: User }) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('auth.welcome', { name: user.name })}</h1>
      <p>{t('auth.items', { count: 5 })}</p>
      <select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
```

## Date/Number/Currency Formatting

```typescript
// Locale-aware formatting
const formatter = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

formatter.format(new Date()); // '2024年1月15日'
price.format(1234.56);       // '1.234,56 €'
percent.format(0.856);       // '85.6%'
```

## Best Practices
- Use ICU message format for plurals and genders
- Never hardcode strings — extract all user-visible text
- Provide context keys in long files (`auth.login`, `common.save`)
- Test RTL layout for Arabic and Hebrew with `dir="rtl"`

## Resources
- [react-i18next docs](https://react.i18next.com)
- [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
