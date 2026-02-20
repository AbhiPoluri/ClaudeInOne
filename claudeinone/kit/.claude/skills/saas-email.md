# Transactional Email

## Overview
Send reliable transactional emails (welcome, password reset, receipts) using Resend with React Email templates.

## Setup

```bash
npm install resend @react-email/components
```

```env
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
```

## React Email Template

```tsx
// emails/WelcomeEmail.tsx
import { Html, Head, Body, Container, Heading, Text, Button, Hr } from '@react-email/components';

export function WelcomeEmail({ name, confirmUrl }: { name: string; confirmUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f5' }}>
        <Container style={{ maxWidth: '580px', margin: '0 auto', padding: '20px' }}>
          <Heading>Welcome to MyApp, {name}!</Heading>
          <Text>Thanks for signing up. Confirm your email to get started.</Text>
          <Button href={confirmUrl}
            style={{ backgroundColor: '#0070f3', color: '#fff', padding: '12px 24px', borderRadius: '6px' }}>
            Confirm Email
          </Button>
          <Hr />
          <Text style={{ color: '#888', fontSize: '12px' }}>
            If you didn&#39;t sign up, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

## Send Email

```typescript
// lib/email.ts
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(user: { email: string; name: string; confirmUrl: string }) {
  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: user.email,
    subject: `Welcome to MyApp, ${user.name}!`,
    react: WelcomeEmail({ name: user.name, confirmUrl: user.confirmUrl }),
  });
}

export async function sendPasswordReset(email: string, resetUrl: string) {
  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: 'Reset your password',
    html: `<p>Reset your password: <a href="${resetUrl}">Click here</a></p>`,
  });
}
```

## Preview Emails in Development

```bash
npx email dev --dir emails --port 3001
```

## Best Practices
- Preview emails at `localhost:3001` with `@react-email/components` dev server
- Set SPF, DKIM, DMARC DNS records for deliverability
- Use `Resend.batch.send()` for bulk sends
- Store email send records in DB for debugging delivery issues

## Resources
- [Resend docs](https://resend.com/docs)
- [React Email](https://react.email/docs/introduction)
