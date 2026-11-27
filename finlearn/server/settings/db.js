// Database connection. Values come from the validated env in settings/env.js.
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { fileURLToPath } from 'node:url'
import { env } from './env.js'

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
})

export const db = drizzle(pool)

// Schema changes: edit the Drizzle model (modules/<domain>/schema.js), then run
// `pnpm drizzle-kit generate` in server/ and commit the SQL it adds to drizzle/.
// migrateToLatest applies the pending migrations; it runs at boot and in the
// tests' beforeAll. Applied migrations are tracked per database (in the
// drizzle.__drizzle_migrations table), so re-running is a no-op.
const MIGRATIONS_FOLDER = fileURLToPath(new URL('../drizzle', import.meta.url))

export async function migrateToLatest() {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
}
