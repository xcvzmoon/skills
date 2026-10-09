# Source provenance

Verified on 2026-10-09. The release used for this skill is
`v1.0.0-rc.4` / `748058e837d9c4247330e3d45580cbdae52bffda` from
`https://github.com/drizzle-team/drizzle-orm`.
Its `drizzle-orm/package.json` reports `1.0.0-rc.4`.

The fork's current `main` reports `0.45.4`. Its local `v1.0.0-rc.2` tag points
to a commit whose package reports `0.45.3` and keeps Valibot in a separate
package. Neither is used as the RC API source here. Upstream also has an `rc5`
development branch; an unreleased branch is not this skill's release baseline.

Read pinned source without changing the checkout:

```sh
git show v1.0.0-rc.4:drizzle-orm/src/valibot/schema.ts
git show v1.0.0-rc.4:drizzle-orm/src/node-postgres/driver.ts
```

Primary evidence at that tag:

- `drizzle-orm/src/valibot/{index,schema,schema.types,column}.ts`
- `integration-tests/tests/validators/valibot/pg.test.ts`
- `drizzle-orm/src/pg-core/columns/{common,uuid,timestamp}.ts`
- `drizzle-orm/src/pg-core/async/session.ts`
- `drizzle-orm/src/node-postgres/driver.ts`
- `drizzle-orm/src/relations.ts`
- `integration-tests/tests/pg/{relations,pg.relations}.ts`
- `changelogs/drizzle-orm/1.0.0-rc.4.md`

The RC Valibot README contains an outdated array-style `pipe` example; the skill
uses Valibot's variadic `v.pipe(schema, action)` form instead.

User helper reference:
`https://github.com/xcvzmoon/pipong/tree/main/packages/database/src/helpers`.
The remote URL was inaccessible during creation. The bundled files were copied
from the clean helper directory of the local sibling `pipong` repository at
commit `2da62ce72d46da4480cd68da2aa2ef11d0ccf83e`.
This is a local snapshot, not a claim that the remote main branch was verified.
No pipong application code was changed.

Examples were checked against source signatures, not compiled against a
complete consuming application. Run that application's checks when applying them.
