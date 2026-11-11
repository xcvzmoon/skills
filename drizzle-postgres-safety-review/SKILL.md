---
name: drizzle-postgres-safety-review
description: Review Drizzle ORM and PostgreSQL changes for production degradation before merge or deployment. Use for database-safety reviews of migrations, schemas, relations, queries, Drizzle configuration, or RC upgrades, including lock hazards, data loss, rollout compatibility, and rc.5 query behavior. Targets drizzle-orm and drizzle-kit at exactly 1.0.0-rc.5-5935859. Report findings without editing files; do not use implementation conventions as review criteria.
---

# Production-safety review: Drizzle + PostgreSQL

Answer: **would this change, once merged and deployed, degrade the running database
or the app on top of it?** Ignore style, naming, and test coverage. Report findings;
do not modify files unless separately asked.

Read [shared safety rules](references/production-safety.md) and
[exact-release evidence](references/rc5-evidence.md) before investigating. These
references are bundled locally so this skill works without another installed skill.

## Budget and scope

Use at most 20 tool calls, including reference reads. Print `budget n/20` before
each call, where n is the number already used. Count each child call in a parallel
wrapper separately; do not delegate around the limit. Batch related inspection.
At 19 calls used, stop investigation and write the verdict with unverified items.

1. Establish the base and head commits for the requested diff, including uncommitted
   changes only when requested. If the base is ambiguous, ask instead of guessing.
2. Read only the non-secret `out`, `schema`, and `dialect` fields from
   `drizzle.config.ts` using the shared rules. Resolve their actual paths/globs and
   imported path definitions. Do not assume a `drizzle/` directory.
3. Scope includes files under `out`, configured schema files, relations files,
   `drizzle.config.ts`, and code using `db.query`, `db.execute`, or `sql`, including
   aliases and wrappers found through imports. Also inspect changed ORM/Kit manifest
   pins, lockfile resolutions, client setup, and migration runners needed to
   establish version, driver, logging, and deployment behavior.
4. If nothing in scope changed, or only comments, docs, or tests changed, stop and
   reply exactly `No database impact.` Do not install dependencies or run generation.
5. For a non-PostgreSQL project or an unavailable config/diff, report the unsupported
   or missing evidence as `needs-review`; do not apply PostgreSQL assumptions or
   return a clean `go`.

## Procedure

1. **Heuristic pass.** Scan new migration SQL and the schema/application diff against
   the checks below. Every hit seeds a trajectory, not an automatic finding.
2. **Investigate each trajectory.** Build its causal chain with evidence for every
   link, then try to refute it as hard as you try to confirm it. Read historical
   migrations and callers only as needed to establish existence and compatibility.
3. **Verdict.** Report statuses, concrete fixes, and anything the budget or unavailable
   evidence prevented checking. Do not call the review complete when scope is unread.

## Migration heuristics

| Pattern                                                                        | Why it hurts                                                    | Safe form to investigate                                                                                             |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `CREATE [UNIQUE] INDEX` without `CONCURRENTLY` on an existing table            | Blocks writes throughout the build                              | Concurrent build, subject to the runner conflict below                                                               |
| `DROP INDEX` without `CONCURRENTLY`, or an index still needed by queries       | Exclusive lock; losing the index may cause sequential scans     | Check filters, sorts, joins, and replacement indexes first; concurrent drop where supported                          |
| `ADD COLUMN ... NOT NULL` without a default                                    | Fails on a populated table                                      | Add nullable, backfill in batches, then constrain                                                                    |
| `ADD COLUMN` with a volatile default such as `gen_random_uuid()` or `random()` | Table rewrite under ACCESS EXCLUSIVE                            | Add nullable, backfill, then set default; non-volatile defaults are metadata-only on PG 11+                          |
| `ALTER COLUMN ... SET NOT NULL`                                                | Full scan under ACCESS EXCLUSIVE without a proving constraint   | Add `CHECK (col IS NOT NULL) NOT VALID`, validate, then set NOT NULL on PG 12+                                       |
| `ALTER COLUMN ... TYPE`                                                        | Often rewrites the table under ACCESS EXCLUSIVE                 | Expand/contract with a new column and backfill; refute when a verified conversion avoids rewrite                     |
| Immediately validated `ADD FOREIGN KEY` or `ADD CHECK`                         | Table scan while locks are held                                 | Add `NOT VALID`, then `VALIDATE CONSTRAINT`; still inspect lock duration and runner transaction scope                |
| `ADD CONSTRAINT ... UNIQUE`                                                    | Builds an index under lock                                      | Concurrent unique index, then `ADD CONSTRAINT ... USING INDEX`, subject to runner compatibility                      |
| Drop or rename of a column/table still read by deployed code                   | Errors during rolling deployment                                | Search outside migrations, including old-version code at the base; expand/contract across deploys                    |
| DROP + ADD of a same-type column                                               | Possible misread rename and data loss                           | Ask intent; a new custom migration with `ALTER ... RENAME` when it is a rename                                       |
| Removed or reordered enum values                                               | May recreate the type and rewrite dependent columns             | Inspect emitted SQL as a column-type change                                                                          |
| `ALTER TYPE ... ADD VALUE` used before its transaction commits                 | PostgreSQL rejects use of the new value                         | Separate committed migration runs; separate folders alone are insufficient                                           |
| DDL and backfill together, or an unbatched `UPDATE` / `INSERT ... SELECT`      | Long transactions, row locks, WAL bloat                         | Separate custom migration (`generate --custom`) and bounded batches with verified commit boundaries                  |
| Strong-lock DDL without `SET lock_timeout`                                     | Waits behind long queries and queues later operations           | Bound lock acquisition, for example `SET lock_timeout = '5s'`; this does not remove the underlying lock hazard       |
| Schema change without a new migration folder                                   | Required DDL may never reach the database                       | Determine whether it changes persisted schema; refute runtime/type-only changes; do not run `generate` during review |
| Manual prerequisite or deploy ordering requirement                             | Extensions, grants, data fixes, or release order may be missing | Verify documented or automated ordering                                                                              |

A `NOT VALID` clause avoids the initial validation scan, not every lock. Inspect
whether later validation shares the transaction that acquired a stronger lock.
Likewise, a newly created table can be populated by earlier statements before a
hazardous operation. Read statement order, not just table creation presence.

## Application heuristics

- New filters, ordering, or joins without a suitable index. Check composite index
  prefixes, predicates, expression indexes, and existing historical indexes. Missing
  schema declarations alone do not prove a sequential scan or harmful plan.
- RQB v2 filter fields or explicit `where` values that can be `undefined`. rc.5
  throws; omit the filter or use `EmptyFilter` from `drizzle-orm/relations` when a
  no-op is intended. Preserve authorization and tenant restrictions. Optional input
  must not silently disable a required access-control filter.
- postgres-js json/jsonb column parameters manually passed through `JSON.stringify`.
  The driver's codecs stringify them again. For JSON arrays interpolated into
  `sql`, inspect the parameter path and use `sql.param(value)` to avoid SQL-list
  expansion; verify the appropriate JSON encoder/cast for that query.
- New or changed error logging, query logging, or telemetry that exposes parameters.
  This exact RC's `DrizzleQueryError` includes parameters without a
  `paramsInErrors` switch. Verify scrubbing of message, `.params`, cause, and tracing
  attributes. If code adds `paramsInErrors: true`, flag the intent and verify whether
  its actual client supports it; do not claim the option exists in this baseline.
- Application reads of columns, tables, or enum values absent from both new and
  historical migrations. Establish rollout order before claiming they exist at use.
- Version ranges, mismatched ORM/Kit versions, or resolutions outside the baseline.
  Cite the manifest and lockfile. Report violations; do not install the fix.

## Trajectories and evidence

A trajectory is one causal chain: trigger → changed code → observable degradation.
Cite every link with `file:line`, SQL, a grep result, or explicitly authorized
read-only live evidence. Include evidence against the hypothesis, not just matches.

Default to existing tables being large and continuously written. Static SQL is
enough to confirm a lock or rewrite mechanism under that assumption. A table
created in this PR (or an unmerged migration) is empty by construction unless
preceding SQL or deployment evidence shows it has been populated; refute its
size-dependent build/scan hazards accordingly. Emptiness does not refute invalid
SQL, transaction restrictions, missing dependencies, or rollout errors.

Statuses:

- `confirmed`: every causal link is verified. Lock/rewrite hazards may be confirmed
  statically under the existing-table assumption. For an exact-pin policy violation,
  identify it as a policy blocker without inventing a proven runtime failure.
- `plausible`: the mechanism is real but impact depends on unavailable evidence,
  such as deploy order, planner choice, or an external dependency.
- `refuted`: evidence defeats the trajectory, such as an empty table for a
  size-dependent hazard, a suitable proving constraint, or an unused identifier.
  A small table alone does not refute rollout incompatibility or data loss.

Live size/planner evidence is optional, never an excuse to connect without permission.
Use `pg_class.reltuples`, `pg_stat_user_tables`, or other read-only queries only over
an explicitly provided read-only connection. Do not run `EXPLAIN ANALYZE` on writes.

## Concurrent indexes need a human decision

Inspect the actual migration entry point and installed driver. The verified
baseline async Postgres migrator applies pending migrations in one transaction.
`CREATE INDEX CONCURRENTLY` cannot run there. If the project sends the statement
through that runner, confirm the deployment failure. If the runner is unknown,
mark it plausible. Ask how the project applies concurrent index builds. Do not
invent a workaround, assume statement breakpoints commit, or edit the migration.

## Verdict

- `no-go`: at least one confirmed trajectory or confirmed exact-pin policy blocker.
- `needs-review`: none confirmed, but at least one plausible trajectory or a material
  gap in scope, source verification, or deployment evidence. List human checks.
- `go`: no trajectories, or all refuted, and no material review gaps.

```text
Verdict: no-go | needs-review | go   (budget used: n/20)
Base: <commit>  Head: <commit or requested working-tree scope>

1. <title>: confirmed | plausible | refuted
   Trigger:   <what runs or deploys>
   Mechanism: <file:line, SQL, why it hurts; evidence for and against>
   Impact:    <what degrades, for whom; distinguish policy-only blockers>
   Fix:       <the safe form, concretely; human decision where required>

Unverified: <anything not checked, or none>
```

## Re-review on new commits

Start a fresh budget and load the previous report and its base/head. Do not quietly
fold new commits into the previous reasoning. Carry forward trajectories only after
mapping their citations and confirming the cited content and relevant dependencies
are unchanged; do not trust identical line numbers alone. Re-check changed evidence
and scan only the new commits' diff for new hazards. A removed hazardous statement
moves its trajectory to `refuted`, citing the replacement lines or deleted diff hunk.
If the base changed or no trustworthy prior report exists, perform a full review.
