# WebAuthn Passkeys

## Overview
Passkeys use device biometrics (Touch ID, Face ID) for phishing-resistant, passwordless authentication.

## Setup with SimpleWebAuthn

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

## Registration Flow

```typescript
// app/api/auth/passkey/register/generate/route.ts
import { generateRegistrationOptions } from '@simplewebauthn/server';

export async function POST(req: Request) {
  const { userId } = await auth(); // get current user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const existingCredentials = await prisma.passkey.findMany({ where: { userId } });

  const options = await generateRegistrationOptions({
    rpName: 'My App',
    rpID: process.env.RP_ID!, // 'yourdomain.com'
    userID: new TextEncoder().encode(userId),
    userName: user!.email,
    excludeCredentials: existingCredentials.map(c => ({
      id: c.credentialId, type: 'public-key'
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge temporarily
  await redis.setex(`challenge:${userId}`, 300, options.challenge);
  return Response.json(options);
}

// app/api/auth/passkey/register/verify/route.ts
import { verifyRegistrationResponse } from '@simplewebauthn/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();
  const challenge = await redis.get(`challenge:${userId}`);

  const { verified, registrationInfo } = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: challenge!,
    expectedOrigin: process.env.ORIGIN!,
    expectedRPID: process.env.RP_ID!,
  });

  if (verified && registrationInfo) {
    await prisma.passkey.create({
      data: {
        userId,
        credentialId: registrationInfo.credential.id,
        publicKey: Buffer.from(registrationInfo.credential.publicKey),
        counter: registrationInfo.credential.counter,
      }
    });
  }

  return Response.json({ verified });
}
```

## Authentication Flow

```typescript
// Browser: start authentication
import { startAuthentication } from '@simplewebauthn/browser';

const options = await fetch('/api/auth/passkey/authenticate/generate', { method: 'POST' }).then(r => r.json());
const response = await startAuthentication(options);
await fetch('/api/auth/passkey/authenticate/verify', {
  method: 'POST',
  body: JSON.stringify(response),
  headers: { 'Content-Type': 'application/json' }
});
```

```typescript
// Server: verify authentication
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

const passkey = await prisma.passkey.findFirst({ where: { credentialId: body.id } });
const { verified } = await verifyAuthenticationResponse({
  response: body,
  expectedChallenge: challenge!,
  expectedOrigin: process.env.ORIGIN!,
  expectedRPID: process.env.RP_ID!,
  credential: { id: passkey!.credentialId, publicKey: passkey!.publicKey, counter: passkey!.counter }
});
```

## Best Practices
- Set `RP_ID` to your domain without protocol or path
- Store challenges in Redis with short TTL (5 min)
- Update `counter` after each authentication to detect cloned credentials
- Offer passkeys as addition to, not replacement for, existing auth

## Resources
- [SimpleWebAuthn docs](https://simplewebauthn.dev)
- [WebAuthn Guide](https://webauthn.guide)
