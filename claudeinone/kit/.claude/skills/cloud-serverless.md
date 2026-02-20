# Serverless Architecture

## Overview
Serverless runs functions on demand with automatic scaling and pay-per-execution pricing.

## AWS Lambda (TypeScript)

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Initialize outside handler — reused across warm invocations
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

  const result = await db.send(new GetCommand({
    TableName: process.env.TABLE_NAME!,
    Key: { PK: `USER#${id}`, SK: `PROFILE#${id}` }
  }));

  if (!result.Item) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.Item) };
};
```

## Cloudflare Workers

```typescript
export interface Env { DB: D1Database; KV: KVNamespace; }

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === '/api/users') {
      const { results } = await env.DB.prepare('SELECT * FROM users LIMIT 20').all();
      return Response.json(results);
    }
    return new Response('Not Found', { status: 404 });
  }
};
```

## Vercel Edge Function

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

export async function GET(req: Request) {
  const country = req.headers.get('x-vercel-ip-country') ?? 'US';
  return Response.json({ country, timestamp: Date.now() });
}
```

## Best Practices
- Initialize DB clients outside handlers (reuse on warm invocations)
- Use DynamoDB/Redis — SQL connection pools don't work well with serverless
- Bundle with esbuild for small Lambda packages
- Set appropriate memory — more memory = more CPU on AWS Lambda
- Use SQS for async work — don't block the function on slow tasks

## Resources
- [AWS Lambda docs](https://docs.aws.amazon.com/lambda/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
