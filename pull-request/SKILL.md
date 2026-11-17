---
name: pull-request
description: Write, prepare, create, or update GitHub pull requests and GitLab merge requests with Conventional Commits titles, issue-linked summaries, and evidence matched to the changes. Use for PR or MR descriptions and publication requests; a writing-only request does not authorize publication.
---

# Pull request

Write a description that lets a reviewer understand the problem, resulting behavior, and evidence without reading the conversation. Use the host's terminology: pull request (PR) on GitHub, merge request (MR) on GitLab. Explicit user instructions and applicable repository rules take precedence.

## Model preference

Prefer GPT-6.1 Sol (`gpt-6.1-sol`) with low reasoning effort for this skill when the runtime supports selecting that model and effort. Use the runtime's supported model-selection or delegation controls; pass these skill instructions and the relevant task context if delegating. A delegated worker should perform the task directly rather than delegate again.

If the model, low reasoning effort, or a supported way to select them is unavailable, use the currently selected model and its current settings. Do not block the task, change persistent model settings, or claim a model switch that did not occur.

## Scope and repository context

Distinguish drafting from publication. Writing a title or description does not authorize creating or updating a remote request. Commit or push only when explicitly authorized by the user's instructions; do not treat skill invocation alone as authorization. Do not merge, enable auto-merge, or rewrite history as part of preparing a request.

Before drafting:

1. Read repository instructions, contribution guidance, and the applicable request template. Inspect Git status, source branch, remotes, target project, and target branch. Detect the actual forge, including self-managed GitLab and fork destinations, rather than assuming `origin` is the destination.
2. Check for an existing PR or MR for the same source and target to avoid duplicates. Resolve the intended target from the user's request and repository workflow. For stacked work, identify the parent branch or request and separate inherited changes.
3. Record the target SHA, head SHA, merge base, and intended comparison. Read the full `base...head` diff and commits, including generated files, lockfiles, migrations, and snapshots. Uncommitted changes are not part of the published range; identify them separately.
4. Trace behavior claims to the actual callers, state owners, storage, and external services. Read referenced issues and verify that their reported problem matches the diff. Use supplied links, branch and commit references, and connected issue search before asking for a missing reference.
5. Run required repository checks and focused validation for the changed behavior. Record exact commands, results, relevant runtime evidence, and remaining gaps. Read [evidence.md](references/evidence.md) to choose evidence without adding unnecessary sections.

Always ask whether the user wants UI evidence before preparing captures or publishing the request, unless they already answered for this request. Ask which device sizes to cover (mobile, tablet, desktop web, or an explicit combination) and whether to include light mode, dark mode, or both when supported. Wait for their choices while continuing independent diff review and validation. Follow the question and capture rules in [evidence.md](references/evidence.md#ui-evidence-preferences).

Review commit scope without automatically reshaping history. When commits are authorized, use the available `commit` skill or follow the same rules: smallest coherent purpose, explicit paths or hunks, complete staged review, valid intermediate commits, all task-related changes, and no unrelated changes or co-author trailers. Keep required imports, callers, and tests together.

## Title and opening summary

Use a [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) title unless the repository requires another format. Prefer a short imperative description with the repository's established scope, for example `fix(auth): reject expired reset tokens`. Classify from actual behavior; use `fix` for a bug correction even if the implementation is a refactor.

Every description must start with one paragraph of **two or three complete sentences**, before any heading, list, table, diagram, or template comment. Explain the problem or capability, resulting behavior, and why the change is needed. Count sentences before creating or updating the request.

For every fix, including a feature that also fixes a bug:

- Explicitly say in the opening paragraph that the change fixes the bug and describe its observable symptom.
- Include the verified issue reference in that same paragraph. A later linked-issues section does not replace this requirement. Reference each issue whose fix is claimed, using a full link for cross-project or external issues where a bare number is ambiguous.
- If no issue can be established, ask for the reference before publishing. Continue preparing the diff review, evidence, and draft in the meantime. Do not invent an issue, silently omit it, or create one without authorization. If the user confirms there is no tracked issue, state that in the summary instead.
- A partial fix must identify the remaining problem and must not claim to close the issue.

Example opening for a complete fix:

```text
This fixes the expired password reset links accepted in #123. The reset handler now checks token expiry before changing the password, preventing an expired link from modifying account credentials.
```

Use a plain issue link in the summary when automatic closure is not intended. Add `Closes #123` separately only when the change fully resolves the issue and the host's closing behavior is appropriate. Use `Refs #123` for related or partially addressed issues. On GitLab, `!123` refers to an MR, not an issue.

## Description body

Read [description-template.md](references/description-template.md) when drafting. Use its minimal template when the repository has none, and select optional sections according to the change and the user's evidence choices. Replace all placeholders before publication.

Place the required opening paragraph above the repository template, then preserve and fill its required sections. If it has a `Summary` heading, use that section for additional necessary context without duplicating the opening. Do not let an auto-filled template or CLI-generated description replace the paragraph.

For a small change with no template, the opening paragraph, issue linkage when applicable, and `## Verification` are sufficient. Under verification, include exact commands and outcomes, the behavior they exercised, and anything not verified. Distinguish local checks from remote CI or pipeline status. Running checks and passing checks are different states.

Add sections only where they help review:

- A change map for changed responsibilities across modules, explaining previous behavior, new behavior, and the reason.
- Architecture or behavior diagrams for changes that depend on ordering, state transitions, or ownership. Keep fix diagrams comparable before and after. Render and inspect every generated Mermaid block before publication, following [Mermaid validation](references/evidence.md#mermaid-validation).
- Boundaries and risks for relevant invariants, failure modes, protections, and evidence gaps.
- Visual changes with attached before/after captures for the UI evidence scope chosen by the user.
- Rollout and follow-up for required migrations, deployment order, flags, or remaining work. State whether a gap blocks merge.

Mention a stack's parent and describe only this layer. Scale the detail to the review: a local correction does not need an architecture essay. Describe concrete behavior rather than a file list, task narration, or generic quality claims.

Apply `/unslop` when available. Use plain prose, omit model attribution and agent-authorship disclosures, and keep secrets and personal records out of descriptions and evidence. Support claims of correctness, compatibility, or performance with observations; label assumptions and unverified behavior explicitly. Follow the repository's private disclosure process for sensitive security details.

## Publication and verification

Read [forge-publication.md](references/forge-publication.md) when creating or updating a request or uploading evidence.

Before publication, verify the opening sentence count, fix and issue wording, template requirements, title, source and target projects and branches, inspected head SHA, evidence links, Mermaid render results, UI evidence choices, and check status. Re-render every edited Mermaid block using the final description text. If the head or target changed during preparation, inspect the new comparison and update affected evidence. Use a draft when the work is incomplete or required checks remain pending; do not describe a draft as ready to merge.

Assign the request to the requesting user and apply appropriate existing project labels. Resolve their forge identity from available account context; do not assume a bot or service account is the user. Do not invent labels or add reviewers without the user's instruction or repository policy. Report metadata that permissions prevented setting.

Read back the created or updated request. Verify title, opening paragraph, issue references, base/target, head/source, template content, attachment rendering, draft status, assignee, labels, and CI or pipeline state. If a create operation times out, check for a created request before retrying. Return the URL, published head SHA, validation results, and outstanding gaps.

Creating a request does not start an indefinite review-monitoring task. When asked to address review, inspect comments and check results, fix confirmed issues, validate, publish authorized corrections, and reply with evidence. Resolve only discussions actually addressed, subject to the repository's policy. Report disagreements and remaining work honestly.

## Sources

Adapted from [create-pr-with-evidence](https://github.com/luoling8192/create-pr-with-evidence-skill) and [antfu-create-pr](https://github.com/antfu/skills/tree/main/skills/antfu-create-pr), with GitLab publication support and the opening-summary rules above.
