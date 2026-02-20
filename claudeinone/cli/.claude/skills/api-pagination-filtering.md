# Pagination & Filtering

Techniques for handling large datasets efficiently.

## Cursor-Based Pagination

```typescript
// More efficient for large datasets
interface PaginationResult<T> {
  items: T[];
  nextCursor?: string;
  prevCursor?: string;
  hasMore: boolean;
}

async function getCursorPaginatedUsers(
  cursor?: string,
  limit: number = 20
): Promise<PaginationResult<User>> {
  let query = db.users.orderBy('id', 'asc');

  // Fetch one extra to know if there are more
  const pageSize = limit + 1;

  if (cursor) {
    // Decode cursor (base64 encoded id)
    const decodedCursor = Buffer.from(cursor, 'base64').toString();
    query = query.where('id', '>', decodedCursor);
  }

  const items = await query.limit(pageSize).toArray();

  const hasMore = items.length > limit;
  const results = items.slice(0, limit);

  return {
    items: results,
    nextCursor: hasMore ? Buffer.from(results[results.length - 1].id).toString('base64') : undefined,
    hasMore
  };
}
```

## Offset-Based Pagination

```typescript
// Simple but less efficient for large offsets
async function getOffsetPaginatedUsers(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    db.users.offset(offset).limit(pageSize).toArray(),
    db.users.count()
  ]);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page < Math.ceil(total / pageSize),
      hasPrevPage: page > 1
    }
  };
}
```

## Filtering

```typescript
interface FilterOptions {
  role?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

async function filterUsers(filters: FilterOptions, limit: number = 20) {
  let query = db.users;

  if (filters.role) {
    query = query.where('role', filters.role);
  }

  if (filters.status) {
    query = query.where('status', filters.status);
  }

  if (filters.createdAfter) {
    query = query.where('createdAt', '>=', filters.createdAfter);
  }

  if (filters.createdBefore) {
    query = query.where('createdAt', '<=', filters.createdBefore);
  }

  if (filters.search) {
    query = query.whereRaw('CONCAT(firstName, lastName) LIKE ?', [`%${filters.search}%`]);
  }

  return await query.limit(limit).toArray();
}
```

## Sorting

```typescript
type SortOrder = 'asc' | 'desc';

interface SortOption {
  field: string;
  order: SortOrder;
}

async function getSortedUsers(sort: SortOption, limit: number = 20) {
  // Whitelist allowed sort fields
  const allowedFields = ['id', 'name', 'email', 'createdAt'];

  if (!allowedFields.includes(sort.field)) {
    throw new Error(`Invalid sort field: ${sort.field}`);
  }

  return await db.users
    .orderBy(sort.field, sort.order)
    .limit(limit)
    .toArray();
}
```

## Combined Filtering, Sorting, Pagination

```typescript
interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  role?: string;
  status?: string;
  search?: string;
}

async function queryUsers(options: QueryOptions) {
  let query = db.users;

  // Apply filters
  if (options.role) {
    query = query.where('role', options.role);
  }

  if (options.status) {
    query = query.where('status', options.status);
  }

  if (options.search) {
    query = query.whereRaw(
      'CONCAT(firstName, lastName) LIKE ?',
      [`%${options.search}%`]
    );
  }

  // Apply sorting
  const sortBy = options.sortBy || 'createdAt';
  const order = options.order || 'desc';
  query = query.orderBy(sortBy, order);

  // Apply pagination
  const page = options.page || 1;
  const limit = Math.min(options.limit || 20, 100); // Max 100 items
  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    query.offset(offset).limit(limit).toArray(),
    query.count()
  ]);

  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

## Search Implementation

```typescript
// Full-text search
async function searchUsers(query: string) {
  // MySQL FULLTEXT search
  return await db.users
    .whereRaw(
      'MATCH(firstName, lastName, email) AGAINST(? IN BOOLEAN MODE)',
      [query]
    )
    .toArray();
}

// Elasticsearch integration
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

async function searchUsersES(query: string) {
  const response = await client.search({
    index: 'users',
    body: {
      query: {
        multi_match: {
          query,
          fields: ['firstName', 'lastName', 'email']
        }
      }
    }
  });

  return response.body.hits.hits;
}
```

## Best Practices

✅ **Cursor pagination** - For large datasets
✅ **Limit results** - Cap maximum page size
✅ **Index columns** - For fast filtering/sorting
✅ **Whitelist fields** - Prevent injection
✅ **Cache frequently used** - Popular filters/sorts

## Resources

- [Pagination Patterns](https://slack.engineering/a-method-for-pagination/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/index.html)
