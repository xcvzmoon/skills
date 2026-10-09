# RC relations and client setup

RC.4 uses `defineRelations` and client configuration with `relations`. Do not
carry over stable `relations(table, ({ one, many }) => ...)` examples or assume
that a `schema` option registers RC relational queries.

```ts
import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    posts: r.many.posts({
      from: r.users.id,
      to: r.posts.userId
    }),
  },
  posts: {
    author: r.one.users({
      from: r.posts.userId,
      to: r.users.id
    }),
  },
}));

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, relations });
```

This assumes `databaseUrl` is already validated configuration and `schema`
exports `users` and `posts`, with `posts.userId` matching `users.id`. Reuse the
project's pool and shutdown lifecycle instead of introducing a second one.
The RC.4 node-postgres overload accepts an object with `client` or `connection`;
do not assume `drizzle(pool, { schema })` from stable examples is accepted.

Declare real foreign keys on tables where integrity requires them. Relation
metadata does not create database constraints. Set `optional: false` on a
one-relation only when existence is actually guaranteed.

RC relational filters use object syntax; ordinary SQL builders use expressions
such as `eq(users.id, id)`. Verify query options against the exact RC tests before
writing nested filters, ordering, many-to-many relations, or pagination. Do not
mix stable relational callback syntax into RC object filters.

Prefer the ordinary select/join builders when relational querying is unnecessary.
For relation-expanded application types, compose table-derived Valibot schemas
with the relationship shape and derive the resulting `InferOutput` type.
