---
name: oxc-project-config
description: Install, copy, or synchronize xcvzmoon's Oxlint and Oxfmt rules in a JavaScript or TypeScript repository, either as standalone Oxc configuration or inside Vite+. Always install the bundled anti-slop Oxlint plugin as a prerequisite. Use when adding Oxc, standardizing lint/format policy, or refreshing these shared rules; not for fixing one lint violation.
---

# Oxc Project Config

Apply the Acumen Monitoring Oxlint, Oxfmt, and `anti-slop` policy quickly while adapting framework plugins, paths, runtime support, and commands to the target repository.

## Required baseline

The core `anti-slop` plugin is mandatory. Do not install the Oxlint rule set without copying `tools/oxlint/anti-slop/`, registering it as the `anti-slop` JavaScript plugin, and enabling its core rules. The Effect-specific extension is opt-in and should be registered only when the project uses Effect service/layer architecture.

Reusable source files live in [assets/standalone](assets/standalone). Treat them as a maintained baseline, not files to copy without inspection.

## Choose the integration

Inspect repository instructions, manifests, lockfiles, TypeScript and framework configuration, existing Oxc/ESLint/Prettier/Biome policy, Vite+ usage, generated directories, source extensions, Tailwind usage, and runtime versions.

- Standalone Oxc: copy the baseline `oxlint.config.ts`, `oxfmt.config.ts`, and complete `tools/oxlint/anti-slop/` tree, then adapt them using [adaptation.md](references/adaptation.md).
- Vite+: copy the complete `anti-slop` tree and merge the baseline formatter and linter fields into `defineConfig({ fmt, lint })`; do not add parallel standalone configs unless the repository requires them for editor/tool compatibility.

Preserve stricter existing rules and intentional overrides. If another formatter/linter is being replaced, remove its dependencies, configs, scripts, hooks, and CI calls only after Oxc covers the required file types and behavior.

## Install prerequisites

Use the existing package manager. Ensure compatible versions of `oxlint`, `oxfmt`, and `@oxlint/plugins` are available directly to the workspace that loads the configuration. TypeScript plugin sources require a runtime that can load TypeScript, or an explicit build to JavaScript; do not silently skip `anti-slop` because the runtime is old.

For TypeScript repositories without Vite+, also apply the `typescript-git-hooks` skill. Do not add that Git-hook manager solely because of this skill when Vite+ is present.

## Verify

Run formatting, type-aware linting/typecheck, and the repository's aggregate check. Confirm the local plugin loads and every enabled `anti-slop` rule resolves. Review resulting violations; fix real issues and use narrow documented overrides for proven false positives. Do not disable the prerequisite plugin to make validation pass.

Report copied files, adaptations, dependencies, commands, and any rules intentionally omitted because their framework prerequisite is absent.
