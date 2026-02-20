# Node.js

JavaScript runtime for building scalable backend services with async/await and event-driven architecture.

## Event Loop & Async Model

Node.js uses a non-blocking, event-driven architecture:
- **Single-threaded**: Executes JavaScript in a single thread
- **Non-blocking I/O**: File/network operations don't block execution
- **Callbacks/Promises/Async-Await**: Handle asynchronous operations
- **libuv**: Handles actual async work with thread pool

### Async Patterns

```javascript
// Callbacks (avoid - callback hell)
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promises (better)
fs.promises.readFile('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async-Await (best - looks synchronous)
async function readFile() {
  try {
    const data = await fs.promises.readFile('file.txt');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

## Core Modules

### HTTP Server
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
```

### File System
```javascript
const fs = require('fs').promises;

// Read file
const content = await fs.readFile('file.txt', 'utf-8');

// Write file
await fs.writeFile('file.txt', 'content');

// List files
const files = await fs.readdir('.');
```

### Streams (for large data)
```javascript
// Read file in chunks
const readStream = fs.createReadStream('large-file.txt');
readStream.on('data', chunk => {
  console.log(`Chunk size: ${chunk.length}`);
});

// Pipe (chain streams)
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
```

## Best Practices

1. **Error Handling**
   - Always catch promise rejections
   - Use try-catch in async functions
   - Handle uncaught exceptions at app level

2. **Performance**
   - Use async operations, never block event loop
   - Cache expensive operations
   - Use clustering for CPU-bound work
   - Monitor event loop lag

3. **Security**
   - Validate all input
   - Use environment variables for secrets
   - Implement rate limiting
   - Use HTTPS in production
   - Keep dependencies updated

4. **Memory Management**
   - Avoid memory leaks (remove event listeners)
   - Monitor heap usage
   - Use streams for large files/data
   - Be careful with circular references

## Environment

```javascript
// Access environment variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

// .env file (use dotenv package)
require('dotenv').config();
```

## Clustering

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // Fork worker processes
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  require('./server.js').start();
}
```

## Resources

- [Node.js Official Docs](https://nodejs.org/docs)
- [Event Loop Guide](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Streams Documentation](https://nodejs.org/api/stream.html)
