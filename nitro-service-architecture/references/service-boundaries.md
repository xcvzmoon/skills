# Nitro service boundaries

## Configuration

Group environment variables by subsystem and decode strings into URLs, integers, booleans, enums, and redacted secrets. Defaults are appropriate for safe modes such as development flags, not credentials. Startup should fail before accepting requests when required configuration is invalid.

Tests should inject a configuration source instead of mutating global environment state when the chosen library supports it.

## Authentication

Keep provider setup, catch-all provider routes, and protection middleware distinct. Define public API paths narrowly. A check such as `startsWith('/api/v1/auth')` also matches unintended paths; require an exact path or slash boundary.

Normalize unauthorized responses and augment Nitro event-context types for authenticated identity.

## Persistence

Keep schema, relations, client construction, migration configuration, and repository/domain queries separable. Do not expose redacted wrappers to database drivers; unwrap only at the adapter edge. Close clients in tests and long-running shutdown hooks where the runtime requires it.

## External adapters

Email templates, object storage, telemetry, and third-party APIs should receive validated configuration and return typed operational errors. Keep transport-specific errors from spreading through route and domain logic.

## Deployment

Verify the target runtime supports the selected database driver and Node APIs. Generate provider bindings/types when applicable. Treat local preview and production deployment as separate validation steps.
