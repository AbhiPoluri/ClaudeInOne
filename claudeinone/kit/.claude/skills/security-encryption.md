# Encryption & Security

Data encryption, hashing, and secure communication.

## Password Hashing

```typescript
import bcrypt from 'bcrypt';

// Hash password
async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Verify password
async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Usage
async function registerUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  return await db.users.create({
    email,
    password: hashedPassword
  });
}

async function login(email: string, password: string) {
  const user = await db.users.findByEmail(email);
  
  if (!user) throw new Error('User not found');
  
  const valid = await verifyPassword(password, user.password);
  
  if (!valid) throw new Error('Invalid password');
  
  return user;
}
```

## JWT Tokens

```typescript
import jwt from 'jsonwebtoken';

// Create token
function createToken(userId: string) {
  return jwt.sign(
    { userId, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verify token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Data Encryption

```typescript
import crypto from 'crypto';

// Encrypt sensitive data
function encryptData(data: string, key: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    data: encrypted,
    tag: authTag.toString('hex')
  };
}

// Decrypt data
function decryptData(encrypted: any, key: string) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key),
    Buffer.from(encrypted.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));

  let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

## HTTPS & TLS

```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

## CORS & CSRF Protection

```typescript
import cors from 'cors';
import csrf from 'csurf';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

app.use(csrf({ cookie: false }));

// Include token in forms
app.get('/form', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <input type="email" name="email">
      <button type="submit">Submit</button>
    </form>
  `);
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Strict limiter for auth
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // 5 requests per minute
});

app.post('/login', authLimiter, (req, res) => {
  // Handle login
});
```

## SQL Injection Prevention

```typescript
// SAFE: Parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);

// SAFE: ORM usage
const user = await User.findOne({ email: 'user@example.com' });

// UNSAFE: String concatenation (never do this!)
// const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

## Best Practices

✅ **Never log passwords** - Remove from logs
✅ **Use HTTPS** - Always encrypt in transit
✅ **Rotate secrets** - Update API keys regularly
✅ **Input validation** - Sanitize all user input
✅ **Principle of least privilege** - Grant minimal permissions

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
