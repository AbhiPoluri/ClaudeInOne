# GraphQL

Query language for APIs with strong typing and efficient data fetching.

## Setup

```bash
npm install apollo-server graphql
```

## Schema Definition

```typescript
import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post!]!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users(limit: Int = 10, offset: Int = 0): [User!]!
    post(id: ID!): Post
    searchPosts(query: String!): [Post!]!
  }

  type Mutation {
    createUser(email: String!, name: String!): User!
    updateUser(id: ID!, name: String): User
    deleteUser(id: ID!): Boolean!
    
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Boolean!
  }

  type Subscription {
    userCreated: User!
    postCreated: Post!
  }
`;
```

## Resolvers

```typescript
const resolvers = {
  Query: {
    user: async (_, { id }) => {
      return await userRepository.findById(id);
    },
    
    users: async (_, { limit, offset }) => {
      return await userRepository.find()
        .limit(limit)
        .offset(offset);
    },
    
    searchPosts: async (_, { query }) => {
      return await db('posts')
        .whereRaw('MATCH(title, content) AGAINST(? IN BOOLEAN MODE)', [query]);
    }
  },

  Mutation: {
    createUser: async (_, { email, name }, context) => {
      // Verify auth
      if (!context.user) throw new Error('Unauthorized');
      
      const user = await userRepository.create({ email, name });
      eventBus.emit('user:created', user);
      return user;
    },
    
    updatePost: async (_, { id, title, content }, context) => {
      const post = await postRepository.findById(id);
      
      // Verify ownership
      if (post.authorId !== context.user.id) {
        throw new Error('Forbidden');
      }

      return await postRepository.update(id, { title, content });
    }
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(['USER_CREATED'])
    }
  },

  // Field resolvers
  User: {
    posts: async (user) => {
      return await postRepository.findByUserId(user.id);
    }
  },

  Post: {
    author: async (post) => {
      return await userRepository.findById(post.authorId);
    }
  }
};
```

## Apollo Server Setup

```typescript
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
    loaders: createDataLoaders()
  })
});

await server.start();
server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log('GraphQL server running on http://localhost:4000/graphql');
});
```

## Data Loaders (N+1 Prevention)

```typescript
import DataLoader from 'dataloader';

function createDataLoaders() {
  const userLoader = new DataLoader(async (userIds) => {
    return await userRepository.findByIds(userIds);
  });

  const postLoader = new DataLoader(async (postIds) => {
    return await postRepository.findByIds(postIds);
  });

  return { userLoader, postLoader };
}

// Use in resolvers
Post: {
  author: (post, _, { loaders }) => {
    return loaders.userLoader.load(post.authorId);
  }
}
```

## Client Usage

```typescript
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      posts {
        id
        title
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
    }
  }
`;

function UserProfile({ userId }) {
  const { data, loading } = useQuery(GET_USER, { 
    variables: { id: userId } 
  });

  const [createPost] = useMutation(CREATE_POST);

  const handleCreate = async (title, content) => {
    await createPost({ variables: { title, content } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <button onClick={() => handleCreate('New Post', 'Content')}>
        Create Post
      </button>
    </div>
  );
}
```

## Best Practices

✅ **Validate input** - Use custom scalar types
✅ **Batch queries** - Use DataLoaders for N+1 prevention
✅ **Rate limiting** - Protect against expensive queries
✅ **Error handling** - Return meaningful errors
✅ **Caching** - Use APQ (Automatic Persisted Queries)

## Resources

- [GraphQL Official](https://graphql.org/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
