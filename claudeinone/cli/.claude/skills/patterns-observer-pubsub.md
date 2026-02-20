# Observer & Pub/Sub Patterns

Decoupled event-driven communication.

## Observer Pattern Implementation

```typescript
type Observer<T> = (data: T) => void;

class Subject<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    // Return unsubscribe function
    return () => this.observers.delete(observer);
  }

  notify(data: T) {
    this.observers.forEach(observer => observer(data));
  }
}

// Usage
const userSubject = new Subject<{ userId: string; action: string }>();

const unsubscribe1 = userSubject.subscribe(data => {
  console.log('Email service:', data);
});

const unsubscribe2 = userSubject.subscribe(data => {
  console.log('Analytics:', data);
});

userSubject.notify({ userId: '123', action: 'login' });

// Unsubscribe
unsubscribe1();
```

## Pub/Sub with Channels

```typescript
class PubSub {
  private channels = new Map<string, Set<Function>>();

  subscribe(channel: string, callback: Function): () => void {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }

    this.channels.get(channel)!.add(callback);

    return () => {
      this.channels.get(channel)!.delete(callback);
    };
  }

  publish(channel: string, data: any) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }
}

// Usage
const pubsub = new PubSub();

pubsub.subscribe('user:created', (user) => {
  console.log('User created:', user);
});

pubsub.subscribe('user:created', (user) => {
  console.log('Send welcome email to:', user.email);
});

pubsub.publish('user:created', {
  id: '123',
  email: 'user@example.com'
});
```

## EventEmitter Pattern

```typescript
import { EventEmitter } from 'events';

class UserService extends EventEmitter {
  async createUser(userData: any) {
    const user = await db.users.create(userData);

    // Emit event
    this.emit('user:created', user);
    this.emit('user:modified', user);

    return user;
  }

  async deleteUser(userId: string) {
    await db.users.delete(userId);
    this.emit('user:deleted', userId);
  }
}

// Usage
const userService = new UserService();

userService.on('user:created', (user) => {
  console.log('New user:', user.email);
  sendWelcomeEmail(user);
});

userService.on('user:deleted', (userId) => {
  console.log('User deleted:', userId);
});

userService.once('user:modified', (user) => {
  console.log('User first modified:', user);
});

await userService.createUser({ email: 'user@example.com' });
```

## Message Queue Pattern

```typescript
interface Message {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
}

class MessageQueue {
  private queue: Message[] = [];
  private subscribers = new Map<string, Function[]>();
  private processing = false;

  async enqueue(type: string, payload: any) {
    this.queue.push({
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: new Date()
    });

    this.process();
  }

  subscribe(type: string, handler: Function) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type)!.push(handler);
  }

  private async process() {
    if (this.processing) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift()!;
      const handlers = this.subscribers.get(message.type) || [];

      for (const handler of handlers) {
        try {
          await handler(message.payload);
        } catch (error) {
          console.error(`Error processing message ${message.id}:`, error);
          // Re-queue failed messages
          this.queue.push(message);
        }
      }
    }

    this.processing = false;
  }
}

// Usage
const queue = new MessageQueue();

queue.subscribe('email:send', async (payload) => {
  await emailService.send(payload.to, payload.subject);
});

queue.subscribe('analytics:track', async (payload) => {
  await analytics.track(payload);
});

await queue.enqueue('email:send', {
  to: 'user@example.com',
  subject: 'Welcome'
});
```

## Best Practices

✅ **Decouple components** - Reduce dependencies
✅ **Error handling** - Handle failed subscriptions
✅ **Memory leaks** - Unsubscribe when done
✅ **Type safety** - Use generics for typed events
✅ **Debugging** - Log event emissions

## Resources

- [Node.js EventEmitter](https://nodejs.org/api/events.html)
- [PubSub Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
