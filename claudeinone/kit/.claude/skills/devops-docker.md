# Docker

Containerization platform for packaging applications with dependencies.

## Dockerfile Basics

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

## Build and Run

```bash
# Build image
docker build -t myapp:1.0 .

# Run container
docker run -p 3000:3000 myapp:1.0

# Run with environment variables
docker run -e DATABASE_URL=postgres://localhost:5432/db myapp:1.0

# Run in background
docker run -d --name myapp-prod -p 80:3000 myapp:1.0

# View logs
docker logs myapp-prod

# Stop container
docker stop myapp-prod
```

## Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

## Best Practices

✅ **Multi-stage builds** - Reduce image size
✅ **Use .dockerignore** - Exclude unnecessary files
✅ **.env for secrets** - Never hardcode credentials
✅ **Layer caching** - Order commands efficiently
✅ **Health checks** - Monitor container health

## Resources

- [Docker Docs](https://docs.docker.com/)
- [Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
