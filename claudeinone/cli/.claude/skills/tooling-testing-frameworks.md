# Testing Frameworks

Overview of popular testing tools and frameworks.

## Vitest (Fast Unit Testing)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Math Utils', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });
});

// Mocking
vi.mock('./database');
const mockDb = vi.hoisted(() => ({
  query: vi.fn()
}));

describe('UserService', () => {
  it('should fetch user from database', async () => {
    mockDb.query.mockResolvedValueOnce({ id: '1', name: 'John' });
    
    const user = await getUserService().getUser('1');
    
    expect(user.name).toBe('John');
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = 1');
  });
});
```

## Jest (Industry Standard)

```typescript
import { jest } from '@jest/globals';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  it('should process payment', async () => {
    const result = await paymentService.process({
      amount: 100,
      currency: 'USD'
    });

    expect(result.status).toBe('success');
    expect(result).toHaveProperty('transactionId');
  });

  it('should retry on failure', async () => {
    const processSpy = jest.spyOn(paymentService, 'process');
    processSpy.mockRejectedValueOnce(new Error('Network error'));

    try {
      await paymentService.process({ amount: 100 });
    } catch (e) {
      expect(processSpy).toHaveBeenCalled();
    }
  });
});
```

## Testing Library (UI Testing)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('should increment count on button click', () => {
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('should handle async operations', async () => {
    render(<UserProfile userId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

## Cypress (E2E Testing)

```typescript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button:contains("Sign In")').click();

    cy.url().should('include', '/dashboard');
    cy.get('h1:contains("Dashboard")').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button:contains("Sign In")').click();

    cy.get('[role="alert"]').should('contain', 'Invalid credentials');
  });
});
```

## NightwatchJS

```typescript
module.exports = {
  'Login with valid credentials': (browser) => {
    browser
      .navigateTo('http://localhost:3000/login')
      .setValue('input[name="email"]', 'user@example.com')
      .setValue('input[name="password"]', 'password123')
      .click('button[type="submit"]')
      .waitForElementVisible('h1.dashboard-title')
      .assert.urlEquals('http://localhost:3000/dashboard')
      .end();
  }
};
```

## Mocha + Chai

```typescript
import { expect } from 'chai';
import { greet } from './greeting';

describe('Greeting', () => {
  it('should return greeting message', () => {
    const result = greet('John');
    expect(result).to.equal('Hello, John!');
  });

  it('should handle empty name', () => {
    const result = greet('');
    expect(result).to.equal('Hello!');
  });

  it('should be a string', () => {
    const result = greet('Jane');
    expect(result).to.be.a('string');
  });
});
```

## Test Coverage

```bash
# Generate coverage report
jest --coverage

# Show coverage for specific file
vitest --coverage src/utils.ts

# Minimum coverage threshold
# package.json
{
  "jest": {
    "collectCoverageFrom": ["src/**/*.ts"],
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Best Practices

✅ **Test behavior, not implementation** - Focus on outputs
✅ **Meaningful test names** - Describe what is being tested
✅ **DRY test code** - Extract common setup
✅ **Fast tests** - Mock external dependencies
✅ **Coverage** - Aim for 80%+ coverage

## Resources

- [Vitest](https://vitest.dev/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Cypress](https://www.cypress.io/)
