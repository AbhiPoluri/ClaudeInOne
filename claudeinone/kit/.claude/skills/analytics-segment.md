# Segment Analytics

Customer data platform for tracking events and traits.

## Setup

```bash
npm install @segment/analytics-next
```

## Initialization

```typescript
import { AnalyticsBrowser } from '@segment/analytics-next';

const analytics = AnalyticsBrowser.load({
  writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY
});

export default analytics;
```

## Identify Users

```typescript
import analytics from './analytics';

async function handleUserLogin(user: { id: string; email: string; name: string }) {
  // Identify user
  await analytics.identify(user.id, {
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString()
  });
}

async function updateUserTraits(userId: string, traits: any) {
  await analytics.identify(userId, traits);
}

async function logout(userId: string) {
  await analytics.reset();
}
```

## Track Events

```typescript
import analytics from './analytics';

// Page view
await analytics.page('Dashboard', {
  category: 'dashboard',
  title: 'User Dashboard'
});

// Custom events
await analytics.track('Product Viewed', {
  productId: '123',
  productName: 'Laptop',
  price: 999.99
});

// E-commerce events
await analytics.track('Order Completed', {
  orderId: 'order-456',
  total: 299.99,
  currency: 'USD',
  products: [
    {
      id: '123',
      name: 'Product 1',
      price: 99.99,
      quantity: 2
    }
  ]
});

// Feature usage
await analytics.track('Feature Used', {
  feature: 'export_report',
  duration: 5000
});
```

## Group Tracking

```typescript
// Identify company/team
await analytics.group('company-123', {
  name: 'Acme Corp',
  plan: 'enterprise',
  users: 50
});

// Track group events
await analytics.track('Workspace Created', {
  workspaceId: 'ws-456',
  // Will be associated with group-123
});
```

## React Integration

```typescript
import { useAnalytics } from '@segment/analytics-react';
import { useEffect } from 'react';

function ProductPage({ productId }: { productId: string }) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.page('Product', {
      productId,
      category: 'products'
    });

    analytics?.track('Product Viewed', {
      productId
    });
  }, [productId, analytics]);

  return <div>Product Details</div>;
}
```

## Server-Side Tracking

```typescript
import { Analytics } from '@segment/analytics-node';

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY
});

// Track server event
await analytics.track({
  userId: 'user-123',
  event: 'Email Sent',
  properties: {
    emailType: 'welcome',
    recipient: 'user@example.com'
  }
});

// Flush and close
await analytics.closeAndFlush();
```

## Best Practices

✅ **Consistent naming** - Use snake_case for events
✅ **Contextual data** - Include relevant properties
✅ **PII handling** - Don't send personally identifiable info
✅ **Batching** - Leverage Segment's batching
✅ **Testing** - Use Segment debug mode in development

## Resources

- [Segment Documentation](https://segment.com/docs/)
- [Tracking API](https://segment.com/docs/api/track/)
