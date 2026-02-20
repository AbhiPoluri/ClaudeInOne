# Mutation Testing

Testing the quality of your tests.

## Stryker Setup

```bash
npm install -D @stryker-mutator/core @stryker-mutator/typescript-checker
npx stryker init
```

## Configuration

```json
{
  "stryker-config": {
    "mutate": ["src/**/*.ts"],
    "mutator": "typescript",
    "testRunner": "vitest",
    "reporters": ["html", "json", "dashboard"],
    "basePath": ".",
    "concurrency": 4,
    "coverageAnalysis": "all"
  }
}
```

## Running Tests

```bash
# Run mutation testing
npm run stryker

# Generate report
npx stryker report --baseDir baseline
```

## Understanding Mutations

```typescript
// Original code
function add(a: number, b: number): number {
  return a + b;
}

// Possible mutations
// 1. return a - b;
// 2. return a * b;
// 3. return a / b;
// 4. return 0;

// Test quality
describe('add', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Good: kills multiple mutations
  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });

  // Better: more specific assertions
  it('should not use multiplication', () => {
    expect(add(2, 3)).not.toBe(6);
  });
});
```

## Mutation Score Interpretation

```
Killed: Test caught the mutation
Survived: Test missed the mutation
Timeout: Mutation caused infinite loop
Error: Mutation caused compilation error

Score = (Killed / (Killed + Survived)) * 100
Target: > 80% mutation score
```

## Best Practices

✅ **Kill mutations** - Tests should fail when code changes
✅ **Avoid flaky tests** - Deterministic behavior
✅ **Full coverage** - High code coverage + mutation score
✅ **Edge cases** - Test boundaries
✅ **Assertions** - Multiple assertions per test

## Resources

- [Stryker Mutator](https://stryker-mutator.io/)
