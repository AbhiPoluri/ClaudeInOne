# Real-Time Subscriptions

WebSockets and GraphQL subscriptions for live updates.

## WebSockets

```typescript
import { WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  const clientId = crypto.randomUUID();
  clients.set(clientId, ws);

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'subscribe':
        // Subscribe to updates
        handleSubscribe(clientId, data.channel);
        break;
      case 'message':
        // Broadcast to all connected clients
        broadcast(data);
        break;
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
  });
});

function broadcast(message: any) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleSubscribe(clientId: string, channel: string) {
  const client = clients.get(clientId);
  if (client) {
    client.send(JSON.stringify({
      type: 'subscribed',
      channel
    }));
  }
}

server.listen(3000);
```

## Socket.io with Rooms

```typescript
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  // Send message to room
  socket.on('message', (data) => {
    io.to(`conversation:${data.conversationId}`).emit('new-message', {
      userId: socket.id,
      ...data
    });
  });

  // Leave room
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000);
```

## GraphQL Subscriptions

```typescript
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Subscription {
    messageAdded(conversationId: ID!): Message!
    userStatusChanged: User!
  }
`;

const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: (_, { conversationId }) => {
        return pubSub.asyncIterator([`MESSAGE_ADDED_${conversationId}`]);
      }
    },
    userStatusChanged: {
      subscribe: () => {
        return pubSub.asyncIterator(['USER_STATUS_CHANGED']);
      }
    }
  }
};

// Publish events
import { PubSub } from 'apollo-server';

const pubSub = new PubSub();

async function createMessage(conversationId: string, message: any) {
  const newMessage = await db.messages.create(message);

  pubSub.publish(`MESSAGE_ADDED_${conversationId}`, {
    messageAdded: newMessage
  });

  return newMessage;
}

async function updateUserStatus(userId: string, status: string) {
  const user = await db.users.update(userId, { status });

  pubSub.publish('USER_STATUS_CHANGED', {
    userStatusChanged: user
  });

  return user;
}
```

## React Hook for Subscriptions

```typescript
import { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($conversationId: ID!) {
    messageAdded(conversationId: $conversationId) {
      id
      content
      sender {
        id
        name
      }
      createdAt
    }
  }
`;

export function useConversationMessages(conversationId: string) {
  const { data, error, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { conversationId }
  });

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (data?.messageAdded) {
      setMessages(prev => [...prev, data.messageAdded]);
    }
  }, [data]);

  return { messages, loading, error };
}

// Usage
export function ConversationView({ conversationId }: any) {
  const { messages } = useConversationMessages(conversationId);

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.sender.name}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

✅ **Heartbeat** - Send ping/pong to detect disconnects
✅ **Reconnection** - Auto-reconnect with exponential backoff
✅ **Room management** - Use rooms for efficient broadcasting
✅ **Message compression** - Reduce bandwidth usage
✅ **Error handling** - Graceful degradation

## Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
