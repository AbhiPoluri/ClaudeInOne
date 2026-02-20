# SaaS Billing with Stripe

## Overview
Implement subscription billing with Stripe: pricing plans, checkout, webhooks, and customer portal.

## Setup

```bash
npm install stripe @stripe/stripe-js
```

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Create Checkout Session

```typescript
// app/api/checkout/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId, priceId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
  });

  return Response.json({ url: session.url });
}
```

## Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const userId = (event.data.object as any).metadata?.userId;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: sub.customer as string,
          stripeSubscriptionId: sub.id,
          plan: sub.status === 'active' ? 'pro' : 'free',
          planExpiresAt: new Date(sub.current_period_end * 1000),
        }
      });
      break;
    }
    case 'customer.subscription.deleted':
      await prisma.user.update({ where: { id: userId }, data: { plan: 'free' } });
      break;
  }

  return Response.json({ received: true });
}
```

## Customer Portal

```typescript
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });
  return Response.json({ url: session.url });
}
```

## Best Practices
- Always verify webhook signatures
- Store `stripeCustomerId` in your DB — never recreate customers
- Use `idempotency_key` for retry-safe checkout session creation
- Handle `payment_intent.payment_failed` to notify users of failed renewals

## Resources
- [Stripe Billing docs](https://stripe.com/docs/billing)
