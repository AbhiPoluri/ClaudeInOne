# Error Boundaries

## Overview
Catch JavaScript errors in React component trees and show fallback UI instead of crashing the whole app.

## react-error-boundary (Recommended)

```bash
npm install react-error-boundary
```

```tsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-semibold">Something went wrong</h2>
      <pre className="text-sm text-red-600 mt-2">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-3 px-4 py-2 bg-red-600 text-white rounded">
        Try again
      </button>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Dashboard />
    </ErrorBoundary>
  );
}

// Trigger manually from async code
function DataLoader() {
  const { showBoundary } = useErrorBoundary();
  useEffect(() => { fetchData().catch(showBoundary); }, []);
}
```

## Next.js App Router Error Boundary

```tsx
// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div>
      <h2>Dashboard failed to load</h2>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

## Class Component (Vanilla React)

```tsx
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }
  render() {
    return this.state.hasError ? (this.props.fallback ?? <h2>Something went wrong</h2>) : this.props.children;
  }
}
```

## Best Practices
- Place error boundaries at route level AND around isolated features
- Always send caught errors to Sentry/Datadog
- Give users an actionable recovery option (retry, reload)
- Use `resetKeys` prop to auto-reset on route change

## Resources
- [react-error-boundary](https://www.npmjs.com/package/react-error-boundary)
- [React error boundary docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
