# Docker Compose

Multi-container application orchestration.

## Basic Setup

```yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  cache:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  db_data:
```

## Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec app npm run migrate

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

## Best Practices

✅ **Volume mapping** - Persist data
✅ **Environment variables** - Configuration
✅ **Depends_on** - Service ordering
✅ **Health checks** - Monitor services
✅ **Networks** - Service communication

## Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
