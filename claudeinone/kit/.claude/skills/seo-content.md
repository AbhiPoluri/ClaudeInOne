# Content SEO

## Overview
Optimize content for search intent, keyword targeting, and organic traffic growth.

## Keyword Research Structure

```typescript
interface KeywordData {
  keyword: string;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  volume: number;
  difficulty: number;
  cpc: number;
}

// Content cluster approach
const pillarPage = { keyword: 'project management software', type: 'pillar' };
const clusterPages = [
  { keyword: 'project management software for small teams', type: 'cluster' },
  { keyword: 'project management software free', type: 'cluster' },
  { keyword: 'best project management tools 2024', type: 'cluster' },
];
```

## SEO-Optimized Blog Post Structure

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ post }: { post: Post }) {
  return (
    <article className="max-w-prose mx-auto">
      {/* H1 — includes primary keyword */}
      <h1 className="text-4xl font-bold">{post.title}</h1>

      {/* Author, date, reading time */}
      <div className="text-gray-500 text-sm mt-2">
        By {post.author} · {formatDate(post.publishedAt)} · {post.readingTime} min read
      </div>

      {/* Table of contents for long posts */}
      <TableOfContents headings={post.headings} />

      {/* Content with proper heading hierarchy H2 → H3 */}
      <div
        className="prose prose-lg mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Internal links to related posts */}
      <RelatedPosts posts={post.relatedPosts} />
    </article>
  );
}
```

## Internal Linking Strategy

```typescript
// Auto-suggest internal links based on keyword matching
async function findRelatedContent(currentSlug: string, keywords: string[]) {
  return prisma.post.findMany({
    where: {
      slug: { not: currentSlug },
      OR: keywords.map(kw => ({ title: { contains: kw, mode: 'insensitive' } })),
    },
    take: 5,
    select: { slug: true, title: true },
  });
}
```

## Content Quality Checklist
```
✅ Primary keyword in title, H1, first 100 words, URL
✅ Target keyword density: 1-2% (natural use, not stuffing)
✅ H2/H3 headings use related keywords and questions
✅ Images have descriptive alt text with keywords
✅ Internal links to 3+ related pages
✅ External links to authoritative sources
✅ Content matches search intent (informational = how-to, transactional = buy now)
✅ Word count appropriate for competition (check top 3 rankings)
✅ Meta description includes keyword and CTA
```

## Best Practices
- Write for humans first, optimize for search second
- Use question-based H2s (How to..., What is..., Why...)
- Update content annually to maintain rankings
- Focus on topics with genuine user demand, not just high volume

## Resources
- [Ahrefs blog](https://ahrefs.com/blog)
- [Search Engine Land](https://searchengineland.com)
