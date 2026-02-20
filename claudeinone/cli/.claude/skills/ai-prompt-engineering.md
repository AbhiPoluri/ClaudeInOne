# Prompt Engineering

Techniques for effective LLM prompting and optimization.

## Basic Prompting

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Simple prompt
const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'Explain quantum computing in simple terms'
});

console.log(result.text);
```

## Few-Shot Prompting

```typescript
const examples = `
Example 1:
Question: What is 2 + 2?
Answer: 4

Example 2:
Question: What is 5 * 3?
Answer: 15

Question: What is 10 - 3?
`;

const result = await generateText({
  model: openai('gpt-4'),
  prompt: examples
});
```

## Role-Based Prompting

```typescript
const systemPrompt = `You are an expert JavaScript developer. 
Provide clear, concise code examples with explanations.
Focus on best practices and performance.
Use TypeScript for type safety.`;

const messages = [
  {
    role: 'system',
    content: systemPrompt
  },
  {
    role: 'user',
    content: 'How do I optimize array operations in JavaScript?'
  }
];

const result = await generateText({
  model: openai('gpt-4'),
  messages
});
```

## Chain of Thought

```typescript
const prompt = `Answer the question by thinking step by step.

Question: A train leaves New York traveling at 60 mph. 
Another train leaves Boston traveling at 80 mph. 
They are 215 miles apart. 
When will they meet?

Think through:
1. Combined speed
2. Time to meet
3. Distance each travels`;

const result = await generateText({
  model: openai('gpt-4'),
  prompt
});
```

## Structured Output

```typescript
import { generateObject } from 'ai';

const { object } = await generateObject({
  model: openai('gpt-4'),
  prompt: 'Extract contact information from: "Contact John Doe at john@example.com, phone: 555-1234"',
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string()
  })
});

console.log(object); // { name: 'John Doe', email: 'john@example.com', phone: '555-1234' }
```

## Temperature & Sampling

```typescript
// Deterministic (temperature=0)
const response1 = await generateText({
  model: openai('gpt-4'),
  temperature: 0, // Always the same answer
  prompt: 'What is the capital of France?'
});

// Creative (temperature=1)
const response2 = await generateText({
  model: openai('gpt-4'),
  temperature: 1, // More varied responses
  prompt: 'Write a creative story about a robot'
});
```

## Token Management

```typescript
import { countTokens } from 'js-tiktoken';
import { encoding_for_model } from 'js-tiktoken';

const enc = encoding_for_model('gpt-4');

const text = 'This is a sample text to count tokens';
const tokens = enc.encode(text);
const tokenCount = tokens.length;

console.log(`Token count: ${tokenCount}`);

// Truncate if needed
const maxTokens = 1000;
if (tokenCount > maxTokens) {
  const truncated = text.slice(0, Math.floor(text.length * (maxTokens / tokenCount)));
}
```

## Prompt Optimization

```typescript
// Bad: Vague prompt
'Write some code'

// Good: Specific prompt
'Write a TypeScript function that validates email addresses using regex. 
The function should handle edge cases like subdomains and return true/false.'

// Better: Include examples
'Write a TypeScript function that validates email addresses.
Examples:
- "user@example.com" → true
- "invalid@" → false
- "user+tag@example.co.uk" → true'
```

## Best Practices

✅ **Be specific** - Describe exactly what you want
✅ **Use examples** - Show expected input/output
✅ **Assign role** - Give context to the AI
✅ **Set temperature** - Control creativity vs determinism
✅ **Monitor tokens** - Manage costs and latency

## Resources

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Vercel AI SDK](https://sdk.vercel.ai/)
