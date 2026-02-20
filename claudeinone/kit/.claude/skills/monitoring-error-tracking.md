# Error Tracking & Reporting

Catch and track errors in production applications.

## Sentry Integration

```typescript
import * as Sentry from "@sentry/node";
import { NodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new NodeProfilingIntegration()
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
});

// Express middleware
app.use(Sentry.Handlers.requestHandler());

// Your routes...

app.use(Sentry.Handlers.errorHandler());

// Manual error reporting
try {
  await someAsyncOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'critical'
    },
    extra: {
      userId: req.user.id,
      orderId: req.body.orderId
    }
  });
}
```

## Rollbar Integration

```typescript
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV
});

app.use((err: any, req: any, res: any, next: any) => {
  rollbar.error(err, { request: req });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Manual logging
rollbar.info('User login', { userId: user.id });
```

## Custom Error Tracking

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

interface ErrorLog {
  timestamp: Date;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'error' | 'warning' | 'info';
}

class ErrorTracker {
  private logDir = './logs';

  async logError(error: Error, context?: any) {
    const log: ErrorLog = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      context,
      severity: 'error'
    };

    // Write to file
    const filename = `${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(this.logDir, filename);

    const existing = await this.readLogs(filepath);
    existing.push(log);

    await fs.writeFile(filepath, JSON.stringify(existing, null, 2));

    // Alert if critical
    if (context?.critical) {
      await this.alertAdmins(log);
    }
  }

  private async readLogs(filepath: string): Promise<ErrorLog[]> {
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private async alertAdmins(log: ErrorLog) {
    // Send alert via Slack, email, etc.
    console.error('CRITICAL ERROR:', log.message);
  }
}

const errorTracker = new ErrorTracker();

app.use((err: any, req: any, res: any, next: any) => {
  errorTracker.logError(err, {
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    critical: err.statusCode >= 500
  });

  res.status(500).json({ error: 'Internal Server Error' });
});
```

## Source Maps

```typescript
// webpack.config.js
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',
  // ...
};

// Upload source maps to Sentry
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function uploadSourceMaps() {
  const version = process.env.RELEASE || 'dev';

  await execAsync(`
    sentry-cli releases files upload-sourcemaps \
      --org myorg \
      --project myproject \
      --release ${version} \
      ./dist
  `);
}
```

## Error Boundaries (React)

```typescript
import React, { ReactNode } from 'react';
import * as Sentry from "@sentry/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }

    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: <h1>An error occurred</h1>
});
```

## Best Practices

✅ **Capture context** - Include user, request, state info
✅ **Alert on critical** - Real-time notifications for severe errors
✅ **Source maps** - Map minified code to original
✅ **Group errors** - Identify duplicate issues
✅ **Monitor trends** - Track error rates over time

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Rollbar](https://rollbar.com/)
- [Bugsnag](https://www.bugsnag.com/)
