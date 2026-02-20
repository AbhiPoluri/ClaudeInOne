# Technical SEO

## Overview
Optimize crawlability, indexability, and page speed for better search engine rankings.

## Next.js Metadata API

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | Site Name',
  description: 'Compelling description under 160 characters with target keyword.',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Page Title',
    description: 'Description for social sharing',
    url: 'https://example.com/page',
    siteName: 'Site Name',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Page Title', description: '...' },
  alternates: { canonical: 'https://example.com/page' },
};

// Dynamic metadata for product pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | Shop`,
    description: product.description.slice(0, 160),
    openGraph: { images: [{ url: product.imageUrl }] },
  };
}
```

## Sitemap (Next.js)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });

  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://example.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
```

## Structured Data (JSON-LD)

```tsx
// Article structured data
export function ArticleSchema({ article }: { article: Article }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.author.name },
    image: article.coverImage,
    description: article.excerpt,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

## robots.txt

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

## Best Practices
- Use canonical URLs to prevent duplicate content penalties
- Keep title tags under 60 chars, meta descriptions under 160
- Generate XML sitemaps and submit to Google Search Console
- Ensure Core Web Vitals pass — Google uses them as ranking signals

## Resources
- [Google Search Central](https://developers.google.com/search)
- [Next.js metadata docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
