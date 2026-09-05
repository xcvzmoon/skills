---
name: vite-plus-workspace
description: Configure, migrate, or repair a TypeScript project or monorepo that uses Vite+ as its unified package, runtime, formatting, linting, testing, build, and task toolchain. Use for Vite+ workspace topology, catalogs, recursive tasks, or command-boundary problems; not for ordinary Vite configuration without Vite+.
---

# Vite+ Workspace

Make Vite+ the coherent toolchain rather than adding it as another wrapper around duplicate tooling.

## Inspect before changing

Read `AGENTS.md`, `package.json`, the workspace manifest, `vite.config.*`, lockfiles, TypeScript configs, and CI. Run `vp toolchain` when available. Distinguish built-ins (`vp check`, `vp test`, `vp build`) from scripts/tasks (`vp run <name>` or `vpr <name>`). Do not assume a same-named package script overrides a built-in.

For a monorepo or migration, read [workspace-design.md](references/workspace-design.md).

## Configure one command surface

- Declare the package-manager version through `devEngines.packageManager`; preserve `packageManager` only where ecosystem tools require it.
- Centralize shared dependency versions in a workspace catalog and use `catalog:` intentionally. Keep overrides narrow, especially for Vite aliases.
- Put tool behavior in `vite.config.ts`: formatting, type-aware linting, tests, packaging, staged-file handling, and task caching.
- Use root scripts for product-facing shortcuts and `vp run`, `vpr`, filters, or recursive execution for project tasks.
- Make the root readiness command cover formatting/lint/type checks, tests, and builds without running long-lived development servers.
- Mirror aliases needed by tests instead of relying on an application framework to inject them.

Preserve project-specific formatting and lint rules. Do not copy a large preset blindly. A migration is complete only when obsolete configs, dependencies, and CI invocations are removed or explicitly retained for a documented gap.

## Verify

Run `vp install`, `vp check`, `vp test`, and relevant `vp run <task>` commands. If setup or resolution is inconsistent, run `vp env doctor`, `vp toolchain`, and `vp why <package>`. Report commands that have no tests separately from actual failures.
