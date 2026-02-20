# Schema Validation

Validating data structure and types.

## Zod

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.date(),
  tags: z.array(z.string()).optional(),
  profile: z.object({
    bio: z.string().optional(),
    avatar: z.string().url()
  })
});

type User = z.infer<typeof UserSchema>;

// Validate
const user = await UserSchema.parseAsync(userData);

// Validate with error handling
const result = UserSchema.safeParse(userData);
if (!result.success) {
  console.error(result.error.flatten());
}

// Custom validation
const PasswordSchema = z.string()
  .min(8, 'Too short')
  .regex(/[A-Z]/, 'Need uppercase')
  .regex(/[0-9]/, 'Need number');
```

## Yup

```typescript
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  age: Yup.number().min(18).required()
});

schema.validate({
  email: 'test@example.com',
  password: 'secure123',
  age: 25
}).then(valid => {
  console.log(valid);
}).catch(err => {
  console.error(err.message);
});

// Async validation
const schema = Yup.object({
  email: Yup.string().email().required().test(
    'unique-email',
    'Email already exists',
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    }
  )
});
```

## Runtime Type Checking

```typescript
// Using a simple validator
const validate = (data: unknown, schema: any): boolean => {
  return schema.safeParse(data).success;
};

// API route validation
app.post('/api/users', (req, res) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten()
    });
  }

  // result.data is now typed as User
  const user = await db.users.create(result.data);
  res.status(201).json(user);
});
```

## Best Practices

✅ **Type inference** - Use z.infer for TypeScript types
✅ **Custom messages** - Clear error messages
✅ **Async validation** - For unique fields
✅ **Reusable schemas** - DRY validation
✅ **Server & client** - Validate both sides

## Resources

- [Zod Documentation](https://zod.dev/)
- [Yup Documentation](https://github.com/jquense/yup)
