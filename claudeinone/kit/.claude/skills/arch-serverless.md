# Serverless Patterns

## Overview
Design patterns for building reliable serverless applications on AWS Lambda, Vercel, and Cloudflare.

## Lambda Handler Pattern

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// Initialize once outside handler
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const result = await processRequest(body, db);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error('Handler error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
```

## SQS Queue Consumer

```typescript
import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      await processMessage(message);
    } catch (error) {
      console.error('Failed to process message:', record.messageId, error);
      // Throw to move to DLQ after max retries
      throw error;
    }
  }
};
```

## Vercel Edge Function

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

export async function GET(req: Request) {
  const country = req.headers.get('x-vercel-ip-country') ?? 'US';
  const { searchParams } = new URL(req.url);
  return Response.json({ country, q: searchParams.get('q') });
}
```

## Cloudflare Durable Objects (Stateful Serverless)

```typescript
export class Counter implements DurableObject {
  private count = 0;
  constructor(state: DurableObjectState) {
    state.blockConcurrencyWhile(async () => {
      this.count = (await state.storage.get<number>('count')) ?? 0;
    });
  }

  async fetch(req: Request) {
    this.count++;
    await (this as any).state.storage.put('count', this.count);
    return Response.json({ count: this.count });
  }
}
```

## Best Practices
- Initialize clients outside handler (reused on warm invocations)
- Use SQS/EventBridge for async processing — don't block the function
- Implement idempotency — Lambda can execute twice on retry
- Set function timeout to 10-30s maximum; use queues for longer work
- Use Lambda Layers for large shared dependencies

## Resources
- [AWS Lambda best practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Serverless Land patterns](https://serverlessland.com/patterns)
