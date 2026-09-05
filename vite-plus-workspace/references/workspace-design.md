# Vite+ workspace design

## Choose the topology

- Single project: keep configuration at the root unless a tool genuinely needs its own config.
- Homogeneous monorepo: use shared root policy and project scripts selected through filters.
- Mixed monorepo: keep shared quality policy at root but retain language- or framework-specific validation inside each package.

Model application, package, tool, and test directories explicitly in the workspace manifest. Do not include generated output.

## Task boundaries

Use built-ins for toolchain operations and `vp run` for scripts or configured tasks. A useful root readiness flow is check, recursive tests, then recursive builds. Configure no-test behavior deliberately for leaf packages that are valid without tests; do not globally hide missing tests by accident.

Cache deterministic tasks, not interactive scripts, release steps, deployment, or tasks whose external inputs are undeclared. Keep development servers uncached and long-running.

## Dependency graph

Catalog dependencies that are intentionally synchronized. Avoid cataloging unrelated leaf-only packages. When Vite is aliased to another implementation, align the catalog, overrides, peer rules, and lockfile so only one effective version is selected. Use `vp why` to verify rather than relying on manifest appearance.

## Migration finish line

Search for old package-manager commands, standalone formatter/linter/test configs, direct binary calls in CI, and stale lockfiles. Preserve exceptions only when Vite+ lacks the needed behavior, and leave the reason next to the exception.
