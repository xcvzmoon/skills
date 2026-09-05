# Release automation decisions

Use this catalog to cover relevant release shapes, not as a questionnaire to ask verbatim. Repository evidence should answer routine choices. Ask the user about unresolved policy and externally visible behavior.

## Question patterns

Adapt these to what was detected and put the likely answer first as the recommended option:

- "Where should the script create the hosted release: GitHub, GitLab, both, or neither?"
- "Should versions be stable-only, support `alpha`/`beta`/`rc` prereleases, or use another channel scheme?"
- "Should tags use `v1.2.3`, bare `1.2.3`, package-scoped tags, or the repository's existing custom format?"
- "Should this script stop after preparing the commit and tag, push them, create the hosted release, publish packages, or upload built artifacts too?"
- "Is this one shared version, independently versioned workspace packages, or a multi-runtime app whose manifests must remain synchronized?"
- "Should it be interactive for local use, non-interactive for CI, or support both with `--dry-run` and `--yes` modes?"

Offer only options that remain plausible after inspection, and allow a custom answer when the listed choices are incomplete.

## Version model

| Decision            | Common options                                                                           | Important consequences                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Scheme              | SemVer, CalVer, date/build number, custom                                                | Determines parsing, ordering, and bump arguments.                                                            |
| Release type        | `patch`, `minor`, `major`, exact version, inferred conventional bump                     | Inference needs a documented commit convention and an override.                                              |
| Prerelease          | none, `alpha`, `beta`, `rc`, `next`, `canary`, custom                                    | Define entering, incrementing, promoting, and leaving a channel, including identifiers such as `1.2.0-rc.2`. |
| Tag format          | `v1.2.3`, `1.2.3`, `pkg@1.2.3`, custom prefix                                            | Must agree with CI triggers, changelog ranges, and hosted releases.                                          |
| Initial development | ordinary SemVer or custom `0.x` major behavior                                           | A requested `major` from `0.0.x` or `0.x.y` may intentionally behave differently.                            |
| Version source      | `package.json`, workspace manifest, Cargo, Python, mobile/desktop config, dedicated file | Select one authority and define all synchronized mirrors and lockfiles.                                      |

For prereleases, clarify whether a stable bump starts the channel (`1.2.3` to `1.3.0-beta.0`), continues it (`beta.0` to `beta.1`), changes channels, or promotes the same base version to stable.

## Repository scope

- Single package or application: one version and tag is usually sufficient.
- Fixed-version monorepo: bump all selected packages together and define private-package handling.
- Independent monorepo: select changed packages, dependency propagation, per-package tags, and aggregate versus per-package changelogs.
- Multi-runtime application: synchronize sources such as `package.json`, `Cargo.toml`, lockfiles, Tauri/Electron configuration, mobile build numbers, or platform manifests.
- No manifest version: derive from tags or maintain a dedicated version file only if the user chooses that model.

Do not treat a workspace as independently versioned just because it contains several manifests.

## Release destinations and publication

Separate the Git forge from artifact registries; a release may use either or both.

- Forge release: GitHub (`gh` or API), GitLab (`glab` or API), Gitea/Forgejo, another provider, or none.
- Package registry: npm-compatible registry, JSR, PyPI, crates.io, Maven, NuGet, RubyGems, or a private registry.
- Images: single- or multi-platform OCI images, registry destinations, tags, and latest-tag policy.
- Application artifacts: archives, installers, checksums, signatures, update manifests, symbols, and platform-specific bundles.
- Multiple destinations: decide ordering and what happens after partial success. Prefer idempotent existence checks and explicit resume behavior.

Clarify draft versus published releases, prerelease marking, generated versus supplied notes, asset naming, provenance, signing, attestations, and credential environment variables when relevant.

## Changelog and release notes

Possible sources include conventional commits, changelogen, Changesets, release-please metadata, manually curated fragments, Git forge generated notes, or no changelog. Determine:

- commit/tag range and first-release behavior;
- monorepo aggregation;
- whether version headings and comparison links are written back;
- whether release notes equal the changelog section or are generated separately;
- handling of breaking changes, reverts, merge commits, contributor credits, and hidden/internal changes.

Preserve an existing tool unless the user requests a migration.

## Git and execution policy

Resolve only applicable choices:

- allowed source branches and detached-head behavior;
- clean tree required, selected dirty files allowed, or stash behavior;
- release commit or tag-only flow;
- annotated, lightweight, or signed tags and signed commits;
- push remote, atomic push support, upstream selection, and protected branches;
- local interactive execution, CI-only execution, or a local planner plus CI publisher;
- manual input, workflow dispatch, tag push, merge, schedule, or conventional-commit trigger;
- confirmation gates, `--dry-run`, `--yes`, non-interactive mode, and CI environment detection;
- rollback guidance and recovery after a version commit, tag, push, forge release, or partial publication.

Never place tokens in command arguments, logs, generated files, or committed configuration. Use the provider's established environment variables or CI secret mechanism.

## Script design and checks

Match the repository runtime: TypeScript/Node, Bun, Deno, Python, Rust, shell, PowerShell, or another established choice. A portable script may be preferable when contributors use different operating systems.

Recommended phases are preflight, plan, validate/build, update, review/confirm, commit/tag, push, publish, and summary. Not every script needs every phase, but externally visible steps should be clear and failures should identify the phase.

Check relevant invariants:

- requested version is valid and greater than the current version;
- synchronized version files agree before and after the bump;
- target tag and hosted release do not already exist unless resume behavior permits them;
- changelog has meaningful content where required;
- exact generated files are staged, avoiding accidental `git add .`;
- validation completes before irreversible operations;
- dry-run performs no writes or network mutations;
- subprocess arguments are structured and errors propagate;
- missing tools, authentication, permissions, and secrets fail during preflight;
- rerunning after failure is either safe or produces actionable recovery instructions.
