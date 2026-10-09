# Transactions and services

Default to an explicit transaction around database operations, including reads
when supported by the project's driver. Related statements belong in one outer
transaction. Every statement inside the callback uses `tx`. A helper called
within it receives `tx`; it must not silently switch back to the root `db`.

```ts
import type { SelectUserInput, UpdateUserInput } from '../types/user';
import { and, eq, isNull } from 'drizzle-orm';
import { db, users } from '@buildr/database';

export async function updateUser(id: string, input: UpdateUserInput): Promise<SelectUserInput> {
  return db.transaction(async (tx) => {
    const [user] = await tx
      .update(users)
      .set(input)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  });
}
```

This is an internal persistence example for PostgreSQL. Its caller supplies an
already-validated non-empty patch restricted to writable fields. Public services
should accept the corresponding request-schema output type rather than exposing
every `UpdateUserInput` field. Add authorization and tenant predicates required by the
actual application; an ID predicate alone is not authorization.

- Return the transaction's result. Await statements before leaving the callback.
- Throw to roll back on missing rows or downstream failures. `tx.rollback()` also
  throws. Do not catch and suppress a failure inside the callback, which can let
  earlier writes commit.
- Keep network calls and other external side effects outside the transaction.
  For durable delivery coupled to writes, insert an outbox row in the same
  transaction if the project uses that pattern.
- A transaction alone does not prevent read/modify/write races. Use an atomic
  update, a verified lock, a constraint, or suitable isolation when needed.
- Soft-delete by setting `deletedAt` and the trusted `deletedBy` when present.
  Filter active records explicitly with `isNull(table.deletedAt)`. Restore only
  through a deliberate operation that clears deletion fields together.
- For audit tables, populate `createdBy` on insert, `updatedBy` on update, and
  `deletedBy` on deletion from authenticated context. Do not accept actor IDs from
  request bodies.
- Transaction callbacks and `.returning()` differ by dialect and driver. Verify
  support; do not fabricate callback transactions for HTTP drivers lacking them.
  Explain the limitation and use the driver's documented atomic mechanism when
  it fits the operation.

For shared transaction helpers, derive types from the project's actual configured
client or use verified driver exports. Such plumbing types are distinct from
application row types; row types still come from Valibot schemas. Avoid a generic
repository abstraction solely to hide a few concrete statements.
