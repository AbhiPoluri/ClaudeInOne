# SaaS Analytics

## Overview
Track user behavior, product usage, and business metrics to drive data-informed decisions.

## PostHog Integration

```bash
npm install posthog-js posthog-node
```

```tsx
// app/layout.tsx — client-side tracking
'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, { api_host: 'https://app.posthog.com' });

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

## Track Events

```typescript
import { usePostHog } from 'posthog-js/react';

function CheckoutButton({ price }: { price: number }) {
  const posthog = usePostHog();

  return (
    <button onClick={() => {
      posthog.capture('checkout_initiated', {
        plan: 'pro',
        price,
        source: 'pricing_page',
      });
    }}>
      Upgrade to Pro
    </button>
  );
}
```

## Identify Users

```typescript
// After login — tie events to user
posthog.identify(user.id, {
  email: user.email,
  name: user.name,
  plan: user.plan,
  createdAt: user.createdAt,
  company: user.company,
});

// Reset on logout
posthog.reset();
```

## Server-Side Event Tracking

```typescript
import { PostHog } from 'posthog-node';
const analytics = new PostHog(process.env.POSTHOG_API_KEY!);

// Track subscription upgrade
await analytics.capture({
  distinctId: userId,
  event: 'subscription_upgraded',
  properties: { from_plan: 'free', to_plan: 'pro', revenue: 49 }
});

// Flush before serverless function exits
await analytics.shutdown();
```

## Key SaaS Metrics to Track

```typescript
// Events to capture
const EVENTS = {
  // Acquisition
  SIGNUP: 'user_signed_up',
  FIRST_LOGIN: 'user_first_login',

  // Activation
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_VALUE_ACTION: 'first_project_created',

  // Retention
  FEATURE_USED: 'feature_used',
  SESSION_STARTED: '$pageview',

  // Revenue
  UPGRADE_CLICKED: 'upgrade_clicked',
  CHECKOUT_COMPLETED: 'subscription_created',
  CHURNED: 'subscription_cancelled',
};
```

## Best Practices
- Identify users right after authentication
- Track activation event (when user gets first value)
- Use `$set` properties for persistent user attributes
- Group users by organization for B2B analytics

## Resources
- [PostHog docs](https://posthog.com/docs)
- [Mixpanel](https://developer.mixpanel.com/docs)
