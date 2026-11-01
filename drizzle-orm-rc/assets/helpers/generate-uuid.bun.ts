import type { PgUUIDBuilder, SetHasRuntimeDefault, SetIsPrimaryKey } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';

/**
 * Builds a UUID primary key with Bun's native UUIDv7 default.
 *
 * Use in Bun projects where Bun.randomUUIDv7() is available.
 * The default is applied by Drizzle, not PostgreSQL; raw SQL inserts must supply an ID.
 *
 * @param [name] - SQL column name; omit it to use Drizzle's property-name inference.
 * @returns Primary-key column builder with a runtime UUIDv7 default.
 */
export function generateUuid(name?: string): SetHasRuntimeDefault<SetIsPrimaryKey<PgUUIDBuilder>> {
  return uuid(name)
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7());
}
