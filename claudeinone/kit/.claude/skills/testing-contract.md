# Contract Testing

Testing API contracts between services.

## Pact Setup

```bash
npm install -D @pact-foundation/pact
```

## Consumer Test

```typescript
import { Pact, Matchers } from '@pact-foundation/pact';

describe('UserService Consumer', () => {
  const provider = new Pact({
    consumer: 'Frontend',
    provider: 'UserAPI'
  });

  it('fetches user successfully', async () => {
    await provider.addInteraction({
      state: 'user with ID 1 exists',
      uponReceiving: 'a request for user 1',
      withRequest: {
        method: 'GET',
        path: '/api/users/1'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: Matchers.like(1),
          email: Matchers.like('user@example.com'),
          name: Matchers.like('John')
        }
      }
    });

    const user = await userService.getUser(1);

    expect(user.email).toBe('user@example.com');
  });

  afterAll(() => provider.finalize());
});
```

## Provider Test

```typescript
describe('UserAPI Provider', () => {
  it('honors the consumer contract', async () => {
    const opts = {
      consumerVersionSelectors: [{ tag: 'main' }],
      providerBaseUrl: 'http://localhost:3000'
    };

    await verifyPacts(opts);
  });
});
```

## Benefits

✅ **Prevents integration breaks** - Catch issues early
✅ **Consumer-driven** - Tests reflect real usage
✅ **Independent testing** - No need for other service
✅ **Documentation** - Contract serves as spec
✅ **Confidence** - Verify contracts between services

## Resources

- [Pact Documentation](https://docs.pact.dev/)
- [Contract Testing](https://martinfowler.com/articles/consumerDrivenContracts.html)
