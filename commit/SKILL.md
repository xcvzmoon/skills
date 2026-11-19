---
name: commit
description: Write commit messages and create focused Git commits when the user asks to commit changes, split changes into commits, or draft a commit message. Follow xcvzmoon's commit scope and staging rules; drafting a message does not authorize committing or pushing.
---

# Commit

Follow the commit rules below. Explicit user instructions and applicable repository instructions take precedence. Message style must never determine which changes are bundled together.

## Model preference

Prefer GPT-6.1 Sol (`gpt-6.1-sol`) with low reasoning effort for this skill when the runtime supports selecting that model and effort. Use the runtime's supported model-selection or delegation controls; pass these skill instructions and the relevant task context if delegating. A delegated worker should perform the task directly rather than delegate again.

If the model, low reasoning effort, or a supported way to select them is unavailable, use the currently selected model and its current settings. Do not block the task, change persistent model settings, or claim a model switch that did not occur.

## Authorization and scope

- Commit or push only when explicitly asked. A request to write a message authorizes a draft only; a request to commit does not authorize pushing.
- Use the main worktree unless the user explicitly asks for a new worktree. Do not create a branch or worktree just to commit.
- Include all task-related changes, including relevant changes already present before this session. Leave unrelated changes alone, regardless of who authored them.
- Treat “commit all” as authorization to include the full working-tree diff. Apply the same split rules unless the user explicitly asks for a single commit.
- Never add co-author or agent-attribution trailers.

## Inspect and split

Read the repository instructions and inspect `git status --short`, the staged diff, the unstaged diff, and task-related untracked files. Inspect actual file contents where the diff alone is insufficient. Existing staged changes are not automatically part of the requested task.

Before staging, assign each independently reviewable change to a commit. For a mixed diff, tell the user the proposed commit sequence and proceed. Plan each commit around one outcome:

- Give each commit one specific purpose. Broad labels such as “refactor persistence” or “update docs” do not justify bundling independent changes.
- Separate independent modules and concerns, including SQL table renames, declaration renames, dependency cleanup, lint rules, tests, and documentation.
- Keep imports, types, call sites, and tests together when they are required for a change to work. Do not split a required companion change merely because it lives in another file or category.
- Stage independent changes within the same file with their corresponding commits. Split shared manifest, workspace, and lockfile updates by the change that needs them. Regenerate the lockfile against each intermediate workspace layout when needed.
- Order dependent commits so each intermediate commit remains valid, with prerequisites before the changes that need them.
- Do not combine changes to reduce the number of commits. If describing a commit's purpose requires multiple independent actions, split it further.

For example, a SQL table rename and its required query updates belong together. An independent declaration rename, unused dependency removal, or documentation correction belongs in its own commit even if all appeared during the same task. In a workspace rewrite, commit the legacy removal and each new app scaffold separately when they can stand alone. Include the matching workspace and dependency changes in each commit.

## Write the message

Follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification), unless the repository requires another message convention:

```text
type(scope): describe one specific change

Explain what changed and why it was needed.
```

- Choose the type from the actual change, such as `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, `perf`, `style`, or `chore`. Use a scope when it identifies the affected module clearly; omit it when it adds no useful information.
- Write the entire subject in lowercase, including the type, optional scope, and description after the colon, such as `chore(example): lowercase blah blah blah`.
- Write a concise, imperative subject describing the concrete result. Avoid vague subjects such as “update files” or “fix issues.”
- Include a short body explaining what and why unless the user or repository requires another format. Describe behavior and rationale without repeating a file list or inventing motivations.
- Mark breaking changes according to the repository's convention when the diff establishes a breaking contract change. Do not infer one merely from an internal rename.
- Derive claims from the diff and observed validation. Do not claim tests passed unless they ran successfully.
- Do not introduce a special `merge` type merely because changes came from another branch or worktree. Describe the actual change and follow the repository's merge policy.

Example:

```text
fix(auth): reject expired password reset tokens

Check token expiry before updating the password so an expired reset
link cannot change account credentials.
```

When asked only for a message, inspect the relevant changes and return the draft without staging or committing. If the diff contains independent changes, provide separate proposed messages rather than masking them with one broad subject.

## Stage and commit

For each authorized commit:

1. Stage explicit paths or hunks for its single purpose. Avoid blanket staging such as `git add .` or `git add -A`.
2. Review the complete staged diff before committing, including any pre-existing staged content. Ask whether a reviewer could accept one part and defer another while keeping the project valid. If yes, split the staged changes before committing. If unrelated staged work is present, preserve its content and staging state; isolate the intended commit or ask a focused question if ownership cannot be resolved safely.
3. Run required repository checks and validation appropriate to the change. Check staged whitespace with `git diff --cached --check`. Ensure validation or formatting has not introduced unrelated changes into the commit.
4. Commit with the reviewed message. For multiline messages, use a message file or separately quoted subject and body arguments that preserve actual newlines and avoid shell interpolation.
5. Inspect the resulting commit and remaining Git status before proceeding to the next commit.

Fix relevant hook or validation failures and review the staged diff again after any fix. Do not bypass hooks with `--no-verify`, amend existing commits, or rewrite history unless explicitly authorized. If there are no task-related changes, report that instead of creating an empty commit.

Report the created commit hashes and subjects, validation results, and any task-related changes left uncommitted. For a message-only request, return the proposed message or messages.
