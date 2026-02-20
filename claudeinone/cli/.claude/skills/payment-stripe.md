# Stripe Payments

Payment processing for subscriptions, charges, and invoices.

## Setup

```bash
npm install stripe @stripe/react-stripe-js
```

## Server-Side Charge

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amountInCents: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    description: 'Order Payment',
    metadata: { orderId: '123' }
  });

  return paymentIntent;
}

// Express endpoint
app.post('/api/payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const intent = await createPaymentIntent(amount);
    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
```

## React Component

```typescript
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  async function fetchPaymentIntent() {
    const response = await fetch('/api/payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount: 9999 })
    });
    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: { name: 'Customer' }
      }
    });

    if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment successful!');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay $99.99
      </button>
    </form>
  );
}

export function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
```

## Subscriptions

```typescript
async function createSubscription(customerId: string, priceId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });

  return subscription;
}

async function cancelSubscription(subscriptionId: string) {
  const deleted = await stripe.subscriptions.del(subscriptionId);
  return deleted;
}

// Webhook handler
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object);
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription canceled:', event.data.object);
      break;
    case 'invoice.payment_succeeded':
      console.log('Invoice paid:', event.data.object);
      break;
  }

  res.json({ received: true });
});
```

## Customer Management

```typescript
async function createCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId: '123' }
  });

  return customer;
}

async function updateCustomer(customerId: string, updates: any) {
  return await stripe.customers.update(customerId, updates);
}

async function getCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}
```

## Invoices

```typescript
async function createInvoice(customerId: string, items: any[]) {
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'charge_automatically',
    auto_advance: false
  });

  for (const item of items) {
    await stripe.invoiceItems.create({
      invoice: invoice.id,
      customer: customerId,
      price: item.priceId,
      quantity: item.quantity
    });
  }

  await stripe.invoices.finalize(invoice.id);

  return invoice;
}
```

## Best Practices

✅ **Use Webhooks** - Async payment event handling
✅ **PCI Compliance** - Never handle raw card data
✅ **Idempotency** - Use idempotency keys for retries
✅ **Error handling** - Handle network failures gracefully
✅ **Reconciliation** - Regularly sync with Stripe

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
