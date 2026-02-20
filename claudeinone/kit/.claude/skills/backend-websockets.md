# WebSockets

Bidirectional real-time communication between client and server.

## Setup with ws Library

```bash
npm install ws
npm install -D @types/ws  # TypeScript
```

## Basic Server

```javascript
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send message to client
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to server' }));

  // Receive messages from client
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('Received:', message);

      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'broadcast', data: message }));
        }
      });
    } catch (err) {
      console.error('Invalid message:', err);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server listening on port 3000');
});
```

## Browser Client

```javascript
const ws = new WebSocket('ws://localhost:3000');

// Connection opened
ws.onopen = () => {
  console.log('Connected to server');
  ws.send(JSON.stringify({ type: 'greeting', name: 'John' }));
};

// Receive messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);

  if (message.type === 'welcome') {
    console.log(message.message);
  }
};

// Connection closed
ws.onclose = () => {
  console.log('Disconnected from server');
};

// Error handling
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Send message to server
function sendMessage(msg) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'message', text: msg }));
  }
}
```

## With Socket.io (Higher-Level)

```bash
npm install socket.io express
```

```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // Send to specific socket
  socket.emit('welcome', { message: 'Welcome!' });

  // Receive custom event
  socket.on('message', (data) => {
    console.log('Message:', data);

    // Broadcast to all clients
    io.emit('broadcast', {
      from: socket.id,
      text: data.text
    });
  });

  // Receive message from specific room
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.to(room).emit('user-joined', { userId: socket.id });
  });

  socket.on('room-message', (data) => {
    io.to(data.room).emit('new-message', {
      from: socket.id,
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## Socket.io Browser Client

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  socket.on('connect', () => {
    console.log('Connected:', socket.id);
  });

  socket.on('welcome', (data) => {
    console.log(data.message);
  });

  socket.on('broadcast', (data) => {
    console.log(`Message from ${data.from}:`, data.text);
  });

  // Join room
  socket.emit('join-room', 'general');

  // Send room message
  function sendToRoom(room, text) {
    socket.emit('room-message', { room, text });
  }

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
</script>
```

## Chat Application Example

```javascript
// Server
const wss = new WebSocket.Server({ server });
const rooms = new Map(); // roomId -> Set of users

wss.on('connection', (ws) => {
  let currentRoom = null;
  let username = null;

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'join':
        currentRoom = message.room;
        username = message.username;

        if (!rooms.has(currentRoom)) {
          rooms.set(currentRoom, new Set());
        }
        rooms.get(currentRoom).add(ws);

        // Notify others in room
        broadcast(currentRoom, {
          type: 'user-joined',
          username: username,
          usersInRoom: rooms.get(currentRoom).size
        });
        break;

      case 'chat':
        broadcast(currentRoom, {
          type: 'message',
          username: username,
          text: message.text,
          timestamp: new Date().toISOString()
        });
        break;

      case 'typing':
        broadcast(currentRoom, {
          type: 'user-typing',
          username: username
        }, ws);
        break;
    }
  });

  ws.on('close', () => {
    if (currentRoom) {
      rooms.get(currentRoom).delete(ws);
      broadcast(currentRoom, {
        type: 'user-left',
        username: username,
        usersInRoom: rooms.get(currentRoom).size
      });
    }
  });
});

function broadcast(room, message, exclude = null) {
  const clients = rooms.get(room) || new Set();
  const data = JSON.stringify(message);

  clients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
```

## With TypeScript

```typescript
import WebSocket from 'ws';

interface Message {
  type: string;
  [key: string]: any;
}

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: string) => {
    try {
      const message: Message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (err) {
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

function handleMessage(ws: WebSocket, message: Message): void {
  switch (message.type) {
    case 'echo':
      ws.send(JSON.stringify({ type: 'echo', data: message.data }));
      break;
  }
}
```

## Pub/Sub Pattern

```javascript
const EventEmitter = require('events');
const pubsub = new EventEmitter();

wss.on('connection', (ws) => {
  const subscriptions = new Set();

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'subscribe') {
      subscriptions.add(message.topic);

      // Subscribe to events
      const handler = (data) => {
        ws.send(JSON.stringify({
          type: 'message',
          topic: message.topic,
          data
        }));
      };

      pubsub.on(message.topic, handler);

      // Store handler for unsubscribe
      ws.handlers = ws.handlers || new Map();
      ws.handlers.set(message.topic, handler);
    }

    if (message.type === 'publish') {
      pubsub.emit(message.topic, message.data);
    }
  });

  ws.on('close', () => {
    subscriptions.forEach((topic) => {
      const handler = ws.handlers.get(topic);
      pubsub.off(topic, handler);
    });
  });
});
```

## Best Practices

✅ **Handle disconnections** - Client can lose connection any time
✅ **Send heartbeats** - Keep connection alive with ping/pong frames
✅ **Validate messages** - Never trust client data
✅ **Use acknowledgments** - Wait for client confirmation for important messages
✅ **Implement reconnection** - Auto-reconnect with exponential backoff
✅ **Scale with Redis** - For multiple servers, use Redis pub/sub
✅ **Rate limiting** - Prevent spam from clients

## Scaling with Redis

```javascript
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const redisClient = redis.createClient();
const pubClient = redisClient.duplicate();

io.adapter(createAdapter(pubClient, pubClient));
```

## Performance Considerations

- Binary data: Use `binaryType: 'arraybuffer'` for efficient binary transmission
- Message batching: Send multiple updates in one message
- Compression: Enable permessage-deflate in production
- Connection pooling: Limit max connections per IP
- Memory management: Clean up abandoned connections

## Common Use Cases

✅ Real-time chat applications
✅ Live notifications
✅ Collaborative editing (Figma, Google Docs style)
✅ Live dashboards and monitoring
✅ Multiplayer games
✅ Stock price updates
✅ Live video streams (metadata)

## When NOT to Use WebSockets

❌ Simple one-time requests (use HTTP instead)
❌ Large file transfers (use streaming APIs)
❌ When HTTP polling is sufficient
❌ Browser compatibility needed with old browsers

## Resources

- [WebSocket Standard](https://html.spec.whatwg.org/multipage/web-sockets.html)
- [ws Library](https://github.com/websockets/ws)
- [Socket.io](https://socket.io/)
- [Socket.io Documentation](https://socket.io/docs/)
