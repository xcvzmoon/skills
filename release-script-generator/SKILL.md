---
name: release-script-generator
description: Create or replace a repository-specific release script when the user explicitly asks to create, generate, scaffold, or add release automation. Do not activate merely to publish a release, write release notes, bump a version, or troubleshoot an existing release pipeline unless creating a script is also requested.
---

# Release Script Generator

Create release automation that matches the target repository instead of imposing a single release convention.

## Start with repository evidence

Inspect the repository before asking questions. Identify:

- package manager, runtime, language, workspace layout, and available validation commands;
- current version sources and every file that must stay synchronized;
- remotes and hosting providers, existing tags, release conventions, changelog tooling, CI workflows, and publishing configuration;
- existing release-related scripts or project instructions that must be preserved.

Do not assume GitHub from tool availability or infer release policy solely from a dependency. Read [release-decisions.md](references/release-decisions.md) when selecting questions or supporting a scenario beyond a simple single-package stable release.

## Resolve the policy interactively

Ask only questions whose answers are consequential and cannot be determined reliably from repository evidence. Present detected conventions as recommended defaults. Prefer one to three compact questions at a time, combining related choices when helpful.

At minimum, resolve these decisions when applicable:

1. Release destination: GitHub, GitLab, another forge, package registry only, local tags only, or more than one destination.
2. Version policy: stable SemVer, prerelease channels such as `alpha`, `beta`, or `rc`, another scheme, and the tag prefix or format.
3. Scope: one package, fixed-version monorepo, independently versioned packages, or application artifacts.
4. Responsibilities: version synchronization, changelog generation, validation/build, commit and tag creation, pushing, hosted release creation, artifact upload, and registry publication.
5. Execution boundary: interactive local script, non-interactive CI script, or both; dry-run behavior; and which irreversible steps require confirmation.

Do not dump the entire decision catalog on the user. Skip irrelevant questions and stop asking once the contract is unambiguous. Summarize the agreed behavior before implementation when several destructive or externally visible steps are included.

## Generate the script

Follow the repository's language and command conventions. Prefer argument arrays and process APIs over shell interpolation. Validate CLI inputs and parsed version files. Fail immediately on command errors and print enough context to locate the failed stage without exposing credentials.

Keep discovery and mutation separate. Perform preflight checks before changing files: clean working tree policy, expected branch, required commands, authentication when relevant, version consistency, tag nonexistence, and required environment variables.

When compatible with the repository, favor these established conventions:

- accept `patch`, `minor`, or `major` explicitly rather than guessing;
- use strict SemVer parsing and preserve deliberate `0.x` major-bump behavior;
- generate the changelog and bump versions before staging an exact file list;
- use `chore(release): <tag>` for the release commit and an annotated tag;
- use a `v` tag prefix only when selected or already established;
- push with tags only when pushing is part of the requested contract;
- synchronize non-JavaScript manifests and lockfiles for multi-runtime applications.

Do not silently install a release framework or replace existing release infrastructure. Add dependencies only when justified by the selected design and use the repository's package manager.

## Safety and verification

Creating a script does not authorize running a real release. Validate parsing, computation, help output, and dry-run behavior without committing, tagging, pushing, publishing, uploading, or creating a hosted release. Use an isolated temporary Git repository if end-to-end mutation testing is needed.

Run the repository's relevant formatter, linter, type checker, and tests. Report the generated files, supported modes, chosen defaults, validation performed, and any external credentials or CI secrets the user must configure.
