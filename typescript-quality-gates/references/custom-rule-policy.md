# Custom lint rule policy

## Admission test

Create a custom rule only when all are true:

1. The pattern has caused repeated defects, review churn, or misleading generated code.
2. A compiler option, built-in lint rule, type definition, or API redesign cannot prevent it more directly.
3. The unsafe form has an AST shape that can be recognized with acceptable false positives.
4. The diagnostic can explain a concrete safer alternative.

Naming-based bans are fragile. Prefer semantic/type-aware detection; if a name is the only signal, scope the rule narrowly and document that limitation.

## Severity

Use errors for mechanically unsafe constructs with low false-positive risk. Use warnings for heuristics, architectural preferences, and rules being introduced to an existing codebase. Require a nearby safety comment for exceptional assertions rather than forbidding all assertions when interop genuinely needs them.

## Testing

Cover nested syntax, aliases, generics, optional values, unions, framework-generated patterns, tests, declaration files, and legitimate escape hatches. An autofix must preserve semantics and formatting; otherwise provide a diagnostic without a fix.

## Sustainable configuration

Keep the local plugin small, export rules from one index, exclude the plugin's own implementation only when self-linting creates recursion or incompatible parsing, and ensure CI installs whatever JavaScript-plugin bridge the linter requires.
