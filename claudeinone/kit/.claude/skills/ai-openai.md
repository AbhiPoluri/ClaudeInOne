# OpenAI API

Access GPT models, embeddings, and other AI services.

## Setup

```bash
npm install openai
```

## Chat Completions

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function chat(userMessage: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful programming assistant.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

// Usage
const answer = await chat('How do I implement caching in Node.js?');
console.log(answer);
```

## Streaming Responses

```typescript
async function streamChat(userMessage: string) {
  const stream = client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: userMessage }],
    stream: true
  });

  for await (const chunk of await stream) {
    if (chunk.choices[0].delta.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}
```

## Embeddings

```typescript
async function getEmbedding(text: string) {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });

  return response.data[0].embedding;
}

// Usage for semantic search
const query = 'How to build a REST API?';
const queryEmbedding = await getEmbedding(query);

const documents = [
  'REST API with Express and Node.js',
  'GraphQL server setup',
  'WebSocket real-time communication'
];

const docEmbeddings = await Promise.all(
  documents.map(doc => getEmbedding(doc))
);

// Find most similar document
const similarities = docEmbeddings.map((emb, idx) => ({
  idx,
  similarity: cosineSimilarity(queryEmbedding, emb)
}));

const mostSimilar = similarities.sort((a, b) => b.similarity - a.similarity)[0];
console.log(`Most similar: ${documents[mostSimilar.idx]}`);
```

## Vision (Image Analysis)

```typescript
async function analyzeImage(imageUrl: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4-vision',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          },
          {
            type: 'text',
            text: 'Describe this image in detail'
          }
        ]
      }
    ]
  });

  return response.choices[0].message.content;
}

// Local image
async function analyzeLocalImage(imagePath: string) {
  const fs = require('fs');
  const base64 = fs.readFileSync(imagePath).toString('base64');

  const response = await client.chat.completions.create({
    model: 'gpt-4-vision',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64}`
            }
          },
          {
            type: 'text',
            text: 'What is in this image?'
          }
        ]
      }
    ]
  });

  return response.choices[0].message.content;
}
```

## Function Calling

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit']
          }
        },
        required: ['location']
      }
    }
  }
];

async function getWeatherAndRespond(query: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: query }],
    tools: tools,
    tool_choice: 'auto'
  });

  if (response.choices[0].message.tool_calls) {
    const toolCall = response.choices[0].message.tool_calls[0];
    
    // Execute function based on tool_call.function.name
    const result = await executeFunction(
      toolCall.function.name,
      JSON.parse(toolCall.function.arguments)
    );

    // Send result back for final response
    const finalResponse = await client.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'user', content: query },
        response.choices[0].message,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        }
      ]
    });

    return finalResponse.choices[0].message.content;
  }
}
```

## Error Handling

```typescript
try {
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 10
  });
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error(`API Error: ${error.status} - ${error.message}`);
  } else if (error instanceof OpenAI.RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof OpenAI.AuthenticationError) {
    console.error('Invalid API key');
  }
}
```

## Best Practices

✅ **Use streaming** - Better UX for long responses
✅ **Set temperature** - 0.7 for balanced, 0 for deterministic
✅ **Token limits** - Monitor usage and costs
✅ **Error handling** - Handle rate limits and API errors
✅ **Caching** - Cache embeddings for reuse

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Model Pricing](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)
