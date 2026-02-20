# OAuth 2.0

Industry-standard authorization framework for delegated access.

## OAuth 2.0 Flows

### Authorization Code Flow (Most Secure)
```
1. User visits app, clicks "Login with Google"
2. Redirects to Google login page
3. User authenticates with Google
4. Google redirects back to app with auth code
5. App exchanges code for access token (backend)
6. App can now access user data
```

## Implementation (Node.js + Google)

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return done(err, user);
    });
  }
));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  });
```

## PKCE (For Native/SPA Apps)

```javascript
// Generate code challenge
const crypto = require('crypto');
const codeVerifier = crypto.randomBytes(32).toString('hex');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Exchange with verifier
const tokenResponse = await fetch('https://oauth.example.com/token', {
  method: 'POST',
  body: {
    grant_type: 'authorization_code',
    code: authCode,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
  }
});
```

## Token Management

```javascript
// Store tokens securely
localStorage.setItem('access_token', accessToken);

// Refresh token when expired
async function getValidToken() {
  if (isTokenExpired(accessToken)) {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      body: { refreshToken }
    });
    const { accessToken: newToken } = await response.json();
    localStorage.setItem('access_token', newToken);
    return newToken;
  }
  return accessToken;
}

// Use in API requests
const token = await getValidToken();
const response = await fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Best Practices

1. **Never store credentials in frontend**
2. **Use PKCE for public clients**
3. **Refresh tokens before expiry**
4. **Validate OAuth provider certificates**
5. **Implement proper error handling**
6. **Scope requests to minimum needed**

## Resources

- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [PKCE](https://tools.ietf.org/html/rfc7636)
- [OpenID Connect](https://openid.net/connect/)
