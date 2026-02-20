# GraphQL

Query language for APIs with strongly-typed schema and efficient data fetching.

## Schema Definition

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, content: String!): Post!
}
```

## Resolvers (Node.js/Apollo)

```javascript
const resolvers = {
  Query: {
    user(parent, args) {
      return db.users.findById(args.id);
    },
    users(parent, args) {
      return db.users.find().limit(args.limit);
    },
  },
  User: {
    posts(user) {
      return db.posts.find({ authorId: user.id });
    },
  },
  Mutation: {
    createUser(parent, args) {
      const user = { ...args, id: generateId() };
      db.users.insert(user);
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
```

## Queries

```graphql
# Simple query
query {
  user(id: "1") {
    name
    email
  }
}

# With nested data
query {
  user(id: "1") {
    name
    posts {
      title
      content
    }
  }
}

# With variables
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}
```

## Mutations

```graphql
mutation {
  createUser(name: "John", email: "john@example.com") {
    id
    name
    email
  }
}

mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
  }
}
```

## Subscriptions (Real-time)

```graphql
subscription {
  userCreated {
    id
    name
    email
  }
}
```

## Best Practices

1. **Design efficient schema**
2. **Implement proper error handling**
3. **Use DataLoader to prevent N+1 queries**
4. **Implement authentication/authorization**
5. **Cache resolved data**
6. **Write tests for resolvers**
7. **Version API thoughtfully**

## Advantages

- Strongly typed schema
- Request exactly what you need
- Single endpoint
- Efficient data fetching
- Self-documenting via introspection

## Resources

- [GraphQL Official](https://graphql.org/)
- [Apollo Documentation](https://www.apollographql.com/docs/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
