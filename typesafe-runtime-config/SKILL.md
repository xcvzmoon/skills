---
name: typesafe-runtime-config
description: Design or implement a type-safe runtime configuration layer that maps nested defaults to environment variables, validates/coerces values, supports required and renamed keys, and exposes a stable inferred type. Use when configuration behavior itself is being built or refactored; not merely to add one environment variable to an existing system.
---

# Typesafe Runtime Config

Make runtime configuration a single startup operation with a typed read API.

## Define the contract

Before implementation, determine supported leaf types, nesting, environment-key rules, prefixes, required-value semantics, explicit key overrides, runtime sources, and whether generated declarations are needed. Preserve the host project's established schema library if one already exists.

Use a nested defaults object as both runtime fallback data and the inference source. Widen literal leaves (`false` to `boolean`, for example) while preserving object keys and array element families. Represent metadata such as required/key override with an internal marker that cannot collide with user objects.

## Resolve predictably

- Derive environment names from the full object path using screaming snake case, with an optional normalized prefix.
- Prefer an explicitly supplied source for tests, then detect server and bundler sources deliberately. Do not merge sources invisibly.
- Accept booleans only in documented forms; reject ambiguous values.
- Parse numeric values and reject `NaN`. Decide explicitly whether infinities and empty strings are legal.
- Parse arrays from JSON or a documented delimiter fallback. Empty default arrays cannot reveal an element type, so require a schema hint or document the chosen default family.
- Report the config path and environment key on missing or invalid values, but avoid echoing secret contents.
- Resolve once during startup; reads before initialization must fail clearly. Provide reset/reload only for tests or explicit hot-reload use.

If emitting a declaration file, generate deterministic content, quote invalid property identifiers, write only when content changes, and lazy-load filesystem modules so browser/edge imports remain safe.

## Verify

Test nested key derivation, prefixes, overrides, required leaves, every coercion, invalid inputs, arrays, literal widening, initialization order, injected sources, generated declarations, unusual property names, and write-if-changed behavior. Include compile-time type tests in addition to runtime tests.
