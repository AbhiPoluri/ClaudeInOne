# Fly.io

## Overview
Fly.io runs Docker containers globally across 30+ regions with anycast networking and built-in scaling.

## Installation

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
fly launch  # creates fly.toml and Dockerfile
```

## fly.toml

```toml
app = "my-app"
primary_region = "sjc"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

## Next.js Dockerfile

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Secrets & Deploy

```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set NEXTAUTH_SECRET="..."

fly deploy

# Logs
fly logs --app my-app

# Scale
fly scale count 2 --region sjc
```

## Managed Postgres

```bash
fly postgres create --name my-db --region sjc
fly postgres attach my-db --app my-app  # sets DATABASE_URL automatically
```

## Best Practices
- Use `auto_stop_machines = true` for dev apps (scale to zero)
- Set `min_machines_running = 1` for production (avoid cold starts)
- Store secrets with `fly secrets set`, never in fly.toml
- Use Fly volumes for SQLite or file uploads

## Resources
- [Fly.io docs](https://fly.io/docs)
- [Deploy Next.js on Fly](https://fly.io/docs/js/frameworks/nextjs/)
