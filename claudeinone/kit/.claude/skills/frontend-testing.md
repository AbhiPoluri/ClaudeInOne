# Frontend Testing

## Overview
Test React components with React Testing Library, mock APIs with MSW, and run E2E tests with Playwright.

## React Testing Library

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```tsx
// components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('shows error on invalid email', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('Email'), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('calls onSubmit with credentials', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
  });
});
```

## MSW (Mock Service Worker)

```bash
npm install -D msw
```

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice', email: 'alice@example.com' }
    ]);
  }),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({ id: '2', ...body }, { status: 201 });
  }),
];

// src/mocks/server.ts (Node.js for tests)
import { setupServer } from 'msw/node';
export const server = setupServer(...handlers);

// vitest.setup.ts
import { server } from './src/mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Playwright E2E

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Best Practices
- Test behavior, not implementation — query by role, label, text
- Use MSW for API mocking instead of `vi.mock` for fetch
- Write E2E tests for critical user flows only (login, checkout, signup)
- Run component tests with `jsdom`, E2E with real browser

## Resources
- [Testing Library docs](https://testing-library.com/docs)
- [MSW docs](https://mswjs.io/docs)
- [Playwright docs](https://playwright.dev)
