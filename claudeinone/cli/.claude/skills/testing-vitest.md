# Vitest

Lightning-fast unit test framework.

## Setup

```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/dom
```

## Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

## Basic Tests

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Math Utils', () => {
  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle negative numbers', () => {
    expect(-5 + 3).toBe(-2);
  });

  it('should match objects', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toEqual({ name: 'John', age: 30 });
  });

  it('should test arrays', () => {
    const numbers = [1, 2, 3];
    expect(numbers).toContain(2);
    expect(numbers.length).toBe(3);
  });
});
```

## Async Testing

```typescript
describe('Async Operations', () => {
  it('should fetch data', async () => {
    const data = await fetchUser(1);
    expect(data.id).toBe(1);
  });

  it('should handle promise', () => {
    return expect(Promise.resolve(42)).resolves.toBe(42);
  });

  it('should handle rejection', () => {
    return expect(Promise.reject('error')).rejects.toBe('error');
  });
});
```

## Mocking

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Database Operations', () => {
  it('should call database', async () => {
    const mockDB = vi.fn(() => ({ id: 1, name: 'John' }));

    const result = mockDB();

    expect(mockDB).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'John' });
  });

  it('should mock modules', () => {
    vi.mock('./api', () => ({
      getUser: vi.fn(() => ({ id: 1 }))
    }));

    const { getUser } = require('./api');
    expect(getUser()).toEqual({ id: 1 });
  });

  it('should spy on methods', () => {
    const obj = {
      method: () => 'original'
    };

    const spy = vi.spyOn(obj, 'method');
    obj.method();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith('original');
  });
});
```

## React Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when loading', () => {
    render(<Button disabled>Loading...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Coverage

```bash
# Run with coverage
vitest --coverage

# Open coverage report
open coverage/index.html
```

## Best Practices

✅ **Test behavior** - Not implementation
✅ **Clear names** - Describe what is tested
✅ **DRY setup** - Use beforeEach for common setup
✅ **Isolated tests** - No dependencies between tests
✅ **Good coverage** - Aim for 80%+ coverage

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
