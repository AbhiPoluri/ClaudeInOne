# Render

Simple cloud platform with generous free tier.

## Deployment

```bash
# Connect to GitHub
# Create render.yaml in root

# Or use Render dashboard to connect repo
```

## render.yaml

```yaml
services:
  - type: web
    name: api
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: service
        value: ${{ database.DATABASE_URL }}
    
  - type: pserv
    name: database
    env: postgres
    plan: free
    ipAllowList: []
    envVars:
      - key: POSTGRES_USER
        value: user
      - key: POSTGRES_PASSWORD
        generateValue: true
```

## Deployment Workflow

```bash
# Push to GitHub
git push origin main

# Render automatically deploys
# No additional commands needed
```

## Environment Variables

```bash
# Set via Render dashboard
# Or use render.yaml with generateValue: true
```

## Best Practices

✅ **Free tier** - Adequate for small projects
✅ **Auto-deploy** - Git integration
✅ **Database included** - PostgreSQL built-in
✅ **Easy scaling** - Upgrade instance type
✅ **Cron jobs** - Background tasks

## Resources

- [Render Docs](https://render.com/docs)
- [Pricing](https://render.com/pricing)
