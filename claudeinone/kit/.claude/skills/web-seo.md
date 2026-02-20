# SEO Best Practices

Optimizing for search engines.

## Meta Tags

```html
<head>
  <title>Page Title (50-60 characters)</title>
  <meta name="description" content="Page description (150-160 characters)">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Title">
  <meta property="og:description" content="Description">
  <meta property="og:image" content="image.jpg">
  <meta property="og:url" content="https://example.com">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
</head>
```

## Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "datePublished": "2024-01-15",
  "image": "image.jpg"
}
```

## Next.js SEO

```typescript
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>Page Title</title>
        <meta name="description" content="Description" />
        <link rel="canonical" href="https://example.com/page" />
      </Head>
      <h1>Content</h1>
    </>
  );
}
```

## Performance

```
Page Speed Insights metrics:
- Largest Contentful Paint < 2.5s
- First Input Delay < 100ms
- Cumulative Layout Shift < 0.1
```

## Robots & Sitemap

```robots
User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
```

```xml
<!-- sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page1</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Best Practices

✅ **Descriptive headings** - Use H1-H6 properly
✅ **URL structure** - Short, descriptive URLs
✅ **Internal links** - Link related pages
✅ **Mobile optimization** - Responsive design
✅ **Page speed** - Fast load times

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
