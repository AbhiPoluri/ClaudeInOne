# End-to-End Testing

Full-stack testing using Playwright or Cypress to test complete user workflows.

## Playwright Setup

```bash
npm install -D @playwright/test
```

## Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  // Navigate
  await page.goto('http://localhost:3000/login');

  // Fill form
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');

  // Click button
  await page.click('button:has-text("Sign In")');

  // Wait for navigation
  await page.waitForURL('http://localhost:3000/dashboard');

  // Verify content
  expect(await page.locator('h1').textContent()).toBe('Dashboard');
});
```

## Assertions

```typescript
// Wait for element
await expect(page.locator('.success-message')).toBeVisible();

// Check URL
await expect(page).toHaveURL('/dashboard');

// Check text
await expect(page.locator('h1')).toHaveText('Welcome');

// Count elements
await expect(page.locator('.item')).toHaveCount(5);
```

## Page Objects

```typescript
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button:has-text("Sign In")');
    await this.page.waitForURL('/dashboard');
  }
}

// Usage
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@example.com', 'password123');
```

## Best Practices

✅ **Use Page Objects** - Maintainable test code
✅ **Wait for elements** - Don't hardcode waits
✅ **Test critical flows** - Focus on user journeys
✅ **Run in CI/CD** - Automate testing
✅ **Use test data** - Reset state between tests

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Cypress Docs](https://cypress.io/)
