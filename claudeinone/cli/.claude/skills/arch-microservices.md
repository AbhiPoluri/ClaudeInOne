# Microservices Architecture

Decompose applications into small, independent services communicating via APIs.

## Service Definition

```typescript
// User Service
export interface IUserService {
  getUser(id: string): Promise<User>;
  createUser(data: CreateUserInput): Promise<User>;
  updateUser(id: string, data: UpdateUserInput): Promise<User>;
}

// Post Service
export interface IPostService {
  getPost(id: string): Promise<Post>;
  getUserPosts(userId: string): Promise<Post[]>;
  createPost(data: CreatePostInput): Promise<Post>;
}
```

## Inter-Service Communication

```typescript
// HTTP/REST
const user = await fetch('http://user-service/api/users/123')
  .then(r => r.json());

// gRPC (efficient binary protocol)
const user = await userServiceClient.getUser({ id: '123' });

// Message Queue (async)
await messageQueue.publish('user-updated', { userId: '123' });
```

## API Gateway

```typescript
// Centralized entry point
const gateway = express();

gateway.use('/users', userServiceProxy);
gateway.use('/posts', postServiceProxy);
gateway.use('/comments', commentServiceProxy);

// Handle cross-service calls
gateway.get('/users/:id/posts', async (req, res) => {
  const user = await getUserService(req.params.id);
  const posts = await getPostService(user.id);
  res.json({ user, posts });
});
```

## Service Discovery

```yaml
# Kubernetes automatically discovers services
# Service DNS: <service-name>.<namespace>.svc.cluster.local

# Docker Compose
services:
  user-service:
    container_name: user-service
    # Other services access via: http://user-service:3000
```

## Best Practices

✅ **Bounded contexts** - Clear service boundaries
✅ **Database per service** - Data independence
✅ **Async communication** - Use message queues
✅ **Service discovery** - Dynamic registration
✅ **Health checks** - Monitor service health
✅ **Logging aggregation** - Centralized logs

## Resources

- [Microservices Patterns](https://microservices.io/patterns/)
- [12 Factor App](https://12factor.net/)
