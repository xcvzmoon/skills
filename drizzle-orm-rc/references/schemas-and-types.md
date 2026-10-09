# Schemas and types

Use the bundled validator entry point in RC. Do not substitute the separate
stable-era `drizzle-valibot` package.

```ts
// types/user.ts
import type * as v from 'valibot';
import { users } from '@buildr/database';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/valibot';

export const selectUserInputSchema = createSelectSchema(users);
export const insertUserInputSchema = createInsertSchema(users);
export const updateUserInputSchema = createUpdateSchema(users);

export type SelectUserInput = v.InferOutput<typeof selectUserInputSchema>;
export type InsertUserInput = v.InferOutput<typeof insertUserInputSchema>;
export type UpdateUserInput = v.InferOutput<typeof updateUserInputSchema>;
export type User = SelectUserInput;
```

`@buildr/database` is the user's example package, not a universal dependency.
Replace it with the consuming project's existing database export.
Use a runtime `import * as v` when calling Valibot functions.

## Generated schema behavior

Select schemas require selected columns; nullable columns accept null.
Insert schemas make nullable and defaulted columns optional. Update schemas make
columns optional. Generated-always columns are excluded from insert/update;
other identity handling is dialect-specific. Do not assume a generated schema
is a complete request contract or that an update schema rejects an empty patch.

A refinement callback receives the column schema before Drizzle adds nullable
and optional wrappers. A direct schema replacement bypasses those automatic
wrappers and can even bypass column exclusion. Prefer callbacks for constraints
that should preserve database-derived optionality/nullability.

```ts
import * as v from 'valibot';
import { createInsertSchema } from 'drizzle-orm/valibot';
import { users } from '@buildr/database';

export const inputUserSchema = createInsertSchema(users, {
  email: (schema) => v.pipe(schema, v.email()),
});

export const createUserRequestSchema = v.pick(inputUserSchema, ['email', 'name']);
export type CreateUserRequest = v.InferOutput<typeof createUserRequestSchema>;
```

Assumes `users` has non-null text `email` and `name` columns. Pick only writable
fields. Valibot object parsing strips unknown entries; use a deliberately strict
object contract when the endpoint must reject them. UUIDs, timestamps, audit
actors, tenant IDs, and privileged flags normally come from trusted service code.
For patch requests, derive a writable-field schema from `updateUserSchema` and
reject empty patches when the operation requires at least one change.

Valibot output types describe parsed values. For transformations, parse raw input
before handing it to a service that accepts `InferOutput`. Use `InferInput` only
when explicitly modeling a pre-parse input. Date-mode timestamps validate as
`Date`; a JSON timestamp string requires an explicit boundary conversion, and a
serialized response needs its own schema. Do not parse a partial projection or
a relation-expanded result as though it were a full table row; compose a matching
Valibot schema and derive its output type.
