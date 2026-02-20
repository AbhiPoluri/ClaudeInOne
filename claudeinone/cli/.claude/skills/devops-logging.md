# Logging & Log Management

Centralized logging, log aggregation, and analysis.

## Winston Logger

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  defaultMeta: { service: 'my-api' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.info('User logged in', { userId: '123' });
logger.error('Database error', { error: err.message });
logger.warn('Deprecated API called', { endpoint: '/api/v1/users' });
```

## Express Integration

```typescript
import expressWinston from 'express-winston';

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'requests.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true
}));

// Error logging
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'errors.log' })
  ]
}));
```

## Structured Logging

```typescript
// Bad: Unstructured logs
logger.info('User with ID ' + userId + ' logged in at ' + timestamp);

// Good: Structured logs
logger.info('User login', {
  userId,
  timestamp: new Date().toISOString(),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

// Query logs easily
// All user logins: { message: 'User login', action: 'login' }
// Errors from service X: { service: 'auth-service', level: 'error' }
```

## Log Aggregation (ELK Stack)

```bash
# Docker Compose for ELK
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
```

## Send Logs to Elasticsearch

```typescript
import * as Elasticsearch from 'winston-elasticsearch';

const logger = winston.createLogger({
  transports: [
    new Elasticsearch.ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: 'http://localhost:9200' },
      index: 'logs'
    })
  ]
});
```

## CloudWatch Logs (AWS)

```typescript
import { CloudWatchTransport } from 'winston-cloudwatch';

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: '/aws/lambda/my-function',
      logStreamName: 'execution',
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: 'us-east-1'
    })
  ]
});
```

## Log Levels

```typescript
// 0 error, 1 warn, 2 info, 3 http, 4 debug
logger.error('Critical failure');      // Always logged
logger.warn('Deprecated API usage');   // Production logging
logger.info('User action');            // Standard operations
logger.http('API request');            // HTTP details
logger.debug('Variable value');        // Development only
```

## Best Practices

✅ **Structured format** - JSON for easy parsing
✅ **Log levels** - Use appropriate severity
✅ **Correlation IDs** - Track requests across services
✅ **Retention** - Balance storage and compliance
✅ **PII handling** - Never log sensitive data

## Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Elastic Stack](https://www.elastic.co/elastic-stack/)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/)
