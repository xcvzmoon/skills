# NAPI-RS delivery matrix

## Target selection

Model each target as host runner, Rust target, architecture, libc, build command, test environment, artifact pattern, and platform package name. Common distinctions include macOS Intel/Apple Silicon, Windows MSVC, Linux glibc/musl, and Linux x64/arm64.

Cross-compilation can build an artifact but does not prove it loads. Use native runners where available and containers or architecture runners for Linux compatibility. Add Zig/cargo-zigbuild only to targets that require it.

## Artifact graph

The build matrix uploads raw `.node`/WASM artifacts. Downstream test jobs download exactly one target artifact and exercise the public JavaScript API across supported Node versions. The publish job downloads all artifacts, generates platform-package directories, verifies none are missing, and publishes them before the root selector package.

Do not use directory listings as the only verification; assert expected artifact names and load them.

## Package contract

Check that:

- the Rust crate name, NAPI binary name, root package, and platform-package names agree;
- `optionalDependencies` versions equal the root version;
- export conditions point to included files;
- browser imports fail helpfully or use an intentional fallback;
- the native API behaves the same for path and buffer inputs where both are supported;
- native external tools or libraries are documented and tested per platform.

## Release channels

Derive npm tags from valid SemVer prerelease data rather than commit-message substring matching when possible. Stable versions normally use `latest`; prereleases use an explicit channel such as `next`, `beta`, or `rc`. Keep publication idempotence and partial-failure recovery in the release design.
