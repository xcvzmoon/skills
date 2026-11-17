# PR and MR description template

Use the repository's template when one exists, with the required opening paragraph above its headings. Otherwise start with the minimal template below. Replace every placeholder with verified information and remove optional sections that do not help review.

## Minimal description

The first paragraph is the summary. Keep it to two or three complete sentences, with no heading before it. The two-sentence form below works for a feature or capability change:

```markdown
<Describe the problem or capability in a complete sentence.> <Explain the resulting behavior and why it is needed in a complete sentence.>

## Verification

- `<exact command>`: <observed result and relevant behavior covered>.
- Not verified: <remaining gap and whether it blocks merge, or state that no additional gaps were identified>.
```

For a fix, replace the opening paragraph with this form and include the real issue reference in the paragraph itself:

```text
This fixes <observable bug> reported in <verified issue reference or link>. <Explain the corrected behavior and why the correction matters in a complete sentence.>
```

For a partial fix, say which part is corrected and what remains, using a third sentence if needed. If the user confirms there is no tracked issue, say that explicitly instead of leaving an issue placeholder.

## Issue linkage

If appropriate, add one of the following lines after the opening paragraph. Use a separate line for each issue. Keep the summary's issue reference even when adding these lines.

```text
Closes <verified issue reference>
```

Use `Closes` only for an intended complete resolution with appropriate host closing behavior. For related work or a partial fix, use:

```text
Refs <verified issue reference>
```

## Optional sections

Insert only the sections the reviewer needs. Keep the repository template's required headings and sections. Do not copy these instructions or empty tables into the published description.

### Stacked work

```markdown
Stacked on <parent PR/MR link or branch>. This request contains <scope of this layer>; inherited changes belong to the parent.
```

### Change map

```markdown
## Change map

| Module or boundary | Before              | After          | Reason           |
| ------------------ | ------------------- | -------------- | ---------------- |
| <responsibility>   | <previous behavior> | <new behavior> | <why it changed> |
```

### Architecture and behavior

```markdown
## Architecture and behavior

<Explain the changed flow, state, or ownership using real modules and symbols. Add a Mermaid diagram only when it improves understanding.>
```

For a fix involving flow or state, add comparable `### Before` and `### After` subsections and identify the corrected step. Generate diagrams from the actual diff, then render and inspect every Mermaid block according to [Mermaid validation](evidence.md#mermaid-validation). This template deliberately contains no diagram to copy without validation.

### Boundaries and risks

```markdown
## Boundaries and risks

| Required behavior | Failure case       | Protection                       | Evidence or gap                               |
| ----------------- | ------------------ | -------------------------------- | --------------------------------------------- |
| <invariant>       | <relevant failure> | <actual guard or ownership rule> | <check, observation, or unverified condition> |
```

### Visual changes

Ask for the user's device and theme choices first, following [UI evidence preferences](evidence.md#ui-evidence-preferences). Use one labeled before/after pair for each affected scenario, selected device size, and selected supported theme. Replace local paths with uploaded links or forge-provided Markdown.

```markdown
## Visual changes

### <Scenario>, <mobile/tablet/desktop web>, <width × height>, <light/dark>

| Before                                    | After                                   |
| ----------------------------------------- | --------------------------------------- |
| ![<Scenario> before](uploaded-before-url) | ![<Scenario> after](uploaded-after-url) |

Captured from `<base SHA>` and `<head SHA>` using `<scenario or command>`.
```

Use `Absent` or `Removed` in the appropriate cell for new or deleted states. If the user skips evidence, omit this optional section unless the repository template requires documenting that choice.

### Rollout and follow-up

```markdown
## Rollout and follow-up

- <Required migration, deployment order, flag, or operational step>.
- <Remaining work and whether it blocks merge>.
```

### Additional verification details

Expand the minimal verification section when before/after behavior or remote checks need separate entries:

```markdown
## Verification

- `<exact command>`: <observed result>.
- Before (`<base SHA>`): <observed behavior for the reported trigger>.
- After (`<head SHA>`): <observed behavior for the same trigger>.
- Mermaid: <renderer version and result for every included diagram; host rendering result or explicit limitation>.
- CI/pipeline: <current status and link, or not run>.
- Not verified: <gap and whether it blocks merge>.
```

Remove inapplicable entries. Keep failed or unavailable checks explicit; never convert a planned command into a passing result.
