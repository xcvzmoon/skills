# Exact rc.5 package evidence

Baseline: `drizzle-orm` and `drizzle-kit`, both `1.0.0-rc.5-5935859`.
Inspected the published npm tarballs, not the fork's stable `main` or an unreleased
RC branch. Paths below are relative to each tarball's `package/` directory.

- ORM tarball: `https://registry.npmjs.org/drizzle-orm/-/drizzle-orm-1.0.0-rc.5-5935859.tgz`
  SHA-256: `b8f9a7b3f14fc99aeae2db06b924e0bbb6c7a1568ad933dfaa85bf95cc994d29`.
- Kit tarball: `https://registry.npmjs.org/drizzle-kit/-/drizzle-kit-1.0.0-rc.5-5935859.tgz`
  SHA-256: `32e18f4f45467cf1b73d6bb95b07f42bddefd30582a23bcb854dd2d7a92e126a`.

This file is bundled identically in both Drizzle skills for standalone installation.
Keep the copies in sync. Re-check installed packages and the actual runner before
applying this evidence to a consuming project.

## Migrations

- ORM `migrator.js:6-28`, `readMigrationFiles`: rejects `meta/_journal.json`, finds
  `<folder>/migration.sql`, sorts folders, and splits statement breakpoints. A
  breakpoint is statement separation, not a commit boundary.
- ORM `node-postgres/migrator.js:4-6`: delegates to the shared async Postgres migrator.
  `postgres-js/migrator.js` uses the same shared implementation.
- ORM `pg-core/async/session.js`, `migrate`: one `db.transaction` surrounds the loop
  over all pending migrations and their statements. Concurrent indexes therefore
  conflict with this runner. Two pending folders also share the transaction for
  enum-addition/use checks. This is not a claim about every custom or HTTP runner.
- Kit `api-postgres.mjs`, `writeResult`: writes `<tag>/snapshot.json` and
  `<tag>/migration.sql`.
- Kit `cli.mjs`, `migrateToFoldersV3`: creates folders, writes snapshots/SQL, and
  unlinks old SQL one entry at a time, then removes `meta`. There is no atomic
  filesystem transaction; a failure can leave a partial conversion.

## Relations and client setup

- ORM `relations.js`, `defineRelations`, and `relations.d.ts`: expose the RC
  `defineRelations(schema, callback)` API and `from`/`to` relation configuration.
- ORM `node-postgres/driver.d.ts:11-16`: accepts an object containing configuration
  plus `client` or `connection`. `pg-core/utils.d.ts`, `DrizzlePgConfig`, carries
  `relations`; do not substitute stable `schema` registration examples.
- ORM `relations.js:598-607` and `:642-650`, `relationsFilterToSQL`: explicitly
  `undefined` filters/fields throw. `EmptyFilter` skips a filter; it is exported
  from `drizzle-orm/relations`. Omitted options and explicit undefined values are
  not interchangeable. Never use a no-op to remove required tenant/auth checks.

## JSON and error parameters

- ORM `postgres-js/codecs.js:27-33`: json and jsonb `normalizeParam` call
  `JSON.stringify`. A pre-stringified object becomes a JSON string, not the
  original JSON object. The rule concerns values through these codecs, not every
  string in arbitrary SQL.
- ORM `sql/sql.js:210-219`: bare interpolated arrays expand as parenthesized SQL
  lists. `sql.param` wraps a single parameter instead; choose the correct encoder
  or cast for JSON rather than assuming every raw value follows a column codec.
- ORM `errors.js:11-23`: `DrizzleQueryError` stores `.params` and includes parameters
  in its message unconditionally. No `paramsInErrors` option was found in the
  published ORM JavaScript or declarations. Do not recommend `paramsInErrors: false`
  as protection for this release.
- ORM `pg-core/async/session.js:45-46,55-65`: errors receive parameters, query loggers
  receive parameters, and active tracing records `drizzle.query.params`. Check the
  consuming application's logging, error serialization, and telemetry scrubbing.

## Validators and helpers

- ORM `valibot/schema.js`, `handleColumns` and the three schema factories: callback
  refinements precede null/optional wrappers; direct replacements bypass those
  wrappers and column exclusion. Insert optionality follows nullability/defaults;
  update fields are optional; generated-always columns are omitted from writes.
- ORM `pg-core/index.d.ts`: exports `PgUUIDBuilder`, `PgTimestampBuilder`,
  `AnyPgColumn`, `SetHasDefault`, `SetNotNull`, `SetHasRuntimeDefault`,
  `SetIsPrimaryKey`, and `UpdateDeleteAction`, as used by the bundled helpers.
- ORM `pg-core/columns/common.js`: `$defaultFn` / `$onUpdateFn` are application-side
  hooks. They do not install PostgreSQL defaults/triggers or backfill existing rows.

Source inspection establishes the mechanisms above. It does not establish a
consuming application's query plans, PostgreSQL version, deployment order, or
production cardinality. Never connect to a database just to fill those gaps.
