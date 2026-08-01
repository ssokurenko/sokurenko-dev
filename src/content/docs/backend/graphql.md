---
title: GraphQL
description: A guided reference to GraphQL schemas, queries, mutations, resolvers, and the execution model.
cheatsheet:
  slug: graphql
  section: backend
  summary: A compact walk through GraphQL schemas, querying, mutations, resolving data, and execution context.
  topicVersion: "October 2021 Spec"
  verifiedAgainst:
    - label: GraphQL Documentation
      url: https://graphql.org/learn/
  lastVerified: 2026-07-31
  difficulty: intermediate
  tags: [graphql, api, data]
  related:
    - backend/express
---

## Mental model

GraphQL is a strongly typed query language for APIs. Instead of multiple endpoints returning fixed data structures (like REST), you expose a single endpoint and a schema. The client asks for exactly what it needs, and the server walks the schema graph, calling resolver functions to assemble precisely that shape in a single response.

## Schemas and types

| Type | Syntax | Purpose |
|---|---|---|
| Scalar | `String`, `Int`, `Boolean` | Primitive values |
| Object | `type User { id: ID! }` | Compound structures |
| Non-null | `String!` | Must not be null |
| List | `[String!]!` | Array of non-null items |

The schema defines the exact capabilities of the API using the Schema Definition Language (SDL). The `Query` and `Mutation` types are the entry points. Every field must resolve to a scalar or another defined type.

```graphql
type User {
  id: ID!
  name: String!
  friends: [User!]!
}

type Query {
  me: User
  user(id: ID!): User
}
```

> **Gotcha:** `[String]!` means the array itself cannot be null, but can contain nulls (`[null]`). `[String!]!` means it cannot be null and must contain only strings.

## Queries and variables

| Concept | Syntax | Result |
|---|---|---|
| Field | `name` | Gets `name` property |
| Argument | `user(id: 4)` | Passes `4` as `id` |
| Alias | `me: user(id: 1)` | Renames key to `me` |

Clients define the shape of the data they want. A query traverses the schema graph, returning a JSON payload matching the query structure exactly. Variables let you pass arguments dynamically instead of string-interpolating.

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    friends {
      name
    }
  }
}
```

> **Warning:** GraphQL always returns an HTTP 200 OK even if there are field-level errors, placing errors in an `errors` array alongside the `data` object.

## Mutations

| Term | Concept | Purpose |
|---|---|---|
| Mutation | `type Mutation` | Schema entry for writes |
| Input | `input UserInput` | Complex arg payload |
| Payload | `type UserPayload`| Mutation response data |

Mutations are used for any operation that causes side-effects. While queries run in parallel, mutations are executed serially to prevent race conditions during updates. It is convention to return the modified object so the client can update its cache.

```graphql
input CreateUserInput {
  name: String!
  age: Int
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

## Resolvers and execution

| Argument | Contains | Typical use |
|---|---|---|
| `parent` | Previous object | Fetching nested data |
| `args` | Field arguments | Filtering, fetching IDs |
| `context` | Shared state | Auth tokens, db pools |
| `info` | AST details | Optimizing queries |

The engine walks the query tree and calls a function (a resolver) for every field. If a field returns a scalar, execution stops there. If it returns an object, the engine steps into that object and calls resolvers for its fields.

```ts
const resolvers = {
  Query: {
    user: (p: any, args: any, ctx: any) => {
      return ctx.db.getUser(args.id);
    },
  },
  User: {
    friends: (p: any, args: any, ctx: any) => {
      return ctx.db.getFriends(p.id);
    },
  },
};
```

> **Gotcha:** If a client asks for 10 users and their friends, `User.friends` runs 10 times, causing 10 separate database queries. This is the "N+1 problem."

## Interfaces and Unions

| Keyword | Use | Constraint |
|---|---|---|
| `interface` | Shared fields | Types must implement |
| `union` | Multiple types | Types share nothing |

Interfaces define a set of fields that multiple types must include. Unions allow a field to return one of several distinct types that don't necessarily share any fields. Clients use inline fragments (`... on Type`) to extract fields specific to the resolved type.

```graphql
union SearchResult = User | Post

query Search($text: String!) {
  search(text: $text) {
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```

## Fragments

| Syntax | Description |
|---|---|
| `fragment Name on Type` | Defines a fragment |
| `...Name` | Spreads it into a query |

Fragments let you define a set of fields once and reuse them across multiple queries. They are crucial for co-locating data requirements with UI components in frontend frameworks.

```graphql
fragment UserDetails on User {
  id
  name
}

query GetUsers {
  me {
    ...UserDetails
  }
  user(id: 4) {
    ...UserDetails
  }
}
```

## Further reading

- [GraphQL Official Learn Docs](https://graphql.org/learn/)
- [Apollo GraphQL Basics](https://www.apollographql.com/docs/)
- [DataLoader (solving N+1)](https://github.com/graphql/dataloader)
