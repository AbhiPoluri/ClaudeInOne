# Context Engineering

## Overview
Context engineering is the practice of structuring information given to LLMs to maximize response quality and minimize token usage.

## System Prompt Structure

```typescript
const SYSTEM_PROMPT = `You are a senior TypeScript developer assistant.

## Your Capabilities
- Write production-ready TypeScript and React code
- Debug errors with clear explanations
- Suggest architectural patterns

## Response Format
- Use code blocks with language tags
- Explain the "why" not just the "what"
- Be concise — no padding or filler

## Constraints
- Never suggest deprecated APIs
- Always use TypeScript strict mode
- Prefer composition over inheritance`;

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 2048,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: userMessage }],
});
```

## Few-Shot Examples

```typescript
const messages = [
  {
    role: 'user' as const,
    content: 'Convert this to TypeScript: function add(a, b) { return a + b; }'
  },
  {
    role: 'assistant' as const,
    content: 'function add(a: number, b: number): number { return a + b; }'
  },
  {
    role: 'user' as const,
    content: userInput // actual request
  }
];
```

## Retrieval-Augmented Context (RAG)

```typescript
async function buildContextualPrompt(userQuestion: string): Promise<string> {
  // 1. Embed the question
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuestion,
  });

  // 2. Find relevant docs
  const relevant = await vectorDB.query({
    vector: queryEmbedding.data[0].embedding,
    topK: 5,
  });

  // 3. Build context
  const context = relevant.matches
    .map(m => `[${m.metadata.title}]
${m.metadata.content}`)
    .join('

---

');

  return `Answer based on this context:

${context}

Question: ${userQuestion}`;
}
```

## Conversation Memory with Summarization

```typescript
async function summarizeOldMessages(messages: Message[]): Promise<string> {
  const toSummarize = messages.slice(0, -10); // keep last 10 fresh
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Summarize this conversation in 3-5 bullet points:
${JSON.stringify(toSummarize)}`
    }]
  });
  return response.content[0].text;
}
```

## Best Practices
- Put the most important instructions at the start and end of the system prompt
- Use XML tags to clearly delimit sections (`<context>`, `<instructions>`, `<examples>`)
- Few-shot examples are powerful — show don't tell
- Keep context relevant — irrelevant content degrades quality
- Use `claude-haiku-4-5` for cheap tasks like summarization/routing

## Resources
- [Anthropic prompt engineering guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
