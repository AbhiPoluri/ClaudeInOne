# OAuth 2.0 & OpenID Connect

Secure third-party authentication and authorization.

## OAuth 2.0 Flow

```typescript
// Authorization Code Flow (most secure)
import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Step 1: Generate authorization URL
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile']
  });

  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for token
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const userInfo = await oauth2Client.request({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo'
  });

  // Create or update user
  let user = await db.users.findByEmail(userInfo.data.email);
  if (!user) {
    user = await db.users.create({
      email: userInfo.data.email,
      name: userInfo.data.name,
      googleId: userInfo.data.id
    });
  }

  // Create session
  req.session.userId = user.id;
  res.redirect('/dashboard');
});
```

## GitHub OAuth

```typescript
// Simplified GitHub OAuth
app.get('/auth/github', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${process.env.GITHUB_REDIRECT_URL}&` +
    `scope=user:email`;

  res.redirect(authUrl);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const { access_token } = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const user = await userResponse.json();

  // Upsert user
  const dbUser = await db.users.findOrCreate({
    where: { githubId: user.id },
    defaults: {
      email: user.email,
      name: user.name,
      githubId: user.id,
      avatar: user.avatar_url
    }
  });

  req.session.userId = dbUser.id;
  res.redirect('/dashboard');
});
```

## Token Management

```typescript
// Store and use tokens securely
async function storeTokens(userId: string, tokens: any) {
  await db.userTokens.create({
    userId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
  });
}

// Refresh expired token
async function getValidToken(userId: string) {
  let tokenData = await db.userTokens.findOne({ userId });

  if (tokenData.expiresAt < new Date()) {
    // Token expired, refresh it
    const newTokens = await oauth2Client.refreshAccessToken(
      tokenData.refreshToken
    );

    await db.userTokens.update(userId, {
      accessToken: newTokens.access_token,
      expiresAt: new Date(Date.now() + newTokens.expires_in * 1000)
    });

    tokenData = await db.userTokens.findOne({ userId });
  }

  return tokenData.accessToken;
}
```

## OpenID Connect

```typescript
// OpenID Connect adds identity layer on top of OAuth 2.0
// Includes ID token with user claims

const idToken = jwt.verify(
  tokens.id_token,
  process.env.GOOGLE_CLIENT_SECRET
);

console.log({
  sub: idToken.sub,      // Subject (user ID)
  email: idToken.email,
  name: idToken.name,
  picture: idToken.picture
});
```

## Security Considerations

```typescript
// Always use HTTPS
// Verify state parameter to prevent CSRF
app.get('/auth/google', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  
  // Store state in session
  req.session.oauth_state = state;

  const authUrl = oauth2Client.generateAuthUrl({
    state,
    access_type: 'offline',
    scope: ['openid', 'email']
  });

  res.redirect(authUrl);
});

app.get('/auth/google/callback', (req, res) => {
  const { state, code } = req.query;

  // Verify state
  if (state !== req.session.oauth_state) {
    return res.status(400).send('Invalid state parameter');
  }

  // Continue with code exchange...
});
```

## Best Practices

✅ **Use HTTPS** - Encrypt in transit
✅ **Verify state** - Prevent CSRF attacks
✅ **Store tokens securely** - Use secure storage
✅ **Refresh tokens** - Use refresh tokens for long-lived access
✅ **Scope minimally** - Request only needed permissions

## Resources

- [OAuth 2.0 Spec](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect](https://openid.net/connect/)
- [Auth0 Documentation](https://auth0.com/docs)
