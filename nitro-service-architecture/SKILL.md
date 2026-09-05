---
name: nitro-service-architecture
description: Design, build, or refactor a standalone Nitro HTTP service with typed configuration, startup validation, authentication boundaries, database composition, and portable deployment. Use for Nitro server architecture and API foundations; not for ordinary Nuxt page or component work.
---

# Nitro Service Architecture

Build a portable Nitro service with explicit startup and request boundaries.

## Map the service first

Inspect runtime presets, routes, middleware, plugins, configuration, persistence, auth integration, generated types, tests, and deployment files. Preserve Nitro's routing conventions and the repository's chosen validation/effect library.

Read [service-boundaries.md](references/service-boundaries.md) when adding configuration, authentication, persistence, email, storage, or deployment adapters.

## Structure the runtime

- Decode all required configuration during an early startup plugin. Keep secrets redacted in values, errors, and logs.
- Store the validated configuration behind a narrow accessor that fails clearly if startup initialization was skipped.
- Construct database clients after configuration exists. Export a composed database with schema/relations and enable verbose query logging only outside production.
- Put authentication in one adapter and protect the intended API namespace in middleware. Compare path segments or normalized prefixes so similarly named public routes do not bypass protection.
- Attach the verified session/user to typed event context for downstream handlers.
- Model operational failures with stable categories and preserve causes; translate them into HTTP responses at the boundary.
- Keep provider-specific deployment configuration outside domain behavior so the service remains portable.

Avoid reading environment variables throughout business code, creating database connections per request without need, or letting framework events leak into domain functions.

## Test boundaries

Test configuration defaults, missing/invalid secrets, startup order, auth public/private route classification, database schema and relations, error translation, and representative routes. Run format, type-aware lint/typecheck, tests, and the deployment-target build.
