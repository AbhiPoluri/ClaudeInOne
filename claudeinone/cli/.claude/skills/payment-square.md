# Square Payments

Payment processing platform with in-store and online capabilities.

## Setup

```bash
npm install square
```

## Web Payments

```typescript
import { Client, Environment } from 'square';

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN
});

const paymentsApi = client.paymentsApi;

async function processPayment(sourceId: string, amountInCents: number) {
  const response = await paymentsApi.createPayment({
    sourceId,
    amountMoney: {
      amount: BigInt(amountInCents),
      currency: 'USD'
    },
    idempotencyKey: crypto.randomUUID()
  });

  return response.result;
}
```

## Web Payments Form

```typescript
import { SquareWebPaymentUI } from '@square/web-payments-sdk-js';

async function initializeSquare() {
  const web = window.Square?.web;
  
  if (!web) {
    throw new Error('Square SDK not loaded');
  }

  const payments = await web.payments({
    applicationId: process.env.REACT_APP_SQUARE_APP_ID,
    locationId: process.env.REACT_APP_SQUARE_LOCATION_ID
  });

  const card = await payments.card();
  await card.attach('#card-container');

  return { payments, card };
}

export function CheckoutForm() {
  const { payments, card } = useSquarePayments();

  async function handlePayment() {
    try {
      const result = await card.tokenize();

      if (result.status === 'OK') {
        const payment = await fetch('/api/square-payment', {
          method: 'POST',
          body: JSON.stringify({
            sourceId: result.token,
            amount: 9999
          })
        }).then(r => r.json());

        alert('Payment successful!');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  }

  return (
    <div>
      <div id="card-container"></div>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}
```

## Customers & Cards

```typescript
const customersApi = client.customersApi;
const cardsApi = client.cardsApi;

async function createCustomer(email: string, name: string) {
  const response = await customersApi.createCustomer({
    email,
    givenName: name
  });

  return response.result?.customer;
}

async function storeCard(customerId: string, sourceId: string) {
  const response = await cardsApi.createCard({
    sourceId,
    customerId
  });

  return response.result?.card;
}
```

## Subscriptions

```typescript
const subscriptionApi = client.subscriptionsApi;

async function createSubscription(customerId: string, planId: string) {
  const response = await subscriptionApi.createSubscription({
    customerId,
    locationId: process.env.SQUARE_LOCATION_ID,
    planVariationId: planId,
    startDate: new Date().toISOString().split('T')[0]
  });

  return response.result?.subscription;
}
```

## Webhooks

```typescript
import crypto from 'crypto';

app.post('/webhooks/square', express.json(), (req, res) => {
  const signature = req.header('x-square-hmac-sha256');
  const body = req.body;

  const hash = crypto
    .createHmac('sha256', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY)
    .update(JSON.stringify(body))
    .digest('base64');

  if (hash !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = body.data.object;

  switch (body.type) {
    case 'payment.created':
      console.log('Payment created:', event);
      break;
    case 'payment.updated':
      console.log('Payment updated:', event);
      break;
  }

  res.json({ success: true });
});
```

## Best Practices

✅ **Tokenization** - Use Square's secure token generation
✅ **3D Secure** - Support for additional verification
✅ **Idempotency** - Generate unique keys for retry safety
✅ **Webhooks** - Handle payment state changes
✅ **Testing** - Use Square's test cards

## Resources

- [Square Developer Docs](https://developer.squareup.com/)
- [Web Payments SDK](https://developer.squareup.com/docs/web-payments/overview)
