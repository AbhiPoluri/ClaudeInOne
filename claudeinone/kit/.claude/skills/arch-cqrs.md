# CQRS (Command Query Responsibility Segregation)

Separate read and write models for scalability and clarity.

## Basic CQRS Pattern

```typescript
// Command: modifies state
interface Command {
  execute(): Promise<void>;
}

class CreateUserCommand implements Command {
  constructor(private userData: CreateUserInput) {}

  async execute() {
    const user = new User(this.userData);
    await userRepository.save(user);
    
    // Publish event for read model update
    eventBus.publish('UserCreated', user);
  }
}

// Query: reads state
interface Query<T> {
  execute(): Promise<T>;
}

class GetUserQuery implements Query<UserDTO> {
  constructor(private userId: string) {}

  async execute(): Promise<UserDTO> {
    // Read from optimized read model
    return userReadModel.findById(this.userId);
  }
}

// Command Handler
class CommandBus {
  async execute(command: Command) {
    return command.execute();
  }
}

// Query Handler
class QueryBus {
  async execute<T>(query: Query<T>): Promise<T> {
    return query.execute();
  }
}
```

## Separate Read/Write Models

```typescript
// Write Model (normalized, consistent)
interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

// Read Model (denormalized, optimized)
interface UserReadModel {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: Date;
  post_count: number;      // Denormalized
  follower_count: number;  // Denormalized
}

// Commands update write model
async function createUser(data: CreateUserInput) {
  const user = await db('users').insert(data);
  eventBus.emit('user:created', user);
}

// Events update read model
eventBus.on('user:created', async (user) => {
  // Hydrate read model with denormalized data
  await readModelDb('users').insert({
    id: user.id,
    email: user.email,
    display_name: user.email.split('@')[0],
    post_count: 0,
    follower_count: 0
  });
});

eventBus.on('post:created', async (post) => {
  // Update denormalized post_count
  await readModelDb('users')
    .where('id', post.user_id)
    .increment('post_count', 1);
});
```

## Projections

```typescript
// Projection: builds read model from events
class UserProjection {
  async handle(event: DomainEvent) {
    switch (event.type) {
      case 'UserCreated':
        await this.onUserCreated(event);
        break;
      case 'UserProfileUpdated':
        await this.onUserProfileUpdated(event);
        break;
      case 'UserFollowedUser':
        await this.onUserFollowedUser(event);
        break;
    }
  }

  private async onUserCreated(event: any) {
    await readModel.insert({
      id: event.data.id,
      email: event.data.email,
      follower_count: 0,
      following_count: 0
    });
  }

  private async onUserFollowedUser(event: any) {
    await readModel
      .where('id', event.data.followerId)
      .increment('following_count', 1);

    await readModel
      .where('id', event.data.followedId)
      .increment('follower_count', 1);
  }
}

// Replay events
async function rebuildReadModel() {
  const events = await eventStore.getAll();
  const projection = new UserProjection();

  for (const event of events) {
    await projection.handle(event);
  }
}
```

## API Layer

```typescript
// Routes use Command/Query buses
app.post('/users', async (req, res) => {
  const command = new CreateUserCommand(req.body);
  const user = await commandBus.execute(command);
  res.json(user);
});

app.get('/users/:id', async (req, res) => {
  const query = new GetUserQuery(req.params.id);
  const user = await queryBus.execute(query);
  res.json(user);
});

app.get('/users/:id/posts', async (req, res) => {
  // Query read model directly (optimized)
  const posts = await readModel.query()
    .where('user_id', req.params.id)
    .orderBy('created_at', 'desc');
  res.json(posts);
});
```

## Consistency Handling

```typescript
// Handling eventual consistency

async function getUserWithRetry(userId: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const user = await readModel.findById(userId);
    if (user) return user;
    
    // Exponential backoff
    await sleep(Math.pow(2, i) * 100);
  }

  throw new Error(`User ${userId} not found after retries`);
}

// Version tracking
interface VersionedEntity {
  id: string;
  version: number;
  data: any;
}

// Client provides expected version
app.patch('/users/:id', async (req, res) => {
  const { version, ...data } = req.body;
  
  const current = await readModel.findById(req.params.id);
  
  if (current.version !== version) {
    return res.status(409).json({ 
      error: 'Conflict: resource has been modified' 
    });
  }

  await commandBus.execute(new UpdateUserCommand(req.params.id, data));
  res.json({ ok: true });
});
```

## Best Practices

✅ **Separate databases** - Use different DBs for read/write models
✅ **Event versioning** - Handle schema changes
✅ **Projection rebuilding** - Replay events to fix read model
✅ **Consistency guarantees** - Document eventual consistency window
✅ **Monitoring** - Track event processing lag

## Resources

- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
