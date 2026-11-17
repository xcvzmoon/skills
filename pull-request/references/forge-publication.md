# Forge publication

Prefer a connected forge tool when it supports the task. Otherwise use the matching authenticated CLI or documented API. Check installed CLI help before relying on flags, especially attachment and description-file options. Use the configured host for self-managed GitLab.

Write the exact description to a temporary UTF-8 file, with real newlines. Pass it as a structured tool field or through a supported file option. Avoid interpolating Markdown into shell code. Do not use auto-fill when it would replace the reviewed description or implicitly push without authorization.

## GitHub

Inspect `.github/PULL_REQUEST_TEMPLATE*`, `.github/PULL_REQUEST_TEMPLATE/`, and other repository-configured template locations. Select the appropriate template without changing it as part of the PR workflow.

With `gh`, specify the destination repository, base, and head explicitly when ambiguity exists. Use `gh pr create --body-file <file>` or `gh pr edit --body-file <file>` with the reviewed title and description. Set draft status, assignee, and existing labels through supported fields or flags.

For media, use the repository's upload tool or an attachment capability supported by the installed client. Confirm uploads resolve to the intended images in the request. Do not copy an undocumented upload script or assume a specific `gh` version supports `--attach`.

## GitLab

Read the selected `.gitlab/merge_request_templates/*.md` template and any configured project or group default. Use MR terminology and the actual source and target projects, which may differ for forks. See [GitLab description templates](https://docs.gitlab.com/user/project/description_templates/).

Use a GitLab connector, `glab`, or the documented API. The current [glab mr create documentation](https://docs.gitlab.com/cli/mr/create/) supports `--description-file`, `--source-branch`, `--target-branch`, `--head`, `--assignee`, and `--label`; verify these against the installed client. For updates, check `glab mr update --help` rather than assuming it accepts the same file flags. If file input is unavailable, pass the description through a structured API request.

Avoid `--fill`: it derives content from commits and can push. Do not enable `--auto-merge`, change squash policy, or change source-branch deletion settings as a side effect of creating the MR.

For screenshots, use a supported attachment tool or the [project Markdown uploads API](https://docs.gitlab.com/api/project_markdown_uploads/): upload to the target project with `POST /projects/:id/uploads` and embed the returned `markdown` or upload URL. Check available CLI capabilities instead of assuming GitHub attachment flags work on GitLab. Preserve host and project context when using relative upload links, especially for forks.

Use `#123` for issues in the target project, `group/project#123` or a full URL for other projects, and `!123` for merge requests. Check [GitLab issue closing rules](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically) and project configuration before using closing keywords. A reference is not a promise that merging into any target branch will close the issue.

## Read back

Verify the stored description through the host after creation or update. Inspect rendered media, tables, diagrams, and links through supported host tools when available; do not claim visual rendering was checked from raw Markdown alone. Every included Mermaid block must already have passed local rendering and inspection as described in [Mermaid validation](evidence.md#mermaid-validation). Check host rendering for syntax errors, unsupported features, and missing diagrams, and correct failures before reporting completion. If host rendering cannot be inspected, state that limitation explicitly. Report upload or assignment failures without recreating an already-created request.
