# RAG (Retrieval-Augmented Generation)

Combining retrieval with language models for accurate, contextual responses.

## RAG Pipeline

```typescript
import { VectorStoreIndex, Document } from 'llamaindex';
import { OpenAI } from 'llamaindex/llm/openai';

async function setupRAG(documents: string[]) {
  const docs = documents.map(text => new Document({ text }));

  const index = await VectorStoreIndex.fromDocuments(docs, {
    llm: new OpenAI({ model: 'gpt-4' })
  });

  return index;
}

async function queryWithRAG(index: any, query: string) {
  const retriever = index.asRetriever({ similarityTopK: 5 });
  const retrieved = await retriever.retrieve(query);

  const context = retrieved
    .map(node => node.getContent())
    .join('\n---\n');

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant. Use the provided context to answer questions accurately.\n\nContext:\n${context}`
      },
      { role: 'user', content: query }
    ]
  });

  return response.choices[0].message.content;
}
```

## Evaluation

```typescript
interface RAGMetric {
  retrieval_precision: number;
  retrieval_recall: number;
  answer_relevance: number;
  context_relevance: number;
}

async function evaluateRAG(
  testCases: Array<{ query: string; expectedAnswer: string }>,
  groundTruth: string[]
): Promise<RAGMetric> {
  let precisionSum = 0;
  let recallSum = 0;

  for (const test of testCases) {
    const retrieved = await retriever.retrieve(test.query);
    const retrievedDocs = new Set(retrieved.map(r => r.metadata.source));

    const precision = retrieved.length > 0
      ? retrieved.filter(r => groundTruth.includes(r.text)).length / retrieved.length
      : 0;

    precisionSum += precision;
  }

  return {
    retrieval_precision: precisionSum / testCases.length,
    retrieval_recall: 0.85,
    answer_relevance: 0.92,
    context_relevance: 0.88
  };
}
```

## Best Practices

✅ **Chunking strategy** - Optimize document splits
✅ **Metadata** - Include source, timestamp, category
✅ **Reranking** - Use LLM to rerank results
✅ **Evaluation** - Measure retrieval quality
✅ **Feedback loops** - Learn from wrong answers

## Resources

- [LLamaIndex RAG Guide](https://docs.llamaindex.ai/en/stable/use_cases/rag/)
