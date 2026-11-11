# Shared production-safety rules

This file is bundled identically in `drizzle-orm-rc` and
`drizzle-postgres-safety-review` so either skill can be installed alone. Keep both
copies in sync when maintaining this repository.

## Versions and scope

The PostgreSQL review baseline is exactly `1.0.0-rc.5-5935859` for both
`drizzle-orm` and `drizzle-kit`. Require matching exact manifest pins and matching
lockfile resolutions; a range, mismatch, or different release is a finding in
that review. Do not silently upgrade an existing project. For an authorized new
installation with pnpm, use:

```sh
pnpm add -E drizzle-orm@1.0.0-rc.5-5935859
pnpm add -DE drizzle-kit@1.0.0-rc.5-5935859
```

Read `drizzle.config.ts` for `out`, `schema`, and `dialect`; never assume paths.
Inspect only those configuration fields with a targeted, redacting reader. Do
not dump the whole config, evaluate it, read `.env` files, or print/read connection
strings. Follow non-secret imports that resolve schema and migration paths. If
paths cannot be resolved statically without credentials or side effects, report
them as unverified rather than executing the config.

## Database access

- Never run `drizzle-kit push`, `migrate`, or `drop`, or another schema/data-changing
  command, against a database unless it is explicitly confirmed local and disposable.
- A review does not authorize generation, dependency installs, script edits, or
  database writes. Report fixes without applying them.
- Connect for live evidence only through a read-only connection the user explicitly
  provided. Use a preconfigured client/connection handle without inspecting its
  credentials; if the only way to connect would expose a connection string, stop.
- Do not commit or push unless explicitly asked.

## Migration history

- Never edit, rename, reorder, or delete a migration folder already on the main
  branch (or the project's actual default branch). Add a new migration instead.
- Never hand-edit `snapshot.json`.
- RC layout is `<timestamp>_<name>/migration.sql` plus `snapshot.json`, one folder
  per migration. Flat `NNNN_name.sql` with `meta/_journal.json` is legacy. Do not
  mix layouts or silently convert history.
- If authorized `drizzle-kit generate` asks rename-or-create, stop and ask the user.
  A wrong answer can emit DROP + ADD and destroy data.
- Run authorized `drizzle-kit up` only on a clean git tree, as a separately approved
  conversion of historical layout. It is non-atomic. If it fails, do not retry;
  restore the affected migration paths with git after confirming the recovery
  scope. Do not reset unrelated work.

## Deployment safety

Use expand/contract for changes that old and new app versions must both tolerate.
Separate nullable additions, batched backfills, and later constraints. Review
strong locks, rewrites, index builds, data loss, and manual deployment ordering.
A schema diff without a migration is a lead, not proof: runtime hooks, TypeScript
changes, and relation metadata may need no DDL.

`CREATE INDEX CONCURRENTLY` and `DROP INDEX CONCURRENTLY` cannot run inside a
transaction block. The baseline ORM's shared async PostgreSQL migrator wraps all
pending migration statements in one transaction. Verify the installed version,
driver, and actual runner. If a concurrent build would reach that transaction,
report the conflict and ask how the project applies concurrent index builds.
Do not invent a workaround or add transaction-control SQL to bypass the runner.
Splitting enum additions into separate folders also does not create a commit
boundary when both folders run in that same transaction.

See [rc.5 evidence](rc5-evidence.md) for package-level evidence and application
hazards. Do not extrapolate it to another RC or driver without verification.
