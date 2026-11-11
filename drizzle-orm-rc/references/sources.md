# Source provenance

The baseline is `drizzle-orm` and `drizzle-kit`, both exactly
`1.0.0-rc.5-5935859`. The published npm packages were inspected for the client,
relations, Valibot, helper exports, driver codecs, error parameters, migration
layout, and migration transaction behavior. See [rc.5 evidence](rc5-evidence.md)
for package URLs, hashes, paths, and limits of that verification.

The skill was originally based on upstream `v1.0.0-rc.4` at
`748058e837d9c4247330e3d45580cbdae52bffda`. That is historical provenance, not the
current API baseline. Do not use its examples as evidence for another release.

The fork's previously inspected `main` reported `0.45.4`; its local
`v1.0.0-rc.2` tag pointed to a package reporting `0.45.3` with separate Valibot
integration. Neither stable source nor an unreleased `rc5` development branch
establishes the API of this exact published RC. Inspect installed package source
and declarations without switching the consuming project's checkout.

Use Valibot's variadic `v.pipe(schema, action)` form.

User helper reference:
`https://github.com/xcvzmoon/pipong/tree/main/packages/database/src/helpers`.
The remote URL was inaccessible during creation. The bundled files were copied
from the clean helper directory of the local sibling `pipong` repository at
commit `2da62ce72d46da4480cd68da2aa2ef11d0ccf83e`.
This is a local snapshot, not a claim that the remote main branch was verified.
No pipong application code was changed.

Representative helpers, users/posts relations, Valibot schemas, and a transaction
service were compiled with strict TypeScript against the exact rc.5 package.
Database-free checks exercised relational SQL generation, undefined/EmptyFilter
behavior, input stripping/defaults, array parameter wrapping, and error parameter
inclusion. No database connection was opened. These checks do not replace a
consuming application's typecheck, tests, or driver-specific integration checks.
