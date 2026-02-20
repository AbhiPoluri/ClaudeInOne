# Secrets Management

Secure storage and retrieval of API keys, credentials, and tokens.

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost/db
API_KEY=sk-1234567890
STRIPE_SECRET=sk_live_...

# .env.production
DATABASE_URL=${DB_PROD_URL}
API_KEY=${API_KEY_PROD}
```

```typescript
// next.config.ts - expose public vars
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};
```

## AWS Secrets Manager

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(secretName: string) {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    
    return response.SecretString ? JSON.parse(response.SecretString) : response.SecretBinary;
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

// Usage
const dbCredentials = await getSecret('prod/database');
```

## HashiCorp Vault

```typescript
import * as Vault from 'node-vault';

const vault = new Vault({
  endpoint: 'http://localhost:8200',
  token: process.env.VAULT_TOKEN
});

// Read secret
const secret = await vault.read('secret/data/prod/database');
console.log(secret.data.data.username);

// Write secret
await vault.write('secret/data/prod/api-key', {
  data: {
    key: 'sk-1234567890',
    name: 'production-key'
  }
});

// Create dynamic database credentials
const creds = await vault.read('database/creds/my-role');
console.log(creds.data.username, creds.data.password);
```

## Sealed Secrets (Kubernetes)

```yaml
# Install Sealed Secrets
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.18.0/controller.yaml

# Seal a secret
echo -n mypassword | kubectl create secret generic mysecret --dry-run=client --from-file=password=/dev/stdin -o yaml | kubeseal -f -

# Apply sealed secret
kubectl apply -f my-sealed-secret.yaml
```

```bash
#!/bin/bash
# Script to rotate secrets
for secret in $(vault list secret/metadata/prod); do
  echo "Rotating $secret"
  vault write "secret/data/prod/$secret" @"./new-${secret}.json"
done
```

## Node.js dotenv

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Access variables
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// Type-safe config
interface Config {
  database: {
    url: string;
  };
  api: {
    key: string;
  };
}

const config: Config = {
  database: {
    url: process.env.DATABASE_URL!
  },
  api: {
    key: process.env.API_KEY!
  }
};

export default config;
```

## GitHub Secrets

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
        run: npm run deploy
```

## Best Practices

✅ **Never commit secrets** - Use .gitignore
✅ **Rotate regularly** - Change keys periodically
✅ **Least privilege** - Grant minimal access
✅ **Audit access** - Log who accessed what
✅ **Separate by environment** - Dev, staging, prod keys

## Resources

- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
