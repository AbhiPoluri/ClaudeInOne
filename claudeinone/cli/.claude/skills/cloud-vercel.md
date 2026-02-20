# Vercel

Serverless platform optimized for Next.js and edge functions.

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

## Vercel Config

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": [
    "DATABASE_URL",
    "API_SECRET"
  ],
  "regions": ["sfo1"]
}
```

## Environment Variables

```bash
# Set in Vercel dashboard or via CLI
vercel env add DATABASE_URL

# Pull to local .env.local
vercel env pull
```

## Edge Functions

```typescript
// api/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization');
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
```

## Best Practices

✅ **Use environment variables** - Keep secrets secure
✅ **Enable serverless function caching** - Improve performance
✅ **Monitor analytics** - Track usage and performance
✅ **Set up preview deployments** - Test before production
✅ **Use ISR** - Incremental Static Regeneration

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
