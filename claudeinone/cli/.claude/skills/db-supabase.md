# Supabase

Open-source Firebase alternative with PostgreSQL backend and real-time capabilities.

## Setup

```bash
npm install @supabase/supabase-js

# Environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Initialize Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
```

## Authentication

```typescript
// Email/Password signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// OAuth (Google)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'http://localhost:3000/auth/callback' }
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Sign out
await supabase.auth.signOut();
```

## Database Operations (Full PostgreSQL)

```typescript
// Create (Insert)
const { data, error } = await supabase
  .from('users')
  .insert([{ email: 'john@example.com', name: 'John' }])
  .select();

// Read
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1);

// Read multiple
const { data, error } = await supabase
  .from('posts')
  .select('*, author:users(name)')
  .eq('published', true)
  .order('created_at', { ascending: false });

// Update
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1)
  .select();

// Delete
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1);
```

## Filtering & Pagination

```typescript
// Complex filters
const { data } = await supabase
  .from('posts')
  .select('*')
  .gte('created_at', '2024-01-01')
  .lte('views', 1000)
  .in('status', ['published', 'scheduled']);

// Pagination
const pageSize = 10;
const page = 1;

const { data, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range((page - 1) * pageSize, page * pageSize - 1);
```

## Real-time Subscriptions

```typescript
// Subscribe to changes
const subscription = supabase
  .from('posts')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();

// Listen for INSERT only
supabase
  .from('comments')
  .on('INSERT', (payload) => {
    console.log('New comment:', payload.new);
  })
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

## Storage (File Upload)

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-1/avatar.jpg', file);

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-1/avatar.jpg');

const publicUrl = data.publicUrl;

// Download file
const { data, error } = await supabase.storage
  .from('documents')
  .download('file.pdf');

// Delete file
await supabase.storage.from('avatars').remove(['user-1/avatar.jpg']);
```

## Edge Functions (Serverless)

```typescript
// Create function: supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'POST') {
    const { name } = await req.json();
    return new Response(JSON.stringify({ message: `Hello, ${name}!` }));
  }
});

// Call from client
const { data, error } = await supabase.functions.invoke('hello', {
  body: { name: 'John' }
});
```

## React Integration

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import supabase from '@/lib/supabase';

export default function UserPosts() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch user posts
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };

    fetchPosts();

    // Subscribe to real-time updates
    const subscription = supabase
      .from('posts')
      .on('*', (payload) => {
        if (payload.new.user_id === user.id) {
          setPosts((prev) => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Best Practices

✅ **Use Row Level Security** - Secure data at database level
✅ **Store secrets safely** - Never commit API keys
✅ **Index frequently queried columns** - Improve query performance
✅ **Use connection pooling** - For production applications
✅ **Enable PostgIS** - For geospatial queries
✅ **Set up backups** - Daily automated backups

## When to Use Supabase

✅ Need Firebase alternative with PostgreSQL
✅ Want real-time updates built-in
✅ Require full SQL power
✅ Need serverless functions
✅ Want open-source option

❌ Need complex relational queries (though Supabase handles these)
❌ Don't want to manage PostgreSQL

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [SQL Reference](https://supabase.com/docs/guides/sql-commands)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)

## Core Patterns & Implementations

### Key Concepts
- Industry standards and best practices
- Proven architectural patterns
- Performance optimization techniques
- Security-first development approach
- Testing and quality assurance

### Common Use Cases
- Building production applications
- Solving complex technical problems
- Optimizing performance and scalability
- Implementing security best practices
- Team collaboration and knowledge transfer

## Implementation Guide

### Setup & Configuration
- Framework/tool initialization
- Environment setup
- Configuration best practices
- Development vs production settings

### Code Examples
- Real-world patterns and solutions
- Integration with other tools
- Error handling approaches
- Performance optimization

### Architecture Patterns
- Proven design patterns
- Component organization
- Data flow and state management
- Scalability considerations

## Best Practices

1. **Code Quality** — Follow conventions, write clean code
2. **Performance** — Profile and optimize bottlenecks
3. **Security** — Implement security-first practices
4. **Testing** — Comprehensive test coverage
5. **Documentation** — Clear, maintainable documentation
6. **Monitoring** — Track health and metrics
7. **Scalability** — Design for growth

## Testing Strategies

- Unit testing fundamentals
- Integration testing approaches
- End-to-end testing patterns
- Performance testing methods
- Security testing checklist

## Performance Considerations

- Optimization techniques
- Caching strategies
- Database optimization
- API performance
- Front-end performance
- Monitoring and profiling

## Security Checklist

- Input validation and sanitization
- Authentication and authorization
- Data encryption
- Secure dependencies
- Common vulnerability patterns
- Security headers and configuration

## Deployment & Operations

- Preparation for production
- Deployment strategies
- Rollback procedures
- Monitoring and alerting
- Logging and debugging
- Incident response

## Integration Points

Works seamlessly with:
- Related technologies and frameworks
- Development and deployment tools
- Monitoring and observability
- Security and compliance tools

## Tools & Technologies

- Popular frameworks and libraries
- Development utilities
- Testing frameworks
- Deployment platforms
- Monitoring solutions

## Common Pitfalls to Avoid

- Premature optimization
- Ignoring security requirements
- Insufficient testing
- Poor error handling
- Technical debt accumulation
- Monolithic approaches
- Lack of monitoring

## Learning Path

1. Understand core concepts
2. Study best practices
3. Review real-world examples
4. Build sample projects
5. Apply in production
6. Mentor others
7. Stay current

## Advanced Topics

- Optimization strategies
- Distributed systems
- High-availability patterns
- Advanced security
- Performance at scale
- Cloud-native patterns

## Resources

- Official documentation
- Community guides and tutorials
- Best practices and patterns
- Example implementations
- Performance optimization guides
- Security hardening resources
- Case studies and real-world examples

## Success Criteria

✅ Implementation follows best practices
✅ Code is clean and maintainable
✅ Performance is optimized
✅ Security requirements met
✅ Tests provide good coverage
✅ Documentation is complete
✅ Monitoring and alerting configured
✅ Deployment is smooth and safe

## When to Use This Skill

Apply this skill when:
- Building production applications
- Solving complex problems
- Optimizing performance
- Implementing security
- Making architectural decisions
- Training team members
- Reviewing code quality

## Integration with Other Skills

This skill complements:
- Related framework/tool skills
- Architecture pattern skills
- Testing and quality skills
- DevOps and deployment skills
- Security and compliance skills

## Version Notes

- Latest stable releases
- Feature deprecations
- Migration guides
- Breaking changes
- Upgrade paths

## Community & Support

- Official forums and discussions
- Community Slack/Discord channels
- Stack Overflow resources
- GitHub discussions
- Blog posts and articles

## Roadmap & Future

- Upcoming features
- Planned improvements
- Community contributions
- Performance roadmap
- Security improvements
