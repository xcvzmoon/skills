# Nuxt and Tauri integration

## Development

Choose a preferred loopback port, validate any environment override as an integer, and probe a finite consecutive range. Generate a temporary Tauri config override containing both the selected `devUrl` and the matching Nuxt command. Listen on the same host family Nuxt uses; otherwise an apparently free port may still collide.

Forward `SIGINT` and `SIGTERM`, handle spawn errors, and resolve null exit codes deliberately. Do not leave an orphaned frontend or Tauri process.

## Production

For a serverless desktop frontend, configure Nuxt for static output and point `frontendDist` at that output. Ensure the build command produces it before Cargo packaging begins. For a sidecar design, document process lifecycle, ports, update behavior, and packaging explicitly.

## Capabilities

For each plugin, check four layers: JavaScript dependency, Rust dependency, Rust initialization, and capability permission. Scope filesystem, shell, HTTP, dialog, and store permissions to the smallest required surface.

## Version synchronization

Select one authoritative version. Update structured manifests with a parser when practical. If editing TOML text, restrict replacements to the intended `[package]` block and identify the application package before updating `Cargo.lock`. Fail if a target is absent or already inconsistent; never replace every `version` field globally.

Stage only the synchronized files plus the changelog. Release generation belongs to the release-script skill when the user asks for a release script.
