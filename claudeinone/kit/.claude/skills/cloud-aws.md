# AWS

Cloud platform with EC2, S3, Lambda, DynamoDB, and RDS.

## Lambda Functions

```typescript
// Basic handler
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda' })
  };
};

// API Gateway integration
export const apiHandler = async (event: APIGatewayProxyEvent) => {
  const { pathParameters, body } = event;
  const data = JSON.parse(body || '{}');
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  };
};

// S3 event trigger
export const s3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    console.log(`Processing ${bucket}/${key}`);
  }
};
```

## S3 Storage

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-1' });

// Upload
await s3.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.txt',
  Body: Buffer.from('content'),
  ContentType: 'text/plain'
}));

// Download
const response = await s3.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.txt'
}));

const body = await response.Body?.transformToString();
```

## DynamoDB

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Write
await db.send(new PutCommand({
  TableName: 'Users',
  Item: {
    userId: 'user-123',
    email: 'user@example.com',
    createdAt: Date.now()
  }
}));

// Query
const { Items } = await db.send(new QueryCommand({
  TableName: 'Users',
  KeyConditionExpression: 'userId = :id',
  ExpressionAttributeValues: { ':id': 'user-123' }
}));
```

## RDS (Relational Database)

```typescript
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const [rows] = await connection.execute(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

await connection.execute(
  'INSERT INTO users (email, name) VALUES (?, ?)',
  [email, name]
);
```

## IAM & Secrets

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secrets = new SecretsManagerClient({});

const { SecretString } = await secrets.send(new GetSecretValueCommand({
  SecretId: 'my-secret'
}));

const secret = JSON.parse(SecretString || '{}');
```

## CloudFormation

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  MyTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: my-table
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH

  MyLambda:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: my-function
      Runtime: nodejs20.x
      Handler: index.handler
      Code:
        ZipFile: |
          exports.handler = async () => ({ statusCode: 200 });
```

## Best Practices

✅ **Use SDK v3** - Modular imports reduce bundle size
✅ **Connection pooling** - Reuse connections for RDS
✅ **IAM roles** - Least privilege permissions
✅ **Environment variables** - Store config in AWS Systems Manager
✅ **CloudWatch logs** - Monitor function execution

## Resources

- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
- [Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
