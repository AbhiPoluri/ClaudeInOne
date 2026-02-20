# Integration Testing

Testing interactions between multiple components and external services.

## Setup

```bash
npm install -D vitest supertest jest axios
```

## API Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('User API Integration', () => {
  let userId: string;
  
  beforeAll(async () => {
    // Setup test database
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should create a user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('should fetch created user', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });

  it('should update user', async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({ name: 'Updated User' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated User');
  });

  it('should delete user', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
  });
});
```

## Database Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';

describe('Database Operations', () => {
  beforeEach(async () => {
    await db.truncate('users');
  });

  it('should save and retrieve user', async () => {
    const user = await db.users.create({
      email: 'user@example.com',
      name: 'John Doe'
    });

    const retrieved = await db.users.findById(user.id);
    expect(retrieved.email).toBe('user@example.com');
  });

  it('should update user', async () => {
    const user = await db.users.create({
      email: 'old@example.com',
      name: 'John'
    });

    await db.users.update(user.id, {
      email: 'new@example.com'
    });

    const updated = await db.users.findById(user.id);
    expect(updated.email).toBe('new@example.com');
  });

  it('should handle transactions', async () => {
    await db.transaction(async (trx) => {
      const user = await trx('users').insert({
        email: 'tx@example.com',
        name: 'Transaction'
      });

      await trx('profiles').insert({
        userId: user[0],
        bio: 'Bio'
      });
    });

    const count = await db('users').count();
    expect(count[0]['count(*)']).toBe(1);
  });
});
```

## Third-Party Service Mocking

```typescript
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';

// Mock external API
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Payment Service Integration', () => {
  it('should process payment via Stripe', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: 'pi_123', status: 'succeeded' }
    });

    const result = await processPayment({
      amount: 9999,
      currency: 'USD'
    });

    expect(result.status).toBe('succeeded');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.stripe.com/v1/payment_intents',
      expect.any(Object)
    );
  });

  it('should handle payment failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      new Error('Card declined')
    );

    await expect(processPayment({ amount: 9999 }))
      .rejects
      .toThrow('Card declined');
  });
});
```

## End-to-End API Chain

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('User Workflow', () => {
  it('should complete signup → verify → login flow', async () => {
    // 1. Sign up
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'new@example.com',
        password: 'secure123'
      });

    expect(signupRes.status).toBe(201);
    const { userId } = signupRes.body;

    // 2. Send verification (mock email)
    const verifyRes = await request(app)
      .post(`/api/auth/verify/${userId}`)
      .send({ code: '123456' });

    expect(verifyRes.status).toBe(200);

    // 3. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'new@example.com',
        password: 'secure123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
```

## Best Practices

✅ **Isolation** - Use test database, reset between tests
✅ **Real calls vs mocks** - Mix real and mocked services
✅ **Async handling** - Proper await and promise handling
✅ **Cleanup** - Always teardown after tests
✅ **Meaningful assertions** - Test behavior, not implementation

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Guide](https://github.com/visionmedia/supertest)
- [Testing Library](https://testing-library.com/)
