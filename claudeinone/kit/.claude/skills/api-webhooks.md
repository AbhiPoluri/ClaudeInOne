# Webhooks & Events

Push-based communication for real-time integrations.

## Webhook Implementation

```typescript
// Endpoint to receive webhooks
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.failed':
      await handlePaymentFailure(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handlePaymentSuccess(paymentIntent: any) {
  const order = await db.orders.findById(paymentIntent.metadata.orderId);
  await db.orders.update(order.id, { status: 'paid' });
  
  // Send confirmation email
  await emailService.sendOrderConfirmation(order);
}
```

## Retry Logic

```typescript
interface WebhookDelivery {
  id: string;
  url: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  nextRetry?: Date;
}

async function deliverWebhook(delivery: WebhookDelivery) {
  try {
    const response = await fetch(delivery.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-ID': delivery.id,
        'X-Webhook-Signature': signPayload(delivery.payload)
      },
      body: JSON.stringify(delivery.payload),
      timeout: 30000
    });

    if (response.ok) {
      await db.webhookDeliveries.update(delivery.id, {
        status: 'delivered'
      });
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    delivery.attempts += 1;

    if (delivery.attempts < 5) {
      // Exponential backoff: 60s, 5m, 30m, 2h
      const delays = [60, 300, 1800, 7200];
      const delaySeconds = delays[delivery.attempts - 1];

      await db.webhookDeliveries.update(delivery.id, {
        attempts: delivery.attempts,
        nextRetry: new Date(Date.now() + delaySeconds * 1000)
      });
    } else {
      await db.webhookDeliveries.update(delivery.id, {
        status: 'failed'
      });
    }
  }
}

// Retry worker
setInterval(async () => {
  const pending = await db.webhookDeliveries.find({
    status: 'pending',
    nextRetry: { $lte: new Date() }
  });

  for (const delivery of pending) {
    await deliverWebhook(delivery);
  }
}, 60000); // Check every minute
```

## Webhook Security

```typescript
import crypto from 'crypto';

function signPayload(payload: any): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${timestamp}.${JSON.stringify(payload)}`;

  const signature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(message)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

function verifySignature(payload: string, signature: string): boolean {
  const [timestamp, ...parts] = signature.split(',');
  const ts = parseInt(timestamp.split('=')[1]);
  const sig = parts[0].split('=')[1];

  // Prevent replay attacks
  if (Math.abs(Date.now() / 1000 - ts) > 300) {
    return false;
  }

  const message = `${ts}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(message)
    .digest('hex');

  return crypto.timingSafeEqual(sig, expectedSig);
}
```

## Publishing Events

```typescript
async function publishWebhookEvent(event: {
  type: string;
  data: any;
}) {
  // Find all webhook endpoints subscribed to this event type
  const subscriptions = await db.webhookSubscriptions.find({
    events: event.type
  });

  for (const subscription of subscriptions) {
    // Create delivery record
    await db.webhookDeliveries.insert({
      id: crypto.randomUUID(),
      url: subscription.url,
      payload: event.data,
      status: 'pending',
      attempts: 0
    });

    // Attempt immediate delivery
    const delivery = await db.webhookDeliveries.findById(id);
    await deliverWebhook(delivery);
  }
}

// Usage
app.post('/api/orders', async (req, res) => {
  const order = await db.orders.create(req.body);

  // Publish event
  await publishWebhookEvent({
    type: 'order.created',
    data: { orderId: order.id, amount: order.total }
  });

  res.status(201).json(order);
});
```

## Client-Side Webhook Handling

```typescript
async function handleStripeWebhook(event: any) {
  console.log('Received webhook:', event.type);

  // Verify signature
  const signature = request.headers['stripe-signature'];
  if (!verifyStripeSignature(request.body, signature)) {
    return res.status(401).send('Unauthorized');
  }

  // Process asynchronously
  await queue.enqueue({
    type: 'webhook',
    eventType: event.type,
    data: event.data
  });

  // Return 200 immediately
  res.json({ received: true });
}
```

## Best Practices

✅ **Verify signatures** - Ensure webhook authenticity
✅ **Retry logic** - Use exponential backoff
✅ **Idempotency** - Handle duplicate deliveries
✅ **Async processing** - Don't block on webhook delivery
✅ **Logging** - Track all webhook events

## Resources

- [Webhook Best Practices](https://docs.svix.com/webhooks/best-practices)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
