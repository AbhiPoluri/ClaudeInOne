# OWASP Security Top 10

Common vulnerabilities and how to prevent them.

## Injection

```typescript
// Bad: SQL injection
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Good: Parameterized queries
const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

// Good: ORM usage
const user = await User.findOne({ email });

// Bad: Command injection
const result = execSync(`ffmpeg -i ${userInput}.mp4`);

// Good: Use array form
const result = spawnSync('ffmpeg', ['-i', userInput + '.mp4']);
```

## Broken Authentication

```typescript
// Good: Hash passwords
import bcrypt from 'bcrypt';

const hash = await bcrypt.hash(password, 10);
await db.users.create({ email, password: hash });

// Good: Session management
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Good: MFA
import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({ name: 'MyApp' });
const verified = speakeasy.totp.verify({
  secret: user.totpSecret,
  encoding: 'base32',
  token: userToken,
  window: 2
});
```

## Sensitive Data Exposure

```typescript
// Bad: Logging passwords
console.log('User:', { password: user.password });

// Good: Don't log sensitive data
console.log('User:', { id: user.id, email: user.email });

// Good: Encrypt sensitive data
import crypto from 'crypto';

function encrypt(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + encrypted;
}

// Good: HTTPS only
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(301, `https://${req.host}${req.url}`);
  }
  next();
});
```

## XML External Entities (XXE)

```typescript
// Bad: Parse untrusted XML
const xmlDoc = new DOMParser().parseFromString(userXml, 'text/xml');

// Good: Disable external entities
const options = {
  resolveExternalEntities: false,
  noent: false,
  nocdata: true
};

const xmlDoc = parseXml(userXml, options);
```

## Broken Access Control

```typescript
// Bad: No authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);
});

// Good: Check authorization
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const currentUser = req.user;

  // Only allow users to see their own data
  if (currentUser.id !== userId && currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await db.users.findById(userId);
  res.json(user);
});
```

## Security Misconfiguration

```typescript
// Good: Set security headers
import helmet from 'helmet';

app.use(helmet());

// Good: Disable debug mode in production
if (process.env.NODE_ENV === 'production') {
  app.set('env', 'production');
  app.disable('x-powered-by');
}

// Good: Validate environment
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SESSION_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
});
```

## Cross-Site Scripting (XSS)

```typescript
// Bad: Raw HTML
res.send(`<h1>${title}</h1>`);

// Good: Escape output
import { escapeHtml } from 'lodash';

res.send(`<h1>${escapeHtml(title)}</h1>`);

// Good: React escapes by default
<h1>{title}</h1> {/* Safe */}

// Good: Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"]
  }
}));
```

## Insecure Deserialization

```typescript
// Bad: Deserialize untrusted data
const obj = JSON.parse(userInput);

// Good: Validate schema
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email()
});

const validated = schema.parse(JSON.parse(userInput));
```

## Best Practices

✅ **Input validation** - Always validate user input
✅ **Output encoding** - Escape data before displaying
✅ **Error handling** - Don't expose sensitive info in errors
✅ **Security headers** - Use helmet.js
✅ **HTTPS** - Always use HTTPS in production
✅ **Secrets rotation** - Regularly change API keys

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
