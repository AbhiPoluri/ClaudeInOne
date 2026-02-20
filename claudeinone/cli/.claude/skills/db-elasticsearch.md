# Elasticsearch

Distributed search and analytics engine.

## Setup

```bash
npm install @elastic/elasticsearch
```

## Indexing

```typescript
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

// Create index with mapping
await client.indices.create({
  index: 'products',
  body: {
    mappings: {
      properties: {
        name: { type: 'text' },
        description: { type: 'text' },
        price: { type: 'float' },
        category: { type: 'keyword' },
        tags: { type: 'keyword' },
        created_at: { type: 'date' }
      }
    }
  }
});

// Index document
await client.index({
  index: 'products',
  id: '1',
  document: {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'electronics',
    tags: ['computer', 'work'],
    created_at: new Date()
  }
});

// Bulk indexing
await client.bulk({
  operations: documents.flatMap(doc => [
    { index: { _index: 'products', _id: doc.id } },
    doc
  ])
});
```

## Searching

```typescript
// Simple search
const results = await client.search({
  index: 'products',
  query: {
    match: { name: 'laptop' }
  }
});

// Complex query
const results = await client.search({
  index: 'products',
  query: {
    bool: {
      must: [
        { match: { name: 'laptop' } }
      ],
      filter: [
        { range: { price: { lte: 1000 } } },
        { term: { category: 'electronics' } }
      ]
    }
  }
});

// Aggregations
const stats = await client.search({
  index: 'products',
  aggs: {
    avg_price: { avg: { field: 'price' } },
    categories: { terms: { field: 'category' } }
  }
});
```

## Best Practices

✅ **Proper mapping** - Define field types
✅ **Shard allocation** - Balance shards across nodes
✅ **Indexing strategy** - Time-based indices
✅ **Query optimization** - Use filters for performance
✅ **Monitoring** - Track cluster health

## Resources

- [Elasticsearch Guide](https://www.elastic.co/guide/index.html)
