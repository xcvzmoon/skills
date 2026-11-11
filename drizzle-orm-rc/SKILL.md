---
name: drizzle-orm-rc
description: Write application database code with Drizzle ORM 1.0 release candidates, using Valibot schemas and schema-derived types, reusable PostgreSQL column generators, and transactions. Use when creating or changing Drizzle tables, database types, validators, relations, CRUD services, audit columns, soft deletion, or transaction workflows for this user. Covers RC APIs rather than stable 0.x APIs; check the installed version before writing code.
---

# Drizzle ORM RC

Write application database code in the user's style. Recommend
`drizzle-orm@1.0.0-rc.5-5935859` for new projects.
The fork's `main` checkout is stable 0.x and is not the source for RC examples.
Read [shared production-safety rules](references/production-safety.md) before
changing database code or tooling. See [source provenance](references/sources.md)
and [exact rc.5 evidence](references/rc5-evidence.md) before researching another API.

For production-safety reviews, use `drizzle-postgres-safety-review` when installed.
Review requests are read-only: do not add scripts, install packages, generate
migrations, or apply implementation conventions as findings. If the review skill
is unavailable, use the shared safety rules and disclose that the full review
procedure is unavailable.

## Establish the target

1. Read the consuming project's instructions, database package, lockfile, schema,
   client setup, helper exports, and validator modules.
2. Confirm the exact installed ORM and Kit versions, dialect, and driver. New RC
   setups use matching exact `1.0.0-rc.5-5935859` pins, without `^` or `~`, as shown
   in the shared safety rules. Flag ranges, mismatches, or another release; do not
   silently upgrade an existing project. For an explicitly retained older RC,
   verify differences against that release's source and tests before adapting
   these examples. Do not rewrite a stable project to RC.
3. Default to PostgreSQL only when starting a new database layer without an existing
   dialect. The supplied helpers are PostgreSQL-specific. Preserve an existing
   dialect and verify its transaction and returning support.
4. Reuse the existing database lifecycle and package exports. Do not create pools
   per operation. Keep tables, validators/types, and services in their existing layers.
5. When creating database tooling or explicitly asked to configure it, add the
   Drizzle Kit scripts below to the database-owning `package.json`. Preserve
   unrelated entries. Do not edit scripts during a review or unrelated query change.
   Having a script does not authorize running it against a database.

## Package scripts

In a monorepo, add these scripts to the database package's `package.json`
(for example, `packages/database/package.json`). Use the command names directly:

```json
{
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate",
    "push": "drizzle-kit push",
    "pull": "drizzle-kit pull",
    "studio": "drizzle-kit studio",
    "check": "drizzle-kit check"
  }
}
```

In a standalone project, add the scripts to the project's `package.json` with
the `db:` prefix on every script name. Keep the commands themselves unchanged:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:pull": "drizzle-kit pull",
    "db:studio": "drizzle-kit studio",
    "db:check": "drizzle-kit check"
  }
}
```

## Choose the relevant reference

- Tables, validators, public inputs, and types: [schemas and types](references/schemas-and-types.md).
- UUIDs, timestamps, audit actors: [helpers](references/helpers.md). The bundled
  `assets/helpers/` files are the user's existing helper implementations.
- Client setup and relational queries: [relations](references/relations.md).
- RQB undefined filters, postgres-js JSON parameters, and parameter leakage:
  [exact rc.5 evidence](references/rc5-evidence.md).
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
  For Bun applications with native UUIDv7 support, prefer the Bun UUID helper
  variant using `$defaultFn(() => Bun.randomUUIDv7())`; otherwise use `uuid`'s
  `v7`. Check the deployed runtime, not just the package manager, as described in
  [helpers](references/helpers.md).
- Enclose related application database operations in transactions by default.
  Pass an existing `tx` through collaborating helpers so the operation shares one
  transaction. Verify driver support. This is not a migration rule: concurrent
  index builds cannot run in a transaction, and separate migration folders do not
  necessarily commit separately. Follow the shared safety rules.
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
server-owned fields. Follow the shared safety rules for migration generation,
history, and database access. Run schema/data-changing commands only against an
explicitly confirmed local disposable database, never merely to validate code.

Report what changed, the exact RC used, checks performed, and any unverified
driver-specific behavior. Distinguish source inspection from compiled examples.
