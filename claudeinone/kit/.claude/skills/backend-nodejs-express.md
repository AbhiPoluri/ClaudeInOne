# Node.js Express Server

Fast, unopinionated web application framework.

## Setup

```bash
npm install express dotenv cors
npm install -D nodemon
```

## Basic Server

```typescript
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await db.users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await db.users.create({ email, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Routing

```typescript
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  const users = await db.users.find();
  res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

userRouter.post('/', async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

userRouter.patch('/:id', async (req, res) => {
  const user = await db.users.update(req.params.id, req.body);
  res.json(user);
});

userRouter.delete('/:id', async (req, res) => {
  await db.users.delete(req.params.id);
  res.status(204).send();
});

app.use('/api/users', userRouter);
```

## Middleware

```typescript
// Authentication middleware
const authenticate = (req: any, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);

// Protected route
app.get('/api/protected', authenticate, (req: any, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

## Best Practices

✅ **Structure** - Separate routes, controllers, services
✅ **Error handling** - Global error handler
✅ **Validation** - Validate input data
✅ **Logging** - Log requests and errors
✅ **Security** - CORS, rate limiting, input sanitization

## Resources

- [Express Documentation](https://expressjs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
