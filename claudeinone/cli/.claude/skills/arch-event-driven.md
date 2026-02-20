# Event-Driven Architecture

Decouple services through asynchronous event publishing and consumption.

## Event Emitter Pattern

```typescript
import EventEmitter from 'events';

class EventBus extends EventEmitter {}

const eventBus = new EventBus();

// Subscribe to events
eventBus.on('user:created', (user) => {
  console.log(`User created: ${user.email}`);
  // Send welcome email
  sendWelcomeEmail(user.email);
});

eventBus.on('user:created', (user) => {
  console.log(`Tracking user signup: ${user.id}`);
  // Track analytics
  analytics.track('user_signup', user);
});

// Publish events
async function createUser(data) {
  const user = await db.users.create(data);
  eventBus.emit('user:created', user);
  return user;
}
```

## Message Queue Pattern (RabbitMQ)

```typescript
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

// Declare queue
await channel.assertQueue('user.created', { durable: true });

// Publish
async function publishUserCreated(user) {
  channel.sendToQueue(
    'user.created',
    Buffer.from(JSON.stringify(user)),
    { persistent: true }
  );
}

// Consume
channel.consume('user.created', async (msg) => {
  const user = JSON.parse(msg.content.toString());
  
  // Send welcome email
  await emailService.sendWelcome(user.email);
  
  // Acknowledge
  channel.ack(msg);
}, { noAck: false });
```

## Pub/Sub Pattern (Redis)

```typescript
import Redis from 'ioredis';

const redis = new Redis();

// Subscribe
redis.subscribe('user:created', (err, count) => {
  if (err) console.error('Subscribe error:', err);
});

redis.on('message', (channel, message) => {
  if (channel === 'user:created') {
    const user = JSON.parse(message);
    console.log(`Welcome email sent to ${user.email}`);
  }
});

// Publish
async function createUser(data) {
  const user = await db.users.create(data);
  
  redis.publish('user:created', JSON.stringify(user));
  
  return user;
}
```

## Event Sourcing

```typescript
interface Event {
  id: string;
  type: string;
  aggregate_id: string;
  data: any;
  timestamp: Date;
}

// Store events
async function createUserEvent(userId: string, userData: any) {
  const event: Event = {
    id: uuid(),
    type: 'UserCreated',
    aggregate_id: userId,
    data: userData,
    timestamp: new Date()
  };

  await db('events').insert(event);
  return event;
}

// Rebuild state from events
async function getUserState(userId: string) {
  const events = await db('events')
    .where('aggregate_id', userId)
    .orderBy('timestamp');

  let state = { id: userId };

  for (const event of events) {
    switch (event.type) {
      case 'UserCreated':
        state = { ...state, ...event.data };
        break;
      case 'UserUpdated':
        state = { ...state, ...event.data };
        break;
      case 'UserDeleted':
        state = { ...state, deleted: true };
        break;
    }
  }

  return state;
}
```

## Saga Pattern (Choreography)

```typescript
// Order saga coordinated by events

// 1. Order created → publish event
eventBus.on('order:created', async (order) => {
  // Payment service listens and processes payment
  eventBus.emit('payment:requested', order);
});

// 2. Payment processed → publish event
eventBus.on('payment:processed', async (payment) => {
  // Inventory service listens and reserves stock
  eventBus.emit('inventory:reserve', payment.order);
});

// 3. Stock reserved → publish event
eventBus.on('inventory:reserved', async (inventory) => {
  // Shipping service listens and creates shipment
  eventBus.emit('shipment:created', inventory.order);
});

// Handle failures with compensating transactions
eventBus.on('payment:failed', async (payment) => {
  // Compensating: Release reserved inventory
  eventBus.emit('inventory:release', payment.order);
});
```

## Best Practices

✅ **Idempotency** - Handle duplicate event processing
✅ **Dead letter queues** - Capture failed messages
✅ **Event versioning** - Support multiple event versions
✅ **Eventual consistency** - Accept temporary inconsistency
✅ **Monitoring** - Track event lag and processing times

## Resources

- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Redis Pub/Sub](https://redis.io/docs/manual/pubsub/)
