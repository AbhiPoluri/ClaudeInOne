# DynamoDB

## Overview
AWS DynamoDB is a fully managed NoSQL database optimized for high-scale, predictable-latency workloads.

## Setup

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const db = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE!;
```

## CRUD Operations

```typescript
// Create
await db.send(new PutCommand({
  TableName: TABLE,
  Item: { PK: `USER#${user.id}`, SK: `PROFILE#${user.id}`, ...user, createdAt: new Date().toISOString() },
  ConditionExpression: 'attribute_not_exists(PK)',
}));

// Read
const result = await db.send(new GetCommand({
  TableName: TABLE,
  Key: { PK: `USER#${id}`, SK: `PROFILE#${id}` }
}));
const user = result.Item;

// Update
await db.send(new UpdateCommand({
  TableName: TABLE,
  Key: { PK: `USER#${id}`, SK: `PROFILE#${id}` },
  UpdateExpression: 'SET #name = :name, updatedAt = :now',
  ExpressionAttributeNames: { '#name': 'name' },
  ExpressionAttributeValues: { ':name': newName, ':now': new Date().toISOString() }
}));

// Delete
await db.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `USER#${id}`, SK: `PROFILE#${id}` } }));
```

## Query Pattern

```typescript
// Get all orders for a user
const result = await db.send(new QueryCommand({
  TableName: TABLE,
  KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
  ExpressionAttributeValues: { ':pk': `USER#${userId}`, ':prefix': 'ORDER#' },
  ScanIndexForward: false, // newest first
  Limit: 20,
}));
const orders = result.Items ?? [];
```

## Single-Table Design

```
PK              | SK                 | Type
USER#u1         | PROFILE#u1         | User profile
USER#u1         | ORDER#2024-01#o1   | Order (date-sortable)
PRODUCT#p1      | METADATA#p1        | Product
ORDER#o1        | ITEM#1             | Order line item
```

## Best Practices
- Design for access patterns first — DynamoDB doesn't support ad-hoc queries
- Use single-table design to minimize RCUs/WCUs
- Never scan large tables — always query with a partition key
- Use TTL attribute for automatic expiry (sessions, caches)

## Resources
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [The DynamoDB Book](https://www.dynamodbbook.com/)
