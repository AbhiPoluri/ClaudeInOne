# Content Management Systems

Building and managing content with headless CMS or self-hosted solutions.

## Headless CMS with Strapi

```bash
npm install strapi @strapi/strapi @strapi/plugin-users-permissions
npx strapi new my-cms
cd my-cms
npx strapi develop
```

```typescript
// Create content type via API
const strapiClient = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
  }
});

// Create post
const response = await strapiClient.post('/posts', {
  data: {
    title: 'My Post',
    content: 'Post content',
    published: true
  }
});

// Query posts
const posts = await strapiClient.get('/posts?populate=author');
```

## Contentful Integration

```typescript
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

// Fetch content
const entries = await client.getEntries({
  content_type: 'blogPost',
  limit: 10,
  order: '-sys.createdAt'
});

entries.items.forEach(item => {
  console.log(item.fields.title);
  console.log(item.fields.body);
});

// Fetch single entry
const entry = await client.getEntry(entryId);
```

## Next.js with Markdown

```typescript
// pages/blog/[slug].tsx
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';

interface PostProps {
  source: MDXRemoteSerializeResult;
  frontmatter: Record<string, any>;
}

export async function getStaticProps({ params }: any) {
  const postPath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`);
  const source = fs.readFileSync(postPath, 'utf-8');

  // Parse frontmatter
  const { data: frontmatter, content } = matter(source);

  // Serialize MDX
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontmatter
    }
  };
}

export default function Post({ source, frontmatter }: PostProps) {
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <MDXRemote {...source} />
    </article>
  );
}
```

## Rich Text Editor

```typescript
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

function RichTextEditor({ content, onChange }: any) {
  const [editorState, setEditorState] = useState(() => {
    if (content) {
      const contentState = convertFromRaw(content);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const handleChange = (state: EditorState) => {
    setEditorState(state);

    // Serialize to JSON
    const contentState = state.getCurrentContent();
    const raw = convertToRaw(contentState);
    onChange(raw);
  };

  return (
    <Editor
      editorState={editorState}
      onChange={handleChange}
    />
  );
}
```

## Blog Platform Features

```typescript
// Full-text search
const SearchPosts = async (query: string) => {
  return await db.posts.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  });
};

// Category filtering
const PostsByCategory = async (category: string) => {
  return await db.posts.find({ category });
};

// Pagination
const getPaginatedPosts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return await db.posts
    .find()
    .skip(skip)
    .limit(pageSize)
    .sort({ publishedAt: -1 });
};

// Comments
interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  parentId?: string; // For nested replies
}

const addComment = async (postId: string, userId: string, content: string) => {
  return await db.comments.create({
    postId,
    userId,
    content,
    createdAt: new Date()
  });
};
```

## Best Practices

✅ **Markdown for content** - Version control friendly
✅ **Caching** - Cache rendered content
✅ **Search** - Full-text indexing
✅ **Comments moderation** - Review before publishing
✅ **Media storage** - Use CDN for images/videos

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Contentful CMS](https://www.contentful.com/)
- [Next.js MDX](https://nextjs.org/docs/advanced-features/using-mdx)
