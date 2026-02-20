# Vector Databases

Specialized databases for semantic search and AI applications.

## Pinecone

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pc.Index('my-index');

// Upsert vectors
await index.upsert([
  {
    id: 'vec1',
    values: [0.1, 0.2, 0.3],
    metadata: { text: 'Hello world' }
  }
]);

// Query
const results = await index.query({
  vector: [0.1, 0.2, 0.3],
  topK: 5,
  includeMetadata: true
});

console.log(results.matches);
```

## Supabase pgvector

```typescript
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';

const supabase = createClient(url, key);
const embeddings = new OpenAIEmbeddings();

// Create table
await supabase.from('documents').create({
  id: 'int8',
  content: 'text',
  embedding: 'vector(1536)'
});

// Insert with embedding
const embedding = await embeddings.embedQuery('sample text');
await supabase.from('documents').insert({
  content: 'sample text',
  embedding: embedding
});

// Vector search
const queryEmbedding = await embeddings.embedQuery('find similar');
const results = await supabase.rpc('match_documents', {
  query_embedding: queryEmbedding,
  similarity_threshold: 0.7,
  match_count: 10
});
```

## Weaviate

```typescript
import { client } from '@weaviate/client';

const myClient = client.client({
  scheme: 'http',
  host: 'localhost:8080'
});

// Create class
await myClient.schema.classCreator()
  .withClass({
    class: 'Document',
    properties: [
      { name: 'content', dataType: ['text'] },
      { name: 'source', dataType: ['string'] }
    ]
  })
  .do();

// Insert with vectors
await myClient.data
  .creator()
  .withClass('Document')
  .withProperties({
    content: 'Machine learning is...',
    source: 'wikipedia'
  })
  .withVector([0.1, 0.2, 0.3])
  .do();

// Semantic search
const response = await myClient.graphql
  .get()
  .withClassName('Document')
  .withFields(['content', '_additional { distance }'])
  .withNearVector({ vector: [0.1, 0.2, 0.3] })
  .withLimit(10)
  .do();
```

## Qdrant

```typescript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'http://localhost:6333'
});

// Create collection
await client.recreateCollection('my_collection', {
  vectors: { size: 384, distance: 'Cosine' }
});

// Insert vectors
await client.upsert('my_collection', {
  points: [
    {
      id: 1,
      vector: [0.1, 0.2, 0.3],
      payload: { text: 'Hello world' }
    }
  ]
});

// Search
const results = await client.search('my_collection', {
  vector: [0.1, 0.2, 0.3],
  limit: 10
});

console.log(results);
```

## Milvus

```typescript
import { MilvusClient } from '@milvus.io/milvus2-sdk-node';

const milvusClient = new MilvusClient({
  address: 'localhost:19530'
});

// Create collection
await milvusClient.createCollection({
  collection_name: 'documents',
  fields: [
    { name: 'id', data_type: 'INT64', is_primary_key: true },
    { name: 'embedding', data_type: 'FLOAT_VECTOR', type_params: { dim: '384' } },
    { name: 'text', data_type: 'VARCHAR', max_length: 1000 }
  ]
});

// Insert
await milvusClient.insert({
  collection_name: 'documents',
  fields_data: [
    { embedding: [0.1, 0.2, 0.3], text: 'Sample text' }
  ]
});

// Search
const results = await milvusClient.search({
  collection_name: 'documents',
  vectors: [[0.1, 0.2, 0.3]],
  limit: 10
});
```

## Hybrid Search

```typescript
// Combine keyword search + vector search
async function hybridSearch(query: string, content: string) {
  const vectorResults = await vectorDb.search({
    vector: await getEmbedding(query),
    topK: 10
  });

  const keywordResults = await db.query(
    'SELECT * FROM documents WHERE content LIKE ?',
    [`%${query}%`]
  );

  // Merge and re-rank
  const merged = [
    ...vectorResults.map((r, i) => ({ ...r, score: 1 - (i / 10) })),
    ...keywordResults.map((r, i) => ({ ...r, score: 0.5 - (i / 20) }))
  ];

  return merged.sort((a, b) => b.score - a.score).slice(0, 10);
}
```

## Best Practices

✅ **Choose right distance metric** - Cosine for normalized vectors
✅ **Embedding quality** - Use powerful models (E5, BGE)
✅ **Batch operations** - Bulk insert for performance
✅ **Metadata filtering** - Reduce search scope
✅ **Reranking** - LLM reranking for better results

## Resources

- [Pinecone Docs](https://docs.pinecone.io/)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [Weaviate Docs](https://weaviate.io/developers/weaviate)
