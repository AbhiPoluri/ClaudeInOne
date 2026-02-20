# Winston Logger

Structured logging for Node.js applications.

## Setup

```bash
npm install winston winston-daily-rotate-file
```

## Configuration

```typescript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'my-api' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxDays: '14d'
    })
  ]
});

// Console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

## Usage

```typescript
logger.info('User logged in', { userId: '123' });
logger.warn('Deprecated endpoint used', { endpoint: '/api/v1/users' });
logger.error('Database connection failed', { error: err.message });

// With context
logger.info('Payment processed', {
  userId: '123',
  orderId: '456',
  amount: 99.99,
  status: 'success'
});
```

## Express Integration

```typescript
import expressWinston from 'express-winston';

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true
}));

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' })
  ]
}));
```

## Best Practices

✅ **Structured logging** - JSON format
✅ **Log levels** - Appropriate severity
✅ **Context** - Include relevant metadata
✅ **Rotation** - Archive old logs
✅ **No PII** - Never log passwords

## Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
