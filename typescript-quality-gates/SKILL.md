---
name: typescript-quality-gates
description: Design or strengthen repository-specific TypeScript quality gates using formatting, type-aware Oxlint, type checking, tests, staged checks, and focused custom lint rules. Use when establishing quality policy or preventing recurring low-evidence code patterns; not for fixing one isolated lint error.
---

# TypeScript Quality Gates

Turn demonstrated failure patterns into fast, layered feedback without making the ruleset ceremonial.

## Audit the current signal

Inspect project instructions, compiler settings, formatter/linter/test configuration, CI, hooks, generated code, framework conventions, and recent recurring defects. Separate correctness rules from stylistic preferences and migration warnings.

Read [custom-rule-policy.md](references/custom-rule-policy.md) before creating a local lint plugin or banning a broad syntax pattern.

When installing or synchronizing xcvzmoon's Oxfmt, Oxlint, and `anti-slop` rule set, use the `oxc-project-config` skill. For a TypeScript repository without Vite+, also use the `typescript-git-hooks` skill.

## Build layered gates

- Make formatting deterministic, including imports and framework templates, while excluding vendored/generated agent references where rewriting would be harmful.
- Enable type-aware linting and type checking together when the repository can support their cost.
- Set unsound async behavior, invalid imports, debugger use, and framework lifecycle violations to errors.
- Introduce maintainability preferences as warnings first when existing code has substantial debt.
- Give ignored arguments and variables one consistent naming convention.
- Run focused checks on staged files, full checks in CI, and tests/builds as separate observable stages.
- Use the project toolchain's native commands instead of duplicating direct binary invocations.

Avoid disabling rules globally to accommodate generated files, tests, or one framework directory; prefer narrow overrides with a reason.

## Encode only proven local hazards

A custom rule must correspond to a recurring pattern that built-in rules and stronger APIs cannot express well. Examples include assertion laundering, widening known values to `unknown`, unsafe dictionary aliases, reflective access replacing direct typed access, or module mocking that undermines integration tests.

Add valid and invalid rule tests, autofix tests when fixes are safe, and false-positive fixtures from real code. Roll out new rules against the whole repository before making them errors.

## Verify

Run formatter check, type-aware lint/typecheck, unit tests, and build tasks. Report baseline violations separately from violations introduced by the change. A gate is complete only when local commands and CI invoke the same effective policy.
