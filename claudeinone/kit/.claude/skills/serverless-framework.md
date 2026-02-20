# Serverless Framework

Framework for building and deploying serverless applications across AWS, Azure, GCP, and Kubernetes.

## Setup

```bash
npm install -g serverless
npm install --save-dev serverless aws-sdk
```

## serverless.yml

```yaml
service: my-api

frameworkVersion: '4'

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  environment:
    TABLE_NAME: users
    STAGE: ${self:provider.stage}

plugins:
  - serverless-dynamodb-local
  - serverless-offline

functions:
  getUser:
    handler: handlers/getUser.handler
    events:
      - http:
          path: users/{id}
          method: get
          cors: true

  createUser:
    handler: handlers/createUser.handler
    events:
      - http:
          path: users
          method: post
          cors: true

  processEvent:
    handler: handlers/processEvent.handler
    events:
      - stream:
          type: dynamodb
          arn:
            Fn::GetAtt: [UsersTable, StreamArn]
          batchSize: 100

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.TABLE_NAME}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        StreamSpecification:
          StreamViewType: NEW_AND_OLD_IMAGES

package:
  patterns:
    - '!node_modules/**'
    - '!.git/**'
```

## Handler Functions

```typescript
// handlers/getUser.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters || {};

  try {
    const { Item } = await db.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch user' })
    };
  }
};
```

## Environment Management

```bash
# Deploy to dev
serverless deploy --stage dev

# Deploy to production
serverless deploy --stage prod

# View logs
serverless logs -f getUser --stage prod

# Remove stack
serverless remove --stage dev
```

## Local Development

```bash
# Install local DynamoDB
npm install -D serverless-dynamodb-local

# Start offline
serverless offline start --stage local

# With DynamoDB local
serverless dynamodb start
```

## Best Practices

✅ **Use environment variables** - Manage config per stage
✅ **Minimize cold starts** - Bundle efficiently, use provisioned concurrency
✅ **Error handling** - Return proper HTTP status codes
✅ **Logging** - Use structured logging for CloudWatch
✅ **Testing** - Test handlers locally before deployment

## Resources

- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
