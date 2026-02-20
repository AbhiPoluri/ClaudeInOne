# Clean Architecture

## Overview
Organize code in layers: Domain (core logic) → Application (use cases) → Infrastructure (DB/HTTP) → Interface (controllers).

## Project Structure

```
src/
├── domain/          # No external deps — pure business logic
│   └── user/
│       ├── User.ts           # Entity
│       └── UserRepository.ts # Interface (Port)
├── application/     # Orchestrates domain
│   └── user/
│       └── CreateUserUseCase.ts
├── infrastructure/  # Implements ports
│   └── user/
│       └── PrismaUserRepository.ts
└── interfaces/      # HTTP, GraphQL — thin layer
    └── UserController.ts
```

## Domain Entity

```typescript
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
  ) {}

  static create(props: { email: string; name: string }): User {
    if (!props.email.includes('@')) throw new Error('Invalid email');
    return new User(crypto.randomUUID(), props.email, props.name);
  }
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

## Application Use Case

```typescript
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: { email: string; name: string }) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) throw new Error('Email already in use');
    const user = User.create(input);
    await this.userRepo.save(user);
    return { id: user.id, email: user.email, name: user.name };
  }
}
```

## Infrastructure Adapter

```typescript
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? User.create({ email: row.email, name: row.name }) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email, name: user.name },
      update: { name: user.name },
    });
  }
}
```

## Best Practices
- Domain layer must have zero external dependencies
- Use interfaces (ports) at every layer boundary
- Inject all dependencies — never instantiate in use cases
- Entities validate their own invariants

## Resources
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
