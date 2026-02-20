# gRPC

High-performance RPC framework using Protocol Buffers for efficient binary serialization.

## Setup

```bash
npm install @grpc/grpc-js @grpc/proto-loader

# Or with TypeScript
npm install -D typescript ts-node
npm install @grpc/grpc-js @grpc/proto-loader
```

## Protocol Buffer Definition (.proto)

```protobuf
syntax = "proto3";

package user;

message User {
  int32 id = 1;
  string email = 2;
  string name = 3;
  int64 created_at = 4;
}

message GetUserRequest {
  int32 id = 1;
}

message CreateUserRequest {
  string email = 1;
  string name = 2;
}

message Empty {}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc CreateUser(CreateUserRequest) returns (User);
  rpc ListUsers(Empty) returns (stream User);
  rpc DeleteUser(GetUserRequest) returns (Empty);
}
```

## Server Implementation

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load .proto file
const packageDef = protoLoader.loadSync(path.join(__dirname, 'user.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDef);
const userService = userProto.user.UserService;

// In-memory user database (use real DB in production)
const users = new Map();
let userIdCounter = 1;

// Service implementation
const userServiceImpl = {
  getUser: (call, callback) => {
    const user = users.get(call.request.id);
    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found'
      });
    }
    callback(null, user);
  },

  createUser: (call, callback) => {
    const user = {
      id: userIdCounter++,
      email: call.request.email,
      name: call.request.name,
      created_at: Date.now()
    };
    users.set(user.id, user);
    callback(null, user);
  },

  listUsers: (call) => {
    // Stream all users
    for (const user of users.values()) {
      call.write(user);
    }
    call.end();
  },

  deleteUser: (call, callback) => {
    const deleted = users.delete(call.request.id);
    if (!deleted) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found'
      });
    }
    callback(null, {});
  }
};

// Create and start server
const server = new grpc.Server();
server.addService(userService.service, userServiceImpl);

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`gRPC server listening on port ${PORT}`);
  server.start();
});
```

## Client Implementation

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto
const packageDef = protoLoader.loadSync(path.join(__dirname, 'user.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true
});

const userProto = grpc.loadPackageDefinition(packageDef);
const UserService = userProto.user.UserService;

// Create client
const client = new UserService('localhost:50051', grpc.credentials.createInsecure());

// Get single user
client.getUser({ id: 1 }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('User:', response);
  }
});

// Create user
client.createUser({ email: 'john@example.com', name: 'John' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Created:', response);
  }
});

// Stream users
const stream = client.listUsers({});
stream.on('data', (user) => {
  console.log('User:', user);
});
stream.on('error', (err) => {
  console.error('Stream error:', err.message);
});
stream.on('end', () => {
  console.log('Stream ended');
});

// Delete user
client.deleteUser({ id: 1 }, (err) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Deleted');
  }
});
```

## TypeScript Support

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

interface User {
  id: number;
  email: string;
  name: string;
  created_at: number;
}

interface GetUserRequest {
  id: number;
}

// Type-safe service definition
const UserServiceDef: grpc.ServiceDefinition = {
  getUser: {
    path: '/user.UserService/GetUser',
    requestStream: false,
    responseStream: false,
    requestSerialize: (obj: GetUserRequest) => Buffer.from(JSON.stringify(obj)),
    requestDeserialize: (buf: Buffer) => JSON.parse(buf.toString()),
    responseSerialize: (obj: User) => Buffer.from(JSON.stringify(obj)),
    responseDeserialize: (buf: Buffer) => JSON.parse(buf.toString())
  }
};

const server = new grpc.Server();
server.addService(UserServiceDef, {
  getUser: (call: grpc.ServerUnaryCall<GetUserRequest, User>, callback: grpc.sendUnaryData<User>) => {
    const user: User = {
      id: call.request.id,
      email: 'user@example.com',
      name: 'John Doe',
      created_at: Date.now()
    };
    callback(null, user);
  }
});
```

## Error Handling

```javascript
const handleError = (call, error) => {
  call.emit('error', {
    code: grpc.status.INTERNAL,
    message: error.message
  });
};

const userServiceImpl = {
  getUser: (call, callback) => {
    try {
      const user = users.get(call.request.id);
      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found',
          details: `No user with ID ${call.request.id}`
        });
      }
      callback(null, user);
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }
};
```

## Bidirectional Streaming

```protobuf
service ChatService {
  rpc Chat(stream Message) returns (stream Message);
}

message Message {
  string user = 1;
  string text = 2;
  int64 timestamp = 3;
}
```

```javascript
const chatServiceImpl = {
  chat: (call) => {
    call.on('data', (message) => {
      console.log(`${message.user}: ${message.text}`);

      // Echo back to client
      call.write({
        user: 'Server',
        text: `Echo: ${message.text}`,
        timestamp: Date.now()
      });
    });

    call.on('end', () => {
      call.end();
    });

    call.on('error', (err) => {
      console.error('Stream error:', err);
    });
  }
};
```

## Metadata and Context

```javascript
// Server: Access metadata
const userServiceImpl = {
  getUser: (call, callback) => {
    const metadata = call.metadata.getMap();
    const authToken = metadata['authorization'];

    if (!authToken) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Missing authorization'
      });
    }

    // Process request
    callback(null, user);
  }
};

// Client: Send metadata
const metadata = new grpc.Metadata();
metadata.add('authorization', 'Bearer token123');

client.getUser({ id: 1 }, metadata, (err, response) => {
  console.log(response);
});
```

## Best Practices

✅ **Use Protocol Buffers** - Efficient, versioning-friendly serialization
✅ **Stream for large data** - Don't send huge responses in single RPC
✅ **Implement deadlines** - Set timeout contexts for requests
✅ **Use interceptors** - Logging, authentication, rate limiting
✅ **Error codes** - Use appropriate gRPC error codes
✅ **Connection pooling** - Reuse client connections
✅ **Health checks** - Implement gRPC health checking protocol

## Interceptors

```javascript
const loggingInterceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
    start: (metadata, listener, next) => {
      console.log(`RPC: ${options.method_definition.path}`);
      next(metadata, listener);
    }
  });
};

const client = new UserService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
  { interceptors: [loggingInterceptor] }
);
```

## When to Use gRPC

✅ Microservices communication
✅ Real-time bidirectional streaming
✅ High-performance APIs
✅ Mobile backends (reduced bandwidth)
✅ Internal services (not public APIs)

❌ Browser clients (use gRPC-Web)
❌ Simple REST APIs
❌ Legacy systems requiring HTTP/1.1

## Resources

- [gRPC Documentation](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
- [gRPC Node.js](https://grpc.io/docs/languages/node/)
- [gRPC Status Codes](https://grpc.io/docs/guides/status-codes/)
