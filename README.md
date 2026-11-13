# xcvzmoon's skills

Installable agent skills distilled from working software and maintained engineering practices.

| Skill                                                                 | Use it for                                                                                                                     |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`release-script-generator`](./release-script-generator/)             | Repository-aware release scripts across forges, version schemes, registries, and artifact workflows                            |
| [`github-repository-files`](./github-repository-files/)               | Repository-adaptive workflows, templates, Dependabot, and other `.github` files                                                |
| [`vite-plus-workspace`](./vite-plus-workspace/)                       | Vite+ project and monorepo toolchain configuration                                                                             |
| [`motion-v`](./motion-v/)                                             | Vue/Nuxt animation with motion-v, including fork-specific directives, Reorder, scroll, presence, and view transitions          |
| [`nuxt-tauri-app`](./nuxt-tauri-app/)                                 | Coordinated Nuxt and Tauri development, builds, capabilities, and versions                                                     |
| [`nitro-service-architecture`](./nitro-service-architecture/)         | Typed, authenticated, persistence-backed standalone Nitro services                                                             |
| [`typesafe-runtime-config`](./typesafe-runtime-config/)               | Nested environment configuration with runtime validation and inferred types                                                    |
| [`napi-rs-package`](./napi-rs-package/)                               | Cross-platform Rust-powered Node packages and native publication pipelines                                                     |
| [`typescript-quality-gates`](./typescript-quality-gates/)             | Type-aware quality policy and evidence-driven custom lint rules                                                                |
| [`oxc-project-config`](./oxc-project-config/)                         | Reusable Oxfmt, Oxlint, and required `anti-slop` project policy                                                                |
| [`typescript-git-hooks`](./typescript-git-hooks/)                     | Adaptive Lefthook checks for TypeScript repositories without Vite+                                                             |
| [`xcvzmoon-code-conventions`](./xcvzmoon-code-conventions/)           | Shared editing, TypeScript, validation, toolchain, and agent-operation rules                                                   |
| [`drizzle-orm-rc`](./drizzle-orm-rc/)                                 | Drizzle ORM RC database code with Valibot schemas and types, reusable UUID and audit helpers, and transaction-based operations |
| [`drizzle-postgres-safety-review`](./drizzle-postgres-safety-review/) | Read-only production-safety reviews for Drizzle rc.5 and PostgreSQL migrations, queries, and deployments                       |

Each directory is a self-contained skill with a required `SKILL.md` and optional instructions loaded only for relevant workflows.

The two Drizzle skills bundle identical `references/production-safety.md` and
`references/rc5-evidence.md` files so either can be installed alone. Keep both
copies in sync when changing their shared rules or release evidence.

## Install

Install one skill from this repository with the `skills` CLI:

```sh
npx skills add https://github.com/xcvzmoon/skills --skill github-repository-files
```

Replace `github-repository-files` with the directory name of the skill you need. To install every skill:

```sh
npx skills add https://github.com/xcvzmoon/skills --skill '*'
```

Use the equivalent `vpx`, `pnpx`, `bunx`, or `yarn dlx` command when that is the repository's active package manager.

The repository must be pushed to GitHub before others can install it. Public repositories work without additional credentials. Private repositories require GitHub authentication with access to the repository.

The `oxc-project-config` skill requires the maintained [`install-anti-slop`](https://www.skills.sh/dmmulroy/anti-slop/install-anti-slop) skill and will ask before installing or updating it when it is not available.
