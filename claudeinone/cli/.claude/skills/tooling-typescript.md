# TypeScript

Typed superset of JavaScript with static type checking and excellent tooling.

## Basic Types

```typescript
// Primitives
const str: string = "hello";
const num: number = 42;
const bool: boolean = true;
const nothing: null = null;
const undefined_val: undefined = undefined;

// Collections
const arr: number[] = [1, 2, 3];
const tuple: [string, number] = ["name", 42];
const obj: { name: string; age: number } = { name: "John", age: 30 };

// Functions
const add = (a: number, b: number): number => a + b;
const greet = (name: string): void => console.log(`Hello, ${name}`);
const optional = (x?: number): number | undefined => x;
```

## Interfaces & Types

```typescript
// Interface (structural typing)
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  readonly created_at: Date; // Readonly
}

// Type (more flexible)
type Admin = User & { admin_level: number };
type Status = "active" | "inactive" | "pending";

// Function type
type Handler = (event: Event) => void;

// Generics
interface Container<T> {
  value: T;
  get(): T;
  set(v: T): void;
}
```

## Classes

```typescript
class Animal {
  protected name: string;
  private age: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  protected getAge() {
    return this.age;
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} barks!`);
  }
}
```

## Advanced Patterns

### Utility Types
```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Required - make all properties required
type RequiredUser = Required<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude properties
type UserWithoutEmail = Omit<User, 'email'>;

// Record - create object with specific keys
type Status = 'active' | 'inactive';
const statusCount: Record<Status, number> = {
  active: 10,
  inactive: 5,
};
```

### Generics
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, 'name'); // string
```

### Discriminated Unions
```typescript
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handle<T>(result: Result<T>) {
  if (result.status === 'success') {
    console.log(result.data); // T
  } else {
    console.log(result.error); // Error
  }
}
```

## Strict Mode Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Best Practices

1. **Always use strict mode**: Catch more errors at compile time
2. **Avoid any**: Use unknown or specific types instead
3. **Use readonly**: For immutable data
4. **Narrow types**: Use type guards and discriminated unions
5. **Generic constraints**: Limit what types can be used

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
