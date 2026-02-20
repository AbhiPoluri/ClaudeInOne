# Railway

Simple cloud platform for deploying full-stack applications.

## Setup & Deployment

```bash
npm install -g @railway/cli
railway login
railway init
```

## railway.json Configuration

```json
{
  "name": "my-app",
  "services": {
    "api": {
      "buildCommand": "npm run build",
      "startCommand": "npm start",
      "environment": {
        "NODE_ENV": "production",
        "DATABASE_URL": "${{ database.DATABASE_URL }}"
      }
    },
    "database": {
      "image": "postgres:15",
      "environment": {
        "POSTGRES_PASSWORD": "${{ POSTGRES_PASSWORD }}"
      }
    }
  }
}
```

## Deployment

```bash
# Deploy application
railway up

# View logs
railway logs

# Check status
railway status

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables get DATABASE_URL
```

## Database Integration

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function getUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}
```

## Environment Management

```bash
# Development
railway env dev
railway up --environment dev

# Production
railway env prod
railway up --environment prod
```

## Best Practices

✅ **Simple deployments** - Just git push
✅ **Built-in databases** - PostgreSQL, MongoDB, Redis
✅ **Environment separation** - Dev/prod isolation
✅ **Database backups** - Automatic backups included
✅ **Custom domains** - Easy domain setup

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Pricing & Limits](https://railway.app/pricing)
