---
name: nuxt-tauri-app
description: Create, integrate, or repair a Tauri desktop application whose frontend is Nuxt. Use for coordinated development startup, static frontend output, Rust and TypeScript command orchestration, Tauri capabilities, or cross-manifest versioning; not for standalone Nuxt sites or standalone Rust applications.
---

# Nuxt Tauri App

Treat Nuxt and Tauri as two build systems with one application contract.

## Establish the contract

Inspect Nuxt rendering/output settings, Tauri `build` configuration, capabilities and plugins, Rust manifests, package scripts, lockfiles, and CI. Determine whether development uses a URL and production bundles static assets. Do not make a desktop shell depend on a production SSR server unless the user explicitly wants a sidecar/server architecture.

Read [integration.md](references/integration.md) for development-port, build, capability, and version synchronization work.

## Implement coherently

- Give Tauri one `beforeDevCommand`, `devUrl`, `beforeBuildCommand`, and `frontendDist` contract that agrees with Nuxt.
- For dynamic development ports, probe a bounded range, pass the chosen port to both Nuxt and Tauri, inherit child I/O, forward termination signals, and propagate the child exit status.
- Separate frontend and Rust tasks so formatting, linting, testing, building, and cleanup can run independently and through aggregate commands.
- Use explicit Tauri plugins and least-privilege capabilities. Installing a JavaScript package alone is not enough; wire the Rust plugin and permissions too.
- Keep platform-specific behavior behind the Tauri boundary and return serializable, typed results to the frontend.
- Keep application versions synchronized across the JavaScript manifest, `tauri.conf.json`, Cargo package metadata, and the application entry in `Cargo.lock`.

Avoid shell-joined user values and broad process killing. Prefer structured child-process arguments and kill only children started by the orchestrator.

## Verify both halves

Run Nuxt type checking/tests and Rust formatting, Clippy with warnings denied, and Cargo tests. Verify a development launch and a production build separately. For version automation, test against fixtures or a temporary repository without tagging or publishing.
