---
name: drizzle-orm-rc
description: Write application database code with Drizzle ORM 1.0 release candidates, using Valibot schemas and schema-derived types, reusable PostgreSQL column generators, and transactions. Use when creating or changing Drizzle tables, database types, validators, relations, CRUD services, audit columns, soft deletion, or transaction workflows for this user. Covers RC APIs rather than stable 0.x APIs; check the installed version before writing code.
---

# Drizzle ORM RC

Write application database code in the user's style. This skill is grounded in
`drizzle-orm@1.0.0-rc.4`, commit `748058e837d9c4247330e3d45580cbdae52bffda`.
The fork's `main` checkout is stable 0.x and is not the source for RC examples.
See [source provenance](references/sources.md) before researching another API.

## Establish the target

1. Read the consuming project's instructions, database package, lockfile, schema,
   client setup, helper exports, and validator modules.
2. Confirm the exact installed ORM and Kit versions, dialect, and driver. Use the
   project's pinned RC. For another RC, verify differences against that release's
   source and tests before adapting these examples. Do not silently install a new
   version or rewrite a stable project to RC.
3. Default to PostgreSQL only when starting a new database layer without an existing
   dialect. The supplied helpers are PostgreSQL-specific. Preserve an existing
   dialect and verify its transaction and returning support.
4. Reuse the existing database lifecycle and package exports. Do not create pools
   per operation. Keep tables, validators/types, and services in their existing layers.

## Choose the relevant reference

- Tables, validators, public inputs, and types: [schemas and types](references/schemas-and-types.md).
- UUIDs, timestamps, audit actors: [helpers](references/helpers.md). The bundled
  `assets/helpers/` files are the user's existing helper implementations.
- Client setup and relational queries: [relations](references/relations.md).
- CRUD, atomic workflows, and soft deletion: [transactions](references/transactions.md).

## Apply the user's conventions

- Use plural SQL table names and declaration identifiers, such as `users`.
- Generate select, insert, and update schemas with `drizzle-orm/valibot`.
- Derive application data types through Valibot `InferOutput`. Do not use
  `$inferSelect`, `$inferInsert`, `InferSelectModel`, or `InferInsertModel` for these
  types. Ordinary inference for query callbacks and helper builders is welcome.
- Use camelCase schema names and the demonstrated naming pattern:
  `selectUserInputSchema`, `insertUserInputSchema`, `updateUserInputSchema`,
  `SelectUserInput`, `InsertUserInput`, `UpdateUserInput`, and `User = SelectUserInput`.
- Reuse `generateUuid`, `generateTimestamps`, and `generateTimestampsWithAudit`.
  Create fresh builders by calling the generators for each table.
- Enclose database operations in transactions by default. Pass an existing `tx`
  through collaborating helpers so the entire operation shares one transaction.
  Verify the driver supports the chosen transaction API.
- Validate external input once at the boundary. Derive an explicit allowed-field
  request schema from the database schema; server-owned fields must not become
  writable merely because an insert or update schema includes them.
- Match project formatting and imports. Use named functions, type-only imports,
  and safe narrowing. Avoid casts, `any`, non-null assertions, and speculative
  generic repository frameworks.

## Verify and deliver

Check imports and signatures against the pinned RC, then run the consuming
project's relevant typecheck and tests. For writes, verify rollback on a later
failure, missing-row behavior, authorization predicates, and default handling.
For schemas, verify required/defaulted/nullable fields and rejected or stripped
server-owned fields. Do not run migrations against a live database merely to
validate generated code.

Report what changed, the exact RC used, checks performed, and any unverified
driver-specific behavior. Distinguish source inspection from compiled examples.
