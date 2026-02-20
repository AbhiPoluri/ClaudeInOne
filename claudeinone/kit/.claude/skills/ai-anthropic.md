# Anthropic Claude API

## Overview
Build AI features with the Anthropic SDK — chat, streaming, tool use, and vision.

## Setup

```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

## Basic Chat

```typescript
const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain async/await in 3 sentences.' }],
});
console.log(message.content[0].text);
```

## Streaming

```typescript
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a poem about TypeScript' }],
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

## Next.js Streaming API Route

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const stream = await client.messages.stream({ model: 'claude-sonnet-4-6', max_tokens: 1024, messages });

  return new Response(new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    }
  }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
```

## Tool Use

```typescript
const response = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 1024,
  tools: [{
    name: 'get_weather',
    description: 'Get weather for a city',
    input_schema: {
      type: 'object',
      properties: { location: { type: 'string' } },
      required: ['location']
    }
  }],
  messages: [{ role: 'user', content: 'Weather in Tokyo?' }]
});

if (response.stop_reason === 'tool_use') {
  const tool = response.content.find(c => c.type === 'tool_use');
  // handle tool call...
}
```

## Model Selection
| Model | Use Case |
|-------|----------|
| `claude-opus-4-6` | Complex reasoning, code generation |
| `claude-sonnet-4-6` | Balanced — most tasks |
| `claude-haiku-4-5` | Fast, cost-sensitive |

## Resources
- [Anthropic SDK docs](https://docs.anthropic.com/en/api/getting-started)
