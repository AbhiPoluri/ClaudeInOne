# LangChain

Framework for developing applications powered by language models.

## Setup

```bash
npm install langchain openai
```

## Basic Chain

```typescript
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = new PromptTemplate({
  template: 'Write a {type} joke about {subject}',
  inputVariables: ['type', 'subject']
});

const chain = new LLMChain({ llm: model, prompt });

const result = await chain.call({
  type: 'funny',
  subject: 'programming'
});

console.log(result.text);
```

## Document Loading

```typescript
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Load documents
const loader = new PDFLoader('document.pdf');
const docs = await loader.load();

// Split into chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});

const chunks = await splitter.splitDocuments(docs);
```

## Embedding & Vector Store

```typescript
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  embeddings
);

// Query
const results = await vectorStore.similaritySearch('topic', 3);
```

## Agents

```typescript
import { initializeAgentExecutor } from 'langchain/agents';
import { Tool } from 'langchain/tools';

const tools = [
  new Tool({
    name: 'Calculator',
    func: async (input) => eval(input),
    description: 'Useful for math operations'
  })
];

const agent = await initializeAgentExecutor(tools, model, 'zero-shot-react-description');

const result = await agent.call({ input: 'What is 2 + 2?' });
```

## Resources

- [LangChain Docs](https://js.langchain.com/)
- [Integrations](https://js.langchain.com/docs/integrations)
