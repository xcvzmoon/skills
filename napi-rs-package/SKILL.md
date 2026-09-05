---
name: napi-rs-package
description: Create, package, test, or publish a cross-platform Node.js native addon built with NAPI-RS and Rust. Use for target matrices, generated bindings, dual module entrypoints, platform packages, artifact assembly, or native publication CI; not for a pure Rust crate or pure JavaScript package.
---

# NAPI-RS Package

Treat the JavaScript facade, Rust library, native binaries, platform packages, and CI artifact graph as one release unit.

## Establish compatibility

Inspect `Cargo.toml`, NAPI-RS metadata, Node exports, supported targets, minimum Node versions, native system dependencies, generated files, tests, and workflows. Ask which operating systems, architectures, C libraries, module formats, and Node versions are required when evidence is incomplete.

Read [delivery-matrix.md](references/delivery-matrix.md) before changing targets, exports, CI builds, or publication.

## Build the package

- Keep Rust functions narrow at the NAPI boundary and convert inputs/outputs explicitly into Node-compatible values.
- Map Rust failures to useful JavaScript errors without panics crossing the boundary.
- Generate and ship type declarations. Align `main`, `module`/import, require, browser fallback, `types`, `exports`, and `files` with actual outputs.
- If both CommonJS and ESM are promised, build and test both rather than pointing both conditions at an unverified wrapper.
- List every supported target in package metadata and create one optional platform package per produced native artifact.
- Keep debug builds local and publish optimized release artifacts.
- Validate JavaScript formatting/types/tests and Rust formatting, Clippy, and tests.

Do not claim a target because it appears in metadata; it is supported only when CI builds and tests it in a representative environment.

## Publish safely

Build targets independently, upload artifacts with target-specific names, assemble generated platform packages in one job, verify registry authentication early, then publish platform packages before the root package. Use provenance when supported and choose stable versus prerelease distribution tags from explicit version semantics.

Creating publication automation does not authorize publishing. Validate workflow syntax and artifact assembly without releasing unless the user explicitly requests publication.
