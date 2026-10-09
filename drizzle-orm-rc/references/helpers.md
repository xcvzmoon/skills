# Column generators

The bundled `../assets/helpers/` directory contains the user's exact local
`pipong` helpers. Prefer importing existing project helpers. When the project has
none, adapt these files into its database helper directory and export them through
its established entry point. Do not import from the skill folder in application code.

## UUIDs

`generateUuid(name?)` builds a UUID primary key with `uuid` package `v7` as a
Drizzle `$defaultFn`. This default runs in application code; raw SQL inserts must
provide an ID. A database random UUID default changes this behavior and should
not replace it incidentally.

## Timestamps

`generateTimestamps()` creates:

- `createdAt` / `created_at`: non-null, `defaultNow()`.
- `updatedAt` / `updated_at`: non-null, `defaultNow()`, `$onUpdateFn(() => new Date())`.
- `deletedAt` / `deleted_at`: nullable, no default.

All use date mode, precision 3, and time zones. `$onUpdateFn` is a Drizzle runtime
hook, not a PostgreSQL trigger. Raw SQL updates do not receive this behavior.

## Audit actors

`generateTimestampsWithAudit(userId?, createdByOnDelete?, updatedByOnDelete?,
deletedByOnDelete?)` adds required `createdBy` and nullable `updatedBy`/`deletedBy`.
The lazy `userId` callback adds actor foreign keys; omit it for columns without
foreign keys. Defaults are `restrict` for the creator and `set null` for updater
and deleter. Pass actor IDs from authenticated service context.

```ts
import { pgTable, text } from 'drizzle-orm/pg-core';
import { generateTimestamps, generateUuid } from '../helpers';

export const users = pgTable('users', {
  id: generateUuid(),
  ...generateTimestamps(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});
```

The exact builder type exports used by the bundled helpers exist in RC.4 under
`drizzle-orm/pg-core`. Recheck them when changing RC versions rather than copying
old generic signatures from stable docs. Keep helper return types precise so
validators retain default/nullability information. Adapt style and imports to
the target repository; add `uuid` only if the project needs these helpers and
does not already provide UUIDv7 generation.
