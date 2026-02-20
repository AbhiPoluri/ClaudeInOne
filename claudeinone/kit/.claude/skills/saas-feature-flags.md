# Feature Flags

## Overview
Control feature rollouts, kill switches, and A/B tests without code deployments.

## PostHog Feature Flags

```typescript
// Server-side flag check
import { PostHog } from 'posthog-node';
const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export async function isFeatureEnabled(flag: string, userId: string): Promise<boolean> {
  return !!(await posthog.isFeatureEnabled(flag, userId));
}

// In API route
const canUseNewEditor = await isFeatureEnabled('new-editor', userId);
if (canUseNewEditor) return newEditorResponse();
```

## Simple Database-Driven Flags

```typescript
// Simple flag system without third-party
const FLAGS_CACHE = new Map<string, { value: boolean; expiry: number }>();

async function getFlag(name: string): Promise<boolean> {
  const cached = FLAGS_CACHE.get(name);
  if (cached && cached.expiry > Date.now()) return cached.value;

  const flag = await prisma.featureFlag.findUnique({ where: { name } });
  const value = flag?.enabled ?? false;
  FLAGS_CACHE.set(name, { value, expiry: Date.now() + 60_000 }); // 60s cache
  return value;
}

// Schema
// model FeatureFlag { name String @id; enabled Boolean @default(false); }
```

## Percentage Rollout

```typescript
function isInRollout(userId: string, percentage: number): boolean {
  const hash = parseInt(
    require('crypto').createHash('sha256').update(userId).digest('hex').slice(0, 4),
    16
  );
  return (hash % 100) < percentage;
}

// Enable for 10% of users
const showBetaFeature = isInRollout(userId, 10);
```

## Next.js Middleware with Flags

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;
  if (!userId) return NextResponse.next();

  // Redirect new-checkout test group
  if (req.nextUrl.pathname === '/checkout' && await isFeatureEnabled('new-checkout', userId)) {
    return NextResponse.rewrite(new URL('/checkout-v2', req.url));
  }
  return NextResponse.next();
}
```

## Best Practices
- Clean up flags after full rollout — avoid flag debt
- Name flags with intent: `new-checkout-flow` not `experiment-123`
- Add an emergency kill switch for every major feature
- Log flag evaluations for debugging unexpected behavior

## Resources
- [PostHog feature flags](https://posthog.com/docs/feature-flags)
- [Unleash](https://www.getunleash.io) — open-source alternative
