# SQLite

Lightweight embedded database perfect for development and edge deployment.

## Setup

```javascript
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // Or file path
// const db = new sqlite3.Database('./app.db');

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )`);
});
```

## Basic Operations

```javascript
// Insert
db.run(
  'INSERT INTO users (name, email) VALUES (?, ?)',
  ['John', 'john@example.com'],
  function(err) {
    if (err) console.error(err);
    else console.log(`Row inserted with ID ${this.lastID}`);
  }
);

// Select one
db.get('SELECT * FROM users WHERE id = ?', [1], (err, row) => {
  if (err) console.error(err);
  else console.log(row);
});

// Select all
db.all('SELECT * FROM users', (err, rows) => {
  if (err) console.error(err);
  else console.log(rows);
});

// Update
db.run(
  'UPDATE users SET name = ? WHERE id = ?',
  ['Jane', 1],
  (err) => { if (err) console.error(err); }
);

// Delete
db.run('DELETE FROM users WHERE id = ?', [1], (err) => {
  if (err) console.error(err);
});
```

## Promises/Async

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app.db');

// Promisify
const run = (sql, params) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const all = (sql, params) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

// Usage
async function getUser(id) {
  return await get('SELECT * FROM users WHERE id = ?', [id]);
}

async function createUser(name, email) {
  const result = await run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  return result.lastID;
}
```

## Transactions

```javascript
db.serialize(() => {
  db.run('BEGIN TRANSACTION');
  
  db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Alice', 1000]);
  db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Bob', 500]);
  
  db.run('COMMIT', (err) => {
    if (err) {
      db.run('ROLLBACK');
      console.error('Transaction failed');
    } else {
      console.log('Transaction committed');
    }
  });
});
```

## Best For

✅ Development and testing
✅ Small-to-medium apps (<10GB)
✅ Edge computing (Cloudflare Workers, Vercel)
✅ Single-user desktop apps
✅ Mobile apps
✅ Embedded systems

❌ Not for: High-concurrency apps (>100 concurrent writers)
❌ Not for: Distributed systems
❌ Not for: Real-time collaboration

## Advantages

- **Zero setup** - No server installation
- **Portable** - Single file database
- **Full SQL** - Complete SQL support
- **ACID compliant** - Reliable transactions
- **Fast** - Excellent read performance
- **Serverless friendly** - Works on edge

## Resources

- [SQLite Docs](https://www.sqlite.org/docs.html)
- [SQL.js](https://sql.js.org/) - SQLite in browser
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) - Node.js wrapper
