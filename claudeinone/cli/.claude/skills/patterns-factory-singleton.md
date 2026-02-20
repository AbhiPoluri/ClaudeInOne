# Design Patterns

Common patterns for software architecture.

## Singleton Pattern

```typescript
// Ensure only one instance exists
class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // true
```

## Factory Pattern

```typescript
// Create objects without exposing creation logic
interface Shape {
  draw(): void;
}

class Circle implements Shape {
  draw() { console.log('Drawing circle'); }
}

class Square implements Shape {
  draw() { console.log('Drawing square'); }
}

class ShapeFactory {
  static createShape(type: string): Shape {
    switch (type) {
      case 'circle':
        return new Circle();
      case 'square':
        return new Square();
      default:
        throw new Error(`Unknown shape: ${type}`);
    }
  }
}

// Usage
const circle = ShapeFactory.createShape('circle');
circle.draw();
```

## Observer Pattern

```typescript
// Notify multiple objects about state changes
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer) {
    this.observers.push(observer);
  }

  detach(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class UserCreatedListener implements Observer {
  update(data: any) {
    console.log('User created:', data);
    // Send welcome email
  }
}

// Usage
const subject = new Subject();
const listener = new UserCreatedListener();

subject.attach(listener);
subject.notify({ userId: '123', email: 'user@example.com' });
```

## Decorator Pattern

```typescript
// Attach additional responsibilities dynamically
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'ConcreteComponent';
  }
}

abstract class Decorator implements Component {
  constructor(protected component: Component) {}

  operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

// Usage
const component = new ConcreteComponent();
const decorated = new ConcreteDecoratorA(
  new ConcreteDecoratorB(component)
);

console.log(decorated.operation()); // ConcreteDecoratorA(ConcreteDecoratorB(ConcreteComponent))
```

## Strategy Pattern

```typescript
// Define family of interchangeable algorithms
interface SortStrategy {
  sort(items: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(items: number[]): number[] {
    const arr = [...items];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(items: number[]): number[] {
    if (items.length <= 1) return items;
    const pivot = items[0];
    const less = items.slice(1).filter(x => x <= pivot);
    const greater = items.slice(1).filter(x => x > pivot);
    return [...this.sort(less), pivot, ...this.sort(greater)];
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  sort(items: number[]): number[] {
    return this.strategy.sort(items);
  }
}

// Usage
const items = [3, 1, 4, 1, 5];
const sorter = new Sorter(new QuickSort());
console.log(sorter.sort(items)); // [1, 1, 3, 4, 5]
```

## Best Practices

✅ **Use appropriate patterns** - Don't over-engineer
✅ **Combine patterns** - Real apps use multiple patterns
✅ **Document patterns** - Make intent clear
✅ **Refactor to patterns** - Emerge naturally from code
✅ **Know the tradeoffs** - Patterns have pros and cons

## Resources

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru Patterns](https://refactoring.guru/design-patterns)
