---
name: oxc-project-config
description: Install, copy, or synchronize xcvzmoon's Oxlint and Oxfmt rules in a JavaScript or TypeScript repository, either as standalone Oxc configuration or inside Vite+. Always install the maintained anti-slop skill as a prerequisite. Use when adding Oxc, standardizing lint/format policy, or refreshing these shared rules; not for fixing one lint violation.
---

# Oxc Project Config

Apply the Acumen Monitoring Oxlint, Oxfmt, and `anti-slop` policy quickly while adapting framework plugins, paths, runtime support, and commands to the target repository.

## Required baseline

The maintained `install-anti-slop` skill from [dmmulroy/anti-slop](https://www.skills.sh/dmmulroy/anti-slop/install-anti-slop) is mandatory. Do not install the Oxc rule set without first checking whether that skill is available and current. If it is missing, ask the user for permission to install it with the active package manager:

```text
https://github.com/dmmulroy/anti-slop --skill install-anti-slop
```

After it is available, invoke `install-anti-slop` to install or refresh the maintained plugin in the target repository. Do not use a copied anti-slop implementation from this skill. The Effect-specific extension remains opt-in and should be enabled only when the project uses Effect service/layer architecture.

When the skill is already installed but may be stale, ask the user for permission to update it from the same source before configuring Oxc. Use the active package manager's `skills update install-anti-slop --project --yes` command (`pnpm dlx`, `npx`, `bunx`, or `yarn dlx` as appropriate). Never silently pin or preserve an older copy when a refresh is requested.

Reusable source files live in [assets/standalone](assets/standalone). Treat them as a maintained baseline, not files to copy without inspection.

## Choose the integration

Inspect repository instructions, manifests, lockfiles, TypeScript and framework configuration, existing Oxc/ESLint/Prettier/Biome policy, Vite+ usage, generated directories, source extensions, Tailwind usage, and runtime versions.

- Standalone Oxc: copy the baseline `oxlint.config.ts` and `oxfmt.config.ts`, then run `install-anti-slop` and adapt the generated plugin path using [adaptation.md](references/adaptation.md).
- Vite+: run `install-anti-slop`, then merge the baseline formatter and linter fields into `defineConfig({ fmt, lint })`; do not add parallel standalone configs unless the repository requires them for editor/tool compatibility.

Preserve stricter existing rules and intentional overrides. If another formatter/linter is being replaced, remove its dependencies, configs, scripts, hooks, and CI calls only after Oxc covers the required file types and behavior.

## Install prerequisites

Use the existing package manager. Ensure compatible versions of `oxlint`, `oxfmt`, and `@oxlint/plugins` are available directly to the workspace that loads the configuration. Let `install-anti-slop` manage the maintained plugin source and its installation procedure. TypeScript plugin sources require a runtime that can load TypeScript, or an explicit build to JavaScript; do not silently skip `anti-slop` because the runtime is old.

For TypeScript repositories without Vite+, also apply the `typescript-git-hooks` skill. Do not add that Git-hook manager solely because of this skill when Vite+ is present.

## Verify

Run formatting, type-aware linting/typecheck, and the repository's aggregate check. Confirm the local plugin loads and every enabled `anti-slop` rule resolves. Review resulting violations; fix real issues and use narrow documented overrides for proven false positives. Do not disable the prerequisite plugin to make validation pass.

Report copied files, adaptations, dependencies, commands, and any rules intentionally omitted because their framework prerequisite is absent.
