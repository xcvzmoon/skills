# RC relations and client setup

The pinned rc.5 uses `defineRelations` and client configuration with `relations`. Do not
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
      to: r.posts.userId,
    }),
  },
  posts: {
    author: r.one.users({
      from: r.posts.userId,
      to: r.users.id,
    }),
  },
}));

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, relations });
```

This assumes `databaseUrl` is already validated configuration and `schema`
exports `users` and `posts`, with `posts.userId` matching `users.id`. Reuse the
project's pool and shutdown lifecycle instead of introducing a second one.
The pinned rc.5 node-postgres overload accepts an object with `client` or `connection`;
do not assume `drizzle(pool, { schema })` from stable examples is accepted.

Declare real foreign keys on tables where integrity requires them. Relation
metadata does not create database constraints. Set `optional: false` on a
one-relation only when existence is actually guaranteed.

RC relational filters use object syntax; ordinary SQL builders use expressions
such as `eq(users.id, id)`. Verify query options against the exact RC tests before
writing nested filters, ordering, many-to-many relations, or pagination. Do not
mix stable relational callback syntax into RC object filters.

In this rc.5, explicitly `undefined` filters and filter fields throw. Omit an
optional filter or use `EmptyFilter` from `drizzle-orm/relations` when a no-op is
intended. Never turn a missing tenant or authorization value into a no-op; reject
it at the boundary. See [rc.5 evidence](rc5-evidence.md) for the implementation.

For postgres-js json/jsonb column parameters, pass the original value rather than
manually calling `JSON.stringify`; its codecs already stringify. Bare arrays in
`sql` expand as SQL lists. Use `sql.param(value)` when the array must be one JSON
parameter, with the appropriate encoder or cast for the query. Check the actual
parameter path before changing existing serialization.

The baseline's `DrizzleQueryError` includes parameters in its message and `.params`
without a `paramsInErrors` configuration switch. Scrub error messages, structured
error fields, query logs, and telemetry before sending them to logs or clients.
Do not assume disabling a logger also removes parameters from errors.

Prefer the ordinary select/join builders when relational querying is unnecessary.
For relation-expanded application types, compose table-derived Valibot schemas
with the relationship shape and derive the resulting `InferOutput` type.
