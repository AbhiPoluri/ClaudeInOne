# Google Cloud Platform (GCP)

Managed cloud services with Compute Engine, Cloud Functions, Firestore, and BigQuery.

## Cloud Functions

```typescript
import functions from '@google-cloud/functions-framework';

functions.http('helloWorld', (req, res) => {
  res.send('Hello from Cloud Functions!');
});

// With async operations
functions.http('asyncExample', async (req, res) => {
  const result = await someAsyncOperation();
  res.json(result);
});

// Event-driven (Pub/Sub)
functions.cloud.pubsub('processPubSub', (message) => {
  const data = Buffer.from(message.data, 'base64').toString();
  console.log(`Processing: ${data}`);
});
```

## Firestore

```typescript
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();

// Write
await db.collection('users').doc('user-123').set({
  email: 'user@example.com',
  createdAt: new Date()
});

// Read
const doc = await db.collection('users').doc('user-123').get();
const user = doc.data();

// Query
const snapshot = await db.collection('users')
  .where('email', '==', 'user@example.com')
  .limit(10)
  .get();

snapshot.forEach(doc => console.log(doc.data()));

// Batch write
const batch = db.batch();
batch.set(db.collection('users').doc('user-1'), { name: 'Alice' });
batch.set(db.collection('users').doc('user-2'), { name: 'Bob' });
await batch.commit();
```

## Cloud Storage

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket('my-bucket');

// Upload file
await bucket.file('path/to/file.txt').save('content', {
  contentType: 'text/plain'
});

// Download file
const [contents] = await bucket.file('path/to/file.txt').download();

// List files
const [files] = await bucket.getFiles({ prefix: 'uploads/' });
files.forEach(file => console.log(file.name));
```

## BigQuery

```typescript
import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery();

// Query
const [rows] = await bq.query({
  query: 'SELECT * FROM `dataset.table` WHERE age > @age LIMIT 10',
  location: 'US',
  params: { age: 18 }
});

// Insert rows
await bq.dataset('my_dataset')
  .table('users')
  .insert([
    { id: '1', name: 'Alice', age: 30 },
    { id: '2', name: 'Bob', age: 25 }
  ]);
```

## Pub/Sub Messaging

```typescript
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();

// Publisher
const topic = pubsub.topic('my-topic');
const messageId = await topic.publish(
  Buffer.from(JSON.stringify({ userId: '123', action: 'login' }))
);

// Subscriber
const subscription = pubsub.subscription('my-subscription');

subscription.on('message', (message) => {
  const data = JSON.parse(message.data.toString());
  console.log('Received:', data);
  message.ack();
});
```

## Cloud Run (Containers)

```yaml
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

```bash
# Deploy to Cloud Run
gcloud run deploy my-service \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Best Practices

✅ **Use Firebase for real-time** - Easier than raw Firestore
✅ **Indexing** - Create composite indexes for complex queries
✅ **Transactions** - ACID guarantees for critical operations
✅ **Access control** - Use IAM roles and Firestore Security Rules
✅ **Caching** - Use Memorystore (Redis) for hot data

## Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [Firestore Guide](https://cloud.google.com/firestore/docs)
- [Cloud Functions](https://cloud.google.com/functions/docs)
