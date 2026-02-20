# Monitoring & Observability

Application performance monitoring, metrics, and alerting.

## Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'database'
    static_configs:
      - targets: ['localhost:9187']
```

## Application Metrics

```typescript
import promClient from 'prom-client';
import express from 'express';

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path, res.statusCode)
      .observe(duration);
  });

  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

## Grafana Dashboards

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_count[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_count{status_code=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
          }
        ]
      }
    ]
  }
}
```

## DataDog Integration

```typescript
import StatsD from 'node-dogstatsd';

const dogstatsd = new StatsD.StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'myapp.'
});

// Track metrics
dogstatsd.gauge('user.active', 42);
dogstatsd.increment('requests.total');
dogstatsd.histogram('response.time', 0.234);

// Tags
dogstatsd.increment('api.calls', 1, {
  tags: ['endpoint:/users', 'status:success']
});
```

## Custom Alerts

```yaml
# alert.yml
groups:
  - name: application
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, response_time) > 1
        for: 10m
        annotations:
          summary: "High latency detected"
```

## Logging with ELK

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { code: 'ECONNREFUSED' });
```

## Health Checks

```typescript
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      uptime: process.uptime()
    }
  };

  const statusCode = Object.values(health.checks).every(Boolean) ? 200 : 503;

  res.status(statusCode).json(health);
});

async function checkDatabase() {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
```

## Best Practices

✅ **Structured logging** - Use JSON format
✅ **Meaningful metrics** - Track business metrics
✅ **Alert thresholds** - Set based on SLOs
✅ **Retention policies** - Balance cost and history
✅ **Distributed tracing** - Track requests across services

## Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/)
- [DataDog](https://www.datadoghq.com/)
