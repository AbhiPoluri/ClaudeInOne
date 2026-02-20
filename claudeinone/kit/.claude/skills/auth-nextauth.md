# NextAuth.js

Complete authentication solution for Next.js with built-in session management and OAuth support.

## Setup

```bash
npm install next-auth

# Environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

## Basic Configuration (app/api/auth/[...nextauth]/route.ts)

```typescript
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id.toString(), email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    // Include user.id in session
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    // Control which users can sign in
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        // Allow GitHub users
        return true;
      }
      // Restrict credentials login to existing users
      return !!user;
    },
    // Modify JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request'
  },
  session: {
    strategy: 'jwt', // or 'database'
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## Get Session in Components

```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}
```

## Server-Side Session Access

```typescript
// Route handler
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ user: session.user });
}

// Server Component
import { getServerSession } from 'next-auth/next';

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome {session.user.name}</div>;
}
```

## Session Provider Wrapper

```typescript
// app/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

## Custom Sign In Page

```typescript
// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign In</button>

      <hr />

      <button
        type="button"
        onClick={() => signIn('github')}
      >
        Sign in with GitHub
      </button>
      <button
        type="button"
        onClick={() => signIn('google')}
      >
        Sign in with Google
      </button>
    </form>
  );
}
```

## Protected Routes with Middleware

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(req) {
  // Add custom logic here if needed
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

## Email Sign-In (Magic Links)

```typescript
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider, theme }) => {
        // Custom email sending logic
        await sendCustomEmail(identifier, url);
      }
    })
  ]
};
```

## Custom User Model (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials provider

  role          String    @default("user") // Custom field

  accounts      Account[]
  sessions      Session[]
  posts         Post[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Role-Based Access Control

```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth(requiredRole?: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (requiredRole && session.user.role !== requiredRole) {
    throw new Error('Forbidden');
  }

  return session;
}

// Usage in route handler
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await requireAuth('admin');

  // Admin-only logic
  return Response.json({ success: true });
}
```

## Event Callbacks

```typescript
export const authOptions = {
  // ... other config
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in`);

      if (isNewUser) {
        // Send welcome email
        await sendWelcomeEmail(user.email);
      }
    },
    async signOut({ token }) {
      console.log(`User ${token.email} signed out`);
    },
    async session({ session, user, newSession, trigger }) {
      // Called whenever session is checked
      console.log('Session checked');
    }
  }
};
```

## Best Practices

✅ **Never commit NEXTAUTH_SECRET** - Use environment variables
✅ **Always use HTTPS in production** - Set NEXTAUTH_URL to https
✅ **Secure cookies** - Enabled by default in production
✅ **Custom credentials** - Always hash passwords with bcrypt
✅ **Session strategy** - Use JWT for stateless, database for sessions
✅ **CSRF protection** - Built-in protection enabled by default
✅ **Database safety** - Use PrismaAdapter for database session storage

## Common Patterns

```typescript
// Check if user is admin
const isAdmin = session?.user?.role === 'admin';

// Redirect if not authenticated
if (!session) {
  redirect('/login');
}

// Use session in API route
const userId = session?.user?.id;

// Update session after changes
await useSession().update();
```

## When to Use NextAuth

✅ Next.js projects needing authentication
✅ OAuth integration (GitHub, Google, etc.)
✅ Email sign-in with magic links
✅ Credential-based authentication
✅ Session management

❌ APIs without web interface
❌ Non-Next.js applications
❌ Ultra-simple projects (consider Auth0 instead)

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth Providers](https://next-auth.js.org/providers/overview)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Database Session Strategy](https://next-auth.js.org/configuration/databases)
