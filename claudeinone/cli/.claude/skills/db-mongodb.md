# MongoDB

NoSQL document database for flexible schema design.

## Setup

```bash
npm install mongodb
```

## Connection

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db('myapp');
    const collection = db.collection('users');
    
    // Perform operations
  } finally {
    await client.close();
  }
}

main();
```

## CRUD Operations

```typescript
const collection = db.collection('users');

// Create
await collection.insertOne({
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date()
});

// Insert multiple
await collection.insertMany([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' }
]);

// Read
const user = await collection.findOne({ email: 'user@example.com' });

// Read multiple
const users = await collection.find({ role: 'admin' }).toArray();

// Update
await collection.updateOne(
  { _id: userId },
  { $set: { name: 'Jane Doe' } }
);

// Update multiple
await collection.updateMany(
  { role: 'user' },
  { $set: { status: 'active' } }
);

// Delete
await collection.deleteOne({ _id: userId });

// Delete multiple
await collection.deleteMany({ status: 'inactive' });
```

## Queries

```typescript
// Filter
const activeUsers = await collection
  .find({ status: 'active' })
  .toArray();

// Comparison operators
const adults = await collection
  .find({ age: { $gte: 18 } })
  .toArray();

// Logical operators
const users = await collection
  .find({
    $or: [
      { role: 'admin' },
      { verified: true }
    ]
  })
  .toArray();

// Text search
await collection.createIndex({ name: 'text' });
const results = await collection
  .find({ $text: { $search: 'john' } })
  .toArray();

// Aggregation
const pipeline = [
  { $match: { status: 'active' } },
  { $group: { _id: '$role', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
];

const results = await collection.aggregate(pipeline).toArray();
```

## Transactions

```typescript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');

    // Both operations succeed or both fail
    await usersCollection.updateOne(
      { _id: user1Id },
      { $inc: { balance: -100 } },
      { session }
    );

    await usersCollection.updateOne(
      { _id: user2Id },
      { $inc: { balance: 100 } },
      { session }
    );
  });
} finally {
  await session.endSession();
}
```

## Indexes

```typescript
// Single field index
await collection.createIndex({ email: 1 });

// Composite index
await collection.createIndex({ role: 1, createdAt: -1 });

// Text index
await collection.createIndex({ name: 'text', description: 'text' });

// Unique index
await collection.createIndex({ email: 1 }, { unique: true });

// List indexes
const indexes = await collection.listIndexes().toArray();

// Drop index
await collection.dropIndex('email_1');
```

## Validation

```typescript
// Schema validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        name: { bsonType: 'string' },
        age: { bsonType: 'int', minimum: 0 }
      }
    }
  }
});
```

## Best Practices

✅ **Use ObjectId** - MongoDB's built-in unique ID
✅ **Index frequently queried fields** - Improve query performance
✅ **Validate schema** - Enforce data structure
✅ **Use transactions** - Multi-document consistency
✅ **Pagination** - Use skip/limit for large results

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Driver](https://docs.mongodb.com/drivers/node/)
