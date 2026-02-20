# JWT (JSON Web Tokens)

Stateless authentication using digitally signed tokens.

## Token Structure

JWTs consist of 3 parts separated by dots: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["user", "admin"]
}
```

### Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Implementation (Node.js + Express)

```typescript
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

// Create token
function createToken(userId: string): string {
  return jwt.sign(
    { sub: userId, role: 'user' },
    SECRET,
    { expiresIn: '24h' }
  );
}

// Verify token (middleware)
function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

// Express middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Route
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ user_id: req.user.sub });
});
```

## Refresh Tokens

```typescript
// Issue refresh token with longer expiry
const refreshToken = jwt.sign(
  { sub: userId },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Use refresh token to get new access token
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { sub: decoded.sub },
      SECRET,
      { expiresIn: '1h' }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

## Best Practices

1. **Sign with strong secret**: Use environment variable, min 32 characters
2. **Short expiry**: 15min - 1hr for access tokens
3. **Refresh tokens**: Separate longer-lived tokens for token refresh
4. **Always HTTPS**: Never transmit JWT over unencrypted connection
5. **HttpOnly cookies**: Store tokens in httpOnly cookies if possible
6. **Validate claims**: Check exp, iat, and custom claims
7. **Revocation**: Maintain blacklist of invalidated tokens
8. **RSA for microservices**: Use asymmetric crypto for inter-service auth

## Claims (Standard)

```json
{
  "iss": "issuer",
  "sub": "subject (usually user ID)",
  "aud": "audience",
  "exp": 1516242622,
  "nbf": 1516239022,
  "iat": 1516239022,
  "jti": "unique token ID"
}
```

## Resources

- [JWT.io](https://jwt.io/)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
