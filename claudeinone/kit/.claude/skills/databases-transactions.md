# Database Transactions

## Overview
Transactions ensure ACID guarantees — multiple operations succeed together or roll back entirely.

## Prisma Transactions

```typescript
// Sequential transaction (use result of one in the next)
async function transferFunds(fromId: string, toId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const from = await tx.account.findUniqueOrThrow({ where: { id: fromId } });
    if (from.balance < amount) throw new Error('Insufficient funds');

    await tx.account.update({ where: { id: fromId }, data: { balance: { decrement: amount } } });
    await tx.account.update({ where: { id: toId }, data: { balance: { increment: amount } } });
    await tx.transaction.create({ data: { fromId, toId, amount } });
  });
}

// Batch transaction
const [user, profile] = await prisma.$transaction([
  prisma.user.create({ data: { email, name } }),
  prisma.profile.create({ data: { bio, userId: id } }),
]);
```

## Raw SQL Transactions

```typescript
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function atomicOperation() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO orders (user_id, total) VALUES ($1, $2)', [userId, total]);
    await client.query('UPDATE inventory SET qty = qty - $1 WHERE id = $2', [qty, productId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

## Optimistic Locking

```typescript
// Use version field to detect concurrent updates
const updated = await prisma.post.updateMany({
  where: { id: post.id, version: post.version },
  data: { title: newTitle, version: { increment: 1 } }
});
if (updated.count === 0) throw new Error('Concurrent update — please retry');
```

## Best Practices
- Keep transactions short — long ones hold locks and block others
- Never do HTTP calls inside a transaction
- Use optimistic locking for high-contention data
- Set transaction timeout: `SET statement_timeout = '5s'`

## Resources
- [Prisma transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
