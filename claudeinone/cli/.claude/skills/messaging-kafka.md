# Apache Kafka

Distributed event streaming platform.

## Setup

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:latest
```

## Producer

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendEvent(topic: string, event: any) {
  await producer.connect();

  await producer.send({
    topic,
    messages: [
      {
        key: event.id,
        value: JSON.stringify(event),
        timestamp: Date.now().toString()
      }
    ]
  });

  await producer.disconnect();
}

// Usage
await sendEvent('user.created', {
  id: '123',
  email: 'user@example.com',
  timestamp: new Date()
});
```

## Consumer

```typescript
const consumer = kafka.consumer({ groupId: 'user-service' });

async function subscribeToTopic(topic: string) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`Received event: ${JSON.stringify(event)}`);

      // Process event
      await handleUserCreated(event);
    }
  });
}

await subscribeToTopic('user.created');
```

## Topics & Partitions

```typescript
// Create topic with 3 partitions
const admin = kafka.admin();
await admin.createTopics({
  topics: [
    {
      topic: 'user.events',
      numPartitions: 3,
      replicationFactor: 1
    }
  ]
});

// List topics
const topics = await admin.listTopics();
console.log(topics);
```

## Best Practices

✅ **Partitioning** - Distribute by key
✅ **Consumer groups** - Scale processing
✅ **Retention** - Set appropriate TTL
✅ **Monitoring** - Track lag
✅ **Schema** - Use Avro or Protobuf

## Resources

- [KafkaJS Documentation](https://kafka.js.org/)
- [Apache Kafka Guide](https://kafka.apache.org/documentation/)
