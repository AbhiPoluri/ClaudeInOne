# LLamaIndex (formerly GPT Index)

Framework for building production-grade LLM applications with data connectors and indexing.

## Setup

```bash
npm install llamaindex openai dotenv
```

## Document Indexing

```typescript
import { VectorStoreIndex, Document } from 'llamaindex';
import { OpenAI } from 'llamaindex/llm/openai';

const documents = [
  new Document({
    text: 'React is a JavaScript library for building user interfaces.',
    metadata: { source: 'docs' }
  }),
  new Document({
    text: 'Vue is a progressive framework for building web interfaces.',
    metadata: { source: 'docs' }
  })
];

const llm = new OpenAI({ model: 'gpt-3.5-turbo' });

const index = await VectorStoreIndex.fromDocuments(documents, {
  llm
});

// Query
const query = 'What is React?';
const response = await index.asRetriever().retrieve(query);

console.log(response);
```

## Loading Documents

```typescript
import { SimpleDirectoryReader } from 'llamaindex';

// Load markdown files from directory
const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: './data'
});

// Load PDF
import { PDFReader } from 'llamaindex/readers';

const pdfDocs = await new PDFReader().loadData({
  filePath: 'document.pdf'
});
```

## RAG (Retrieval-Augmented Generation)

```typescript
import { VectorStoreIndex, Document, PromptTemplate } from 'llamaindex';

const documents = [
  new Document({ text: 'Your company policies...' }),
  new Document({ text: 'Product documentation...' })
];

const index = await VectorStoreIndex.fromDocuments(documents);
const retriever = index.asRetriever();

// Custom prompt
const promptTemplate = new PromptTemplate({
  template: `Answer the question using the context:
{context_str}

Question: {query_str}`
});

const queryEngine = index.asQueryEngine({
  preFilters: { field: 'source', operator: 'eq', value: 'docs' }
});

const response = await queryEngine.query({
  query: 'What are the payment terms?'
});

console.log(response.response);
```

## Chat with Memory

```typescript
import { VectorStoreIndex, Document, ChatMemoryBuffer } from 'llamaindex';

const documents = [
  new Document({ text: 'Product features...' })
];

const index = await VectorStoreIndex.fromDocuments(documents);
const memory = new ChatMemoryBuffer({ tokenLimit: 3000 });

const chatEngine = index.asChatEngine({ memory });

// Multi-turn conversation
const response1 = await chatEngine.chat({
  message: 'Tell me about your products'
});

const response2 = await chatEngine.chat({
  message: 'What about pricing?' // Has context from previous messages
});

console.log(response2.response);
```

## Custom Retrievers

```typescript
import { BaseRetriever, SimilarityType } from 'llamaindex';

class CustomRetriever extends BaseRetriever {
  async retrieve(query: string) {
    // Custom retrieval logic (e.g., BM25, graph-based)
    const results = await this.customSearch(query);
    return results.map(r => ({
      text: r.content,
      score: r.relevance
    }));
  }
}

const customRetriever = new CustomRetriever();
const queryEngine = index.asQueryEngine({
  retriever: customRetriever
});
```

## Agents

```typescript
import { createOpenAIAgent, Tool } from 'llamaindex/agent';
import { ToolMetadata } from 'llamaindex';

const tools = [
  new Tool({
    metadata: {
      name: 'search_documents',
      description: 'Search company documentation'
    },
    fn: async (query: string) => {
      const index = await loadIndex();
      return await index.asRetriever().retrieve(query);
    }
  })
];

const agent = createOpenAIAgent({
  tools,
  model: 'gpt-4'
});

const response = await agent.chat({
  message: 'What are our refund policies?'
});
```

## Best Practices

✅ **Chunking** - Split documents appropriately
✅ **Metadata** - Include source and date
✅ **Evaluation** - Measure retrieval quality
✅ **Caching** - Cache embeddings
✅ **Error handling** - Handle API failures gracefully

## Resources

- [LLamaIndex Docs](https://docs.llamaindex.ai/)
- [Data Connectors](https://docs.llamaindex.ai/en/stable/module_guides/data_loaders/root.html)
