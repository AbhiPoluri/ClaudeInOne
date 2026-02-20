# Microsoft Azure

Cloud platform with App Service, Functions, Cosmos DB, and SQL Database.

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
```

## Cosmos DB

```typescript
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database('my-db');
const container = database.container('users');

// Create item
const { resource: createdItem } = await container.items.create({
  id: 'user-123',
  email: 'user@example.com',
  age: 30
});

// Read item
const { resource: item } = await container
  .item('user-123', 'user-123')
  .read();

// Query
const { resources: items } = await container.items
  .query('SELECT * FROM c WHERE c.age > @age', { parameters: [{ name: '@age', value: 25 }] })
  .fetchAll();

// Update
await container
  .item('user-123', 'user-123')
  .replace({ ...item, age: 31 });
```

## Azure SQL Database

```typescript
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 15000
  }
};

const pool = new sql.ConnectionPool(config);
await pool.connect();

// Query
const result = await pool.request()
  .input('email', sql.VarChar, 'user@example.com')
  .query('SELECT * FROM Users WHERE email = @email');

console.log(result.recordset);

// Insert
await pool.request()
  .input('email', sql.VarChar, 'new@example.com')
  .input('name', sql.VarChar, 'John Doe')
  .query('INSERT INTO Users (email, name) VALUES (@email, @name)');

await pool.close();
```

## Blob Storage

```typescript
import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient('my-container');

// Upload blob
const blockBlobClient = containerClient.getBlockBlobClient('my-blob.txt');
await blockBlobClient.upload('content', 7);

// Download blob
const downloadBlockBlobResponse = await blockBlobClient.download(0);
const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);

// List blobs
for await (const blob of containerClient.listBlobsFlat()) {
  console.log(`\t${blob.name}`);
}
```

## Azure Key Vault

```typescript
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const vaultUrl = `https://${process.env.VAULT_NAME}.vault.azure.net`;
const client = new SecretClient(vaultUrl, new DefaultAzureCredential());

// Get secret
const secret = await client.getSecret('my-secret');
console.log(secret.value);

// Set secret
await client.setSecret('new-secret', 'secret-value');
```

## Application Insights (Monitoring)

```typescript
import appInsights from 'applicationinsights';

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY)
  .setAutoCollectConsole(true)
  .start();

const client = appInsights.defaultClient;

// Track event
client.trackEvent({
  name: 'UserLogin',
  properties: { userId: '123', method: 'OAuth' }
});

// Track exception
try {
  throw new Error('Something went wrong');
} catch (error) {
  client.trackException({ exception: error });
}
```

## Best Practices

✅ **Use managed identities** - Avoid connection strings in code
✅ **Cosmos DB partitioning** - Design partition key for scalability
✅ **Connection pooling** - Reuse SQL connections
✅ **Application Insights** - Monitor performance and errors
✅ **Use Azure DevOps** - CI/CD integration

## Resources

- [Azure Documentation](https://learn.microsoft.com/en-us/azure/)
- [Cosmos DB Guide](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/)
