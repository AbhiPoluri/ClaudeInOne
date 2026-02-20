# Form Handling & Validation

Building robust, validated forms.

## React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  agreeToTerms: z.boolean().default(false)
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data);
      reset();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <label>
        <input {...register('agreeToTerms')} type="checkbox" />
        I agree to terms
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Formik Alternative

```typescript
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required()
});

export function SignupForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        await registerUser(values);
      }}
    >
      <Form>
        <Field name="email" type="email" placeholder="Email" />
        <ErrorMessage name="email" component="div" />

        <Field name="password" type="password" placeholder="Password" />
        <ErrorMessage name="password" component="div" />

        <button type="submit">Sign up</button>
      </Form>
    </Formik>
  );
}
```

## Advanced Validation

```typescript
const schema = z.object({
  password: z.string().min(8).max(50),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Field-level validation
const validateEmail = async (email: string) => {
  const exists = await checkEmailExists(email);
  if (exists) {
    throw new Error('Email already registered');
  }
};
```

## Best Practices

✅ **Real-time validation** - Immediate feedback
✅ **Field-level errors** - Show errors next to fields
✅ **Disabled submit** - During submission
✅ **Clear labels** - Accessible forms
✅ **CSRF protection** - Validate on server

## Resources

- [React Hook Form](https://react-hook-form.com/)
- [Formik](https://formik.org/)
- [Zod Validation](https://zod.dev/)
