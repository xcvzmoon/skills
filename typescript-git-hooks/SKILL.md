---
name: typescript-git-hooks
description: Generate or repair a repository-aware Lefthook configuration for a TypeScript project. Apply automatically during TypeScript project or quality-tooling setup when the repository does not use Vite+; do not add this hook manager to Vite+ repositories unless the user explicitly requests it.
---

# TypeScript Git Hooks

Use Acumen Monitoring's Lefthook policy as the baseline: pre-commit formats and lints staged files, while pre-push runs the repository's full check, typecheck, and tests.

## Eligibility

Inspect manifests, lockfiles, Vite/Vite+ configuration, existing hooks, package scripts, source extensions, monorepo layout, and CI.

- If the repository contains TypeScript and does not use Vite+, add Lefthook as a normal part of project/toolchain setup without asking whether hooks are wanted.
- If Vite+ is present, do not add Lefthook automatically. Use the repository's Vite+ staged/task configuration unless explicitly directed otherwise.
- If another Git-hook manager exists, do not create competing hooks. Migrate only when the user asked to replace it; otherwise preserve it and apply the same behavioral policy where possible.

The source template is [assets/lefthook.yml](assets/lefthook.yml). Read [adaptation.md](references/adaptation.md) before copying it.

## Generate the hook contract

- Pre-commit operates only on staged, relevant files. Formatting may write and restage those files; linting must fail the commit on violations.
- Pre-push runs non-mutating aggregate checks, type checking, and tests in parallel only when they do not modify shared output or depend on one another.
- Use the target package manager and its existing scripts. Add missing conventional scripts only when the installed tooling provides a clear command.
- Include file extensions actually used by the repository. Keep filenames safely passed through Lefthook placeholders rather than shell-generated lists.
- For workspaces, execute the root aggregate commands rather than duplicating every package in YAML.

Do not add `--no-verify` guidance or configure hooks to hide failures. Hooks supplement CI; they do not replace it.

## Install and verify

Add the maintained `lefthook` package as a development dependency using the active package manager. Ensure package-manager lifecycle restrictions allow its install script; pnpm may require `lefthook` in the allowed build-dependency configuration. Run `lefthook install` when automatic installation has not occurred.

Validate the merged configuration, then run each underlying command directly. Test pre-commit behavior with representative staged filenames without committing, and run the pre-push hook explicitly. Do not create commits or push.

Report the hook file, dependency/config changes, skipped jobs, and validation results.
