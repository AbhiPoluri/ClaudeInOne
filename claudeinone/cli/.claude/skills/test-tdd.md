# Test-Driven Development (TDD)

Writing tests before implementation for better code design.

## Red-Green-Refactor Cycle

```typescript
// Step 1: RED - Write failing test
import { describe, it, expect } from 'vitest';
import { Calculator } from '../calculator';

describe('Calculator', () => {
  it('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });

  it('should multiply two numbers', () => {
    const calc = new Calculator();
    expect(calc.multiply(2, 3)).toBe(6);
  });
});

// Step 2: GREEN - Write minimal implementation
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }
}

// Step 3: REFACTOR - Improve code while keeping tests passing
```

## API TDD Example

```typescript
// Test first
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('User API', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid', name: 'Test' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Invalid email');
  });
});

// Implementation
app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push('Invalid email');
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const user = await db.users.create({ email, name });
  res.status(201).json(user);
});
```

## Contract Testing

```typescript
// Define contract first
interface UserService {
  getUser(id: string): Promise<{ id: string; email: string }>;
  createUser(data: any): Promise<{ id: string; email: string }>;
}

// Test contract
describe('UserService Contract', () => {
  let service: UserService;

  beforeEach(() => {
    service = createUserService();
  });

  it('getUser returns object with id and email', async () => {
    const user = await service.getUser('123');
    
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(typeof user.id).toBe('string');
    expect(typeof user.email).toBe('string');
  });
});
```

## Acceptance Test-Driven Development

```typescript
// Feature specification
Feature: User Registration
  Scenario: User registers with valid credentials
    Given user is on signup page
    When user enters email "test@example.com"
    And user enters password "secure123"
    And user clicks "Sign Up"
    Then user should be redirected to dashboard
    And welcome email should be sent

// Automated acceptance test
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should register with valid credentials', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'secure123');
    await page.click('button:has-text("Sign Up")');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Mutation Testing

```typescript
// Detect weak tests
import stryker from '@stryker-mutator/core';

const results = await stryker.runMutationTest({
  mutate: ['src/**/*.ts'],
  testFramework: 'vitest',
  reporters: ['json', 'html']
});

// If mutation score < 80%, tests are weak
console.log(`Mutation score: ${results.mutationScore}%`);
```

## Best Practices

✅ **Write one test per scenario** - Keep tests focused
✅ **Meaningful test names** - Describe behavior
✅ **Arrange-Act-Assert** - Clear test structure
✅ **Fast feedback loop** - Run tests frequently
✅ **Refactor with confidence** - Tests prevent regressions

## Resources

- [Test-Driven Development in Practice](https://www.youtube.com/watch?v=QCwqnjxqfmY)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
