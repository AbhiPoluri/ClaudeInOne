# Clean Code Architecture

Principles for writing maintainable, testable code.

## SOLID Principles

```typescript
// Single Responsibility Principle
// Bad: UserService does too much
class UserService {
  async createUser(userData) { /*...*/ }
  async sendEmail(to, subject, body) { /*...*/ }
  async logActivity(userId, action) { /*...*/ }
}

// Good: Separate concerns
class UserService {
  async createUser(userData) { /*...*/ }
}

class EmailService {
  async sendEmail(to, subject, body) { /*...*/ }
}

class LogService {
  async logActivity(userId, action) { /*...*/ }
}

// Open/Closed Principle
// Bad: Hard to extend without modification
class PaymentProcessor {
  process(payment, method) {
    if (method === 'stripe') {
      // Stripe logic
    } else if (method === 'paypal') {
      // PayPal logic
    }
  }
}

// Good: Extensible via inheritance
abstract class PaymentProvider {
  abstract process(payment: Payment): Promise<void>;
}

class StripeProvider extends PaymentProvider {
  async process(payment: Payment) { /*...*/ }
}

class PayPalProvider extends PaymentProvider {
  async process(payment: Payment) { /*...*/ }
}

class PaymentProcessor {
  constructor(private provider: PaymentProvider) {}
  
  async process(payment: Payment) {
    await this.provider.process(payment);
  }
}
```

## Dependency Injection

```typescript
// Bad: Tightly coupled
class UserRepository {
  private db = new Database();
  
  async findById(id: string) {
    return this.db.query('...');
  }
}

// Good: Injected dependencies
class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string) {
    return this.db.query('...');
  }
}

// Container pattern
class Container {
  private services = new Map();
  
  register(name: string, factory: () => any) {
    this.services.set(name, factory);
  }
  
  get(name: string) {
    const factory = this.services.get(name);
    return factory();
  }
}

const container = new Container();
container.register('db', () => new Database());
container.register('userRepository', () => 
  new UserRepository(container.get('db'))
);
```

## Design Patterns

```typescript
// Factory Pattern
interface UserFactory {
  createAdmin(data: any): User;
  createMember(data: any): User;
}

class StandardUserFactory implements UserFactory {
  createAdmin(data) {
    return new User({ ...data, role: 'admin' });
  }
  
  createMember(data) {
    return new User({ ...data, role: 'member' });
  }
}

// Strategy Pattern
interface PaymentStrategy {
  pay(amount: number): Promise<void>;
}

class CreditCardPayment implements PaymentStrategy {
  async pay(amount: number) { /*...*/ }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amount: number) { /*...*/ }
}

class OrderProcessor {
  constructor(private paymentStrategy: PaymentStrategy) {}
  
  async checkout(amount: number) {
    await this.paymentStrategy.pay(amount);
  }
}

// Observer Pattern
class EventBus {
  private listeners = new Map<string, Function[]>();
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}
```

## Error Handling

```typescript
// Custom error classes
class ApplicationError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string
  ) {
    super(message);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

// Usage
async function getUser(id: string) {
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  const user = await db.users.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return user;
}

// Error handler middleware
app.use((err: Error, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message
    });
  }
  
  res.status(500).json({ code: 'INTERNAL_ERROR' });
});
```

## Best Practices

✅ **DRY** - Don't Repeat Yourself
✅ **KISS** - Keep It Simple, Stupid
✅ **YAGNI** - You Aren't Gonna Need It
✅ **Meaningful names** - Self-documenting code
✅ **Small functions** - Single responsibility

## Resources

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Design Patterns](https://refactoring.guru/design-patterns)
