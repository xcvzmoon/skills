# Selecting `.github` files

Generate a file only when its purpose applies.

| File or area            | Include when                                                                   | Omit when                                                                         |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| CI workflow             | The repository has runnable validation/build commands                          | The repository contains no executable project yet                                 |
| Composite setup action  | Setup is repeated across multiple jobs/workflows and has a stable contract     | Only one job uses it or setup differs materially by job                           |
| Release workflow        | Tags, a release script, or an explicit release policy exists                   | No release lifecycle is defined                                                   |
| Deployment workflow/job | A target and deploy command/configuration are present or explicitly requested  | A provider appears only in copied examples or unused dependencies                 |
| Package publication     | Manifest publication metadata and a registry workflow are present or requested | The package is private/non-publishable                                            |
| Dependabot              | The user wants version-update PRs and GitHub supports the ecosystem            | Another updater owns dependency automation or compatibility pins are undocumented |
| Issue forms             | The repository accepts issue-based collaboration                               | Issues are disabled or the repository is not used for collaboration               |
| PR template             | Pull requests are part of the workflow                                         | Changes do not flow through GitHub pull requests                                  |
| Code owners             | Ownership boundaries are known                                                 | Owners would need to be guessed                                                   |
| Security policy/contact | A disclosure route exists                                                      | No valid private contact can be derived                                           |

## CI composition

Build the check job from scripts that actually exist. Preserve repository ordering when one phase generates inputs for the next. A common order is install, format/lint check, generated-file check, typecheck, tests, then build, but do not add commands absent from the project.

For monorepos, inspect the task runner and use its recursive/filter syntax. Do not enumerate packages manually when the workspace already defines a correct aggregate task.

Use path filters only when skipped changes truly cannot affect the job. Documentation-only filters are inappropriate when documentation is built or validated.

## Deployment detection

Require more than a package name. Examples of supporting evidence include a deployment config file, an explicit deploy script, infrastructure directory, environment documentation, or an existing target in repository instructions.

- Cloudflare: Wrangler configuration and deploy/type-generation scripts.
- Pages/static hosting: static build output and a documented hosting target.
- Containers: Dockerfile/Compose plus registry or deployment intent.
- Platform services: provider config plus deploy command and required secrets.

Do not generate Cloudflare permissions, secrets, type checks, Wrangler actions, or production environments for repositories without Cloudflare deployment.

## Release detection

Determine tag format, changelog headings, artifacts, and release authority from release scripts, existing workflows, and tags. A tag-triggered GitHub release workflow is suitable only when another trusted process creates and pushes those tags. Do not create competing version-bump logic inside the workflow.

Use the release-script skill when the user asks to create the release script itself.
