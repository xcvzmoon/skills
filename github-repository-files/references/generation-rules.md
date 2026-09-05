# Generation rules

## Repository identity

Resolve these values independently:

- repository slug: Git remote or GitHub metadata, such as `owner/project-name`;
- machine/package name: manifest `name`;
- human project name: explicit app metadata, README title, or a readable form of the package/repository name;
- default branch: GitHub metadata or remote HEAD.

Use the human project name in issue-form descriptions and contributor-facing prose. Use the repository slug for GitHub URLs. Use the machine name in artifact names only when it is the project's established identifier.

Never hardcode the baseline repository identity into generated output.

## Issue forms

Tailor fields to the product:

- Web UI: browser and browser version, relevant route, viewport/device when useful.
- Desktop application: application version, operating system/version, architecture, install source.
- CLI/library: package version, runtime version, package manager, minimal reproduction.
- Service/API: deployed/self-hosted version, endpoint, sanitized request/response, environment.

Keep a searched-existing-issues preflight check. Ask for expected behavior, actual behavior, reproduction, and sanitized diagnostics. Do not render screenshot uploads as shell code. Add labels only when they exist or document that the repository must create them.

Issue-template `config.yml` should use the target repository's security-advisory and discussion URLs. Include Discussions only when enabled. Do not disable blank issues unless the intended support policy is clear.

## Pull request template

Use the human project name and the repository's title convention. The checklist must list commands contributors can run exactly as written in project scripts. Include tests, documentation, breaking changes, and related issues only when relevant. Avoid requiring a build when the project has no build step.

## Composite setup action

Document whether checkout happens outside the action. Pin the runtime/package-manager version from repository metadata, enable the tool's supported cache when useful, and use the frozen/locked install mode. Composite steps that execute commands require an explicit shell.

Do not create the action merely to wrap checkout plus one install command for a single job.

## CI workflow

- Trigger against the actual default and protected branches; include manual dispatch when useful.
- Use pull-request-safe events. Do not use `pull_request_target` to execute untrusted checkout code.
- Scope permissions minimally. If any permission is declared, remember unspecified permissions become `none`.
- Use a workflow-specific concurrency group containing `github.workflow` and `github.ref`.
- Give jobs bounded timeouts.
- Use a deployment environment and expose its URL only when the deployment step produces a real URL output.
- Keep provider-specific permissions, secrets, and steps on the deployment job rather than the validation job.

## Release workflow

Match the established tag pattern and changelog heading syntax. Verify the tag before creating a hosted release. If extracting notes from `CHANGELOG.md`, handle missing or empty sections with an intentional fallback. Grant `contents: write` only to the release job/workflow.

If artifacts must be built, use a target matrix and pass immutable artifacts into the release job. Do not rebuild differently during upload.

## Dependabot

Select the package ecosystem and directories from lockfiles/workspaces, not preference. Add a GitHub Actions updater only when Actions are present. Grouping should reduce noise without combining dependencies that require independent compatibility review.

Preserve compatibility ignores and add a short YAML comment explaining non-obvious pins. Do not copy ignored packages from the baseline unless the target repository has the same compatibility constraint.
