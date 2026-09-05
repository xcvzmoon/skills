# Adapting the Lefthook baseline

## Package manager

Replace `bun run` with the repository's established script runner, such as `pnpm run`, `npm run`, or `yarn run`. Do not mix package managers. Use the version already declared by the repository.

The npm-distributed Lefthook binary installs hooks through its lifecycle script. For pnpm, allow the `lefthook` build/install lifecycle using the repository's supported `onlyBuiltDependencies` mechanism, or install hooks explicitly. Do not weaken package-manager security settings globally.

## Pre-commit

Build format and lint globs from actual source/config/document formats. Common TypeScript projects may include `ts`, `tsx`, `vue`, `js`, `jsx`, `json`, `jsonc`, `md`, `yml`, `yaml`, and CSS variants, but unused extensions should not be copied automatically.

Formatting should receive `{staged_files}` and use `stage_fixed: true`. This intentionally restages formatter changes and is valid only for pre-commit. Linting receives only lintable staged files. Quote or structure commands as required by the package manager and Lefthook version so filenames containing spaces remain safe.

If formatting and linting both write the same files, do not run them in parallel. The Acumen baseline linter is non-writing, so it can run beside formatting.

## Pre-push

Prefer existing `check`, `typecheck`, and `test` scripts. Omit a job only when the capability genuinely does not exist; do not point multiple names at the same command merely to match the template.

Run jobs in parallel only when they are independent and non-mutating. Generated type checks, builds that write shared output, integration tests using one database, or tests that require a prior build may need ordered jobs.

## Existing hooks and CI

Translate existing Husky/lint-staged/custom-hook behavior before removing it. Ensure CI invokes the same non-mutating quality commands because contributors can disable local hooks. Avoid installing hooks in production/container dependency installs where development dependencies are absent.
