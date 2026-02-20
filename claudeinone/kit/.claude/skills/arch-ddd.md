# Domain-Driven Design (DDD)

## Overview
DDD aligns software with business domains using aggregates, value objects, entities, and domain events.

## Value Object

```typescript
export class Money {
  private constructor(public readonly amount: number, public readonly currency: string) {}

  static of(amount: number, currency: string): Money {
    if (amount < 0) throw new Error('Amount must be non-negative');
    return new Money(Math.round(amount * 100) / 100, currency);
  }

  add(other: Money): Money {
    if (other.currency !== this.currency) throw new Error('Currency mismatch');
    return Money.of(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

## Aggregate Root

```typescript
export class Order {
  private _events: DomainEvent[] = [];
  private _items: OrderItem[] = [];
  private _status: 'draft' | 'confirmed' | 'shipped' = 'draft';

  private constructor(public readonly id: string, public readonly customerId: string) {}

  static create(customerId: string): Order {
    const order = new Order(crypto.randomUUID(), customerId);
    order._events.push({ type: 'OrderCreated', orderId: order.id, customerId });
    return order;
  }

  addItem(productId: string, price: Money): void {
    if (this._status !== 'draft') throw new Error('Order is already confirmed');
    this._items.push({ productId, price });
  }

  confirm(): void {
    if (this._items.length === 0) throw new Error('Cannot confirm empty order');
    this._status = 'confirmed';
    this._events.push({ type: 'OrderConfirmed', orderId: this.id });
  }

  get events() { return [...this._events]; }
  clearEvents() { this._events.length = 0; }
}
```

## Domain Service (publish events after save)

```typescript
export class OrderService {
  constructor(private repo: OrderRepository, private eventBus: EventBus) {}

  async confirmOrder(orderId: string): Promise<void> {
    const order = await this.repo.findById(orderId);
    if (!order) throw new Error('Order not found');
    order.confirm();
    await this.repo.save(order);
    for (const event of order.events) await this.eventBus.publish(event);
    order.clearEvents();
  }
}
```

## Best Practices
- Model ubiquitous language — use domain terms directly in code
- Aggregates should be small — avoid deep joins
- Always update aggregates through their roots
- Use outbox pattern for reliable event publishing
- Keep bounded contexts loosely coupled via events

## Resources
- [DDD Reference (Eric Evans)](https://www.domainlanguage.com/ddd/)
