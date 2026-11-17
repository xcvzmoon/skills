# Evidence

Choose evidence for the behavior affected by the diff. Keep commands and artifacts reproducible, and name important scenarios that remain unverified.

## Match proof to the change

| Change                   | Useful evidence                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Bug fix                  | The reported trigger on the base revision and the same input on the proposed revision, plus a focused regression check where appropriate |
| Feature                  | A working main path and relevant failure or permission paths                                                                             |
| Refactor                 | Checks exercising the behavior that should remain unchanged                                                                              |
| Performance              | Comparable measurements with the same workload, environment, and method on both revisions                                                |
| CLI or API               | Actual sanitized output or responses for affected inputs and failure cases                                                               |
| Documentation or tooling | Applicable build, configuration, link, or example checks                                                                                 |
| UI                       | Inspected captures of the affected states on both revisions                                                                              |

Separate reproduction evidence from regression coverage. If the original failure could not be reproduced, say so. A passing suite alone does not establish that the reported bug was reproduced or that every changed boundary was tested.

For changes involving concurrency, retries, authorization, persistence, or cleanup, connect meaningful invariants to their protections and evidence. A short table can expose gaps:

| Required behavior                   | Failure case               | Protection               | Evidence or gap                                         |
| ----------------------------------- | -------------------------- | ------------------------ | ------------------------------------------------------- |
| A retry creates no duplicate record | The first response is lost | Existing idempotency key | Name the observed check, or state that it is unverified |

Use diagrams when the reader needs to understand control flow or state. Tie participants and arrows to real code. For a bug involving ordering or state, compare the faulty and corrected paths at the same level and explain the changed step. Do not imply a diagram proves runtime behavior.

## Mermaid validation

Validate every generated Mermaid block, including diagrams in message-only drafts and later description edits. A plausible-looking code block or successful Markdown check is insufficient.

1. Extract each block from the exact final description and render it with an available Mermaid renderer, such as repository tooling or Mermaid CLI (`mmdc`). Prefer the target forge's supported Mermaid version and features; record the renderer version. Do not send private source to a public editor or rendering service.
2. Require successful rendering with no syntax or unsupported-feature errors. Parsing alone does not prove that rendering works. Inspect the resulting SVG or image for missing labels, clipped content, unreadable layout, and incorrect arrows or participants.
3. Fix failures and render the corrected block again. If any block changes afterward, repeat validation for that block. Keep temporary render artifacts outside tracked product files.
4. Before creating or updating the request, confirm every included block has passed. If rendering is unavailable, report the limitation and keep the diagram unpublished, or replace the optional diagram with accurate prose. Do not publish unverified or known-broken Mermaid, even in a draft PR or MR.
5. After publication, inspect the target host's rendered diagrams when supported tools are available. Local success does not establish host compatibility. Correct host rendering failures under the existing description-update authorization, re-render locally, and verify the updated host result. If host rendering cannot be inspected, report that separately from the local validation result.

## UI evidence preferences

Always ask whether to add UI evidence before capturing or publishing, unless the user already supplied these choices for the current request. For changes without a UI surface, make that clear and still offer the choice. Do not assume that evidence is wanted or that the same preference applies to future requests.

Ask the following together:

- Whether to include UI evidence, with an option to skip it.
- Which device sizes: mobile only, tablet only, desktop web only, or a named combination, including all three. Resolve an answer of "both" to the specific pair; there are three device categories. Treat these as web viewport sizes unless native app evidence was requested.
- If the affected UI supports both themes, whether to capture light only, dark only, or both. If only one theme is supported, explain that and use it; do not invent theme support.

For example: "Do you want before/after UI evidence? If yes, which sizes should it cover: mobile, tablet, desktop web, or which combination? Where supported, should it show light mode, dark mode, or both?"

Wait for the answer before capturing or publishing; continue reviewing the diff, running checks, and drafting unrelated sections. Record the chosen scope. If the user skips UI evidence, omit captures and note the choice where the template requires it. If repository policy requires evidence they declined, explain the conflict rather than silently publishing a request that violates the policy.

## UI captures

Identify the affected routes, dialogs, and component states, including relevant responsive sizes, themes, and locales. Shared styles can affect multiple consumers. Prefer existing screenshot scenarios or stories, and record coverage gaps instead of silently excluding affected states.

Within the selected scope, capture each affected scenario at every chosen device size and supported theme on both revisions. For example, mobile and desktop with both themes means four before/after pairs per scenario. Use repository viewport presets or sensible fixed dimensions and record them. Label device size, dimensions, and theme so reviewers can match each pair. Do not expand captures to unselected devices or themes without asking.

Capture the actual comparison base and proposed head with the same viewport, fixtures, theme, locale, and readiness conditions. Record the revision SHAs and capture command or scenario. Do not simulate the old behavior by manually reverting fragments of the fix.

Use existing deployments, revision artifacts, or repository capture tooling where available. Keep the main worktree intact. Do not create a temporary worktree unless the user explicitly authorized one; if base captures cannot be obtained within the authorized setup, report the missing evidence and continue preparing the rest.

Inspect every image. Blank, loading, error, or onboarding screens are valid only when that is the documented scenario. Label new states as absent before and deleted states as removed after. Retain a small manifest of scenario name, revision, viewport, and local capture path until upload and verification finish.

Keep captures temporary or ignored, and never commit request-only screenshots. Upload through the chosen forge and use the returned links or Markdown, not local filesystem paths, in the published description. Pair images under `## Visual changes`:

```markdown
| Before                                    | After                                   |
| ----------------------------------------- | --------------------------------------- |
| ![Reset form before](uploaded-before-url) | ![Reset form after](uploaded-after-url) |
| Reset form, narrow viewport               | Reset form, narrow viewport             |
```

If capture or upload fails, keep the paths and explain the gap. Do not publish a request as review-ready while required visual evidence is missing. Prepare a local draft, or publish a draft with the gap disclosed when that is within the user's request and repository policy.
