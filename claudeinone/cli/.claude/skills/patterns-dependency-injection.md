# Dependency Injection Patterns

Managing dependencies and composing complex objects.

## Constructor Injection

```typescript
// Define interfaces
interface Database {
  query(sql: string): Promise<any>;
}

interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// Service with injected dependencies
class UserService {
  constructor(
    private db: Database,
    private logger: Logger
  ) {}

  async getUser(id: string) {
    this.logger.log(`Fetching user ${id}`);
    const user = await this.db.query(`SELECT * FROM users WHERE id = ${id}`);
    return user;
  }
}

// Concrete implementations
class PostgresDatabase implements Database {
  async query(sql: string) {
    // PostgreSQL logic
  }
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}

// Usage
const db = new PostgresDatabase();
const logger = new ConsoleLogger();
const userService = new UserService(db, logger);
```

## Service Container

```typescript
class Container {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  register(name: string, factory: () => any) {
    this.services.set(name, factory);
  }

  singleton(name: string, factory: () => any) {
    const instance = factory();
    this.singletons.set(name, instance);
  }

  get(name: string): any {
    // Return singleton if exists
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create instance from factory
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not registered`);
    }

    return factory();
  }
}

// Setup
const container = new Container();

container.singleton('db', () => new PostgresDatabase());
container.singleton('logger', () => new ConsoleLogger());

container.register('userService', () =>
  new UserService(container.get('db'), container.get('logger'))
);

container.register('postService', () =>
  new PostService(container.get('db'), container.get('logger'))
);

// Usage
const userService = container.get('userService');
```

## Factory Pattern

```typescript
interface PaymentProvider {
  charge(amount: number): Promise<void>;
}

class StripeProvider implements PaymentProvider {
  async charge(amount: number) {
    // Stripe implementation
  }
}

class PayPalProvider implements PaymentProvider {
  async charge(amount: number) {
    // PayPal implementation
  }
}

class PaymentProviderFactory {
  static create(provider: 'stripe' | 'paypal'): PaymentProvider {
    switch (provider) {
      case 'stripe':
        return new StripeProvider();
      case 'paypal':
        return new PayPalProvider();
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}

// Usage
const provider = PaymentProviderFactory.create('stripe');
await provider.charge(100);
```

## Async DI

```typescript
class Container {
  private services = new Map<string, () => Promise<any>>();

  async get(name: string): Promise<any> {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }

    return factory();
  }

  register(name: string, factory: () => Promise<any>) {
    this.services.set(name, factory);
  }
}

const container = new Container();

container.register('db', async () => {
  const db = new Database();
  await db.connect();
  return db;
});

// Usage
const db = await container.get('db');
```

## Decorators

```typescript
import 'reflect-metadata';
import { Inject } from 'tsyringe';
import { Container } from 'tsyringe';

@injectable()
class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

@injectable()
class UserService {
  constructor(@Inject('logger') private logger: Logger) {}

  getUser(id: string) {
    this.logger.log(`Getting user ${id}`);
  }
}

// Setup
const container = new Container();
container.registerSingleton('logger', Logger);
container.register('userService', UserService);

// Usage
const userService = container.resolve(UserService);
userService.getUser('123');
```

## Best Practices

✅ **Program to interfaces** - Not implementations
✅ **Single responsibility** - Each service has one job
✅ **Dependency inversion** - Depend on abstractions
✅ **Use containers** - For complex applications
✅ **Testing** - Mock dependencies easily

## Resources

- [Dependency Injection](https://martinfowler.com/articles/injection.html)
- [tsyringe](https://github.com/Microsoft/tsyringe)
- [InversifyJS](https://inversify.io/)
