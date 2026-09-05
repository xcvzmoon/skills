---
name: github-repository-files
description: Generate or update repository-specific files under .github, including CI and release workflows, composite setup actions, Dependabot configuration, issue forms, pull request templates, and community configuration. Use only when the user asks to create, scaffold, standardize, or revise .github contents; do not activate for ordinary feature work that merely runs in GitHub Actions.
---

# GitHub Repository Files

Use the structure and discipline of the Acumen Monitoring `.github` directory as the preferred baseline, then adapt every file to the current repository. Generate only files supported by repository evidence or the user's request.

## Inspect the target

Before writing, read:

- repository instructions, README, manifests, lockfiles, workspace configuration, and the default branch;
- existing `.github` files, Git remotes, repository/project name, description, visibility, topics, labels, and enabled GitHub features when accessible;
- actual format, lint, typecheck, test, build, release, package, and deployment commands;
- runtime and package-manager versions declared by the repository;
- release scripts, tag history, changelog format, deployment configuration, and required secrets.

Derive the display name from the project's own metadata, preferring an explicit product name or manifest description and falling back to the GitHub repository name. Never leave `Acumen Monitoring`, its URLs, commands, secrets, or infrastructure in generated files for another project.

Read [selection.md](references/selection.md) to decide which files apply. Read [generation-rules.md](references/generation-rules.md) when producing workflows or templates.

## Propose the file set

Infer a minimal useful set. Ask a focused question only when an externally visible policy cannot be inferred, such as whether deployments or automated releases are wanted. Do not ask about a capability that the repository clearly lacks.

Typical baseline for an active application or library:

- `.github/workflows/ci.yml`
- `.github/dependabot.yml` when automated dependency updates are desired
- `.github/ISSUE_TEMPLATE/bug-report.yml`
- `.github/ISSUE_TEMPLATE/feature-request.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`

Add a composite setup action only when multiple jobs/workflows repeat meaningful setup. Add release, deployment, publishing, security, or platform-matrix workflows only when the repository has the corresponding scripts/configuration or the user requests that capability.

## Generate safely

- Use the repository's real default branch, package manager, locked install command, runtime version, workspace filters, and validation scripts.
- Give each workflow the minimum `GITHUB_TOKEN` permissions. Prefer read-only defaults and grant write scopes to the specific job that needs them.
- Add concurrency and timeouts appropriate to the job. Do not let a CI concurrency group accidentally cancel a distinct workflow.
- Keep CI validation and deployment separate through jobs or workflows, with deployment dependent on successful checks.
- Reference secrets by descriptive names without inventing secret values.
- Verify current action versions from official action repositories or GitHub documentation; do not copy versions blindly from the baseline.
- Preserve intentional existing customization and merge narrowly. Do not replace the entire directory unless asked.

Creating workflow files does not authorize dispatching workflows, deploying, publishing, creating releases, changing repository settings, labels, or secrets.

## Validate

Parse YAML, inspect workflow expressions, and run a workflow linter when the repository already provides one or it can be used without adding project dependencies. Confirm every referenced script, path, secret name, environment, artifact, and local action exists or is documented as setup the user must complete. Run the underlying local validation commands when appropriate.

Report generated files, omitted optional capabilities, required repository settings/secrets, and validation performed.
