# Lemon Squeezy Payments

## Overview
Lemon Squeezy is a merchant of record payment platform with built-in tax handling, subscriptions, and a simple API.

## Setup

```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

```env
LEMONSQUEEZY_API_KEY=eyJ0...
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_...
```

## Create Checkout

```typescript
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

// app/api/checkout/route.ts
export async function POST(req: Request) {
  const { userId, email, variantId } = await req.json();

  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutData: {
        email,
        custom: { userId },
      },
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
        receiptThankYouNote: 'Thank you for subscribing!',
      },
    }
  );

  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ url: data?.data.attributes.url });
}
```

## Webhook Handler

```typescript
// app/api/webhooks/lemonsqueezy/route.ts
import crypto from 'crypto';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';

  const hmac = crypto
    .createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (hmac !== signature) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.userId;

  switch (eventName) {
    case 'order_created':
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'pro', planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      });
      break;
    case 'subscription_cancelled':
      await prisma.user.update({ where: { id: userId }, data: { plan: 'free' } });
      break;
  }

  return Response.json({ received: true });
}
```

## Best Practices
- Always verify webhook signatures before processing
- Store `userId` in checkout `custom_data` to link purchases to users
- Use Lemon Squeezy's test mode during development
- Handle `subscription_renewed`, `subscription_expired`, and `subscription_cancelled` events

## Resources
- [Lemon Squeezy docs](https://docs.lemonsqueezy.com)
- [@lemonsqueezy/lemonsqueezy.js](https://github.com/lemonSqueezy/lemonsqueezy-js)
