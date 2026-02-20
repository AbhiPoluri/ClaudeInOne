# Serverless Computing

Building applications without managing servers.

## AWS Lambda

```typescript
// Handler function
export const handler = async (event: any) => {
  console.log('Event:', event);

  try {
    // Process event
    const result = await processData(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error' })
    };
  }
};

// With dependencies
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client();

export const s3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3.send(command);

    // Process object
  }
};
```

## Google Cloud Functions

```typescript
import functions from '@google-cloud/functions-framework';

functions.http('helloWorld', (req, res) => {
  const name = req.query.name || 'World';
  res.send(`Hello ${name}!`);
});

// Async function
functions.http('asyncFunction', async (req, res) => {
  const data = await fetchData();
  res.json(data);
});

// Pub/Sub trigger
functions.cloud.pubsub('processPubSub', (message) => {
  const data = Buffer.from(message.data, 'base64').toString();
  console.log('Received:', data);
});
```

## Azure Functions

```typescript
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  context.log('HTTP trigger function processed a request.');

  const name = req.query.name || req.body?.name || 'World';

  context.res = {
    status: 200,
    body: `Hello, ${name}!`
  };
};

export default httpTrigger;

// Timer trigger
const timerTrigger: AzureFunction = async (context: Context) => {
  const timeStamp = new Date().toISOString();
  context.log('Timer trigger function ran!', timeStamp);
};

export default timerTrigger;
```

## Deployment

```bash
# AWS SAM
sam init
sam build
sam deploy

# Google Cloud
gcloud functions deploy myFunction \
  --runtime nodejs20 \
  --trigger-http

# Azure Functions
func new
func start
func azure functionapp publish <FunctionAppName>
```

## Local Development

```bash
# AWS SAM local
sam local start-api

# Google Cloud Functions Framework
functions-framework --target=myFunction --debug

# Azure Functions Core Tools
func start
```

## Monitoring & Logging

```typescript
// CloudWatch logging
console.log('Info message');
console.error('Error message');

// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'INFO',
  message: 'Processing event',
  eventId: event.id
}));

// Custom metrics
import { CloudWatch } from 'aws-sdk';

const cw = new CloudWatch();

await cw.putMetricData({
  Namespace: 'MyApp',
  MetricData: [
    {
      MetricName: 'ProcessingTime',
      Value: duration,
      Unit: 'Milliseconds'
    }
  ]
}).promise();
```

## Best Practices

✅ **Keep functions small** - Single responsibility
✅ **Optimize cold starts** - Minimize dependencies
✅ **Handle errors** - Return proper status codes
✅ **Set timeouts** - Prevent hanging functions
✅ **Monitor costs** - Track function executions

## Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Google Cloud Functions](https://cloud.google.com/functions/docs)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
