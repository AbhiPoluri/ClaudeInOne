# Node.js Streams

Efficient data processing with streams.

## Stream Types

```typescript
import { Readable, Writable, Transform, Duplex } from 'stream';

// Readable stream
const readable = new Readable({
  read() {
    this.push('data');
    this.push(null); // Signal end
  }
});

// Writable stream
const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log('Received:', chunk);
    callback();
  }
});

// Transform stream
const transform = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = chunk.toString().toUpperCase();
    this.push(transformed);
    callback();
  }
});

// Duplex (both readable and writable)
const duplex = new Duplex({
  read() {},
  write(chunk, encoding, callback) {
    console.log('Written:', chunk);
    callback();
  }
});
```

## Piping

```typescript
import fs from 'fs';
import zlib from 'zlib';

// Simple pipe
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// Multiple transforms
fs.createReadStream('large-file.txt')
  .pipe(transform1)
  .pipe(transform2)
  .pipe(fs.createWriteStream('output.txt'));

// Compression
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));

// Handle errors
fs.createReadStream('input.txt')
  .on('error', (error) => console.error('Read error:', error))
  .pipe(fs.createWriteStream('output.txt'))
  .on('error', (error) => console.error('Write error:', error));
```

## Processing Large Files

```typescript
function processLargeCSV(filePath: string) {
  const { createReadStream } = require('fs');
  const { createInterface } = require('readline');

  const stream = createReadStream(filePath);
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  let lineCount = 0;

  rl.on('line', (line) => {
    lineCount++;
    const record = JSON.parse(line);

    // Process record
    processRecord(record);

    // Report progress every 1000 lines
    if (lineCount % 1000 === 0) {
      console.log(`Processed ${lineCount} lines`);
    }
  });

  rl.on('close', () => {
    console.log(`Total lines: ${lineCount}`);
  });
}
```

## Custom Transform

```typescript
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  transform(chunk: any, encoding: string, callback: Function) {
    const transformed = chunk.toString().toUpperCase();
    this.push(transformed);
    callback();
  }
}

// Usage
readable
  .pipe(new UpperCaseTransform())
  .pipe(writable);
```

## Memory Efficient Processing

```typescript
// Bad: Load entire file into memory
const data = fs.readFileSync('large-file.txt', 'utf-8');
const lines = data.split('\n');
lines.forEach(processLine);

// Good: Stream processing
fs.createReadStream('large-file.txt')
  .pipe(split())
  .on('data', processLine);

// Bad: Buffer accumulation
let buffer = '';
stream.on('data', (chunk) => {
  buffer += chunk; // Can cause memory issues
});

// Good: Backpressure handling
stream.on('data', (chunk) => {
  if (!destination.write(chunk)) {
    stream.pause();
  }
});

destination.on('drain', () => {
  stream.resume();
});
```

## Best Practices

✅ **Handle backpressure** - Pause when buffer full
✅ **Error handling** - Listen for error events
✅ **Piping** - Use pipe over manual event handlers
✅ **Memory limits** - Monitor heap usage
✅ **Cleanup** - Close streams properly

## Resources

- [Node.js Stream API](https://nodejs.org/api/stream.html)
- [Stream Handbook](https://github.com/substack/stream-handbook)
