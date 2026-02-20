# A/B Testing

## Overview
Run controlled experiments to validate product decisions with statistical confidence.

## PostHog Feature Flags (Self-hosted / Cloud)

```bash
npm install posthog-js posthog-node
```

```typescript
// client-side
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com',
});

// Get experiment variant
const variant = posthog.getFeatureFlag('checkout-button-color');
// Returns: 'control', 'variant-blue', 'variant-green'
```

```typescript
// server-side (Next.js API route)
import { PostHog } from 'posthog-node';
const client = new PostHog(process.env.POSTHOG_API_KEY!);

export async function GET(req: Request) {
  const userId = await getUserId(req);
  const variant = await client.getFeatureFlag('new-onboarding', userId);
  return Response.json({ variant });
}
```

## Simple In-House A/B Test

```typescript
// Deterministic assignment by user ID (consistent across sessions)
function getVariant(userId: string, experimentId: string, variants: string[]): string {
  const hash = require('crypto')
    .createHash('md5')
    .update(`${userId}:${experimentId}`)
    .digest('hex');
  const index = parseInt(hash.slice(0, 8), 16) % variants.length;
  return variants[index];
}

// Usage
const variant = getVariant(user.id, 'checkout-cta', ['control', 'treatment']);
```

## Track Conversion Events

```typescript
// Track experiment exposure
posthog.capture('$experiment_started', {
  '$experiment_name': 'checkout-cta',
  '$variant': variant,
});

// Track goal
posthog.capture('checkout_completed', { variant, revenue: 49 });
```

## Statistical Significance (Basic)

```typescript
function zScore(control: { conversions: number; visitors: number }, 
                treatment: { conversions: number; visitors: number }): number {
  const p1 = control.conversions / control.visitors;
  const p2 = treatment.conversions / treatment.visitors;
  const pooled = (control.conversions + treatment.conversions) / (control.visitors + treatment.visitors);
  return (p2 - p1) / Math.sqrt(pooled * (1 - pooled) * (1 / control.visitors + 1 / treatment.visitors));
}

const z = zScore({ conversions: 120, visitors: 1000 }, { conversions: 145, visitors: 1000 });
const significant = Math.abs(z) > 1.96; // 95% confidence
```

## Best Practices
- Run tests for at least 2 weeks to account for day-of-week effects
- Only test one change per experiment
- Pre-determine sample size before starting (avoid stopping early)
- Use server-side assignment to prevent flicker

## Resources
- [PostHog experiments](https://posthog.com/docs/experiments/manual)
- [Evan Miller A/B calculator](https://www.evanmiller.org/ab-testing/sample-size.html)
