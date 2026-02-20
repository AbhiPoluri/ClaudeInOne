# Express.js

Minimalist, unopinionated Node.js web framework for building APIs and web applications.

## Basic Setup

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.static('public')); // Serve static files
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/users', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ id: 1, name });
});

app.listen(3000, () => console.log('Server running on :3000'));
```

## Middleware & Routing

### Middleware Chain
```javascript
// Execute in order
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(authenticateToken);
app.use('/api', apiRoutes);
```

### Router Pattern
```javascript
const router = express.Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id });
});

router.post('/', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

module.exports = router;

// Use in app
app.use('/users', require('./routes/users'));
```

## Request/Response Handling

```javascript
// Request - access data
app.post('/users', (req, res) => {
  const { name } = req.body;              // Parse JSON
  const { page } = req.query;             // Query params
  const { id } = req.params;              // Route params
  const token = req.get('authorization'); // Headers
  
  // Response
  res.status(201)
    .set('Content-Type', 'application/json')
    .json({ id: 1, name });
});
```

## Error Handling

```javascript
// Try-catch in async routes
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.user.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err); // Pass to error handler
  }
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Useful Middleware

```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Form data
```

## Best Practices

1. **Structure**: Separate routes, controllers, services, models
2. **Validation**: Validate request data before processing
3. **Error Handling**: Handle errors consistently
4. **Logging**: Log important events for debugging
5. **Security**: Use helmet, validate input, sanitize data
6. **Performance**: Use async/await, cache where appropriate
7. **Testing**: Write unit and integration tests

## Resources

- [Express Official Docs](https://expressjs.com/)
- [RESTful API Design](https://restfulapi.net/)
